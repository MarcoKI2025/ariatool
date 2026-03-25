import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeEvolutionAnalysis, EvolutionAnalysis } from '@/lib/evolutionEngine';

export function SystemEvolutionPanel() {
  const { state } = useApp();
  const { results, inputs, analysisComplete } = state;

  const evolution = useMemo<EvolutionAnalysis | null>(() => {
    if (!analysisComplete || !results) return null;
    return computeEvolutionAnalysis(inputs, results);
  }, [analysisComplete, results, inputs]);

  if (!evolution) return null;

  const insurColor =
    evolution.insurabilityStatus === 'Uninsurable' ? 'text-fragile' :
    evolution.insurabilityStatus === 'Critical' ? 'text-fragile' :
    evolution.insurabilityStatus === 'At Risk' ? 'text-sensitive' :
    'text-stable';

  const insurBg =
    evolution.insurabilityStatus === 'Uninsurable' ? 'bg-fragile-bg border-fragile-border' :
    evolution.insurabilityStatus === 'Critical' ? 'bg-fragile-bg border-fragile-border' :
    evolution.insurabilityStatus === 'At Risk' ? 'bg-sensitive-bg border-sensitive-border' :
    'bg-stable-bg border-stable-border';

  const driftColor =
    evolution.driftTrend === 'Critical Acceleration' ? 'text-fragile' :
    evolution.driftTrend === 'Increasing Risk' ? 'text-sensitive' :
    'text-stable';

  const agiColor =
    evolution.agiTier === 'Pre-ASI' ? 'text-fragile' :
    evolution.agiTier === 'AGI-like' ? 'text-sensitive' :
    'text-stable';

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      {/* Header bar */}
      <div className="px-4 py-2.5 border-b border-border bg-secondary flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary">System Evolution</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Row 1: AGI Proximity + Insurability */}
        <div className="grid grid-cols-2 gap-3">
          {/* AGI Proximity */}
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">System Classification</div>
            <div className={`text-[16px] font-bold font-mono ${agiColor}`}>{evolution.agiTier}</div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all ${
                  evolution.agiProximity > 0.6 ? 'bg-sensitive' :
                  evolution.agiProximity > 0.3 ? 'bg-primary' : 'bg-stable'
                }`}
                style={{ width: `${Math.round(evolution.agiProximity * 100)}%` }}
              />
            </div>
            <div className="text-[9px] text-muted-foreground mt-1">Proximity: {(evolution.agiProximity * 100).toFixed(0)}%</div>
          </div>

          {/* Insurability Status */}
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Insurability Status</div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold border ${insurBg} ${insurColor}`}>
              {evolution.insurabilityStatus === 'Uninsurable' && '◉ '}
              {evolution.insurabilityStatus}
            </div>
            {evolution.monthsToUninsurable !== null && evolution.monthsToUninsurable > 0 && (
              <div className="text-[9px] text-fragile mt-1.5 font-medium">
                ⚠ Projected uninsurable in {evolution.monthsToUninsurable}m
              </div>
            )}
            {evolution.monthsToUninsurable === 0 && (
              <div className="text-[9px] text-fragile mt-1.5 font-medium">
                ◉ Currently beyond insurability threshold
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Risk Trajectory (Projections) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Risk Trajectory</div>
            <span className={`text-[9px] font-bold ${driftColor}`}>{evolution.driftTrend}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {/* Current */}
            <div className="bg-secondary rounded-lg p-2 text-center">
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Now</div>
              <div className={`text-[15px] font-bold font-mono ${
                results!.band === 'Fragile' ? 'text-fragile' : results!.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
              }`}>{results!.afi.toFixed(2)}</div>
            </div>
            {/* Projections */}
            {evolution.projections.map((p) => {
              const pColor = p.band === 'Fragile' ? 'text-fragile' : p.band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
              const arrow = p.afi > results!.afi ? '↑' : p.afi < results!.afi ? '↓' : '→';
              return (
                <div key={p.months} className="bg-secondary rounded-lg p-2 text-center">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{p.label.replace(' Months', 'm')}</div>
                  <div className={`text-[15px] font-bold font-mono ${pColor}`}>{p.afi.toFixed(2)} <span className="text-[10px]">{arrow}</span></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Systemic + Cascade */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Systemic Correlation</div>
            <div className={`text-[14px] font-bold ${
              evolution.systemicCorrelation === 'High' ? 'text-fragile' :
              evolution.systemicCorrelation === 'Medium' ? 'text-sensitive' : 'text-stable'
            }`}>{evolution.systemicCorrelation}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Cascade Risk</div>
            <div className={`text-[14px] font-bold font-mono ${
              evolution.cascadeRiskScore > 0.6 ? 'text-fragile' :
              evolution.cascadeRiskScore > 0.3 ? 'text-sensitive' : 'text-stable'
            }`}>{evolution.cascadeRiskScore.toFixed(2)}</div>
          </div>
        </div>

        {/* Executive Statements */}
        {evolution.executiveStatements.length > 0 && (
          <div className="border-t border-border pt-3">
            {evolution.executiveStatements.map((stmt, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                <span className="text-primary text-[8px] mt-[3px] flex-shrink-0">▸</span>
                <span className="text-[10px] text-secondary-foreground leading-[1.5] italic">{stmt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
