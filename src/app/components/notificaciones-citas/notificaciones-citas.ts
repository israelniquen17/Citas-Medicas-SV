import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../services/citas';
import { CitaTablaDTO } from '../../models/cita-tabla-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones-citas',
  templateUrl: './notificaciones-citas.html',
  styleUrls: ['./notificaciones-citas.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class NotificacionesCitasComponent implements OnInit {
  mostrarNotificaciones: boolean = true;

  citasProximas: (CitaTablaDTO & { esHoy: boolean; esManana: boolean; esUrgente: boolean })[] = [];
  mostrar = false;
  dni = localStorage.getItem('usuarioDni') || '';

  constructor(private citaService: CitaService, private router: Router) {}

  ngOnInit(): void {
    if (this.dni) {
      this.citaService.obtenerRecordatorios(this.dni, 3).subscribe({
        next: (citas) => {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0); // Normalizar hora de hoy

          this.citasProximas = citas.map(cita => {
            const fechaCita = new Date(cita.fecha);
            fechaCita.setHours(0, 0, 0, 0); // Normalizar hora de la cita

            const diferenciaDias = Math.floor(
              (fechaCita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
            );

            return {
              ...cita,
              esHoy: diferenciaDias === 0,
              esManana: diferenciaDias === 1,
              esUrgente: diferenciaDias === 2
            };
          });
        },
        error: () => console.error('Error al cargar recordatorios')
      });
    }
  }

  toggleMostrar(): void {
    this.mostrar = !this.mostrar;
  }

  irAMisCitas(): void {
    this.router.navigate(['/MisCitas']);
  }

}
