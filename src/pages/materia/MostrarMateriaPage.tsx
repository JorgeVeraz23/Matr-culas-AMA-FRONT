import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import ModalGenérico from "../../components/common/ModalEdit";
import ModalSweetAlert from "../../components/common/ModalSweetAlert";

import { editarMateria, listarMateria, eliminarMateria } from "../../services/materiaService";
import { api } from "../../services/apitClient";
import { API_ROUTES } from "../../utils/utils";
import { Materia } from "../../types";

type GradoOption = { key: number; value: string };

const MateriasPage: React.FC = () => {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [grados, setGrados] = useState<GradoOption[]>([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState<number>(0);

  const [openModal, setOpenModal] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<any | null>(null);

  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🔹 Cargar grados una sola vez
  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const res = await api.get<GradoOption[]>(API_ROUTES.grado.selector);
        setGrados(res.data ?? []);
      } catch (err) {
        console.error("Error cargando grados", err);
        setSnackbarSeverity("error");
        setSnackbarMessage("No se pudieron cargar los grados");
        setOpenSnackbar(true);
      }
    };
    fetchGrados();
  }, []);

  // 🔹 Cargar materias cada vez que cambie el grado seleccionado
  useEffect(() => {
    fetchMaterias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradoSeleccionado]);

  const fetchMaterias = async () => {
    try {
      const data = await listarMateria(gradoSeleccionado > 0 ? gradoSeleccionado : undefined);
      setMaterias(data);
      setPage(0);
    } catch (err) {
      console.error("Error al cargar materias", err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al cargar materias");
      setOpenSnackbar(true);
    }
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;

    ModalSweetAlert("delete", async () => {
      try {
        await eliminarMateria(id);
        setMaterias((prev) => prev.filter((m) => m.id !== id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Materia eliminada correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        console.error("Error al eliminar materia", err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Hubo un error al eliminar la materia");
        setOpenSnackbar(true);
      }
    });
  };

  const handleOpenModal = (materia: any) => {
    setSelectedMateria(materia);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMateria(null);
  };

  const handleSaveChanges = async (data: any) => {
    try {
      await editarMateria({
        id: data.id,
        nombre: data.nombre,
        gradoId: data.gradoId, // 👈 si tu modal también lo edita luego
      });

      setMaterias((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, nombre: data.nombre, gradoId: data.gradoId } : m))
      );

      setSnackbarSeverity("success");
      setSnackbarMessage("Materia actualizada correctamente");
      setOpenSnackbar(true);
      handleCloseModal();
    } catch (err) {
      console.error("Error al actualizar materia", err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Hubo un error al actualizar la materia");
      setOpenSnackbar(true);
    }
  };

  const handleCreate = () => navigate("/materias/create");

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const gradoLabel = useMemo(() => {
    const found = grados.find((g) => g.key === gradoSeleccionado);
    return found?.value ?? "Todos";
  }, [grados, gradoSeleccionado]);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Materias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Filtro actual: <b>{gradoLabel}</b>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          {/* SELECT GRADO */}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="grado-filter-label">Grado</InputLabel>
            <Select
              labelId="grado-filter-label"
              label="Grado"
              value={gradoSeleccionado}
              onChange={(e) => setGradoSeleccionado(Number(e.target.value))}
            >
              <MenuItem value={0}>Todos</MenuItem>
              {grados.map((g) => (
                <MenuItem key={g.key} value={g.key}>
                  {g.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Crear Materia
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="materias table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Grado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {materias
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>{(m as any).gradoNombre ?? m.gradoId}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(m)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(m.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={materias.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* MODAL EDIT */}
      <ModalGenérico
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        data={selectedMateria}
        fields={[
          { label: "Nombre", name: "nombre" },
          // Si luego quieres editar grado desde el modal, tu ModalEdit debe soportar select
          // { label: "GradoId", name: "gradoId" },
        ]}
      />

      {/* SNACKBAR */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MateriasPage;
