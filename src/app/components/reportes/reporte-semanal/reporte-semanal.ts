import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-semanal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reporte-semanal.html',
  styleUrls: ['./reporte-semanal.css']
})
export class ReporteSemanalComponent {
  inicio!: string;
  fin!: string;
  dni: string = '';
  reporte: any[] = [];
  mensajeSinResultados: string = '';
  mostrarUsuario: boolean = false;
  minFechaInicio: string = '2025-06-01';


  constructor(private http: HttpClient) {}

generarReporte() {
  this.mensajeSinResultados = '';

  // Validar campos vacíos
  if (!this.inicio || !this.fin) {
    this.mensajeSinResultados = '❌ Por favor completa las fechas de inicio y fin.';
    this.reporte = [];
    return;
  }

  // Validar rango de fechas
  if (new Date(this.inicio) > new Date(this.fin)) {
    this.mensajeSinResultados = '❌ La fecha de inicio no puede ser posterior a la fecha de fin.';
    this.reporte = [];
    return;
  }

  const params: any = {
    inicio: this.inicio,
    fin: this.fin
  };

  // Validar DNI si se ingresó
  if (this.dni.trim() !== '') {
    if (!/^\d{8}$/.test(this.dni.trim())) {
      this.mensajeSinResultados = '❌ El DNI debe contener exactamente 8 dígitos.';
      this.reporte = [];
      return;
    }
    params.dni = this.dni.trim();
  }

  this.http.get<any[]>('http://localhost:8080/api/citas/reporte-semanal', { params })
    .subscribe({
      next: data => {
        this.reporte = data;
        if (data.length === 0) {
          this.mensajeSinResultados = this.dni.trim()
            ? '❌ No se encontraron citas en ese rango de fechas para este DNI.'
            : '❌ No se encontraron citas en ese rango de fechas.';
        }
      },
      error: err => {
        this.reporte = [];
        this.mensajeSinResultados = '❌ Error al obtener el reporte.';
      }
    });
}


  descargarPDF() {
    const doc = new jsPDF();
    doc.text("Reporte Semanal de Citas", 10, 10);
    autoTable(doc, {
      head: [['Fecha', 'Médico', 'Especialidad', 'Total']],
      body: this.reporte.map(r => [r.fecha,r.usuario, r.medico, r.especialidad, r.total])
    });
    doc.save('reporte-semanal.pdf');
  }
    soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  limpiarFiltros() {
  this.inicio = '';
  this.fin = '';
  this.dni = '';
  this.reporte = [];
  this.mensajeSinResultados = '';
}

}
