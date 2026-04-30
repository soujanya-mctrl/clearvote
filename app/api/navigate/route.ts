import { NextResponse } from 'next/server';
import { scrapeOfficialContext } from '../../../lib/scraper';
import { generateProcessFlow } from '../../../lib/gemini';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log(`[Navigator API] Generating flow for: ${query}`);

    // 1. Scrape official handbooks and protocols
    const sources = await scrapeOfficialContext(query);
    
    // 2. Synthesize into a step-by-step flow using Gemini
    const steps = await generateProcessFlow(query, sources);

    return NextResponse.json({ steps });
  } catch (error: unknown) {
    console.error("[Navigator API] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
