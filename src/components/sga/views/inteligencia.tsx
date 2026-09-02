import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/sga/kpi";
import { ChartTip } from "@/components/sga/chart-tip";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { inteligenciaSerie } from "@/lib/sga/engine";
import { fmt1, fmt2 } from "@/lib/sga/format";
import { useEngineCtx, useSga } from "@/lib/sga/store";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const COPY: Record<string, { nombre: string; tituloReg: string; descReg: string; kpi: string; kpiDesc: string; she: string }> = {
  Energia: {
    nombre: "electricidad",
    tituloReg: "Tendencia y carga vampiro (stand-by)",
    descReg: "El cruce izquierdo de la línea revela el desperdicio continuo cuando la producción es cero.",
    kpi: "Carga vampiro estimada",
    kpiDesc: "Electricidad consumida sin producción (paros).",
    she: "Puntos fuera de control: meses con consumo eléctrico anormal, posible falla de equipo.",
  },
  Agua: {
    nombre: "agua",
    tituloReg: "Tendencia y gasto fijo hídrico",
    descReg: "El intercepto indica agua gastada sin producción. Valores altos sugieren fugas continuas.",
    kpi: "Gasto hídrico en paro",
    kpiDesc: "Agua consumida sin producción (revisar fugas).",
    she: "Consumo anormal de agua: fugas críticas o lavado ineficiente.",
  },
  Residuos: {
    nombre: "residuos",
    tituloReg: "Tendencia y generación basal",
    descReg: "Residuos generados sin producción: caducidades o mermas de mantenimiento.",
    kpi: "Generación sin producción",
    kpiDesc: "Residuos por caducidades o mermas.",
    she: "Generación anormal: problemas de calidad o purgas.",
  },
  Combustibles: {
    nombre: "combustibles",
    tituloReg: "Tendencia y consumo estructural",
    descReg: "Hidrocarburo quemado con planta inactiva (calderas en piloto).",
    kpi: "Consumo estructural base",
    kpiDesc: "Diésel/gas quemado en pilotos inactivos.",
    she: "Consumo anormal: revisión de calderas o logística.",
  },
};

export function InteligenciaView() {
  const ctx = useEngineCtx();
  const planta = useSga((s) => s.plantaActual);
  const cat = useSga((s) => s.catActual);
  const plantas = useSga((s) => s.plantas);
  const intel = inteligenciaSerie(ctx, planta, cat);
  const copy = COPY[cat];
  const [sel, setSel] = useState<number | null>(null);
  const nombrePlanta = plantas.find((p) => p.id === planta)?.nombre ?? planta;
  const unidadProd = plantas.find((p) => p.id === planta)?.unidadProd === "EX" ? "Ex." : "U";

  if (!intel) {
    return (
      <Card>
        <CardTitle>Sin serie suficiente</CardTitle>
        <p className="text-sm text-muted">
          Se necesitan al menos dos meses con producción y consumo en {nombrePlanta} / {copy.nombre} para calcular control estadístico y
          regresión. Carga más historial o cambia de planta/vector.
        </p>
      </Card>
    );
  }

  const carga = Math.max(0, intel.reg.intercept);
  const correl = (intel.reg.r * 100).toFixed(1);
  const shewhart = intel.labels.map((l, i) => ({
    mes: l,
    val: Number(intel.effArr[i].toFixed(4)),
    mean: intel.mean,
    ucl: intel.ucl,
    lcl: intel.lcl,
    out: intel.effArr[i] > intel.ucl || intel.effArr[i] < intel.lcl,
  }));
  const scatter = intel.prodArr.map((p, i) => ({ x: p, y: intel.consArr[i] }));
  const maxProd = Math.max(...intel.prodArr);
  const line = [
    { x: 0, y: intel.reg.intercept },
    { x: maxProd, y: intel.reg.slope * maxProd + intel.reg.intercept },
  ];
  const picked = sel !== null ? shewhart[sel] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Alertas detectadas"
          value={intel.anomalias.length}
          unit="meses anormales"
          tone={intel.anomalias.length ? "alert" : "ok"}
          hint="Meses con picos o caídas inusuales (media ± 3σ)."
        />
        <KpiCard title={copy.kpi} value={fmt1.format(carga)} unit={intel.unidad} tone="teal" hint={copy.kpiDesc} />
        <KpiCard
          title="Dependencia operativa"
          value={correl}
          unit="%"
          tone="blue"
          hint="Proporción del consumo explicada por el volumen de manufactura."
        />
      </div>

      <Card>
        <CardTitle>Historial de alertas · {cat === "Energia" ? "Energía" : cat}</CardTitle>
        <p className="mb-3 text-sm text-muted">{copy.she} Haz clic en un punto rojo para ver el mes.</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shewhart} onClick={(st) => {
              const idx = st?.activeTooltipIndex;
              if (typeof idx === "number") setSel(idx);
            }}>
              <CartesianGrid stroke="#EEF3FA" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#5B7088" }} interval={Math.max(0, Math.floor(shewhart.length / 12) - 1)} />
              <YAxis tick={{ fontSize: 11, fill: "#5B7088" }} />
              <Tooltip content={<ChartTip formatter={(v) => `${fmt2.format(v)} ${intel.unidad}/${unidadProd}`} />} />
              <Legend />
              <Line type="monotone" dataKey="val" name="Intensidad" stroke="#5B7088" strokeWidth={2} dot={(props) => {
                const { cx, cy, payload, index } = props as { cx: number; cy: number; payload: { out: boolean }; index: number };
                return (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r={payload.out ? 6 : 4}
                    fill={payload.out ? "#b91c1c" : "#047857"}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                );
              }} />
              <Line type="monotone" dataKey="mean" name="Promedio" stroke="#017ACB" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="ucl" name="Límite máx." stroke="#b91c1c" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="lcl" name="Límite mín." stroke="#b91c1c" strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardTitle>{copy.tituloReg}</CardTitle>
        <p className="mb-3 text-sm text-muted">{copy.descReg}</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid stroke="#EEF3FA" />
              <XAxis type="number" dataKey="x" name="Producción" tick={{ fontSize: 11, fill: "#5B7088" }} />
              <YAxis type="number" dataKey="y" name="Consumo" tick={{ fontSize: 11, fill: "#5B7088" }} />
              <ZAxis range={[60, 60]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTip />} />
              <Scatter name="Meses operativos" data={scatter} fill="#0164BD" />
              <Scatter
                name={`Tendencia (inicio = ${carga.toFixed(0)})`}
                data={line}
                fill="#b91c1c"
                line={{ stroke: "#b91c1c", strokeWidth: 2 }}
                legendType="line"
                shape={<circle r={0} />}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Dialog open={sel !== null} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          <DialogTitle>Ficha del mes</DialogTitle>
          <DialogDescription>{picked?.mes}</DialogDescription>
          {picked ? (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs font-bold tracking-wide text-muted uppercase">Intensidad</div>
                <div className="tabular text-lg font-extrabold text-navy">{fmt2.format(picked.val)}</div>
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide text-muted uppercase">Estado</div>
                <div className="font-bold">{picked.out ? "Fuera de control" : "Dentro de banda"}</div>
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide text-muted uppercase">Promedio</div>
                <div className="tabular">{fmt2.format(picked.mean)}</div>
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide text-muted uppercase">Banda 3σ</div>
                <div className="tabular">
                  {fmt2.format(picked.lcl)} – {fmt2.format(picked.ucl)}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
