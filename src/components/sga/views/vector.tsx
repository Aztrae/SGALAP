import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/sga/kpi";
import { ChartTip } from "@/components/sga/chart-tip";
import { flujosDePlantaVector, limitesPeriodo, plantaPorId, plantaTieneVector, VECTOR_META } from "@/lib/sga/catalog";
import { calcularCO2, getDatosAnio, obtenerMetaEfectiva, sum, vectorTotalesPeriodo } from "@/lib/sga/engine";
import { fmt1, fmt2, fmt4 } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function VectorView() {
  const ctx = useEngineCtx();
  const plantaId = useSga((s) => s.plantaActual);
  const cat = useSga((s) => s.catActual);
  const anio = useSga((s) => s.anioActual);
  const periodo = useSga((s) => s.filtroTemporal);
  const mesDona = useSga((s) => s.mesDona);
  const setMesDona = useSga((s) => s.setMesDona);
  const comparar = useSga((s) => s.compararPlantas);
  const yoy = useSga((s) => s.yoy);
  const metrica = useSga((s) => s.metricaVector);
  const toggleComparar = useSga((s) => s.toggleComparar);
  const toggleYoy = useSga((s) => s.toggleYoy);
  const setMetricaVector = useSga((s) => s.setMetricaVector);

  const planta = plantaPorId(ctx.plantas, plantaId);
  const t = vectorTotalesPeriodo(ctx, plantaId, cat, anio, periodo);
  const meta = obtenerMetaEfectiva(ctx, plantaId, cat);
  const unidad = ctx.metasSGA[plantaId]?.[cat]?.unidad ?? VECTOR_META[cat].unidad;
  const esResiduo = cat === "Residuos";
  const unidadProd = planta?.unidadProd === "EX" ? "Ex." : "U";
  const termino = planta?.terminoUnidad ?? "pieza";
  const cumpleNorma = t.ig <= meta.efMeta;
  const cumpleMeta = t.ig <= (meta.metaObjetivo ?? meta.efMeta);
  const badge = cumpleMeta ? (
    <Badge tone="ok">Óptimo · cumple meta de mejora</Badge>
  ) : cumpleNorma ? (
    <Badge tone="warn">Tolerable · dentro del límite</Badge>
  ) : (
    <Badge tone="alert">Alerta · excede el máximo permisible</Badge>
  );

  const { s, e } = limitesPeriodo(periodo);
  const meses = t.meses ?? [];
  const chartRows = meses.map((m, i) => {
    const row: Record<string, number | string> = { mes: m };
    for (const f of t.flujos) {
      const prod = t.prodMes?.[i] || 0;
      const raw = f.data[i] || 0;
      row[f.l] = metrica === "INT" ? (prod > 0 ? raw / prod : 0) : raw;
    }
    const total = t.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
    const prod = t.prodMes?.[i] || 0;
    row._total = metrica === "INT" ? (prod > 0 ? total / prod : 0) : total;
    if (yoy) {
      const prev = getDatosAnio(ctx.bd, plantaId, anio - 1);
      if (prev) {
        const flujos = flujosDePlantaVector(planta, cat);
        let pv = 0;
        for (const f of flujos) {
          const ds = prev[cat].principal.find((x) => x.l === f);
          pv += ds?.d[s + i] || 0;
        }
        const pp = prev.produccion[s + i] || 0;
        row._yoy = metrica === "INT" ? (pp > 0 ? pv / pp : 0) : pv;
      }
    }
    return row;
  });

  const stacked = ctx.bd[plantaId]?.[anio]?.[cat].stacked ?? true;

  let tCO2e = calcularCO2(ctx, plantaId, cat, s, e);
  let tCO2Avoid = 0;
  if (cat === "Energia") {
    const solar = t.flujos.find((f) => f.l === "Solar");
    const kwh = solar ? sum(solar.data) : 0;
    tCO2Avoid = (kwh * ctx.FE.CFE) / 1000;
  }

  const compareRows = meses.map((m, i) => {
    const row: Record<string, number | string> = { mes: m };
    for (const p of ctx.plantas) {
      if (!plantaTieneVector(p, cat)) continue;
      const vt = vectorTotalesPeriodo(ctx, p.id, cat, anio, periodo);
      row[p.corto] = vt.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
    }
    return row;
  });

  const singleFlow = t.flujos.length === 1;
  const donaData =
    mesDona === "ALL"
      ? t.flujos.map((f) => ({ name: f.l, value: sum(f.data), color: f.c }))
      : t.flujos.map((f) => ({ name: f.l, value: f.data[Number(mesDona)] || 0, color: f.c }));

  const trendInfo = singleFlow
    ? t.flujos[0].data.map((curr, i, arr) => {
        if (i === 0) return { color: "#cbd5e1", txt: "Mes base" };
        const prev = arr[i - 1];
        const delta = prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;
        if (delta > 0) return { color: "#b91c1c", txt: `Empeoró +${delta.toFixed(1)}%` };
        if (delta < 0) return { color: "#047857", txt: `Mejoró ${delta.toFixed(1)}%` };
        return { color: "#cbd5e1", txt: "Sin variación" };
      })
    : [];

  const igSeries = meses.map((m, i) => {
    const prod = t.prodMes?.[i] || 0;
    const cons = t.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
    return {
      mes: m,
      real: prod > 0 ? cons / prod : 0,
      limite: meta.efMeta,
      objetivo: meta.metaObjetivo ?? meta.efMeta,
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold">
          <input type="checkbox" checked={yoy} onChange={toggleYoy} /> Año anterior
        </label>
        <label className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold">
          <input type="checkbox" checked={comparar} onChange={toggleComparar} /> Comparar plantas
        </label>
        <div className="flex overflow-hidden rounded-full border border-line bg-white text-xs font-bold">
          <button
            type="button"
            className={`px-3 py-1.5 ${metrica === "ABS" ? "bg-navy text-white" : ""}`}
            onClick={() => setMetricaVector("ABS")}
          >
            Volumen
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 ${metrica === "INT" ? "bg-navy text-white" : ""}`}
            onClick={() => setMetricaVector("INT")}
          >
            Intensidad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title={esResiduo ? "Generación total" : "Consumo total"}
          value={fmt1.format(t.cons)}
          unit={unidad}
          tone="blue"
          hint={
            tCO2e > 0 ? (
              <>
                Impacto: <b className="text-navy">{fmt2.format(tCO2e)} tCO₂e</b>
                {tCO2Avoid > 0 ? (
                  <span className="mt-1 block text-ok">Emisión evitada (solar): {fmt2.format(tCO2Avoid)} tCO₂e</span>
                ) : null}
              </>
            ) : (
              "Volumen del periodo seleccionado."
            )
          }
          spark={chartRows.map((r) => Number(r._total) || 0)}
        />
        <KpiCard
          title={planta?.unidadProd === "EX" ? "Exámenes realizados" : "Producción"}
          value={fmt1.format(t.prod)}
          unit={unidadProd}
          tone="navy"
          hint={planta?.unidadProd === "EX" ? "Volumen de pruebas procesadas." : "Volumen manufacturado."}
        />
        <KpiCard
          title="Intensidad de proceso"
          value={fmt4.format(t.ig)}
          unit={`${unidad}/${unidadProd}`}
          tone={cumpleMeta ? "ok" : cumpleNorma ? "warn" : "alert"}
          hint={
            <>
              El proceso {esResiduo ? "genera" : "consume"} <b className="text-navy">{fmt4.format(t.ig)} {unidad}</b> por {termino}.
              <div className="mt-1">
                Meta ≤ {fmt4.format(meta.metaObjetivo ?? meta.efMeta)} · Límite ≤ {fmt4.format(meta.efMeta)}
              </div>
              <div className="mt-1 text-[0.72rem] text-cloud">{meta.origen}</div>
              <div className="mt-2">{badge}</div>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle>{comparar ? "Comparativo por planta" : "Comportamiento temporal"}</CardTitle>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comparar ? compareRows : chartRows}>
                <CartesianGrid stroke="#EEF3FA" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fontWeight: 600, fill: "#5B7088" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
                <Tooltip content={<ChartTip formatter={(v) => `${fmt1.format(v)} ${unidad}${metrica === "INT" ? "/" + unidadProd : ""}`} />} />
                <Legend />
                {comparar
                  ? ctx.plantas
                      .filter((p) => plantaTieneVector(p, cat))
                      .map((p, i) => (
                        <Bar key={p.id} dataKey={p.corto} fill={["#017ACB", "#0E7C86", "#1E3548"][i % 3]} radius={[6, 6, 0, 0]} />
                      ))
                  : t.flujos.map((f) => (
                      <Bar
                        key={f.l}
                        dataKey={f.l}
                        stackId={stacked ? "a" : undefined}
                        fill={f.c}
                        radius={[6, 6, 0, 0]}
                      />
                    ))}
                {!comparar && yoy ? <Line type="monotone" dataKey="_yoy" name={`${anio - 1}`} stroke="#94a3b8" strokeDasharray="5 5" dot={false} /> : null}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <CardTitle className="mb-0 border-0 pb-0 before:hidden">{singleFlow ? "Tendencia mensual" : "Distribución"}</CardTitle>
            {!singleFlow ? (
              <select className="select-light" value={mesDona} onChange={(e) => setMesDona(e.target.value)}>
                <option value="ALL">Periodo</option>
                {meses.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <div className="h-[260px]">
            {singleFlow ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChartFromTrend meses={meses} data={t.flujos[0].data} info={trendInfo} unidad={unidad} />
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donaData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2}>
                    {donaData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTip formatter={(v) => `${fmt1.format(v)} ${unidad}`} />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Métrica de intensidad operativa</CardTitle>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={igSeries}>
              <CartesianGrid stroke="#EEF3FA" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fontWeight: 600, fill: "#5B7088" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
              <Tooltip content={<ChartTip formatter={(v) => `${Number(v).toFixed(4)} ${unidad}/${unidadProd}`} />} />
              <Legend />
              <Line type="monotone" dataKey="real" name="Intensidad real" stroke="#00142C" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="limite" name="Límite máximo" stroke="#b91c1c" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="objetivo" name="Meta de mejora" stroke="#047857" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function BarChartFromTrend({
  meses,
  data,
  info,
  unidad,
}: {
  meses: string[];
  data: number[];
  info: { color: string; txt: string }[];
  unidad: string;
}) {
  const rows = meses.map((m, i) => ({ mes: m, v: data[i], color: info[i]?.color }));
  return (
    <ComposedChart data={rows}>
      <CartesianGrid stroke="#EEF3FA" vertical={false} />
      <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5B7088" }} />
      <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
      <Tooltip content={<ChartTip formatter={(v) => `${fmt1.format(v)} ${unidad}`} />} />
      <Bar dataKey="v" name="Volumen" radius={[6, 6, 0, 0]}>
        {rows.map((r) => (
          <Cell key={r.mes} fill={r.color} />
        ))}
      </Bar>
    </ComposedChart>
  );
}
