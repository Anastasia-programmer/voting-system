export type Candidate = {
  id: string;
  name: string;
  party?: string;
  description?: string;
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
};

export type ApiError = {
  detail: string;
  status: number;
};
