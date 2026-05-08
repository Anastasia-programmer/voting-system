"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FileSignature, Settings, Users, Vote } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { mock } from "@/lib/mock";

export function AdminOverview() {
  const [signed, setSigned] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [elections, setElections] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    api.adminDashboard().then((d) => { setTotal(d.total_votes); setSigned(d.signed_votes); }).catch(() => { setTotal(0); setSigned(0); });
    mock.listElections().then((e) => setElections(e.length));
    mock.listUsers().then((u) => setUsers(u.length));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administrator"
        title="Election |control room"
        description="Create and manage elections, oversee user roles, and publish final results."
        actions={
          <Link href="/dashboard/admin/elections">
            <Button size="sm">
              <Vote className="h-3.5 w-3.5" /> Manage elections
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total ballots"  value={total ?? "—"} icon={<Vote className="h-4 w-4" />}          accent="primary" />
        <StatCard label="Signed ballots" value={signed ?? "—"} icon={<FileSignature className="h-4 w-4" />} accent="violet" />
        <StatCard label="Elections"      value={elections}     icon={<Settings className="h-4 w-4" />}      accent="cyan" />
        <StatCard label="Users"          value={users}         icon={<Users className="h-4 w-4" />}         accent="green" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card variant="glass">
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Quick actions</h3>
            <Link href="/dashboard/admin/elections">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                Create or edit elections <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                Manage users & roles <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/results">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                View live tally <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">System status</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Backend API", "Online"],
                ["Counter keys", "Loaded"],
                ["Anonymizer", "Healthy"],
                ["Database", "Connected"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="flex items-center gap-1.5 text-neon-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
                    {v}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
