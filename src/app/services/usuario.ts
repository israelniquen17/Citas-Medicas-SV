import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiBase = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiBase, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiBase}s`);
  }

  buscarPorDni(dni: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiBase}/${dni}`);
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiBase}/${usuario.dni}`, usuario);
  }

  eliminarPorDni(dni: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/${dni}`);
  }

  buscarPorTipo(tipo: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiBase}/buscar-por-tipo/${tipo}`);
  }

 
  verificarCorreo(correo: string, dni?: string): Observable<boolean> {
  const params = dni ? `?correo=${correo}&dni=${dni}` : `?correo=${correo}`;
  return this.http.get<boolean>(`http://localhost:8080/api/correo-existe${params}`);
}

verificarCelular(numero: string, dni?: string): Observable<boolean> {
  const params = dni ? `?numero=${numero}&dni=${dni}` : `?numero=${numero}`;
  return this.http.get<boolean>(`http://localhost:8080/api/numero-existe${params}`);
}

cambiarContrasena(datos: { dni: string, actual: string, nueva: string }) {
  return this.http.post<{ mensaje: string }>('http://localhost:8080/api/usuario/cambiar-contrasena', datos);
}

  darDeBaja(id: number) {
    return this.http.put(`http://localhost:8080/api/usuarios/${id}/baja`, {});

}
}