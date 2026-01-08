import { API_ROUTES } from "../utils/utils";
import { api } from "./apitClient";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    role: string;
};

export type AuthUser = {
  name: string;
  role: string;
};




export type LoginResponse = {
  token: string;
  expiresAt: string; // ISO string
  role: string;
  userId: string;
  username: string;
};

export type RegisterResponse = {
    message: string;
};

export const loginApi = async (payload: LoginRequest): Promise<LoginResponse> => {
  // Ajusta la ruta a tu backend real
  // ej: /api/Auth/login
  const res = await api.post<LoginResponse>(API_ROUTES.auth.login, payload);
  return res.data;
};

export const registerApi = async (payload: RegisterRequest): Promise<void> => {
  await api.post<RegisterResponse>(API_ROUTES.auth.register, payload);
};