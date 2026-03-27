import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeEvolutionAnalysis, EvolutionAnalysis } from '@/lib/evolutionEngine';

function insurabilityLabel(ev: EvolutionAnalysis): 'INSURABLE' | 'CONDITIONAL' | 'NOT INSURABLE' {
  const d = ev.coverageDecision.decision;
  if (d === 'Decline') return 'NOT INSURABLE';
  if (d === 'Accept') return 'INSURABLE';
  return 'CONDITIONAL';
}

function insurabilityStyle(label: string) {
  if (label === 'NOT INSURABLE') return { bg: 'bg-fragile-bg border-fragile-border', text: 'text-fragile', dot: 'bg-fragile' };
  if (label === 'CONDITIONAL') return { bg: 'bg-sensitive-bg border-sensitive-border', text: 'text-sensitive', dot: 'bg-sensitive' };
  return { bg: 'bg-stable-bg border-stable-border', text: 'text-stable', dot: 'bg-stable' };
}

function getDrivers(ev: EvolutionAnalysis): { label: string; level: string; color: string }[] {
  const drivers: { label: string; level: string; color: string }[] = [];

  // Cascade
  const cascLevel = ev.cascadeRiskScore > 0.6 ? 'Critical' : ev.cascadeRiskScore > 0.35 ? 'High' : 'Moderate';
  const cascColor = cascLevel === 'Critical' ? 'text-fragile' : cascLevel === 'High' ? 'text-fragile' : 'text-sensitive';
  drivers.push({ label: 'Cascade Risk', level: cascLevel, color: cascColor });

  // Systemic Correlation
  const corrLevel = ev.systemicCorrelation;
  const corrColor = corrLevel === 'High' ? 'text-fragile' : corrLevel === 'Medium' ? 'text-sensitive' : 'text-stable';
  drivers.push({ label: 'Systemic Exposure', level: corrLevel, color: corrColor });

  // Exit / Lock-in
  const exitColor = ev.exitRisk.level === 'Structurally Locked-In' ? 'text-fragile' : ev.exitRisk.level === 'Partially Reversible' ? 'text-sensitive' : 'text-stable';
  drivers.push({ label: 'Exit Risk', level: ev.exitRisk.level, color: exitColor });

  return drivers;
}

function getActions(ev: EvolutionAnalysis): string[] {
  const actions: string[] = [];
  const d = ev.coverageDecision.decision;

  if (d === 'Decline') {
    actions.push('Decline — system exceeds insurability boundary');
  } else if (d === 'Limited Coverage') {
    actions.push('Limit coverage scope and tenor');
  } else if (d === 'Accept with Conditions') {
    actions.push('Escalate to committee review');
  }

  if (ev.coverageDecision.conditions.length > 0) {
    const required = ev.coverageDecision.conditions.filter(c => c.priority === 'required');
    if (required.length > 0) actions.push(required[0].action);
  }

  if (ev.exitRisk.level === 'Structurally Locked-In') {
    actions.push('Require governance controls before binding');
  }

  return actions.slice(0, 3);
}

export function DecisionHeader() {
  const { state } = useApp();
  const { results, inputs, analysisComplete } = state;

  const evolution = useMemo<EvolutionAnalysis | null>(() => {
    if (!analysisComplete || !results) return null;
    return computeEvolutionAnalysis(inputs, results);
  }, [analysisComplete, results, inputs]);

  if (!evolution) return null;

  const label = insurabilityLabel(evolution);
  const style = insurabilityStyle(label);
  const drivers = getDrivers(evolution);
  const actions = getActions(evolution);

  return (
    <div className={`border-b-2 ${style.bg} px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3 flex-shrink-0`}>
      {/* Mobile: single compact row */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse flex-shrink-0`} />
        <div className={`text-[13px] font-extrabold tracking-tight leading-none ${style.text} flex-shrink-0`}>{label}</div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] text-muted-foreground truncate block">
            {inputs.companyName || 'No entity'}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[11px] font-bold font-mono text-foreground">€{evolution.economicLoss.expectedLow}M–€{evolution.economicLoss.expectedHigh}M</div>
        </div>
      </div>

      {/* Desktop: full layout */}
      <div className="hidden sm:flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-8">
        {/* Insurability Status */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${style.dot} animate-pulse`} />
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
              {inputs.companyName ? `${inputs.companyName} · ` : ''}Insurability Status
            </div>
            <div className={`text-[20px] lg:text-[24px] font-extrabold tracking-tight leading-none ${style.text}`}>{label}</div>
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-border" />

        {/* Primary Drivers */}
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">Primary Drivers</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {drivers.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-[11px] text-secondary-foreground">{d.label}:</span>
                <span className={`text-[11px] font-bold ${d.color}`}>{d.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-border" />

        {/* Recommended Actions — hidden below lg */}
        <div className="flex-1 min-w-0 hidden lg:block">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">Recommended Actions</div>
          <div className="space-y-0.5">
            {actions.map((a, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-primary text-[8px] mt-[3px] flex-shrink-0">▸</span>
                <span className="text-[10px] text-foreground font-medium leading-snug">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-border" />

        {/* Economic Exposure */}
        <div className="flex-shrink-0 sm:text-right">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-0.5">Loss Range</div>
          <div className="text-[16px] font-bold font-mono text-foreground">€{evolution.economicLoss.expectedLow}M – €{evolution.economicLoss.expectedHigh}M</div>
          <div className="text-[9px] text-muted-foreground">Tail: €{evolution.economicLoss.tailRisk}M</div>
        </div>
      </div>
    </div>
  );
}
