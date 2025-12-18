import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { Curso } from "../types";

export const crearCurso = async (
    payload: Curso
): Promise<boolean> => {
    const response = await api.post<boolean>(
        API_ROUTES.curso.crear,
        payload
    );
    return response.data;
}

export const editarCurso = async (
    payload: Curso
): Promise<boolean> => {
    const response = await api.put<boolean>(
        API_ROUTES.curso.editar,
        payload
    );

    return response.data;
}

export const listarCurso = async (): Promise<Curso[]> => {
    const response = await api.get<Curso[]>(API_ROUTES.curso.listar);
    return response.data;
};

export const obtenerCursoPorId = async (
    id: number
): Promise<Curso> => {
    const response = await api.get<Curso>(
        API_ROUTES.curso.obtenerPorId,
        {
            params: { id }
        }
    );
    return response.data;
};


export const eliminarCurso = async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(
        API_ROUTES.curso.eliminar,
        {
            params: {id}
        }
    );

    return response.data;
}