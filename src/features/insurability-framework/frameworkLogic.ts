import { ExposureInputs, AnalysisResults } from '@/lib/types';
import { ConditionEvaluation, FrameworkResult } from './types';

function scoreToLabel(score: 1 | 2 | 3): 'Strong' | 'Moderate' | 'Challenged' {
  return score === 1 ? 'Strong' : score === 2 ? 'Moderate' : 'Challenged';
}

function riskToScore(avgRisk: number): 1 | 2 | 3 {
  return avgRisk <= 0.3 ? 1 : avgRisk <= 0.6 ? 2 : 3;
}

export function evaluatePredictability(inputs: ExposureInputs): ConditionEvaluation {
  const driftRisk = inputs.modelDrift / 5;
  const biasRisk = inputs.algorithmicBias / 5;
  const shadowRisk = inputs.shadowAI / 5;
  const dataQualityRisk = (6 - inputs.dataIntegrity) / 5;
  const avgRisk = (driftRisk + biasRisk + shadowRisk + dataQualityRisk) / 4;
  const score = riskToScore(avgRisk);

  const reasoningMap: Record<1 | 2 | 3, string> = {
    1: 'Loss behavior is stable and can be reasonably estimated using available data. Model drift and bias risks are low.',
    2: 'Loss behavior exhibits some variability. Model drift or bias may require conservative assumptions.',
    3: 'Loss behavior is highly unstable or non-stationary. Model drift and bias create significant uncertainty.',
  };

  const evidence: string[] = [];
  if (inputs.modelDrift >= 4) evidence.push(`High model drift detected (${inputs.modelDrift}/5)`);
  if (inputs.algorithmicBias >= 4) evidence.push(`Significant algorithmic bias risk (${inputs.algorithmicBias}/5)`);
  if (inputs.shadowAI >= 3) evidence.push(`Shadow AI presence increases unpredictability (${inputs.shadowAI}/5)`);
  if (inputs.dataIntegrity <= 2) evidence.push(`Poor data integrity (${inputs.dataIntegrity}/5)`);

  return {
    condition: 'Predictability',
    score,
    label: scoreToLabel(score),
    evidence,
    reasoning: reasoningMap[score],
    recommendation: score >= 2
      ? 'Consider enhanced data monitoring and drift detection mechanisms'
      : 'Standard actuarial methods applicable',
  };
}

export function evaluateControllability(inputs: ExposureInputs): ConditionEvaluation {
  const legibility = (6 - inputs.explainabilityGap) / 5;
  const interruptibility = inputs.humanCheckpoints / 5;
  const reconstructibility = inputs.reviewCadence / 5;
  const avgScore = (legibility + interruptibility + reconstructibility) / 3;

  // Invert: high avgScore = low risk
  const score: 1 | 2 | 3 = avgScore >= 0.7 ? 1 : avgScore >= 0.4 ? 2 : 3;

  const reasoningMap: Record<1 | 2 | 3, string> = {
    1: 'Systems are auditable, interruptible, and support post-loss analysis. Strong governance controls in place.',
    2: 'Partial limitations exist in governance controls. Some aspects may be opaque or difficult to reconstruct.',
    3: 'System behavior is opaque, non-interruptible, or cannot be reconstructed after loss events.',
  };

  const evidence: string[] = [];
  if (inputs.explainabilityGap >= 4) evidence.push(`Low legibility: High explainability gap (${inputs.explainabilityGap}/5)`);
  if (inputs.humanCheckpoints <= 2) evidence.push(`Limited interruptibility: Few human checkpoints (${inputs.humanCheckpoints}/5)`);
  if (inputs.reviewCadence <= 2) evidence.push(`Poor reconstructibility: Infrequent reviews (${inputs.reviewCadence}/5)`);
  if (inputs.oversightLevel <= 2) evidence.push(`Weak oversight mechanisms (${inputs.oversightLevel}/5)`);

  return {
    condition: 'Controllability',
    score,
    label: scoreToLabel(score),
    evidence,
    reasoning: reasoningMap[score],
    recommendation: score >= 2
      ? 'Implement enhanced audit mechanisms and governance protocols'
      : 'Governance controls meet standard requirements',
  };
}

export function evaluateIndependence(
  inputs: ExposureInputs,
  portfolioContext?: { sdr: number; mcs: number }
): ConditionEvaluation {
  const modelConc = inputs.modelConcentration / 5;
  const cloudConc = inputs.cloudConcentration / 5;
  const vendorContagion = inputs.crossVendorContagion / 5;

  const dependencyRisk = portfolioContext
    ? (portfolioContext.sdr * 0.5 + portfolioContext.mcs * 0.3 + modelConc * 0.2)
    : (modelConc + cloudConc + vendorContagion) / 3;

  const score = riskToScore(dependencyRisk);

  const reasoningMap: Record<1 | 2 | 3, string> = {
    1: 'Risks are largely independent with minimal shared dependencies. Diversification benefits are preserved.',
    2: 'Dependencies exist but are limited or diversified across providers. Moderate correlation risk.',
    3: 'Significant dependency concentration exists, creating potential for correlated losses across portfolio.',
  };

  const evidence: string[] = [];
  if (inputs.modelConcentration >= 4) evidence.push(`High model concentration (${inputs.modelConcentration}/5)`);
  if (inputs.cloudConcentration >= 4) evidence.push(`High cloud provider concentration (${inputs.cloudConcentration}/5)`);
  if (inputs.crossVendorContagion >= 4) evidence.push(`Significant cross-vendor contagion risk (${inputs.crossVendorContagion}/5)`);
  if (portfolioContext && portfolioContext.sdr >= 0.5) {
    evidence.push(`Portfolio-level shared dependency ratio: ${(portfolioContext.sdr * 100).toFixed(0)}%`);
  }

  return {
    condition: 'Independence',
    score,
    label: scoreToLabel(score),
    evidence,
    reasoning: reasoningMap[score],
    recommendation: score >= 2
      ? 'Diversify provider dependencies or implement concentration limits'
      : 'Dependency structure supports standard diversification',
  };
}

