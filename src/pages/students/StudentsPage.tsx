import React, { useState, useEffect, useMemo } from "react";
import { Estudiante } from "../../types";
import {
  listarEstudiantes,
  eliminarEstudiante,
  editarEstudiante,
} from "../../services/estudianteService";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import ModalGenérico from "../../components/common/ModalEdit";
import ModalSweetAlert from "../../components/common/ModalSweetAlert";

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listarEstudiantes();
      setEstudiantes(data);
    } catch (err) {
      setError("Error al cargar estudiantes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    ModalSweetAlert("delete", async () => {
      try {
        await eliminarEstudiante(id);
        setEstudiantes((prev) => prev.filter((e) => e.id !== id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Estudiante eliminado correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        setError("Error al eliminar estudiante");
        console.error(err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Hubo un error al eliminar el estudiante");
        setOpenSnackbar(true);
      }
    });
  };

  const handleOpenModal = (student: Estudiante) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handleSaveChanges = async (data: Estudiante) => {
    if (!selectedStudent) return;

    try {
      const updatedStudent = await editarEstudiante(selectedStudent.id, data);
      setEstudiantes((prev) =>
        prev.map((est) => (est.id === updatedStudent.id ? updatedStudent : est))
      );
      setSnackbarSeverity("success");
      setSnackbarMessage("Datos actualizados correctamente");
      setOpenSnackbar(true);
    } catch (err) {
      setError("Error al actualizar estudiante");
      console.error(err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Hubo un error al actualizar el estudiante");
      setOpenSnackbar(true);
    } finally {
      setOpenModal(false);
    }
  };

  const handleCreate = () => {
    navigate("/students/create");
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Búsqueda SOLO con los campos reales del API
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return estudiantes;

    return estudiantes.filter((e) => {
      const nombre = (e.nombre ?? "").toLowerCase();
      const ced = (e.cedula ?? "").toLowerCase();
      const correo = (e.correo ?? "").toLowerCase();
      const tel = (e.telefono ?? "").toLowerCase();
      return (
        nombre.includes(q) ||
        ced.includes(q) ||
        correo.includes(q) ||
        tel.includes(q) 
      );
    });
  }, [estudiantes, search]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-EC");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2 } }}>
      {/* Header + acciones */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Estudiantes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? "Cargando..." : `${filtered.length} registro(s)`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Buscar por nombre, cédula, correo o teléfono..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" style={{ marginRight: 8 }} />,
            }}
            sx={{ minWidth: { xs: "100%", sm: 420 } }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Crear
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Estudiante</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Cédula</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Edad</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Nacimiento</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Nivel</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 800, width: 140 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((est) => (
              <TableRow key={est.id} hover>
                {/* Estudiante */}
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {est.nombre}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                      {est.genero && <Chip size="small" label={est.genero} variant="outlined" />}
                      {typeof est.ultimoGradoAprobado !== "undefined" && (
                        <Chip
                          size="small"
                          label={`Últ. grado: ${est.ultimoGradoAprobado}`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {est.direccion ?? "-"}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{est.cedula}</TableCell>
                <TableCell>{formatDate(est.fechaNacimiento as any)}</TableCell>

                {/* Contacto */}
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2">Tel: {est.telefono ?? "-"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {est.correo ?? "-"}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip size="small" label={`Nivel ${est.nivel}`} />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={est.estado ?? "-"}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenModal(est)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleEliminar(est.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color="text.secondary">
                    No hay estudiantes que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color="text.secondary">Cargando estudiantes…</Typography>
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* ✅ Modal SOLO con campos reales del API */}
      <ModalGenérico
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        data={selectedStudent}
        fields={[
          { label: "Nombre Completo", name: "nombreCompleto" },
          { label: "Cédula", name: "cedula" },
          { label: "Edad", name: "edad" },
          { label: "Fecha Nacimiento", name: "fechaNacimiento" },
          { label: "Género", name: "genero" },
          { label: "Teléfono", name: "telefono" },
          { label: "Correo", name: "correo" },
          { label: "Dirección", name: "direccion" },
          { label: "Nivel", name: "nivel" },
          { label: "Último Grado Aprobado", name: "ultimoGradoAprobado" },
          { label: "Estado", name: "estado" },
        ]}
      />

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

export default StudentsPage;
