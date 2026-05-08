"use client";

import { useEffect, useState } from "react";
import { BarChart3, RefreshCw, Trophy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BarChart } from "@/components/ui/BarChart";
import { PieChart } from "@/components/ui/PieChart";
import { api } from "@/lib/api";
import { CANDIDATES } from "@/lib/constants";
import type { CountVotesResponse } from "@/lib/types";
import { useRequireAuth } from "@/hooks/useAuth";

const COLORS = ["#3b50ff", "#8b5cf6", "#22d3ee", "#22c55e", "#f59e0b", "#fb7185"];

function labelFor(id: string): string {
  return CANDIDATES.find((c) => c.id === id)?.name ?? id;
}

export default function CounterResultsPage() {
  useRequireAuth(["counter", "admin", "commissioner"]);
  const [data, setData] = useState<CountVotesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try { setData(await api.countVotes()); } catch { setData({ total_votes: 0, results: {} }); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const entries = data ? Object.entries(data.results).map(([k, v]) => ({ label: labelFor(k), value: v })) : [];
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  const winner = sorted[0];
  const total = entries.reduce((s, e) => s + e.value, 0);

  const pieData = entries.map((e, i) => ({ ...e, color: COLORS[i % COLORS.length] }));

  return (
    <div>
      <PageHeader
        eyebrow="Counter"
        title="Final |tally"
        description="Decrypted, aggregated, and verified results — ready for publication."
        actions={
          <Button variant="secondary" size="sm" onClick={load} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      {winner && total > 0 && (
        <Card variant="glass" className="mb-6">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-gradient shadow-glow-green">
                <Trophy className="h-6 w-6 text-ink-950" strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[.22em] text-neon-green">Leading</p>
                <p className="mt-0.5 text-2xl font-bold text-white">{winner.label}</p>
                <p className="text-xs text-slate-500">{winner.value} ballots · {Math.round((winner.value / total) * 100)}% share</p>
              </div>
            </div>
            <Badge variant="success">Winner</Badge>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <Card variant="glass">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.18em] text-slate-400">
              <BarChart3 className="h-4 w-4 text-primary-300" /> Distribution
            </div>
            {entries.length === 0
              ? <p className="text-sm text-slate-500">No votes recorded yet.</p>
              : <BarChart data={entries} />
            }
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="space-y-4 p-6">
            <div className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Share</div>
            {pieData.length === 0
              ? <p className="text-sm text-slate-500">Nothing to chart.</p>
              : <PieChart data={pieData} />
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
