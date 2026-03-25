/**
 * System Evolution Engine v2.0
 * Deep integration: AGI Proximity (4-dimensional), Drift Projections with confidence,
 * Entity + Portfolio Insurability, Systemic Correlation (refined), Cascade Amplification,
 * and Coverage Decision logic.
 */

import { ExposureInputs, AFIComponents, AnalysisResults } from './types';
import { computeAFIComponents, calcAFI, getBand } from './scoring';
import { SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT } from './constants';

// ════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════

export type AGIProximityTier = 'Narrow System' | 'Advanced System' | 'AGI-like' | 'Pre-ASI';
export type InsurabilityStatus = 'Insurable' | 'At Risk' | 'Critical' | 'Uninsurable';
export type SystemicCorrelation = 'Low' | 'Medium' | 'High';
export type DriftTrend = 'Stable' | 'Increasing Risk' | 'Critical Acceleration';
export type DriftConfidence = 'Low' | 'Medium' | 'High';
export type DriftScenario = 'low' | 'medium' | 'high';
export type PortfolioImpact = 'Minimal' | 'Elevated' | 'Critical' | 'Systemic';
export type CoverageDecision = 'Accept' | 'Accept with Conditions' | 'Limited Coverage' | 'Decline';

export interface AGIProximityDimensions {
  autonomy: number;
  generality: number;
  adaptiveModification: number;
  decisionScope: number;
}

export interface DriftProjection {
  label: string;
  months: number;
  afi: number;
  band: string;
  dr: number;
  jd: number;
  rc: number;
  cd: number;
}

export interface CascadeAmplification {
  score: number;
  delegationDepth: number;
  recoveryLatency: number;
  sharedFailureMode: number;
  label: string;
}

export interface SystemicCorrelationDetail {
  level: SystemicCorrelation;
  score: number;
  foundationModelDep: number;
  cloudInfraDep: number;
  updateSyncRisk: number;
  hiddenCorrelation: boolean;
}

export interface CoverageCondition {
  action: string;
  priority: 'required' | 'recommended';
}

export interface CoverageDecisionResult {
  decision: CoverageDecision;
  conditions: CoverageCondition[];
  maxTenor: number | null; // months, null = standard
  sublimitRecommended: boolean;
}

export interface EvolutionAnalysis {
  // AGI Proximity Index (4-dimensional)
  agiProximity: number;
  agiTier: AGIProximityTier;
  agiDimensions: AGIProximityDimensions;
  // Drift Projections
  projections: DriftProjection[];
  driftTrend: DriftTrend;
  driftConfidence: DriftConfidence;
  driftScenario: DriftScenario;
  // Entity Insurability
  insurabilityStatus: InsurabilityStatus;
  insurabilityScore: number;
  monthsToUninsurable: number | null;
  insurabilityDrivers: string[];
  // Portfolio Insurability
  portfolioImpact: PortfolioImpact;
  portfolioImpactScore: number;
  // Systemic (refined)
  systemicCorrelation: SystemicCorrelation;
  systemicCorrelationScore: number;
  systemicDetail: SystemicCorrelationDetail;
  // Cascade (deepened)
  cascadeRiskScore: number;
  cascadeAmplification: CascadeAmplification;
  // Coverage Decision
  coverageDecision: CoverageDecisionResult;
  // Premium multipliers
  driftFactor: number;
  correlationMultiplier: number;
  cascadeMultiplier: number;
  // Executive statements
  executiveStatements: string[];
}

// ════════════════════════════════════════════════════════
// AGI PROXIMITY INDEX (4 explicit dimensions)
// ════════════════════════════════════════════════════════

