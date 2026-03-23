# ARIA — Technical Due Diligence Document

> **Version:** 3.2.1 | **Date:** March 2026 | **Classification:** Confidential

---

## 1. Architecture Overview

### 1.1 System Architecture
ARIA is a **100% client-side** single-page application (SPA). No backend server processes or stores data. All computation occurs in the user's browser.

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ React UI │→│ Scoring   │→│ Results    │ │
│  │ (40+     │  │ Engine    │  │ Renderer  │ │
│  │ sliders) │  │ (scoring  │  │ (charts,  │ │
│  │          │  │  .ts)     │  │ reports)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│       ↕                                      │
│  ┌──────────────────────────────────────┐   │
│  │     localStorage (persistence)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 1.2 Data Flow
1. User adjusts 40+ governance parameters (1–5 scale sliders)
2. Scoring engine computes AFI components (DR, JD, RC, CD, NA)
3. AFI formula produces composite score
4. Risk indices (AGRI, ALRI, SCRI, MDR, RFSI) computed in parallel
5. Decision class, qualitative loss bands, and recommendations generated
6. All actions logged to audit trail (Evidence Log)

### 1.3 Key Design Decisions
- **No backend dependency:** Eliminates data breach risk, simplifies deployment
- **Deterministic calculations:** Same inputs always produce same outputs (reproducible)
- **Heuristic-based scoring:** Explicitly NOT probabilistic — signals, not predictions
- **Qualitative outputs:** Risk bands (Base/Elevated/Critical/Systemic) replace fabricated numerical estimates

---

## 2. Core Formula — Authority Fragility Index (AFI)

### 2.1 Mathematical Specification

```
AFI = (DR^w_DR × RC^w_RC × CD^w_CD) / (JD^w_JD × NA^w_NA + ε)
```

Where:
- **DR** (Delegation Ratio): Autonomous decision density, 0–1
- **JD** (Justificatory Density): Audit trail completeness, 0–1
- **RC** (Reversibility Cost): Exit friction & switching barriers, 0–1
- **CD** (Correlation Density): Infrastructure homogeneity, 0–1
- **NA** (Normalisation Anchor): Fixed at 0.5 for cross-entity comparability
- **w_X**: Elasticity exponents (default = 1.0, configurable for non-linear modelling)
- **ε**: Denominator floor (0.001) to prevent division instability

### 2.2 Band Classification

| AFI Range | Band | Decision Class |
|-----------|------|----------------|
| < 0.85 | Stable | Approved |
| 0.85 – 1.35 | Sensitive | Conditional Review |
| ≥ 1.35 | Fragile | Escalate to Committee |

### 2.3 Component Derivation

Each AFI component maps multiple form sliders to a 0–1 normalised score:

- **DR** includes: automation ratio, execution autonomy, multi-agent orchestration, human checkpoints
- **JD** includes: oversight quality, reversibility governance
- **RC** includes: switching cost, sunset policy, portability, persistent memory, concentration scores
- **CD** includes: integration depth, correlation density, scope breadth, tool authority

---

## 3. Risk Index Suite

### 3.1 AGRI (Agentic Risk Index)
Weights: Multi-agent (35%), Tool-call authority (30%), Persistent memory (20%), Human checkpoints inverse (15%)

### 3.2 ALRI (AI Liability Risk Index)
Weights reflect 2025-26 claims frequency/severity:
- Hallucination liability (20%)
- Model drift (16%)
- Deepfake fraud (16%)
- Prompt injection (14%)
- Algorithmic bias (12%)
- Shadow AI (7%)
- Data integrity (6%)
- Explainability gap (5%)
- ESG/carbon liability (4%)

### 3.3 SCRI (Systemic Concentration Risk Index)
Inverse index — high score = high concentration risk:
- Cloud provider concentration (30%)
- Model provider concentration (25%)
- GPU concentration (25%)
- Cross-vendor contagion (20%)

### 3.4 MDR (Model Drift Risk)
Derived from model drift slider, reversibility governance, and review cadence.

### 3.5 RFSI (Responsibility Frame Stability Index)
Composite of context variability, semantic drift risk, evaluation mismatch, and temporal instability.

---

## 4. Validation Approach

### 4.1 Demo Profile Calibration
Five profiles calibrated against known AI deployment patterns:

| Profile | Industry | AFI | Band | Rationale |
|---------|----------|-----|------|-----------|
| Meridian Financial | Financial Services | 2.23 | Fragile | High-frequency trading with autonomous execution |
| HealthPath AI | Healthcare | 1.08 | Sensitive | Clinical decision support with human oversight |
| LexCore Systems | Legal Tech | 1.85 | Fragile | Autonomous contract review with limited reversibility |
| RetailFlow | Retail | 0.92 | Sensitive | Demand forecasting with moderate integration |
| CivicAI Gov | Government | 0.47 | Stable | Drafting assistant with strong governance controls |

### 4.2 Sensitivity Testing
Parameter robustness testing (±10%) validates that:
- Small input changes produce proportional output changes
- No cliff-edge discontinuities in scoring
- Band transitions occur at expected thresholds

---

## 5. Regulatory Alignment

### 5.1 EU AI Act (Regulation 2024/1689)
- Art. 72: Post-market monitoring obligation → mapped to review cadence slider
- Annex IV: Governance & risk management systems → mapped to oversight quality
- Art. 26: Deployer obligations → mapped to human checkpoint requirements

### 5.2 Solvency II (Directive 2009/138/EC)
- Pillar 2 ORSA requirements → export functionality
- Art. 44: Operational risk evaluation → AFI as governance risk proxy

### 5.3 ISO/IEC 42001:2023
- Clause 6.1: Risk assessment methodology → AGAF framework
- Clause 8.2: AI system impact analysis → exposure analysis dimensions

---

## 6. Known Limitations

### 6.1 Scoring Model
- **Heuristic, not actuarial:** AFI is a comparative governance signal, not a loss probability
- **No claims calibration:** Weights are expert-derived, not fitted to claims data
- **Point-in-time:** No time-series analysis or trend detection
- **Self-reported inputs:** Garbage in, garbage out — no independent verification

### 6.2 Portfolio Analysis
- **Simplified aggregation:** Weighted average, not copula-based correlation
- **No tail dependency modelling:** Systemic risk approximated via concentration scores
- **Static weights:** No dynamic rebalancing based on market conditions

### 6.3 Qualitative Outputs
- **No € amounts:** All financial exposure expressed as qualitative bands
- **No multipliers:** Cascade effects described narratively, not numerically
- **Source:** Qualitative assessments aligned with Swiss Re sigma insights 01/2026

---

## 7. Source Citations

All qualitative risk narratives reference:

1. **Swiss Re sigma insights 01/2026** — "AI adoption creates emerging risk dimensions that do not fit neatly within traditional insurance boundaries."
2. **Swiss Re sigma insights 01/2026** — "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk."
3. **Swiss Re sigma insights 01/2026** — "New exposures arising from hyperscale data centres, high-performance computing facilities and expanded power & energy infrastructure."

---

## 8. Security Assessment

| Dimension | Status | Notes |
|-----------|--------|-------|
| Data at rest | ✅ | localStorage only, no server storage |
| Data in transit | ✅ | No API calls, no data leaves browser |
| Authentication | ⚠️ | Optional (Lovable Cloud), not required |
| PII handling | ✅ | No PII collected or processed |
| Third-party deps | ⚠️ | Standard React ecosystem (audited) |
| GDPR compliance | ✅ | No personal data processing |

---

**Prepared by:** ARIA Research Institute
**Version:** 3.2.1
**Classification:** Confidential — For Due Diligence Purposes Only
