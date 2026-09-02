import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FE_ETIQUETAS, FLUJOS_DEFAULT, plantaTieneVector, VECTOR_META, VECTORES } from "@/lib/sga/catalog";
import { exportConfigPayload, useSga } from "@/lib/sga/store";
import type { FactoresEmision, FlujosPlanta, Planta, VectorId } from "@/lib/sga/types";
import { AUTO_LOAD_URL_DEFAULT } from "@/lib/sga/catalog";
import { workbookFromRows, downloadWorkbook } from "@/lib/sga/excel";
import { buildDemoRows } from "@/lib/sga/demo";
import { useRef, useState } from "react";

const FLUJOS_ORDEN: { vector: VectorId; titulo: string; items: [keyof FlujosPlanta, string][] }[] = [
  { vector: "Energia", titulo: "Energía", items: [["Consumo CFE", "CFE"], ["Solar", "Solar"]] },
  { vector: "Agua", titulo: "Agua", items: [["Red", "Red"], ["Recup", "PTAR"]] },
  { vector: "Residuos", titulo: "Residuos", items: [["Sólidos", "Sólidos"], ["Líquidos", "Líquidos"], ["Biológicos", "Biológ."]] },
];

export function ConfigView() {
  const plantas = useSga((s) => s.plantas);
  const setPlantas = useSga((s) => s.setPlantas);
  const metasSGA = useSga((s) => s.metasSGA);
  const setMetasCampo = useSga((s) => s.setMetasCampo);
  const FE = useSga((s) => s.FE);
  const setFE = useSga((s) => s.setFE);
  const ruta = useSga((s) => s.rutaExcel);
  const setRutaExcel = useSga((s) => s.setRutaExcel);
  const restoreFactory = useSga((s) => s.restoreFactory);
  const importConfig = useSga((s) => s.importConfig);
  const setOwnPassword = useSga((s) => s.setOwnPassword);
  const clearOwnPassword = useSga((s) => s.clearOwnPassword);
  const lock = useSga((s) => s.lock);
  const loadFromUrl = useSga((s) => s.loadFromUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const [rutaDraft, setRutaDraft] = useState(ruta);

  const updatePlanta = (id: string, patch: Partial<Planta>) => {
    setPlantas(plantas.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const updateFlujo = (id: string, flujo: keyof FlujosPlanta, on: boolean) => {
    setPlantas(
      plantas.map((p) => {
        if (p.id !== id) return p;
        const flujos = { ...p.flujos, [flujo]: on };
        return { ...p, flujos };
      }),
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print flex flex-wrap items-center gap-2 rounded-[14px] border border-line bg-white p-3">
        <span className="mr-auto text-xs font-semibold text-muted">Los cambios se guardan en este navegador.</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const blob = new Blob([JSON.stringify(exportConfigPayload(), null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "Config_Panel_SGA.json";
            a.click();
          }}
        >
          Exportar config
        </Button>
        <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}>
          Importar
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
              try {
                importConfig(JSON.parse(String(r.result)));
              } catch {
                alert("JSON inválido");
              }
            };
            r.readAsText(f);
          }}
        />
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            if (confirm("¿Restaurar valores de fábrica?")) restoreFactory();
          }}
        >
          Restaurar fábrica
        </Button>
      </div>

      <Card>
        <CardTitle>Plantas</CardTitle>
        <p className="mb-3 text-sm text-muted">
          El <b className="text-navy">ID</b> debe coincidir exactamente con la columna Planta del Excel.
        </p>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Corto</th>
                <th>Unidad</th>
                {FLUJOS_ORDEN.flatMap((g) => g.items.map((it) => <th key={it[0]}>{it[1]}</th>))}
                <th>Comb.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plantas.map((p) => (
                <tr key={p.id}>
                  <td className="font-extrabold">{p.id}</td>
                  <td>
                    <input className="w-36 rounded border border-line px-2 py-1 font-semibold" defaultValue={p.nombre} onBlur={(e) => updatePlanta(p.id, { nombre: e.target.value })} />
                  </td>
                  <td>
                    <input className="w-28 rounded border border-line px-2 py-1 font-semibold" defaultValue={p.corto} onBlur={(e) => updatePlanta(p.id, { corto: e.target.value })} />
                  </td>
                  <td>
                    <select
                      className="select-light"
                      value={p.unidadProd}
                      onChange={(e) =>
                        updatePlanta(p.id, {
                          unidadProd: e.target.value as "PZ" | "EX",
                          terminoUnidad: e.target.value === "EX" ? "examen" : "pieza",
                        })
                      }
                    >
                      <option value="PZ">Piezas</option>
                      <option value="EX">Exámenes</option>
                    </select>
                  </td>
                  {FLUJOS_ORDEN.flatMap((g) =>
                    g.items.map((it) => (
                      <td key={it[0]}>
                        <input type="checkbox" checked={p.flujos[it[0]]} onChange={(e) => updateFlujo(p.id, it[0], e.target.checked)} />
                      </td>
                    )),
                  )}
                  <td>
                    <input
                      type="checkbox"
                      checked={p.vectores.Combustibles}
                      onChange={(e) => updatePlanta(p.id, { vectores: { Combustibles: e.target.checked } })}
                    />
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-alert"
                      onClick={() => {
                        if (plantas.length <= 1) return alert("Debe quedar al menos una planta.");
                        if (confirm(`¿Quitar ${p.nombre}?`)) setPlantas(plantas.filter((x) => x.id !== p.id));
                      }}
                    >
                      Quitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          className="mt-3"
          size="sm"
          onClick={() => {
            const id = prompt("ID (debe coincidir con el Excel):");
            if (!id?.trim()) return;
            if (plantas.some((p) => p.id === id.trim())) return alert("Ya existe.");
            const nombre = prompt("Nombre:", id) || id;
            setPlantas([
              ...plantas,
              {
                id: id.trim(),
                nombre,
                corto: nombre,
                unidadProd: "PZ",
                terminoUnidad: "pieza",
                vectores: { Combustibles: true },
                flujos: { ...FLUJOS_DEFAULT },
                icono: "building",
              },
            ]);
          }}
        >
          Agregar planta
        </Button>
      </Card>

      <Card>
        <CardTitle>Metas de respaldo</CardTitle>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Planta</th>
                <th>Vector</th>
                <th>Mejora %</th>
                <th>Meta respaldo</th>
                <th>% limpio</th>
                <th>Vol. mensual</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {plantas.flatMap((p) =>
                VECTORES.filter((c) => plantaTieneVector(p, c)).map((c) => {
                  const cfg = metasSGA[p.id]?.[c];
                  if (!cfg) return null;
                  return (
                    <tr key={`${p.id}-${c}`}>
                      <td>{p.nombre}</td>
                      <td className="text-left font-bold">{VECTOR_META[c].nombre}</td>
                      <td>
                        <input className="w-16 rounded border-2 border-line px-1 text-right font-bold" type="number" defaultValue={(cfg.factorMejora * 100).toFixed(0)} onBlur={(e) => setMetasCampo(p.id, c, "factorMejora", Number(e.target.value) / 100)} />
                      </td>
                      <td>
                        <input className="w-20 rounded border-2 border-line px-1 text-right font-bold" type="number" defaultValue={cfg.efMetaFallback} onBlur={(e) => setMetasCampo(p.id, c, "efMetaFallback", Number(e.target.value))} />
                      </td>
                      <td>
                        {cfg.pctMeta !== undefined ? (
                          <input className="w-16 rounded border-2 border-line px-1 text-right font-bold" type="number" defaultValue={cfg.pctMeta} onBlur={(e) => setMetasCampo(p.id, c, "pctMeta", Number(e.target.value))} />
                        ) : (
                          "n/a"
                        )}
                      </td>
                      <td>
                        {cfg.volMeta !== undefined ? (
                          <input className="w-20 rounded border-2 border-line px-1 text-right font-bold" type="number" defaultValue={cfg.volMeta} onBlur={(e) => setMetasCampo(p.id, c, "volMeta", Number(e.target.value))} />
                        ) : (
                          "n/a"
                        )}
                      </td>
                      <td className="text-cloud">{cfg.unidad}</td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle>Factores de emisión</CardTitle>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Fuente</th>
                <th>Valor</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(FE_ETIQUETAS) as (keyof FactoresEmision)[]).map((k) => (
                <tr key={k}>
                  <td className="text-left font-bold">{FE_ETIQUETAS[k].titulo}</td>
                  <td>
                    <input className="w-24 rounded border-2 border-line px-1 text-right font-bold" type="number" step="0.001" defaultValue={FE[k]} onBlur={(e) => setFE(k, Number(e.target.value))} />
                  </td>
                  <td className="text-cloud">{FE_ETIQUETAS[k].unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle>Origen de datos (autocarga)</CardTitle>
        <p className="mb-3 text-sm text-muted">
          En la intranet: copie la carpeta del paquete (HTML + vendor + Excel). El panel busca <b>Base_de_Datos_Dashboard.xlsx</b> al lado
          del HTML, sin internet. Cada mes sustituya ese archivo y recargue.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Input className="max-w-xs" value={rutaDraft} onChange={(e) => setRutaDraft(e.target.value)} />
          <Button
            size="sm"
            onClick={() => {
              setRutaExcel(rutaDraft);
              void loadFromUrl(rutaDraft);
            }}
          >
            Guardar y recargar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setRutaExcel(AUTO_LOAD_URL_DEFAULT);
              setRutaDraft(AUTO_LOAD_URL_DEFAULT);
            }}
          >
            Predeterminada
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              const wb = await workbookFromRows(buildDemoRows());
              downloadWorkbook(wb, "Base_de_Datos_Dashboard.xlsx");
            }}
          >
            Descargar plantilla Excel
          </Button>
          <a href="/Panel_SGA_Lapisa.zip" download className="inline-flex h-8 items-center rounded-[10px] bg-navy px-3 text-xs font-bold text-white">
            Paquete intranet (ZIP)
          </a>
        </div>
      </Card>

      <Card>
        <CardTitle>Seguridad</CardTitle>
        <p className="mb-3 text-sm text-muted">
          Filtro para evitar cambios accidentales. No es autenticación real: alguien con conocimientos técnicos puede saltárselo.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const p1 = prompt("Nuevo código propio:");
              if (!p1) return;
              const p2 = prompt("Confírmalo:");
              if (p1 !== p2) return alert("No coinciden.");
              setOwnPassword(p1);
            }}
          >
            Definir código propio
          </Button>
          <Button size="sm" variant="ghost" onClick={clearOwnPassword}>
            Quitar código propio
          </Button>
          <Button size="sm" onClick={lock}>
            Bloquear ahora
          </Button>
        </div>
      </Card>
    </div>
  );
}
