import { cn } from "@/lib/utils";

type Datum = { label: string; value: number; color: string };

type Props = {
  data: Datum[];
  size?: number;
  className?: string;
};

// Pure-SVG donut chart with conic gradient feel.
export function PieChart({ data, size = 180, className }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 18;

  let cumulative = 0;
  const segments = data.map((d) => {
    const fraction = total ? d.value / total : 0;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += fraction;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = fraction > 0.5 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { ...d, path, fraction };
  });

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <svg width={size} height={size} className="shrink-0">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {segments.map((s) => (
          <path
            key={s.label}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            style={{ filter: `drop-shadow(0 0 6px ${s.color}aa)` }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-white font-mono text-2xl font-bold">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="fill-slate-500 text-[10px] uppercase tracking-[.2em]">
          Total
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2.5">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}99` }}
            />
            <span className="text-slate-300">{d.label}</span>
            <span className="font-mono text-slate-500">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
