"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidCode } from "@/lib/utils";

type Props = {
  initial: string;
  onBack: () => void;
  onSubmit: (n2: string) => void;
};

export function StepN2({ initial, onBack, onSubmit }: Props) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);

  const error =
    touched && !isValidCode(value)
      ? "N2 must be 8–24 alphanumeric characters."
      : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isValidCode(value)) onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute inset-0 rounded-xl bg-neon-cyan/40 blur-md" aria-hidden />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-neon-cyan/40">
            <Lock className="h-5 w-5 text-neon-cyan" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Confirmation token</h3>
          <p className="text-xs uppercase tracking-[.2em] text-slate-500">Hash-verified</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-neon-amber/20 bg-neon-amber/[.04] p-4 text-sm text-amber-100">
        <div className="absolute -left-8 top-0 h-full w-1 bg-neon-amber" aria-hidden />
        <div className="flex items-start gap-3 pl-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-neon-amber" />
          <p>
            The server only verifies a one-way hash of your{" "}
            <strong className="text-white">N2 code</strong>. Your code itself is never stored or transmitted in plaintext.
          </p>
        </div>
      </div>

      <Input
        label="N2 — Confirmation code"
        placeholder="SECRET987654"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        secret
        error={error}
        hint="Save this code — you will need it later to verify your vote."
      />

      <div className="flex items-center justify-between">
        <Button variant="ghost" type="button" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" size="lg">
          Review &amp; submit
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
