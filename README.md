# ARIA — AI Governance Exposure Engine v4.2

> **Structural risk assessment for AI-dependent organisations.**
> Underwriting-grade governance intelligence for insurers, reinsurers, and risk managers.

[![Version](https://img.shields.io/badge/version-4.2.0-blue)]()
[![Status](https://img.shields.io/badge/status-Production_Ready-green)]()
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## 🎯 What Is ARIA?

ARIA (Advanced Risk & Intelligence Assessment) is a **governance exposure engine** that quantifies structural dependencies in AI system deployments. It transforms subjective "how much AI do you use?" conversations into measurable, comparable risk signals.

**Core output:** The **Authority Fragility Index (AFI)** — a composite score measuring how much operational authority an organisation has delegated to AI systems and how reversible that delegation remains.

### The Problem It Solves

Traditional insurance underwriting cannot assess:
- How deeply AI is embedded in critical business processes
- Whether an organisation can operate if its AI providers fail
- The systemic concentration risk across cloud/model/GPU providers
- The liability exposure from hallucinations, bias, and model drift

ARIA provides a structured, repeatable framework to evaluate these risks.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone [repository-url]
cd ariatool

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Demo Profiles

ARIA includes 5 pre-configured demo profiles:

1. **Meridian Financial** (AFI 2.23, Fragile) — High-frequency trading AI
2. **HealthPath AI** (AFI 1.08, Sensitive) — Clinical decision support
3. **LexCore Systems** (AFI 1.85, Fragile) — Autonomous contract review
4. **RetailFlow** (AFI 0.92, Sensitive) — Demand forecasting engine
5. **CivicAI Gov** (AFI 0.47, Stable) — Public sector drafting assistant

---

## 📊 Key Features

### 1. Exposure Analysis
40+ governance parameters across 6 dimensions:
- Deployment characteristics
- Agentic capabilities
- AI-specific liability vectors
- Operational integrity
- Non-linear risk vectors
- Systemic concentration

### 2. Decision Intelligence
Comprehensive risk index suite:
- **AGRI:** Agentic Risk Index
- **ALRI:** AI Liability Risk Index
- **SCRI:** Systemic Concentration Risk Index (inverse)
- **MDR:** Model Drift Risk
- **RFSI:** Responsibility Frame Stability Index

### 3. Scenario Simulation
- Parameter robustness testing (±10% sensitivity)
- Stress scenario modelling
- Qualitative loss envelope shifts
- **Agent Coordination Analysis** — Multi-agent delegation chain mapping (BETA)
- Agentic Swarm & Delegation Depth visualization

### 4. Insurance Decision
- Decision class routing (Approved / Conditional Review / Escalate to Committee)
- Qualitative risk band assessment
- Governance improvement recommendations

### 5. Executive Report
- One-page board summary
- ORSA-compatible export
- Swiss Re sigma 01/2026 aligned risk narratives

### 6. Portfolio View
- Multi-entity risk aggregation
- Weighted AFI calculation
- Shared infrastructure dependency analysis
- Capital efficiency calculator (Solvency II)

### 7. Evidence Log
- Complete audit trail
- Parameter change tracking
- Analysis run history
- CSV export for compliance

### 8. Integration Hub *(Demo)*
- Simulated ecosystem connectors
- Market data feed mockups
- Compliance framework alignment

---

## ⚠️ Important Limitations

**ARIA is a governance intelligence layer. It is NOT:**

❌ An actuarial loss prediction model
❌ A binding underwriting decision engine
❌ A regulatory compliance certification tool
❌ A replacement for human judgment

**Technical Constraints:**
- **Heuristic scoring** (not probabilistic)
- **No claims data integration** (not calibrated to actual losses)
- **No Monte Carlo simulation** (deterministic calculations)
- **Simplified portfolio correlation** (no copula models)
- **Point-in-time assessment** (no time-series analysis)

**All outputs require mandatory human review and explicit authorization by qualified underwriters.**

---

## 🔐 Security & Privacy

- **Client-side only:** 100% browser-based, no backend server
- **Local storage:** All data persists in browser localStorage
- **No telemetry:** Zero analytics or user tracking
- **No PII collection:** No personally identifiable information processed

---

## 📄 Documentation

- [`TECHNICAL_DUE_DILIGENCE.md`](./TECHNICAL_DUE_DILIGENCE.md) — Architecture deep-dive & validation
- [`METHODOLOGY.md`](./METHODOLOGY.md) — AGAF framework explanation *(planned)*
- [`API.md`](./API.md) — Integration endpoints *(roadmap)*

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18.3 + TypeScript 5.8 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Charts | Recharts 2.15 |
| State | React Context (useAppState) |
| Storage | localStorage API |
| Build | Vite 5.4 |
| Deployment | Lovable Platform |

---

## 📜 License

Proprietary — All rights reserved
© 2026 ARIA Research Institute

---

**Version:** 4.2.0
**Status:** Production Ready
**Last Updated:** March 2026
