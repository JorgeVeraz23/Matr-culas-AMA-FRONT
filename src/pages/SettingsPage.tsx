import React from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from "@mui/material";
import { Card } from "../components/common/Card";

export const SettingsPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Configuración</Typography>
        <Typography variant="body2" color="text.secondary">
          Parámetros generales de la plataforma de matrículas.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card title="Período lectivo">
            <Stack spacing={2}>
              <TextField
                size="small"
                label="Año lectivo"
                defaultValue="2025-2026"
              />
              <TextField
                size="small"
                type="date"
                label="Fecha de inicio"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="Fecha de cierre de matrículas"
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained">Guardar cambios</Button>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card title="Parámetros de validación documental">
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Requerir todos los documentos para finalizar matrícula"
              />
              <FormControlLabel
                control={<Switch />}
                label="Permitir carga posterior de documentos pendientes"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Notificar por correo cuando se rechace un documento"
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
