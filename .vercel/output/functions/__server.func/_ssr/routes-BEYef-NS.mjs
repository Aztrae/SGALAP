import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as CircleCheck, E as Brain, S as Droplets, T as Building2, _ as Fuel, a as TriangleAlert, b as Factory, c as Shield, d as Recycle, f as Printer, g as LayoutDashboard, h as LockOpen, i as Trophy, l as Settings, m as Lock, n as X, o as Target, p as Menu, r as Upload, s as Sprout, t as Zap, u as RefreshCw, v as FolderUp, w as ChartColumn, x as Earth, y as FlaskConical } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { _ as ResponsiveContainer, a as BarChart, c as XAxis, d as Area, f as Line, g as Cell, h as Pie, i as PieChart, l as Scatter, m as Bar, n as AreaChart, o as LineChart, p as CartesianGrid, r as ScatterChart, s as YAxis, t as ComposedChart, u as ZAxis, v as Tooltip, y as Legend } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BEYef-NS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
var fmt1 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
var fmt2 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });
var fmt4 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 4 });
function fmtCompact(v) {
	return new Intl.NumberFormat("es-MX", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(v);
}
function deltaPct(actual, anterior) {
	if (anterior === void 0 || anterior === null || anterior === 0) return null;
	return (actual - anterior) / anterior * 100;
}
function etiquetaPeriodo(p) {
	if (p === "ALL") return "Año completo";
	if (p === "Q1") return "Q1 · Ene–Mar";
	if (p === "Q2") return "Q2 · Abr–Jun";
	if (p === "Q3") return "Q3 · Jul–Sep";
	if (p === "Q4") return "Q4 · Oct–Dic";
	return p;
}
var VECTORES$1 = [
	"Energia",
	"Agua",
	"Residuos",
	"Combustibles"
];
var VECTOR_META = {
	Energia: {
		nombre: "Energía",
		color: "#0E7C86",
		unidad: "kWh",
		flujos: {
			"Consumo CFE": "kWh",
			Solar: "kWh"
		}
	},
	Agua: {
		nombre: "Agua",
		color: "#017ACB",
		unidad: "m³",
		flujos: {
			Red: "m³",
			Recup: "m³"
		}
	},
	Residuos: {
		nombre: "Residuos",
		color: "#1E3548",
		unidad: "kg/L",
		flujos: {
			Sólidos: "kg",
			Líquidos: "L",
			Biológicos: "kg"
		}
	},
	Combustibles: {
		nombre: "Combustibles",
		color: "#5B7088",
		unidad: "L",
		flujos: {
			Gasolina: "L",
			Diesel: "L",
			"Gas LP": "L"
		}
	}
};
var FLUJOS_DEFAULT = {
	"Consumo CFE": true,
	Solar: true,
	Red: true,
	Recup: true,
	Sólidos: true,
	Líquidos: true,
	Biológicos: true
};
var PLANTAS_SEED = [
	{
		id: "PP",
		nombre: "Planta Principal",
		corto: "P. Principal",
		unidadProd: "PZ",
		terminoUnidad: "pieza",
		vectores: { Combustibles: true },
		flujos: { ...FLUJOS_DEFAULT },
		icono: "factory"
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
			Biológicos: false
		},
		icono: "sprout"
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
			Biológicos: true
		},
		icono: "flask"
	}
];
var METAS_SEED = {
	PP: {
		Energia: {
			factorMejora: .05,
			efMetaFallback: 1.3,
			pctMeta: 15,
			unidad: "kWh"
		},
		Agua: {
			factorMejora: .03,
			efMetaFallback: 6,
			pctMeta: 50,
			unidad: "m³"
		},
		Residuos: {
			factorMejora: .02,
			efMetaFallback: .05,
			volMeta: 45e3,
			unidad: "kg/L"
		},
		Combustibles: {
			factorMejora: .02,
			efMetaFallback: .05,
			volMeta: 45e3,
			unidad: "L"
		}
	},
	PA: {
		Energia: {
			factorMejora: .05,
			efMetaFallback: .3,
			pctMeta: 90,
			unidad: "kWh"
		},
		Agua: {
			factorMejora: .03,
			efMetaFallback: 2.5,
			pctMeta: 0,
			unidad: "m³"
		},
		Residuos: {
			factorMejora: .02,
			efMetaFallback: .08,
			volMeta: 25e3,
			unidad: "kg/L"
		},
		Combustibles: {
			factorMejora: .02,
			efMetaFallback: .08,
			volMeta: 25e3,
			unidad: "L"
		}
	},
	Diagnostico: {
		Energia: {
			factorMejora: .05,
			efMetaFallback: 3.5,
			pctMeta: 40,
			unidad: "kWh"
		},
		Agua: {
			factorMejora: .03,
			efMetaFallback: 10,
			pctMeta: 0,
			unidad: "m³"
		},
		Residuos: {
			factorMejora: .02,
			efMetaFallback: .02,
			volMeta: 5e3,
			unidad: "kg/L"
		},
		Combustibles: {
			factorMejora: .02,
			efMetaFallback: .02,
			volMeta: 5e3,
			unidad: "L"
		}
	}
};
var FE_DEFAULT = {
	CFE: .438,
	Gasolina: 2.31,
	Diesel: 2.68,
	GasLP: 1.51,
	AguaRed: .344,
	Solidos: .5,
	Liquidos: .8,
	Biologicos: 2.5
};
var FE_ETIQUETAS = {
	CFE: {
		titulo: "Electricidad de red (CFE)",
		unidad: "kg CO₂e / kWh"
	},
	Gasolina: {
		titulo: "Gasolina",
		unidad: "kg CO₂e / L"
	},
	Diesel: {
		titulo: "Diésel",
		unidad: "kg CO₂e / L"
	},
	GasLP: {
		titulo: "Gas LP",
		unidad: "kg CO₂e / L"
	},
	AguaRed: {
		titulo: "Agua de red",
		unidad: "kg CO₂e / m³"
	},
	Solidos: {
		titulo: "Residuos sólidos",
		unidad: "kg CO₂e / kg"
	},
	Liquidos: {
		titulo: "Residuos líquidos",
		unidad: "kg CO₂e / L"
	},
	Biologicos: {
		titulo: "Residuos biológicos",
		unidad: "kg CO₂e / kg"
	}
};
var AUTO_LOAD_URL_DEFAULT = "Base_de_Datos_Dashboard.xlsx";
var CFG_KEY = "panelSGA_configUsuario_v1";
var CFG_RUTA_KEY = "panelSGA_rutaExcel_v1";
var CFG_PASS_KEY = "panelSGA_passHash_v1";
var CFG_UNLOCK_KEY = "panelSGA_desbloqueado_v1";
var CFG_DATASET_KEY = "panelSGA_dataset_v1";
var CFG_UI_KEY = "panelSGA_ui_v1";
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
function metaDefaultVector(cat) {
	const base = {
		factorMejora: .05,
		efMetaFallback: 1,
		unidad: {
			Energia: "kWh",
			Agua: "m³",
			Residuos: "kg/L",
			Combustibles: "L"
		}[cat]
	};
	if (cat === "Energia" || cat === "Agua") base.pctMeta = 10;
	if (cat === "Residuos" || cat === "Combustibles") base.volMeta = 1e3;
	return base;
}
function construirMetasSGA(plantas) {
	const flujosPorVector = {
		Energia: ["Consumo CFE", "Solar"],
		Agua: ["Red", "Recup"],
		Residuos: [
			"Sólidos",
			"Líquidos",
			"Biológicos"
		]
	};
	const out = {};
	for (const p of plantas) {
		out[p.id] = {};
		Object.keys(flujosPorVector).forEach((cat) => {
			if (!flujosPorVector[cat].some((f) => p.flujos[f])) return;
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
function emptyYear() {
	return {
		produccion: Array(12).fill(0),
		Energia: {
			stacked: true,
			subtitulo: "Meta: % generación limpia",
			principal: [{
				l: "Consumo CFE",
				d: Array(12).fill(0),
				c: "#C2410C"
			}, {
				l: "Solar",
				d: Array(12).fill(0),
				c: "#0E7C86"
			}]
		},
		Agua: {
			stacked: true,
			subtitulo: "Meta: % recuperación hídrica",
			principal: [{
				l: "Red",
				d: Array(12).fill(0),
				c: "#017ACB"
			}, {
				l: "Recup",
				d: Array(12).fill(0),
				c: "#38BDF8"
			}]
		},
		Residuos: {
			stacked: false,
			subtitulo: "Generación por flujo",
			principal: [
				{
					l: "Sólidos",
					d: Array(12).fill(0),
					c: "#B45309"
				},
				{
					l: "Líquidos",
					d: Array(12).fill(0),
					c: "#5B7088"
				},
				{
					l: "Biológicos",
					d: Array(12).fill(0),
					c: "#B91C1C"
				}
			]
		},
		Combustibles: {
			stacked: false,
			subtitulo: "Consumo de hidrocarburos",
			principal: [
				{
					l: "Gasolina",
					d: Array(12).fill(0),
					c: "#EA580C"
				},
				{
					l: "Diesel",
					d: Array(12).fill(0),
					c: "#334155"
				},
				{
					l: "Gas LP",
					d: Array(12).fill(0),
					c: "#0284C7"
				}
			]
		}
	};
}
function plantaPorId(plantas, id) {
	return plantas.find((p) => p.id === id);
}
function plantaTieneVector(p, cat) {
	if (!p) return false;
	if (cat === "Combustibles") return !!p.vectores.Combustibles;
	return Object.keys(VECTOR_META[cat].flujos).some((f) => p.flujos[f]);
}
function flujosDePlantaVector(p, cat) {
	if (!p) return [];
	if (cat === "Combustibles") return p.vectores.Combustibles ? Object.keys(VECTOR_META[cat].flujos) : [];
	return Object.keys(VECTOR_META[cat].flujos).filter((f) => p.flujos[f]);
}
function primerVectorDisponible(p) {
	return VECTORES$1.find((c) => plantaTieneVector(p, c)) ?? "Energia";
}
function hashSimple(str) {
	let h = 0;
	for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
	return h.toString(36);
}
function currentQuarter() {
	return `Q${Math.floor((/* @__PURE__ */ new Date()).getMonth() / 3) + 1}`;
}
function limitesPeriodo(filtro) {
	if (filtro === "Q1") return {
		s: 0,
		e: 3
	};
	if (filtro === "Q2") return {
		s: 3,
		e: 6
	};
	if (filtro === "Q3") return {
		s: 6,
		e: 9
	};
	if (filtro === "Q4") return {
		s: 9,
		e: 12
	};
	return {
		s: 0,
		e: 12
	};
}
var ALL_MESES = [
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
	"Dic"
];
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function round(n, d = 0) {
	const f = 10 ** d;
	return Math.round(n * f) / f;
}
var SPECS = [
	{
		id: "PP",
		prodBase: 92e3,
		cfe: 21e4,
		solar: 38e3,
		red: 1180,
		recup: 520,
		solidos: 3200,
		liquidos: 860,
		bio: 140,
		gasolina: 2800,
		diesel: 6400,
		gas: 1600,
		fuels: true
	},
	{
		id: "PA",
		prodBase: 41e3,
		cfe: 18e3,
		solar: 42e3,
		red: 640,
		recup: 0,
		solidos: 1800,
		liquidos: 420,
		bio: 0,
		gasolina: 0,
		diesel: 0,
		gas: 0,
		fuels: false
	},
	{
		id: "Diagnostico",
		prodBase: 6400,
		cfe: 28e3,
		solar: 9e3,
		red: 210,
		recup: 0,
		solidos: 0,
		liquidos: 0,
		bio: 180,
		gasolina: 0,
		diesel: 0,
		gas: 0,
		fuels: false
	}
];
var YEARS = [
	2023,
	2024,
	2025,
	2026
];
function seasonal(month, amp) {
	return Math.sin((month - 2) / 12 * Math.PI * 2) * amp;
}
function spike(planta, year, month, vector) {
	if (planta === "PP" && year === 2025 && month === 2 && vector === "cfe") return .42;
	if (planta === "PA" && year === 2024 && month === 5 && vector === "red") return .55;
	if (planta === "Diagnostico" && year === 2025 && month === 10 && vector === "bio") return .7;
	if (planta === "PP" && year === 2026 && month === 6 && vector === "diesel") return .35;
	return 0;
}
function buildDemoRows(now = /* @__PURE__ */ new Date()) {
	const rng = mulberry32(20260901);
	const maxMonth2026 = now.getFullYear() > 2026 ? 11 : now.getFullYear() < 2026 ? -1 : now.getMonth();
	const Produccion = [];
	const Energia = [];
	const Agua = [];
	const Residuos = [];
	const Combustibles = [];
	for (const spec of SPECS) YEARS.forEach((year, yi) => {
		for (let m = 0; m < 12; m++) {
			if (year === 2026 && m > maxMonth2026) continue;
			const trend = 1 - yi * .025;
			const noise = () => (rng() - .5) * .08;
			const prod = spec.prodBase * (1 + seasonal(m, spec.id === "Diagnostico" ? .08 : .12) + noise()) * (1 + yi * .03);
			const mes = ALL_MESES[m];
			Produccion.push({
				Planta: spec.id,
				Año: year,
				Mes: mes,
				Pzas_Producidas: Math.max(0, Math.round(prod))
			});
			const solarShare = .12 + yi * .04 + (spec.id === "PA" ? .45 : 0);
			const cfe = spec.cfe * trend * (1 + seasonal(m, .1) + noise() + spike(spec.id, year, m, "cfe"));
			const solar = spec.solar * (1 + solarShare * .15) * (1 + seasonal(m, .18) + noise());
			Energia.push({
				Planta: spec.id,
				Año: year,
				Mes: mes,
				Consumo_CFE_kWh: Math.max(0, round(cfe)),
				Generacion_Solar_kWh: Math.max(0, round(solar))
			});
			const red = spec.red * trend * (1 + seasonal(m, .14) + noise() + spike(spec.id, year, m, "red"));
			const recup = spec.recup * (1 + yi * .04) * (1 + seasonal(m, .1) + noise());
			Agua.push({
				Planta: spec.id,
				Año: year,
				Mes: mes,
				Agua_Consumida_m3: Math.max(0, round(red, 1)),
				Agua_Recuperada_m3: Math.max(0, round(recup, 1))
			});
			Residuos.push({
				Planta: spec.id,
				Año: year,
				Mes: mes,
				Peligrosos_Solidos_kg: Math.max(0, round(spec.solidos * (1 + seasonal(m, .08) + noise()))),
				Peligrosos_Liquidos_Lts: Math.max(0, round(spec.liquidos * (1 + seasonal(m, .1) + noise()), 1)),
				Bio_Infecciosos_kg: Math.max(0, round(spec.bio * (1 + seasonal(m, .12) + noise() + spike(spec.id, year, m, "bio")), 1))
			});
			if (spec.fuels) Combustibles.push({
				Planta: spec.id,
				Año: year,
				Mes: mes,
				Gasolina_Lts: Math.max(0, round(spec.gasolina * (1 + seasonal(m, .06) + noise()))),
				Diesel_Lts: Math.max(0, round(spec.diesel * trend * (1 + seasonal(m, .09) + noise() + spike(spec.id, year, m, "diesel")))),
				Gas_Lts: Math.max(0, round(spec.gas * (1 + seasonal(m, .05) + noise())))
			});
		}
	});
	return {
		Produccion,
		Energia,
		Agua,
		Residuos,
		Combustibles
	};
}
var REQUIRED_SHEETS = [
	"Produccion",
	"Energia",
	"Agua",
	"Residuos",
	"Combustibles"
];
var MAPPING = {
	Energia: ["Consumo_CFE_kWh", "Generacion_Solar_kWh"],
	Agua: ["Agua_Consumida_m3", "Agua_Recuperada_m3"],
	Residuos: [
		"Peligrosos_Solidos_kg",
		"Peligrosos_Liquidos_Lts",
		"Bio_Infecciosos_kg"
	],
	Combustibles: [
		"Gasolina_Lts",
		"Diesel_Lts",
		"Gas_Lts"
	]
};
function yearOf(r) {
	const v = r["Año"] ?? r.Anio ?? r.Year ?? r.anio;
	const n = Number(v);
	return Number.isFinite(n) ? n : (/* @__PURE__ */ new Date()).getFullYear();
}
function plantaOf(r) {
	return String(r.Planta ?? r.planta ?? "").trim();
}
function mesIndex(r) {
	const key = String(r.Mes ?? r.mes ?? "").substring(0, 3);
	return ALL_MESES.indexOf(key);
}
function num(v) {
	const n = parseFloat(String(v ?? ""));
	return Number.isFinite(n) ? n : 0;
}
function ingestRows(sheets, source, plantas, meta) {
	const bd = {};
	const years = /* @__PURE__ */ new Set();
	const plantsFound = /* @__PURE__ */ new Set();
	const plantsUnknown = /* @__PURE__ */ new Set();
	let invalidMonths = 0;
	const notes = [];
	const ensure = (planta, anio) => {
		if (!bd[planta]) bd[planta] = {};
		if (!bd[planta][anio]) bd[planta][anio] = emptyYear();
	};
	const sheetReport = [];
	const missingSheets = [];
	for (const name of REQUIRED_SHEETS) {
		const rows = sheets[name];
		if (!rows || rows.length === 0) {
			missingSheets.push(name);
			sheetReport.push({
				name,
				rows: 0,
				ok: false
			});
		} else sheetReport.push({
			name,
			rows: rows.length,
			ok: true
		});
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
	Object.keys(MAPPING).forEach((cat) => {
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
	if (plantsUnknown.size) notes.push(`Plantas en el Excel que no están en el catálogo (no se verán hasta agregarlas en Parámetros): ${[...plantsUnknown].join(", ")}.`);
	if (invalidMonths) notes.push(`${invalidMonths} filas con mes no reconocido (usa Ene, Feb, Mar…).`);
	if (missingSheets.length) notes.push(`Hojas faltantes o vacías: ${missingSheets.join(", ")}.`);
	if (!prod.length) notes.push("Sin hoja de Producción: las intensidades no se podrán calcular.");
	const knownIds = new Set(plantas.map((p) => p.id));
	for (const id of knownIds) if (!plantsFound.has(id)) notes.push(`El catálogo tiene "${id}" pero el Excel no trae filas para esa planta.`);
	return {
		bd,
		report: {
			source,
			url: meta?.url,
			fileName: meta?.fileName,
			sheets: sheetReport,
			missingSheets,
			plantsFound: [...plantsFound],
			plantsUnknown: [...plantsUnknown],
			years: [...years].sort((a, b) => b - a),
			invalidMonths,
			loadedAt: (/* @__PURE__ */ new Date()).toISOString(),
			notes
		}
	};
}
async function parseExcelBuffer(buffer, plantas, source, meta) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const data = new Uint8Array(buffer);
	const workbook = XLSX.read(data, { type: "array" });
	const sheets = {};
	for (const name of REQUIRED_SHEETS) if (workbook.Sheets[name]) sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
	return ingestRows(sheets, source, plantas, meta);
}
async function workbookFromRows(sheets) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const wb = XLSX.utils.book_new();
	for (const name of REQUIRED_SHEETS) {
		const rows = sheets[name] ?? [];
		const ws = XLSX.utils.json_to_sheet(rows);
		XLSX.utils.book_append_sheet(wb, ws, name);
	}
	return wb;
}
function downloadWorkbook(wb, filename) {
	import("../_libs/xlsx.mjs").then((n) => n.t).then((XLSX) => {
		XLSX.writeFile(wb, filename);
	});
}
function mean(arr) {
	if (!arr.length) return 0;
	return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function stdDev(arr) {
	if (arr.length < 2) return 0;
	const m = mean(arr);
	const sq = arr.reduce((a, b) => a + (b - m) ** 2, 0);
	return Math.sqrt(sq / arr.length);
}
function percentil(vals, q) {
	if (!vals.length) return 0;
	const a = [...vals].sort((x, y) => x - y);
	const idx = (a.length - 1) * q;
	const lo = Math.floor(idx);
	const hi = Math.ceil(idx);
	return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (idx - lo);
}
function regresionLineal(x, y) {
	const n = x.length;
	const sumX = x.reduce((a, b) => a + b, 0);
	const sumY = y.reduce((a, b) => a + b, 0);
	const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
	const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
	const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
	const den = n * sumX2 - sumX * sumX;
	const slope = den === 0 ? 0 : (n * sumXY - sumX * sumY) / den;
	const intercept = n === 0 ? 0 : (sumY - slope * sumX) / n;
	const rDen = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
	return {
		slope,
		intercept,
		r: rDen === 0 ? 0 : (n * sumXY - sumX * sumY) / rDen
	};
}
function getDatosAnio(bd, planta, anio) {
	return bd[planta]?.[anio];
}
function slicePeriodo(arr, periodo) {
	const { s, e } = limitesPeriodo(periodo);
	return arr.slice(s, e);
}
function sum(arr) {
	return arr.reduce((a, b) => a + b, 0);
}
function totalVectorMes(d, flujos, mes) {
	return d.principal.filter((x) => flujos.includes(x.l)).reduce((a, x) => a + (x.d[mes] || 0), 0);
}
function totalVectorRango(d, flujos, s, e) {
	let t = 0;
	for (let i = s; i < e; i++) t += totalVectorMes(d, flujos, i);
	return t;
}
function flujoLimpio(planta, cat) {
	if (cat === "Energia") return "Solar";
	if (cat === "Agua" && planta.flujos.Recup) return "Recup";
	return null;
}
function aniosBase(bd, planta, anioActual) {
	if (!bd[planta]) return [];
	const todos = Object.keys(bd[planta]).map(Number).sort((a, b) => a - b);
	const previos = todos.filter((a) => a < anioActual);
	return previos.length > 0 ? previos : todos;
}
function serieBaseMetas(ctx, plantaId, cat) {
	const p = plantaPorId(ctx.plantas, plantaId);
	const flujos = flujosDePlantaVector(p, cat);
	const limpio = p ? flujoLimpio(p, cat) : null;
	const anios = aniosBase(ctx.bd, plantaId, ctx.anioActual);
	const intens = [];
	const vols = [];
	const pctAnual = [];
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
		if (limpio && sumTotal > 0) pctAnual.push({
			anio,
			pct: sumLimpio / sumTotal * 100
		});
	}
	return {
		intens,
		vols,
		pctAnual,
		anios
	};
}
function calcularMetasAuto(ctx, planta, cat) {
	const s = serieBaseMetas(ctx, planta, cat);
	const n = s.intens.length;
	if (n < 3) return {
		suficiente: false,
		n,
		anios: s.anios
	};
	const media = mean(s.intens);
	const p25 = percentil(s.intens, .25);
	const p50 = percentil(s.intens, .5);
	const p75 = percentil(s.intens, .75);
	const p90 = percentil(s.intens, .9);
	const sigma = stdDev(s.intens);
	const cv = media > 0 ? sigma / media : 0;
	let factorSug = media > 0 ? (media - p25) / media : .03;
	factorSug = Math.min(.15, Math.max(.02, factorSug));
	if (n < 6) factorSug = .03;
	const key = `${planta}|${cat}`;
	const factor = ctx.metasOverride[key] !== void 0 ? ctx.metasOverride[key] : factorSug;
	const metaObjetivo = media * (1 - factor);
	const limiteMax = Math.max(metaObjetivo, p75 * (1 - factor));
	let volMeta = null;
	if (s.vols.length >= 3) {
		const vMedia = mean(s.vols);
		const vSigma = stdDev(s.vols);
		volMeta = (ctx.rigorLimite === "P75" ? percentil(s.vols, .75) : ctx.rigorLimite === "P90" ? percentil(s.vols, .9) : vMedia + vSigma) * (1 - factor);
	}
	let pctMeta = null;
	let pctMejorAnio = null;
	if (s.pctAnual.length > 0) {
		const mejor = s.pctAnual.reduce((a, b) => b.pct > a.pct ? b : a);
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
		umbralCritico: media + 2 * sigma
	};
}
function calcularLimiteDinamico(ctx, planta, cat, factorMejora, fallback) {
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
	if (historia && prodTotal > 0) return consTotal / prodTotal * (1 - factorMejora);
	return fallback;
}
function obtenerMetaEfectiva(ctx, planta, cat) {
	const base = ctx.metasSGA[planta]?.[cat];
	if (!base) return {
		auto: false,
		efMeta: 1,
		metaObjetivo: 1,
		origen: "Sin configuración"
	};
	if (ctx.metasModo === "AUTO") {
		const a = calcularMetasAuto(ctx, planta, cat);
		if (a.suficiente && a.efMeta !== void 0 && a.metaObjetivo !== void 0) return {
			auto: true,
			efMeta: a.efMeta,
			metaObjetivo: a.metaObjetivo,
			volMeta: base.volMeta !== void 0 ? a.volMeta : void 0,
			pctMeta: base.pctMeta !== void 0 && a.pctMeta !== null ? a.pctMeta : void 0,
			origen: `Base ${a.anios[0]}–${a.anios[a.anios.length - 1]} (${a.n} meses) · mejora ${((a.factor ?? 0) * 100).toFixed(0)}%`,
			stats: a
		};
		return {
			auto: false,
			efMeta: base.efMetaFallback,
			metaObjetivo: base.efMetaFallback,
			origen: "Valor fijo · sin base histórica suficiente"
		};
	}
	const ef = calcularLimiteDinamico(ctx, planta, cat, base.factorMejora, base.efMetaFallback);
	return {
		auto: ef !== base.efMetaFallback,
		efMeta: ef,
		metaObjetivo: ef,
		volMeta: base.volMeta,
		pctMeta: base.pctMeta,
		origen: ef === base.efMetaFallback ? "Valor fijo (manual)" : `Manual · promedio histórico −${(base.factorMejora * 100).toFixed(0)}%`
	};
}
function calcularCO2(ctx, planta, categoria, s, e, anio = ctx.anioActual) {
	const datos = getDatosAnio(ctx.bd, planta, anio);
	if (!datos) return 0;
	const d = datos[categoria].principal;
	let t = 0;
	if (categoria === "Energia") {
		const val = d.find((x) => x.l === "Consumo CFE");
		if (val) t += sum(val.d.slice(s, e)) * ctx.FE.CFE / 1e3;
	} else if (categoria === "Agua") {
		const val = d.find((x) => x.l === "Red");
		if (val) t += sum(val.d.slice(s, e)) * ctx.FE.AguaRed / 1e3;
	} else if (categoria === "Residuos") for (const x of d) {
		const factor = x.l === "Sólidos" ? ctx.FE.Solidos : x.l === "Líquidos" ? ctx.FE.Liquidos : x.l === "Biológicos" ? ctx.FE.Biologicos : 0;
		t += sum(x.d.slice(s, e)) * factor / 1e3;
	}
	else if (categoria === "Combustibles") for (const x of d) {
		const key = x.l.replace(" ", "");
		const factor = ctx.FE[key] || 0;
		t += sum(x.d.slice(s, e)) * factor / 1e3;
	}
	return t;
}
function intensidadAnio(ctx, planta, cat, anio) {
	const d = ctx.bd[planta]?.[anio];
	if (!d) return null;
	const flujos = flujosDePlantaVector(plantaPorId(ctx.plantas, planta), cat);
	const cons = totalVectorRango(d[cat], flujos, 0, 12);
	const prod = sum(d.produccion);
	if (prod <= 0 || cons <= 0) return null;
	return cons / prod;
}
function recSerie(ctx, planta, cat, flujo, opts) {
	const out = [];
	if (!ctx.bd[planta]) return out;
	const p = plantaPorId(ctx.plantas, planta);
	const lim = limitesPeriodo(opts.periodo);
	const years = Object.keys(ctx.bd[planta]).map(Number).sort((a, b) => a - b);
	for (const anio of years) {
		const dAnio = ctx.bd[planta][anio];
		if (!dAnio?.[cat]) continue;
		let arr;
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
			out.push({
				val: v,
				mes: [
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
					"Dic"
				][i],
				anio
			});
		}
	}
	return out;
}
function recStats(serie) {
	if (!serie.length) return null;
	let min = serie[0];
	let max = serie[0];
	let s = 0;
	for (const o of serie) {
		if (o.val < min.val) min = o;
		if (o.val > max.val) max = o;
		s += o.val;
	}
	return {
		min,
		max,
		avg: s / serie.length,
		n: serie.length,
		ultimo: serie[serie.length - 1],
		spread: max.val - min.val
	};
}
function flujoPrincipalResiduos(bd, planta) {
	const candidatos = [
		"Sólidos",
		"Líquidos",
		"Biológicos"
	];
	if (!bd[planta]) return "Sólidos";
	for (const flujo of candidatos) for (const anio of Object.keys(bd[planta])) {
		const ds = bd[planta][Number(anio)].Residuos.principal.find((d) => d.l === flujo);
		if (ds && ds.d.some((v) => v > 0)) return flujo;
	}
	return "Sólidos";
}
function inteligenciaSerie(ctx, planta, cat) {
	const labels = [];
	const prodArr = [];
	const consArr = [];
	const meses = [
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
		"Dic"
	];
	const targetLabel = cat === "Energia" ? "Consumo CFE" : cat === "Agua" ? "Red" : cat === "Residuos" ? flujoPrincipalResiduos(ctx.bd, planta) : "Gasolina";
	const anios = Object.keys(ctx.bd[planta] || {}).map(Number).sort((a, b) => a - b);
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
	return {
		labels,
		prodArr,
		consArr,
		effArr,
		mean: m,
		ucl,
		lcl,
		anomalias: effArr.map((val, i) => ({
			val,
			i,
			out: val > ucl || val < lcl
		})).filter((x) => x.out),
		reg: regresionLineal(prodArr, consArr),
		targetLabel,
		unidad: ctx.metasSGA[planta]?.[cat]?.unidad ?? VECTOR_META[cat].unidad
	};
}
function aniosDisponibles(bd) {
	const set = /* @__PURE__ */ new Set();
	for (const p of Object.keys(bd)) for (const a of Object.keys(bd[p])) set.add(Number(a));
	return [...set].sort((a, b) => b - a);
}
function vectorTotalesPeriodo(ctx, planta, cat, anio, periodo) {
	const d = getDatosAnio(ctx.bd, planta, anio);
	const p = plantaPorId(ctx.plantas, planta);
	if (!d || !p) return {
		cons: 0,
		prod: 0,
		ig: 0,
		flujos: []
	};
	const { s, e } = limitesPeriodo(periodo);
	const flujosVis = flujosDePlantaVector(p, cat);
	const flujos = d[cat].principal.filter((ds) => flujosVis.includes(ds.l)).map((ds) => ({
		l: ds.l,
		data: ds.d.slice(s, e),
		c: ds.c
	})).filter((ds) => ds.data.some((v) => v > 0));
	const cons = flujos.reduce((a, f) => a + sum(f.data), 0);
	const prod = sum(d.produccion.slice(s, e));
	return {
		cons,
		prod,
		ig: prod > 0 ? cons / prod : 0,
		flujos,
		s,
		e,
		meses: slicePeriodo([
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
			"Dic"
		], periodo),
		prodMes: d.produccion.slice(s, e)
	};
}
var DEFAULT_PLANTAS = clone(PLANTAS_SEED);
var DEFAULT_FE = clone(FE_DEFAULT);
function readJson(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function writeJson(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function persistUi(s) {
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
		rigorLimite: s.rigorLimite
	});
}
function seedDataset(plantas) {
	const { bd, report } = ingestRows(buildDemoRows(), "demo", plantas, { fileName: "demostración" });
	return {
		bd,
		report: {
			...report,
			loadedAt: ""
		}
	};
}
var SEEDED_PLANTAS = clone(DEFAULT_PLANTAS);
var SEEDED = seedDataset(SEEDED_PLANTAS);
var SEEDED_YEARS = aniosDisponibles(SEEDED.bd);
var useSga = create((set, get) => ({
	ready: true,
	loading: false,
	error: null,
	bd: SEEDED.bd,
	plantas: SEEDED_PLANTAS,
	metasSGA: construirMetasSGA(SEEDED_PLANTAS),
	FE: clone(DEFAULT_FE),
	anioActual: SEEDED_YEARS[0] ?? (/* @__PURE__ */ new Date()).getFullYear(),
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
	rec: {
		vector: "ALL",
		planta: "ALL",
		metrica: "ABS",
		periodo: "ALL",
		ceros: false
	},
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
			metasOverride: s.metasOverride
		};
	},
	persistConfig: () => {
		const s = get();
		writeJson(CFG_KEY, {
			metasSGA: s.metasSGA,
			FE: s.FE,
			plantas: s.plantas
		});
	},
	applyDataset: (bd, report) => {
		const years = aniosDisponibles(bd);
		const s = get();
		set({
			bd,
			report,
			anioActual: years[0] ?? s.anioActual,
			loading: false,
			ready: true,
			error: null
		});
		try {
			localStorage.setItem(CFG_DATASET_KEY, JSON.stringify({
				bd,
				report: {
					...report,
					source: "cache"
				}
			}));
		} catch {}
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
			const { bd, report } = await parseExcelBuffer(await resp.arrayBuffer(), get().plantas, "server", {
				url: ruta,
				fileName: ruta
			});
			get().applyDataset(bd, report);
			return true;
		} catch {
			return false;
		}
	},
	loadFromFile: async (file) => {
		set({
			loading: true,
			error: null
		});
		try {
			const { bd, report } = await parseExcelBuffer(await file.arrayBuffer(), get().plantas, "upload", { fileName: file.name });
			get().applyDataset(bd, report);
		} catch (err) {
			set({
				loading: false,
				error: err instanceof Error ? err.message : "No se pudo leer el Excel. Revisa hojas y columnas."
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
			const guardado = readJson(CFG_KEY, null);
			if (guardado?.plantas?.length) plantas = guardado.plantas;
			metasSGA = construirMetasSGA(plantas);
			if (guardado?.metasSGA) for (const p of Object.keys(guardado.metasSGA)) {
				if (!metasSGA[p]) continue;
				for (const c of Object.keys(guardado.metasSGA[p] ?? {})) {
					const cat = c;
					if (metasSGA[p][cat] && guardado.metasSGA[p]?.[cat]) Object.assign(metasSGA[p][cat], guardado.metasSGA[p][cat]);
				}
			}
			if (guardado?.FE) Object.assign(FE, guardado.FE);
			rutaExcel = localStorage.getItem("panelSGA_rutaExcel_v1") || "Base_de_Datos_Dashboard.xlsx";
			unlocked = localStorage.getItem(CFG_UNLOCK_KEY) === "1";
		} catch {}
		const ui = readJson(CFG_UI_KEY, null);
		set({
			plantas,
			FE,
			metasSGA,
			rutaExcel,
			unlocked,
			plantaActual: ui?.plantaActual && plantaPorId(plantas, ui.plantaActual) ? ui.plantaActual : plantas[0].id,
			catActual: ui?.catActual ?? "Energia",
			filtroTemporal: ui?.filtroTemporal ?? currentQuarter(),
			vista: ui?.vista ?? "home",
			compararPlantas: ui?.compararPlantas ?? false,
			yoy: ui?.yoy ?? true,
			metricaVector: ui?.metricaVector ?? "ABS",
			rec: ui?.rec ?? {
				vector: "ALL",
				planta: "ALL",
				metrica: "ABS",
				periodo: "ALL",
				ceros: false
			},
			metasModo: ui?.metasModo ?? "AUTO",
			rigorLimite: ui?.rigorLimite ?? "SIGMA"
		});
		if (await get().loadFromUrl(rutaExcel)) return;
		try {
			const cached = localStorage.getItem(CFG_DATASET_KEY);
			if (cached) {
				const parsed = JSON.parse(cached);
				if (parsed?.bd) {
					get().applyDataset(parsed.bd, {
						...parsed.report,
						source: "cache"
					});
					return;
				}
			}
		} catch {}
		get().loadDemo();
	},
	setVista: (vista) => {
		if ([
			"huella",
			"inteligencia",
			"records",
			"metas",
			"config"
		].includes(vista) && !get().unlocked) return;
		set({
			vista,
			mesDona: "ALL"
		});
		persistUi(get());
	},
	setPlanta: (id) => {
		const p = plantaPorId(get().plantas, id);
		if (!p) return;
		let cat = get().catActual;
		if (!plantaTieneVector(p, cat)) cat = primerVectorDisponible(p);
		set({
			plantaActual: id,
			catActual: cat
		});
		persistUi(get());
	},
	setCategoria: (c) => {
		set({
			catActual: c,
			vista: "vector",
			mesDona: "ALL"
		});
		persistUi(get());
	},
	setAnio: (y) => set({ anioActual: y }),
	setPeriodo: (p) => {
		set({
			filtroTemporal: p,
			mesDona: "ALL"
		});
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
		let propio = null;
		try {
			propio = localStorage.getItem(CFG_PASS_KEY);
		} catch {
			propio = null;
		}
		if (h === "zizh" || propio && h === propio) {
			try {
				localStorage.setItem(CFG_UNLOCK_KEY, "1");
			} catch {}
			set({ unlocked: true });
			return true;
		}
		return false;
	},
	lock: () => {
		try {
			localStorage.removeItem(CFG_UNLOCK_KEY);
		} catch {}
		set({
			unlocked: false,
			vista: "home"
		});
	},
	setOwnPassword: (code) => {
		try {
			localStorage.setItem(CFG_PASS_KEY, hashSimple(code));
		} catch {}
		set({ unlocked: true });
	},
	clearOwnPassword: () => {
		try {
			localStorage.removeItem(CFG_PASS_KEY);
		} catch {}
	},
	setPlantas: (plantas) => {
		const prev = get().metasSGA;
		const metasSGA = construirMetasSGA(plantas);
		for (const p of Object.keys(prev)) {
			if (!metasSGA[p]) continue;
			for (const c of Object.keys(prev[p] ?? {})) {
				const cat = c;
				if (metasSGA[p][cat] && prev[p][cat]) Object.assign(metasSGA[p][cat], prev[p][cat]);
			}
		}
		let { plantaActual, catActual } = get();
		if (!plantaPorId(plantas, plantaActual)) plantaActual = plantas[0]?.id ?? plantaActual;
		const p = plantaPorId(plantas, plantaActual);
		if (p && !plantaTieneVector(p, catActual)) catActual = primerVectorDisponible(p);
		set({
			plantas,
			metasSGA,
			plantaActual,
			catActual
		});
		get().persistConfig();
	},
	setMetasCampo: (planta, cat, campo, valor) => {
		const metasSGA = clone(get().metasSGA);
		if (!metasSGA[planta]?.[cat]) return;
		metasSGA[planta][cat][campo] = valor;
		set({ metasSGA });
		get().persistConfig();
	},
	setFE: (clave, valor) => {
		set({ FE: {
			...get().FE,
			[clave]: valor
		} });
		get().persistConfig();
	},
	setRutaExcel: (ruta) => {
		const limpia = ruta.trim() || "Base_de_Datos_Dashboard.xlsx";
		try {
			localStorage.setItem(CFG_RUTA_KEY, limpia);
		} catch {}
		set({ rutaExcel: limpia });
	},
	restoreFactory: () => {
		const plantas = clone(DEFAULT_PLANTAS);
		set({
			plantas,
			metasSGA: construirMetasSGA(plantas),
			FE: clone(DEFAULT_FE),
			metasOverride: {},
			plantaActual: plantas[0].id,
			rutaExcel: AUTO_LOAD_URL_DEFAULT
		});
		try {
			localStorage.removeItem(CFG_KEY);
			localStorage.removeItem(CFG_RUTA_KEY);
		} catch {}
	},
	importConfig: (payload) => {
		const guardado = payload;
		let plantas = get().plantas;
		if (guardado.plantas?.length) plantas = guardado.plantas;
		const metasSGA = construirMetasSGA(plantas);
		if (guardado.metasSGA) for (const p of Object.keys(guardado.metasSGA)) {
			if (!metasSGA[p]) continue;
			for (const c of Object.keys(guardado.metasSGA[p] ?? {})) {
				const cat = c;
				if (metasSGA[p][cat] && guardado.metasSGA[p]?.[cat]) Object.assign(metasSGA[p][cat], guardado.metasSGA[p][cat]);
			}
		}
		const FE = {
			...get().FE,
			...guardado.FE ?? {}
		};
		if (guardado.rutaExcel) get().setRutaExcel(guardado.rutaExcel);
		set({
			plantas,
			metasSGA,
			FE,
			plantaActual: plantaPorId(plantas, get().plantaActual) ? get().plantaActual : plantas[0].id
		});
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
		set({ metasOverride: {
			...get().metasOverride,
			[`${planta}|${cat}`]: v
		} });
		const metasSGA = clone(get().metasSGA);
		if (metasSGA[planta]?.[cat]) metasSGA[planta][cat].factorMejora = v;
		set({ metasSGA });
	},
	clearOverrides: () => set({ metasOverride: {} }),
	setRec: (patch) => {
		set({ rec: {
			...get().rec,
			...patch
		} });
		persistUi(get());
	}
}));
function exportConfigPayload() {
	const s = useSga.getState();
	return {
		metasSGA: s.metasSGA,
		FE: s.FE,
		plantas: s.plantas,
		rutaExcel: s.rutaExcel,
		exportado: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function useEngineCtx() {
	return {
		bd: useSga((s) => s.bd),
		plantas: useSga((s) => s.plantas),
		metasSGA: useSga((s) => s.metasSGA),
		FE: useSga((s) => s.FE),
		anioActual: useSga((s) => s.anioActual),
		metasModo: useSga((s) => s.metasModo),
		rigorLimite: useSga((s) => s.rigorLimite),
		metasOverride: useSga((s) => s.metasOverride)
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			default: "bg-navy text-white hover:bg-navy-2 shadow-sm",
			teal: "bg-teal text-white hover:opacity-90",
			ghost: "bg-white text-ink border border-line hover:bg-paper",
			subtle: "bg-white/10 text-white border border-white/15 hover:bg-white/16",
			danger: "bg-alert text-white hover:opacity-90",
			link: "text-blue underline-offset-4 hover:underline px-0"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Sheet = Dialog$1;
function SheetContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-navy/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
		className: cn("fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] overflow-y-auto bg-navy p-5 text-white shadow-xl", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left", className),
		...props,
		children
	})] });
}
var ICONS$1 = {
	factory: Factory,
	sprout: Sprout,
	flask: FlaskConical,
	building: Building2
};
var VECTORES = [
	{
		id: "Energia",
		label: "Energía",
		icon: Zap
	},
	{
		id: "Agua",
		label: "Agua",
		icon: Droplets
	},
	{
		id: "Residuos",
		label: "Residuos",
		icon: Recycle
	},
	{
		id: "Combustibles",
		label: "Combustibles",
		icon: Fuel
	}
];
function NavBtn({ active, onClick, children, dim }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-center gap-2.5 rounded-[10px] px-3.5 py-3 text-left text-[0.9rem] font-semibold text-slate-300 transition-colors hover:bg-white/8", active && "rounded-l-none border-l-4 border-[#0E9AE0] bg-linear-to-r from-[#017ACB]/35 to-[#017ACB]/8 text-white", dim && "opacity-40"),
		children
	});
}
function SidebarBody({ onNavigate }) {
	const plantas = useSga((s) => s.plantas);
	const plantaActual = useSga((s) => s.plantaActual);
	const catActual = useSga((s) => s.catActual);
	const vista = useSga((s) => s.vista);
	const unlocked = useSga((s) => s.unlocked);
	const setPlanta = useSga((s) => s.setPlanta);
	const setCategoria = useSga((s) => s.setCategoria);
	const setVista = useSga((s) => s.setVista);
	const lock = useSga((s) => s.lock);
	const planta = plantas.find((p) => p.id === plantaActual);
	const corporateDim = vista === "huella" || vista === "records" || vista === "metas" || vista === "config";
	const go = (fn) => {
		fn();
		onNavigate?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center gap-3 border-b border-white/10 pb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-linear-to-br from-teal to-blue shadow-[0_4px_14px_rgba(1,122,203,.4)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-5 text-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[1.05rem] leading-tight font-extrabold text-white",
				children: "Panel SGA"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[0.72rem] font-semibold tracking-wide text-[#8FB4D6]",
				children: "Lapisa · Sustentabilidad"
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Ubicación",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex flex-col gap-1.5 rounded-[14px] bg-black/20 p-2", corporateDim && "opacity-40"),
				children: plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantBtn, {
					p,
					active: p.id === plantaActual && !corporateDim,
					onClick: () => go(() => setPlanta(p.id))
				}, p.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Vectores",
			children: VECTORES.map((v) => {
				if (planta && !plantaTieneVector(planta, v.id)) return null;
				const Icon = v.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "vector" && catActual === v.id,
					onClick: () => go(() => setCategoria(v.id)),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
						" ",
						v.label
					]
				}, v.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Gestión",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
				active: vista === "home",
				onClick: () => go(() => setVista("home")),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4" }), " Resumen ejecutivo"]
			}), !unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
				onClick: () => go(() => window.dispatchEvent(new Event("sga:unlock"))),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), " Desbloquear vistas"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "inteligencia",
					onClick: () => go(() => setVista("inteligencia")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "size-4" }), " Inteligencia operativa"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "huella",
					onClick: () => go(() => setVista("huella")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "size-4" }), " Huella de carbono"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "records",
					onClick: () => go(() => setVista("records")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), " Máximos y mínimos"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "metas",
					onClick: () => go(() => setVista("metas")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4" }), " Metas y límites"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					active: vista === "config",
					onClick: () => go(() => setVista("config")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), " Parámetros"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBtn, {
					onClick: () => go(() => lock()),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-4" }), " Bloquear sesión"]
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-auto pt-4 text-[0.68rem] leading-4 text-[#7C93AC]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mr-1 inline size-3" }), "Las vistas corporativas se protegen con el código de edición. El Excel se busca solo en la misma carpeta del panel."]
		})
	] });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 border-l-[3px] border-blue pl-2.5 text-[0.7rem] font-bold tracking-[0.18em] text-[#7C93AC] uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-0.5",
			children
		})]
	});
}
function PlantBtn({ p, active, onClick }) {
	const Icon = ICONS$1[p.icono] ?? Building2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex items-center gap-3 rounded-[10px] border border-white/5 px-3.5 py-3 text-left text-[0.85rem] font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white", active && "translate-x-0.5 border-[#0164BD] bg-linear-to-r from-[#0E9AE0] to-[#00447A] text-white shadow-[0_6px_16px_rgba(1,122,203,.45)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
			" ",
			p.nombre
		]
	});
}
function Sidebar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "no-print relative hidden w-[280px] shrink-0 flex-col overflow-y-auto bg-[radial-gradient(circle_at_15%_-10%,rgba(1,122,203,.35),transparent_45%),linear-gradient(160deg,#00142C_0%,#012845_55%,#003A63_100%)] px-5 py-7 text-white lg:flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {})
	});
}
var TITLES = {
	home: ["Resumen ejecutivo", "Desempeño ambiental consolidado"],
	vector: ["Gestión vectorial", ""],
	huella: ["Inventario corporativo de emisiones", "Huella de carbono · Alcance 1, 2 y 3"],
	inteligencia: ["Inteligencia operativa", "Diagnóstico de eficiencia y carga basal"],
	records: ["Récords históricos", "Mínimos, máximos y tendencia interanual"],
	metas: ["Metas y límites", "Línea base histórica y umbrales vigentes"],
	config: ["Parámetros del panel", "Plantas, metas de respaldo y factores de emisión"]
};
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const vista = useSga((s) => s.vista);
	const cat = useSga((s) => s.catActual);
	const planta = useSga((s) => s.plantaActual);
	const plantas = useSga((s) => s.plantas);
	const anio = useSga((s) => s.anioActual);
	const bd = useSga((s) => s.bd);
	const periodo = useSga((s) => s.filtroTemporal);
	const setAnio = useSga((s) => s.setAnio);
	const setPeriodo = useSga((s) => s.setPeriodo);
	const years = Array.from(new Set(Object.values(bd).flatMap((p) => Object.keys(p).map(Number)))).sort((a, b) => b - a);
	const plantName = plantas.find((p) => p.id === planta)?.nombre ?? planta;
	let [title, sub] = TITLES[vista] ?? ["Panel SGA", ""];
	if (vista === "vector") {
		title = `${cat === "Energia" ? "Energía" : cat} · ${plantName}`;
		sub = `Año ${anio} · ${etiquetaPeriodo(periodo)}`;
	} else if (vista === "inteligencia") sub = `${plantName} · vector ${cat}`;
	else sub = `${sub}${sub ? " · " : ""}${anio} · ${etiquetaPeriodo(periodo)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "relative overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_88%_15%,rgba(14,124,134,.5),transparent_55%),linear-gradient(115deg,#00142C_0%,#012845_55%,#004a80_100%)] px-5 py-5 shadow-[0_10px_30px_rgba(0,20,44,.22)] sm:px-7",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "subtle",
						size: "icon",
						className: "lg:hidden",
						onClick: () => setOpen(true),
						"aria-label": "Menú",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, { onNavigate: () => setOpen(false) }) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[1.65rem] leading-tight font-extrabold tracking-tight text-white sm:text-[2rem]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-[#9FC4E4]",
					children: sub
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-2",
				children: [vista === "home" || vista === "vector" || vista === "huella" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "select-panel",
					value: anio,
					onChange: (e) => setAnio(Number(e.target.value)),
					children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: y,
						children: y
					}, y))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "select-panel",
					value: periodo,
					onChange: (e) => setPeriodo(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "Año completo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Q1",
							children: "Q1 (Ene–Mar)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Q2",
							children: "Q2 (Abr–Jun)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Q3",
							children: "Q3 (Jul–Sep)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Q4",
							children: "Q4 (Oct–Dic)"
						})
					]
				})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "subtle",
					size: "sm",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " PDF"]
				})]
			})]
		})
	});
}
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[0.7rem] font-extrabold uppercase tracking-wide", {
			ok: "bg-ok-bg text-ok border-emerald-200",
			warn: "bg-warn-bg text-warn border-amber-200",
			alert: "bg-alert-bg text-alert border-red-200",
			muted: "bg-paper text-muted border-line",
			blue: "bg-[#dbeafe] text-[#00447A] border-[#bfdbfe]"
		}[tone], className),
		...props
	});
}
var SOURCE_LABEL = {
	server: "Autocarga del servidor",
	upload: "Archivo subido",
	demo: "Datos de demostración",
	cache: "Última carga de este navegador"
};
function DataBar() {
	const report = useSga((s) => s.report);
	const loading = useSga((s) => s.loading);
	const error = useSga((s) => s.error);
	const loadFromUrl = useSga((s) => s.loadFromUrl);
	const loadFromFile = useSga((s) => s.loadFromFile);
	const loadDemo = useSga((s) => s.loadDemo);
	const ruta = useSga((s) => s.rutaExcel);
	const inputRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const onFiles = (files) => {
		const f = files?.[0];
		if (f) loadFromFile(f);
	};
	const tone = report?.source === "demo" ? "warn" : report?.notes.length ? "warn" : "ok";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-print rounded-[14px] border border-line bg-white px-4 py-3 shadow-[var(--shadow-card)]",
		onDragOver: (e) => {
			e.preventDefault();
			setDrag(true);
		},
		onDragLeave: () => setDrag(false),
		onDrop: (e) => {
			e.preventDefault();
			setDrag(false);
			onFiles(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone,
						children: report ? SOURCE_LABEL[report.source] : "Cargando"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[0.8rem] text-muted",
						children: loading ? "Buscando Excel…" : report ? `${report.plantsFound.length} plantas · ${report.years.join(", ") || "sin años"}${report.loadedAt ? " · " + new Date(report.loadedAt).toLocaleString("es-MX") : ""}` : "Sin datos"
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-alert",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: inputRef,
								type: "file",
								accept: ".xlsx",
								className: "hidden",
								suppressHydrationWarning: true,
								onChange: (e) => onFiles(e.target.files)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => inputRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " Subir Excel"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									loadFromUrl();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Recargar"]
							}),
							report?.source === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[0.75rem] text-warn",
								children: [
									"No se encontró ",
									ruta,
									". Se muestran cifras de ejemplo."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setOpen((v) => !v),
								children: [report?.notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 text-warn" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-ok" }), "Calidad"]
							})
						]
					})
				]
			}),
			drag ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2 rounded-lg border border-dashed border-blue bg-[#eaf3fc] px-3 py-2 text-sm font-semibold text-blue",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderUp, { className: "size-4" }), " Suelta el consolidado .xlsx aquí"]
			}) : null,
			open && report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 border-t border-line-2 pt-3 text-[0.8rem] text-muted sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 font-bold text-navy",
					children: "Hojas"
				}), report.sheets.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					s.ok ? "✓" : "✗",
					" ",
					s.name,
					" · ",
					s.rows,
					" filas"
				] }, s.name))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 font-bold text-navy",
						children: "Notas"
					}),
					report.notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Estructura válida. Listo para comité." }) : report.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["• ", n] }, n)),
					report.source === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 font-semibold text-blue",
						onClick: () => loadDemo(),
						children: "Regenerar demostración"
					}) : null
				] })]
			}) : null
		]
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-navy/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-line bg-card p-6 shadow-[var(--shadow-lift)]", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-4 right-4 rounded-md p-1 text-muted hover:bg-paper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-bold text-navy", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-[10px] border-2 border-line bg-white px-3 text-sm font-semibold text-navy outline-none focus:border-blue", className),
		...props
	});
}
function UnlockDialog() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const tryUnlock = useSga((s) => s.tryUnlock);
	(0, import_react.useEffect)(() => {
		const on = () => setOpen(true);
		window.addEventListener("sga:unlock", on);
		return () => window.removeEventListener("sga:unlock", on);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Desbloquear gestión corporativa" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Huella, récords, metas y parámetros quedan detrás del código de edición para evitar cambios accidentales. No es un sistema de usuarios: cualquiera con el código puede editar en este navegador." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (tryUnlock(code)) {
						setOpen(false);
						setCode("");
						setErr("");
					} else setErr("Código incorrecto.");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						autoFocus: true,
						placeholder: "Código de edición",
						value: code,
						onChange: (e) => setCode(e.target.value)
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-alert",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Entrar"
					})
				]
			})
		] })
	});
}
function KpiCard({ title, value, unit, hint, tone = "blue", spark, className }) {
	const border = {
		blue: "border-l-blue",
		teal: "border-l-teal",
		ok: "border-l-ok",
		warn: "border-l-warn",
		alert: "border-l-alert",
		navy: "border-l-navy"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-[16px] border border-line border-l-[6px] bg-linear-to-b from-white to-[#f5f9ff] p-5 shadow-[var(--shadow-card)]", border, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[0.72rem] font-bold tracking-[0.08em] text-muted uppercase",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tabular text-[2rem] leading-none font-extrabold tracking-tight text-navy",
					children: [
						value,
						" ",
						unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.85rem] font-bold tracking-normal text-cloud",
							children: unit
						}) : null
					]
				}), spark && spark.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
							data: spark.map((v, i) => ({
								i,
								v
							})),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "v",
								stroke: "#017ACB",
								strokeWidth: 2,
								dot: false
							})
						})
					})
				}) : null]
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 border-t border-line-2 pt-2.5 text-[0.82rem] leading-5 font-medium text-muted",
				children: hint
			}) : null
		]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col rounded-[18px] border border-line bg-card p-5 shadow-[var(--shadow-card)]", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("relative mb-3 border-b border-line-2 pb-3 pl-3.5 text-[1.05rem] font-bold tracking-tight text-navy", "before:absolute before:top-1 before:bottom-3 before:left-0 before:w-1 before:rounded-full before:bg-linear-to-b before:from-blue before:to-teal", className),
		...props
	});
}
var tooltipStyle = {
	backgroundColor: "rgba(0,20,44,.94)",
	border: "none",
	borderRadius: 10,
	padding: 12,
	color: "#fff",
	fontSize: 12,
	fontWeight: 600
};
function ChartTip({ active, payload, label, formatter }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: tooltipStyle,
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[13px] font-bold",
			children: label
		}) : null, payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block size-2 rounded-sm",
				style: { background: p.color }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				p.name,
				": ",
				formatter ? formatter(Number(p.value), String(p.name)) : p.value
			] })]
		}, String(p.dataKey ?? p.name)))]
	});
}
var ICONS = {
	Energia: Zap,
	Agua: Droplets,
	Residuos: Recycle,
	Combustibles: Fuel
};
function HomeView() {
	const ctx = useEngineCtx();
	const periodo = useSga((s) => s.filtroTemporal);
	const anio = useSga((s) => s.anioActual);
	const setCategoria = useSga((s) => s.setCategoria);
	const setPlanta = useSga((s) => s.setPlanta);
	const { s, e } = limitesPeriodo(periodo);
	const meses = [
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
		"Dic"
	].slice(s, e);
	let totalCorp = 0;
	const porPlanta = {};
	const porVector = {
		Energia: 0,
		Agua: 0,
		Residuos: 0,
		Combustibles: 0
	};
	for (const p of ctx.plantas) {
		porPlanta[p.id] = 0;
		for (const v of VECTORES$1) {
			const co2 = calcularCO2(ctx, p.id, v, s, e);
			porPlanta[p.id] += co2;
			porVector[v] += co2;
			totalCorp += co2;
		}
	}
	const co2Mes = meses.map((m, idx) => {
		const row = { mes: m };
		for (const v of VECTORES$1) {
			let sum = 0;
			for (const p of ctx.plantas) sum += calcularCO2(ctx, p.id, v, s + idx, s + idx + 1);
			row[v] = Number(sum.toFixed(3));
		}
		return row;
	});
	let fuera = 0;
	let alertas = 0;
	const semaforo = [];
	for (const p of ctx.plantas) {
		const intel = inteligenciaSerie(ctx, p.id, "Energia");
		if (intel) alertas += intel.anomalias.length;
		for (const v of VECTORES$1) {
			if (!plantaTieneVector(p, v)) continue;
			const a = calcularMetasAuto(ctx, p.id, v);
			const act = intensidadAnio(ctx, p.id, v, anio);
			const limite = a.efMeta ?? ctx.metasSGA[p.id]?.[v]?.efMetaFallback;
			const meta = a.metaObjetivo ?? limite;
			let estado = "na";
			if (act !== null && limite) {
				if (act <= (meta ?? limite)) estado = "ok";
				else if (act <= limite) estado = "warn";
				else {
					estado = "alert";
					fuera++;
				}
			}
			semaforo.push({
				planta: p.corto,
				cat: v,
				estado,
				valor: act === null ? "—" : act.toFixed(3)
			});
		}
	}
	let ahorroKwh = 0;
	let ahorroM3 = 0;
	for (const p of ctx.plantas) {
		const eA = calcularMetasAuto(ctx, p.id, "Energia");
		const aA = calcularMetasAuto(ctx, p.id, "Agua");
		if (eA.suficiente) ahorroKwh += eA.ahorro ?? 0;
		if (aA.suficiente) ahorroM3 += aA.ahorro ?? 0;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Emisión global",
						value: fmt2.format(totalCorp),
						unit: "tCO₂e",
						tone: "teal",
						hint: "Consolidado de las tres plantas en el periodo.",
						spark: co2Mes.map((r) => Number(r.Energia) + Number(r.Agua) + Number(r.Residuos) + Number(r.Combustibles))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Fuera de límite",
						value: fuera,
						unit: "vectores",
						tone: fuera > 0 ? "alert" : "ok",
						hint: fuera > 0 ? "Requieren plan de acción documentado." : "Todos los vectores operan dentro del límite vigente."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Alertas Shewhart",
						value: alertas,
						unit: "meses",
						tone: alertas > 0 ? "warn" : "ok",
						hint: "Meses con intensidad eléctrica fuera de media ± 3σ (planta por planta)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Ahorro potencial",
						value: fmtCompact(ahorroKwh),
						unit: "kWh",
						tone: "blue",
						hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Más ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-navy",
								children: [fmt1.format(ahorroM3), " m³"]
							}),
							" de agua si cada planta opera en su meta."
						] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-5 xl:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-3",
					style: { minHeight: 320 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Evolución de emisiones (tCO₂e)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[260px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: co2Mes,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "#EEF3FA",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "mes",
										tick: {
											fontSize: 12,
											fontWeight: 600,
											fill: "#5B7088"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
										fontSize: 11,
										fill: "#5B7088"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt2.format(v)} tCO₂e` }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "Energia",
										stackId: "1",
										stroke: "#0E7C86",
										fill: "#0E7C86",
										fillOpacity: .85
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "Agua",
										stackId: "1",
										stroke: "#017ACB",
										fill: "#017ACB",
										fillOpacity: .85
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "Residuos",
										stackId: "1",
										stroke: "#1E3548",
										fill: "#1E3548",
										fillOpacity: .75
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "Combustibles",
										stackId: "1",
										stroke: "#5B7088",
										fill: "#5B7088",
										fillOpacity: .7
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Participación por planta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: ctx.plantas.map((p) => {
							const pct = totalCorp > 0 ? porPlanta[p.id] / totalCorp * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPlanta(p.id),
								className: "rounded-[14px] border border-line p-3 text-left hover:bg-paper",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 font-bold text-navy",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-muted" }),
												" ",
												p.nombre
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular font-extrabold",
											children: [fmt2.format(porPlanta[p.id]), " tCO₂e"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-2 overflow-hidden rounded-full bg-line-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-blue",
											style: { width: `${pct}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs font-semibold text-muted",
										children: [pct.toFixed(1), "% del consolidado"]
									})
								]
							}, p.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: ["Semáforo de intensidad ", anio] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "Verde = cumple meta de mejora. Ámbar = dentro del límite. Rojo = excede el máximo permisible."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "hc-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Planta / Vector" }), VECTORES$1.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: v === "Energia" ? "Energía" : v }, v))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ctx.plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-bold text-navy",
							children: p.nombre
						}), VECTORES$1.map((v) => {
							const cell = semaforo.find((x) => x.planta === p.corto && x.cat === v);
							if (!plantaTieneVector(p, v)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-cloud",
								children: "—"
							}, v);
							const tone = cell?.estado === "ok" ? "ok" : cell?.estado === "warn" ? "warn" : cell?.estado === "alert" ? "alert" : "muted";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setPlanta(p.id);
									setCategoria(v);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone,
									children: cell?.valor ?? "—"
								})
							}) }, v);
						})] }, p.id)) })]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: VECTORES$1.map((v) => {
					const Icon = ICONS[v];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCategoria(v),
						className: "flex items-center gap-3 rounded-[16px] border border-line bg-white p-4 text-left shadow-[var(--shadow-card)] hover:border-blue",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 items-center justify-center rounded-[10px] bg-paper text-navy",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-bold text-navy",
							children: v === "Energia" ? "Energía" : v
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold text-muted",
							children: [fmt2.format(porVector[v]), " tCO₂e"]
						})] })]
					}, v);
				})
			})
		]
	});
}
function VectorView() {
	const ctx = useEngineCtx();
	const plantaId = useSga((s) => s.plantaActual);
	const cat = useSga((s) => s.catActual);
	const anio = useSga((s) => s.anioActual);
	const periodo = useSga((s) => s.filtroTemporal);
	const mesDona = useSga((s) => s.mesDona);
	const setMesDona = useSga((s) => s.setMesDona);
	const comparar = useSga((s) => s.compararPlantas);
	const yoy = useSga((s) => s.yoy);
	const metrica = useSga((s) => s.metricaVector);
	const toggleComparar = useSga((s) => s.toggleComparar);
	const toggleYoy = useSga((s) => s.toggleYoy);
	const setMetricaVector = useSga((s) => s.setMetricaVector);
	const planta = plantaPorId(ctx.plantas, plantaId);
	const t = vectorTotalesPeriodo(ctx, plantaId, cat, anio, periodo);
	const meta = obtenerMetaEfectiva(ctx, plantaId, cat);
	const unidad = ctx.metasSGA[plantaId]?.[cat]?.unidad ?? VECTOR_META[cat].unidad;
	const esResiduo = cat === "Residuos";
	const unidadProd = planta?.unidadProd === "EX" ? "Ex." : "U";
	const termino = planta?.terminoUnidad ?? "pieza";
	const cumpleNorma = t.ig <= meta.efMeta;
	const cumpleMeta = t.ig <= (meta.metaObjetivo ?? meta.efMeta);
	const badge = cumpleMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "ok",
		children: "Óptimo · cumple meta de mejora"
	}) : cumpleNorma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "warn",
		children: "Tolerable · dentro del límite"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "alert",
		children: "Alerta · excede el máximo permisible"
	});
	const { s, e } = limitesPeriodo(periodo);
	const meses = t.meses ?? [];
	const chartRows = meses.map((m, i) => {
		const row = { mes: m };
		for (const f of t.flujos) {
			const prod = t.prodMes?.[i] || 0;
			const raw = f.data[i] || 0;
			row[f.l] = metrica === "INT" ? prod > 0 ? raw / prod : 0 : raw;
		}
		const total = t.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
		const prod = t.prodMes?.[i] || 0;
		row._total = metrica === "INT" ? prod > 0 ? total / prod : 0 : total;
		if (yoy) {
			const prev = getDatosAnio(ctx.bd, plantaId, anio - 1);
			if (prev) {
				const flujos = flujosDePlantaVector(planta, cat);
				let pv = 0;
				for (const f of flujos) {
					const ds = prev[cat].principal.find((x) => x.l === f);
					pv += ds?.d[s + i] || 0;
				}
				const pp = prev.produccion[s + i] || 0;
				row._yoy = metrica === "INT" ? pp > 0 ? pv / pp : 0 : pv;
			}
		}
		return row;
	});
	const stacked = ctx.bd[plantaId]?.[anio]?.[cat].stacked ?? true;
	let tCO2e = calcularCO2(ctx, plantaId, cat, s, e);
	let tCO2Avoid = 0;
	if (cat === "Energia") {
		const solar = t.flujos.find((f) => f.l === "Solar");
		tCO2Avoid = (solar ? sum(solar.data) : 0) * ctx.FE.CFE / 1e3;
	}
	const compareRows = meses.map((m, i) => {
		const row = { mes: m };
		for (const p of ctx.plantas) {
			if (!plantaTieneVector(p, cat)) continue;
			const vt = vectorTotalesPeriodo(ctx, p.id, cat, anio, periodo);
			row[p.corto] = vt.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
		}
		return row;
	});
	const singleFlow = t.flujos.length === 1;
	const donaData = mesDona === "ALL" ? t.flujos.map((f) => ({
		name: f.l,
		value: sum(f.data),
		color: f.c
	})) : t.flujos.map((f) => ({
		name: f.l,
		value: f.data[Number(mesDona)] || 0,
		color: f.c
	}));
	const trendInfo = singleFlow ? t.flujos[0].data.map((curr, i, arr) => {
		if (i === 0) return {
			color: "#cbd5e1",
			txt: "Mes base"
		};
		const prev = arr[i - 1];
		const delta = prev > 0 ? (curr - prev) / prev * 100 : curr > 0 ? 100 : 0;
		if (delta > 0) return {
			color: "#b91c1c",
			txt: `Empeoró +${delta.toFixed(1)}%`
		};
		if (delta < 0) return {
			color: "#047857",
			txt: `Mejoró ${delta.toFixed(1)}%`
		};
		return {
			color: "#cbd5e1",
			txt: "Sin variación"
		};
	}) : [];
	const igSeries = meses.map((m, i) => {
		const prod = t.prodMes?.[i] || 0;
		const cons = t.flujos.reduce((a, f) => a + (f.data[i] || 0), 0);
		return {
			mes: m,
			real: prod > 0 ? cons / prod : 0,
			limite: meta.efMeta,
			objetivo: meta.metaObjetivo ?? meta.efMeta
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: yoy,
							onChange: toggleYoy
						}), " Año anterior"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: comparar,
							onChange: toggleComparar
						}), " Comparar plantas"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex overflow-hidden rounded-full border border-line bg-white text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `px-3 py-1.5 ${metrica === "ABS" ? "bg-navy text-white" : ""}`,
							onClick: () => setMetricaVector("ABS"),
							children: "Volumen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `px-3 py-1.5 ${metrica === "INT" ? "bg-navy text-white" : ""}`,
							onClick: () => setMetricaVector("INT"),
							children: "Intensidad"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: esResiduo ? "Generación total" : "Consumo total",
						value: fmt1.format(t.cons),
						unit: unidad,
						tone: "blue",
						hint: tCO2e > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Impacto: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-navy",
								children: [fmt2.format(tCO2e), " tCO₂e"]
							}),
							tCO2Avoid > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-ok",
								children: [
									"Emisión evitada (solar): ",
									fmt2.format(tCO2Avoid),
									" tCO₂e"
								]
							}) : null
						] }) : "Volumen del periodo seleccionado.",
						spark: chartRows.map((r) => Number(r._total) || 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: planta?.unidadProd === "EX" ? "Exámenes realizados" : "Producción",
						value: fmt1.format(t.prod),
						unit: unidadProd,
						tone: "navy",
						hint: planta?.unidadProd === "EX" ? "Volumen de pruebas procesadas." : "Volumen manufacturado."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Intensidad de proceso",
						value: fmt4.format(t.ig),
						unit: `${unidad}/${unidadProd}`,
						tone: cumpleMeta ? "ok" : cumpleNorma ? "warn" : "alert",
						hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"El proceso ",
							esResiduo ? "genera" : "consume",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-navy",
								children: [
									fmt4.format(t.ig),
									" ",
									unidad
								]
							}),
							" por ",
							termino,
							".",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1",
								children: [
									"Meta ≤ ",
									fmt4.format(meta.metaObjetivo ?? meta.efMeta),
									" · Límite ≤ ",
									fmt4.format(meta.efMeta)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[0.72rem] text-cloud",
								children: meta.origen
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: badge
							})
						] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-5 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: comparar ? "Comparativo por planta" : "Comportamiento temporal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[300px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: comparar ? compareRows : chartRows,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "#EEF3FA",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "mes",
										tick: {
											fontSize: 12,
											fontWeight: 600,
											fill: "#5B7088"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
										fontSize: 11,
										fill: "#5B7088"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt1.format(v)} ${unidad}${metrica === "INT" ? "/" + unidadProd : ""}` }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									comparar ? ctx.plantas.filter((p) => plantaTieneVector(p, cat)).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: p.corto,
										fill: [
											"#017ACB",
											"#0E7C86",
											"#1E3548"
										][i % 3],
										radius: [
											6,
											6,
											0,
											0
										]
									}, p.id)) : t.flujos.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: f.l,
										stackId: stacked ? "a" : void 0,
										fill: f.c,
										radius: [
											6,
											6,
											0,
											0
										]
									}, f.l)),
									!comparar && yoy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "_yoy",
										name: `${anio - 1}`,
										stroke: "#94a3b8",
										strokeDasharray: "5 5",
										dot: false
									}) : null
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-0 border-0 pb-0 before:hidden",
						children: singleFlow ? "Tendencia mensual" : "Distribución"
					}), !singleFlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "select-light",
						value: mesDona,
						onChange: (e) => setMesDona(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "Periodo"
						}), meses.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i,
							children: m
						}, m))]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[260px]",
					children: singleFlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarChartFromTrend, {
							meses,
							data: t.flujos[0].data,
							info: trendInfo,
							unidad
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: donaData,
								dataKey: "value",
								nameKey: "name",
								innerRadius: "62%",
								outerRadius: "88%",
								paddingAngle: 2,
								children: donaData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.color }, d.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt1.format(v)} ${unidad}` }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
						] })
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Métrica de intensidad operativa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[260px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: igSeries,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#EEF3FA",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "mes",
								tick: {
									fontSize: 12,
									fontWeight: 600,
									fill: "#5B7088"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
								fontSize: 11,
								fill: "#5B7088"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${Number(v).toFixed(4)} ${unidad}/${unidadProd}` }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "real",
								name: "Intensidad real",
								stroke: "#00142C",
								strokeWidth: 3,
								dot: { r: 4 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "limite",
								name: "Límite máximo",
								stroke: "#b91c1c",
								strokeDasharray: "5 5",
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "objetivo",
								name: "Meta de mejora",
								stroke: "#047857",
								strokeDasharray: "3 3",
								dot: false
							})
						]
					})
				})
			})] })
		]
	});
}
function BarChartFromTrend({ meses, data, info, unidad }) {
	const rows = meses.map((m, i) => ({
		mes: m,
		v: data[i],
		color: info[i]?.color
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
		data: rows,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
				stroke: "#EEF3FA",
				vertical: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
				dataKey: "mes",
				tick: {
					fontSize: 12,
					fill: "#5B7088"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
				fontSize: 11,
				fill: "#5B7088"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt1.format(v)} ${unidad}` }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				dataKey: "v",
				name: "Volumen",
				radius: [
					6,
					6,
					0,
					0
				],
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: r.color }, r.mes))
			})
		]
	});
}
var COLORS = {
	Energia: "#0E7C86",
	Agua: "#017ACB",
	Residuos: "#1E3548",
	Combustibles: "#5B7088"
};
function HuellaView() {
	const ctx = useEngineCtx();
	const { s, e } = limitesPeriodo(useSga((s) => s.filtroTemporal));
	const meses = [
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
		"Dic"
	].slice(s, e);
	const plantas = ctx.plantas.map((p) => p.id);
	const matriz = {};
	const totP = {};
	const totV = {
		Energia: 0,
		Agua: 0,
		Residuos: 0,
		Combustibles: 0
	};
	let total = 0;
	for (const p of plantas) {
		matriz[p] = {};
		totP[p] = 0;
		for (const v of VECTORES$1) {
			const co2 = calcularCO2(ctx, p, v, s, e);
			matriz[p][v] = co2;
			totP[p] += co2;
			totV[v] += co2;
			total += co2;
		}
	}
	const monthly = meses.map((m, idx) => {
		const row = { mes: m };
		for (const v of VECTORES$1) {
			let sum = 0;
			for (const p of plantas) sum += calcularCO2(ctx, p, v, s + idx, s + idx + 1);
			row[v] = Number(sum.toFixed(3));
		}
		return row;
	});
	const tones = [
		"blue",
		"teal",
		"navy"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
				title: "Emisión global",
				value: fmt2.format(total),
				unit: "tCO₂e",
				tone: "teal",
				hint: "Consolidado corporativo del periodo."
			}), ctx.plantas.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
				title: p.nombre,
				value: fmt2.format(totP[p.id]),
				unit: "tCO₂e",
				tone: tones[i % tones.length],
				hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Participación: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
					className: "text-navy",
					children: [total > 0 ? (totP[p.id] / total * 100).toFixed(1) : 0, "%"]
				})] })
			}, p.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Evolución temporal (tCO₂e)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[300px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: monthly,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#EEF3FA",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "mes",
								tick: {
									fontSize: 12,
									fill: "#5B7088"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
								fontSize: 11,
								fill: "#5B7088"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt2.format(v)} tCO₂e` }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							VECTORES$1.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: v,
								name: v === "Energia" ? "Energía" : v,
								stackId: "a",
								fill: COLORS[v]
							}, v))
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Matriz de inventario (tCO₂e)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "hc-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vector" }),
						ctx.plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: p.corto }, p.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Total" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [VECTORES$1.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-semibold text-muted",
							children: v === "Energia" ? "Energía" : v
						}),
						plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "tabular",
							children: fmt2.format(matriz[p][v])
						}, p)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "tabular font-bold",
							children: fmt2.format(totV[v])
						})
					] }, v)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-extrabold text-navy",
							children: "Total instalación"
						}),
						plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "tabular font-extrabold",
							children: fmt2.format(totP[p])
						}, p)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "tabular text-lg font-extrabold text-alert",
							children: fmt2.format(total)
						})
					] })] })]
				})
			})] })]
		})]
	});
}
var COPY = {
	Energia: {
		nombre: "electricidad",
		tituloReg: "Tendencia y carga vampiro (stand-by)",
		descReg: "El cruce izquierdo de la línea revela el desperdicio continuo cuando la producción es cero.",
		kpi: "Carga vampiro estimada",
		kpiDesc: "Electricidad consumida sin producción (paros).",
		she: "Puntos fuera de control: meses con consumo eléctrico anormal, posible falla de equipo."
	},
	Agua: {
		nombre: "agua",
		tituloReg: "Tendencia y gasto fijo hídrico",
		descReg: "El intercepto indica agua gastada sin producción. Valores altos sugieren fugas continuas.",
		kpi: "Gasto hídrico en paro",
		kpiDesc: "Agua consumida sin producción (revisar fugas).",
		she: "Consumo anormal de agua: fugas críticas o lavado ineficiente."
	},
	Residuos: {
		nombre: "residuos",
		tituloReg: "Tendencia y generación basal",
		descReg: "Residuos generados sin producción: caducidades o mermas de mantenimiento.",
		kpi: "Generación sin producción",
		kpiDesc: "Residuos por caducidades o mermas.",
		she: "Generación anormal: problemas de calidad o purgas."
	},
	Combustibles: {
		nombre: "combustibles",
		tituloReg: "Tendencia y consumo estructural",
		descReg: "Hidrocarburo quemado con planta inactiva (calderas en piloto).",
		kpi: "Consumo estructural base",
		kpiDesc: "Diésel/gas quemado en pilotos inactivos.",
		she: "Consumo anormal: revisión de calderas o logística."
	}
};
function InteligenciaView() {
	const ctx = useEngineCtx();
	const planta = useSga((s) => s.plantaActual);
	const cat = useSga((s) => s.catActual);
	const plantas = useSga((s) => s.plantas);
	const intel = inteligenciaSerie(ctx, planta, cat);
	const copy = COPY[cat];
	const [sel, setSel] = (0, import_react.useState)(null);
	const nombrePlanta = plantas.find((p) => p.id === planta)?.nombre ?? planta;
	const unidadProd = plantas.find((p) => p.id === planta)?.unidadProd === "EX" ? "Ex." : "U";
	if (!intel) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Sin serie suficiente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			"Se necesitan al menos dos meses con producción y consumo en ",
			nombrePlanta,
			" / ",
			copy.nombre,
			" para calcular control estadístico y regresión. Carga más historial o cambia de planta/vector."
		]
	})] });
	const carga = Math.max(0, intel.reg.intercept);
	const correl = (intel.reg.r * 100).toFixed(1);
	const shewhart = intel.labels.map((l, i) => ({
		mes: l,
		val: Number(intel.effArr[i].toFixed(4)),
		mean: intel.mean,
		ucl: intel.ucl,
		lcl: intel.lcl,
		out: intel.effArr[i] > intel.ucl || intel.effArr[i] < intel.lcl
	}));
	const scatter = intel.prodArr.map((p, i) => ({
		x: p,
		y: intel.consArr[i]
	}));
	const maxProd = Math.max(...intel.prodArr);
	const line = [{
		x: 0,
		y: intel.reg.intercept
	}, {
		x: maxProd,
		y: intel.reg.slope * maxProd + intel.reg.intercept
	}];
	const picked = sel !== null ? shewhart[sel] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Alertas detectadas",
						value: intel.anomalias.length,
						unit: "meses anormales",
						tone: intel.anomalias.length ? "alert" : "ok",
						hint: "Meses con picos o caídas inusuales (media ± 3σ)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: copy.kpi,
						value: fmt1.format(carga),
						unit: intel.unidad,
						tone: "teal",
						hint: copy.kpiDesc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Dependencia operativa",
						value: correl,
						unit: "%",
						tone: "blue",
						hint: "Proporción del consumo explicada por el volumen de manufactura."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: ["Historial de alertas · ", cat === "Energia" ? "Energía" : cat] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm text-muted",
					children: [copy.she, " Haz clic en un punto rojo para ver el mes."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[300px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: shewhart,
							onClick: (st) => {
								const idx = st?.activeTooltipIndex;
								if (typeof idx === "number") setSel(idx);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#EEF3FA",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "mes",
									tick: {
										fontSize: 11,
										fill: "#5B7088"
									},
									interval: Math.max(0, Math.floor(shewhart.length / 12) - 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
									fontSize: 11,
									fill: "#5B7088"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => `${fmt2.format(v)} ${intel.unidad}/${unidadProd}` }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "val",
									name: "Intensidad",
									stroke: "#5B7088",
									strokeWidth: 2,
									dot: (props) => {
										const { cx, cy, payload, index } = props;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx,
											cy,
											r: payload.out ? 6 : 4,
											fill: payload.out ? "#b91c1c" : "#047857",
											stroke: "#fff",
											strokeWidth: 1
										}, index);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "mean",
									name: "Promedio",
									stroke: "#017ACB",
									dot: false,
									strokeWidth: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "ucl",
									name: "Límite máx.",
									stroke: "#b91c1c",
									strokeDasharray: "5 5",
									dot: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "lcl",
									name: "Límite mín.",
									stroke: "#b91c1c",
									strokeDasharray: "5 5",
									dot: false
								})
							]
						})
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: copy.tituloReg }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: copy.descReg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[300px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { stroke: "#EEF3FA" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								dataKey: "x",
								name: "Producción",
								tick: {
									fontSize: 11,
									fill: "#5B7088"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "number",
								dataKey: "y",
								name: "Consumo",
								tick: {
									fontSize: 11,
									fill: "#5B7088"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZAxis, { range: [60, 60] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: { strokeDasharray: "3 3" },
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
								name: "Meses operativos",
								data: scatter,
								fill: "#0164BD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
								name: `Tendencia (inicio = ${carga.toFixed(0)})`,
								data: line,
								fill: "#b91c1c",
								line: {
									stroke: "#b91c1c",
									strokeWidth: 2
								},
								legendType: "line",
								shape: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { r: 0 })
							})
						] })
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: sel !== null,
				onOpenChange: (o) => !o && setSel(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Ficha del mes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: picked?.mes }),
					picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-wide text-muted uppercase",
								children: "Intensidad"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "tabular text-lg font-extrabold text-navy",
								children: fmt2.format(picked.val)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-wide text-muted uppercase",
								children: "Estado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: picked.out ? "Fuera de control" : "Dentro de banda"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-wide text-muted uppercase",
								children: "Promedio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "tabular",
								children: fmt2.format(picked.mean)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-wide text-muted uppercase",
								children: "Banda 3σ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tabular",
								children: [
									fmt2.format(picked.lcl),
									" – ",
									fmt2.format(picked.ucl)
								]
							})] })
						]
					}) : null
				] })
			})
		]
	});
}
function recFmt(v, int) {
	return int ? fmt4.format(v) : fmt1.format(v);
}
function RecordsView() {
	const ctx = useEngineCtx();
	const rec = useSga((s) => s.rec);
	const setRec = useSga((s) => s.setRec);
	const opts = {
		periodo: rec.periodo,
		metrica: rec.metrica,
		ceros: rec.ceros
	};
	const plantasUsar = ctx.plantas.filter((p) => rec.planta === "ALL" || p.id === rec.planta);
	const vectoresUsar = VECTORES$1.filter((v) => rec.vector === "ALL" || v === rec.vector);
	const bloques = [];
	for (const cat of vectoresUsar) {
		const filas = [];
		for (const p of plantasUsar) {
			const flujos = flujosDePlantaVector(p, cat);
			if (!flujos.length) continue;
			const stTotal = recStats(recSerie(ctx, p.id, cat, "__TOTAL__", opts));
			if (stTotal && flujos.length > 1) filas.push({
				planta: p.id,
				flujo: "__TOTAL__",
				esTotal: true,
				st: stTotal,
				cat
			});
			else if (stTotal && flujos.length === 1) filas.push({
				planta: p.id,
				flujo: flujos[0],
				esTotal: true,
				st: stTotal,
				cat
			});
			for (const f of flujos) {
				const st = recStats(recSerie(ctx, p.id, cat, f, opts));
				if (st && st.max.val > 0) filas.push({
					planta: p.id,
					flujo: f,
					esTotal: false,
					st,
					cat
				});
			}
		}
		if (filas.length) bloques.push({
			cat,
			filas
		});
	}
	const chartRows = bloques.flatMap((b) => {
		const usarTotales = rec.vector === "ALL";
		const hayTotales = b.filas.some((x) => x.esTotal);
		return b.filas.filter((f) => usarTotales ? hayTotales ? f.esTotal : true : !f.esTotal).map((f) => ({
			label: `${VECTOR_META[b.cat].nombre} · ${plantaPorId(ctx.plantas, f.planta)?.corto}`,
			min: f.st.min.val,
			max: f.st.max.val,
			avg: f.st.avg,
			range: f.st.max.val - f.st.min.val,
			base: f.st.min.val,
			color: VECTOR_META[b.cat].color,
			tagMin: `${f.st.min.mes} ${f.st.min.anio}`,
			tagMax: `${f.st.max.mes} ${f.st.max.anio}`
		}));
	}).sort((a, b) => b.max - a.max).slice(0, 18);
	const anios = Array.from(new Set(Object.values(ctx.bd).flatMap((p) => Object.keys(p)))).sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-white p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Vector", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: rec.vector,
							onChange: (e) => setRec({ vector: e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "Todos"
							}), VECTORES$1.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v,
								children: VECTOR_META[v].nombre
							}, v))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Planta", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: rec.planta,
							onChange: (e) => setRec({ planta: e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "Todas"
							}), ctx.plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.nombre
							}, p.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Métrica", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: rec.metrica,
							onChange: (e) => setRec({ metrica: e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ABS",
								children: "Volumen absoluto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "INT",
								children: "Intensidad"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Meses", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: rec.periodo,
							onChange: (e) => setRec({ periodo: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ALL",
									children: "Todo el año"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Q1",
									children: "Q1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Q2",
									children: "Q2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Q3",
									children: "Q3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Q4",
									children: "Q4"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: rec.ceros,
							onChange: (e) => setRec({ ceros: e.target.checked })
						}), " Incluir ceros"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: bloques.map((b) => {
					const base = b.filas.filter((f) => f.esTotal);
					const pool = base.length ? base : b.filas;
					let recMax = pool[0];
					let recMin = pool[0];
					for (const f of pool) {
						if (f.st.max.val > recMax.st.max.val) recMax = f;
						if (f.st.min.val < recMin.st.min.val) recMin = f;
					}
					if (!recMax) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: `${VECTOR_META[b.cat].nombre} · pico`,
						value: recFmt(recMax.st.max.val, rec.metrica === "INT"),
						unit: VECTOR_META[b.cat].unidad,
						tone: "navy",
						hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-navy",
								children: plantaPorId(ctx.plantas, recMax.planta)?.nombre
							}),
							" · ",
							recMax.st.max.mes,
							" ",
							recMax.st.max.anio,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Valle: ",
							recFmt(recMin.st.min.val, rec.metrica === "INT"),
							" · ",
							plantaPorId(ctx.plantas, recMin.planta)?.corto
						] })
					}, b.cat);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Rango histórico (mínimo – máximo)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "Cada barra va del mínimo al máximo registrado. Barras largas = proceso inestable."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { height: Math.max(260, chartRows.length * 34 + 40) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chartRows,
							layout: "vertical",
							margin: {
								left: 24,
								right: 24
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#EEF3FA",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: {
										fontSize: 11,
										fill: "#5B7088"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "label",
									width: 140,
									tick: {
										fontSize: 11,
										fill: "#1E3548",
										fontWeight: 600
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { formatter: (v) => recFmt(v, rec.metrica === "INT") }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "base",
									stackId: "r",
									fill: "transparent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "range",
									stackId: "r",
									name: "Rango",
									radius: [
										0,
										6,
										6,
										0
									],
									children: chartRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
										fill: r.color,
										fillOpacity: .45,
										stroke: r.color
									}, r.label))
								})
							]
						})
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Matriz de récords" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm text-muted",
					children: rec.ceros ? "Se incluyen meses en cero." : "Los meses en cero se excluyen para que el mínimo refleje operación real."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "hc-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vector / Flujo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Planta" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Mínimo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Promedio" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Máximo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Δ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Último" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Posición" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "n" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bloques.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "!bg-[#DCEAF7]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 9,
								className: "text-left font-extrabold tracking-wide text-[#00447A] uppercase",
								children: VECTOR_META[b.cat].nombre
							})
						}, b.cat), b.filas.map((f) => {
							const pct = f.st.spread > 0 ? (f.st.ultimo.val - f.st.min.val) / f.st.spread * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: f.esTotal ? "font-extrabold" : "",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: f.esTotal ? "" : "pl-6 text-muted",
										children: f.esTotal ? f.flujo === "__TOTAL__" ? `Total ${VECTOR_META[b.cat].nombre}` : f.flujo : f.flujo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-left",
										children: plantaPorId(ctx.plantas, f.planta)?.nombre
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "tabular text-ok",
										children: [recFmt(f.st.min.val, rec.metrica === "INT"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 rounded bg-paper px-1.5 py-0.5 text-[0.65rem] font-bold text-muted uppercase",
											children: [
												f.st.min.mes,
												" ",
												f.st.min.anio
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular text-blue",
										children: recFmt(f.st.avg, rec.metrica === "INT")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "tabular text-alert",
										children: [recFmt(f.st.max.val, rec.metrica === "INT"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 rounded bg-paper px-1.5 py-0.5 text-[0.65rem] font-bold text-muted uppercase",
											children: [
												f.st.max.mes,
												" ",
												f.st.max.anio
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular text-muted",
										children: recFmt(f.st.spread, rec.metrica === "INT")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular",
										children: recFmt(f.st.ultimo.val, rec.metrica === "INT")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pos-bar",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pos-mark",
											style: { left: `${Math.max(0, Math.min(100, pct))}%` }
										})
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-cloud",
										children: f.st.n
									})
								]
							}, `${b.cat}-${f.planta}-${f.flujo}`);
						})] }, b.cat)) })]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YoyTable, {
				anios,
				bloques
			})
		]
	});
}
function YoyTable({ anios, bloques }) {
	const ctx = useEngineCtx();
	const rec = useSga((s) => s.rec);
	const opts = {
		periodo: rec.periodo,
		metrica: rec.metrica,
		ceros: rec.ceros
	};
	if (anios.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Comparativo interanual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Se necesitan al menos 2 años cargados."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Comparativo interanual (promedio mensual)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "hc-table",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vector / Planta" }),
				anios.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: a }, a)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tendencia" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bloques.flatMap((b) => b.filas.filter((f) => f.esTotal).map((f) => {
				const serie = recSerie(ctx, f.planta, b.cat, f.flujo === "__TOTAL__" ? "__TOTAL__" : f.flujo, opts);
				const por = {};
				for (const o of serie) (por[o.anio] ??= []).push(o.val);
				const avg = {};
				for (const a of Object.keys(por)) avg[a] = por[a].reduce((x, y) => x + y, 0) / por[a].length;
				const present = anios.filter((a) => avg[a] !== void 0);
				const ult = present[present.length - 1];
				const prev = present[present.length - 2];
				const d = deltaPct(avg[ult], avg[prev]);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
						VECTOR_META[b.cat].nombre,
						" · ",
						plantaPorId(ctx.plantas, f.planta)?.corto
					] }),
					anios.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "tabular text-blue",
						children: avg[a] !== void 0 ? recFmt(avg[a], rec.metrica === "INT") : "—"
					}, a)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: d === null ? "text-cloud" : d > 0 ? "font-bold text-alert" : "font-bold text-ok",
						children: d === null ? "—" : `${d > 0 ? "+" : ""}${d.toFixed(1)}%`
					})
				] }, `${b.cat}-${f.planta}`);
			})) })]
		})
	})] });
}
function MetasView() {
	const ctx = useEngineCtx();
	const modo = useSga((s) => s.metasModo);
	const rigor = useSga((s) => s.rigorLimite);
	const setMetasModo = useSga((s) => s.setMetasModo);
	const setRigor = useSga((s) => s.setRigor);
	const setOverride = useSga((s) => s.setOverride);
	const clearOverrides = useSga((s) => s.clearOverrides);
	const setMetasCampo = useSga((s) => s.setMetasCampo);
	const anio = ctx.anioActual;
	const filas = ctx.plantas.flatMap((p) => VECTORES$1.filter((c) => plantaTieneVector(p, c)).map((c) => ({
		planta: p,
		cat: c,
		a: calcularMetasAuto(ctx, p.id, c),
		base: ctx.metasSGA[p.id]?.[c]
	})));
	const conBase = filas.filter((f) => f.a.suficiente).length;
	const factorProm = conBase ? filas.filter((f) => f.a.suficiente).reduce((s, f) => s + (f.a.factor ?? 0), 0) / conBase * 100 : 0;
	const ahorroE = filas.filter((f) => f.cat === "Energia" && f.a.suficiente).reduce((s, f) => s + (f.a.ahorro ?? 0), 0);
	const ahorroA = filas.filter((f) => f.cat === "Agua" && f.a.suficiente).reduce((s, f) => s + (f.a.ahorro ?? 0), 0);
	let fuera = 0;
	for (const f of filas) {
		const ef = obtenerMetaEfectiva(ctx, f.planta.id, f.cat).efMeta;
		const act = intensidadAnio(ctx, f.planta.id, f.cat, anio);
		if (act !== null && ef && act > ef) fuera++;
	}
	const descargar = () => {
		const rows = [[
			"Planta",
			"Vector",
			"Base",
			"Meses",
			"Media",
			"P25",
			"CV%",
			"Mejora%",
			"Meta",
			"Limite",
			"Unidad",
			"Vol",
			"%limpio",
			"Ahorro"
		]];
		for (const f of filas) {
			const a = f.a;
			if (!a.suficiente) {
				rows.push([
					f.planta.nombre,
					VECTOR_META[f.cat].nombre,
					"Sin base",
					String(a.n),
					"",
					"",
					"",
					"",
					String(f.base?.efMetaFallback ?? ""),
					String(f.base?.efMetaFallback ?? ""),
					f.base?.unidad ?? "",
					"",
					"",
					""
				]);
				continue;
			}
			rows.push([
				f.planta.nombre,
				VECTOR_META[f.cat].nombre,
				`${a.anios[0]}-${a.anios[a.anios.length - 1]}`,
				String(a.n),
				(a.media ?? 0).toFixed(4),
				(a.p25 ?? 0).toFixed(4),
				((a.cv ?? 0) * 100).toFixed(1),
				((a.factor ?? 0) * 100).toFixed(0),
				(a.metaObjetivo ?? 0).toFixed(4),
				(a.limiteMax ?? 0).toFixed(4),
				`${VECTOR_META[f.cat].unidad}/${f.planta.unidadProd}`,
				a.volMeta !== null && a.volMeta !== void 0 ? a.volMeta.toFixed(1) : "",
				a.pctMeta !== null && a.pctMeta !== void 0 ? String(a.pctMeta) : "",
				(a.ahorro ?? 0).toFixed(1)
			]);
		}
		const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `Metas_SGA_${anio}.csv`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-white p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Origen", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: modo,
							onChange: (e) => setMetasModo(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "AUTO",
								children: "Automático (línea base)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "MANUAL",
								children: "Manual (valores fijos)"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[0.7rem] font-bold tracking-wide text-muted uppercase",
						children: ["Rigor volumétrico", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "select-light ml-2",
							value: rigor,
							onChange: (e) => setRigor(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "P75",
									children: "Exigente (P75)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SIGMA",
									children: "Estándar (media + 1σ)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "P90",
									children: "Conservador (P90)"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: clearOverrides,
						children: "Restaurar sugeridos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: descargar,
						children: "Descargar CSV"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Metas con base histórica",
						value: conBase,
						unit: `de ${filas.length}`,
						tone: "blue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Mejora promedio",
						value: fmt1.format(factorProm),
						unit: "%",
						tone: "ok",
						hint: "Reducción exigida sobre la intensidad media."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: "Ahorro potencial anual",
						value: fmt1.format(ahorroE),
						unit: "kWh",
						tone: "navy",
						hint: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Más ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-navy",
								children: [fmt1.format(ahorroA), " m³"]
							}),
							" de agua."
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						title: `Fuera de límite ${anio}`,
						value: fuera,
						unit: "vectores",
						tone: fuera ? "alert" : "ok"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Metas de mejora y límites máximos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "hc-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Planta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vector" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Línea base" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Media" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "P25" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "CV" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Mejora" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Meta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Límite" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vol. mensual" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "% limpio" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ahorro" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Estado" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filas.map((f) => {
						const a = f.a;
						const act = intensidadAnio(ctx, f.planta.id, f.cat, anio);
						const ef = obtenerMetaEfectiva(ctx, f.planta.id, f.cat).efMeta;
						let estado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-cloud",
							children: "Sin datos"
						});
						if (act !== null && a.suficiente) estado = act <= (a.metaObjetivo ?? ef) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: fmt4.format(act)
						}) : act <= ef ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "warn",
							children: fmt4.format(act)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: "alert",
							children: [
								"+",
								fmt1.format((act - ef) / ef * 100),
								"%"
							]
						});
						if (!a.suficiente) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: f.planta.corto }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-left font-bold",
								children: VECTOR_META[f.cat].nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 3,
								className: "text-left text-cloud",
								children: [
									"Evidencia insuficiente (",
									a.n,
									" meses)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 2,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-16 rounded border-2 border-line px-1 text-right font-bold",
									type: "number",
									defaultValue: ((f.base?.factorMejora ?? 0) * 100).toFixed(0),
									onBlur: (e) => setMetasCampo(f.planta.id, f.cat, "factorMejora", Number(e.target.value) / 100)
								}), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 2,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-20 rounded border-2 border-line px-1 text-right font-bold",
									type: "number",
									defaultValue: f.base?.efMetaFallback,
									onBlur: (e) => setMetasCampo(f.planta.id, f.cat, "efMetaFallback", Number(e.target.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 3,
								children: "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: estado })
						] }, `${f.planta.id}-${f.cat}`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: f.planta.corto }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-left font-bold",
								children: VECTOR_META[f.cat].nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-muted",
								children: [
									a.anios[0],
									"–",
									a.anios[a.anios.length - 1],
									" · ",
									a.n,
									" m"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular text-blue",
								children: fmt4.format(a.media ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular text-ok",
								children: fmt4.format(a.p25 ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: (a.cv ?? 0) > .25 ? "font-bold text-alert" : "text-muted",
								children: [fmt1.format((a.cv ?? 0) * 100), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-14 rounded border-2 border-line px-1 text-right font-bold",
								type: "number",
								min: 0,
								max: 60,
								defaultValue: ((a.factor ?? 0) * 100).toFixed(0),
								onBlur: (e) => setOverride(f.planta.id, f.cat, Number(e.target.value))
							}), "%"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "tabular font-extrabold text-ok",
								children: ["≤ ", fmt4.format(a.metaObjetivo ?? 0)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "tabular font-extrabold text-alert",
								children: ["≤ ", fmt4.format(a.limiteMax ?? 0)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular",
								children: a.volMeta != null ? `≤ ${fmt1.format(a.volMeta)}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.pctMeta != null ? `≥ ${a.pctMeta}%` : "n/a" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "tabular font-bold text-ok",
								children: [
									fmt1.format(a.ahorro ?? 0),
									" ",
									VECTOR_META[f.cat].unidad
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: estado })
						] }, `${f.planta.id}-${f.cat}`);
					}) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Criterio de cálculo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[12px] border border-dashed border-line bg-paper p-4 text-sm leading-6 text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-navy",
							children: "Línea base:"
						}),
						" intensidad mensual de años anteriores a ",
						anio,
						"; si no hay previos, se usa el historial completo. Se excluyen meses sin producción."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-navy",
						children: "Mejora sugerida:"
					}), " (media − P25) / media, acotada entre 2% y 15%. Con menos de 6 meses se fija en 3%."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-navy",
							children: "Meta:"
						}),
						" media × (1 − mejora). ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-navy",
							children: "Límite:"
						}),
						" P75 × (1 − mejora). Semáforo: verde bajo la meta, ámbar entre meta y límite, rojo por encima."
					] })
				]
			})] })
		]
	});
}
var FLUJOS_ORDEN = [
	{
		vector: "Energia",
		titulo: "Energía",
		items: [["Consumo CFE", "CFE"], ["Solar", "Solar"]]
	},
	{
		vector: "Agua",
		titulo: "Agua",
		items: [["Red", "Red"], ["Recup", "PTAR"]]
	},
	{
		vector: "Residuos",
		titulo: "Residuos",
		items: [
			["Sólidos", "Sólidos"],
			["Líquidos", "Líquidos"],
			["Biológicos", "Biológ."]
		]
	}
];
function ConfigView() {
	const plantas = useSga((s) => s.plantas);
	const setPlantas = useSga((s) => s.setPlantas);
	const metasSGA = useSga((s) => s.metasSGA);
	const setMetasCampo = useSga((s) => s.setMetasCampo);
	const FE = useSga((s) => s.FE);
	const setFE = useSga((s) => s.setFE);
	const ruta = useSga((s) => s.rutaExcel);
	const setRutaExcel = useSga((s) => s.setRutaExcel);
	const restoreFactory = useSga((s) => s.restoreFactory);
	const importConfig = useSga((s) => s.importConfig);
	const setOwnPassword = useSga((s) => s.setOwnPassword);
	const clearOwnPassword = useSga((s) => s.clearOwnPassword);
	const lock = useSga((s) => s.lock);
	const loadFromUrl = useSga((s) => s.loadFromUrl);
	const fileRef = (0, import_react.useRef)(null);
	const [rutaDraft, setRutaDraft] = (0, import_react.useState)(ruta);
	const updatePlanta = (id, patch) => {
		setPlantas(plantas.map((p) => p.id === id ? {
			...p,
			...patch
		} : p));
	};
	const updateFlujo = (id, flujo, on) => {
		setPlantas(plantas.map((p) => {
			if (p.id !== id) return p;
			const flujos = {
				...p.flujos,
				[flujo]: on
			};
			return {
				...p,
				flujos
			};
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-2 rounded-[14px] border border-line bg-white p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-auto text-xs font-semibold text-muted",
						children: "Los cambios se guardan en este navegador."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => {
							const blob = new Blob([JSON.stringify(exportConfigPayload(), null, 2)], { type: "application/json" });
							const a = document.createElement("a");
							a.href = URL.createObjectURL(blob);
							a.download = "Config_Panel_SGA.json";
							a.click();
						},
						children: "Exportar config"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => fileRef.current?.click(),
						children: "Importar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".json",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							const r = new FileReader();
							r.onload = () => {
								try {
									importConfig(JSON.parse(String(r.result)));
								} catch {
									alert("JSON inválido");
								}
							};
							r.readAsText(f);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "danger",
						onClick: () => {
							if (confirm("¿Restaurar valores de fábrica?")) restoreFactory();
						},
						children: "Restaurar fábrica"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Plantas" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm text-muted",
					children: [
						"El ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-navy",
							children: "ID"
						}),
						" debe coincidir exactamente con la columna Planta del Excel."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "hc-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Nombre" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Corto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unidad" }),
							FLUJOS_ORDEN.flatMap((g) => g.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: it[1] }, it[0]))),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Comb." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: plantas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-extrabold",
								children: p.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-36 rounded border border-line px-2 py-1 font-semibold",
								defaultValue: p.nombre,
								onBlur: (e) => updatePlanta(p.id, { nombre: e.target.value })
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-28 rounded border border-line px-2 py-1 font-semibold",
								defaultValue: p.corto,
								onBlur: (e) => updatePlanta(p.id, { corto: e.target.value })
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "select-light",
								value: p.unidadProd,
								onChange: (e) => updatePlanta(p.id, {
									unidadProd: e.target.value,
									terminoUnidad: e.target.value === "EX" ? "examen" : "pieza"
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "PZ",
									children: "Piezas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "EX",
									children: "Exámenes"
								})]
							}) }),
							FLUJOS_ORDEN.flatMap((g) => g.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: p.flujos[it[0]],
								onChange: (e) => updateFlujo(p.id, it[0], e.target.checked)
							}) }, it[0]))),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: p.vectores.Combustibles,
								onChange: (e) => updatePlanta(p.id, { vectores: { Combustibles: e.target.checked } })
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-alert",
								onClick: () => {
									if (plantas.length <= 1) return alert("Debe quedar al menos una planta.");
									if (confirm(`¿Quitar ${p.nombre}?`)) setPlantas(plantas.filter((x) => x.id !== p.id));
								},
								children: "Quitar"
							}) })
						] }, p.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					size: "sm",
					onClick: () => {
						const id = prompt("ID (debe coincidir con el Excel):");
						if (!id?.trim()) return;
						if (plantas.some((p) => p.id === id.trim())) return alert("Ya existe.");
						const nombre = prompt("Nombre:", id) || id;
						setPlantas([...plantas, {
							id: id.trim(),
							nombre,
							corto: nombre,
							unidadProd: "PZ",
							terminoUnidad: "pieza",
							vectores: { Combustibles: true },
							flujos: { ...FLUJOS_DEFAULT },
							icono: "building"
						}]);
					},
					children: "Agregar planta"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Metas de respaldo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "hc-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Planta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vector" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Mejora %" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Meta respaldo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "% limpio" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vol. mensual" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unidad" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: plantas.flatMap((p) => VECTORES$1.filter((c) => plantaTieneVector(p, c)).map((c) => {
						const cfg = metasSGA[p.id]?.[c];
						if (!cfg) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: p.nombre }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-left font-bold",
								children: VECTOR_META[c].nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-16 rounded border-2 border-line px-1 text-right font-bold",
								type: "number",
								defaultValue: (cfg.factorMejora * 100).toFixed(0),
								onBlur: (e) => setMetasCampo(p.id, c, "factorMejora", Number(e.target.value) / 100)
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-20 rounded border-2 border-line px-1 text-right font-bold",
								type: "number",
								defaultValue: cfg.efMetaFallback,
								onBlur: (e) => setMetasCampo(p.id, c, "efMetaFallback", Number(e.target.value))
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: cfg.pctMeta !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-16 rounded border-2 border-line px-1 text-right font-bold",
								type: "number",
								defaultValue: cfg.pctMeta,
								onBlur: (e) => setMetasCampo(p.id, c, "pctMeta", Number(e.target.value))
							}) : "n/a" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: cfg.volMeta !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-20 rounded border-2 border-line px-1 text-right font-bold",
								type: "number",
								defaultValue: cfg.volMeta,
								onBlur: (e) => setMetasCampo(p.id, c, "volMeta", Number(e.target.value))
							}) : "n/a" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-cloud",
								children: cfg.unidad
							})
						] }, `${p.id}-${c}`);
					})) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Factores de emisión" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "hc-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fuente" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Valor" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unidad" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.keys(FE_ETIQUETAS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-left font-bold",
							children: FE_ETIQUETAS[k].titulo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-24 rounded border-2 border-line px-1 text-right font-bold",
							type: "number",
							step: "0.001",
							defaultValue: FE[k],
							onBlur: (e) => setFE(k, Number(e.target.value))
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-cloud",
							children: FE_ETIQUETAS[k].unidad
						})
					] }, k)) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Origen de datos (autocarga)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm text-muted",
					children: [
						"En la intranet: copie la carpeta del paquete (HTML + vendor + Excel). El panel busca ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Base_de_Datos_Dashboard.xlsx" }),
						" al lado del HTML, sin internet. Cada mes sustituya ese archivo y recargue."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "max-w-xs",
							value: rutaDraft,
							onChange: (e) => setRutaDraft(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								setRutaExcel(rutaDraft);
								loadFromUrl(rutaDraft);
							},
							children: "Guardar y recargar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => {
								setRutaExcel(AUTO_LOAD_URL_DEFAULT);
								setRutaDraft(AUTO_LOAD_URL_DEFAULT);
							},
							children: "Predeterminada"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: async () => {
								downloadWorkbook(await workbookFromRows(buildDemoRows()), "Base_de_Datos_Dashboard.xlsx");
							},
							children: "Descargar plantilla Excel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/Panel_SGA_Lapisa.zip",
							download: true,
							className: "inline-flex h-8 items-center rounded-[10px] bg-navy px-3 text-xs font-bold text-white",
							children: "Paquete intranet (ZIP)"
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Seguridad" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "Filtro para evitar cambios accidentales. No es autenticación real: alguien con conocimientos técnicos puede saltárselo."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => {
								const p1 = prompt("Nuevo código propio:");
								if (!p1) return;
								if (p1 !== prompt("Confírmalo:")) return alert("No coinciden.");
								setOwnPassword(p1);
							},
							children: "Definir código propio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: clearOwnPassword,
							children: "Quitar código propio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: lock,
							children: "Bloquear ahora"
						})
					]
				})
			] })
		]
	});
}
function SgaShell() {
	const boot = useSga((s) => s.boot);
	const ready = useSga((s) => s.ready);
	const vista = useSga((s) => s.vista);
	(0, import_react.useEffect)(() => {
		boot();
	}, [boot]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "1") useSga.getState().setCategoria("Energia");
			if (e.key === "2") useSga.getState().setCategoria("Agua");
			if (e.key === "3") useSga.getState().setCategoria("Residuos");
			if (e.key === "4") useSga.getState().setCategoria("Combustibles");
			if (e.key === "h" || e.key === "H") useSga.getState().setVista("home");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh overflow-hidden bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-[1400px] flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-white/10 bg-navy px-4 py-3 text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "min-w-[16rem] flex-1 text-sm leading-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: "Intranet sin internet."
										}), " El paquete es una carpeta: página + Excel + librerías. Se copia al NAS/IIS y cualquiera la abre. Cada mes solo se sustituye el .xlsx."]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/Panel_SGA_Lapisa.zip",
										download: true,
										className: "inline-flex h-10 items-center rounded-[10px] bg-teal px-4 text-sm font-bold text-white hover:opacity-90",
										children: "Descargar paquete"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/intranet/index.html",
										className: "inline-flex h-10 items-center rounded-[10px] border border-white/20 px-4 text-sm font-bold text-white hover:bg-white/10",
										children: "Probar página NAS"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataBar, {}),
							!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[18px] border border-line bg-white p-10 text-center text-muted",
								children: "Cargando panel…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								vista === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {}),
								vista === "vector" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VectorView, {}),
								vista === "huella" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HuellaView, {}),
								vista === "inteligencia" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteligenciaView, {}),
								vista === "records" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordsView, {}),
								vista === "metas" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetasView, {}),
								vista === "config" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigView, {})
							] })
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnlockDialog, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SgaShell, {});
}
//#endregion
export { Home as component };
