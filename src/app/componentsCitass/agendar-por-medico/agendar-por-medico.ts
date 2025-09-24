import { Component, OnInit } from '@angular/core';
import { SedeService } from '../../services/sede';
import { MedicoService } from '../../services/medico';
import { CitaService } from '../../services/citas';
import { Sede } from '../../models/sede';
import { Medico } from '../../models/medico';
import { CitaDTO } from '../../models/CitaDTO';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agendar-por-medico',
  standalone: true,
  templateUrl: './agendar-por-medico.html',
  styleUrls: ['./agendar-por-medico.css'],
  imports: [FormsModule, CommonModule]
})
export class AgendarPorMedicoComponent implements OnInit {
  sedes: Sede[] = [];
  medicos: Medico[] = [];

  sedeSeleccionada: Sede | null = null;
  medicoSeleccionado: Medico | null = null;
  fechaSeleccionada: string = '';
  turnoSeleccionado: string = '';
  horarioSeleccionado: string = '';
  resumen: string = '';

  hoy: string = '';
  fechaMaxima: string = '';

  mensajeExito: boolean = false;
  botonDeshabilitado: boolean = true;
  dniUsuario: string = '';

  horariosDisponibles: string[] = [];
  horariosOcupados: string[] = [];

  turnosHorarios: { [key: string]: string[] } = {
    Mañana: ['09:00', '10:00', '11:00', '12:00'],
    Tarde: ['14:00', '15:00', '16:00', '17:00'],
    Noche: ['18:00', '19:00', '20:00']
  };

    feriadosPeru: string[] = [
    '01-01', '03-28', '03-29', '05-01', '06-29', '07-28', '07-29',
    '08-30', '10-08', '11-01', '12-08', '12-25'
  ];

turnosDelMedico: string[] = [];
  constructor(
    private sedeService: SedeService,
    private medicoService: MedicoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.dniUsuario = localStorage.getItem('usuarioDni') || '';

    if (!this.dniUsuario) {
      alert('Usuario no identificado. Por favor, inicia sesión nuevamente.');
      return;
    }

    this.cargarSedes();
    const hoy = new Date();
    this.hoy = hoy.toISOString().split('T')[0];
    const fechaLimite = new Date('2026-12-31');
    this.fechaMaxima = fechaLimite.toISOString().split('T')[0];
  }

  cargarSedes(): void {
    this.sedeService.listar().subscribe({
      next: (data) => this.sedes = data.filter(s => s.activo),
      error: (err) => console.error('Error al cargar sedes', err)
    });
  }

  onSedeSeleccionada(): void {
    this.limpiarCamposHorarios();
    if (this.sedeSeleccionada?.id) {
      this.medicoService.buscarPorSede(this.sedeSeleccionada.id).subscribe({
        next: (data) => this.medicos = data.filter(m => m.activo),
        error: (err) => console.error('Error al cargar médicos', err)
      });
    }
  }

  onMedicoSeleccionado(): void {
    if (this.medicoSeleccionado) {
      this.turnoSeleccionado = this.medicoSeleccionado.horariosAtencion?.[0] || '';
      this.onTurnoSeleccionado();
    }
  }

onFechaSeleccionada(): void {
  if (!this.fechaSeleccionada) return;

  // Convertir fecha seleccionada (YYYY-MM-DD) en un objeto Date correctamente
  const [anio, mes, dia] = this.fechaSeleccionada.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia); // Date usa mes 0-based

  // Verificar si es domingo
  const esDomingo = fecha.getDay() === 0;

