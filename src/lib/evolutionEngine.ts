/**
 * System Evolution Engine v2.0
 * Deep integration: AGI Proximity (4-dimensional), Drift Projections with confidence,
 * Entity + Portfolio Insurability, Systemic Correlation (refined), Cascade Amplification,
 * and Coverage Decision logic.
 */

import { ExposureInputs, AFIComponents, AnalysisResults } from './types';
import { computeAFIComponents, calcAFI, getBand, computeFullAnalysis } from './scoring';
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
export type AssessmentConfidence = 'High' | 'Medium' | 'Low';
export type InputIntegrity = 'Reliable' | 'Moderate Uncertainty' | 'Potentially Unreliable';
export type ExitRisk = 'Reversible' | 'Partially Reversible' | 'Structurally Locked-In';
export type DependencyExposure = 'Low' | 'Medium' | 'High';
export type StressImpact = 'Contained' | 'Severe' | 'Critical';
export type TimeToInstability = '< 3 months' | '3–6 months' | '6–12 months' | '> 12 months';
export type UnifiedRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type PrimaryCapitalRiskDriver = 'Cascade Amplification' | 'Systemic Correlation' | 'Structural Fragility' | 'Loss of Reversibility' | 'Dependency Concentration';

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

export interface ConfidenceAssessment {
  level: AssessmentConfidence;
  score: number; // 0-100
  inputCompleteness: number;
  inputConsistency: number;
  modelStability: number;
  scenarioSensitivity: number;
}

export interface InputIntegrityAssessment {
  level: InputIntegrity;
  score: number; // 0-100
  completeness: number;
  plausibility: number;
  consistency: number;
  flags: string[];
}

export interface ExitRiskAssessment {
  level: ExitRisk;
  score: number; // 0-1
  technicalReversibility: number;
  dependencyLockIn: number;
  dataEntanglement: number;
  replacementCost: number;
}

export interface DependencyTopology {
  exposure: DependencyExposure;
  score: number; // 0-1
  singlePointsOfFailure: number;
  sharedProviders: number;
  infraConcentration: number;
  modelChainDepth: number;
}

export interface StressScenarioResult {
  name: string;
  impact: StressImpact;
  afiShocked: number;
  afiDelta: number;
  description: string;
}

export interface DecisionExplainability {
  primaryDriver: string;
  secondaryDriver: string;
  supportingFactor: string;
  narrative: string;
}

