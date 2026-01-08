import axios from "axios";
import { API_BASE_URL } from "../utils/utils";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Token automático desde localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // IMPORTANTE: solo una vez "Bearer "
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Si backend devuelve 401, limpiamos sesión
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      // opcional: recargar para que el router mande a login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
