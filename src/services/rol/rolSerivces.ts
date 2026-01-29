import { api } from "../apitClient";
import { API_ROUTES } from "../../utils/utils";
import type { Rol } from "../../types";

// ✅ Obtener roles para selector
export const obtenerRoles = async (): Promise<Rol[]> => {
  const response = await api.get<Rol[]>(API_ROUTES.rol.selector);
  return response.data;
};
