// src/pages/matriculas/CreateMatriculaPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Skeleton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { SelectorOption, CupoDisponible, CrearMatricula } from "../../types";
import { selectorEstudiantesSinMatricula } from "../../services/estudianteService";
import { crearMatricula } from "../../services/matriculaService";
import { obtenerCuposDisponiblesPorEstudiante } from "../../services/ofertaService";

const CreateMatriculaPage: React.FC = () => {
  const navigate = useNavigate();

  // selector estudiantes
  const [estudiantes, setEstudiantes] = useState<SelectorOption[]>([]);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<SelectorOption | null>(null);

  // cupos disponibles para el estudiante
  const [cupos, setCupos] = useState<CupoDisponible[]>([]);
  const [loadingCupos, setLoadingCupos] = useState(false);
  const [selectedGradoParaleloId, setSelectedGradoParaleloId] = useState<number | null>(null);

  // feedback
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // cargar selector al iniciar
  useEffect(() => {
    (async () => {
      try {
        setLoadingEstudiantes(true);
        setError("");
        const data = await selectorEstudiantesSinMatricula();
        setEstudiantes(data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el selector de estudiantes sin matrícula.");
      } finally {
        setLoadingEstudiantes(false);
      }
    })();
  }, []);

  // cargar cupos cuando se selecciona estudiante
  useEffect(() => {
    if (!estudianteSeleccionado) {
      setCupos([]);
      setSelectedGradoParaleloId(null);
      return;
    }

    (async () => {
      try {
        setLoadingCupos(true);
        setError("");
        setSelectedGradoParaleloId(null);

        const data = await obtenerCuposDisponiblesPorEstudiante(estudianteSeleccionado.key);
        setCupos(data ?? []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los cupos disponibles para este estudiante.");
        setCupos([]);
      } finally {
        setLoadingCupos(false);
      }
    })();
  }, [estudianteSeleccionado]);

  const selectedCupo = useMemo(
    () => cupos.find((c) => c.gradoParaleloId === selectedGradoParaleloId) ?? null,
    [cupos, selectedGradoParaleloId]
  );

  const canConfirm = Boolean(estudianteSeleccionado && selectedCupo && !saving);

  const handleConfirm = async () => {
    if (!estudianteSeleccionado || !selectedCupo) return;

    try {
      setSaving(true);
      setError("");

      const payload: CrearMatricula = {
        estudianteId: estudianteSeleccionado.key,
        gradoParaleloId: selectedCupo.gradoParaleloId,
      };

      await crearMatricula(payload);

      setSnackbarSeverity("success");
      setSnackbarMessage("Matrícula creada correctamente");
      setSnackbarOpen(true);

      navigate("/matriculas");
    } catch (e) {
      console.error(e);
      setSnackbarSeverity("error");
      setSnackbarMessage("No se pudo crear la matrícula");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Crear Matrícula
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selecciona un estudiante sin matrícula y elige un cupo disponible (gradoParalelo).
          </Typography>
        </Box>

        <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
          Volver
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              1) Buscar estudiante (sin matrícula)
            </Typography>

            {loadingEstudiantes ? (
              <Skeleton variant="rounded" height={56} />
            ) : (
              <Autocomplete
                options={estudiantes}
                value={estudianteSeleccionado}
                onChange={(_, val) => setEstudianteSeleccionado(val)}
                getOptionLabel={(o) => o.value}
                isOptionEqualToValue={(a, b) => a.key === b.key}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar por nombre o cédula"
                    placeholder="Ej: Jorge Dima / 095..."
                  />
                )}
              />
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Estudiante seleccionado
            </Typography>

            {!estudianteSeleccionado ? (
              <Alert severity="info">Selecciona un estudiante para ver cupos.</Alert>
            ) : (
              <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>{estudianteSeleccionado.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {estudianteSeleccionado.key}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip size="small" label="Sin matrícula" variant="outlined" />
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              3) Confirmación
            </Typography>

            {!selectedCupo ? (
              <Alert severity="warning">Selecciona un cupo para habilitar “Confirmar matrícula”.</Alert>
            ) : (
              <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>Resumen</Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    <strong>Estudiante:</strong> {estudianteSeleccionado?.value}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Curso:</strong> {selectedCupo.gradoNombre} “{selectedCupo.paraleloNombre}”
                  </Typography>
                  <Typography variant="body2">
                    <strong>Año lectivo:</strong> {selectedCupo.anioLectivo}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Disponibles:</strong> {selectedCupo.disponibles} / {selectedCupo.cupos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado inicial: Pendiente (backend)
                  </Typography>
                </Stack>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1.5, mt: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => navigate("/matriculas")} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleConfirm} disabled={!canConfirm}>
                {saving ? "Guardando..." : "Confirmar matrícula"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              2) Seleccionar cupo disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Lista de gradoParalelo disponibles para el estudiante seleccionado.
            </Typography>

            {!estudianteSeleccionado ? (
              <Alert severity="info">Primero selecciona un estudiante.</Alert>
            ) : loadingCupos ? (
              <Box>
                <Skeleton variant="rounded" height={52} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={52} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={52} />
              </Box>
            ) : cupos.length === 0 ? (
              <Alert severity="warning">No hay cupos disponibles para este estudiante.</Alert>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 64 }} />
                      <TableCell sx={{ fontWeight: 800 }}>Grado</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Paralelo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Año lectivo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Cupos</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Disponibles</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cupos.map((c) => {
                      const disabled = c.disponibles <= 0;
                      const selected = selectedGradoParaleloId === c.gradoParaleloId;

                      return (
                        <TableRow
                          key={c.gradoParaleloId}
                          hover
                          selected={selected}
                          sx={{
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.6 : 1,
                          }}
                          onClick={() => {
                            if (disabled) return;
                            setSelectedGradoParaleloId(c.gradoParaleloId);
                          }}
                        >
                          <TableCell>
                            <Radio
                              checked={selected}
                              disabled={disabled}
                              onChange={() => setSelectedGradoParaleloId(c.gradoParaleloId)}
                              value={c.gradoParaleloId}
                            />
                          </TableCell>

                          <TableCell>{c.gradoNombre}</TableCell>
                          <TableCell>{c.paraleloNombre}</TableCell>
                          <TableCell>{c.anioLectivo}</TableCell>
                          <TableCell>
                            {c.cupos} / {c.ocupados}
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={c.disponibles} />
                          </TableCell>
                          <TableCell>
                            {disabled ? (
                              <Chip size="small" label="Sin cupos" variant="outlined" />
                            ) : (
                              <Chip size="small" label="Disponible" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateMatriculaPage;
