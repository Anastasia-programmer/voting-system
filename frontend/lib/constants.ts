import type { Candidate } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const CANDIDATES: Candidate[] = [
  {
    id: "Candidate_A",
    name: "Candidate A",
    party: "Civic Union",
    description: "Focus on transparency and digital infrastructure.",
  },
  {
    id: "Candidate_B",
    name: "Candidate B",
    party: "Progress Front",
    description: "Education reform and renewable energy investment.",
  },
  {
    id: "Candidate_C",
    name: "Candidate C",
    party: "Independent",
    description: "Community-led policy and small business support.",
  },
  {
    id: "BLANK",
    name: "Blank Vote",
    description: "Submit a blank vote (none of the above).",
  },
];

export const VOTE_STEPS = [
  { key: "n1", label: "Identify (N1)" },
  { key: "choose", label: "Choose Vote" },
  { key: "n2", label: "Confirm (N2)" },
  { key: "submit", label: "Secure Submit" },
  { key: "done", label: "Confirmation" },
] as const;

export type VoteStepKey = (typeof VOTE_STEPS)[number]["key"];
