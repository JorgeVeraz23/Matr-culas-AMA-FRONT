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
import { crearOferta } from "../../services/ofertaService";

type Option = { key: number; value: string };

export default function CreateOfertaPage() {
  const navigate = useNavigate();

  const [gradoId, setGradoId] = useState(0);
  const [paraleloId, setParaleloId] = useState(0);
  const [anioLectivoId, setAnioLectivoId] = useState(0);
  const [cupos, setCupos] = useState<number>(30);

  const [grados, setGrados] = useState<Option[]>([]);
  const [paralelos, setParalelos] = useState<Option[]>([]);
  const [anios, setAnios] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const canSubmit = useMemo(() => {
    return gradoId > 0 && paraleloId > 0 && anioLectivoId > 0 && cupos > 0;
  }, [gradoId, paraleloId, anioLectivoId, cupos]);

  useEffect(() => {
    const loadSelectors = async () => {
      try {
        setLoading(true);
        const [g, p, a] = await Promise.all([
          api.get<Option[]>(API_ROUTES.grado.selector),
          api.get<Option[]>(API_ROUTES.paralelo.selector),
          api.get<Option[]>(API_ROUTES.anioLectivo.selector),
        ]);

        setGrados(g.data ?? []);
        setParalelos(p.data ?? []);
        setAnios(a.data ?? []);
      } catch (e) {
        console.error(e);
        setSnackbarSeverity("error");
        setSnackbarMessage("No se pudieron cargar los selectores (grado/paralelo/año).");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    loadSelectors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Completa todos los campos.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await crearOferta({
        gradoId,
        paraleloId,
        anioLectivoId,
        cupos,
      });

      // ✅ MISMO MENSAJE “tipo paralelo”: éxito y luego navegar
      setSnackbarSeverity("success");
      setSnackbarMessage("Oferta creada exitosamente");
      setOpenSnackbar(true);

      setTimeout(() => navigate("/ofertas", { replace: true }), 900);
    } catch (err: any) {
      console.error(err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al crear la oferta (revisa IDs / FK).");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 720,
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
        Crear Oferta (Grado + Paralelo + Año)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define cupos disponibles para un paralelo en un año lectivo.
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="grado-label">Grado</InputLabel>
          <Select
            labelId="grado-label"
            label="Grado"
            value={gradoId}
            disabled={loading}
            onChange={(e) => setGradoId(Number(e.target.value))}
          >
            <MenuItem value={0} disabled>
              {loading ? "Cargando..." : "Selecciona un grado"}
            </MenuItem>
            {grados.map((o) => (
              <MenuItem key={o.key} value={o.key}>
                {o.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="paralelo-label">Paralelo</InputLabel>
          <Select
            labelId="paralelo-label"
            label="Paralelo"
            value={paraleloId}
            disabled={loading}
            onChange={(e) => setParaleloId(Number(e.target.value))}
          >
            <MenuItem value={0} disabled>
              {loading ? "Cargando..." : "Selecciona un paralelo"}
            </MenuItem>
            {paralelos.map((o) => (
              <MenuItem key={o.key} value={o.key}>
                {o.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="anio-label">Año lectivo</InputLabel>
          <Select
            labelId="anio-label"
            label="Año lectivo"
            value={anioLectivoId}
            disabled={loading}
            onChange={(e) => setAnioLectivoId(Number(e.target.value))}
          >
            <MenuItem value={0} disabled>
              {loading ? "Cargando..." : "Selecciona un año lectivo"}
            </MenuItem>
            {anios.map((o) => (
              <MenuItem key={o.key} value={o.key}>
                {o.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Cupos"
          type="number"
          fullWidth
          margin="normal"
          value={cupos}
          inputProps={{ min: 1 }}
          onChange={(e) => setCupos(Number(e.target.value))}
          required
        />

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate("/ofertas")}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            Crear Oferta
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3500}
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
}
