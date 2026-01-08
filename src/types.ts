export interface EstudianteInput {
  nombre: string;
  cedula: string;
  representante: string;
  telefono: string;
  correo: string;
  nivel: number;
}


export interface SelectorOption {
  key: number;
  value: string;
}
export interface Estudiante {
  id: number;
  nombre: string;
  cedula: string;
  representante: string;
  telefono: string;
  correo: string;
  nivel: number;
}

export interface Materia {
  id?: number | 0;
  nombre: string;
  gradoId: number;
}

export interface MostrarMateria {
  id: number;
  nombre: string;
  gradoId: number;
  gradoNombre: string;
}

export interface Paralelo {
  nombre: string;
}

export interface MostrarParalelo  extends Paralelo {
  id: number;
}

export type LoginResponse = {
  token: string;
  expiresAt: string; // ISO string
  role: string;
  userId: string;
  username: string;
};

export type AuthUser = {
  userId: string;
  username: string;
  role: string;
};


export interface CrearOferta {
  gradoId: number;
  paraleloId: number;
  anioLectivoId: number;
  cupos: number;
}

export interface OfertasDisponibles {
  gradoParaleloId: number;
  paraleloId: number;
  paraleloNombre: string;
  gradoNombre: string;
  anioLectivo: string;
  cupos: number;
  ocupados: number;
  disponibles: number;
}