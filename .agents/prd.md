Gemini
Election Education Hackathon Ideas
Conversation with Gemini
Important Rules

You have a maximum of 2 submission attempts for the Warm Up Round

You have a maximum of 4 submission attempts (For Actual Challenge Round)

The repository size must be less than 1 MB

The GitHub repository must be public

The repository should contain only one branch

Failure to follow these rules may result in your submission not being evaluated

Challenge Expectations

Your solution should demonstrate:

Ability to build a smart, dynamic assistant

Logical decision making based on user context

Effective use of Google Services

Practical and real-world usability

Clean and maintainable code

Participants must choose one of the provided challenge verticals and design their solution around that persona and logic.

How to Work on Your Project

Create a new repository on GitHub

Ensure the repository is set to public

Open Google Antigravity

Clone your repository inside Antigravity

Build your solution through prompting and coding

Regularly commit and push your progress

Keep all work within a single branch

What to Submit

Note: For detail guide on how to submit. Please refer to the documentLink

Your submission must include:

A public GitHub repository link

Complete project code inside the repository

A README explaining:Your chosen vertical

Approach and logic

How the solution works

Any assumptions made

Evaluation Focus Areas

Submissions will be reviewed on:

Code Quality – structure, readability, maintainability

Security – safe and responsible implementation

Efficiency – optimal use of resources

Testing – validation of functionality

Accessibility – inclusive and usable design

Google Services – meaningful integration of Google Services

Challenge : "Election Process Education"

lets figure out some ideas to build that's going to be innovative and actually helpful and ignored....also explain your reasoning behind each idea

This sounds like an exciting hackathon challenge! "Election Process Education" is a fantastic vertical because while everyone focuses on who to vote for, almost no one builds tools for how the mechanics of voting actually work.

Given the strict 1 MB repository limit, your solution needs to be lightweight—meaning relying on clean web code (like Python/JavaScript) and API calls rather than bundling heavy assets. A minimalist, monochrome UI would look highly professional and keep your asset size practically zero.

Here are three innovative, highly practical ideas that target the "ignored" aspects of election education, along with the reasoning and how to hit those evaluation criteria.

1. The "First-Time Voter Sandbox" (A Voting Booth Simulator)
The Concept: An interactive, text-and-UI-based simulator that walks a user through the exact physical and logistical steps of voting in their specific area. It simulates arriving at the polling place, checking in, and navigating a mock ballot, with an AI assistant available at every step to answer hyper-specific questions ("Can I wear a campaign shirt?", "What if I make a mistake on the paper?").

Why it's ignored (The Innovation): Most election tools are just glorified candidate directories or static FAQ pages. They ignore the intense "first-time anxiety" people feel about the physical process of voting.

Google Services Integration: Use Google Maps API to simulate finding the user's specific polling place and checking operating hours, and Gemini API as the conversational agent answering logistical questions during the simulation.

Evaluation Edge: High marks for Accessibility (demystifying the process for new voters or those with anxiety) and Usability.

2. The "Down-Ballot Decoder"
The Concept: An AI assistant specifically designed to educate voters exclusively on local elections (city council, school board, local propositions, judges). The user inputs their zip code, and the assistant breaks down what the local roles actually do, the impact of local propositions in plain language, and the mechanics of ranked-choice voting if applicable locally.

Why it's ignored (The Innovation): National elections suck all the oxygen out of the room. Voter drop-off for local down-ballot races is massive because the information is incredibly hard to find and dense to read.

Google Services Integration: Use Google Custom Search API to pull in recent local news articles related to the specific propositions or roles, combined with Gemini API to summarize the legal jargon into simple, readable text.

Evaluation Edge: Massive points for Practical, real-world usability. It solves a genuine information gap.

3. The "Poll Worker Co-Pilot"
The Concept: Instead of building an app for the voter, build an assistant for the volunteer poll worker. It acts as an interactive, intelligent manual. If a voter shows up without an ID, or a machine jams, or someone needs a provisional ballot, the volunteer can ask the Co-Pilot exactly what the legal protocol is for their jurisdiction.

Why it's ignored (The Innovation): Everyone builds for the voter. No one builds for the volunteers running the process, who are often overwhelmed, relying on massive printed binders, and facing long lines of angry people when technical glitches happen.

Google Services Integration: You could integrate Google Cloud Speech-to-Text so the poll worker can ask questions hands-free while dealing with paperwork, using Gemini API to quickly retrieve the exact standard operating procedure.

Evaluation Edge: Incredible Logical decision making. It targets a deeply under-served user persona. From a coding perspective, designing a state-based workflow engine for this would demonstrate excellent Code Quality.

Hackathon Strategy Tips
Keep it under 1MB: Don't include huge libraries or images. Rely on pure code, APIs, and clean CSS styling.

