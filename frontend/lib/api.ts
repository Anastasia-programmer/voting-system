import { API_URL } from "./constants";
import type {
  CountVotesResponse,
  SubmitVotePayload,
  SubmitVoteResponse,
  VerifyVoteResponse,
} from "./types";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string> } = {},
): Promise<T> {
  const { query, ...rest } = init;
  const url = new URL(path, API_URL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", ...(rest.headers ?? {}) },
    ...rest,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data?.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new HttpError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

// The FastAPI route uses query params for submit-vote. Mirror that here.
export const api = {
  submitVote(payload: SubmitVotePayload) {
    return request<SubmitVoteResponse>("/voter/submit-vote", {
      method: "POST",
      query: {
        n1: payload.n1.trim(),
        n2: payload.n2.trim(),
        vote_value: payload.vote_value,
      },
    });
  },

  verifyVote(n2: string) {
    return request<VerifyVoteResponse>("/voter/verify-vote", {
      method: "GET",
      query: { n2 },
    });
  },

  countVotes() {
    return request<CountVotesResponse>("/counter/count-votes", {
      method: "GET",
      cache: "no-store",
    });
  },
};

export { HttpError };
