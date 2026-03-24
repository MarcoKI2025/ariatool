import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { getScoreDrivers } from '@/lib/explainability';
import { SectionDivider } from '@/components/shared/SectionDivider';

export function ExplainabilityPanel() {
  const { state } = useApp();
  const { results, inputs } = state;
  if (!results) return null;

  const { topRisks, stabilizers, summary } = getScoreDrivers(inputs, results);

  return (
    <>
      <SectionDivider title="Score Explainability" icon="🔍" subtitle="Why this score? — Top risk drivers and stabilising factors" />
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="mb-4">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Explainability Layer</div>
          <div className="text-[15px] font-bold text-foreground">Why This Score?</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">{summary}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top risks */}
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-2">▲ Top Risk Drivers</div>
            {topRisks.length === 0 ? (
              <div className="p-3 bg-stable-bg border border-stable-border rounded-lg text-[11px] text-stable">No significant risk drivers detected.</div>
            ) : (
              <div className="space-y-2">
                {topRisks.map((d, i) => (
                  <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-foreground">{d.label}</span>
                      <span className="text-[10px] font-mono font-bold text-fragile">{d.value}</span>
                    </div>
                    <div className="text-[10px] text-secondary-foreground leading-[1.5]">{d.explanation}</div>
                    <div className="w-full bg-border rounded-full h-1 mt-2">
                      <div className="h-1 rounded-full bg-fragile" style={{ width: `${Math.min(100, d.contribution)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stabilizers */}
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-stable mb-2">▼ Stabilising Factors</div>
            {stabilizers.length === 0 ? (
              <div className="p-3 bg-fragile-bg border border-fragile-border rounded-lg text-[11px] text-fragile">⚠ No significant stabilising factors detected.</div>
            ) : (
              <div className="space-y-2">
                {stabilizers.map((d, i) => (
                  <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-foreground">{d.label}</span>
                      <span className="text-[10px] font-mono font-bold text-stable">{d.value}</span>
                    </div>
                    <div className="text-[10px] text-secondary-foreground leading-[1.5]">{d.explanation}</div>
                    <div className="w-full bg-border rounded-full h-1 mt-2">
                      <div className="h-1 rounded-full bg-stable" style={{ width: `${Math.min(100, d.contribution)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-[9px] text-muted-foreground leading-[1.5]">
            ⓘ All drivers are derived from real input parameters and scoring components — not invented or estimated. Contribution bars are relative, not additive.
          </div>
        </div>
      </div>
    </>
  );
}
