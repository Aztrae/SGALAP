import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "ok" | "warn" | "alert" | "muted" | "blue" }) {
  const tones = {
    ok: "bg-ok-bg text-ok border-emerald-200",
    warn: "bg-warn-bg text-warn border-amber-200",
    alert: "bg-alert-bg text-alert border-red-200",
    muted: "bg-paper text-muted border-line",
    blue: "bg-[#dbeafe] text-[#00447A] border-[#bfdbfe]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[0.7rem] font-extrabold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
