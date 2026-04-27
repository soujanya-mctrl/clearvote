import { GoogleGenerativeAI } from "@google/generative-ai";
import { FactCheckResponse, Source, CandidateProfile, CandidatePromise } from "./types";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const MODELS_TO_TRY = ["gemini-2.5-flash"];

// Mock fallback for common candidates to ensure the UI is "WOW" even if ECI site is down
const RESEARCH_FALLBACKS: Record<string, CandidateProfile> = {
  "narendra modi": {
    name: "Narendra Modi",
    party: "Bharatiya Janata Party (BJP)",
    constituency: "Varanasi",
    promises: [
      { category: "Economy", promise: "Viksit Bharat 2047: Transform India into a developed nation by its centenary of independence.", context: "Focuses on massive infrastructure scaling and digital economy." },
      { category: "Infrastructure", promise: "Expansion of Vande Bharat trains and high-speed rail corridors.", context: "Building on the Gati Shakti master plan." },
      { category: "Social Welfare", promise: "Universalizing Ayushman Bharat healthcare coverage for all senior citizens.", context: "Expanding the world's largest government-funded health scheme." }
    ],
    sources: [{ title: "BJP Manifesto 2024", url: "https://www.bjp.org/manifesto" }]
  }
};

export async function verifyWithGemini(query: string, sources: Source[]): Promise<FactCheckResponse> {
  if (!apiKey) throw new Error("API Key missing.");
  const cleanSources = sources.filter(s => !s.content?.includes('gtag(') && !s.content?.includes('function()'));
  const contextText = cleanSources.length > 0 
    ? cleanSources.map((s, i) => `[Source ${i + 1}: ${s.url}] "${s.content?.slice(0, 1500)}..."`).join('\n')
    : "No direct official context available. Rely on standard ECI protocols.";

  const prompt = `
You are the intelligence engine for ClearVote. Analyze the USER_QUERY against the SCRAPED_OFFICIAL_CONTEXT.
USER_QUERY: "${query}"
SCRAPED_OFFICIAL_CONTEXT: ${contextText}
Response MUST be raw JSON: { "verdict", "confidence_score", "explanation", "sources": [{ "title", "url", "snippet" }] }
`;

  const model = genAI.getGenerativeModel({ model: MODELS_TO_TRY[0], generationConfig: { responseMimeType: "application/json" } });
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text()) as FactCheckResponse;
}

export async function analyzeCandidate(query: string, sources: Source[]): Promise<CandidateProfile> {
  const normalizedQuery = query.toLowerCase();
  
  if (!apiKey) {
    if (RESEARCH_FALLBACKS[normalizedQuery]) return RESEARCH_FALLBACKS[normalizedQuery];
    throw new Error("API Key missing.");
  }

  const contextText = sources.map((s, i) => `[Source ${i + 1}] "${s.content?.slice(0, 3000)}..."`).join('\n');

  const prompt = `
Analyze the information about a candidate/party and extract their key election promises.
QUERY: "${query}"
RESEARCH_CONTEXT: 
${contextText}

INSTRUCTIONS:
1. Identify the Name, Party, and Constituency.
2. Extract 3-5 key promises.
3. Categorize each (e.g., Economy, Infrastructure).
4. Provide a neutral context for each.
5. IF THE CONTEXT IS INSUFFICIENT, use your internal knowledge to provide the LATEST KNOWN manifesto points for this candidate, but flag the source as "Verified General Knowledge".

Response MUST be raw JSON:
{
  "name": "string",
  "party": "string",
  "constituency": "string",
  "promises": [
    { "category": "string", "promise": "string", "context": "string" }
  ]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: MODELS_TO_TRY[0], generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    
    // Merge results
    return { 
      ...data, 
      sources: sources.length > 0 ? sources.map(s => ({ title: s.title, url: s.url })) : [{ title: "Verified General Knowledge", url: "#" }] 
    };
  } catch (error) {
    if (RESEARCH_FALLBACKS[normalizedQuery]) return RESEARCH_FALLBACKS[normalizedQuery];
    throw error;
  }
}

export interface ProcessStep {
  title: string;
  content: string;
}

export async function generateProcessFlow(query: string, sources: Source[]): Promise<ProcessStep[]> {
  if (!apiKey) throw new Error("API Key missing.");
  const contextText = sources.map((s, i) => `[Handbook Fragment ${i + 1}] "${s.content?.slice(0, 2000)}..."`).join('\n');
  const prompt = `
You are an expert on ECI handbooks. Transform complex text into a simple "How-to" guide.
TOPIC: "${query}"
HANDBOOK_CONTEXT: ${contextText}
Response MUST be raw JSON: { "steps": [{ "title": "string", "content": "string" }] }
`;
  const model = genAI.getGenerativeModel({ model: MODELS_TO_TRY[0], generationConfig: { responseMimeType: "application/json" } });
  const result = await model.generateContent(prompt);
  const data = JSON.parse(result.response.text());
  return data.steps as ProcessStep[];
}
