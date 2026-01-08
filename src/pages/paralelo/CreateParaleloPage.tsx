import React, { useState } from "react";
import { TextField, Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crearParalelo } from "../../services/paraleloService";
const CreateParaleloForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "" });
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearParalelo(formData); // Función para crear paralelo (POST request)
      setSnackbarMessage("Paralelo creado exitosamente");
      setOpenSnackbar(true);
      navigate("/paralelo"); // Redirige a la página de paralelos
    } catch (error) {
      setSnackbarMessage("Error al crear paralelo");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Crear Paralelo
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre del Paralelo"
          name="nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Crear Paralelo
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

export default CreateParaleloForm;
