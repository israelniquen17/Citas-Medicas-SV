import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Medico } from '../../models/medico';

@Component({
  selector: 'app-tabla-medicos-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-medicos-component.html',
})
export class TablaMedicosComponent implements OnChanges {
  @Input() listaMedicos: Medico[] = [];
  @Output() editar = new EventEmitter<Medico>();
  @Output() eliminar = new EventEmitter<Medico>();
  @Output() darDeBaja = new EventEmitter<Medico>();
  @Output() cambiarEstado = new EventEmitter<Medico>();

  medicosMostrados: Medico[] = [];
  mostrarBusquedaDni: boolean = false;
  mostrarBusquedaEspecialidad: boolean = false;

  dniBuscar: string = '';
  especialidadBuscar: string = '';
  especialidades: string[] = [];

  errorBusqueda: boolean = false;
  filtroEstado: string = 'todos'; // 'activos', 'inactivos', 'todos'

  ngOnChanges(): void {
    this.extraerEspecialidades();
    this.restablecerLista();
  }

  extraerEspecialidades(): void {
    const set = new Set<string>();
    this.listaMedicos.forEach(m => {
      if (m.especialidad?.nombre) {
        set.add(m.especialidad.nombre);
      }
    });
    this.especialidades = Array.from(set);
  }

  buscarPorDni(): void {
    if (!this.dniBuscar) return;
    const resultado = this.listaMedicos.filter(m =>
      m.dni === this.dniBuscar
    );
    this.medicosMostrados = this.aplicarFiltroEstado(resultado);
    this.errorBusqueda = this.medicosMostrados.length === 0;
  }

  buscarPorEspecialidad(): void {
    if (!this.especialidadBuscar) return;
    const resultado = this.listaMedicos.filter(m =>
      m.especialidad?.nombre === this.especialidadBuscar
    );
    this.medicosMostrados = this.aplicarFiltroEstado(resultado);
    this.errorBusqueda = this.medicosMostrados.length === 0;
  }

  restablecerLista(): void {
    this.dniBuscar = '';
    this.especialidadBuscar = '';
    this.errorBusqueda = false;
    this.medicosMostrados = this.aplicarFiltroEstado(this.listaMedicos);
  }

  filtrarPorEstado(): void {
    this.medicosMostrados = this.aplicarFiltroEstado(this.listaMedicos);
  }

  private aplicarFiltroEstado(lista: Medico[]): Medico[] {
    switch (this.filtroEstado) {
      case 'activos':
        return lista.filter(m => m.activo);
      case 'inactivos':
        return lista.filter(m => !m.activo);
      default:
        return [...lista];
    }
  }
  soloNumeros(event: KeyboardEvent) {
  const charCode = event.key;
  if (!/^\d$/.test(charCode)) {
    event.preventDefault();
  }
}

}
