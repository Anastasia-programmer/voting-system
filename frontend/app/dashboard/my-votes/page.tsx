"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ScrollText, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TR, TH, TD, EmptyRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { mock } from "@/lib/mock";

export default function MyVotesPage() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof mock.myVoteHistory>>>([]);
  const { notify } = useToast();

  useEffect(() => { mock.myVoteHistory().then(setRows); }, []);

  function copy(s: string) {
    navigator.clipboard.writeText(s);
    notify({ kind: "info", title: "Receipt copied" });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Voter"
        title="My past |votes"
        description="Cryptographic receipts for every ballot you've submitted. Use the verify page to re-check counting status."
        actions={
          <Link href="/verify">
            <Button variant="secondary" size="sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verify a vote
            </Button>
          </Link>
        }
      />

      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Election</TH>
                <TH>Submitted</TH>
                <TH>Status</TH>
                <TH>Receipt</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <tbody>
              {rows.length === 0 ? (
                <EmptyRow colSpan={5} label="No past votes — your first ballot will appear here." />
              ) : (
                rows.map((r) => (
                  <TR key={r.id}>
                    <TD className="font-medium text-white">{r.election}</TD>
                    <TD>{new Date(r.date).toLocaleString()}</TD>
                    <TD>
                      <Badge variant={r.status === "Counted" ? "success" : "warning"}>{r.status}</Badge>
                    </TD>
                    <TD><code className="font-mono text-xs text-primary-300">{r.signature}</code></TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => copy(r.signature)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TD>
                  </TR>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <ScrollText className="h-3.5 w-3.5" />
        Receipts are RSA signatures from the administrator. They prove that your ballot was authorized
        — but never reveal what you voted for.
      </p>
    </div>
  );
}
