import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginApi } from "../services/authService";

type FormState = {
  usernameOrEmail: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return form.usernameOrEmail.trim().length >= 3 && form.password.trim().length >= 4;
  }, [form]);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrorMsg(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      // ✅ Si tu backend usa username:
      // const res = await loginApi({ username: form.usernameOrEmail, password: form.password });

      // ✅ Si tu backend usa email:
      // const res = await loginApi({ email: form.usernameOrEmail, password: form.password });

      // ✅ Versión genérica:
      const res = await loginApi({ username: form.usernameOrEmail, password: form.password });

      login(res);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      // Mensaje “humano”
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Credenciales inválidas o error del servidor.";

      setErrorMsg(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        position: "relative",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo (sin librerías) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(600px circle at 20% 20%, rgba(30,64,175,0.18), transparent 60%), radial-gradient(700px circle at 80% 30%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(800px circle at 50% 90%, rgba(2,132,199,0.12), transparent 60%)",
          filter: "saturate(120%)",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          borderRadius: 4,
          p: 3,
          border: "1px solid rgba(226,232,240,0.9)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        {/* Header */}
        <Stack spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              display: "grid",
              placeItems: "center",
              borderRadius: "16px",
              bgcolor: "primary.main",
              color: "white",
              boxShadow: "0 10px 25px rgba(30,64,175,0.25)",
            }}
          >
            <LockRoundedIcon />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Iniciar sesión
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center">
            Accede al panel de Matrículas AMA con tu usuario y contraseña.
          </Typography>
        </Stack>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Usuario o correo"
              placeholder="Ej: admin"
              value={form.usernameOrEmail}
              onChange={handleChange("usernameOrEmail")}
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <TextField
              label="Contraseña"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || submitting}
              sx={{
                py: 1.2,
                borderRadius: 3,
                fontWeight: 800,
              }}
            >
              {submitting ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} color="inherit" />
                  <span>Ingresando...</span>
                </Stack>
              ) : (
                "Ingresar"
              )}
            </Button>

            <Divider sx={{ opacity: 0.6 }} />

            <Typography variant="caption" color="text.secondary" align="center">
              Consejo: usa un usuario de prueba como <b>admin</b> y tu contraseña configurada.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
