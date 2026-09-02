import type {
  AnioData,
  FactoresEmision,
  FlujosPlanta,
  MetaVector,
  MetasSGA,
  Planta,
  VectorId,
} from "./types";

export const VECTORES: VectorId[] = ["Energia", "Agua", "Residuos", "Combustibles"];

export const VECTOR_META: Record<
  VectorId,
  {
    nombre: string;
    color: string;
    unidad: string;
    flujos: Record<string, string>;
  }
> = {
  Energia: {
    nombre: "Energía",
    color: "#0E7C86",
    unidad: "kWh",
    flujos: { "Consumo CFE": "kWh", Solar: "kWh" },
  },
  Agua: {
    nombre: "Agua",
    color: "#017ACB",
    unidad: "m³",
    flujos: { Red: "m³", Recup: "m³" },
  },
  Residuos: {
    nombre: "Residuos",
    color: "#1E3548",
    unidad: "kg/L",
    flujos: { Sólidos: "kg", Líquidos: "L", Biológicos: "kg" },
  },
  Combustibles: {
    nombre: "Combustibles",
    color: "#5B7088",
    unidad: "L",
    flujos: { Gasolina: "L", Diesel: "L", "Gas LP": "L" },
  },
};

export const FLUJOS_DEFAULT: FlujosPlanta = {
  "Consumo CFE": true,
  Solar: true,
  Red: true,
  Recup: true,
  Sólidos: true,
  Líquidos: true,
  Biológicos: true,
};

export const PLANTAS_SEED: Planta[] = [
  {
    id: "PP",
    nombre: "Planta Principal",
    corto: "P. Principal",
    unidadProd: "PZ",
    terminoUnidad: "pieza",
    vectores: { Combustibles: true },
    flujos: { ...FLUJOS_DEFAULT },
    icono: "factory",
  },
  {
    id: "PA",
    nombre: "Planta Agrícola",
    corto: "P. Agrícola",
    unidadProd: "PZ",
    terminoUnidad: "pieza",
    vectores: { Combustibles: false },
    flujos: {
      ...FLUJOS_DEFAULT,
      Recup: false,
      Biológicos: false,
    },
    icono: "sprout",
  },
  {
    id: "Diagnostico",
    nombre: "Diagnóstico",
    corto: "Diagnóstico",
    unidadProd: "EX",
    terminoUnidad: "examen",
    vectores: { Combustibles: false },
    flujos: {
      "Consumo CFE": true,
      Solar: true,
      Red: true,
      Recup: false,
      Sólidos: false,
      Líquidos: false,
      Biológicos: true,
    },
    icono: "flask",
  },
];

export const METAS_SEED: Record<string, Partial<Record<VectorId, MetaVector>>> = {
  PP: {
    Energia: { factorMejora: 0.05, efMetaFallback: 1.3, pctMeta: 15, unidad: "kWh" },
    Agua: { factorMejora: 0.03, efMetaFallback: 6.0, pctMeta: 50, unidad: "m³" },
    Residuos: { factorMejora: 0.02, efMetaFallback: 0.05, volMeta: 45000, unidad: "kg/L" },
    Combustibles: { factorMejora: 0.02, efMetaFallback: 0.05, volMeta: 45000, unidad: "L" },
  },
  PA: {
    Energia: { factorMejora: 0.05, efMetaFallback: 0.3, pctMeta: 90, unidad: "kWh" },
    Agua: { factorMejora: 0.03, efMetaFallback: 2.5, pctMeta: 0, unidad: "m³" },
    Residuos: { factorMejora: 0.02, efMetaFallback: 0.08, volMeta: 25000, unidad: "kg/L" },
    Combustibles: { factorMejora: 0.02, efMetaFallback: 0.08, volMeta: 25000, unidad: "L" },
  },
  Diagnostico: {
    Energia: { factorMejora: 0.05, efMetaFallback: 3.5, pctMeta: 40, unidad: "kWh" },
    Agua: { factorMejora: 0.03, efMetaFallback: 10, pctMeta: 0, unidad: "m³" },
    Residuos: { factorMejora: 0.02, efMetaFallback: 0.02, volMeta: 5000, unidad: "kg/L" },
    Combustibles: { factorMejora: 0.02, efMetaFallback: 0.02, volMeta: 5000, unidad: "L" },
  },
};

export const FE_DEFAULT: FactoresEmision = {
  CFE: 0.438,
  Gasolina: 2.31,
  Diesel: 2.68,
  GasLP: 1.51,
  AguaRed: 0.344,
  Solidos: 0.5,
  Liquidos: 0.8,
  Biologicos: 2.5,
};

export const FE_ETIQUETAS: Record<keyof FactoresEmision, { titulo: string; unidad: string }> = {
  CFE: { titulo: "Electricidad de red (CFE)", unidad: "kg CO₂e / kWh" },
  Gasolina: { titulo: "Gasolina", unidad: "kg CO₂e / L" },
  Diesel: { titulo: "Diésel", unidad: "kg CO₂e / L" },
  GasLP: { titulo: "Gas LP", unidad: "kg CO₂e / L" },
  AguaRed: { titulo: "Agua de red", unidad: "kg CO₂e / m³" },
  Solidos: { titulo: "Residuos sólidos", unidad: "kg CO₂e / kg" },
  Liquidos: { titulo: "Residuos líquidos", unidad: "kg CO₂e / L" },
  Biologicos: { titulo: "Residuos biológicos", unidad: "kg CO₂e / kg" },
};

