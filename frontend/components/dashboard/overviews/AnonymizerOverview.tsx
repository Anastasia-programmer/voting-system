"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Network, ServerCog, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { mock } from "@/lib/mock";

export function AnonymizerOverview() {
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof mock.anonymizerLogs>>>([]);
  const [running, setRunning] = useState(false);
  const { notify } = useToast();

  useEffect(() => { mock.anonymizerLogs().then(setLogs); }, []);

  async function trigger() {
    setRunning(true);
    try {
      const res = await api.anonymizeVotes();
      notify({ kind: "success", title: "Anonymization run", description: res.message });
    } catch {
      notify({ kind: "error", title: "Run failed" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Anonymizer"
        title="Mixing |network status"
        description="Severs identity-vote linkage by stripping metadata before ballots reach the counter."
        actions={
          <Button size="sm" onClick={trigger} loading={running}>
            <Zap className="h-3.5 w-3.5" /> Run anonymization pass
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Channels open" value="4 / 4"   icon={<Network className="h-4 w-4" />}    accent="primary" />
        <StatCard label="Last batch"    value="184"     icon={<Activity className="h-4 w-4" />}   accent="violet" hint="Ballots forwarded" />
        <StatCard label="Mixing entropy" value="3.91"   icon={<Zap className="h-4 w-4" />}        accent="cyan" hint="Bits per ballot" />
        <StatCard label="System"        value="Healthy" icon={<ServerCog className="h-4 w-4" />}  accent="green" />
      </div>

      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-400">Recent log entries</h3>
            <Link href="/dashboard/anonymizer/logs" className="text-xs text-primary-300 hover:text-primary-200">Open log →</Link>
          </div>
          <ul className="mt-4 space-y-2 font-mono text-xs">
            {logs.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-start gap-3 rounded-lg border border-white/[.04] bg-ink-800/40 p-3">
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                  l.level === "ok" ? "bg-neon-green" : l.level === "warn" ? "bg-neon-amber" : "bg-primary-400"
                }`} />
                <span className="text-slate-500">{new Date(l.ts).toLocaleTimeString()}</span>
                <span className="text-slate-300">{l.msg}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
