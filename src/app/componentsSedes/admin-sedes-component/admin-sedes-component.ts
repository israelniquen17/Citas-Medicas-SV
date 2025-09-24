import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SedeService, Sede } from '../../services/sede';

@Component({
  selector: 'app-admin-sedes-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-sedes-component.html',
  styleUrl: './admin-sedes-component.css'
})
export class AdminSedesComponent implements OnInit {
  sedes: Sede[] = [];
  sedesFiltradas: Sede[] = [];

  sedesPosibles: string[] = [
    'San Juan de Lurigancho',
    'Miraflores',
    'Comas',
    'Villa El Salvador',
    'Los Olivos',
    'San Isidro',
    'Surco',
    'La Molina',
    'San Borja',
    'San Miguel',
    'San Martín de Porres',
  ];

  sedesDisponibles: string[] = [];
  seleccionada: string = '';
  mensajeExito: string = '';
  mensajeError: string = '';
  filtroEstado: string = 'todas';

  constructor(private servicio: SedeService) {}

  ngOnInit(): void {
    this.cargarSedes();
  }

cargarSedes() {
  this.servicio.listar().subscribe({
    next: (data) => {
      this.sedes = data;
      this.aplicarFiltro();

      // Aquí está el orden correcto:
      this.actualizarDisponibles(); // Primero actualiza
      if (!this.sedesDisponibles.includes(this.seleccionada)) {
        this.seleccionada = ''; // Luego limpia si ya no es válida
      }
    },
    error: err => console.error(err)
  });
}


  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.sedesFiltradas = this.sedes;
    } else if (this.filtroEstado === 'activos') {
      this.sedesFiltradas = this.sedes.filter(s => s.activo);
    } else {
      this.sedesFiltradas = this.sedes.filter(s => !s.activo);
    }
  }

actualizarDisponibles() {
  const nombresExistentes = this.sedes.map(s => s.nombre);
  this.sedesDisponibles = this.sedesPosibles.filter(
    nombre => !nombresExistentes.includes(nombre)
  );
}

  guardar() {
    if (!this.seleccionada) return;

    const nueva: Sede = { nombre: this.seleccionada, activo: true };

    this.servicio.registrar(nueva).subscribe({
      next: () => {
        this.mensajeExito = 'Sede registrada correctamente.';
        this.mensajeError = '';
        this.seleccionada = '';
        this.cargarSedes();
        this.limpiarMensajes();
      },
      error: err => {
        const msg = err?.error?.message || err?.error || 'Error al registrar sede.';
        this.mensajeError = typeof msg === 'string' ? msg : JSON.stringify(msg);
        this.mensajeExito = '';
        this.limpiarMensajes();
      }
    });
  }

  darDeAlta(sede: Sede) {
    if (!confirm(`¿Dar de alta nuevamente la sede ${sede.nombre}?`)) return;

    this.servicio.darDeAlta(sede.id!).subscribe({
      next: (mensaje: string) => {
        this.mensajeExito = mensaje;
        this.mensajeError = '';
        this.cargarSedes();
      },
      error: err => {
        const msg = err?.error?.message || err?.error || 'Error al dar de alta.';
        this.mensajeError = typeof msg === 'string' ? msg : JSON.stringify(msg);
        this.mensajeExito = '';
      }
    });
  }

darDeBaja(sede: Sede) {
  if (!confirm(`¿Dar de baja la sede ${sede.nombre}?`)) return;

  this.servicio.darDeBaja(sede.id!).subscribe({
    next: (mensaje: string) => {
      this.mensajeExito = mensaje;
      this.mensajeError = '';
      this.seleccionada = ''; // 👈 LIMPIA LA SELECCIÓN
      this.cargarSedes(); // Recarga la lista
    },
    error: err => {
      const msg = err?.error?.message || err?.error || 'Error al dar de baja.';
      this.mensajeError = typeof msg === 'string' ? msg : JSON.stringify(msg);
      this.mensajeExito = '';
    }
  });
}

  private limpiarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
    }, 3000);
  }
}
