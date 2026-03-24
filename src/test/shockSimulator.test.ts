import { describe, it, expect } from 'vitest';
import { simulateProviderFailure, simulateGovernanceFailure, simulateOversightShock } from '../lib/shockSimulator';
import { computeFullAnalysis } from '../lib/scoring';
import { DEFAULT_INPUTS } from '../lib/constants';
import { ExposureInputs } from '../lib/types';

function makeInputs(overrides: Partial<ExposureInputs> = {}): ExposureInputs {
  return { ...DEFAULT_INPUTS, size: 'Mid-Market (250–1000)', revenue: '€50M–€500M', ...overrides } as ExposureInputs;
}

describe('simulateProviderFailure', () => {
  it('produces a valid shock result with meaningful key changes', () => {
    const inputs = makeInputs();
    const base = computeFullAnalysis(inputs);
    const shock = simulateProviderFailure(inputs, base);
    expect(shock.keyChanges.length).toBeGreaterThan(0);
    expect(shock.label).toBe('Model Provider Failure');
    expect(Number.isFinite(shock.shockedAFI)).toBe(true);
    expect(Number.isFinite(shock.afiDelta)).toBe(true);
  });
});

describe('simulateGovernanceFailure', () => {
  it('increases AFI when governance collapses', () => {
    const inputs = makeInputs({ oversightLevel: 4, reviewCadence: 4 });
    const base = computeFullAnalysis(inputs);
    const shock = simulateGovernanceFailure(inputs, base);
    expect(shock.shockedAFI).toBeGreaterThan(shock.baselineAFI);
  });
});

describe('simulateOversightShock', () => {
  it('produces a valid shock result with key changes', () => {
    const inputs = makeInputs();
    const base = computeFullAnalysis(inputs);
    const shock = simulateOversightShock(inputs, base);
    expect(shock.keyChanges.length).toBeGreaterThan(0);
    expect(shock.label).toBe('Oversight Collapse');
  });
});
