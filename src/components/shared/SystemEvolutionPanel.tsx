import React, { useMemo, useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeEvolutionAnalysis, EvolutionAnalysis, DriftScenario } from '@/lib/evolutionEngine';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/* ─── Interpretive helpers ─── */

function riskLevel(afi: number): string {
  if (afi > 2.0) return 'Critical';
  if (afi > 1.5) return 'High';
  if (afi > 1.0) return 'Moderate';
  return 'Low';
}

function riskColor(level: string): string {
  if (level === 'Critical') return 'text-fragile';
  if (level === 'High') return 'text-fragile';
  if (level === 'Moderate') return 'text-sensitive';
  return 'text-stable';
}

function decisionBg(d: string): string {
  if (d === 'Decline') return 'bg-fragile-bg border-fragile-border';
  if (d === 'Limited Coverage') return 'bg-fragile-bg border-fragile-border';
  if (d === 'Accept with Conditions') return 'bg-sensitive-bg border-sensitive-border';
  return 'bg-stable-bg border-stable-border';
}

function decisionColor(d: string): string {
  if (d === 'Decline') return 'text-fragile';
  if (d === 'Limited Coverage') return 'text-fragile';
  if (d === 'Accept with Conditions') return 'text-sensitive';
  return 'text-stable';
}

function statusColor(level: string): string {
  if (['High', 'Critical', 'Systemic', 'Structurally Locked-In', 'Potentially Unreliable', 'Uninsurable', '< 3 months', '3–6 months'].includes(level)) return 'text-fragile';
  if (['Medium', 'Elevated', 'At Risk', 'Moderate Uncertainty', 'Partially Reversible', '6–12 months'].includes(level)) return 'text-sensitive';
  return 'text-stable';
}

function interpretCorrelation(level: string): string {
  if (level === 'High') return 'Elevated risk of synchronized failure across dependent systems';
  if (level === 'Medium') return 'Moderate dependency overlap — diversification recommended';
  return 'Limited systemic exposure';
}

function interpretCascade(score: number): string {
  if (score > 0.7) return 'Failure likely to propagate rapidly across dependent systems';
  if (score > 0.5) return 'Cascade propagation risk across connected systems';
  if (score > 0.3) return 'Isolated failure modes with limited propagation potential';
  return 'Independent failure modes — low amplification risk';
}

function interpretExit(level: string): string {
  if (level === 'Structurally Locked-In') return 'System cannot be replaced or reversed without significant disruption';
  if (level === 'Partially Reversible') return 'Partial exit possible, but dependencies create transition risk';
  return 'System can be replaced or rolled back with manageable effort';
}

function dimensionInterpret(label: string, value: number): string {
  const pct = Math.round(value * 100);
  if (value > 0.6) return `High ${label.toLowerCase()} — exceeds standard governance frameworks`;
  if (value > 0.3) return `Moderate ${label.toLowerCase()} — within manageable boundaries`;
  return `Low ${label.toLowerCase()} — well-contained`;
}

