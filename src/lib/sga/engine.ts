import {
  flujosDePlantaVector,
  limitesPeriodo,
  plantaPorId,
  plantaTieneVector,
  VECTOR_META,
} from "./catalog";
import { mean, percentil, regresionLineal, stdDev } from "./stats";
import type {
  BD,
  FactoresEmision,
  MetasSGA,
  Periodo,
  Planta,
  RecStats,
  SeriePunto,
  VectorId,
} from "./types";

export type EngineCtx = {
  bd: BD;
  plantas: Planta[];
  metasSGA: MetasSGA;
  FE: FactoresEmision;
  anioActual: number;
  metasModo: "AUTO" | "MANUAL";
  rigorLimite: "P75" | "SIGMA" | "P90";
  metasOverride: Record<string, number>;
};

export function getDatosAnio(bd: BD, planta: string, anio: number) {
  return bd[planta]?.[anio];
}

export function slicePeriodo<T>(arr: T[], periodo: Periodo) {
  const { s, e } = limitesPeriodo(periodo);
  return arr.slice(s, e);
}

export function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export function totalVectorMes(d: { principal: { l: string; d: number[] }[] }, flujos: string[], mes: number) {
  return d.principal.filter((x) => flujos.includes(x.l)).reduce((a, x) => a + (x.d[mes] || 0), 0);
}

export function totalVectorRango(
  d: { principal: { l: string; d: number[] }[] },
  flujos: string[],
  s: number,
  e: number,
) {
  let t = 0;
  for (let i = s; i < e; i++) t += totalVectorMes(d, flujos, i);
  return t;
}

export function flujoLimpio(planta: Planta, cat: VectorId) {
  if (cat === "Energia") return "Solar";
  if (cat === "Agua" && planta.flujos.Recup) return "Recup";
  return null;
}

export function aniosBase(bd: BD, planta: string, anioActual: number) {
  if (!bd[planta]) return [];
  const todos = Object.keys(bd[planta])
    .map(Number)
    .sort((a, b) => a - b);
  const previos = todos.filter((a) => a < anioActual);
  return previos.length > 0 ? previos : todos;
}

export function serieBaseMetas(ctx: EngineCtx, plantaId: string, cat: VectorId) {
  const p = plantaPorId(ctx.plantas, plantaId);
  const flujos = flujosDePlantaVector(p, cat);
  const limpio = p ? flujoLimpio(p, cat) : null;
  const anios = aniosBase(ctx.bd, plantaId, ctx.anioActual);
  const intens: number[] = [];
  const vols: number[] = [];
  const pctAnual: { anio: number; pct: number }[] = [];
  for (const anio of anios) {
    const d = ctx.bd[plantaId]?.[anio];
    if (!d?.[cat]) continue;
    let sumTotal = 0;
    let sumLimpio = 0;
    for (let i = 0; i < 12; i++) {
      let v = 0;
      let vl = 0;
      for (const f of flujos) {
        const ds = d[cat].principal.find((x) => x.l === f);
        if (!ds) continue;
        const val = ds.d[i] || 0;
        v += val;
        if (f === limpio) vl += val;
      }
      if (v > 0) {
        vols.push(v);
        const pz = d.produccion[i] || 0;
        if (pz > 0) intens.push(v / pz);
      }
      sumTotal += v;
      sumLimpio += vl;
    }
    if (limpio && sumTotal > 0) pctAnual.push({ anio, pct: (sumLimpio / sumTotal) * 100 });
  }
  return { intens, vols, pctAnual, anios };
}

export type MetasAuto = {
  suficiente: boolean;
  n: number;
  anios: number[];
  media?: number;
  p25?: number;
  p50?: number;
  p75?: number;
  p90?: number;
  sigma?: number;
  cv?: number;
  factorSug?: number;
  factor?: number;
  efMeta?: number;
  metaObjetivo?: number;
  limiteMax?: number;
  volMeta?: number | null;
  pctMeta?: number | null;
  pctMejorAnio?: { anio: number; pct: number } | null;
  ahorro?: number;
  anioRef?: number;
  umbralCritico?: number;
  baseIncluyeActual?: boolean;
};