export const AUTO_LOAD_URL_DEFAULT = "Base_de_Datos_Dashboard.xlsx";

export const CFG_KEY = "panelSGA_configUsuario_v1";
export const CFG_RUTA_KEY = "panelSGA_rutaExcel_v1";
export const CFG_PASS_KEY = "panelSGA_passHash_v1";
export const CFG_UNLOCK_KEY = "panelSGA_desbloqueado_v1";
export const CFG_DATASET_KEY = "panelSGA_dataset_v1";
export const CFG_UI_KEY = "panelSGA_ui_v1";
export const PASS_MAESTRA_HASH = "zizh";

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function metaDefaultVector(cat: VectorId): MetaVector {
  const unidades: Record<VectorId, string> = {
    Energia: "kWh",
    Agua: "m³",
    Residuos: "kg/L",
    Combustibles: "L",
  };
  const base: MetaVector = { factorMejora: 0.05, efMetaFallback: 1, unidad: unidades[cat] };
  if (cat === "Energia" || cat === "Agua") base.pctMeta = 10;
  if (cat === "Residuos" || cat === "Combustibles") base.volMeta = 1000;
  return base;
}

export function construirMetasSGA(plantas: Planta[]): MetasSGA {
  const flujosPorVector: Record<Exclude<VectorId, "Combustibles">, string[]> = {
    Energia: ["Consumo CFE", "Solar"],
    Agua: ["Red", "Recup"],
    Residuos: ["Sólidos", "Líquidos", "Biológicos"],
  };
  const out: MetasSGA = {};
  for (const p of plantas) {
    out[p.id] = {};
    (Object.keys(flujosPorVector) as Array<keyof typeof flujosPorVector>).forEach((cat) => {
      const activo = flujosPorVector[cat].some((f) => p.flujos[f as keyof FlujosPlanta]);
      if (!activo) return;
      const semilla = METAS_SEED[p.id]?.[cat];
      out[p.id][cat] = semilla ? { ...semilla } : metaDefaultVector(cat);
    });
    if (p.vectores.Combustibles) {
      const semilla = METAS_SEED[p.id]?.Combustibles;
      out[p.id].Combustibles = semilla ? { ...semilla } : metaDefaultVector("Combustibles");
    }
  }
  return out;
}

export function emptyYear(): AnioData {
  return {
    produccion: Array(12).fill(0),
    Energia: {
      stacked: true,
      subtitulo: "Meta: % generación limpia",
      principal: [
        { l: "Consumo CFE", d: Array(12).fill(0), c: "#C2410C" },
        { l: "Solar", d: Array(12).fill(0), c: "#0E7C86" },
      ],
    },
    Agua: {
      stacked: true,
      subtitulo: "Meta: % recuperación hídrica",
      principal: [
        { l: "Red", d: Array(12).fill(0), c: "#017ACB" },
        { l: "Recup", d: Array(12).fill(0), c: "#38BDF8" },
      ],
    },
    Residuos: {
      stacked: false,
      subtitulo: "Generación por flujo",
      principal: [
        { l: "Sólidos", d: Array(12).fill(0), c: "#B45309" },
        { l: "Líquidos", d: Array(12).fill(0), c: "#5B7088" },
        { l: "Biológicos", d: Array(12).fill(0), c: "#B91C1C" },
      ],
    },
    Combustibles: {
      stacked: false,
      subtitulo: "Consumo de hidrocarburos",
      principal: [
        { l: "Gasolina", d: Array(12).fill(0), c: "#EA580C" },
        { l: "Diesel", d: Array(12).fill(0), c: "#334155" },
        { l: "Gas LP", d: Array(12).fill(0), c: "#0284C7" },
      ],
    },
  };
}

export function plantaPorId(plantas: Planta[], id: string) {
  return plantas.find((p) => p.id === id);
}

export function plantaTieneVector(p: Planta | undefined, cat: VectorId) {
  if (!p) return false;
  if (cat === "Combustibles") return !!p.vectores.Combustibles;
  return Object.keys(VECTOR_META[cat].flujos).some((f) => p.flujos[f as keyof FlujosPlanta]);
}

export function flujosDePlantaVector(p: Planta | undefined, cat: VectorId): string[] {
  if (!p) return [];
  if (cat === "Combustibles") return p.vectores.Combustibles ? Object.keys(VECTOR_META[cat].flujos) : [];
  return Object.keys(VECTOR_META[cat].flujos).filter((f) => p.flujos[f as keyof FlujosPlanta]);
}

export function primerVectorDisponible(p: Planta) {
  return VECTORES.find((c) => plantaTieneVector(p, c)) ?? "Energia";
}

export function hashSimple(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return h.toString(36);
}

export function currentQuarter(): "Q1" | "Q2" | "Q3" | "Q4" {
  const q = Math.floor(new Date().getMonth() / 3) + 1;
  return (`Q${q}`) as "Q1" | "Q2" | "Q3" | "Q4";
}

export function limitesPeriodo(filtro: "ALL" | "Q1" | "Q2" | "Q3" | "Q4") {
  if (filtro === "Q1") return { s: 0, e: 3 };
  if (filtro === "Q2") return { s: 3, e: 6 };
  if (filtro === "Q3") return { s: 6, e: 9 };
  if (filtro === "Q4") return { s: 9, e: 12 };
  return { s: 0, e: 12 };
}
