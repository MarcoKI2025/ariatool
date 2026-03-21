import { AnalysisResults, ExposureInputs } from './types';
import { formatDate, formatCurrency } from './formatters';

export function buildExecutiveReport(inputs: ExposureInputs, results: AnalysisResults): string {
  const { band, afi, lossEnvelope, decisionClass, eciName, eciTier, components } = results;
  const date = formatDate();

  const verdicts: Record<string, string> = {
    Fragile: 'STRUCTURAL EXPOSURE SIGNALS — COMMITTEE REVIEW REQUIRED',
    Sensitive: 'ELEVATED STRUCTURAL SIGNALS — CONDITIONAL REVIEW PROCESS',
    Stable: 'GOVERNANCE SIGNALS WITHIN RANGE — STANDARD UNDERWRITING PROCESS',
  };

  const rationales: Record<string, string> = {
    Fragile: 'This system creates structural AI risk not priced, modelled, or reserved for in standard underwriting frameworks. Mandatory premium loading and structural remediation required before coverage terms can be finalised.',
    Sensitive: 'Governance gaps and dependency concentration signal drift toward Fragile classification. Conditional coverage available — structural improvements required within 90 days.',
    Stable: 'Structural exposure is within manageable bounds. Standard coverage terms apply. Maintain governance cadence and reassess at next renewal cycle.',
  };

  return `
═══════════════════════════════════════════════════════════════
AI GOVERNANCE ASSESSMENT — EXECUTIVE SUMMARY
Structured AI Risk Signal for Committee Review
═══════════════════════════════════════════════════════════════

Entity:     ${inputs.companyName || 'Unknown Entity'}
Industry:   ${inputs.industry}
Date:       ${date}
Model:      AGAF v3.0 · Governance Assessment Framework

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
LOSS ENVELOPE (Indicative)
───────────────────────────────────────────────────────────────

Expected Loss:        ${formatCurrency(lossEnvelope.expected)}
Stress Scenario:      ${formatCurrency(lossEnvelope.stress)}
Tail Risk (99th%):    ${formatCurrency(lossEnvelope.tail)}
Portfolio Aggregate:  ${formatCurrency(lossEnvelope.portfolio)}+

Amplification Factor: ${results.amplificationFactor}

───────────────────────────────────────────────────────────────
REQUIRED ACTIONS
───────────────────────────────────────────────────────────────

${band === 'Fragile' ? `1. Immediate actuarial review — current structural exposure exceeds standard models
2. Dependency diversification within 90 days
3. Quarterly governance re-authorisation mandate
4. Named system ownership assignment` : band === 'Sensitive' ? `1. Governance improvement plan within 90 days
2. Committee review before coverage renewal
3. Monitor dependency concentration` : `1. Standard monitoring — maintain governance cadence
2. Annual reassessment at renewal`}

───────────────────────────────────────────────────────────────
DISCLAIMERS
───────────────────────────────────────────────────────────────

This is a structured governance assessment, not:
• An actuarially certified risk model
• Legal advice or regulatory filing
• A compliance certification
• A substitute for professional underwriting judgment

All inputs are self-attested. Loss figures are market-calibrated
directional estimates for committee discussion, not binding quotations.

Generated: ${date}
Framework: AGAF v3.0 — AI Governance Assessment Framework
Classification: ${band} — ${decisionClass}
`.trim();
}

export function buildORSAExport(inputs: ExposureInputs, results: AnalysisResults): string {
  const date = formatDate();
  return `
ORSA-STYLE AI GOVERNANCE RISK ASSESSMENT EXTRACT
${date}

Entity: ${inputs.companyName || 'Unknown'}
Classification: ${results.band} (AFI ${results.afi.toFixed(2)})
Decision: ${results.decisionClass}

RISK DRIVERS:
- Delegation Ratio: ${(results.components.dr * 100).toFixed(0)}%
- Oversight Density: ${(results.components.jd * 100).toFixed(0)}%
- Reversibility Cost: ${(results.components.rc * 100).toFixed(0)}%
- Continuation Density: ${(results.components.cd * 100).toFixed(0)}%

LOSS ENVELOPE:
- Expected: ${formatCurrency(results.lossEnvelope.expected)}
- Stress: ${formatCurrency(results.lossEnvelope.stress)}
- Tail (99th): ${formatCurrency(results.lossEnvelope.tail)}

This extract is for Own Risk and Solvency Assessment discussion purposes.
Not a regulatory filing. Self-attested inputs. Directional estimates only.
`.trim();
}
