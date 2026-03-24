/**
 * Capital Impact Engine
 * Heuristic decision-support layer translating AFI into economic impact ranges.
 * NOT actuarial pricing — qualitative exposure characterization only.
 */
import { AnalysisResults, ExposureInputs, RecursiveRiskState } from './types';
import { ANCHOR_LOSS, SIZE_MULTIPLIERS, REVENUE_MULTIPLIERS, SECTOR_MULTIPLIERS } from './constants';

export interface LossRange {
  low: number;   // €M
  mid: number;   // €M
  high: number;  // €M
  label: string;
}

export type StressLevel = 'Low' | 'Moderate' | 'Significant' | 'Severe';
export type OperationalImpact = 'Minimal' | 'Elevated' | 'Critical' | 'Systemic';

export interface CapitalImpact {
  lossRange: LossRange;
  stressLevel: StressLevel;
  stressScore: number;
  operationalImpact: OperationalImpact;
  operationalScore: number;
  explanation: string;
  drivers: { label: string; contribution: number; direction: 'risk' | 'mitigant' }[];
}

export function estimateLossRange(inputs: ExposureInputs, results: AnalysisResults): LossRange {
  const sizeMul = SIZE_MULTIPLIERS[inputs.size] || 1.0;
  const revMul = REVENUE_MULTIPLIERS[inputs.revenue] || 1.0;
  const sectorMul = SECTOR_MULTIPLIERS[inputs.industry] || 1.0;
  const afiMul = Math.max(0.3, results.afi);

  const base = ANCHOR_LOSS * sizeMul * revMul * sectorMul;
  const low = Math.round(base * afiMul * 0.3 * 10) / 10;
  const mid = Math.round(base * afiMul * 0.7 * 10) / 10;
  const high = Math.round(base * afiMul * 1.4 * 10) / 10;

  const label = high >= 5 ? 'Severe exposure range' : high >= 2 ? 'Elevated exposure range' : 'Manageable exposure range';
  return { low, mid, high, label };
}

export function estimateCapitalStress(inputs: ExposureInputs, results: AnalysisResults): { level: StressLevel; score: number } {
  const { afi, correlationFactor, compositeRiskIndex } = results;
  const reversibility = results.components.rc;
  const concentration = ((inputs.cloudConcentration + inputs.modelConcentration + inputs.gpuConcentration) / 3 - 1) / 4;

  const score = Math.min(100, Math.round(
    afi * 20 +
    correlationFactor * 25 +
    reversibility * 20 +
    concentration * 15 +
    compositeRiskIndex * 0.2
  ));

  const level: StressLevel = score >= 75 ? 'Severe' : score >= 50 ? 'Significant' : score >= 30 ? 'Moderate' : 'Low';
  return { level, score };
}

export function estimateOperationalImpact(inputs: ExposureInputs, results: AnalysisResults): { impact: OperationalImpact; score: number } {
  const delegation = results.components.dr;
  const continuation = results.components.cd;
  const automation = inputs.automation / 5;
  const integrationDepth = inputs.integrationDepth / 5;
  const oversight = inputs.oversightLevel / 5;

  const score = Math.min(100, Math.round(
    delegation * 25 +
    continuation * 25 +
    automation * 20 +
    integrationDepth * 15 +
    (1 - oversight) * 15
  ));

  const impact: OperationalImpact = score >= 75 ? 'Systemic' : score >= 50 ? 'Critical' : score >= 30 ? 'Elevated' : 'Minimal';
  return { impact, score };
}

