"use client";

import { Cpu, Database, KeyRound, Network } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRequireAuth } from "@/hooks/useAuth";

export default function AdminSettingsPage() {
  useRequireAuth(["admin"]);

  const items = [
    { icon: KeyRound,  title: "Administrator RSA key",  desc: "2048-bit · loaded in memory · regenerated on server start", value: "RSA-2048" },
    { icon: KeyRound,  title: "Counter RSA key",        desc: "Used to decrypt aggregated tallies",                       value: "RSA-2048" },
    { icon: Network,   title: "Anonymizer endpoint",    desc: "Internal route for ballot mixing",                         value: "/anonymizer" },
    { icon: Database,  title: "Database",               desc: "SQLite — file-backed during the academic build",            value: "evoting.db" },
    { icon: Cpu,       title: "Hash function",          desc: "Used to verify N2 codes server-side",                       value: "SHA-256" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="System |settings"
        description="Read-only snapshot of the cryptographic primitives and infrastructure currently in use."
      />

      <Card variant="glass">
        <CardContent className="divide-y divide-white/[.04] p-0">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300 ring-1 ring-primary-400/30">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </div>
                <Badge variant="primary" className="font-mono">{item.value}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
