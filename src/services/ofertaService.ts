import { CrearOferta, CupoDisponible, OfertasDisponibles } from "../types";
import { API_ROUTES } from "../utils/utils";
import { api } from "./apitClient";

export async function crearOferta(dto: CrearOferta) {
  const res = await api.post(API_ROUTES.gradoParalelo.crear, dto);
  return res.data;
}

// ✅ filtro dinámico: manda params solo si vienen
export async function listarOfertas(filters?: {
  gradoId?: number;
  paraleloId?: number;
  anioLectivoId?: number;
}) {
  const params: any = {};
  if (filters?.gradoId) params.gradoId = filters.gradoId;
  if (filters?.paraleloId) params.paraleloId = filters.paraleloId;
  if (filters?.anioLectivoId) params.anioLectivoId = filters.anioLectivoId;

  const res = await api.get<OfertasDisponibles[]>(API_ROUTES.gradoParalelo.disponibles, { params });
  return res.data;
}





export const obtenerCuposDisponiblesPorEstudiante = async (
  idEstudiante: number
): Promise<CupoDisponible[]> => {
  const response = await api.get<CupoDisponible[]>(
    API_ROUTES.gradoParalelo.cuposDisponiblesPorEstudiante,
    {
      params: { idEstudiante },
    }
  );
  return response.data;
};
