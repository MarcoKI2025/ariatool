/**
 * Case Study Library
 * 8 realistic AI deployment profiles for benchmarking and demonstration.
 */
import { ExposureInputs } from '@/lib/types';
import { DEFAULT_INPUTS } from '@/lib/constants';

export interface CaseStudy {
  id: string;
  name: string;
  sector: string;
  icon: string;
  description: string;
  keyVulnerability: string;
  mitigationHint: string;
  inputs: ExposureInputs;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'bank-compliance',
    name: 'RegBank AG — AI Compliance Workflow',
    sector: 'Financial Services',
    icon: '🏦',
    description: 'Large European bank using AI for regulatory compliance screening, AML transaction monitoring, and KYC document verification across 12 jurisdictions.',
    keyVulnerability: 'Single model provider for all compliance workflows — provider failure halts regulatory reporting across all jurisdictions simultaneously.',
    mitigationHint: 'Diversify model providers per jurisdiction and implement manual fallback for critical compliance deadlines.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'RegBank AG', industry: 'Financial Services', size: 'Large Enterprise (10000+)', revenue: '€500M–€5B', useCases: ['Compliance Monitoring', 'Fraud Detection', 'Document Processing', 'Risk Assessment'], providers: ['Azure OpenAI'], automation: 4, criticality: 5, integrationDepth: 4, workflowBreadth: 4, executionAuthority: 3, actionDensity: 4, toolCallScope: 3, oversightLevel: 4, reviewCadence: 4, sunsetPolicy: 2, switchingCost: 5, portability: 2, multiAgent: 2, toolCallAuthority: 2, persistentMemory: 3, humanCheckpoints: 3, hallucinationLiability: 4, deepfakeFraud: 2, promptInjection: 3, modelDrift: 3, algorithmicBias: 3, shadowAI: 4, explainabilityGap: 4, dataIntegrity: 3, esgLiability: 2, dataPoisoning: 2, adversarialAttack: 2, privacyBreach: 3, ipInfringement: 1, cloudConcentration: 5, modelConcentration: 5, gpuConcentration: 4, crossVendorContagion: 4 },
  },
  {
    id: 'insurance-claims',
    name: 'ClaimsFirst Insurance — AI Claims Routing',
    sector: 'Insurance',
    icon: '🛡',
    description: 'Mid-size insurer using AI to triage, route, and pre-assess claims. System auto-approves claims under €5,000 and flags complex cases for human review.',
    keyVulnerability: 'Auto-approval threshold creates liability exposure — hallucinated damage assessments could approve fraudulent claims at scale.',
    mitigationHint: 'Add human review sampling for auto-approved claims and implement anomaly detection on approval patterns.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'ClaimsFirst Insurance', industry: 'Insurance', size: 'Enterprise (1000–10000)', revenue: '€500M–€5B', useCases: ['Decision Support', 'Document Processing', 'Fraud Detection'], providers: ['OpenAI', 'Anthropic'], automation: 4, criticality: 4, integrationDepth: 4, workflowBreadth: 3, executionAuthority: 4, actionDensity: 4, toolCallScope: 3, oversightLevel: 3, reviewCadence: 3, sunsetPolicy: 3, switchingCost: 4, portability: 3, multiAgent: 1, toolCallAuthority: 2, persistentMemory: 2, humanCheckpoints: 2, hallucinationLiability: 4, deepfakeFraud: 3, promptInjection: 2, modelDrift: 3, algorithmicBias: 4, shadowAI: 3, explainabilityGap: 3, dataIntegrity: 3, esgLiability: 2, dataPoisoning: 1, adversarialAttack: 2, privacyBreach: 3, ipInfringement: 1, cloudConcentration: 3, modelConcentration: 3, gpuConcentration: 3, crossVendorContagion: 3 },
  },
  {
    id: 'saas-support',
    name: 'SupportAI Corp — Customer Support AI',
    sector: 'Technology',
    icon: '💬',
    description: 'SaaS platform with AI handling 85% of customer support — refunds, account changes, and escalations. Agent system processes 50k tickets/day autonomously.',
    keyVulnerability: 'High execution authority with autonomous refund capability — prompt injection could trigger mass unauthorised refunds.',
    mitigationHint: 'Cap autonomous refund authority, add velocity checks, and implement prompt injection detection layer.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'SupportAI Corp', industry: 'Technology', size: 'Mid-Market (250–1000)', revenue: '€50M–€500M', useCases: ['Customer Service Automation', 'Decision Support', 'Document Processing'], providers: ['OpenAI', 'Anthropic'], automation: 5, criticality: 3, integrationDepth: 4, workflowBreadth: 3, executionAuthority: 5, actionDensity: 5, toolCallScope: 4, oversightLevel: 2, reviewCadence: 2, sunsetPolicy: 3, switchingCost: 3, portability: 3, multiAgent: 3, toolCallAuthority: 4, persistentMemory: 4, humanCheckpoints: 1, hallucinationLiability: 3, deepfakeFraud: 1, promptInjection: 4, modelDrift: 2, algorithmicBias: 2, shadowAI: 2, explainabilityGap: 3, dataIntegrity: 2, esgLiability: 1, dataPoisoning: 2, adversarialAttack: 3, privacyBreach: 2, ipInfringement: 1, cloudConcentration: 3, modelConcentration: 3, gpuConcentration: 2, crossVendorContagion: 2 },
  },
  {
    id: 'gov-documents',
    name: 'GovTech Solutions — Document Automation',
    sector: 'Government',
    icon: '🏛',
    description: 'Government contractor using AI for permit processing, document classification, and citizen correspondence generation across 4 federal agencies.',
    keyVulnerability: 'Low portability and government lock-in — switching cost extremely high due to security clearance requirements and data sovereignty constraints.',
    mitigationHint: 'Negotiate multi-vendor framework agreements and ensure all models operate within sovereign cloud infrastructure.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'GovTech Solutions', industry: 'Government', size: 'Enterprise (1000–10000)', revenue: '€50M–€500M', useCases: ['Document Processing', 'Decision Support', 'Compliance Monitoring'], providers: ['Azure OpenAI'], automation: 3, criticality: 4, integrationDepth: 3, workflowBreadth: 3, executionAuthority: 2, actionDensity: 3, toolCallScope: 2, oversightLevel: 4, reviewCadence: 4, sunsetPolicy: 2, switchingCost: 5, portability: 1, multiAgent: 1, toolCallAuthority: 1, persistentMemory: 2, humanCheckpoints: 4, hallucinationLiability: 3, deepfakeFraud: 1, promptInjection: 2, modelDrift: 2, algorithmicBias: 3, shadowAI: 2, explainabilityGap: 4, dataIntegrity: 3, esgLiability: 3, dataPoisoning: 2, adversarialAttack: 3, privacyBreach: 4, ipInfringement: 1, cloudConcentration: 5, modelConcentration: 5, gpuConcentration: 4, crossVendorContagion: 3 },
  },
  {
    id: 'healthcare-triage',
    name: 'MedAssist Health — AI Triage Support',
    sector: 'Healthcare',
    icon: '🏥',
    description: 'Healthcare network using AI for patient triage, symptom assessment, and care pathway routing. System processes 200k patient interactions/month.',
    keyVulnerability: 'Algorithmic bias in triage scoring could systematically deprioritise vulnerable patient groups — creating both clinical and regulatory liability.',
    mitigationHint: 'Implement demographic parity monitoring, regular bias audits, and mandatory human override for all critical triage decisions.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'MedAssist Health', industry: 'Healthcare', size: 'Enterprise (1000–10000)', revenue: '€500M–€5B', useCases: ['Decision Support', 'Risk Assessment', 'Predictive Analytics'], providers: ['Google DeepMind', 'Azure OpenAI'], automation: 3, criticality: 5, integrationDepth: 4, workflowBreadth: 3, executionAuthority: 2, actionDensity: 3, toolCallScope: 2, oversightLevel: 4, reviewCadence: 4, sunsetPolicy: 3, switchingCost: 4, portability: 2, multiAgent: 1, toolCallAuthority: 1, persistentMemory: 3, humanCheckpoints: 4, hallucinationLiability: 5, deepfakeFraud: 1, promptInjection: 2, modelDrift: 4, algorithmicBias: 5, shadowAI: 3, explainabilityGap: 5, dataIntegrity: 4, esgLiability: 3, dataPoisoning: 2, adversarialAttack: 2, privacyBreach: 5, ipInfringement: 1, cloudConcentration: 3, modelConcentration: 3, gpuConcentration: 2, crossVendorContagion: 2 },
  },
  {
    id: 'legal-contracts',
    name: 'LexAI Partners — Contract Review AI',
    sector: 'Legal',
    icon: '⚖',
    description: 'Law firm using AI for contract analysis, clause extraction, risk flagging, and due diligence document review. Processes 500+ contracts/week.',
    keyVulnerability: 'Hallucination risk in contract interpretation — AI may fabricate clause references or misinterpret legal obligations, creating professional liability.',
    mitigationHint: 'Implement mandatory attorney review for all AI-generated contract summaries and add source citation verification.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'LexAI Partners', industry: 'Legal', size: 'SME (50–250)', revenue: '€10M–€50M', useCases: ['Document Processing', 'Decision Support', 'Risk Assessment'], providers: ['Anthropic', 'OpenAI'], automation: 3, criticality: 4, integrationDepth: 3, workflowBreadth: 2, executionAuthority: 2, actionDensity: 3, toolCallScope: 2, oversightLevel: 4, reviewCadence: 3, sunsetPolicy: 3, switchingCost: 3, portability: 3, multiAgent: 1, toolCallAuthority: 1, persistentMemory: 2, humanCheckpoints: 4, hallucinationLiability: 5, deepfakeFraud: 2, promptInjection: 2, modelDrift: 3, algorithmicBias: 2, shadowAI: 2, explainabilityGap: 4, dataIntegrity: 3, esgLiability: 1, dataPoisoning: 1, adversarialAttack: 1, privacyBreach: 4, ipInfringement: 3, cloudConcentration: 2, modelConcentration: 2, gpuConcentration: 2, crossVendorContagion: 2 },
  },
  {
    id: 'ecommerce-refunds',
    name: 'ShopFlow — AI Refunds Automation',
    sector: 'Retail / E-Commerce',
    icon: '🛒',
    description: 'E-commerce platform with AI handling 90% of returns/refunds automatically. System integrates with payment processors, logistics, and customer profiles.',
    keyVulnerability: 'Autonomous financial transactions without human approval — adversarial actors can exploit refund logic through coordinated prompt injection.',
    mitigationHint: 'Set hard financial limits on autonomous refunds, add velocity-based fraud detection, and require human approval above threshold.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'ShopFlow', industry: 'Retail / E-Commerce', size: 'Mid-Market (250–1000)', revenue: '€50M–€500M', useCases: ['Customer Service Automation', 'Decision Support', 'Fraud Detection'], providers: ['OpenAI'], automation: 5, criticality: 3, integrationDepth: 5, workflowBreadth: 4, executionAuthority: 5, actionDensity: 5, toolCallScope: 5, oversightLevel: 2, reviewCadence: 2, sunsetPolicy: 2, switchingCost: 4, portability: 2, multiAgent: 2, toolCallAuthority: 4, persistentMemory: 3, humanCheckpoints: 1, hallucinationLiability: 2, deepfakeFraud: 2, promptInjection: 4, modelDrift: 2, algorithmicBias: 2, shadowAI: 3, explainabilityGap: 2, dataIntegrity: 2, esgLiability: 1, dataPoisoning: 2, adversarialAttack: 4, privacyBreach: 3, ipInfringement: 1, cloudConcentration: 4, modelConcentration: 4, gpuConcentration: 3, crossVendorContagion: 3 },
  },
  {
    id: 'enterprise-procurement',
    name: 'ProcureAI Systems — Procurement Agent',
    sector: 'Technology',
    icon: '📦',
    description: 'Enterprise procurement system using multi-agent AI for vendor evaluation, purchase order generation, contract negotiation, and spend analytics.',
    keyVulnerability: 'Multi-agent system with persistent memory and high tool-call authority — agents can autonomously commit financial obligations without adequate human review.',
    mitigationHint: 'Implement mandatory human approval for all commitments above €10k, add agent action logging, and limit persistent memory scope.',
    inputs: { ...DEFAULT_INPUTS, companyName: 'ProcureAI Systems', industry: 'Technology', size: 'Enterprise (1000–10000)', revenue: '€500M–€5B', useCases: ['Autonomous Operations', 'Decision Support', 'Document Processing', 'Predictive Analytics'], providers: ['OpenAI', 'Anthropic', 'AWS Bedrock'], automation: 5, criticality: 4, integrationDepth: 5, workflowBreadth: 5, executionAuthority: 5, actionDensity: 5, toolCallScope: 5, oversightLevel: 2, reviewCadence: 2, sunsetPolicy: 2, switchingCost: 4, portability: 2, multiAgent: 5, toolCallAuthority: 5, persistentMemory: 5, humanCheckpoints: 2, hallucinationLiability: 3, deepfakeFraud: 1, promptInjection: 3, modelDrift: 3, algorithmicBias: 2, shadowAI: 4, explainabilityGap: 4, dataIntegrity: 3, esgLiability: 2, dataPoisoning: 2, adversarialAttack: 3, privacyBreach: 2, ipInfringement: 2, cloudConcentration: 3, modelConcentration: 3, gpuConcentration: 2, crossVendorContagion: 3 },
  },
];
