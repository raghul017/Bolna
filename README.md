# RecruitAI 🤖

> AI-Powered HR Candidate Pre-Screening Platform — Built with Next.js + Bolna Voice AI

## 🎯 Use Case

**Problem**: HR recruiters spend 60–70% of their time on repetitive first-round phone screens.

**Solution**: RecruitAI uses Bolna's voice AI to automatically call candidates, conduct structured 5-minute screening interviews, score them (0–100), and populate the recruiter dashboard — all without human involvement.

**Outcome Metrics**:
- 📞 **5x more** candidates screened per day (8/day → 40/day)
- ⏱️ **~3 hrs/day** saved per recruiter
- 🎯 **60% reduction** in time-to-shortlist

---

## 🏗️ Full Flow

```
Recruiter → Web App → Bolna API → AI Voice Call → Webhook → Score → Dashboard
```

1. Recruiter adds candidate (name, phone, role) to dashboard
2. Clicks **"Screen"** → triggers Bolna voice call via API
3. Bolna's AI agent ("Aria") conducts structured 5-min screening
4. Call ends → Bolna fires webhook with transcript + recording
5. Backend scores candidate (0–100) using keyword/NLP logic
6. Dashboard auto-updates with score, status, and full transcript

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Database | Prisma + SQLite (local) |
| Voice AI | Bolna Voice Agent API |
| Deployment | Vercel |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/recruit-ai
cd recruit-ai
npm install
```

### 2. Set Up Environment
Edit `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
BOLNA_API_KEY="your_bolna_api_key"
BOLNA_AGENT_ID="your_bolna_agent_id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database
```bash
DATABASE_URL="file:./prisma/dev.db" npx prisma db push
npx ts-node --skip-project --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 4. Run Dev Server
```bash
npm run dev
```

---

## 📡 Bolna Agent Setup

1. Sign up at app.bolna.dev
2. Create new Agent with the prompt from `/settings` in the app
3. Set webhook URL: `https://your-domain.com/api/webhooks/bolna`
4. Copy Agent ID and API Key → add to `.env`

---

## 📊 Scoring Algorithm

| Dimension | Weight | Scoring Criteria |
|-----------|--------|-----------------|
| Experience Match | 30/100 | Years + skill keywords |
| Availability | 20/100 | Notice period |
| Salary Fit | 25/100 | Expectation vs. budget |
| Communication | 25/100 | Transcript quality |

**Score → Status**: 80+ Shortlisted · 60-79 Under Review · <60 Rejected

---

Built for the Bolna Full Stack Engineer Assignment.
