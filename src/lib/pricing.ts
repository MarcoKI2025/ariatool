/**
 * Premium Pricing Engine
 * Converts AFI scores into insurance premiums using actuarial formulas
 */

export const INDUSTRY_BASE_RATES: Record<string, {
  baseRate: number;
  volatilityFactor: number;
  description: string;
}> = {
  'financial': { baseRate: 0.025, volatilityFactor: 1.4, description: 'Financial Services (Trading, Banking, FinTech)' },
  'fintech': { baseRate: 0.025, volatilityFactor: 1.4, description: 'Financial Technology' },
  'healthcare': { baseRate: 0.018, volatilityFactor: 1.2, description: 'Healthcare & Medical AI Systems' },
  'legal': { baseRate: 0.022, volatilityFactor: 1.3, description: 'Legal Tech & Contract Analysis' },
  'retail': { baseRate: 0.012, volatilityFactor: 0.9, description: 'E-commerce & Retail AI' },
  'government': { baseRate: 0.015, volatilityFactor: 0.8, description: 'Public Sector & Civic AI' },
  'civic': { baseRate: 0.015, volatilityFactor: 0.8, description: 'Public Sector & Civic AI' },
  'technology': { baseRate: 0.020, volatilityFactor: 1.1, description: 'SaaS, Tech Platforms, Software' },
  'transportation': { baseRate: 0.028, volatilityFactor: 1.5, description: 'Autonomous Vehicles, Logistics AI' },
  'autonomous': { baseRate: 0.028, volatilityFactor: 1.5, description: 'Autonomous Systems' },
  'hr': { baseRate: 0.016, volatilityFactor: 1.1, description: 'HR & Recruitment AI' },
  'hiring': { baseRate: 0.016, volatilityFactor: 1.1, description: 'HR & Recruitment AI' },
  'insurance': { baseRate: 0.020, volatilityFactor: 1.2, description: 'Insurance & Underwriting AI' },
  'default': { baseRate: 0.018, volatilityFactor: 1.0, description: 'General AI Systems' },
};

export function getAFIMultiplier(afi: number): number {
  if (afi < 0.85) return 0.85;
  if (afi < 1.35) return 1.0;
  return 1.0 + (afi - 1.35) * 0.4;
}

export const DEDUCTIBLE_OPTIONS = [
  { amount: 0, label: 'No Deductible', factor: 1.0 },
  { amount: 50000, label: '€50k', factor: 0.92 },
  { amount: 100000, label: '€100k', factor: 0.85 },
  { amount: 250000, label: '€250k', factor: 0.75 },
  { amount: 500000, label: '€500k', factor: 0.68 },
  { amount: 1000000, label: '€1M', factor: 0.60 },
];

export function getDeductibleFactor(deductible: number): number {
  return DEDUCTIBLE_OPTIONS.find(d => d.amount === deductible)?.factor || 1.0;
}

export interface PremiumCalculation {
  coverage: number;
  afi: number;
  industry: string;
  deductible: number;
  baseRate: number;
  volatilityFactor: number;
  afiMultiplier: number;
  deductibleFactor: number;
  basePremium: number;
  afiAdjustment: number;
  industryAdjustment: number;
  deductibleDiscount: number;
  annualPremium: number;
  premiumRate: number;
  savingsFromDeductible: number;
  costOfFragility: number;
}

function resolveIndustryKey(industry: string): string {
  const lower = industry.toLowerCase();
  for (const key of Object.keys(INDUSTRY_BASE_RATES)) {
    if (key !== 'default' && lower.includes(key)) return key;
  }
  return 'default';
}

export function calculatePremium(
  coverage: number, afi: number, industry: string, deductible: number = 0
): PremiumCalculation {
  const industryKey = resolveIndustryKey(industry);
  const { baseRate, volatilityFactor } = INDUSTRY_BASE_RATES[industryKey];
  const afiMultiplier = getAFIMultiplier(afi);
  const deductibleFactor = getDeductibleFactor(deductible);

  const basePremium = coverage * baseRate;
  const afiAdjustedPremium = basePremium * afiMultiplier;
  const afiAdjustment = afiAdjustedPremium - basePremium;
  const industryAdjustedPremium = afiAdjustedPremium * volatilityFactor;
  const industryAdjustment = industryAdjustedPremium - afiAdjustedPremium;
  const finalPremium = industryAdjustedPremium * deductibleFactor;
  const deductibleDiscount = industryAdjustedPremium - finalPremium;
  const premiumRate = (finalPremium / coverage) * 100;
  const baselinePremium = basePremium * 1.0 * volatilityFactor * deductibleFactor;
  const costOfFragility = finalPremium - baselinePremium;

  return {
    coverage, afi, industry, deductible,
    baseRate, volatilityFactor, afiMultiplier, deductibleFactor,
    basePremium, afiAdjustment, industryAdjustment, deductibleDiscount,
    annualPremium: finalPremium,
    premiumRate, savingsFromDeductible: deductibleDiscount, costOfFragility,
  };
}

export interface PremiumScenario {
  name: string;
  description: string;
  premium: number;
  savings?: number;
}

export function generatePremiumScenarios(
  coverage: number, afi: number, industry: string
): PremiumScenario[] {
  const current = calculatePremium(coverage, afi, industry, 0);
  const withDeductible = calculatePremium(coverage, afi, industry, 250000);
  const improvedAFI = afi * 0.8;
  const improved = calculatePremium(coverage, improvedAFI, industry, 0);
  const bestCase = calculatePremium(coverage, 0.80, industry, 250000);

  return [
    { name: 'Current Assessment', description: `AFI ${afi.toFixed(2)}, No deductible`, premium: current.annualPremium },
    { name: 'With €250k Deductible', description: 'Retain first €250k of loss', premium: withDeductible.annualPremium, savings: current.annualPremium - withDeductible.annualPremium },
    { name: 'After Governance Improvements', description: `Reduce AFI to ${improvedAFI.toFixed(2)} (−20%)`, premium: improved.annualPremium, savings: current.annualPremium - improved.annualPremium },
    { name: 'Best Case (Stable + Deductible)', description: `AFI 0.80, €250k deductible`, premium: bestCase.annualPremium, savings: current.annualPremium - bestCase.annualPremium },
  ];
}

export function formatPremiumCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatPremiumPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
