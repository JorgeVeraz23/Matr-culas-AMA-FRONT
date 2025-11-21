import React from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

export const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default"
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: 360, borderRadius: 3 }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: 22 }}>
              Ingreso a la plataforma
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Escuela Ana María Iza
            </Typography>
          </Box>
          <TextField size="small" label="Usuario" fullWidth />
          <TextField
            size="small"
            label="Contraseña"
            type="password"
            fullWidth
          />
          <Button variant="contained" fullWidth>
            Ingresar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
