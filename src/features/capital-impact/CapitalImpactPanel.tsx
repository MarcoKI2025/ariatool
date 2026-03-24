import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeCapitalImpact } from '@/lib/capitalModel';
import { SectionDivider } from '@/components/shared/SectionDivider';

export function CapitalImpactPanel() {
  const { state } = useApp();
  const { results, inputs } = state;
  if (!results) return null;

  const impact = computeCapitalImpact(inputs, results);
  const stressColor = impact.stressLevel === 'Severe' ? 'text-fragile' : impact.stressLevel === 'Significant' ? 'text-sensitive' : impact.stressLevel === 'Moderate' ? 'text-sensitive' : 'text-stable';
  const opsColor = impact.operationalImpact === 'Systemic' || impact.operationalImpact === 'Critical' ? 'text-fragile' : impact.operationalImpact === 'Elevated' ? 'text-sensitive' : 'text-stable';

  return (
    <>
      <SectionDivider title="Capital Impact Assessment" icon="💎" subtitle="Heuristic loss range, capital stress, and operational impact" />
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Capital Impact Engine</div>
            <div className="text-[15px] font-bold text-foreground">Economic Exposure Characterisation</div>
            <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">
              Heuristic decision-support layer translating structural risk signals into qualitative economic impact ranges. Not actuarial pricing.
            </div>
          </div>
        </div>

        {/* Hero metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-4 bg-secondary border border-border rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Estimated Loss Range</div>
            <div className="text-[22px] font-bold font-mono text-foreground">
              €{impact.lossRange.low}M – €{impact.lossRange.high}M
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">Midpoint: €{impact.lossRange.mid}M · {impact.lossRange.label}</div>
          </div>
          <div className="p-4 bg-secondary border border-border rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Capital Stress Level</div>
            <div className={`text-[22px] font-bold font-mono ${stressColor}`}>{impact.stressLevel}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Stress Score: {impact.stressScore}/100</div>
          </div>
          <div className="p-4 bg-secondary border border-border rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Operational Impact</div>
            <div className={`text-[22px] font-bold font-mono ${opsColor}`}>{impact.operationalImpact}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Impact Score: {impact.operationalScore}/100</div>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3 bg-secondary/50 border border-border rounded-lg mb-4">
          <div className="text-[11px] text-secondary-foreground leading-[1.6]">{impact.explanation}</div>
        </div>

        {/* Drivers */}
        {impact.drivers.length > 0 && (
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Impact Drivers</div>
            <div className="space-y-2">
              {impact.drivers.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold w-[14px] flex-shrink-0 ${d.direction === 'risk' ? 'text-fragile' : 'text-stable'}`}>
                    {d.direction === 'risk' ? '▲' : '▼'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-foreground">{d.label}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-[1px] rounded ${d.direction === 'risk' ? 'badge-fragile' : 'badge-stable'}`}>
                        {d.direction === 'risk' ? 'RISK' : 'MITIGANT'}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${d.direction === 'risk' ? 'bg-fragile' : 'bg-stable'}`}
                        style={{ width: `${Math.round(d.contribution * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground w-[36px] text-right">{Math.round(d.contribution * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-[9px] text-muted-foreground leading-[1.5]">
            ⓘ This is a heuristic decision-support layer based on structural governance signals. Not actuarially certified. Loss ranges are qualitative market-calibrated proxies, not probabilistic predictions.
          </div>
        </div>
      </div>
    </>
  );
}
