import puppeteer from 'puppeteer';
import { Source } from './types';

const OFFICIAL_SOURCES = [
  'https://www.eci.gov.in/faqs/evm/evm-faqs-r11/',
  'https://www.eci.gov.in/faqs/voter-id-card/voter-id-card-faqs-r12/',
];

// Fallback data in case of complete scraper failure
const FALLBACK_CONTEXT: Source[] = [
  {
    title: "ECI - EVM & VVPAT Protocol",
    url: "https://www.eci.gov.in/faqs/evm/evm-faqs-r11/",
    content: "EVMs are standalone machines not connected to any network (Internet, Bluetooth, or WiFi). They are tamper-proof and have multiple security layers including administrative and technical safeguards. VVPAT allows voters to verify their vote."
  },
  {
    title: "ECI - Voter Identification",
    url: "https://www.eci.gov.in/faqs/voter-id-card/voter-id-card-faqs-r12/",
    content: "Voters can cast their vote even if they do not have an EPIC card, provided their name is in the electoral roll and they carry one of the 12 alternative photo ID documents approved by the Commission."
  },
  {
    title: "ECI - Conduct & Attire",
    url: "https://www.eci.gov.in/mcc/",
    content: "Display of any election-related symbols or campaigning (including t-shirts, caps, or stickers of a political party) is strictly prohibited within 100 meters of the polling station. This is to ensure a neutral and non-intimidating environment for all voters."
  }
];

const cache: Map<string, string> = new Map();

export async function scrapeOfficialContext(query: string): Promise<Source[]> {
  const sources: Source[] = [];
  const queryLower = query.toLowerCase();

  let browser;
  try {
    console.log("[Scraper] Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    for (const url of OFFICIAL_SOURCES) {
      try {
        if (cache.has(url)) {
          sources.push({ title: "Official FAQ", url, content: cache.get(url) });
          continue;
        }

        console.log(`[Scraper] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Wait for main content to load
        const content = await page.evaluate(() => {
          const main = document.querySelector('main') || document.querySelector('article') || document.body;
          return main ? main.innerText : '';
        });

        const cleaned = content.replace(/\s+/g, ' ').trim().slice(0, 5000);
        if (cleaned.length > 100) {
          cache.set(url, cleaned);
          const title = await page.title();
          sources.push({ title: title || "Official FAQ", url, content: cleaned });
        }
      } catch (err: any) {
        console.warn(`[Scraper] Failed to scrape ${url}: ${err.message}`);
      }
    }
  } catch (error: any) {
    console.error("[Scraper] Puppeteer Launch Error:", error.message);
  } finally {
    if (browser) await browser.close();
  }

  // Fallback logic
  if (sources.length === 0) {
    console.log("[Scraper] Using internal knowledge base fallback.");
    if (queryLower.includes('evm') || queryLower.includes('hack') || queryLower.includes('machine')) {
      sources.push(FALLBACK_CONTEXT[0]);
    } else if (queryLower.includes('id') || queryLower.includes('card') || queryLower.includes('document')) {
      sources.push(FALLBACK_CONTEXT[1]);
    } else {
      sources.push(...FALLBACK_CONTEXT);
    }
  }

  return sources;
}
