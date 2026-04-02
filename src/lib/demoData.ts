import { DemoProfile, ExposureInputs } from './types';
import { DEFAULT_INPUTS } from './constants';
import { computeFullAnalysis } from './scoring';

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'sample-fintech',
    name: 'Sample: Mid-Size FinTech',
    industry: 'Financial Services',
    size: 'Mid-Market (250–1000)',
    revenue: '€50M–€500M',
    description: 'Autonomous trading decisions with deep integration into core banking infrastructure and limited human oversight.',
    afi: 2.23,
    band: 'Fragile',
    premiumEstimate: '€420k–€680k',
    useCases: ['Autonomous Operations', 'Fraud Detection', 'Risk Assessment', 'Predictive Analytics'],
    sliders: {
      automation: 4, criticality: 5, integrationDepth: 4, workflowBreadth: 4,
      executionAuthority: 4, actionDensity: 3, toolCallScope: 4,
      oversightLevel: 2, reviewCadence: 2, sunsetPolicy: 1, switchingCost: 4, portability: 4,
      multiAgent: 3, toolCallAuthority: 4, persistentMemory: 2, humanCheckpoints: 2,
      hallucinationLiability: 4, deepfakeFraud: 3, promptInjection: 3, modelDrift: 4, algorithmicBias: 3,
      shadowAI: 4, explainabilityGap: 4, dataIntegrity: 4, esgLiability: 3,
      dataPoisoning: 3, adversarialAttack: 4, privacyBreach: 3, ipInfringement: 3,
      cloudConcentration: 2, modelConcentration: 2, gpuConcentration: 2, crossVendorContagion: 2,
    },
    dependencies: ['OpenAI', 'Azure OpenAI'],
    signals: [
      'Autonomous execution without re-authorization',
      'Single-provider dependency',
      'No formal governance review cycle',
    ],
  },
  {
    id: 'sample-healthcare',
    name: 'Sample: Healthcare Provider',
    industry: 'Healthcare',
    size: 'Mid-Market (250–1000)',
    revenue: '€50M–€500M',
    description: 'Clinical decision support with partial human-in-the-loop. High criticality with two-provider diversification.',
    afi: 1.08,
    band: 'Sensitive',
    premiumEstimate: '€210k–€340k',
    useCases: ['Decision Support', 'Predictive Analytics', 'Risk Assessment'],
    sliders: {
      automation: 4, criticality: 5, integrationDepth: 3, workflowBreadth: 3,
      executionAuthority: 3, actionDensity: 3, toolCallScope: 3,
      oversightLevel: 2, reviewCadence: 3, sunsetPolicy: 2, switchingCost: 3, portability: 3,
      multiAgent: 1, toolCallAuthority: 2, persistentMemory: 1, humanCheckpoints: 4,
      hallucinationLiability: 3, deepfakeFraud: 1, promptInjection: 2, modelDrift: 3, algorithmicBias: 4,
      shadowAI: 2, explainabilityGap: 3, dataIntegrity: 2, esgLiability: 2,
      dataPoisoning: 2, adversarialAttack: 2, privacyBreach: 4, ipInfringement: 1,
      cloudConcentration: 3, modelConcentration: 3, gpuConcentration: 3, crossVendorContagion: 3,
    },
    dependencies: ['Anthropic', 'Google DeepMind'],
    signals: [
      'High-risk medical decisions (EU AI Act Annex III)',
      'Quarterly governance review in place',
      'Human physician confirmation required',
    ],
  },
  {
    id: 'sample-gov',
    name: 'Sample: Government Agency',
    industry: 'Government',
    size: 'Large Enterprise (10000+)',
    revenue: '€50M–€500M',
    description: 'Public sector drafting assistant with mandatory re-authorisation, comprehensive human oversight, in-house model deployment.',
    afi: 0.47,
    band: 'Stable',
    premiumEstimate: '€80k–€140k',
    useCases: ['Decision Support', 'Document Processing', 'Compliance Monitoring'],
    sliders: {
      automation: 2, criticality: 3, integrationDepth: 2, workflowBreadth: 2,
      executionAuthority: 1, actionDensity: 1, toolCallScope: 2,
      oversightLevel: 5, reviewCadence: 5, sunsetPolicy: 4, switchingCost: 2, portability: 2,
      multiAgent: 1, toolCallAuthority: 1, persistentMemory: 1, humanCheckpoints: 5,
      hallucinationLiability: 1, deepfakeFraud: 1, promptInjection: 1, modelDrift: 1, algorithmicBias: 1,
      shadowAI: 1, explainabilityGap: 1, dataIntegrity: 1, esgLiability: 1,
      dataPoisoning: 1, adversarialAttack: 1, privacyBreach: 1, ipInfringement: 1,
      cloudConcentration: 5, modelConcentration: 4, gpuConcentration: 5, crossVendorContagion: 5,
    },
    dependencies: ['Custom / In-House'],
    signals: [
      'Mandatory quarterly re-authorization',
      'In-house model (no external dependency)',
      'Comprehensive human oversight',
    ],
  },
];

