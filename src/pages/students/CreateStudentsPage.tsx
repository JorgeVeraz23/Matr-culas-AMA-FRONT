import React, { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crearEstudiante } from "../../services/estudianteService";
import { selectorRepresentante } from "../../services/representanteService";
import { SelectorOption } from "../../types";

type Genero = "Masculino" | "Femenino" | "Otro";

type EstudianteCreateDto = {
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string; // "YYYY-MM-DD" para input date
  idRepresentante: number;
  telefono: string;
  correo: string;
  direccion: string;
  nivel: number;
  ultimoGradoAprobado: number;
  estado: string;
  genero: Genero;
};

const CreateStudentForm: React.FC = () => {
  const navigate = useNavigate();
  const [representantes, setRepresentantes] = useState<SelectorOption[]>([]);

  const [formData, setFormData] = useState<EstudianteCreateDto>({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: "",
    idRepresentante: 0,
    telefono: "",
    correo: "",
    direccion: "",
    nivel: 1,
    ultimoGradoAprobado: 0,
    estado: "Activo",
    genero: "Masculino",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const hoyISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Manejo de números (nivel / ultimoGradoAprobado)
    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (name: keyof EstudianteCreateDto, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



useEffect(() => {
  (async () => {
    try {
      const data = await selectorRepresentante();
      setRepresentantes(data);
    } catch {
      // opcional: snackbar
    }
  })();
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si tu backend espera "fechaNacimiento" con hora, puedes transformarlo aquí:
      // const payload = { ...formData, fechaNacimiento: `${formData.fechaNacimiento}T00:00:00` };

      const payload = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento
          ? `${formData.fechaNacimiento}T00:00:00`
          : "",
      };

      await crearEstudiante(payload);

      setSnackbarSeverity("success");
      setSnackbarMessage("Estudiante creado exitosamente");
      setOpenSnackbar(true);

      navigate("/students");
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al crear estudiante");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 980,
        margin: "0 auto",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Crear Estudiante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa los datos del estudiante y del representante.
          </Typography>
        </Box>

        <Button variant="text" onClick={() => navigate("/students")}>
          Volver
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit}>
        {/* SECCIÓN: Datos del estudiante */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Datos del estudiante
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={formData.nombre}
              onChange={handleChange}
              required
              autoFocus
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Apellido"
              name="apellido"
              fullWidth
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Cédula"
              name="cedula"
              fullWidth
              value={formData.cedula}
              onChange={handleChange}
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
              helperText="10 dígitos"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              fullWidth
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: hoyISO }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth required>
              <InputLabel id="genero-label">Género</InputLabel>
              <Select
                labelId="genero-label"
                label="Género"
                value={formData.genero}
                onChange={(e) => handleSelectChange("genero", e.target.value)}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Teléfono (estudiante)"
              name="telefono"
              fullWidth
              value={formData.telefono}
              onChange={handleChange}
              required
              inputProps={{ inputMode: "tel" }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              label="Dirección"
              name="direccion"
              fullWidth
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Nivel"
              name="nivel"
              type="number"
              fullWidth
              value={formData.nivel}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Último grado aprobado"
              name="ultimoGradoAprobado"
              type="number"
              fullWidth
              value={formData.ultimoGradoAprobado}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Correo (estudiante) (opcional)"
              name="correo"
              type="email"
              fullWidth
              value={formData.correo}
              onChange={handleChange}
              placeholder="ej: estudiante@gmail.com"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* SECCIÓN: Representante */}
        {/* SECCIÓN: Representante */}
<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
  Representante
</Typography>

<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <FormControl fullWidth required>
      <InputLabel id="representante-label">Representante</InputLabel>
      <Select
        labelId="representante-label"
        label="Representante"
        value={formData.idRepresentante}
        onChange={(e) =>
          handleSelectChange("idRepresentante", Number(e.target.value))
        }
      >
        <MenuItem value={0} disabled>
          Selecciona un representante
        </MenuItem>

        {representantes.map((r) => (
          <MenuItem key={r.key} value={r.key}>
            {r.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
</Grid>


        <Box sx={{ display: "flex", gap: 1.5, mt: 3, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate("/students")}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar estudiante
          </Button>
        </Box>
      </form>

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

export default CreateStudentForm;
