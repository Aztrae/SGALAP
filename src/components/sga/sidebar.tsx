import type { ReactNode } from "react";
import {
  BarChart3,
  Brain,
  Building2,
  Droplets,
  Factory,
  FlaskConical,
  Fuel,
  Globe2,
  LayoutDashboard,
  Lock,
  Recycle,
  Settings,
  Shield,
  Sprout,
  Target,
  Trophy,
  Unlock,
  Zap,
} from "lucide-react";
import { plantaTieneVector } from "@/lib/sga/catalog";
import { useSga } from "@/lib/sga/store";
import type { Planta, VectorId, Vista } from "@/lib/sga/types";
import { cn } from "@/lib/utils";

const ICONS = {
  factory: Factory,
  sprout: Sprout,
  flask: FlaskConical,
  building: Building2,
};

const VECTORES: { id: VectorId; label: string; icon: typeof Zap }[] = [
  { id: "Energia", label: "Energía", icon: Zap },
  { id: "Agua", label: "Agua", icon: Droplets },
  { id: "Residuos", label: "Residuos", icon: Recycle },
  { id: "Combustibles", label: "Combustibles", icon: Fuel },
];

function NavBtn({
  active,
  onClick,
  children,
  dim,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] px-3.5 py-3 text-left text-[0.9rem] font-semibold text-slate-300 transition-colors hover:bg-white/8",
        active && "rounded-l-none border-l-4 border-[#0E9AE0] bg-linear-to-r from-[#017ACB]/35 to-[#017ACB]/8 text-white",
        dim && "opacity-40",
      )}
    >
      {children}
    </button>
  );
}

export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
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

  const go = (fn: () => void) => {
    fn();
    onNavigate?.();
  };

  return (
    <>
      <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-linear-to-br from-teal to-blue shadow-[0_4px_14px_rgba(1,122,203,.4)]">
          <BarChart3 className="size-5 text-white" />
        </div>
        <div>
          <div className="text-[1.05rem] leading-tight font-extrabold text-white">Panel SGA</div>
          <div className="mt-0.5 text-[0.72rem] font-semibold tracking-wide text-[#8FB4D6]">Lapisa · Sustentabilidad</div>
        </div>
      </div>

      <Section title="Ubicación">
        <div className={cn("flex flex-col gap-1.5 rounded-[14px] bg-black/20 p-2", corporateDim && "opacity-40")}>
          {plantas.map((p) => (
            <PlantBtn key={p.id} p={p} active={p.id === plantaActual && !corporateDim} onClick={() => go(() => setPlanta(p.id))} />
          ))}
        </div>
      </Section>

      <Section title="Vectores">
        {VECTORES.map((v) => {
          if (planta && !plantaTieneVector(planta, v.id)) return null;
          const Icon = v.icon;
          return (
            <NavBtn key={v.id} active={vista === "vector" && catActual === v.id} onClick={() => go(() => setCategoria(v.id))}>
              <Icon className="size-4" /> {v.label}
            </NavBtn>
          );
        })}
      </Section>

      <Section title="Gestión">
        <NavBtn active={vista === "home"} onClick={() => go(() => setVista("home"))}>
          <LayoutDashboard className="size-4" /> Resumen ejecutivo
        </NavBtn>
        {!unlocked ? (
          <NavBtn onClick={() => go(() => window.dispatchEvent(new Event("sga:unlock")))}>
            <Lock className="size-4" /> Desbloquear vistas
          </NavBtn>
        ) : (
          <>
            <NavBtn active={vista === "inteligencia"} onClick={() => go(() => setVista("inteligencia"))}>
              <Brain className="size-4" /> Inteligencia operativa
            </NavBtn>
            <NavBtn active={vista === "huella"} onClick={() => go(() => setVista("huella"))}>
              <Globe2 className="size-4" /> Huella de carbono
            </NavBtn>
            <NavBtn active={vista === "records"} onClick={() => go(() => setVista("records"))}>
              <Trophy className="size-4" /> Máximos y mínimos
            </NavBtn>
            <NavBtn active={vista === "metas"} onClick={() => go(() => setVista("metas"))}>
              <Target className="size-4" /> Metas y límites
            </NavBtn>
            <NavBtn active={vista === "config"} onClick={() => go(() => setVista("config"))}>
              <Settings className="size-4" /> Parámetros
            </NavBtn>
            <NavBtn onClick={() => go(() => lock())}>
              <Unlock className="size-4" /> Bloquear sesión
            </NavBtn>
          </>
        )}
      </Section>

      <div className="mt-auto pt-4 text-[0.68rem] leading-4 text-[#7C93AC]">
        <Shield className="mr-1 inline size-3" />
        Las vistas corporativas se protegen con el código de edición. El Excel se busca solo en la misma carpeta del panel.
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 border-l-[3px] border-blue pl-2.5 text-[0.7rem] font-bold tracking-[0.18em] text-[#7C93AC] uppercase">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function PlantBtn({ p, active, onClick }: { p: Planta; active: boolean; onClick: () => void }) {
  const Icon = ICONS[p.icono] ?? Building2;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[10px] border border-white/5 px-3.5 py-3 text-left text-[0.85rem] font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white",
        active &&
          "translate-x-0.5 border-[#0164BD] bg-linear-to-r from-[#0E9AE0] to-[#00447A] text-white shadow-[0_6px_16px_rgba(1,122,203,.45)]",
      )}
    >
      <Icon className="size-4" /> {p.nombre}
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="no-print relative hidden w-[280px] shrink-0 flex-col overflow-y-auto bg-[radial-gradient(circle_at_15%_-10%,rgba(1,122,203,.35),transparent_45%),linear-gradient(160deg,#00142C_0%,#012845_55%,#003A63_100%)] px-5 py-7 text-white lg:flex">
      <SidebarBody />
    </aside>
  );
}
