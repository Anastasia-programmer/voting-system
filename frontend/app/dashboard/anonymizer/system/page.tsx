"use client";

import { Cpu, Network, Shield, ServerCog } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRequireAuth } from "@/hooks/useAuth";

export default function AnonymizerSystemPage() {
  useRequireAuth(["anonymizer", "admin"]);

  const items = [
    { icon: Network,  k: "Inbound channels",  v: "TLS 1.3 · 4 active" },
    { icon: Shield,   k: "Mixing strategy",   v: "Threshold mix · k=4" },
    { icon: Cpu,      k: "Throughput",        v: "1.2k ballots / min" },
    { icon: ServerCog,k: "Node",              v: "anonymizer-01" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Anonymizer"
        title="System |status"
        description="Operational view of the mixing layer that severs identity from ballot."
      />

      <Card variant="glass">
        <CardContent className="divide-y divide-white/[.04] p-0">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.k} className="flex items-center gap-4 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="flex-1 text-sm text-slate-200">{item.k}</p>
                <Badge variant="primary" className="font-mono">{item.v}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
