import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export function KpiCard({
  title,
  value,
  unit,
  hint,
  tone = "blue",
  spark,
  className,
}: {
  title: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  tone?: "blue" | "teal" | "ok" | "warn" | "alert" | "navy";
  spark?: number[];
  className?: string;
}) {
  const border = {
    blue: "border-l-blue",
    teal: "border-l-teal",
    ok: "border-l-ok",
    warn: "border-l-warn",
    alert: "border-l-alert",
    navy: "border-l-navy",
  }[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] border border-line border-l-[6px] bg-linear-to-b from-white to-[#f5f9ff] p-5 shadow-[var(--shadow-card)]",
        border,
        className,
      )}
    >
      <div className="text-[0.72rem] font-bold tracking-[0.08em] text-muted uppercase">{title}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="tabular text-[2rem] leading-none font-extrabold tracking-tight text-navy">
          {value} {unit ? <span className="text-[0.85rem] font-bold tracking-normal text-cloud">{unit}</span> : null}
        </div>
        {spark && spark.length > 1 ? (
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark.map((v, i) => ({ i, v }))}>
                <Line type="monotone" dataKey="v" stroke="#017ACB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
      {hint ? <div className="mt-3 border-t border-line-2 pt-2.5 text-[0.82rem] leading-5 font-medium text-muted">{hint}</div> : null}
    </div>
  );
}
