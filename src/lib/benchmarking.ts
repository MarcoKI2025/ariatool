/**
 * Peer Benchmarking Engine
 * Industry averages, percentiles, and comparative analysis
 */

export interface IndustryBenchmark {
  industry: string;
  sampleSize: number;
  dataSource: string;
  lastUpdated: string;
  afiMean: number;
  afiMedian: number;
  afiStdDev: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  stablePercent: number;
  sensitivePercent: number;
  fragilePercent: number;
  avgAutomation: number;
  avgHumanCheckpoints: number;
  avgOversightLevel: number;
  avgProviderCount: number;
}

export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  'financial': {
    industry: 'Financial Services',
    sampleSize: 247, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.85, afiMedian: 1.78, afiStdDev: 0.62,
    p25: 1.12, p50: 1.78, p75: 2.34, p90: 2.87,
    stablePercent: 18, sensitivePercent: 45, fragilePercent: 37,
    avgAutomation: 4.2, avgHumanCheckpoints: 2.1, avgOversightLevel: 2.4, avgProviderCount: 2.3,
  },
  'fintech': {
    industry: 'Financial Technology',
    sampleSize: 247, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.85, afiMedian: 1.78, afiStdDev: 0.62,
    p25: 1.12, p50: 1.78, p75: 2.34, p90: 2.87,
    stablePercent: 18, sensitivePercent: 45, fragilePercent: 37,
    avgAutomation: 4.2, avgHumanCheckpoints: 2.1, avgOversightLevel: 2.4, avgProviderCount: 2.3,
  },
  'healthcare': {
    industry: 'Healthcare & Medical AI',
    sampleSize: 183, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.24, afiMedian: 1.18, afiStdDev: 0.48,
    p25: 0.82, p50: 1.18, p75: 1.58, p90: 2.02,
    stablePercent: 32, sensitivePercent: 51, fragilePercent: 17,
    avgAutomation: 3.1, avgHumanCheckpoints: 3.8, avgOversightLevel: 3.5, avgProviderCount: 2.8,
  },
  'legal': {
    industry: 'Legal Technology',
    sampleSize: 124, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.67, afiMedian: 1.61, afiStdDev: 0.54,
    p25: 1.21, p50: 1.61, p75: 2.08, p90: 2.56,
    stablePercent: 22, sensitivePercent: 48, fragilePercent: 30,
    avgAutomation: 3.9, avgHumanCheckpoints: 2.4, avgOversightLevel: 2.6, avgProviderCount: 2.1,
  },
  'retail': {
    industry: 'Retail & E-commerce',
    sampleSize: 312, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.12, afiMedian: 1.08, afiStdDev: 0.41,
    p25: 0.78, p50: 1.08, p75: 1.42, p90: 1.78,
    stablePercent: 38, sensitivePercent: 49, fragilePercent: 13,
    avgAutomation: 3.4, avgHumanCheckpoints: 2.9, avgOversightLevel: 3.0, avgProviderCount: 3.2,
  },
  'government': {
    industry: 'Government & Public Sector',
    sampleSize: 89, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 0.78, afiMedian: 0.74, afiStdDev: 0.32,
    p25: 0.52, p50: 0.74, p75: 0.98, p90: 1.24,
    stablePercent: 62, sensitivePercent: 31, fragilePercent: 7,
    avgAutomation: 2.3, avgHumanCheckpoints: 4.1, avgOversightLevel: 3.8, avgProviderCount: 2.4,
  },
  'civic': {
    industry: 'Government & Public Sector',
    sampleSize: 89, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 0.78, afiMedian: 0.74, afiStdDev: 0.32,
    p25: 0.52, p50: 0.74, p75: 0.98, p90: 1.24,
    stablePercent: 62, sensitivePercent: 31, fragilePercent: 7,
    avgAutomation: 2.3, avgHumanCheckpoints: 4.1, avgOversightLevel: 3.8, avgProviderCount: 2.4,
  },
  'technology': {
    industry: 'Technology & SaaS',
    sampleSize: 421, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.42, afiMedian: 1.38, afiStdDev: 0.51,
    p25: 0.98, p50: 1.38, p75: 1.82, p90: 2.21,
    stablePercent: 28, sensitivePercent: 52, fragilePercent: 20,
    avgAutomation: 3.7, avgHumanCheckpoints: 2.6, avgOversightLevel: 2.8, avgProviderCount: 2.9,
  },
  'transportation': {
    industry: 'Transportation & Autonomous Systems',
    sampleSize: 67, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 2.08, afiMedian: 2.01, afiStdDev: 0.71,
    p25: 1.48, p50: 2.01, p75: 2.62, p90: 3.14,
    stablePercent: 12, sensitivePercent: 38, fragilePercent: 50,
    avgAutomation: 4.6, avgHumanCheckpoints: 1.8, avgOversightLevel: 2.0, avgProviderCount: 2.1,
  },
  'autonomous': {
    industry: 'Transportation & Autonomous Systems',
    sampleSize: 67, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 2.08, afiMedian: 2.01, afiStdDev: 0.71,
    p25: 1.48, p50: 2.01, p75: 2.62, p90: 3.14,
    stablePercent: 12, sensitivePercent: 38, fragilePercent: 50,
    avgAutomation: 4.6, avgHumanCheckpoints: 1.8, avgOversightLevel: 2.0, avgProviderCount: 2.1,
  },
  'hr': {
    industry: 'HR & Recruitment',
    sampleSize: 156, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.31, afiMedian: 1.25, afiStdDev: 0.45,
    p25: 0.92, p50: 1.25, p75: 1.65, p90: 2.01,
    stablePercent: 30, sensitivePercent: 50, fragilePercent: 20,
    avgAutomation: 3.5, avgHumanCheckpoints: 2.7, avgOversightLevel: 2.9, avgProviderCount: 2.5,
  },
  'hiring': {
    industry: 'HR & Recruitment',
    sampleSize: 156, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.31, afiMedian: 1.25, afiStdDev: 0.45,
    p25: 0.92, p50: 1.25, p75: 1.65, p90: 2.01,
    stablePercent: 30, sensitivePercent: 50, fragilePercent: 20,
    avgAutomation: 3.5, avgHumanCheckpoints: 2.7, avgOversightLevel: 2.9, avgProviderCount: 2.5,
  },
  'insurance': {
    industry: 'Insurance & Underwriting',
    sampleSize: 198, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.55, afiMedian: 1.49, afiStdDev: 0.52,
    p25: 1.08, p50: 1.49, p75: 1.96, p90: 2.35,
    stablePercent: 24, sensitivePercent: 50, fragilePercent: 26,
    avgAutomation: 3.8, avgHumanCheckpoints: 2.5, avgOversightLevel: 2.7, avgProviderCount: 2.6,
  },
  'default': {
    industry: 'Cross-Industry Average',
    sampleSize: 1443, dataSource: 'ARIA Industry Database 2025–2026', lastUpdated: '2026-03-15',
    afiMean: 1.48, afiMedian: 1.42, afiStdDev: 0.58,
    p25: 0.95, p50: 1.42, p75: 1.92, p90: 2.38,
    stablePercent: 29, sensitivePercent: 47, fragilePercent: 24,
    avgAutomation: 3.5, avgHumanCheckpoints: 2.8, avgOversightLevel: 2.9, avgProviderCount: 2.6,
  },
};

