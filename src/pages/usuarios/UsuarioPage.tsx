import React, { useEffect, useMemo, useState } from "react";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import ModalSweetAlert from "../../components/common/ModalSweetAlert";

// ✅ services
import { listarUsuarios, actualizarUsuario, desactivarUsuario } from "../../services/user/userService";
import { api } from "../../services/apitClient";
import { API_ROUTES } from "../../utils/utils";

// Types
type Usuario = {
  id: string;
  userName: string;
  email: string | null;
  isActive: boolean;
  role: string | null;
};

type RolApi = { id: string; name: string };

const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Modal editar
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Roles selector
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Form modal (editable)
  const [editForm, setEditForm] = useState<{ username: string; email: string; role: string }>({
    username: "",
    email: "",
    role: "",
  });

  // Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Pagination + Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listarUsuarios(); // backend ya devuelve solo activos
      setUsuarios(data);
    } catch (err) {
      setError("Error al cargar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await api.get<RolApi[]>(API_ROUTES.rol.selector);
      const roleNames = (res.data ?? []).map((r) => r.name);
      setRoles(roleNames);
    } catch (err) {
      console.error("Error cargando roles", err);
      setRoles([]);
      setSnackbarSeverity("error");
      setSnackbarMessage("No se pudieron cargar los roles");
      setOpenSnackbar(true);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleCreate = () => {
    navigate("/usuarios/crear"); // ajusta si tu ruta es otra
  };

  const handleEliminar = async (id: string) => {
    ModalSweetAlert("delete", async () => {
      try {
        await desactivarUsuario(id); // soft delete
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Usuario desactivado correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        console.error(err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Hubo un error al desactivar el usuario");
        setOpenSnackbar(true);
      }
    });
  };

  const handleOpenModal = (user: Usuario) => {
    setSelectedUser(user);
    setEditForm({
      username: user.userName ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    const payload = {
      username: editForm.username.trim(),
      email: editForm.email.trim() ? editForm.email.trim() : null,
      role: editForm.role.trim(),
    };

    if (!payload.username || !payload.role) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Username y Rol son obligatorios");
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await actualizarUsuario(selectedUser.id, payload);

      // ✅ refrescar localmente (tu backend puede responder string o objeto; por eso usamos editForm)
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, userName: payload.username, email: payload.email, role: payload.role }
            : u
        )
      );

      setSnackbarSeverity("success");
      setSnackbarMessage("Usuario actualizado correctamente");
      setOpenSnackbar(true);
    } catch (err) {
      console.error(err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Hubo un error al actualizar el usuario");
      setOpenSnackbar(true);
    } finally {
      setOpenModal(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrado por búsqueda: username, email, role
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return usuarios;

    return usuarios.filter((u) => {
      const username = (u.userName ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const role = (u.role ?? "").toLowerCase();
      return username.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [usuarios, search]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 1, sm: 2 } }}>
      {/* Header + acciones */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? "Cargando..." : `${filtered.length} usuario(s)`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Buscar por username, email o rol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" style={{ marginRight: 8 }} />,
            }}
            sx={{ minWidth: { xs: "100%", sm: 360 } }}
          />

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear
          </Button>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 800, width: 140 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {u.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {u.id}
                  </Typography>
                </TableCell>

                <TableCell>{u.email ?? "-"}</TableCell>

                <TableCell>
                  <Chip size="small" label={u.role ?? "Sin rol"} variant="outlined" />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={u.isActive ? "Activo" : "Inactivo"}
                    color={u.isActive ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenModal(u)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Desactivar">
                    <IconButton onClick={() => handleEliminar(u.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary">
                    No hay usuarios que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary">Cargando usuarios…</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal EDIT (creativo, simple y claro) */}
      {openModal && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 1300,
            p: 2,
          }}
          onClick={handleCloseModal}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 560,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 6,
              border: "1px solid",
              borderColor: "divider",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
              Editar Usuario
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Actualiza username, email y rol (1 rol por usuario).
            </Typography>

            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={editForm.username}
              onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
              required
            />

            <TextField
              label="Email (opcional)"
              type="email"
              fullWidth
              margin="normal"
              value={editForm.email}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
            />

            <FormControl fullWidth margin="normal" required disabled={loadingRoles}>
              <InputLabel id="rol-edit-label">Rol</InputLabel>
              <Select
                labelId="rol-edit-label"
                label="Rol"
                value={editForm.role}
                onChange={(e) => setEditForm((p) => ({ ...p, role: String(e.target.value) }))}
              >
                <MenuItem value="" disabled>
                  {loadingRoles ? "Cargando roles..." : "Selecciona un rol"}
                </MenuItem>

                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2.5, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleSaveChanges} disabled={loadingRoles}>
                Guardar cambios
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;
