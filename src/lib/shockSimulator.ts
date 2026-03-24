/**
 * Dependency Shock Simulator
 * Simulates provider failure, governance breakdown, and oversight collapse.
 */
import { ExposureInputs, AnalysisResults } from './types';
import { computeFullAnalysis } from './scoring';

export interface ShockResult {
  label: string;
  icon: string;
  description: string;
  baselineAFI: number;
  shockedAFI: number;
  afiDelta: number;
  baselineBand: string;
  shockedBand: string;
  keyChanges: { metric: string; baseline: string; shocked: string; severity: 'high' | 'medium' | 'low' }[];
  operationalImpact: string;
  recoveryDifficulty: string;
  recoveryTime: string;
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

export function simulateProviderFailure(inputs: ExposureInputs, baseResults: AnalysisResults): ShockResult {
  const shocked: ExposureInputs = {
    ...inputs,
    cloudConcentration: 5,
    modelConcentration: 5,
    switchingCost: clamp(inputs.switchingCost + 2, 1, 5),
    portability: clamp(inputs.portability - 2, 1, 5),
    crossVendorContagion: clamp(inputs.crossVendorContagion + 1, 1, 5),
  };
  const shockedResults = computeFullAnalysis(shocked);
  const delta = shockedResults.afi - baseResults.afi;

  return {
    label: 'Model Provider Failure',
    icon: '⚡',
    description: 'Primary AI model provider becomes unavailable — API failure, bankruptcy, sanctions, or service discontinuation. All dependent workflows disrupted simultaneously.',
    baselineAFI: baseResults.afi,
    shockedAFI: shockedResults.afi,
    afiDelta: delta,
    baselineBand: baseResults.band,
    shockedBand: shockedResults.band,
    keyChanges: [
      { metric: 'Cloud Concentration', baseline: `${inputs.cloudConcentration}/5`, shocked: '5/5', severity: 'high' },
      { metric: 'Model Concentration', baseline: `${inputs.modelConcentration}/5`, shocked: '5/5', severity: 'high' },
      { metric: 'Switching Cost', baseline: `${inputs.switchingCost}/5`, shocked: `${shocked.switchingCost}/5`, severity: delta > 0.3 ? 'high' : 'medium' },
      { metric: 'Portability', baseline: `${inputs.portability}/5`, shocked: `${shocked.portability}/5`, severity: 'medium' },
      { metric: 'SCRI', baseline: `${baseResults.scri}`, shocked: `${shockedResults.scri}`, severity: shockedResults.scri < 30 ? 'high' : 'medium' },
    ],
    operationalImpact: delta > 0.5 ? 'Critical — core workflows non-functional' : delta > 0.2 ? 'Elevated — significant degradation' : 'Moderate — partial disruption',
    recoveryDifficulty: inputs.providers.length <= 1 ? 'Very High — no fallback provider' : inputs.providers.length <= 2 ? 'High — limited alternatives' : 'Moderate — alternatives available',
    recoveryTime: inputs.switchingCost >= 4 ? '3–6 months' : inputs.switchingCost >= 3 ? '1–3 months' : '2–4 weeks',
  };
}

export function simulateGovernanceFailure(inputs: ExposureInputs, baseResults: AnalysisResults): ShockResult {
  const shocked: ExposureInputs = {
    ...inputs,
    reviewCadence: 1,
    oversightLevel: 1,
    humanCheckpoints: 1,
    sunsetPolicy: 1,
    explainabilityGap: clamp(inputs.explainabilityGap + 2, 1, 5),
    shadowAI: 5,
  };
  const shockedResults = computeFullAnalysis(shocked);
  const delta = shockedResults.afi - baseResults.afi;

  return {
    label: 'Governance Breakdown',
    icon: '🏛',
    description: 'Governance structures collapse — oversight personnel leave, review cadences abandoned, audit trails discontinued. The system continues operating without human governance.',
    baselineAFI: baseResults.afi,
    shockedAFI: shockedResults.afi,
    afiDelta: delta,
    baselineBand: baseResults.band,
    shockedBand: shockedResults.band,
    keyChanges: [
      { metric: 'Oversight Level', baseline: `${inputs.oversightLevel}/5`, shocked: '1/5', severity: 'high' },
      { metric: 'Review Cadence', baseline: `${inputs.reviewCadence}/5`, shocked: '1/5', severity: 'high' },
      { metric: 'Human Checkpoints', baseline: `${inputs.humanCheckpoints}/5`, shocked: '1/5', severity: 'high' },
      { metric: 'Shadow AI', baseline: `${inputs.shadowAI}/5`, shocked: '5/5', severity: 'high' },
      { metric: 'Explainability Gap', baseline: `${inputs.explainabilityGap}/5`, shocked: `${shocked.explainabilityGap}/5`, severity: 'medium' },
    ],
    operationalImpact: delta > 0.5 ? 'Critical — ungoverned autonomous operation' : delta > 0.2 ? 'Elevated — governance gaps accumulating' : 'Moderate — partial oversight loss',
    recoveryDifficulty: 'High — requires organisational rebuild',
    recoveryTime: '3–12 months',
  };
}

export function simulateOversightShock(inputs: ExposureInputs, baseResults: AnalysisResults): ShockResult {
  const shocked: ExposureInputs = {
    ...inputs,
    automation: 5,
    executionAuthority: 5,
    actionDensity: clamp(inputs.actionDensity + 1, 1, 5),
    toolCallScope: clamp(inputs.toolCallScope + 1, 1, 5),
    oversightLevel: 1,
    humanCheckpoints: 1,
    multiAgent: clamp(inputs.multiAgent + 1, 1, 5),
  };
  const shockedResults = computeFullAnalysis(shocked);
  const delta = shockedResults.afi - baseResults.afi;

  return {
    label: 'Oversight Collapse',
    icon: '👁',
    description: 'All human oversight mechanisms fail — automated systems escalate authority, expand action scope, and operate autonomously without human review or intervention capability.',
    baselineAFI: baseResults.afi,
    shockedAFI: shockedResults.afi,
    afiDelta: delta,
    baselineBand: baseResults.band,
    shockedBand: shockedResults.band,
    keyChanges: [
      { metric: 'Automation', baseline: `${inputs.automation}/5`, shocked: '5/5', severity: 'high' },
      { metric: 'Execution Authority', baseline: `${inputs.executionAuthority}/5`, shocked: '5/5', severity: 'high' },
      { metric: 'Oversight Level', baseline: `${inputs.oversightLevel}/5`, shocked: '1/5', severity: 'high' },
      { metric: 'Human Checkpoints', baseline: `${inputs.humanCheckpoints}/5`, shocked: '1/5', severity: 'high' },
      { metric: 'AGRI', baseline: `${baseResults.agri}`, shocked: `${shockedResults.agri}`, severity: shockedResults.agri > 70 ? 'high' : 'medium' },
    ],
    operationalImpact: 'Critical — fully autonomous operation without safeguards',
    recoveryDifficulty: 'Very High — requires system shutdown and rebuild',
    recoveryTime: '1–6 months',
  };
}
