import { AnalysisResults, ExposureInputs } from './types';
import { formatDate, formatCurrency } from './formatters';

export function exportORSA(results: AnalysisResults, inputs: ExposureInputs) {
  const date = formatDate();
  const { band, afi, lossEnvelope, decisionClass, eciTier, eciName, components } = results;

  const orsaText = `
ORSA SECTION — OPERATIONAL AI RISK LOADING
══════════════════════════════════════════════════════════════════

Entity: ${inputs.companyName || 'Unknown Entity'}
Industry: ${inputs.industry}
Assessment date: ${date}
Assessment ID: ARIA-${Date.now()}

══════════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY — STRUCTURAL AI RISK SIGNAL
══════════════════════════════════════════════════════════════════

AFI Score: ${afi.toFixed(2)}
Risk Band: ${band}
Decision Class: ${decisionClass}
ECI Tier: ECI-${eciTier} — ${eciName}

STRUCTURAL RISK ASSESSMENT
Delegation Ratio (DR): ${components.dr.toFixed(3)}
Justificatory Density (JD): ${components.jd.toFixed(3)}
Reversibility Cost (RC): ${components.rc.toFixed(3)}
Correlation Density (CD): ${components.cd.toFixed(3)}
Normalisation Anchor (NA): ${components.na.toFixed(3)}

══════════════════════════════════════════════════════════════════
LOSS ENVELOPE — MARKET-CALIBRATED PROXY ESTIMATES
══════════════════════════════════════════════════════════════════

Expected Loss (Base Scenario):     ${lossEnvelope.expected}
Stress Risk Band:                  ${lossEnvelope.stress}
Tail Risk Band (Provider Cascade): ${lossEnvelope.tail}
Portfolio Exposure (Correlated):   ${lossEnvelope.portfolio}

⚠ CRITICAL DISCLAIMER: These are structural proxy signals, not actuarially 
certified loss estimates. Anchored to published market guidance (Lloyd's CRI 
2024, EIOPA Opinion August 2025, Munich Re AI Underwriting Framework 2024).

══════════════════════════════════════════════════════════════════
ORSA CAPITAL LOADING RECOMMENDATION
══════════════════════════════════════════════════════════════════

${band === 'Fragile' 
  ? `RECOMMENDED LOADING: 150–180% above standard cyber/E&O baseline

RATIONALE: AFI score ${afi.toFixed(2)} indicates structural governance fragility 
exceeding standard underwriting assumptions. System shows continuation risk (no 
re-authorisation mechanism), dependency lock-in (exit cost threshold exceeded), 
and/or responsibility fragmentation (unclear ownership accountability).

BINDING CONDITIONS BEFORE STANDARD RATES APPLY:
1. Implement formal re-authorisation cadence (quarterly governance review)
2. Provider diversification (minimum 3 independent providers)
3. Establish clear ownership accountability map
4. Post-market monitoring system per EU AI Act Art. 72

Without these structural changes, risk accumulates indefinitely.`
  : band === 'Sensitive'
  ? `RECOMMENDED LOADING: 110–130% above standard baseline

RATIONALE: AFI score ${afi.toFixed(2)} indicates elevated structural exposure. 
Not yet Fragile classification, but governance signals warrant premium adjustment.

RECOMMENDED ACTIONS:
1. Annual governance re-authorisation review
2. Monitor provider concentration trends
3. Document ownership accountability
4. Consider incremental diversification`
  : `RECOMMENDED LOADING: Standard cyber/E&O baseline applicable

RATIONALE: AFI score ${afi.toFixed(2)} indicates stable governance posture. 
Standard underwriting assumptions hold. Continue monitoring for structural drift.`
}

══════════════════════════════════════════════════════════════════
REGULATORY FRAMEWORK REFERENCES
══════════════════════════════════════════════════════════════════

EU AI Act 2024/1689 (enforcement begins 2026–2027)
- Art. 26: High-risk AI system obligations
- Art. 27: Fundamental Rights Impact Assessment (FRIA)
- Art. 72: Post-market monitoring requirements
- Art. 99: Penalty framework (€35M or 7% global revenue)

EIOPA Opinion on AI in Insurance (August 2025)
"Proportionality principle requires risk-based governance approach"

Swiss Re sigma insights 01/2026
"AI introduces emerging risk dimensions that do not fit neatly within 
traditional insurance boundaries"

NAIC Model Bulletin 2025-AI
"Insurers shall assess continuation governance mechanisms for AI deployments"

Lloyd's Market Association E&O Guidelines 2025
"Provider concentration creates correlated exposure requiring premium loading"

══════════════════════════════════════════════════════════════════
MANDATORY DISCLAIMERS — READ CAREFULLY
══════════════════════════════════════════════════════════════════

⚠ NOT ACTUARIALLY CERTIFIED
This assessment is a governance heuristic framework. AFI scores are structural 
proxy signals — not probabilistic loss estimates derived from claims data. 
Independent actuarial validation required before binding capital allocation.

⚠ NOT LEGAL ADVICE
This document does not constitute legal advice. EU AI Act compliance requires 
independent legal counsel. FRIA obligations per Art. 27 must be assessed 
separately.

⚠ SELF-ATTESTED INPUTS
All inputs are operator self-assessment. No independent verification performed. 
Bias and incomplete knowledge affect all downstream outputs.

⚠ NO EXTERNAL GROUND TRUTH
No empirical dataset exists for AI governance fragility. AFI thresholds are 
internally calibrated based on market guidance — not backtested against 
historical outcomes.

⚠ STATIC SNAPSHOT
Assessment reflects the moment of evaluation. Material changes to AI deployment 
(model updates, provider changes, scope expansion) invalidate this assessment.

══════════════════════════════════════════════════════════════════
USE RESTRICTIONS
══════════════════════════════════════════════════════════════════

✓ APPROVED USES:
  - Pre-underwriting intake triage
  - Risk committee preparation materials
  - ORSA supplementary input signal
  - Board governance documentation

✗ DO NOT USE FOR:
  - Standalone pricing or reserving decisions
  - Treaty structuring without actuarial validation
  - Regulatory filing without legal counsel
  - Binding capital allocation without independent review

══════════════════════════════════════════════════════════════════
ASSESSMENT METADATA
══════════════════════════════════════════════════════════════════

Framework Version: AGAF v4.3.0 (Kindermann 2026 operationalisation)
Model Type: Structural heuristic (deterministic, non-stochastic)
Data Basis: Self-attested inputs + published market guidance
Calibration: Q4 2025 market data (Lloyd's, EIOPA, Munich Re)
Next Recalibration Trigger: EIOPA Opinion implementation (est. Q3 2026)

Generated: ${new Date().toLocaleString('en-GB')}
Assessment Engine: AI Governance Engine v4.3.0 · Decision Intelligence System

══════════════════════════════════════════════════════════════════
END OF DOCUMENT
══════════════════════════════════════════════════════════════════
`.trim();

  const blob = new Blob([orsaText], { type: 'text/plain; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ORSA_AI_Risk_Loading_${(inputs.companyName || 'Entity').replace(/\s+/g, '_')}_${date.replace(/\//g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
