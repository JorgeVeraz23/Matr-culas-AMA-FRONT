import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { Representante } from "../types";

export const crearRepresentante = async (
    payload: Representante
): Promise<boolean> => {
    const response = await api.post<boolean>(
        API_ROUTES.representante.crear,
        payload
    );
    return response.data;
}

export const editarRepresentante = async (
    payload: Representante
): Promise<boolean> => {
    const response = await api.put<boolean>(
        API_ROUTES.representante.editar,
        payload
    );

    return response.data;
}

export const listarRepresentante = async (): Promise<Representante[]> => {
    const response = await api.get<Representante[]>(API_ROUTES.representante.listar);
    return response.data;
};

export const obtenerRepresentantePorId = async (
    id: number
): Promise<Representante> => {
    const response = await api.get<Representante>(
        API_ROUTES.representante.obtenerPorId,
        {
            params: { id }
        }
    );
    return response.data;
};


export const eliminarRepresentante = async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(
        API_ROUTES.representante.eliminar,
        {
            params: {id}
        }
    );

    return response.data;
}