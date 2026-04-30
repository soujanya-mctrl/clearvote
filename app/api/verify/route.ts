import { NextResponse } from 'next/server';
import { scrapeOfficialContext } from '../../../lib/scraper';
import { verifyWithGemini } from '../../../lib/gemini';

// Simple In-Memory Rate Limiter
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const LIMIT = 5; // Max 5 requests
const WINDOW = 60 * 1000; // per 1 minute

function isRateLimited(id: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(id);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(id, { count: 1, resetTime: now + WINDOW });
    return false;
  }

  if (record.count >= LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(req: Request) {
  // Use IP or a static string if IP is unavailable
  const id = req.headers.get('x-forwarded-for') || 'global';

  if (isRateLimited(id)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before verifying another claim." }, 
      { status: 429 }
    );
  }

  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Scrape official context
    const sources = await scrapeOfficialContext(query);

    // 2. Verify with Gemini
    const result = await verifyWithGemini(query, sources);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
