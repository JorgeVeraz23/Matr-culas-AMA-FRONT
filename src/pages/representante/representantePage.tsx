import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import ModalSweetAlert from "../../components/common/ModalSweetAlert";
import { listarRepresentantes, eliminarRepresentante, editarRepresentante } from "../../services/representanteService";
import { RepresentanteResponseDto, RepresentanteUpdateDto } from "../../types";

const TIPOS_DOCUMENTO = ["CEDULA", "PASAPORTE", "RUC", "OTRO"] as const;

const RepresentantesPage: React.FC = () => {
  const navigate = useNavigate();

  const [representantes, setRepresentantes] = useState<RepresentanteResponseDto[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selected, setSelected] = useState<RepresentanteResponseDto | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchRepresentantes();
  }, []);

  const fetchRepresentantes = async (q?: string) => {
    try {
      setLoading(true);
      const data = await listarRepresentantes(q);
      setRepresentantes(data);
      setError("");
    } catch {
      setError("Error al cargar representantes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => navigate("/representantes/create");

  const handleEliminar = async (id: number) => {
    ModalSweetAlert("delete", async () => {
      try {
        await eliminarRepresentante(id);
        setRepresentantes((prev) => prev.filter((r) => r.id !== id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Representante eliminado correctamente");
      } catch {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error al eliminar el representante");
      } finally {
        setOpenSnackbar(true);
      }
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return representantes;

    return representantes.filter((r) => {
      const full = (r.nombreCompleto ?? `${r.nombres} ${r.apellidos}`).toLowerCase();
      const doc = (r.numeroDocumento ?? "").toLowerCase();
      const email = (r.email ?? "").toLowerCase();
      const dir = (r.direccion ?? "").toLowerCase();
      return (
        full.includes(q) ||
        doc.includes(q) ||
        email.includes(q) ||
        dir.includes(q)
      );
    });
  }, [representantes, search]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const getInitials = (nombreCompleto?: string, nombres?: string, apellidos?: string) => {
    const txt = (nombreCompleto ?? `${nombres ?? ""} ${apellidos ?? ""}`).trim();
    if (!txt) return "RP";
    const parts = txt.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "R";
    const b = parts[1]?.[0] ?? "P";
    return (a + b).toUpperCase();
  };

  const buildUpdatePayload = (r: RepresentanteResponseDto): RepresentanteUpdateDto => ({
    nombres: r.nombres,
    apellidos: r.apellidos,
    tipoDocumento: r.tipoDocumento,
    numeroDocumento: r.numeroDocumento,
    telefono: r.telefono ?? null,
    email: r.email ?? null,
    direccion: r.direccion ?? null,
  });

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
            Representantes
          </Typography>
          <Typography color="text.secondary">
            Gestiona y organiza los representantes legales
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ px: 3, py: 1.2, fontWeight: 700 }}
        >
          Crear representante
        </Button>
      </Box>

      {/* SEARCH */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1.2,
          bgcolor: "#F8FAFC",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <SearchIcon color="action" />
        <TextField
          variant="standard"
          placeholder="Buscar por nombre, documento, email o dirección..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{ disableUnderline: true }}
          sx={{ flex: 1 }}
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                REPRESENTANTE
              </TableCell>

              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                DOCUMENTO
              </TableCell>

              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                CONTACTO
              </TableCell>

              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                DIRECCIÓN
              </TableCell>

              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                ESTADO
              </TableCell>

              <TableCell align="right" sx={{ fontSize: 12, fontWeight: 800 }}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.main",
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(r.nombreCompleto, r.nombres, r.apellidos)}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700}>
                        {r.nombreCompleto || `${r.nombres} ${r.apellidos}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID #{r.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>
                    {r.tipoDocumento}: {r.numeroDocumento}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>
                    {r.email || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.telefono || "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>
                    {r.direccion || "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={r.isActive ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      bgcolor: r.isActive ? "success.light" : "grey.200",
                      color: r.isActive ? "success.main" : "text.secondary",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        setSelected(r);
                        setOpenModal(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleEliminar(r.id)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6 }}>
                  <Typography align="center" color="text.secondary">
                    No hay representantes registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* MODAL EDIT */}
      {openModal && selected && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 1300,
          }}
          onClick={() => setOpenModal(false)}
        >
          <Paper
            sx={{ width: 600, p: 3, borderRadius: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight={900} mb={2}>
              Editar representante
            </Typography>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
              <TextField
                label="Nombres"
                fullWidth
                value={selected.nombres}
                onChange={(e) =>
                  setSelected({ ...selected, nombres: e.target.value })
                }
              />
              <TextField
                label="Apellidos"
                fullWidth
                value={selected.apellidos}
                onChange={(e) =>
                  setSelected({ ...selected, apellidos: e.target.value })
                }
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr", mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo documento</InputLabel>
                <Select
                  label="Tipo documento"
                  value={selected.tipoDocumento}
                  onChange={(e) =>
                    setSelected({ ...selected, tipoDocumento: String(e.target.value) })
                  }
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Número documento"
                fullWidth
                value={selected.numeroDocumento}
                onChange={(e) =>
                  setSelected({ ...selected, numeroDocumento: e.target.value })
                }
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr", mt: 2 }}>
              <TextField
                label="Teléfono"
                fullWidth
                value={selected.telefono ?? ""}
                onChange={(e) =>
                  setSelected({ ...selected, telefono: e.target.value || null })
                }
              />
              <TextField
                label="Email"
                fullWidth
                value={selected.email ?? ""}
                onChange={(e) =>
                  setSelected({ ...selected, email: e.target.value || null })
                }
              />
            </Box>

            <TextField
              label="Dirección"
              fullWidth
              margin="normal"
              value={selected.direccion ?? ""}
              onChange={(e) =>
                setSelected({ ...selected, direccion: e.target.value || null })
              }
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    const payload = buildUpdatePayload(selected);
                    await editarRepresentante(selected.id, payload);
                    await fetchRepresentantes();
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Representante actualizado");
                  } catch {
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Error al actualizar");
                  } finally {
                    setOpenSnackbar(true);
                    setOpenModal(false);
                  }
                }}
              >
                Guardar
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RepresentantesPage;