Security: If you ask for a user's location to find polling data, make sure your README heavily emphasizes that no data is stored locally and location data is only held in memory for the session.

Which of these angles—the anxious voter, the local election gap, or the overwhelmed volunteer—sounds like the most fun problem for you to tackle?

give me some practical and useful ideas that much aligns with the challenge

If you want to get highly practical and strictly align with the requirement to build a smart, dynamic assistant while staying under a 1 MB repository limit, we need to focus on text-heavy, API-driven solutions. Using a sleek, minimalist, single-color web interface will keep your UI assets practically at zero bytes, allowing the logic and APIs to do the heavy lifting.

Here are three highly actionable, code-focused ideas that hit every single evaluation criteria—especially logical decision-making and Google Services integration:

1. The EVM/VVPAT Workflow Assistant
The Concept: A dynamic, state-based web assistant that educates users strictly on the mechanical flow of voting. It simulates the physical process of interacting with an Electronic Voting Machine (EVM) and verifying the Voter Verifiable Paper Audit Trail (VVPAT).

The Logic: Instead of a static FAQ, the assistant treats the election process as a workflow graph. The user progresses through stages (e.g., Identity Check → Pressing the Button → VVPAT Verification). At any node, they can ask the assistant edge-case questions.

Google Services Integration: Use the Gemini API with strict system instructions to act as an impartial election hardware expert.

Evaluation Edge: This demonstrates exceptional Logical decision making. You can build a very clean Python or JavaScript backend that manages the "state" of the voter, showing you know how to handle application flow.

2. The Official Forms Co-Pilot (e.g., Form 6 Navigator)
The Concept: The biggest barrier to voting is the paperwork (like Form 6 for voter registration). This assistant doesn't just tell you to register; it breaks down the complex official document step-by-step. It asks the user simple questions ("Are you a student living away from your permanent address?", "Do you have a utility bill?") and dynamically generates a personalized checklist of required documents and deadlines.

The Logic: It uses a decision-tree logic to filter out irrelevant information. If a user says they are a first-time voter, it automatically skips the "change of address" protocols.

Google Services Integration: Combine the Gemini API for the conversational interface with the Google Custom Search JSON API, restricted specifically to official government election portals (e.g., .gov.in or .gov domains). This ensures the bot only cites official protocol.

Evaluation Edge: Huge points for Security and responsible implementation. By strictly limiting the search domain, you prevent the bot from hallucinating or pulling in partisan misinformation.

3. The Inclusive Voter Protocol Bot (Accessibility Focus)
The Concept: An assistant built specifically to educate voters with disabilities (PwD) and their companions about their legal rights and the physical protocols at the polling booth.

The Logic: It dynamically guides users through available accommodations based on their specific needs (e.g., rules for wheelchair access, how visually impaired voters can use Braille features on machines, or the protocol for bringing a voting companion).

Google Services Integration: Gemini API for natural language understanding, paired with Google Cloud Translation API to instantly offer this highly critical logistical information in multiple regional languages.

Evaluation Edge: This directly hits the Accessibility evaluation criteria, which is a massive differentiator in hackathons. It’s highly practical, solves a real-world problem, and is completely ignored by mainstream election apps.

Which of these technical approaches—a state-based workflow simulator, a document logic parser, or a multi-lingual accessibility bot—feels like the most natural fit for the languages and frameworks you plan to use?

no i have an idea a voting research, fact checker assistant....how good does it sound and how much it aligns with the given challenge "Election eduction"

It sounds like a highly technical and very relevant idea, but to make sure you win, we need to be incredibly precise about how you frame it.

Here is the honest truth: a fact-checker is a brilliant technical project, but if it focuses on fact-checking politicians or political claims (e.g., "Did Candidate X actually raise taxes?"), it risks missing the core of the challenge. The vertical is explicitly "Election Process Education." Furthermore, dealing with political claims introduces massive risks regarding AI bias, hallucination, and safety guardrails, which judges will heavily scrutinize under the "Security" evaluation.

However, if you pivot the idea slightly to an "Election Process Myth-Buster & Logistics Fact-Checker," it goes from a good idea to a potential winner.

Here is how you align it perfectly with the challenge and the evaluation criteria.

The Pivot: The "Process Integrity Fact-Checker"
Instead of verifying political speeches, your assistant focuses entirely on combating misinformation regarding how, when, and where to vote, and the security of the voting systems. Misinformation about the voting process itself is a massive threat to democracy and causes widespread confusion.

Examples of what it would fact-check:

"I saw a WhatsApp forward that says I can vote online this year. Is that true?"

"Someone told me EVMs can be hacked via Bluetooth. Fact check this."

"Is it true that if I wear a party's colors, they won't let me inside the booth?"

"A post says the polling date for my city was moved to tomorrow."

