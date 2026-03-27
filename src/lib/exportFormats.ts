/**
 * Export Formats — Structured data export for external system integration.
 * Produces JSON, CSV, and API payload formats.
 */
import { ExposureInputs, AnalysisResults } from './types';

interface PortfolioEntityExport {
  name: string;
  inputs: ExposureInputs;
  afi: number;
  band: string;
  weight: number;
}

export function exportToStructuredJSON(
  inputs: ExposureInputs,
  results: AnalysisResults,
  portfolioData?: { pas?: number; sdr?: number; mcs?: number; cAFI?: number; accumulationBand?: string }
): object {
  return {
    _meta: {
      tool: 'ARIA — AI Risk & Insurability Assessment',
      version: 'AGAF v4.3.0',
      timestamp: new Date().toISOString(),
      schema_version: '1.0.0',
      disclaimer: 'Governance intelligence signal — not actuarially certified.',
    },
    entity: {
      name: inputs.companyName || 'Unknown',
      industry: inputs.industry,
      size: inputs.size,
      revenue: inputs.revenue,
      useCases: inputs.useCases,
      providers: inputs.providers,
    },
    afi_components: {
      delegation_ratio: results.components.dr,
      justificatory_density: results.components.jd,
      reversibility_cost: results.components.rc,
      continuation_density: results.components.cd,
      network_amplification: results.components.na,
    },
    risk_indices: {
      afi: results.afi,
      band: results.band,
      structural_score: results.structuralScore,
      agri: results.agri,
      alri: results.alri,
      scri: results.scri,
      cai: results.cai,
      composite_risk_index: results.compositeRiskIndex,
      correlation_factor: results.correlationFactor,
      mdr: results.mdr,
      rfsi: results.rfsi,
    },
    decision: {
      class: results.decisionClass,
      premium_band: results.premium.band,
      eci_tier: results.eciTier,
      eci_name: results.eciName,
      loss_envelope: results.lossEnvelope,
    },
    ...(portfolioData ? {
      accumulation: {
        pas: portfolioData.pas,
        sdr: portfolioData.sdr,
        mcs: portfolioData.mcs,
        correlated_afi: portfolioData.cAFI,
        band: portfolioData.accumulationBand,
      }
    } : {}),
  };
}

export function exportToCSV(entities: PortfolioEntityExport[]): string {
  const headers = [
    'Entity', 'Industry', 'Size', 'Revenue', 'AFI', 'Band', 'Weight',
    'Automation', 'Criticality', 'IntegrationDepth', 'ExecutionAuthority',
    'OversightLevel', 'ReviewCadence', 'MultiAgent', 'HumanCheckpoints',
    'CloudConcentration', 'ModelConcentration', 'Providers',
  ];

  const rows = entities.map(e => [
    `"${e.name}"`,
    `"${e.inputs.industry}"`,
    `"${e.inputs.size}"`,
    `"${e.inputs.revenue}"`,
    e.afi.toFixed(2),
    e.band,
    e.weight,
    e.inputs.automation,
    e.inputs.criticality,
    e.inputs.integrationDepth,
    e.inputs.executionAuthority,
    e.inputs.oversightLevel,
    e.inputs.reviewCadence,
    e.inputs.multiAgent,
    e.inputs.humanCheckpoints,
    e.inputs.cloudConcentration,
    e.inputs.modelConcentration,
    `"${e.inputs.providers.join('; ')}"`,
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

export function generateAPIPayload(inputs: ExposureInputs, results: AnalysisResults): object {
  return {
    schema_version: '1.0.0',
    request_id: `aria-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    entity: inputs.companyName || 'Unknown',
    assessment: {
      afi: results.afi,
      band: results.band,
      decision_class: results.decisionClass,
      structural_score: results.structuralScore,
      indices: {
        agri: results.agri,
        alri: results.alri,
        scri: results.scri,
        cai: results.cai,
        composite: results.compositeRiskIndex,
      },
      components: results.components,
      loss_envelope: results.lossEnvelope,
      premium_band: results.premium.band,
    },
  };
}
