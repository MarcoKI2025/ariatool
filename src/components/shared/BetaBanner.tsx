import React from 'react';

interface BetaBannerProps {
  text?: string;
}

export function BetaBanner({ text = 'BETA – Scenario planning only. Not calibrated to claims data. Use for illustrative purposes only.' }: BetaBannerProps) {
  return (
    <div className="rounded-lg p-3 mb-3 border border-sensitive bg-sensitive-bg flex items-start gap-2">
      <span className="text-sensitive text-sm flex-shrink-0">⚠️</span>
      <div className="text-[10px] font-bold text-sensitive leading-[1.5]">{text}</div>
    </div>
  );
}
