import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Página no encontrada</Typography>
      <Typography variant="body2" color="text.secondary">
        La ruta solicitada no existe en la plataforma.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Volver al dashboard
      </Button>
    </Stack>
  );
};
