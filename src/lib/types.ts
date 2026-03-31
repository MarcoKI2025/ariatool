export type Band = 'Stable' | 'Sensitive' | 'Fragile';
export type DecisionClass = 'Tier 1: Insurable' | 'Tier 2: Conditionally Insurable' | 'Tier 3: Beyond Standard Transfer';
export type TierShort = 'Tier 1' | 'Tier 2' | 'Tier 3';
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
  cai: number;
}

export interface AuditLogEntry {
  timestamp: string;
  action: 'analysis_run' | 'parameter_change' | 'profile_load';
  details: string;
  inputs?: Partial<ExposureInputs>;
  results?: { afi?: number; band?: Band };
}

export type IATState = Record<number, boolean>;

// ============================================================================
// AGENT COORDINATION TYPES
// ============================================================================

export interface AgentNode {
  id: string;
  name: string;
  type: 'primary' | 'sub-agent' | 'tool';
  level: number;
  autonomy: number;
  authority: number;
  humanOversight: boolean;
  description?: string;
}

export interface AgentEdge {
  from: string;
  to: string;
  delegationType: 'task' | 'tool-call' | 'verification' | 'escalation';
  canOverride: boolean;
  requiresApproval: boolean;
}

export interface AgentCoordinationGraph {
  nodes: AgentNode[];
  edges: AgentEdge[];
  maxDepth: number;
  totalAgents: number;
  totalTools: number;
  recursiveLoops: boolean;
  delegationDepthScore: number;
  responsibilityGapScore: number;
}

export type IATStatus = 'none' | 'approaching' | 'triggered' | 'infrastructural';

export interface CaseStudyMeta {
  isRealCase: true;
  incidentDate: string;
  actualLoss: string;
  ariaPrediction: string;
  source: string;
}

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
  caseStudy?: CaseStudyMeta;
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
