import React, { useState, useEffect } from "react";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Snackbar, Alert, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ModalGenérico from "../../components/common/ModalEdit";
import ModalSweetAlert from "../../components/common/ModalSweetAlert";
import { editarParalelo, eliminarParalelo, listarParalelo } from "../../services/paraleloService";

const ParalelosPage: React.FC = () => {
  const navigate = useNavigate();
  const [paralelos, setParalelos] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedParalelo, setSelectedParalelo] = useState<any | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchParalelos();
  }, []);

  const fetchParalelos = async () => {
    try {
      const data = await listarParalelo();
      setParalelos(data);
    } catch (err) {
      console.error("Error al cargar paralelos", err);
    }
  };

  const handleEliminar = async (id: number) => {
    ModalSweetAlert("delete", async () => {
      try {
        await eliminarParalelo(id);
        setParalelos(paralelos.filter((p) => p.id !== id));
        setSnackbarMessage("Paralelo eliminado correctamente");
        setOpenSnackbar(true);
      } catch (err) {
        console.error("Error al eliminar paralelo", err);
        setSnackbarMessage("Hubo un error al eliminar el paralelo");
        setOpenSnackbar(true);
      }
    });
  };

  const handleOpenModal = (paralelo: any) => {
    setSelectedParalelo(paralelo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedParalelo(null);
  };
const handleSaveChanges = async (data: any) => {
  try {
    // data debe traer id y nombre
    await editarParalelo({ id: data.id, nombre: data.nombre });

    // actualiza la tabla localmente
    setParalelos((prev) =>
      prev.map((p) => (p.id === data.id ? { ...p, nombre: data.nombre } : p))
    );
 setOpenSnackbar(true);
    setSnackbarMessage("Paralelo actualizado correctamente");
   
    handleCloseModal();
  } catch (err) {
    console.error("Error al actualizar paralelo", err);
    setSnackbarMessage("Hubo un error al actualizar el paralelo");
    setOpenSnackbar(true);
  }
};

  const handleCreate = () => {
    navigate("/paralelos/create");
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
        Crear Paralelo
      </Button>
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="paralelos table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paralelos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(p)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(p.id)}>
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
          count={paralelos.length}
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
        data={selectedParalelo}
        fields={[
          { label: "Nombre", name: "nombre" },
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

export default ParalelosPage;
