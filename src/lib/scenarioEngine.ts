/**
 * Scenario Engine
 * Clean separation of scenario logic from UI components.
 * Applies parameter modifications and recalculates AFI.
 */
import { ExposureInputs, AnalysisResults } from './types';
import { computeFullAnalysis } from './scoring';

export interface ScenarioPatch {
  label: string;
  description: string;
  icon: string;
  changes: Partial<ExposureInputs>;
}

export interface ScenarioResult {
  label: string;
  icon: string;
  description: string;
  baseResults: AnalysisResults;
  scenarioResults: AnalysisResults;
  delta: {
    afi: number;
    compositeRiskIndex: number;
    agri: number;
    alri: number;
    scri: number;
  };
  bandChange: { from: string; to: string; changed: boolean };
  decisionChange: { from: string; to: string; changed: boolean };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Apply a set of input changes and recalculate, returning the delta */
export function runScenario(
  baseInputs: ExposureInputs,
  baseResults: AnalysisResults,
  patch: ScenarioPatch
): ScenarioResult {
  const modified: ExposureInputs = { ...baseInputs };

  // Apply numeric changes with clamping
  for (const [key, value] of Object.entries(patch.changes)) {
    if (typeof value === 'number') {
      (modified as any)[key] = clamp(value, 1, 5);
    } else if (Array.isArray(value)) {
      (modified as any)[key] = value;
    } else if (typeof value === 'string') {
      (modified as any)[key] = value;
    }
  }

  const scenarioResults = computeFullAnalysis(modified);

  return {
    label: patch.label,
    icon: patch.icon,
    description: patch.description,
    baseResults,
    scenarioResults,
    delta: {
      afi: parseFloat((scenarioResults.afi - baseResults.afi).toFixed(3)),
      compositeRiskIndex: scenarioResults.compositeRiskIndex - baseResults.compositeRiskIndex,
      agri: scenarioResults.agri - baseResults.agri,
      alri: scenarioResults.alri - baseResults.alri,
      scri: scenarioResults.scri - baseResults.scri,
    },
    bandChange: {
      from: baseResults.band,
      to: scenarioResults.band,
      changed: baseResults.band !== scenarioResults.band,
    },
    decisionChange: {
      from: baseResults.decisionClass,
      to: scenarioResults.decisionClass,
      changed: baseResults.decisionClass !== scenarioResults.decisionClass,
    },
  };
}

/** Compare two results and produce a summary delta object */
export function compareScenario(
  baseResults: AnalysisResults,
  scenarioResults: AnalysisResults
) {
  return {
    afiDelta: parseFloat((scenarioResults.afi - baseResults.afi).toFixed(3)),
    compositeDelta: scenarioResults.compositeRiskIndex - baseResults.compositeRiskIndex,
    bandChanged: baseResults.band !== scenarioResults.band,
    bandFrom: baseResults.band,
    bandTo: scenarioResults.band,
    decisionChanged: baseResults.decisionClass !== scenarioResults.decisionClass,
    decisionFrom: baseResults.decisionClass,
    decisionTo: scenarioResults.decisionClass,
  };
}

/** Pre-defined scenario patches */
export const STANDARD_SCENARIOS: ScenarioPatch[] = [
  {
    label: 'Increase Autonomy',
    icon: '🤖',
    description: 'Raise automation and execution authority to maximum levels.',
    changes: { automation: 5, executionAuthority: 5, actionDensity: 5 },
  },
  {
    label: 'Reduce Human Oversight',
    icon: '👁',
    description: 'Remove human checkpoints and reduce oversight to minimum.',
    changes: { oversightLevel: 1, humanCheckpoints: 1, reviewCadence: 1 },
  },
  {
    label: 'Add Agent Chain',
    icon: '🔗',
    description: 'Introduce multi-agent coordination with persistent memory.',
    changes: { multiAgent: 4, toolCallAuthority: 4, persistentMemory: 4 },
  },
  {
    label: 'Increase Provider Concentration',
    icon: '☁️',
    description: 'Maximise dependency on a single cloud and model provider.',
    changes: { cloudConcentration: 5, modelConcentration: 5, gpuConcentration: 5, crossVendorContagion: 5 },
  },
  {
    label: 'Improve Reversibility',
    icon: '🔄',
    description: 'Improve portability, reduce switching costs, strengthen sunset policy.',
    changes: { switchingCost: 1, portability: 5, sunsetPolicy: 5 },
  },
];