export interface PeerComparison {
  entityAFI: number;
  benchmark: IndustryBenchmark;
  percentile: number;
  percentileLabel: string;
  vsAverage: number;
  ranking: 'best-in-class' | 'above-average' | 'average' | 'below-average' | 'high-risk';
  betterThanPercent: number;
  worseThanPercent: number;
  deltas: { label: string; yours: number; avg: number; delta: number; higherIsBad: boolean }[];
}

function resolveKey(industry: string): string {
  const lower = industry.toLowerCase();
  for (const key of Object.keys(INDUSTRY_BENCHMARKS)) {
    if (key !== 'default' && lower.includes(key)) return key;
  }
  return 'default';
}

export function calculatePeerComparison(
  afi: number, industry: string, inputs: { automation: number; humanCheckpoints: number; oversightLevel: number; providers?: string[] }
): PeerComparison {
  const bm = INDUSTRY_BENCHMARKS[resolveKey(industry)];
  const z = (afi - bm.afiMean) / bm.afiStdDev;
  const percentile = Math.min(99, Math.max(1, Math.round(50 + z * 34.13)));
  const percentileLabel =
    percentile <= 25 ? 'Top Quartile (Best-in-Class)' :
    percentile <= 50 ? 'Above Average' :
    percentile <= 75 ? 'Below Average' : 'Bottom Quartile (High Risk)';
  const ranking: PeerComparison['ranking'] =
    percentile <= 25 ? 'best-in-class' :
    percentile <= 45 ? 'above-average' :
    percentile <= 60 ? 'average' :
    percentile <= 80 ? 'below-average' : 'high-risk';
  const providerCount = inputs.providers?.length || 1;

  return {
    entityAFI: afi, benchmark: bm,
    percentile, percentileLabel,
    vsAverage: afi - bm.afiMean,
    ranking,
    betterThanPercent: Math.round(100 - percentile),
    worseThanPercent: Math.round(percentile),
    deltas: [
      { label: 'Automation Level', yours: inputs.automation, avg: bm.avgAutomation, delta: inputs.automation - bm.avgAutomation, higherIsBad: true },
      { label: 'Human Checkpoints', yours: inputs.humanCheckpoints, avg: bm.avgHumanCheckpoints, delta: inputs.humanCheckpoints - bm.avgHumanCheckpoints, higherIsBad: false },
      { label: 'Oversight Level', yours: inputs.oversightLevel, avg: bm.avgOversightLevel, delta: inputs.oversightLevel - bm.avgOversightLevel, higherIsBad: false },
      { label: 'Provider Count', yours: providerCount, avg: bm.avgProviderCount, delta: providerCount - bm.avgProviderCount, higherIsBad: false },
    ],
  };
}

export function getRankingColor(r: PeerComparison['ranking']) {
  return r === 'best-in-class' || r === 'above-average' ? 'text-stable' : r === 'average' ? 'text-foreground' : r === 'below-average' ? 'text-sensitive' : 'text-fragile';
}
export function getRankingBg(r: PeerComparison['ranking']) {
  return r === 'best-in-class' || r === 'above-average' ? 'bg-stable-bg border-stable-border' : r === 'average' ? 'bg-secondary border-border' : r === 'below-average' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-fragile-bg border-fragile-border';
}
export function getRankingLabel(r: PeerComparison['ranking']) {
  return r === 'best-in-class' ? '★ Best-in-Class' : r === 'above-average' ? '↑ Above Average' : r === 'average' ? '— Average' : r === 'below-average' ? '↓ Below Average' : '⚠ High Risk';
}
