import puppeteer from 'puppeteer';
import { Source } from './types';

const SOURCE_MAP = [
  // existing (fixed)
  { name: "ECI FAQs", url: "https://www.eci.gov.in/evm-faqs" },
  { name: "The Hindu Elections", url: "https://www.thehindu.com/topic/elections/" },
  { name: "NDTV India Elections", url: "https://www.ndtv.com/elections" },
  { name: "Times of India Elections", url: "https://timesofindia.indiatimes.com/india/elections" },

  // official — confirmed
  { name: "ECI Election Results", url: "https://results.eci.gov.in/" },
  { name: "ECI Voter Turnout", url: "https://www.eci.gov.in/voter-turnout/" },
  { name: "PIB Election Press Releases", url: "https://www.pib.gov.in/" },

  // news — likely correct, unverified (blocked)
  { name: "Indian Express Elections", url: "https://indianexpress.com/section/elections/" },
  { name: "India Today Elections", url: "https://www.indiatoday.in/elections" },

  // data
  { name: "IndiaVotes Database", url: "https://www.indiavotes.com/" },
];

const FALLBACK_CONTEXT: Record<string, string> = {
  "voter list": "If your name is not on the electoral roll, you cannot vote. You must apply for registration using Form 6 well in advance of the election. Your voter ID card alone does not guarantee a vote; the name must be in the current electoral roll. Source: ECI FAQ Section 1.",
  "evm": "EVMs are stand-alone machines, not connected to any network. They use M3 technology with dynamic coding. VVPAT allows voters to verify their vote for 7 seconds. Sources: ECI FAQ Section 1-4.",
  "registration": "Registration requires Form 6. Citizens aged 18+ can apply online via NVSP or offline via ERO. BLO conducts field verification. Sources: ECI Registration Handbook.",
  "t-shirt": "The Model Code of Conduct (MCC) prohibits campaigning within 100 meters of a polling station. Wearing party-specific apparel (t-shirts, caps) inside the booth is considered campaigning and is strictly prohibited. Sources: ECI MCC Guidelines.",
  "online": "India does not currently support online voting for general citizens. All votes must be cast in person at assigned polling booths using EVMs. NRI voters can use ETPBS in specific categories. Sources: ECI Digital Initiatives Report.",
  "electricity": "The Delhi Government under AAP announced a free electricity scheme providing zero electricity bills for households consuming up to 200 units per month. Households consuming 201-400 units receive a 50% subsidy. The scheme was introduced in 2019 and has been a key electoral promise. Eligible consumers must apply through BSES or TPDDL portals. Source: Delhi Government Official Notifications, BSES Rajdhani.",
  "free electricity": "The Delhi Government under AAP announced a free electricity scheme providing zero electricity bills for households consuming up to 200 units per month. Households consuming 201-400 units receive a 50% subsidy. The scheme was introduced in 2019 and has been a key electoral promise. Eligible consumers must apply through BSES or TPDDL portals. Source: Delhi Government Official Notifications, BSES Rajdhani.",
  "delhi": "Delhi has been a key political battleground. The AAP government introduced several welfare schemes including free electricity (up to 200 units), free water (up to 20,000 litres), and the Mohalla Clinic healthcare program. Delhi's election dynamics involve BJP, AAP, and Congress as major parties. Source: Delhi State Election Commission.",
  "education policy": "The National Education Policy (NEP) 2020 was approved by the Union Cabinet on 29 July 2020. It replaces the 1986 National Policy on Education. Key features: 5+3+3+4 structure replacing 10+2, mother tongue instruction until Grade 5, multidisciplinary education, common entrance exams. Implementation status varies by state — states like Karnataka, Madhya Pradesh, and Uttar Pradesh have made significant progress, while others like Tamil Nadu and Kerala have expressed reservations. Source: Ministry of Education, Government of India.",
  "nep": "The National Education Policy (NEP) 2020 was approved by the Union Cabinet on 29 July 2020. It replaces the 1986 National Policy on Education. Key features: 5+3+3+4 structure replacing 10+2, mother tongue instruction until Grade 5, multidisciplinary education, common entrance exams. Implementation status varies by state — states like Karnataka, Madhya Pradesh, and Uttar Pradesh have made significant progress, while others like Tamil Nadu and Kerala have expressed reservations. Source: Ministry of Education, Government of India.",
  "aadhaar": "The Election Commission of India has been running a program to link Aadhaar numbers with Voter IDs (EPIC) under the amended Registration of Electors Rules, 2022. This linking is voluntary, not mandatory. The purpose is to prevent duplicate entries in the electoral roll. Citizens can link via Form 6B on the NVSP portal or at their nearest ERO/BLO office. There is no fixed 'deadline' that disenfranchises voters — unlinking does not result in deletion from electoral rolls. Source: ECI Notification S.O.464(E) dated 17 June 2022, NVSP Portal.",
  "voter id": "Voter ID (EPIC - Electors Photo Identity Card) is issued by the Election Commission of India to all eligible citizens registered in the electoral roll. You can apply online via the NVSP portal using Form 6. New applicants must be 18+ on the qualifying date (Jan 1 of the year). BLO verification is conducted before issuance. Digital Voter ID (e-EPIC) can be downloaded from voters.eci.gov.in. Source: ECI Registration Guidelines.",
  "nri": "NRI voting in India: Under the Representation of the People (Amendment) Act, 2010, NRIs who have not acquired citizenship of another country can register as overseas electors. They must be present in person at the assigned polling station to vote. The Election Commission has proposed postal ballot facility for NRIs via the Electronically Transmitted Postal Ballot System (ETPBS), but as of 2024, physical presence is still required for general elections. NRIs can register using Form 6A on the NVSP portal. Source: ECI NRI Voting Guidelines, Representation of People Act Section 20A.",
  "voting": "To vote in Indian elections, a citizen must be 18+ years old, registered in the electoral roll, and possess a valid Voter ID (EPIC). Voting is conducted via EVMs at designated polling stations. The voter must be present in person. Proxy voting is only available for classified service voters. Source: ECI Voter Guide."
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
  // Select up to 4 diverse sources based on query relevance
  const isOfficialQuery = ['eci', 'election commission', 'evm', 'voter', 'aadhaar', 'registration', 'eligibility'].some(k => searchKeywords.includes(k));
  const targets = isOfficialQuery
    ? SOURCE_MAP.filter(s => s.name.includes('ECI') || s.name.includes('PIB')).slice(0, 3)
    : SOURCE_MAP.filter(s => s.name.includes('Hindu') || s.name.includes('NDTV') || s.name.includes('Express') || s.name.includes('India Today')).slice(0, 3);

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
