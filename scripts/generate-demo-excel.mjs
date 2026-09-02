import { writeFileSync, copyFileSync } from "node:fs";
import * as XLSX from "xlsx";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALL_MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const YEARS = [2023, 2024, 2025, 2026];
const SPECS = [
  { id: "PP", prodBase: 92000, cfe: 210000, solar: 38000, red: 1180, recup: 520, solidos: 3200, liquidos: 860, bio: 140, gasolina: 2800, diesel: 6400, gas: 1600, fuels: true },
  { id: "PA", prodBase: 41000, cfe: 18000, solar: 42000, red: 640, recup: 0, solidos: 1800, liquidos: 420, bio: 0, gasolina: 0, diesel: 0, gas: 0, fuels: false },
  { id: "Diagnostico", prodBase: 6400, cfe: 28000, solar: 9000, red: 210, recup: 0, solidos: 0, liquidos: 0, bio: 180, gasolina: 0, diesel: 0, gas: 0, fuels: false },
];

function seasonal(month, amp) {
  return Math.sin(((month - 2) / 12) * Math.PI * 2) * amp;
}
function spike(planta, year, month, vector) {
  if (planta === "PP" && year === 2025 && month === 2 && vector === "cfe") return 0.42;
  if (planta === "PA" && year === 2024 && month === 5 && vector === "red") return 0.55;
  if (planta === "Diagnostico" && year === 2025 && month === 10 && vector === "bio") return 0.7;
  if (planta === "PP" && year === 2026 && month === 6 && vector === "diesel") return 0.35;
  return 0;
}
function round(n, d = 0) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

const rng = mulberry32(20260901);
const now = new Date();
const maxMonth2026 = now.getFullYear() > 2026 ? 11 : now.getFullYear() < 2026 ? -1 : now.getMonth();

const Produccion = [];
const Energia = [];
const Agua = [];
const Residuos = [];
const Combustibles = [];

for (const spec of SPECS) {
  YEARS.forEach((year, yi) => {
    for (let m = 0; m < 12; m++) {
      if (year === 2026 && m > maxMonth2026) continue;
      const trend = 1 - yi * 0.025;
      const noise = () => (rng() - 0.5) * 0.08;
      const prod = spec.prodBase * (1 + seasonal(m, spec.id === "Diagnostico" ? 0.08 : 0.12) + noise()) * (1 + yi * 0.03);
      const mes = ALL_MESES[m];
      Produccion.push({ Planta: spec.id, Año: year, Mes: mes, Pzas_Producidas: Math.max(0, Math.round(prod)) });
      const solarShare = 0.12 + yi * 0.04 + (spec.id === "PA" ? 0.45 : 0);
      const cfe = spec.cfe * trend * (1 + seasonal(m, 0.1) + noise() + spike(spec.id, year, m, "cfe"));
      const solar = spec.solar * (1 + solarShare * 0.15) * (1 + seasonal(m, 0.18) + noise());
      Energia.push({ Planta: spec.id, Año: year, Mes: mes, Consumo_CFE_kWh: Math.max(0, round(cfe)), Generacion_Solar_kWh: Math.max(0, round(solar)) });
      const red = spec.red * trend * (1 + seasonal(m, 0.14) + noise() + spike(spec.id, year, m, "red"));
      const recup = spec.recup * (1 + yi * 0.04) * (1 + seasonal(m, 0.1) + noise());
      Agua.push({ Planta: spec.id, Año: year, Mes: mes, Agua_Consumida_m3: Math.max(0, round(red, 1)), Agua_Recuperada_m3: Math.max(0, round(recup, 1)) });
      Residuos.push({
        Planta: spec.id, Año: year, Mes: mes,
        Peligrosos_Solidos_kg: Math.max(0, round(spec.solidos * (1 + seasonal(m, 0.08) + noise()))),
        Peligrosos_Liquidos_Lts: Math.max(0, round(spec.liquidos * (1 + seasonal(m, 0.1) + noise()), 1)),
        Bio_Infecciosos_kg: Math.max(0, round(spec.bio * (1 + seasonal(m, 0.12) + noise() + spike(spec.id, year, m, "bio")), 1)),
      });
      if (spec.fuels) {
        Combustibles.push({
          Planta: spec.id, Año: year, Mes: mes,
          Gasolina_Lts: Math.max(0, round(spec.gasolina * (1 + seasonal(m, 0.06) + noise()))),
          Diesel_Lts: Math.max(0, round(spec.diesel * trend * (1 + seasonal(m, 0.09) + noise() + spike(spec.id, year, m, "diesel")))),
          Gas_Lts: Math.max(0, round(spec.gas * (1 + seasonal(m, 0.05) + noise()))),
        });
      }
    }
  });
}

const wb = XLSX.utils.book_new();
for (const [name, rows] of [["Produccion", Produccion], ["Energia", Energia], ["Agua", Agua], ["Residuos", Residuos], ["Combustibles", Combustibles]]) {
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name);
}
writeFileSync("/workspace/public/Base_de_Datos_Dashboard.xlsx", XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
copyFileSync("/workspace/public/Base_de_Datos_Dashboard.xlsx", "/workspace/public/intranet/Base_de_Datos_Dashboard.xlsx");
console.log("Wrote public/Base_de_Datos_Dashboard.xlsx", { Produccion: Produccion.length, Energia: Energia.length });