  // Verificar si es feriado (usamos MM-DD)
  const mmdd = `${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  const esFeriado = this.feriadosPeru.includes(mmdd);

  // Mostrar el mensaje correcto según el caso
  if (esDomingo) {
    alert('No se pueden agendar citas los domingos.');
    this.fechaSeleccionada = '';
    this.horarioSeleccionado = '';
    return;
  }

  if (esFeriado) {
    alert('No se pueden agendar citas en días feriados.');
    this.fechaSeleccionada = '';
    this.horarioSeleccionado = '';
    return;
  }

  this.actualizarResumen();
}


  onTurnoSeleccionado(): void {
    this.horarioSeleccionado = '';
    this.horariosDisponibles = this.turnosHorarios[this.turnoSeleccionado]?.map(this.toHHMM) || [];
    this.horariosOcupados = [];

    this.cargarHorariosSiTodoListo();
  }

  cargarHorariosSiTodoListo(): void {
    if (this.medicoSeleccionado && this.fechaSeleccionada && this.turnoSeleccionado) {
      this.citaService.obtenerHorariosOcupados(
        this.medicoSeleccionado.id!,
        this.fechaSeleccionada,
        this.turnoSeleccionado,
        this.dniUsuario
      ).subscribe({
        next: (ocupados) => {
          this.horariosOcupados = ocupados.map(this.toHHMM);
          if (this.horariosOcupados.includes(this.horarioSeleccionado)) {
            this.horarioSeleccionado = '';
          }
          this.actualizarResumen();
        },
        error: (err) => console.error('Error al cargar horarios ocupados', err)
      });
    }
  }

  seleccionarHorario(horario: string): void {
    if (!this.horariosOcupados.includes(horario)) {
      this.horarioSeleccionado = horario;
    } else {
      this.horarioSeleccionado = '';
    }

    this.actualizarResumen();
  }

actualizarResumen(): void {
  if (this.medicoSeleccionado) {
    // Obtener solo los turnos válidos (Mañana, Tarde, Noche)
 const ordenTurnos = ['Mañana', 'Tarde', 'Noche'];
this.turnosDelMedico = this.medicoSeleccionado.horariosAtencion
  ?.filter(turno => ordenTurnos.includes(turno))
  .sort((a, b) => ordenTurnos.indexOf(a) - ordenTurnos.indexOf(b)) || [];


    // Resetear horarios si se cambió de médico
    if (!this.turnosDelMedico.includes(this.turnoSeleccionado)) {
      this.turnoSeleccionado = '';
      this.horariosDisponibles = [];
    }

    if (this.turnoSeleccionado && this.fechaSeleccionada) {
      this.citaService.obtenerHorariosOcupados(
        this.medicoSeleccionado.id!,
        this.fechaSeleccionada,
        this.turnoSeleccionado,
        this.dniUsuario
      ).subscribe({
        next: (ocupados) => {
          this.horariosOcupados = ocupados.map(this.toHHMM);
          this.refrescarResumen();
        },
        error: (err) => console.error('Error al cargar horarios ocupados', err)
      });
    } else {
      this.refrescarResumen();
    }
  }
}

  refrescarResumen(): void {
    this.resumen = '';
    this.botonDeshabilitado = true;

    if (
      this.sedeSeleccionada &&
      this.medicoSeleccionado &&
      this.fechaSeleccionada &&
      this.turnoSeleccionado &&
      this.horarioSeleccionado &&
      !this.horariosOcupados.includes(this.horarioSeleccionado)
    ) {
      this.resumen = `Sede: ${this.sedeSeleccionada.nombre}\n` +
        `Médico: ${this.medicoSeleccionado.nombres} ${this.medicoSeleccionado.apellidos}\n` +
        `Especialidad: ${this.medicoSeleccionado.especialidad?.nombre}\n` +
        `Fecha: ${this.fechaSeleccionada}\nTurno: ${this.turnoSeleccionado}\nHorario: ${this.horarioSeleccionado}`;
      this.botonDeshabilitado = false;
    }
  }

  validarYConfirmar(): void {
    if (this.botonDeshabilitado) return;

    const cita: CitaDTO = {
      dni: this.dniUsuario,
      idMedico: this.medicoSeleccionado!.id!,
      idSede: this.sedeSeleccionada!.id!,
      idEspecialidad: this.medicoSeleccionado!.especialidad!.id!,
      fecha: this.fechaSeleccionada,
      turno: this.turnoSeleccionado,
      horario: this.horarioSeleccionado
    };

    this.botonDeshabilitado = true;

    this.citaService.registrarCita(cita).subscribe({
      next: () => {
        this.mensajeExito = true;

        // Bloquea el horario seleccionado en tiempo real sin refrescar
        this.horariosOcupados.push(this.horarioSeleccionado);

        // Limpia el horario seleccionado y resumen
        this.horarioSeleccionado = '';
        this.actualizarResumen();

        // Oculta el mensaje luego de 3 segundos
        setTimeout(() => {
          this.mensajeExito = false;
        }, 3000);
      },
      error: (error) => {
        this.botonDeshabilitado = false;
        if (error.status === 409) {
          alert(error.error.message || 'Este médico ya tiene una cita en esa fecha y horario.');
        } else {
          console.error('Error al registrar cita:', error);
          alert('Ocurrió un error al registrar la cita.');
        }
      }
    });
  }

  limpiarCamposHorarios(): void {
    this.medicoSeleccionado = null;
    this.turnoSeleccionado = '';
    this.horarioSeleccionado = '';
    this.resumen = '';
    this.horariosDisponibles = [];
    this.horariosOcupados = [];
  }

  private toHHMM(hora: string): string {
    return hora?.trim().slice(0, 5);
  }
}
