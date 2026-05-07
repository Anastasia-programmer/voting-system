"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Check,
  EyeOff,
  PenLine,
  Shuffle,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CANDIDATES } from "@/lib/constants";
import { api, HttpError } from "@/lib/api";
import { cn, maskCode } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type Props = {
  n1: string;
  n2: string;
  voteValue: string;
  onBack: () => void;
  onSuccess: (signature: string) => void;
};

const STAGES = [
  { key: "blind", label: "Blinding ballot",       sub: "Masking vote payload",    icon: EyeOff },
  { key: "sign",  label: "Blind signature",       sub: "Administrator signs",     icon: PenLine },
  { key: "anon",  label: "Anonymizer routing",    sub: "Severing identity link",  icon: Shuffle },
  { key: "store", label: "Encrypted storage",     sub: "Counter-key encryption",  icon: Database },
];

export function StepSubmit({ n1, n2, voteValue, onBack, onSuccess }: Props) {
  const candidate = CANDIDATES.find((c) => c.id === voteValue);

  const [submitting, setSubmitting] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { notify } = useToast();

  useEffect(() => () => {
    if (stageTimer.current) clearInterval(stageTimer.current);
  }, []);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    setStageIndex(0);

    stageTimer.current = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 650);

    try {
      const res = await api.submitVote({ n1, n2, vote_value: voteValue });
      if (stageTimer.current) clearInterval(stageTimer.current);
      setStageIndex(STAGES.length);
      notify({ kind: "success", title: "Vote recorded", description: "Your ballot was signed and stored." });
      onSuccess(res.signature);
    } catch (err) {
      if (stageTimer.current) clearInterval(stageTimer.current);
      const message =
        err instanceof HttpError
          ? err.message
          : "Network error. Please try again.";
      setError(message);
      setStageIndex(-1);
      notify({ kind: "error", title: "Submission failed", description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Review pane */}
      <div className="relative overflow-hidden rounded-xl border border-white/[.06] bg-ink-900/60 p-5">
        <div className="absolute inset-0 opacity-30 grid-backdrop pointer-events-none" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[.22em] text-slate-400">
              Ballot summary
            </h3>
            <Badge variant="primary">Pending submission</Badge>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] uppercase tracking-[.22em] text-slate-500">N1</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-white">{maskCode(n1)}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[.22em] text-slate-500">N2</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-white">{maskCode(n2)}</dd>
            </div>
            <div className="sm:col-span-2 rounded-lg border border-primary-400/20 bg-primary-500/[.05] p-3">
              <dt className="text-[10px] uppercase tracking-[.22em] text-primary-300/80">Choice</dt>
              <dd className="mt-1 flex items-center gap-2 text-base font-semibold text-white">
                {candidate?.name ?? voteValue}
                {candidate?.party && <Badge variant="violet">{candidate.party}</Badge>}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cryptographic pipeline */}
      <div className="relative overflow-hidden rounded-xl border border-primary-400/20 bg-ink-900/40 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-primary-300" />
            Cryptographic pipeline
          </div>
          {submitting && (
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.2em] text-neon-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse" />
              Live
            </span>
          )}
        </div>

        <ol className="mt-5 grid gap-3">
          {STAGES.map((s, i) => {
            const done = stageIndex > i;
            const active = stageIndex === i;
            const Icon = s.icon;

            return (
              <li
                key={s.key}
                className={cn(
                  "relative flex items-center gap-4 rounded-lg border p-3 transition-all duration-300",
                  done && "border-neon-green/30 bg-neon-green/[.04]",
                  active && "border-primary-400/40 bg-primary-500/[.06] shadow-glow-sm",
                  !done && !active && "border-white/[.06] bg-ink-800/30",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1 bg-primary-gradient rounded-l-lg"
                  />
                )}
                <span
                  className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    done && "bg-success-gradient text-ink-950 shadow-glow-green",
                    active && "bg-ink-800 ring-2 ring-primary-400 text-primary-300",
                    !done && !active && "bg-ink-800/80 ring-1 ring-white/10 text-slate-500",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>

                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-semibold",
                    done && "text-neon-green",
                    active && "text-white",
                    !done && !active && "text-slate-400",
                  )}>
                    {s.label}
                  </p>
                  <p className="text-[11px] uppercase tracking-[.18em] text-slate-500">
                    {s.sub}
                  </p>
                </div>

                <span className="font-mono text-[10px] text-slate-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-xl border border-neon-red/40 bg-neon-red/[.06] p-4 animate-fade-in">
          <div className="absolute inset-y-0 left-0 w-1 bg-danger-gradient" aria-hidden />
          <p className="pl-3 text-sm text-neon-rose">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={handleSubmit} loading={submitting}>
          {submitting ? "Submitting securely…" : "Submit vote"}
        </Button>
      </div>
    </div>
  );
}
