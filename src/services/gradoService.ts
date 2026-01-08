import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { SelectorOption } from "../types";

export const selectorGrado = async (): Promise<SelectorOption[]> => {
    const response = await api.get<SelectorOption[]>(API_ROUTES.grado.selector);
    return response.data;
};


