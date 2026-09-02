import { AlertTriangle, CheckCircle2, FolderUp, RefreshCw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSga } from "@/lib/sga/store";
import { Badge } from "@/components/ui/badge";

const SOURCE_LABEL = {
  server: "Autocarga del servidor",
  upload: "Archivo subido",
  demo: "Datos de demostración",
  cache: "Última carga de este navegador",
};

export function DataBar() {
  const report = useSga((s) => s.report);
  const loading = useSga((s) => s.loading);
  const error = useSga((s) => s.error);
  const loadFromUrl = useSga((s) => s.loadFromUrl);
  const loadFromFile = useSga((s) => s.loadFromFile);
  const loadDemo = useSga((s) => s.loadDemo);
  const ruta = useSga((s) => s.rutaExcel);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(false);

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (f) void loadFromFile(f);
  };

  const tone = report?.source === "demo" ? "warn" : report?.notes.length ? "warn" : "ok";

  return (
    <div
      className="no-print rounded-[14px] border border-line bg-white px-4 py-3 shadow-[var(--shadow-card)]"
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={tone}>{report ? SOURCE_LABEL[report.source] : "Cargando"}</Badge>
        <span className="text-[0.8rem] text-muted">
          {loading
            ? "Buscando Excel…"
            : report
              ? `${report.plantsFound.length} plantas · ${report.years.join(", ") || "sin años"}${report.loadedAt ? " · " + new Date(report.loadedAt).toLocaleString("es-MX") : ""}`
              : "Sin datos"}
        </span>
        {error ? <span className="text-sm font-semibold text-alert">{error}</span> : null}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            suppressHydrationWarning
            onChange={(e) => onFiles(e.target.files)}
          />
          <Button size="sm" variant="ghost" onClick={() => inputRef.current?.click()}>
            <Upload className="size-3.5" /> Subir Excel
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              void loadFromUrl();
            }}
          >
            <RefreshCw className="size-3.5" /> Recargar
          </Button>
          {report?.source === "demo" ? (
            <span className="text-[0.75rem] text-warn">No se encontró {ruta}. Se muestran cifras de ejemplo.</span>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)}>
              {report?.notes.length ? <AlertTriangle className="size-3.5 text-warn" /> : <CheckCircle2 className="size-3.5 text-ok" />}
              Calidad
            </Button>
          )}
        </div>
      </div>
      {drag ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-blue bg-[#eaf3fc] px-3 py-2 text-sm font-semibold text-blue">
          <FolderUp className="size-4" /> Suelta el consolidado .xlsx aquí
        </div>
      ) : null}
      {open && report ? (
        <div className="mt-3 grid gap-2 border-t border-line-2 pt-3 text-[0.8rem] text-muted sm:grid-cols-2">
          <div>
            <div className="mb-1 font-bold text-navy">Hojas</div>
            {report.sheets.map((s) => (
              <div key={s.name}>
                {s.ok ? "✓" : "✗"} {s.name} · {s.rows} filas
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 font-bold text-navy">Notas</div>
            {report.notes.length === 0 ? <div>Estructura válida. Listo para comité.</div> : report.notes.map((n) => <div key={n}>• {n}</div>)}
            {report.source === "demo" ? (
              <button type="button" className="mt-2 font-semibold text-blue" onClick={() => loadDemo()}>
                Regenerar demostración
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
