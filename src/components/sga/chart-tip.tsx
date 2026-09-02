import type { ReactNode } from "react";

export const tooltipStyle = {
  backgroundColor: "rgba(0,20,44,.94)",
  border: "none",
  borderRadius: 10,
  padding: 12,
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
};

type TipItem = { dataKey?: string | number; name?: string; value?: number | string; color?: string };

export function ChartTip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TipItem[];
  label?: ReactNode;
  formatter?: (v: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      {label ? <div className="mb-1 text-[13px] font-bold">{label}</div> : null}
      {payload.map((p) => (
        <div key={String(p.dataKey ?? p.name)} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-sm" style={{ background: p.color }} />
          <span>
            {p.name}: {formatter ? formatter(Number(p.value), String(p.name)) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
