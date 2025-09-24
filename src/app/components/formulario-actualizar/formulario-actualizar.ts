import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-actualizar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formulario-actualizar.html',
  styleUrls: ['./formulario-actualizar.css']
})
export class FormularioActualizarComponent implements OnChanges {
  @Input() usuarioEditar!: Usuario;
  @Output() usuarioActualiza: EventEmitter<Usuario> = new EventEmitter();

  usuario: Usuario = new Usuario();
  
  correoDuplicado: boolean = false;
  celularDuplicado: boolean = false;
  fechaNacimientoInvalida: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioEditar'] && this.usuarioEditar) {
      this.usuario = { ...this.usuarioEditar };
    }
  }

  actualizarUsuario(): void {
    // Validaciones previas
    if (this.correoDuplicado || this.celularDuplicado || this.fechaNacimientoInvalida) {
      alert('❌ Corrija los errores antes de actualizar el usuario.');
      return;
    }

    const regexContrasena = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexContrasena.test(this.usuario.contrasena)) {
      alert('❌ La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.');
      return;
    }

    this.usuarioService.actualizarUsuario(this.usuario).subscribe({
      next: (data) => {
        alert('✅ Usuario actualizado con éxito');
        this.usuarioActualiza.emit(data);
        this.usuario = new Usuario();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
        alert('❌ Error al actualizar el usuario.');
      }
    });
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  soloLetras(event: KeyboardEvent): void {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  verificarCorreo(): void {
    if (this.usuario.correoElectronico) {
      this.usuarioService
        .verificarCorreo(this.usuario.correoElectronico, this.usuarioEditar.dni)
        .subscribe({
          next: (existe: boolean) => {
            this.correoDuplicado = existe;
          },
          error: (err) => console.error('Error al verificar correo:', err)
        });
    }
  }

  verificarCelular(): void {
    if (this.usuario.numeroCelular) {
      this.usuarioService
        .verificarCelular(this.usuario.numeroCelular, this.usuarioEditar.dni)
        .subscribe({
          next: (existe: boolean) => {
            this.celularDuplicado = existe;
          },
          error: (err) => console.error('Error al verificar celular:', err)
        });
    }
  }

  validarEdad(): void {
    if (this.usuario.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(this.usuario.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      const dia = hoy.getDate() - nacimiento.getDate();
      if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
      }
      this.fechaNacimientoInvalida = edad < 18 || edad > 80;
    }
  }
}
