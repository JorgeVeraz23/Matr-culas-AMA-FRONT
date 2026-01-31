import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Chip,
  Alert,
  Snackbar,
  Skeleton,
  Stack,
  Autocomplete,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import { MatriculaResponseDto } from "../../types";
import { listarMatriculas } from "../../services/matriculaService";

const formatFecha = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("es-EC");
};

const estadoChipVariant = (estado: string) => {
  if (estado?.toLowerCase().includes("pend")) return "outlined";
  if (estado?.toLowerCase().includes("aprob")) return "filled";
  if (estado?.toLowerCase().includes("anul")) return "outlined";
  return "outlined";
};

const MatriculasPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<MatriculaResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // filtros
  const [periodo, setPeriodo] = useState<string>("2025-2026");
  const [search, setSearch] = useState<string>("");

  // paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const periodosDisponibles = useMemo(() => {
    const set = new Set<string>(["2025", "2024", "2023"]);
    data.forEach((m) => set.add(m.periodo));
    return Array.from(set).sort().reverse();
  }, [data]);

  const fetchData = async (p?: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await listarMatriculas(p);
      setData(res);
      setSnackbarSeverity("success");
      setSnackbarMessage("Matrículas cargadas correctamente");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las matrículas.");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al cargar matrículas");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(periodo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((m) => {
      const blob = [
        m.estudianteNombre,
        m.gradoNombre,
        m.paraleloNombre,
        m.periodo,
        m.estadoMatricula,
        String(m.id),
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });
  }, [data, search]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2, md: 3 } }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Matrículas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta por año lectivo y busca rápidamente por estudiante, curso o estado.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* 🔵 BOTÓN NUEVO */}
          <Button
            variant="contained"
            onClick={() => navigate("/matricula/create")}
            sx={{ fontWeight: 700 }}
          >
            + Crear matrícula
          </Button>

          <IconButton onClick={() => fetchData(periodo)} disabled={loading} title="Recargar">
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* FILTROS */}
      <Card sx={{ borderRadius: 2, mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "280px 1fr auto" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Autocomplete
              options={periodosDisponibles}
              value={periodo}
              onChange={(_, val) => setPeriodo(val ?? "")}
              renderInput={(params) => <TextField {...params} label="Año lectivo" />}
              disableClearable
            />

            <TextField
              label="Buscar"
              placeholder="Ej: Luis / Primero / A / Pendiente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setPeriodo("2025-2026");
              }}
              disabled={loading}
              sx={{ height: 56 }}
            >
              Limpiar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* TABLA */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estudiante</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Grado</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Paralelo</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Año lectivo</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Fecha</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton variant="rounded" height={34} />
                  </TableCell>
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Alert severity="info">No hay matrículas para mostrar.</Alert>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.id}</TableCell>
                  <TableCell>{m.estudianteNombre}</TableCell>
                  <TableCell>{m.gradoNombre}</TableCell>
                  <TableCell>{m.paraleloNombre}</TableCell>
                  <TableCell>{m.periodo}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.estadoMatricula}
                      variant={estadoChipVariant(m.estadoMatricula)}
                    />
                  </TableCell>
                  <TableCell>{formatFecha(m.fechaMatricula)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MatriculasPage;
