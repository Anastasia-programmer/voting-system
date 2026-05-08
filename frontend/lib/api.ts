import { API_URL } from "./constants";
import type {
  AdminDashboardResponse,
  CommissionerDashboardResponse,
  CountVotesResponse,
  LoginPayload,
  RegisterPayload,
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

const TOKEN_KEY = "securevote.token";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string>; auth?: boolean } = {},
): Promise<T> {
  const { query, auth = true, ...rest } = init;
  const url = new URL(path, API_URL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((rest.headers as Record<string, string>) ?? {}),
  };
  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), { ...rest, headers });

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

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // ------ Auth ------
  login(payload: LoginPayload) {
    return request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    });
  },
  register(payload: RegisterPayload) {
    return request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    });
  },

  // ------ Voter ------
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
      query: { n2: n2.trim() },
    });
  },

  // ------ Counter ------
  countVotes() {
    return request<CountVotesResponse>("/counter/count-votes", {
      method: "GET",
      cache: "no-store",
    });
  },

  // ------ Administrator ------
  adminDashboard() {
    return request<AdminDashboardResponse>("/administrator/dashboard", {
      method: "GET",
      cache: "no-store",
    });
  },

  // ------ Commissioner ------
  commissionerDashboard() {
    return request<CommissionerDashboardResponse>("/commissioner/dashboard", {
      method: "GET",
      cache: "no-store",
    });
  },

  // ------ Anonymizer ------
  anonymizeVotes() {
    return request<{ message: string }>("/anonymizer/anonymize-votes", {
      method: "GET",
    });
  },
};

export { HttpError };
