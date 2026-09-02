import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[10px] border-2 border-line bg-white px-3 text-sm font-semibold text-navy outline-none focus:border-blue",
        className,
      )}
      {...props}
    />
  );
}