export function calcularMetasAuto(ctx: EngineCtx, planta: string, cat: VectorId): MetasAuto {
  const s = serieBaseMetas(ctx, planta, cat);
  const n = s.intens.length;
  if (n < 3) return { suficiente: false, n, anios: s.anios };
  const media = mean(s.intens);
  const p25 = percentil(s.intens, 0.25);
  const p50 = percentil(s.intens, 0.5);
  const p75 = percentil(s.intens, 0.75);
  const p90 = percentil(s.intens, 0.9);
  const sigma = stdDev(s.intens);
  const cv = media > 0 ? sigma / media : 0;
  let factorSug = media > 0 ? (media - p25) / media : 0.03;
  factorSug = Math.min(0.15, Math.max(0.02, factorSug));
  if (n < 6) factorSug = 0.03;
  const key = `${planta}|${cat}`;
  const factor = ctx.metasOverride[key] !== undefined ? ctx.metasOverride[key] : factorSug;
  const metaObjetivo = media * (1 - factor);
  const limiteMax = Math.max(metaObjetivo, p75 * (1 - factor));
  let volMeta: number | null = null;
  if (s.vols.length >= 3) {
    const vMedia = mean(s.vols);
    const vSigma = stdDev(s.vols);
    const vBase =
      ctx.rigorLimite === "P75"
        ? percentil(s.vols, 0.75)
        : ctx.rigorLimite === "P90"
          ? percentil(s.vols, 0.9)
          : vMedia + vSigma;
    volMeta = vBase * (1 - factor);
  }
  let pctMeta: number | null = null;
  let pctMejorAnio: { anio: number; pct: number } | null = null;
  if (s.pctAnual.length > 0) {
    const mejor = s.pctAnual.reduce((a, b) => (b.pct > a.pct ? b : a));
    pctMejorAnio = mejor;
    pctMeta = Math.floor(mejor.pct);
  }
  const anioRef = Math.max(...Object.keys(ctx.bd[planta] || {}).map(Number));
  const prodRef = sum(ctx.bd[planta]?.[anioRef]?.produccion ?? []);
  const ahorro = Math.max(0, media - metaObjetivo) * prodRef;
  return {
    suficiente: true,
    n,
    anios: s.anios,
    media,
    p25,
    p50,
    p75,
    p90,
    sigma,
    cv,
    factorSug,
    factor,
    efMeta: limiteMax,
    metaObjetivo,
    limiteMax,
    volMeta,
    baseIncluyeActual: s.anios.includes(ctx.anioActual),
    pctMeta,
    pctMejorAnio,
    ahorro,
    anioRef,
    umbralCritico: media + 2 * sigma,
  };
}

export function calcularLimiteDinamico(ctx: EngineCtx, planta: string, cat: VectorId, factorMejora: number, fallback: number) {
  let consTotal = 0;
  let prodTotal = 0;
  let historia = false;
  const p = plantaPorId(ctx.plantas, planta);
  for (const anio of Object.keys(ctx.bd[planta] || {}).map(Number)) {
    if (anio >= ctx.anioActual) continue;
    historia = true;
    const datos = ctx.bd[planta][anio];
    prodTotal += sum(datos.produccion);
    const flujos = flujosDePlantaVector(p, cat);
    consTotal += totalVectorRango(datos[cat], flujos, 0, 12);
  }
  if (historia && prodTotal > 0) return (consTotal / prodTotal) * (1 - factorMejora);
  return fallback;
}

export function obtenerMetaEfectiva(ctx: EngineCtx, planta: string, cat: VectorId) {
  const base = ctx.metasSGA[planta]?.[cat];
  if (!base) {
    return { auto: false, efMeta: 1, metaObjetivo: 1, origen: "Sin configuración" };
  }
  if (ctx.metasModo === "AUTO") {
    const a = calcularMetasAuto(ctx, planta, cat);
    if (a.suficiente && a.efMeta !== undefined && a.metaObjetivo !== undefined) {
      return {
        auto: true,
        efMeta: a.efMeta,
        metaObjetivo: a.metaObjetivo,
        volMeta: base.volMeta !== undefined ? a.volMeta : undefined,
        pctMeta: base.pctMeta !== undefined && a.pctMeta !== null ? a.pctMeta : undefined,
        origen: `Base ${a.anios[0]}–${a.anios[a.anios.length - 1]} (${a.n} meses) · mejora ${((a.factor ?? 0) * 100).toFixed(0)}%`,
        stats: a,
      };
    }
    return { auto: false, efMeta: base.efMetaFallback, metaObjetivo: base.efMetaFallback, origen: "Valor fijo · sin base histórica suficiente" };
  }
  const ef = calcularLimiteDinamico(ctx, planta, cat, base.factorMejora, base.efMetaFallback);
  return {
    auto: ef !== base.efMetaFallback,
    efMeta: ef,
    metaObjetivo: ef,
    volMeta: base.volMeta,
    pctMeta: base.pctMeta,
    origen: ef === base.efMetaFallback ? "Valor fijo (manual)" : `Manual · promedio histórico −${(base.factorMejora * 100).toFixed(0)}%`,
  };
}

