/**
 * Recursive Self-Improvement Risk Engine
 * Assesses hyperagent metacognitive capabilities and recursive risk
 */

export interface RecursiveRiskFactors {
  codeModification: number;      // 0-5: Can AI modify its own code?
  promptEngineering: number;     // 0-5: Can AI write/optimize its own prompts?
  improvementProcess: number;    // 0-5: Does AI manage its own improvement pipeline?
  evaluationCriteria: number;    // 0-5: Does AI define its own success metrics?
  parentSelection: number;       // 0-5: Can AI choose what to optimize next?
  performanceGainRate: number;   // 0-5: How fast is performance improving?
  adaptationSpeed: number;       // 0-5: How quickly does the system adapt?
  learningCurve: number;         // 0-5: Steepness of capability growth
  interpretability: number;      // 0-5: How interpretable are improvements?
  auditCadence: number;          // 0-5: Frequency of human audits
  domainExpertise: number;       // 0-5: Human domain expertise level
}

export interface RSIResult {
  rsi: number;
  tier: 'Minimal' | 'Low' | 'Elevated' | 'High' | 'Critical';
  metaDepth: number;
  improvementVelocity: number;
  oversightCapability: number;
  flags: string[];
  recommendations: string[];
}

export function calculateRSI(factors: RecursiveRiskFactors): RSIResult {
  const metaDepth = (factors.codeModification * 3 + factors.promptEngineering * 2 + factors.improvementProcess * 3 + factors.evaluationCriteria * 2 + factors.parentSelection * 2) / 12 * 100;
  const improvementVelocity = (factors.performanceGainRate * 2 + factors.adaptationSpeed * 2 + factors.learningCurve) / 5 * 100;
  const oversightCapability = (factors.interpretability * 2 + factors.auditCadence * 2 + factors.domainExpertise) / 5 * 100;

  const rawRSI = (metaDepth * 0.45 + improvementVelocity * 0.35) - (oversightCapability * 0.2);
  const rsi = Math.max(0, Math.min(100, rawRSI));

  const tier: RSIResult['tier'] =
    rsi < 15 ? 'Minimal' :
    rsi < 30 ? 'Low' :
    rsi < 50 ? 'Elevated' :
    rsi < 75 ? 'High' : 'Critical';

  const flags: string[] = [];
  if (factors.codeModification >= 4) flags.push('Self-modifying code capability detected');
  if (factors.evaluationCriteria >= 4) flags.push('AI defines own success metrics');
  if (factors.improvementProcess >= 4) flags.push('Autonomous improvement pipeline');
  if (factors.parentSelection >= 3 && factors.codeModification >= 3) flags.push('Recursive optimization loop possible');
  if (improvementVelocity > 70 && oversightCapability < 40) flags.push('Improvement outpacing oversight');

  const recommendations: string[] = [];
  if (oversightCapability < 40) recommendations.push('Increase audit frequency and human review cadence');
  if (metaDepth > 60) recommendations.push('Implement hard guardrails on self-modification scope');
  if (improvementVelocity > 60) recommendations.push('Add rate-limiting to improvement cycles');
  if (factors.interpretability < 3) recommendations.push('Require explainability reports for each improvement cycle');
  if (flags.length === 0) recommendations.push('Current risk profile is within acceptable bounds');

  return { rsi, tier, metaDepth, improvementVelocity, oversightCapability, flags, recommendations };
}

// ============================================================================
// METACOGNITIVE CAPABILITY INDEX (MCCI)
// ============================================================================

export interface MetacognitiveCapabilities {
  performanceTracking: boolean;
  metricComparison: boolean;
  trendAnalysis: boolean;
  errorDetection: boolean;
  biasDetection: boolean;
  degeneracyDetection: boolean;
  multiGenerationPlanning: boolean;
  computeAwarePlanning: boolean;
  explorationExploitationBalance: boolean;
  persistentMemory: boolean;
  crossSessionLearning: boolean;
  knowledgeBase: boolean;
  templateSystems: boolean;
  patternAbstraction: boolean;
  frameworkDevelopment: boolean;
}

export interface MCCIResult {
  mcci: number;
  tier: 'None' | 'Basic' | 'Intermediate' | 'Advanced' | 'Autonomous';
  capabilities: {
    selfAwareness: number;
    strategicPlanning: number;
    memoryIntegration: number;
    metaLearning: number;
  };
}

export function calculateMCCI(caps: MetacognitiveCapabilities): MCCIResult {
  const selfAwareness = ([caps.performanceTracking, caps.metricComparison, caps.trendAnalysis, caps.errorDetection, caps.biasDetection, caps.degeneracyDetection].filter(Boolean).length / 6) * 100;
  const strategicPlanning = ([caps.multiGenerationPlanning, caps.computeAwarePlanning, caps.explorationExploitationBalance].filter(Boolean).length / 3) * 100;
  const memoryIntegration = ([caps.persistentMemory, caps.crossSessionLearning, caps.knowledgeBase].filter(Boolean).length / 3) * 100;
  const metaLearning = ([caps.templateSystems, caps.patternAbstraction, caps.frameworkDevelopment].filter(Boolean).length / 3) * 100;

  const mcci = selfAwareness * 0.3 + strategicPlanning * 0.25 + memoryIntegration * 0.2 + metaLearning * 0.25;

  const tier: MCCIResult['tier'] =
    mcci < 10 ? 'None' :
    mcci < 30 ? 'Basic' :
    mcci < 55 ? 'Intermediate' :
    mcci < 80 ? 'Advanced' : 'Autonomous';

  return { mcci, tier, capabilities: { selfAwareness, strategicPlanning, memoryIntegration, metaLearning } };
}

