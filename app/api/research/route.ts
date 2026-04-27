import { NextResponse } from 'next/server';
import { scrapeOfficialContext } from '../../../lib/scraper';
import { analyzeCandidate } from '../../../lib/gemini';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Candidate/Party name is required" }, { status: 400 });
    }

    console.log(`[Research API] Analyzing candidate: ${query}`);

    // 1. Scrape news and manifestos
    const sources = await scrapeOfficialContext(query);
    
    // 2. Extract promises and profile using Gemini
    const profile = await analyzeCandidate(query, sources);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("[Research API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze candidate" }, { status: 500 });
  }
}
