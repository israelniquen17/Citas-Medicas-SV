import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionesCitasComponent } from './components/notificaciones-citas/notificaciones-citas';
import { CitaService } from './services/citas'; // Asegúrate de que esta ruta es correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    NotificacionesCitasComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected title = 'frontend_citasMedicas';
  protected router = inject(Router);

  mostrarNotificaciones = false;
  notificacionesPendientes = 0;

  private citaService = inject(CitaService);

  ngOnInit(): void {
    const dni = localStorage.getItem('usuarioDni');
    if (dni) {
      this.citaService.obtenerRecordatorios(dni, 3).subscribe({
        next: (citas) => {
          this.notificacionesPendientes = citas.length;
        },
        error: (err) => {
          console.error('Error al obtener recordatorios', err);
        }
      });
    }
  }


toggleNotificaciones(): void {
  this.mostrarNotificaciones = !this.mostrarNotificaciones;
  if (this.mostrarNotificaciones) {
    this.notificacionesPendientes = 0;
  }
}


  cerrarSesion() {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
      localStorage.clear(); // Limpia la sesión
      this.router.navigate(['/login']);
    }
  }
}
