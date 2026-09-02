import { emptyYear, plantaPorId } from "./catalog";
import { ALL_MESES, type BD, type LoadReport, type LoadSource, type Planta, type VectorId } from "./types";

export type RawRow = Record<string, unknown>;

export type SheetBundle = {
  Produccion?: RawRow[];
  Energia?: RawRow[];
  Agua?: RawRow[];
  Residuos?: RawRow[];
  Combustibles?: RawRow[];
};

const REQUIRED_SHEETS = ["Produccion", "Energia", "Agua", "Residuos", "Combustibles"] as const;

const MAPPING: Record<VectorId, string[]> = {
  Energia: ["Consumo_CFE_kWh", "Generacion_Solar_kWh"],
  Agua: ["Agua_Consumida_m3", "Agua_Recuperada_m3"],
  Residuos: ["Peligrosos_Solidos_kg", "Peligrosos_Liquidos_Lts", "Bio_Infecciosos_kg"],
  Combustibles: ["Gasolina_Lts", "Diesel_Lts", "Gas_Lts"],
};

function yearOf(r: RawRow) {
  const v = r["Año"] ?? r.Anio ?? r.Year ?? r.anio;
  const n = Number(v);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

function plantaOf(r: RawRow) {
  return String(r.Planta ?? r.planta ?? "").trim();
}

function mesIndex(r: RawRow) {
  const raw = String(r.Mes ?? r.mes ?? "");
  const key = raw.substring(0, 3);
  return ALL_MESES.indexOf(key as (typeof ALL_MESES)[number]);
}

function num(v: unknown) {
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

export function ingestRows(
  sheets: SheetBundle,
  source: LoadSource,
  plantas: Planta[],
  meta?: { url?: string; fileName?: string },
): { bd: BD; report: LoadReport } {
  const bd: BD = {};
  const years = new Set<number>();
  const plantsFound = new Set<string>();
  const plantsUnknown = new Set<string>();
  let invalidMonths = 0;
  const notes: string[] = [];

  const ensure = (planta: string, anio: number) => {
    if (!bd[planta]) bd[planta] = {};
    if (!bd[planta][anio]) bd[planta][anio] = emptyYear();
  };

  const sheetReport: LoadReport["sheets"] = [];
  const missingSheets: string[] = [];

  for (const name of REQUIRED_SHEETS) {
    const rows = sheets[name];
    if (!rows || rows.length === 0) {
      missingSheets.push(name);
      sheetReport.push({ name, rows: 0, ok: false });
    } else {
      sheetReport.push({ name, rows: rows.length, ok: true });
    }
  }

  const prod = sheets.Produccion ?? [];
  for (const r of prod) {
    const planta = plantaOf(r);
    if (!planta) continue;
    plantsFound.add(planta);
    if (!plantaPorId(plantas, planta)) plantsUnknown.add(planta);
    const anio = yearOf(r);
    years.add(anio);
    const mIdx = mesIndex(r);
    if (mIdx === -1) {
      invalidMonths++;
      continue;
    }
    ensure(planta, anio);
    bd[planta][anio].produccion[mIdx] += num(r.Pzas_Producidas ?? r.pzas ?? r.Produccion);
  }

  (Object.keys(MAPPING) as VectorId[]).forEach((cat) => {
    const rows = sheets[cat] ?? [];
    for (const r of rows) {
      const planta = plantaOf(r);
      if (!planta) continue;
      plantsFound.add(planta);
      if (!plantaPorId(plantas, planta)) plantsUnknown.add(planta);
      const anio = yearOf(r);
      years.add(anio);
      const mIdx = mesIndex(r);
      if (mIdx === -1) {
        invalidMonths++;
        continue;
      }
      ensure(planta, anio);
      MAPPING[cat].forEach((col, i) => {
        let val = num(r[col]);
        if (val === 0 && col === "Gas_Lts") val = num(r.Gas_kg);
        const ds = bd[planta][anio][cat].principal[i];
        if (ds) ds.d[mIdx] += val;
      });
    }
  });

  if (plantsUnknown.size) {
    notes.push(
      `Plantas en el Excel que no están en el catálogo (no se verán hasta agregarlas en Parámetros): ${[...plantsUnknown].join(", ")}.`,
    );
  }
  if (invalidMonths) notes.push(`${invalidMonths} filas con mes no reconocido (usa Ene, Feb, Mar…).`);
  if (missingSheets.length) notes.push(`Hojas faltantes o vacías: ${missingSheets.join(", ")}.`);
  if (!prod.length) notes.push("Sin hoja de Producción: las intensidades no se podrán calcular.");

  const knownIds = new Set(plantas.map((p) => p.id));
  for (const id of knownIds) {
    if (!plantsFound.has(id)) notes.push(`El catálogo tiene "${id}" pero el Excel no trae filas para esa planta.`);
  }

  const report: LoadReport = {
    source,
    url: meta?.url,
    fileName: meta?.fileName,
    sheets: sheetReport,
    missingSheets,
    plantsFound: [...plantsFound],
    plantsUnknown: [...plantsUnknown],
    years: [...years].sort((a, b) => b - a),
    invalidMonths,
    loadedAt: new Date().toISOString(),
    notes,
  };

  return { bd, report };
}

export async function parseExcelBuffer(
  buffer: ArrayBuffer,
  plantas: Planta[],
  source: LoadSource,
  meta?: { url?: string; fileName?: string },
) {
  const XLSX = await import("xlsx");
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheets: SheetBundle = {};
  for (const name of REQUIRED_SHEETS) {
    if (workbook.Sheets[name]) {
      sheets[name] = XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[name]);
    }
  }
  return ingestRows(sheets, source, plantas, meta);
}

export async function workbookFromRows(sheets: SheetBundle) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const name of REQUIRED_SHEETS) {
    const rows = sheets[name] ?? [];
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  return wb;
}

export function downloadWorkbook(wb: import("xlsx").WorkBook, filename: string) {
  void import("xlsx").then((XLSX) => {
    XLSX.writeFile(wb, filename);
  });
}


