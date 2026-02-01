export interface EstudianteInput {
  nombre: string;
  cedula: string;
  telefono: string;
  correo: string;
  nivel: number;
}

// ===============================
// CREATE / UPDATE
// ===============================
export interface ProfesorCreateDto {
  nombres: string;
  apellidos: string;
  tituloProfesional: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string | null;
  email?: string | null;
}

// ===============================
// RESPONSE (GET / LIST)
// ===============================
export interface ProfesorResponseDto {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  tituloProfesional: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string | null;
  email?: string | null;
  isActive?: boolean | null;
}

// ===============================
// SEARCH (autocomplete / selector)
// ===============================
export interface ProfesorSearchDto {
  id: number;
  nombreCompleto: string;
  numeroDocumento: string;
  email?: string | null;
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

export interface MatriculaListado {
  id: number;
  estudianteId: number;
  estudianteNombre: string;
  gradoParaleloId: number;
  gradoNombre: string;
  paraleloNombre: string;
  periodo: string;
  estadoMatricula: string;
  fechaMatricula: string; // ISO
}

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

// ===============================
// CREATE
// ===============================
export interface RepresentanteCreateDto {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}

// ===============================
// UPDATE
// ===============================
export interface RepresentanteUpdateDto {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}

// ===============================
// RESPONSE (GET / LIST)
// ===============================
export interface RepresentanteResponseDto {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  isActive?: boolean | null;
}


export interface DocumentoUploadRequest {
  estudianteId: number;
  tipoDocumentoId: number;
  file: File;              // multipart
  observacion?: string | null;
}

export interface AprobarDto {
  aprobado: boolean;
  observacion?: string | null;
}

// Ajusta estos campos a lo que tu servicio devuelve en ListarPorEstudianteAsync
export interface DocumentoResponseDto {
  id: number;
  estudianteId: number;
  tipoDocumentoId: number;
  tipoDocumentoNombre?: string | null;

  fileName?: string | null;
  contentType?: string | null;
  sizeBytes?: number | null;

  aprobado?: boolean | null;
  observacion?: string | null;

  createdAt?: string | null;
}

