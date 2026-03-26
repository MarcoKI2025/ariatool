import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { formatCurrency } from '@/lib/formatters';
import { BandBadge, SectionCard, InfoTip } from '@/components/shared/UIComponents';
import { TOOLTIPS } from '@/lib/tooltips';
import { AFIGauge } from '@/components/charts/AFIGauge';
import { AFIRadar } from '@/components/charts/AFIRadar';
import { computeFullAnalysis, calcAFI, getBand, getDecisionClass } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';
import { LiveIndicator } from '@/components/shared/LiveIndicator';
import { QuantumVulnerabilityAssessment } from '@/features/quantum/QuantumVulnerabilityAssessment';
import { AppFooter } from '@/components/shared/AppFooter';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { DeploymentAuthorization } from '@/components/shared/DeploymentAuthorization';
import { SystemEvolutionPanel } from '@/components/shared/SystemEvolutionPanel';
import { computeEvolutionAnalysis } from '@/lib/evolutionEngine';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function ExposureResults() {
  const { state, setActiveStep } = useApp();
  const { results, inputs } = state;

  const [adjustments, setAdjustments] = useState({ dr: 0, jd: 0, rc: 0, cd: 0, na: 0, ses: 0 });
  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);
  const [showSupporting, setShowSupporting] = useState(false);

  const adjFn = (base: number, pct: number) => Math.max(0.01, Math.min(1, base * (1 + pct / 100)));

  const components = useMemo(() => {
    if (!results) return { dr: 0, jd: 0.5, rc: 0, cd: 0, na: 0.5 };
    return {
      dr: adjFn(results.components.dr, adjustments.dr),
      jd: adjFn(results.components.jd, adjustments.jd),
      rc: adjFn(results.components.rc, adjustments.rc),
      cd: adjFn(results.components.cd, adjustments.cd),
      na: adjFn(results.components.na, adjustments.na),
    };
  }, [results, adjustments]);

  const afi = useMemo(() => calcAFI(components.dr, components.jd, components.rc, components.cd, components.na), [components]);
  const band = useMemo(() => getBand(afi), [afi]);
  const decisionClass = useMemo(() => getDecisionClass(band), [band]);
  const structuralScore = useMemo(() => Math.min(99, Math.round(afi * 60)), [afi]);
  const eciTier = useMemo(() => afi < 0.5 ? 0 : afi < 0.85 ? 1 : afi < 1.35 ? 2 : 3, [afi]);
  const eciName = useMemo(() => ['Reversible Tool', 'Persistent Service', 'Institutional Dependency', 'Critical Infrastructure'][eciTier], [eciTier]);

  const evolution = useMemo(() => results ? computeEvolutionAnalysis(inputs, results) : null, [results, inputs]);

  if (!results) return null;

  const { lossEnvelope, agri, alri, scri, amplificationFactor } = results;

  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  const dr100 = Math.round(components.dr * 100);
  const jd100 = Math.round(components.jd * 100);
  const rc100 = Math.round(components.rc * 100);
  const cd100 = Math.round(components.cd * 100);

  const execRaw = inputs.executionAuthority / 5;
  const ovstRaw = inputs.oversightLevel / 5;
  const corVal = Math.round(Math.min(99, ((components.dr + execRaw) / 2) * (1 - ovstRaw * 0.4) * 100));
  const ariVal = Math.round(Math.min(99, (components.dr * 0.5 + (1 - components.jd) * 0.3 + execRaw * 0.2) * 100));

  const agriTier = agri >= 60 ? 'Critical' : agri >= 35 ? 'Elevated' : agri >= 15 ? 'Moderate' : 'Low';
  const alriTier = alri >= 60 ? 'Critical' : alri >= 35 ? 'Elevated' : alri >= 15 ? 'Moderate' : 'Low';
  const scriTier = scri >= 65 ? 'Critical' : scri >= 35 ? 'Elevated' : 'Diversified';

  const agriColor = agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable';
  const alriColor = alri >= 60 ? 'text-fragile' : alri >= 35 ? 'text-sensitive' : 'text-stable';
  const scriColor = scri >= 65 ? 'text-fragile' : scri >= 35 ? 'text-sensitive' : 'text-stable';

  const finScore = Math.round(Math.min(99, (components.dr * 0.4 + components.rc * 0.3 + afi * 0.3) * 100));
  const opsScore = Math.round(Math.min(99, (components.cd * 0.5 + components.dr * 0.3 + 0.2) * 80));
  const datScore = Math.round(Math.min(99, (components.cd * 0.3 + components.jd * 0.3 + 0.2) * 80));
  const cmpScore = Math.round(Math.min(99, ((1 - components.jd) * 0.5 + afi * 0.3) * 70));
  const repScore = Math.round(Math.min(99, (components.dr * 0.4 + (1 - components.jd) * 0.3) * 60));

  const showEditForm = () => {
    document.dispatchEvent(new CustomEvent('show-exposure-form'));
  };

  // ── WHY THIS DECISION — 3 interpretive blocks ──
  const cascadeLevel = evolution ? (evolution.cascadeRiskScore > 0.6 ? 'Critical' : evolution.cascadeRiskScore > 0.35 ? 'High' : 'Moderate') : 'N/A';
  const cascadeExplanation = evolution
    ? (evolution.cascadeRiskScore > 0.6 ? 'Failure propagates rapidly across dependent systems with non-linear amplification at each layer.'
      : evolution.cascadeRiskScore > 0.35 ? 'Cascade propagation risk exists across connected systems — containment not guaranteed.'
      : 'Isolated failure modes with limited propagation potential.')
    : '';
  const systemicLevel = evolution?.systemicCorrelation || 'N/A';
  const systemicExplanation = evolution
    ? (evolution.systemicCorrelation === 'High' ? 'Shared infrastructure dependencies create synchronized failure risk across the portfolio.'
      : evolution.systemicCorrelation === 'Medium' ? 'Moderate dependency overlap — diversification recommended to reduce correlated exposure.'
      : 'Limited systemic exposure — dependencies are sufficiently diversified.')
    : '';
  const governanceExplanation = afi > 1.35
    ? 'Governance framework is structurally inadequate for the level of AI delegation. Oversight decay has exceeded reversibility thresholds.'
    : afi > 0.85
    ? 'Governance gaps are emerging. Delegation is outpacing oversight cadence, creating drift risk.'
    : 'Governance framework is aligned with current delegation levels. Monitoring cadence is sufficient.';
  const governanceLevel = afi > 1.35 ? 'Critical' : afi > 0.85 ? 'Elevated' : 'Adequate';

  function levelColor(level: string) {
    if (['Critical', 'High'].includes(level)) return 'text-fragile';
    if (['Elevated', 'Medium', 'Moderate'].includes(level)) return 'text-sensitive';
    return 'text-stable';
  }
  function levelBg(level: string) {
    if (['Critical', 'High'].includes(level)) return 'bg-fragile-bg border-fragile-border';
    if (['Elevated', 'Medium', 'Moderate'].includes(level)) return 'bg-sensitive-bg border-sensitive-border';
    return 'bg-stable-bg border-stable-border';
  }

  return (
    <div>
      {/* Entity info */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{inputs.companyName || 'Assessment'}</h1>
        <LiveIndicator label="Live Data" size="sm" />
        <span className="text-[11px] text-secondary-foreground">{inputs.industry} · Analysis run {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <button onClick={showEditForm} className="sm:ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-[12px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer">✎ Edit Profile</button>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2: WHY THIS DECISION — 3 interpretive blocks
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Why This Decision</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Block 1: Cascade / Recursive Risk */}
        <div className={`rounded-xl border p-5 ${levelBg(cascadeLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Recursive Risk</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(cascadeLevel)}`}>{cascadeLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">{cascadeExplanation}</div>
          {evolution && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground w-24">Cascade Score</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${evolution.cascadeRiskScore > 0.6 ? 'bg-fragile' : evolution.cascadeRiskScore > 0.35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(evolution.cascadeRiskScore * 100)}%` }} />
                </div>
                <span className="text-[10px] font-mono font-bold text-foreground">{Math.round(evolution.cascadeRiskScore * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground w-24">Amplification</span>
                <span className="text-[10px] font-mono font-bold text-foreground">{evolution.cascadeAmplification.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Block 2: Systemic Exposure */}
        <div className={`rounded-xl border p-5 ${levelBg(systemicLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Systemic Exposure</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(systemicLevel)}`}>{systemicLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">{systemicExplanation}</div>
          {evolution && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground w-24">Correlation</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${evolution.systemicCorrelationScore > 0.6 ? 'bg-fragile' : evolution.systemicCorrelationScore > 0.35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(evolution.systemicCorrelationScore * 100)}%` }} />
                </div>
                <span className="text-[10px] font-mono font-bold text-foreground">{Math.round(evolution.systemicCorrelationScore * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground w-24">Dependency</span>
                <span className="text-[10px] font-mono font-bold text-foreground">{evolution.dependencyTopology.exposure}</span>
              </div>
            </div>
          )}
        </div>

        {/* Block 3: Governance / Model Weakness */}
        <div className={`rounded-xl border p-5 ${levelBg(governanceLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Governance Weakness</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(governanceLevel)}`}>{governanceLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">{governanceExplanation}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-24">AFI Score</span>
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.min(100, structuralScore)}%` }} />
              </div>
              <span className={`text-[10px] font-mono font-bold ${bandColor}`}>{afi.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-24">Exit Risk</span>
              <span className={`text-[10px] font-mono font-bold ${evolution ? levelColor(evolution.exitRisk.level === 'Structurally Locked-In' ? 'Critical' : evolution.exitRisk.level === 'Partially Reversible' ? 'Elevated' : 'Low') : 'text-muted-foreground'}`}>{evolution?.exitRisk.level || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SYSTEM EVOLUTION PANEL (Risk Authority) ═══ */}
      <SystemEvolutionPanel />

      {/* ══════════════════════════════════════════════════
          SECTION 3: SUPPORTING ANALYSIS (collapsible)
          ══════════════════════════════════════════════════ */}
      <Collapsible open={showSupporting} onOpenChange={setShowSupporting}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-4 cursor-pointer">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground">
              {showSupporting ? '▾ Hide Supporting Analysis' : '▸ View Supporting Analysis'}
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4">
          {/* Deployment Authorization */}
          <DeploymentAuthorization
            band={band}
            afi={afi}
            structuralScore={structuralScore}
            components={components}
            agri={results.agri}
            alri={results.alri}
            companyName={inputs.companyName || 'Entity'}
          />

          {/* Hero section */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 pb-4">
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Governance Exposure Engine v4.3.0<InfoTip text={TOOLTIPS.afi} /></div>
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                <div>
                  <div className={`text-[40px] sm:text-[72px] font-bold font-mono leading-none tracking-tight ${bandColor}`}>{structuralScore}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}</div>
                </div>
                <div className="flex-1">
                  <div className={`text-[20px] font-extrabold tracking-tight leading-[1.15] mb-2 ${bandColor}`}>
                    {band === 'Fragile' ? 'STRUCTURAL EXPOSURE DETECTED' : band === 'Sensitive' ? 'ELEVATED STRUCTURAL RISK' : 'EXPOSURE WITHIN TOLERANCE'}
                  </div>
                  <div className="text-[12px] text-secondary-foreground leading-[1.6] mb-3 max-w-[500px]">
                    {band === 'Fragile' ? 'This system creates structural risk not captured in current underwriting models.' :
                      band === 'Sensitive' ? 'Structural risk is emerging. Governance gaps and dependency concentration signal drift.' :
                      'Structural exposure is within tolerance. Governance cadence must be maintained.'}
                  </div>
                  <div className="flex items-center gap-3">
                    <BandBadge band={band} size="md" />
                    <span className={`text-[11px] font-bold ${bandColor}`}>{decisionClass}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`p-3 rounded-lg ${bandBg} border`}>
                    <div className={`text-[22px] font-bold font-mono ${bandColor}`}>ECI-{eciTier}<InfoTip text={TOOLTIPS.eci} /></div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{eciName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AFI Gauge & Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Authority Fragility Index (AFI)" subtitle="Governance Stability Meter">
              <AFIGauge afi={afi} band={band} />
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-stable" /><span className="text-[10px] text-muted-foreground">Stable &lt; 0.85</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sensitive" /><span className="text-[10px] text-muted-foreground">Sensitive 0.85–1.35</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-fragile" /><span className="text-[10px] text-muted-foreground">Fragile &gt; 1.35</span></div>
              </div>
            </SectionCard>

            <SectionCard title="AFI Component Breakdown" subtitle="Structural Dimensions">
              <AFIRadar dr={components.dr} jd={components.jd} rc={components.rc} cd={components.cd} na={components.na} />
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3 text-center">
                {[
                  { key: 'DR', val: components.dr, label: 'Delegation' },
                  { key: 'JD', val: components.jd, label: 'Justification' },
                  { key: 'RC', val: components.rc, label: 'Reversibility' },
                  { key: 'CD', val: components.cd, label: 'Correlation' },
                  { key: 'NA', val: components.na, label: 'Normalisation' },
                ].map(c => (
                  <div key={c.key}>
                    <div className="text-[13px] font-bold font-mono text-foreground">{c.val.toFixed(3)}</div>
                    <div className="text-[10px] font-bold text-primary">{c.key}</div>
                    <div className="text-[9px] text-muted-foreground">{c.label}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Quantum Vulnerability */}
          <QuantumVulnerabilityAssessment />

          {/* Metrics grid: DR, JD, RC, CD */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Delegation Ratio (DR)<InfoTip text={TOOLTIPS.dr} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${dr100 > 60 ? 'text-fragile' : dr100 > 40 ? 'text-sensitive' : 'text-stable'}`}>{dr100}</div>
              <div className="text-[11px] text-secondary-foreground mt-1"><span className={`inline-flex items-center text-[9px] font-bold tracking-wider uppercase px-[7px] py-[2px] rounded ${dr100 > 60 ? 'badge-fragile' : dr100 > 40 ? 'badge-sensitive' : 'badge-stable'}`}>{dr100 > 60 ? 'High' : dr100 > 40 ? 'Moderate' : 'Low'}</span></div>
            </div>
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Justificatory Density (JD)<InfoTip text={TOOLTIPS.jd} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${jd100 < 40 ? 'text-fragile' : jd100 < 60 ? 'text-sensitive' : 'text-stable'}`}>{jd100}</div>
              <div className="text-[11px] text-secondary-foreground mt-1">{jd100 < 40 ? 'Low audit coverage' : 'Partial audit coverage'}</div>
            </div>
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Reversibility Cost Index<InfoTip text={TOOLTIPS.rc} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${rc100 > 60 ? 'text-fragile' : rc100 > 40 ? 'text-sensitive' : 'text-stable'}`}>{rc100}</div>
              <div className="text-[11px] text-secondary-foreground mt-1">{rc100 > 60 ? 'Elevated exit difficulty' : 'Moderate exit difficulty'}</div>
            </div>
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Correlation Density<InfoTip text={TOOLTIPS.cd} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${cd100 > 60 ? 'text-fragile' : cd100 > 40 ? 'text-sensitive' : 'text-stable'}`}>{cd100}</div>
              <div className="text-[11px] text-secondary-foreground mt-1">{cd100 > 60 ? 'High homogeneity' : 'Moderate homogeneity'}</div>
            </div>
          </div>

          {/* COR + ARI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Cognitive Offloading Ratio<InfoTip text={TOOLTIPS.cor} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${corVal > 65 ? 'text-fragile' : corVal > 40 ? 'text-sensitive' : 'text-stable'}`}>{corVal}</div>
              <div className="text-[11px] text-secondary-foreground mt-1">{corVal > 65 ? 'Human judgment substantially offloaded' : corVal > 40 ? 'Moderate offloading' : 'Human judgment remains primary'}</div>
            </div>
            <div className="bg-card border border-border rounded-[10px] p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Authority Risk Index<InfoTip text={TOOLTIPS.ari} /></div>
              <div className={`text-[26px] font-bold font-mono leading-none ${ariVal > 65 ? 'text-fragile' : ariVal > 40 ? 'text-sensitive' : 'text-stable'}`}>{ariVal}</div>
              <div className="text-[11px] text-secondary-foreground mt-1">{ariVal > 65 ? 'Authority substantially transferred' : ariVal > 40 ? 'Authority transfer in progress' : 'Authority appropriately retained'}</div>
            </div>
          </div>

          {/* AGRI / ALRI / SCRI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '⚡', label: 'AGRI — Agentic Risk', score: agri, tier: agriTier, color: agriColor, desc: 'Multi-agent orchestration · Tool-call authority · Persistent memory', tooltip: TOOLTIPS.agri },
              { icon: '⚠', label: 'ALRI — Liability Risk', score: alri, tier: alriTier, color: alriColor, desc: 'Hallucination · Deepfake · Prompt injection · Model drift · Bias', tooltip: TOOLTIPS.alri },
              { icon: '🌐', label: 'SCRI — Systemic Concentration', score: scri, tier: scriTier, color: scriColor, desc: 'Cloud · Model · GPU provider concentration risk', tooltip: TOOLTIPS.scri },
            ].map((panel, i) => (
              <div key={i} className="bg-card border border-border rounded-[10px] p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{panel.icon} {panel.label}<InfoTip text={panel.tooltip} /></div>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-[28px] font-bold font-mono leading-none ${panel.color}`}>{panel.score}</span>
                  <span className="text-[10px] text-muted-foreground mb-1">/100</span>
                </div>
                <div className="h-[6px] bg-secondary rounded overflow-hidden mb-2">
                  <div className={`h-full rounded ${panel.score >= 60 ? 'bg-fragile' : panel.score >= 35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${panel.score}%` }} />
                </div>
                <div className={`text-[10px] font-semibold ${panel.color} mb-1`}>{panel.tier}</div>
                <div className="text-[9px] text-muted-foreground leading-[1.4]">{panel.desc}</div>
              </div>
            ))}
          </div>

          {/* Exposure Surface */}
          <SectionCard title="Exposure Surface by Domain" subtitle="Finance and operations carry the highest unhedged structural risk.">
            {[
              { name: 'Finance', score: finScore, color: '#c0392b' },
              { name: 'Operations', score: opsScore, color: '#e67e22' },
              { name: 'Data Privacy', score: datScore, color: '#9b59b6' },
              { name: 'Compliance', score: cmpScore, color: '#f1c40f' },
              { name: 'Reputation', score: repScore, color: '#3498db' },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-[9px] border-b border-border last:border-none">
                <div className="w-[110px] text-[12px] text-secondary-foreground">{d.name}</div>
                <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
                  <div className="h-full rounded-[3px]" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
                <span className="w-[28px] text-right text-[11px] font-bold font-mono">{d.score}</span>
              </div>
            ))}
          </SectionCard>

          {/* Loss envelope */}
          <div className="bg-card border border-border rounded-[10px] overflow-hidden">
            <div className="p-5">
              <div className="text-[13px] font-bold text-foreground mb-1">Indicative Risk Exposure Bands</div>
              <div className="text-[11px] text-muted-foreground mb-4">Qualitative risk characterization based on structural governance factors.</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border rounded-lg overflow-hidden">
                {[
                  { label: 'Base Risk Band', value: lossEnvelope.expected, sub: 'Structural baseline', color: 'text-stable', conf: 'Directional' },
                  { label: 'Elevated Risk Band', value: lossEnvelope.stress, sub: 'Provider concentration factors', color: 'text-sensitive', conf: 'Committee-Grade' },
                  { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Tail risk — correlated structures', color: 'text-fragile', conf: 'Exploratory' },
                ].map((cell, i) => (
                  <div key={i} className={`p-3 sm:p-4 ${i < 2 ? 'sm:border-r border-b sm:border-b-0 border-border' : ''} ${i === 2 ? 'bg-fragile-bg/30' : ''}`}>
                    <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{cell.label}</div>
                    <div className={`text-[22px] sm:text-[32px] font-bold font-mono leading-none ${cell.color}`}>{cell.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{cell.sub}</div>
                    <span className={`inline-flex mt-2 text-[8px] font-bold tracking-[0.06em] uppercase px-[6px] py-[2px] rounded border ${
                      cell.conf === 'Directional' ? 'bg-sensitive-bg border-sensitive-border text-sensitive' :
                      cell.conf === 'Committee-Grade' ? 'bg-primary/10 border-purple-border text-primary' :
                      'bg-fragile-bg border-fragile-border text-fragile'
                    }`}>{cell.conf}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adjustment Sliders */}
          <SectionCard title="Real-Time Adjustment Controls" icon="🎛️" subtitle="Adjust AFI component weights to explore sensitivity.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              {[
                { key: 'dr', label: 'DR Adjustment', desc: 'Delegation Ratio modifier' },
                { key: 'jd', label: 'JD Adjustment', desc: 'Justificatory Density modifier' },
                { key: 'rc', label: 'RC Adjustment', desc: 'Reversibility Cost modifier' },
                { key: 'cd', label: 'CD Adjustment', desc: 'Continuation Density modifier' },
                { key: 'na', label: 'NA Adjustment', desc: 'Network Amplification modifier' },
                { key: 'ses', label: 'SES Adjustment', desc: 'Structural Exposure modifier' },
              ].map((s) => (
                <div key={s.key} className="py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{s.label}</span>
                    <span className="text-[10px] font-mono font-bold text-primary">{adjustments[s.key as keyof typeof adjustments] > 0 ? '+' : ''}{adjustments[s.key as keyof typeof adjustments]}%</span>
                  </div>
                  <div className="text-[9px] text-muted-foreground mb-1">{s.desc}</div>
                  <input type="range" min={-50} max={50} step={5} value={adjustments[s.key as keyof typeof adjustments]}
                    onChange={(e) => setAdjustments(prev => ({ ...prev, [s.key]: parseInt(e.target.value) }))}
                    className="w-full my-1" />
                </div>
              ))}
            </div>
            {hasAdjustments && (
              <button onClick={() => setAdjustments({ dr: 0, jd: 0, rc: 0, cd: 0, na: 0, ses: 0 })}
                className="text-[10px] text-primary hover:underline font-medium">Reset all adjustments</button>
            )}
          </SectionCard>

          {/* Sensitivity Table */}
          <SectionCard title="Sensitivity Analysis — Variable Impact Ranking" icon="📊" subtitle="Which input variables have the largest marginal impact on AFI?">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b-2 border-border">
                    {['Rank', 'Variable', 'Current', 'AFI Impact', 'Direction', 'Sensitivity'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, variable: 'Execution Authority', current: `${inputs.executionAuthority}/5`, impact: 'High', direction: '↑ AFI', sensitivity: 'Primary DR driver' },
                    { rank: 2, variable: 'Oversight Quality', current: `${inputs.oversightLevel}/5`, impact: 'High', direction: '↓ AFI', sensitivity: 'Primary JD driver (protective)' },
                    { rank: 3, variable: 'Integration Depth', current: `${inputs.integrationDepth}/5`, impact: 'Medium–High', direction: '↑ AFI', sensitivity: 'CD amplifier' },
                    { rank: 4, variable: 'Switching Cost', current: `${inputs.switchingCost}/5`, impact: 'Medium', direction: '↑ AFI', sensitivity: 'RC driver' },
                    { rank: 5, variable: 'Multi-Agent Orchestration', current: `${inputs.multiAgent}/5`, impact: 'Medium', direction: '↑ AFI', sensitivity: 'AGRI amplifier' },
                    { rank: 6, variable: 'Review Cadence', current: `${inputs.reviewCadence}/5`, impact: 'Medium', direction: '↓ AFI', sensitivity: 'JD contributor' },
                    { rank: 7, variable: 'Cloud Concentration', current: `${inputs.cloudConcentration}/5`, impact: 'Low–Medium', direction: '↑ SCRI', sensitivity: 'Portfolio correlation' },
                    { rank: 8, variable: 'Hallucination Exposure', current: `${inputs.hallucinationLiability}/5`, impact: 'Low–Medium', direction: '↑ ALRI', sensitivity: 'Liability vector' },
                  ].map((row) => (
                    <tr key={row.rank} className="border-b border-border">
                      <td className="py-2 pr-4 font-bold text-primary">{row.rank}</td>
                      <td className="py-2 pr-4 font-medium text-foreground">{row.variable}</td>
                      <td className="py-2 pr-4 font-mono text-foreground">{row.current}</td>
                      <td className="py-2 pr-4"><span className={`px-2 py-[1px] rounded text-[9px] font-bold ${row.impact.includes('High') ? 'bg-fragile-bg text-fragile border border-fragile-border' : 'bg-sensitive-bg text-sensitive border border-sensitive-border'}`}>{row.impact}</span></td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{row.direction}</td>
                      <td className="py-2 text-muted-foreground">{row.sensitivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Scenario Robustness */}
          <SectionCard title="Scenario Robustness Check" icon="🔬" subtitle="How stable is the current classification under parameter perturbation?">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { scenario: 'Oversight +1 Level', result: inputs.oversightLevel < 5 ? 'Potential band improvement' : 'Already at maximum', change: inputs.oversightLevel < 5 ? '↓ AFI' : '—', color: 'text-stable' },
                { scenario: 'Execution Authority +1', result: 'Likely band deterioration', change: '↑ AFI', color: 'text-fragile' },
                { scenario: 'Add 1 Provider', result: 'Moderate SCRI improvement', change: '↓ SCRI', color: 'text-stable' },
              ].map((s, i) => (
                <div key={i} className="bg-secondary border border-border rounded-lg p-4">
                  <div className="text-[10px] font-bold text-foreground mb-1">{s.scenario}</div>
                  <div className="text-[11px] text-muted-foreground mb-2">{s.result}</div>
                  <div className={`text-[12px] font-bold font-mono ${s.color}`}>{s.change}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Research Foundation */}
          <div className="flex items-stretch bg-secondary border border-border rounded-[10px] overflow-hidden">
            <div className="w-[3px] bg-primary flex-shrink-0" />
            <div className="flex-1 p-[14px] px-[18px]">
              <div className="text-[9px] tracking-wider uppercase text-muted-foreground font-bold mb-[10px]">Research Foundation — Three Governance Gaps This Engine Addresses</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
                <div>
                  <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper I · EU AI Act Blind Spots</div>
                  <div className="text-[10px] text-secondary-foreground leading-[1.5]">Risk-based regulation governs deployment — not <em className="text-foreground">continuation</em>.</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper II · Price of Convenience</div>
                  <div className="text-[10px] text-secondary-foreground leading-[1.5]">Agentic AI erodes oversight through <em className="text-foreground">delegation density</em>.</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper III · Governing Continuation</div>
                  <div className="text-[10px] text-secondary-foreground leading-[1.5]">Once ECI-2 is reached, <em className="text-foreground">performance ≠ permission</em>.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Comparison */}
          <div className="bg-card border border-border rounded-xl p-7">
            <div className="mb-5">
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-[6px]">Underwriting Intelligence Layer</div>
              <div className="text-[18px] font-bold text-foreground mb-1 tracking-tight">What this engine measures — and others cannot</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[14px] pb-[10px] border-b-2 border-border">Traditional Underwriting Models</div>
                {['Evaluate AI systems individually — systemic effects invisible',
                  'Assume reversibility — do not quantify exit costs',
                  'Ignore shared dependencies — portfolio aggregation not modelled',
                  'Stop at point-in-time compliance — continuation not priced',
                  'Cannot price non-linear loss amplification',
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 py-[6px] text-[12px] text-secondary-foreground leading-[1.5]">
                    <span className="text-fragile font-bold flex-shrink-0">✗</span>{t}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-primary mb-[14px] pb-[10px] border-b-2 border-primary">This Engine</div>
                {['Detects structural dependency and quantifies lock-in depth',
                  'Models continuation without re-authorisation as compounding liability',
                  'Quantifies cross-system propagation — cascade amplification visible',
                  'Estimates portfolio-level correlated exposure',
                  'Produces AFI reflecting structural fragility — not compliance posture',
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 py-[6px] text-[12px] text-secondary-foreground leading-[1.5]">
                    <span className="text-stable font-bold flex-shrink-0">✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Navigation */}

      <StepNavigation currentStep={1} />
      <AppFooter />
    </div>
  );
}
