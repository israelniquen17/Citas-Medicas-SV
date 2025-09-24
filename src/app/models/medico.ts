import { Especialidad } from './especialidad';
import { Sede } from './sede'; // asegúrate que lo tienes

export interface Medico {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correoElectronico: string;
  numeroCelular: string;
  sexo: string;
  fechaNacimiento: string;
  horariosAtencion: string[];
  especialidad?: Especialidad | null; 
  sede: Sede| null; // <-- aquí
  activo: boolean;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}
