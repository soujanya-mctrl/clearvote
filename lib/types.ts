export interface Source {
  title: string;
  url: string;
  content?: string;
}

export interface FactCheckResponse {
  verdict: "True" | "False" | "Misleading" | "Out of Scope";
  confidence_score: number; // 0 to 100
  explanation: string;
  sources: Source[];
}

export interface ScrapedContext {
  sources: Source[];
}
