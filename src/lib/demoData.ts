import { DemoProfile, ExposureInputs } from './types';
import { DEFAULT_INPUTS } from './constants';

export const DEMO_PROFILES: DemoProfile[] = [
  {
    name: 'Meridian Financial Group',
    industry: 'Financial Services',
    useCases: ['Decision Support', 'Autonomous Operations', 'Fraud Detection'],
    providers: ['OpenAI', 'Azure OpenAI'],
    sliders: {
      automation: 4, criticality: 5, integrationDepth: 4, workflowBreadth: 4,
      executionAuthority: 4, actionDensity: 3, toolCallScope: 4, oversightLevel: 2,
      reviewCadence: 2, sunsetPolicy: 1, switchingCost: 4, portability: 4,
      multiAgent: 3, toolCallAuthority: 4, persistentMemory: 2, humanCheckpoints: 2,
    },
    note: 'High-frequency autonomous trading decisions, deeply integrated with core banking infrastructure, minimal human oversight cadence.',
    band: 'Fragile',
    premiumEstimate: '€420k–€680k',
    icon: '🏦',
  },
  {
    name: 'HealthPath AI',
    industry: 'Healthcare',
    useCases: ['Risk Assessment', 'Document Processing', 'Compliance Monitoring'],
    providers: ['Anthropic', 'Google DeepMind'],
    sliders: {
      automation: 4, criticality: 5, integrationDepth: 3, workflowBreadth: 3,
      executionAuthority: 3, actionDensity: 3, toolCallScope: 3, oversightLevel: 2,
      reviewCadence: 3, sunsetPolicy: 2, switchingCost: 3, portability: 3,
      multiAgent: 1, toolCallAuthority: 2, persistentMemory: 1, humanCheckpoints: 4,
    },
    note: 'Clinical decision support with partial human-in-the-loop. High criticality with two-provider diversification.',
    band: 'Sensitive',
    premiumEstimate: '€180k–€320k',
    icon: '🏥',
  },
  {
    name: 'CivicAI Gov',
    industry: 'Government',
    useCases: ['Document Processing', 'Compliance Monitoring'],
    providers: ['Custom / In-House'],
    sliders: {
      automation: 2, criticality: 3, integrationDepth: 2, workflowBreadth: 2,
      executionAuthority: 1, actionDensity: 1, toolCallScope: 2, oversightLevel: 5,
      reviewCadence: 5, sunsetPolicy: 4, switchingCost: 2, portability: 2,
      multiAgent: 1, toolCallAuthority: 1, persistentMemory: 1, humanCheckpoints: 5,
    },
    note: 'Public-sector drafting assistant with quarterly re-authorisation, comprehensive human oversight, in-house model.',
    band: 'Stable',
    premiumEstimate: '€45k–€90k',
    icon: '🏛️',
  },
];

export function applyDemoProfile(profile: DemoProfile): ExposureInputs {
  return {
    ...DEFAULT_INPUTS,
    companyName: profile.name,
    industry: profile.industry,
    useCases: profile.useCases,
    providers: profile.providers,
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
  };
}
