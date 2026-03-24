import { describe, it, expect } from 'vitest';
import { runScenario, compareScenario, STANDARD_SCENARIOS } from '../lib/scenarioEngine';
import { computeFullAnalysis } from '../lib/scoring';
import { DEFAULT_INPUTS } from '../lib/constants';
import { ExposureInputs } from '../lib/types';

function makeInputs(overrides: Partial<ExposureInputs> = {}): ExposureInputs {
  return { ...DEFAULT_INPUTS, ...overrides } as ExposureInputs;
}

describe('runScenario', () => {
  it('calculates a delta for the "Increase Autonomy" scenario', () => {
    const inputs = makeInputs({ automation: 2, executionAuthority: 2 });
    const base = computeFullAnalysis(inputs);
    const result = runScenario(inputs, base, STANDARD_SCENARIOS[0]);
    expect(result.delta.afi).toBeGreaterThan(0);
    expect(result.scenarioResults.afi).toBeGreaterThan(base.afi);
  });

  it('reduces AFI for the "Improve Reversibility" scenario', () => {
    const inputs = makeInputs({ switchingCost: 4, portability: 2, sunsetPolicy: 2 });
    const base = computeFullAnalysis(inputs);
    const result = runScenario(inputs, base, STANDARD_SCENARIOS[4]);
    expect(result.delta.afi).toBeLessThan(0);
  });
});

describe('compareScenario', () => {
  it('detects band changes', () => {
    const safeInputs = makeInputs({ automation: 2, executionAuthority: 2, oversightLevel: 4 });
    const base = computeFullAnalysis(safeInputs);
    const riskyInputs = makeInputs({ automation: 5, executionAuthority: 5, oversightLevel: 1, humanCheckpoints: 1 });
    const scenario = computeFullAnalysis(riskyInputs);
    const comparison = compareScenario(base, scenario);
    expect(comparison.afiDelta).toBeGreaterThan(0);
    expect(typeof comparison.bandChanged).toBe('boolean');
  });
});

describe('STANDARD_SCENARIOS', () => {
  it('contains 5 pre-defined scenarios', () => {
    expect(STANDARD_SCENARIOS.length).toBe(5);
  });

  it('each scenario has required fields', () => {
    for (const s of STANDARD_SCENARIOS) {
      expect(s.label).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.icon).toBeTruthy();
      expect(Object.keys(s.changes).length).toBeGreaterThan(0);
    }
  });
});
