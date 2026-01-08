import React, { useState } from "react";
import { TextField, Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crearEstudiante } from "../../services/estudianteService";


const CreateStudentForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    representante: "",
    telefono: "",
    correo: "",
    nivel: 1,
  });
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await crearEstudiante(formData); // Función para crear estudiante (POST request)
      setSnackbarMessage("Estudiante creado exitosamente");
      setOpenSnackbar(true);
      navigate("/students"); // Redirigir a la página de estudiantes
    } catch (error) {
      setSnackbarMessage("Error al crear estudiante");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Crear Estudiante
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Cédula"
          name="cedula"
          fullWidth
          margin="normal"
          value={formData.cedula}
          onChange={handleChange}
          required
        />
        <TextField
          label="Representante"
          name="representante"
          fullWidth
          margin="normal"
          value={formData.representante}
          onChange={handleChange}
          required
        />
        <TextField
          label="Teléfono"
          name="telefono"
          fullWidth
          margin="normal"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <TextField
          label="Correo"
          name="correo"
          fullWidth
          margin="normal"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <TextField
          label="Nivel"
          name="nivel"
          fullWidth
          margin="normal"
          type="number"
          value={formData.nivel}
          onChange={handleChange}
          required
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Crear Estudiante
          </Button>
        </Box>
      </form>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateStudentForm;
