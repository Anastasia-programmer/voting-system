import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "violet" | "cyan" | "green" | "red";
  className?: string;
};

const accentRing: Record<NonNullable<Props["accent"]>, string> = {
  primary: "ring-primary-400/30 from-primary-500/20",
  violet:  "ring-violet-500/30 from-violet-500/20",
  cyan:    "ring-neon-cyan/30 from-neon-cyan/20",
  green:   "ring-neon-green/30 from-neon-green/20",
  red:     "ring-neon-red/30 from-neon-red/20",
};

const accentText: Record<NonNullable<Props["accent"]>, string> = {
  primary: "text-primary-300",
  violet:  "text-violet-400",
  cyan:    "text-neon-cyan",
  green:   "text-neon-green",
  red:     "text-neon-red",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "primary",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[.06] bg-ink-900/40 backdrop-blur-md p-5 transition-all hover:-translate-y-0.5 hover:border-white/15",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl bg-gradient-to-br",
          accentRing[accent],
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-slate-500">
          {label}
        </p>
        {icon && (
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 ring-1", accentRing[accent])}>
            <span className={accentText[accent]}>{icon}</span>
          </span>
        )}
      </div>
      <p className="relative mt-3 font-mono text-3xl font-bold text-white">{value}</p>
      {hint && <p className="relative mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