export function evaluateTemporalBoundedness(inputs: ExposureInputs): ConditionEvaluation {
  const versioningRisk = inputs.switchingCost / 5;
  const portabilityRisk = (6 - inputs.portability) / 5;
  const sunsetRisk = (6 - inputs.sunsetPolicy) / 5;
  const avgRisk = (versioningRisk + portabilityRisk + sunsetRisk) / 3;

  const score = riskToScore(avgRisk);

  const reasoningMap: Record<1 | 2 | 3, string> = {
    1: 'System behavior is stable over time, with clear version control and traceability. Attribution is straightforward.',
    2: 'Systems evolve, but changes are documented and bounded. Some attribution challenges may exist.',
    3: 'System behavior is continuously evolving without clear traceability. The continuity problem makes attribution difficult.',
  };

  const evidence: string[] = [];
  if (inputs.switchingCost >= 4) evidence.push(`High switching cost indicates deep integration (${inputs.switchingCost}/5)`);
  if (inputs.portability <= 2) evidence.push(`Low portability suggests vendor lock-in (${inputs.portability}/5)`);
  if (inputs.sunsetPolicy <= 2) evidence.push(`Weak sunset policy increases continuity risk (${inputs.sunsetPolicy}/5)`);
  if (inputs.persistentMemory >= 4) evidence.push(`Persistent memory creates evolving system state (${inputs.persistentMemory}/5)`);

  return {
    condition: 'Temporal Boundedness',
    score,
    label: scoreToLabel(score),
    evidence,
    reasoning: reasoningMap[score],
    recommendation: score >= 2
      ? 'Implement strict version control and change documentation protocols'
      : 'Temporal boundaries are adequately defined',
  };
}

export function evaluateAccumulationTolerance(
  results: AnalysisResults,
  portfolioContext?: { pas: number; cAFI: number; accumulationBand: string }
): ConditionEvaluation {
  const portfolioRisk = portfolioContext ? portfolioContext.pas / 100 : results.correlationFactor;

  const score: 1 | 2 | 3 =
    (portfolioRisk <= 0.25 || (portfolioContext && portfolioContext.accumulationBand === 'Low'))
      ? 1
      : (portfolioRisk <= 0.5 || (portfolioContext && portfolioContext.accumulationBand === 'Elevated'))
        ? 2
        : 3;

  const reasoningMap: Record<1 | 2 | 3, string> = {
    1: 'Accumulation remains within acceptable capital limits. Portfolio risk is manageable.',
    2: 'Accumulation is elevated and requires monitoring or capital adjustments.',
    3: 'Accumulation exceeds prudent limits, potentially challenging capital adequacy.',
  };

  const evidence: string[] = [];
  if (portfolioContext) {
    evidence.push(`Portfolio Accumulation Score: ${portfolioContext.pas}/100 (${portfolioContext.accumulationBand})`);
    evidence.push(`Correlated AFI: ${portfolioContext.cAFI.toFixed(2)}`);
  }
  evidence.push(`Individual correlation factor: ${(results.correlationFactor * 100).toFixed(0)}%`);
  if (results.amplificationFactor !== '1.0x') {
    evidence.push(`Amplification factor: ${results.amplificationFactor}`);
  }

  return {
    condition: 'Accumulation Tolerance',
    score,
    label: scoreToLabel(score),
    evidence,
    reasoning: reasoningMap[score],
    recommendation: score >= 2
      ? 'Consider capital loading or concentration limits'
      : 'Accumulation is within normal parameters',
  };
}

export function evaluateFramework(
  inputs: ExposureInputs,
  results: AnalysisResults,
  portfolioContext?: {
    sdr: number;
    mcs: number;
    pas: number;
    cAFI: number;
    accumulationBand: string;
  }
): FrameworkResult {
  const conditions: ConditionEvaluation[] = [
    evaluatePredictability(inputs),
    evaluateControllability(inputs),
    evaluateIndependence(inputs, portfolioContext),
    evaluateTemporalBoundedness(inputs),
    evaluateAccumulationTolerance(results, portfolioContext),
  ];

  const worstScore = Math.max(...conditions.map(c => c.score)) as 1 | 2 | 3;

  const tierLabel =
    worstScore === 1 ? 'Tier 1: Insurable' as const :
    worstScore === 2 ? 'Tier 2: Conditionally Insurable' as const :
    'Tier 3: Beyond Standard Transfer' as const;

  const criticalConditions = conditions
    .filter(c => c.score === 3)
    .map(c => c.condition);

  const summary =
    worstScore === 1
      ? 'Risk satisfies all insurability conditions under standard assumptions. Accept under normal terms.'
    : worstScore === 2
      ? `Risk challenges ${criticalConditions.length > 0 ? criticalConditions.join(', ') : 'some'} condition(s). Accept with enhanced governance, pricing adjustments, or contractual safeguards.`
      : `Risk simultaneously challenges multiple conditions (${criticalConditions.join(', ')}). May exceed boundaries of standard insurance transfer.`;

  return {
    conditions,
    overallTier: worstScore,
    tierLabel,
    criticalConditions,
    summary,
  };
}
