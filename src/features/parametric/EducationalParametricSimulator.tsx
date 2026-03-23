import React from 'react';

export function EducationalParametricSimulator() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-4 relative">
      {/* BETA badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-[9px] font-bold tracking-wider uppercase bg-sensitive-bg text-sensitive border border-sensitive-border rounded">EDUCATIONAL</span>
      </div>

      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">
        📋 Illustrative Parametric AI Cover Scenarios (Educational Only)
      </div>
      <div className="text-[14px] font-bold text-foreground mb-3">Parametric Cover Structure — Reference Scenarios</div>

      {/* Red warning box */}
      <div className="rounded-lg p-4 mb-4 border-2 border-fragile bg-fragile-bg">
        <div className="flex items-start gap-2">
          <span className="text-fragile text-lg flex-shrink-0">⛔</span>
          <div className="text-[11px] text-fragile leading-[1.55] font-bold">
            This calculator is for educational and illustrative purposes only. It does NOT provide binding quotes, underwriting decisions or regulatory-approved pricing. Consult licensed insurance professionals.
          </div>
        </div>
      </div>

      {/* 3 tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {[
          {
            tier: 'Simple',
            range: '€50k – €150k p.a.',
            color: 'text-stable',
            bg: 'bg-stable-bg',
            border: 'border-stable-border',
            triggers: ['Hallucination Rate > 5%', 'Model Drift > 10%', 'Single provider outage > 4h'],
            desc: 'Basic parametric triggers for low-complexity AI deployments. Advisory / support systems only.',
          },
          {
            tier: 'Standard',
            range: '€150k – €400k p.a.',
            color: 'text-sensitive',
            bg: 'bg-sensitive-bg',
            border: 'border-sensitive-border',
            triggers: ['Bias Score > 30', 'Execution error rate > 2%', 'Multi-system cascade event'],
            desc: 'Comprehensive parametric cover for operational AI with moderate autonomy. Includes cascade triggers.',
          },
          {
            tier: 'Comprehensive',
            range: '€400k – €800k p.a.',
            color: 'text-fragile',
            bg: 'bg-fragile-bg',
            border: 'border-fragile-border',
            triggers: ['Any critical governance breach', 'Regulatory enforcement action', 'Portfolio-level cascade'],
            desc: 'Full parametric structure for mission-critical autonomous AI. Includes systemic and regulatory triggers.',
          },
        ].map((t, i) => (
          <div key={i} className={`${t.bg} border ${t.border} rounded-xl p-4`}>
            <div className={`text-[9px] font-bold tracking-wider uppercase ${t.color} mb-2`}>{t.tier}</div>
            <div className={`text-[20px] font-bold font-mono leading-none ${t.color} mb-2`}>{t.range}</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.5] mb-3">{t.desc}</div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Example Triggers:</div>
            <ul className="space-y-1">
              {t.triggers.map((trigger, j) => (
                <li key={j} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.color === 'text-stable' ? 'bg-stable' : t.color === 'text-sensitive' ? 'bg-sensitive' : 'bg-fragile'} flex-shrink-0 mt-[4px]`} />
                  {trigger}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-[9px] text-muted-foreground leading-[1.5] italic">
        Ranges are illustrative only and based on market observations. Actual premiums depend on full underwriting assessment. Not a binding offer.
      </div>
    </div>
  );
}
