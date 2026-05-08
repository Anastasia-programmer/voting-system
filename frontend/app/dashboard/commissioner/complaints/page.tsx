"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { mock } from "@/lib/mock";
import { useRequireAuth } from "@/hooks/useAuth";
import type { Complaint } from "@/lib/types";

const STATUSES: Complaint["status"][] = ["open", "investigating", "resolved"];

export default function CommissionerComplaintsPage() {
  useRequireAuth(["commissioner", "admin"]);
  const [items, setItems] = useState<Complaint[]>([]);
  const { notify } = useToast();

  function reload() { mock.listComplaints().then(setItems); }
  useEffect(() => { reload(); }, []);

  async function setStatus(id: number, status: Complaint["status"]) {
    await mock.setComplaintStatus(id, status);
    notify({ kind: "success", title: `Marked ${status}` });
    reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Commissioner"
        title="Voter |complaints"
        description="Review and triage complaints submitted by voters. Resolutions are logged for auditing."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c.id} variant="glass">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-slate-500">{c.voter_alias}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{c.subject}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{c.body}</p>
                </div>
                <Badge variant={c.status === "resolved" ? "success" : c.status === "investigating" ? "warning" : "danger"} className="capitalize">{c.status}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.filter((s) => s !== c.status).map((s) => (
                  <Button key={s} variant="secondary" size="sm" onClick={() => setStatus(c.id, s)}>
                    Mark {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <Card variant="glass">
            <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-400">
              <ShieldAlert className="h-4 w-4 text-primary-300" />
              No complaints filed.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
