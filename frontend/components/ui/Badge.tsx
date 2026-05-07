import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "primary" | "success" | "warning" | "danger" | "cyan" | "violet";

const styles: Record<Variant, string> = {
  neutral: "bg-white/[.04] text-slate-300 ring-1 ring-inset ring-white/10",
  primary: "bg-primary-500/10 text-primary-300 ring-1 ring-inset ring-primary-400/30",
  success: "bg-neon-green/10 text-neon-green ring-1 ring-inset ring-neon-green/30",
  warning: "bg-neon-amber/10 text-neon-amber ring-1 ring-inset ring-neon-amber/30",
  danger:  "bg-neon-red/10 text-neon-red ring-1 ring-inset ring-neon-red/30",
  cyan:    "bg-neon-cyan/10 text-neon-cyan ring-1 ring-inset ring-neon-cyan/30",
  violet:  "bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/30",
};

export function Badge({
  variant = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[.16em]",
        styles[variant],
        className,
      )}
      {...rest}
    />
  );
}
