import { cn } from "@/lib/utils";

type Datum = { label: string; value: number };

type Props = {
  data: Datum[];
  max?: number;
  highlightTop?: boolean;
  className?: string;
};

export function BarChart({ data, max, highlightTop = true, className }: Props) {
  if (!data.length) return null;
  const computedMax = max ?? (data.reduce((m, d) => Math.max(m, d.value), 0) || 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const palette = [
    "from-primary-500 via-violet-500 to-neon-cyan",
    "from-violet-500 via-primary-500 to-violet-600",
    "from-neon-cyan via-primary-400 to-violet-500",
    "from-primary-400 to-violet-400",
  ];

  return (
    <ul className={cn("space-y-4", className)}>
      {sorted.map((d, i) => {
        const pct = (d.value / computedMax) * 100;
        const share = total ? Math.round((d.value / total) * 100) : 0;
        const isLeader = highlightTop && i === 0 && d.value > 0;
        return (
          <li key={d.label} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-white">{d.label}</span>
                {isLeader && (
                  <span className="rounded-full bg-neon-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-neon-green ring-1 ring-inset ring-neon-green/30">
                    Leading
                  </span>
                )}
              </span>
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-slate-500">{share}%</span>
                <span className="font-mono text-base font-bold text-white">{d.value}</span>
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-ink-800/80 ring-1 ring-inset ring-white/[.06]">
              <div
                className={cn("relative h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-out shadow-glow-sm", palette[i % palette.length])}
                style={{ width: `${pct}%` }}
              >
                <span className="absolute inset-0 shimmer rounded-full" aria-hidden />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
