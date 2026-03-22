import { Band, DecisionClass, AFIComponents, AnalysisResults, ExposureInputs } from './types';
import { AFI_STABLE_MAX, AFI_SENSITIVE_MAX, ANCHOR_LOSS, SECTOR_MULTIPLIERS } from './constants';

export function calcAFI(dr: number, jd: number, rc: number, cd: number, na: number): number {
  return (dr * rc * cd) / (jd * na + 0.001);
}

export function getBand(afi: number): Band {
  if (afi < AFI_STABLE_MAX) return 'Stable';
  if (afi < AFI_SENSITIVE_MAX) return 'Sensitive';
  return 'Fragile';
}

export function getDecisionClass(band: Band): DecisionClass {
  switch (band) {
    case 'Fragile': return 'Escalate to Committee';
    case 'Sensitive': return 'Conditional Review';
    case 'Stable': return 'Approved';
  }
}

export function getBandColor(band: Band): string {
  switch (band) {
    case 'Fragile': return 'hsl(var(--fragile))';
    case 'Sensitive': return 'hsl(var(--sensitive))';
    case 'Stable': return 'hsl(var(--stable))';
  }
}

export function getBandClass(band: Band): string {
  return band.toLowerCase();
}

export function computeAFIComponents(inputs: ExposureInputs): AFIComponents {
  const { automation, executionAuthority, oversightLevel, reviewCadence,
    sunsetPolicy, switchingCost, portability, integrationDepth, actionDensity,
    workflowBreadth, toolCallScope, multiAgent, humanCheckpoints, persistentMemory } = inputs;

  const agentDrFactor = 1 + (multiAgent - 1) * 0.12 - (humanCheckpoints - 1) * 0.06;
  const dr = Math.min(1, (((automation + executionAuthority) / 2) / 5) * agentDrFactor);
  const jd = ((oversightLevel + reviewCadence) / 2) / 5;
  const sunAdj = switchingCost * (1 + (5 - sunsetPolicy) * 0.08);
  const pmemAdj = persistentMemory * 0.15;
  const rc = Math.min(1, ((sunAdj + portability) / 2) / 5 + pmemAdj / 5);
  const cd = Math.min(1, ((integrationDepth + actionDensity + workflowBreadth * 0.3 + toolCallScope * 0.2 + inputs.toolCallAuthority * 0.25) / 2.75) / 5);
  const na = 0.5;

  return { dr, jd, rc, cd, na };
}

function computeALRI(inputs: ExposureInputs): number {
  const { hallucinationLiability, deepfakeFraud, promptInjection, modelDrift,
    algorithmicBias, shadowAI, explainabilityGap, dataIntegrity, esgLiability } = inputs;
  // Weights match HTML exactly: hallu 20, dpfk 16, pinj 14, mdrift 16, abias 12, shdw 7, xai 5, dint 6, esg 4
  const alri = Math.min(100,
    ((hallucinationLiability - 1) / 4) * 20 +
    ((deepfakeFraud - 1) / 4) * 16 +
    ((promptInjection - 1) / 4) * 14 +
    ((modelDrift - 1) / 4) * 16 +
    ((algorithmicBias - 1) / 4) * 12 +
    ((shadowAI - 1) / 4) * 7 +
    ((explainabilityGap - 1) / 4) * 5 +
    ((dataIntegrity - 1) / 4) * 6 +
    ((esgLiability - 1) / 4) * 4
  );
  return Math.round(alri);
}

function computeSCRI(inputs: ExposureInputs): number {
  const { cloudConcentration, modelConcentration, gpuConcentration, crossVendorContagion } = inputs;
  // SCRI is inverse: low diversity = high systemic risk. Weights: cloud 30, model 25, gpu 25, xcon 20
  const scri = Math.round(Math.min(100,
    ((5 - cloudConcentration) / 4) * 30 +
    ((5 - modelConcentration) / 4) * 25 +
    ((5 - gpuConcentration) / 4) * 25 +
    ((5 - crossVendorContagion) / 4) * 20
  ));
  return scri;
}

function computeCompositeRiskIndex(afi: number, alri: number, agri: number): number {
  const afiNorm = Math.min(100, Math.round((afi / 3.0) * 100));
  const composite = Math.round(afiNorm * 0.50 + alri * 0.30 + agri * 0.20);
  return Math.min(100, composite);
}

