import { Band, DecisionClass, AFIComponents, AnalysisResults, ExposureInputs, FrameDriftAlert } from './types';
import { AFI_STABLE_MAX, AFI_SENSITIVE_MAX, SECTOR_MULTIPLIERS, SIZE_MULTIPLIERS, REVENUE_MULTIPLIERS, SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT, DEFAULT_ELASTICITIES } from './constants';

export function calcAFI(
  dr: number, jd: number, rc: number, cd: number, na: number,
  elasticities?: { w_DR: number; w_JD: number; w_RC: number; w_CD: number; w_NA: number }
): number {
  const w = elasticities || DEFAULT_ELASTICITIES;
  const dr_w = Math.pow(dr, w.w_DR);
  const jd_w = Math.pow(jd, w.w_JD);
  const rc_w = Math.pow(rc, w.w_RC);
  const cd_w = Math.pow(cd, w.w_CD);
  const na_w = Math.pow(na, w.w_NA);
  return (dr_w * rc_w * cd_w) / (jd_w * na_w + 0.001);
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

/** Qualitative exposure band label based on AFI */
export function getExposureBand(afi: number): { label: string; level: 'base' | 'elevated' | 'critical' | 'systemic' } {
  if (afi < 0.5) return { label: 'Base Exposure', level: 'base' };
  if (afi < 0.85) return { label: 'Elevated Exposure', level: 'elevated' };
  if (afi < 1.35) return { label: 'Critical Exposure', level: 'critical' };
  return { label: 'Systemic Exposure', level: 'systemic' };
}

export function computeAFIComponents(inputs: ExposureInputs): AFIComponents {
  const { automation, executionAuthority, oversightLevel, reviewCadence,
    sunsetPolicy, switchingCost, portability, integrationDepth, actionDensity,
    workflowBreadth, toolCallScope, multiAgent, humanCheckpoints, persistentMemory,
    cloudConcentration, modelConcentration, gpuConcentration, crossVendorContagion,
    useCases, providers } = inputs;

  const useCaseFactor = 1 + Math.max(0, (useCases.length - 1)) * 0.03;
  const hasAutonomousOps = useCases.includes('Autonomous Operations');
  const hasRiskAssessment = useCases.includes('Risk Assessment');
  const hasFraudDetection = useCases.includes('Fraud Detection');
  const highRiskUseCaseBoost = (hasAutonomousOps ? 0.08 : 0) + (hasRiskAssessment ? 0.04 : 0) + (hasFraudDetection ? 0.04 : 0);

  const agentDrFactor = 1 + (multiAgent - 1) * 0.12 - (humanCheckpoints - 1) * 0.06;
  const dr = Math.min(1, (((automation + executionAuthority) / 2) / 5) * agentDrFactor * useCaseFactor + highRiskUseCaseBoost);

  const jd = ((oversightLevel + reviewCadence) / 2) / 5;

  const providerConcentration = providers.length <= 1 ? 0.12 : providers.length <= 2 ? 0.06 : providers.length >= 5 ? -0.04 : 0;

  const sunAdj = switchingCost * (1 + (5 - sunsetPolicy) * 0.08);
  const pmemAdj = persistentMemory * 0.15;
  const concScore = ((cloudConcentration + modelConcentration + gpuConcentration + crossVendorContagion) / 4 - 1) / 4;
  const concRcAdd = (1 - concScore) * 0.20;
  const rc = Math.min(1, ((sunAdj + portability) / 2) / 5 + pmemAdj / 5 + concRcAdd + providerConcentration);

  const useCaseCdBoost = Math.max(0, (useCases.length - 2)) * 0.02;
  const cd = Math.min(1, ((integrationDepth + actionDensity + workflowBreadth * 0.3 + toolCallScope * 0.2 + inputs.toolCallAuthority * 0.25) / 2.75) / 5 + useCaseCdBoost);
  const na = 0.5;

  return { dr, jd, rc, cd, na };
}

function computeALRI(inputs: ExposureInputs): number {
  const { hallucinationLiability, deepfakeFraud, promptInjection, modelDrift,
    algorithmicBias, shadowAI, explainabilityGap, dataIntegrity, esgLiability } = inputs;
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

function computeMDR(inputs: ExposureInputs): { mdr: number; mdrTier: string; mdrLabel: string } {
  const auto = inputs.automation / 5;
  const dens = inputs.actionDensity / 5;
  const ovst = inputs.oversightLevel / 5;
  const rev = inputs.reviewCadence / 5;
  const exec = inputs.executionAuthority / 5;
  const intg = inputs.integrationDepth / 5;
  const swit = inputs.switchingCost / 5;
  const durationProxy = Math.min(1, (swit + intg) / 2);

  const optPressure = (auto + dens + exec) / 3;
  const consequenceInsul = 1 - ((ovst + rev) / 2);
  const temporalExtension = (durationProxy + auto) / 2;

  const mdr = Math.pow(optPressure * consequenceInsul * temporalExtension, 1 / 3);
  const mdrPct = Math.round(mdr * 100);

  let tier: string, label: string;
  if (mdr < 0.35) { tier = 'low'; label = 'Low Drift Risk'; }
  else if (mdr < 0.55) { tier = 'moderate'; label = 'Moderate Drift Risk'; }
  else if (mdr < 0.75) { tier = 'high'; label = '⚠ High Drift Risk'; }
  else { tier = 'critical'; label = '⚠ Critical — Semantic Stability Compromised'; }

  return { mdr: mdrPct, mdrTier: tier, mdrLabel: label };
}

function computeRFSI(components: AFIComponents, mdrNorm: number, iatState1: boolean): { rfsi: number; rfsiTier: 'stable' | 'conditional' | 'limited'; rfsiLabel: string; rfsiDrivers: { contextVariability: number; semanticDriftRisk: number; evaluationMismatch: number; temporalInstability: number } } {
  const { dr, jd, rc, cd } = components;
  const contextVariability = Math.min(1, (cd + (1 - jd)) / 2);
  const semanticDriftRisk = mdrNorm;
  const evaluationMismatch = Math.min(1, (1 - jd) * 0.8 + dr * 0.2);
  const temporalInstability = Math.min(1, (rc * 0.6 + (iatState1 ? 0.4 : 0.1)));

  const instability = Math.pow(contextVariability * semanticDriftRisk * evaluationMismatch * temporalInstability, 0.25);
  const rfsiRaw = Math.round((1 - instability) * 100);
  const rfsi = Math.max(5, Math.min(99, rfsiRaw));

  const tier = rfsi >= 70 ? 'stable' as const : rfsi >= 45 ? 'conditional' as const : 'limited' as const;
  const labels = { stable: 'Stable Frame', conditional: 'Conditional Frame', limited: 'Limited Frame' };
  return { rfsi, rfsiTier: tier, rfsiLabel: labels[tier], rfsiDrivers: { contextVariability, semanticDriftRisk, evaluationMismatch, temporalInstability } };
}

function computeFrameDriftAlerts(components: AFIComponents, band: Band, inputs: ExposureInputs): FrameDriftAlert[] {
  const { dr, jd, cd } = components;
  const auto = inputs.automation / 5;
  const ovst = inputs.oversightLevel / 5;
  const intg = inputs.integrationDepth / 5;
  const rc = components.rc;

  const alerts: FrameDriftAlert[] = [];

  if (jd < 0.5 && dr > 0.5) {
    alerts.push({ sev: 'critical', title: 'Training–Deployment Context Mismatch', explanation: 'High delegation density combined with low justificatory density creates a gap between the conditions under which this system was aligned and the conditions under which it now operates.', mitigation: 'Increase justificatory density through structured audit logs. Reduce autonomous execution scope until evaluation coverage matches deployment breadth.' });
  }
  if (intg > 0.6 && cd > 0.5) {
    alerts.push({ sev: 'critical', title: 'Context Expansion Risk', explanation: 'High integration depth combined with elevated correlation density indicates the system has expanded beyond its original operational scope.', mitigation: 'Document original deployment scope and compare to current operational footprint. Any expansion beyond original scope requires formal re-authorisation.' });
  }
  if (band === 'Fragile' && ovst < 0.4) {
    alerts.push({ sev: 'high', title: 'Normative Instability Signal', explanation: 'Fragile classification combined with low human oversight creates conditions for normative drift — the gradual erosion of standards the system was designed to uphold.', mitigation: 'Mandate mandatory human review for all high-stakes decisions. Establish explicit normative boundary conditions.' });
  }
  if (rc > 0.65) {
    alerts.push({ sev: jd < 0.45 ? 'high' : 'moderate', title: 'Evaluation Decay — Long-Horizon Operation', explanation: 'This system has been operational long enough for evaluation decay to occur. Prior assessments reflect the system\'s state at a specific moment — not its current interpretive frame.', mitigation: 'Schedule a full structural re-assessment. Treat evaluation decay as a first-class governance risk.' });
  }
  if (auto > 0.6 && ovst < 0.45) {
    alerts.push({ sev: 'moderate', title: 'Semantic Boundary Erosion', explanation: 'High automation level with low oversight creates structural conditions for semantic boundary erosion — the gradual expansion of what the system treats as within scope for autonomous action.', mitigation: 'Implement explicit scope boundaries that require human override to cross. Monitor for unauthorized scope creep.' });
  }

  const sevOrder = { critical: 0, high: 1, moderate: 2 };
  alerts.sort((a, b) => sevOrder[a.sev] - sevOrder[b.sev]);
  return alerts;
}

export function computeFullAnalysis(inputs: ExposureInputs): AnalysisResults {
  const components = computeAFIComponents(inputs);
  const { dr, jd, rc, cd, na } = components;
  const baseAfi = calcAFI(dr, jd, rc, cd, na);

  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);

  const band = getBand(afi);
  const structuralScore = Math.min(99, Math.round(afi * 60));
  const ses = (dr + rc + cd) / 3;

  // Qualitative exposure bands (no fabricated €-amounts)
  const exposureBand = getExposureBand(afi);

  // Correlation factor (qualitative, no amplification multipliers)
  const cf = Math.min(0.99, (cd * 0.75 + afi * 0.08));

  // ECI
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

  const alri = computeALRI(inputs);
  const scri = computeSCRI(inputs);
  const compositeRiskIndex = computeCompositeRiskIndex(afi, alri, agri);
  const { mdr, mdrTier, mdrLabel } = computeMDR(inputs);
  const mdrNorm = mdr / 100;
  const { rfsi, rfsiTier, rfsiLabel, rfsiDrivers } = computeRFSI(components, mdrNorm, false);
  const frameDriftAlerts = computeFrameDriftAlerts(components, band, inputs);

  return {
    afi,
    band,
    structuralScore,
    ses,
    components,
    decisionClass: getDecisionClass(band),
    // Qualitative loss envelope bands
    lossEnvelope: {
      expected: exposureBand.label,
      stress: afi < 0.85 ? 'Elevated Exposure' : 'Critical Exposure',
      tail: afi < 1.35 ? 'Critical Exposure' : 'Systemic Exposure',
      portfolio: 'Systemic Exposure',
    },
    // Qualitative amplification description
    amplificationFactor: 'Significant non-linear amplification — not fully captured in traditional models',
    correlationFactor: parseFloat(cf.toFixed(2)),
    eciTier,
    eciName: eciNames[eciTier],
    agri,
    alri,
    scri,
    compositeRiskIndex,
    // Qualitative premium band
    premium: {
      band: band === 'Fragile' ? 'Critical' : band === 'Sensitive' ? 'Elevated' : 'Base',
      label: band === 'Fragile' ? 'Erhöhte finanzielle Exposure — Band: Critical' : band === 'Sensitive' ? 'Erhöhte finanzielle Exposure — Band: Elevated' : 'Standard Exposure — Band: Base',
    },
    mdr,
    mdrTier,
    mdrLabel,
    rfsi,
    rfsiTier,
    rfsiLabel,
    rfsiDrivers,
    frameDriftAlerts,
  };
}

export function computeLivePreview(inputs: ExposureInputs) {
  const components = computeAFIComponents(inputs);
  const baseAfi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
  const band = getBand(afi);
  const score = Math.min(99, Math.round(afi * 60));

  const signals: { text: string; color: string }[] = [];
  if (inputs.automation >= 4) signals.push({ text: 'High automation level — limited human intervention points', color: 'fragile' });
  if (inputs.executionAuthority >= 4) signals.push({ text: 'Elevated execution authority — autonomous decision scope', color: 'fragile' });
  if (inputs.oversightLevel <= 2) signals.push({ text: 'Low oversight density — governance gaps accumulating', color: 'sensitive' });
  if (inputs.switchingCost >= 4) signals.push({ text: 'High switching cost — structural lock-in', color: 'sensitive' });
  if (inputs.integrationDepth >= 4) signals.push({ text: 'Deep integration — exit complexity elevated', color: 'sensitive' });
  if (inputs.hallucinationLiability >= 3) signals.push({ text: 'Hallucination liability exposure — unverified AI outputs', color: 'fragile' });
  if (inputs.shadowAI >= 3) signals.push({ text: 'Shadow AI risk — uncontrolled AI deployments', color: 'sensitive' });
  if (inputs.useCases.includes('Autonomous Operations')) signals.push({ text: 'Autonomous operations selected — elevated delegation risk', color: 'fragile' });
  if (inputs.useCases.includes('Risk Assessment')) signals.push({ text: 'Risk assessment use case — high-stakes decision delegation', color: 'sensitive' });
  if (inputs.useCases.includes('Fraud Detection')) signals.push({ text: 'Fraud detection — false positive/negative liability exposure', color: 'sensitive' });
  if (inputs.useCases.includes('Compliance Monitoring')) signals.push({ text: 'Compliance monitoring — regulatory reliance on AI outputs', color: 'sensitive' });
  if (inputs.useCases.includes('Code Generation')) signals.push({ text: 'Code generation — IP and supply chain integrity risk', color: 'sensitive' });
  if (inputs.useCases.length >= 7) signals.push({ text: 'Extensive AI portfolio — systemic integration risk elevated', color: 'fragile' });
  else if (inputs.useCases.length >= 5) signals.push({ text: `${inputs.useCases.length} AI use cases — broad attack surface and operational footprint`, color: 'sensitive' });
  if (inputs.providers.length <= 1) signals.push({ text: 'Single provider dependency — concentration risk', color: 'fragile' });
  else if (inputs.providers.length === 2) signals.push({ text: 'Limited provider diversity — moderate concentration risk', color: 'sensitive' });
  else if (inputs.providers.length >= 6) signals.push({ text: 'Broad provider portfolio — strong diversification but integration complexity', color: 'stable' });
  else if (inputs.providers.length >= 4) signals.push({ text: 'Multi-provider diversification — reduced concentration', color: 'stable' });
  if (['Enterprise (1000–10000)', 'Large Enterprise (10000+)'].includes(inputs.size)) signals.push({ text: 'Large organisation — elevated systemic exposure and regulatory scrutiny', color: 'sensitive' });
  if (['€500M–€5B', 'Over €5B'].includes(inputs.revenue)) signals.push({ text: 'High revenue — amplified absolute loss exposure', color: 'sensitive' });
  if (signals.length === 0) signals.push({ text: 'Governance signals within normal range', color: 'stable' });

  return { afi, band, score, signals, components };
}