// ============================================================================
// COMPOUNDING GAIN DETECTION (CGD)
// ============================================================================

export interface PerformanceDataPoint {
  timestamp: Date;
  performance: number;
  iteration: number;
}

export interface CGDResult {
  alert: boolean;
  alertMessage: string;
  growthRate: number;
  isExponential: boolean;
  projectedPerformance30Days: number;
}

export function detectCompoundingGains(history: PerformanceDataPoint[], baseline: number): CGDResult {
  if (history.length < 2) {
    return { alert: false, alertMessage: '', growthRate: 0, isExponential: false, projectedPerformance30Days: baseline };
  }

  const sorted = [...history].sort((a, b) => a.iteration - b.iteration);
  const gains = sorted.slice(1).map((p, i) => p.performance - sorted[i].performance);
  const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length;
  const isAccelerating = gains.length >= 2 && gains[gains.length - 1] > gains[0] * 1.5;
  const growthRate = avgGain / (sorted[0].performance || 1);
  const isExponential = isAccelerating && growthRate > 0.1;
  const last = sorted[sorted.length - 1].performance;
  const projectedPerformance30Days = last * (1 + growthRate);

  const alert = isExponential || growthRate > 0.2;
  const alertMessage = isExponential
    ? `Exponential performance growth detected: ${(growthRate * 100).toFixed(1)}% per iteration. Projected 30-day performance: ${projectedPerformance30Days.toFixed(0)}`
    : growthRate > 0.2
    ? `Rapid performance growth: ${(growthRate * 100).toFixed(1)}% per iteration`
    : '';

  return { alert, alertMessage, growthRate, isExponential, projectedPerformance30Days };
}

// ============================================================================
// CONFIDENCE ASSESSMENT
// ============================================================================

type QualityLevel = 'Self-Attested' | 'Audited' | 'Verified';
type ValidationLevel = 'Internal-Only' | 'Peer-Reviewed' | 'Regulatory-Approved';
type CalibrationLevel = 'No-Calibration' | 'Small-Sample' | 'Large-Sample';
type TemporalLevel = 'Snapshot' | 'Quarterly' | 'Continuous';

interface ConfidenceInputs {
  inputQuality: QualityLevel;
  frameworkValidation: ValidationLevel;
  industryCalibration: CalibrationLevel;
  temporalStability: TemporalLevel;
}

interface ConfidenceResult {
  overall: string;
  breakdown: {
    inputQuality: number;
    frameworkValidation: number;
    industryCalibration: number;
    temporalStability: number;
  };
  suitableFor: string[];
  notSuitableFor: string[];
}

const QUALITY_SCORES: Record<QualityLevel, number> = { 'Self-Attested': 1, 'Audited': 3, 'Verified': 5 };
const VALIDATION_SCORES: Record<ValidationLevel, number> = { 'Internal-Only': 1, 'Peer-Reviewed': 3, 'Regulatory-Approved': 5 };
const CALIBRATION_SCORES: Record<CalibrationLevel, number> = { 'No-Calibration': 1, 'Small-Sample': 3, 'Large-Sample': 5 };
const TEMPORAL_SCORES: Record<TemporalLevel, number> = { 'Snapshot': 1, 'Quarterly': 3, 'Continuous': 5 };

export function assessConfidence(inputs: ConfidenceInputs): ConfidenceResult {
  const breakdown = {
    inputQuality: QUALITY_SCORES[inputs.inputQuality],
    frameworkValidation: VALIDATION_SCORES[inputs.frameworkValidation],
    industryCalibration: CALIBRATION_SCORES[inputs.industryCalibration],
    temporalStability: TEMPORAL_SCORES[inputs.temporalStability],
  };

  const avg = (breakdown.inputQuality + breakdown.frameworkValidation + breakdown.industryCalibration + breakdown.temporalStability) / 4;

  const overall = avg >= 4 ? 'High Confidence' : avg >= 2.5 ? 'Moderate Confidence' : 'Low Confidence';

  const suitableFor: string[] = [];
  const notSuitableFor: string[] = [];

  if (avg >= 4) {
    suitableFor.push('Regulatory reporting', 'Policy pricing', 'Board-level decisions');
  } else if (avg >= 2.5) {
    suitableFor.push('Internal risk assessment', 'Strategic planning', 'Screening decisions');
    notSuitableFor.push('Regulatory reporting', 'Binding policy pricing');
  } else {
    suitableFor.push('Initial screening', 'Awareness building');
    notSuitableFor.push('Regulatory reporting', 'Policy pricing', 'Board-level decisions');
  }

  return { overall, breakdown, suitableFor, notSuitableFor };
}

export function formatStars(score: number): string {
  return '★'.repeat(score) + '☆'.repeat(5 - score);
}