function computeAGIProximity(inputs: ExposureInputs): { score: number; tier: AGIProximityTier; dimensions: AGIProximityDimensions } {
  // 1. Autonomy: independent decision-making
  const autonomy = Math.min(1, ((inputs.automation + inputs.executionAuthority) / 2 - 1) / 4);

  // 2. Generality: breadth of task domains
  const useCaseGenerality = Math.min(1, inputs.useCases.length / 8);
  const breadthFactor = (inputs.workflowBreadth - 1) / 4;
  const generality = useCaseGenerality * 0.6 + breadthFactor * 0.4;

  // 3. Adaptive Modification: self-improvement capability
  const adaptiveModification = (inputs.persistentMemory - 1) / 4 * 0.6 + (inputs.modelDrift - 1) / 4 * 0.4;

  // 4. Decision Scope: criticality × integration × action density
  const decisionScope = (inputs.criticality - 1) / 4 * 0.4 + (inputs.integrationDepth - 1) / 4 * 0.3 + (inputs.actionDensity - 1) / 4 * 0.3;

  const score = Math.min(1, Math.max(0,
    autonomy * 0.35 + generality * 0.25 + adaptiveModification * 0.20 + decisionScope * 0.20
  ));

  let tier: AGIProximityTier;
  if (score < 0.3) tier = 'Narrow System';
  else if (score < 0.6) tier = 'Advanced System';
  else if (score < 0.8) tier = 'AGI-like';
  else tier = 'Pre-ASI';

  return { score, tier, dimensions: { autonomy, generality, adaptiveModification, decisionScope } };
}

// ════════════════════════════════════════════════════════
// DRIFT PROJECTION ENGINE (with confidence + scenarios)
// ════════════════════════════════════════════════════════

const DRIFT_SCENARIO_MULTIPLIERS: Record<DriftScenario, number> = {
  low: 0.6,
  medium: 1.0,
  high: 1.5,
};

function projectDrift(inputs: ExposureInputs, months: number, scenario: DriftScenario = 'medium'): DriftProjection {
  const components = computeAFIComponents(inputs);
  const t = months / 12;
  const sm = DRIFT_SCENARIO_MULTIPLIERS[scenario];

  // DR increases (delegation creep)
  const dr = Math.min(1, components.dr + components.dr * 0.15 * t * (inputs.automation / 3) * sm);
  // JD decreases (oversight decay)
  const jd = Math.max(0.05, components.jd * (1 - 0.12 * t * (1 - inputs.reviewCadence / 5) * sm));
  // RC increases non-linearly (lock-in deepens)
  const rc = Math.min(1, components.rc + components.rc * 0.25 * Math.pow(t, 1.4) * (inputs.switchingCost / 3) * sm);
  // CD increases with agent count + dependencies
  const agentFactor = (inputs.multiAgent - 1) / 4;
  const couplingFactor = (inputs.integrationDepth - 1) / 4;
  const cd = Math.min(1, components.cd + components.cd * 0.10 * t * (1 + agentFactor + couplingFactor) * sm);

  const na = components.na;
  const baseAfi = calcAFI(dr, jd, rc, cd, na);
  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);

  const labels: Record<number, string> = { 3: '3 Months', 6: '6 Months', 12: '12 Months' };
  return { label: labels[months] || `${months}m`, months, afi, band: getBand(afi), dr, jd, rc, cd };
}

function computeDriftTrend(currentAfi: number, projections: DriftProjection[]): DriftTrend {
  if (projections.length === 0) return 'Stable';
  const afi12 = projections[projections.length - 1].afi;
  const rate = (afi12 - currentAfi) / Math.max(0.01, currentAfi);
  if (rate > 0.5) return 'Critical Acceleration';
  if (rate > 0.15) return 'Increasing Risk';
  return 'Stable';
}

function computeDriftConfidence(inputs: ExposureInputs): DriftConfidence {
  // More historical data proxies = higher confidence
  const dataRichness = (inputs.reviewCadence - 1) / 4;
  const oversightQuality = (inputs.oversightLevel - 1) / 4;
  const score = (dataRichness * 0.5 + oversightQuality * 0.5);
  if (score > 0.6) return 'High';
  if (score > 0.3) return 'Medium';
  return 'Low';
}

// ════════════════════════════════════════════════════════
// ENTITY INSURABILITY (integrates drift + AGI proximity)
// ════════════════════════════════════════════════════════

