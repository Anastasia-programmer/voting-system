"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Eye, Calculator, FileSignature } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { CANDIDATES } from "@/lib/constants";
import { BarChart } from "@/components/ui/BarChart";
import type { CountVotesResponse } from "@/lib/types";

function labelFor(id: string): string {
  return CANDIDATES.find((c) => c.id === id)?.name ?? id;
}

export function CounterOverview() {
  const [data, setData] = useState<CountVotesResponse | null>(null);

  useEffect(() => { api.countVotes().then(setData).catch(() => setData({ total_votes: 0, results: {} })); }, []);

  const entries = data ? Object.entries(data.results).map(([k, v]) => ({ label: labelFor(k), value: v })) : [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Counter"
        title="Tally |operations"
        description="Decrypt aggregated votes and publish the official tally. Individual ballots remain unlinkable to voters."
        actions={
          <Link href="/dashboard/counter/results">
            <Button size="sm"><BarChart3 className="h-3.5 w-3.5" /> Open results</Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Encrypted ballots" value={data?.total_votes ?? "—"} icon={<Eye className="h-4 w-4" />} accent="primary" />
        <StatCard label="Decrypted"          value={(data?.total_votes ?? 0) - (data?.undecryptable ?? 0)} icon={<Calculator className="h-4 w-4" />} accent="green" />
        <StatCard label="Undecryptable"      value={data?.undecryptable ?? 0} icon={<FileSignature className="h-4 w-4" />} accent="red" hint="Encrypted under a previous counter key" />
      </div>

      <Card variant="glass">
        <CardContent className="space-y-4 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Live distribution</h3>
          {entries.length === 0
            ? <p className="text-sm text-slate-500">No votes recorded yet.</p>
            : <BarChart data={entries} />
          }
        </CardContent>
      </Card>
    </div>
  );
}
