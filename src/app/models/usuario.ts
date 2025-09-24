export class Usuario {
  id!: number;                 
  dni!: string;                
  nombres!: string;
  apellidos!: string;
  correoElectronico!: string;
  numeroCelular!: string;
  fechaNacimiento!: string;   
  sexo!: string;
  contrasena!: string;
  tipoUsuario!: string;
  activo: boolean = true;
}
