/**
 * Demo Scenario: 30 Insureds with AI Dependencies
 * Critical Case: Insured #23 (LendFlow Pro) breaks portfolio correlation
 *
 * All inputs map to ExposureInputs from src/lib/types.ts.
 * Every entity shares GPT-4 via Azure OpenAI as a provider dependency.
 */

import { ExposureInputs } from '@/lib/types';

export interface DemoInsured {
  id: string;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  aiUseCase: string;
  modelProvider: string;
  infrastructure: string;
  weight: number;
  inputs: ExposureInputs;
  riskFlags?: string[];
  traditionalUnderwritingView?: {
    decision: string;
    premium: string;
    reasoning: string;
  };
  ariaView?: {
    decision: string;
    reasoning: string;
    tailRisk: string;
    marginalPremium: string;
    riskReturn: string;
  };
}

/** Helper: build a full ExposureInputs from partial overrides */
function makeInputs(overrides: Partial<ExposureInputs> & { companyName: string; industry: string; size: string; revenue: string }): ExposureInputs {
  return {
    companyName: overrides.companyName,
    industry: overrides.industry,
    size: overrides.size,
    revenue: overrides.revenue,
    useCases: overrides.useCases ?? ['Decision Support'],
    providers: overrides.providers ?? ['Azure OpenAI'],
    automation: overrides.automation ?? 2,
    criticality: overrides.criticality ?? 3,
    integrationDepth: overrides.integrationDepth ?? 3,
    workflowBreadth: overrides.workflowBreadth ?? 2,
    executionAuthority: overrides.executionAuthority ?? 2,
    actionDensity: overrides.actionDensity ?? 2,
    toolCallScope: overrides.toolCallScope ?? 2,
    oversightLevel: overrides.oversightLevel ?? 3,
    reviewCadence: overrides.reviewCadence ?? 3,
    sunsetPolicy: overrides.sunsetPolicy ?? 3,
    switchingCost: overrides.switchingCost ?? 2,
    portability: overrides.portability ?? 3,
    multiAgent: overrides.multiAgent ?? 1,
    toolCallAuthority: overrides.toolCallAuthority ?? 2,
    persistentMemory: overrides.persistentMemory ?? 2,
    humanCheckpoints: overrides.humanCheckpoints ?? 3,
    hallucinationLiability: overrides.hallucinationLiability ?? 2,
    deepfakeFraud: overrides.deepfakeFraud ?? 1,
    promptInjection: overrides.promptInjection ?? 2,
    modelDrift: overrides.modelDrift ?? 2,
    algorithmicBias: overrides.algorithmicBias ?? 2,
    shadowAI: overrides.shadowAI ?? 1,
    explainabilityGap: overrides.explainabilityGap ?? 2,
    dataIntegrity: overrides.dataIntegrity ?? 2,
    esgLiability: overrides.esgLiability ?? 1,
    dataPoisoning: overrides.dataPoisoning ?? 1,
    adversarialAttack: overrides.adversarialAttack ?? 1,
    privacyBreach: overrides.privacyBreach ?? 2,
    ipInfringement: overrides.ipInfringement ?? 1,
    cloudConcentration: overrides.cloudConcentration ?? 4,
    modelConcentration: overrides.modelConcentration ?? 4,
    gpuConcentration: overrides.gpuConcentration ?? 3,
    crossVendorContagion: overrides.crossVendorContagion ?? 3,
  };
}

// ============================================================================
// FINTECH (IDs 1–10)
// ============================================================================

