/**
 * System Evolution Engine
 * Computes AGI Proximity Index, Drift Projections, Insurability Thresholds,
 * Systemic Correlation, and Cascade Risk.
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

export interface EvolutionAnalysis {
  // AGI Proximity Index
  agiProximity: number;
  agiTier: AGIProximityTier;
  // Drift Projections
  projections: DriftProjection[];
  driftTrend: DriftTrend;
  // Insurability
  insurabilityStatus: InsurabilityStatus;
  insurabilityScore: number; // 0-1, higher = more insurable
  monthsToUninsurable: number | null; // null = not projected
  // Systemic
  systemicCorrelation: SystemicCorrelation;
  systemicCorrelationScore: number;
  // Cascade
  cascadeRiskScore: number;
  // Executive statements
  executiveStatements: string[];
}

// ════════════════════════════════════════════════════════
// 2.1 AGI PROXIMITY INDEX
// ════════════════════════════════════════════════════════

function computeAGIProximity(inputs: ExposureInputs): { score: number; tier: AGIProximityTier } {
  // Autonomy Level: derive from automation + executionAuthority
  const autonomy = ((inputs.automation + inputs.executionAuthority) / 2 - 1) / 4;

  // Task Generality: derived from use cases + workflow breadth + system breadth
  const useCaseGenerality = Math.min(1, inputs.useCases.length / 8);
  const breadthFactor = (inputs.workflowBreadth - 1) / 4;
  const taskGenerality = (useCaseGenerality * 0.6 + breadthFactor * 0.4);

  // Self-Modification: derived from persistentMemory + modelDrift
  const selfMod = ((inputs.persistentMemory - 1) / 4 * 0.6 + (inputs.modelDrift - 1) / 4 * 0.4);

  // Decision Scope: derived from criticality + integrationDepth + actionDensity
  const decisionScope = ((inputs.criticality - 1) / 4 * 0.4 + (inputs.integrationDepth - 1) / 4 * 0.3 + (inputs.actionDensity - 1) / 4 * 0.3);

  // Weighted combination
  const score = Math.min(1, Math.max(0,
    autonomy * 0.35 +
    taskGenerality * 0.25 +
    selfMod * 0.20 +
    decisionScope * 0.20
  ));

  let tier: AGIProximityTier;
  if (score < 0.3) tier = 'Narrow System';
  else if (score < 0.6) tier = 'Advanced System';
  else if (score < 0.8) tier = 'AGI-like';
  else tier = 'Pre-ASI';

  return { score, tier };
}

// ════════════════════════════════════════════════════════
// 2.2 DRIFT PROJECTION ENGINE
// ════════════════════════════════════════════════════════

function projectDrift(inputs: ExposureInputs, months: number): DriftProjection {
  const components = computeAFIComponents(inputs);
  const t = months / 12; // normalized time factor

  // DR increases over time (delegation creep)
  const drDrift = components.dr + components.dr * 0.15 * t * (inputs.automation / 3);
  const dr = Math.min(1, drDrift);

  // JD decreases over time (oversight decay)
  const jdDecay = components.jd * (1 - 0.12 * t * (1 - inputs.reviewCadence / 5));
  const jd = Math.max(0.05, jdDecay);

  // RC increases non-linearly (lock-in deepens)
  const rcGrowth = components.rc + components.rc * 0.25 * Math.pow(t, 1.4) * (inputs.switchingCost / 3);
  const rc = Math.min(1, rcGrowth);

  // CD increases with agent count + dependencies
  const agentFactor = (inputs.multiAgent - 1) / 4;
  const couplingFactor = (inputs.integrationDepth - 1) / 4;
  const cdGrowth = components.cd + components.cd * 0.10 * t * (1 + agentFactor + couplingFactor);
  const cd = Math.min(1, cdGrowth);

  const na = components.na;

  const baseAfi = calcAFI(dr, jd, rc, cd, na);
  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
  const band = getBand(afi);

  const labels: Record<number, string> = { 3: '3 Months', 6: '6 Months', 12: '12 Months' };

  return {
    label: labels[months] || `${months}m`,
    months,
    afi,
    band,
    dr, jd, rc, cd,
  };
}

function computeDriftTrend(currentAfi: number, projections: DriftProjection[]): DriftTrend {
  if (projections.length === 0) return 'Stable';
  const afi12 = projections[projections.length - 1].afi;
  const delta = afi12 - currentAfi;
  const rate = delta / currentAfi;
  if (rate > 0.5) return 'Critical Acceleration';
  if (rate > 0.15) return 'Increasing Risk';
  return 'Stable';
}

// ════════════════════════════════════════════════════════
// 2.3 INSURABILITY THRESHOLD ENGINE
// ════════════════════════════════════════════════════════

function computeInsurability(
  currentAfi: number,
  components: AFIComponents,
  projections: DriftProjection[]
): { status: InsurabilityStatus; score: number; monthsToUninsurable: number | null } {
  const rc = components.rc;
  const jd = components.jd;
  const cd = components.cd;

  // Insurability score: lower is worse
  const afiPenalty = Math.min(1, currentAfi / 2.5);
  const rcPenalty = rc;
  const jdBonus = jd;
  const cdPenalty = cd;

  const score = Math.max(0, Math.min(1,
    1 - (afiPenalty * 0.35 + rcPenalty * 0.25 - jdBonus * 0.20 + cdPenalty * 0.20)
  ));

  // Determine status
  let status: InsurabilityStatus;
  if (currentAfi > 2.0 && rc > 0.7 && jd < 0.3 && cd > 0.6) {
    status = 'Uninsurable';
  } else if (currentAfi > 1.5 && rc > 0.6 && jd < 0.4) {
    status = 'Critical';
  } else if (currentAfi > 1.0 || (rc > 0.5 && jd < 0.5)) {
    status = 'At Risk';
  } else {
    status = 'Insurable';
  }

  // Estimate months to uninsurable based on projections
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

  return { status, score, monthsToUninsurable };
}

// ════════════════════════════════════════════════════════
// 2.4 SYSTEMIC CORRELATION INDEX
// ════════════════════════════════════════════════════════

function computeSystemicCorrelation(inputs: ExposureInputs): { level: SystemicCorrelation; score: number } {
  // Model dependency type: derive from providers
  const providerCount = inputs.providers.length;
  const hasInHouse = inputs.providers.includes('Custom / In-House');
  const modelDepScore = providerCount <= 1 ? 1.0 : providerCount <= 2 ? 0.7 : hasInHouse ? 0.3 : 0.5;

  // External coupling: derive from integrationDepth + crossVendorContagion
  const externalCoupling = ((inputs.integrationDepth - 1) / 4 * 0.5 + (inputs.crossVendorContagion - 1) / 4 * 0.5);

  // Architecture similarity: derive from concentration inputs
  const archSimilarity = ((inputs.cloudConcentration - 1) / 4 * 0.5 + (inputs.modelConcentration - 1) / 4 * 0.5);

  const score = Math.min(1, modelDepScore * 0.4 + externalCoupling * 0.35 + archSimilarity * 0.25);

  let level: SystemicCorrelation;
  if (score > 0.65) level = 'High';
  else if (score > 0.35) level = 'Medium';
  else level = 'Low';

  return { level, score };
}

// ════════════════════════════════════════════════════════
// 2.5 CASCADE RISK ESTIMATION
// ════════════════════════════════════════════════════════

function computeCascadeRisk(inputs: ExposureInputs): number {
  const agentFactor = (inputs.multiAgent - 1) / 4;
  const coupling = ((inputs.integrationDepth - 1) / 4 + (inputs.crossVendorContagion - 1) / 4) / 2;
  const modelDep = inputs.providers.length <= 1 ? 0.8 : inputs.providers.length <= 2 ? 0.5 : 0.3;

  const cascadeRisk = Math.min(1, Math.max(0,
    agentFactor * 0.30 + coupling * 0.40 + modelDep * 0.30
  ));

  return parseFloat(cascadeRisk.toFixed(2));
}

// ════════════════════════════════════════════════════════
// EXECUTIVE STATEMENTS GENERATOR
// ════════════════════════════════════════════════════════

function generateExecutiveStatements(
  analysis: Omit<EvolutionAnalysis, 'executiveStatements'>
): string[] {
  const stmts: string[] = [];

  // Drift statement
  if (analysis.driftTrend === 'Critical Acceleration') {
    stmts.push('Risk trajectory shows critical acceleration — structural intervention required immediately.');
  } else if (analysis.driftTrend === 'Increasing Risk') {
    stmts.push('This system shows increasing structural dependency and reduced reversibility.');
  }

  // Insurability statement
  if (analysis.insurabilityStatus === 'Uninsurable') {
    stmts.push('System has crossed the structural insurability threshold — standard coverage cannot be justified.');
  } else if (analysis.monthsToUninsurable !== null && analysis.monthsToUninsurable <= 12) {
    stmts.push(`Projected risk indicates potential loss of insurability within ${analysis.monthsToUninsurable} months.`);
  } else if (analysis.insurabilityStatus === 'Critical') {
    stmts.push('Insurability is critically compromised — immediate governance restructuring required for coverage continuation.');
  }

  // Systemic statement
  if (analysis.systemicCorrelation === 'High') {
    stmts.push('High correlation exposure suggests systemic portfolio risk.');
  }

  // Cascade statement
  if (analysis.cascadeRiskScore > 0.6) {
    stmts.push('Cascade failure probability is elevated — simultaneous multi-system failure cannot be excluded.');
  }

  // AGI proximity
  if (analysis.agiTier === 'AGI-like' || analysis.agiTier === 'Pre-ASI') {
    stmts.push(`System classification (${analysis.agiTier}) indicates capabilities beyond narrow AI — governance frameworks may be insufficient.`);
  }

  if (stmts.length === 0) {
    stmts.push('System risk profile is within standard parameters. Maintain monitoring cadence.');
  }

  return stmts;
}

// ════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════

export function computeEvolutionAnalysis(inputs: ExposureInputs, currentResults: AnalysisResults): EvolutionAnalysis {
  const { score: agiProximity, tier: agiTier } = computeAGIProximity(inputs);

  const projections = [3, 6, 12].map(m => projectDrift(inputs, m));
  const driftTrend = computeDriftTrend(currentResults.afi, projections);

  const { status: insurabilityStatus, score: insurabilityScore, monthsToUninsurable } =
    computeInsurability(currentResults.afi, currentResults.components, projections);

  const { level: systemicCorrelation, score: systemicCorrelationScore } =
    computeSystemicCorrelation(inputs);

  const cascadeRiskScore = computeCascadeRisk(inputs);

  const partial = {
    agiProximity,
    agiTier,
    projections,
    driftTrend,
    insurabilityStatus,
    insurabilityScore,
    monthsToUninsurable,
    systemicCorrelation,
    systemicCorrelationScore,
    cascadeRiskScore,
  };

  const executiveStatements = generateExecutiveStatements(partial as any);

  return { ...partial, executiveStatements };
}
