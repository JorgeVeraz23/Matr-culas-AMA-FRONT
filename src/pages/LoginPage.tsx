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
    return (
      form.usernameOrEmail.trim().length >= 3 &&
      form.password.trim().length >= 4
    );
  }, [form]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrorMsg(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await loginApi({
        username: form.usernameOrEmail,
        password: form.password,
      });

      login(res);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
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
        bgcolor: "#F4F6F8",
        px: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          p: 3.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* HEADER */}
        <Stack spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: "12px",
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <LockRoundedIcon />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Matrículas AMA
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center">
            Acceso al sistema de gestión académica
          </Typography>
        </Stack>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Usuario o correo"
              placeholder="ej. admin@escuela.edu"
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
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
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
                py: 1.25,
                borderRadius: 2.5,
                fontWeight: 700,
              }}
            >
              {submitting ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} color="inherit" />
                  <span>Ingresando...</span>
                </Stack>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <Divider />

            <Typography variant="caption" color="text.secondary" align="center">
              © {new Date().getFullYear()} Matrículas AMA · Sistema académico
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
