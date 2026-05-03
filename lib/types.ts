export interface Source {
  title: string;
  url: string;
  content?: string;
  snippet?: string;
}

export interface FactCheckResponse {
  verdict: "True" | "False" | "Misleading" | "Unverified" | "Out of Scope";
  confidence_score: number;
  explanation: string;
  sources: Source[];
}

export interface VerificationDocument {
  id: string;
  name: string;
  status: 'verified' | 'missing' | 'pending';
  description: string;
  howToGet: string;
}

export interface CandidatePromise {
  category: string;
  promise: string;
  context: string;
}

export interface CandidateProfile {
  name: string;
  party: string;
  constituency: string;
  promises: CandidatePromise[];
  sources: Source[];
}
