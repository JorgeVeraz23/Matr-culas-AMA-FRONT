import React, { useEffect, useMemo, useState } from "react";
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
  Paper
} from "@mui/material";

import { Card } from "../components/common/Card";
import { Curso } from "../types";
import {
  listarCurso,
  crearCurso,
  editarCurso,
  eliminarCurso
} from "../services/cursoService";

export function CursoPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [search, setSearch] = useState("");

  const [nombre, setNombre] = useState("");
  const [cupos, setCupos] = useState<number | "">("");
  const [editingItem, setEditingItem] = useState<Curso | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const data = await listarCurso();
      setCursos(data);
    } catch (e) {
      console.error(e);
      alert("Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const filtered = useMemo(
    () =>
      cursos.filter((c) =>
        `${c.nombre} ${c.idCurso}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, cursos]
  );

  const resetForm = () => {
    setNombre("");
    setCupos("");
    setEditingItem(null);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (cupos === "" || Number(cupos) <= 0) {
      alert("Cupos debe ser un número mayor a 0");
      return;
    }

    try {
      setSaving(true);

      let ok = false;

      if (editingItem) {
        const payload: Curso = {
          idCurso: editingItem.idCurso,
          nombre: nombre.trim(),
          cupos: Number(cupos)
        };
        ok = await editarCurso(payload);
      } else {
        ok = await crearCurso({
          idCurso: 0,
          nombre: nombre,
          cupos: Number(cupos)
        });
      }

      if (!ok) {
        alert("La API devolvió false");
        return;
      }

      await cargarCursos();
      resetForm();
      alert(editingItem ? "Curso actualizado" : "Curso creado");
    } catch (e) {
      console.error(e);
      alert("Error al guardar el curso");
    } finally {
      setSaving(false);
    }
  };

  const handleEditarClick = (curso: Curso) => {
    setEditingItem(curso);
    setNombre(curso.nombre);
    setCupos(curso.cupos);
  };

  const handleEliminarClick = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
      const ok = await eliminarCurso(id);
      if (!ok) {
        alert("La API devolvió false al eliminar");
        return;
      }

      await cargarCursos();
      alert("Curso eliminado");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar curso");
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Cursos</Typography>
        <Typography variant="body2" color="text.secondary">
          Administración de cursos disponibles en la institución.
        </Typography>
      </Stack>

      <Card title="Búsqueda y gestión de cursos">
        {/* Barra de búsqueda y formulario */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              label="Buscar por nombre o ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              size="small"
              label={editingItem ? "Editar nombre" : "Nombre del curso"}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <TextField
              size="small"
              label="Cupos"
              type="number"
              value={cupos}
              onChange={(e) => setCupos(e.target.value === "" ? "" : Number(e.target.value))}
              inputProps={{ min: 1 }}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleGuardar}
                disabled={saving}
              >
                {editingItem ? "Guardar cambios" : "Crear curso"}
              </Button>

              {editingItem && (
                <Button variant="outlined" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Tabla */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Cupos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Cargando...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No hay cursos registrados.</TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.idCurso} hover>
                    <TableCell>{c.idCurso}</TableCell>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.cupos}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditarClick(c)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleEliminarClick(c.idCurso)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
