
import { api } from "../apitClient";
import { API_ROUTES } from "../../utils/utils";
import type { MateriaInput, MateriaResponse } from "../../types";

// ✅ Crear
export const crearMateria = async (datos: MateriaInput): Promise<MateriaResponse> => {
  const res = await api.post<MateriaResponse>(API_ROUTES.materia.crear, datos);
  return res.data;
};

// ✅ Listar (opcional idGrado)
export const listarMaterias = async (idGrado?: number): Promise<MateriaResponse[]> => {
  const res = await api.get<MateriaResponse[]>(API_ROUTES.materia.listar, {
    params: idGrado ? { idGrado } : undefined,
  });
  return res.data;
};

// ✅ Obtener por id (query param id)
export const obtenerMateriaPorId = async (id: number): Promise<MateriaResponse> => {
  const res = await api.get<MateriaResponse>(API_ROUTES.materia.obtenerPorId, {
    params: { id },
  });
  return res.data;
};

// ✅ Actualizar (query param id)
export const editarMateria = async (id: number, datos: MateriaInput): Promise<void> => {
  await api.put(API_ROUTES.materia.editar, datos, { params: { id } });
};

// ✅ Eliminar (query param id)
export const eliminarMateria = async (id: number): Promise<void> => {
  await api.delete(API_ROUTES.materia.eliminar, { params: { id } });
};
