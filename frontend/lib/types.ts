export type Role = "voter" | "admin" | "commissioner" | "counter" | "anonymizer";

export type User = {
  id: number;
  full_name: string;
  email: string;
  role: Role;
};

export type AuthSession = {
  token: string;
  user: User;
};

export type Candidate = {
  id: string;
  name: string;
  party?: string;
  description?: string;
};

export type ElectionStatus = "draft" | "active" | "closed" | "published";

export type Election = {
  id: string;
  title: string;
  description?: string;
  status: ElectionStatus;
  starts_at: string;
  ends_at: string;
  candidates: Candidate[];
  ballots_cast?: number;
  eligible_voters?: number;
};

export type SubmitVotePayload = {
  n1: string;
  n2: string;
  vote_value: string;
};

export type SubmitVoteResponse = {
  message: string;
  signature: string;
};

export type VerifyVoteResponse = {
  message: string;
};

export type CountVotesResponse = {
  total_votes: number;
  results: Record<string, number>;
  undecryptable?: number;
};

export type AdminDashboardResponse = {
  total_votes: number;
  signed_votes: number;
};

export type CommissionerDashboardResponse = {
  total_voter_codes: number;
  used_codes: number;
  unused_codes: number;
};

export type ActivityEvent = {
  id: number;
  action: string;
  user_role: Role | string;
  created_at: string;
};

export type Complaint = {
  id: number;
  voter_alias: string;
  subject: string;
  body: string;
  status: "open" | "investigating" | "resolved";
  created_at: string;
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  role: Role;
};
