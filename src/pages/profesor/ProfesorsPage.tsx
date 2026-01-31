import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
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

// import { listarMaterias, editarMateria, eliminarMateria } from "../../services/materiaService";
import { listarMaterias, editarMateria, eliminarMateria } from "../../services/materia/materiaService";
import { selectorGrado } from "../../services/gradoService";
import { MateriaResponse, SelectorOption } from "../../types";

const ProfesorPage: React.FC = () => {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState<MateriaResponse[]>([]);
  const [grados, setGrados] = useState<SelectorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGrados, setLoadingGrados] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedMateria, setSelectedMateria] = useState<MateriaResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchMaterias();
    fetchGrados();
  }, []);

  const fetchMaterias = async () => {
    try {
      setLoading(true);
      const data = await listarMaterias();
      setMaterias(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar materias");
    } finally {
      setLoading(false);
    }
  };

  const fetchGrados = async () => {
    try {
      setLoadingGrados(true);
      const data = await selectorGrado();
      setGrados(data);
    } catch (err) {
      console.error("Error cargando grados", err);
    } finally {
      setLoadingGrados(false);
    }
  };

  const handleCreate = () => navigate("/profesores/create");

  const handleEliminar = async (id: number) => {
    ModalSweetAlert("delete", async () => {
      try {
        await eliminarMateria(id);
        setMaterias((prev) => prev.filter((m) => m.id !== id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Materia eliminada correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        console.error(err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Error al eliminar la materia");
        setOpenSnackbar(true);
      }
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materias;

    return materias.filter((m) =>
      m.nombre.toLowerCase().includes(q) ||
      m.gradoNombre.toLowerCase().includes(q)
    );
  }, [materias, search]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Profesores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? "Cargando..." : `${filtered.length} registro(s)`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Buscar por materia o grado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
            sx={{ minWidth: 320 }}
          />

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Tabla */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Materia</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Grado</TableCell>
              <TableCell sx={{ fontWeight: 800, width: 140 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>{m.nombre}</Typography>
                </TableCell>

                <TableCell>
                  <Chip size="small" label={m.gradoNombre} variant="outlined" />
                </TableCell>

                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        setSelectedMateria(m);
                        setOpenModal(true);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleEliminar(m.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography color="text.secondary">
                    No hay materias que coincidan con la búsqueda.
                  </Typography>
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* MODAL EDITAR */}
      {openModal && selectedMateria && (
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
          onClick={() => setOpenModal(false)}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 520,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Editar Materia
            </Typography>

            <TextField
              label="Nombre"
              fullWidth
              margin="normal"
              value={selectedMateria.nombre}
              onChange={(e) =>
                setSelectedMateria({ ...selectedMateria, nombre: e.target.value })
              }
            />

            <FormControl fullWidth margin="normal" required disabled={loadingGrados}>
              <InputLabel id="grado-edit">Grado</InputLabel>
              <Select
                labelId="grado-edit"
                label="Grado"
                value={selectedMateria.gradoId}
                onChange={(e) =>
                  setSelectedMateria({
                    ...selectedMateria,
                    gradoId: Number(e.target.value),
                  })
                }
              >
                <MenuItem value={0} disabled>
                  Selecciona un grado
                </MenuItem>
                {grados.map((g) => (
                  <MenuItem key={g.key} value={g.key}>
                    {g.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await editarMateria(selectedMateria.id, {
                      nombre: selectedMateria.nombre.trim(),
                      gradoId: selectedMateria.gradoId,
                    });

                    setMaterias((prev) =>
                      prev.map((m) =>
                        m.id === selectedMateria.id
                          ? {
                              ...m,
                              nombre: selectedMateria.nombre,
                              gradoId: selectedMateria.gradoId,
                              gradoNombre:
                                grados.find((g) => g.key === selectedMateria.gradoId)
                                  ?.value ?? m.gradoNombre,
                            }
                          : m
                      )
                    );

                    setSnackbarSeverity("success");
                    setSnackbarMessage("Materia actualizada correctamente");
                    setOpenSnackbar(true);
                    setOpenModal(false);
                  } catch (err) {
                    console.error(err);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Error al actualizar la materia");
                    setOpenSnackbar(true);
                  }
                }}
              >
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
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfesorPage;
