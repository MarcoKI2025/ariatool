# ARIA — AI Governance Exposure Engine

> Structural risk assessment for AI-dependent organisations.
> Heuristic governance intelligence for insurers, reinsurers, and risk managers.

---

## What This Is

ARIA (Advanced Risk & Intelligence Assessment) is an **advanced interactive prototype** that quantifies structural dependencies in AI system deployments. It provides a structured, repeatable framework for evaluating how deeply AI is embedded in an organisation's operations and how reversible that embedding remains.

**Core output:** The **Authority Fragility Index (AFI)** — a composite heuristic score measuring operational authority delegation to AI systems and the reversibility of that delegation.

**This is a decision-support tool, not a production underwriting system.**

---

## What This Is NOT

- ❌ An actuarially certified risk model
- ❌ A binding underwriting decision engine
- ❌ A regulatory compliance certification tool
- ❌ A replacement for professional underwriting judgment
- ❌ Calibrated against empirical loss data
- ❌ A Monte Carlo or probabilistic simulation engine

All outputs are heuristic, qualitative signals derived from self-attested inputs. They require mandatory human review by qualified professionals before any business decision.

---

## Core Capabilities

### Assessment
- **Exposure Analysis** — 40+ governance parameters across 6 risk dimensions
- **Decision Intelligence** — Composite risk indices (AFI, AGRI, ALRI, SCRI, MDR, RFSI)
- **Explainability Layer** — Data-driven "why this score?" breakdown

### Stress Testing
- **Scenario Simulation** — 4 structural failure scenarios with cascading impact analysis
- **Dependency Shock Simulator** — Provider failure, governance breakdown, oversight collapse
- **Capital Impact Engine** — Heuristic loss range estimation (not actuarial)

### Reporting
- **Insurance Decision** — Decision class routing with qualitative risk bands
- **Executive Report** — Board-level summary with ORSA-compatible export
- **Evidence Log** — Complete audit trail with CSV export

### Portfolio & Advanced
- **Portfolio View** — Multi-entity risk aggregation
- **EU AI Act Compliance** — Article-by-article gap assessment
- **Peer Benchmarking** — Industry-relative positioning (synthetic benchmark data)
- **Recursive Risk** — RSI and MCCI for hyperagent risk detection
- **Temporal Tracking** — Risk evolution snapshots over time

---

## Intended Use

- **Demo & Presentation** — Showcasing AI governance risk assessment methodology
- **Research & Exploration** — Exploring structural dependency dynamics
- **Underwriting Discussion** — Generating structured signals for committee review
- **Governance Workshops** — Educating stakeholders on AI deployment risk factors

---

## Quick Start

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

### Environment Variables (Optional)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `VITE_APP_PASSWORD` | Gate access with a password (leave empty for open demo) |
| `VITE_SUPABASE_URL` | Optional backend integration |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Optional backend integration |

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| State | React Context |
| Storage | Browser localStorage |
| Build | Vite |
| Testing | Vitest + Testing Library |

---

## Architecture

100% client-side application. All data persists in browser localStorage. No backend server required for core functionality. No telemetry or analytics. No PII collection.

---

## Limitations

| Constraint | Detail |
|------------|--------|
| Heuristic scoring | Not probabilistic — deterministic calculations |
| No claims data | Not calibrated against actual insurance losses |
| No Monte Carlo | Scenario analysis is structural, not stochastic |
| Synthetic benchmarks | Peer comparison data is illustrative, not market data |
| Point-in-time | Temporal tracking requires manual snapshots |
| Self-attested inputs | No automated data ingestion or verification |

---

## License

Proprietary — All rights reserved
© 2026 ARIA Research Institute
