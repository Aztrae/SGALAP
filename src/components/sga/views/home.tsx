import { KpiCard } from "@/components/sga/kpi";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartTip } from "@/components/sga/chart-tip";
import { VECTORES, limitesPeriodo, plantaTieneVector } from "@/lib/sga/catalog";
import { calcularCO2, calcularMetasAuto, intensidadAnio, inteligenciaSerie } from "@/lib/sga/engine";
import { fmt1, fmt2, fmtCompact } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";
import type { VectorId } from "@/lib/sga/types";
import { Building2, Droplets, Fuel, Recycle, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ICONS: Record<VectorId, typeof Zap> = {
  Energia: Zap,
  Agua: Droplets,
  Residuos: Recycle,
  Combustibles: Fuel,
};

export function HomeView() {
  const ctx = useEngineCtx();
  const periodo = useSga((s) => s.filtroTemporal);
  const anio = useSga((s) => s.anioActual);
  const setCategoria = useSga((s) => s.setCategoria);
  const setPlanta = useSga((s) => s.setPlanta);
  const { s, e } = limitesPeriodo(periodo);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].slice(s, e);

  let totalCorp = 0;
  const porPlanta: Record<string, number> = {};
  const porVector: Record<VectorId, number> = { Energia: 0, Agua: 0, Residuos: 0, Combustibles: 0 };
  for (const p of ctx.plantas) {
    porPlanta[p.id] = 0;
    for (const v of VECTORES) {
      const co2 = calcularCO2(ctx, p.id, v, s, e);
      porPlanta[p.id] += co2;
      porVector[v] += co2;
      totalCorp += co2;
    }
  }

  const co2Mes = meses.map((m, idx) => {
    const row: Record<string, number | string> = { mes: m };
    for (const v of VECTORES) {
      let sum = 0;
      for (const p of ctx.plantas) sum += calcularCO2(ctx, p.id, v, s + idx, s + idx + 1);
      row[v] = Number(sum.toFixed(3));
    }
    return row;
  });

  let fuera = 0;
  let alertas = 0;
  const semaforo: { planta: string; cat: VectorId; estado: "ok" | "warn" | "alert" | "na"; valor: string }[] = [];
  for (const p of ctx.plantas) {
    const intel = inteligenciaSerie(ctx, p.id, "Energia");
    if (intel) alertas += intel.anomalias.length;
    for (const v of VECTORES) {
      if (!plantaTieneVector(p, v)) continue;
      const a = calcularMetasAuto(ctx, p.id, v);
      const act = intensidadAnio(ctx, p.id, v, anio);
      const limite = a.efMeta ?? ctx.metasSGA[p.id]?.[v]?.efMetaFallback;
      const meta = a.metaObjetivo ?? limite;
      let estado: "ok" | "warn" | "alert" | "na" = "na";
      if (act !== null && limite) {
        if (act <= (meta ?? limite)) estado = "ok";
        else if (act <= limite) estado = "warn";
        else {
          estado = "alert";
          fuera++;
        }
      }
      semaforo.push({
        planta: p.corto,
        cat: v,
        estado,
        valor: act === null ? "—" : act.toFixed(3),
      });
    }
  }

  let ahorroKwh = 0;
  let ahorroM3 = 0;
  for (const p of ctx.plantas) {
    const eA = calcularMetasAuto(ctx, p.id, "Energia");
    const aA = calcularMetasAuto(ctx, p.id, "Agua");
    if (eA.suficiente) ahorroKwh += eA.ahorro ?? 0;
    if (aA.suficiente) ahorroM3 += aA.ahorro ?? 0;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Emisión global"
          value={fmt2.format(totalCorp)}
          unit="tCO₂e"
          tone="teal"
          hint="Consolidado de las tres plantas en el periodo."
          spark={co2Mes.map((r) => Number(r.Energia) + Number(r.Agua) + Number(r.Residuos) + Number(r.Combustibles))}
        />
        <KpiCard
          title="Fuera de límite"
          value={fuera}
          unit="vectores"
          tone={fuera > 0 ? "alert" : "ok"}
          hint={fuera > 0 ? "Requieren plan de acción documentado." : "Todos los vectores operan dentro del límite vigente."}
        />
        <KpiCard
          title="Alertas Shewhart"
          value={alertas}
          unit="meses"
          tone={alertas > 0 ? "warn" : "ok"}
          hint="Meses con intensidad eléctrica fuera de media ± 3σ (planta por planta)."
        />
        <KpiCard
          title="Ahorro potencial"
          value={fmtCompact(ahorroKwh)}
          unit="kWh"
          tone="blue"
          hint={
            <>
              Más <b className="text-navy">{fmt1.format(ahorroM3)} m³</b> de agua si cada planta opera en su meta.
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3" style={{ minHeight: 320 }}>
          <CardTitle>Evolución de emisiones (tCO₂e)</CardTitle>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2Mes}>
                <CartesianGrid stroke="#EEF3FA" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fontWeight: 600, fill: "#5B7088" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
                <Tooltip content={<ChartTip formatter={(v) => `${fmt2.format(v)} tCO₂e`} />} />
                <Area type="monotone" dataKey="Energia" stackId="1" stroke="#0E7C86" fill="#0E7C86" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Agua" stackId="1" stroke="#017ACB" fill="#017ACB" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Residuos" stackId="1" stroke="#1E3548" fill="#1E3548" fillOpacity={0.75} />
                <Area type="monotone" dataKey="Combustibles" stackId="1" stroke="#5B7088" fill="#5B7088" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardTitle>Participación por planta</CardTitle>
          <div className="flex flex-col gap-3">
            {ctx.plantas.map((p) => {
              const pct = totalCorp > 0 ? (porPlanta[p.id] / totalCorp) * 100 : 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanta(p.id)}
                  className="rounded-[14px] border border-line p-3 text-left hover:bg-paper"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-bold text-navy">
                      <Building2 className="size-4 text-muted" /> {p.nombre}
                    </span>
                    <span className="tabular font-extrabold">{fmt2.format(porPlanta[p.id])} tCO₂e</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-2">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 text-xs font-semibold text-muted">{pct.toFixed(1)}% del consolidado</div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Semáforo de intensidad {anio}</CardTitle>
        <p className="mb-3 text-sm text-muted">Verde = cumple meta de mejora. Ámbar = dentro del límite. Rojo = excede el máximo permisible.</p>
        <div className="overflow-x-auto">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Planta / Vector</th>
                {VECTORES.map((v) => (
                  <th key={v}>{v === "Energia" ? "Energía" : v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ctx.plantas.map((p) => (
                <tr key={p.id}>
                  <td className="font-bold text-navy">{p.nombre}</td>
                  {VECTORES.map((v) => {
                    const cell = semaforo.find((x) => x.planta === p.corto && x.cat === v);
                    if (!plantaTieneVector(p, v)) return <td key={v} className="text-cloud">—</td>;
                    const tone = cell?.estado === "ok" ? "ok" : cell?.estado === "warn" ? "warn" : cell?.estado === "alert" ? "alert" : "muted";
                    return (
                      <td key={v}>
                        <button type="button" onClick={() => { setPlanta(p.id); setCategoria(v); }}>
                          <Badge tone={tone}>{cell?.valor ?? "—"}</Badge>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {VECTORES.map((v) => {
          const Icon = ICONS[v];
          return (
            <button
              key={v}
              type="button"
              onClick={() => setCategoria(v)}
              className="flex items-center gap-3 rounded-[16px] border border-line bg-white p-4 text-left shadow-[var(--shadow-card)] hover:border-blue"
            >
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-paper text-navy">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-navy">{v === "Energia" ? "Energía" : v}</span>
                <span className="text-xs font-semibold text-muted">{fmt2.format(porVector[v])} tCO₂e</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
