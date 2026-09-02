export const fmt0 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
export const fmt1 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
export const fmt2 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });
export const fmt4 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 4 });

export function fmtCompact(v: number) {
  return new Intl.NumberFormat("es-MX", { notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export function deltaPct(actual: number, anterior: number | undefined | null) {
  if (anterior === undefined || anterior === null || anterior === 0) return null;
  return ((actual - anterior) / anterior) * 100;
}

export function etiquetaPeriodo(p: string) {
  if (p === "ALL") return "Año completo";
  if (p === "Q1") return "Q1 · Ene–Mar";
  if (p === "Q2") return "Q2 · Abr–Jun";
  if (p === "Q3") return "Q3 · Jul–Sep";
  if (p === "Q4") return "Q4 · Oct–Dic";
  return p;
}