function computeInsurability(
  currentAfi: number,
  components: AFIComponents,
  projections: DriftProjection[],
  agiProximity: number,
  cascadeScore: number,
  correlationScore: number
): { status: InsurabilityStatus; score: number; monthsToUninsurable: number | null; drivers: string[] } {
  const { rc, jd, cd } = components;
  const drivers: string[] = [];

  // Base insurability score
  const afiPenalty = Math.min(1, currentAfi / 2.5);
  const score = Math.max(0, Math.min(1,
    1 - (afiPenalty * 0.30 + rc * 0.20 - jd * 0.15 + cd * 0.15 + agiProximity * 0.10 + cascadeScore * 0.10)
  ));

  // Determine status using current + projected
  let status: InsurabilityStatus;

  // Current state assessment
  if (currentAfi > 2.0 && rc > 0.7 && jd < 0.3 && cd > 0.6) {
    status = 'Uninsurable';
    drivers.push('AFI exceeds structural insurability threshold');
    drivers.push('Reversibility cost makes remediation economically unviable');
  } else if (currentAfi > 1.5 && rc > 0.6 && jd < 0.4) {
    status = 'Critical';
    drivers.push('Risk structure approaching insurability boundary');
  } else if (currentAfi > 1.0 || (rc > 0.5 && jd < 0.5)) {
    status = 'At Risk';
    drivers.push('Structural signals indicate elevated exposure');
  } else {
    status = 'Insurable';
  }

  // Drift-based downgrade: if currently insurable but projected to cross thresholds
  if (status === 'Insurable' || status === 'At Risk') {
    const proj6 = projections.find(p => p.months === 6);
    const proj12 = projections.find(p => p.months === 12);

    if (proj12 && proj12.afi > 2.0 && proj12.rc > 0.65) {
      if (status === 'Insurable') {
        status = 'At Risk';
        drivers.push('Projected to become uninsurable within 12 months');
      }
    }
    if (proj6 && proj6.afi > 1.5 && proj6.rc > 0.6) {
      if (status === 'Insurable') {
        status = 'At Risk';
        drivers.push('6-month trajectory shows critical acceleration');
      } else if (status === 'At Risk') {
        status = 'Critical';
        drivers.push('Near-term drift projection triggers critical downgrade');
      }
    }
  }

  // AGI proximity penalty
  if (agiProximity > 0.7 && status !== 'Uninsurable') {
    if (status === 'Insurable') status = 'At Risk';
    else if (status === 'At Risk') status = 'Critical';
    drivers.push('System classification exceeds standard insurability frameworks');
  }

  // High correlation + cascade compound penalty
  if (correlationScore > 0.6 && cascadeScore > 0.5 && status !== 'Uninsurable') {
    if (status === 'Insurable') status = 'At Risk';
    drivers.push('Systemic correlation creates portfolio-level exposure');
  }

  // Estimate months to uninsurable
  let monthsToUninsurable: number | null = null;
  if (status !== 'Uninsurable') {
    for (const proj of projections) {
      if (proj.afi > 2.0 && proj.rc > 0.7 && proj.jd < 0.3) {
        monthsToUninsurable = proj.months;
        break;
      }
    }
  } else {
    monthsToUninsurable = 0;
  }

  if (drivers.length === 0) {
    drivers.push('Structural risk within standard underwriting parameters');
  }

  return { status, score, monthsToUninsurable, drivers };
}

// ════════════════════════════════════════════════════════
// PORTFOLIO INSURABILITY
// ════════════════════════════════════════════════════════

function computePortfolioImpact(
  correlationScore: number,
  cascadeScore: number,
  currentAfi: number,
  agiProximity: number
): { impact: PortfolioImpact; score: number } {
  const score = Math.min(1, Math.max(0,
    correlationScore * 0.35 + cascadeScore * 0.30 + Math.min(1, currentAfi / 2.5) * 0.20 + agiProximity * 0.15
  ));

  let impact: PortfolioImpact;
  if (score > 0.7) impact = 'Systemic';
  else if (score > 0.5) impact = 'Critical';
  else if (score > 0.3) impact = 'Elevated';
  else impact = 'Minimal';

  return { impact, score };
}

// ════════════════════════════════════════════════════════
// SYSTEMIC CORRELATION (refined with hidden correlation)
// ════════════════════════════════════════════════════════

