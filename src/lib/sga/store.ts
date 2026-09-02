import { create } from "zustand";
import {
  AUTO_LOAD_URL_DEFAULT,
  CFG_DATASET_KEY,
  CFG_KEY,
  CFG_PASS_KEY,
  CFG_RUTA_KEY,
  CFG_UI_KEY,
  CFG_UNLOCK_KEY,
  clone,
  construirMetasSGA,
  currentQuarter,
  FE_DEFAULT,
  hashSimple,
  PASS_MAESTRA_HASH,
  PLANTAS_SEED,
  plantaPorId,
  plantaTieneVector,
  primerVectorDisponible,
} from "./catalog";
import { buildDemoRows } from "./demo";
import { ingestRows, parseExcelBuffer, type SheetBundle } from "./excel";
import type { EngineCtx } from "./engine";
import { aniosDisponibles } from "./engine";
import type {
  BD,
  FactoresEmision,
  LoadReport,
  LoadSource,
  MetasSGA,
  Periodo,
  Planta,
  RecOptions,
  VectorId,
  Vista,
} from "./types";

const DEFAULT_PLANTAS = clone(PLANTAS_SEED);
const DEFAULT_FE = clone(FE_DEFAULT);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export type SgaState = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  bd: BD;
  plantas: Planta[];
  metasSGA: MetasSGA;
  FE: FactoresEmision;
  anioActual: number;
  plantaActual: string;
  catActual: VectorId;
  filtroTemporal: Periodo;
  mesDona: string;
  vista: Vista;
  compararPlantas: boolean;
  metricaVector: "ABS" | "INT";
  yoy: boolean;
  metasModo: "AUTO" | "MANUAL";
  rigorLimite: "P75" | "SIGMA" | "P90";
  metasOverride: Record<string, number>;
  rec: RecOptions;
  unlocked: boolean;
  rutaExcel: string;
  report: LoadReport | null;
  boot: () => Promise<void>;
  loadFromUrl: (url?: string) => Promise<boolean>;
  loadFromFile: (file: File) => Promise<void>;
  loadDemo: () => void;
  applyDataset: (bd: BD, report: LoadReport) => void;
  setVista: (v: Vista) => void;
  setPlanta: (id: string) => void;
  setCategoria: (c: VectorId) => void;
  setAnio: (y: number) => void;
  setPeriodo: (p: Periodo) => void;
  tryUnlock: (code: string) => boolean;
  lock: () => void;
  persistConfig: () => void;
  ctx: () => EngineCtx;
  setPlantas: (p: Planta[]) => void;
  setMetasCampo: (planta: string, cat: VectorId, campo: string, valor: number) => void;
  setFE: (clave: keyof FactoresEmision, valor: number) => void;
  setRutaExcel: (ruta: string) => void;
  restoreFactory: () => void;
  importConfig: (payload: unknown) => void;
  setMetasModo: (m: "AUTO" | "MANUAL") => void;
  setRigor: (r: "P75" | "SIGMA" | "P90") => void;
  setOverride: (planta: string, cat: VectorId, pct: number) => void;
  clearOverrides: () => void;
  setRec: (patch: Partial<RecOptions>) => void;
  setMesDona: (v: string) => void;
  toggleComparar: () => void;
  toggleYoy: () => void;
  setMetricaVector: (m: "ABS" | "INT") => void;
  setOwnPassword: (code: string) => void;
  clearOwnPassword: () => void;
};

function persistUi(s: SgaState) {
  writeJson(CFG_UI_KEY, {
    plantaActual: s.plantaActual,
    catActual: s.catActual,
    filtroTemporal: s.filtroTemporal,
    vista: s.vista === "config" || s.vista === "metas" ? "home" : s.vista,
    compararPlantas: s.compararPlantas,
    yoy: s.yoy,
    metricaVector: s.metricaVector,
    rec: s.rec,
    metasModo: s.metasModo,
    rigorLimite: s.rigorLimite,
  });
}

function seedDataset(plantas: Planta[]) {
  const { bd, report } = ingestRows(buildDemoRows(), "demo", plantas, { fileName: "demostración" });
  return { bd, report: { ...report, loadedAt: "" } };
}

const SEEDED_PLANTAS = clone(DEFAULT_PLANTAS);
const SEEDED = seedDataset(SEEDED_PLANTAS);
const SEEDED_YEARS = aniosDisponibles(SEEDED.bd);

