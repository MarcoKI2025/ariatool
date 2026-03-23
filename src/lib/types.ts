export type Band = 'Stable' | 'Sensitive' | 'Fragile';
export type DecisionClass = 'Approved' | 'Conditional Review' | 'Escalate to Committee';
export type Perspective = 'underwriter' | 'company';

export interface SliderInput {
  id: string;
  label: string;
  description: string;
  tooltip?: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ExposureInputs {
  companyName: string;
  industry: string;
  size: string;
  revenue: string;
  useCases: string[];
  providers: string[];
  // Deployment (1-5)
  automation: number;
  criticality: number;
  integrationDepth: number;
  workflowBreadth: number;
  // Agentic (1-5)
  executionAuthority: number;
  actionDensity: number;
  toolCallScope: number;
  oversightLevel: number;
  reviewCadence: number;
  sunsetPolicy: number;
  switchingCost: number;
  portability: number;
  // Agent extensions
  multiAgent: number;
  toolCallAuthority: number;
  persistentMemory: number;
  humanCheckpoints: number;
  // AI-Specific Liability (1-5)
  hallucinationLiability: number;
  deepfakeFraud: number;
  promptInjection: number;
  modelDrift: number;
  algorithmicBias: number;
  shadowAI: number;
  explainabilityGap: number;
  dataIntegrity: number;
  esgLiability: number;
  // Non-linear risk vectors (1-5)
  dataPoisoning: number;
  adversarialAttack: number;
  privacyBreach: number;
  ipInfringement: number;
  // Systemic & Concentration (1-5)
  cloudConcentration: number;
  modelConcentration: number;
  gpuConcentration: number;
  crossVendorContagion: number;
}

export interface AFIComponents {
  dr: number; // Delegation Ratio
  jd: number; // Justificatory Density
  rc: number; // Reversibility Cost
  cd: number; // Continuation Density
  na: number; // Network Amplification
}

export interface FrameDriftAlert {
  sev: 'critical' | 'high' | 'moderate';
  title: string;
  explanation: string;
  mitigation: string;
}

export interface AnalysisResults {
  afi: number;
  band: Band;
  structuralScore: number;
  ses: number;
  components: AFIComponents;
  decisionClass: DecisionClass;
  lossEnvelope: {
    expected: string;
    stress: string;
    tail: string;
    portfolio: string;
  };
  amplificationFactor: string;
  correlationFactor: number;
  eciTier: number;
  eciName: string;
  agri: number;
  alri: number;
  scri: number;
  compositeRiskIndex: number;
  premium: { band: string; label: string };
  mdr: number;
  mdrTier: string;
  mdrLabel: string;
  rfsi: number;
  rfsiTier: 'stable' | 'conditional' | 'limited';
  rfsiLabel: string;
  rfsiDrivers: { contextVariability: number; semanticDriftRisk: number; evaluationMismatch: number; temporalInstability: number };
  frameDriftAlerts: FrameDriftAlert[];
}

export interface AuditLogEntry {
  timestamp: string;
  action: 'analysis_run' | 'parameter_change' | 'profile_load';
  details: string;
  inputs?: Partial<ExposureInputs>;
  results?: { afi?: number; band?: Band };
}

export type IATState = Record<number, boolean>;

export type IATStatus = 'none' | 'approaching' | 'triggered' | 'infrastructural';

export interface DemoProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  revenue?: string;
  description: string;
  afi: number;
  band: Band;
  premiumEstimate: string;
  useCases?: string[];
  sliders: Record<string, number>;
  dependencies: string[];
  signals: string[];
}

export interface DemoSlide {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export interface AppState {
  perspective: Perspective;
  activeStep: number;
  analysisComplete: boolean;
  inputs: ExposureInputs;
  results: AnalysisResults | null;
  iatState: IATState;
  darkMode: boolean;
  auditLog: AuditLogEntry[];
}
