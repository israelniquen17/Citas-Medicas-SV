import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TablaComponent } from '../tabla/tabla';
import { FormularioActualizarComponent } from '../formulario-actualizar/formulario-actualizar';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { AdminMedicosComponent } from '../../componentsMedicos/admin-medicos-component/admin-medicos-component';
import { Router } from '@angular/router';
import { AdminEspecialidadesComponent } from '../../componentsEspecialidades/admin-especialidades-component/admin-especialidades-component';
import { AdminSedesComponent } from '../../componentsSedes/admin-sedes-component/admin-sedes-component';
import { TablaCitasComponent } from '../../componentsCitass/tabla-citas/tabla-citas';
import { ReporteSemanalComponent } from "../reportes/reporte-semanal/reporte-semanal";
import { ReporteEspecialidadComponent } from "../reportes/reporte-especialidad/reporte-especialidad";

@Component({
  selector: 'app-admin-components',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TablaComponent,
    FormularioActualizarComponent,
    AdminMedicosComponent,
    AdminEspecialidadesComponent,
    AdminSedesComponent,
    TablaCitasComponent,
    ReporteSemanalComponent,
    ReporteEspecialidadComponent
],
  templateUrl: './admin-components.html',
  styleUrls: ['./admin-components.css']
})
export class AdminComponent implements OnInit {
  // Datos de Usuarios
  listaUsuarios: Usuario[] = [];
  usuarioEnEdicion: Usuario | null = null;

  // Control de vista: 'usuarios' o 'medicos'
currentView: 'usuarios' | 'medicos' | 'especialidad' | 'sedes' | 'tablacitas' | 'reportesemanal'| 'reporteespecialidad'= 'usuarios';

  constructor(private servicio: UsuarioService, private router: Router) {}
  filtroEstado: string = 'activos';
listaUsuariosMostrados: Usuario[] = [];
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /* ===== Usuarios ===== */
  cargarUsuarios(): void {
    this.servicio.obtenerUsuarios().subscribe({
      next: datos => (this.listaUsuarios = datos),
      error: err => console.error(err)
    });
    this.servicio.obtenerUsuarios().subscribe({
    next: datos => {
    this.listaUsuarios = datos;
    this.filtrarPorEstado();
  },
  error: err => console.error(err)
});
  }

  prepararEdicion(u: Usuario): void {
    this.usuarioEnEdicion = { ...u };
  }

  actualizarUsuario(): void {
    if (!this.usuarioEnEdicion) return;
    this.servicio.actualizarUsuario(this.usuarioEnEdicion).subscribe({
      next: actualizado => {
        this.listaUsuarios = this.listaUsuarios.map(u =>
          u.dni === actualizado.dni ? actualizado : u
        );
        this.usuarioEnEdicion = null;
      },
      error: err => console.error(err)
    });
  }

  eliminarUsuario(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario con DNI ${u.dni}?`)) return;
    this.servicio.eliminarPorDni(u.dni).subscribe({
      next: () => {
        this.listaUsuarios = this.listaUsuarios.filter(x => x.dni !== u.dni);
      }, 
      error: err => console.error(err)
    });
  }

 

  /* ===== Alternar Vistas ===== */
  showUsuarios(): void {
    this.currentView = 'usuarios';
    this.cargarUsuarios();
  }

  showMedicos(): void {
    this.currentView = 'medicos';
  }

showEspecialidad(): void {
  this.currentView = 'especialidad';
}

showSedes(): void {
  this.currentView = 'sedes';
}
showCitas(): void {
  this.currentView = 'tablacitas';
}
showReporteSemanal(): void {
  this.currentView = 'reportesemanal';
}
showReporteEspecialidad(): void {
  this.currentView = 'reporteespecialidad';
}



  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.clear(); // si usas token
      this.router.navigate(['/login']);
    }
  }

  filtrarPorEstado(): void {
  switch (this.filtroEstado) {
    case 'activos':
      this.listaUsuariosMostrados = this.listaUsuarios.filter(u => u.activo);
      break;
    case 'inactivos':
      this.listaUsuariosMostrados = this.listaUsuarios.filter(u => !u.activo);
      break;
    default:
      this.listaUsuariosMostrados = [...this.listaUsuarios];
      break;
  }
}
}