export interface EconomicLossEstimate {
  expectedLow: number; // €M
  expectedHigh: number; // €M
  tailRisk: number; // €M
  cascadeTailRisk: number; // €M
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
  // ═══ INSTITUTIONAL TRUST LAYERS ═══
  confidence: ConfidenceAssessment;
  inputIntegrity: InputIntegrityAssessment;
  exitRisk: ExitRiskAssessment;
  dependencyTopology: DependencyTopology;
  stressScenarios: StressScenarioResult[];
  decisionExplainability: DecisionExplainability;
  economicLoss: EconomicLossEstimate;
  timeToInstability: TimeToInstability;
  // ═══ UNIFIED RISK STATE ═══
  unifiedRiskLevel: UnifiedRiskLevel;
  primaryCapitalRiskDriver: PrimaryCapitalRiskDriver;
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
  inputs: ExposureInputs,
  projections: DriftProjection[] = []
): CoverageDecisionResult {
  const conditions: CoverageCondition[] = [];
  let decision: CoverageDecision;
  let maxTenor: number | null = null;
  let sublimitRecommended = false;

  // Hard constraint: projected AFI_12m exceeds critical threshold → force decline/limited
  const proj12 = projections.find(p => p.months === 12);
  const projectedCritical = proj12 && proj12.afi > 2.0 && proj12.rc > 0.65;

  if (insurabilityStatus === 'Uninsurable') {
    decision = 'Decline';
    conditions.push({ action: 'Structural remediation required before re-assessment', priority: 'required' });
  } else if (projectedCritical && insurabilityStatus !== 'Critical') {
    // Hard constraint: projected uninsurable forces Limited Coverage even if currently okay
    decision = 'Limited Coverage';
    maxTenor = 6;
    sublimitRecommended = true;
    conditions.push({ action: '12-month projection exceeds insurability threshold — short-tenor coverage only', priority: 'required' });
    conditions.push({ action: 'Mandatory re-assessment at 6-month mark before renewal', priority: 'required' });
    conditions.push({ action: 'Implement drift mitigation program to reduce projected AFI trajectory', priority: 'required' });
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

  // ═══ PORTFOLIO OVERRIDE LOGIC ═══
  // High correlation + high cascade compounds risk beyond entity-level assessment
  // Downgrade decision by 1–2 levels when both are elevated
  if (correlationScore > 0.65 && cascadeScore > 0.6 && decision !== 'Decline') {
    if (decision === 'Accept') {
      decision = 'Accept with Conditions';
      maxTenor = maxTenor ?? 12;
      conditions.push({ action: 'Portfolio-level override: systemic correlation and cascade risk require enhanced monitoring', priority: 'required' });
      conditions.push({ action: 'Diversify infrastructure dependencies to reduce aggregate exposure', priority: 'required' });
    } else if (decision === 'Accept with Conditions') {
      decision = 'Limited Coverage';
      maxTenor = 6;
      sublimitRecommended = true;
      conditions.push({ action: 'Portfolio-level override: aggregate systemic exposure exceeds conditional acceptance threshold', priority: 'required' });
    } else if (decision === 'Limited Coverage') {
      decision = 'Decline';
      conditions.push({ action: 'Portfolio-level override: combined correlation and cascade risk make coverage unjustifiable', priority: 'required' });
    }
  } else if (correlationScore > 0.5 && cascadeScore > 0.5 && decision === 'Accept') {
    // Moderate portfolio concern — single-level downgrade
    decision = 'Accept with Conditions';
    maxTenor = maxTenor ?? 12;
    conditions.push({ action: 'Elevated portfolio correlation requires dependency diversification plan', priority: 'recommended' });
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
  // ═══ FUTURE-DOMINANT PRICING: 40% current / 60% future ═══
  const proj6 = projections.find(p => p.months === 6);
  const proj12 = projections.find(p => p.months === 12);
  const futureAfi6 = proj6 ? proj6.afi : currentAfi;
  const futureAfi12 = proj12 ? proj12.afi : currentAfi;
  // Blended future AFI: weight 6m and 12m projections
  const blendedFutureAfi = futureAfi6 * 0.4 + futureAfi12 * 0.6;
  // Effective risk AFI: 40% current + 60% future
  const effectiveAfi = currentAfi * 0.4 + blendedFutureAfi * 0.6;
  const driftRatio = effectiveAfi / Math.max(0.01, currentAfi);
  const driftFactor = Math.min(1.45, Math.max(1.0, driftRatio));

  // Correlation multiplier: 1.0 to 1.25 (increased from 1.20)
  const correlationMultiplier = 1 + correlationScore * 0.25;

  // Cascade multiplier: 1.0 to 1.20 (increased from 1.15)
  const cascadeMultiplier = 1 + cascadeScore * 0.20;

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

  // Confidence & trust
  if (analysis.confidence.level === 'Low') {
    stmts.push('Assessment confidence is low due to incomplete or inconsistent inputs. Decision reliability is reduced — independent verification strongly recommended before capital allocation.');
  }

  // Exit risk
  if (analysis.exitRisk.level === 'Structurally Locked-In') {
    stmts.push('System exhibits structural lock-in: technical reversibility, data entanglement, and replacement cost exceed acceptable exit thresholds. Portability remediation required.');
  }

  // Economic loss
  if (analysis.economicLoss.cascadeTailRisk > 20) {
    stmts.push(`Tail risk under cascade conditions reaches €${analysis.economicLoss.cascadeTailRisk}M — exceeds standard portfolio tolerance for single-entity exposure.`);
  }

  // Time to instability
  if (analysis.timeToInstability === '< 3 months') {
    stmts.push('Time-to-instability estimate: less than 3 months. Immediate structural intervention required to prevent loss of controllability.');
  } else if (analysis.timeToInstability === '3–6 months') {
    stmts.push('Projected time-to-instability: 3–6 months. Governance intervention window is narrowing — remediation must begin within 90 days.');
  }

  if (stmts.length === 0) {
    stmts.push('System risk profile is within standard underwriting parameters. Standard coverage terms apply with routine monitoring cadence.');
  }

  return stmts;
}

// ════════════════════════════════════════════════════════
// CONFIDENCE & UNCERTAINTY LAYER
// ════════════════════════════════════════════════════════

function computeConfidence(inputs: ExposureInputs, currentAfi: number, projections: DriftProjection[], inputIntegrityScore?: number): ConfidenceAssessment {
  // Input completeness: how many fields are non-default
  const fields = [inputs.automation, inputs.criticality, inputs.integrationDepth, inputs.executionAuthority,
    inputs.oversightLevel, inputs.reviewCadence, inputs.switchingCost, inputs.cloudConcentration, inputs.modelConcentration];
  const nonDefault = fields.filter(f => f !== 3).length; // 3 = midpoint default
  const inputCompleteness = Math.min(100, Math.round((nonDefault / fields.length) * 100 + (inputs.useCases.length > 0 ? 15 : 0) + (inputs.providers.length > 0 ? 15 : 0)));

  // Input consistency: check for contradictory signals
  const contradictions = [];
  if (inputs.automation >= 4 && inputs.oversightLevel >= 4) contradictions.push('high-auto-high-oversight');
  if (inputs.executionAuthority >= 4 && inputs.humanCheckpoints >= 4) contradictions.push('high-exec-high-checkpoints');
  if (inputs.switchingCost <= 2 && inputs.portability <= 2) contradictions.push('low-cost-low-portability');
  const inputConsistency = Math.max(30, 100 - contradictions.length * 20);

  // Model stability: how much AFI varies across scenarios
  const afiRange = projections.length > 0 ? Math.abs(projections[projections.length - 1].afi - currentAfi) : 0;
  const modelStability = Math.max(20, Math.round(100 - afiRange * 40));

  // Scenario sensitivity: variance of projections
  const scenarioSensitivity = Math.max(20, Math.round(100 - (afiRange / Math.max(0.01, currentAfi)) * 80));

  // Base confidence score
  let score = Math.round(inputCompleteness * 0.25 + inputConsistency * 0.20 + modelStability * 0.25 + scenarioSensitivity * 0.15);

  // Input Integrity dependency: low integrity directly reduces confidence
  if (inputIntegrityScore !== undefined) {
    // Integrity contributes 15% of confidence score
    score = Math.round(score + inputIntegrityScore * 0.15);
    // Additional penalty: if integrity is very low, cap confidence
    if (inputIntegrityScore < 45) {
      score = Math.min(score, 55); // Can never be "High" with unreliable inputs
    }
  } else {
    score = Math.round(score / 0.85); // Normalize if no integrity score available
  }

  const level: AssessmentConfidence = score >= 70 ? 'High' : score >= 45 ? 'Medium' : 'Low';

  return { level, score, inputCompleteness, inputConsistency, modelStability, scenarioSensitivity };
}

// ════════════════════════════════════════════════════════
// INPUT INTEGRITY LAYER
// ════════════════════════════════════════════════════════

function computeInputIntegrity(inputs: ExposureInputs): InputIntegrityAssessment {
  const flags: string[] = [];

  // Completeness
  const hasCompany = inputs.companyName.trim().length > 0;
  const hasIndustry = inputs.industry.trim().length > 0;
  const hasUseCases = inputs.useCases.length > 0;
  const hasProviders = inputs.providers.length > 0;
  const completeness = Math.round(((hasCompany ? 25 : 0) + (hasIndustry ? 25 : 0) + (hasUseCases ? 25 : 0) + (hasProviders ? 25 : 0)));
  if (!hasUseCases) flags.push('No AI use cases specified');
  if (!hasProviders) flags.push('No providers specified');

  // Plausibility: extreme values that seem unlikely
  const allValues = [inputs.automation, inputs.criticality, inputs.integrationDepth, inputs.executionAuthority,
    inputs.oversightLevel, inputs.reviewCadence, inputs.switchingCost, inputs.cloudConcentration];
  const allMax = allValues.filter(v => v === 5).length;
  const allMin = allValues.filter(v => v === 1).length;
  const plausibility = allMax > 5 || allMin > 5 ? 40 : allMax > 3 || allMin > 3 ? 60 : 85;
  if (allMax > 4) flags.push('Unusually high concentration of maximum-risk inputs');
  if (allMin > 4) flags.push('Unusually high concentration of minimum-risk inputs');

  // Consistency
  const consistency = (inputs.automation >= 4 && inputs.oversightLevel >= 4) ? 60 :
    (inputs.executionAuthority >= 4 && inputs.humanCheckpoints >= 4) ? 65 : 90;
  if (consistency < 70) flags.push('Input signals show contradictory risk patterns');

  const score = Math.round(completeness * 0.35 + plausibility * 0.35 + consistency * 0.30);
  const level: InputIntegrity = score >= 70 ? 'Reliable' : score >= 45 ? 'Moderate Uncertainty' : 'Potentially Unreliable';

  return { level, score, completeness, plausibility, consistency, flags };
}

// ════════════════════════════════════════════════════════
// EXIT / LOCK-IN RISK
// ════════════════════════════════════════════════════════

function computeExitRisk(inputs: ExposureInputs, components: AFIComponents): ExitRiskAssessment {
  const technicalReversibility = 1 - components.rc; // RC is already 0-1, high = hard to reverse
  const dependencyLockIn = Math.min(1, ((inputs.switchingCost - 1) / 4 * 0.5 + (5 - inputs.portability) / 4 * 0.5));
  const dataEntanglement = Math.min(1, ((inputs.integrationDepth - 1) / 4 * 0.5 + (inputs.persistentMemory - 1) / 4 * 0.5));
  const replacementCost = Math.min(1, ((inputs.switchingCost - 1) / 4 * 0.4 + (inputs.integrationDepth - 1) / 4 * 0.3 + (5 - inputs.portability) / 4 * 0.3));

  // All components aligned: high = more lock-in risk
  // technicalReversibility is inverted (high = easy to reverse = low lock-in), so use (1 - technicalReversibility)
  const lockInScore = Math.min(1, (1 - technicalReversibility) * 0.25 + dependencyLockIn * 0.25 + dataEntanglement * 0.25 + replacementCost * 0.25);
  const level: ExitRisk = lockInScore > 0.65 ? 'Structurally Locked-In' : lockInScore > 0.35 ? 'Partially Reversible' : 'Reversible';

  return { level, score: lockInScore, technicalReversibility, dependencyLockIn, dataEntanglement, replacementCost };
}

// ════════════════════════════════════════════════════════
// DEPENDENCY TOPOLOGY
// ════════════════════════════════════════════════════════

function computeDependencyTopology(inputs: ExposureInputs): DependencyTopology {
  const singlePointsOfFailure = inputs.providers.length <= 1 ? 1 : inputs.providers.length <= 2 ? 0.6 : 0.2;
  const sharedProviders = Math.min(1, (inputs.modelConcentration - 1) / 4);
  const infraConcentration = Math.min(1, ((inputs.cloudConcentration - 1) / 4 * 0.5 + (inputs.gpuConcentration - 1) / 4 * 0.5));
  const modelChainDepth = Math.min(1, ((inputs.multiAgent - 1) / 4 * 0.5 + (inputs.toolCallAuthority - 1) / 4 * 0.5));

  const score = Math.min(1, singlePointsOfFailure * 0.30 + sharedProviders * 0.25 + infraConcentration * 0.25 + modelChainDepth * 0.20);
  const exposure: DependencyExposure = score > 0.6 ? 'High' : score > 0.3 ? 'Medium' : 'Low';

  return { exposure, score, singlePointsOfFailure, sharedProviders, infraConcentration, modelChainDepth };
}

// ════════════════════════════════════════════════════════
// STRESS SCENARIOS
// ════════════════════════════════════════════════════════

function computeStressScenarios(inputs: ExposureInputs, currentResults: AnalysisResults): StressScenarioResult[] {
  const scenarios: StressScenarioResult[] = [];

  // 1. Model Drift Event
  const driftInputs = { ...inputs, modelDrift: 5, explainabilityGap: Math.min(5, inputs.explainabilityGap + 1) as 1|2|3|4|5 };
  const driftResults = computeFullAnalysis(driftInputs);
  const driftDelta = driftResults.afi - currentResults.afi;
  scenarios.push({
    name: 'Model Drift Event',
    impact: driftDelta > 0.5 ? 'Critical' : driftDelta > 0.2 ? 'Severe' : 'Contained',
    afiShocked: parseFloat(driftResults.afi.toFixed(2)),
    afiDelta: parseFloat(driftDelta.toFixed(2)),
    description: 'Underlying model behaviour degrades beyond validation boundaries',
  });

  // 2. Correlated Failure Event
  const corrInputs = { ...inputs, cloudConcentration: 5 as 1|2|3|4|5, modelConcentration: 5 as 1|2|3|4|5, crossVendorContagion: 5 as 1|2|3|4|5 };
  const corrResults = computeFullAnalysis(corrInputs);
  const corrDelta = corrResults.afi - currentResults.afi;
  scenarios.push({
    name: 'Correlated Failure Event',
    impact: corrDelta > 0.5 ? 'Critical' : corrDelta > 0.2 ? 'Severe' : 'Contained',
    afiShocked: parseFloat(corrResults.afi.toFixed(2)),
    afiDelta: parseFloat(corrDelta.toFixed(2)),
    description: 'Simultaneous failure across shared infrastructure dependencies',
  });

  // 3. Authority Shock Event
  const authInputs = { ...inputs, executionAuthority: 5 as 1|2|3|4|5, oversightLevel: 1 as 1|2|3|4|5, humanCheckpoints: 1 as 1|2|3|4|5 };
  const authResults = computeFullAnalysis(authInputs);
  const authDelta = authResults.afi - currentResults.afi;
  scenarios.push({
    name: 'Authority Shock Event',
    impact: authDelta > 0.5 ? 'Critical' : authDelta > 0.2 ? 'Severe' : 'Contained',
    afiShocked: parseFloat(authResults.afi.toFixed(2)),
    afiDelta: parseFloat(authDelta.toFixed(2)),
    description: 'Complete loss of human oversight and escalation of autonomous authority',
  });

  return scenarios;
}

// ════════════════════════════════════════════════════════
// DECISION EXPLAINABILITY
// ════════════════════════════════════════════════════════

function computeDecisionExplainability(
  coverageDecision: CoverageDecisionResult,
  insurabilityStatus: InsurabilityStatus,
  cascadeScore: number,
  correlationScore: number,
  exitRisk: ExitRiskAssessment,
  driftTrend: DriftTrend,
  currentAfi: number
): DecisionExplainability {
  const factors: { label: string; weight: number }[] = [];

  if (currentAfi > 1.35) factors.push({ label: 'AFI exceeds Fragile threshold', weight: 5 });
  else if (currentAfi > 0.85) factors.push({ label: 'AFI in Sensitive range', weight: 3 });
  if (cascadeScore > 0.6) factors.push({ label: 'high cascade amplification risk', weight: 4 });
  else if (cascadeScore > 0.3) factors.push({ label: 'moderate cascade propagation potential', weight: 2 });
  if (correlationScore > 0.65) factors.push({ label: 'systemic correlation exposure', weight: 4 });
  else if (correlationScore > 0.35) factors.push({ label: 'elevated correlation dependencies', weight: 2 });
  if (exitRisk.level === 'Structurally Locked-In') factors.push({ label: 'structural lock-in prevents exit', weight: 3 });
  if (driftTrend === 'Critical Acceleration') factors.push({ label: 'critical risk trajectory acceleration', weight: 4 });
  else if (driftTrend === 'Increasing Risk') factors.push({ label: 'increasing risk trajectory', weight: 2 });
  if (insurabilityStatus === 'Uninsurable') factors.push({ label: 'system exceeds insurability boundary', weight: 5 });
  else if (insurabilityStatus === 'Critical') factors.push({ label: 'insurability critically compromised', weight: 3 });

  if (factors.length === 0) factors.push({ label: 'risk within standard parameters', weight: 1 });

  factors.sort((a, b) => b.weight - a.weight);
  const primary = factors[0]?.label || 'standard risk profile';
  const secondary = factors[1]?.label || 'no secondary driver';
  const supporting = factors[2]?.label || 'no supporting factor';

  const decWord = coverageDecision.decision;
  // Always multi-factor reasoning — combine 2-3 drivers
  let narrative: string;
  if (factors.length >= 3) {
    narrative = `${decWord} due to combined effects of ${primary}, ${secondary}, and ${supporting}.`;
  } else if (factors.length === 2) {
    narrative = `${decWord} due to ${primary} combined with ${secondary}.`;
  } else {
    narrative = `${decWord} — ${primary}.`;
  }

  return { primaryDriver: primary, secondaryDriver: secondary, supportingFactor: supporting, narrative };
}

// ════════════════════════════════════════════════════════
// ECONOMIC LOSS TRANSLATION
// ════════════════════════════════════════════════════════

function computeEconomicLoss(
  inputs: ExposureInputs,
  currentAfi: number,
  cascadeScore: number,
  correlationScore: number,
  projections: DriftProjection[]
): EconomicLossEstimate {
  const sizeMul = ({ 'Startup (1–50)': 0.3, 'SME (50–250)': 0.6, 'Mid-Market (250–1000)': 1.0, 'Enterprise (1000–10000)': 2.0, 'Large Enterprise (10000+)': 4.0 } as Record<string, number>)[inputs.size] || 1.0;
  const sectorMul = ({ 'Financial Services': 1.5, 'Healthcare': 1.3, 'Insurance': 1.4, 'Legal': 1.2, 'Transportation': 1.4 } as Record<string, number>)[inputs.industry] || 1.0;

  const base = 2.8 * sizeMul * sectorMul; // €M anchor
  const afiMul = Math.max(0.3, currentAfi);
  const expectedLow = Math.round(base * afiMul * 0.3 * 10) / 10;
  const expectedHigh = Math.round(base * afiMul * 1.2 * 10) / 10;

  // Tail risk: incorporate future AFI
  const futureAfi = projections.length > 0 ? projections[projections.length - 1].afi : currentAfi;
  const tailRisk = Math.round(base * Math.max(afiMul, futureAfi) * 2.5 * 10) / 10;

  // Cascade tail: worst case under correlated failure
  const cascadeTailRisk = Math.round(tailRisk * (1 + cascadeScore * 0.5) * (1 + correlationScore * 0.4) * 10) / 10;

  return { expectedLow, expectedHigh, tailRisk, cascadeTailRisk };
}

// ════════════════════════════════════════════════════════
// TIME-TO-INSTABILITY
// ════════════════════════════════════════════════════════

function computeTimeToInstability(
  currentAfi: number,
  projections: DriftProjection[],
  cascadeScore: number
): TimeToInstability {
  // Find first projection crossing critical threshold
  const threshold = 1.35; // Fragile boundary
  if (currentAfi > threshold && cascadeScore > 0.5) return '< 3 months';

  for (const p of projections) {
    if (p.afi > threshold) {
      if (p.months <= 3) return '< 3 months';
      if (p.months <= 6) return '3–6 months';
      return '6–12 months';
    }
  }
  return '> 12 months';
}

// ════════════════════════════════════════════════════════
// HARD INSURABILITY BOUNDARY
// ════════════════════════════════════════════════════════

function applyHardInsurabilityBoundary(
  coverageDecision: CoverageDecisionResult,
  projections: DriftProjection[],
  correlationScore: number,
  cascadeScore: number
): CoverageDecisionResult {
  const proj12 = projections.find(p => p.months === 12);
  if (proj12 && proj12.afi > 2.0 && correlationScore > 0.5 && cascadeScore > 0.5) {
    return {
      decision: 'Decline',
      conditions: [
        { action: 'Hard boundary: projected AFI exceeds critical threshold under systemic conditions — no conditional coverage permitted', priority: 'required' },
        { action: 'Structural remediation and re-assessment required before coverage eligibility', priority: 'required' },
      ],
      maxTenor: null,
      sublimitRecommended: false,
    };
  }
  return coverageDecision;
}

// ════════════════════════════════════════════════════════
// UNIFIED RISK STATE
// ════════════════════════════════════════════════════════

function computeUnifiedRiskLevel(
  currentAfi: number,
  cascadeScore: number,
  correlationScore: number,
  driftTrend: DriftTrend,
  confidenceLevel: AssessmentConfidence
): UnifiedRiskLevel {
  // Priority: Cascade > Correlation > Future Risk > Current AFI > Confidence modifier
  // Score each dimension on 0-1
  const cascadeSig = cascadeScore; // already 0-1
  const corrSig = correlationScore; // already 0-1
  const futureSig = driftTrend === 'Critical Acceleration' ? 1.0 : driftTrend === 'Increasing Risk' ? 0.6 : 0.2;
  const currentSig = Math.min(1, currentAfi / 2.5);
  const confMod = confidenceLevel === 'Low' ? 0.15 : confidenceLevel === 'Medium' ? 0.05 : 0;

  // Weighted composite with priority ordering
  const composite = 
    cascadeSig * 0.30 +
    corrSig * 0.25 +
    futureSig * 0.20 +
    currentSig * 0.15 +
    confMod; // confidence adds uncertainty premium

  // Worst-case override: if any two top signals are extreme, force upgrade
  const extremeCount = [cascadeScore > 0.6, correlationScore > 0.6, driftTrend === 'Critical Acceleration', currentAfi > 1.5].filter(Boolean).length;

  if (composite > 0.7 || extremeCount >= 3) return 'Critical';
  if (composite > 0.5 || extremeCount >= 2) return 'High';
  if (composite > 0.3) return 'Moderate';
  return 'Low';
}

// ════════════════════════════════════════════════════════
// PRIMARY CAPITAL RISK DRIVER
// ════════════════════════════════════════════════════════

function computePrimaryCapitalRiskDriver(
  cascadeScore: number,
  correlationScore: number,
  currentAfi: number,
  exitRiskLevel: ExitRisk,
  dependencyScore: number
): PrimaryCapitalRiskDriver {
  const candidates: { driver: PrimaryCapitalRiskDriver; weight: number }[] = [
    { driver: 'Cascade Amplification', weight: cascadeScore * 1.2 }, // slight priority boost
    { driver: 'Systemic Correlation', weight: correlationScore * 1.1 },
    { driver: 'Structural Fragility', weight: Math.min(1, currentAfi / 2.0) },
    { driver: 'Loss of Reversibility', weight: exitRiskLevel === 'Structurally Locked-In' ? 0.85 : exitRiskLevel === 'Partially Reversible' ? 0.45 : 0.15 },
    { driver: 'Dependency Concentration', weight: dependencyScore },
  ];
  candidates.sort((a, b) => b.weight - a.weight);
  return candidates[0].driver;
}


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

  let coverageDecision = computeCoverageDecision(
    insurabilityStatus, driftTrend, cascadeAmplification.score, systemicDetail.score, agiProximity, inputs, projections
  );

  // ═══ INSTITUTIONAL TRUST LAYERS ═══
  const inputIntegrity = computeInputIntegrity(inputs);
  const confidence = computeConfidence(inputs, currentResults.afi, projections, inputIntegrity.score);
  const exitRisk = computeExitRisk(inputs, currentResults.components);
  const dependencyTopology = computeDependencyTopology(inputs);
  const stressScenarios = computeStressScenarios(inputs, currentResults);
  const economicLoss = computeEconomicLoss(inputs, currentResults.afi, cascadeAmplification.score, systemicDetail.score, projections);
  const timeToInstability = computeTimeToInstability(currentResults.afi, projections, cascadeAmplification.score);

  // Hard insurability boundary
  coverageDecision = applyHardInsurabilityBoundary(coverageDecision, projections, systemicDetail.score, cascadeAmplification.score);

  // Confidence impact: low confidence downgrades decision by 1 level
  if (confidence.level === 'Low' && coverageDecision.decision !== 'Decline') {
    if (coverageDecision.decision === 'Accept') {
      coverageDecision = { ...coverageDecision, decision: 'Accept with Conditions',
        conditions: [...coverageDecision.conditions, { action: 'Low assessment confidence — additional data verification required', priority: 'required' }] };
    } else if (coverageDecision.decision === 'Accept with Conditions') {
      coverageDecision = { ...coverageDecision, decision: 'Limited Coverage',
        conditions: [...coverageDecision.conditions, { action: 'Assessment confidence insufficient for full conditional coverage', priority: 'required' }] };
    } else if (coverageDecision.decision === 'Limited Coverage') {
      coverageDecision = { ...coverageDecision, decision: 'Decline',
        conditions: [...coverageDecision.conditions, { action: 'Low confidence combined with limited coverage triggers automatic decline', priority: 'required' }] };
    }
  }

  // Exit risk impact on insurability
  if (exitRisk.level === 'Structurally Locked-In' && coverageDecision.decision === 'Accept') {
    coverageDecision = { ...coverageDecision, decision: 'Accept with Conditions',
      conditions: [...coverageDecision.conditions, { action: 'Structural lock-in requires exit strategy and portability plan', priority: 'required' }] };
  }

  const { driftFactor, correlationMultiplier, cascadeMultiplier } =
    computePremiumMultipliers(projections, currentResults.afi, systemicDetail.score, cascadeAmplification.score);

  // Confidence and exit risk premium adjustments applied via multipliers
  const confidencePremiumMul = confidence.level === 'Low' ? 1.15 : confidence.level === 'Medium' ? 1.05 : 1.0;
  const exitRiskPremiumMul = exitRisk.level === 'Structurally Locked-In' ? 1.10 : exitRisk.level === 'Partially Reversible' ? 1.04 : 1.0;
  const adjustedDriftFactor = parseFloat((driftFactor * confidencePremiumMul * exitRiskPremiumMul).toFixed(3));

  const decisionExplainability = computeDecisionExplainability(
    coverageDecision, insurabilityStatus, cascadeAmplification.score, systemicDetail.score, exitRisk, driftTrend, currentResults.afi
  );

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
    driftFactor: adjustedDriftFactor,
    correlationMultiplier,
    cascadeMultiplier,
    confidence,
    inputIntegrity,
    exitRisk,
    dependencyTopology,
    stressScenarios,
    decisionExplainability,
    economicLoss,
    timeToInstability,
  };

  const unifiedRiskLevel = computeUnifiedRiskLevel(
    currentResults.afi, cascadeAmplification.score, systemicDetail.score, driftTrend, confidence.level
  );
  const primaryCapitalRiskDriver = computePrimaryCapitalRiskDriver(
    cascadeAmplification.score, systemicDetail.score, currentResults.afi, exitRisk.level, dependencyTopology.score
  );

  const executiveStatements = generateExecutiveStatements(partial as any);

  return { ...partial, unifiedRiskLevel, primaryCapitalRiskDriver, executiveStatements };
}
