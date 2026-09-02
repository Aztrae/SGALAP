import { Card, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/sga/kpi";
import { ChartTip } from "@/components/sga/chart-tip";
import { VECTORES, limitesPeriodo } from "@/lib/sga/catalog";
import { calcularCO2 } from "@/lib/sga/engine";
import { fmt2 } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS: Record<string, string> = {
  Energia: "#0E7C86",
  Agua: "#017ACB",
  Residuos: "#1E3548",
  Combustibles: "#5B7088",
};

export function HuellaView() {
  const ctx = useEngineCtx();
  const periodo = useSga((s) => s.filtroTemporal);
  const { s, e } = limitesPeriodo(periodo);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].slice(s, e);

  const plantas = ctx.plantas.map((p) => p.id);
  const matriz: Record<string, Record<string, number>> = {};
  const totP: Record<string, number> = {};
  const totV: Record<string, number> = { Energia: 0, Agua: 0, Residuos: 0, Combustibles: 0 };
  let total = 0;
  for (const p of plantas) {
    matriz[p] = {};
    totP[p] = 0;
    for (const v of VECTORES) {
      const co2 = calcularCO2(ctx, p, v, s, e);
      matriz[p][v] = co2;
      totP[p] += co2;
      totV[v] += co2;
      total += co2;
    }
  }

  const monthly = meses.map((m, idx) => {
    const row: Record<string, number | string> = { mes: m };
    for (const v of VECTORES) {
      let sum = 0;
      for (const p of plantas) sum += calcularCO2(ctx, p, v, s + idx, s + idx + 1);
      row[v] = Number(sum.toFixed(3));
    }
    return row;
  });

  const tones = ["blue", "teal", "navy"] as const;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Emisión global" value={fmt2.format(total)} unit="tCO₂e" tone="teal" hint="Consolidado corporativo del periodo." />
        {ctx.plantas.map((p, i) => (
          <KpiCard
            key={p.id}
            title={p.nombre}
            value={fmt2.format(totP[p.id])}
            unit="tCO₂e"
            tone={tones[i % tones.length]}
            hint={
              <>
                Participación: <b className="text-navy">{total > 0 ? ((totP[p.id] / total) * 100).toFixed(1) : 0}%</b>
              </>
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardTitle>Evolución temporal (tCO₂e)</CardTitle>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid stroke="#EEF3FA" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5B7088" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
                <Tooltip content={<ChartTip formatter={(v) => `${fmt2.format(v)} tCO₂e`} />} />
                <Legend />
                {VECTORES.map((v) => (
                  <Bar key={v} dataKey={v} name={v === "Energia" ? "Energía" : v} stackId="a" fill={COLORS[v]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Matriz de inventario (tCO₂e)</CardTitle>
          <div className="overflow-x-auto">
            <table className="hc-table">
              <thead>
                <tr>
                  <th>Vector</th>
                  {ctx.plantas.map((p) => (
                    <th key={p.id}>{p.corto}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {VECTORES.map((v) => (
                  <tr key={v}>
                    <td className="font-semibold text-muted">{v === "Energia" ? "Energía" : v}</td>
                    {plantas.map((p) => (
                      <td key={p} className="tabular">
                        {fmt2.format(matriz[p][v])}
                      </td>
                    ))}
                    <td className="tabular font-bold">{fmt2.format(totV[v])}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-extrabold text-navy">Total instalación</td>
                  {plantas.map((p) => (
                    <td key={p} className="tabular font-extrabold">
                      {fmt2.format(totP[p])}
                    </td>
                  ))}
                  <td className="tabular text-lg font-extrabold text-alert">{fmt2.format(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
