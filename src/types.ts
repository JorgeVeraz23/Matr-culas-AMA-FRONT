export interface EstudianteInput {
  nombre: string;
  cedula: string;
  telefono: string;
  correo: string;
  nivel: number;
}

export interface CrearMatricula {
  estudianteId: number;
  gradoParaleloId: number;
}

export interface CupoDisponible {
  gradoParaleloId: number;
  paraleloId: number;
  gradoNombre: string;
  paraleloNombre: string;
  anioLectivo: string;
  cupos: number;
  ocupados: number;
  disponibles: number;
}


export type MatriculaResponseDto = {
  id: number;
  estudianteId: number;
  estudianteNombre: string;

  gradoParaleloId: number;
  gradoNombre: string;
  paraleloNombre: string;
  periodo: string;

  estadoMatricula: string;
  fechaMatricula: string; // viene como ISO string
};


export interface SelectorOption {
  key: number;
  value: string;
}
export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  idRepresentante: number;
  telefono: string;
  correo: string;
  direccion: string;
  nivel: number;
  ultimoGradoAprobado: number;
  estado: string;
  genero: string;
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

export type Usuario = {
  id: string;
  userName: string;
  email: string | null;
  isActive: boolean;
  role: string | null;
};

export type UsuarioCrearDTO = {
  username: string;
  email?: string | null;
  password: string;
  role: string; // 1 solo rol
};

export type UsuarioEditarDTO = {
  username?: string;
  email?: string | null;  // si mandas "" o null => limpia email
  isActive?: boolean;
  role?: string; // 1 solo rol
};

export type ResetPasswordDTO = {
  newPassword: string;
};

export type Rol = {
  id: string;
  name: string;
};


export interface MateriaInput {
  nombre: string;
  gradoId: number;
}

export interface MateriaResponse {
  id: number;
  nombre: string;
  gradoId: number;
  gradoNombre: string;
}


