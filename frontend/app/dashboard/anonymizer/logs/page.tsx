"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mock } from "@/lib/mock";
import { useRequireAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function AnonymizerLogsPage() {
  useRequireAuth(["anonymizer", "admin"]);
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof mock.anonymizerLogs>>>([]);
  const [loading, setLoading] = useState(false);

  async function load() { setLoading(true); setLogs(await mock.anonymizerLogs()); setLoading(false); }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Anonymizer"
        title="System |logs"
        description="Streaming view of the anonymization pipeline."
        actions={
          <Button variant="secondary" size="sm" onClick={load} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-white/[.06] bg-ink-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[.22em] text-slate-500">
            anonymizer.log · live tail
          </div>
          <ul className="divide-y divide-white/[.03] font-mono text-xs">
            {logs.map((l) => (
              <li key={l.id} className="flex items-start gap-3 px-4 py-2.5">
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    l.level === "ok" && "bg-neon-green",
                    l.level === "warn" && "bg-neon-amber",
                    l.level === "info" && "bg-primary-400",
                  )}
                />
                <span className="w-24 shrink-0 text-slate-500">{new Date(l.ts).toLocaleTimeString()}</span>
                <span
                  className={cn(
                    "w-12 shrink-0 uppercase",
                    l.level === "ok" && "text-neon-green",
                    l.level === "warn" && "text-neon-amber",
                    l.level === "info" && "text-primary-300",
                  )}
                >{l.level}</span>
                <span className="text-slate-300">{l.msg}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
