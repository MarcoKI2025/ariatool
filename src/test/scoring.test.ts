import { describe, it, expect } from 'vitest';
import { calcAFI, getBand, getDecisionClass, computeAFIComponents, computeFullAnalysis } from '../lib/scoring';
import { DEFAULT_INPUTS } from '../lib/constants';
import { ExposureInputs } from '../lib/types';

function makeInputs(overrides: Partial<ExposureInputs> = {}): ExposureInputs {
  return { ...DEFAULT_INPUTS, ...overrides } as ExposureInputs;
}

describe('calcAFI', () => {
  it('returns higher AFI when delegation is high and oversight is low', () => {
    const highRisk = calcAFI(0.9, 0.2, 0.8, 0.7, 0.5);
    const lowRisk = calcAFI(0.3, 0.8, 0.3, 0.3, 0.5);
    expect(highRisk).toBeGreaterThan(lowRisk);
  });

  it('returns a finite positive number', () => {
    const result = calcAFI(0.5, 0.5, 0.5, 0.5, 0.5);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('handles edge case of zero oversight gracefully (no division by zero)', () => {
    const result = calcAFI(1.0, 0.0, 1.0, 1.0, 0.0);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getBand', () => {
  it('returns Stable for low AFI', () => {
    expect(getBand(0.3)).toBe('Stable');
  });

  it('returns Sensitive for mid AFI', () => {
    expect(getBand(1.0)).toBe('Sensitive');
  });

  it('returns Fragile for high AFI', () => {
    expect(getBand(2.0)).toBe('Fragile');
  });
});

describe('getDecisionClass', () => {
  it('maps bands to correct decision classes', () => {
    expect(getDecisionClass('Stable')).toBe('Approved');
    expect(getDecisionClass('Sensitive')).toBe('Conditional Review');
    expect(getDecisionClass('Fragile')).toBe('Escalate to Committee');
  });
});

describe('computeAFIComponents', () => {
  it('produces components between 0 and 1', () => {
    const components = computeAFIComponents(makeInputs());
    expect(components.dr).toBeGreaterThanOrEqual(0);
    expect(components.dr).toBeLessThanOrEqual(1);
    expect(components.jd).toBeGreaterThanOrEqual(0);
    expect(components.jd).toBeLessThanOrEqual(1);
    expect(components.rc).toBeGreaterThanOrEqual(0);
    expect(components.rc).toBeLessThanOrEqual(1);
    expect(components.cd).toBeGreaterThanOrEqual(0);
    expect(components.cd).toBeLessThanOrEqual(1);
  });

  it('increases DR when automation is maxed', () => {
    const low = computeAFIComponents(makeInputs({ automation: 1, executionAuthority: 1 }));
    const high = computeAFIComponents(makeInputs({ automation: 5, executionAuthority: 5 }));
    expect(high.dr).toBeGreaterThan(low.dr);
  });
});

describe('computeFullAnalysis', () => {
  it('returns a complete result object', () => {
    const result = computeFullAnalysis(makeInputs());
    expect(result).toHaveProperty('afi');
    expect(result).toHaveProperty('band');
    expect(result).toHaveProperty('decisionClass');
    expect(result).toHaveProperty('components');
    expect(result).toHaveProperty('compositeRiskIndex');
    expect(result).toHaveProperty('agri');
    expect(result).toHaveProperty('alri');
    expect(result).toHaveProperty('scri');
  });

  it('produces higher AFI for high-risk configurations', () => {
    const safe = computeFullAnalysis(makeInputs({
      automation: 1, executionAuthority: 1, oversightLevel: 5, humanCheckpoints: 5,
    }));
    const risky = computeFullAnalysis(makeInputs({
      automation: 5, executionAuthority: 5, oversightLevel: 1, humanCheckpoints: 1,
    }));
    expect(risky.afi).toBeGreaterThan(safe.afi);
  });
});
