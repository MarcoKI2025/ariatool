import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { formatCurrency } from '@/lib/formatters';
import { BandBadge, SectionCard, InfoTip } from '@/components/shared/UIComponents';
import { TOOLTIPS } from '@/lib/tooltips';
import { AFIGauge } from '@/components/charts/AFIGauge';
import { AFIRadar } from '@/components/charts/AFIRadar';
import { computeFullAnalysis } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';

export function ExposureResults() {
  const { state, setActiveStep } = useApp();
  const { results, inputs } = state;

  // Adjustment sliders state
  const [adjustments, setAdjustments] = useState({ dr: 0, jd: 0, rc: 0, cd: 0, na: 0, ses: 0 });
  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);

  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  // Derived scores
  const dr100 = Math.round(components.dr * 100);
  const jd100 = Math.round(components.jd * 100);
  const rc100 = Math.round(components.rc * 100);
  const cd100 = Math.round(components.cd * 100);

  // COR & ARI
  const execRaw = inputs.executionAuthority / 5;
  const ovstRaw = inputs.oversightLevel / 5;
  const corVal = Math.round(Math.min(99, ((components.dr + execRaw) / 2) * (1 - ovstRaw * 0.4) * 100));
  const ariVal = Math.round(Math.min(99, (components.dr * 0.5 + (1 - components.jd) * 0.3 + execRaw * 0.2) * 100));

  // ALRI/AGRI tiers
  const agriTier = agri >= 60 ? 'Critical' : agri >= 35 ? 'Elevated' : agri >= 15 ? 'Moderate' : 'Low';
  const alriTier = alri >= 60 ? 'Critical' : alri >= 35 ? 'Elevated' : alri >= 15 ? 'Moderate' : 'Low';
  const scriTier = scri >= 65 ? 'Critical' : scri >= 35 ? 'Elevated' : 'Diversified';

  const agriColor = agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable';
  const alriColor = alri >= 60 ? 'text-fragile' : alri >= 35 ? 'text-sensitive' : 'text-stable';
  const scriColor = scri >= 65 ? 'text-fragile' : scri >= 35 ? 'text-sensitive' : 'text-stable';

  // Exposure domain scores
  const finScore = Math.round(Math.min(99, (components.dr * 0.4 + components.rc * 0.3 + afi * 0.3) * 100));
  const opsScore = Math.round(Math.min(99, (components.cd * 0.5 + components.dr * 0.3 + 0.2) * 80));
  const datScore = Math.round(Math.min(99, (components.cd * 0.3 + components.jd * 0.3 + 0.2) * 80));
  const cmpScore = Math.round(Math.min(99, ((1 - components.jd) * 0.5 + afi * 0.3) * 70));
  const repScore = Math.round(Math.min(99, (components.dr * 0.4 + (1 - components.jd) * 0.3) * 60));

  const showEditForm = () => {
    // dispatch custom event to show form again
    document.dispatchEvent(new CustomEvent('show-exposure-form'));
  };

  return (
    <div>
      {/* Result reward banner */}
      <div className="flex items-start gap-[10px] p-3 px-4 rounded-lg mb-[18px] border border-purple-border" style={{ background: 'linear-gradient(135deg, hsl(var(--purple-bg)), hsl(var(--secondary)))' }}>
        <span className="text-[16px] flex-shrink-0 text-primary">◈</span>
        <div>
          <div className="text-[12px] font-bold text-primary mb-[2px] tracking-[0.01em]">Assessment Complete — {inputs.companyName || 'Entity'}</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.5]">All 6 analysis steps are now unlocked and calibrated to this profile. Navigate using the sidebar to explore Decision Intelligence, Scenarios, Insurance Decision, Executive Report, and Model Governance.</div>
        </div>
      </div>

      {/* Entity info */}
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{inputs.companyName || 'Assessment'}</h1>
        <span className="text-[11px] text-secondary-foreground">{inputs.industry} · Analysis run {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <button onClick={showEditForm} className="ml-auto text-[11px] font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none">✎ Edit Profile</button>
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-6 pb-4">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Governance Exposure Engine v3.0<InfoTip text={TOOLTIPS.afi} /></div>
          <div className="flex items-start gap-8">
            <div>
              <div className={`text-[72px] font-bold font-mono leading-none tracking-tight ${bandColor}`}>{structuralScore}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}</div>
            </div>
            <div className="flex-1">
              <div className={`text-[20px] font-extrabold tracking-tight leading-[1.15] mb-2 ${bandColor}`}>
                {band === 'Fragile' ? 'STRUCTURAL EXPOSURE DETECTED' : band === 'Sensitive' ? 'ELEVATED STRUCTURAL RISK' : 'EXPOSURE WITHIN TOLERANCE'}
              </div>
              <div className="text-[12px] text-secondary-foreground leading-[1.6] mb-3 max-w-[500px]">
                {band === 'Fragile' ? 'This system creates structural risk not captured in current underwriting models. Dependency, continuation, and cross-system propagation exceed standard tolerance thresholds.' :
                  band === 'Sensitive' ? 'Structural risk is emerging. Governance gaps and dependency concentration signal drift toward Fragile classification without intervention.' :
                  'Structural exposure is within tolerance. Governance cadence must be maintained — any material change triggers mandatory re-assessment.'}
              </div>
              <div className="flex items-center gap-3">
                <BandBadge band={band} size="md" />
                <span className={`text-[11px] font-bold ${bandColor}`}>{band === 'Fragile' ? 'Committee Review Required' : band === 'Sensitive' ? 'Conditional Review Process' : 'Standard Process'}</span>
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
        {/* Signal chips */}
        <div className={`px-6 py-3 border-t ${bandBg} border`}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Decision Pathway:</span>
            <span className={`px-3 py-1 rounded text-[10px] font-bold ${band === 'Fragile' ? 'bg-fragile text-white' : band === 'Sensitive' ? 'bg-sensitive text-white' : 'bg-stable text-white'}`}>
              {decisionClass}
            </span>
            {band !== 'Stable' && <span className="px-3 py-1 rounded text-[10px] font-bold bg-sensitive text-white">Structural Remediation Required</span>}
            {band === 'Fragile' && <span className="px-3 py-1 rounded text-[10px] font-bold bg-fragile text-white">Dependency Diversification Required</span>}
          </div>
        </div>
      </div>

      {/* ═══ AFI GAUGE & RADAR CHARTS ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Authority Fragility Index (AFI)" subtitle="Governance Stability Meter">
          <AFIGauge afi={afi} band={band} />
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-stable" />
              <span className="text-[10px] text-muted-foreground">Stable &lt; 0.85</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sensitive" />
              <span className="text-[10px] text-muted-foreground">Sensitive 0.85–1.35</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-fragile" />
              <span className="text-[10px] text-muted-foreground">Fragile &gt; 1.35</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AFI Component Breakdown" subtitle="Structural Dimensions">
          <AFIRadar dr={components.dr} jd={components.jd} rc={components.rc} cd={components.cd} na={components.na} />
          <div className="grid grid-cols-5 gap-2 mt-3 text-center">
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

      {/* ═══ STEP 1: Diagnosis Banner ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Diagnosis</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className={`rounded-[10px] border p-5 mb-4 ${bandBg}`}>
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[5px]">Executive Decision Signal</div>
        <div className={`text-[17px] font-extrabold tracking-[0.01em] mb-[14px] ${bandColor}`}>
          {band === 'Fragile' ? 'COMMITTEE REVIEW REQUIRED' : band === 'Sensitive' ? 'CONDITIONAL REVIEW PROCESS' : 'STANDARD UNDERWRITING PROCESS'}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Risk Status</div><div className="text-[12px] text-foreground leading-[1.55]">{band === 'Fragile' ? 'Committee review required' : band === 'Sensitive' ? 'Conditional review process' : 'Standard underwriting process'}</div></div>
          <div><div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Required Action</div><div className="text-[12px] text-foreground leading-[1.55]">{band === 'Fragile' ? 'Apply 150–180% premium loading immediately. Structural change required within 90 days.' : band === 'Sensitive' ? 'Apply precautionary loading 80–120%. Governance review required.' : 'Standard terms. Maintain governance cadence.'}</div></div>
          <div><div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Financial Consequence</div><div className="text-[12px] text-foreground leading-[1.55]">Exposure creates non-linear risk amplification. Tail scenarios materially elevated under correlated failure.</div></div>
        </div>
      </div>

      {/* Metrics grid: DR, JD, RC, CD */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Delegation Ratio (DR)<InfoTip text={TOOLTIPS.dr} /></div>
          <div className={`text-[26px] font-bold font-mono leading-none ${dr100 > 60 ? 'text-fragile' : dr100 > 40 ? 'text-sensitive' : 'text-stable'}`}>{dr100}</div>
          <div className="text-[11px] text-secondary-foreground mt-1">High delegation — <span className={`inline-flex items-center text-[9px] font-bold tracking-wider uppercase px-[7px] py-[2px] rounded ${dr100 > 60 ? 'badge-fragile' : dr100 > 40 ? 'badge-sensitive' : 'badge-stable'}`}>{dr100 > 60 ? 'High' : dr100 > 40 ? 'Moderate' : 'Low'}</span></div>
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
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Cognitive Offloading Ratio</div>
          <div className={`text-[26px] font-bold font-mono leading-none ${corVal > 65 ? 'text-fragile' : corVal > 40 ? 'text-sensitive' : 'text-stable'}`}>{corVal}</div>
          <div className="text-[11px] text-secondary-foreground mt-1">{corVal > 65 ? 'Human judgment substantially offloaded' : corVal > 40 ? 'Moderate offloading — intervention required' : 'Human judgment remains primary'}</div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-[6px]">Authority Risk Index</div>
          <div className={`text-[26px] font-bold font-mono leading-none ${ariVal > 65 ? 'text-fragile' : ariVal > 40 ? 'text-sensitive' : 'text-stable'}`}>{ariVal}</div>
          <div className="text-[11px] text-secondary-foreground mt-1">{ariVal > 65 ? 'Authority substantially transferred' : ariVal > 40 ? 'Authority transfer in progress' : 'Authority appropriately retained'}</div>
        </div>
      </div>

      {/* ═══ STEP 2: Structural Exposure Map ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Structural Exposure Map</span>
        <div className="flex-1 h-px bg-border" />
      </div>

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

      {/* ═══ STEP 3: Cascade Propagation ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">3</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">How Risk Propagates</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-card border-2 border-border rounded-xl p-6 mb-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #f39c12, #c0392b, #7b0e0e)' }} />
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-fragile">Cascade Propagation Model — Signature Analysis</div>
            <div className="text-[16px] font-bold text-foreground mt-[3px] mb-[3px]">How failure travels across systems — and amplifies at each layer</div>
            <div className="text-[12px] text-secondary-foreground">Each operational layer amplifies the preceding disruption.</div>
          </div>
          <div className="flex gap-4 text-right">
            <div><div className="text-[24px] font-bold font-mono text-fragile">{amplificationFactor.split('–')[1] || '3.8×'}</div><div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Total Amplification</div></div>
            <div><div className="text-[18px] font-bold font-mono text-fragile">6–48h</div><div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Propagation Time</div></div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-0 mb-4">
          {[
            { icon: '⚡', name: 'AI Provider Failure', value: 'Origin', layer: 'Layer 0', color: 'text-fragile' },
            { icon: '🔧', name: 'Workflow Disruption', value: '+40%', layer: 'Layer 1', color: 'text-sensitive' },
            { icon: '⚖', name: 'Decision Errors', value: '+110%', layer: 'Layer 2', color: 'text-sensitive' },
            { icon: '📉', name: 'Revenue Impact', value: '+220%', layer: 'Layer 3', color: 'text-fragile' },
            { icon: '🌐', name: 'Portfolio Contagion', value: '+380%', layer: 'Layer 4', color: 'text-fragile' },
          ].map((node, i) => (
            <div key={i} className="text-center px-2 py-3 relative">
              {i < 4 && <span className="absolute right-[-11px] top-[38%] text-muted-foreground text-sm z-[1]">→</span>}
              <div className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center mx-auto mb-2 text-[14px] ${
                i <= 1 ? 'bg-fragile-bg border-fragile-border' : 'bg-sensitive-bg border-sensitive-border'
              }`}>{node.icon}</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground leading-[1.3] mb-1">{node.name}</div>
              <div className={`text-[13px] font-bold font-mono ${node.color}`}>{node.value}</div>
              <div className="text-[9px] text-muted-foreground">{node.layer}</div>
            </div>
          ))}
        </div>

        {/* Cascade insight */}
        <div className="bg-chrome rounded-lg p-[14px] flex items-start gap-[10px]">
          <span className="text-fragile text-sm flex-shrink-0 mt-[1px]">⚠</span>
          <div>
            <div className="text-[12px] font-semibold text-white leading-[1.4]">Traditional models stop at system failure. This level of propagation is not captured in traditional risk models.</div>
            <div className="text-[11px] text-chrome-fg mt-[3px]">This model extends into cross-system propagation — each layer amplifies the preceding disruption, creating non-linear risk escalation.</div>
          </div>
        </div>
      </div>

      {/* ═══ STEP 4: Financial Consequence ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">4</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Financial Consequence</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Continuation Paradox callout */}
      <div className="p-4 px-5 bg-chrome rounded-[10px] mb-4 border-l-4 border-l-primary">
        <div className="text-[9px] tracking-wider uppercase text-chrome-fg-muted font-bold mb-[6px]">The Continuation Paradox — Why This Risk Is Invisible</div>
        <div className="text-[13px] font-semibold text-chrome-fg-bright leading-[1.4] mb-[5px] italic">"Agentic AI works often enough to be trusted — the Autopilot Effect quietly reduces oversight — and makes manual intervention feel like unnecessary friction."</div>
        <div className="text-[10px] text-chrome-fg leading-[1.5]">The more reliable a system becomes, the harder it is to question its continued existence. Performance-based legitimacy erodes governance leverage. <span className="text-chrome-fg-muted">— AGAF, 2026</span></div>
      </div>

      {/* Loss envelope */}
      <div className="bg-card border border-border rounded-[10px] overflow-hidden mb-4">
        <div className="p-5">
          <div className="text-[13px] font-bold text-foreground mb-1">Indicative Risk Exposure Bands</div>
          <div className="text-[11px] text-muted-foreground mb-4">Qualitative risk characterization based on structural governance factors.</div>
          <div className="grid grid-cols-3 gap-0 border border-border rounded-lg overflow-hidden">
            {[
              { label: 'Base Risk Band', value: formatCurrency(lossEnvelope.expected), sub: 'Structural baseline', color: 'text-stable' },
              { label: 'Elevated Risk Band', value: formatCurrency(lossEnvelope.stress), sub: 'Provider concentration factors', color: 'text-sensitive' },
              { label: 'Critical Risk Band', value: formatCurrency(lossEnvelope.tail), sub: 'Tail risk — correlated structures', color: 'text-fragile' },
            ].map((cell, i) => (
              <div key={i} className={`p-4 ${i < 2 ? 'border-r border-border' : ''} ${i === 2 ? 'bg-fragile-bg/30' : ''}`}>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{cell.label}</div>
                <div className={`text-[32px] font-bold font-mono leading-none ${cell.color}`}>{cell.value}</div>
                <div className="text-[10px] text-muted-foreground mt-2">{cell.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border bg-fragile-bg/30">
          <div className="text-[11px] font-bold text-fragile mb-1">⚠ Tail risk amplification from correlated dependencies</div>
          <div className="text-[10px] text-fragile/80 leading-[1.5]">Swiss Re sigma insights 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic and accumulation risk."</div>
        </div>
      </div>

      {/* ═══ AGRI / ALRI / SCRI Panels ═══ */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: '⚡', label: 'AGRI — Agentic Risk', score: agri, tier: agriTier, color: agriColor, desc: 'Multi-agent orchestration · Tool-call authority · Persistent memory' },
          { icon: '⚠', label: 'ALRI — Liability Risk', score: alri, tier: alriTier, color: alriColor, desc: 'Hallucination · Deepfake · Prompt injection · Model drift · Bias' },
          { icon: '🌐', label: 'SCRI — Systemic Concentration', score: scri, tier: scriTier, color: scriColor, desc: 'Cloud · Model · GPU provider concentration risk' },
        ].map((panel, i) => (
          <div key={i} className="bg-card border border-border rounded-[10px] p-4">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{panel.icon} {panel.label}</div>
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

      {/* Research Foundation */}
      <div className="flex items-stretch bg-chrome rounded-[10px] overflow-hidden mb-5">
        <div className="w-[3px] bg-primary flex-shrink-0" />
        <div className="flex-1 p-[14px] px-[18px]">
          <div className="text-[9px] tracking-wider uppercase text-chrome-fg-muted font-bold mb-[10px]">Research Foundation — Three Governance Gaps This Engine Addresses</div>
          <div className="grid grid-cols-3 gap-[14px]">
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper I · EU AI Act Blind Spots</div>
              <div className="text-[10px] text-chrome-fg leading-[1.5]">Risk-based regulation governs deployment — not <em className="text-chrome-fg-bright">continuation</em>. Systems persist without re-authorisation.</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper II · Price of Convenience</div>
              <div className="text-[10px] text-chrome-fg leading-[1.5]">Agentic AI erodes oversight without malice — through <em className="text-chrome-fg-bright">delegation density</em> and oversight decay.</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper III · Governing Continuation</div>
              <div className="text-[10px] text-chrome-fg leading-[1.5]">Evaluation cannot authorise existence. Once ECI-2 is reached, <em className="text-chrome-fg-bright">performance ≠ permission</em>.</div>
            </div>
          </div>
          <div className="mt-[10px] pt-2 border-t border-chrome-border text-[10px] text-chrome-fg-muted">AGAF, M. (Feb 2026) — Working Papers on AI Continuation Governance. <span className="text-chrome-fg">Buyers who adopt this framework now are 3 years ahead of enforcement.</span></div>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="bg-card border border-border rounded-xl p-7 mb-5">
        <div className="mb-5">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-[6px]">New Category · Underwriting Intelligence Layer</div>
          <div className="text-[18px] font-bold text-foreground mb-1 tracking-tight">What this engine measures — and others cannot</div>
          <div className="text-[13px] text-secondary-foreground max-w-[560px] leading-[1.6]">This is not a compliance tool. It is a structural risk detection layer that reveals exposure invisible to traditional underwriting models.</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[14px] pb-[10px] border-b-2 border-border">Traditional Underwriting Models</div>
            {['Evaluate AI systems individually — systemic network effects remain invisible',
              'Assume reversibility — do not quantify exit costs or switching friction',
              'Ignore shared model dependencies — portfolio-level aggregation never modelled',
              'Stop at point-in-time compliance — continuation without re-authorisation not priced',
              'Cannot price non-linear loss amplification — standard models underestimate tail risk 3–5×',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 py-[6px] text-[12px] text-secondary-foreground leading-[1.5]">
                <span className="text-fragile font-bold flex-shrink-0">✗</span>{t}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-primary mb-[14px] pb-[10px] border-b-2 border-primary">This Engine</div>
            {['Detects structural dependency and quantifies lock-in depth — creates explicit reversibility cost signal',
              'Models continuation without re-authorisation as a persistent, compounding liability state',
              'Quantifies cross-system propagation — cascade amplification visible before it materialises',
              'Estimates portfolio-level correlated exposure across entities sharing AI infrastructure',
              'Produces a single AFI signal that reflects structural fragility — not compliance posture',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 py-[6px] text-[12px] text-secondary-foreground leading-[1.5]">
                <span className="text-stable font-bold flex-shrink-0">✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
