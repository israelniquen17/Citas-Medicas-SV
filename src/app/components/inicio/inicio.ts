import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionesCitasComponent } from "../notificaciones-citas/notificaciones-citas";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, NotificacionesCitasComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {
  constructor(private router: Router) {}

  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  irAgendarPorMedico() {
    this.router.navigate(['/agendar/medico']);
  }

  irAgendarPorEspecialidad() {
    this.router.navigate(['/agendar/especialidad']);
  }


}
