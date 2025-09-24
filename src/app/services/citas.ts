import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Cita } from '../models/cita';
import { CitaDetalle } from '../models/cita.detalle';
import { CitaDTO } from '../models/CitaDTO';
import { CitaTablaDTO } from '../models/cita-tabla-dto';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiBase = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}
  private citaCanceladaSubject = new Subject<string>();
  citaCancelada$ = this.citaCanceladaSubject.asObservable();
  registrarCita(cita: CitaDTO): Observable<any> {
    return this.http.post(`${this.apiBase}`, cita);
  }

  listarPorDni(dni: string): Observable<CitaDetalle[]> {
    return this.http.get<CitaDetalle[]>(`${this.apiBase}/usuario/${dni}`);
  }

  obtenerCitasParaTabla(): Observable<CitaTablaDTO[]> {
    return this.http.get<CitaTablaDTO[]>(`${this.apiBase}/tabla`);
  }

  buscarCitas(criterio: string, estado: string): Observable<CitaTablaDTO[]> {
    return this.http.get<CitaTablaDTO[]>(`${this.apiBase}/buscar?criterio=${criterio}&estado=${estado}`);
  }


  obtenerHorariosOcupados(idMedico: number, fecha: string, turno: string, dni: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiBase}/horarios-ocupados`, {
    params: { idMedico, fecha, turno, dni }
  });
}


  obtenerCitasPorDni(dni: string): Observable<Cita[]> {
  return this.http.get<Cita[]>(`${this.apiBase}/usuario/${dni}`);
}

obtenerCitasPorUsuario(dni: string): Observable<CitaTablaDTO[]> {
  return this.http.get<CitaTablaDTO[]>(`http://localhost:8080/api/citas/usuario/tabla/${dni}`);
}
obtenerRecordatorios(dni: string, dias: number) {
  return this.http.get<CitaTablaDTO[]>(`http://localhost:8080/api/citas/recordatorios/${dni}`, {
    params: {
      dias: dias.toString()
    }
  });
}
obtenerCitasPorEspecialidad(inicio: string, fin: string): Observable<{ especialidad: string, total: number }[]> {
  return this.http.get<{ especialidad: string, total: number }[]>(`http://localhost:8080/api/citas/reporte/especialidades`, {
    params: { inicio, fin }
  });
}


  emitirCitaCancelada(especialidad: string) {
    this.citaCanceladaSubject.next(especialidad);
  }
}
