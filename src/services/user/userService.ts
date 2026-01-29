import { api } from "../apitClient";
import { API_ROUTES } from "../../utils/utils";
import type { Usuario, UsuarioCrearDTO, UsuarioEditarDTO, ResetPasswordDTO } from "../../types";

// ✅ LISTAR (solo activos, según backend)
export const listarUsuarios = async (): Promise<Usuario[]> => {
  const res = await api.get<Usuario[]>(API_ROUTES.users.getAll);
  return res.data;
};

// ✅ OBTENER POR ID (id en ruta)
export const obtenerUsuarioPorId = async (id: string): Promise<Usuario> => {
  const res = await api.get<Usuario>(API_ROUTES.users.getById(id));
  return res.data;
};

// ✅ CREAR
export const crearUsuario = async (datos: UsuarioCrearDTO): Promise<any> => {
  const res = await api.post(API_ROUTES.users.crearUsuario, datos);
  return res.data;
};

// ✅ EDITAR (id en ruta)
export const actualizarUsuario = async (id: string, datos: UsuarioEditarDTO): Promise<any> => {
  const res = await api.put(API_ROUTES.users.actualizarUsuario(id), datos);
  return res.data;
};

// ✅ ELIMINAR (soft delete => DELETE /DesactivarUsuario/{id})
export const desactivarUsuario = async (id: string): Promise<any> => {
  const res = await api.delete(API_ROUTES.users.eliminarUsuario(id));
  return res.data;
};

// ✅ REACTIVAR (POST /ReactivarUsuario/{id})
export const reactivarUsuario = async (id: string): Promise<any> => {
  const res = await api.post(API_ROUTES.users.reactivarUsuario(id));
  return res.data;
};

// // ✅ RESET PASSWORD (POST /ResetearContrasena/{id})
// export const resetearContrasenaUsuario = async (id: string, datos: ResetPasswordDTO): Promise<any> => {
//   const res = await api.post(API_ROUTES.users.resetPassword(id), datos);
//   return res.data;
// };
