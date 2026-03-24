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
  'Other',
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
  { id: 1, title: 'Exposure Analysis', sublabel: 'Configure AI profile · 29 inputs', viewId: 'exposure' },
  { id: 2, title: 'Decision Intelligence', sublabel: 'AFI · ECI · AGRI · ALRI · SCRI', viewId: 'decision-intelligence' },
  { id: 3, title: 'Scenario Simulation', sublabel: 'Stress test · What-if · Sensitivity', viewId: 'scenario-simulation' },
  { id: 4, title: 'Insurance Decision', sublabel: 'Loss envelope · Underwriting signals', viewId: 'insurance-decision' },
  { id: 5, title: 'Executive Report', sublabel: 'Board summary · ORSA export', viewId: 'executive-report' },
  { id: 6, title: 'Model Governance', sublabel: 'Methodology · Assumptions · Roadmap', viewId: 'model-governance' },
  { id: 7, title: 'Portfolio View', sublabel: 'Multi-entity · Aggregate AFI', viewId: 'portfolio' },
  { id: 8, title: 'Evidence Log', sublabel: 'Audit trail · Compliance', viewId: 'evidence-log' },
  { id: 9, title: 'Integration Hub', sublabel: 'Data feeds · APIs · Ecosystem', viewId: 'integration-hub' },
  { id: 10, title: 'Recursive Risk', sublabel: 'RSI · MCCI · Hyperagent analysis', viewId: 'recursive-risk' },
  { id: 11, title: 'Temporal Tracking', sublabel: 'Risk evolution · Snapshots', viewId: 'temporal-tracking' },
];

export const DEFAULT_ELASTICITIES = {
  w_DR: 1.0,
  w_JD: 1.0,
  w_RC: 1.0,
  w_CD: 1.0,
  w_NA: 1.0,
};

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
  'Financial Services': 1.0,
  'Healthcare': 1.2,
  'Insurance': 1.15,
  'Legal': 1.1,
  'Technology': 1.1,
  'Retail / E-Commerce': 0.9,
  'Manufacturing': 0.85,
  'Government': 0.7,
};

export const DEFAULT_INPUTS = {
  companyName: '',
  industry: '',
  size: '',
  revenue: '',
  useCases: [] as string[],
  providers: [] as string[],
  automation: 1,
  criticality: 1,
  integrationDepth: 1,
  workflowBreadth: 1,
  executionAuthority: 1,
  actionDensity: 1,
  toolCallScope: 1,
  oversightLevel: 1,
  reviewCadence: 1,
  sunsetPolicy: 1,
  switchingCost: 1,
  portability: 1,
  multiAgent: 1,
  toolCallAuthority: 1,
  persistentMemory: 1,
  humanCheckpoints: 1,
  // Liability
  hallucinationLiability: 1,
  deepfakeFraud: 1,
  promptInjection: 1,
  modelDrift: 1,
  algorithmicBias: 1,
  shadowAI: 1,
  explainabilityGap: 1,
  dataIntegrity: 1,
  esgLiability: 1,
  // Non-linear risk vectors
  dataPoisoning: 1,
  adversarialAttack: 1,
  privacyBreach: 1,
  ipInfringement: 1,
  // Systemic
  cloudConcentration: 1,
  modelConcentration: 1,
  gpuConcentration: 1,
  crossVendorContagion: 1,
};

export const COMPANY_SIZES = [
  'Startup (<50)',
  'SME (50–250)',
  'Mid-Market (250–1000)',
  'Enterprise (1000–10000)',
  'Large Enterprise (10000+)',
];

export const REVENUE_RANGES = [
  'Under €10M',
  '€10M–€50M',
  '€50M–€500M',
  '€500M–€5B',
  'Over €5B',
];

// Size multiplier: larger firms = more systemic exposure, higher absolute loss
export const SIZE_MULTIPLIERS: Record<string, number> = {
  'Startup (<50)': 0.5,
  'SME (50–250)': 0.75,
  'Mid-Market (250–1000)': 1.0,
  'Enterprise (1000–10000)': 1.4,
  'Large Enterprise (10000+)': 1.8,
};

// Revenue multiplier: higher revenue = higher absolute exposure and regulatory scrutiny
export const REVENUE_MULTIPLIERS: Record<string, number> = {
  'Under €10M': 0.5,
  '€10M–€50M': 0.75,
  '€50M–€500M': 1.0,
  '€500M–€5B': 1.5,
  'Over €5B': 2.0,
};

// AFI adjustment: larger/richer firms tend to have deeper AI integration
export const SIZE_AFI_ADJUSTMENT: Record<string, number> = {
  'Startup (<50)': -0.05,
  'SME (50–250)': 0,
  'Mid-Market (250–1000)': 0.03,
  'Enterprise (1000–10000)': 0.06,
  'Large Enterprise (10000+)': 0.10,
};

export const REVENUE_AFI_ADJUSTMENT: Record<string, number> = {
  'Under €10M': -0.03,
  '€10M–€50M': 0,
  '€50M–€500M': 0.02,
  '€500M–€5B': 0.05,
  'Over €5B': 0.08,
};