Why this aligns perfectly with the challenge:
Directly tackles "Process Education": It educates voters on the actual mechanics and rules by correcting false information.

Highly Innovative: Most educational tools assume the user is starting from zero. This tool assumes the user is starting from negative knowledge (misinformation) and corrects it.

Security & Responsible Implementation (Evaluation Focus): You can build a strict "Guardrail System." If a user asks a political question ("Is Candidate A corrupt?"), the assistant intelligently deflects: "I am designed only to verify the logistics, rules, and hardware of the voting process. I cannot evaluate political candidates." Judges will love this logical boundary.

How to Build It (Keeping it under 1MB)
To keep the repository tiny and the code clean, you can rely on a lightweight stack.

The Backend (Python): Use a lightweight framework like Flask or FastAPI to handle API requests. This keeps your logic clean and easily testable.

The Frontend (Web Tech): A sleek, single-page vanilla JavaScript application. Using a minimalist, single-color monochrome aesthetic not only looks highly professional and modern but also requires zero image assets, practically guaranteeing your repo stays well under the 1MB limit.

Google Services Integration:

Google Fact Check Tools API: Program the assistant to query this API specifically filtering for publishers like official election commissions or verified news outlets to verify process-related claims.

Google Programmable Search Engine (Custom Search API): Restrict a search engine to search only official government domains (e.g., .gov.in or official election authority websites).

Gemini API: Use Gemini to interpret the user's messy input, query the Google Search/Fact Check APIs, and synthesize the official response into a simple, easy-to-read "True / False / Misleading" verdict with a brief explanation.

This approach gives you a dynamic assistant, strong logical decision-making (routing political vs. process queries), and exceptional use of Google Services.

What do you think about focusing the fact-checking specifically on the logistics and hardware of the voting process to keep it strictly educational?

build a very good prd.md and plan.md files i will use next for this project, backend in type script Gemini api, and a web scrapper

Your Markdown files for the PRD and Implementation Plan are ready.
MD icon
 prd 
MD
MD icon
 plan 
MD

The PRD clearly outlines the guardrails and the focus on process integrity, which will score high on the security and logical decision-making rubrics. The Implementation Plan is structured specifically for a fast-paced hackathon, prioritizing the backend logic and the strict <1MB constraint. Good luck with the build!

output is required with supporting sources and confidence score

This is a massive structural improvement. For a hackathon evaluation, adding a confidence_score and explicit sources elevates the project from a standard API wrapper to a highly robust, trustworthy system. Judges reviewing the "Security" and "Logical decision making" criteria will look exactly for this kind of traceability.

To implement this, you need to enforce a strict JSON schema in your Gemini API call. Here is the updated architecture for your TypeScript backend to handle this specific output requirement.

1. The TypeScript Interface
Define this contract in your backend so your frontend knows exactly what to expect.

TypeScript
// src/types.ts
export interface FactCheckResponse {
    verdict: "True" | "False" | "Misleading" | "Out of Scope";
    confidence_score: number; // 0 to 100
    explanation: string;
    sources: Array<{
        title: string;
        url: string;
    }>;
}
2. The Gemini System Instruction (The Core Prompt)
To force Gemini to output this exact structure based on your scraped data, you must inject the scraped context alongside strict formatting rules.

Here is the exact prompt structure to use in your API call:

Plaintext
You are the intelligence engine for ClearVote, an impartial election logistics and process verifier.
Your mandate is strictly to verify the mechanics, rules, and hardware of the election process. You must ignore political, candidate-based, or partisan queries (mark these as "Out of Scope").

Analyze the USER_QUERY against the SCRAPED_OFFICIAL_CONTEXT provided below.

USER_QUERY: "{user_input}"

SCRAPED_OFFICIAL_CONTEXT: 
[Source 1: url_here] "text snippet from your web scraper"
[Source 2: url_here] "text snippet from your web scraper"

INSTRUCTIONS:
1. Determine if the USER_QUERY is True, False, Misleading, or Out of Scope based ONLY on the provided context.
2. Generate a concise explanation.
3. Assign a confidence score (0-100) based on how directly the scraped context addresses the query.
4. List the specific sources from the context that justify your verdict.

You MUST respond in raw JSON format exactly matching this structure:
{
  "verdict": "True | False | Misleading | Out of Scope",
  "confidence_score": 85,
  "explanation": "Clear, objective explanation derived strictly from the sources.",
  "sources": [
    {"title": "Name of the official document or page", "url": "https://..."}
  ]
}
3. Handling the Output in Express
When calling the Gemini model in your Node/Express route, make sure to set the responseMimeType so the API knows to strictly enforce the JSON structure.

TypeScript
// src/server.ts (Snippet)
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

