import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { Materia } from "../types";

export const crearMateria = async (
    payload: Materia
): Promise<boolean> => {
    const response = await api.post<boolean>(
        API_ROUTES.materia.crear,
        payload
    );
    return response.data;
}

export const editarMateria = async (
    payload: Materia
): Promise<boolean> => {
    const response = await api.put<boolean>(
        API_ROUTES.materia.editar,
        payload
    );

    return response.data;
}

export const listarMateria = async (idGrado?: number): Promise<Materia[]> => {
  const response = await api.get<Materia[]>(API_ROUTES.materia.listar, {
    params: idGrado ? { idGrado } : undefined,
  });
  return response.data;
};


export const obtenerMateriaPorId = async (
    id: number
): Promise<Materia> => {
    const response = await api.get<Materia>(
        API_ROUTES.materia.obtenerPorId,
        {
            params: { id }
        }
    );
    return response.data;
};


export const eliminarMateria = async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(
        API_ROUTES.materia.eliminar,
        {
            params: {id}
        }
    );

    return response.data;
}