function computeSystemicCorrelation(inputs: ExposureInputs): SystemicCorrelationDetail {
  const providerCount = inputs.providers.length;
  const hasInHouse = inputs.providers.includes('Custom / In-House');

  // Foundation model family dependency
  const foundationModelDep = providerCount <= 1 ? 1.0 : providerCount <= 2 ? 0.7 : hasInHouse ? 0.3 : 0.5;

  // Cloud infrastructure dependency
  const cloudInfraDep = (inputs.cloudConcentration - 1) / 4;

  // Update synchronization risk (model concentration + cross-vendor)
  const updateSyncRisk = ((inputs.modelConcentration - 1) / 4 * 0.6 + (inputs.crossVendorContagion - 1) / 4 * 0.4);

  const score = Math.min(1, foundationModelDep * 0.35 + cloudInfraDep * 0.30 + updateSyncRisk * 0.35);

  // Hidden correlation: detected when multiple factors are individually moderate but collectively high
  const hiddenCorrelation = foundationModelDep > 0.4 && cloudInfraDep > 0.3 && updateSyncRisk > 0.3 && score > 0.45;

  let level: SystemicCorrelation;
  if (score > 0.65) level = 'High';
  else if (score > 0.35) level = 'Medium';
  else level = 'Low';

  return { level, score, foundationModelDep, cloudInfraDep, updateSyncRisk, hiddenCorrelation };
}

// ════════════════════════════════════════════════════════
// CASCADE AMPLIFICATION RISK (deepened)
// ════════════════════════════════════════════════════════

function computeCascadeAmplification(inputs: ExposureInputs, components: AFIComponents): CascadeAmplification {
  // Delegation Depth: multi-agent × tool authority × execution authority
  const delegationDepth = Math.min(1,
    ((inputs.multiAgent - 1) / 4 * 0.4 + (inputs.toolCallAuthority - 1) / 4 * 0.3 + (inputs.executionAuthority - 1) / 4 * 0.3)
  );

  // Recovery Latency: switching cost × integration depth × portability (inverted)
  const recoveryLatency = Math.min(1,
    ((inputs.switchingCost - 1) / 4 * 0.4 + (inputs.integrationDepth - 1) / 4 * 0.35 + (5 - inputs.portability) / 4 * 0.25)
  );

  // Shared Failure Mode Probability: concentration × cross-vendor × model dep
  const sharedFailureMode = Math.min(1,
    ((inputs.cloudConcentration - 1) / 4 * 0.3 + (inputs.modelConcentration - 1) / 4 * 0.35 + (inputs.crossVendorContagion - 1) / 4 * 0.35)
  );

  const score = Math.min(1, Math.max(0,
    delegationDepth * 0.30 + recoveryLatency * 0.35 + sharedFailureMode * 0.35
  ));

  let label: string;
  if (score > 0.7) label = 'Severe — Simultaneous multi-system failure probable';
  else if (score > 0.5) label = 'Elevated — Cascade propagation across dependent systems';
  else if (score > 0.3) label = 'Moderate — Isolated failure modes with limited propagation';
  else label = 'Contained — Independent failure modes dominant';

  return { score: parseFloat(score.toFixed(2)), delegationDepth, recoveryLatency, sharedFailureMode, label };
}

// ════════════════════════════════════════════════════════
// COVERAGE DECISION ENGINE
// ════════════════════════════════════════════════════════

function computeCoverageDecision(
  insurabilityStatus: InsurabilityStatus,
  driftTrend: DriftTrend,
  cascadeScore: number,
  correlationScore: number,
  agiProximity: number,
  inputs: ExposureInputs
): CoverageDecisionResult {
  const conditions: CoverageCondition[] = [];
  let decision: CoverageDecision;
  let maxTenor: number | null = null;
  let sublimitRecommended = false;

  if (insurabilityStatus === 'Uninsurable') {
    decision = 'Decline';
    conditions.push({ action: 'Structural remediation required before re-assessment', priority: 'required' });
  } else if (insurabilityStatus === 'Critical') {
    decision = 'Limited Coverage';
    maxTenor = 6;
    sublimitRecommended = true;
    conditions.push({ action: 'Reduce system autonomy below current threshold', priority: 'required' });
    conditions.push({ action: 'Implement mandatory human oversight checkpoints', priority: 'required' });
    if (cascadeScore > 0.5) conditions.push({ action: 'Reduce external coupling and shared dependencies', priority: 'required' });
  } else if (insurabilityStatus === 'At Risk' || driftTrend === 'Critical Acceleration') {
    decision = 'Accept with Conditions';
    maxTenor = 12;
    if (inputs.oversightLevel <= 2) conditions.push({ action: 'Increase human oversight to minimum Level 3', priority: 'required' });
    if (inputs.automation >= 4) conditions.push({ action: 'Reduce automation authority for high-stakes decisions', priority: 'recommended' });
    if (correlationScore > 0.5) conditions.push({ action: 'Diversify model and infrastructure dependencies', priority: 'recommended' });
    if (agiProximity > 0.6) conditions.push({ action: 'Implement capability boundary controls', priority: 'recommended' });
    if (conditions.length === 0) conditions.push({ action: 'Maintain governance cadence with quarterly re-assessment', priority: 'recommended' });
  } else {
    decision = 'Accept';
    if (driftTrend === 'Increasing Risk') {
      conditions.push({ action: 'Monitor drift trajectory — semi-annual re-assessment', priority: 'recommended' });
    }
  }

  return { decision, conditions, maxTenor, sublimitRecommended };
}

