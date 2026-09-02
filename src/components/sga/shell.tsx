import { useEffect } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { DataBar } from "./data-bar";
import { UnlockDialog } from "./unlock-dialog";
import { HomeView } from "./views/home";
import { VectorView } from "./views/vector";
import { HuellaView } from "./views/huella";
import { InteligenciaView } from "./views/inteligencia";
import { RecordsView } from "./views/records";
import { MetasView } from "./views/metas";
import { ConfigView } from "./views/config";
import { useSga } from "@/lib/sga/store";

export function SgaShell() {
  const boot = useSga((s) => s.boot);
  const ready = useSga((s) => s.ready);
  const vista = useSga((s) => s.vista);

  useEffect(() => {
    void boot();
  }, [boot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
            <Header />
            <div className="no-print flex flex-wrap items-center gap-3 rounded-[14px] border border-white/10 bg-navy px-4 py-3 text-white">
              <p className="min-w-[16rem] flex-1 text-sm leading-5">
                <span className="font-bold">Intranet sin internet.</span> El paquete es una carpeta: página + Excel + librerías. Se copia al NAS/IIS y cualquiera la abre. Cada mes solo se sustituye el .xlsx.
              </p>
              <a
                href="/Panel_SGA_Lapisa.zip"
                download
                className="inline-flex h-10 items-center rounded-[10px] bg-teal px-4 text-sm font-bold text-white hover:opacity-90"
              >
                Descargar paquete
              </a>
              <a
                href="/intranet/index.html"
                className="inline-flex h-10 items-center rounded-[10px] border border-white/20 px-4 text-sm font-bold text-white hover:bg-white/10"
              >
                Probar página NAS
              </a>
            </div>
            <DataBar />
            {!ready ? (
              <div className="rounded-[18px] border border-line bg-white p-10 text-center text-muted">Cargando panel…</div>
            ) : (
              <>
                {vista === "home" && <HomeView />}
                {vista === "vector" && <VectorView />}
                {vista === "huella" && <HuellaView />}
                {vista === "inteligencia" && <InteligenciaView />}
                {vista === "records" && <RecordsView />}
                {vista === "metas" && <MetasView />}
                {vista === "config" && <ConfigView />}
              </>
            )}
          </div>
        </div>
      </div>
      <UnlockDialog />
    </div>
  );
}
