import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CitaService } from '../../../services/citas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reporte-especialidad',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './reporte-especialidad.html',
  styleUrls: ['./reporte-especialidad.css']
})
export class ReporteEspecialidadComponent implements OnInit, OnDestroy {
  fechaInicio: string = '';
  fechaFin: string = '';
  mensaje: string = '';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Citas por Especialidad'
      }
    }
  };

  barChartType: ChartType = 'bar';

  private citaCanceladaSub: Subscription | null = null;

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    // Escuchar cuando se cancele una cita
    this.citaCanceladaSub = this.citaService.citaCancelada$.subscribe(especialidad => {
      if (this.fechaInicio && this.fechaFin) {
        this.generarReporte(); // Vuelve a generar el gráfico automáticamente
      }
    });
  }

  ngOnDestroy(): void {
    this.citaCanceladaSub?.unsubscribe();
  }

  generarReporte() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensaje = 'Por favor complete las fechas.';
      return;
    }

    if (this.fechaInicio > this.fechaFin) {
      this.mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
      return;
    }

    this.citaService.obtenerCitasPorEspecialidad(this.fechaInicio, this.fechaFin).subscribe(
      (datos: any[]) => {
        if (!datos.length) {
          this.mensaje = 'No hay citas registradas en este rango de fechas.';
          this.resetChart();
          return;
        }

        const labels = datos.map(d => d.especialidad);
        const valores = datos.map(d => d.total);

        this.barChartData = {
          labels: labels,
          datasets: [
            {
              data: valores,
              label: 'Citas por Especialidad',
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#29B6F6']
            }
          ]
        };

        this.mensaje = '';
      },
      error => {
        console.error(error);
        this.mensaje = 'Error al cargar el reporte.';
      }
    );
  }

  limpiar() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.resetChart();
    this.mensaje = '';
  }

  resetChart() {
    this.barChartData = {
      labels: [],
      datasets: []
    };
  }

  exportarPDF() {
    const grafico = document.getElementById('grafico-especialidades');
    if (!grafico) return;

    html2canvas(grafico).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(16);
      pdf.text('Reporte de Citas por Especialidad', 10, 15);

      pdf.setFontSize(12);
      pdf.text(`Desde: ${this.fechaInicio}`, 10, 25);
      pdf.text(`Hasta: ${this.fechaFin}`, 10, 32);

      pdf.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, imgHeightScaled(imgData, pdfWidth - 20));
      pdf.save(`reporte-especialidades-${this.fechaInicio}-al-${this.fechaFin}.pdf`);
    });

    function imgHeightScaled(imgData: string, width: number) {
      const image = new Image();
      image.src = imgData;
      return (image.height * width) / image.width;
    }
  }
}
