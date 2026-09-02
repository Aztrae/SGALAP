import { Card, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/sga/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plantaTieneVector, VECTOR_META, VECTORES } from "@/lib/sga/catalog";
import { calcularMetasAuto, intensidadAnio, obtenerMetaEfectiva } from "@/lib/sga/engine";
import { fmt1, fmt4 } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";

export function MetasView() {
  const ctx = useEngineCtx();
  const modo = useSga((s) => s.metasModo);
  const rigor = useSga((s) => s.rigorLimite);
  const setMetasModo = useSga((s) => s.setMetasModo);
  const setRigor = useSga((s) => s.setRigor);
  const setOverride = useSga((s) => s.setOverride);
  const clearOverrides = useSga((s) => s.clearOverrides);
  const setMetasCampo = useSga((s) => s.setMetasCampo);
  const anio = ctx.anioActual;

  const filas = ctx.plantas.flatMap((p) =>
    VECTORES.filter((c) => plantaTieneVector(p, c)).map((c) => ({
      planta: p,
      cat: c,
      a: calcularMetasAuto(ctx, p.id, c),
      base: ctx.metasSGA[p.id]?.[c],
    })),
  );
  const conBase = filas.filter((f) => f.a.suficiente).length;
  const factorProm = conBase ? (filas.filter((f) => f.a.suficiente).reduce((s, f) => s + (f.a.factor ?? 0), 0) / conBase) * 100 : 0;
  const ahorroE = filas.filter((f) => f.cat === "Energia" && f.a.suficiente).reduce((s, f) => s + (f.a.ahorro ?? 0), 0);
  const ahorroA = filas.filter((f) => f.cat === "Agua" && f.a.suficiente).reduce((s, f) => s + (f.a.ahorro ?? 0), 0);
  let fuera = 0;
  for (const f of filas) {
    const ef = obtenerMetaEfectiva(ctx, f.planta.id, f.cat).efMeta;
    const act = intensidadAnio(ctx, f.planta.id, f.cat, anio);
    if (act !== null && ef && act > ef) fuera++;
  }

  const descargar = () => {
    const rows = [
      ["Planta", "Vector", "Base", "Meses", "Media", "P25", "CV%", "Mejora%", "Meta", "Limite", "Unidad", "Vol", "%limpio", "Ahorro"],
    ];
    for (const f of filas) {
      const a = f.a;
      if (!a.suficiente) {
        rows.push([f.planta.nombre, VECTOR_META[f.cat].nombre, "Sin base", String(a.n), "", "", "", "", String(f.base?.efMetaFallback ?? ""), String(f.base?.efMetaFallback ?? ""), f.base?.unidad ?? "", "", "", ""]);
        continue;
      }
      rows.push([
        f.planta.nombre,
        VECTOR_META[f.cat].nombre,
        `${a.anios[0]}-${a.anios[a.anios.length - 1]}`,
        String(a.n),
        (a.media ?? 0).toFixed(4),
        (a.p25 ?? 0).toFixed(4),
        ((a.cv ?? 0) * 100).toFixed(1),
        ((a.factor ?? 0) * 100).toFixed(0),
        (a.metaObjetivo ?? 0).toFixed(4),
        (a.limiteMax ?? 0).toFixed(4),
        `${VECTOR_META[f.cat].unidad}/${f.planta.unidadProd}`,
        a.volMeta !== null && a.volMeta !== undefined ? a.volMeta.toFixed(1) : "",
        a.pctMeta !== null && a.pctMeta !== undefined ? String(a.pctMeta) : "",
        (a.ahorro ?? 0).toFixed(1),
      ]);
    }
    const csv = "\ufeff" + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Metas_SGA_${anio}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-white p-3">
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Origen
          <select className="select-light ml-2" value={modo} onChange={(e) => setMetasModo(e.target.value as "AUTO" | "MANUAL")}>
            <option value="AUTO">Automático (línea base)</option>
            <option value="MANUAL">Manual (valores fijos)</option>
          </select>
        </label>
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Rigor volumétrico
          <select className="select-light ml-2" value={rigor} onChange={(e) => setRigor(e.target.value as "P75" | "SIGMA" | "P90")}>
            <option value="P75">Exigente (P75)</option>
            <option value="SIGMA">Estándar (media + 1σ)</option>
            <option value="P90">Conservador (P90)</option>
          </select>
        </label>
        <Button size="sm" variant="ghost" onClick={clearOverrides}>
          Restaurar sugeridos
        </Button>
        <Button size="sm" onClick={descargar}>
          Descargar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Metas con base histórica" value={conBase} unit={`de ${filas.length}`} tone="blue" />
        <KpiCard title="Mejora promedio" value={fmt1.format(factorProm)} unit="%" tone="ok" hint="Reducción exigida sobre la intensidad media." />
        <KpiCard
          title="Ahorro potencial anual"
          value={fmt1.format(ahorroE)}
          unit="kWh"
          tone="navy"
          hint={
            <>
              Más <b className="text-navy">{fmt1.format(ahorroA)} m³</b> de agua.
            </>
          }
        />
        <KpiCard title={`Fuera de límite ${anio}`} value={fuera} unit="vectores" tone={fuera ? "alert" : "ok"} />
      </div>

      <Card>
        <CardTitle>Metas de mejora y límites máximos</CardTitle>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Planta</th>
                <th>Vector</th>
                <th>Línea base</th>
                <th>Media</th>
                <th>P25</th>
                <th>CV</th>
                <th>Mejora</th>
                <th>Meta</th>
                <th>Límite</th>
                <th>Vol. mensual</th>
                <th>% limpio</th>
                <th>Ahorro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => {
                const a = f.a;
                const act = intensidadAnio(ctx, f.planta.id, f.cat, anio);
                const ef = obtenerMetaEfectiva(ctx, f.planta.id, f.cat).efMeta;
                let estado = <span className="text-cloud">Sin datos</span>;
                if (act !== null && a.suficiente) {
                  estado =
                    act <= (a.metaObjetivo ?? ef) ? (
                      <Badge tone="ok">{fmt4.format(act)}</Badge>
                    ) : act <= ef ? (
                      <Badge tone="warn">{fmt4.format(act)}</Badge>
                    ) : (
                      <Badge tone="alert">+{fmt1.format(((act - ef) / ef) * 100)}%</Badge>
                    );
                }
                if (!a.suficiente) {
                  return (
                    <tr key={`${f.planta.id}-${f.cat}`}>
                      <td>{f.planta.corto}</td>
                      <td className="text-left font-bold">{VECTOR_META[f.cat].nombre}</td>
                      <td colSpan={3} className="text-left text-cloud">
                        Evidencia insuficiente ({a.n} meses)
                      </td>
                      <td colSpan={2}>
                        <input
                          className="w-16 rounded border-2 border-line px-1 text-right font-bold"
                          type="number"
                          defaultValue={((f.base?.factorMejora ?? 0) * 100).toFixed(0)}
                          onBlur={(e) => setMetasCampo(f.planta.id, f.cat, "factorMejora", Number(e.target.value) / 100)}
                        />
                        %
                      </td>
                      <td colSpan={2}>
                        <input
                          className="w-20 rounded border-2 border-line px-1 text-right font-bold"
                          type="number"
                          defaultValue={f.base?.efMetaFallback}
                          onBlur={(e) => setMetasCampo(f.planta.id, f.cat, "efMetaFallback", Number(e.target.value))}
                        />
                      </td>
                      <td colSpan={3}>—</td>
                      <td>{estado}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${f.planta.id}-${f.cat}`}>
                    <td>{f.planta.corto}</td>
                    <td className="text-left font-bold">{VECTOR_META[f.cat].nombre}</td>
                    <td className="text-muted">
                      {a.anios[0]}–{a.anios[a.anios.length - 1]} · {a.n} m
                    </td>
                    <td className="tabular text-blue">{fmt4.format(a.media ?? 0)}</td>
                    <td className="tabular text-ok">{fmt4.format(a.p25 ?? 0)}</td>
                    <td className={(a.cv ?? 0) > 0.25 ? "font-bold text-alert" : "text-muted"}>{fmt1.format((a.cv ?? 0) * 100)}%</td>
                    <td>
                      <input
                        className="w-14 rounded border-2 border-line px-1 text-right font-bold"
                        type="number"
                        min={0}
                        max={60}
                        defaultValue={((a.factor ?? 0) * 100).toFixed(0)}
                        onBlur={(e) => setOverride(f.planta.id, f.cat, Number(e.target.value))}
                      />
                      %
                    </td>
                    <td className="tabular font-extrabold text-ok">≤ {fmt4.format(a.metaObjetivo ?? 0)}</td>
                    <td className="tabular font-extrabold text-alert">≤ {fmt4.format(a.limiteMax ?? 0)}</td>
                    <td className="tabular">{a.volMeta != null ? `≤ ${fmt1.format(a.volMeta)}` : "—"}</td>
                    <td>{a.pctMeta != null ? `≥ ${a.pctMeta}%` : "n/a"}</td>
                    <td className="tabular font-bold text-ok">
                      {fmt1.format(a.ahorro ?? 0)} {VECTOR_META[f.cat].unidad}
                    </td>
                    <td>{estado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle>Criterio de cálculo</CardTitle>
        <div className="rounded-[12px] border border-dashed border-line bg-paper p-4 text-sm leading-6 text-muted">
          <p>
            <b className="text-navy">Línea base:</b> intensidad mensual de años anteriores a {anio}; si no hay previos, se usa el historial
            completo. Se excluyen meses sin producción.
          </p>
          <p>
            <b className="text-navy">Mejora sugerida:</b> (media − P25) / media, acotada entre 2% y 15%. Con menos de 6 meses se fija en 3%.
          </p>
          <p>
            <b className="text-navy">Meta:</b> media × (1 − mejora). <b className="text-navy">Límite:</b> P75 × (1 − mejora). Semáforo: verde
            bajo la meta, ámbar entre meta y límite, rojo por encima.
          </p>
        </div>
      </Card>
    </div>
  );
}
