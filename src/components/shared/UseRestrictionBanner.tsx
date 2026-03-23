import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="rounded-xl p-4 mb-5 border border-sensitive-border bg-sensitive-bg">
      <div className="flex items-start gap-3">
        <span className="text-sensitive text-lg flex-shrink-0 mt-[1px]">⚠</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-sensitive mb-1">
            Governance Intelligence Layer — Use Restriction
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.55]">
            This assessment identifies structural governance fragility — not loss probabilities, not pricing recommendations, not binding underwriting decisions. ARIA outputs are decision support signals for committee intake and risk posture evaluation — they do not constitute actuarial analysis, replace independent validation, or supersede existing underwriting authority. All outputs require human review and explicit approval before operational use.
          </div>
        </div>
      </div>
    </div>
  );
}
