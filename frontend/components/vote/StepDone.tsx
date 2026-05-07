"use client";

import Link from "next/link";
import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

type Props = {
  signature?: string;
  onReset: () => void;
};

export function StepDone({ signature, onReset }: Props) {
  const { notify } = useToast();

  function copy() {
    if (!signature) return;
    navigator.clipboard.writeText(signature);
    notify({ kind: "info", title: "Receipt copied to clipboard" });
  }

  return (
    <div className="animate-fade-in space-y-7 text-center">
      {/* Big animated success seal */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-neon-green/40 animate-pulse-ring" />
        <span className="absolute inset-2 rounded-full bg-neon-green/30 animate-pulse-ring [animation-delay:.4s]" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success-gradient shadow-glow-green ring-4 ring-neon-green/20">
          <CheckCircle2 className="h-10 w-10 text-ink-950" strokeWidth={2.5} />
        </span>
      </div>

      <div className="space-y-2">
        <Badge variant="success" className="mx-auto">
          <ShieldCheck className="h-3 w-3" />
          Verified &amp; recorded
        </Badge>
        <h3 className="text-2xl font-bold tracking-tight text-white">Your vote is locked in</h3>
        <p className="mx-auto max-w-md text-sm text-slate-400">
          The encrypted ballot was signed by the administrator and persisted via the
          anonymizer. Use your N2 code anytime to verify counting.
        </p>
      </div>

      {signature && (
        <div className="relative overflow-hidden rounded-xl border border-white/[.06] bg-ink-900/60 p-5 text-left">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[.22em] text-slate-500">
              Cryptographic receipt
            </p>
            <Badge variant="cyan">RSA signature</Badge>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <code className="block flex-1 truncate rounded-lg bg-ink-950/80 px-3 py-2.5 font-mono text-xs text-primary-200 ring-1 ring-white/[.06]">
              {signature}
            </code>
            <button
              onClick={copy}
              className="rounded-lg p-2.5 text-slate-400 ring-1 ring-white/[.06] transition-all hover:text-white hover:bg-white/[.04] hover:ring-primary-400/40"
              aria-label="Copy receipt"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <Link href="/verify">
          <Button variant="neon">Verify my vote</Button>
        </Link>
        <Button variant="ghost" onClick={onReset}>Start over</Button>
      </div>
    </div>
  );
}
