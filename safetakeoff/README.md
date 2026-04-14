# Safe TakeOff — Frontend (STO-frontend)

> React + TypeScript ATC decision-support dashboard.  
> Live at **https://safetakeoff.supul9229kalhara.workers.dev**

---

## What it does

Safe TakeOff gives Air Traffic Controllers a real-time dashboard to evaluate flight departure safety. The frontend provides:

- **Go / No-Go panel** — side-by-side Claude Agent and XGBoost recommendations with confidence scores, reasoning, and risk factors
- **Decision history** — full audit trail of past decisions with ATC feedback form
- **ML metrics** — live model accuracy dashboard per aerodrome (agent vs XGBoost)
- **Global airspace monitor** — Leaflet map showing live simulated fleet positions
- **Weather widget** — current METAR conditions
- **NOTAM digest** — active notice to airmen
- **Aircraft fleet** — registered fleet with wake turbulence categories
- **Wake turbulence timer** — separation countdown calculator
- **Dark ATC theme** — EUROCONTROL-inspired palette for low-light ops rooms

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| UI components | Material-UI (MUI) v5 |
| Charts | Recharts |
| Map | Leaflet (dynamically loaded) |
| State management | Zustand |
| Data fetching | Axios + TanStack Query |
| Testing | Vitest + Testing Library |
| Deployment | Cloudflare Workers (Static Assets) |

---

## Project structure

```
src/
├── App.jsx                        # Root router, theme, protected routes
├── services/
│   ├── api.ts                     # Axios instance — reads VITE_API_URL
│   └── authService.ts             # login / logout / signup / token refresh
├── store/
│   ├── authStore.ts               # Zustand — isLoggedIn, login(), logout()
│   └── aircraftStore.ts           # Zustand — fleet data
├── types/
│   └── aviation.ts                # TypeScript interfaces
├── Components/
│   ├── Auth/
│   │   └── ProtectedRoute.tsx     # Redirects unauthenticated users to /login
│   ├── Landing/
│   │   └── LandingPage.tsx        # Public homepage
│   ├── Login/
│   │   └── Login.jsx              # Sign-in form
│   ├── SignUp/
│   │   └── SignUp.tsx             # Registration form
│   ├── Dashboard/
│   │   ├── Dashboard.jsx          # Main ATC command centre (KPIs, map, fleet)
│   │   ├── ResponsiveAppBar.tsx   # Top navigation bar
│   │   ├── GoNoGoPanel.tsx        # Dual-model decision panel ← Phase 3B
│   │   ├── DecisionHistory.tsx    # Audit trail + ATC feedback ← Phase 3B
│   │   ├── MLMetrics.tsx          # Accuracy dashboard ← Phase 3B
│   │   └── Widgets/
│   │       ├── WorldMapWidget.jsx # Leaflet live flight map
│   │       ├── WeatherWidget.jsx  # METAR widget
│   │       ├── AircraftWidget.jsx # Fleet table
│   │       └── NotamWidget.jsx    # NOTAM list
│   ├── GoNoGo/
│   │   └── GoNoGoPanel.tsx        # Standalone Go/No-Go evaluation page
│   ├── Weather/
│   │   └── PredictWeather.tsx
│   ├── WakeTurbulence/
│   │   └── WakeTurbulenceTimer.tsx
│   └── Notam/
│       └── NotamDigest.tsx
└── __tests__/
    └── setup.ts
```

---

## Getting started locally

### Prerequisites
- Node.js 20+
- Backend running at `http://localhost:8000` (see STO-server README)

### Setup

```bash
# 1. Clone and enter app directory
git clone https://github.com/supulkalhara/STO-frontend.git
cd STO-frontend/safetakeoff

# 2. Install dependencies
npm install

# 3. Configure API URL (already set for local dev)
# src/.env contains:
#   VITE_API_URL=http://localhost:8000

# 4. Start dev server
npm run dev
# → http://localhost:5173
```

### Login with demo credentials

| Email | Password | Role |
|-------|----------|------|
| `atc@safetakeoff.dev` | `SafeTakeOff2026!` | ATC Officer |
| `supervisor@safetakeoff.dev` | `SafeTakeOff2026!` | ATC Supervisor |

---

