import { Component, EventEmitter, Output } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class FormularioComponent {
  usuario: Usuario = new Usuario();
  correoDuplicado: boolean = false;
  celularDuplicado: boolean = false;
  fechaNacimientoInvalida: boolean = false;

  @Output() usuarioEnvia: EventEmitter<Usuario> = new EventEmitter();

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  registrarUsuario(): void {
    if (this.correoDuplicado || this.celularDuplicado || this.fechaNacimientoInvalida) {
      alert("No se puede registrar: corrige los errores.");
      return;
    }

    // Validación de contraseña adicional (JS) por seguridad
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regex.test(this.usuario.contrasena)) {
      
    }

    this.usuarioService.crearUsuario(this.usuario).subscribe({
      next: (res) => {
        this.usuarioEnvia.emit(res);
        this.usuario = new Usuario();
        this.correoDuplicado = false;
        this.celularDuplicado = false;
        this.fechaNacimientoInvalida = false;
        alert("✅ Usuario registrado con éxito.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al registrar usuario';

        if (mensaje.includes('DNI')) {
          this.correoDuplicado = false;
          this.celularDuplicado = false;
        } else if (mensaje.includes('correo electrónico')) {
          this.correoDuplicado = true;
          this.celularDuplicado = false;
        } else if (mensaje.includes('número de celular')) {
          this.celularDuplicado = true;
          this.correoDuplicado = false;
        }

        alert(mensaje);
      }
    });
  }

  verificarCorreo(): void {
    if (!this.usuario.correoElectronico) return;
    this.usuarioService.verificarCorreo(this.usuario.correoElectronico).subscribe({
      next: (existe: boolean) => this.correoDuplicado = existe,
      error: () => this.correoDuplicado = false
    });
  }

  verificarCelular(): void {
    if (!this.usuario.numeroCelular) return;
    this.usuarioService.verificarCelular(this.usuario.numeroCelular).subscribe({
      next: (existe: boolean) => this.celularDuplicado = existe,
      error: () => this.celularDuplicado = false
    });
  }

  validarEdad(): void {
    if (!this.usuario.fechaNacimiento) {
      this.fechaNacimientoInvalida = true;
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(this.usuario.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    this.fechaNacimientoInvalida = edad < 18 || edad > 80;
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
  verPassword: boolean = false;

}
