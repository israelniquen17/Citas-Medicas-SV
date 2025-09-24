import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad'; // ✅ aquí importa el modelo

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private baseUrl = 'http://localhost:8080/api/especialidades';

  constructor(private http: HttpClient) {}

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.baseUrl);
  }

  registrar(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.baseUrl, especialidad);
  }

  darDeBaja(id: number): Observable<Especialidad> {
  return this.http.put<Especialidad>(`${this.baseUrl}/${id}/baja`, {});
}
darDeAlta(id: number): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/${id}/alta`, {});
}
listarActivasConVinculos(): Observable<Especialidad[]> {
  return this.http.get<Especialidad[]>(`${this.baseUrl}/activas-vinculadas`);
}


}

