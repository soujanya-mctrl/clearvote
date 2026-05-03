# ClearVote Scraper Benchmarks & Strategy 🕵️‍♂️

The ClearVote scraper is designed to prioritize **official grounding** and **diverse reporting** to ensure the Truth Engine has access to the most reliable electoral data.

---

## 🛡️ Target Source Map
The scraper selectively targets high-authority domains based on the query category:

### 1. Official Ground Truth (Tier 1)
- **ECI FAQs**: `https://www.eci.gov.in/evm-faqs` (Core EVM/VVPAT logic)
- **ECI Results**: `https://results.eci.gov.in/` (Historical and live data)
- **PIB Releases**: `https://www.pib.gov.in/` (Official government notifications)

### 2. Reputable News & Archives (Tier 2)
- **The Hindu**: `https://www.thehindu.com/topic/elections/` (Deep archival context)
- **Indian Express**: `https://indianexpress.com/section/elections/` (Policy analysis)
- **IndiaVotes**: `https://www.indiavotes.com/` (Statistical election data)

---

## 🧪 Scraper Test Cases

### Case 1: EVM Integrity Verification
- **Input Query**: "How are EVM symbols loaded?"
- **Expected Source**: `ECI FAQs`
- **Expected Content Pattern**: Mention of "Symbol Loading Unit (SLU)", "M3 EVMs", or "Sealing Protocol".

### Case 2: Candidate Promise Research
- **Input Query**: "Manifesto promises of [CANDIDATE_NAME]"
- **Expected Source**: `The Hindu` or `NDTV`
- **Expected Content Pattern**: Bullet points of policy promises, party name, and constituency details.

### Case 3: Logistical Rule Check
- **Input Query**: "Can I wear a party cap inside the booth?"
- **Expected Source**: `ECI Handbook / MCC Guidelines`
- **Expected Content Pattern**: Keywords like "Model Code of Conduct", "100 meters", or "Campaigning Prohibition".

---

## ⚙️ Fallback Mechanism
In cases where live scraping is blocked (e.g., CAPTCHAs or dynamic rendering issues), ClearVote utilizes a **Hardened Fallback Library** (documented in `lib/scraper.ts`). 

### Benchmark Test:
- **Condition**: Disconnect network or block ECI domain.
- **Input Query**: "Voter list name missing"
- **Result**: System must surface the internal ECI-compliant protocol: *"If your name is not on the electoral roll, you cannot vote... Source: ECI FAQ Section 1."*
