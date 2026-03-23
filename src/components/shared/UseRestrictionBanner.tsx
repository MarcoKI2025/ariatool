import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="rounded-xl p-4 mb-5 border border-fragile-border bg-fragile-bg">
      <div className="flex items-start gap-3">
        <span className="text-fragile text-lg flex-shrink-0 mt-[1px]">⚠</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-fragile mb-1">
            Governance Intelligence Layer — Strict Use Restriction
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.55] mb-2">
            This tool generates <strong className="text-foreground">decision-support signals only</strong>. It does NOT produce:
            binding underwriting decisions, actuarial loss predictions, insurance pricing,
            regulatory compliance certifications, or legal/financial advice.
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.55]">
            All outputs require <strong className="text-foreground">mandatory human review and explicit authorization</strong> by qualified personnel.
            Risk bands are comparative indicators, not probability measures.
          </div>
        </div>
      </div>
    </div>
  );
}
