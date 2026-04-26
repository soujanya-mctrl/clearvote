import { GoogleGenerativeAI } from "@google/generative-ai";
import { FactCheckResponse, Source } from "./types";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const MODELS_TO_TRY = [
  "gemini-2.5-flash"
];

export async function verifyWithGemini(query: string, sources: Source[]): Promise<FactCheckResponse> {
  if (!apiKey) {
    throw new Error("API Key missing. Please set GEMINI_API_KEY in your .env file.");
  }

  // Filter out any sources that look like pure JS code just in case
  const cleanSources = sources.filter(s => !s.content?.includes('gtag(') && !s.content?.includes('function()'));

  const contextText = cleanSources.length > 0 
    ? cleanSources.map((s, i) => `[Source ${i + 1}: ${s.url}] "${s.content?.slice(0, 1500)}..."`).join('\n')
    : "No direct official context available. Rely on standard Election Commission of India (ECI) protocols and Model Code of Conduct (MCC).";

  const prompt = `
You are the intelligence engine for ClearVote, an impartial election logistics verifier.
Your mandate is strictly to verify mechanics, rules, hardware, and conduct protocols.

Analyze the USER_QUERY against the SCRAPED_OFFICIAL_CONTEXT.

USER_QUERY: "${query}"

SCRAPED_OFFICIAL_CONTEXT: 
${contextText}

CRITICAL INSTRUCTIONS:
1. If the SCRAPED_OFFICIAL_CONTEXT is insufficient or contains technical website code, DO NOT mark the query as "Out of Scope" if it relates to Indian Elections. Instead, use your internal knowledge of official ECI protocols to answer.
2. Determine if the USER_QUERY is True, False, Misleading, or Out of Scope.
3. Generate a concise, neutral explanation.
4. For EACH source used, extract a direct quote as a "snippet". If using internal knowledge, list the source as "ECI Standard Protocol".

You MUST respond in raw JSON format:
{
  "verdict": "True | False | Misleading | Out of Scope",
  "confidence_score": number,
  "explanation": "string",
  "sources": [
    {
      "title": "string", 
      "url": "string", 
      "snippet": "string"
    }
  ]
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

  throw new Error("AI engine unavailable.");
}
