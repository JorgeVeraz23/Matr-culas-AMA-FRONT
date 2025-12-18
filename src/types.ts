export interface Student {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  curso: string;
  paralelo: string;
  estado: "Activo" | "Inactivo";
}

export interface Enrollment {
  id: number;
  estudiante: string;
  periodo: string;
  fecha: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}

export interface Materia {
  idMateria: number;
  name: string;
}

export interface Paralelo {
  idParalelo: number;
  nombre: string;
}

export interface Profesor {
  idProfesor: number;
  nombre: string;
  edad: number;
  identificacion: string;
  celular: string;
  fechaNacimiento: string;
}

export interface Curso {
  idCurso: number;
  nombre: string;
  cupos: number;
}

export interface Representante {
  idRepresentante: number;
  nombre: string;
  edad: number;
  identificacion: string;
  celular: string;
  fechaNacimiento: string;
}




export interface DocumentFile {
  id: number;
  estudiante: string;
  tipo: string;
  nombreArchivo: string;
  fechaSubida: string;
  estado: "Validado" | "En revisión" | "Rechazado";
}
