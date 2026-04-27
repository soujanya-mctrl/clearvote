# ClearVote 🗳️
### The Impartial Election Process Integrity Engine

**ClearVote** is an AI-powered verification platform designed to ensure election process education and logistical integrity. Built for the modern voter, it separates official ground truth from misinformation using high-fidelity scraping and state-of-the-art generative AI.

---

## 🚀 The Three Pillars of ClearVote

### 1. 🔍 Claim Verifier (The Intelligence Engine)
A real-time verification tool that uses **Gemini 2.5 Flash** and **Puppeteer** to:
- Scrape official ECI (Election Commission of India) portals and reputable news archives.
- Provide cited verdicts (True, False, Misleading) with **Ground Truth Snippets**.
- Cross-reference logistical rules like EVM mechanics, conduct protocols, and voting rights.

### 2. 🛡️ Electoral Identity Dashboard (Readiness Vault)
A DigiLocker-inspired dashboard that simulates a secure data exchange to:
- Verify essential documentation (Aadhaar, PAN, EPIC).
- Track electoral readiness and booth allocation.
- Provide actionable "How to Get It" guides for missing or pending documents.

### 3. 🗺️ Process Navigator (Interactive Education)
Guided, step-by-step interactive flows for complex electoral tasks:
- **Registration**: Understanding Form 6, BLO verification, and roll inclusion.
- **Polling Day Rights**: Knowing your rights inside the booth, including secrecy of ballot and challenged votes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Scraper**: [Puppeteer](https://pptr.dev/) (Headless Chromium)
- **Authentication**: [Firebase Auth](https://firebase.google.com/)
- **Styling**: Tailwind CSS (Pro-Grade Minimalist Aesthetic)

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/clearvote.git
cd clearvote
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key

# Firebase (Optional for Demo Mode)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore ClearVote.

---

## 🛡️ Process Integrity Protocol
ClearVote is built on a foundation of strict impartiality. Our AI engine is instructed to prioritize **Official ECI Handbooks** and **Ground Truth Sources** over subjective commentary, ensuring that every verdict is rooted in the actual mechanics of the election process.

---
*Developed for the Election Process Education Hackathon.*