export function calcularCO2(
  ctx: EngineCtx,
  planta: string,
  categoria: VectorId,
  s: number,
  e: number,
  anio = ctx.anioActual,
) {
  const datos = getDatosAnio(ctx.bd, planta, anio);
  if (!datos) return 0;
  const d = datos[categoria].principal;
  let t = 0;
  if (categoria === "Energia") {
    const val = d.find((x) => x.l === "Consumo CFE");
    if (val) t += (sum(val.d.slice(s, e)) * ctx.FE.CFE) / 1000;
  } else if (categoria === "Agua") {
    const val = d.find((x) => x.l === "Red");
    if (val) t += (sum(val.d.slice(s, e)) * ctx.FE.AguaRed) / 1000;
  } else if (categoria === "Residuos") {
    for (const x of d) {
      const factor = x.l === "Sólidos" ? ctx.FE.Solidos : x.l === "Líquidos" ? ctx.FE.Liquidos : x.l === "Biológicos" ? ctx.FE.Biologicos : 0;
      t += (sum(x.d.slice(s, e)) * factor) / 1000;
    }
  } else if (categoria === "Combustibles") {
    for (const x of d) {
      const key = x.l.replace(" ", "") as "Gasolina" | "Diesel" | "GasLP";
      const factor = ctx.FE[key] || 0;
      t += (sum(x.d.slice(s, e)) * factor) / 1000;
    }
  }
  return t;
}

export function intensidadAnio(ctx: EngineCtx, planta: string, cat: VectorId, anio: number) {
  const d = ctx.bd[planta]?.[anio];
  if (!d) return null;
  const p = plantaPorId(ctx.plantas, planta);
  const flujos = flujosDePlantaVector(p, cat);
  const cons = totalVectorRango(d[cat], flujos, 0, 12);
  const prod = sum(d.produccion);
  if (prod <= 0 || cons <= 0) return null;
  return cons / prod;
}

export function recSerie(
  ctx: EngineCtx,
  planta: string,
  cat: VectorId,
  flujo: string | "__TOTAL__",
  opts: { periodo: Periodo; metrica: "ABS" | "INT"; ceros: boolean },
): SeriePunto[] {
  const out: SeriePunto[] = [];
  if (!ctx.bd[planta]) return out;
  const p = plantaPorId(ctx.plantas, planta);
  const lim = limitesPeriodo(opts.periodo);
  const years = Object.keys(ctx.bd[planta])
    .map(Number)
    .sort((a, b) => a - b);
  for (const anio of years) {
    const dAnio = ctx.bd[planta][anio];
    if (!dAnio?.[cat]) continue;
    let arr: number[];
    if (flujo === "__TOTAL__") {
      arr = Array(12).fill(0);
      for (const f of flujosDePlantaVector(p, cat)) {
        const ds = dAnio[cat].principal.find((x) => x.l === f);
        if (ds) for (let i = 0; i < 12; i++) arr[i] += ds.d[i] || 0;
      }
    } else {
      const ds = dAnio[cat].principal.find((x) => x.l === flujo);
      if (!ds) continue;
      arr = ds.d;
    }
    for (let i = lim.s; i < lim.e; i++) {
      let v = arr[i] || 0;
      if (opts.metrica === "INT") {
        const pz = dAnio.produccion[i] || 0;
        if (pz <= 0) continue;
        v = v / pz;
      }
      if (v === 0 && !opts.ceros) continue;
      out.push({ val: v, mes: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][i], anio });
    }
  }
  return out;
}

