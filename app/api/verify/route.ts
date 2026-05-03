import { NextResponse } from 'next/server';
import { scrapeOfficialContext } from '../../../lib/scraper';
import { verifyWithGemini } from '../../../lib/gemini';
import { Source } from '../../../lib/types';

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

/**
 * Fetch and extract text content from a URL using simple HTML parsing.
 * Falls back gracefully if the URL is unreachable or content is blocked.
 */
async function parseArticleUrl(url: string): Promise<Source | null> {
  try {
    console.log(`[URL Parser] Fetching: ${url}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[URL Parser] HTTP ${response.status} for ${url}`);
      return null;
    }

    const html = await response.text();

    // Extract text content by stripping HTML tags
    // Remove script, style, and other non-content tags first
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '');
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : new URL(url).hostname;

    // Extract meta description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
    const metaDesc = metaMatch ? metaMatch[1].trim() : '';

    // Strip remaining HTML tags and clean whitespace
    text = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length < 100) {
      console.warn(`[URL Parser] Insufficient content from ${url} (${text.length} chars)`);
      return null;
    }

    // Take the most relevant portion (first ~4000 chars after cleaning)
    const content = metaDesc 
      ? `${metaDesc}\n\n${text.slice(0, 4000)}`
      : text.slice(0, 4000);

    console.log(`[URL Parser] Extracted ${content.length} chars from ${url}`);
    return {
      title: title.slice(0, 200),
      url,
      content,
    };
  } catch (error: unknown) {
    console.warn(`[URL Parser] Failed to parse ${url}:`, error instanceof Error ? error.message : error);
    return null;
  }
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
    const { query, urls } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Scrape official context
    const sources = await scrapeOfficialContext(query);

    // 2. Parse user-attached URLs in parallel
    if (urls && Array.isArray(urls) && urls.length > 0) {
      const validUrls = urls.filter((u: string) => typeof u === 'string' && u.startsWith('http')).slice(0, 5);
      
      const urlResults = await Promise.all(
        validUrls.map((url: string) => parseArticleUrl(url))
      );

      urlResults.forEach(result => {
        if (result) {
          sources.push({
            ...result,
            title: `📎 ${result.title}`, // Mark user-attached sources
          });
        }
      });
    }

    // 3. Verify with Gemini
    const result = await verifyWithGemini(query, sources);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
