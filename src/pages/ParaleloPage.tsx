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
  Paper,
} from "@mui/material";
import { Card } from "../components/common/Card";
import { Paralelo } from "../types";
import {
  listarParalelo,
  crearParalelo,
  editarParalelo,
  eliminarParalelo,
} from "../services/paraleloService";

export function ParaleloPage() {
  const [paralelos, setParalelos] = useState<Paralelo[]>([]);
  const [search, setSearch] = useState("");
  const [nombre, setNombre] = useState("");
  const [editingItem, setEditingItem] = useState<Paralelo | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarParalelos = async () => {
    try {
      setLoading(true);
      const data = await listarParalelo(); // Promise<Paralelo[]>
      setParalelos(data);
    } catch (e) {
      console.error(e);
      alert("Error al cargar paralelos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParalelos();
  }, []);

  const filtered = useMemo(
    () =>
      paralelos.filter((p) =>
        `${p.nombre} ${p.idParalelo}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [paralelos, search]
  );

  const resetForm = () => {
    setNombre("");
    setEditingItem(null);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      setSaving(true);
      let ok = false;

      if (editingItem) {
        const payload: Paralelo = {
          idParalelo: editingItem.idParalelo,
          nombre: nombre.trim(),
        };
        ok = await editarParalelo(payload);
      } else {
        ok = await crearParalelo({ idParalelo: 0, nombre: nombre.trim() });
      }

      if (!ok) {
        alert("La API devolvió false");
        return;
      }

      await cargarParalelos();
      resetForm();
      alert(editingItem ? "Paralelo actualizado" : "Paralelo creado");
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al guardar el paralelo");
    } finally {
      setSaving(false);
    }
  };

  const handleEditarClick = (p: Paralelo) => {
    setEditingItem(p);
    setNombre(p.nombre);
  };

  const handleEliminarClick = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este paralelo?")) return;

    try {
      const ok = await eliminarParalelo(id);
      if (!ok) {
        alert("La API devolvió false al eliminar");
        return;
      }
      await cargarParalelos();
      alert("Paralelo eliminado");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar el paralelo");
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Paralelos</Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de paralelos asociados a los cursos de la institución.
        </Typography>
      </Stack>

      <Card title="Búsqueda y gestión de paralelos">
        {/* Barra de búsqueda + formulario simple */}
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
              label={editingItem ? "Editar nombre de paralelo" : "Nuevo paralelo"}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGuardar}
                disabled={saving}
              >
                {editingItem ? "Guardar cambios" : "Crear paralelo"}
              </Button>

              {editingItem && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Cargando...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No hay paralelos registrados.</TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.idParalelo} hover>
                    <TableCell>{p.idParalelo}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => handleEditarClick(p)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleEliminarClick(p.idParalelo)}
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
