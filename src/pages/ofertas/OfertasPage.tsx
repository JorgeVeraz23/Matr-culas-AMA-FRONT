import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apitClient";
import { API_ROUTES } from "../../utils/utils";
import { listarOfertas, crearOferta } from "../../services/ofertaService";
import { OfertasDisponibles } from "../../types";

type Option = { key: number; value: string };

export default function OfertasPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<OfertasDisponibles[]>([]);
  const [grados, setGrados] = useState<Option[]>([]);
  const [paralelos, setParalelos] = useState<Option[]>([]);
  const [anios, setAnios] = useState<Option[]>([]);

  const [gradoId, setGradoId] = useState(0);
  const [paraleloId, setParaleloId] = useState(0);
  const [anioLectivoId, setAnioLectivoId] = useState(0);

  const loadSelectors = async () => {
    const [g, p, a] = await Promise.all([
      api.get<Option[]>(API_ROUTES.grado.selector),
      api.get<Option[]>(API_ROUTES.paralelo.selector),
      api.get<Option[]>(API_ROUTES.anioLectivo.selector),
    ]);
    setGrados(g.data ?? []);
    setParalelos(p.data ?? []);
    setAnios(a.data ?? []);
  };

  const loadData = async () => {
    const data = await listarOfertas({
      gradoId: gradoId || undefined,
      paraleloId: paraleloId || undefined,
      anioLectivoId: anioLectivoId || undefined,
    });
    setRows(data ?? []);
  };

  useEffect(() => {
    (async () => {
      await loadSelectors();
      await loadData();
    })();
  }, []);

  useEffect(() => {
    loadData();
  }, [gradoId, paraleloId, anioLectivoId]);

  const clearFilters = () => {
    setGradoId(0);
    setParaleloId(0);
    setAnioLectivoId(0);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Ofertas disponibles
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/ofertas/create")}
        >
          Crear oferta
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="f-grado">Grado</InputLabel>
            <Select
              labelId="f-grado"
              label="Grado"
              value={gradoId}
              onChange={(e) => setGradoId(Number(e.target.value))}
            >
              <MenuItem value={0}>Todos</MenuItem>
              {grados.map((o) => (
                <MenuItem key={o.key} value={o.key}>
                  {o.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="f-paralelo">Paralelo</InputLabel>
            <Select
              labelId="f-paralelo"
              label="Paralelo"
              value={paraleloId}
              onChange={(e) => setParaleloId(Number(e.target.value))}
            >
              <MenuItem value={0}>Todos</MenuItem>
              {paralelos.map((o) => (
                <MenuItem key={o.key} value={o.key}>
                  {o.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="f-anio">Año lectivo</InputLabel>
            <Select
              labelId="f-anio"
              label="Año lectivo"
              value={anioLectivoId}
              onChange={(e) => setAnioLectivoId(Number(e.target.value))}
            >
              <MenuItem value={0}>Todos</MenuItem>
              {anios.map((o) => (
                <MenuItem key={o.key} value={o.key}>
                  {o.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button variant="outlined" onClick={clearFilters}>
              Limpiar
            </Button>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Grado</b></TableCell>
              <TableCell><b>Paralelo</b></TableCell>
              <TableCell><b>Año lectivo</b></TableCell>
              <TableCell><b>Cupos</b></TableCell>
              <TableCell><b>Disponibles</b></TableCell>
              <TableCell><b>Ocupados</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.gradoParaleloId}>
                <TableCell>{r.gradoNombre}</TableCell>
                <TableCell>{r.paraleloNombre}</TableCell>
                <TableCell>{r.anioLectivo}</TableCell>
                <TableCell>{r.cupos}</TableCell>
                <TableCell>{r.disponibles}</TableCell>
                <TableCell>{r.ocupados}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
