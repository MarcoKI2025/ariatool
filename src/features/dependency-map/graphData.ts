import { DEMO_INSUREDS } from '@/data/demoScenario';
import { ExposureInputs } from '@/lib/types';

export interface DependencyNode {
  id: string;
  name: string;
  type: 'insured' | 'provider' | 'infrastructure';
  risk: 'low' | 'medium' | 'high' | 'critical';
  afi?: number;
  weight?: number;
  metadata?: {
    industry?: string;
    size?: string;
    revenue?: string;
    useCase?: string;
    companyName?: string;
  };
}

export interface DependencyEdge {
  source: string;
  target: string;
  strength: number;
  type: 'model' | 'cloud' | 'data';
}

export interface GraphData {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  stats: {
    totalInsureds: number;
    totalProviders: number;
    avgConnectionsPerInsured: number;
    maxConcentration: {
      provider: string;
      count: number;
      percentage: number;
    };
  };
}

function estimateAFI(inputs: ExposureInputs): number {
  const deployment = (inputs.automation + inputs.criticality + inputs.integrationDepth) / 15;
  const governance = (inputs.oversightLevel + inputs.reviewCadence) / 10;
  const concentration = (inputs.cloudConcentration + inputs.modelConcentration) / 10;
  return Math.min(100, ((deployment * 0.4 + concentration * 0.4) / (governance + 0.1)) * 50);
}

function afiToRisk(afi: number): 'low' | 'medium' | 'high' | 'critical' {
  if (afi < 25) return 'low';
  if (afi < 50) return 'medium';
  if (afi < 75) return 'high';
  return 'critical';
}

export function buildDependencyGraph(): GraphData {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];

  const providerMap: Record<string, string> = {
    'Azure OpenAI': 'azure-openai',
    'OpenAI': 'azure-openai',
    'GPT-4': 'azure-openai',
    'AWS': 'aws',
    'Amazon Web Services': 'aws',
    'Azure': 'azure',
    'Microsoft Azure': 'azure',
    'Google Cloud': 'gcp',
    'GCP': 'gcp',
  };

  const providerNodes: DependencyNode[] = [
    { id: 'azure-openai', name: 'Azure OpenAI (GPT-4)', type: 'provider', risk: 'critical', metadata: { companyName: 'Microsoft Azure OpenAI Service' } },
    { id: 'aws', name: 'AWS', type: 'infrastructure', risk: 'medium', metadata: { companyName: 'Amazon Web Services' } },
    { id: 'azure', name: 'Azure', type: 'infrastructure', risk: 'medium', metadata: { companyName: 'Microsoft Azure' } },
  ];

  nodes.push(...providerNodes);

  DEMO_INSUREDS.forEach(insured => {
    const afi = estimateAFI(insured.inputs);
    const risk = afiToRisk(afi);

    nodes.push({
      id: insured.id,
      name: insured.name,
      type: 'insured',
      risk,
      afi,
      weight: insured.weight,
      metadata: {
        industry: insured.industry,
        size: insured.size,
        revenue: insured.revenue,
        useCase: insured.aiUseCase,
        companyName: insured.name,
      },
    });

    insured.inputs.providers.forEach(provider => {
      const targetId = providerMap[provider] || provider.toLowerCase().replace(/\s+/g, '-');
      if (providerNodes.some(p => p.id === targetId)) {
        edges.push({
          source: insured.id,
          target: targetId,
          strength: insured.inputs.modelConcentration / 5,
          type: 'model',
        });
      }
    });

    const infra = insured.infrastructure?.toLowerCase();
    if (infra && providerNodes.some(p => p.id === infra)) {
      edges.push({
        source: insured.id,
        target: infra,
        strength: insured.inputs.cloudConcentration / 5,
        type: 'cloud',
      });
    }
  });

  const providerCounts: Record<string, number> = {};
  edges.forEach(edge => {
    providerCounts[edge.target] = (providerCounts[edge.target] || 0) + 1;
  });

  const maxEntry = Object.entries(providerCounts).sort((a, b) => b[1] - a[1])[0];
  const maxConcentration = maxEntry
    ? { provider: providerNodes.find(p => p.id === maxEntry[0])?.name || maxEntry[0], count: maxEntry[1], percentage: Math.round((maxEntry[1] / DEMO_INSUREDS.length) * 100) }
    : { provider: 'None', count: 0, percentage: 0 };

  return {
    nodes,
    edges,
    stats: {
      totalInsureds: DEMO_INSUREDS.length,
      totalProviders: providerNodes.length,
      avgConnectionsPerInsured: +(edges.length / DEMO_INSUREDS.length).toFixed(1),
      maxConcentration,
    },
  };
}
