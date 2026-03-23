/**
 * EU AI Act Compliance Framework
 * Maps ARIA parameters to specific EU AI Act articles
 */
import { ExposureInputs, AnalysisResults } from '@/lib/types';

export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';

export interface ComplianceAssessment {
  status: ComplianceStatus;
  score: number;
  gaps: string[];
  evidence: string[];
  recommendations: string[];
}

export interface ComplianceRequirement {
  article: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedCost: string;
  timeToRemediate: string;
  checkFunction: (inputs: ExposureInputs, results: AnalysisResults) => ComplianceAssessment;
}

function assess(evidence: string[], gaps: string[], recommendations: string[]): ComplianceAssessment {
  const total = evidence.length + gaps.length;
  const score = total > 0 ? (evidence.length / total) * 100 : 0;
  const status: ComplianceStatus = score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant';
  return { status, score, gaps, evidence, recommendations };
}

export const EU_AI_ACT_REQUIREMENTS: ComplianceRequirement[] = [
  {
    article: 'Article 9',
    title: 'Risk Management System',
    description: 'Establish, implement, document and maintain a continuous risk management system throughout the AI lifecycle.',
    priority: 'critical',
    estimatedCost: '€50,000 – €150,000',
    timeToRemediate: '3–6 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (results?.afi) e.push('ARIA AFI risk assessment conducted');
      else { g.push('No formal risk assessment documented'); r.push('Conduct comprehensive AI risk assessment'); }
      if (inputs.reviewCadence >= 4) e.push('Regular review cadence established');
      else { g.push(`Review cadence insufficient (${inputs.reviewCadence}/5)`); r.push('Increase review cadence to quarterly minimum'); }
      if (inputs.oversightLevel >= 3) e.push('Governance oversight processes in place');
      else { g.push(`Oversight level below requirements (${inputs.oversightLevel}/5)`); r.push('Strengthen governance oversight structure'); }
      return assess(e, g, r);
    },
  },
  {
    article: 'Article 10',
    title: 'Data and Data Governance',
    description: 'Training, validation and testing data shall be relevant, representative, free of errors and complete.',
    priority: 'critical',
    estimatedCost: '€80,000 – €200,000',
    timeToRemediate: '4–8 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (inputs.dataIntegrity <= 2) e.push('Strong data integrity controls in place');
      else { g.push(`Data integrity risk elevated (${inputs.dataIntegrity}/5)`); r.push('Implement data quality monitoring and validation pipelines'); }
      if (inputs.algorithmicBias <= 2) e.push('Bias mitigation measures implemented');
      else { g.push(`Algorithmic bias risk elevated (${inputs.algorithmicBias}/5)`); r.push('Conduct bias testing across protected characteristics'); }
      if (inputs.modelDrift <= 2) e.push('Model drift monitoring active');
      else { g.push('Model drift risk indicates data staleness'); r.push('Implement continuous data freshness monitoring'); }
      return assess(e, g, r);
    },
  },
  {
    article: 'Article 13',
    title: 'Transparency and Information',
    description: 'AI systems shall be designed to ensure sufficient transparency for users to interpret output and use appropriately.',
    priority: 'high',
    estimatedCost: '€60,000 – €120,000',
    timeToRemediate: '3–5 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (inputs.explainabilityGap <= 2) e.push('System provides interpretable outputs');
      else { g.push(`Explainability gap is significant (${inputs.explainabilityGap}/5)`); r.push('Implement explainable AI (XAI) techniques'); }
      if (inputs.humanCheckpoints >= 3) e.push('Human oversight enables interpretability');
      else { g.push('Limited human checkpoints reduce transparency'); r.push('Add human review checkpoints for major decisions'); }
      if (inputs.shadowAI <= 2) e.push('AI usage is documented and visible');
      else { g.push(`Shadow AI risk reduces organizational transparency (${inputs.shadowAI}/5)`); r.push('Audit and document all AI system usage'); }
      return assess(e, g, r);
    },
  },
  {
    article: 'Article 14',
    title: 'Human Oversight',
    description: 'High-risk AI systems shall be designed to enable effective oversight by natural persons with competence and authority.',
    priority: 'critical',
    estimatedCost: '€40,000 – €100,000',
    timeToRemediate: '2–4 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (inputs.humanCheckpoints >= 4) { e.push(`Strong human oversight (${inputs.humanCheckpoints}/5)`); e.push('Multiple review checkpoints implemented'); }
      else if (inputs.humanCheckpoints >= 2) { g.push(`Moderate human oversight (${inputs.humanCheckpoints}/5) — insufficient for high-risk AI`); r.push('Add minimum 2 additional human review layers'); }
      else { g.push(`CRITICAL: Minimal human oversight (${inputs.humanCheckpoints}/5)`); r.push('URGENT: Implement human-in-the-loop for all critical decisions'); }
      if (inputs.automation <= 3) e.push('Automation level allows human intervention');
      else { g.push('High automation reduces human control capability'); r.push('Require human approval for high-stakes decisions'); }
      if (inputs.executionAuthority <= 2) e.push('Limited AI execution authority preserves human control');
      else { g.push(`AI execution authority is high (${inputs.executionAuthority}/5)`); r.push('Reduce autonomous execution scope'); }
      return assess(e, g, r);
    },
  },
  {
    article: 'Article 15',
    title: 'Accuracy, Robustness and Cybersecurity',
    description: 'Achieve appropriate levels of accuracy, robustness, and cybersecurity throughout the lifecycle.',
    priority: 'critical',
    estimatedCost: '€100,000 – €250,000',
    timeToRemediate: '6–12 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (inputs.adversarialAttack <= 2) e.push('Adversarial robustness measures in place');
      else { g.push(`Adversarial attack vulnerability elevated (${inputs.adversarialAttack}/5)`); r.push('Implement adversarial testing and model hardening'); }
      if (inputs.promptInjection <= 2) e.push('Prompt injection protections active');
      else { g.push(`Prompt injection risk is significant (${inputs.promptInjection}/5)`); r.push('Deploy input sanitization and prompt firewalls'); }
      if (inputs.dataPoisoning <= 2) e.push('Data pipeline integrity maintained');
      else { g.push('Data poisoning risk threatens model accuracy'); r.push('Implement data provenance tracking and validation'); }
      const providerCount = inputs.providers?.length || 1;
      if (providerCount >= 3) e.push('Multi-provider architecture enhances robustness');
      else { g.push('Single-provider dependency creates robustness risk'); r.push('Add provider redundancy for critical systems'); }
      return assess(e, g, r);
    },
  },
  {
    article: 'Article 26',
    title: 'Deployer Obligations',
    description: 'Deployers must assign human oversight to competent persons, monitor systems, and retain logs for 6+ months.',
    priority: 'high',
    estimatedCost: '€75,000 – €180,000',
    timeToRemediate: '4–8 months',
    checkFunction: (inputs, results) => {
      const e: string[] = [], g: string[] = [], r: string[] = [];
      if (inputs.oversightLevel >= 4) e.push('Strong oversight assignment to competent persons');
      else { g.push(`Oversight assignment insufficient (${inputs.oversightLevel}/5)`); r.push('Assign dedicated AI oversight personnel'); }
      if (inputs.reviewCadence >= 3) e.push('Monitoring cadence supports log retention');
      else { g.push('Review cadence may not support 6-month log retention'); r.push('Implement automated logging with 6-month minimum retention'); }
      if (inputs.sunsetPolicy >= 3) e.push('System lifecycle management processes exist');
      else { g.push(`Sunset policy insufficient (${inputs.sunsetPolicy}/5)`); r.push('Define explicit system lifecycle and decommissioning policy'); }
      return assess(e, g, r);
    },
  },
];