export function recStats(serie: SeriePunto[]): RecStats | null {
  if (!serie.length) return null;
  let min = serie[0];
  let max = serie[0];
  let s = 0;
  for (const o of serie) {
    if (o.val < min.val) min = o;
    if (o.val > max.val) max = o;
    s += o.val;
  }
  return { min, max, avg: s / serie.length, n: serie.length, ultimo: serie[serie.length - 1], spread: max.val - min.val };
}

export function flujoPrincipalResiduos(bd: BD, planta: string) {
  const candidatos = ["Sólidos", "Líquidos", "Biológicos"];
  if (!bd[planta]) return "Sólidos";
  for (const flujo of candidatos) {
    for (const anio of Object.keys(bd[planta])) {
      const ds = bd[planta][Number(anio)].Residuos.principal.find((d) => d.l === flujo);
      if (ds && ds.d.some((v) => v > 0)) return flujo;
    }
  }
  return "Sólidos";
}

export function inteligenciaSerie(ctx: EngineCtx, planta: string, cat: VectorId) {
  const labels: string[] = [];
  const prodArr: number[] = [];
  const consArr: number[] = [];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const targetLabel =
    cat === "Energia"
      ? "Consumo CFE"
      : cat === "Agua"
        ? "Red"
        : cat === "Residuos"
          ? flujoPrincipalResiduos(ctx.bd, planta)
          : "Gasolina";
  const anios = Object.keys(ctx.bd[planta] || {})
    .map(Number)
    .sort((a, b) => a - b);
  for (const anio of anios) {
    const dAnio = ctx.bd[planta][anio];
    const rawTarget = dAnio[cat].principal.find((d) => d.l === targetLabel);
    if (!rawTarget) continue;
    for (let i = 0; i < 12; i++) {
      const p = dAnio.produccion[i];
      const c = rawTarget.d[i];
      if (p > 0 && c >= 0) {
        labels.push(`${meses[i]} ${String(anio).slice(2)}`);
        prodArr.push(p);
        consArr.push(c);
      }
    }
  }
  if (prodArr.length < 2) return null;
  const effArr = prodArr.map((p, i) => consArr[i] / p);
  const m = mean(effArr);
  const sd = stdDev(effArr);
  const ucl = m + 3 * sd;
  const lcl = Math.max(0, m - 3 * sd);
  const anomalias = effArr
    .map((val, i) => ({ val, i, out: val > ucl || val < lcl }))
    .filter((x) => x.out);
  const reg = regresionLineal(prodArr, consArr);
  return {
    labels,
    prodArr,
    consArr,
    effArr,
    mean: m,
    ucl,
    lcl,
    anomalias,
    reg,
    targetLabel,
    unidad: ctx.metasSGA[planta]?.[cat]?.unidad ?? VECTOR_META[cat].unidad,
  };
}

export function aniosDisponibles(bd: BD) {
  const set = new Set<number>();
  for (const p of Object.keys(bd)) {
    for (const a of Object.keys(bd[p])) set.add(Number(a));
  }
  return [...set].sort((a, b) => b - a);
}

export function vectorTotalesPeriodo(ctx: EngineCtx, planta: string, cat: VectorId, anio: number, periodo: Periodo) {
  const d = getDatosAnio(ctx.bd, planta, anio);
  const p = plantaPorId(ctx.plantas, planta);
  if (!d || !p) return { cons: 0, prod: 0, ig: 0, flujos: [] as { l: string; data: number[]; c: string }[] };
  const { s, e } = limitesPeriodo(periodo);
  const flujosVis = flujosDePlantaVector(p, cat);
  const flujos = d[cat].principal
    .filter((ds) => flujosVis.includes(ds.l))
    .map((ds) => ({ l: ds.l, data: ds.d.slice(s, e), c: ds.c }))
    .filter((ds) => ds.data.some((v) => v > 0));
  const cons = flujos.reduce((a, f) => a + sum(f.data), 0);
  const prod = sum(d.produccion.slice(s, e));
  return { cons, prod, ig: prod > 0 ? cons / prod : 0, flujos, s, e, meses: slicePeriodo(["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"], periodo), prodMes: d.produccion.slice(s, e) };
}

export { plantaTieneVector, VECTOR_META };
