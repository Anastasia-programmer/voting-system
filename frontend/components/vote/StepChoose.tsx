"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Vote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CANDIDATES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  initial: string;
  onBack: () => void;
  onSubmit: (voteValue: string) => void;
};

export function StepChoose({ initial, onBack, onSubmit }: Props) {
  const [selected, setSelected] = useState(initial);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute inset-0 rounded-xl bg-violet-500/40 blur-md" aria-hidden />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-violet-500/40">
            <Vote className="h-5 w-5 text-violet-400" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Choose your ballot</h3>
          <p className="text-xs uppercase tracking-[.2em] text-slate-500">Encrypted before transit</p>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Your selection is encrypted on submission and routed through the anonymizer —
        no observer can correlate this choice with your identity.
      </p>

      <fieldset className="grid gap-3">
        <legend className="sr-only">Candidates</legend>
        {CANDIDATES.map((c, i) => {
          const isSelected = selected === c.id;
          return (
            <label
              key={c.id}
              className={cn(
                "group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300",
                isSelected
                  ? "border-primary-400/60 bg-primary-500/[.08] shadow-glow-sm"
                  : "border-white/[.06] bg-ink-800/40 hover:border-primary-400/30 hover:bg-ink-700/50 hover:-translate-y-0.5",
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <input
                type="radio"
                name="vote"
                value={c.id}
                checked={isSelected}
                onChange={() => setSelected(c.id)}
                className="sr-only"
              />

              {/* Radio dot */}
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isSelected
                    ? "bg-primary-gradient ring-2 ring-primary-400/40 shadow-glow-sm"
                    : "ring-1 ring-white/15 bg-ink-900 group-hover:ring-primary-400/40",
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
              </span>

              {/* Numeric ID badge */}
              <span
                className={cn(
                  "mt-0.5 hidden font-mono text-[10px] font-semibold tracking-widest sm:block",
                  isSelected ? "text-primary-300" : "text-slate-600",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cn("font-semibold", isSelected ? "text-white" : "text-slate-100")}>
                    {c.name}
                  </span>
                  {c.party && (
                    <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
                      {c.party}
                    </span>
                  )}
                </span>
                {c.description && (
                  <span className="mt-1 block text-sm text-slate-400">
                    {c.description}
                  </span>
                )}
              </span>

              {/* Glow line on selection */}
              {isSelected && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-primary-gradient"
                />
              )}
            </label>
          );
        })}
      </fieldset>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          disabled={!selected}
          onClick={() => onSubmit(selected)}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
