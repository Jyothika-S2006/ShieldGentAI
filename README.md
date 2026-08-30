# ShieldGent AI

**Real-time UPI & SMS scam-detection agent** — built for the All Things Agentic Hackathon (Taskmaster track).

ShieldGent AI analyzes suspicious messages using Gemini + Google ADK, assigns a risk score, extracts evidence, and drafts a recommended action (log / alert / complaint) — with a human always required to approve before anything is sent. It does not claim to block transactions; it detects, recommends, and hands off to a human.

## The problem

Scam SMS and UPI fraud attempts don't wait for a convenient time, and by the time someone manually decides a message is suspicious, the response (filing a complaint, warning family) is its own multi-step chore people often skip. ShieldGent AI automates the analysis and drafts the response, so the only thing left for a human is a single approval.

## Features

- Paste any message into the **Analyze Threat** page for live analysis
- Gemini + Google ADK agent classifies risk as `SAFE`, `SUSPICIOUS`, or `HIGH_RISK`
- Extracts specific threat signals and evidence from the message text
- Recommends one action: `LOG`, `DRAFT_ALERT`, or `DRAFT_COMPLAINT`
- Persists every incident to Firestore
- Live security-console dashboard showing incident history, risk stats, and approve/reject controls
- Human approval required before any recommended action is considered final

## Architecture

```
┌──────────────────────────────┐
│   Analyze Threat UI          │
│  (React + Vite + Tailwind)   │
└───────────┬──────────────────┘
            │ POST /analyze
            ▼
┌──────────────────────────────┐
│    FastAPI Backend           │
│  /analyze, /incidents,       │
│  /approve, /reject           │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│    Google ADK Agent          │
└───────────┬──────────────────┘
            │ calls
            ▼
┌──────────────────────────────┐
│  Gemini API (gemini-2.0)     │
└──────────────────────────────┘
            │
            ▼
┌──────────────────────────────┐
│  Firestore Database          │
│  (Google Cloud, Mumbai)      │
└──────────────────────────────┘
```


- **Frontend:** React + Vite + Tailwind CSS, dark glassmorphism security-console UI
- **Backend:** FastAPI (Python)
- **Agent framework:** Google ADK
- **LLM:** Gemini API (`gemini-3.6-flash`)
- **Database:** Firestore (Native mode, Mumbai region)

## Setup / Spin-up instructions

### Prerequisites
- Python 3.13+
- Node.js 20+
- A Gemini API key ([aistudio.google.com](https://aistudio.google.com))
- A Firebase project with Firestore enabled, and a downloaded service-account JSON

### Backend Setup

1. **Create virtual environment and install dependencies:**
```bash
cd shieldgent
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

2. **Set up environment variables:**
   Create `.env` in the `shieldgent/` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Add Firebase credentials:**
   Place your Firebase service-account JSON at:
   ```
   shieldgent/credentials/firebase-service-account.json
   ```
   (Download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key)

4. **Run the backend:**
```bash
cd shieldgent
python -m uvicorn backend.main:app --reload --port 8080
```
Backend runs at `http://127.0.0.1:8080`

### Frontend Setup

```bash
cd shieldgent/frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Verify Setup
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8080/docs (FastAPI Swagger docs)
- Both services should communicate automatically

## API Endpoints

### POST `/analyze`
Analyze a suspicious message and get a threat assessment.

**Request:**
```json
{
  "message": "Your UPI account has been compromised. Click here..."
}
```

**Response:**
```json
{
  "risk_level": "HIGH_RISK",
  "evidence": ["Phishing link", "Urgency language"],
  "recommended_action": "DRAFT_COMPLAINT",
  "incident_id": "abc123"
}
```

### GET `/incidents`
Fetch all incidents from Firestore with risk statistics.

### POST `/approve`
Human approves and finalizes a recommended action.

### POST `/reject`
Human rejects a recommendation.
## Demo
The demo video shows a live message pasted into the Analyze Threat page, the Gemini call happening in real time, and the resulting incident appearing in both the dashboard and the Firestore console — proving the Google Cloud (Firestore) backend is genuinely processing the request live.

## Troubleshooting

- **Backend connection error:** Ensure backend is running on port 8080 and frontend `.env` or config points to `http://127.0.0.1:8080`
- **Firestore authentication fails:** Verify `credentials/firebase-service-account.json` path and file content
- **Gemini API errors:** Check `GEMINI_API_KEY` is valid and has quota remaining at aistudio.google.com
- **CORS issues:** Backend is configured to accept frontend origin; clear browser cache if needed

## Hackathon category
Taskmaster — this agent handles a real, personal chore (recognizing and responding to scam messages) end-to-end rather than just answering questions about them.
### Technologies used / disclosures
Built with Gemini API, Google ADK, Firestore, FastAPI, React, and Tailwind CSS. AI coding assistance (Claude) was used during development for debugging and boilerplate, per the hackathon's permitted-tools rules. This is a fresh project built entirely during the Submission Period.
### License
MIT

