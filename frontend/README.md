# SecureVote — Frontend

Next.js (App Router) + Tailwind CSS frontend for the cryptographic e-voting backend
(`FastAPI`, RSA, blind signatures, anonymizer).

## Stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** with a custom *trust* palette (deep navy + gold accent)
- **lucide-react** for icons

No cryptography runs in the browser — all sensitive operations happen on the
Python backend. The frontend is purely a UX/orchestration layer.

## Project structure

```
frontend/
├── app/                       # App Router routes
│   ├── layout.tsx             # Root layout (header, footer, toast provider)
│   ├── page.tsx               # Landing page
│   ├── vote/page.tsx          # Multi-step voting flow
│   ├── verify/page.tsx        # Verify a submitted vote with N2
│   ├── results/page.tsx       # Live tally view
│   └── globals.css
├── components/
│   ├── ui/                    # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Stepper.tsx
│   │   ├── Badge.tsx
│   │   ├── Header.tsx
│   │   └── Toast.tsx
│   └── vote/                  # Voting workflow
│       ├── VoteFlow.tsx       # Orchestrator
│       ├── StepN1.tsx
│       ├── StepChoose.tsx
│       ├── StepN2.tsx
│       ├── StepSubmit.tsx     # Visual crypto pipeline + API call
│       └── StepDone.tsx
├── hooks/
│   └── useVoteFlow.ts         # Step state machine
├── lib/
│   ├── api.ts                 # fetch wrapper, typed endpoints
│   ├── constants.ts           # Candidates, steps, API URL
│   ├── types.ts               # Shared TS types
│   └── utils.ts               # cn(), code validation, masking
└── tailwind.config.ts
```

## Getting started

```bash
cd frontend
cp .env.local.example .env.local      # set NEXT_PUBLIC_API_URL if needed
npm install
npm run dev
```

The app expects the FastAPI backend on `http://127.0.0.1:8000` by default.
Override with `NEXT_PUBLIC_API_URL` in `.env.local`.

Backend (in another terminal):
```bash
uvicorn app.main:app --reload
```

## Backend endpoints used

| Method | Endpoint              | Used by             |
|--------|-----------------------|---------------------|
| POST   | `/voter/submit-vote`  | `StepSubmit`        |
| GET    | `/voter/verify-vote`  | `app/verify`        |
| GET    | `/counter/count-votes`| `app/results`       |

The FastAPI route currently expects `submit-vote` parameters as **query
strings** (`?n1=...&n2=...&vote_value=...`), so `lib/api.ts` mirrors that.
If the backend later switches to a JSON body, change `submitVote()` to send
`body: JSON.stringify(payload)` and remove the `query` field.

## UX design notes

- **Trust palette**: deep `brand` navy (`#173d6e` → `#0a1c36`) communicates
  authority/government feel; warm `accent` gold (`#e6b53d`) is reserved for
  primary CTAs and never used for status colors. Status semantics use green
  (success) and red (danger) only.
- **Step-by-step flow** with a `Stepper` so users always know where they are.
- **Code masking**: N1/N2 inputs default to `password`-style with a reveal
  toggle, and the review screen shows masked codes (`AB••••••89`).
- **Crypto pipeline visualization** in `StepSubmit` (blind → sign → anonymize
  → store) makes the security model legible without exposing implementation
  details.
- **Toasts** for non-blocking success/error feedback.
- **Subtle motion**: `animate-fade-in` on step transitions, `animate-pulse-ring`
  on the success confirmation, smooth bar-chart fills on results.

## What is *not* implemented (intentionally)

- No client-side cryptography. The browser never sees private keys, salts,
  or signing primitives — those stay on the FastAPI side.
- No persistent voter session. Each ballot is a fresh flow; reloading the
  page resets state by design.
- No registration UI for the demo (`/auth/register`, `/auth/login` are
  available in the backend if you want to extend it).

## Color palette reference

| Token         | Hex       | Use                              |
|---------------|-----------|----------------------------------|
| `brand-900`   | `#0a1c36` | Hero background, headings        |
| `brand-700`   | `#173d6e` | Primary buttons, header logo bg  |
| `brand-50`    | `#eef4fb` | Subtle surfaces, badges          |
| `accent-500`  | `#e6b53d` | Hero CTA accent                  |
| `success-500` | `#15803d` | Confirmation, completed steps    |
| `danger-500`  | `#dc2626` | Errors, validation               |
| `slate-50`    | `#f8fafc` | App background                   |
```
