export interface CitaDetalle {
  idCita: number;
  fecha: string;
  turno: string;
  estado: string;

  usuario: {
    nombres: string;
    apellidos: string;
    dni: string;
  };

  medico: {
    nombres: string;
    apellidos: string;
  };

  especialidad: {
    nombre: string;
  };

  sede: {
    nombre: string;
  };
}
