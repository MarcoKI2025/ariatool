import React, { useMemo, useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeEvolutionAnalysis, EvolutionAnalysis, DriftScenario } from '@/lib/evolutionEngine';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SystemEvolutionPanel() {
  const { state } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [driftScenario, setDriftScenario] = useState<DriftScenario>('medium');

  const evolution = useMemo<EvolutionAnalysis | null>(() => {
    if (!analysisComplete || !results) return null;
    return computeEvolutionAnalysis(inputs, results, driftScenario);
  }, [analysisComplete, results, inputs, driftScenario]);

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

  const portfolioColor =
    evolution.portfolioImpact === 'Systemic' ? 'text-fragile' :
    evolution.portfolioImpact === 'Critical' ? 'text-fragile' :
    evolution.portfolioImpact === 'Elevated' ? 'text-sensitive' :
    'text-stable';

  const coverageColor =
    evolution.coverageDecision.decision === 'Decline' ? 'text-fragile' :
    evolution.coverageDecision.decision === 'Limited Coverage' ? 'text-fragile' :
    evolution.coverageDecision.decision === 'Accept with Conditions' ? 'text-sensitive' :
    'text-stable';

  const dim = evolution.agiDimensions;

  return (
    <TooltipProvider>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {/* Header bar */}
        <div className="px-4 py-2.5 border-b border-border bg-secondary flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary">System Evolution</span>
          <span className="text-[9px] text-muted-foreground ml-auto">v2.0 · Scenario-based projection</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Row 1: AGI Proximity + Insurability + Coverage */}
          <div className="grid grid-cols-3 gap-3">
            {/* AGI Proximity with 4 dimensions */}
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
              <div className="text-[9px] text-muted-foreground mt-1">API: {(evolution.agiProximity * 100).toFixed(0)}%</div>
              {/* 4-dimension breakdown */}
              <div className="grid grid-cols-2 gap-1 mt-2">
                {[
                  { label: 'Autonomy', value: dim.autonomy },
                  { label: 'Generality', value: dim.generality },
                  { label: 'Adaptive', value: dim.adaptiveModification },
                  { label: 'Scope', value: dim.decisionScope },
                ].map(d => (
                  <Tooltip key={d.label}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${d.value > 0.6 ? 'bg-sensitive' : d.value > 0.3 ? 'bg-primary' : 'bg-stable'}`}
                            style={{ width: `${Math.round(d.value * 100)}%` }} />
                        </div>
                        <span className="text-[8px] text-muted-foreground w-[14px] text-right font-mono">{Math.round(d.value * 100)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{d.label}: {(d.value * 100).toFixed(0)}%</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
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
              {/* Insurability drivers */}
              <div className="mt-2 space-y-0.5">
                {evolution.insurabilityDrivers.slice(0, 2).map((d, i) => (
                  <div key={i} className="text-[8px] text-muted-foreground leading-[1.3]">▸ {d}</div>
                ))}
              </div>
            </div>

            {/* Coverage Decision */}
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Coverage Decision</div>
              <div className={`text-[14px] font-bold ${coverageColor}`}>{evolution.coverageDecision.decision}</div>
              {evolution.coverageDecision.maxTenor && (
                <div className="text-[9px] text-muted-foreground mt-1">Max tenor: {evolution.coverageDecision.maxTenor}m</div>
              )}
              {evolution.coverageDecision.sublimitRecommended && (
                <div className="text-[9px] text-sensitive mt-0.5 font-medium">Sublimit recommended</div>
              )}
              {evolution.coverageDecision.conditions.slice(0, 2).map((c, i) => (
                <div key={i} className="text-[8px] text-muted-foreground leading-[1.3] mt-0.5">
                  {c.priority === 'required' ? '⊘' : '▸'} {c.action}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Risk Trajectory with scenario selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Risk Trajectory</div>
                <span className={`text-[9px] font-bold ${driftColor}`}>{evolution.driftTrend}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-muted-foreground mr-1">Scenario:</span>
                {(['low', 'medium', 'high'] as DriftScenario[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setDriftScenario(s)}
                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-colors ${
                      driftScenario === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <span className={`ml-1 px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider uppercase ${
                  evolution.driftConfidence === 'High' ? 'bg-stable-bg text-stable border border-stable-border' :
                  evolution.driftConfidence === 'Medium' ? 'bg-sensitive-bg text-sensitive border border-sensitive-border' :
                  'bg-secondary text-muted-foreground border border-border'
                }`}>
                  {evolution.driftConfidence} confidence
                </span>
              </div>
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

          {/* Row 3: Systemic + Cascade + Portfolio */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Systemic Correlation</div>
              <div className={`text-[14px] font-bold ${
                evolution.systemicCorrelation === 'High' ? 'text-fragile' :
                evolution.systemicCorrelation === 'Medium' ? 'text-sensitive' : 'text-stable'
              }`}>{evolution.systemicCorrelation}</div>
              {evolution.systemicDetail.hiddenCorrelation && (
                <div className="text-[8px] text-sensitive mt-0.5 font-medium">⚠ Hidden correlation detected</div>
              )}
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Cascade Amplification</div>
              <div className={`text-[14px] font-bold font-mono ${
                evolution.cascadeRiskScore > 0.6 ? 'text-fragile' :
                evolution.cascadeRiskScore > 0.3 ? 'text-sensitive' : 'text-stable'
              }`}>{evolution.cascadeRiskScore.toFixed(2)}</div>
              <div className="text-[8px] text-muted-foreground mt-0.5 leading-[1.2]">{evolution.cascadeAmplification.label.split('—')[0].trim()}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Portfolio Impact</div>
              <div className={`text-[14px] font-bold ${portfolioColor}`}>{evolution.portfolioImpact}</div>
              <div className="text-[8px] text-muted-foreground mt-0.5">Score: {(evolution.portfolioImpactScore * 100).toFixed(0)}%</div>
            </div>
          </div>

          {/* Premium Impact Factors */}
          {(evolution.driftFactor > 1.01 || evolution.correlationMultiplier > 1.01 || evolution.cascadeMultiplier > 1.01) && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              {[
                { label: 'Drift Factor', value: evolution.driftFactor, desc: 'Future AFI loading' },
                { label: 'Correlation', value: evolution.correlationMultiplier, desc: 'Systemic loading' },
                { label: 'Cascade', value: evolution.cascadeMultiplier, desc: 'Amplification loading' },
              ].map(f => (
                <div key={f.label} className="text-center">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{f.label}</div>
                  <div className={`text-[13px] font-bold font-mono ${f.value > 1.1 ? 'text-sensitive' : 'text-muted-foreground'}`}>{f.value.toFixed(2)}×</div>
                  <div className="text-[7px] text-muted-foreground">{f.desc}</div>
                </div>
              ))}
            </div>
          )}

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
    </TooltipProvider>
  );
}
