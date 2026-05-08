"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BarChart3, Vote as VoteIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mock } from "@/lib/mock";
import { BarChart } from "@/components/ui/BarChart";
import type { Election } from "@/lib/types";

export default function ElectionDetailsPage() {
  const params = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);

  useEffect(() => {
    if (params?.id) mock.getElection(params.id).then(setElection);
  }, [params?.id]);

  if (!election) {
    return <p className="text-sm text-slate-500">Loading election…</p>;
  }

  // Simulated final tally for published elections.
  const fakeResults =
    election.status === "published"
      ? election.candidates.map((c, i) => ({ label: c.name, value: 100 + (i * 137) % 423 }))
      : null;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/elections"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[.18em] text-slate-500 hover:text-primary-300"
      >
        <ArrowLeft className="h-3 w-3" /> Back to elections
      </Link>

      <PageHeader
        eyebrow={election.status}
        title={election.title}
        description={election.description}
        actions={
          election.status === "active" ? (
            <Link href="/vote">
              <Button>
                <VoteIcon className="h-4 w-4" /> Cast ballot
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="glass">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Candidates</h3>
            <ul className="mt-4 space-y-2">
              {election.candidates.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 rounded-lg border border-white/[.06] bg-ink-800/40 p-3">
                  <div>
                    <p className="font-medium text-white">{c.name}</p>
                    {c.description && <p className="mt-0.5 text-xs text-slate-500">{c.description}</p>}
                  </div>
                  {c.party && <Badge variant="violet">{c.party}</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Details</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[.18em] text-slate-500">Status</dt>
                <dd className="mt-1 capitalize text-white">{election.status}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[.18em] text-slate-500">Turnout</dt>
                <dd className="mt-1 font-mono text-white">
                  {election.ballots_cast ?? 0}/{election.eligible_voters ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[.18em] text-slate-500">Starts</dt>
                <dd className="mt-1 font-mono text-white">{new Date(election.starts_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[.18em] text-slate-500">Ends</dt>
                <dd className="mt-1 font-mono text-white">{new Date(election.ends_at).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {fakeResults && (
        <Card variant="glass">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">
                Final results
              </h3>
              <Badge variant="primary"><BarChart3 className="h-3 w-3" /> Published</Badge>
            </div>
            <BarChart data={fakeResults} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
