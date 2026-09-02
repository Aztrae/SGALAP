import { Fragment } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/sga/kpi";
import { ChartTip } from "@/components/sga/chart-tip";
import { flujosDePlantaVector, plantaPorId, VECTOR_META, VECTORES } from "@/lib/sga/catalog";
import { recSerie, recStats } from "@/lib/sga/engine";
import { deltaPct, fmt1, fmt4 } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";
import type { Periodo, VectorId } from "@/lib/sga/types";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function recFmt(v: number, int: boolean) {
  return int ? fmt4.format(v) : fmt1.format(v);
}

export function RecordsView() {
  const ctx = useEngineCtx();
  const rec = useSga((s) => s.rec);
  const setRec = useSga((s) => s.setRec);
  const opts = { periodo: rec.periodo, metrica: rec.metrica, ceros: rec.ceros };
  const plantasUsar = ctx.plantas.filter((p) => rec.planta === "ALL" || p.id === rec.planta);
  const vectoresUsar = VECTORES.filter((v) => rec.vector === "ALL" || v === rec.vector);

  type Fila = { planta: string; flujo: string; esTotal: boolean; st: NonNullable<ReturnType<typeof recStats>>; cat: VectorId };
  const bloques: { cat: VectorId; filas: Fila[] }[] = [];
  for (const cat of vectoresUsar) {
    const filas: Fila[] = [];
    for (const p of plantasUsar) {
      const flujos = flujosDePlantaVector(p, cat);
      if (!flujos.length) continue;
      const stTotal = recStats(recSerie(ctx, p.id, cat, "__TOTAL__", opts));
      if (stTotal && flujos.length > 1) filas.push({ planta: p.id, flujo: "__TOTAL__", esTotal: true, st: stTotal, cat });
      else if (stTotal && flujos.length === 1) filas.push({ planta: p.id, flujo: flujos[0], esTotal: true, st: stTotal, cat });
      for (const f of flujos) {
        const st = recStats(recSerie(ctx, p.id, cat, f, opts));
        if (st && st.max.val > 0) filas.push({ planta: p.id, flujo: f, esTotal: false, st, cat });
      }
    }
    if (filas.length) bloques.push({ cat, filas });
  }

  const chartRows = bloques
    .flatMap((b) => {
      const usarTotales = rec.vector === "ALL";
      const hayTotales = b.filas.some((x) => x.esTotal);
      return b.filas
        .filter((f) => (usarTotales ? (hayTotales ? f.esTotal : true) : !f.esTotal))
        .map((f) => ({
          label: `${VECTOR_META[b.cat].nombre} · ${plantaPorId(ctx.plantas, f.planta)?.corto}`,
          min: f.st.min.val,
          max: f.st.max.val,
          avg: f.st.avg,
          range: f.st.max.val - f.st.min.val,
          base: f.st.min.val,
          color: VECTOR_META[b.cat].color,
          tagMin: `${f.st.min.mes} ${f.st.min.anio}`,
          tagMax: `${f.st.max.mes} ${f.st.max.anio}`,
        }));
    })
    .sort((a, b) => b.max - a.max)
    .slice(0, 18);

  const anios = Array.from(new Set(Object.values(ctx.bd).flatMap((p) => Object.keys(p)))).sort();

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-white p-3">
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Vector
          <select className="select-light ml-2" value={rec.vector} onChange={(e) => setRec({ vector: e.target.value as VectorId | "ALL" })}>
            <option value="ALL">Todos</option>
            {VECTORES.map((v) => (
              <option key={v} value={v}>
                {VECTOR_META[v].nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Planta
          <select className="select-light ml-2" value={rec.planta} onChange={(e) => setRec({ planta: e.target.value })}>
            <option value="ALL">Todas</option>
            {ctx.plantas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Métrica
          <select className="select-light ml-2" value={rec.metrica} onChange={(e) => setRec({ metrica: e.target.value as "ABS" | "INT" })}>
            <option value="ABS">Volumen absoluto</option>
            <option value="INT">Intensidad</option>
          </select>
        </label>
        <label className="text-[0.7rem] font-bold tracking-wide text-muted uppercase">
          Meses
          <select className="select-light ml-2" value={rec.periodo} onChange={(e) => setRec({ periodo: e.target.value as Periodo })}>
            <option value="ALL">Todo el año</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold">
          <input type="checkbox" checked={rec.ceros} onChange={(e) => setRec({ ceros: e.target.checked })} /> Incluir ceros
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bloques.map((b) => {
          const base = b.filas.filter((f) => f.esTotal);
          const pool = base.length ? base : b.filas;
          let recMax = pool[0];
          let recMin = pool[0];
          for (const f of pool) {
            if (f.st.max.val > recMax.st.max.val) recMax = f;
            if (f.st.min.val < recMin.st.min.val) recMin = f;
          }
          if (!recMax) return null;
          return (
            <KpiCard
              key={b.cat}
              title={`${VECTOR_META[b.cat].nombre} · pico`}
              value={recFmt(recMax.st.max.val, rec.metrica === "INT")}
              unit={VECTOR_META[b.cat].unidad}
              tone="navy"
              hint={
                <>
                  <b className="text-navy">{plantaPorId(ctx.plantas, recMax.planta)?.nombre}</b> · {recMax.st.max.mes} {recMax.st.max.anio}
                  <br />
                  Valle: {recFmt(recMin.st.min.val, rec.metrica === "INT")} · {plantaPorId(ctx.plantas, recMin.planta)?.corto}
                </>
              }
            />
          );
        })}
      </div>

      <Card>
        <CardTitle>Rango histórico (mínimo – máximo)</CardTitle>
        <p className="mb-3 text-sm text-muted">Cada barra va del mínimo al máximo registrado. Barras largas = proceso inestable.</p>
        <div style={{ height: Math.max(260, chartRows.length * 34 + 40) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} layout="vertical" margin={{ left: 24, right: 24 }}>
              <CartesianGrid stroke="#EEF3FA" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#5B7088" }} />
              <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: "#1E3548", fontWeight: 600 }} />
              <Tooltip content={<ChartTip formatter={(v) => recFmt(v, rec.metrica === "INT")} />} />
              <Bar dataKey="base" stackId="r" fill="transparent" />
              <Bar dataKey="range" stackId="r" name="Rango" radius={[0, 6, 6, 0]}>
                {chartRows.map((r) => (
                  <Cell key={r.label} fill={r.color} fillOpacity={0.45} stroke={r.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardTitle>Matriz de récords</CardTitle>
        <p className="mb-2 text-sm text-muted">
          {rec.ceros ? "Se incluyen meses en cero." : "Los meses en cero se excluyen para que el mínimo refleje operación real."}
        </p>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Vector / Flujo</th>
                <th>Planta</th>
                <th>Mínimo</th>
                <th>Promedio</th>
                <th>Máximo</th>
                <th>Δ</th>
                <th>Último</th>
                <th>Posición</th>
                <th>n</th>
              </tr>
            </thead>
            <tbody>
              {bloques.map((b) => (
                <Fragment key={b.cat}>
                  <tr key={b.cat} className="!bg-[#DCEAF7]">
                    <td colSpan={9} className="text-left font-extrabold tracking-wide text-[#00447A] uppercase">
                      {VECTOR_META[b.cat].nombre}
                    </td>
                  </tr>
                  {b.filas.map((f) => {
                    const pct = f.st.spread > 0 ? ((f.st.ultimo.val - f.st.min.val) / f.st.spread) * 100 : 0;
                    return (
                      <tr key={`${b.cat}-${f.planta}-${f.flujo}`} className={f.esTotal ? "font-extrabold" : ""}>
                        <td className={f.esTotal ? "" : "pl-6 text-muted"}>
                          {f.esTotal ? (f.flujo === "__TOTAL__" ? `Total ${VECTOR_META[b.cat].nombre}` : f.flujo) : f.flujo}
                        </td>
                        <td className="text-left">{plantaPorId(ctx.plantas, f.planta)?.nombre}</td>
                        <td className="tabular text-ok">
                          {recFmt(f.st.min.val, rec.metrica === "INT")}
                          <span className="ml-1 rounded bg-paper px-1.5 py-0.5 text-[0.65rem] font-bold text-muted uppercase">
                            {f.st.min.mes} {f.st.min.anio}
                          </span>
                        </td>
                        <td className="tabular text-blue">{recFmt(f.st.avg, rec.metrica === "INT")}</td>
                        <td className="tabular text-alert">
                          {recFmt(f.st.max.val, rec.metrica === "INT")}
                          <span className="ml-1 rounded bg-paper px-1.5 py-0.5 text-[0.65rem] font-bold text-muted uppercase">
                            {f.st.max.mes} {f.st.max.anio}
                          </span>
                        </td>
                        <td className="tabular text-muted">{recFmt(f.st.spread, rec.metrica === "INT")}</td>
                        <td className="tabular">{recFmt(f.st.ultimo.val, rec.metrica === "INT")}</td>
                        <td>
                          <span className="pos-bar">
                            <span className="pos-mark" style={{ left: `${Math.max(0, Math.min(100, pct))}%` }} />
                          </span>
                        </td>
                        <td className="text-cloud">{f.st.n}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <YoyTable anios={anios} bloques={bloques} />
    </div>
  );
}

function YoyTable({ anios, bloques }: { anios: string[]; bloques: { cat: VectorId; filas: { planta: string; flujo: string; esTotal: boolean }[] }[] }) {
  const ctx = useEngineCtx();
  const rec = useSga((s) => s.rec);
  const opts = { periodo: rec.periodo, metrica: rec.metrica, ceros: rec.ceros };
  if (anios.length < 2) {
    return (
      <Card>
        <CardTitle>Comparativo interanual</CardTitle>
        <p className="text-sm text-muted">Se necesitan al menos 2 años cargados.</p>
      </Card>
    );
  }
  return (
    <Card>
      <CardTitle>Comparativo interanual (promedio mensual)</CardTitle>
      <div className="overflow-x-auto">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Vector / Planta</th>
              {anios.map((a) => (
                <th key={a}>{a}</th>
              ))}
              <th>Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {bloques.flatMap((b) =>
              b.filas
                .filter((f) => f.esTotal)
                .map((f) => {
                  const serie = recSerie(ctx, f.planta, b.cat, f.flujo === "__TOTAL__" ? "__TOTAL__" : f.flujo, opts);
                  const por: Record<string, number[]> = {};
                  for (const o of serie) {
                    (por[o.anio] ??= []).push(o.val);
                  }
                  const avg: Record<string, number> = {};
                  for (const a of Object.keys(por)) avg[a] = por[a].reduce((x, y) => x + y, 0) / por[a].length;
                  const present = anios.filter((a) => avg[a] !== undefined);
                  const ult = present[present.length - 1];
                  const prev = present[present.length - 2];
                  const d = deltaPct(avg[ult], avg[prev]);
                  return (
                    <tr key={`${b.cat}-${f.planta}`}>
                      <td>
                        {VECTOR_META[b.cat].nombre} · {plantaPorId(ctx.plantas, f.planta)?.corto}
                      </td>
                      {anios.map((a) => (
                        <td key={a} className="tabular text-blue">
                          {avg[a] !== undefined ? recFmt(avg[a], rec.metrica === "INT") : "—"}
                        </td>
                      ))}
                      <td className={d === null ? "text-cloud" : d > 0 ? "font-bold text-alert" : "font-bold text-ok"}>
                        {d === null ? "—" : `${d > 0 ? "+" : ""}${d.toFixed(1)}%`}
                      </td>
                    </tr>
                  );
                }),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
