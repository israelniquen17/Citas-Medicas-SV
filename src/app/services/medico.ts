import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Medico } from '../models/medico';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private baseUrl = 'http://localhost:8080/api/medicos';

  constructor(private http: HttpClient) {}

  // Obtener todos los médicos
  obtenerMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.baseUrl);
  }

  // Crear nuevo médico
  crearMedico(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.baseUrl, medico);
  }

  // Actualizar médico
  actualizarMedico(medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.baseUrl}/${medico.id}`, medico);
  }

  // Eliminar médico por ID
  eliminarMedico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Buscar médico por DNI (devuelve 404 si no existe)
  buscarPorDni(dni: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseUrl}/dni/${dni}`);
  }

  // Verificar si un correo ya está registrado
  verificarCorreo(correo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/correo/${correo}`, { observe: 'response' }).pipe(
      catchError(err => {
        if (err.status === 404) return of(null); // No encontrado = disponible
        return of(null); // Otro error
      })
    );
  }

  // Verificar si un celular ya está registrado
  verificarCelular(celular: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/celular/${celular}`, { observe: 'response' }).pipe(
      catchError(err => {
        if (err.status === 404) return of(null); // No encontrado = disponible
        return of(null); // Otro error
      })
    );
  }

  // Verificar si un DNI ya está registrado
  verificarDni(dni: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dni/${dni}`, { observe: 'response' }).pipe(
      catchError(err => {
        if (err.status === 404) return of(null); // No encontrado = disponible
        return of(null); // Otro error
      })
    );
  }

  buscarPorEspecialidad(nombre: string): Observable<Medico[]> {
  return this.http.get<Medico[]>(`${this.baseUrl}/por-especialidad/${nombre}`);
}
  
buscarPorSede(id: number): Observable<Medico[]> {
  return this.http.get<Medico[]>(`${this.baseUrl}/por-sede/${id}`);
}
buscarPorEspecialidadYSede(idEspecialidad: number, idSede: number): Observable<Medico[]> {
  return this.http.get<Medico[]>(`${this.baseUrl}/por-especialidad-y-sede?idEspecialidad=${idEspecialidad}&idSede=${idSede}`);
}

cambiarEstadoMedico(idMedico: number): Observable<{ mensaje: string }> {
  return this.http.put<{ mensaje: string }>(`${this.baseUrl}/${idMedico}/estado`, {});
}

}