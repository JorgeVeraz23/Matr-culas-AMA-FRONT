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
import { crearMateria } from "../../services/materiaService";
import { api } from "../../services/apitClient";
import { API_ROUTES } from "../../utils/utils";

type GradoOption = { key: number; value: string };

const CreateProfesorForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{ nombre: string; gradoId: number }>({
    nombre: "",
    gradoId: 0,
  });

  const [grados, setGrados] = useState<GradoOption[]>([]);
  const [loadingGrados, setLoadingGrados] = useState(true);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const canSubmit = useMemo(() => {
    return formData.nombre.trim().length > 0 && formData.gradoId > 0;
  }, [formData]);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        setLoadingGrados(true);

        // ✅ Trae: [{ key: 1, value: "Primero de Básica" }, ...]
        const res = await api.get<GradoOption[]>(API_ROUTES.grado.selector);
        setGrados(res.data ?? []);
      } catch (err) {
        console.error("Error cargando grados", err);
        setGrados([]);
        setSnackbarSeverity("error");
        setSnackbarMessage("No se pudieron cargar los grados");
        setOpenSnackbar(true);
      } finally {
        setLoadingGrados(false);
      }
    };

    fetchGrados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Completa el nombre y selecciona un grado");
      setOpenSnackbar(true);
      return;
    }

    try {
      await crearMateria({
        nombre: formData.nombre.trim(),
        gradoId: Number(formData.gradoId),
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Materia creada exitosamente");
      setOpenSnackbar(true);

      // ✅ cambia la ruta según tu app
      navigate("/materia", { replace: true });
    } catch (error) {
      console.error("Error al crear materia", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al crear Materia");
      setOpenSnackbar(true);
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
        Crear Materia
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Completa el nombre y selecciona el grado al que pertenece.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre de la Materia"
          name="nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="grado-label">Grado</InputLabel>
          <Select
            labelId="grado-label"
            label="Grado"
            value={formData.gradoId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gradoId: Number(e.target.value) }))
            }
            disabled={loadingGrados}
          >
            <MenuItem value={0} disabled>
              {loadingGrados ? "Cargando grados..." : "Selecciona un grado"}
            </MenuItem>

            {grados.map((g) => (
              <MenuItem key={g.key} value={g.key}>
                {g.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/materias")}
            disabled={loadingGrados}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || loadingGrados}
            startIcon={loadingGrados ? <CircularProgress size={16} /> : undefined}
          >
            Crear Materia
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

export default CreateProfesorForm;
