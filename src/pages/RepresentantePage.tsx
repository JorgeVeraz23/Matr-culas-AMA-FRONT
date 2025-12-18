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
  Grid,
  Divider,
} from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import { Card } from "../components/common/Card";
import { Representante } from "../types";
import {
  listarRepresentante,
  crearRepresentante,
  editarRepresentante,
  eliminarRepresentante,
} from "../services/representanteService";

export function RepresentantePage() {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [search, setSearch] = useState("");

  // Form fields
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState<number | "">("");
  const [identificacion, setIdentificacion] = useState("");
  const [celular, setCelular] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // "YYYY-MM-DD"

  const [editingItem, setEditingItem] = useState<Representante | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarRepresentantes = async () => {
    try {
      setLoading(true);
      const data = await listarRepresentante();
      setRepresentantes(data);
    } catch (e) {
      console.error(e);
      alert("Error al cargar representantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRepresentantes();
  }, []);

  const filtered = useMemo(
    () =>
      representantes.filter((r) =>
        `${r.nombre} ${r.identificacion} ${r.celular}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, representantes]
  );

  const resetForm = () => {
    setNombre("");
    setEdad("");
    setIdentificacion("");
    setCelular("");
    setFechaNacimiento("");
    setEditingItem(null);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (edad === "" || Number(edad) <= 0) {
      alert("La edad debe ser mayor a 0");
      return;
    }
    if (!identificacion.trim()) {
      alert("La identificación es obligatoria");
      return;
    }
    if (!celular.trim()) {
      alert("El celular es obligatorio");
      return;
    }
    if (!fechaNacimiento) {
      alert("La fecha de nacimiento es obligatoria");
      return;
    }

    try {
      setSaving(true);

      const payloadBase = {
        nombre: nombre.trim(),
        edad: Number(edad),
        identificacion: identificacion.trim(),
        celular: celular.trim(),
        fechaNacimiento: new Date(fechaNacimiento).toISOString(),
      };

      let ok = false;

      if (editingItem) {
        const payload: Representante = {
          idRepresentante: editingItem.idRepresentante,
          ...payloadBase,
        };
        ok = await editarRepresentante(payload);
      } else {
        // aquí tu crearRepresentante debería aceptar un payload sin idRepresentante
        ok = await crearRepresentante(payloadBase as any);
      }

      if (!ok) {
        alert("La API devolvió false");
        return;
      }

      await cargarRepresentantes();
      resetForm();
      alert(editingItem ? "Representante actualizado" : "Representante creado");
    } catch (e) {
      console.error(e);
      alert("Error al guardar el representante");
    } finally {
      setSaving(false);
    }
  };

  const handleEditarClick = (r: Representante) => {
    setEditingItem(r);
    setNombre(r.nombre);
    setEdad(r.edad);
    setIdentificacion(r.identificacion);
    setCelular(r.celular);
    const onlyDate = r.fechaNacimiento.split("T")[0];
    setFechaNacimiento(onlyDate);
  };

  const handleEliminarClick = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este representante?")) return;

    try {
      const ok = await eliminarRepresentante(id);
      if (!ok) {
        alert("La API devolvió false al eliminar");
        return;
      }
      await cargarRepresentantes();
      alert("Representante eliminado");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar representante");
    }
  };

  const formatFecha = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">
          <SupervisorAccountIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Representantes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de representantes legales de los estudiantes.
        </Typography>
      </Stack>

      <Card title="Búsqueda y gestión de representantes">
        {/* 🔍 BÚSQUEDA */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar por nombre, cédula o celular"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* 📝 FORMULARIO */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {editingItem ? "Editar representante" : "Registrar nuevo representante"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Nombre del representante"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Edad"
                type="number"
                value={edad}
                onChange={(e) =>
                  setEdad(e.target.value === "" ? "" : Number(e.target.value))
                }
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Identificación"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Fecha de nacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={9}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
            >
              <Button
                variant="contained"
                onClick={handleGuardar}
                disabled={saving}
              >
                {editingItem ? "Guardar cambios" : "Crear representante"}
              </Button>
              {editingItem && (
                <Button variant="outlined" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </Grid>
          </Grid>
        </Stack>

        {/* 📋 TABLA */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Identificación</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Fecha de nacimiento</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>Cargando...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    No hay representantes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.idRepresentante} hover>
                    <TableCell>{r.idRepresentante}</TableCell>
                    <TableCell>{r.nombre}</TableCell>
                    <TableCell>{r.edad}</TableCell>
                    <TableCell>{r.identificacion}</TableCell>
                    <TableCell>{r.celular}</TableCell>
                    <TableCell>{formatFecha(r.fechaNacimiento)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditarClick(r)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          handleEliminarClick(r.idRepresentante)
                        }
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