const fintech: DemoInsured[] = [
  {
    id: '1', name: 'PayFlow Analytics', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Fraud detection & transaction monitoring',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.2,
    inputs: makeInputs({
      companyName: 'PayFlow Analytics', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Fraud Detection', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 3, explainabilityGap: 2, persistentMemory: 2,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '2', name: 'NeoCredit Systems', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Credit scoring & risk assessment',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.5,
    inputs: makeInputs({
      companyName: 'NeoCredit Systems', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Risk Assessment', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 4, oversightLevel: 3,
      reviewCadence: 3, explainabilityGap: 3, algorithmicBias: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '3', name: 'TradeBot Capital', industry: 'Financial Services',
    size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
    aiUseCase: 'Algorithmic trading signal generation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 4.0,
    inputs: makeInputs({
      companyName: 'TradeBot Capital', industry: 'Financial Services',
      size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
      useCases: ['Decision Support', 'Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 4, criticality: 4, integrationDepth: 4, oversightLevel: 3,
      executionAuthority: 3, reviewCadence: 3, switchingCost: 3,
      cloudConcentration: 4, modelConcentration: 5,
    }),
  },
  {
    id: '4', name: 'RegShield AI', industry: 'Financial Services',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Regulatory compliance monitoring',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.5,
    inputs: makeInputs({
      companyName: 'RegShield AI', industry: 'Financial Services',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Compliance Monitoring'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 3, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 4, explainabilityGap: 2,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '5', name: 'WealthPilot', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Portfolio advisory & client communication',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.0,
    inputs: makeInputs({
      companyName: 'WealthPilot', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Decision Support', 'Customer Service Automation'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3, hallucinationLiability: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '6', name: 'InsurTech Connect', industry: 'Insurance',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Claims processing & triage',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.3,
    inputs: makeInputs({
      companyName: 'InsurTech Connect', industry: 'Insurance',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Document Processing', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 3, explainabilityGap: 2,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '7', name: 'QuickLend Digital', industry: 'Financial Services',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Micro-lending decision support',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.8,
    inputs: makeInputs({
      companyName: 'QuickLend Digital', industry: 'Financial Services',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Decision Support', 'Risk Assessment'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3, algorithmicBias: 2,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '8', name: 'PayGuard Solutions', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Payment fraud prevention',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.1,
    inputs: makeInputs({
      companyName: 'PayGuard Solutions', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Fraud Detection'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '9', name: 'FinDoc AI', industry: 'Financial Services',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Financial document extraction',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.2,
    inputs: makeInputs({
      companyName: 'FinDoc AI', industry: 'Financial Services',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Document Processing'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 2, integrationDepth: 2, oversightLevel: 4,
      reviewCadence: 4,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '10', name: 'BlockSettle', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Settlement reconciliation & anomaly detection',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.4,
    inputs: makeInputs({
      companyName: 'BlockSettle', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Predictive Analytics', 'Fraud Detection'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3, modelDrift: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
];

// ============================================================================
// HEALTHTECH (IDs 11–20)
// ============================================================================

const healthtech: DemoInsured[] = [
  {
    id: '11', name: 'MedAssist Health', industry: 'Healthcare',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Clinical decision support',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.5,
    inputs: makeInputs({
      companyName: 'MedAssist Health', industry: 'Healthcare',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Decision Support'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 5, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 4, hallucinationLiability: 3, explainabilityGap: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '12', name: 'PharmaScan AI', industry: 'Healthcare',
    size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
    aiUseCase: 'Drug interaction analysis',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.8,
    inputs: makeInputs({
      companyName: 'PharmaScan AI', industry: 'Healthcare',
      size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
      useCases: ['Risk Assessment', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 5, integrationDepth: 4, oversightLevel: 4,
      reviewCadence: 4, hallucinationLiability: 4, privacyBreach: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '13', name: 'TriageBot', industry: 'Healthcare',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Patient triage & symptom assessment',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.8,
    inputs: makeInputs({
      companyName: 'TriageBot', industry: 'Healthcare',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Customer Service Automation', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3, hallucinationLiability: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '14', name: 'RadiologyAI Pro', industry: 'Healthcare',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Medical imaging analysis',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.6,
    inputs: makeInputs({
      companyName: 'RadiologyAI Pro', industry: 'Healthcare',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Decision Support', 'Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 5, integrationDepth: 4, oversightLevel: 4,
      reviewCadence: 4, explainabilityGap: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '15', name: 'HealthBot Connect', industry: 'Healthcare',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Patient communication & scheduling',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.3,
    inputs: makeInputs({
      companyName: 'HealthBot Connect', industry: 'Healthcare',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Customer Service Automation'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 2, integrationDepth: 2, oversightLevel: 3,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '16', name: 'ClinicalNotes AI', industry: 'Healthcare',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Automated clinical documentation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.0,
    inputs: makeInputs({
      companyName: 'ClinicalNotes AI', industry: 'Healthcare',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Document Processing'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3, privacyBreach: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '17', name: 'GenomicInsight', industry: 'Healthcare',
    size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
    aiUseCase: 'Genomic data interpretation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 4.0,
    inputs: makeInputs({
      companyName: 'GenomicInsight', industry: 'Healthcare',
      size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
      useCases: ['Predictive Analytics', 'Risk Assessment'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 5, integrationDepth: 4, oversightLevel: 4,
      reviewCadence: 4, explainabilityGap: 4, privacyBreach: 4,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '18', name: 'MentalHealthAI', industry: 'Healthcare',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Therapy session analysis & recommendations',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.5,
    inputs: makeInputs({
      companyName: 'MentalHealthAI', industry: 'Healthcare',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Decision Support', 'Customer Service Automation'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 4, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 3, hallucinationLiability: 4, esgLiability: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '19', name: 'SurgiPlan', industry: 'Healthcare',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Surgical planning & risk prediction',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.4,
    inputs: makeInputs({
      companyName: 'SurgiPlan', industry: 'Healthcare',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Risk Assessment', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 5, integrationDepth: 4, oversightLevel: 4,
      reviewCadence: 4, explainabilityGap: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '20', name: 'PathoDetect', industry: 'Healthcare',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Pathology slide analysis',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.2,
    inputs: makeInputs({
      companyName: 'PathoDetect', industry: 'Healthcare',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Decision Support', 'Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 3, oversightLevel: 4,
      reviewCadence: 4,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
];

// ============================================================================
// LOGISTICS / TECH (IDs 21–30)
// ============================================================================

const logistics: DemoInsured[] = [
  {
    id: '21', name: 'RouteGenius', industry: 'Technology',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Fleet route optimisation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.0,
    inputs: makeInputs({
      companyName: 'RouteGenius', industry: 'Technology',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Predictive Analytics', 'Autonomous Operations'], providers: ['Azure OpenAI'],
      automation: 4, criticality: 3, integrationDepth: 4, oversightLevel: 3,
      reviewCadence: 3, switchingCost: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '22', name: 'WarehouseIQ', industry: 'Manufacturing',
    size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
    aiUseCase: 'Warehouse automation & inventory prediction',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.8,
    inputs: makeInputs({
      companyName: 'WarehouseIQ', industry: 'Manufacturing',
      size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
      useCases: ['Autonomous Operations', 'Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 4, criticality: 3, integrationDepth: 4, oversightLevel: 3,
      reviewCadence: 3, switchingCost: 4,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },

  // ── THE CRITICAL CASE: INSURED #23 ──
  {
    id: '23', name: 'LendFlow Pro', industry: 'Financial Services',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'AI-driven loan approval & underwriting',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 4.5,
    inputs: makeInputs({
      companyName: 'LendFlow Pro', industry: 'Financial Services',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Decision Support', 'Risk Assessment', 'Autonomous Operations'],
      providers: ['Azure OpenAI'],
      automation: 5,              // Very high autonomy
      criticality: 5,
      integrationDepth: 5,        // Deeply embedded
      workflowBreadth: 4,
      executionAuthority: 5,
      actionDensity: 4,
      toolCallScope: 4,
      oversightLevel: 2,          // Low human oversight
      reviewCadence: 2,           // Infrequent audits
      sunsetPolicy: 1,
      switchingCost: 5,
      portability: 1,
      multiAgent: 3,
      toolCallAuthority: 4,
      persistentMemory: 4,        // System learns from decisions
      humanCheckpoints: 1,
      hallucinationLiability: 4,
      deepfakeFraud: 2,
      promptInjection: 3,
      modelDrift: 4,
      algorithmicBias: 4,
      shadowAI: 2,
      explainabilityGap: 4,       // Low explainability
      dataIntegrity: 3,
      esgLiability: 3,
      dataPoisoning: 2,
      adversarialAttack: 2,
      privacyBreach: 3,
      ipInfringement: 2,
      cloudConcentration: 5,
      modelConcentration: 5,
      gpuConcentration: 4,
      crossVendorContagion: 4,
    }),
    riskFlags: [
      'Recursive bias amplification detected',
      'Low oversight relative to autonomy',
      'Critical business process dependency',
      'Portfolio correlation impact: 0.45 → 0.68',
    ],
    traditionalUnderwritingView: {
      decision: 'Accept',
      premium: '€80,000',
      reasoning: 'Compliant with EU AI Act, standard E&O coverage applicable, revenue size supports premium',
    },
    ariaView: {
      decision: 'Decline',
      reasoning: 'Structural risk exceeds pricing capacity. High autonomy with minimal oversight creates unacceptable tail risk. Portfolio correlation impact makes marginal premium unjustifiable.',
      tailRisk: '€12M (1-in-20 scenario)',
      marginalPremium: '€80,000',
      riskReturn: 'Unjustifiable',
    },
  },

  {
    id: '24', name: 'ShipTrack Pro', industry: 'Technology',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Shipment tracking & ETA prediction',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.8,
    inputs: makeInputs({
      companyName: 'ShipTrack Pro', industry: 'Technology',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '25', name: 'DemandSense', industry: 'Retail / E-Commerce',
    size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
    aiUseCase: 'Demand forecasting & supply chain optimisation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.6,
    inputs: makeInputs({
      companyName: 'DemandSense', industry: 'Retail / E-Commerce',
      size: 'Enterprise (1000–10000)', revenue: '€500M–€5B',
      useCases: ['Predictive Analytics', 'Decision Support'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 4, oversightLevel: 3,
      reviewCadence: 3, modelDrift: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '26', name: 'FleetMind', industry: 'Technology',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Autonomous fleet management',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.2,
    inputs: makeInputs({
      companyName: 'FleetMind', industry: 'Technology',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Autonomous Operations'], providers: ['Azure OpenAI'],
      automation: 4, criticality: 4, integrationDepth: 4, oversightLevel: 3,
      reviewCadence: 3, switchingCost: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '27', name: 'CustomsClear AI', industry: 'Technology',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Customs document classification',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.2,
    inputs: makeInputs({
      companyName: 'CustomsClear AI', industry: 'Technology',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Document Processing', 'Compliance Monitoring'], providers: ['Azure OpenAI'],
      automation: 2, criticality: 3, integrationDepth: 2, oversightLevel: 4,
      reviewCadence: 4,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '28', name: 'ColdChain Monitor', industry: 'Manufacturing',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Temperature-sensitive cargo monitoring',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.0,
    inputs: makeInputs({
      companyName: 'ColdChain Monitor', industry: 'Manufacturing',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Predictive Analytics', 'Autonomous Operations'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 4, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '29', name: 'PortFlow Systems', industry: 'Technology',
    size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
    aiUseCase: 'Port logistics optimisation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 3.1,
    inputs: makeInputs({
      companyName: 'PortFlow Systems', industry: 'Technology',
      size: 'Mid-Market (250–1000)', revenue: '€50M–€500M',
      useCases: ['Predictive Analytics'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 3, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
  {
    id: '30', name: 'LastMile AI', industry: 'Retail / E-Commerce',
    size: 'SME (50–250)', revenue: '€10M–€50M',
    aiUseCase: 'Last-mile delivery optimisation',
    modelProvider: 'GPT-4 via Azure OpenAI', infrastructure: 'Azure', weight: 2.4,
    inputs: makeInputs({
      companyName: 'LastMile AI', industry: 'Retail / E-Commerce',
      size: 'SME (50–250)', revenue: '€10M–€50M',
      useCases: ['Predictive Analytics', 'Autonomous Operations'], providers: ['Azure OpenAI'],
      automation: 3, criticality: 2, integrationDepth: 3, oversightLevel: 3,
      reviewCadence: 3,
      cloudConcentration: 4, modelConcentration: 4,
    }),
  },
];

/** All 30 demo insureds */
export const DEMO_INSUREDS: DemoInsured[] = [...fintech, ...healthtech, ...logistics];

/** Pre-computed portfolio-level summary metrics */
export const DEMO_PORTFOLIO_METRICS = {
  totalInsureds: 30,
  totalWeight: DEMO_INSUREDS.reduce((s, e) => s + e.weight, 0),
  sharedDependencies: {
    model: 'GPT-4',
    provider: 'Azure OpenAI',
    affectedInsureds: 30,
    concentrationRisk: 'Critical' as const,
  },
  criticalEntityId: '23',
  criticalEntityName: 'LendFlow Pro',
};
