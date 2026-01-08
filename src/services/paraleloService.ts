import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { MostrarParalelo, Paralelo, SelectorOption } from "../types";
export const crearParalelo = async (
    payload: Paralelo
): Promise<boolean> => {
    const response = await api.post<boolean>(
        API_ROUTES.paralelo.crear,
        payload
    );
    return response.data;
}


export const editarParalelo = async (payload: MostrarParalelo): Promise<boolean> => {
  const response = await api.put<boolean>(
    API_ROUTES.paralelo.editar,
    { nombre: payload.nombre },
    { params: { id: payload.id } }
  );
  return response.data;
};



export const listarParalelo = async (): Promise<Paralelo[]> => {
    const response = await api.get<Paralelo[]>(API_ROUTES.paralelo.listar);
    return response.data;
};


export const selectorParalelo = async (): Promise<SelectorOption[]> => {
    const response = await api.get<SelectorOption[]>(API_ROUTES.paralelo.selector);
    return response.data;
};

export const obtenerParaleloPorId = async (
    id: number
): Promise<Paralelo> => {
    const response = await api.get<Paralelo>(
        API_ROUTES.paralelo.obtenerPorId,
        {
            params: { id }
        }
    );
    return response.data;
};


export const eliminarParalelo = async (id?: number): Promise<boolean> => {
    const response = await api.delete<boolean>(
        API_ROUTES.paralelo.eliminar,
        {
            params: {id}
        }
    );

    return response.data;
}