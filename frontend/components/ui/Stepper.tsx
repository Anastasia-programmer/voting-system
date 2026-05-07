import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { key: string; label: string };

type Props = {
  steps: ReadonlyArray<Step>;
  currentIndex: number;
};

export function Stepper({ steps, currentIndex }: Props) {
  const total = steps.length;

  return (
    <div className="space-y-4">
      {/* Progress meta */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-slate-500">
          Step <span className="text-primary-300">{currentIndex + 1}</span>
          <span className="mx-1.5 text-slate-600">/</span>
          {total}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-slate-500">
          {steps[currentIndex]?.label}
        </p>
      </div>

      {/* Track */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" aria-hidden />
        {/* Progress line with gradient + glow */}
        <div
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-primary-gradient bg-[length:200%_200%] animate-gradient-shift transition-[width] duration-700 ease-out"
          style={{
            width: total > 1 ? `${(currentIndex / (total - 1)) * 100}%` : "0%",
            boxShadow: "0 0 14px rgba(91,115,255,.6)",
          }}
          aria-hidden
        />

        <ol className="relative flex w-full items-center justify-between" aria-label="Voting progress">
          {steps.map((step, i) => {
            const isDone = i < currentIndex;
            const isActive = i === currentIndex;

            return (
              <li key={step.key} className="flex flex-col items-center gap-2">
                <div className="relative">
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-primary-500/40 blur-md animate-glow-pulse"
                    />
                  )}
                  <div
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      isDone &&
                        "bg-success-gradient text-ink-950 shadow-glow-green ring-2 ring-neon-green/50",
                      isActive &&
                        "bg-ink-800 text-primary-300 ring-2 ring-primary-400 shadow-glow",
                      !isDone &&
                        !isActive &&
                        "bg-ink-800/80 text-slate-500 ring-1 ring-white/10",
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <span className={cn("font-mono", isActive && "animate-pulse")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    "hidden text-[10px] font-semibold uppercase tracking-[.18em] sm:block transition-colors",
                    isActive ? "text-primary-200" : isDone ? "text-neon-green/80" : "text-slate-600",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
