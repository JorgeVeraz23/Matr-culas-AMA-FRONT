import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import {  SelectorOption } from "../types";



export const selectorTipoDocumentos= async (): Promise<SelectorOption[]> => {
  const response = await api.get<SelectorOption[]>(
    API_ROUTES.tipoDocumento.listar 
  );
  return response.data;
};