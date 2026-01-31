import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { ProfesorCreateDto, ProfesorResponseDto, ProfesorSearchDto } from "../types";

// ===============================
// CREATE
// POST api/Profesor/CrearProfesor
// ===============================
export const crearProfesor = async (
  payload: ProfesorCreateDto
): Promise<boolean> => {
  const response = await api.post<boolean>(
    API_ROUTES.profesor.crear,
    payload
  );
  return response.data;
};

// ===============================
// UPDATE
// PUT api/Profesor/{id}
// ===============================
export const editarProfesor = async (
  id: number,
  payload: ProfesorCreateDto
): Promise<boolean> => {
  const response = await api.put<boolean>(
    API_ROUTES.profesor.actualizar(id),
    payload
  );
  return response.data;
};

// ===============================
// GET ALL
// GET api/Profesor/GetAll
// ===============================
export const listarProfesores = async (): Promise<ProfesorResponseDto[]> => {
  const response = await api.get<ProfesorResponseDto[]>(
    API_ROUTES.profesor.listar
  );
  return response.data;
};

// ===============================
// GET BY ID
// GET api/Profesor/ObtenerPorId?id=123
// ===============================
export const obtenerProfesorPorId = async (
  id: number
): Promise<ProfesorResponseDto> => {
  const response = await api.get<ProfesorResponseDto>(
    API_ROUTES.profesor.obtenerPorId(id)
  );
  return response.data;
};

// ===============================
// DELETE (soft delete)
// DELETE api/Profesor/Eliminar?id=123
// ===============================
export const eliminarProfesor = async (id: number): Promise<boolean> => {
  const response = await api.delete<boolean>(
    API_ROUTES.profesor.eliminar(id)
  );
  return response.data;
};

// ===============================
// SEARCH (autocomplete / selector)
// GET api/Profesor/search?q=...&take=10
// ===============================
export const searchProfesores = async (
  q: string,
  take: number = 10
): Promise<ProfesorSearchDto[]> => {
  const response = await api.get<ProfesorSearchDto[]>(
    API_ROUTES.profesor.search(q, take)
  );
  return response.data;
};
