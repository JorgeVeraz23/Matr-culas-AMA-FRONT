import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { SelectorOption } from "../types";

export const selectorAnioLectivo = async (): Promise<SelectorOption[]> => {
    const response = await api.get<SelectorOption[]>(API_ROUTES.anioLectivo.selector);
    return response.data;
};


