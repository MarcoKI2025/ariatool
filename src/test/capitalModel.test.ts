import { describe, it, expect } from 'vitest';
import { estimateLossRange, estimateCapitalStress, estimateOperationalImpact } from '../lib/capitalModel';
import { computeFullAnalysis } from '../lib/scoring';
import { DEFAULT_INPUTS } from '../lib/constants';
import { ExposureInputs } from '../lib/types';

function makeInputs(overrides: Partial<ExposureInputs> = {}): ExposureInputs {
  return { ...DEFAULT_INPUTS, size: 'Mid-Market (250–1000)', revenue: '€50M–€500M', ...overrides } as ExposureInputs;
}

describe('estimateLossRange', () => {
  it('returns positive loss values in correct order (low < mid < high)', () => {
    const inputs = makeInputs();
    const results = computeFullAnalysis(inputs);
    const range = estimateLossRange(inputs, results);
    expect(range.low).toBeGreaterThan(0);
    expect(range.mid).toBeGreaterThan(range.low);
    expect(range.high).toBeGreaterThan(range.mid);
  });

  it('produces higher losses for fragile profiles', () => {
    const safeInputs = makeInputs({ automation: 1, executionAuthority: 1, oversightLevel: 5 });
    const riskyInputs = makeInputs({ automation: 5, executionAuthority: 5, oversightLevel: 1 });
    const safeRange = estimateLossRange(safeInputs, computeFullAnalysis(safeInputs));
    const riskyRange = estimateLossRange(riskyInputs, computeFullAnalysis(riskyInputs));
    expect(riskyRange.high).toBeGreaterThan(safeRange.high);
  });
});

describe('estimateCapitalStress', () => {
  it('returns a score between 0 and 100', () => {
    const inputs = makeInputs();
    const { score } = estimateCapitalStress(inputs, computeFullAnalysis(inputs));
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns valid stress levels', () => {
    const inputs = makeInputs();
    const { level } = estimateCapitalStress(inputs, computeFullAnalysis(inputs));
    expect(['Low', 'Moderate', 'Significant', 'Severe']).toContain(level);
  });
});

describe('estimateOperationalImpact', () => {
  it('returns valid impact labels', () => {
    const inputs = makeInputs();
    const { impact } = estimateOperationalImpact(inputs, computeFullAnalysis(inputs));
    expect(['Minimal', 'Elevated', 'Critical', 'Systemic']).toContain(impact);
  });
});
