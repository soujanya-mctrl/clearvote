import { GoogleGenerativeAI } from "@google/generative-ai";
import { FactCheckResponse, Source } from "./types";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Using Gemini 2.5 Flash as the primary model
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
];

export async function verifyWithGemini(query: string, sources: Source[]): Promise<FactCheckResponse> {
  if (!apiKey) {
    throw new Error("API Key missing. Please set GEMINI_API_KEY in your .env file.");
  }

  const contextText = sources.length > 0 
    ? sources.map((s, i) => `[Source ${i + 1}: ${s.url}] "${s.content?.slice(0, 2000)}..."`).join('\n')
    : "No direct official context available. Focus on standard Election Commission of India (ECI) protocols for polling station conduct and voter attire.";

  const prompt = `
You are the intelligence engine for ClearVote, an impartial election logistics and process verifier.
Your mandate is to verify the mechanics, rules, hardware, and conduct protocols of the election process. 

RULES:
1. Verify logistical rules (e.g., ID requirements, EVM security, polling station attire, campaigning limits).
2. "Out of Scope" should ONLY be used for purely political opinions, candidate endorsements, or non-election queries. 
3. If a query is about "what to wear" or "what to bring", this is a LOGISTICAL rule and should be answered (e.g., campaigning symbols are usually prohibited within 100m of a booth).

Analyze the USER_QUERY against the SCRAPED_OFFICIAL_CONTEXT provided below.

USER_QUERY: "${query}"

SCRAPED_OFFICIAL_CONTEXT: 
${contextText}

INSTRUCTIONS:
1. Determine if the USER_QUERY is True, False, Misleading, or Out of Scope.
2. Generate a concise, objective explanation.
3. Assign a confidence score (0-100). High confidence means the rule is clear in official protocol.
4. List the specific sources used.

You MUST respond in raw JSON format:
{
  "verdict": "True | False | Misleading | Out of Scope",
  "confidence_score": number,
  "explanation": "string",
  "sources": [{"title": "string", "url": "string"}]
}
`;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`[Gemini] Verifying with ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as FactCheckResponse;
    } catch (error: any) {
      console.error(`[Gemini] ${modelName} Error:`, error.message);
      if (error.status === 404 || error.message?.includes('404')) continue;
      throw error;
    }
  }

  throw new Error("AI engine unavailable. Please check your API key.");
}