export interface ComplianceSummary {
  overallStatus: ComplianceStatus;
  overallScore: number;
  compliantCount: number;
  partialCount: number;
  nonCompliantCount: number;
  totalGaps: number;
  criticalGaps: string[];
  remediationCostRange: string;
  timeToCompliance: string;
  penaltyRisk: string;
}

export function calculateComplianceSummary(inputs: ExposureInputs, results: AnalysisResults): ComplianceSummary {
  const assessments = EU_AI_ACT_REQUIREMENTS.map(r => r.checkFunction(inputs, results));
  const compliantCount = assessments.filter(a => a.status === 'compliant').length;
  const partialCount = assessments.filter(a => a.status === 'partial').length;
  const nonCompliantCount = assessments.filter(a => a.status === 'non-compliant').length;
  const avgScore = assessments.reduce((s, a) => s + a.score, 0) / assessments.length;
  const overallStatus: ComplianceStatus = avgScore >= 80 ? 'compliant' : avgScore >= 50 ? 'partial' : 'non-compliant';
  const allGaps = assessments.flatMap(a => a.gaps);
  const criticalGaps = EU_AI_ACT_REQUIREMENTS
    .filter(r => r.priority === 'critical')
    .flatMap(r => r.checkFunction(inputs, results).gaps);

  const needsWork = EU_AI_ACT_REQUIREMENTS.filter((_, i) => assessments[i].status !== 'compliant');
  const costMin = needsWork.reduce((s, r) => { const m = r.estimatedCost.match(/€([\d,.]+)/); return s + (m ? parseInt(m[1].replace(/[.,]/g, '')) : 0); }, 0);
  const costMax = needsWork.reduce((s, r) => { const m = r.estimatedCost.match(/€[\d,.]+ – €([\d,.]+)/); return s + (m ? parseInt(m[1].replace(/[.,]/g, '')) : 0); }, 0);

  return {
    overallStatus, overallScore: avgScore,
    compliantCount, partialCount, nonCompliantCount,
    totalGaps: allGaps.length,
    criticalGaps,
    remediationCostRange: `€${(costMin / 1000).toFixed(0)}k – €${(costMax / 1000).toFixed(0)}k`,
    timeToCompliance: nonCompliantCount > 2 ? '6–12 months' : '3–6 months',
    penaltyRisk: criticalGaps.length > 0 ? '€15M – €35M (3–7% global revenue)' : nonCompliantCount > 0 ? '€7.5M – €15M (1.5–3% global revenue)' : '€0 (Compliant)',
  };
}

export function getStatusColor(s: ComplianceStatus) {
  return s === 'compliant' ? 'text-stable' : s === 'partial' ? 'text-sensitive' : s === 'non-compliant' ? 'text-fragile' : 'text-muted-foreground';
}
export function getStatusBg(s: ComplianceStatus) {
  return s === 'compliant' ? 'bg-stable-bg border-stable-border' : s === 'partial' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-fragile-bg border-fragile-border';
}
export function getStatusLabel(s: ComplianceStatus) {
  return s === 'compliant' ? '✓ Compliant' : s === 'partial' ? '⚠ Partial' : s === 'non-compliant' ? '✗ Non-Compliant' : 'N/A';
}
