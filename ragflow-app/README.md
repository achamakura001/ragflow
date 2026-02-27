#  Pipeline Management DashboardRAGFlow 

A production-ready React + TypeScript application for managing RAG (Retrieval-Augmented Generation) pipelines. Handles the full lifecycle: document upload, embedding model selection, vector store configuration, chunking strategy, and live retrieval testing.

---

## Tech Stack

| Concern | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Charts | Recharts |
| Unit Testing | Vitest + React Testing Library |
| E2E Testing | Playwright |
| Deployment | Vercel |

---

## Screens

| Route | Screen |
|---|---|
| `/` |  KPIs, API volume chart, activity feed, pipeline summary |Dashboard 
| `/pipelines` |  tabbed list with run / test / edit actions |Pipelines 
| `/pipelines/new` | Pipeline  7-step wizard |Builder 
| `/api-keys` | API  key table + Python SDK quick-start |Keys 
| `/retrieve-test` | Test  live semantic query with scored results |Retrieval 
| `/settings` |  tenant, security, usage meters, team |Settings 

---

## Project Structure

```
src/
 api/                    # API service layer
 client.ts           # Base fetch wrapper + mock toggle   
 pipelines.ts        # Pipeline CRUD   
 apiKeys.ts          # API key management   
 retrieval.ts        # Semantic search endpoint   
 settings.ts         # Tenant settings   
 mock/               # Realistic mock data   
 components/
 layout/             # Shell, Sidebar, Topbar   
 ui/                 # Badge, Button, Card, StatCard, TabBar,    
 pages/
 Dashboard.tsx   
 Pipelines.tsx   
 builder/            # PipelineBuilder + 7 step components   
 APIKeys.tsx   
 RetrievalTest.tsx   
 Settings.tsx   
 hooks/                  # useDashboard, usePipelines, useApiKeys
 types/index.ts          # All shared TypeScript interfaces
 tests/
 unit/               # Vitest + React Testing Library    
 e2e/                # Playwright specs    
```

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

---

## Testing

```bash
npm test               # unit tests (Vitest + RTL)
npm run test:watch     # watch mode
npm run test:coverage  # coverage report
npm run test:e2e       # Playwright e2e (starts dev server automatically)
```

---

## Environment Variables

Create `.env.local`:

```env
# Real API server URL (omit to use mock data)
VITE_API_BASE_URL=https://api.ragflow.example.com/v1

# Force mock data even when API URL is set
VITE_USE_MOCK=true
```

When `VITE_USE_MOCK=true` or `VITE_API_BASE_URL` is absent, all service functions return bundled mock data with a simulated network  no backend required for UI development.delay 

---

## Deployment (Vercel)

1. Push repo to GitHub/GitLab/Bitbucket.
2. Import project in [Vercel](https://vercel.com/new), set **Root Directory** to `ragflow-app/`.
3. Add the secret `ragflow-api-base-url` in Vercel's dashboard.
4.  `vercel.json` rewrite rules ensure React Router paths work correctly.Deploy 

---

## API Layer

Each service file follows the same  falls back to mock data automatically:pattern 

```typescript
// src/api/pipelines.ts
export async function getPipelines(): Promise<Pipeline[]> {
  if (USE_MOCK) {
    await mockDelay();
    return mockPipelines;               // bundled mock data
  }
  return apiFetch<Pipeline[]>('/pipelines');  // real backend
}
```

---

## Design Tokens

Defined in `src/index.css` via Tailwind v4 `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#3B5BFF` | Primary actions, active states |
| `--color-accent2` | `#00D4AA` | Success, confirm |
| `--color-accent3` | `#FF6B4A` | Warnings |
| `--color-ink` | `#0A0E1A` | Body text |
| `--color-muted` | `#8892A4` | Secondary / placeholder text |
| `--font-display` | Syne | Headings and card titles |
| `--font-mono` | DM Mono | Code blocks and numeric values |
