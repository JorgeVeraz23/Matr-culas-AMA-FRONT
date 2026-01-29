import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import { cambiarContrasena } from "../../services/authService";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    newp: false,
    confirm: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const passwordError = useMemo(() => {
    const np = form.newPassword.trim();
    const cp = form.confirmNewPassword.trim();

    if (!np || !cp) return "";
    if (np.length < 6) return "La nueva contraseña debe tener al menos 6 caracteres";
    if (np !== cp) return "Las contraseñas no coinciden";
    if (form.currentPassword.trim() && np === form.currentPassword.trim())
      return "La nueva contraseña no puede ser igual a la actual";
    return "";
  }, [form]);

  const canSubmit = useMemo(() => {
    return (
      form.currentPassword.trim().length > 0 &&
      form.newPassword.trim().length >= 6 &&
      form.confirmNewPassword.trim().length >= 6 &&
      !passwordError
    );
  }, [form, passwordError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setSnackbarSeverity("error");
      setSnackbarMessage(passwordError || "Completa los campos correctamente");
      setOpenSnackbar(true);
      return;
    }

    try {
      setSubmitting(true);

      await cambiarContrasena({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Contraseña actualizada correctamente");
      setOpenSnackbar(true);

      // Limpia campos
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

      // opcional: volver atrás
      setTimeout(() => navigate(-1), 600);
    } catch (err) {
      console.error(err);
      setSnackbarSeverity("error");
      setSnackbarMessage("No se pudo cambiar la contraseña. Verifica tu contraseña actual.");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: "auto",
        mt: 4,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", mb: 1 }}>
        <LockResetIcon />
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Cambiar contraseña
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Escribe tu contraseña actual y la nueva contraseña dos veces para confirmar.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Contraseña actual"
          type={show.current ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.currentPassword}
          onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((p) => ({ ...p, current: !p.current }))} edge="end">
                  {show.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Nueva contraseña"
          type={show.newp ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.newPassword}
          onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
          required
          error={Boolean(passwordError)}
          helperText={passwordError || "Mínimo 6 caracteres"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((p) => ({ ...p, newp: !p.newp }))} edge="end">
                  {show.newp ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirmar nueva contraseña"
          type={show.confirm ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.confirmNewPassword}
          onChange={(e) => setForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
          required
          error={Boolean(passwordError)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))} edge="end">
                  {show.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : undefined}
          >
            Guardar
          </Button>
        </Box>
      </form>

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

export default ChangePasswordPage;
