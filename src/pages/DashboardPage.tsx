import React from "react";
import { Grid, Typography, Stack, Chip } from "@mui/material";
import { Card } from "../components/common/Card";

export const DashboardPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Dashboard general</Typography>
        <Typography variant="body2" color="text.secondary">
          Resumen rápido de matrículas y documentos de la institución.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card title="Estudiantes activos" subtitle="Año lectivo 2025-2026">
            <Typography variant="h3" sx={{ fontSize: 30, fontWeight: 700 }}>
              428
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estudiantes con matrícula vigente.
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card title="Matrículas pendientes">
            <Typography
              variant="h3"
              sx={{ fontSize: 30, fontWeight: 700, color: "warning.main" }}
            >
              32
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitudes en espera de revisión.
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card title="Documentos por validar">
            <Typography
              variant="h3"
              sx={{ fontSize: 30, fontWeight: 700, color: "error.main" }}
            >
              14
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Archivos digitales pendientes de verificación.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            title="Matrículas por curso"
            subtitle="Distribución general por grado."
          >
            <Stack spacing={1}>
              {[
                "1ro de Básica: 40 estudiantes",
                "2do de Básica: 38 estudiantes",
                "3ro de Básica: 42 estudiantes",
                "4to de Básica: 35 estudiantes",
                "5to de Básica: 33 estudiantes"
              ].map((line) => (
                <Typography key={line} variant="body2">
                  {line}
                </Typography>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            title="Últimos documentos cargados"
            subtitle="Control de documentación digital."
          >
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label="En revisión" color="warning" />
                <Typography variant="body2">
                  Certificado de nacimiento - Juan Pérez - 22/10/2025
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label="Validado" color="success" />
                <Typography variant="body2">
                  Cédula representante - Ana López - 21/10/2025
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label="En revisión" color="warning" />
                <Typography variant="body2">
                  Planilla de servicios básicos - 20/10/2025
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
