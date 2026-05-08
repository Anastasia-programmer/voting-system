// Mock layer for endpoints the backend doesn't expose yet (elections,
// candidates, user management, complaints, activity feed, anonymizer logs).
// These are intentionally in-memory so the UI feels real during demos.
// Replace any function here with a real `fetch` once the backend route exists.

import type {
  ActivityEvent,
  Candidate,
  Complaint,
  Election,
  Role,
  User,
} from "./types";

const now = () => new Date().toISOString();

const seedCandidates: Candidate[] = [
  { id: "Candidate_A", name: "Candidate A", party: "Civic Union", description: "Transparency and digital infrastructure." },
  { id: "Candidate_B", name: "Candidate B", party: "Progress Front", description: "Education reform and renewables." },
  { id: "Candidate_C", name: "Candidate C", party: "Independent", description: "Community-led policy." },
  { id: "BLANK",       name: "Blank Vote",  description: "None of the above." },
];

let elections: Election[] = [
  {
    id: "election-2026-presidential",
    title: "2026 Presidential Election",
    description: "National vote for the office of the president.",
    status: "active",
    starts_at: "2026-05-01T08:00:00Z",
    ends_at:   "2026-05-15T20:00:00Z",
    candidates: seedCandidates,
    ballots_cast: 1247,
    eligible_voters: 5000,
  },
  {
    id: "election-2026-referendum",
    title: "Constitutional Referendum",
    description: "Yes/No on amendment 14.",
    status: "draft",
    starts_at: "2026-06-01T08:00:00Z",
    ends_at:   "2026-06-08T20:00:00Z",
    candidates: [
      { id: "YES", name: "Yes",  description: "Approve amendment 14." },
      { id: "NO",  name: "No",   description: "Reject amendment 14." },
    ],
    ballots_cast: 0,
    eligible_voters: 5000,
  },
  {
    id: "election-2025-municipal",
    title: "2025 Municipal Election",
    description: "City council seats.",
    status: "published",
    starts_at: "2025-11-01T08:00:00Z",
    ends_at:   "2025-11-08T20:00:00Z",
    candidates: seedCandidates.slice(0, 3),
    ballots_cast: 4321,
    eligible_voters: 4800,
  },
];

let users: User[] = [
  { id: 1, full_name: "Demo Admin",        email: "admin@securevote.dz",        role: "admin" },
  { id: 2, full_name: "Demo Commissioner", email: "commissioner@securevote.dz", role: "commissioner" },
  { id: 3, full_name: "Demo Counter",      email: "counter@securevote.dz",      role: "counter" },
  { id: 4, full_name: "Demo Anonymizer",   email: "anon@securevote.dz",         role: "anonymizer" },
  { id: 5, full_name: "Jane Voter",        email: "jane@example.com",           role: "voter" },
  { id: 6, full_name: "John Voter",        email: "john@example.com",           role: "voter" },
];

let complaints: Complaint[] = [
  { id: 1, voter_alias: "voter#1842", subject: "Could not access N2 input", body: "The confirmation page reset after submission.", status: "investigating", created_at: now() },
  { id: 2, voter_alias: "voter#0921", subject: "Receipt not generated",      body: "Vote went through but no receipt copy.",        status: "resolved",      created_at: now() },
  { id: 3, voter_alias: "voter#3315", subject: "N1 rejected as invalid",     body: "I'm sure the code is correct.",                 status: "open",          created_at: now() },
];

let activity: ActivityEvent[] = [
  { id: 1, action: "vote.submitted",     user_role: "voter",        created_at: now() },
  { id: 2, action: "ballot.signed",      user_role: "admin",        created_at: now() },
  { id: 3, action: "vote.anonymized",    user_role: "anonymizer",   created_at: now() },
  { id: 4, action: "results.published",  user_role: "admin",        created_at: now() },
  { id: 5, action: "complaint.opened",   user_role: "commissioner", created_at: now() },
];

const sleep = (ms = 220) => new Promise((r) => setTimeout(r, ms));

