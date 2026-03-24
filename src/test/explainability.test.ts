import { describe, it, expect } from 'vitest';
import { getScoreDrivers } from '../lib/explainability';
import { computeFullAnalysis } from '../lib/scoring';
import { DEFAULT_INPUTS } from '../lib/constants';
import { ExposureInputs } from '../lib/types';

function makeInputs(overrides: Partial<ExposureInputs> = {}): ExposureInputs {
  return { ...DEFAULT_INPUTS, ...overrides } as ExposureInputs;
}

describe('getScoreDrivers', () => {
  it('identifies risk drivers for high-risk profiles', () => {
    const inputs = makeInputs({ automation: 5, executionAuthority: 5, oversightLevel: 1 });
    const results = computeFullAnalysis(inputs);
    const { topRisks } = getScoreDrivers(inputs, results);
    expect(topRisks.length).toBeGreaterThan(0);
    expect(topRisks.every(r => r.type === 'risk')).toBe(true);
  });

  it('identifies stabilizers for well-governed profiles', () => {
    const inputs = makeInputs({ oversightLevel: 5, humanCheckpoints: 5, reviewCadence: 5, automation: 1 });
    const results = computeFullAnalysis(inputs);
    const { stabilizers } = getScoreDrivers(inputs, results);
    expect(stabilizers.length).toBeGreaterThan(0);
    expect(stabilizers.every(s => s.type === 'stabilizer')).toBe(true);
  });

  it('returns a non-empty summary', () => {
    const inputs = makeInputs();
    const results = computeFullAnalysis(inputs);
    const { summary } = getScoreDrivers(inputs, results);
    expect(summary.length).toBeGreaterThan(0);
  });
});
