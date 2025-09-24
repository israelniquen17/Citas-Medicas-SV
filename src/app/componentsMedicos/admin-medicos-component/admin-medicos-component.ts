import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico';
import { Especialidad } from '../../models/especialidad';
import { MedicoService } from '../../services/medico';
import { TablaMedicosComponent } from '../tabla-medicos-component/tabla-medicos-component';
import { MedicoFormComponent } from '../medico-form-component/medico-form-component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSharingService } from '../../services/data-sharing';

@Component({
  selector: 'app-admin-medicos-component',
  standalone: true,
  templateUrl: './admin-medicos-component.html',
  styleUrls: ['./admin-medicos-component.css'],
  imports: [CommonModule, FormsModule, TablaMedicosComponent, MedicoFormComponent]
})
export class AdminMedicosComponent implements OnInit {
  listaMedicos: Medico[] = [];
  medicoEnEdicion: Medico | null = null;
  medicosFiltrados: Medico[] = [];
  especialidades: Especialidad[] = [];
  filtroEstado: string = 'todos';
  filtroTurno: string = '';
  filtroDni: string = '';
  filtroEspecialidadSeleccionada: string = '';
  mensajeExito: string = '';
  mensajeError = '';

  constructor(
    private medicoService: MedicoService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.dataSharingService.refrescarMedicos$.subscribe(() => {
      this.cargarMedicos();
    });
  }

  cargarMedicos(): void {
    this.medicoService.obtenerMedicos().subscribe({
      next: datos => {
        this.listaMedicos = datos;
        this.aplicarFiltros();
        this.extraerEspecialidadesUnicas();
      },
      error: err => console.error(err)
    });
  }

  crearNuevo(): void {
    this.medicoEnEdicion = this.resetMedico();
  }


  guardarMedico(): void {
  if (!this.medicoEnEdicion) return;

  const esActualizacion = !!this.medicoEnEdicion.id;
  const accion = esActualizacion
    ? this.medicoService.actualizarMedico(this.medicoEnEdicion)
    : this.medicoService.crearMedico(this.medicoEnEdicion);

  accion.subscribe({
    next: () => {
      this.cargarMedicos();
      this.medicoEnEdicion = null;
      this.mensajeExito = esActualizacion
        ? 'Médico actualizado con éxito.'
        : 'Médico registrado con éxito.';
      this.mensajeError = '';
      setTimeout(() => (this.mensajeExito = ''), 3000);
    },
    error: err => {
      if (err.status === 409) {
        this.mensajeError = err.error?.error || 'Conflicto: el médico no puede ser actualizado.';
      } else {
        this.mensajeError = 'Error al guardar el médico.';
        console.error(err);
      }
      setTimeout(() => (this.mensajeError = ''), 3000);
    }
  });
}


  prepararEdicion(m: Medico): void {
    this.medicoEnEdicion = {
      ...m,
      especialidad: m.especialidad ? { ...m.especialidad } : null,
      sede: m.sede ? { ...m.sede } : null
    };
  }

  resetMedico(): Medico {
    return {
      dni: '',
      nombres: '',
      apellidos: '',
      correoElectronico: '',
      numeroCelular: '',
      sexo: '',
      fechaNacimiento: '',
      horariosAtencion: [],
      especialidad: { id: 0, nombre: '' },
      sede: { id: 0, nombre: '' },
      activo: true
    };
  }

  extraerEspecialidadesUnicas(): void {
    const set = new Set<string>();
    this.listaMedicos.forEach(m => {
      if (m.especialidad?.nombre) set.add(m.especialidad.nombre);
    });
    this.especialidades = Array.from(set).map(nombre => ({ id: 0, nombre }));
  }

aplicarFiltros(): void {
  this.medicosFiltrados = this.listaMedicos.filter(m => {
    const estadoValido =
      this.filtroEstado === 'activos' ? m.activo :
      this.filtroEstado === 'inactivos' ? !m.activo : true;

    const dniValido = this.filtroDni ? m.dni.includes(this.filtroDni.trim()) : true;

    const especialidadValida = this.filtroEspecialidadSeleccionada
      ? m.especialidad?.nombre === this.filtroEspecialidadSeleccionada
      : true;

    const turnoValido = this.filtroTurno
      ? m.horariosAtencion.includes(this.filtroTurno)
      : true;

    return estadoValido && dniValido && especialidadValida && turnoValido;
  });
}


  filtrarPorEstado(nuevoFiltro: string) {
    this.filtroEstado = nuevoFiltro;
    this.aplicarFiltros();
  }

  buscarPorDni() {
    this.aplicarFiltros();
  }

  buscarPorEspecialidad() {
    this.aplicarFiltros();
  }

restablecerLista() {
  this.filtroDni = '';
  this.filtroEspecialidadSeleccionada = '';
  this.filtroTurno = ''; // ← Añadir esta línea
  this.filtrarPorEstado('todos');
}


  soloNumeros(event: KeyboardEvent) {
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }
cambiarEstadoMedico(medico: Medico) {
  const accion = medico.activo ? 'dar de baja' : 'dar de alta';

  const confirmar = confirm(`¿Seguro que deseas ${accion} al médico ${medico.nombres} ${medico.apellidos}?`);

  if (!confirmar) return;

  this.medicoService.cambiarEstadoMedico(medico.id!).subscribe({
    next: respuesta => {
      this.mensajeExito = medico.activo
        ? 'Médico dado de baja correctamente.'
        : 'Médico dado de alta correctamente.';

      this.mensajeError = '';
      this.cargarMedicos();

      setTimeout(() => (this.mensajeExito = ''), 3000);
    },
    error: err => {
      if (err.status === 409) {
        this.mensajeError = err.error?.error || 'No se puede dar de baja: el médico tiene citas pendientes.';
      } else {
        this.mensajeError = err.error?.error || 'Error al cambiar estado del médico.';
        console.error(err);
      }
      setTimeout(() => (this.mensajeError = ''), 3000);
    }
  });
}
cerrarFormulario() {
  this.medicoEnEdicion = null;
}


}
