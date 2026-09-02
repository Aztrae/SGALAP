/* Panel SGA Lapisa — funciona 100% sin internet. Excel + HTML en la misma carpeta. */
(function () {
  "use strict";

  if (window.Chart && window.ChartDataLabels) {
    try { Chart.register(ChartDataLabels); } catch (e) { /* already */ }
  }
  if (window.Chart) {
    Chart.defaults.font.family = '"Segoe UI", system-ui, sans-serif';
    Chart.defaults.color = "#5B7088";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.datalabels = { display: false };
  }

  const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const VECTORES = ["Energia", "Agua", "Residuos", "Combustibles"];
  const VNOM = { Energia: "Energía", Agua: "Agua", Residuos: "Residuos", Combustibles: "Combustibles" };
  const CFG_KEY = "panelSGA_configUsuario_v1";
  const CFG_RUTA = "panelSGA_rutaExcel_v1";
  const CFG_PASS = "panelSGA_passHash_v1";
  const CFG_UNLOCK = "panelSGA_desbloqueado_v1";
  const CFG_CACHE = "panelSGA_dataset_v1";
  const CFG_UI = "panelSGA_ui_v1";
  const PASS_HASH = "zizh";
  const EXCEL_NAME = "Base_de_Datos_Dashboard.xlsx";

  const FLUJOS_DEF = { "Consumo CFE": true, Solar: true, Red: true, Recup: true, Sólidos: true, Líquidos: true, Biológicos: true };
  const PLANTAS_SEED = [
    { id: "PP", nombre: "Planta Principal", corto: "P. Principal", unidadProd: "PZ", terminoUnidad: "pieza", vectores: { Combustibles: true }, flujos: { ...FLUJOS_DEF } },
    { id: "PA", nombre: "Planta Agrícola", corto: "P. Agrícola", unidadProd: "PZ", terminoUnidad: "pieza", vectores: { Combustibles: false }, flujos: { ...FLUJOS_DEF, Recup: false, Biológicos: false } },
    { id: "Diagnostico", nombre: "Diagnóstico", corto: "Diagnóstico", unidadProd: "EX", terminoUnidad: "examen", vectores: { Combustibles: false }, flujos: { "Consumo CFE": true, Solar: true, Red: true, Recup: false, Sólidos: false, Líquidos: false, Biológicos: true } },
  ];
  const METAS_SEED = {
    PP: { Energia: { factorMejora: 0.05, efMetaFallback: 1.3, pctMeta: 15, unidad: "kWh" }, Agua: { factorMejora: 0.03, efMetaFallback: 6.0, pctMeta: 50, unidad: "m³" }, Residuos: { factorMejora: 0.02, efMetaFallback: 0.05, volMeta: 45000, unidad: "kg/L" }, Combustibles: { factorMejora: 0.02, efMetaFallback: 0.05, volMeta: 45000, unidad: "L" } },
    PA: { Energia: { factorMejora: 0.05, efMetaFallback: 0.3, pctMeta: 90, unidad: "kWh" }, Agua: { factorMejora: 0.03, efMetaFallback: 2.5, pctMeta: 0, unidad: "m³" }, Residuos: { factorMejora: 0.02, efMetaFallback: 0.08, volMeta: 25000, unidad: "kg/L" }, Combustibles: { factorMejora: 0.02, efMetaFallback: 0.08, volMeta: 25000, unidad: "L" } },
    Diagnostico: { Energia: { factorMejora: 0.05, efMetaFallback: 3.5, pctMeta: 40, unidad: "kWh" }, Agua: { factorMejora: 0.03, efMetaFallback: 10, pctMeta: 0, unidad: "m³" }, Residuos: { factorMejora: 0.02, efMetaFallback: 0.02, volMeta: 5000, unidad: "kg/L" }, Combustibles: { factorMejora: 0.02, efMetaFallback: 0.02, volMeta: 5000, unidad: "L" } },
  };
  const FE0 = { CFE: 0.438, Gasolina: 2.31, Diesel: 2.68, GasLP: 1.51, AguaRed: 0.344, Solidos: 0.5, Liquidos: 0.8, Biologicos: 2.5 };
  const COLORS = {
    Energia: ["#C2410C", "#0E7C86"],
    Agua: ["#017ACB", "#38BDF8"],
    Residuos: ["#B45309", "#5B7088", "#B91C1C"],
    Combustibles: ["#EA580C", "#334155", "#0284C7"],
  };

  const fmt0 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
  const fmt2 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });
  const fmt4 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 4 });
  const fmtC = new Intl.NumberFormat("es-MX", { notation: "compact", maximumFractionDigits: 1 });

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function sum(a) { return a.reduce((x, y) => x + y, 0); }
  function mean(a) { return a.length ? sum(a) / a.length : 0; }
  function stdDev(a) {
    if (a.length < 2) return 0;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length);
  }
  function percentil(vals, q) {
    if (!vals.length) return 0;
    const a = [...vals].sort((x, y) => x - y);
    const idx = (a.length - 1) * q, lo = Math.floor(idx), hi = Math.ceil(idx);
    return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (idx - lo);
  }
  function regresion(x, y) {
    const n = x.length, sx = sum(x), sy = sum(y);
    const sxy = x.reduce((s, xi, i) => s + xi * y[i], 0);
    const sx2 = x.reduce((s, xi) => s + xi * xi, 0);
    const sy2 = y.reduce((s, yi) => s + yi * yi, 0);
    const den = n * sx2 - sx * sx;
    const slope = den === 0 ? 0 : (n * sxy - sx * sy) / den;
    const intercept = n ? (sy - slope * sx) / n : 0;
    const rden = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
    const r = rden === 0 ? 0 : (n * sxy - sx * sy) / rden;
    return { slope, intercept, r };
  }
  function hashSimple(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return h.toString(36);
  }
  function currentQ() { return "Q" + (Math.floor(new Date().getMonth() / 3) + 1); }
  function lim(p) {
    if (p === "Q1") return { s: 0, e: 3 };
    if (p === "Q2") return { s: 3, e: 6 };
    if (p === "Q3") return { s: 6, e: 9 };
    if (p === "Q4") return { s: 9, e: 12 };
    return { s: 0, e: 12 };
  }
  function emptyYear() {
    const z = () => Array(12).fill(0);
    return {
      produccion: z(),
      Energia: { stacked: true, principal: [{ l: "Consumo CFE", d: z(), c: COLORS.Energia[0] }, { l: "Solar", d: z(), c: COLORS.Energia[1] }] },
      Agua: { stacked: true, principal: [{ l: "Red", d: z(), c: COLORS.Agua[0] }, { l: "Recup", d: z(), c: COLORS.Agua[1] }] },
      Residuos: { stacked: false, principal: [{ l: "Sólidos", d: z(), c: COLORS.Residuos[0] }, { l: "Líquidos", d: z(), c: COLORS.Residuos[1] }, { l: "Biológicos", d: z(), c: COLORS.Residuos[2] }] },
      Combustibles: { stacked: false, principal: [{ l: "Gasolina", d: z(), c: COLORS.Combustibles[0] }, { l: "Diesel", d: z(), c: COLORS.Combustibles[1] }, { l: "Gas LP", d: z(), c: COLORS.Combustibles[2] }] },
    };
  }
  function flujosDe(p, cat) {
    if (!p) return [];
    if (cat === "Combustibles") return p.vectores.Combustibles ? ["Gasolina", "Diesel", "Gas LP"] : [];
    const map = { Energia: ["Consumo CFE", "Solar"], Agua: ["Red", "Recup"], Residuos: ["Sólidos", "Líquidos", "Biológicos"] };
    return (map[cat] || []).filter((f) => p.flujos[f]);
  }
  function tieneVector(p, cat) { return flujosDe(p, cat).length > 0; }
  function plantaBy(id) { return S.plantas.find((p) => p.id === id); }
  function construirMetas(plantas) {
    const out = {};
    plantas.forEach((p) => {
      out[p.id] = {};
      VECTORES.forEach((c) => {
        if (!tieneVector(p, c)) return;
        out[p.id][c] = clone((METAS_SEED[p.id] && METAS_SEED[p.id][c]) || { factorMejora: 0.05, efMetaFallback: 1, unidad: "kWh" });
      });
    });
    return out;
  }

  const S = {
    bd: {},
    plantas: clone(PLANTAS_SEED),
    metasSGA: construirMetas(PLANTAS_SEED),
    FE: clone(FE0),
    anio: new Date().getFullYear(),
    planta: "PP",
    cat: "Energia",
    periodo: currentQ(),
    mesDona: "ALL",
    vista: "home",
    comparar: false,
    yoy: true,
    metrica: "ABS",
    metasModo: "AUTO",
    rigor: "SIGMA",
    override: {},
    rec: { vector: "ALL", planta: "ALL", metrica: "ABS", periodo: "ALL", ceros: false },
    unlocked: false,
    ruta: EXCEL_NAME,
    report: null,
    charts: {},
  };

  function ctx() {
    return { bd: S.bd, plantas: S.plantas, metasSGA: S.metasSGA, FE: S.FE, anioActual: S.anio, metasModo: S.metasModo, rigorLimite: S.rigor, metasOverride: S.override };
  }

  function aniosDisp() {
    const set = new Set();
    Object.values(S.bd).forEach((p) => Object.keys(p).forEach((a) => set.add(Number(a))));
    return [...set].sort((a, b) => b - a);
  }
  function getAnio(planta, anio) { return S.bd[planta] && S.bd[planta][anio]; }
  function totalMes(d, flujos, i) {
    return d.principal.filter((x) => flujos.includes(x.l)).reduce((a, x) => a + (x.d[i] || 0), 0);
  }
  function totalRango(d, flujos, s, e) {
    let t = 0; for (let i = s; i < e; i++) t += totalMes(d, flujos, i); return t;
  }
  function aniosBase(planta) {
    if (!S.bd[planta]) return [];
    const todos = Object.keys(S.bd[planta]).map(Number).sort((a, b) => a - b);
    const prev = todos.filter((a) => a < S.anio);
    return prev.length ? prev : todos;
  }
  function serieBase(planta, cat) {
    const p = plantaBy(planta), flujos = flujosDe(p, cat);
    const limpio = cat === "Energia" ? "Solar" : cat === "Agua" && p && p.flujos.Recup ? "Recup" : null;
    const anios = aniosBase(planta);
    const intens = [], vols = [], pctAnual = [];
    anios.forEach((anio) => {
      const d = getAnio(planta, anio); if (!d || !d[cat]) return;
      let sumT = 0, sumL = 0;
      for (let i = 0; i < 12; i++) {
        let v = 0, vl = 0;
        flujos.forEach((f) => {
          const ds = d[cat].principal.find((x) => x.l === f);
          const val = ds ? ds.d[i] || 0 : 0;
          v += val; if (f === limpio) vl += val;
        });
        if (v > 0) {
          vols.push(v);
          const pz = d.produccion[i] || 0;
          if (pz > 0) intens.push(v / pz);
        }
        sumT += v; sumL += vl;
      }
      if (limpio && sumT > 0) pctAnual.push({ anio, pct: (sumL / sumT) * 100 });
    });
    return { intens, vols, pctAnual, anios };
  }
  function metasAuto(planta, cat) {
    const s = serieBase(planta, cat), n = s.intens.length;
    if (n < 3) return { suficiente: false, n, anios: s.anios };
    const media = mean(s.intens), p25 = percentil(s.intens, 0.25), p75 = percentil(s.intens, 0.75);
    const sigma = stdDev(s.intens), cv = media > 0 ? sigma / media : 0;
    let factorSug = media > 0 ? (media - p25) / media : 0.03;
    factorSug = Math.min(0.15, Math.max(0.02, factorSug));
    if (n < 6) factorSug = 0.03;
    const key = planta + "|" + cat;
    const factor = S.override[key] !== undefined ? S.override[key] : factorSug;
    const metaObjetivo = media * (1 - factor);
    const limiteMax = Math.max(metaObjetivo, p75 * (1 - factor));
    let volMeta = null;
    if (s.vols.length >= 3) {
      const vMedia = mean(s.vols), vSigma = stdDev(s.vols);
      const vBase = S.rigor === "P75" ? percentil(s.vols, 0.75) : S.rigor === "P90" ? percentil(s.vols, 0.9) : vMedia + vSigma;
      volMeta = vBase * (1 - factor);
    }
    let pctMeta = null;
    if (s.pctAnual.length) pctMeta = Math.floor(s.pctAnual.reduce((a, b) => (b.pct > a.pct ? b : a)).pct);
    const anioRef = Math.max(...Object.keys(S.bd[planta] || {}).map(Number));
    const prodRef = sum((getAnio(planta, anioRef) || { produccion: [] }).produccion);
    const ahorro = Math.max(0, media - metaObjetivo) * prodRef;
    return { suficiente: true, n, anios: s.anios, media, p25, p75, sigma, cv, factor, efMeta: limiteMax, metaObjetivo, limiteMax, volMeta, pctMeta, ahorro };
  }
  function metaEfectiva(planta, cat) {
    const base = S.metasSGA[planta] && S.metasSGA[planta][cat];
    if (!base) return { efMeta: 1, metaObjetivo: 1, origen: "Sin configuración" };
    if (S.metasModo === "AUTO") {
      const a = metasAuto(planta, cat);
      if (a.suficiente) return { efMeta: a.efMeta, metaObjetivo: a.metaObjetivo, origen: "Base " + a.anios[0] + "–" + a.anios[a.anios.length - 1] + " · mejora " + ((a.factor || 0) * 100).toFixed(0) + "%", stats: a };
      return { efMeta: base.efMetaFallback, metaObjetivo: base.efMetaFallback, origen: "Valor fijo · sin base histórica" };
    }
    return { efMeta: base.efMetaFallback, metaObjetivo: base.efMetaFallback, origen: "Manual" };
  }
  function calcCO2(planta, cat, s, e, anio) {
    const datos = getAnio(planta, anio || S.anio); if (!datos) return 0;
    const d = datos[cat].principal; let t = 0;
    if (cat === "Energia") { const v = d.find((x) => x.l === "Consumo CFE"); if (v) t += (sum(v.d.slice(s, e)) * S.FE.CFE) / 1000; }
    else if (cat === "Agua") { const v = d.find((x) => x.l === "Red"); if (v) t += (sum(v.d.slice(s, e)) * S.FE.AguaRed) / 1000; }
    else if (cat === "Residuos") {
      d.forEach((x) => {
        const f = x.l === "Sólidos" ? S.FE.Solidos : x.l === "Líquidos" ? S.FE.Liquidos : x.l === "Biológicos" ? S.FE.Biologicos : 0;
        t += (sum(x.d.slice(s, e)) * f) / 1000;
      });
    } else if (cat === "Combustibles") {
      d.forEach((x) => {
        const k = x.l.replace(" ", "");
        t += (sum(x.d.slice(s, e)) * (S.FE[k] || 0)) / 1000;
      });
    }
    return t;
  }
  function intensAnio(planta, cat, anio) {
    const d = getAnio(planta, anio); if (!d) return null;
    const p = plantaBy(planta), flujos = flujosDe(p, cat);
    const cons = totalRango(d[cat], flujos, 0, 12), prod = sum(d.produccion);
    if (prod <= 0 || cons <= 0) return null;
    return cons / prod;
  }
  function totPeriodo(planta, cat, anio, periodo) {
    const d = getAnio(planta, anio), p = plantaBy(planta);
    if (!d || !p) return { cons: 0, prod: 0, ig: 0, flujos: [], meses: [], prodMes: [] };
    const { s, e } = lim(periodo);
    const vis = flujosDe(p, cat);
    const flujos = d[cat].principal.filter((ds) => vis.includes(ds.l)).map((ds) => ({ l: ds.l, data: ds.d.slice(s, e), c: ds.c })).filter((ds) => ds.data.some((v) => v > 0));
    const cons = flujos.reduce((a, f) => a + sum(f.data), 0);
    const prod = sum(d.produccion.slice(s, e));
    return { cons, prod, ig: prod > 0 ? cons / prod : 0, flujos, s, e, meses: MESES.slice(s, e), prodMes: d.produccion.slice(s, e) };
  }
  function recSerie(planta, cat, flujo, opts) {
    const out = []; if (!S.bd[planta]) return out;
    const p = plantaBy(planta), L = lim(opts.periodo);
    Object.keys(S.bd[planta]).map(Number).sort((a, b) => a - b).forEach((anio) => {
      const dAnio = S.bd[planta][anio]; if (!dAnio[cat]) return;
      let arr;
      if (flujo === "__TOTAL__") {
        arr = Array(12).fill(0);
        flujosDe(p, cat).forEach((f) => {
          const ds = dAnio[cat].principal.find((x) => x.l === f);
          if (ds) for (let i = 0; i < 12; i++) arr[i] += ds.d[i] || 0;
        });
      } else {
        const ds = dAnio[cat].principal.find((x) => x.l === flujo); if (!ds) return;
        arr = ds.d;
      }
      for (let i = L.s; i < L.e; i++) {
        let v = arr[i] || 0;
        if (opts.metrica === "INT") { const pz = dAnio.produccion[i] || 0; if (pz <= 0) continue; v = v / pz; }
        if (v === 0 && !opts.ceros) continue;
        out.push({ val: v, mes: MESES[i], anio });
      }
    });
    return out;
  }
  function recStats(serie) {
    if (!serie.length) return null;
    let min = serie[0], max = serie[0], s = 0;
    serie.forEach((o) => { if (o.val < min.val) min = o; if (o.val > max.val) max = o; s += o.val; });
    return { min, max, avg: s / serie.length, n: serie.length, ultimo: serie[serie.length - 1], spread: max.val - min.val };
  }
  function intelSerie(planta, cat) {
    const labels = [], prodArr = [], consArr = [];
    const target = cat === "Energia" ? "Consumo CFE" : cat === "Agua" ? "Red" : cat === "Residuos" ? "Sólidos" : "Gasolina";
    Object.keys(S.bd[planta] || {}).map(Number).sort((a, b) => a - b).forEach((anio) => {
      const dAnio = S.bd[planta][anio];
      const raw = dAnio[cat].principal.find((d) => d.l === target); if (!raw) return;
      for (let i = 0; i < 12; i++) {
        const p = dAnio.produccion[i], c = raw.d[i];
        if (p > 0 && c >= 0) { labels.push(MESES[i] + " " + String(anio).slice(2)); prodArr.push(p); consArr.push(c); }
      }
    });
    if (prodArr.length < 2) return null;
    const eff = prodArr.map((p, i) => consArr[i] / p);
    const m = mean(eff), sd = stdDev(eff), ucl = m + 3 * sd, lcl = Math.max(0, m - 3 * sd);
    const anomalias = eff.map((val, i) => ({ val, i, out: val > ucl || val < lcl })).filter((x) => x.out);
    return { labels, prodArr, consArr, effArr: eff, mean: m, ucl, lcl, anomalias, reg: regresion(prodArr, consArr), targetLabel: target };
  }

  function ingest(sheets, source, meta) {
    const bd = {}, years = new Set(), plants = new Set(), unknown = new Set();
    let invalid = 0;
    const notes = [], sheetRep = [];
    const required = ["Produccion", "Energia", "Agua", "Residuos", "Combustibles"];
    required.forEach((n) => {
      const rows = sheets[n] || [];
      sheetRep.push({ name: n, rows: rows.length, ok: rows.length > 0 });
      if (!rows.length) notes.push("Hoja faltante o vacía: " + n);
    });
    function ensure(pl, an) { if (!bd[pl]) bd[pl] = {}; if (!bd[pl][an]) bd[pl][an] = emptyYear(); }
    function yearOf(r) { return Number(r["Año"] || r.Anio || r.Year || new Date().getFullYear()); }
    function mesIdx(r) { return MESES.indexOf(String(r.Mes || "").substring(0, 3)); }
    function num(v) { const n = parseFloat(v); return isFinite(n) ? n : 0; }
    (sheets.Produccion || []).forEach((r) => {
      const pl = String(r.Planta || "").trim(); if (!pl) return;
      plants.add(pl); if (!plantaBy(pl)) unknown.add(pl);
      const an = yearOf(r), m = mesIdx(r); years.add(an);
      if (m < 0) { invalid++; return; }
      ensure(pl, an); bd[pl][an].produccion[m] += num(r.Pzas_Producidas);
    });
    const map = { Energia: ["Consumo_CFE_kWh", "Generacion_Solar_kWh"], Agua: ["Agua_Consumida_m3", "Agua_Recuperada_m3"], Residuos: ["Peligrosos_Solidos_kg", "Peligrosos_Liquidos_Lts", "Bio_Infecciosos_kg"], Combustibles: ["Gasolina_Lts", "Diesel_Lts", "Gas_Lts"] };
    Object.keys(map).forEach((cat) => {
      (sheets[cat] || []).forEach((r) => {
        const pl = String(r.Planta || "").trim(); if (!pl) return;
        plants.add(pl); if (!plantaBy(pl)) unknown.add(pl);
        const an = yearOf(r), m = mesIdx(r); years.add(an);
        if (m < 0) { invalid++; return; }
        ensure(pl, an);
        map[cat].forEach((col, i) => {
          let val = num(r[col]); if (val === 0 && col === "Gas_Lts") val = num(r.Gas_kg);
          if (bd[pl][an][cat].principal[i]) bd[pl][an][cat].principal[i].d[m] += val;
        });
      });
    });
    if (unknown.size) notes.push("Plantas no catalogadas: " + [...unknown].join(", "));
    if (invalid) notes.push(invalid + " filas con mes no reconocido.");
    S.bd = bd;
    S.report = { source, fileName: meta && meta.fileName, sheets: sheetRep, plantsFound: [...plants], plantsUnknown: [...unknown], years: [...years].sort((a, b) => b - a), notes, loadedAt: new Date().toISOString() };
    const ys = aniosDisp(); if (ys[0]) S.anio = ys[0];
    try { localStorage.setItem(CFG_CACHE, JSON.stringify({ bd, report: S.report })); } catch (e) { /* quota */ }
  }

  function demoRows() {
    function rng32(seed) { let a = seed >>> 0; return function () { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
    const rng = rng32(20260901);
    const specs = [
      { id: "PP", prodBase: 92000, cfe: 210000, solar: 38000, red: 1180, recup: 520, solidos: 3200, liquidos: 860, bio: 140, gasolina: 2800, diesel: 6400, gas: 1600, fuels: true },
      { id: "PA", prodBase: 41000, cfe: 18000, solar: 42000, red: 640, recup: 0, solidos: 1800, liquidos: 420, bio: 0, fuels: false },
      { id: "Diagnostico", prodBase: 6400, cfe: 28000, solar: 9000, red: 210, recup: 0, solidos: 0, liquidos: 0, bio: 180, fuels: false },
    ];
    const now = new Date(), maxM = now.getFullYear() > 2026 ? 11 : now.getFullYear() < 2026 ? -1 : now.getMonth();
    const sheets = { Produccion: [], Energia: [], Agua: [], Residuos: [], Combustibles: [] };
    specs.forEach((spec) => {
      [2023, 2024, 2025, 2026].forEach((year, yi) => {
        for (let m = 0; m < 12; m++) {
          if (year === 2026 && m > maxM) continue;
          const trend = 1 - yi * 0.025, noise = () => (rng() - 0.5) * 0.08;
          const season = Math.sin(((m - 2) / 12) * Math.PI * 2);
          const mes = MESES[m];
          const spike = (spec.id === "PP" && year === 2025 && m === 2) ? 0.42 : (spec.id === "PA" && year === 2024 && m === 5) ? 0.55 : 0;
          sheets.Produccion.push({ Planta: spec.id, Año: year, Mes: mes, Pzas_Producidas: Math.max(0, Math.round(spec.prodBase * (1 + season * 0.12 + noise()) * (1 + yi * 0.03))) });
          sheets.Energia.push({ Planta: spec.id, Año: year, Mes: mes, Consumo_CFE_kWh: Math.max(0, Math.round(spec.cfe * trend * (1 + season * 0.1 + noise() + spike))), Generacion_Solar_kWh: Math.max(0, Math.round(spec.solar * (1 + season * 0.18 + noise()))) });
          sheets.Agua.push({ Planta: spec.id, Año: year, Mes: mes, Agua_Consumida_m3: Math.max(0, Math.round(spec.red * trend * (1 + season * 0.14 + noise() + (spec.id === "PA" && year === 2024 && m === 5 ? 0.55 : 0)) * 10) / 10), Agua_Recuperada_m3: Math.max(0, Math.round(spec.recup * (1 + yi * 0.04) * (1 + season * 0.1 + noise()) * 10) / 10) });
          sheets.Residuos.push({ Planta: spec.id, Año: year, Mes: mes, Peligrosos_Solidos_kg: Math.max(0, Math.round(spec.solidos * (1 + season * 0.08 + noise()))), Peligrosos_Liquidos_Lts: Math.max(0, Math.round(spec.liquidos * (1 + season * 0.1 + noise()) * 10) / 10), Bio_Infecciosos_kg: Math.max(0, Math.round(spec.bio * (1 + season * 0.12 + noise()) * 10) / 10) });
          if (spec.fuels) sheets.Combustibles.push({ Planta: spec.id, Año: year, Mes: mes, Gasolina_Lts: Math.max(0, Math.round(spec.gasolina * (1 + season * 0.06 + noise()))), Diesel_Lts: Math.max(0, Math.round(spec.diesel * trend * (1 + season * 0.09 + noise()))), Gas_Lts: Math.max(0, Math.round(spec.gas * (1 + season * 0.05 + noise()))) });
        }
      });
    });
    return sheets;
  }

  function sheetsFromWB(wb) {
    const out = {};
    ["Produccion", "Energia", "Agua", "Residuos", "Combustibles"].forEach((n) => {
      if (wb.Sheets[n]) out[n] = XLSX.utils.sheet_to_json(wb.Sheets[n]);
    });
    return out;
  }
  async function loadUrl(url) {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const buf = await resp.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
    ingest(sheetsFromWB(wb), "server", { fileName: url });
  }
  function loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
      ingest(sheetsFromWB(wb), "upload", { fileName: file.name });
      render();
    };
    reader.readAsArrayBuffer(file);
  }

  function killCharts() {
    if (window.Chart && typeof Chart.getChart === "function") {
      document.querySelectorAll("canvas").forEach((c) => {
        const ch = Chart.getChart(c);
        if (ch) {
          try { ch.destroy(); } catch (e) { /* ignore */ }
        }
      });
    }
    Object.keys(S.charts).forEach((k) => {
      try { S.charts[k].destroy(); } catch (e) { /* ignore */ }
      delete S.charts[k];
    });
  }
  function mkChart(id, cfg) {
    const el = document.getElementById(id); if (!el || !window.Chart) return;
    const prev = typeof Chart.getChart === "function" ? Chart.getChart(el) : null;
    if (prev) { try { prev.destroy(); } catch (e) { /* ignore */ } }
    if (S.charts[id]) { try { S.charts[id].destroy(); } catch (e) { /* ignore */ } }
    S.charts[id] = new Chart(el, cfg);
  }
  const tip = { backgroundColor: "rgba(0,20,44,.94)", titleColor: "#fff", bodyColor: "#fff", padding: 12, cornerRadius: 10, titleFont: { weight: "700" } };

  function kpi(title, val, unit, hint, tone) {
    return '<div class="kpi ' + (tone || "") + '"><div class="kpi-lbl">' + title + '</div><div class="kpi-val tabular">' + val + (unit ? ' <span>' + unit + "</span>" : "") + "</div>" + (hint ? '<div class="kpi-hint">' + hint + "</div>" : "") + "</div>";
  }
  function badge(txt, tone) { return '<span class="badge badge-' + tone + '">' + txt + "</span>"; }

  function navHtml() {
    const p = plantaBy(S.planta);
    const corp = ["huella", "records", "metas", "config"].indexOf(S.vista) >= 0;
    let h = '<div class="brand"><div class="brand-mark">SGA</div><div><b>Panel SGA</b><small>Lapisa · Sustentabilidad</small></div></div>';
    h += '<div class="sec-lbl">Ubicación</div><div style="background:rgba(0,0,0,.2);padding:.4rem;border-radius:14px' + (corp ? ";opacity:.4" : "") + '">';
    S.plantas.forEach((pl) => {
      h += '<button type="button" class="plant-btn' + (pl.id === S.planta && !corp ? " active" : "") + '" data-act="planta" data-id="' + pl.id + '">' + pl.nombre + "</button>";
    });
    h += "</div><div class='sec-lbl'>Vectores</div>";
    VECTORES.forEach((c) => {
      if (p && !tieneVector(p, c)) return;
      h += '<button type="button" class="nav-btn' + (S.vista === "vector" && S.cat === c ? " active" : "") + '" data-act="cat" data-id="' + c + '">' + VNOM[c] + "</button>";
    });
    h += '<div class="sec-lbl">Gestión</div>';
    h += '<button type="button" class="nav-btn' + (S.vista === "home" ? " active" : "") + '" data-act="vista" data-id="home">Resumen ejecutivo</button>';
    if (!S.unlocked) {
      h += '<button type="button" class="nav-btn" data-act="unlock">Desbloquear vistas</button>';
    } else {
      h += '<button type="button" class="nav-btn' + (S.vista === "inteligencia" ? " active" : "") + '" data-act="vista" data-id="inteligencia">Inteligencia operativa</button>';
      h += '<button type="button" class="nav-btn' + (S.vista === "huella" ? " active" : "") + '" data-act="vista" data-id="huella">Huella de carbono</button>';
      h += '<button type="button" class="nav-btn' + (S.vista === "records" ? " active" : "") + '" data-act="vista" data-id="records">Máximos y mínimos</button>';
      h += '<button type="button" class="nav-btn' + (S.vista === "metas" ? " active" : "") + '" data-act="vista" data-id="metas">Metas y límites</button>';
      h += '<button type="button" class="nav-btn' + (S.vista === "config" ? " active" : "") + '" data-act="vista" data-id="config">Parámetros</button>';
      h += '<button type="button" class="nav-btn" data-act="lock">Bloquear sesión</button>';
    }
    h += '<div class="sidebar-note">Sin internet. El Excel vive en esta misma carpeta. Las vistas corporativas piden el código de edición.</div>';
    return h;
  }

  function bindNav(root) {
    root.querySelectorAll("[data-act]").forEach((el) => {
      el.addEventListener("click", () => {
        const act = el.getAttribute("data-act"), id = el.getAttribute("data-id");
        if (act === "planta") { S.planta = id; const p = plantaBy(id); if (p && !tieneVector(p, S.cat)) S.cat = VECTORES.find((c) => tieneVector(p, c)) || "Energia"; if (S.vista !== "home") S.vista = "vector"; }
        if (act === "cat") { S.cat = id; S.vista = "vector"; S.mesDona = "ALL"; }
        if (act === "vista") {
          if (["huella", "inteligencia", "records", "metas", "config"].indexOf(id) >= 0 && !S.unlocked) { openUnlock(); return; }
          S.vista = id;
        }
        if (act === "unlock") openUnlock();
        if (act === "lock") { S.unlocked = false; try { localStorage.removeItem(CFG_UNLOCK); } catch (e) {} S.vista = "home"; }
        closeDrawer();
        persistUi();
        render();
      });
    });
  }

  function persistUi() {
    try { localStorage.setItem(CFG_UI, JSON.stringify({ planta: S.planta, cat: S.cat, periodo: S.periodo, yoy: S.yoy, comparar: S.comparar, metrica: S.metrica, rec: S.rec, metasModo: S.metasModo, rigor: S.rigor })); } catch (e) {}
  }
  function persistCfg() {
    try { localStorage.setItem(CFG_KEY, JSON.stringify({ plantas: S.plantas, metasSGA: S.metasSGA, FE: S.FE })); } catch (e) {}
  }

  function renderHome() {
    const { s, e } = lim(S.periodo);
    const meses = MESES.slice(s, e);
    let total = 0, fuera = 0, alertas = 0;
    const porP = {}, porV = { Energia: 0, Agua: 0, Residuos: 0, Combustibles: 0 };
    S.plantas.forEach((p) => {
      porP[p.id] = 0;
      const intel = intelSerie(p.id, "Energia"); if (intel) alertas += intel.anomalias.length;
      VECTORES.forEach((v) => {
        const co2 = calcCO2(p.id, v, s, e);
        porP[p.id] += co2; porV[v] += co2; total += co2;
        if (!tieneVector(p, v)) return;
        const a = metasAuto(p.id, v), act = intensAnio(p.id, v, S.anio);
        const limite = (a.efMeta || (S.metasSGA[p.id] && S.metasSGA[p.id][v] && S.metasSGA[p.id][v].efMetaFallback));
        if (act !== null && limite && act > limite) fuera++;
      });
    });
    let ahE = 0, ahA = 0;
    S.plantas.forEach((p) => {
      const eA = metasAuto(p.id, "Energia"); if (eA.suficiente) ahE += eA.ahorro || 0;
      const aA = metasAuto(p.id, "Agua"); if (aA.suficiente) ahA += aA.ahorro || 0;
    });
    let html = '<div class="kpis">';
    html += kpi("Emisión global", fmt2.format(total), "tCO₂e", "Consolidado de las plantas en el periodo.", "teal");
    html += kpi("Fuera de límite", String(fuera), "vectores", fuera ? "Requieren plan de acción." : "Todos operan dentro del límite.", fuera ? "alert" : "ok");
    html += kpi("Alertas Shewhart", String(alertas), "meses", "Intensidad eléctrica fuera de media ± 3σ.", alertas ? "warn" : "ok");
    html += kpi("Ahorro potencial", fmtC.format(ahE), "kWh", "Más <b>" + fmt1.format(ahA) + " m³</b> de agua si cada planta opera en su meta.", "navy");
    html += "</div>";
    html += '<div class="grid-2"><div class="card"><h3>Evolución de emisiones (tCO₂e)</h3><div class="chart-box"><canvas id="cHome"></canvas></div></div>';
    html += '<div class="card"><h3>Participación por planta</h3>';
    S.plantas.forEach((p) => {
      const pct = total > 0 ? (porP[p.id] / total) * 100 : 0;
      html += '<button type="button" class="plant-share" data-act="planta" data-id="' + p.id + '"><div style="display:flex;justify-content:space-between;font-size:.9rem"><b>' + p.nombre + "</b><span class='tabular'><b>" + fmt2.format(porP[p.id]) + " tCO₂e</b></span></div><div class='bar'><i style='width:" + pct + "%'></i></div><div class='muted'>" + pct.toFixed(1) + "% del consolidado</div></button>";
    });
    html += "</div></div>";
    html += '<div class="card"><h3>Semáforo de intensidad ' + S.anio + "</h3><p class='muted'>Verde = cumple meta. Ámbar = dentro del límite. Rojo = excede.</p><div class='scroll-x'><table class='hc-table'><thead><tr><th>Planta / Vector</th>";
    VECTORES.forEach((v) => { html += "<th>" + VNOM[v] + "</th>"; });
    html += "</tr></thead><tbody>";
    S.plantas.forEach((p) => {
      html += "<tr><td><b>" + p.nombre + "</b></td>";
      VECTORES.forEach((v) => {
        if (!tieneVector(p, v)) { html += "<td style='color:var(--cloud)'>—</td>"; return; }
        const a = metasAuto(p.id, v), act = intensAnio(p.id, v, S.anio);
        const limite = a.efMeta || 1, meta = a.metaObjetivo || limite;
        let tone = "muted", txt = "—";
        if (act !== null) {
          txt = act.toFixed(3);
          tone = act <= meta ? "ok" : act <= limite ? "warn" : "alert";
        }
        html += "<td><button type='button' class='badge badge-" + tone + "' data-act='goto' data-pl='" + p.id + "' data-cat='" + v + "'>" + txt + "</button></td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></div></div>";
    html += '<div class="chip-row">';
    VECTORES.forEach((v) => {
      html += '<button type="button" class="chip" data-act="cat" data-id="' + v + '"><span>' + VNOM[v] + '<br><small class="muted">' + fmt2.format(porV[v]) + " tCO₂e</small></span></button>";
    });
    html += "</div>";
    document.getElementById("viewRoot").innerHTML = html;
    bindNav(document.getElementById("viewRoot"));
    document.querySelectorAll("[data-act=goto]").forEach((b) => {
      b.addEventListener("click", () => { S.planta = b.getAttribute("data-pl"); S.cat = b.getAttribute("data-cat"); S.vista = "vector"; render(); });
    });
    mkChart("cHome", {
      type: "bar",
      data: {
        labels: meses,
        datasets: VECTORES.map((v, i) => ({
          label: VNOM[v],
          data: meses.map((_, idx) => {
            let t = 0; S.plantas.forEach((p) => { t += calcCO2(p.id, v, s + idx, s + idx + 1); });
            return Number(t.toFixed(3));
          }),
          backgroundColor: ["#0E7C86", "#017ACB", "#1E3548", "#5B7088"][i],
          stack: "a",
        })),
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: "#EEF3FA" } } } },
    });
  }

  function renderVector() {
    const t = totPeriodo(S.planta, S.cat, S.anio, S.periodo);
    const meta = metaEfectiva(S.planta, S.cat);
    const p = plantaBy(S.planta);
    const unidad = (S.metasSGA[S.planta] && S.metasSGA[S.planta][S.cat] && S.metasSGA[S.planta][S.cat].unidad) || "";
    const uProd = p && p.unidadProd === "EX" ? "Ex." : "U";
    const cumpleN = t.ig <= meta.efMeta, cumpleM = t.ig <= (meta.metaObjetivo || meta.efMeta);
    const { s, e } = lim(S.periodo);
    let tCO2 = calcCO2(S.planta, S.cat, s, e), tAv = 0;
    if (S.cat === "Energia") {
      const solar = t.flujos.find((f) => f.l === "Solar");
      tAv = solar ? (sum(solar.data) * S.FE.CFE) / 1000 : 0;
    }
    const bdg = cumpleM ? badge("Óptimo · cumple meta", "ok") : cumpleN ? badge("Tolerable · dentro del límite", "warn") : badge("Alerta · excede el máximo", "alert");
    let html = '<div class="chip-row no-print">';
    html += '<label class="toggle"><input type="checkbox" id="chkYoy"' + (S.yoy ? " checked" : "") + "> Año anterior</label>";
    html += '<label class="toggle"><input type="checkbox" id="chkCmp"' + (S.comparar ? " checked" : "") + "> Comparar plantas</label>";
    html += '<div class="seg"><button type="button" id="mAbs" class="' + (S.metrica === "ABS" ? "on" : "") + '">Volumen</button><button type="button" id="mInt" class="' + (S.metrica === "INT" ? "on" : "") + '">Intensidad</button></div></div>';
    html += '<div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">';
    html += kpi(S.cat === "Residuos" ? "Generación total" : "Consumo total", fmt1.format(t.cons), unidad, tCO2 > 0 ? "Impacto: <b>" + fmt2.format(tCO2) + " tCO₂e</b>" + (tAv > 0 ? "<br>Evitada (solar): " + fmt2.format(tAv) + " tCO₂e" : "") : "Volumen del periodo.", "teal");
    html += kpi(p && p.unidadProd === "EX" ? "Exámenes" : "Producción", fmt1.format(t.prod), uProd, "", "navy");
    html += kpi("Intensidad", fmt4.format(t.ig), unidad + "/" + uProd, "Meta ≤ " + fmt4.format(meta.metaObjetivo || meta.efMeta) + " · Límite ≤ " + fmt4.format(meta.efMeta) + "<br><span class='muted'>" + meta.origen + "</span><div style='margin-top:.4rem'>" + bdg + "</div>", cumpleM ? "ok" : cumpleN ? "warn" : "alert");
    html += "</div>";
    html += '<div class="grid-2"><div class="card"><h3 id="chTitle">' + (S.comparar ? "Comparativo por planta" : "Comportamiento temporal") + '</h3><div class="chart-box"><canvas id="cMain"></canvas></div></div>';
    html += '<div class="card"><h3>Distribución</h3><div class="chart-box"><canvas id="cDonut"></canvas></div></div></div>';
    html += '<div class="card"><h3>Métrica de intensidad operativa</h3><div class="chart-box"><canvas id="cIg"></canvas></div></div>';
    document.getElementById("viewRoot").innerHTML = html;
    document.getElementById("chkYoy").onchange = () => { S.yoy = document.getElementById("chkYoy").checked; persistUi(); render(); };
    document.getElementById("chkCmp").onchange = () => { S.comparar = document.getElementById("chkCmp").checked; persistUi(); render(); };
    document.getElementById("mAbs").onclick = () => { S.metrica = "ABS"; persistUi(); render(); };
    document.getElementById("mInt").onclick = () => { S.metrica = "INT"; persistUi(); render(); };

    const labels = t.meses;
    if (S.comparar) {
      mkChart("cMain", {
        type: "bar",
        data: {
          labels,
          datasets: S.plantas.filter((pl) => tieneVector(pl, S.cat)).map((pl, i) => {
            const vt = totPeriodo(pl.id, S.cat, S.anio, S.periodo);
            return { label: pl.corto, data: labels.map((_, idx) => vt.flujos.reduce((a, f) => a + (f.data[idx] || 0), 0)), backgroundColor: ["#017ACB", "#0E7C86", "#1E3548"][i % 3] };
          }),
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#EEF3FA" } } } },
      });
    } else {
      const ds = t.flujos.map((f) => ({
        label: f.l,
        data: f.data.map((raw, i) => (S.metrica === "INT" ? ((t.prodMes[i] || 0) > 0 ? raw / t.prodMes[i] : 0) : raw)),
        backgroundColor: f.c,
        stack: t.flujos.length > 1 ? "a" : undefined,
      }));
      if (S.yoy) {
        const prev = getAnio(S.planta, S.anio - 1);
        if (prev) {
          const fl = flujosDe(p, S.cat);
          ds.push({
            type: "line", label: String(S.anio - 1), borderColor: "#94a3b8", borderDash: [5, 5], pointRadius: 0, fill: false,
            data: labels.map((_, i) => {
              let pv = 0; fl.forEach((f) => { const x = prev[S.cat].principal.find((z) => z.l === f); pv += x ? x.d[s + i] || 0 : 0; });
              const pp = prev.produccion[s + i] || 0;
              return S.metrica === "INT" ? (pp > 0 ? pv / pp : 0) : pv;
            }),
          });
        }
      }
      mkChart("cMain", { type: "bar", data: { labels, datasets: ds }, options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { stacked: t.flujos.length > 1, grid: { display: false } }, y: { stacked: t.flujos.length > 1, grid: { color: "#EEF3FA" } } } } });
    }
    mkChart("cDonut", {
      type: "doughnut",
      data: { labels: t.flujos.map((f) => f.l), datasets: [{ data: t.flujos.map((f) => sum(f.data)), backgroundColor: t.flujos.map((f) => f.c) }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { tooltip: tip, legend: { position: "bottom" } } },
    });
    mkChart("cIg", {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Intensidad real", data: labels.map((_, i) => { const prod = t.prodMes[i] || 0, cons = t.flujos.reduce((a, f) => a + (f.data[i] || 0), 0); return prod > 0 ? cons / prod : 0; }), borderColor: "#00142C", borderWidth: 3, tension: 0.2 },
          { label: "Límite máximo", data: labels.map(() => meta.efMeta), borderColor: "#b91c1c", borderDash: [5, 5], pointRadius: 0 },
          { label: "Meta de mejora", data: labels.map(() => meta.metaObjetivo || meta.efMeta), borderColor: "#047857", borderDash: [3, 3], pointRadius: 0 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#EEF3FA" } } } },
    });
  }

  function renderHuella() {
    const { s, e } = lim(S.periodo);
    const meses = MESES.slice(s, e);
    const totP = {}, totV = { Energia: 0, Agua: 0, Residuos: 0, Combustibles: 0 };
    let total = 0;
    S.plantas.forEach((p) => {
      totP[p.id] = 0;
      VECTORES.forEach((v) => { const c = calcCO2(p.id, v, s, e); totP[p.id] += c; totV[v] += c; total += c; });
    });
    let html = '<div class="kpis">';
    html += kpi("Emisión global", fmt2.format(total), "tCO₂e", "Consolidado corporativo.", "teal");
    S.plantas.forEach((p) => { html += kpi(p.nombre, fmt2.format(totP[p.id]), "tCO₂e", total ? ((totP[p.id] / total) * 100).toFixed(1) + "% del total" : "", "navy"); });
    html += "</div><div class='grid-eq'><div class='card'><h3>Evolución temporal</h3><div class='chart-box'><canvas id='cHue'></canvas></div></div>";
    html += "<div class='card'><h3>Matriz de inventario (tCO₂e)</h3><div class='scroll-x'><table class='hc-table'><thead><tr><th>Vector</th>";
    S.plantas.forEach((p) => { html += "<th>" + p.corto + "</th>"; });
    html += "<th>Total</th></tr></thead><tbody>";
    VECTORES.forEach((v) => {
      html += "<tr><td>" + VNOM[v] + "</td>";
      S.plantas.forEach((p) => { html += "<td class='tabular'>" + fmt2.format(calcCO2(p.id, v, s, e)) + "</td>"; });
      html += "<td><b>" + fmt2.format(totV[v]) + "</b></td></tr>";
    });
    html += "<tr><td><b>Total</b></td>";
    S.plantas.forEach((p) => { html += "<td><b>" + fmt2.format(totP[p.id]) + "</b></td>"; });
    html += "<td style='color:var(--alert);font-size:1.05rem'><b>" + fmt2.format(total) + "</b></td></tr></tbody></table></div></div></div>";
    document.getElementById("viewRoot").innerHTML = html;
    mkChart("cHue", {
      type: "bar",
      data: { labels: meses, datasets: VECTORES.map((v, i) => ({ label: VNOM[v], data: meses.map((_, idx) => { let t = 0; S.plantas.forEach((p) => { t += calcCO2(p.id, v, s + idx, s + idx + 1); }); return Number(t.toFixed(3)); }), backgroundColor: ["#0E7C86", "#017ACB", "#1E3548", "#5B7088"][i], stack: "a" })) },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: "#EEF3FA" } } } },
    });
  }

  function renderIntel() {
    const intel = intelSerie(S.planta, S.cat);
    const nombre = (plantaBy(S.planta) || {}).nombre || S.planta;
    if (!intel) {
      document.getElementById("viewRoot").innerHTML = "<div class='card'><h3>Sin serie suficiente</h3><p class='muted'>Se necesitan al menos dos meses con producción y consumo en " + nombre + " / " + VNOM[S.cat] + ".</p></div>";
      return;
    }
    const carga = Math.max(0, intel.reg.intercept);
    let html = '<div class="kpis">';
    html += kpi("Alertas detectadas", String(intel.anomalias.length), "meses anormales", "Picos o caídas inusuales (media ± 3σ).", intel.anomalias.length ? "alert" : "ok");
    html += kpi("Carga en paro", fmt1.format(carga), "", "Consumo estimado con producción cero.", "teal");
    html += kpi("Dependencia operativa", (intel.reg.r * 100).toFixed(1), "%", "Proporción del consumo explicada por el volumen.", "navy");
    html += "</div><div class='card'><h3>Historial de alertas</h3><p class='muted'>Puntos rojos = fuera de control. Clic para ficha.</p><div class='chart-box'><canvas id='cShe'></canvas></div></div>";
    html += "<div class='card'><h3>Regresión · intercepto = carga basal</h3><div class='chart-box'><canvas id='cReg'></canvas></div></div>";
    document.getElementById("viewRoot").innerHTML = html;
    const cols = intel.effArr.map((v) => (v > intel.ucl || v < intel.lcl ? "#b91c1c" : "#047857"));
    mkChart("cShe", {
      type: "line",
      data: {
        labels: intel.labels,
        datasets: [
          { label: "Intensidad", data: intel.effArr.map((v) => Number(v.toFixed(4))), borderColor: "#5B7088", pointBackgroundColor: cols, pointRadius: intel.effArr.map((v, i) => (cols[i] === "#b91c1c" ? 6 : 4)), tension: 0.15 },
          { label: "Promedio", data: intel.labels.map(() => intel.mean), borderColor: "#017ACB", pointRadius: 0 },
          { label: "Límite máx.", data: intel.labels.map(() => intel.ucl), borderColor: "#b91c1c", borderDash: [5, 5], pointRadius: 0 },
          { label: "Límite mín.", data: intel.labels.map(() => intel.lcl), borderColor: "#b91c1c", borderDash: [5, 5], pointRadius: 0 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { ticks: { maxTicksPerSecond: 12, maxRotation: 0 }, grid: { display: false } }, y: { grid: { color: "#EEF3FA" } } } },
    });
    const maxP = Math.max.apply(null, intel.prodArr);
    mkChart("cReg", {
      type: "scatter",
      data: {
        datasets: [
          { label: "Meses", data: intel.prodArr.map((x, i) => ({ x, y: intel.consArr[i] })), backgroundColor: "#0164BD" },
          { label: "Tendencia", data: [{ x: 0, y: intel.reg.intercept }, { x: maxP, y: intel.reg.slope * maxP + intel.reg.intercept }], showLine: true, borderColor: "#b91c1c", pointRadius: 0, type: "line" },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: tip, legend: { position: "bottom" } }, scales: { x: { title: { display: true, text: "Producción" }, grid: { color: "#EEF3FA" } }, y: { title: { display: true, text: "Consumo" }, grid: { color: "#EEF3FA" } } } },
    });
  }

  function renderRecords() {
    const opts = S.rec;
    const plantasUsar = S.plantas.filter((p) => opts.planta === "ALL" || p.id === opts.planta);
    const vectUsar = VECTORES.filter((v) => opts.vector === "ALL" || v === opts.vector);
    const bloques = [];
    vectUsar.forEach((cat) => {
      const filas = [];
      plantasUsar.forEach((p) => {
        const fl = flujosDe(p, cat); if (!fl.length) return;
        const stT = recStats(recSerie(p.id, cat, "__TOTAL__", opts));
        if (stT && fl.length > 1) filas.push({ planta: p.id, flujo: "__TOTAL__", esTotal: true, st: stT });
        else if (stT && fl.length === 1) filas.push({ planta: p.id, flujo: fl[0], esTotal: true, st: stT });
        fl.forEach((f) => { const st = recStats(recSerie(p.id, cat, f, opts)); if (st && st.max.val > 0) filas.push({ planta: p.id, flujo: f, esTotal: false, st }); });
      });
      if (filas.length) bloques.push({ cat, filas });
    });
    const rf = (v) => (opts.metrica === "INT" ? fmt4.format(v) : fmt1.format(v));
    let html = '<div class="databar no-print"><div class="databar-row">';
    html += '<label class="muted">Vector <select class="select-light" id="rv">';
    html += '<option value="ALL">Todos</option>' + VECTORES.map((v) => "<option value='" + v + "'" + (opts.vector === v ? " selected" : "") + ">" + VNOM[v] + "</option>").join("") + "</select></label>";
    html += '<label class="muted">Planta <select class="select-light" id="rp"><option value="ALL">Todas</option>' + S.plantas.map((p) => "<option value='" + p.id + "'" + (opts.planta === p.id ? " selected" : "") + ">" + p.nombre + "</option>").join("") + "</select></label>";
    html += '<label class="muted">Métrica <select class="select-light" id="rm"><option value="ABS"' + (opts.metrica === "ABS" ? " selected" : "") + ">Volumen</option><option value='INT'" + (opts.metrica === "INT" ? " selected" : "") + ">Intensidad</option></select></label>";
    html += '<label class="toggle"><input type="checkbox" id="rc"' + (opts.ceros ? " checked" : "") + "> Incluir ceros</label></div></div>";
    html += '<div class="card"><h3>Matriz de récords</h3><div class="scroll-x"><table class="hc-table"><thead><tr><th>Vector / Flujo</th><th>Planta</th><th>Mínimo</th><th>Promedio</th><th>Máximo</th><th>Último</th><th>n</th></tr></thead><tbody>';
    bloques.forEach((b) => {
      html += "<tr style='background:#DCEAF7'><td colspan='7' style='text-align:left;font-weight:800;color:#00447A'>" + VNOM[b.cat] + "</td></tr>";
      b.filas.forEach((f) => {
        html += "<tr" + (f.esTotal ? " style='font-weight:800'" : "") + "><td>" + (f.esTotal ? (f.flujo === "__TOTAL__" ? "Total " + VNOM[b.cat] : f.flujo) : f.flujo) + "</td><td style='text-align:left'>" + (plantaBy(f.planta) || {}).nombre + "</td>";
        html += "<td class='tabular' style='color:var(--ok)'>" + rf(f.st.min.val) + " <small>" + f.st.min.mes + " " + f.st.min.anio + "</small></td>";
        html += "<td class='tabular' style='color:var(--blue)'>" + rf(f.st.avg) + "</td>";
        html += "<td class='tabular' style='color:var(--alert)'>" + rf(f.st.max.val) + " <small>" + f.st.max.mes + " " + f.st.max.anio + "</small></td>";
        html += "<td class='tabular'>" + rf(f.st.ultimo.val) + "</td><td>" + f.st.n + "</td></tr>";
      });
    });
    html += "</tbody></table></div></div>";
    document.getElementById("viewRoot").innerHTML = html;
    document.getElementById("rv").onchange = (e) => { S.rec.vector = e.target.value; persistUi(); render(); };
    document.getElementById("rp").onchange = (e) => { S.rec.planta = e.target.value; persistUi(); render(); };
    document.getElementById("rm").onchange = (e) => { S.rec.metrica = e.target.value; persistUi(); render(); };
    document.getElementById("rc").onchange = (e) => { S.rec.ceros = e.target.checked; persistUi(); render(); };
  }

  function renderMetas() {
    const filas = [];
    S.plantas.forEach((p) => VECTORES.forEach((c) => { if (tieneVector(p, c)) filas.push({ p, c, a: metasAuto(p.id, c), base: S.metasSGA[p.id] && S.metasSGA[p.id][c] }); }));
    const con = filas.filter((f) => f.a.suficiente).length;
    const fp = con ? filas.filter((f) => f.a.suficiente).reduce((s, f) => s + (f.a.factor || 0), 0) / con * 100 : 0;
    let ahE = 0; filas.forEach((f) => { if (f.c === "Energia" && f.a.suficiente) ahE += f.a.ahorro || 0; });
    let html = '<div class="databar no-print"><div class="databar-row">';
    html += '<label class="muted">Origen <select class="select-light" id="mm"><option value="AUTO"' + (S.metasModo === "AUTO" ? " selected" : "") + ">Automático</option><option value='MANUAL'" + (S.metasModo === "MANUAL" ? " selected" : "") + ">Manual</option></select></label>";
    html += '<label class="muted">Rigor <select class="select-light" id="mr"><option value="P75"' + (S.rigor === "P75" ? " selected" : "") + ">P75</option><option value='SIGMA'" + (S.rigor === "SIGMA" ? " selected" : "") + ">Media+σ</option><option value='P90'" + (S.rigor === "P90" ? " selected" : "") + ">P90</option></select></label></div></div>";
    html += '<div class="kpis">' + kpi("Con base histórica", String(con), "de " + filas.length, "", "navy") + kpi("Mejora promedio", fmt1.format(fp), "%", "", "ok") + kpi("Ahorro energía", fmt1.format(ahE), "kWh", "", "teal") + "</div>";
    html += '<div class="card"><h3>Metas de mejora y límites</h3><div class="scroll-x"><table class="hc-table"><thead><tr><th>Planta</th><th>Vector</th><th>Base</th><th>Media</th><th>Mejora</th><th>Meta</th><th>Límite</th><th>Estado ' + S.anio + "</th></tr></thead><tbody>";
    filas.forEach((f) => {
      const act = intensAnio(f.p.id, f.c, S.anio);
      const ef = metaEfectiva(f.p.id, f.c).efMeta;
      let est = "<span class='muted'>—</span>";
      if (act !== null && f.a.suficiente) est = act <= (f.a.metaObjetivo || ef) ? badge(fmt4.format(act), "ok") : act <= ef ? badge(fmt4.format(act), "warn") : badge("+" + fmt1.format(((act - ef) / ef) * 100) + "%", "alert");
      html += "<tr><td>" + f.p.corto + "</td><td style='text-align:left'><b>" + VNOM[f.c] + "</b></td>";
      if (!f.a.suficiente) html += "<td colspan='5' class='muted'>Evidencia insuficiente (" + f.a.n + " meses)</td><td>" + est + "</td></tr>";
      else html += "<td class='muted'>" + f.a.anios[0] + "–" + f.a.anios[f.a.anios.length - 1] + " · " + f.a.n + " m</td><td class='tabular'>" + fmt4.format(f.a.media) + "</td><td>" + ((f.a.factor || 0) * 100).toFixed(0) + "%</td><td style='color:var(--ok)'><b>≤ " + fmt4.format(f.a.metaObjetivo) + "</b></td><td style='color:var(--alert)'><b>≤ " + fmt4.format(f.a.limiteMax) + "</b></td><td>" + est + "</td></tr>";
    });
    html += "</tbody></table></div></div>";
    html += "<div class='card'><h3>Criterio</h3><p class='muted'><b>Línea base:</b> intensidad mensual de años anteriores a " + S.anio + ". <b>Meta:</b> media × (1 − mejora). <b>Límite:</b> P75 × (1 − mejora).</p></div>";
    document.getElementById("viewRoot").innerHTML = html;
    document.getElementById("mm").onchange = (e) => { S.metasModo = e.target.value; persistUi(); render(); };
    document.getElementById("mr").onchange = (e) => { S.rigor = e.target.value; persistUi(); render(); };
  }

  function renderConfig() {
    let html = '<div class="card"><h3>Plantas</h3><p class="muted">El <b>ID</b> debe coincidir con la columna Planta del Excel.</p><div class="scroll-x"><table class="hc-table"><thead><tr><th>ID</th><th>Nombre</th><th>Unidad</th></tr></thead><tbody>';
    S.plantas.forEach((p) => { html += "<tr><td><b>" + p.id + "</b></td><td>" + p.nombre + "</td><td>" + (p.unidadProd === "EX" ? "Exámenes" : "Piezas") + "</td></tr>"; });
    html += "</tbody></table></div></div>";
    html += '<div class="card"><h3>Factores de emisión</h3><div class="scroll-x"><table class="hc-table"><thead><tr><th>Fuente</th><th>Valor</th></tr></thead><tbody>';
    html += "<tr><td>CFE kgCO₂e/kWh</td><td class='tabular'>" + S.FE.CFE + "</td></tr><tr><td>Gasolina</td><td class='tabular'>" + S.FE.Gasolina + "</td></tr><tr><td>Diésel</td><td class='tabular'>" + S.FE.Diesel + "</td></tr><tr><td>Gas LP</td><td class='tabular'>" + S.FE.GasLP + "</td></tr>";
    html += "</tbody></table></div><p class='muted'>Los valores se pueden ajustar tras desbloquear. Se guardan en este navegador.</p></div>";
    html += '<div class="card"><h3>Origen de datos</h3><p class="muted">Autocarga: <code>' + S.ruta + "</code> en la misma carpeta que este HTML. Sin internet, sin servidor extra.</p>";
    html += '<p><button type="button" class="btn" id="btnTpl">Descargar plantilla Excel</button></p></div>';
    document.getElementById("viewRoot").innerHTML = html;
    document.getElementById("btnTpl").onclick = () => {
      const wb = XLSX.utils.book_new();
      const rows = demoRows();
      Object.keys(rows).forEach((n) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows[n]), n));
      XLSX.writeFile(wb, EXCEL_NAME);
    };
  }

  function renderSidebar() {
    document.getElementById("sidebar").innerHTML = navHtml();
    bindNav(document.getElementById("sidebar"));
    document.getElementById("drawer").innerHTML = navHtml();
    bindNav(document.getElementById("drawer"));
  }
  function openDrawer() { document.getElementById("drawer").classList.add("open"); document.getElementById("backdrop").classList.add("open"); }
  function closeDrawer() { document.getElementById("drawer").classList.remove("open"); document.getElementById("backdrop").classList.remove("open"); }
  function openUnlock() { document.getElementById("unlockModal").classList.add("open"); document.getElementById("unlockCode").focus(); }
  function closeUnlock() { document.getElementById("unlockModal").classList.remove("open"); }

  function renderHeader() {
    const titles = {
      home: ["Resumen ejecutivo", "Desempeño ambiental consolidado"],
      vector: [VNOM[S.cat] + " · " + ((plantaBy(S.planta) || {}).nombre || ""), "Año " + S.anio],
      huella: ["Inventario corporativo de emisiones", "Huella de carbono"],
      inteligencia: ["Inteligencia operativa", ((plantaBy(S.planta) || {}).nombre || "") + " · " + VNOM[S.cat]],
      records: ["Récords históricos", "Mínimos, máximos y tendencia"],
      metas: ["Metas y límites", "Línea base histórica"],
      config: ["Parámetros del panel", "Plantas y factores"],
    };
    const t = titles[S.vista] || ["Panel SGA", ""];
    document.getElementById("heroTitle").textContent = t[0];
    const per = S.periodo === "ALL" ? "Año completo" : S.periodo;
    document.getElementById("heroSub").textContent = t[1] + " · " + S.anio + " · " + per;
    const years = aniosDisp();
    const showF = S.vista === "home" || S.vista === "vector" || S.vista === "huella";
    let act = "";
    if (showF) {
      act += '<select class="select-dark" id="selAnio">' + years.map((y) => "<option value='" + y + "'" + (y === S.anio ? " selected" : "") + ">" + y + "</option>").join("") + "</select>";
      act += '<select class="select-dark" id="selPer"><option value="ALL">Año completo</option><option value="Q1">Q1 (Ene–Mar)</option><option value="Q2">Q2 (Abr–Jun)</option><option value="Q3">Q3 (Jul–Sep)</option><option value="Q4">Q4 (Oct–Dic)</option></select>';
    }
    act += '<button type="button" class="btn btn-ghost-dark" id="btnPrint">PDF</button>';
    document.getElementById("heroActions").innerHTML = act;
    if (showF) {
      document.getElementById("selAnio").value = String(S.anio);
      document.getElementById("selPer").value = S.periodo;
      document.getElementById("selAnio").onchange = (e) => { S.anio = Number(e.target.value); render(); };
      document.getElementById("selPer").onchange = (e) => { S.periodo = e.target.value; persistUi(); render(); };
    }
    document.getElementById("btnPrint").onclick = () => window.print();
  }

  function renderDataBar() {
    const r = S.report;
    const map = { server: ["Autocarga del archivo", "ok"], upload: ["Archivo subido", "ok"], demo: ["Datos de demostración", "warn"], cache: ["Última carga de este navegador", "ok"] };
    const src = r ? map[r.source] || ["Datos", "muted"] : ["Cargando", "muted"];
    const badge = document.getElementById("srcBadge");
    badge.className = "badge badge-" + src[1];
    badge.textContent = src[0];
    const isFile = location.protocol === "file:";
    let meta = "";
    if (isFile) meta = "Abrió el archivo de doble clic: la autocarga no funciona. Arrastre el Excel o ábralo como sitio web en el NAS.";
    else if (r) meta = (r.plantsFound || []).length + " plantas · " + ((r.years || []).join(", ") || "sin años");
    document.getElementById("srcMeta").textContent = meta;
  }

  function render() {
    killCharts();
    renderSidebar();
    renderHeader();
    renderDataBar();
    if (S.vista === "home") renderHome();
    else if (S.vista === "vector") renderVector();
    else if (S.vista === "huella") renderHuella();
    else if (S.vista === "inteligencia") renderIntel();
    else if (S.vista === "records") renderRecords();
    else if (S.vista === "metas") renderMetas();
    else if (S.vista === "config") renderConfig();
  }

  function restoreCfg() {
    try {
      const g = JSON.parse(localStorage.getItem(CFG_KEY) || "null");
      if (g && g.plantas && g.plantas.length) S.plantas = g.plantas;
      S.metasSGA = construirMetas(S.plantas);
      if (g && g.metasSGA) {
        Object.keys(g.metasSGA).forEach((p) => {
          if (!S.metasSGA[p]) return;
          Object.keys(g.metasSGA[p]).forEach((c) => { if (S.metasSGA[p][c]) Object.assign(S.metasSGA[p][c], g.metasSGA[p][c]); });
        });
      }
      if (g && g.FE) Object.assign(S.FE, g.FE);
      S.ruta = localStorage.getItem(CFG_RUTA) || EXCEL_NAME;
      S.unlocked = localStorage.getItem(CFG_UNLOCK) === "1";
      const ui = JSON.parse(localStorage.getItem(CFG_UI) || "null");
      if (ui) {
        if (ui.planta) S.planta = ui.planta;
        if (ui.cat) S.cat = ui.cat;
        if (ui.periodo) S.periodo = ui.periodo;
        if (ui.yoy !== undefined) S.yoy = ui.yoy;
        if (ui.comparar !== undefined) S.comparar = ui.comparar;
        if (ui.metrica) S.metrica = ui.metrica;
        if (ui.rec) S.rec = ui.rec;
        if (ui.metasModo) S.metasModo = ui.metasModo;
        if (ui.rigor) S.rigor = ui.rigor;
      }
    } catch (e) { /* factory */ }
  }

  async function boot() {
    restoreCfg();
    ingest(demoRows(), "demo", { fileName: "demostración" });
    try {
      await loadUrl(S.ruta);
    } catch (e) {
      try {
        const cached = localStorage.getItem(CFG_CACHE);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.bd) {
            S.bd = parsed.bd;
            S.report = Object.assign({}, parsed.report, { source: "cache" });
            const ys = aniosDisp(); if (ys[0]) S.anio = ys[0];
          }
        }
      } catch (e2) { /* keep demo */ }
    }
    render();
  }

  document.getElementById("btnMenu").onclick = openDrawer;
  document.getElementById("backdrop").onclick = closeDrawer;
  document.getElementById("btnHideHow").onclick = () => { document.getElementById("howto").classList.add("hidden"); try { localStorage.setItem("panelSGA_how", "1"); } catch (e) {} };
  if (localStorage.getItem("panelSGA_how") === "1") document.getElementById("howto").classList.add("hidden");
  document.getElementById("btnUpload").onclick = () => document.getElementById("fileExcel").click();
  document.getElementById("fileExcel").onchange = (e) => { if (e.target.files[0]) loadFile(e.target.files[0]); };
  document.getElementById("btnReload").onclick = async () => { try { await loadUrl(S.ruta); render(); } catch (err) { alert("No se encontró " + S.ruta + " junto a esta página. Súbalo a mano o copie el Excel a la misma carpeta."); } };
  document.getElementById("btnQuality").onclick = () => {
    const box = document.getElementById("qualityBox");
    box.classList.toggle("hidden");
    if (!box.classList.contains("hidden") && S.report) {
      box.innerHTML = "<div><b style='color:var(--navy)'>Hojas</b><br>" + S.report.sheets.map((s) => (s.ok ? "✓ " : "✗ ") + s.name + " · " + s.rows + " filas").join("<br>") + "</div><div><b style='color:var(--navy)'>Notas</b><br>" + (S.report.notes.length ? S.report.notes.map((n) => "• " + n).join("<br>") : "Estructura válida.") + "</div>";
    }
  };
  const bar = document.getElementById("databar");
  bar.addEventListener("dragover", (e) => { e.preventDefault(); document.getElementById("dropHint").classList.remove("hidden"); });
  bar.addEventListener("dragleave", () => document.getElementById("dropHint").classList.add("hidden"));
  bar.addEventListener("drop", (e) => { e.preventDefault(); document.getElementById("dropHint").classList.add("hidden"); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
  document.getElementById("unlockForm").onsubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("unlockCode").value;
    let propio = null; try { propio = localStorage.getItem(CFG_PASS); } catch (err) {}
    const h = hashSimple(code);
    if (h === PASS_HASH || (propio && h === propio)) {
      S.unlocked = true; try { localStorage.setItem(CFG_UNLOCK, "1"); } catch (err) {}
      closeUnlock(); document.getElementById("unlockErr").textContent = ""; render();
    } else document.getElementById("unlockErr").textContent = "Código incorrecto.";
  };
  document.getElementById("unlockCancel").onclick = closeUnlock;
  fetch("../Panel_SGA_Lapisa.zip", { method: "HEAD" }).then((r) => { if (r.ok) document.getElementById("btnZip").classList.remove("hidden"); }).catch(() => {});
  boot();
})();
