import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeFullAnalysis } from '@/lib/scoring';
import { SectionCard, LockedState, BandBadge, MetricCard } from '@/components/shared/UIComponents';
import { formatCurrency } from '@/lib/formatters';
import { SIM_BASE, SIM_AUTO_M, SIM_CRIT_M, SIM_DEP_M, SIM_REV_M, SIM_OVST_R, SECTOR_MULTIPLIERS } from '@/lib/constants';

export function CompanyView() {
  const { state, setInputs, runAnalysis, setPerspective, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Live premium simulator state
  const [simAuto, setSimAuto] = useState(3);
  const [simCrit, setSimCrit] = useState(3);
  const [simDep, setSimDep] = useState(3);
  const [simOvst, setSimOvst] = useState(3);

  // Sync sim sliders with actual inputs when results change
  useEffect(() => {
    if (results && inputs) {
      setSimAuto(inputs.automation);
      setSimCrit(inputs.criticality);
      setSimDep(inputs.providers.length <= 1 ? 5 : inputs.providers.length <= 2 ? 3 : 1);
      setSimOvst(inputs.oversightLevel);
    }
  }, [results, inputs]);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setShowStickyHeader(rect.bottom < 0);
      }
    };
    const main = document.querySelector('main');
    if (main) {
      main.addEventListener('scroll', handleScroll);
      return () => main.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Live premium calculation
  const simPremium = useMemo(() => {
    if (!results || !inputs) return { lo: 0, mid: 0, hi: 0 };
    const sectorMult = SECTOR_MULTIPLIERS[inputs.industry] || 1.0;
    const basePrem = (SIM_BASE || 180) * sectorMult;
    const autoMult = SIM_AUTO_M[simAuto] || 1;
    const critMult = SIM_CRIT_M[simCrit] || 1;
    const depMult = SIM_DEP_M[simDep] || 1;
    const afi = results.afi;
    const govPremium = 1 + Math.min(0.8, afi * 0.45);
    const rawPrem = basePrem * autoMult * critMult * depMult * govPremium;
    const ovstReduction = SIM_OVST_R[simOvst] || 0;
    const midPrem = rawPrem * (1 - ovstReduction);
    const bandPct = simAuto >= 4 ? 0.20 : simAuto >= 3 ? 0.25 : 0.30;
    return {
      lo: Math.round(midPrem * (1 - bandPct) / 10) * 10,
      mid: Math.round(midPrem / 10) * 10,
      hi: Math.round(midPrem * (1 + bandPct) / 10) * 10,
    };
  }, [simAuto, simCrit, simDep, simOvst, inputs, results]);

  if (!analysisComplete || !results) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-30">🏢</div>
        <h2 className="text-lg font-bold text-foreground mb-2">Company View — Assessment Required</h2>
        <p className="text-[13px] text-muted-foreground max-w-md mb-6 leading-relaxed">
          The executive summary requires a completed assessment. Run the Exposure Analysis first, or load a Company Demo scenario.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setPerspective('underwriter'); setActiveStep(1); }} className="px-5 py-[10px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold">
            Switch to Underwriter View
          </button>
          <button onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))} className="px-5 py-[10px] border border-border text-foreground rounded-lg text-[12px] font-semibold hover:bg-secondary">
            Load Company Demo
          </button>
        </div>
      </div>
    );
  }

  const { band, afi, premium, decisionClass, lossEnvelope, components } = results;
  const col = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';



  const drivers = [
    { label: 'Execution Autonomy', pct: inputs.automation / 5, sev: inputs.automation >= 4 ? 'high' : inputs.automation >= 3 ? 'medium' : 'low', sub: `Level ${inputs.automation}/5 — ${inputs.automation >= 4 ? 'Autonomous execution creates unpriced governance gaps' : 'Moderate delegation risk'}` },
    { label: 'Human Oversight', pct: 1 - inputs.oversightLevel / 5, sev: inputs.oversightLevel <= 2 ? 'high' : inputs.oversightLevel <= 3 ? 'medium' : 'low', sub: `Level ${inputs.oversightLevel}/5 — ${inputs.oversightLevel <= 2 ? 'Critical oversight deficit' : 'Adequate oversight'}` },
    { label: 'Process Criticality', pct: inputs.criticality / 5, sev: inputs.criticality >= 4 ? 'high' : 'medium', sub: `Level ${inputs.criticality}/5 — ${inputs.criticality >= 4 ? 'High criticality magnifies failure consequence' : 'Standard criticality'}` },
    { label: 'Provider Dependency', pct: inputs.providers.length <= 1 ? 1 : inputs.providers.length <= 2 ? 0.6 : 0.3, sev: inputs.providers.length <= 1 ? 'high' : 'medium', sub: `${inputs.providers.length} provider${inputs.providers.length !== 1 ? 's' : ''} — ${inputs.providers.length <= 1 ? 'Single-provider lock-in' : 'Some diversification'}` },
    { label: 'Infrastructure Lock-In', pct: inputs.switchingCost / 5, sev: inputs.switchingCost >= 4 ? 'high' : inputs.switchingCost >= 3 ? 'medium' : 'low', sub: `Level ${inputs.switchingCost}/5 — ${inputs.switchingCost >= 4 ? 'High switching cost · structural entrenchment' : 'Manageable switching cost'}` },
    { label: 'Monitoring Weakness', pct: 1 - inputs.reviewCadence / 5, sev: inputs.reviewCadence <= 2 ? 'high' : inputs.reviewCadence <= 3 ? 'medium' : 'low', sub: `Review cadence ${inputs.reviewCadence}/5 — ${inputs.reviewCadence <= 2 ? 'No formal review process' : 'Some monitoring in place'}` },
  ].sort((a, b) => b.pct - a.pct);

  const levers = [
    { rank: 1, title: 'Strengthen Governance Cadence', body: 'Implement formal quarterly AI governance review with documented re-authorisation.', saving: `${formatCurrency(Math.round(premium.mid * 0.28 / 50) * 50, 'k')} / yr`, before: 'Ad-hoc review', after: 'Quarterly cadence' },
    { rank: 2, title: 'Reduce Execution Authority', body: 'Introduce human confirmation checkpoints for high-stakes decision paths.', saving: `${formatCurrency(Math.round(premium.mid * 0.20 / 50) * 50, 'k')} / yr`, before: `Level ${inputs.automation}/5`, after: `Level ${Math.max(1, inputs.automation - 2)}/5` },
    { rank: 3, title: 'Assign Named System Ownership', body: 'Designate a named individual with explicit authority for AI system continuation decisions.', saving: `${formatCurrency(Math.round(premium.mid * 0.14 / 50) * 50, 'k')} / yr`, before: 'Diffuse accountability', after: 'Named owner' },
  ];

  return (
    <div>
      {/* Sticky mini header */}
      {showStickyHeader && (
        <div className="fixed top-[52px] left-[236px] right-0 bg-card/95 backdrop-blur-sm border-b border-border px-[30px] py-2 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-foreground">{inputs.companyName || 'Your Organisation'}</span>
            <BandBadge band={band} size="sm" />
            <span className="text-[11px] font-mono text-muted-foreground">{formatCurrency(premium.lo, 'k')} – {formatCurrency(premium.hi, 'k')}</span>
          </div>
          <button onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))} className="px-3 py-1 text-[11px] border border-border rounded-md text-muted-foreground hover:text-foreground">
            Load Demo
          </button>
        </div>
      )}

      {/* Hero */}
      <div ref={heroRef} className="bg-card border border-border rounded-xl p-9 mb-4 relative">
        <div className="text-[32px] font-bold text-foreground tracking-tight mb-1">{inputs.companyName || 'Your Organisation'}</div>
        <div className="text-[13px] text-muted-foreground mb-8">{inputs.industry} · AI Governance Assessment Framework</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary border border-border rounded-[14px] p-6">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Risk Level</div>
            <div className={`text-[22px] font-bold tracking-tight leading-[1.2] mb-2 ${col}`}>
              {band === 'Fragile' ? 'Elevated Structural Risk' : band === 'Sensitive' ? 'Moderate Structural Risk' : 'Managed Risk Profile'}
            </div>
            <BandBadge band={band} size="md" />
          </div>
          <div className="bg-secondary border border-border rounded-[14px] p-6">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Estimated Annual Premium</div>
            <div className="text-[22px] font-bold font-mono text-primary tracking-tight leading-[1.2] mb-2">
              {formatCurrency(premium.lo, 'k')} – {formatCurrency(premium.hi, 'k')}
            </div>
            <div className="text-[11px] text-muted-foreground">Indicative AI Liability / Tech E&O range</div>
          </div>
          <div className="bg-secondary border border-border rounded-[14px] p-6">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Governance Posture</div>
            <div className={`text-[22px] font-bold tracking-tight leading-[1.2] mb-2 ${afi >= 1.35 ? 'text-fragile' : afi >= 0.85 ? 'text-sensitive' : 'text-stable'}`}>
              {afi >= 1.35 ? 'Elevated' : afi >= 0.85 ? 'Moderate' : 'Strong'}
            </div>
            <div className="text-[11px] text-muted-foreground">EU AI Act deployer obligations</div>
          </div>
        </div>
        <div className="absolute top-5 right-5 text-center">
          <div className={`text-[15px] font-bold font-mono ${col}`}>{afi.toFixed(2)}</div>
          <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground">AFI</div>
        </div>
      </div>

      {/* Strategic interpretation */}
      <div className="bg-purple-bg border border-purple-border rounded-[14px] p-6 mx-0 mb-4 flex gap-5">
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-xl flex-shrink-0 text-white">◈</div>
        <div className="text-[13px] text-secondary-foreground leading-[1.75]" dangerouslySetInnerHTML={{
          __html: band === 'Fragile'
            ? 'Your current AI deployment creates <strong class="text-foreground">significant structural exposure</strong> due to high execution authority, deep integration, and insufficient governance oversight. Insurers price this as non-standard, typically requiring premium loading of 40–80%.'
            : band === 'Sensitive'
            ? 'Your deployment creates <strong class="text-foreground">meaningful structural exposure</strong>. Insurers apply conditional terms — coverage available with governance requirements. <strong class="text-foreground">Three targeted improvements</strong> could move you to standard terms.'
            : 'Your deployment sits <strong class="text-foreground">within manageable parameters</strong>. Standard insurance terms are likely available. Focus on maintaining this profile as deployments evolve.'
        }} />
      </div>

      {/* Live Premium Simulator */}
      <SectionCard title="Live Premium Simulator" icon="💰" subtitle="Adjust levers to see how changes affect your estimated insurance premium in real-time.">
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {[
              { label: 'Automation Level', value: simAuto, set: setSimAuto, desc: '1 = Manual · 5 = Fully autonomous' },
              { label: 'Business Criticality', value: simCrit, set: setSimCrit, desc: '1 = Low impact · 5 = Mission-critical' },
              { label: 'Provider Dependency', value: simDep, set: setSimDep, desc: '1 = Diversified · 5 = Single provider' },
              { label: 'Oversight Level', value: simOvst, set: setSimOvst, desc: '1 = Minimal · 5 = Comprehensive' },
            ].map((s, i) => {
              const pct = ((s.value - 1) / 4) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-foreground">{s.label}</span>
                    <span className="text-[11px] font-bold font-mono bg-primary text-primary-foreground px-2 py-[1px] rounded">{s.value}</span>
                  </div>
                  <input
                    type="range" min={1} max={5} step={1} value={s.value}
                    onChange={e => s.set(parseInt(e.target.value))}
                    style={{ '--fill': `${pct}%` } as React.CSSProperties}
                    className="w-full"
                  />
                  <div className="text-[10px] text-muted-foreground mt-[2px]">{s.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-secondary border border-border rounded-[14px] p-5 flex flex-col justify-center">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Simulated Annual Premium</div>
            <div className="text-[28px] font-bold font-mono text-primary leading-none mb-1">
              {formatCurrency(simPremium.lo, 'k')} – {formatCurrency(simPremium.hi, 'k')}
            </div>
            <div className="text-[10px] text-muted-foreground mb-4">Mid-point: {formatCurrency(simPremium.mid, 'k')}</div>
            <div className="h-[6px] bg-border rounded overflow-hidden mb-3">
              <div className="h-full bg-primary rounded transition-all" style={{ width: `${Math.min(100, (simPremium.mid / (premium.hi * 1.5)) * 100)}%` }} />
            </div>
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              <span>vs. current: {formatCurrency(premium.mid, 'k')}</span>
              <span className={`font-bold ${simPremium.mid < premium.mid ? 'text-stable' : simPremium.mid > premium.mid ? 'text-fragile' : 'text-muted-foreground'}`}>
                {simPremium.mid < premium.mid ? `↓ ${formatCurrency(premium.mid - simPremium.mid, 'k')} saving` :
                 simPremium.mid > premium.mid ? `↑ ${formatCurrency(simPremium.mid - premium.mid, 'k')} increase` : 'No change'}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Cost Drivers */}
      <SectionCard title="Cost Drivers" icon="📊" subtitle="Ranked by premium impact — highest pressure first.">
        <div className="space-y-3">
          {drivers.map((d, i) => (
            <div key={i} className="bg-secondary border border-border rounded-xl p-[18px] grid grid-cols-[220px_1fr_100px] gap-5 items-center">
              <div>
                <div className="text-[13px] font-semibold text-foreground mb-1">{d.label}</div>
                <div className="text-[11px] text-muted-foreground leading-[1.5]">{d.sub}</div>
              </div>
              <div>
                <div className="h-[10px] bg-border rounded-[5px] overflow-hidden">
                  <div className={`h-full rounded-[5px] ${d.sev === 'high' ? 'bg-fragile' : d.sev === 'medium' ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(d.pct * 100)}%` }} />
                </div>
              </div>
              <div className={`text-[12px] font-bold text-right ${d.sev === 'high' ? 'text-fragile' : d.sev === 'medium' ? 'text-sensitive' : 'text-stable'}`}>
                {d.sev === 'high' ? '▲ Major' : d.sev === 'medium' ? '◆ Moderate' : '▼ Minor'}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Premium Reduction Levers */}
      <SectionCard title="Premium Reduction Levers" icon="💡" subtitle="Targeted improvements to reduce insurance cost.">
        <div className="grid grid-cols-3 gap-4">
          {levers.map((l, i) => (
            <div key={i} className="bg-secondary border border-border rounded-[14px] p-6 flex flex-col gap-3">
              <div className="flex items-center gap-[10px]">
                <div className="w-8 h-8 rounded-[9px] bg-primary text-primary-foreground flex items-center justify-center text-[13px] font-bold">{l.rank}</div>
                <div className="text-[14px] font-bold text-foreground">{l.title}</div>
              </div>
              <div className="text-[11px] text-muted-foreground leading-[1.6]">{l.body}</div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-muted-foreground">{l.before}</span>
                <span className="text-primary">→</span>
                <span className="text-stable font-semibold">{l.after}</span>
              </div>
              <div className="bg-stable-bg border border-stable-border rounded-[9px] p-3">
                <div className="text-[9px] text-muted-foreground">Est. annual saving</div>
                <div className="text-base font-bold font-mono text-stable">{l.saving}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Governance / Regulatory Readiness */}
      <SectionCard title="Governance & Regulatory Readiness" icon="🛡️" subtitle="Current posture against key governance dimensions.">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: 'Oversight Maturity',
              score: inputs.oversightLevel,
              status: inputs.oversightLevel >= 4 ? 'Strong' : inputs.oversightLevel >= 3 ? 'Adequate' : 'Weak',
              color: inputs.oversightLevel >= 4 ? 'text-stable' : inputs.oversightLevel >= 3 ? 'text-sensitive' : 'text-fragile',
              desc: 'Human oversight coverage and quality of governance justification across AI decision pathways.',
            },
            {
              title: 'Deployer Obligation Readiness',
              score: inputs.reviewCadence,
              status: inputs.reviewCadence >= 4 ? 'Ready' : inputs.reviewCadence >= 3 ? 'Partial' : 'Not Ready',
              color: inputs.reviewCadence >= 4 ? 'text-stable' : inputs.reviewCadence >= 3 ? 'text-sensitive' : 'text-fragile',
              desc: 'Preparedness for EU AI Act deployer obligations including re-authorisation cadence and documentation.',
            },
            {
              title: 'Post-Market Monitoring',
              score: Math.round((inputs.reviewCadence + inputs.sunsetPolicy) / 2),
              status: (inputs.reviewCadence + inputs.sunsetPolicy) / 2 >= 4 ? 'Active' : (inputs.reviewCadence + inputs.sunsetPolicy) / 2 >= 3 ? 'Partial' : 'Minimal',
              color: (inputs.reviewCadence + inputs.sunsetPolicy) / 2 >= 4 ? 'text-stable' : (inputs.reviewCadence + inputs.sunsetPolicy) / 2 >= 3 ? 'text-sensitive' : 'text-fragile',
              desc: 'Continuous monitoring, drift detection, and sunset policy enforcement for deployed AI systems.',
            },
          ].map((g, i) => (
            <div key={i} className="bg-secondary border border-border rounded-[14px] p-5">
              <div className="text-[12px] font-bold text-foreground mb-2">{g.title}</div>
              <div className={`text-[18px] font-bold mb-1 ${g.color}`}>{g.status}</div>
              <div className="text-[10px] font-mono text-muted-foreground mb-2">Level {g.score}/5</div>
              <div className="text-[10px] text-muted-foreground leading-[1.55]">{g.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Action Plan */}
      <SectionCard title="Action Plan" icon="🎯" subtitle="Concrete next steps prioritised by impact.">
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Governance Review Sprint', body: 'Establish formal quarterly governance cadence with documented re-authorisation process.', horizon: '30–60 days', priority: 'High' },
            { title: 'Authority Reduction', body: 'Reduce autonomous execution authority in critical pathways by introducing human confirmation checkpoints.', horizon: '60–90 days', priority: 'High' },
            { title: 'Ownership Assignment', body: 'Designate named system owner with explicit authority for AI continuation and decommission decisions.', horizon: '14 days', priority: 'Critical' },
          ].map((a, i) => (
            <div key={i} className="bg-secondary border border-border rounded-[14px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-[9px] bg-primary/10 text-primary flex items-center justify-center text-[13px] font-bold">{i + 1}</div>
                <div className="text-[14px] font-bold text-foreground">{a.title}</div>
              </div>
              <div className="text-[11px] text-muted-foreground leading-[1.65] mb-3">{a.body}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[6px]">
                  <div className="w-[6px] h-[6px] rounded-full bg-primary" />
                  <span className="text-[9px] font-bold tracking-wider uppercase text-primary">{a.horizon}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-[2px] rounded ${
                  a.priority === 'Critical' ? 'badge-fragile' : 'badge-sensitive'
                }`}>{a.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Footer CTA */}
      <div className="bg-purple-bg border border-purple-border rounded-2xl p-7 flex items-center justify-between">
        <div className="text-[13px] text-muted-foreground leading-[1.5]">
          <strong className="text-[15px] font-bold block mb-1 text-foreground">Ready to reduce your AI insurance cost?</strong>
          Implement the three recommended levers above to move toward standard coverage terms.
        </div>
        <button onClick={() => { setPerspective('underwriter'); setActiveStep(5); }} className="px-6 py-[11px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors flex-shrink-0 whitespace-nowrap">
          View Executive Report →
        </button>
      </div>
    </div>
  );
}
