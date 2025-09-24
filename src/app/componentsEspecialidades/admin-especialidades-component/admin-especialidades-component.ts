import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../../services/especialidad';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../models/especialidad';
import { DataSharingService } from '../../services/data-sharing';

@Component({
  selector: 'app-admin-especialidades-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-especialidades-component.html',
  styleUrl: './admin-especialidades-component.css'
})
export class AdminEspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  especialidadesFiltradas: Especialidad[] = [];

  especialidadesPosibles: string[] = [
    'Cardiología', 'Pediatría', 'Neurología',
    'Dermatología', 'Gastroenterología', 'Oftalmología',
    'Obstetricia', 'Ginecología', 'Otorinolaringología',
    'Traumatología', 'Psiquiatría', 'Endocrinología','Aspiranteología',
    'Reumatología', 'Oncología', 'Urología',
  ];
  especialidadesDisponibles: string[] = [];

  seleccionada: string = '';
  filtroEstado: string = 'todas';

  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private servicio: EspecialidadService,
        private dataSharingService: DataSharingService
  ) {
    
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.servicio.listar().subscribe({
      next: (datos) => {
        this.especialidades = datos;
        this.actualizarDisponibles();
        this.aplicarFiltro();
      },
      error: err => console.error(err)
    });
  }

  actualizarDisponibles() {
    const nombresYaRegistrados = this.especialidades.map(e => e.nombre);
    this.especialidadesDisponibles = this.especialidadesPosibles.filter(
      e => !nombresYaRegistrados.includes(e)
    );
  }

  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.especialidadesFiltradas = this.especialidades;
    } else if (this.filtroEstado === 'activos') {
      this.especialidadesFiltradas = this.especialidades.filter(e => e.activo);
    } else {
      this.especialidadesFiltradas = this.especialidades.filter(e => !e.activo);
    }
  }

  restablecer() {
    this.filtroEstado = 'todas';
    this.aplicarFiltro();
  }

  guardar() {
  if (!this.seleccionada) return;

  const nueva: Especialidad = { nombre: this.seleccionada };

  this.servicio.registrar(nueva).subscribe({
    next: (resp: any) => {
      this.mensajeExito = 'Especialidad registrada correctamente.';
      this.mensajeError = '';
      this.seleccionada = '';
      this.cargarEspecialidades();
      this.limpiarMensajes();
    },
    error: err => {
      this.mensajeError = typeof err.error === 'string' ? err.error : (err.error?.mensaje || 'Error al registrar.');
      this.mensajeExito = '';
      this.limpiarMensajes();
    }
  });
}

darDeBaja(esp: Especialidad) {
  if (!confirm(`¿Dar de baja la especialidad ${esp.nombre}?`)) return;

  this.servicio.darDeBaja(esp.id!).subscribe({
    next: (resp: any) => {
      this.mensajeExito = typeof resp === 'string' ? resp : (resp?.mensaje || 'Especialidad dada de baja correctamente.');
      this.mensajeError = '';
      this.cargarEspecialidades();
      this.dataSharingService.notificarRefrescarMedicos();
      this.limpiarMensajes();
    },
    error: err => {
      this.mensajeError = typeof err.error === 'string' ? err.error : (err.error?.mensaje || 'Error al dar de baja.');
      this.mensajeExito = '';
      this.limpiarMensajes();
    }
  });
}

darDeAlta(esp: Especialidad) {
  if (!confirm(`¿Dar de alta nuevamente la especialidad ${esp.nombre}?`)) return;

  this.servicio.darDeAlta(esp.id!).subscribe({
    next: (resp: any) => {
      this.mensajeExito = typeof resp === 'string' ? resp : (resp?.mensaje || 'Especialidad reactivada correctamente.');
      this.mensajeError = '';
      this.cargarEspecialidades();
      this.limpiarMensajes();
    },
    error: err => {
      this.mensajeError = typeof err.error === 'string' ? err.error : (err.error?.mensaje || 'Error al dar de alta.');
      this.mensajeExito = '';
      this.limpiarMensajes();
    }
  });
}
private limpiarMensajes() {
  setTimeout(() => {
    this.mensajeExito = '';
    this.mensajeError = '';
  }, 4000);
}

}
