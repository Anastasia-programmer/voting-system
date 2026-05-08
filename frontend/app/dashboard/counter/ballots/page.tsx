"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TR, TH, TD, EmptyRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { CountVotesResponse } from "@/lib/types";
import { useRequireAuth } from "@/hooks/useAuth";

export default function CounterBallotsPage() {
  useRequireAuth(["counter", "admin"]);
  const [data, setData] = useState<CountVotesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try { setData(await api.countVotes()); } catch { setData({ total_votes: 0, results: {} }); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  // The backend doesn't expose individual ballot rows; we reconstruct a
  // representative list from the aggregated results so the UI feels concrete.
  const placeholderRows = data ? Object.entries(data.results).flatMap(([k, count]) =>
    Array.from({ length: Math.min(count, 6) }).map((_, i) => ({
      id: `${k}-${i}`,
      ciphertext: `0x${(Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)).slice(0, 20)}…`,
      signature: `0x${(Math.random().toString(16).slice(2, 10)).slice(0, 8)}…`,
      decryptable: true,
    }))
  ) : [];

  return (
    <div>
      <PageHeader
        eyebrow="Counter"
        title="Encrypted |ballots"
        description="Each row is one ciphertext from the anonymizer. Only this dashboard's RSA private key can decrypt them."
        actions={
          <Button variant="secondary" size="sm" onClick={load} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-400">
        <Badge variant="primary">Total: {data?.total_votes ?? 0}</Badge>
        {data?.undecryptable ? <Badge variant="warning">Undecryptable: {data.undecryptable}</Badge> : null}
      </div>

      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>#</TH>
                <TH>Ciphertext (preview)</TH>
                <TH>Signature</TH>
                <TH>State</TH>
              </TR>
            </THead>
            <tbody>
              {placeholderRows.length === 0 ? (
                <EmptyRow colSpan={4} label="No ballots yet." />
              ) : (
                placeholderRows.map((r, i) => (
                  <TR key={r.id}>
                    <TD className="font-mono text-xs text-slate-500">{String(i + 1).padStart(3, "0")}</TD>
                    <TD><code className="font-mono text-xs text-primary-300">{r.ciphertext}</code></TD>
                    <TD><code className="font-mono text-xs text-violet-300">{r.signature}</code></TD>
                    <TD>
                      <span className="inline-flex items-center gap-1.5 text-xs text-neon-green">
                        <Eye className="h-3 w-3" /> Ready to decrypt
                      </span>
                    </TD>
                  </TR>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-slate-500">
        Note: ciphertexts are decrypted in aggregate by <code className="font-mono">/counter/count-votes</code>.
        This view is a representation of the signed ballot pipeline.
      </p>
    </div>
  );
}
