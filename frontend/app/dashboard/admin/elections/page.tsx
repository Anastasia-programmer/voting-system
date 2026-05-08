"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Edit3, Plus, Trash2, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Table, THead, TR, TH, TD, EmptyRow } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { mock } from "@/lib/mock";
import type { Candidate, Election, ElectionStatus } from "@/lib/types";
import { useRequireAuth } from "@/hooks/useAuth";

export default function AdminElectionsPage() {
  useRequireAuth(["admin"]);
  const { notify } = useToast();
  const [elections, setElections] = useState<Election[]>([]);
  const [editing, setEditing] = useState<Election | null>(null);
  const [creating, setCreating] = useState(false);
  const [candidateModal, setCandidateModal] = useState<Election | null>(null);

  function reload() { mock.listElections().then(setElections); }
  useEffect(() => { reload(); }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this election?")) return;
    await mock.deleteElection(id);
    notify({ kind: "success", title: "Election deleted" });
    reload();
  }

  async function handlePublish(id: string) {
    await mock.publishResults(id);
    notify({ kind: "success", title: "Results published" });
    reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Elections |management"
        description="Create new ballots, edit candidates, and publish final results."
        actions={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" /> New election
          </Button>
        }
      />

      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Status</TH>
                <TH>Window</TH>
                <TH>Options</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <tbody>
              {elections.length === 0 ? (
                <EmptyRow colSpan={5} label="No elections yet — create one to get started." />
              ) : (
                elections.map((e) => (
                  <TR key={e.id}>
                    <TD>
                      <p className="font-medium text-white">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.description}</p>
                    </TD>
                    <TD><Badge variant={e.status === "active" ? "success" : e.status === "draft" ? "warning" : e.status === "published" ? "primary" : "neutral"} className="capitalize">{e.status}</Badge></TD>
                    <TD className="font-mono text-xs">
                      {new Date(e.starts_at).toLocaleDateString()} → {new Date(e.ends_at).toLocaleDateString()}
                    </TD>
                    <TD>{e.candidates.length}</TD>
                    <TD className="text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setCandidateModal(e)} aria-label="Edit candidates">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditing(e)} aria-label="Edit">
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </Button>
                        {e.status !== "published" && (
                          <Button variant="ghost" size="sm" onClick={() => handlePublish(e.id)} aria-label="Publish">
                            <Megaphone className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)} aria-label="Delete">
                          <Trash2 className="h-3.5 w-3.5 text-neon-red" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <ElectionFormModal
        open={creating || !!editing}
        initial={editing ?? undefined}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSaved={() => { reload(); notify({ kind: "success", title: "Saved" }); }}
      />

      <CandidateModal
        election={candidateModal}
        onClose={() => setCandidateModal(null)}
        onChanged={reload}
      />
    </div>
  );
}

function ElectionFormModal({
  open, initial, onClose, onSaved,
}: { open: boolean; initial?: Election; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState<ElectionStatus>("draft");

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStartsAt(initial?.starts_at?.slice(0, 16) ?? "");
    setEndsAt(initial?.ends_at?.slice(0, 16) ?? "");
    setStatus(initial?.status ?? "draft");
  }, [initial, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (initial) {
      await mock.updateElection(initial.id, {
        title, description, starts_at: startsAt, ends_at: endsAt, status,
      });
    } else {
      await mock.createElection({
        title, description, starts_at: startsAt, ends_at: endsAt, status,
        candidates: [],
        eligible_voters: 5000,
      });
    }
    onSaved();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit election" : "Create election"}
      description="Define the ballot window and metadata. Add candidates after creation."
      size="md"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="election-form">Save</Button>
        </>
      }
    >
      <form id="election-form" className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="2026 Presidential Election" />
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-2 block w-full rounded-xl border border-white/10 bg-ink-800/80 p-3 text-sm text-white placeholder:text-slate-500 focus:border-primary-400/60 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Starts at" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          <Input label="Ends at"   type="datetime-local" required value={endsAt}   onChange={(e) => setEndsAt(e.target.value)} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ElectionStatus)}
            className="mt-2 block w-full rounded-xl border border-white/10 bg-ink-800/80 p-3 text-sm text-white focus:border-primary-400/60 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="published">Published</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}

function CandidateModal({
  election, onClose, onChanged,
}: { election: Election | null; onClose: () => void; onChanged: () => void }) {
  const [list, setList] = useState<Candidate[]>([]);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  useEffect(() => { setList(election?.candidates ?? []); setName(""); setParty(""); }, [election]);

  if (!election) return null;

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!election || !name) return;
    const c: Candidate = { id: name.replace(/\s+/g, "_"), name, party: party || undefined };
    const updated = await mock.addCandidate(election.id, c);
    setList(updated.candidates);
    onChanged();
    setName(""); setParty("");
  }

  async function remove(id: string) {
    const updated = await mock.removeCandidate(election.id, id);
    setList(updated.candidates);
    onChanged();
  }

  return (
    <Modal open onClose={onClose} title={`Candidates — ${election.title}`} size="md"
      footer={<Button onClick={onClose}>Done</Button>}>
      <form onSubmit={add} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Input label="Candidate name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Candidate D" />
          <Input label="Party (optional)" value={party} onChange={(e) => setParty(e.target.value)} placeholder="Independent" />
        </div>
        <Button type="submit" size="sm" className="w-full">
          <Plus className="h-3.5 w-3.5" /> Add candidate
        </Button>
      </form>

      <ul className="mt-5 space-y-2">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[.06] bg-ink-800/40 p-3">
            <div>
              <p className="text-sm font-medium text-white">{c.name}</p>
              {c.party && <p className="text-xs text-slate-500">{c.party}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(c.id)} aria-label="Remove">
              <Trash2 className="h-3.5 w-3.5 text-neon-red" />
            </Button>
          </li>
        ))}
        {list.length === 0 && <p className="rounded-lg border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">No candidates yet.</p>}
      </ul>
    </Modal>
  );
}
