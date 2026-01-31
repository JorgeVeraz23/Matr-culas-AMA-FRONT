import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { crearRepresentante } from "../../services/representanteService";
import { RepresentanteCreateDto } from "../../types";

const TIPOS_DOCUMENTO = ["CEDULA", "PASAPORTE", "RUC", "OTRO"] as const;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const CreateRepresentantePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RepresentanteCreateDto>({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CEDULA",
    numeroDocumento: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const setField = <K extends keyof RepresentanteCreateDto>(
    key: K,
    value: RepresentanteCreateDto[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errs: string[] = [];

    if (!form.nombres.trim()) errs.push("Nombres es obligatorio");
    if (!form.apellidos.trim()) errs.push("Apellidos es obligatorio");
    if (!form.tipoDocumento?.trim()) errs.push("Tipo de documento es obligatorio");
    if (!form.numeroDocumento.trim()) errs.push("Número de documento es obligatorio");

    if (form.email?.trim() && !isValidEmail(form.email)) {
      errs.push("Email no es válido");
    }

    return errs;
  };

  const handleSubmit = async () => {
    setError("");
    const errs = validate();
    if (errs.length) {
      setError(errs[0]);
      return;
    }

    try {
      setSubmitting(true);

      // Normaliza opcionales (backend espera string? => puedes enviar null)
      const payload: RepresentanteCreateDto = {
        ...form,
        telefono: form.telefono?.trim() ? form.telefono.trim() : null,
        email: form.email?.trim() ? form.email.trim() : null,
        direccion: form.direccion?.trim() ? form.direccion.trim() : null,
      };

      await crearRepresentante(payload);

      setSnackbarSeverity("success");
      setSnackbarMessage("Representante creado correctamente");
      setOpenSnackbar(true);

      navigate("/representante");
    } catch {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al crear el representante");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
            Crear representante
          </Typography>
          <Typography color="text.secondary">
            Registra un nuevo representante legal
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/representante")}
          >
            Volver
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ fontWeight: 800, px: 3 }}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography fontWeight={900} mb={2}>
            Datos del representante
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <TextField
              label="Nombres"
              value={form.nombres}
              onChange={(e) => setField("nombres", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Apellidos"
              value={form.apellidos}
              onChange={(e) => setField("apellidos", e.target.value)}
              fullWidth
              required
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={900} mb={2}>
            Documento de identidad
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <FormControl fullWidth required>
              <InputLabel>Tipo documento</InputLabel>
              <Select
                label="Tipo documento"
                value={form.tipoDocumento}
                onChange={(e) =>
                  setField("tipoDocumento", String(e.target.value))
                }
              >
                {TIPOS_DOCUMENTO.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Número documento"
              value={form.numeroDocumento}
              onChange={(e) => setField("numeroDocumento", e.target.value)}
              fullWidth
              required
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={900} mb={2}>
            Contacto (opcional)
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <TextField
              label="Teléfono"
              value={form.telefono ?? ""}
              onChange={(e) => setField("telefono", e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Dirección (opcional)"
            value={form.direccion ?? ""}
            onChange={(e) => setField("direccion", e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ fontWeight: 800, px: 4 }}
            >
              Guardar representante
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateRepresentantePage;