export const useSga = create<SgaState>((set, get) => ({
  ready: true,
  loading: false,
  error: null,
  bd: SEEDED.bd,
  plantas: SEEDED_PLANTAS,
  metasSGA: construirMetasSGA(SEEDED_PLANTAS),
  FE: clone(DEFAULT_FE),
  anioActual: SEEDED_YEARS[0] ?? new Date().getFullYear(),
  plantaActual: "PP",
  catActual: "Energia",
  filtroTemporal: currentQuarter(),
  mesDona: "ALL",
  vista: "home",
  compararPlantas: false,
  metricaVector: "ABS",
  yoy: true,
  metasModo: "AUTO",
  rigorLimite: "SIGMA",
  metasOverride: {},
  rec: { vector: "ALL", planta: "ALL", metrica: "ABS", periodo: "ALL", ceros: false },
  unlocked: false,
  rutaExcel: AUTO_LOAD_URL_DEFAULT,
  report: SEEDED.report,

  ctx: () => {
    const s = get();
    return {
      bd: s.bd,
      plantas: s.plantas,
      metasSGA: s.metasSGA,
      FE: s.FE,
      anioActual: s.anioActual,
      metasModo: s.metasModo,
      rigorLimite: s.rigorLimite,
      metasOverride: s.metasOverride,
    };
  },

  persistConfig: () => {
    const s = get();
    writeJson(CFG_KEY, { metasSGA: s.metasSGA, FE: s.FE, plantas: s.plantas });
  },

  applyDataset: (bd, report) => {
    const years = aniosDisponibles(bd);
    const s = get();
    const anio = years[0] ?? s.anioActual;
    set({
      bd,
      report,
      anioActual: anio,
      loading: false,
      ready: true,
      error: null,
    });
    try {
      localStorage.setItem(
        CFG_DATASET_KEY,
        JSON.stringify({ bd, report: { ...report, source: "cache" as LoadSource } }),
      );
    } catch {
      /* ignore */
    }
  },

  loadDemo: () => {
    const s = get();
    const { bd, report } = ingestRows(buildDemoRows(), "demo", s.plantas, { fileName: "demostración" });
    get().applyDataset(bd, report);
  },

  loadFromUrl: async (url) => {
    const ruta = url ?? get().rutaExcel;
    if (!ruta) return false;
    try {
      const resp = await fetch(ruta, { cache: "no-store" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buffer = await resp.arrayBuffer();
      const { bd, report } = await parseExcelBuffer(buffer, get().plantas, "server", { url: ruta, fileName: ruta });
      get().applyDataset(bd, report);
      return true;
    } catch {
      return false;
    }
  },

  loadFromFile: async (file) => {
    set({ loading: true, error: null });
    try {
      const buffer = await file.arrayBuffer();
      const { bd, report } = await parseExcelBuffer(buffer, get().plantas, "upload", { fileName: file.name });
      get().applyDataset(bd, report);
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "No se pudo leer el Excel. Revisa hojas y columnas.",
      });
    }
  },

  boot: async () => {
    let plantas = clone(DEFAULT_PLANTAS);
    let FE = clone(DEFAULT_FE);
    let metasSGA = construirMetasSGA(plantas);
    let rutaExcel = AUTO_LOAD_URL_DEFAULT;
    let unlocked = false;
    try {
      const guardado = readJson<{ plantas?: Planta[]; metasSGA?: MetasSGA; FE?: FactoresEmision } | null>(CFG_KEY, null);
      if (guardado?.plantas?.length) plantas = guardado.plantas;
      metasSGA = construirMetasSGA(plantas);
      if (guardado?.metasSGA) {
        for (const p of Object.keys(guardado.metasSGA)) {
          if (!metasSGA[p]) continue;
          for (const c of Object.keys(guardado.metasSGA[p] ?? {})) {
            const cat = c as VectorId;
            if (metasSGA[p][cat] && guardado.metasSGA[p]?.[cat]) Object.assign(metasSGA[p][cat]!, guardado.metasSGA[p][cat]);
          }
        }
      }
      if (guardado?.FE) Object.assign(FE, guardado.FE);
      rutaExcel = localStorage.getItem(CFG_RUTA_KEY) || AUTO_LOAD_URL_DEFAULT;
      unlocked = localStorage.getItem(CFG_UNLOCK_KEY) === "1";
    } catch {
      /* factory */
    }

    const ui = readJson<Partial<SgaState> | null>(CFG_UI_KEY, null);
    set({
      plantas,
      FE,
      metasSGA,
      rutaExcel,
      unlocked,
      plantaActual: ui?.plantaActual && plantaPorId(plantas, ui.plantaActual) ? ui.plantaActual : plantas[0].id,
      catActual: ui?.catActual ?? "Energia",
      filtroTemporal: ui?.filtroTemporal ?? currentQuarter(),
      vista: (ui?.vista as Vista) ?? "home",
      compararPlantas: ui?.compararPlantas ?? false,
      yoy: ui?.yoy ?? true,
      metricaVector: ui?.metricaVector ?? "ABS",
      rec: ui?.rec ?? { vector: "ALL", planta: "ALL", metrica: "ABS", periodo: "ALL", ceros: false },
      metasModo: ui?.metasModo ?? "AUTO",
      rigorLimite: ui?.rigorLimite ?? "SIGMA",
    });

    const ok = await get().loadFromUrl(rutaExcel);
    if (ok) return;

    try {
      const cached = localStorage.getItem(CFG_DATASET_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { bd: BD; report: LoadReport };
        if (parsed?.bd) {
          get().applyDataset(parsed.bd, { ...parsed.report, source: "cache" });
          return;
        }
      }
    } catch {
      /* fall through */
    }
    get().loadDemo();
  },

  setVista: (vista) => {
    const corporate: Vista[] = ["huella", "inteligencia", "records", "metas", "config"];
    if (corporate.includes(vista) && !get().unlocked) return;
    set({ vista, mesDona: "ALL" });
    persistUi(get());
  },
  setPlanta: (id) => {
    const p = plantaPorId(get().plantas, id);
    if (!p) return;
    let cat = get().catActual;
    if (!plantaTieneVector(p, cat)) cat = primerVectorDisponible(p);
    set({ plantaActual: id, catActual: cat });
    persistUi(get());
  },
  setCategoria: (c) => {
    set({ catActual: c, vista: "vector", mesDona: "ALL" });
    persistUi(get());
  },
  setAnio: (y) => set({ anioActual: y }),
  setPeriodo: (p) => {
    set({ filtroTemporal: p, mesDona: "ALL" });
    persistUi(get());
  },
  setMesDona: (v) => set({ mesDona: v }),
  toggleComparar: () => {
    set({ compararPlantas: !get().compararPlantas });
    persistUi(get());
  },
  toggleYoy: () => {
    set({ yoy: !get().yoy });
    persistUi(get());
  },
  setMetricaVector: (m) => {
    set({ metricaVector: m });
    persistUi(get());
  },
  tryUnlock: (code) => {
    const h = hashSimple(code);
    let propio: string | null = null;
    try {
      propio = localStorage.getItem(CFG_PASS_KEY);
    } catch {
      propio = null;
    }
    if (h === PASS_MAESTRA_HASH || (propio && h === propio)) {
      try {
        localStorage.setItem(CFG_UNLOCK_KEY, "1");
      } catch {
        /* ignore */
      }
      set({ unlocked: true });
      return true;
    }
    return false;
  },
  lock: () => {
    try {
      localStorage.removeItem(CFG_UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    set({ unlocked: false, vista: "home" });
  },
  setOwnPassword: (code) => {
    try {
      localStorage.setItem(CFG_PASS_KEY, hashSimple(code));
    } catch {
      /* ignore */
    }
    set({ unlocked: true });
  },
  clearOwnPassword: () => {
    try {
      localStorage.removeItem(CFG_PASS_KEY);
    } catch {
      /* ignore */
    }
  },
  setPlantas: (plantas) => {
    const prev = get().metasSGA;
    const metasSGA = construirMetasSGA(plantas);
    for (const p of Object.keys(prev)) {
      if (!metasSGA[p]) continue;
      for (const c of Object.keys(prev[p] ?? {})) {
        const cat = c as VectorId;
        if (metasSGA[p][cat] && prev[p][cat]) Object.assign(metasSGA[p][cat]!, prev[p][cat]);
      }
    }
    let { plantaActual, catActual } = get();
    if (!plantaPorId(plantas, plantaActual)) plantaActual = plantas[0]?.id ?? plantaActual;
    const p = plantaPorId(plantas, plantaActual);
    if (p && !plantaTieneVector(p, catActual)) catActual = primerVectorDisponible(p);
    set({ plantas, metasSGA, plantaActual, catActual });
    get().persistConfig();
  },
  setMetasCampo: (planta, cat, campo, valor) => {
    const metasSGA = clone(get().metasSGA);
    if (!metasSGA[planta]?.[cat]) return;
    (metasSGA[planta][cat] as unknown as Record<string, number>)[campo] = valor;
    set({ metasSGA });
    get().persistConfig();
  },
  setFE: (clave, valor) => {
    set({ FE: { ...get().FE, [clave]: valor } });
    get().persistConfig();
  },
  setRutaExcel: (ruta) => {
    const limpia = ruta.trim() || AUTO_LOAD_URL_DEFAULT;
    try {
      localStorage.setItem(CFG_RUTA_KEY, limpia);
    } catch {
      /* ignore */
    }
    set({ rutaExcel: limpia });
  },
  restoreFactory: () => {
    const plantas = clone(DEFAULT_PLANTAS);
    const metasSGA = construirMetasSGA(plantas);
    set({
      plantas,
      metasSGA,
      FE: clone(DEFAULT_FE),
      metasOverride: {},
      plantaActual: plantas[0].id,
      rutaExcel: AUTO_LOAD_URL_DEFAULT,
    });
    try {
      localStorage.removeItem(CFG_KEY);
      localStorage.removeItem(CFG_RUTA_KEY);
    } catch {
      /* ignore */
    }
  },
  importConfig: (payload) => {
    const guardado = payload as { plantas?: Planta[]; metasSGA?: MetasSGA; FE?: FactoresEmision; rutaExcel?: string };
    let plantas = get().plantas;
    if (guardado.plantas?.length) plantas = guardado.plantas;
    const metasSGA = construirMetasSGA(plantas);
    if (guardado.metasSGA) {
      for (const p of Object.keys(guardado.metasSGA)) {
        if (!metasSGA[p]) continue;
        for (const c of Object.keys(guardado.metasSGA[p] ?? {})) {
          const cat = c as VectorId;
          if (metasSGA[p][cat] && guardado.metasSGA[p]?.[cat]) Object.assign(metasSGA[p][cat]!, guardado.metasSGA[p][cat]);
        }
      }
    }
    const FE = { ...get().FE, ...(guardado.FE ?? {}) };
    if (guardado.rutaExcel) get().setRutaExcel(guardado.rutaExcel);
    set({ plantas, metasSGA, FE, plantaActual: plantaPorId(plantas, get().plantaActual) ? get().plantaActual : plantas[0].id });
    get().persistConfig();
  },
  setMetasModo: (m) => {
    set({ metasModo: m });
    persistUi(get());
  },
  setRigor: (r) => {
    set({ rigorLimite: r });
    persistUi(get());
  },
  setOverride: (planta, cat, pct) => {
    const v = Math.min(60, Math.max(0, pct)) / 100;
    set({ metasOverride: { ...get().metasOverride, [`${planta}|${cat}`]: v } });
    const metasSGA = clone(get().metasSGA);
    if (metasSGA[planta]?.[cat]) metasSGA[planta][cat]!.factorMejora = v;
    set({ metasSGA });
  },
  clearOverrides: () => set({ metasOverride: {} }),
  setRec: (patch) => {
    set({ rec: { ...get().rec, ...patch } });
    persistUi(get());
  },
}));

export function exportConfigPayload() {
  const s = useSga.getState();
  return {
    metasSGA: s.metasSGA,
    FE: s.FE,
    plantas: s.plantas,
    rutaExcel: s.rutaExcel,
    exportado: new Date().toISOString(),
  };
}

export function useEngineCtx(): EngineCtx {
  const bd = useSga((s) => s.bd);
  const plantas = useSga((s) => s.plantas);
  const metasSGA = useSga((s) => s.metasSGA);
  const FE = useSga((s) => s.FE);
  const anioActual = useSga((s) => s.anioActual);
  const metasModo = useSga((s) => s.metasModo);
  const rigorLimite = useSga((s) => s.rigorLimite);
  const metasOverride = useSga((s) => s.metasOverride);
  return { bd, plantas, metasSGA, FE, anioActual, metasModo, rigorLimite, metasOverride };
}
