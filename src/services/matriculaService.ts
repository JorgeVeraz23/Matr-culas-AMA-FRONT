// services/matriculaService.ts
import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { CrearMatricula, MatriculaResponseDto } from "../types";

export const crearMatricula = async (
  payload: CrearMatricula
): Promise<MatriculaResponseDto> => {
  const response = await api.post<MatriculaResponseDto>(
    API_ROUTES.matricula.crear,
    payload
  );
  return response.data;
};


export const listarMatriculas = async (
  periodo?: string
): Promise<MatriculaResponseDto[]> => {
  const response = await api.get<MatriculaResponseDto[]>(
    API_ROUTES.matricula.getAll,
    {
      params: periodo ? { periodo } : undefined,
    }
  );
  return response.data;
};