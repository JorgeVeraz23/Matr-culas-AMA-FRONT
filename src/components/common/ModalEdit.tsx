import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

interface ModalGenéricoProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data?: any; // Datos que se pasan al modal (para editar o crear)
  fields: { label: string, name: string }[]; // Campos dinámicos para el formulario
}

const ModalGenérico: React.FC<ModalGenéricoProps> = ({
  open,
  onClose,
  onSave,
  data,
  fields
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (data) {
      setFormData(data); // Precargar datos si están disponibles (para edición)
    } else {
      // Si no hay datos, inicializar con valores vacíos o predeterminados
      const initialData = fields.reduce((acc: any, field) => {
        acc[field.name] = ""; // Inicializar todos los campos como vacíos
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [data, fields]);

  const handleSaveChanges = () => {
    onSave(formData);  // Llama a la función onSave pasando los datos editados
    onClose();  // Cierra el modal después de guardar los cambios
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {data ? "Editar" : "Crear"} Registro
        </Typography>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            fullWidth
            margin="normal"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
          />
        ))}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            {data ? "Guardar Cambios" : "Crear"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalGenérico;
