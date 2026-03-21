export const USE_CASES = [
  'Decision Support',
  'Customer Service Automation',
  'Autonomous Operations',
  'Document Processing',
  'Fraud Detection',
  'Predictive Analytics',
  'Code Generation',
  'Risk Assessment',
  'Compliance Monitoring',
];

export const PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Google DeepMind',
  'Meta AI',
  'Mistral',
  'Cohere',
  'AWS Bedrock',
  'Azure OpenAI',
  'Custom / In-House',
];

export const INDUSTRIES = [
  'Financial Services',
  'Insurance',
  'Healthcare',
  'Legal',
  'Technology',
  'Retail / E-Commerce',
  'Manufacturing',
  'Government',
];

export const NAV_STEPS = [
  { id: 1, title: 'Exposure Analysis', sublabel: 'Inputs · Structural profile', viewId: 'exposure' },
  { id: 2, title: 'Risk Overview', sublabel: 'AFI · Authority fragility · Governance', viewId: 'risk-overview' },
  { id: 3, title: 'Dependency Map', sublabel: 'Third-party concentration · SPOF', viewId: 'dependency-map' },
  { id: 4, title: 'Insurance Decision', sublabel: 'Loss envelope · Underwriting signals', viewId: 'insurance-decision' },
  { id: 5, title: 'Executive Report', sublabel: 'Board summary · ORSA export', viewId: 'executive-report' },
  { id: 6, title: 'Model Governance', sublabel: 'Methodology · Assumptions · Roadmap', viewId: 'model-governance' },
];

// AFI thresholds
export const AFI_STABLE_MAX = 0.85;
export const AFI_SENSITIVE_MAX = 1.35;

// Loss model constants
export const ANCHOR_LOSS = 2.8; // €M median AI operational loss

// Pricing sim constants
export const SIM_BASE = 180;
export const SIM_AUTO_M: Record<number, number> = { 1: 0.5, 2: 0.75, 3: 1.0, 4: 1.5, 5: 2.2 };
export const SIM_CRIT_M: Record<number, number> = { 1: 0.5, 2: 0.7, 3: 1.0, 4: 1.4, 5: 2.0 };
export const SIM_DEP_M: Record<number, number> = { 1: 0.6, 2: 0.8, 3: 1.0, 4: 1.3, 5: 1.8 };
export const SIM_REV_M: Record<number, number> = { 1: 1.4, 2: 1.2, 3: 1.0, 4: 0.8, 5: 0.6 };
export const SIM_OVST_R: Record<number, number> = { 1: 0, 2: 0.05, 3: 0.12, 4: 0.22, 5: 0.35 };

export const SECTOR_MULTIPLIERS: Record<string, number> = {
  'Financial Services': 1.4,
  'Healthcare': 1.5,
  'Insurance': 1.3,
  'Legal': 1.35,
  'Technology': 1.1,
  'Retail / E-Commerce': 1.0,
  'Manufacturing': 1.2,
  'Government': 0.9,
};

export const DEFAULT_INPUTS = {
  companyName: '',
  industry: 'Financial Services',
  useCases: ['Decision Support'],
  providers: ['OpenAI'],
  automation: 3,
  criticality: 3,
  integrationDepth: 3,
  workflowBreadth: 3,
  executionAuthority: 3,
  actionDensity: 3,
  toolCallScope: 3,
  oversightLevel: 3,
  reviewCadence: 3,
  sunsetPolicy: 3,
  switchingCost: 3,
  portability: 3,
  multiAgent: 1,
  toolCallAuthority: 1,
  persistentMemory: 1,
  humanCheckpoints: 3,
};
