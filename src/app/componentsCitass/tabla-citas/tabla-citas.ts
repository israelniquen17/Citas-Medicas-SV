import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../services/citas';
import { CitaTablaDTO } from '../../models/cita-tabla-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-citas',
  templateUrl: './tabla-citas.html',
  styleUrls: ['./tabla-citas.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class TablaCitasComponent implements OnInit {
  criterioBuscar = '';
  estadoBuscar = '';
  mensaje = '';
  citas: CitaTablaDTO[] = [];

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    // Cargar todas las citas al inicio
    this.obtenerTodasLasCitas();
  }

  obtenerTodasLasCitas(): void {
    this.citaService.obtenerCitasParaTabla().subscribe({
      next: (data) => this.citas = data,
      error: () => this.mensaje = 'Error al cargar citas.'
    });
  }

  buscar(): void {
    if (this.criterioBuscar && this.criterioBuscar.length > 0 && isNaN(+this.criterioBuscar)) {
      this.mensaje = 'Solo se permiten números si se busca por DNI.';
      return;
    }

    if (this.criterioBuscar.length === 1 || this.criterioBuscar.length === 2 || this.criterioBuscar.length === 3 || this.criterioBuscar.length === 4 || this.criterioBuscar.length === 5 || this.criterioBuscar.length === 6 || this.criterioBuscar.length === 7) {
      this.mensaje = 'El DNI debe tener 8 dígitos.';
      return;
    }

    this.mensaje = '';
    this.citaService.buscarCitas(this.criterioBuscar, this.estadoBuscar).subscribe({
      next: (data) => {
        this.citas = data;
        this.mensaje = '';
      },
      error: (err) => {
        this.citas = [];
        this.mensaje = err.error || 'No se encontraron citas.';
      }
    });
  }

  restablecer(): void {
    this.criterioBuscar = '';
    this.estadoBuscar = '';
    this.mensaje = '';
    this.obtenerTodasLasCitas();
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const tecla = event.key;
    return /^[0-9]$/.test(tecla);
  }
}