export function computeFullAnalysis(inputs: ExposureInputs): AnalysisResults {
  const components = computeAFIComponents(inputs);
  const { dr, jd, rc, cd, na } = components;
  const afi = calcAFI(dr, jd, rc, cd, na);
  const band = getBand(afi);
  const structuralScore = Math.min(99, Math.round(afi * 60));
  const ses = (dr + rc + cd) / 3;

  const govPremium = 1 + Math.min(0.8, afi * 0.45);
  const sectorMult = SECTOR_MULTIPLIERS[inputs.industry] || 1.0;

  const expected = parseFloat((ANCHOR_LOSS * afi * govPremium * sectorMult).toFixed(1));
  const stress = parseFloat((expected * 3.4).toFixed(1));
  const tail = parseFloat((expected * 10.8).toFixed(1));
  const portfolio = Math.round(tail * 6.2);

  const cf = Math.min(0.99, (cd * 0.75 + afi * 0.08));
  const ampLo = Math.max(1.8, 1 + afi * 0.9);
  const ampHi = Math.min(5.6, 1 + afi * 2.1 + cd * 0.8);

  const eciTier = afi < 0.5 ? 0 : afi < 0.85 ? 1 : afi < 1.35 ? 2 : 3;
  const eciNames: Record<number, string> = {
    0: 'Reversible Tool',
    1: 'Persistent Service',
    2: 'Institutional Dependency',
    3: 'Critical Infrastructure',
  };

  // AGRI
  const agri = Math.round(Math.min(100,
    (inputs.multiAgent / 5 * 35) + (inputs.toolCallAuthority / 5 * 30) +
    (inputs.persistentMemory / 5 * 20) + ((6 - inputs.humanCheckpoints) / 5 * 15)
  ));

  // ALRI
  const alri = computeALRI(inputs);

  // SCRI
  const scri = computeSCRI(inputs);

  // Composite Risk Index
  const compositeRiskIndex = computeCompositeRiskIndex(afi, alri, agri);

  // Premium estimate
  const basePrem = 180 * sectorMult;
  const autoMult = [0, 0.5, 0.75, 1.0, 1.5, 2.2][inputs.automation] || 1;
  const critMult = [0, 0.5, 0.7, 1.0, 1.4, 2.0][inputs.criticality] || 1;
  const depMult = inputs.providers.length <= 1 ? 1.8 : inputs.providers.length <= 2 ? 1.3 : 1.0;
  const alriLoading = 1 + (alri / 100) * 0.4;
  const rawPrem = basePrem * autoMult * critMult * depMult * govPremium * alriLoading;
  const ovstReduction = [0, 0, 0.05, 0.12, 0.22, 0.35][inputs.oversightLevel] || 0;
  const midPrem = rawPrem * (1 - ovstReduction);
  const bandPct = inputs.automation >= 4 ? 0.20 : inputs.automation >= 3 ? 0.25 : 0.30;

  return {
    afi,
    band,
    structuralScore,
    ses,
    components,
    decisionClass: getDecisionClass(band),
    lossEnvelope: { expected, stress, tail, portfolio },
    amplificationFactor: `${ampLo.toFixed(1)}× – ${ampHi.toFixed(1)}×`,
    correlationFactor: parseFloat(cf.toFixed(2)),
    eciTier,
    eciName: eciNames[eciTier],
    agri,
    alri,
    scri,
    compositeRiskIndex,
    premium: {
      lo: Math.round(midPrem * (1 - bandPct) / 10) * 10,
      mid: Math.round(midPrem / 10) * 10,
      hi: Math.round(midPrem * (1 + bandPct) / 10) * 10,
    },
  };
}

export function computeLivePreview(inputs: ExposureInputs) {
  const components = computeAFIComponents(inputs);
  const afi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
  const band = getBand(afi);
  const score = Math.min(99, Math.round(afi * 60));

  const signals: { text: string; color: string }[] = [];
  if (inputs.automation >= 4) signals.push({ text: 'High automation level — limited human intervention points', color: 'fragile' });
  if (inputs.executionAuthority >= 4) signals.push({ text: 'Elevated execution authority — autonomous decision scope', color: 'fragile' });
  if (inputs.oversightLevel <= 2) signals.push({ text: 'Low oversight density — governance gaps accumulating', color: 'sensitive' });
  if (inputs.providers.length <= 1) signals.push({ text: 'Single provider dependency — concentration risk', color: 'fragile' });
  if (inputs.switchingCost >= 4) signals.push({ text: 'High switching cost — structural lock-in', color: 'sensitive' });
  if (inputs.integrationDepth >= 4) signals.push({ text: 'Deep integration — exit complexity elevated', color: 'sensitive' });
  if (inputs.hallucinationLiability >= 3) signals.push({ text: 'Hallucination liability exposure — unverified AI outputs', color: 'fragile' });
  if (inputs.shadowAI >= 3) signals.push({ text: 'Shadow AI risk — uncontrolled AI deployments', color: 'sensitive' });
  if (signals.length === 0) signals.push({ text: 'Governance signals within normal range', color: 'stable' });

  return { afi, band, score, signals, components };
}
