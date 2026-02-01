import { api } from "./apitClient";
import { API_ROUTES } from "../utils/utils";
import { AprobarDto, DocumentoResponseDto } from "../types";

// GET api/Document/estudiante/{estudianteId}
export const listarDocumentosPorEstudiante = async (
  estudianteId: number
): Promise<DocumentoResponseDto[]> => {
  const res = await api.get<DocumentoResponseDto[]>(
    API_ROUTES.documento.listarPorEstudiante(estudianteId)
  );
  return res.data;
};

// POST api/Document/upload  (multipart/form-data)
export const uploadDocumento = async (payload: {
  estudianteId: number;
  tipoDocumentoId: number;
  file: File;
  observacion?: string | null;
}): Promise<{ id: number }> => {
  const form = new FormData();

  // 👇 CLAVE: igual que Swagger
  form.append("EstudianteId", String(payload.estudianteId));
  form.append("TipoDocumentoId", String(payload.tipoDocumentoId));
  form.append("File", payload.file);

  if (payload.observacion?.trim()) {
    form.append("Observacion", payload.observacion.trim());
  }

  const res = await api.post<{ id: number }>(
    API_ROUTES.documento.upload,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};

// POST api/Document/{id}/aprobar
export const aprobarDocumento = async (id: number, dto: AprobarDto) => {
  await api.post(API_ROUTES.documento.aprobar(id), dto);
};

// GET api/Document/{id}/download
export const descargarDocumento = async (
  id: number,
  filenameFallback: string = "documento"
) => {
  const res = await api.get(API_ROUTES.documento.download(id), {
    responseType: "blob",
  });

  const blob = new Blob([res.data], {
    type: res.headers["content-type"] || "application/octet-stream",
  });

  const disposition = res.headers["content-disposition"] as string | undefined;
  let filename = filenameFallback;

  if (disposition) {
    const match =
      /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(disposition);
    const raw = match?.[1] || match?.[2];
    if (raw) filename = decodeURIComponent(raw);
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
