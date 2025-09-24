import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioActualizarComponent } from '../formulario-actualizar/formulario-actualizar';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule, FormularioActualizarComponent],
  templateUrl: './tabla.html',
  styleUrls: ['./tabla.css']
})
export class TablaComponent implements OnChanges {
  @Input() listaUsuarios: Usuario[] = [];
  @Output() eliminar = new EventEmitter<Usuario>();
  @Output() darDeBaja = new EventEmitter<Usuario>();

  listaUsuariosFiltrados: Usuario[] = [];
  usuarioParaEditar: Usuario | null = null;

  filtroEstado: string = 'todos';
  mostrarBusquedaTipo: boolean = false;
  tipoUsuarioBuscar: string = '';

  mostrarBusqueda = false;
  dniBuscar = '';
  errorBusqueda = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnChanges(): void {
    this.aplicarFiltroEstado();
  }

  editarUsuario(item: Usuario): void {
    this.usuarioParaEditar = { ...item };
  }

  onUsuarioActualizado(usuario: Usuario): void {
    this.listaUsuarios = this.listaUsuarios.map(u =>
      u.dni === usuario.dni ? usuario : u
    );
    this.usuarioParaEditar = null;
    this.aplicarFiltroEstado();
  }

  confirmarEliminacion(usuario: Usuario): void {
    if (window.confirm('¿Eliminar este usuario?')) {
      this.eliminar.emit(usuario);
    }
  }

  buscarUsuarioPorId(): void {
    if (!this.dniBuscar) return;
    this.usuarioService.buscarPorDni(this.dniBuscar).subscribe({
      next: u => {
        this.listaUsuariosFiltrados = [u];
        this.errorBusqueda = false;
      },
      error: () => {
        this.listaUsuariosFiltrados = [];
        this.errorBusqueda = true;
      }
    });
  }

  restablecerLista(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: data => {
        this.listaUsuarios = data;
        this.aplicarFiltroEstado();
        this.errorBusqueda = false;
        this.dniBuscar = '';
      },
      error: err => console.error(err)
    });
  }

  buscarPorTipoUsuario(): void {
    if (!this.tipoUsuarioBuscar) {
      this.errorBusqueda = true;
      return;
    }

    this.usuarioService.buscarPorTipo(this.tipoUsuarioBuscar).subscribe({
      next: (respuesta) => {
        this.listaUsuariosFiltrados = respuesta;
        this.errorBusqueda = respuesta.length === 0;
      },
      error: () => {
        this.listaUsuariosFiltrados = [];
        this.errorBusqueda = true;
      }
    });
  }

  aplicarFiltroEstado(): void {
    if (this.filtroEstado === 'activos') {
      this.listaUsuariosFiltrados = this.listaUsuarios.filter(u => u.activo);
    } else if (this.filtroEstado === 'inactivos') {
      this.listaUsuariosFiltrados = this.listaUsuarios.filter(u => !u.activo);
    } else {
      this.listaUsuariosFiltrados = [...this.listaUsuarios];
    }
  }

  puedeEliminar(tipo: string): boolean {
    return tipo === 'Cliente';
  }

  darDeBajaUsuario(usuario: Usuario): void {
  if (confirm(`¿Dar de baja al usuario ${usuario.nombres}?`)) {
    this.usuarioService.darDeBaja(usuario.id).subscribe({
      next: () => {
        usuario.activo = false;
        alert(`El usuario ${usuario.nombres} ha sido dado de baja.`);
        this.aplicarFiltroEstado();
      },
      error: (error) => {
        console.error('Error al dar de baja:', error);

        // 👇 Mostrar mensaje si el backend devuelve error por citas activas
        if (error.status === 409) {
          alert('No se puede dar de baja al usuario porque tiene citas activas.');
        } else {
          alert('Ocurrió un error al intentar dar de baja al usuario.');
        }
      }
    });
  }
}

soloNumeros(event: KeyboardEvent) {
  const char = event.key;
  if (!/^\d$/.test(char)) {
    event.preventDefault();
  }
}

}
