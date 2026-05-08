"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ScrollText, ShieldCheck, Vote, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mock } from "@/lib/mock";
import type { Election } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

export function VoterOverview() {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [history, setHistory] = useState<Awaited<ReturnType<typeof mock.myVoteHistory>>>([]);

  useEffect(() => {
    mock.listElections().then(setElections);
    mock.myVoteHistory().then(setHistory);
  }, []);

  const active = elections.filter((e) => e.status === "active");
  const upcoming = elections.filter((e) => e.status === "draft");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Welcome back, ${user?.full_name?.split(" ")[0] ?? "voter"}`}
        title="Your |voting workspace"
        description="Track active elections, cast your ballot, and verify previously submitted votes — all from one place."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active elections" value={active.length} icon={<Vote className="h-4 w-4" />} accent="primary" />
        <StatCard label="Upcoming"          value={upcoming.length} icon={<Calendar className="h-4 w-4" />} accent="violet" />
        <StatCard label="Ballots cast"      value={history.length} icon={<ScrollText className="h-4 w-4" />} accent="cyan" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Active elections</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {active.map((e) => (
            <Card key={e.id} variant="glass">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{e.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{e.description}</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{e.candidates.length} options</span>
                  <span>Ends {new Date(e.ends_at).toLocaleDateString()}</span>
                </div>
                <Link href={`/dashboard/elections/${e.id}`}>
                  <Button size="sm" className="w-full">
                    Cast ballot <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {active.length === 0 && (
            <Card variant="glass">
              <CardContent className="p-6 text-sm text-slate-400">No active elections right now.</CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Recent activity</h2>
          <Link href="/dashboard/my-votes" className="text-xs text-primary-300 hover:text-primary-200">View all →</Link>
        </div>
        <Card variant="glass">
          <CardContent className="divide-y divide-white/[.04] p-0">
            {history.slice(0, 3).map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-green/10 text-neon-green ring-1 ring-neon-green/30">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{h.election}</p>
                    <p className="text-xs text-slate-500">Submitted {new Date(h.date).toLocaleString()}</p>
                  </div>
                </div>
                <code className="hidden font-mono text-xs text-primary-300 sm:block">{h.signature}</code>
              </div>
            ))}
            {history.length === 0 && (
              <div className="p-6 text-sm text-slate-400">No votes recorded yet.</div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
