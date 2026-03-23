import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="rounded-xl p-4 mb-5 border-2 border-primary/30 bg-primary/5">
      <div className="flex items-start gap-3">
        <span className="text-primary text-lg flex-shrink-0 mt-[1px]">ℹ️</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary mb-1">
            Intended Use & Application Scope
          </div>
          <div className="text-[11px] text-foreground leading-[1.55] mb-2">
            This system provides <strong>governance risk assessment signals</strong> for
            underwriting decision support. Outputs are designed to inform, not replace,
            qualified human judgment.
          </div>
          <div className="text-[11px] text-foreground leading-[1.55]">
            <strong>Recommended application:</strong> Governance risk screening, portfolio
            concentration analysis, underwriting workflow support.
            <strong className="text-primary"> Requires human review</strong> by qualified
            underwriters and corroboration with actuarial risk methods for capital allocation
            and final coverage decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
