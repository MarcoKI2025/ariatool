import { Band, DecisionClass, AFIComponents, AnalysisResults, ExposureInputs, FrameDriftAlert } from './types';
import { AFI_STABLE_MAX, AFI_SENSITIVE_MAX, ANCHOR_LOSS, SECTOR_MULTIPLIERS, SIZE_MULTIPLIERS, REVENUE_MULTIPLIERS, SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT } from './constants';

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
    workflowBreadth, toolCallScope, multiAgent, humanCheckpoints, persistentMemory,
    cloudConcentration, modelConcentration, gpuConcentration, crossVendorContagion,
    useCases, providers } = inputs;

  // Use cases breadth: more use cases = broader attack surface = higher delegation
  const useCaseFactor = 1 + Math.max(0, (useCases.length - 1)) * 0.03;
  // High-risk use cases amplify delegation ratio
  const hasAutonomousOps = useCases.includes('Autonomous Operations');
  const hasRiskAssessment = useCases.includes('Risk Assessment');
  const hasFraudDetection = useCases.includes('Fraud Detection');
  const highRiskUseCaseBoost = (hasAutonomousOps ? 0.08 : 0) + (hasRiskAssessment ? 0.04 : 0) + (hasFraudDetection ? 0.04 : 0);

  const agentDrFactor = 1 + (multiAgent - 1) * 0.12 - (humanCheckpoints - 1) * 0.06;
  const dr = Math.min(1, (((automation + executionAuthority) / 2) / 5) * agentDrFactor * useCaseFactor + highRiskUseCaseBoost);

  const jd = ((oversightLevel + reviewCadence) / 2) / 5;

  // Provider concentration: fewer providers = harder to exit = higher reversibility cost
  const providerConcentration = providers.length <= 1 ? 0.12 : providers.length <= 2 ? 0.06 : providers.length >= 5 ? -0.04 : 0;

  const sunAdj = switchingCost * (1 + (5 - sunsetPolicy) * 0.08);
  const pmemAdj = persistentMemory * 0.15;
  const concScore = ((cloudConcentration + modelConcentration + gpuConcentration + crossVendorContagion) / 4 - 1) / 4;
  const concRcAdd = (1 - concScore) * 0.20;
  const rc = Math.min(1, ((sunAdj + portability) / 2) / 5 + pmemAdj / 5 + concRcAdd + providerConcentration);

  // More use cases increases continuation density (broader operational footprint)
  const useCaseCdBoost = Math.max(0, (useCases.length - 2)) * 0.02;
  const cd = Math.min(1, ((integrationDepth + actionDensity + workflowBreadth * 0.3 + toolCallScope * 0.2 + inputs.toolCallAuthority * 0.25) / 2.75) / 5 + useCaseCdBoost);
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
  
  // Apply size and revenue adjustments to AFI
  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
  
  const band = getBand(afi);
  const structuralScore = Math.min(99, Math.round(afi * 60));
  const ses = (dr + rc + cd) / 3;

  const govPremium = 1 + Math.min(0.8, afi * 0.45);
  const sectorMult = SECTOR_MULTIPLIERS[inputs.industry] || 1.0;
  const sizeMult = SIZE_MULTIPLIERS[inputs.size] || 1.0;
  const revMult = REVENUE_MULTIPLIERS[inputs.revenue] || 1.0;

  // Size and revenue scale absolute loss exposure
  const scaleMultiplier = sizeMult * revMult;
  const expected = parseFloat((ANCHOR_LOSS * afi * govPremium * sectorMult * scaleMultiplier).toFixed(1));
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

  // MDR — Meaning Drift Risk (from HTML)
  const { mdr, mdrTier, mdrLabel } = computeMDR(inputs);

  // RFSI — Assessment Validity Index
  const mdrNorm = mdr / 100;
  const { rfsi, rfsiTier, rfsiLabel, rfsiDrivers } = computeRFSI(components, mdrNorm, false);

  // Frame Drift Alerts
  const frameDriftAlerts = computeFrameDriftAlerts(components, band, inputs);

  // Premium estimate — size and revenue scale the absolute premium
  const basePrem = 180 * sectorMult * sizeMult * revMult;
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
  if (inputs.providers.length <= 1) signals.push({ text: 'Single provider dependency — concentration risk', color: 'fragile' });
  if (inputs.providers.length >= 4) signals.push({ text: 'Multi-provider diversification — reduced concentration', color: 'stable' });
  if (inputs.switchingCost >= 4) signals.push({ text: 'High switching cost — structural lock-in', color: 'sensitive' });
  if (inputs.integrationDepth >= 4) signals.push({ text: 'Deep integration — exit complexity elevated', color: 'sensitive' });
  if (inputs.hallucinationLiability >= 3) signals.push({ text: 'Hallucination liability exposure — unverified AI outputs', color: 'fragile' });
  if (inputs.shadowAI >= 3) signals.push({ text: 'Shadow AI risk — uncontrolled AI deployments', color: 'sensitive' });
  if (inputs.useCases.includes('Autonomous Operations')) signals.push({ text: 'Autonomous operations selected — elevated delegation risk', color: 'fragile' });
  if (inputs.useCases.includes('Risk Assessment')) signals.push({ text: 'Risk assessment use case — high-stakes decision delegation', color: 'sensitive' });
  if (inputs.useCases.includes('Fraud Detection')) signals.push({ text: 'Fraud detection — false positive/negative liability exposure', color: 'sensitive' });
  if (inputs.useCases.includes('Compliance Monitoring')) signals.push({ text: 'Compliance monitoring — regulatory reliance on AI outputs', color: 'sensitive' });
  if (inputs.useCases.includes('Code Generation')) signals.push({ text: 'Code generation — IP and supply chain integrity risk', color: 'sensitive' });
  if (inputs.useCases.length >= 5) signals.push({ text: `${inputs.useCases.length} AI use cases — broad attack surface and operational footprint`, color: 'sensitive' });
  if (inputs.useCases.length >= 7) signals.push({ text: 'Extensive AI portfolio — systemic integration risk elevated', color: 'fragile' });
  if (inputs.providers.length <= 1) signals.push({ text: 'Single provider dependency — concentration risk', color: 'fragile' });
  if (inputs.providers.length === 2) signals.push({ text: 'Limited provider diversity — moderate concentration risk', color: 'sensitive' });
  if (inputs.providers.length >= 4) signals.push({ text: 'Multi-provider diversification — reduced concentration', color: 'stable' });
  if (inputs.providers.length >= 6) signals.push({ text: 'Broad provider portfolio — strong diversification but integration complexity', color: 'stable' });
  if (['Enterprise (1000–10000)', 'Large Enterprise (10000+)'].includes(inputs.size)) signals.push({ text: 'Large organisation — elevated systemic exposure and regulatory scrutiny', color: 'sensitive' });
  if (['€500M–€5B', 'Over €5B'].includes(inputs.revenue)) signals.push({ text: 'High revenue — amplified absolute loss exposure', color: 'sensitive' });
  if (signals.length === 0) signals.push({ text: 'Governance signals within normal range', color: 'stable' });

  return { afi, band, score, signals, components };
}
