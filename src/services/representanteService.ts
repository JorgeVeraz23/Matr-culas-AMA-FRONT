// import { api } from "../apitClient";
// import { API_ROUTES } from "../../utils/utils";
// import {
//   RepresentanteCreateDto,
//   RepresentanteUpdateDto,
//   RepresentanteResponseDto,
// } from "../../types/representante.types";
import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { RepresentanteCreateDto, RepresentanteResponseDto, RepresentanteUpdateDto, SelectorOption } from "../types";

// ===============================
// GET ALL / SEARCH
// GET api/Representante/Listar?q=...
// ===============================
export const listarRepresentantes = async (
  q?: string
): Promise<RepresentanteResponseDto[]> => {
  const response = await api.get<RepresentanteResponseDto[]>(
    API_ROUTES.representante.listar,
    {
      params: q ? { q } : undefined,
    }
  );
  return response.data;
};

// ===============================
// GET BY ID
// GET api/Representante/ObtenerPorId/{id}
// ===============================
export const obtenerRepresentantePorId = async (
  id: number
): Promise<RepresentanteResponseDto> => {
  const response = await api.get<RepresentanteResponseDto>(
    API_ROUTES.representante.obtenerPorId(id)
  );
  return response.data;
};

// ===============================
// CREATE
// POST api/Representante/Crear
// ===============================
export const crearRepresentante = async (
  payload: RepresentanteCreateDto
): Promise<{ id: number }> => {
  const response = await api.post<{ id: number }>(
    API_ROUTES.representante.crear,
    payload
  );
  return response.data;
};

// ===============================
// UPDATE
// PUT api/Representante/Actualizar/{id}
// ===============================
export const editarRepresentante = async (
  id: number,
  payload: RepresentanteUpdateDto
): Promise<void> => {
  await api.put(
    API_ROUTES.representante.actualizar(id),
    payload
  );
};

// ===============================
// DELETE (soft)
// DELETE api/Representante/Eliminar/{id}
// ===============================
export const eliminarRepresentante = async (
  id: number
): Promise<void> => {
  await api.delete(
    API_ROUTES.representante.eliminar(id)
  );
};

export const selectorRepresentante = async (): Promise<SelectorOption[]> => {
    const response = await api.get<SelectorOption[]>(API_ROUTES.representante.selector);
    return response.data;
}