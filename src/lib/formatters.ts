export function formatCurrency(value: number, unit: 'k' | 'M' = 'M'): string {
  if (unit === 'M') return `€${value}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(1)}M`;
  return `€${Math.round(value)}k`;
}

export function formatPremiumRange(lo: number, hi: number): string {
  return `${formatCurrency(lo, 'k')} – ${formatCurrency(hi, 'k')}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(): string {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
