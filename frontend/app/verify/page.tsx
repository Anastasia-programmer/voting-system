"use client";

import { useState, type FormEvent } from "react";
import { Search, ShieldCheck, FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { api, HttpError } from "@/lib/api";
import { isValidCode } from "@/lib/utils";

type ResultKind = "success" | "warning" | "neutral";

export default function VerifyPage() {
  const [n2, setN2] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<{ message: string; kind: ResultKind } | null>(null);
  const { notify } = useToast();

  const error =
    touched && !isValidCode(n2)
      ? "N2 must be 8–24 alphanumeric characters."
      : undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValidCode(n2)) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await api.verifyVote(n2.trim());
      const lower = res.message.toLowerCase();
      const kind: ResultKind =
        lower.includes("counted") ? "success" :
        lower.includes("not found") ? "warning" :
        "neutral";
      setResult({ message: res.message, kind });
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Network error.";
      notify({ kind: "error", title: "Verification failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-xl px-4 py-12 sm:py-16">
      <div className="mb-8 text-center">
        <Badge variant="cyan" className="mx-auto">
          <FileSearch className="h-3 w-3" />
          Audit trail
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Verify your <span className="text-gradient">ballot</span>
        </h1>
      </div>

      <div className="gradient-border rounded-2xl">
        <Card variant="glass" className="overflow-hidden">
          <CardHeader>
            <div className="relative inline-block">
              <span className="absolute inset-0 rounded-xl bg-neon-cyan/40 blur-md" aria-hidden />
              <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-neon-cyan/40">
                <ShieldCheck className="h-5 w-5 text-neon-cyan" />
              </div>
            </div>
            <CardTitle className="mt-3">Confirmation lookup</CardTitle>
            <CardDescription>
              Enter your N2 confirmation code to check whether your ballot was
              received and counted. Identity stays protected.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="N2 — Confirmation code"
                placeholder="SECRET987654"
                value={n2}
                onChange={(e) => setN2(e.target.value)}
                onBlur={() => setTouched(true)}
                error={error}
                secret
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                <Search className="h-4 w-4" />
                Verify
              </Button>
            </form>

            {result && (
              <div
                className={`mt-6 relative overflow-hidden rounded-xl border p-5 animate-fade-in ${
                  result.kind === "success"
                    ? "border-neon-green/30 bg-neon-green/[.05]"
                    : result.kind === "warning"
                      ? "border-neon-amber/30 bg-neon-amber/[.05]"
                      : "border-primary-400/30 bg-primary-500/[.05]"
                }`}
              >
                <div
                  className={`absolute inset-y-0 left-0 w-1 ${
                    result.kind === "success" ? "bg-success-gradient" :
                    result.kind === "warning" ? "bg-neon-amber" :
                    "bg-primary-gradient"
                  }`}
                  aria-hidden
                />
                <div className="pl-3">
                  <Badge
                    variant={
                      result.kind === "success" ? "success" :
                      result.kind === "warning" ? "warning" : "primary"
                    }
                  >
                    Result
                  </Badge>
                  <p className="mt-2 text-sm text-white">{result.message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
