import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { Banner, MetricCard, BandBadge, SectionCard, LockedState, InfoTip } from '@/components/shared/UIComponents';
import { TOOLTIPS } from '@/lib/tooltips';
import { SystemEvolutionPanel } from '@/components/shared/SystemEvolutionPanel';
import { computeEvolutionAnalysis } from '@/lib/evolutionEngine';
export function RiskOverview() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Risk Overview Locked" description="Complete the Exposure Analysis to unlock the risk overview with AFI scoring, governance exposure, and dependency analysis." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, eciTier, eciName, lossEnvelope, agri, amplificationFactor, correlationFactor, alri, scri, compositeRiskIndex } = results;

  return (
    <div>
      <div className="mb-6">
        <div className="label-xs mb-1.5">Step 2 of 9 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Risk Overview</h1>
        <p className="text-[13px] text-muted-foreground max-w-[580px] leading-relaxed">
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
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Authority Fragility Index<InfoTip text={TOOLTIPS.afi} /></div>
            <div className="text-[12px] text-foreground">AFI {afi.toFixed(2)} — {band}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Decision Class</div>
            <div className="text-[12px] text-foreground">{results.decisionClass}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[3px]">Existence Cost<InfoTip text={TOOLTIPS.eci} /></div>
            <div className="text-[12px] text-foreground">ECI-{eciTier} — {eciName}</div>
          </div>
        </div>
      </Banner>

      {/* Hero score */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4 text-center">
        <div className={`text-[42px] font-bold metric-value leading-none tracking-tight ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
        }`}>{structuralScore}</div>
        <div className="text-[13px] text-secondary-foreground mt-2">Structural Exposure Score</div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}
        </div>
      </div>

      {/* System Evolution Panel */}
      <SystemEvolutionPanel />

      {/* This Means interpretation */}
      <div className="bg-card rounded-lg p-5 mb-4 border-l-4 border-l-fragile border border-border flex items-start gap-[14px]">
        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
          band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
        }`}>
          <span className="text-[11px] text-white font-bold">!</span>
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

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Authority Fragility (AFI)</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: band === 'Fragile' ? 'hsl(var(--fragile))' : band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{afi.toFixed(2)}</div>
          <BandBadge band={band} />
        </div>
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Agentic Risk (AGRI)</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: agri >= 70 ? 'hsl(var(--fragile))' : agri >= 40 ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{agri}</div>
          <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--t2))' }}>{agri >= 70 ? 'Elevated' : agri >= 40 ? 'Moderate' : 'Low'}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Liability Risk (ALRI)</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: alri >= 70 ? 'hsl(var(--fragile))' : alri >= 40 ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{alri}</div>
          <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--t2))' }}>AI-specific liability</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Systemic Concentration (SCRI)</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: scri >= 70 ? 'hsl(var(--fragile))' : scri >= 40 ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{scri}</div>
          <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--t2))' }}>Provider overlap</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Cascade Amplification (CAI)</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: (results.cai ?? 0) >= 60 ? 'hsl(var(--fragile))' : (results.cai ?? 0) >= 30 ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{results.cai ?? '—'}</div>
          <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--t2))' }}>{(results.cai ?? 0) >= 60 ? 'Cascading' : (results.cai ?? 0) >= 30 ? 'Amplifying' : 'Contained'}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="label-xs mb-1.5">Composite Risk Index</div>
          <div className="text-[26px] font-bold metric-value leading-none" style={{ color: compositeRiskIndex >= 70 ? 'hsl(var(--fragile))' : compositeRiskIndex >= 40 ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))' }}>{compositeRiskIndex}</div>
          <div className="text-[10px] mt-1" style={{ color: 'hsl(var(--t2))' }}>Weighted composite</div>
        </div>
      </div>

      {/* AFI Components */}
      <SectionCard title="AFI Component Breakdown"  subtitle="Individual risk dimensions that compose the Authority Fragility Index.">
        {[
          { label: 'Delegation Ratio (DR)', value: components.dr, desc: 'Autonomous decision share without human review' },
          { label: 'Justificatory Density (JD)', value: components.jd, desc: 'Governance transparency and audit coverage', inverted: true },
          { label: 'Reversibility Cost (RC)', value: components.rc, desc: 'Structural lock-in — exit difficulty' },
          { label: 'Continuation Density (CD)', value: components.cd, desc: 'Cross-system propagation surface' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-[9px] border-b border-border last:border-none">
            <div className="w-[200px]">
              <span className="text-[12px] text-foreground font-medium">{item.label}</span>
              <div className="text-[9px] text-muted-foreground">{item.desc}</div>
            </div>
            <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
              <div className={`h-full rounded-[3px] ${item.value > 0.7 ? 'bg-fragile' : item.value > 0.5 ? 'bg-sensitive' : 'bg-stable'}`}
                   style={{ width: `${Math.round(item.value * 100)}%` }} />
            </div>
            <span className="w-[28px] text-right text-[11px] font-bold font-mono">{Math.round(item.value * 100)}</span>
          </div>
        ))}
      </SectionCard>

      {/* Required Underwriting Actions */}
      <SectionCard title="Required Underwriting Actions"  subtitle="All conditions must be met before standard coverage applies.">
        <div className="space-y-3">
          {(band === 'Fragile' ? [
            { title: 'Apply significant premium loading above standard', body: 'Mandatory — structural risk exceeds standard pricing assumptions. Treat as minimum pricing floor.' },
            { title: 'Require dependency diversification within 90 days', body: 'Mandatory — minimum 3 providers. Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic risk." Reinsurance treaty review required.' },
            { title: 'Mandate quarterly governance re-authorisation', body: 'Condition of coverage — without re-authorisation cadence, risk accumulates indefinitely.' },
            { title: 'Limit coverage to operational layers only', body: 'Recommended — full-stack coverage uneconomic at current lock-in depth. Exclude autonomous execution liability.' },
          ] : band === 'Sensitive' ? [
            { title: 'Governance improvement plan within 90 days', body: 'Required — conditional terms depend on measurable improvement in oversight cadence.' },
            { title: 'Committee review before coverage renewal', body: 'Standard — elevated signals require documented committee sign-off.' },
            { title: 'Monitor dependency concentration', body: 'Active monitoring of provider dependencies with quarterly assessment updates.' },
          ] : [
            { title: 'Standard monitoring — maintain governance cadence', body: 'Routine — continue current oversight programme.' },
            { title: 'Annual reassessment at renewal cycle', body: 'Standard — reassess structural profile at policy renewal.' },
          ]).map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-secondary border border-border rounded-lg">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                band === 'Fragile' ? 'bg-fragile text-white' : band === 'Sensitive' ? 'bg-sensitive text-white' : 'bg-stable text-white'
              }`}>{i + 1}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{a.title}</div>
                <div className="text-[11px] text-muted-foreground mt-[2px] leading-[1.5]">{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Epistemic Status */}
      <div className="bg-card border border-border rounded-[10px] p-5 mb-[14px]">
        <div className="text-[10px] font-bold tracking-[0.09em] uppercase text-primary mb-3">Epistemic Status · Governance Limits</div>
        <div className="grid grid-cols-2 gap-4 text-[11px] text-muted-foreground leading-[1.6]">
          <div>
            <strong className="text-foreground">⊘ No external ground truth exists</strong> for AI governance fragility. AFI scores are structurally calibrated — not empirically verified against historical outcomes.
          </div>
          <div>
            <strong className="text-foreground">⊘ Evaluation does not guarantee correctness.</strong> Compliance audits verify procedures — not that the system behaves correctly across all operational contexts.
          </div>
        </div>
      </div>

      {/* AGRI */}
      <SectionCard title="Agentic Risk Index (AGRI)"  subtitle="Autonomous system governance complexity signal.">
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

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(1)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Exposure Analysis</button>
        <span className="text-[10px] text-muted-foreground italic">Step 2 of 9 · Risk overview & governance signals</span>
        <button onClick={() => setActiveStep(3)} className="view-nav-next">Scenario Simulation →</button>
      </div>
    </div>
  );
}
