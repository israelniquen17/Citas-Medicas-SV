import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico';
import { SedeService, Sede } from '../../services/sede';
import { Especialidad } from '../../models/especialidad';
import { EspecialidadService } from '../../services/especialidad';

@Component({
  selector: 'app-medico-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-form-component.html'
})
export class MedicoFormComponent implements OnInit {
  @Input() medicoEditar!: Medico;
  @Output() medicoActualiza = new EventEmitter<void>();
    @Output() cerrarFormularioEvent = new EventEmitter<void>(); // NUEVO
  fechaNacimientoMin: string = '';
  fechaNacimientoMax: string = '';
  fechaNacimientoInvalida: boolean = false;
  dniDuplicado: boolean = false;
  correoDuplicado: boolean = false;
  celularDuplicado: boolean = false;

  mensajeError: string = '';

  especialidades: Especialidad[] = [];
  sedes: Sede[] = [];
  turnosDisponibles = ['Mañana', 'Tarde', 'Noche'];

  constructor(
    private medicoService: MedicoService,
    private sedeService: SedeService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    this.cargarSedes();
    this.cargarEspecialidades();
  }

  cargarSedes(): void {
    this.sedeService.listar().subscribe({
      next: data => this.sedes = data.filter(s => s.activo),
      error: err => console.error('Error al cargar sedes', err)
    });
  }

  toggleTurno(turno: string): void {
    const index = this.medicoEditar.horariosAtencion.indexOf(turno);
    if (index > -1) {
      this.medicoEditar.horariosAtencion.splice(index, 1);
    } else {
      this.medicoEditar.horariosAtencion.push(turno);
    }
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: data => this.especialidades = data.filter(e => e.activo),
      error: err => console.error('Error al cargar especialidades', err)
    });
  }

  guardar(): void {
    if (
      this.fechaNacimientoInvalida ||
      this.dniDuplicado ||
      this.correoDuplicado ||
      this.celularDuplicado
    ) {
      this.mensajeError = 'Corrige los errores antes de guardar.';
      return;
    }

    this.mensajeError = ''; // Borrar mensaje de error si no hay errores
    this.medicoActualiza.emit();
  }

  soloLetras(event: KeyboardEvent): void {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  validarEdadMedico(): void {
    if (!this.medicoEditar.fechaNacimiento) {
      this.fechaNacimientoInvalida = true;
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(this.medicoEditar.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    this.fechaNacimientoInvalida = edad < 18 || edad > 80;
  }

  verificarDni(): void {
    if (!this.medicoEditar.dni || this.medicoEditar.dni.length !== 8) return;

    this.medicoService.verificarDni(this.medicoEditar.dni).subscribe((response: any) => {
      const medico = response?.body;
      if (medico && (!this.medicoEditar.id || medico.id !== this.medicoEditar.id)) {
        this.dniDuplicado = true;
      } else {
        this.dniDuplicado = false;
      }
    });
  }

  verificarCorreo(): void {
    const correo = this.medicoEditar.correoElectronico;
    if (!correo) return;

    this.medicoService.verificarCorreo(correo).subscribe(response => {
      const medico = response?.body;
      if (medico && (!this.medicoEditar.id || medico.id !== this.medicoEditar.id)) {
        this.correoDuplicado = true;
      } else {
        this.correoDuplicado = false;
      }
    });
  }

  verificarCelular(): void {
    const celular = this.medicoEditar.numeroCelular;
    if (!celular) return;

    this.medicoService.verificarCelular(celular).subscribe(response => {
      const medico = response?.body;
      if (medico && (!this.medicoEditar.id || medico.id !== this.medicoEditar.id)) {
        this.celularDuplicado = true;
      } else {
        this.celularDuplicado = false;
      }
    });
  }

  actualizarTurnos(event: any, turno: string) {
    if (event.target.checked) {
      if (!this.medicoEditar.horariosAtencion.includes(turno)) {
        this.medicoEditar.horariosAtencion.push(turno);
      }
    } else {
      this.medicoEditar.horariosAtencion = this.medicoEditar.horariosAtencion.filter(t => t !== turno);
    }
  }
    // Llamado al hacer clic en el botón cerrar
  cerrarFormulario() {
    this.cerrarFormularioEvent.emit();
  }

}
