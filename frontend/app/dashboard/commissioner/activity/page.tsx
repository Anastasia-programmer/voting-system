"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TR, TH, TD, EmptyRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mock } from "@/lib/mock";
import { useRequireAuth } from "@/hooks/useAuth";
import type { ActivityEvent } from "@/lib/types";

export default function CommissionerActivityPage() {
  useRequireAuth(["commissioner", "admin"]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setEvents(await mock.recentActivity(50));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Commissioner"
        title="Activity |feed"
        description="Append-only log of system events. Useful for after-the-fact audit."
        actions={
          <Button variant="secondary" size="sm" onClick={load} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Time</TH>
                <TH>Event</TH>
                <TH>Actor role</TH>
              </TR>
            </THead>
            <tbody>
              {events.length === 0 ? (
                <EmptyRow colSpan={3} label="No activity yet." />
              ) : (
                events.map((e) => (
                  <TR key={e.id}>
                    <TD className="font-mono text-xs text-slate-400">{new Date(e.created_at).toLocaleString()}</TD>
                    <TD>
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-primary-300">
                        <Activity className="h-3 w-3" /> {e.action}
                      </span>
                    </TD>
                    <TD><Badge variant="violet" className="capitalize">{e.user_role}</Badge></TD>
                  </TR>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
