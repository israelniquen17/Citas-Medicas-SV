export interface Cita {
  idCita?: number;
  idUsuario: number;
  idMedico: number;
  idSede: number;
  idEspecialidad: number;
  fecha: string;         // Formato: 'YYYY-MM-DD'
  turno: string;      
  horario: string;        
  estado?: string;       // Puede ser 'proxima', 'cancelada', 'finalizada'
}
