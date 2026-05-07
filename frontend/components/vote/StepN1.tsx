"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidCode } from "@/lib/utils";

type Props = {
  initial: string;
  onSubmit: (n1: string) => void;
};

export function StepN1({ initial, onSubmit }: Props) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);

  const error =
    touched && !isValidCode(value)
      ? "N1 must be 8–24 alphanumeric characters."
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
          <span className="absolute inset-0 rounded-xl bg-primary-500/40 blur-md" aria-hidden />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-primary-400/40">
            <Fingerprint className="h-5 w-5 text-primary-300" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Identity verification</h3>
          <p className="text-xs uppercase tracking-[.2em] text-slate-500">Eligibility check</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[.06] bg-ink-900/60 p-4 text-sm text-slate-300">
        <div className="absolute -left-8 top-0 h-full w-1 bg-primary-gradient" aria-hidden />
        <div className="flex items-start gap-3 pl-3">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
          <p>
            Enter your <strong className="text-white">N1 identification code</strong>. This proves you are an
            eligible voter without revealing your identity to the counting authority.
          </p>
        </div>
      </div>

      <Input
        label="N1 — Identification code"
        placeholder="ABC123456789"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        secret
        error={error}
        hint="Provided to you by the registration authority."
      />

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
