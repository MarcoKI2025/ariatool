import React, { useMemo, useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeEvolutionAnalysis, EvolutionAnalysis, DriftScenario } from '@/lib/evolutionEngine';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function SystemEvolutionPanel() {
  const { state } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [driftScenario, setDriftScenario] = useState<DriftScenario>('medium');
  const [showDrivers, setShowDrivers] = useState(false);
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);

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

  const confidenceColor =
    evolution.confidence.level === 'Low' ? 'text-fragile' :
    evolution.confidence.level === 'Medium' ? 'text-sensitive' :
    'text-stable';

  const exitColor =
    evolution.exitRisk.level === 'Structurally Locked-In' ? 'text-fragile' :
    evolution.exitRisk.level === 'Partially Reversible' ? 'text-sensitive' :
    'text-stable';

  const ttiColor =
    evolution.timeToInstability === '< 3 months' ? 'text-fragile' :
    evolution.timeToInstability === '3–6 months' ? 'text-fragile' :
    evolution.timeToInstability === '6–12 months' ? 'text-sensitive' :
    'text-stable';

  const dim = evolution.agiDimensions;

  return (
    <TooltipProvider>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {/* Header bar */}
        <div className="px-4 py-2.5 border-b border-border bg-secondary flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary">System Evolution</span>
          <span className="text-[9px] text-muted-foreground ml-auto">v3.0 · Capital Risk Authority</span>
        </div>

        <div className="p-4 space-y-4">
          {/* ═══ EXECUTIVE LAYER (always visible) ═══ */}

          {/* Row 1: Key decisions - Coverage + Insurability + Confidence + Time-to-Instability */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Coverage Decision</div>
              <div className={`text-[14px] font-bold ${coverageColor}`}>{evolution.coverageDecision.decision}</div>
              {evolution.coverageDecision.maxTenor && (
                <div className="text-[9px] text-muted-foreground mt-0.5">Max tenor: {evolution.coverageDecision.maxTenor}m</div>
              )}
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Insurability</div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-bold border ${insurBg} ${insurColor}`}>
                {evolution.insurabilityStatus === 'Uninsurable' && '◉ '}{evolution.insurabilityStatus}
              </div>
              {evolution.monthsToUninsurable !== null && evolution.monthsToUninsurable > 0 && (
                <div className="text-[9px] text-fragile mt-1 font-medium">⚠ Uninsurable in {evolution.monthsToUninsurable}m</div>
              )}
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Assessment Confidence</div>
              <div className={`text-[14px] font-bold ${confidenceColor}`}>{evolution.confidence.level}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">Score: {evolution.confidence.score}/100</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Time-to-Instability</div>
              <div className={`text-[14px] font-bold ${ttiColor}`}>{evolution.timeToInstability}</div>
            </div>
          </div>

          {/* Row 2: Economic Loss + Exit Risk + Portfolio Impact + Dependency */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Economic Exposure</div>
              <div className="text-[14px] font-bold font-mono text-foreground">€{evolution.economicLoss.expectedLow}M – €{evolution.economicLoss.expectedHigh}M</div>
              <div className="text-[8px] text-muted-foreground mt-0.5">Tail: €{evolution.economicLoss.tailRisk}M · Cascade: €{evolution.economicLoss.cascadeTailRisk}M</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Exit Risk</div>
              <div className={`text-[14px] font-bold ${exitColor}`}>{evolution.exitRisk.level}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Portfolio Impact</div>
              <div className={`text-[14px] font-bold ${portfolioColor}`}>{evolution.portfolioImpact}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Dependency Exposure</div>
              <div className={`text-[14px] font-bold ${
                evolution.dependencyTopology.exposure === 'High' ? 'text-fragile' :
                evolution.dependencyTopology.exposure === 'Medium' ? 'text-sensitive' : 'text-stable'
              }`}>{evolution.dependencyTopology.exposure}</div>
            </div>
          </div>

          {/* Decision Explainability */}
          <div className="p-3 bg-secondary/50 border border-border rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Decision Rationale</div>
            <div className="text-[11px] text-foreground font-medium leading-[1.5]">{evolution.decisionExplainability.narrative}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[8px] px-2 py-0.5 rounded bg-fragile-bg border border-fragile-border text-fragile font-bold">① {evolution.decisionExplainability.primaryDriver}</span>
              {evolution.decisionExplainability.secondaryDriver !== 'no secondary driver' && (
                <span className="text-[8px] px-2 py-0.5 rounded bg-sensitive-bg border border-sensitive-border text-sensitive font-bold">② {evolution.decisionExplainability.secondaryDriver}</span>
              )}
              {evolution.decisionExplainability.supportingFactor !== 'no supporting factor' && (
                <span className="text-[8px] px-2 py-0.5 rounded bg-secondary border border-border text-muted-foreground font-bold">③ {evolution.decisionExplainability.supportingFactor}</span>
              )}
            </div>
          </div>

          {/* Risk Trajectory */}
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
              <div className="bg-secondary rounded-lg p-2 text-center">
                <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Now</div>
                <div className={`text-[15px] font-bold font-mono ${
                  results!.band === 'Fragile' ? 'text-fragile' : results!.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
                }`}>{results!.afi.toFixed(2)}</div>
              </div>
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

          {/* Executive Statements */}
          {evolution.executiveStatements.length > 0 && (
            <div className="border-t border-border pt-3">
              {evolution.executiveStatements.slice(0, 3).map((stmt, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-primary text-[8px] mt-[3px] flex-shrink-0">▸</span>
                  <span className="text-[10px] text-secondary-foreground leading-[1.5] italic">{stmt}</span>
                </div>
              ))}
            </div>
          )}

          {/* ═══ EXPANDABLE: DRIVERS ═══ */}
          <Collapsible open={showDrivers} onOpenChange={setShowDrivers}>
            <CollapsibleTrigger className="w-full flex items-center gap-2 pt-2 border-t border-border cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-[9px] font-bold tracking-wider uppercase text-primary">{showDrivers ? '▾' : '▸'} Risk Drivers & Stress Scenarios</span>
              <div className="flex-1 h-px bg-border" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              {/* Stress Scenarios */}
              <div className="grid grid-cols-3 gap-2">
                {evolution.stressScenarios.map((s, i) => (
                  <div key={i} className="bg-secondary rounded-lg p-2.5">
                    <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.name}</div>
                    <div className={`text-[13px] font-bold ${
                      s.impact === 'Critical' ? 'text-fragile' : s.impact === 'Severe' ? 'text-sensitive' : 'text-stable'
                    }`}>{s.impact}</div>
                    <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                      AFI: {s.afiShocked} ({s.afiDelta > 0 ? '+' : ''}{s.afiDelta})
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-1 leading-[1.3]">{s.description}</div>
                  </div>
                ))}
              </div>

              {/* AGI Proximity + Systemic + Cascade */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">System Classification</div>
                  <div className={`text-[14px] font-bold font-mono ${agiColor}`}>{evolution.agiTier}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">API: {(evolution.agiProximity * 100).toFixed(0)}%</div>
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
                        <TooltipContent side="top"><p className="text-xs">{d.label}: {(d.value * 100).toFixed(0)}%</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
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
              </div>

              {/* Input Integrity + Conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Input Integrity</div>
                  <div className={`text-[12px] font-bold ${
                    evolution.inputIntegrity.level === 'Potentially Unreliable' ? 'text-fragile' :
                    evolution.inputIntegrity.level === 'Moderate Uncertainty' ? 'text-sensitive' : 'text-stable'
                  }`}>{evolution.inputIntegrity.level}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">Score: {evolution.inputIntegrity.score}/100</div>
                  {evolution.inputIntegrity.flags.length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      {evolution.inputIntegrity.flags.map((f, i) => (
                        <div key={i} className="text-[8px] text-muted-foreground leading-[1.3]">⚠ {f}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Coverage Conditions</div>
                  {evolution.coverageDecision.conditions.slice(0, 3).map((c, i) => (
                    <div key={i} className="text-[8px] text-muted-foreground leading-[1.3] mt-0.5">
                      {c.priority === 'required' ? '⊘' : '▸'} {c.action}
                      {c.priority === 'required' && <span className="text-fragile font-bold ml-1">REQ</span>}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ═══ EXPANDABLE: DEEP ANALYSIS ═══ */}
          <Collapsible open={showDeepAnalysis} onOpenChange={setShowDeepAnalysis}>
            <CollapsibleTrigger className="w-full flex items-center gap-2 pt-1 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-[9px] font-bold tracking-wider uppercase text-primary">{showDeepAnalysis ? '▾' : '▸'} Deep Analysis — Confidence & Topology</span>
              <div className="flex-1 h-px bg-border" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              {/* Confidence breakdown */}
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Confidence Components</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Input Completeness', value: evolution.confidence.inputCompleteness },
                    { label: 'Input Consistency', value: evolution.confidence.inputConsistency },
                    { label: 'Model Stability', value: evolution.confidence.modelStability },
                    { label: 'Scenario Sensitivity', value: evolution.confidence.scenarioSensitivity },
                  ].map(c => (
                    <div key={c.label} className="text-center">
                      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{c.label}</div>
                      <div className={`text-[13px] font-bold font-mono ${c.value >= 70 ? 'text-stable' : c.value >= 45 ? 'text-sensitive' : 'text-fragile'}`}>{c.value}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${c.value >= 70 ? 'bg-stable' : c.value >= 45 ? 'bg-sensitive' : 'bg-fragile'}`}
                          style={{ width: `${c.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependency topology breakdown */}
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Dependency Topology</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Single Points of Failure', value: evolution.dependencyTopology.singlePointsOfFailure },
                    { label: 'Shared Providers', value: evolution.dependencyTopology.sharedProviders },
                    { label: 'Infra Concentration', value: evolution.dependencyTopology.infraConcentration },
                    { label: 'Model Chain Depth', value: evolution.dependencyTopology.modelChainDepth },
                  ].map(d => (
                    <div key={d.label} className="text-center">
                      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{d.label}</div>
                      <div className={`text-[13px] font-bold font-mono ${d.value > 0.6 ? 'text-fragile' : d.value > 0.3 ? 'text-sensitive' : 'text-stable'}`}>
                        {(d.value * 100).toFixed(0)}%
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${d.value > 0.6 ? 'bg-fragile' : d.value > 0.3 ? 'bg-sensitive' : 'bg-stable'}`}
                          style={{ width: `${d.value * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit risk breakdown */}
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Exit Risk Decomposition</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Technical Reversibility', value: evolution.exitRisk.technicalReversibility, invert: true },
                    { label: 'Dependency Lock-In', value: evolution.exitRisk.dependencyLockIn },
                    { label: 'Data Entanglement', value: evolution.exitRisk.dataEntanglement },
                    { label: 'Replacement Cost', value: evolution.exitRisk.replacementCost },
                  ].map(d => (
                    <div key={d.label} className="text-center">
                      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{d.label}</div>
                      <div className={`text-[13px] font-bold font-mono ${
                        d.invert ? (d.value < 0.4 ? 'text-fragile' : d.value < 0.6 ? 'text-sensitive' : 'text-stable') :
                        (d.value > 0.6 ? 'text-fragile' : d.value > 0.3 ? 'text-sensitive' : 'text-stable')
                      }`}>
                        {(d.value * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Impact Factors */}
              {(evolution.driftFactor > 1.01 || evolution.correlationMultiplier > 1.01 || evolution.cascadeMultiplier > 1.01) && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Drift Factor', value: evolution.driftFactor, desc: 'Future AFI + confidence + exit risk' },
                    { label: 'Correlation', value: evolution.correlationMultiplier, desc: 'Systemic loading' },
                    { label: 'Cascade', value: evolution.cascadeMultiplier, desc: 'Amplification loading' },
                  ].map(f => (
                    <div key={f.label} className="text-center bg-secondary/50 rounded-lg p-2">
                      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{f.label}</div>
                      <div className={`text-[13px] font-bold font-mono ${f.value > 1.1 ? 'text-sensitive' : 'text-muted-foreground'}`}>{f.value.toFixed(3)}×</div>
                      <div className="text-[7px] text-muted-foreground">{f.desc}</div>
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