export function applyDemoProfile(profile: DemoProfile): ExposureInputs {
  return {
    ...DEFAULT_INPUTS,
    companyName: profile.name,
    industry: profile.industry,
    size: profile.size,
    revenue: profile.revenue || '',
    useCases: profile.useCases || [],
    providers: profile.dependencies,
    automation: profile.sliders.automation ?? 3,
    criticality: profile.sliders.criticality ?? 3,
    integrationDepth: profile.sliders.integrationDepth ?? 3,
    workflowBreadth: profile.sliders.workflowBreadth ?? 3,
    executionAuthority: profile.sliders.executionAuthority ?? 3,
    actionDensity: profile.sliders.actionDensity ?? 3,
    toolCallScope: profile.sliders.toolCallScope ?? 3,
    oversightLevel: profile.sliders.oversightLevel ?? 3,
    reviewCadence: profile.sliders.reviewCadence ?? 3,
    sunsetPolicy: profile.sliders.sunsetPolicy ?? 3,
    switchingCost: profile.sliders.switchingCost ?? 3,
    portability: profile.sliders.portability ?? 3,
    multiAgent: profile.sliders.multiAgent ?? 1,
    toolCallAuthority: profile.sliders.toolCallAuthority ?? 1,
    persistentMemory: profile.sliders.persistentMemory ?? 1,
    humanCheckpoints: profile.sliders.humanCheckpoints ?? 3,
    hallucinationLiability: profile.sliders.hallucinationLiability ?? 1,
    deepfakeFraud: profile.sliders.deepfakeFraud ?? 1,
    promptInjection: profile.sliders.promptInjection ?? 1,
    modelDrift: profile.sliders.modelDrift ?? 1,
    algorithmicBias: profile.sliders.algorithmicBias ?? 1,
    shadowAI: profile.sliders.shadowAI ?? 3,
    explainabilityGap: profile.sliders.explainabilityGap ?? 3,
    dataIntegrity: profile.sliders.dataIntegrity ?? 2,
    esgLiability: profile.sliders.esgLiability ?? 2,
    cloudConcentration: profile.sliders.cloudConcentration ?? 3,
    modelConcentration: profile.sliders.modelConcentration ?? 3,
    gpuConcentration: profile.sliders.gpuConcentration ?? 3,
    crossVendorContagion: profile.sliders.crossVendorContagion ?? 3,
    dataPoisoning: profile.sliders.dataPoisoning ?? 1,
    adversarialAttack: profile.sliders.adversarialAttack ?? 1,
    privacyBreach: profile.sliders.privacyBreach ?? 1,
    ipInfringement: profile.sliders.ipInfringement ?? 1,
  } as ExposureInputs;
}

/** Compute actual AFI/band from a demo profile's sliders — ensures display matches engine */
const _profileCache = new Map<string, { afi: number; band: string }>();
export function computeDemoProfilePreview(profile: DemoProfile): { afi: number; band: string } {
  if (_profileCache.has(profile.id)) return _profileCache.get(profile.id)!;
  const inputs = applyDemoProfile(profile);
  const result = computeFullAnalysis(inputs);
  const preview = { afi: result.afi, band: result.band };
  _profileCache.set(profile.id, preview);
  return preview;
}
