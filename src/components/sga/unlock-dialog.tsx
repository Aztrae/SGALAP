import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSga } from "@/lib/sga/store";

export function UnlockDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const tryUnlock = useSga((s) => s.tryUnlock);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("sga:unlock", on);
    return () => window.removeEventListener("sga:unlock", on);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Desbloquear gestión corporativa</DialogTitle>
        <DialogDescription>
          Huella, récords, metas y parámetros quedan detrás del código de edición para evitar cambios accidentales. No es un sistema de
          usuarios: cualquiera con el código puede editar en este navegador.
        </DialogDescription>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (tryUnlock(code)) {
              setOpen(false);
              setCode("");
              setErr("");
            } else setErr("Código incorrecto.");
          }}
        >
          <Input
            type="password"
            autoFocus
            placeholder="Código de edición"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {err ? <p className="text-sm font-semibold text-alert">{err}</p> : null}
          <Button type="submit">Entrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