// ════════════════════════════════════════════════════════
// PREMIUM MULTIPLIERS
// ════════════════════════════════════════════════════════

function computePremiumMultipliers(
  projections: DriftProjection[],
  currentAfi: number,
  correlationScore: number,
  cascadeScore: number
): { driftFactor: number; correlationMultiplier: number; cascadeMultiplier: number } {
  // Drift factor: based on 12-month projected AFI vs current
  const proj12 = projections.find(p => p.months === 12);
  const futureAfi = proj12 ? proj12.afi : currentAfi;
  const driftRatio = futureAfi / Math.max(0.01, currentAfi);
  const driftFactor = Math.min(1.30, Math.max(1.0, 1 + (driftRatio - 1) * 0.5));

  // Correlation multiplier: 1.0 to 1.20
  const correlationMultiplier = 1 + correlationScore * 0.20;

  // Cascade multiplier: 1.0 to 1.15
  const cascadeMultiplier = 1 + cascadeScore * 0.15;

  return {
    driftFactor: parseFloat(driftFactor.toFixed(3)),
    correlationMultiplier: parseFloat(correlationMultiplier.toFixed(3)),
    cascadeMultiplier: parseFloat(cascadeMultiplier.toFixed(3)),
  };
}

// ════════════════════════════════════════════════════════
// EXECUTIVE STATEMENTS GENERATOR (board-level)
// ════════════════════════════════════════════════════════