## Available scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Production build → dist/
npm run preview      # Serve production build locally
npm run typecheck    # TypeScript type checking
npm run test         # Run unit tests (Vitest)
npm run test:watch   # Watch mode tests
```

---

## Pages and routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with feature overview |
| `/login` | Public | Sign-in form |
| `/signup` | Public | Account registration |
| `/dashboard` | Protected | ATC command centre (default after login) |
| `/gonogo` | Protected | Go/No-Go evaluation panel |
| `/weather` | Protected | Weather prediction tool |
| `/aircrafts` | Protected | Aircraft fleet management |
| `/wake-turbulence` | Protected | Wake turbulence separation timer |
| `/notam` | Protected | NOTAM digest viewer |
| `/config` | Protected | App configuration |

---

## Using the dashboard

### 1. Login
Go to `/login` → enter your credentials → you land at `/dashboard`.

### 2. ATC command centre (`/dashboard`)
- Top row shows **fleet KPIs**: total aircraft, heavy operations, weather category, ML engine status
- **Global Airspace Monitor** (Leaflet map) — click a plane icon to see callsign, registration, route, and altitude
- **Weather Widget** — live METAR for the selected station
- **Aircraft Fleet** — full fleet table with wake turbulence categories
- **NOTAM Digest** — active notices with severity colour coding

### 3. Go/No-Go evaluation (`/gonogo`)
1. Select an aircraft from the fleet
2. The system pulls live METAR + NOTAMs for the departure aerodrome
3. Both models evaluate simultaneously:
   - **Claude Agent card** — decision, confidence bar, full reasoning text, risk factor chips
   - **XGBoost card** — decision, confidence bar, risk score gauge
4. **Model Consensus** badge: green if both agree, amber if they disagree
5. Click **Re-evaluate** to refresh with the latest conditions
6. Click **This Helps / Not Helpful** to record feedback

### 4. Decision history (`/dashboard` → Decision History tab)
- Table of all recorded decisions: callsign, ICAO, agent prediction, XGBoost prediction, ATC decision, outcome
- Click **Add Feedback** on any row to submit the actual outcome:
  - ATC Decision: GO / CAUTION / NO-GO
  - Outcome: COMPLETED_SAFELY / DIVERTED / INCIDENT
  - Free-text reason
- This feedback is used to retrain models quarterly

### 5. Model metrics (`/dashboard` → Model Metrics tab)
- Key cards: total decisions, feedback rate, agent accuracy %, XGBoost accuracy %
- Bar charts: accuracy comparison, average confidence, precision by decision class
- Filter by time period: 7 / 30 / 90 days
- Accuracy shown green (≥80%), amber (≥70%), red (<70%)

---

## Environment variables

| Variable | Dev value | Production value |
|----------|-----------|-----------------|
| `VITE_API_URL` | `http://localhost:8000` | `https://sto-server.onrender.com` |

Production value is set in the Cloudflare Workers dashboard under **Variables & Secrets**.

---

## Deployment (Cloudflare Workers)

Auto-deploys from the `main` branch via CI:

```
Build command:   npm run build
Output dir:      dist/
Deploy command:  npx wrangler deploy
```

SPA routing (React Router) is handled by `wrangler.jsonc`:
```jsonc
"assets": { "not_found_handling": "single-page-application" }
```

All unknown URLs serve `index.html` and React Router takes over client-side.

### Adding a new environment variable

1. Cloudflare dashboard → Workers → `safetakeoff` → **Settings** → **Variables & Secrets**
2. Add key/value → **Save**
3. Re-deploy or push a new commit to pick it up

---

## Colour palette (dark ATC theme)

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#0a0d11` | Page background |
| Paper | `#13181f` | Card / panel background |
| Primary (ATC green) | `#00c853` | Accents, GO decisions |
| Secondary (amber) | `#ff8f00` | CAUTION decisions |
| Error | `#f44336` | NO-GO decisions |
| Info (cyan) | `#29b6f6` | Highlights |
| Text primary | `#e8eaf6` | Body copy |
| Text secondary | `#90a4ae` | Labels |

---

## Known limitations

- Map data is simulated (static flight coordinates for demo)
- Weather and NOTAM data depend on external APIs — may be rate-limited
- Model accuracy is ~62% on synthetic data; improves with real ATC feedback (target 80%+)
- Render free tier sleeps after 15 min inactivity — first login after idle may take ~30 s
