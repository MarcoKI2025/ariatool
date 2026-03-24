import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { simulateProviderFailure, simulateGovernanceFailure, simulateOversightShock, type ShockResult } from '@/lib/shockSimulator';
import { SectionDivider } from '@/components/shared/SectionDivider';

export function DependencyShockPanel() {
  const { state } = useApp();
  const { results, inputs } = state;
  const [activeShock, setActiveShock] = useState<ShockResult | null>(null);

  if (!results) return null;

  const shocks = [
    { id: 'provider', label: 'Model Provider Failure', icon: '⚡', fn: () => simulateProviderFailure(inputs, results) },
    { id: 'governance', label: 'Governance Breakdown', icon: '🏛', fn: () => simulateGovernanceFailure(inputs, results) },
    { id: 'oversight', label: 'Oversight Collapse', icon: '👁', fn: () => simulateOversightShock(inputs, results) },
  ];

  return (
    <>
      <SectionDivider title="Dependency Shock Simulator" icon="💥" subtitle="Simulate infrastructure failures and governance breakdowns" />
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="mb-4">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Shock Simulation Engine</div>
          <div className="text-[15px] font-bold text-foreground">What happens when critical infrastructure fails?</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">
            Simulates real parameter shocks and recalculates AFI — showing structural vulnerability under adverse conditions.
          </div>
        </div>

        {/* Shock buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {shocks.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveShock(s.fn())}
              className={`p-4 border rounded-lg text-left transition-all hover:border-primary/50 hover:bg-secondary ${
                activeShock?.label === s.label ? 'border-primary bg-secondary' : 'border-border'
              }`}
            >
              <div className="text-[18px] mb-2">{s.icon}</div>
              <div className="text-[12px] font-bold text-foreground">{s.label}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Click to simulate</div>
            </button>
          ))}
        </div>

        {/* Shock results */}
        {activeShock && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[16px]">{activeShock.icon}</span>
                <div className="text-[14px] font-bold text-foreground">{activeShock.label}</div>
              </div>
              <div className="text-[11px] text-secondary-foreground leading-[1.5]">{activeShock.description}</div>
            </div>

            {/* AFI comparison */}
            <div className="p-4 border-b border-border">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Baseline AFI</div>
                  <div className="text-[24px] font-bold font-mono text-foreground">{activeShock.baselineAFI.toFixed(2)}</div>
                  <div className={`text-[10px] font-bold ${activeShock.baselineBand === 'Fragile' ? 'text-fragile' : activeShock.baselineBand === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                    {activeShock.baselineBand}
                  </div>
                </div>
                <div className="text-center flex items-center justify-center">
                  <div className={`text-[20px] font-bold font-mono ${activeShock.afiDelta > 0.3 ? 'text-fragile' : activeShock.afiDelta > 0.1 ? 'text-sensitive' : 'text-muted-foreground'}`}>
                    {activeShock.afiDelta > 0 ? '+' : ''}{activeShock.afiDelta.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Shocked AFI</div>
                  <div className={`text-[24px] font-bold font-mono ${activeShock.shockedBand === 'Fragile' ? 'text-fragile' : activeShock.shockedBand === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                    {activeShock.shockedAFI.toFixed(2)}
                  </div>
                  <div className={`text-[10px] font-bold ${activeShock.shockedBand === 'Fragile' ? 'text-fragile' : activeShock.shockedBand === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                    {activeShock.shockedBand}
                  </div>
                </div>
              </div>
              {activeShock.baselineBand !== activeShock.shockedBand && (
                <div className="mt-3 p-2 bg-fragile-bg border border-fragile-border rounded text-center">
                  <span className="text-[10px] font-bold text-fragile">⚠ Band reclassification: {activeShock.baselineBand} → {activeShock.shockedBand}</span>
                </div>
              )}
            </div>

            {/* Key changes table */}
            <div className="p-4 border-b border-border">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Key Parameter Changes</div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1.5 pr-3 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Metric</th>
                      <th className="text-center py-1.5 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Baseline</th>
                      <th className="text-center py-1.5 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Shocked</th>
                      <th className="text-center py-1.5 pl-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeShock.keyChanges.map((c, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-1.5 pr-3 font-medium text-foreground">{c.metric}</td>
                        <td className="py-1.5 px-2 text-center font-mono text-muted-foreground">{c.baseline}</td>
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-foreground">{c.shocked}</td>
                        <td className="py-1.5 pl-2 text-center">
                          <span className={`px-2 py-[1px] rounded text-[8px] font-bold tracking-wider uppercase ${
                            c.severity === 'high' ? 'badge-fragile' : c.severity === 'medium' ? 'badge-sensitive' : 'badge-stable'
                          }`}>{c.severity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Impact summary */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Operational Impact</div>
                <div className="text-[11px] font-semibold text-foreground">{activeShock.operationalImpact}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Recovery Difficulty</div>
                <div className="text-[11px] font-semibold text-foreground">{activeShock.recoveryDifficulty}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Estimated Recovery Time</div>
                <div className="text-[11px] font-semibold text-foreground">{activeShock.recoveryTime}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-[9px] text-muted-foreground leading-[1.5]">
            ⓘ Shock simulations modify real input parameters and recalculate AFI using the standard scoring engine. Results represent structural vulnerability, not probabilistic predictions.
          </div>
        </div>
      </div>
    </>
  );
}
