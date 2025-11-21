import React from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid
} from "@mui/material";
import { Card } from "../components/common/Card";
import { DocumentFile } from "../types";

const mockDocuments: DocumentFile[] = [
  {
    id: 1,
    estudiante: "Juan Carlos Pérez",
    tipo: "Cédula del representante",
    nombreArchivo: "cedula_representante_juan.pdf",
    fechaSubida: "22/10/2025",
    estado: "En revisión"
  },
  {
    id: 2,
    estudiante: "María López",
    tipo: "Certificado de nacimiento",
    nombreArchivo: "cert_nacimiento_maria.pdf",
    fechaSubida: "21/10/2025",
    estado: "Validado"
  }
];

export const DocumentsPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Documentos digitales</Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión, carga y validación de archivos digitales requeridos para la matrícula.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card title="Subir nuevo documento">
            <Stack spacing={2}>
              <TextField
                size="small"
                label="Cédula del estudiante"
                placeholder="Ej: 0912345678"
                fullWidth
              />
              <TextField
                size="small"
                select
                label="Tipo de documento"
                defaultValue=""
                fullWidth
              >
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="cert_nac">Certificado de nacimiento</MenuItem>
                <MenuItem value="cedula_rep">Cédula del representante</MenuItem>
                <MenuItem value="planilla">Planilla de servicio básico</MenuItem>
              </TextField>
              <Button variant="outlined" component="label">
                Seleccionar archivo
                <input hidden type="file" />
              </Button>
              <Button variant="contained" color="primary">
                Subir documento
              </Button>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card title="Listado de documentos cargados">
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Estudiante</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Archivo</TableCell>
                    <TableCell>Fecha subida</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDocuments.map((d) => (
                    <TableRow key={d.id} hover>
                      <TableCell>{d.estudiante}</TableCell>
                      <TableCell>{d.tipo}</TableCell>
                      <TableCell>{d.nombreArchivo}</TableCell>
                      <TableCell>{d.fechaSubida}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={d.estado}
                          color={
                            d.estado === "Validado"
                              ? "success"
                              : d.estado === "En revisión"
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small">Ver</Button>
                        <Button size="small" color="success">
                          Validar
                        </Button>
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
        </Grid>
      </Grid>
    </Stack>
  );
};
