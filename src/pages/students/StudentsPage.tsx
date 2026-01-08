import React, { useState, useEffect } from "react";
import { Estudiante } from "../../types";
import { listarEstudiantes, eliminarEstudiante, editarEstudiante } from "../../services/estudianteService";
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
// import ModalGenérico from "./ModalGenérico"; // Modal genérico de edición
// import ModalSweetAlert from "./ModalSweetAlert"; // SweetAlert genérico para eliminar
import ModalGenérico from "../../components/common/ModalEdit";
import ModalSweetAlert from "../../components/common/ModalSweetAlert";

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null); // Estudiante seleccionado
  const [openModal, setOpenModal] = useState(false); // Estado del modal
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
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
        setEstudiantes(estudiantes.filter((e) => e.id !== id));
        setSnackbarMessage("Estudiante eliminado correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        setError("Error al eliminar estudiante");
        console.error(err);
        setSnackbarMessage("Hubo un error al eliminar el estudiante");
        setOpenSnackbar(true);
      }
    });
  };

  // Abre el modal para editar un estudiante y pasa los datos al modal
  const handleOpenModal = (student: Estudiante) => {
    setSelectedStudent(student); // Establece el estudiante seleccionado
    setOpenModal(true); // Abre el modal
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  // Función para guardar cambios en el estudiante (con PUT request)
  const handleSaveChanges = async (data: Estudiante) => {
    if (selectedStudent) {
      try {
        const updatedStudent = await editarEstudiante(selectedStudent.id, data);
        setEstudiantes(estudiantes.map(est => est.id === updatedStudent.id ? updatedStudent : est));
        setSnackbarMessage("Datos actualizados correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        setError("Error al actualizar estudiante");
        console.error(err);
        setSnackbarMessage("Hubo un error al actualizar el estudiante");
        setOpenSnackbar(true);
      }
    }
    setOpenModal(false); // Cierra el modal después de guardar
  };

  const handleCreate = () => {
    navigate("/students/create");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={handleCreate}
      >
        Crear Estudiante
      </Button>
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Cédula</strong></TableCell>
              <TableCell><strong>Representante</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Correo</strong></TableCell>
              <TableCell><strong>Nivel</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((est) => (
                <TableRow key={est.id}>
                  <TableCell>{est.nombre}</TableCell>
                  <TableCell>{est.cedula}</TableCell>
                  <TableCell>{est.representante}</TableCell>
                  <TableCell>{est.telefono}</TableCell>
                  <TableCell>{est.correo}</TableCell>
                  <TableCell>{est.nivel}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(est)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(est.id)}>
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
          count={estudiantes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* ModalGenérico para editar */}
      <ModalGenérico
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        data={selectedStudent}
        fields={[
          { label: "Nombre", name: "nombre" },
          { label: "Cédula", name: "cedula" },
          { label: "Representante", name: "representante" },
          { label: "Teléfono", name: "telefono" },
          { label: "Correo", name: "correo" },
          { label: "Nivel", name: "nivel" },
        ]}
      />

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StudentsPage;
