import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

import {
  listarDocumentosPorEstudiante,
  uploadDocumento,
  aprobarDocumento,
  descargarDocumento,
} from "../services/documentoService";

import { selectorTipoDocumentos } from "../services/tipoDocumentoService";
import { selectorEstudiantesDocs } from "../services/estudianteService"; // <-- ajusta si tu path es otro

import { DocumentoResponseDto, AprobarDto, SelectorOption } from "../types";

type LocationState = { estudianteId?: number };

const DocumentosEstudiantePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};

  // 👇 id viene del state (no URL)
  const [estudianteId, setEstudianteId] = useState<number>(
    Number.isFinite(state.estudianteId as number) ? (state.estudianteId as number) : 0
  );

  const [docs, setDocs] = useState<DocumentoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ===== selector estudiantes (fallback si entran directo)
  const [estudiantesSelector, setEstudiantesSelector] = useState<SelectorOption[]>([]);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);

  // ===== upload modal state
  const [openUpload, setOpenUpload] = useState(false);
  const [tipoDocumentoId, setTipoDocumentoId] = useState<number>(0);
  const [observacionUpload, setObservacionUpload] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // selector tipo documento
  const [tiposDocumento, setTiposDocumento] = useState<SelectorOption[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  // ===== aprobar modal state
  const [openAprobar, setOpenAprobar] = useState(false);
  const [selected, setSelected] = useState<DocumentoResponseDto | null>(null);
  const [aprobado, setAprobado] = useState<boolean>(true);
  const [observacionAprobar, setObservacionAprobar] = useState<string>("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const showError = (msg: string) => {
    setSnackbarSeverity("error");
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  const fetchDocs = async (idToFetch: number) => {
    try {
      setLoading(true);
      const data = await listarDocumentosPorEstudiante(idToFetch);
      setDocs(data);
      setError("");
    } catch {
      setError("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  // ✅ si no hay estudianteId, carga el selector para que el usuario elija
  useEffect(() => {
    const loadEstudiantes = async () => {
      try {
        setLoadingEstudiantes(true);
        const data = await selectorEstudiantesDocs();
        setEstudiantesSelector(data);
      } catch {
        showError("Error al cargar selector de estudiantes");
      } finally {
        setLoadingEstudiantes(false);
      }
    };

    if (!estudianteId) {
      setLoading(false);
      loadEstudiantes();
      return;
    }

    fetchDocs(estudianteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudianteId]);

  // ✅ cargar tipos documento cuando se abre el modal upload
  useEffect(() => {
    const loadTipos = async () => {
      try {
        setLoadingTipos(true);
        const data = await selectorTipoDocumentos();
        setTiposDocumento(data);
      } catch {
        showError("Error al cargar tipos de documento");
      } finally {
        setLoadingTipos(false);
      }
    };

    if (openUpload) loadTipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUpload]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return docs;

    return docs.filter((d) => {
      const tipo = (d.tipoDocumentoNombre ?? "").toLowerCase();
      const name = (d.fileName ?? "").toLowerCase();
      const obs = (d.observacion ?? "").toLowerCase();
      return tipo.includes(q) || name.includes(q) || obs.includes(q);
    });
  }, [docs, search]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const handleDownload = async (doc: DocumentoResponseDto) => {
    try {
      await descargarDocumento(doc.id, doc.fileName ?? `documento_${doc.id}`);
    } catch {
      showError("Error al descargar el documento");
    }
  };

  const handleUpload = async () => {
    // ✅ evita NaN / 0 siempre
    if (!Number.isFinite(estudianteId) || estudianteId <= 0) {
      showError("Selecciona un estudiante válido");
      return;
    }
    if (!tipoDocumentoId || tipoDocumentoId <= 0) {
      showError("Selecciona un tipo de documento");
      return;
    }
    if (!file) {
      showError("Selecciona un archivo");
      return;
    }

    try {
      await uploadDocumento({
        estudianteId,
        tipoDocumentoId,
        file,
        observacion: observacionUpload || null,
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Documento subido correctamente");
      setOpenSnackbar(true);

      // reset + close
      setOpenUpload(false);
      setTipoDocumentoId(0);
      setObservacionUpload("");
      setFile(null);

      await fetchDocs(estudianteId);
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "Error al subir el documento";
      showError(String(msg));
    }
  };

  const handleAprobar = async () => {
    if (!selected) return;

    const dto: AprobarDto = {
      aprobado,
      observacion: observacionAprobar?.trim()
        ? observacionAprobar.trim()
        : null,
    };

    try {
      await aprobarDocumento(selected.id, dto);

      setSnackbarSeverity("success");
      setSnackbarMessage(aprobado ? "Documento aprobado" : "Documento rechazado");
      setOpenSnackbar(true);

      setOpenAprobar(false);
      setSelected(null);
      setObservacionAprobar("");
      setAprobado(true);

      if (estudianteId) await fetchDocs(estudianteId);
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "Error al actualizar estado del documento";
      showError(String(msg));
    }
  };

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
            Documentos del estudiante
          </Typography>
          <Typography color="text.secondary">
            {estudianteId ? `Estudiante ID #${estudianteId}` : "Selecciona un estudiante"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setOpenUpload(true)}
            sx={{ px: 3, py: 1.2, fontWeight: 700 }}
            disabled={!estudianteId}
          >
            Subir documento
          </Button>
        </Box>
      </Box>

      {/* ✅ SELECTOR DE ESTUDIANTE (solo si no hay estudianteId) */}
      {!estudianteId && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography fontWeight={900} mb={1}>
            Selecciona un estudiante
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Estudiante</InputLabel>
            <Select
              label="Estudiante"
              value={estudianteId || ""}
              onChange={(e) => setEstudianteId(Number(e.target.value))}
            >
              <MenuItem value="" disabled>
                {loadingEstudiantes ? "Cargando..." : "Selecciona un estudiante"}
              </MenuItem>

              {estudiantesSelector.map((s) => (
                <MenuItem key={s.key} value={s.key}>
                  {s.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}

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
          opacity: estudianteId ? 1 : 0.6,
        }}
      >
        <SearchIcon color="action" />
        <TextField
          variant="standard"
          placeholder="Buscar por tipo, nombre o observación..."
          value={search}
          disabled={!estudianteId}
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
          opacity: estudianteId ? 1 : 0.6,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>TIPO</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>ARCHIVO</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>OBSERVACIÓN</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>ESTADO</TableCell>
              <TableCell align="right" sx={{ fontSize: 12, fontWeight: 800 }}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>
                  <Typography fontWeight={800}>
                    {d.tipoDocumentoNombre ?? `Tipo #${d.tipoDocumentoId}`}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>
                    {d.fileName ?? `Documento #${d.id}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID #{d.id}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>{d.observacion || "—"}</Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      d.aprobado === true
                        ? "Aprobado"
                        : d.aprobado === false
                        ? "Rechazado"
                        : "Pendiente"
                    }
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor:
                        d.aprobado === true
                          ? "success.light"
                          : d.aprobado === false
                          ? "error.light"
                          : "grey.200",
                      color:
                        d.aprobado === true
                          ? "success.main"
                          : d.aprobado === false
                          ? "error.main"
                          : "text.secondary",
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Descargar">
                    <span>
                      <IconButton onClick={() => handleDownload(d)} disabled={!estudianteId}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Aprobar">
                    <span>
                      <IconButton
                        disabled={!estudianteId}
                        onClick={() => {
                          setSelected(d);
                          setAprobado(true);
                          setObservacionAprobar(d.observacion ?? "");
                          setOpenAprobar(true);
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Rechazar">
                    <span>
                      <IconButton
                        disabled={!estudianteId}
                        onClick={() => {
                          setSelected(d);
                          setAprobado(false);
                          setObservacionAprobar(d.observacion ?? "");
                          setOpenAprobar(true);
                        }}
                      >
                        <CancelIcon fontSize="small" color="error" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && estudianteId && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6 }}>
                  <Typography align="center" color="text.secondary">
                    No hay documentos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!estudianteId && (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6 }}>
                  <Typography align="center" color="text.secondary">
                    Selecciona un estudiante para ver documentos
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

      {/* MODAL UPLOAD */}
      {openUpload && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 1300,
          }}
          onClick={() => setOpenUpload(false)}
        >
          <Paper
            sx={{ width: 560, p: 3, borderRadius: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight={900} mb={2}>
              Subir documento
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de documento</InputLabel>
              <Select
                label="Tipo de documento"
                value={tipoDocumentoId || ""}
                onChange={(e) => setTipoDocumentoId(Number(e.target.value))}
              >
                <MenuItem value="" disabled>
                  {loadingTipos ? "Cargando..." : "Selecciona un tipo"}
                </MenuItem>

                {tiposDocumento.map((t) => (
                  <MenuItem key={t.key} value={t.key}>
                    {t.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
              Seleccionar archivo
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </Button>

            {file && (
              <Typography variant="caption" color="text.secondary">
                Archivo: {file.name}
              </Typography>
            )}

            <TextField
              label="Observación (opcional)"
              fullWidth
              margin="normal"
              value={observacionUpload}
              onChange={(e) => setObservacionUpload(e.target.value)}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={() => {
                  setOpenUpload(false);
                  setTipoDocumentoId(0);
                  setObservacionUpload("");
                  setFile(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!estudianteId || !tipoDocumentoId || !file}
              >
                Subir
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* MODAL APROBAR */}
      {openAprobar && selected && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 1300,
          }}
          onClick={() => setOpenAprobar(false)}
        >
          <Paper
            sx={{ width: 560, p: 3, borderRadius: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight={900} mb={1}>
              {aprobado ? "Aprobar documento" : "Rechazar documento"}
            </Typography>

            <Typography color="text.secondary" mb={2}>
              Documento ID #{selected.id}
            </Typography>

            <TextField
              label="Observación (opcional)"
              fullWidth
              value={observacionAprobar}
              onChange={(e) => setObservacionAprobar(e.target.value)}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={() => setOpenAprobar(false)}>Cancelar</Button>
              <Button
                variant="contained"
                color={aprobado ? "primary" : "error"}
                onClick={handleAprobar}
              >
                {aprobado ? "Aprobar" : "Rechazar"}
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

export default DocumentosEstudiantePage;
