import puppeteer from 'puppeteer';
import { Source } from './types';

const SOURCE_MAP = [
  { name: "ECI FAQs", url: "https://eci.gov.in/faqs/evm-vvpat/" },
  { name: "The Hindu Elections", url: "https://www.thehindu.com/topic/elections/" },
  { name: "NDTV India Elections", url: "https://www.ndtv.com/india-news/topic/elections" },
  { name: "Times of India Elections", url: "https://timesofindia.indiatimes.com/india/elections" }
];

const FALLBACK_CONTEXT: Record<string, string> = {
  "voter list": "If your name is not on the electoral roll, you cannot vote. You must apply for registration using Form 6 well in advance of the election. Your voter ID card alone does not guarantee a vote; the name must be in the current electoral roll. Source: ECI FAQ Section 1.",
  "evm": "EVMs are stand-alone machines, not connected to any network. They use M3 technology with dynamic coding. VVPAT allows voters to verify their vote for 7 seconds. Sources: ECI FAQ Section 1-4.",
  "registration": "Registration requires Form 6. Citizens aged 18+ can apply online via NVSP or offline via ERO. BLO conducts field verification. Sources: ECI Registration Handbook.",
  "t-shirt": "The Model Code of Conduct (MCC) prohibits campaigning within 100 meters of a polling station. Wearing party-specific apparel (t-shirts, caps) inside the booth is considered campaigning and is strictly prohibited. Sources: ECI MCC Guidelines.",
  "online": "India does not currently support online voting for general citizens. All votes must be cast in person at assigned polling booths using EVMs. NRI voters can use ETPBS in specific categories. Sources: ECI Digital Initiatives Report."
};

/**
 * High-fidelity scraper using Puppeteer.
 */
async function scrapeWithPuppeteer(url: string): Promise<string | null> {
  let browser;
  try {
    console.log(`[Puppeteer] Scraping: ${url}`);
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const text = await page.evaluate(() => {
      const junk = document.querySelectorAll('script, style, noscript, iframe, header, footer, nav');
      junk.forEach(s => s.remove());
      return document.body.innerText.replace(/\s+/g, ' ').trim();
    });

    return text;
  } catch (error: unknown) {
    console.warn(`[Puppeteer] Failed to scrape ${url}:`, error instanceof Error ? error.message : error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

export async function scrapeOfficialContext(query: string): Promise<Source[]> {
  const sources: Source[] = [];
  const searchKeywords = query.toLowerCase();

  // 1. Initial grounding with Fallback Context
  for (const [key, content] of Object.entries(FALLBACK_CONTEXT)) {
    if (searchKeywords.includes(key)) {
      sources.push({
        title: `Official Protocol: ${key.toUpperCase()}`,
        url: "https://eci.gov.in/faqs/",
        content: content
      });
    }
  }

  // 2. Dynamic Research Logic
  // If the query looks like a candidate/party research, we target news domains more heavily
  const targets = (searchKeywords.length > 3 && !searchKeywords.includes('how')) 
    ? SOURCE_MAP.filter(s => s.name.includes('Hindu') || s.name.includes('NDTV') || s.name.includes('Times'))
    : SOURCE_MAP.slice(0, 2);

  const scrapePromises = targets.map(async (target) => {
    // For news sites, we can append the query to their search if they support simple URL patterns
    // For this demo, we'll scrape their main election sections which usually contain top candidate profiles
    const content = await scrapeWithPuppeteer(target.url);
    if (content && content.length > 500) {
      return {
        title: target.name,
        url: target.url,
        content: content.slice(0, 3000)
      };
    }
    return null;
  });

  const scrapedResults = await Promise.all(scrapePromises);
  scrapedResults.forEach(res => { if (res) sources.push(res); });

  return sources;
}
