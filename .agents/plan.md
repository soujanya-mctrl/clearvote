# Implementation Plan & Roadmap
## Project: ClearVote (TypeScript Backend + Gemini + Scraper)

This plan is optimized for a fast-paced hackathon environment, ensuring you hit the evaluation criteria: Code Quality, Security, Efficiency, and Google Services Integration.

### Phase 1: Foundation & Boilerplate (Hours 1 - 4)
**Goal:** Initialize the project, set up strict TypeScript configurations, and ensure the repository starts perfectly clean to respect the 1MB limit.
* **Task 1.1:** Initialize Git repository and set up `.gitignore` (exclude `node_modules`, `.env`, build folders).
* **Task 1.2:** Initialize Node project (`npm init -y`) and install core dependencies: `express`, `typescript`, `ts-node`, `cors`, `dotenv`.
* **Task 1.3:** Set up `tsconfig.json` for strict typing.
* **Task 1.4:** Create a basic Express server skeleton in `src/server.ts` with a simple health-check endpoint.
* **Task 1.5:** Initial commit and push to the public GitHub repository.

### Phase 2: Web Scraping Engine (Hours 5 - 8)
**Goal:** Build the module that fetches official ground-truth data.
* **Task 2.1:** Install lightweight scraping tool (`cheerio` and `axios`).
* **Task 2.2:** Identify 1-2 official election FAQ pages to serve as your data source.
* **Task 2.3:** Write a scraping utility (`src/scraper/index.ts`) that fetches the URL, parses the HTML, and extracts relevant Q&A pairs or policy text.
* **Task 2.4:** Implement basic caching in memory (e.g., a simple Map) so you don't re-scrape the same page on every user request.

### Phase 3: Gemini API Integration & Logic (Hours 9 - 14)
**Goal:** Integrate Google Services and build the core intelligent routing and synthesis logic.
* **Task 3.1:** Install Google Gen AI SDK (`@google/generative-ai`).
* **Task 3.2:** Craft the **System Instruction (The Guardrail)**. This is the most important prompt. It must strictly instruct Gemini to only answer process/logistical questions and refuse political ones.
* **Task 3.3:** Create the primary API endpoint (e.g., `POST /api/verify`).
* **Task 3.4:** Implement the flow:
    1. Receive user query.
    2. Check memory cache for relevant scraped data.
    3. Pass query + scraped context to Gemini API.
    4. Gemini returns structured JSON (Verdict: True/False/Misleading, Explanation: string).
* **Task 3.5:** Test backend heavily via Postman/cURL for edge cases (e.g., trying to trick the bot into endorsing a candidate).

### Phase 4: Minimalist Frontend (Hours 15 - 18)
**Goal:** Build a sleek, accessible, zero-asset UI to stay under the 1MB limit.
* **Task 4.1:** Create `public/index.html`, `public/style.css`, and `public/app.js`.
* **Task 4.2:** Design a monochrome interface. Use high-contrast typography (e.g., Inter or a system font stack to avoid loading web fonts) and clean input fields.
* **Task 4.3:** Implement the chat/verification interface in Vanilla JS. Add loading states (spinners or text like "Verifying official sources...") while the backend processes.
* **Task 4.4:** Ensure the interface is fully responsive using CSS Grid/Flexbox.

### Phase 5: Polish, Security & Submission (Hours 19 - 24)
**Goal:** Finalize the repository for judging, focusing on the README and code quality.
* **Task 5.1:** Code Review. Ensure TypeScript interfaces are used everywhere, error handling (try/catch) is robust, and no console.logs are leaking data.
* **Task 5.2:** Verify repository size. Run a clean build and check the size of the `.git` folder and tracked files.
* **Task 5.3:** Write the comprehensive `README.md`. It MUST include:
    * The chosen vertical (Election Process Education).
    * The logic and approach (Guardrails, Scraping official sources, Gemini synthesis).
    * Setup instructions to run the code.
* **Task 5.4:** Final end-to-end testing.
* **Task 5.5:** Final commit and submission via the hackathon portal.