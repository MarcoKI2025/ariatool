import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="rounded-xl p-4 mb-5 border-2 border-fragile bg-fragile-bg">
      <div className="flex items-start gap-3">
        <span className="text-fragile text-lg flex-shrink-0 mt-[1px]">⚠</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-fragile mb-1">
            Governance Intelligence Platform — Strict Use Restriction
          </div>
          <div className="text-[11px] text-fragile leading-[1.55] mb-2">
            This tool generates decision-support signals only. It does <strong>NOT</strong> produce binding underwriting decisions, <strong>NOT</strong> probabilities, <strong>NOT</strong> pricing determinations, <strong>NOT</strong> actuarial loss predictions and <strong>NOT</strong> regulatory certifications.
          </div>
          <div className="text-[11px] text-fragile leading-[1.55]">
            All outputs require <strong>mandatory human review and explicit authorization</strong> by qualified personnel. No actuarial validation. Use at your own risk.
          </div>
        </div>
      </div>
    </div>
  );
}
