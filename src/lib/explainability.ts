/**
 * Explainability Layer
 * Derives top risk drivers and stabilizing factors from real inputs.
 */
import { AnalysisResults, ExposureInputs } from './types';

export interface ScoreDriver {
  label: string;
  value: string;
  contribution: number; // 0-100
  type: 'risk' | 'stabilizer';
  explanation: string;
}

export interface ExplainabilityResult {
  topRisks: ScoreDriver[];
  stabilizers: ScoreDriver[];
  summary: string;
}

export function getScoreDrivers(inputs: ExposureInputs, results: AnalysisResults): ExplainabilityResult {
  const all: ScoreDriver[] = [];

  // Risk drivers
  if (inputs.automation >= 4) all.push({ label: 'High Automation Level', value: `${inputs.automation}/5`, contribution: inputs.automation * 16, type: 'risk', explanation: 'Elevated automation reduces human decision points, increasing structural delegation risk.' });
  if (inputs.executionAuthority >= 4) all.push({ label: 'Elevated Execution Authority', value: `${inputs.executionAuthority}/5`, contribution: inputs.executionAuthority * 15, type: 'risk', explanation: 'AI systems have broad authority to execute decisions without pre-approval.' });
  if (results.components.dr > 0.6) all.push({ label: 'High Delegation Ratio', value: `${Math.round(results.components.dr * 100)}%`, contribution: Math.round(results.components.dr * 80), type: 'risk', explanation: 'A large proportion of operational decisions are delegated to AI systems.' });
  if (results.components.rc > 0.6) all.push({ label: 'Low Reversibility', value: `${Math.round(results.components.rc * 100)}%`, contribution: Math.round(results.components.rc * 75), type: 'risk', explanation: 'AI-driven decisions are difficult to reverse once executed, creating lock-in.' });
  if (inputs.switchingCost >= 4) all.push({ label: 'High Switching Cost', value: `${inputs.switchingCost}/5`, contribution: inputs.switchingCost * 14, type: 'risk', explanation: 'Migrating away from current AI infrastructure would be costly and disruptive.' });
  if (inputs.integrationDepth >= 4) all.push({ label: 'Deep Integration', value: `${inputs.integrationDepth}/5`, contribution: inputs.integrationDepth * 13, type: 'risk', explanation: 'AI is deeply embedded in core workflows, making extraction complex.' });
  if (inputs.cloudConcentration >= 4) all.push({ label: 'Cloud Concentration', value: `${inputs.cloudConcentration}/5`, contribution: inputs.cloudConcentration * 12, type: 'risk', explanation: 'Heavy reliance on a single cloud provider creates single-point-of-failure risk.' });
  if (inputs.modelConcentration >= 4) all.push({ label: 'Model Concentration', value: `${inputs.modelConcentration}/5`, contribution: inputs.modelConcentration * 12, type: 'risk', explanation: 'Dependency on a single model family means failure affects all use cases.' });
  if (inputs.hallucinationLiability >= 3) all.push({ label: 'Hallucination Liability', value: `${inputs.hallucinationLiability}/5`, contribution: inputs.hallucinationLiability * 14, type: 'risk', explanation: 'AI outputs may contain fabricated information creating liability exposure.' });
  if (inputs.providers.length <= 1) all.push({ label: 'Single Provider Dependency', value: `${inputs.providers.length} provider`, contribution: 65, type: 'risk', explanation: 'No fallback provider — complete dependency on a single vendor.' });
  if (inputs.multiAgent >= 3) all.push({ label: 'Multi-Agent Complexity', value: `${inputs.multiAgent}/5`, contribution: inputs.multiAgent * 13, type: 'risk', explanation: 'Multiple AI agents interacting create emergent risks not present in individual systems.' });
  if (inputs.oversightLevel <= 2) all.push({ label: 'Low Oversight Level', value: `${inputs.oversightLevel}/5`, contribution: (6 - inputs.oversightLevel) * 15, type: 'risk', explanation: 'Insufficient human oversight allows governance gaps to accumulate undetected.' });
  if (results.components.cd > 0.6) all.push({ label: 'High Continuation Density', value: `${Math.round(results.components.cd * 100)}%`, contribution: Math.round(results.components.cd * 70), type: 'risk', explanation: 'System has built deep organisational dependencies that resist discontinuation.' });

  // Stabilizers
  if (inputs.oversightLevel >= 4) all.push({ label: 'Strong Oversight', value: `${inputs.oversightLevel}/5`, contribution: inputs.oversightLevel * 16, type: 'stabilizer', explanation: 'Active human oversight provides governance guardrails against risk accumulation.' });
  if (inputs.humanCheckpoints >= 4) all.push({ label: 'Human Checkpoints', value: `${inputs.humanCheckpoints}/5`, contribution: inputs.humanCheckpoints * 15, type: 'stabilizer', explanation: 'Multiple human review points in the decision chain reduce autonomous risk.' });
  if (inputs.reviewCadence >= 4) all.push({ label: 'Regular Review Cadence', value: `${inputs.reviewCadence}/5`, contribution: inputs.reviewCadence * 13, type: 'stabilizer', explanation: 'Frequent reviews catch governance drift before it becomes structural.' });
  if (results.components.jd > 0.6) all.push({ label: 'High Justificatory Density', value: `${Math.round(results.components.jd * 100)}%`, contribution: Math.round(results.components.jd * 70), type: 'stabilizer', explanation: 'Strong documentation and audit trail for AI decisions.' });
  if (inputs.providers.length >= 3) all.push({ label: 'Provider Diversification', value: `${inputs.providers.length} providers`, contribution: Math.min(70, inputs.providers.length * 15), type: 'stabilizer', explanation: 'Multiple providers reduce single-vendor concentration risk.' });
  if (inputs.portability >= 4) all.push({ label: 'High Portability', value: `${inputs.portability}/5`, contribution: inputs.portability * 12, type: 'stabilizer', explanation: 'System can be migrated to alternative infrastructure if needed.' });
  if (inputs.sunsetPolicy >= 4) all.push({ label: 'Clear Sunset Policy', value: `${inputs.sunsetPolicy}/5`, contribution: inputs.sunsetPolicy * 11, type: 'stabilizer', explanation: 'Defined decommissioning procedures reduce lock-in risk.' });
  if (inputs.automation <= 2) all.push({ label: 'Limited Automation', value: `${inputs.automation}/5`, contribution: (6 - inputs.automation) * 12, type: 'stabilizer', explanation: 'Low automation preserves human decision-making authority.' });

  const topRisks = all.filter(d => d.type === 'risk').sort((a, b) => b.contribution - a.contribution).slice(0, 5);
  const stabilizers = all.filter(d => d.type === 'stabilizer').sort((a, b) => b.contribution - a.contribution).slice(0, 4);

  const riskCount = topRisks.length;
  const stabCount = stabilizers.length;
  const summary = riskCount === 0
    ? 'No significant risk drivers detected. Governance structure is well-balanced.'
    : stabCount === 0
    ? `${riskCount} structural risk drivers identified with no significant stabilising factors. Immediate governance review recommended.`
    : `${riskCount} structural risk driver${riskCount > 1 ? 's' : ''} identified, partially offset by ${stabCount} stabilising factor${stabCount > 1 ? 's' : ''}. ${results.band === 'Fragile' ? 'Stabilisers are insufficient to contain structural risk.' : results.band === 'Sensitive' ? 'Balance is precarious — monitor closely.' : 'Current balance is adequate.'}`;

  return { topRisks, stabilizers, summary };
}