export const mock = {
  // Elections
  async listElections(): Promise<Election[]> {
    await sleep();
    return [...elections];
  },
  async getElection(id: string): Promise<Election | null> {
    await sleep();
    return elections.find((e) => e.id === id) ?? null;
  },
  async createElection(input: Omit<Election, "id" | "ballots_cast">): Promise<Election> {
    await sleep();
    const created: Election = { ...input, id: `election-${Date.now()}`, ballots_cast: 0 };
    elections = [created, ...elections];
    return created;
  },
  async updateElection(id: string, patch: Partial<Election>): Promise<Election> {
    await sleep();
    elections = elections.map((e) => (e.id === id ? { ...e, ...patch } : e));
    return elections.find((e) => e.id === id)!;
  },
  async deleteElection(id: string): Promise<void> {
    await sleep();
    elections = elections.filter((e) => e.id !== id);
  },
  async addCandidate(electionId: string, candidate: Candidate): Promise<Election> {
    await sleep();
    elections = elections.map((e) =>
      e.id === electionId ? { ...e, candidates: [...e.candidates, candidate] } : e,
    );
    return elections.find((e) => e.id === electionId)!;
  },
  async removeCandidate(electionId: string, candidateId: string): Promise<Election> {
    await sleep();
    elections = elections.map((e) =>
      e.id === electionId
        ? { ...e, candidates: e.candidates.filter((c) => c.id !== candidateId) }
        : e,
    );
    return elections.find((e) => e.id === electionId)!;
  },
  async publishResults(id: string): Promise<Election> {
    await sleep();
    return mock.updateElection(id, { status: "published" });
  },

  // Users
  async listUsers(): Promise<User[]> {
    await sleep();
    return [...users];
  },
  /**
   * Add a freshly registered user to the in-memory list. Called from the
   * register flow so admins see the new account immediately. The backend
   * still owns the source of truth (SQLite); this is just a cache so the
   * UI reflects the change without a dedicated GET /users endpoint.
   */
  registerLocalUser(input: { full_name: string; email: string; role: Role }): User {
    const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      users = users.map((u) => (u.id === existing.id ? { ...u, ...input } : u));
      return users.find((u) => u.id === existing.id)!;
    }
    const created: User = {
      id: users.reduce((max, u) => Math.max(max, u.id), 0) + 1,
      ...input,
    };
    users = [...users, created];
    return created;
  },
  async deleteUser(id: number): Promise<void> {
    await sleep();
    users = users.filter((u) => u.id !== id);
  },
  async setUserRole(id: number, role: Role): Promise<User> {
    await sleep();
    users = users.map((u) => (u.id === id ? { ...u, role } : u));
    return users.find((u) => u.id === id)!;
  },

  // Complaints
  async listComplaints(): Promise<Complaint[]> {
    await sleep();
    return [...complaints];
  },
  async setComplaintStatus(id: number, status: Complaint["status"]): Promise<Complaint> {
    await sleep();
    complaints = complaints.map((c) => (c.id === id ? { ...c, status } : c));
    return complaints.find((c) => c.id === id)!;
  },

  // Activity
  async recentActivity(limit = 20): Promise<ActivityEvent[]> {
    await sleep();
    return activity.slice(-limit).reverse();
  },
  pushActivity(action: string, role: Role | string) {
    activity = [
      ...activity,
      { id: activity.length + 1, action, user_role: role, created_at: now() },
    ];
  },

  // My past votes (a fake history scoped to the current voter)
  async myVoteHistory(): Promise<Array<{ id: string; election: string; signature: string; status: string; date: string }>> {
    await sleep();
    return [
      { id: "1", election: "2025 Municipal Election", signature: "0x4f11…a83b", status: "Counted",  date: "2025-11-04T11:22:00Z" },
      { id: "2", election: "Workplace Survey 2025",   signature: "0x9e02…12cd", status: "Counted",  date: "2025-08-12T09:14:00Z" },
    ];
  },

  // Anonymizer logs (visualization-only)
  async anonymizerLogs(): Promise<Array<{ id: number; ts: string; level: "info" | "warn" | "ok"; msg: string }>> {
    await sleep();
    const t = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();
    return [
      { id: 1, ts: t(1),  level: "ok",   msg: "Batch #312 routed — 184 ballots stripped of metadata" },
      { id: 2, ts: t(7),  level: "info", msg: "Mixing pass complete (k=4) — entropy=3.91 bits"        },
      { id: 3, ts: t(12), level: "ok",   msg: "Signature verification passed on incoming ballot"      },
      { id: 4, ts: t(20), level: "warn", msg: "Replay detected — discarded 1 duplicate ballot"        },
      { id: 5, ts: t(33), level: "ok",   msg: "Batch #311 forwarded to counter (n=160)"               },
    ];
  },
};
