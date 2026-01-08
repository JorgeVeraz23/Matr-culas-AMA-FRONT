import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");  // Redirige al Dashboard
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
          La ruta solicitada no existe en la plataforma.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{
          padding: "10px 20px",
          fontWeight: "600",
          fontSize: "16px",
          borderRadius: "8px",
          boxShadow: 3,
        }}
        onClick={handleGoBack}
      >
        Volver al Dashboard
      </Button>
    </Container>
  );
};

export default NotFoundPage;
