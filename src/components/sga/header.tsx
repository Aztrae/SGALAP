import { Menu, Printer } from "lucide-react";
import { etiquetaPeriodo } from "@/lib/sga/format";
import { useSga } from "@/lib/sga/store";
import type { Periodo } from "@/lib/sga/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarBody } from "./sidebar";
import { useState } from "react";

const TITLES: Record<string, [string, string]> = {
  home: ["Resumen ejecutivo", "Desempeño ambiental consolidado"],
  vector: ["Gestión vectorial", ""],
  huella: ["Inventario corporativo de emisiones", "Huella de carbono · Alcance 1, 2 y 3"],
  inteligencia: ["Inteligencia operativa", "Diagnóstico de eficiencia y carga basal"],
  records: ["Récords históricos", "Mínimos, máximos y tendencia interanual"],
  metas: ["Metas y límites", "Línea base histórica y umbrales vigentes"],
  config: ["Parámetros del panel", "Plantas, metas de respaldo y factores de emisión"],
};

export function Header() {
  const [open, setOpen] = useState(false);
  const vista = useSga((s) => s.vista);
  const cat = useSga((s) => s.catActual);
  const planta = useSga((s) => s.plantaActual);
  const plantas = useSga((s) => s.plantas);
  const anio = useSga((s) => s.anioActual);
  const bd = useSga((s) => s.bd);
  const periodo = useSga((s) => s.filtroTemporal);
  const setAnio = useSga((s) => s.setAnio);
  const setPeriodo = useSga((s) => s.setPeriodo);
  const years = Array.from(
    new Set(Object.values(bd).flatMap((p) => Object.keys(p).map(Number))),
  ).sort((a, b) => b - a);

  const plantName = plantas.find((p) => p.id === planta)?.nombre ?? planta;
  let [title, sub] = TITLES[vista] ?? ["Panel SGA", ""];
  if (vista === "vector") {
    title = `${cat === "Energia" ? "Energía" : cat} · ${plantName}`;
    sub = `Año ${anio} · ${etiquetaPeriodo(periodo)}`;
  } else if (vista === "inteligencia") {
    sub = `${plantName} · vector ${cat}`;
  } else {
    sub = `${sub}${sub ? " · " : ""}${anio} · ${etiquetaPeriodo(periodo)}`;
  }

  const showFilters = vista === "home" || vista === "vector" || vista === "huella";

  return (
    <header className="relative overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_88%_15%,rgba(14,124,134,.5),transparent_55%),linear-gradient(115deg,#00142C_0%,#012845_55%,#004a80_100%)] px-5 py-5 shadow-[0_10px_30px_rgba(0,20,44,.22)] sm:px-7">
      <div className="relative z-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <Button variant="subtle" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menú">
              <Menu className="size-5" />
            </Button>
            <SheetContent>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-[1.65rem] leading-tight font-extrabold tracking-tight text-white sm:text-[2rem]">{title}</h1>
            <p className="mt-1 text-sm font-medium text-[#9FC4E4]">{sub}</p>
          </div>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          {showFilters ? (
            <>
              <select className="select-panel" value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select className="select-panel" value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
                <option value="ALL">Año completo</option>
                <option value="Q1">Q1 (Ene–Mar)</option>
                <option value="Q2">Q2 (Abr–Jun)</option>
                <option value="Q3">Q3 (Jul–Sep)</option>
                <option value="Q4">Q4 (Oct–Dic)</option>
              </select>
            </>
          ) : null}
          <Button variant="subtle" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" /> PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
