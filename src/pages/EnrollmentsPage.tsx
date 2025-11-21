import React from "react";
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip
} from "@mui/material";
import { Card } from "../components/common/Card";
import { Enrollment } from "../types";

const mockEnrollments: Enrollment[] = [
  {
    id: 1,
    estudiante: "Juan Carlos Pérez",
    periodo: "2025-2026",
    fecha: "22/10/2025",
    estado: "Pendiente"
  },
  {
    id: 2,
    estudiante: "María López",
    periodo: "2025-2026",
    fecha: "21/10/2025",
    estado: "Aprobada"
  },
  {
    id: 3,
    estudiante: "Luis Cedeño",
    periodo: "2025-2026",
    fecha: "21/10/2025",
    estado: "Rechazada"
  }
];

export const EnrollmentsPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Matrículas</Typography>
        <Typography variant="body2" color="text.secondary">
          Revisión, aprobación y control de matrículas.
        </Typography>
      </Stack>

      <Card title="Listado de matrículas">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Período</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockEnrollments.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.estudiante}</TableCell>
                  <TableCell>{m.periodo}</TableCell>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.estado}
                      color={
                        m.estado === "Aprobada"
                          ? "success"
                          : m.estado === "Pendiente"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small">Ver detalle</Button>
                    <Button size="small">Aprobar</Button>
                    <Button size="small" color="error">
                      Rechazar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
};
