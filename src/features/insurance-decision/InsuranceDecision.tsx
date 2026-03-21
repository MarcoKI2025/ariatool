import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { Banner, MetricCard, SectionCard, LockedState } from '@/components/shared/UIComponents';
import { formatCurrency } from '@/lib/formatters';

export function InsuranceDecision() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Insurance Decision Locked" description="Complete the Exposure Analysis to view the underwriting decision console with loss envelope and committee signals." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, amplificationFactor, correlationFactor, components, premium } = results;

  const scenarios = [
    { name: 'System Collapse', recovery: '1–4 weeks', downtime: 'Partial degradation with manual workaround', narrative: 'System collapse creates significant operational disruption. Manual fallback absorbs partial load.' },
    { name: 'Provider Failure', recovery: '3–8 days', downtime: 'Service interruption — no immediate failover', narrative: 'External provider failure exposes single-point dependency. Full stack unavailability.' },
    { name: 'Regulatory Halt', recovery: '14–30 days', downtime: 'Full operational halt — enforcement action', narrative: 'Regulatory enforcement shutdown creates maximum disruption. No continuity pathway exists.' },
    { name: 'Correlated Cascade', recovery: '21–60 days', downtime: 'Systemic failure across portfolio', narrative: 'Shared dependency structures create simultaneous multi-entity failure.' },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 4 of 6 · Decision</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Insurance Decision</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Underwriting decision console for {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* Decision banner */}
      <Banner band={band} title={
        band === 'Fragile' ? 'COMMITTEE REVIEW REQUIRED' :
        band === 'Sensitive' ? 'CONDITIONAL REVIEW PROCESS' : 'STANDARD UNDERWRITING PROCESS'
      }>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Decision</div>
            <div className="text-[12px] text-foreground font-semibold">{decisionClass}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">AFI Position</div>
            <div className="text-[12px] text-foreground">{afi.toFixed(2)} ({band})</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Premium Range</div>
            <div className="text-[12px] text-foreground font-mono">{formatCurrency(premium.lo, 'k')} – {formatCurrency(premium.hi, 'k')}</div>
          </div>
        </div>
      </Banner>

      {/* This Means */}
      <div className="bg-[hsl(40,8%,5%)] rounded-xl p-5 mb-4 border-l-4 border-fragile flex items-start gap-[14px]">
        <div className="w-[22px] h-[22px] rounded-full bg-fragile flex items-center justify-center flex-shrink-0 mt-[2px]">
          <span className="text-[11px] text-primary-foreground font-bold">!</span>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-bold mb-[5px]">This Means</div>
          <div className="text-[16px] font-bold text-foreground leading-[1.3]">
            {band === 'Fragile' ? 'Standard coverage is not justified without structural changes. Risk exceeds underwriting tolerance.' :
             band === 'Sensitive' ? 'Conditional coverage only — structural improvements required within 90 days.' :
             'Standard coverage terms apply. Maintain governance cadence and reassess at renewal.'}
          </div>
        </div>
      </div>

      {/* Loss Envelope */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-[14px] px-5 border-b border-border">
          <div className="text-[12px] font-bold text-foreground uppercase tracking-[0.05em]">Loss Envelope</div>
          <div className="text-[11px] text-secondary-foreground mt-[3px]">Market-calibrated directional estimates — not actuarially certified</div>
        </div>
        <div className="grid grid-cols-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Median scenario' },
            { label: 'Stress (3.4×)', value: lossEnvelope.stress, sub: 'Correlated events' },
            { label: 'Tail 99th%', value: lossEnvelope.tail, sub: 'Extreme scenario', highlight: true },
            { label: 'Portfolio', value: lossEnvelope.portfolio, sub: 'Cluster aggregate', highlight: true },
          ].map((cell, i) => (
            <div key={i} className={`p-[18px] px-5 border-r border-border last:border-none ${cell.highlight ? 'bg-[hsl(7,20%,6%)]' : ''}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-[7px] flex items-center gap-1 ${cell.highlight ? 'text-fragile/80' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none ${cell.highlight ? 'text-fragile' : 'text-foreground'}`}>{formatCurrency(cell.value)}</div>
              <div className="text-[10px] text-muted-foreground mt-[5px]">{cell.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial outputs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <MetricCard label="Amplification Factor" value={amplificationFactor} sublabel="Munich Re loss multiplier" />
        <MetricCard label="Correlation Factor" value={correlationFactor.toFixed(2)} sublabel="Cross-system propagation" />
        <MetricCard label="Structural Loading" value={`+${Math.round(Math.min(80, afi * 45))}%`} sublabel="Governance gap premium" />
      </div>

      {/* Scenarios */}
      <SectionCard title="Scenario Analysis" icon="⚡" subtitle="Impact assessment across four canonical failure modes.">
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((s, i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4">
              <div className="text-[11px] font-bold text-foreground mb-2">{s.name}</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Recovery:</div>
                <div className="text-[12px] font-bold font-mono text-fragile">{s.recovery}</div>
              </div>
              <div className="text-[10px] text-muted-foreground mb-1">{s.downtime}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5] mt-2">{s.narrative}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recommended actions */}
      <SectionCard title="Recommended Actions" icon="📋">
        <div className="space-y-3">
          {(band === 'Fragile' ? [
            'Immediate actuarial review — current structural exposure exceeds standard models',
            'Dependency diversification programme within 90 days',
            'Quarterly governance re-authorisation mandate',
            'Named system ownership assignment',
          ] : band === 'Sensitive' ? [
            'Governance improvement plan within 90 days',
            'Committee review before coverage renewal',
            'Monitor dependency concentration actively',
          ] : [
            'Standard monitoring — maintain governance cadence',
            'Annual reassessment at renewal cycle',
          ]).map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                band === 'Fragile' ? 'bg-fragile text-primary-foreground' : band === 'Sensitive' ? 'bg-sensitive text-primary-foreground' : 'bg-stable text-primary-foreground'
              }`}>{i + 1}</div>
              <span className="text-[12px] text-foreground">{action}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
