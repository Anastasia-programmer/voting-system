"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ShieldAlert, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { mock } from "@/lib/mock";
import type { ActivityEvent, CommissionerDashboardResponse } from "@/lib/types";

export function CommissionerOverview() {
  const [stats, setStats] = useState<CommissionerDashboardResponse | null>(null);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    api.commissionerDashboard().then(setStats).catch(() => setStats({ total_voter_codes: 0, used_codes: 0, unused_codes: 0 }));
    mock.listComplaints().then((c) => setOpenComplaints(c.filter((x) => x.status !== "resolved").length));
    mock.recentActivity().then(setActivity);
  }, []);

  const turnout = stats && stats.total_voter_codes > 0
    ? Math.round((stats.used_codes / stats.total_voter_codes) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Commissioner"
        title="Election |oversight"
        description="Monitor voter participation, audit the activity feed, and resolve open complaints."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Voter codes"      value={stats?.total_voter_codes ?? "—"} icon={<Users className="h-4 w-4" />}      accent="primary" />
        <StatCard label="Codes used"        value={stats?.used_codes ?? "—"}        icon={<Activity className="h-4 w-4" />}    accent="green" />
        <StatCard label="Turnout"           value={`${turnout}%`}                    icon={<Activity className="h-4 w-4" />}    accent="violet" hint="Used / total" />
        <StatCard label="Open complaints"   value={openComplaints}                   icon={<ShieldAlert className="h-4 w-4" />} accent="red" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Recent activity</h3>
              <Link href="/dashboard/commissioner/activity" className="text-xs text-primary-300 hover:text-primary-200">Open log →</Link>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-white/[.04] bg-ink-800/40 p-3">
                  <span className="font-mono text-xs text-primary-300">{a.action}</span>
                  <span className="text-xs text-slate-500 capitalize">{a.user_role}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Quick links</h3>
            <Link href="/dashboard/commissioner/complaints">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                Review complaints ({openComplaints} open) <ShieldAlert className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/results">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                Live tally
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