function generateExecutiveStatements(
  analysis: Omit<EvolutionAnalysis, 'executiveStatements'>
): string[] {
  const stmts: string[] = [];

  // Drift + insurability combined
  if (analysis.driftTrend === 'Critical Acceleration' && analysis.monthsToUninsurable !== null && analysis.monthsToUninsurable <= 12) {
    stmts.push(`Projected risk trajectory indicates structural loss of insurability within ${analysis.monthsToUninsurable} months. Immediate governance intervention required to preserve coverage eligibility.`);
  } else if (analysis.driftTrend === 'Critical Acceleration') {
    stmts.push('Risk trajectory shows critical acceleration — current governance structure is insufficient to contain drift. Structural intervention required within 90 days.');
  } else if (analysis.driftTrend === 'Increasing Risk') {
    stmts.push('System exhibits increasing structural dependency and declining reversibility. Without intervention, risk classification will deteriorate at next assessment cycle.');
  }

  // Insurability
  if (analysis.insurabilityStatus === 'Uninsurable') {
    stmts.push('System has crossed the structural insurability threshold. Standard and conditional coverage cannot be justified under current architecture. Remediation is prerequisite to re-assessment.');
  } else if (analysis.insurabilityStatus === 'Critical') {
    stmts.push('Insurability is critically compromised. Coverage available only under restrictive conditions with mandatory structural improvements within 6 months.');
  } else if (analysis.insurabilityStatus === 'At Risk' && analysis.insurabilityDrivers.some(d => d.includes('projected'))) {
    stmts.push('Currently insurable, but projected risk evolution indicates potential loss of coverage eligibility. Proactive governance improvements strongly recommended.');
  }

  // Portfolio impact
  if (analysis.portfolioImpact === 'Systemic') {
    stmts.push('High correlation exposure creates potential portfolio-wide failure scenarios. Aggregate risk exceeds the sum of individual entity exposures due to shared infrastructure dependencies.');
  } else if (analysis.portfolioImpact === 'Critical') {
    stmts.push('Portfolio-level impact is critical. Correlated dependencies amplify individual entity risk into aggregate exposure that requires treaty-level consideration.');
  }

  // Systemic correlation with hidden exposure
  if (analysis.systemicDetail.hiddenCorrelation) {
    stmts.push('Hidden correlation exposure detected: individually moderate dependency factors combine to create aggregate systemic risk not visible in standard per-entity assessments.');
  }

  // Cascade amplification
  if (analysis.cascadeAmplification.score > 0.6) {
    stmts.push('Current system architecture reduces reversibility beyond acceptable underwriting thresholds. Recovery latency and delegation depth create cascading failure conditions.');
  }

  // AGI proximity
  if (analysis.agiTier === 'Pre-ASI') {
    stmts.push(`System classification (${analysis.agiTier}) indicates capabilities that exceed existing governance and insurability frameworks. No standard actuarial model captures this risk profile.`);
  } else if (analysis.agiTier === 'AGI-like') {
    stmts.push(`System classification (${analysis.agiTier}) indicates broad capability scope. Enhanced oversight and explicit capability boundaries are required for continued insurability.`);
  }

  // Coverage decision
  if (analysis.coverageDecision.decision === 'Decline') {
    stmts.push('Underwriting recommendation: Decline coverage until structural remediation is verified and re-assessed.');
  } else if (analysis.coverageDecision.decision === 'Limited Coverage') {
    stmts.push(`Underwriting recommendation: Limited coverage with ${analysis.coverageDecision.maxTenor}-month maximum tenor and sublimit structures.`);
  }

  if (stmts.length === 0) {
    stmts.push('System risk profile is within standard underwriting parameters. Standard coverage terms apply with routine monitoring cadence.');
  }

  return stmts;
}

// ════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════

export function computeEvolutionAnalysis(
  inputs: ExposureInputs,
  currentResults: AnalysisResults,
  driftScenario: DriftScenario = 'medium'
): EvolutionAnalysis {
  const { score: agiProximity, tier: agiTier, dimensions: agiDimensions } = computeAGIProximity(inputs);

  const projections = [3, 6, 12].map(m => projectDrift(inputs, m, driftScenario));
  const driftTrend = computeDriftTrend(currentResults.afi, projections);
  const driftConfidence = computeDriftConfidence(inputs);

  const systemicDetail = computeSystemicCorrelation(inputs);
  const cascadeAmplification = computeCascadeAmplification(inputs, currentResults.components);

  const { status: insurabilityStatus, score: insurabilityScore, monthsToUninsurable, drivers: insurabilityDrivers } =
    computeInsurability(currentResults.afi, currentResults.components, projections, agiProximity, cascadeAmplification.score, systemicDetail.score);

  const { impact: portfolioImpact, score: portfolioImpactScore } =
    computePortfolioImpact(systemicDetail.score, cascadeAmplification.score, currentResults.afi, agiProximity);

  const coverageDecision = computeCoverageDecision(
    insurabilityStatus, driftTrend, cascadeAmplification.score, systemicDetail.score, agiProximity, inputs
  );

  const { driftFactor, correlationMultiplier, cascadeMultiplier } =
    computePremiumMultipliers(projections, currentResults.afi, systemicDetail.score, cascadeAmplification.score);

  const partial = {
    agiProximity,
    agiTier,
    agiDimensions,
    projections,
    driftTrend,
    driftConfidence,
    driftScenario,
    insurabilityStatus,
    insurabilityScore,
    monthsToUninsurable,
    insurabilityDrivers,
    portfolioImpact,
    portfolioImpactScore,
    systemicCorrelation: systemicDetail.level,
    systemicCorrelationScore: systemicDetail.score,
    systemicDetail,
    cascadeRiskScore: cascadeAmplification.score,
    cascadeAmplification,
    coverageDecision,
    driftFactor,
    correlationMultiplier,
    cascadeMultiplier,
  };

  const executiveStatements = generateExecutiveStatements(partial as any);

  return { ...partial, executiveStatements };
}
