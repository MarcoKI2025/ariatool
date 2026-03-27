/**
 * Portfolio Impact Analyzer
 * Calculates the marginal impact of individual insureds on portfolio
 * correlation and tail risk.
 *
 * All monetary outputs are heuristic estimates for demonstration purposes.
 */

import { ExposureInputs } from './types';
import { calcAFI, computeAFIComponents } from './scoring';
import { SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT } from './constants';

export interface PortfolioEntity {
  id: string;
  name: string;
  inputs: ExposureInputs;
  weight: number;
  afi?: number;
  band?: string;
}

export interface PortfolioImpactResult {
  currentCorrelation: number;
  withoutEntityCorrelation: number;
  correlationDelta: number;
  currentTailRisk: number;
  withoutEntityTailRisk: number;
  tailRiskDelta: number;
  recommendation: 'Critical' | 'High' | 'Medium' | 'Low';
  reasoning: string[];
}

// ────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ────────────────────────────────────────────────────────────────────────────

/** Ensure every entity has an AFI value computed */
function ensureAFI(entities: PortfolioEntity[]): (PortfolioEntity & { afi: number })[] {
  return entities.map(e => {
    if (e.afi !== undefined) return e as PortfolioEntity & { afi: number };
    const components = computeAFIComponents(e.inputs);
    const baseAfi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
    const sizeAdj = SIZE_AFI_ADJUSTMENT[e.inputs.size] || 0;
    const revAdj = REVENUE_AFI_ADJUSTMENT[e.inputs.revenue] || 0;
    const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
    return { ...e, afi };
  });
}

/**
 * Portfolio correlation heuristic.
 *
 * Driven by:
 *  - concentration of providers (cloudConcentration, modelConcentration)
 *  - autonomy level (automation, executionAuthority)
 *  - high-risk entity count (AFI > 1.35)
 */
function calculatePortfolioCorrelation(entities: (PortfolioEntity & { afi: number })[]): number {
  if (entities.length === 0) return 0;

  const totalWeight = entities.reduce((s, e) => s + e.weight, 0);

  // Weight of entities with high concentration AND meaningful automation
  const concentratedWeight = entities
    .filter(e => {
      const cc = e.inputs.cloudConcentration;
      const mc = e.inputs.modelConcentration;
      const auto = e.inputs.automation;
      return (cc + mc) / 2 >= 3.5 && auto >= 3;
    })
    .reduce((s, e) => s + e.weight, 0);

  const baseCorrelation = totalWeight > 0 ? (concentratedWeight / totalWeight) * 0.55 : 0;

  // High-risk adjustment
  const highRiskCount = entities.filter(e => e.afi > 1.35).length;
  const highRiskAdj = entities.length > 0 ? (highRiskCount / entities.length) * 0.20 : 0;

  // Autonomy-weighted boost
  const avgAutonomy = entities.reduce((s, e) => s + e.inputs.automation, 0) / entities.length;
  const autonomyAdj = Math.max(0, (avgAutonomy - 2.5) / 5) * 0.10;

  return Math.min(0.95, baseCorrelation + highRiskAdj + autonomyAdj);
}

/**
 * Portfolio tail risk estimate (1-in-20 year scenario).
 * Heuristic: weighted AFI × base multiplier × correlation amplifier.
 */
function calculatePortfolioTailRisk(
  entities: (PortfolioEntity & { afi: number })[],
  correlation: number,
): number {
  if (entities.length === 0) return 0;
  const totalWeight = entities.reduce((s, e) => s + e.weight, 0);
  const weightedAFI = entities.reduce((s, e) => s + e.afi * e.weight, 0) / totalWeight;

  const baseMultiplier = 15; // €M per AFI point
  const correlationAmplifier = 1 + correlation * 1.5;

  return weightedAFI * baseMultiplier * correlationAmplifier;
}

// ────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────

/**
 * Analyse the marginal impact of removing a specific entity from the portfolio.
 */
export function analyzePortfolioImpact(
  allEntities: PortfolioEntity[],
  targetEntityId: string,
): PortfolioImpactResult {
  const withAFI = ensureAFI(allEntities);

  const currentCorrelation = calculatePortfolioCorrelation(withAFI);
  const currentTailRisk = calculatePortfolioTailRisk(withAFI, currentCorrelation);

  const remaining = withAFI.filter(e => e.id !== targetEntityId);
  const withoutEntityCorrelation = calculatePortfolioCorrelation(remaining);
  const withoutEntityTailRisk = calculatePortfolioTailRisk(remaining, withoutEntityCorrelation);

  const correlationDelta = currentCorrelation - withoutEntityCorrelation;
  const tailRiskDelta = currentTailRisk - withoutEntityTailRisk;

  // Recommendation
  let recommendation: PortfolioImpactResult['recommendation'];
  const reasoning: string[] = [];

  if (correlationDelta > 0.15) {
    recommendation = 'Critical';
    reasoning.push(`Removing this entity reduces portfolio correlation by ${(correlationDelta * 100).toFixed(1)}% — a material improvement.`);
  } else if (correlationDelta > 0.08) {
    recommendation = 'High';
    reasoning.push(`Correlation reduction of ${(correlationDelta * 100).toFixed(1)}% is significant.`);
  } else if (correlationDelta > 0.03) {
    recommendation = 'Medium';
    reasoning.push(`Modest correlation reduction of ${(correlationDelta * 100).toFixed(1)}%.`);
  } else {
    recommendation = 'Low';
    reasoning.push(`Minimal correlation impact (${(correlationDelta * 100).toFixed(1)}%).`);
  }

  if (tailRiskDelta > 10) {
    reasoning.push(`Tail risk reduced by €${tailRiskDelta.toFixed(1)}M — exceeds typical premium for this risk class.`);
  } else if (tailRiskDelta > 5) {
    reasoning.push(`Tail risk reduced by €${tailRiskDelta.toFixed(1)}M.`);
  }

  const target = withAFI.find(e => e.id === targetEntityId);
  if (target && target.afi > 1.35) {
    reasoning.push(`Target entity AFI of ${target.afi.toFixed(2)} exceeds standard underwriting threshold.`);
  }

  return {
    currentCorrelation,
    withoutEntityCorrelation,
    correlationDelta,
    currentTailRisk,
    withoutEntityTailRisk,
    tailRiskDelta,
    recommendation,
    reasoning,
  };
}

/**
 * Rank all entities by their marginal tail-risk contribution (descending).
 */
export function identifyTopRiskContributors(
  entities: PortfolioEntity[],
): Array<{ entity: PortfolioEntity; impact: PortfolioImpactResult }> {
  return entities
    .map(entity => ({ entity, impact: analyzePortfolioImpact(entities, entity.id) }))
    .sort((a, b) => b.impact.tailRiskDelta - a.impact.tailRiskDelta);
}
