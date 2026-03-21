import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { Banner, MetricCard, BandBadge, SectionCard, LockedState } from '@/components/shared/UIComponents';

export function RiskOverview() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Risk Overview Locked" description="Complete the Exposure Analysis to unlock the risk overview with AFI scoring, governance exposure, and dependency analysis." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, eciTier, eciName, lossEnvelope, agri } = results;

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 2 of 6 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Risk Overview</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Structural AI governance risk assessment for {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* Hero banner */}
      <Banner band={band} title={
        band === 'Fragile' ? 'COMMITTEE REVIEW REQUIRED' :
        band === 'Sensitive' ? 'CONDITIONAL REVIEW PROCESS' : 'STANDARD UNDERWRITING PROCESS'
      }>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Authority Fragility Index</div>
            <div className="text-[12px] text-foreground">AFI {afi.toFixed(2)} — {band}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Decision Class</div>
            <div className="text-[12px] text-foreground">{results.decisionClass}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Existence Cost</div>
            <div className="text-[12px] text-foreground">ECI-{eciTier} — {eciName}</div>
          </div>
        </div>
      </Banner>

      {/* Hero score */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4 text-center">
        <div className={`text-[72px] font-bold font-mono leading-none tracking-tight ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
        }`}>{structuralScore}</div>
        <div className="text-[13px] text-secondary-foreground mt-2">Structural Exposure Score</div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-[hsl(40,8%,5%)] rounded-xl p-5 mb-4 border-l-4 border-fragile flex items-start gap-[14px]">
        <div className="w-[22px] h-[22px] rounded-full bg-fragile flex items-center justify-center flex-shrink-0 mt-[2px]">
          <span className="text-[11px] text-primary-foreground font-bold">!</span>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-bold mb-[5px]">This Means</div>
          <div className="text-[16px] font-bold text-foreground leading-[1.3]">
            {band === 'Fragile' ? 'Standard coverage is not justified without structural changes.' :
             band === 'Sensitive' ? 'Conditional coverage is available — structural improvements required within 90 days.' :
             'Standard coverage terms apply. Maintain governance cadence.'}
          </div>
          <div className="text-[12px] text-muted-foreground mt-[5px] leading-[1.5]">
            {band === 'Fragile' ? 'Risk exceeds underwriting tolerance. Apply mandatory premium loading and require structural remediation before any coverage terms are finalised.' :
             band === 'Sensitive' ? 'Coverage is conditional. Governance gaps must be addressed before standard rates can apply.' :
             'Exposure is within tolerance. Standard coverage terms apply with routine monitoring.'}
          </div>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard label="AFI · Authority Fragility" value={afi.toFixed(2)} band={band} sublabel={`${band} — ${afi < 0.85 ? 'below threshold' : afi < 1.35 ? 'approaching threshold' : 'above threshold'}`} />
        <MetricCard label="Governance Exposure" value={`${Math.round(components.jd * 100)}%`} band={components.jd < 0.4 ? 'Fragile' : components.jd < 0.6 ? 'Sensitive' : 'Stable'} sublabel="Justificatory Density" />
        <MetricCard label="Dependency Concentration" value={`${Math.round(components.rc * 100)}%`} band={components.rc > 0.7 ? 'Fragile' : components.rc > 0.5 ? 'Sensitive' : 'Stable'} sublabel="Reversibility Cost" />
        <MetricCard label="Continuation Density" value={`${Math.round(components.cd * 100)}%`} band={components.cd > 0.7 ? 'Fragile' : components.cd > 0.5 ? 'Sensitive' : 'Stable'} sublabel="Integration lock-in" />
      </div>

      {/* AFI Components */}
      <SectionCard title="AFI Component Breakdown" icon="📊" subtitle="Individual risk dimensions that compose the Authority Fragility Index.">
        {[
          { label: 'Delegation Ratio (DR)', value: components.dr, desc: 'Measures how much decision authority is transferred to AI systems' },
          { label: 'Justificatory Density (JD)', value: components.jd, desc: 'Quality and frequency of human oversight justification', inverted: true },
          { label: 'Reversibility Cost (RC)', value: components.rc, desc: 'Cost and difficulty of reverting or exiting AI dependency' },
          { label: 'Continuation Density (CD)', value: components.cd, desc: 'How deeply the system persists without re-authorisation' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-[9px] border-b border-border last:border-none">
            <span className="w-[140px] text-[12px] text-secondary-foreground">{item.label}</span>
            <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
              <div className={`h-full rounded-[3px] ${item.value > 0.7 ? 'bg-fragile' : item.value > 0.5 ? 'bg-sensitive' : 'bg-stable'}`}
                   style={{ width: `${Math.round(item.value * 100)}%` }} />
            </div>
            <span className="w-[28px] text-right text-[11px] font-bold font-mono">{Math.round(item.value * 100)}</span>
          </div>
        ))}
      </SectionCard>

      {/* AGRI */}
      <SectionCard title="Agentic Risk Index (AGRI)" icon="🤖" subtitle="Autonomous system governance complexity signal.">
        <div className="flex items-end gap-3 mb-2">
          <span className={`text-[28px] font-bold font-mono ${agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable'}`}>{agri}</span>
          <span className="text-[11px] text-muted-foreground mb-1">/100</span>
        </div>
        <div className="h-2 bg-secondary rounded overflow-hidden">
          <div className={`h-full rounded ${agri >= 60 ? 'bg-fragile' : agri >= 35 ? 'bg-sensitive' : 'bg-stable'}`}
               style={{ width: `${agri}%` }} />
        </div>
        <div className="text-[11px] text-muted-foreground mt-2">
          {agri >= 60 ? 'Critical agent risk — requires specialist agentic risk assessment beyond standard underwriting.' :
           agri >= 35 ? 'Elevated agent risk — material governance complexity.' :
           'Low agentic architecture. Standard governance framework applies.'}
        </div>
      </SectionCard>
    </div>
  );
}
