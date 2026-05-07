"use client";

import { useEffect, useState } from "react";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api, HttpError } from "@/lib/api";
import type { CountVotesResponse } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { CANDIDATES } from "@/lib/constants";

function labelFor(id: string): string {
  return CANDIDATES.find((c) => c.id === id)?.name ?? id;
}

export default function ResultsPage() {
  const [data, setData] = useState<CountVotesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  async function load() {
    setLoading(true);
    try {
      setData(await api.countVotes());
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Network error.";
      notify({ kind: "error", title: "Could not load results", description: message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = data ? Object.entries(data.results) : [];
  const total = data?.total_votes ?? 0;
  const max = entries.reduce((m, [, v]) => Math.max(m, v), 0);
  const sorted = [...entries].sort(([, a], [, b]) => b - a);

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Badge variant="violet">
            <TrendingUp className="h-3 w-3" />
            Live tally
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Decrypted <span className="text-gradient">results</span>
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={load} loading={loading}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      <div className="gradient-border rounded-2xl">
        <Card variant="glass" className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="relative inline-block">
                  <span className="absolute inset-0 rounded-xl bg-violet-500/40 blur-md" aria-hidden />
                  <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-violet-500/40">
                    <BarChart3 className="h-5 w-5 text-violet-400" />
                  </div>
                </div>
                <CardTitle className="mt-3">Aggregated tally</CardTitle>
                <CardDescription>
                  Decrypted by the counting authority after stripping all identity
                  metadata. Individual votes remain unlinkable to voters.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Total */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[.06] bg-ink-900/40 p-4">
                <p className="text-[10px] uppercase tracking-[.22em] text-slate-500">
                  Total ballots
                </p>
                <p className="mt-1 font-mono text-3xl font-bold text-gradient">
                  {total.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-white/[.06] bg-ink-900/40 p-4">
                <p className="text-[10px] uppercase tracking-[.22em] text-slate-500">
                  Distinct options
                </p>
                <p className="mt-1 font-mono text-3xl font-bold text-white">
                  {entries.length.toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            {entries.length === 0 && !loading && (
              <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                No votes recorded yet.
              </p>
            )}

            <ul className="space-y-4">
              {sorted.map(([id, count], i) => {
                const pct = max ? (count / max) * 100 : 0;
                const sharePct = total ? Math.round((count / total) * 100) : 0;
                const palette = [
                  "from-primary-500 via-violet-500 to-neon-cyan",
                  "from-violet-500 via-primary-500 to-violet-600",
                  "from-neon-cyan via-primary-400 to-violet-500",
                  "from-primary-400 to-violet-400",
                ];
                const grad = palette[i % palette.length];

                return (
                  <li key={id} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-slate-600">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-white">{labelFor(id)}</span>
                        {i === 0 && total > 0 && <Badge variant="success">Leading</Badge>}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-slate-500">{sharePct}%</span>
                        <span className="font-mono text-base font-bold text-white">{count}</span>
                      </div>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-ink-800/80 ring-1 ring-inset ring-white/[.06]">
                      <div
                        className={`relative h-full rounded-full bg-gradient-to-r ${grad} transition-[width] duration-1000 ease-out shadow-glow-sm`}
                        style={{ width: `${pct}%` }}
                      >
                        <span className="absolute inset-0 shimmer rounded-full" aria-hidden />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
