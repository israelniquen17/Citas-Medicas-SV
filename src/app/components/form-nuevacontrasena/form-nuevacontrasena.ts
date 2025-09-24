import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-nuevacontrasena',
  standalone: true,
  templateUrl: './form-nuevacontrasena.html',
  styleUrls: ['./form-nuevacontrasena.css'],
  imports: [CommonModule, FormsModule]
})
export class FormNuevacontrasena implements OnInit {
  actual: string = '';
  nueva: string = '';
  confirmar: string = '';
  dni: string = '';

  constructor(
    private servicio: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se recomienda guardar solo el dni como string en localStorage, más seguro
    this.dni = localStorage.getItem('usuarioDni') || '';

    if (!this.dni) {
      alert('Usuario no identificado. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/login']);
    }
  }

  cambiarContrasena(): void {
    if (!this.actual || !this.nueva || !this.confirmar) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.nueva !== this.confirmar) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    const datos = {
      dni: this.dni,
      actual: this.actual,
      nueva: this.nueva
    };

    this.servicio.cambiarContrasena(datos).subscribe({
      next: (resp: any) => {
        alert(resp.mensaje || 'Contraseña cambiada correctamente');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el cambio:', err);
        alert(err.error?.mensaje || 'Error al cambiar la contraseña');
      }
    });
  }
}