export function computeCapitalImpact(inputs: ExposureInputs, results: AnalysisResults, recursiveRisk?: RecursiveRiskState | null): CapitalImpact {
  const lossRange = estimateLossRange(inputs, results);
  const { level: stressLevel, score: stressScore } = estimateCapitalStress(inputs, results);
  const { impact: operationalImpact, score: operationalScore } = estimateOperationalImpact(inputs, results);

  // RSI/MCCI amplification on loss range
  if (recursiveRisk) {
    const rsiAmplifier = 1 + (recursiveRisk.rsiScore / 100) * 0.3; // up to +30%
    const mcciAmplifier = 1 + (recursiveRisk.mcciScore / 100) * 0.2; // up to +20%
    const combinedAmplifier = rsiAmplifier * mcciAmplifier;
    lossRange.low = Math.round(lossRange.low * combinedAmplifier * 10) / 10;
    lossRange.mid = Math.round(lossRange.mid * combinedAmplifier * 10) / 10;
    lossRange.high = Math.round(lossRange.high * combinedAmplifier * 10) / 10;
    if (lossRange.high >= 5) lossRange.label = 'Severe exposure range';
    else if (lossRange.high >= 2) lossRange.label = 'Elevated exposure range';
  }

  const drivers: CapitalImpact['drivers'] = [];

  if (results.components.dr > 0.6) drivers.push({ label: 'High delegation ratio', contribution: results.components.dr, direction: 'risk' });
  if (results.components.rc > 0.6) drivers.push({ label: 'Low reversibility', contribution: results.components.rc, direction: 'risk' });
  if (results.correlationFactor > 0.5) drivers.push({ label: 'Elevated correlation factor', contribution: results.correlationFactor, direction: 'risk' });
  if (inputs.cloudConcentration >= 4) drivers.push({ label: 'Cloud concentration risk', contribution: inputs.cloudConcentration / 5, direction: 'risk' });
  if (inputs.automation >= 4) drivers.push({ label: 'High automation level', contribution: inputs.automation / 5, direction: 'risk' });
  if (recursiveRisk && recursiveRisk.rsiScore > 30) drivers.push({ label: 'Recursive self-improvement risk (RSI)', contribution: recursiveRisk.rsiScore / 100, direction: 'risk' });
  if (recursiveRisk && recursiveRisk.mcciScore > 30) drivers.push({ label: 'Metacognitive capability (MCCI)', contribution: recursiveRisk.mcciScore / 100, direction: 'risk' });
  if (recursiveRisk && recursiveRisk.cgdAlert) drivers.push({ label: 'Compounding gain detected', contribution: 0.8, direction: 'risk' });
  if (results.components.jd > 0.6) drivers.push({ label: 'Strong oversight density', contribution: results.components.jd, direction: 'mitigant' });
  if (inputs.humanCheckpoints >= 4) drivers.push({ label: 'Human checkpoints in place', contribution: inputs.humanCheckpoints / 5, direction: 'mitigant' });
  if (inputs.providers.length >= 3) drivers.push({ label: 'Provider diversification', contribution: 0.6, direction: 'mitigant' });
  if (recursiveRisk && recursiveRisk.oversightCapability > 60) drivers.push({ label: 'Strong recursive oversight', contribution: recursiveRisk.oversightCapability / 100, direction: 'mitigant' });

  drivers.sort((a, b) => b.contribution - a.contribution);

  const explanation = stressLevel === 'Severe'
    ? 'Capital stress indicators suggest this AI deployment could create material balance-sheet impact under adverse conditions. The combination of high delegation, low reversibility, and infrastructure concentration amplifies potential losses beyond standard actuarial assumptions.'
    : stressLevel === 'Significant'
    ? 'Capital stress is elevated due to structural governance gaps. Loss potential exceeds baseline assumptions for AI-related operational risk. Targeted mitigation could meaningfully reduce capital impact.'
    : stressLevel === 'Moderate'
    ? 'Capital stress indicators are within manageable bounds but warrant monitoring. Some structural factors could amplify losses under stress conditions.'
    : 'Capital stress is within normal tolerance. Current governance structure provides adequate loss containment. Standard monitoring applies.';

  return { lossRange, stressLevel, stressScore, operationalImpact, operationalScore, explanation, drivers };
}
