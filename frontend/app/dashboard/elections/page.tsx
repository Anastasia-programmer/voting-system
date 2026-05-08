"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Vote } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { mock } from "@/lib/mock";
import type { Election } from "@/lib/types";

const STATUS_VARIANT: Record<Election["status"], "success" | "warning" | "neutral" | "primary"> = {
  active: "success",
  draft: "warning",
  closed: "neutral",
  published: "primary",
};

export default function ElectionsListPage() {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => { mock.listElections().then(setElections); }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Voter"
        title="Available |elections"
        description="Active elections are open for voting. Published elections show the final results."
      />

      {elections.length === 0 ? (
        <EmptyState
          icon={<Vote className="h-5 w-5" />}
          title="No elections to show"
          description="Check back soon — the registration authority is preparing the next vote."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {elections.map((e) => (
            <Card key={e.id} variant="glass" className="transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white">{e.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{e.description}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[e.status]} className="shrink-0 capitalize">{e.status}</Badge>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="uppercase tracking-[.18em] text-slate-500">Starts</dt>
                    <dd className="mt-0.5 font-mono text-slate-200">{new Date(e.starts_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[.18em] text-slate-500">Ends</dt>
                    <dd className="mt-0.5 font-mono text-slate-200">{new Date(e.ends_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[.18em] text-slate-500">Options</dt>
                    <dd className="mt-0.5 font-mono text-slate-200">{e.candidates.length}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[.18em] text-slate-500">Turnout</dt>
                    <dd className="mt-0.5 font-mono text-slate-200">
                      {e.ballots_cast ?? 0}/{e.eligible_voters ?? "—"}
                    </dd>
                  </div>
                </dl>

                <Link href={`/dashboard/elections/${e.id}`}>
                  <Button size="sm" className="w-full" variant={e.status === "active" ? "primary" : "secondary"}>
                    {e.status === "active" ? "Cast ballot" : e.status === "published" ? "View results" : "View details"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
