export interface Source {
  title: string;
  url: string;
  content?: string;
  snippet?: string; // New: Specific quote justifying the verdict
}

export interface FactCheckResponse {
  verdict: "True" | "False" | "Misleading" | "Out of Scope";
  confidence_score: number;
  explanation: string;
  sources: Source[];
}
