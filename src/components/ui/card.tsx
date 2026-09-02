import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[18px] border border-line bg-card p-5 shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "relative mb-3 border-b border-line-2 pb-3 pl-3.5 text-[1.05rem] font-bold tracking-tight text-navy",
        "before:absolute before:top-1 before:bottom-3 before:left-0 before:w-1 before:rounded-full before:bg-linear-to-b before:from-blue before:to-teal",
        className,
      )}
      {...props}
    />
  );
}
