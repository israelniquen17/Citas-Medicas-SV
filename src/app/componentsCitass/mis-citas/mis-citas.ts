import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../services/citas';
import { CitaTablaDTO } from '../../models/cita-tabla-dto';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MisCitasComponent implements OnInit {
  dni: string = '';
  citasUsuario: CitaTablaDTO[] = [];
  mensajeError: string = '';

  mostrarReprogramar: boolean = false;
  citaSeleccionada: CitaTablaDTO | null = null;
  nuevaFecha: string = '';
  horarioSeleccionado: string = '';
  turnoSeleccionado: string = '';
  horariosDisponibles: string[] = [];
  horariosOcupados: string[] = [];

  hoy: string = '';
  fechaMaxima: string = '';

  constructor(private citaService: CitaService, private http: HttpClient) {}

  ngOnInit(): void {
    this.dni = localStorage.getItem('usuarioDni') || '';
    if (!this.dni) {
      this.mensajeError = 'No se ha podido obtener el DNI del usuario.';
      return;
    }

    this.cargarCitas();

    const hoy = new Date();
    this.hoy = hoy.toISOString().split('T')[0];
    const fechaLimite = new Date('2026-12-31');
    this.fechaMaxima = fechaLimite.toISOString().split('T')[0];
  }

  cargarCitas() {
    this.citaService.obtenerCitasPorUsuario(this.dni).subscribe({
      next: (citas) => {
        this.citasUsuario = citas;
      },
      error: (err) => {
        console.error('Error al cargar las citas del usuario', err);
        this.mensajeError = 'Error al cargar las citas del usuario.';
      }
    });
  }

  cancelarCita(id: number, especialidad: string) {
    const confirmar = confirm('⚠ Al cancelar esta cita, perderás el privilegio de cancelar citas futuras. ¿Estás completamente seguro?');
    if (!confirmar) return;

    this.http.put(`http://localhost:8080/api/citas/cancelar/${id}`, {}, { responseType: 'text' })
      .subscribe({
        next: (respuesta: string) => {
          alert(respuesta);
          this.cargarCitas();

          // 🔔 Emitir evento para actualizar gráfica
          this.citaService.emitirCitaCancelada(especialidad);
        },
        error: (err) => {
          console.error('Error al cancelar cita:', err);
          alert(err.error || 'No se pudo cancelar la cita.');
        }
      });
  }

  mostrarFormularioReprogramar(cita: CitaTablaDTO) {
    this.citaSeleccionada = cita;
    this.mostrarReprogramar = true;
    this.nuevaFecha = '';
    this.horarioSeleccionado = '';
    this.turnoSeleccionado = cita.turno;
    this.horariosDisponibles = this.obtenerHorariosPorTurno(this.capitalize(cita.turno));
    this.horariosOcupados = [];
  }

  cancelarReprogramacion() {
    this.mostrarReprogramar = false;
    this.citaSeleccionada = null;
    this.nuevaFecha = '';
    this.horarioSeleccionado = '';
    this.turnoSeleccionado = '';
    this.horariosDisponibles = [];
    this.horariosOcupados = [];
  }

  seleccionarHorario(h: string) {
    this.horarioSeleccionado = h;
  }

  onFechaSeleccionada() {
    if (!this.nuevaFecha || !this.citaSeleccionada) return;

    this.horarioSeleccionado = '';
    this.horariosOcupados = [];

    this.http.get<string[]>(`http://localhost:8080/api/citas/horarios-ocupados/por-turno`, {
      params: {
        fecha: this.nuevaFecha,
        dni: this.dni,
        idMedico: this.citaSeleccionada.idMedico.toString(),
        turno: this.turnoSeleccionado
      }
    }).subscribe({
      next: (ocupados: string[]) => {
        this.horariosOcupados = ocupados;

        const turnoCapitalizado = this.capitalize(this.turnoSeleccionado);
        this.horariosDisponibles = this.obtenerHorariosPorTurno(turnoCapitalizado)
          .filter(h => !this.horariosOcupados.includes(h));
      },
      error: err => {
        console.error('Error al cargar horarios ocupados', err);
      }
    });
  }

  confirmarReprogramacion() {
    if (!this.citaSeleccionada || !this.nuevaFecha || !this.horarioSeleccionado) {
      alert('Por favor, completa la nueva fecha y selecciona un horario.');
      return;
    }

    const confirmar = confirm('¿Estás seguro de reprogramar esta cita?');
    if (!confirmar) return;

    this.http.put(`http://localhost:8080/api/citas/reprogramar/${this.citaSeleccionada.id}`, null, {
      params: {
        nuevaFecha: this.nuevaFecha,
        nuevoHorario: this.horarioSeleccionado
      },
      responseType: 'text'
    }).subscribe({
      next: (respuesta: string) => {
        alert(respuesta);
        this.cargarCitas();
        this.cancelarReprogramacion();
      },
      error: (err) => {
        console.error('Error al reprogramar cita:', err);
        alert(err.error || 'No se pudo reprogramar la cita.');
      }
    });
  }

  obtenerHorariosPorTurno(turno: string): string[] {
    switch (turno) {
      case 'Mañana':
        return ['09:00', '10:00', '11:00', '12:00'];
      case 'Tarde':
        return ['14:00', '15:00', '16:00', '17:00'];
      case 'Noche':
        return ['18:00', '19:00', '20:00'];
      default:
        return [];
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
