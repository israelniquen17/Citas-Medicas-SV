import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sede {
  id?: number;
  nombre: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SedeService {
  private baseUrl = 'http://localhost:8080/api/sedes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.baseUrl);
  }

  registrar(sede: Sede): Observable<Sede> {
    return this.http.post<Sede>(this.baseUrl, sede);
  }

darDeAlta(id: number) {
  return this.http.put(`http://localhost:8080/api/sedes/alta/${id}`, {}, { responseType: 'text' });
}


darDeBaja(id: number): Observable<string> {
  return this.http.put(`${this.baseUrl}/dar-baja/${id}`, {}, { responseType: 'text' });
}


}
