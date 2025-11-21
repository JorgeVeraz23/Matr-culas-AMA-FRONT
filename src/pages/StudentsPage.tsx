import React, { useMemo, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from "@mui/material";
import { Card } from "../components/common/Card";
import { Student } from "../types";

const mockStudents: Student[] = [
  {
    id: 1,
    nombres: "Juan Carlos",
    apellidos: "Pérez Sánchez",
    cedula: "0912345678",
    curso: "4to",
    paralelo: "A",
    estado: "Activo"
  },
  {
    id: 2,
    nombres: "María Fernanda",
    apellidos: "López Vega",
    cedula: "0922334455",
    curso: "5to",
    paralelo: "B",
    estado: "Activo"
  },
  {
    id: 3,
    nombres: "Luis",
    apellidos: "Cedeño Mora",
    cedula: "0956677889",
    curso: "3ro",
    paralelo: "A",
    estado: "Inactivo"
  }
];

export const StudentsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      mockStudents.filter((s) =>
        `${s.nombres} ${s.apellidos} ${s.cedula}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Estudiantes</Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de estudiantes matriculados en la institución.
        </Typography>
      </Stack>

      <Card title="Búsqueda y registro de estudiantes">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            fullWidth
            size="small"
            label="Buscar por nombre o cédula"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained" color="primary">
            Nuevo estudiante
          </Button>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cédula</TableCell>
                <TableCell>Estudiante</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Paralelo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.cedula}</TableCell>
                  <TableCell>
                    {s.nombres} {s.apellidos}
                  </TableCell>
                  <TableCell>{s.curso}</TableCell>
                  <TableCell>{s.paralelo}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={s.estado}
                      color={s.estado === "Activo" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small">Editar</Button>
                    <Button size="small">Ver ficha</Button>
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