export function SystemEvolutionPanel() {
  const { state } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [driftScenario, setDriftScenario] = useState<DriftScenario>('medium');
  const [showDrivers, setShowDrivers] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const evolution = useMemo<EvolutionAnalysis | null>(() => {
    if (!analysisComplete || !results) return null;
    return computeEvolutionAnalysis(inputs, results, driftScenario);
  }, [analysisComplete, results, inputs, driftScenario]);

  if (!evolution) return null;

  const risk = riskLevel(results!.afi);
  const dim = evolution.agiDimensions;

  return (
    <TooltipProvider>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-border bg-secondary flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary">Risk Authority</span>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              evolution.confidence.level === 'High' ? 'bg-stable-bg text-stable border border-stable-border' :
              evolution.confidence.level === 'Medium' ? 'bg-sensitive-bg text-sensitive border border-sensitive-border' :
              'bg-fragile-bg text-fragile border border-fragile-border'
            }`}>Confidence: {evolution.confidence.level}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              evolution.inputIntegrity.level === 'Reliable' ? 'bg-stable-bg text-stable border border-stable-border' :
              evolution.inputIntegrity.level === 'Moderate Uncertainty' ? 'bg-sensitive-bg text-sensitive border border-sensitive-border' :
              'bg-fragile-bg text-fragile border border-fragile-border'
            }`}>Integrity: {evolution.inputIntegrity.level}</span>
          </div>
        </div>

        <div className="p-4 space-y-4">

          {/* ════════════════════════════════════════════════
              LAYER 1 — EXECUTIVE (always visible)
              ════════════════════════════════════════════════ */}

          {/* Decision — LARGEST element */}
          <div className={`rounded-lg border-2 p-4 ${decisionBg(evolution.coverageDecision.decision)}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Underwriting Decision</div>
                <div className={`text-[22px] font-extrabold leading-tight tracking-tight ${decisionColor(evolution.coverageDecision.decision)}`}>
                  {evolution.coverageDecision.decision}
                </div>
                {evolution.coverageDecision.maxTenor && (
                  <div className="text-[10px] text-muted-foreground mt-1 font-medium">Maximum tenor: {evolution.coverageDecision.maxTenor} months</div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Risk Level</div>
                <div className={`text-[18px] font-bold ${riskColor(risk)}`}>{risk}</div>
              </div>
            </div>
          </div>

          {/* Key signals row */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">Time-to-Instability</div>
              <div className={`text-[14px] font-bold ${statusColor(evolution.timeToInstability)}`}>{evolution.timeToInstability}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">Portfolio Impact</div>
              <div className={`text-[14px] font-bold ${statusColor(evolution.portfolioImpact)}`}>{evolution.portfolioImpact}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">Economic Exposure</div>
              <div className="text-[14px] font-bold font-mono text-foreground">€{evolution.economicLoss.expectedLow}M – €{evolution.economicLoss.expectedHigh}M</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">Insurability</div>
              <div className={`text-[14px] font-bold ${statusColor(evolution.insurabilityStatus)}`}>{evolution.insurabilityStatus}</div>
              {evolution.monthsToUninsurable !== null && evolution.monthsToUninsurable > 0 && (
                <div className="text-[8px] text-fragile mt-0.5 font-medium">⚠ {evolution.monthsToUninsurable}m to uninsurable</div>
              )}
            </div>
          </div>

          {/* One-line explanation — always visible */}
          <div className="p-3 bg-secondary/50 border border-border rounded-lg">
            <div className="text-[11px] text-foreground font-medium leading-relaxed">{evolution.decisionExplainability.narrative}</div>
          </div>

          {/* Executive statements — top 2 max */}
          {evolution.executiveStatements.length > 0 && (
            <div className="space-y-1">
              {evolution.executiveStatements.slice(0, 2).map((stmt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-primary text-[8px] mt-[3px] flex-shrink-0">▸</span>
                  <span className="text-[10px] text-secondary-foreground leading-relaxed italic">{stmt}</span>
                </div>
              ))}
            </div>
          )}


          {/* ════════════════════════════════════════════════
              LAYER 2 — DRIVERS (expandable)
              ════════════════════════════════════════════════ */}

          <Collapsible open={showDrivers} onOpenChange={setShowDrivers}>
            <CollapsibleTrigger className="w-full flex items-center gap-2 pt-2 border-t border-border cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-[9px] font-bold tracking-wider uppercase text-primary">{showDrivers ? '▾' : '▸'} View Risk Drivers</span>
              <div className="flex-1 h-px bg-border" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">

              {/* Top 3 Risk Drivers */}
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Primary Risk Drivers</div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 p-2 rounded bg-fragile-bg/50 border border-fragile-border/50">
                    <span className="text-[9px] text-fragile font-bold mt-px">①</span>
                    <span className="text-[10px] text-foreground font-medium leading-relaxed">{evolution.decisionExplainability.primaryDriver}</span>
                  </div>
                  {evolution.decisionExplainability.secondaryDriver !== 'no secondary driver' && (
                    <div className="flex items-start gap-2 p-2 rounded bg-sensitive-bg/50 border border-sensitive-border/50">
                      <span className="text-[9px] text-sensitive font-bold mt-px">②</span>
                      <span className="text-[10px] text-foreground font-medium leading-relaxed">{evolution.decisionExplainability.secondaryDriver}</span>
                    </div>
                  )}
                  {evolution.decisionExplainability.supportingFactor !== 'no supporting factor' && (
                    <div className="flex items-start gap-2 p-2 rounded bg-secondary border border-border">
                      <span className="text-[9px] text-muted-foreground font-bold mt-px">③</span>
                      <span className="text-[10px] text-foreground font-medium leading-relaxed">{evolution.decisionExplainability.supportingFactor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signal Groups: Structural / System Behavior / Portfolio */}
              <div className="grid grid-cols-3 gap-3">
                {/* Structural Risk */}
                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Structural Risk</div>
                  <div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Cascade Amplification</div>
                    <div className={`text-[11px] font-medium ${statusColor(evolution.cascadeRiskScore > 0.5 ? 'High' : evolution.cascadeRiskScore > 0.3 ? 'Medium' : 'Low')}`}>
                      {interpretCascade(evolution.cascadeRiskScore)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Exit Risk</div>
                    <div className={`text-[11px] font-medium ${statusColor(evolution.exitRisk.level)}`}>
                      {interpretExit(evolution.exitRisk.level)}
                    </div>
                  </div>
                </div>

                {/* System Behavior */}
                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">System Behavior</div>
                  <div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Classification</div>
                    <div className={`text-[11px] font-bold ${statusColor(evolution.agiTier === 'Pre-ASI' || evolution.agiTier === 'AGI-like' ? 'High' : 'Low')}`}>{evolution.agiTier}</div>
                  </div>
                  <div className="space-y-1 mt-1">
                    {[
                      { label: 'Autonomy', value: dim.autonomy },
                      { label: 'Generality', value: dim.generality },
                      { label: 'Adaptation', value: dim.adaptiveModification },
                      { label: 'Decision Scope', value: dim.decisionScope },
                    ].map(d => (
                      <Tooltip key={d.label}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-help">
                            <span className="text-[7px] text-muted-foreground w-[50px] truncate">{d.label}</span>
                            <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${d.value > 0.6 ? 'bg-sensitive' : d.value > 0.3 ? 'bg-primary' : 'bg-stable'}`}
                                style={{ width: `${Math.round(d.value * 100)}%` }} />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p className="text-xs">{dimensionInterpret(d.label, d.value)}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Portfolio Risk */}
                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Portfolio Risk</div>
                  <div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Systemic Correlation</div>
                    <div className={`text-[11px] font-medium ${statusColor(evolution.systemicCorrelation)}`}>
                      {interpretCorrelation(evolution.systemicCorrelation)}
                    </div>
                    {evolution.systemicDetail.hiddenCorrelation && (
                      <div className="text-[8px] text-sensitive mt-0.5 font-medium">⚠ Hidden correlation detected</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Tail Risk</div>
                    <div className="text-[11px] font-bold font-mono text-foreground">€{evolution.economicLoss.tailRisk}M</div>
                    <div className="text-[8px] text-muted-foreground">Cascade scenario: €{evolution.economicLoss.cascadeTailRisk}M</div>
                  </div>
                </div>
              </div>

              {/* Coverage Conditions */}
              {evolution.coverageDecision.conditions.length > 0 && (
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5">Required Actions</div>
                  {evolution.coverageDecision.conditions.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                      <span className={`text-[8px] mt-0.5 font-bold ${c.priority === 'required' ? 'text-fragile' : 'text-muted-foreground'}`}>
                        {c.priority === 'required' ? '⊘' : '▸'}
                      </span>
                      <span className="text-[9px] text-foreground leading-relaxed">{c.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>


          {/* ════════════════════════════════════════════════
              LAYER 3 — ANALYTICS (deep, optional)
              ════════════════════════════════════════════════ */}

          <Collapsible open={showAnalytics} onOpenChange={setShowAnalytics}>
            <CollapsibleTrigger className="w-full flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-[9px] font-bold tracking-wider uppercase text-primary">{showAnalytics ? '▾' : '▸'} View Full Analysis</span>
              <div className="flex-1 h-px bg-border" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">

              {/* Drift Projections */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Risk Trajectory</span>
                    <span className={`text-[9px] font-bold ${statusColor(evolution.driftTrend === 'Critical Acceleration' ? 'High' : evolution.driftTrend === 'Increasing Risk' ? 'Medium' : 'Low')}`}>{evolution.driftTrend}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-muted-foreground mr-1">Scenario:</span>
                    {(['low', 'medium', 'high'] as DriftScenario[]).map(s => (
                      <button key={s} onClick={() => setDriftScenario(s)}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-colors ${
                          driftScenario === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}>{s}</button>
                    ))}
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider uppercase ${
                      evolution.driftConfidence === 'High' ? 'bg-stable-bg text-stable border border-stable-border' :
                      evolution.driftConfidence === 'Medium' ? 'bg-sensitive-bg text-sensitive border border-sensitive-border' :
                      'bg-secondary text-muted-foreground border border-border'
                    }`}>{evolution.driftConfidence} conf.</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Now</div>
                    <div className={`text-[15px] font-bold font-mono ${riskColor(risk)}`}>{results!.afi.toFixed(2)}</div>
                  </div>
                  {evolution.projections.map((p) => {
                    const pColor = p.band === 'Fragile' ? 'text-fragile' : p.band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
                    const arrow = p.afi > results!.afi ? '↑' : p.afi < results!.afi ? '↓' : '→';
                    return (
                      <div key={p.months} className="bg-secondary rounded-lg p-2 text-center">
                        <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{p.months}m</div>
                        <div className={`text-[15px] font-bold font-mono ${pColor}`}>{p.afi.toFixed(2)} <span className="text-[10px]">{arrow}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stress Scenarios */}
              <div className="grid grid-cols-3 gap-2">
                {evolution.stressScenarios.map((s, i) => (
                  <div key={i} className="bg-secondary rounded-lg p-2.5">
                    <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.name}</div>
                    <div className={`text-[12px] font-bold ${statusColor(s.impact)}`}>{s.impact}</div>
                    <div className="text-[8px] text-muted-foreground mt-1 leading-relaxed">{s.description}</div>
                  </div>
                ))}
              </div>

              {/* Confidence + Topology + Exit decomposition */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Confidence Components</div>
                  {[
                    { label: 'Input Completeness', value: evolution.confidence.inputCompleteness },
                    { label: 'Input Consistency', value: evolution.confidence.inputConsistency },
                    { label: 'Model Stability', value: evolution.confidence.modelStability },
                    { label: 'Scenario Sensitivity', value: evolution.confidence.scenarioSensitivity },
                  ].map(c => (
                    <div key={c.label} className="mb-1.5 last:mb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] text-muted-foreground">{c.label}</span>
                        <span className={`text-[9px] font-bold font-mono ${c.value >= 70 ? 'text-stable' : c.value >= 45 ? 'text-sensitive' : 'text-fragile'}`}>{c.value}</span>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden mt-0.5">
                        <div className={`h-full rounded-full ${c.value >= 70 ? 'bg-stable' : c.value >= 45 ? 'bg-sensitive' : 'bg-fragile'}`}
                          style={{ width: `${c.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Dependency Topology</div>
                  {[
                    { label: 'Single Points of Failure', value: evolution.dependencyTopology.singlePointsOfFailure },
                    { label: 'Shared Providers', value: evolution.dependencyTopology.sharedProviders },
                    { label: 'Infra Concentration', value: evolution.dependencyTopology.infraConcentration },
                    { label: 'Model Chain Depth', value: evolution.dependencyTopology.modelChainDepth },
                  ].map(d => (
                    <div key={d.label} className="flex justify-between items-center mb-1 last:mb-0">
                      <span className="text-[8px] text-muted-foreground">{d.label}</span>
                      <span className={`text-[9px] font-bold font-mono ${d.value > 0.6 ? 'text-fragile' : d.value > 0.3 ? 'text-sensitive' : 'text-stable'}`}>
                        {(d.value * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Exit Risk Decomposition</div>
                  {[
                    { label: 'Reversibility', value: evolution.exitRisk.technicalReversibility, invert: true },
                    { label: 'Dependency Lock-In', value: evolution.exitRisk.dependencyLockIn },
                    { label: 'Data Entanglement', value: evolution.exitRisk.dataEntanglement },
                    { label: 'Replacement Cost', value: evolution.exitRisk.replacementCost },
                  ].map(d => (
                    <div key={d.label} className="flex justify-between items-center mb-1 last:mb-0">
                      <span className="text-[8px] text-muted-foreground">{d.label}</span>
                      <span className={`text-[9px] font-bold font-mono ${
                        d.invert ? (d.value < 0.4 ? 'text-fragile' : d.value < 0.6 ? 'text-sensitive' : 'text-stable') :
                        (d.value > 0.6 ? 'text-fragile' : d.value > 0.3 ? 'text-sensitive' : 'text-stable')
                      }`}>{(d.value * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Integrity Flags */}
              {evolution.inputIntegrity.flags.length > 0 && (
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Input Integrity Notes</div>
                  {evolution.inputIntegrity.flags.map((f, i) => (
                    <div key={i} className="text-[8px] text-muted-foreground leading-relaxed">⚠ {f}</div>
                  ))}
                </div>
              )}

              {/* Premium Factors */}
              {(evolution.driftFactor > 1.01 || evolution.correlationMultiplier > 1.01 || evolution.cascadeMultiplier > 1.01) && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Drift Loading', value: evolution.driftFactor },
                    { label: 'Correlation Loading', value: evolution.correlationMultiplier },
                    { label: 'Cascade Loading', value: evolution.cascadeMultiplier },
                  ].map(f => (
                    <div key={f.label} className="text-center bg-secondary/50 rounded-lg p-2">
                      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{f.label}</div>
                      <div className={`text-[13px] font-bold font-mono ${f.value > 1.1 ? 'text-sensitive' : 'text-muted-foreground'}`}>{f.value.toFixed(3)}×</div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </TooltipProvider>
  );
}
