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

export interface DocumentFile {
  id: number;
  estudiante: string;
  tipo: string;
  nombreArchivo: string;
  fechaSubida: string;
  estado: "Validado" | "En revisión" | "Rechazado";
}
