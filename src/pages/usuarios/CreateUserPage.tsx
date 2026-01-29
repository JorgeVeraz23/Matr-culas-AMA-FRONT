import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apitClient";
import { API_ROUTES } from "../../utils/utils";
import { crearUsuario } from "../../services/user/userService";

type RolApi = { id: string; name: string };
type RolOption = { key: string; value: string }; // usamos el name como key/value

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    role: string;
  }>({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [roles, setRoles] = useState<RolOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      formData.username.trim().length >= 3 &&
      formData.password.trim().length >= 6 &&
      formData.role.trim().length > 0
    );
  }, [formData]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);

        // backend: [{ id, name }]
        const res = await api.get<RolApi[]>(API_ROUTES.rol.selector);

        const mapped: RolOption[] = (res.data ?? []).map((r) => ({
          key: r.name,   // 👈 clave = name
          value: r.name, // 👈 value = name (lo que backend espera)
        }));

        setRoles(mapped);
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

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Completa username, password y selecciona un rol");
      setOpenSnackbar(true);
      return;
    }

    try {
      setSubmitting(true);

      await crearUsuario({
        username: formData.username.trim(),
        email: formData.email.trim() ? formData.email.trim() : null,
        password: formData.password.trim(),
        role: formData.role.trim(),
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Usuario creado exitosamente");
      setOpenSnackbar(true);

      // ✅ ajusta esta ruta a tu listado real
      navigate("/usuarios", { replace: true });
    } catch (error) {
      console.error("Error al crear usuario", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al crear Usuario");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 640,
        mx: "auto",
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        Crear Usuario
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Completa los datos y asigna un rol.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          required
        />

        <TextField
          label="Email (opcional)"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            label="Rol"
            value={formData.role}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: String(e.target.value) }))}
            disabled={loadingRoles || submitting}
          >
            <MenuItem value="" disabled>
              {loadingRoles ? "Cargando roles..." : "Selecciona un rol"}
            </MenuItem>

            {roles.map((r) => (
              <MenuItem key={r.key} value={r.value}>
                {r.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/usuarios")}
            disabled={loadingRoles || submitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || loadingRoles || submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : undefined}
          >
            Crear Usuario
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateUserForm;
