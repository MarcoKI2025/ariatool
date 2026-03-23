import { AnalysisResults, ExposureInputs } from './types';
import { formatDate } from './formatters';

export function buildExecutiveReport(inputs: ExposureInputs, results: AnalysisResults): string {
  const { band, afi, lossEnvelope, decisionClass, eciName, eciTier, components } = results;
  const date = formatDate();

  const verdicts: Record<string, string> = {
    Fragile: 'STRUCTURAL EXPOSURE SIGNALS — COMMITTEE REVIEW REQUIRED',
    Sensitive: 'ELEVATED STRUCTURAL SIGNALS — CONDITIONAL REVIEW PROCESS',
    Stable: 'GOVERNANCE SIGNALS WITHIN RANGE — STANDARD UNDERWRITING PROCESS',
  };

  const rationales: Record<string, string> = {
    Fragile: 'This system creates structural AI risk not priced, modelled, or reserved for in standard underwriting frameworks. Mandatory structural remediation required before coverage terms can be finalised.',
    Sensitive: 'Governance gaps and dependency concentration signal drift toward Fragile classification. Conditional coverage available — structural improvements required within 90 days.',
    Stable: 'Structural exposure is within manageable bounds. Standard coverage terms apply. Maintain governance cadence and reassess at next renewal cycle.',
  };

  return `
═══════════════════════════════════════════════════════════════
AI GOVERNANCE ASSESSMENT — EXECUTIVE SUMMARY
Structured AI Risk Signal for Committee Review
═══════════════════════════════════════════════════════════════

GOVERNANCE INTELLIGENCE LAYER – USE RESTRICTION
This tool does NOT produce probabilities, pricing determinations,
or binding underwriting decisions. All outputs are decision-support
signals and require mandatory human review and explicit authorization.

Entity:     ${inputs.companyName || 'Unknown Entity'}
Industry:   ${inputs.industry}
Date:       ${date}
Model:      AGAF v3.2 · Governance Assessment Framework

───────────────────────────────────────────────────────────────
VERDICT: ${verdicts[band]}
───────────────────────────────────────────────────────────────

Decision Class:  ${decisionClass}
AFI Score:       ${afi.toFixed(2)} (${band})
ECI Tier:        ECI-${eciTier} — ${eciName}

${rationales[band]}

───────────────────────────────────────────────────────────────
KEY METRICS
───────────────────────────────────────────────────────────────

Delegation Ratio (DR):       ${(components.dr * 100).toFixed(0)}%
Justificatory Density (JD):  ${(components.jd * 100).toFixed(0)}%
Reversibility Cost (RC):     ${(components.rc * 100).toFixed(0)}%
Continuation Density (CD):   ${(components.cd * 100).toFixed(0)}%

───────────────────────────────────────────────────────────────
LOSS ENVELOPE (qualitative assessment)
───────────────────────────────────────────────────────────────

Expected Loss Band:     ${lossEnvelope.expected}
Stress Scenario Band:   ${lossEnvelope.stress}
Tail / Systemic Band:   ${lossEnvelope.tail}
Portfolio Cluster:       ${lossEnvelope.portfolio}

Source: Swiss Re sigma insights 01/2026 – qualitative assessment
of emerging systemic dependencies and accumulation risks.
"AI adoption creates emerging risk dimensions that do not fit neatly
within traditional insurance boundaries."

───────────────────────────────────────────────────────────────
REQUIRED ACTIONS
───────────────────────────────────────────────────────────────

${band === 'Fragile' ? `1. Immediate governance review — structural exposure exceeds standard models
2. Dependency diversification within 90 days
3. Quarterly governance re-authorisation mandate
4. Named system ownership assignment` : band === 'Sensitive' ? `1. Governance improvement plan within 90 days
2. Committee review before coverage renewal
3. Monitor dependency concentration` : `1. Standard monitoring — maintain governance cadence
2. Annual reassessment at renewal`}

───────────────────────────────────────────────────────────────
DISCLAIMERS
───────────────────────────────────────────────────────────────

GOVERNANCE INTELLIGENCE LAYER — This is a structured governance
assessment, not:
• An actuarially certified risk model
• Legal advice or regulatory filing
• A compliance certification
• A substitute for professional underwriting judgment

All inputs are self-attested. Qualitative risk characterizations
are based on structural governance factors, not empirical loss data.
Swiss Re sigma insights 01/2026: "Growing reliance on a small number
of cloud and AI service providers adds a further layer of systemic
and accumulation risk."

Generated: ${date}
Framework: AGAF v3.2 — AI Governance Assessment Framework
Classification: ${band} — ${decisionClass}
`.trim();
}

export function buildORSAExport(inputs: ExposureInputs, results: AnalysisResults): string {
  const date = formatDate();
  return `
ORSA-STYLE AI GOVERNANCE RISK ASSESSMENT EXTRACT
${date}

GOVERNANCE INTELLIGENCE LAYER – USE RESTRICTION
This tool does NOT produce probabilities, pricing determinations,
or binding underwriting decisions.

Entity: ${inputs.companyName || 'Unknown'}
Classification: ${results.band} (AFI ${results.afi.toFixed(2)})
Decision: ${results.decisionClass}

RISK DRIVERS:
- Delegation Ratio: ${(results.components.dr * 100).toFixed(0)}%
- Oversight Density: ${(results.components.jd * 100).toFixed(0)}%
- Reversibility Cost: ${(results.components.rc * 100).toFixed(0)}%
- Continuation Density: ${(results.components.cd * 100).toFixed(0)}%

LOSS ENVELOPE (qualitative Einschätzung):
- Expected: ${results.lossEnvelope.expected}
- Stress: ${results.lossEnvelope.stress}
- Tail: ${results.lossEnvelope.tail}

Quelle: Swiss Re sigma insights 01/2026 – qualitative Einschätzung
neuer systemischer Abhängigkeiten und Akkumulationsrisiken.

This extract is for Own Risk and Solvency Assessment discussion purposes.
Not a regulatory filing. Self-attested inputs. Qualitative signals only.
`.trim();
}