app.post('/api/verify', async (req, res) => {
    try {
        const { query, scrapedContext } = req.body;
        
        // Initialize model with JSON constraint
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Construct prompt using the template above
        const prompt = buildPrompt(query, scrapedContext); 
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Safely parse the enforced JSON
        const factCheckResult: FactCheckResponse = JSON.parse(responseText);
        
        res.status(200).json(factCheckResult);

    } catch (error) {
        console.error("Inference Error:", error);
        res.status(500).json({ error: "Failed to verify query." });
    }
});
Why this specific setup wins:
Traceability: By feeding the scraper URLs directly into the prompt as [Source X: URL], you force the AI to cite its exact origin, eliminating hallucinations.

Granular Trust: A verdict of "False" with a 99% confidence score is vastly different from a "False" with a 45% confidence score. You can build logic in your minimalist UI to highlight low-confidence responses in a different shade (e.g., a muted gray warning box), showing judges you understand AI limitations.

How are you planning to handle the initial data pipeline? Will the web scraper run dynamically in real-time when a user asks a question, or are you planning to pre-scrape a set of official FAQs into memory when the server boots up to save time during the hackathon judging?





Gemini is AI and can make mistakes.

# Product Requirements Document (PRD)
## Project: ClearVote (Election Process Educator & Myth-Buster)

### 1. Executive Summary
ClearVote is a dynamic, lightweight web-based assistant designed for the "Election Process Education" hackathon challenge. Unlike traditional platforms that focus on political candidates, ClearVote exclusively focuses on the **logistics, rules, and integrity of the voting process**. It acts as a real-time myth-buster and fact-checker, using a TypeScript backend, a web scraper for official sources, and the Gemini API to analyze user queries and debunk process-related misinformation.

### 2. Problem Statement
Voters often face a barrage of misinformation regarding *how* to vote (e.g., ID requirements, EVM security, polling station rules). Misinformation about the process itself creates confusion, disenfranchisement, and distrust. Existing tools are often bloated or overly focused on partisan politics, ignoring the mechanical and legal reality of casting a ballot.

### 3. Target Audience
* **First-Time Voters:** Needing clear, step-by-step logistical guidance.
* **Voters Exposed to Misinformation:** Users who have seen dubious claims on social media regarding voting mechanics and need verification.
* **Marginalized/Disabled Voters:** Users seeking precise rules regarding polling station accessibility and their legal rights.

### 4. Core Features & Functional Requirements

#### 4.1. Intelligent Query Routing (The "Guardrail")
* **Requirement:** The system must differentiate between "Process/Logistics" queries and "Political/Candidate" queries.
* **Behavior:** If a user asks a political question (e.g., "Is Candidate X corrupt?"), the assistant must gracefully deflect and state its mandate to only discuss election logistics.

#### 4.2. Official Data Scraping
* **Requirement:** The backend must actively scrape relevant, official election portals (e.g., official `.gov` or `.gov.in` FAQ pages, depending on the chosen locale) to ground the AI's responses in current facts.
* **Behavior:** When a query is received, the scraper extracts the most recent structural data from designated official URLs to serve as context for Gemini.

#### 4.3. Fact-Checking & Myth-Busting Engine
* **Requirement:** The assistant evaluates a user's claim or question against the scraped official data.
* **Behavior:** Returns a structured verdict: **[True]**, **[False]**, or **[Misleading]**, followed by a concise, easy-to-understand explanation citing the logistical rule.

#### 4.4. The "Under 1MB" Minimalist UI
* **Requirement:** The application must strictly adhere to the < 1MB repository limit.
* **Behavior:** No heavy frontend frameworks (no React/Angular). The UI will be built using Vanilla HTML/CSS/JS with a monochrome, typography-driven aesthetic. Zero image assets; purely CSS-styled elements and SVG icons if absolutely necessary.

### 5. Non-Functional Requirements
* **Repository Size:** Strictly under 1 MB.
* **Performance:** The combined scraping and Gemini inference should return a response in under 3 seconds.
* **Security:** Avoid any injection of malicious prompts. Ensure scraped domains are hardcoded to a whitelist to prevent the AI from synthesizing untrusted data.
* **Accessibility:** The UI must pass WCAG AA standards (high contrast, keyboard navigable, screen-reader friendly).

### 6. System Architecture (Tech Stack)
* **Frontend:** Vanilla JavaScript, HTML5, CSS3.
* **Backend:** Node.js with TypeScript.
* **Framework:** Express.js (lightweight API routing).
* **AI/Logic:** Google Gemini API (via `@google/generative-ai`).
* **Web Scraper:** `Cheerio` (for fast, lightweight static HTML parsing) or `Puppeteer-core` (if dynamic rendering is strictly required, though Cheerio is heavily preferred to keep dependencies light and fast).

### 7. Out of Scope
* Candidate directories or manifestos.
* Live polling data or election results.
* User authentication or accounts (to maintain privacy and reduce database overhead).