import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { Estudiante, EstudianteInput, SelectorOption } from "../types";

export const crearEstudiante = async (
  datos: EstudianteInput
): Promise<Estudiante> => {
  const response = await api.post<Estudiante>(API_ROUTES.estudiante.crear, datos);
  console.log(response.data);
  return response.data;
};

export const editarEstudiante = async (
  id: number,
  datos: EstudianteInput,
): Promise<Estudiante> => {
  const response = await api.put<Estudiante>(API_ROUTES.estudiante.editar, { id, ...datos });
  return response.data;
}

export const eliminarEstudiante = async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(
        API_ROUTES.estudiante.eliminar,
        {
            params: {id}
        }
    );

    return response.data;
}

export const listarEstudiantes = async (): Promise<Estudiante[]> => {
  const response = await api.get<Estudiante[]>(API_ROUTES.estudiante.listar);
  return response.data;
}

export const obtenerEstudiantePorId = async (
    id: number
): Promise<Estudiante> => {
    const response = await api.get<Estudiante>(
        API_ROUTES.estudiante.obtenerPorId,
        {
            params: { id }
        }
    );
    return response.data;
}

export const searchEstudiantes = async (query: string, take = 10) => {
  const res = await api.get(API_ROUTES.estudiante.search, { params: { query, take } });
  return res.data as Array<Estudiante>;
};

export const selectorEstudiantesSinMatricula = async (): Promise<SelectorOption[]> => {
  const response = await api.get<SelectorOption[]>(
    API_ROUTES.estudiante.selector
  );
  return response.data;
};

export const selectorEstudiantesDocs= async (): Promise<SelectorOption[]> => {
  const response = await api.get<SelectorOption[]>(
    API_ROUTES.estudiante.selectorEstudianteDocs
  );
  return response.data;
};