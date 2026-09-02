export const ALL_MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

export type Mes = (typeof ALL_MESES)[number];
export type VectorId = "Energia" | "Agua" | "Residuos" | "Combustibles";
export type Periodo = "ALL" | "Q1" | "Q2" | "Q3" | "Q4";
export type Vista =
  | "home"
  | "vector"
  | "huella"
  | "inteligencia"
  | "records"
  | "metas"
  | "config";

export type FlujoPunto = { l: string; d: number[]; c: string };
export type VectorData = {
  stacked: boolean;
  subtitulo: string;
  principal: FlujoPunto[];
};

export type AnioData = {
  produccion: number[];
  Energia: VectorData;
  Agua: VectorData;
  Residuos: VectorData;
  Combustibles: VectorData;
};

export type BD = Record<string, Record<number, AnioData>>;

export type FlujosPlanta = {
  "Consumo CFE": boolean;
  Solar: boolean;
  Red: boolean;
  Recup: boolean;
  Sólidos: boolean;
  Líquidos: boolean;
  Biológicos: boolean;
};

export type Planta = {
  id: string;
  nombre: string;
  corto: string;
  unidadProd: "PZ" | "EX";
  terminoUnidad: string;
  vectores: { Combustibles: boolean };
  flujos: FlujosPlanta;
  icono: "factory" | "sprout" | "flask" | "building";
};

export type MetaVector = {
  factorMejora: number;
  efMetaFallback: number;
  unidad: string;
  pctMeta?: number;
  volMeta?: number;
};

export type MetasSGA = Record<string, Partial<Record<VectorId, MetaVector>>>;

export type FactoresEmision = {
  CFE: number;
  Gasolina: number;
  Diesel: number;
  GasLP: number;
  AguaRed: number;
  Solidos: number;
  Liquidos: number;
  Biologicos: number;
};

export type LoadSource = "server" | "upload" | "demo" | "cache";

export type SheetReport = { name: string; rows: number; ok: boolean };

export type LoadReport = {
  source: LoadSource;
  url?: string;
  fileName?: string;
  sheets: SheetReport[];
  missingSheets: string[];
  plantsFound: string[];
  plantsUnknown: string[];
  years: number[];
  invalidMonths: number;
  loadedAt: string;
  notes: string[];
};

export type RecOptions = {
  vector: VectorId | "ALL";
  planta: string | "ALL";
  metrica: "ABS" | "INT";
  periodo: Periodo;
  ceros: boolean;
};

export type SeriePunto = { val: number; mes: string; anio: number };
export type RecStats = {
  min: SeriePunto;
  max: SeriePunto;
  avg: number;
  n: number;
  ultimo: SeriePunto;
  spread: number;
};
