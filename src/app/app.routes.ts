import { Routes } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio';
import { AdminComponent } from './components/admin-components/admin-components';
import { LoginComponent } from './components/login/login';
import { FormularioComponent } from './components/formulario-Registro/formulario';
import { FormNuevacontrasena } from './components/form-nuevacontrasena/form-nuevacontrasena';
import {  AgendarPorMedicoComponent } from './componentsCitass/agendar-por-medico/agendar-por-medico';
import { AgendarPorEspecialidadComponent } from './componentsCitass/agendar-por-especialidad/agendar-por-especialidad';
import { TablaCitasComponent } from './componentsCitass/tabla-citas/tabla-citas';
import { MisCitasComponent } from './componentsCitass/mis-citas/mis-citas';
import { NotificacionesCitasComponent } from './components/notificaciones-citas/notificaciones-citas';
import { ReporteSemanalComponent } from './components/reportes/reporte-semanal/reporte-semanal';
import { ReporteEspecialidadComponent } from './components/reportes/reporte-especialidad/reporte-especialidad';



export const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'admin', component: AdminComponent  },
  { path: 'registro', component: FormularioComponent },
  { path: 'nuevacontraseña', component: FormNuevacontrasena },
  { path: 'agendar/medico', component: AgendarPorMedicoComponent },
  { path: 'agendar/especialidad', component: AgendarPorEspecialidadComponent },
  { path: 'tablacitas', component: TablaCitasComponent},
  { path: 'MisCitas', component: MisCitasComponent},
  { path: 'reportesemanal', component: ReporteSemanalComponent },
  { path: 'reporteespecialidad', component: ReporteEspecialidadComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];