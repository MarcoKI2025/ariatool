import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { BandBadge, SectionCard, LockedState, InfoTip } from '@/components/shared/UIComponents';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TOOLTIPS } from '@/lib/tooltips';

export function DecisionIntelligence() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Decision Intelligence Locked" description="Complete the Exposure Analysis to unlock AFI scoring, governance exposure, and structural risk signals." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, eciTier, eciName, lossEnvelope, agri, amplificationFactor, correlationFactor, alri, scri, compositeRiskIndex, mdr, mdrTier, mdrLabel, rfsi, rfsiTier, rfsiLabel, rfsiDrivers, frameDriftAlerts } = results;

  // Responsibility scores
  const respFragmentation = Math.round(Math.min(99, (1 - components.jd) * 100 + components.dr * 20));
  const stewardshipClarity = Math.round(Math.min(99, components.jd * 60 + (1 - components.dr) * 20));
  const decisionAttribGap = Math.round(Math.min(99, components.dr * 80 + (1 - components.jd) * 15));
  const diffuseLabel = respFragmentation >= 60 ? 'Diffuse' : respFragmentation >= 40 ? 'Partial' : 'Clear';

  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' : 'bg-stable-bg border-stable';

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 2 of 6 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Decision Intelligence</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Multi-dimensional risk characterization using AFI, ECI, AGRI, ALRI, and SCRI indices — calibrated to {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* ═══ HERO BOARD STATEMENT ═══ */}
      <div className="bg-card rounded-[9px] mb-5 p-[18px_22px] border-l-4 border-l-fragile flex items-start gap-3">
        <div className="w-1 h-1 rounded-full bg-fragile flex-shrink-0 mt-[7px] opacity-70" />
        <div className="text-[13px] font-semibold text-foreground leading-[1.45]">
          {band === 'Fragile' ? 'This system creates structural AI risk that is not captured by compliance frameworks, point-in-time audits, or standard underwriting models — and that accumulates without a triggering incident.' :
           band === 'Sensitive' ? 'This system introduces moderate structural risk approaching underwriting tolerance. Conditional coverage available with mandatory governance improvement timeline.' :
           'This system operates within current governance tolerance. Standard monitoring cadence applies.'}
        </div>
      </div>

      {/* ═══ HERO DIAGNOSIS ═══ */}
      <div className={`rounded-xl p-4 sm:p-6 mb-4 border-2 ${bandBg}`}>
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Governance Exposure Engine v3.0</div>
        <div className={`text-[18px] sm:text-[28px] font-extrabold tracking-tight leading-[1.1] mb-3 uppercase ${bandColor}`}>
          {band === 'Fragile' ? 'Structural Exposure Detected' :
           band === 'Sensitive' ? 'Elevated Structural Signals' :
           'Governance Signals Within Range'}
        </div>
        <div className="text-[12px] text-secondary-foreground mb-3">This system identifies structural AI risks not captured in traditional underwriting models.</div>
        <div className="text-[12px] text-muted-foreground leading-[1.6] max-w-[700px] mb-4">
          {band === 'Fragile' 
            ? 'This system introduces structural AI risk that exceeds current underwriting assumptions — and is not visible through compliance frameworks, audit processes, or point-in-time regulatory reviews.'
            : band === 'Sensitive'
            ? 'Governance gaps signal drift toward Fragile classification. Conditional coverage available with mandatory improvement requirements.'
            : 'Structural exposure is within manageable bounds. Standard coverage terms apply with routine monitoring.'}
        </div>
        <div className="text-[10px] text-muted-foreground">
          Structural AI exposure of this risk profile is not priced, modelled, or reserved for in standard underwriting frameworks.
        </div>
      </div>

      {/* ═══ HERO SCORE + ECI ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-0">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
                Structural Exposure Score<InfoTip text={TOOLTIPS.afi} />
                <span className="ml-2 text-[8px] font-bold px-[7px] py-[2px] bg-purple-bg text-primary border border-purple-border rounded">◈ Governance Signal</span>
              </div>
              <div className={`text-[36px] sm:text-[72px] font-bold font-mono leading-none tracking-tight ${bandColor}`}>{structuralScore}</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}
              </div>
              <div className="text-[9px] text-muted-foreground mt-[5px]">
                Signal confidence: <span className="text-sensitive font-semibold">Medium — self-attested inputs</span>
              </div>
              <div className={`text-[10px] font-semibold mt-[3px] ${bandColor}`}>
                {band === 'Fragile' ? 'Interpretation: High structural dependency with limited reversibility' :
                 band === 'Sensitive' ? 'Interpretation: Elevated dependency — governance improvements required' :
                 'Interpretation: Structural exposure within manageable bounds'}
              </div>
            </div>
            <div className="flex-1">
              <div className="relative w-[120px] sm:w-[140px] h-[60px] sm:h-[70px] mx-auto">
                <svg viewBox="0 0 140 70" className="w-full h-full">
                  <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" 
                    stroke={band === 'Fragile' ? 'hsl(var(--fragile))' : band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${Math.min(188, structuralScore * 1.88)} 188`} />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <div className={`text-[18px] font-bold font-mono ${bandColor}`}>
                    ECI-{eciTier}<InfoTip text={TOOLTIPS.eci} />
                  </div>
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{eciName}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <BandBadge band={band} size="md" />
            <span className="text-[11px] text-muted-foreground">
              {band === 'Fragile' ? 'Above underwriting tolerance — committee escalation required' : 
               band === 'Sensitive' ? 'Approaching tolerance threshold — conditional terms apply' : 
               'Below tolerance threshold — standard terms'}
            </span>
          </div>
          <div className="text-[11px] text-secondary-foreground mt-3 leading-[1.5]">
            Use this panel as the board-level diagnosis anchor. If this section cannot justify a pricing or governance decision on its own, the model is not yet decision-grade.
          </div>
        </div>

        {/* Quick metrics */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'AFI Score', value: afi.toFixed(2), color: bandColor, tooltip: TOOLTIPS.afi },
            { label: 'AGRI', value: `${agri}`, color: agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable' },
            { label: 'Decision Class', value: results.decisionClass, color: bandColor },
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}{m.tooltip && <InfoTip text={m.tooltip} />}</div>
              <div className={`text-[18px] font-bold font-mono ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ KEY STRUCTURAL SIGNALS ═══ */}
      <div className={`px-6 py-3 rounded-b-xl mb-4 border-t ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' :
        'bg-stable-bg border-stable-border'
      }`}>
        <div className={`text-[9px] font-bold tracking-wider uppercase mb-2 ${bandColor}`}>Key Structural Signals</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            'System persists without explicit re-authorisation',
            'Dependency cannot be reversed without operational disruption',
            'Shared model infrastructure creates correlated portfolio exposure',
          ].map((sig, i) => (
            <div key={i} className={`flex items-start gap-2 p-2 rounded-md border ${
              band === 'Fragile' ? 'border-fragile-border' : band === 'Sensitive' ? 'border-sensitive-border' : 'border-stable-border'
            }`}>
              <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 mt-[5px] ${
                band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
              }`} />
              <span className={`text-[10px] font-medium ${bandColor}`}>{sig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HERO ACTIONS — Required Action pills + navigation ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 p-3 bg-card border border-border rounded-xl gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] text-muted-foreground font-bold tracking-[0.08em] uppercase mr-1">Required Action:</span>
          <span className={`px-3 py-1 rounded text-[10px] font-bold text-foreground ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`}>
            {band === 'Fragile' ? 'Insurable with Premium Loading' : band === 'Sensitive' ? 'Conditional Coverage' : 'Standard Terms'}
          </span>
          {band !== 'Stable' && <span className="px-3 py-1 rounded text-[10px] font-bold bg-sensitive text-foreground">Structural Remediation Required</span>}
          {band === 'Fragile' && <span className="px-3 py-1 rounded text-[10px] font-bold bg-sensitive text-foreground">Dependency Diversification Required</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveStep(4)} className="px-3 py-[6px] bg-secondary text-foreground border border-border rounded-lg text-[11px] font-semibold hover:bg-muted transition-colors">Insurance View →</button>
          <button onClick={() => setActiveStep(5)} className="px-3 py-[6px] bg-primary text-primary-foreground rounded-lg text-[11px] font-semibold hover:bg-primary/90 transition-colors">Generate Report</button>
        </div>
      </div>

      {/* ═══ GLOBAL INSIGHT ═══ */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4 text-[12px] text-secondary-foreground leading-[1.6]">
        <strong className="text-foreground">Standard compliance frameworks cannot detect, price, or reserve for this exposure.</strong> Continuation risk accumulates without a triggering incident. Responsibility is distributed without a named owner. Dependency deepens until exit becomes operationally impossible. This assessment quantifies what happens in the governance gap.
      </div>

      {/* ═══ AFI COMPONENT CHIPS ═══ */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { label: `DR ${Math.round(components.dr * 100)}`, desc: 'Delegation Ratio', tooltip: TOOLTIPS.dr },
          { label: `JD ${Math.round(components.jd * 100)}`, desc: 'Justificatory Density', tooltip: TOOLTIPS.jd },
          { label: `RC ${Math.round(components.rc * 100)}`, desc: 'Reversibility Cost', tooltip: TOOLTIPS.rc },
          { label: `CD ${Math.round(components.cd * 100)}`, desc: 'Continuation Density', tooltip: TOOLTIPS.cd },
        ].map((c, i) => (
          <div key={i} className="px-3 py-[6px] bg-card border border-border rounded-lg text-[10px]">
            <span className="font-mono font-bold text-foreground">{c.label}</span>
            <span className="text-muted-foreground ml-1">{c.desc}</span>
            {c.tooltip && <InfoTip text={c.tooltip} />}
          </div>
        ))}
        <BandBadge band={band} size="sm" />
      </div>

      {/* ═══ AGRI — Standalone Panel (matches HTML position) ═══ */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">⚡ AI Governance Readiness Index (AGRI)<InfoTip text="Multi-agent orchestration, tool-call authority, persistent memory, human checkpoints" /></div>
            <div className={`text-[32px] sm:text-[48px] font-bold font-mono leading-none ${agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable'}`}>{agri}</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase mt-1 ${agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable'}`}>
              {agri >= 60 ? 'Critical — Autonomous Governance Required' : agri >= 35 ? 'Elevated — Governance Gaps Emerging' : agri >= 15 ? 'Moderate — Manageable with Controls' : 'Low — Standard Governance Adequate'}
            </div>
          </div>
          <div className="flex-1 pt-3">
            <div className="h-[6px] bg-border rounded-[3px] overflow-hidden mb-3">
              <div className={`h-full rounded-[3px] ${agri >= 60 ? 'bg-fragile' : agri >= 35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${agri}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground leading-[1.55]">
              Multi-agent orchestration · Tool-call authority · Persistent memory · Human checkpoints. AGRI measures the degree to which AI agents operate with structural autonomy beyond traditional software boundaries.
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ALRI — Standalone Panel (matches HTML position) ═══ */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">⚠ AI Liability Risk Index (ALRI)</div>
            <div className={`text-[48px] font-bold font-mono leading-none ${alri >= 60 ? 'text-fragile' : alri >= 35 ? 'text-sensitive' : 'text-stable'}`}>{alri}</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase mt-1 ${alri >= 60 ? 'text-fragile' : alri >= 35 ? 'text-sensitive' : 'text-stable'}`}>
              {alri >= 60 ? 'Critical — Multiple Active Claim Vectors' : alri >= 35 ? 'Elevated — Emerging Claim Exposure' : alri >= 15 ? 'Moderate — Manageable with Controls' : 'Low — Controlled Liability Profile'}
            </div>
          </div>
          <div className="flex-1 pt-3">
            <div className="h-[6px] bg-border rounded-[3px] overflow-hidden mb-3">
              <div className={`h-full rounded-[3px] ${alri >= 60 ? 'bg-fragile' : alri >= 35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${alri}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground leading-[1.55]">
              Premium loading from ALRI: <strong className="text-foreground">+{Math.round(alri * 0.8)}%</strong> above base premium. Based on hallucination, deepfake, prompt injection, model drift, algorithmic bias, shadow AI, explainability, data integrity, and ESG liability dimensions.
            </div>
          </div>
        </div>
      </div>

      {/* ═══ "THIS MEANS" CALLOUT ═══ */}
      <div className="bg-card rounded-xl p-5 mb-4 border-l-4 border-l-fragile border border-border flex items-start gap-[14px]">
        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
          band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
        }`}>
          <span className="text-[11px] text-foreground font-bold">!</span>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-bold mb-[5px]">This Means</div>
          <div className="text-[16px] font-bold text-foreground leading-[1.3]">
            {band === 'Fragile' ? 'Standard coverage is not justified. Apply mandatory premium loading and require structural remediation before renewal.' :
             band === 'Sensitive' ? 'Conditional coverage — structural improvements required within 90 days.' :
             'Standard coverage terms apply. Maintain governance cadence.'}
          </div>
          <div className="text-[12px] text-muted-foreground mt-2 leading-[1.5]">
            Risk characterization based on structural governance factors: AFI score, delegation depth, provider concentration, continuation risk, justificatory density. Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries." EU AI Act Art. 99 penalty exposure shown separately. Framework ≠ guarantee.
          </div>
        </div>
      </div>

      {/* ═══ EXECUTIVE DECISION LAYER (gradient-top-bar, actions, classification badge, bottom pills) ═══ */}
      <div className="bg-card border border-border rounded-xl mb-4 relative overflow-hidden">
        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: 'linear-gradient(to right, #b53020, #c0392b, #4038b8)' }} />
        
        {/* Top section: judgment + classification badge */}
        <div className="p-[18px_20px_18px] sm:p-[22px_28px_18px] grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-start">
          <div>
            <div className="text-[9px] font-bold tracking-[0.13em] uppercase text-primary mb-2 flex items-center gap-[6px]">
              <div className="w-1 h-1 rounded-full bg-[#7068e0]" />
              Governance Assessment · Structured Risk Signal for Committee Review
              <span className="text-[8px] font-bold px-[7px] py-[2px] bg-purple-bg text-primary border border-purple-border rounded">◈ Governance Signal</span>
            </div>
            <div className="text-[16px] font-bold text-foreground leading-[1.35] mb-[10px] max-w-[560px]">
              {band === 'Fragile' ? <>This deployment exceeds underwriting tolerance — <span className="text-fragile">structural remediation is required</span> before standard coverage terms can apply.</> :
               band === 'Sensitive' ? <>This deployment approaches tolerance threshold — <span className="text-sensitive">conditional governance improvements required</span> within 90 days.</> :
               <>This deployment is within tolerance — <span className="text-stable">maintain current governance cadence</span> and re-assess at renewal.</>}
            </div>
            <div className="text-[11px] text-muted-foreground leading-[1.6] max-w-[520px] mb-[14px]">
              The Authority Fragility Index exceeds the threshold above which continuation risk, delegation density, and dependency lock-in create non-linear financial exposure. A system can be fully compliant with the EU AI Act and still create this exposure. Compliance measures intent — this model measures <strong className="text-foreground">structural cost</strong>.
            </div>
            {/* Action items */}
            <div className="flex flex-col gap-[7px]">
              {(band === 'Fragile' ? [
                { cls: 'bg-fragile-bg border-fragile-border', badge: 'Critical', badgeCls: 'bg-fragile-bg text-fragile border border-fragile-border', t: 'Apply mandatory premium loading (150–180%)', s: 'Below this loading, reserves are structurally understated by 3–5×.' },
                { cls: 'bg-fragile-bg border-fragile-border', badge: 'Critical', badgeCls: 'bg-fragile-bg text-fragile border border-fragile-border', t: 'Require dependency diversification within 90 days', s: `Current provider concentration creates single points of failure — correlated exposure ${amplificationFactor}.` },
                { cls: 'bg-sensitive-bg border-sensitive-border', badge: 'Condition', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', t: 'Institute quarterly governance re-authorisation', s: 'Without re-authorisation cadence, structural risk accumulates without upper bound.' },
                { cls: 'bg-sensitive-bg border-sensitive-border', badge: 'Required', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', t: 'Commission exit feasibility assessment', s: `ECI tier indicates institutional dependency — exit path must be documented before next renewal.` },
                { cls: 'bg-purple-bg border-purple-border', badge: 'Recommended', badgeCls: 'bg-purple-bg text-primary border border-purple-border', t: 'Initiate cross-system cascade impact study', s: `Amplification factor ${amplificationFactor} suggests non-linear portfolio exposure. Reinsurance treaty review warranted.` },
              ] : band === 'Sensitive' ? [
                { cls: 'bg-sensitive-bg border-sensitive-border', badge: 'Required', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', t: 'Increase governance review cadence to quarterly', s: 'Current oversight level is insufficient given dependency concentration trajectory.' },
                { cls: 'bg-sensitive-bg border-sensitive-border', badge: 'Required', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', t: 'Document and test dependency exit paths', s: 'Reversibility cost is elevated — exit capability must be verified before it becomes operationally infeasible.' },
                { cls: 'bg-purple-bg border-purple-border', badge: 'Recommended', badgeCls: 'bg-purple-bg text-primary border border-purple-border', t: 'Apply precautionary premium loading (80–120%)', s: 'Below Fragile threshold, but trajectory warrants proactive pricing adjustment.' },
              ] : [
                { cls: 'bg-purple-bg border-purple-border', badge: 'Maintain', badgeCls: 'bg-purple-bg text-primary border border-purple-border', t: 'Continue governance cadence — re-assess annually', s: 'Current profile is within tolerance. Structural changes require re-assessment.' },
                { cls: 'bg-purple-bg border-purple-border', badge: 'Monitor', badgeCls: 'bg-purple-bg text-primary border border-purple-border', t: 'Monitor delegation density and dependency concentration', s: 'Key drift vectors to watch — both tend to increase silently over time.' },
              ]).map((ac, i) => (
                <div key={i} className={`flex items-start gap-[10px] p-[9px_12px] rounded-[7px] border ${ac.cls}`}>
                  <span className={`text-[8px] font-bold tracking-[0.07em] uppercase px-[7px] py-[2px] rounded-[3px] flex-shrink-0 mt-[1px] ${ac.badgeCls}`}>{ac.badge}</span>
                  <div>
                    <div className="text-[11px] font-semibold text-foreground leading-[1.4]">{ac.t}</div>
                    <div className="text-[10px] text-muted-foreground mt-[2px] leading-[1.4]">{ac.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Risk Classification Badge */}
          <div className="text-right">
            <div className="text-[8px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-[6px]">Risk Classification</div>
            <div className={`text-[22px] font-extrabold font-mono leading-none p-[10px_16px] rounded-lg inline-block tracking-tight border ${
              band === 'Fragile' ? 'bg-fragile-bg text-fragile border-fragile-border' :
              band === 'Sensitive' ? 'bg-sensitive-bg text-sensitive border-sensitive-border' :
              'bg-stable-bg text-stable border-stable-border'
            }`}>
              {band === 'Fragile' ? 'CRITICAL' : band === 'Sensitive' ? 'MODERATE' : 'LOW'}
            </div>
            <div className="text-[9px] text-muted-foreground mt-[5px]">
              {band === 'Fragile' ? 'Above tolerance' : band === 'Sensitive' ? 'Approaching threshold' : 'Within tolerance'}
            </div>
          </div>
        </div>
        
        {/* Bottom pills bar */}
        <div className="px-4 sm:px-7 py-3 border-t border-border bg-secondary flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground flex-shrink-0">Structural Signals:</div>
          {(() => {
            const drPct = Math.round(components.dr * 100);
            const rcPct = Math.round(components.rc * 100);
            const drColor = drPct > 65 ? 'bg-fragile/20 text-fragile border-fragile/30' : drPct > 40 ? 'bg-sensitive/20 text-sensitive border-sensitive/30' : 'bg-stable/20 text-stable border-stable/30';
            const rcColor = rcPct > 65 ? 'bg-fragile/20 text-fragile border-fragile/30' : rcPct > 40 ? 'bg-sensitive/20 text-sensitive border-sensitive/30' : 'bg-stable/20 text-stable border-stable/30';
            const contColor = band === 'Fragile' ? 'bg-fragile/20 text-fragile border-fragile/30' : band === 'Sensitive' ? 'bg-sensitive/20 text-sensitive border-sensitive/30' : 'bg-stable/20 text-stable border-stable/30';
            return (
              <>
                <span className={`px-[10px] py-[3px] rounded-[4px] text-[10px] font-semibold border ${drColor}`}>
                  Delegation Density: {drPct > 65 ? 'High' : drPct > 40 ? 'Moderate' : 'Low'} ({drPct})
                </span>
                <span className={`px-[10px] py-[3px] rounded-[4px] text-[10px] font-semibold border ${rcColor}`}>
                  Reversibility: {rcPct > 65 ? 'Locked' : rcPct > 40 ? 'Constrained' : 'Available'} ({rcPct})
                </span>
                <span className={`px-[10px] py-[3px] rounded-[4px] text-[10px] font-semibold border ${contColor}`}>
                  Continuation: {band === 'Fragile' ? 'Unmanaged' : band === 'Sensitive' ? 'At Risk' : 'Governed'}
                </span>
              </>
            );
          })()}
        </div>
      </div>

      {/* ═══ AGRI / ALRI SUB-SCORE GRIDS ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">⚡ AGRI Sub-Scores</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Multi-Agent', value: inputs.multiAgent, max: 5 },
              { label: 'Tool-Call Auth', value: inputs.toolCallAuthority, max: 5 },
              { label: 'Persistent Memory', value: inputs.persistentMemory, max: 5 },
              { label: 'Human Checkpoints', value: inputs.humanCheckpoints, max: 5, inverted: true },
            ].map((s, i) => (
              <div key={i} className="bg-secondary border border-border rounded-md p-2">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.label}</div>
                <div className={`text-[16px] font-bold font-mono ${
                  s.inverted ? (s.value <= 2 ? 'text-fragile' : s.value <= 3 ? 'text-sensitive' : 'text-stable') :
                  (s.value >= 4 ? 'text-fragile' : s.value >= 3 ? 'text-sensitive' : 'text-stable')
                }`}>{s.value}/{s.max}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">⚠ ALRI Sub-Scores</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Hallucination', value: inputs.hallucinationLiability },
              { label: 'Deepfake', value: inputs.deepfakeFraud },
              { label: 'Prompt Inject', value: inputs.promptInjection },
              { label: 'Model Drift', value: inputs.modelDrift },
              { label: 'Algo Bias', value: inputs.algorithmicBias },
              { label: 'Shadow AI', value: inputs.shadowAI },
              { label: 'Explainability', value: inputs.explainabilityGap },
              { label: 'Data Integrity', value: inputs.dataIntegrity },
              { label: 'ESG Liability', value: inputs.esgLiability },
            ].map((s, i) => (
              <div key={i} className="bg-secondary border border-border rounded-md p-2">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.label}</div>
                <div className={`text-[14px] font-bold font-mono ${s.value >= 4 ? 'text-fragile' : s.value >= 3 ? 'text-sensitive' : 'text-stable'}`}>{s.value}/5</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ COMMITTEE REVIEW / DECISION PANEL ═══ */}
      <div className={`rounded-xl p-5 mb-4 border-2 ${bandBg}`}>
        <div className={`text-[18px] font-extrabold tracking-wider uppercase mb-3 ${bandColor}`}>
          {band === 'Fragile' ? 'Committee Review Required' : band === 'Sensitive' ? 'Conditional Review Process' : 'Standard Underwriting Process'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Loss Risk Band', value: formatCurrency(lossEnvelope.expected), sub: 'Expected scenario' },
            { label: 'AFI Score', value: afi.toFixed(2), sub: `${band} — ${afi >= 1.35 ? 'above threshold' : 'within range'}` },
            { label: 'Correlation Factor', value: correlationFactor.toFixed(2), sub: 'Cross-system propagation' },
            { label: 'Amplification', value: amplificationFactor, sub: 'Munich Re loss multiplier' },
          ].map((m, i) => (
            <div key={i}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono text-foreground">{m.value}</div>
              <div className="text-[9px] text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ AFI COMPONENT ANALYSIS — HORIZONTAL BARS (matches HTML) ═══ */}
      <SectionCard title="AFI Component Breakdown" icon="📊" subtitle="Individual risk dimensions that compose the Authority Fragility Index.">
        {[
          { label: 'Delegation Ratio (DR)', value: components.dr, desc: 'Autonomous decision share without human review', tooltip: TOOLTIPS.dr },
          { label: 'Justificatory Density (JD)', value: components.jd, desc: 'Governance transparency and audit coverage (protective)', tooltip: TOOLTIPS.jd, inverted: true },
          { label: 'Reversibility Cost (RC)', value: components.rc, desc: 'Structural lock-in — exit difficulty', tooltip: TOOLTIPS.rc },
          { label: 'Continuation Density (CD)', value: components.cd, desc: 'Cross-system propagation surface', tooltip: TOOLTIPS.cd },
        ].map((item, i) => {
          const pct = Math.round(item.value * 100);
          const barColor = item.inverted
            ? (pct < 40 ? 'bg-fragile' : pct < 60 ? 'bg-sensitive' : 'bg-stable')
            : (pct > 70 ? 'bg-fragile' : pct > 50 ? 'bg-sensitive' : 'bg-stable');
          return (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 py-[9px] border-b border-border last:border-none">
              <div className="w-full sm:w-[200px]">
                <span className="text-[12px] text-foreground font-medium">{item.label}</span>
                {item.tooltip && <InfoTip text={item.tooltip} />}
                <div className="text-[9px] text-muted-foreground">{item.desc}</div>
              </div>
              <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
                <div className={`h-full rounded-[3px] ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-[28px] text-right text-[11px] font-bold font-mono">{pct}</span>
            </div>
          );
        })}
      </SectionCard>

      {/* ═══ FINANCIAL EXPOSURE ═══ */}
      <SectionCard title="Financial Exposure — Market-Calibrated Loss Envelope" icon="📊" subtitle="Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Expected scenario · median market outcome', highlight: false, color: 'text-foreground' },
            { label: 'Base Risk Band', value: lossEnvelope.stress, sub: 'Structural governance exposure', highlight: false, color: 'text-sensitive' },
            { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Provider concentration · Tail risk', highlight: true, color: 'text-fragile' },
          ].map((cell, i) => (
            <div key={i} className={`rounded-xl p-5 border ${cell.highlight ? 'bg-fragile-bg border-fragile-border' : 'bg-card border-border'}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-2 ${cell.highlight ? 'text-fragile' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none ${cell.color}`}>{formatCurrency(cell.value)}</div>
              <div className="text-[10px] text-muted-foreground mt-2">{cell.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart visualization */}
        <div className="flex items-end gap-4 h-[160px] px-4 mb-3">
          {[
            { label: 'Expected', value: lossEnvelope.expected, color: 'bg-primary' },
            { label: 'Stress', value: lossEnvelope.stress, color: 'bg-sensitive' },
            { label: 'Tail', value: lossEnvelope.tail, color: 'bg-fragile' },
            { label: 'Portfolio', value: lossEnvelope.portfolio, color: 'bg-purple' },
          ].map((bar, i) => {
            const maxVal = lossEnvelope.portfolio || 1;
            const height = Math.max(8, (bar.value / maxVal) * 140);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-muted-foreground">{formatCurrency(bar.value)}</span>
                <div className={`w-full rounded-t-md ${bar.color}`} style={{ height: `${height}px` }} />
                <span className="text-[8px] text-muted-foreground uppercase tracking-wider">{bar.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-secondary border border-border rounded-lg text-[10px] text-muted-foreground">
          ⚠ Tail risk amplification: Correlated AI infrastructure creates {amplificationFactor} aggregate exposure vs. isolated incidents. Portfolio loss assumes 5 entities with similar AI infrastructure stack. Reinsurance treaty review required above AFI 1.35.
        </div>
      </SectionCard>

      {/* ═══ CONTINUATION / DEPENDENCY / PORTFOLIO ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Continuation Risk</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            System persists without explicit re-authorisation — accumulating liability with no upper bound.
          </div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Dependency Lock-In</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            Provider concentration exceeds exit threshold — structural entrenchment creates single points of failure.
          </div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Portfolio Contagion</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            Shared AI infrastructure creates correlated exposure — {amplificationFactor} cascade amplification across 5 layers.
          </div>
        </div>
      </div>

      {/* ═══ RESPONSIBILITY & OWNERSHIP ═══ */}
      <SectionCard title="Responsibility & Ownership Structure" icon="👥" subtitle="Who is responsible? — And can they be held accountable?">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] text-muted-foreground leading-[1.5] max-w-[600px]">
            This panel makes the responsibility structure of the deployment explicit. Diffuse responsibility is not a neutral fact — it is a governance failure that creates unpriced liability.
          </div>
          <div className="text-right">
            <div className={`text-[48px] font-bold font-mono leading-none ${respFragmentation >= 60 ? 'text-fragile' : respFragmentation >= 40 ? 'text-sensitive' : 'text-stable'}`}>
              {respFragmentation}
            </div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{diffuseLabel}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Responsibility Fragmentation Score', value: respFragmentation, desc: 'Accountability is partially assigned — gaps exist at provider boundaries and cascade events.' },
            { label: 'Stewardship Clarity Index', value: stewardshipClarity, desc: 'Partial stewardship — oversight assignment exists but authority to sunset the system is unclear.' },
            { label: 'Decision Attribution Gap', value: decisionAttribGap, desc: 'The majority of system decisions cannot be attributed to identifiable human judgment.' },
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none mb-2 ${
                m.value >= 60 ? 'text-fragile' : m.value >= 40 ? 'text-sensitive' : 'text-stable'
              }`}>{m.value}</div>
              <div className="text-[10px] text-muted-foreground leading-[1.5]">{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Responsibility structure */}
        <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Responsibility Structure — Actor-by-Actor</div>
        <div className="space-y-2">
          {[
            { icon: '✕', color: 'text-fragile', title: 'Deployer Accountability', desc: 'Deployer accountability is structurally incomplete — low justificatory density means decisions are not fully traceable to documented human oversight, creating Art. 26 exposure.' },
            { icon: '✕', color: 'text-fragile', title: 'Provider Accountability', desc: 'External AI providers bear technical responsibility for model behavior but face no operational accountability for consequences at deployment site. Provider terms typically disclaim downstream liability.' },
            { icon: '✕', color: 'text-fragile', title: 'Oversight Actor — Named Human with Stop Authority', desc: 'Insufficient human oversight — the system likely operates without a clearly empowered individual capable of suspending it safely. This is the operational definition of an ungoverned system.' },
            { icon: '✕', color: 'text-sensitive', title: 'Cross-System Liability — Cascade Accountability', desc: 'Where failure propagates across correlated infrastructure, each actor\'s responsibility is entirely unaddressed in current frameworks. No actor is accountable for aggregate portfolio impact.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
              <span className={`font-bold flex-shrink-0 mt-[1px] ${item.color}`}>{item.icon}</span>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{item.title}</div>
                <div className="text-[11px] text-muted-foreground mt-[2px] leading-[1.5]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-secondary border border-border rounded-lg text-[11px] text-muted-foreground leading-[1.55]">
          <strong className="text-foreground">Underwriting Implication:</strong> Fragmented responsibility directly affects loss attribution, subrogation rights, and recovery pathways. Where no clear owner exists, insurers absorb residual liability by default.
        </div>
      </SectionCard>

      {/* ═══ SCRI ═══ */}
      <SectionCard title="Systemic Concentration Risk Index (SCRI)" icon="🌐" subtitle="Infrastructure concentration creates correlated portfolio-level exposure.">
        <div className="flex items-start gap-6 mb-4">
          <div>
            <div className={`text-[48px] font-bold font-mono leading-none ${scri >= 65 ? 'text-fragile' : scri >= 35 ? 'text-sensitive' : 'text-stable'}`}>{scri}</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase mt-1 ${scri >= 65 ? 'text-fragile' : scri >= 35 ? 'text-sensitive' : 'text-stable'}`}>
              {scri >= 65 ? 'Critical Concentration' : scri >= 35 ? 'Elevated Concentration' : 'Diversified'}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-[6px] bg-border rounded-[3px] overflow-hidden mb-2">
              <div className={`h-full rounded-[3px] ${scri >= 65 ? 'bg-fragile' : scri >= 35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${scri}%` }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {[
                { label: 'Cloud', value: inputs.cloudConcentration },
                { label: 'Model', value: inputs.modelConcentration },
                { label: 'GPU/Compute', value: inputs.gpuConcentration },
                { label: 'Cross-Vendor', value: inputs.crossVendorContagion },
              ].map((d, i) => (
                <div key={i} className="bg-secondary border border-border rounded-md p-2 text-center">
                  <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{d.label}</div>
                  <div className={`text-[16px] font-bold font-mono ${d.value <= 2 ? 'text-fragile' : d.value <= 3 ? 'text-sensitive' : 'text-stable'}`}>{d.value}/5</div>
                  <div className="text-[8px] text-muted-foreground">{d.value <= 2 ? 'Concentrated' : d.value <= 3 ? 'Moderate' : 'Diversified'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ═══ COMPOSITE RISK INDEX ═══ */}
      <SectionCard title="Composite Risk Index" icon="📊" subtitle="Weighted blend: AFI (50%) + ALRI (30%) + AGRI (20%).">
        <div className="flex items-center gap-6">
          <div className={`text-[64px] font-bold font-mono leading-none ${compositeRiskIndex >= 60 ? 'text-fragile' : compositeRiskIndex >= 35 ? 'text-sensitive' : 'text-stable'}`}>
            {compositeRiskIndex}
          </div>
          <div className="flex-1">
            <div className="h-[8px] bg-border rounded overflow-hidden mb-3">
              <div className="h-full rounded gradient-bar" style={{ width: `${compositeRiskIndex}%` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AFI Component (50%)</div>
                <div className="text-[18px] font-bold font-mono text-foreground">{Math.min(100, Math.round((afi / 3.0) * 100))}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">ALRI Component (30%)</div>
                <div className="text-[18px] font-bold font-mono text-foreground">{alri}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AGRI Component (20%)</div>
                <div className="text-[18px] font-bold font-mono text-foreground">{agri}</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ═══ MDR — Meaning Drift Risk ═══ */}
      <SectionCard title="Meaning Drift Risk (MDR)" icon="🔄" subtitle="Behavioral alignment decay risk — from Kindermann (2026), Semantic Drift and Temporal Coherence in Long-Horizon AI Systems.">
        <div className="flex items-start gap-6 mb-4">
          <div>
            <div className={`text-[48px] font-bold font-mono leading-none ${mdrTier === 'critical' ? 'text-fragile' : mdrTier === 'high' ? 'text-sensitive' : mdrTier === 'moderate' ? 'text-sensitive' : 'text-stable'}`}>{mdr}</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase mt-1 ${mdrTier === 'critical' ? 'text-fragile' : mdrTier === 'high' ? 'text-sensitive' : mdrTier === 'moderate' ? 'text-sensitive' : 'text-stable'}`}>
              {mdrLabel}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-[6px] bg-border rounded-[3px] overflow-hidden mb-3">
              <div className={`h-full rounded-[3px] ${mdrTier === 'critical' ? 'bg-fragile' : mdrTier === 'high' ? 'bg-sensitive' : mdrTier === 'moderate' ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${mdr}%` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Optimization Pressure', value: Math.round(((inputs.automation + inputs.actionDensity + inputs.executionAuthority) / 15) * 100) },
                { label: 'Consequence Insulation', value: Math.round((1 - ((inputs.oversightLevel + inputs.reviewCadence) / 10)) * 100) },
                { label: 'Temporal Extension', value: Math.round(((Math.min(1, (inputs.switchingCost / 5 + inputs.integrationDepth / 5) / 2) + inputs.automation / 5) / 2) * 100) },
              ].map((d, i) => (
                <div key={i} className="bg-secondary border border-border rounded-md p-2">
                  <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{d.label}</div>
                  <div className={`text-[16px] font-bold font-mono ${d.value > 65 ? 'text-fragile' : d.value > 40 ? 'text-sensitive' : 'text-stable'}`}>{d.value}%</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground leading-[1.55]">
              {mdrTier === 'critical' 
                ? 'Full structural conditions for behavioral alignment decay are present. Standard underwriting frameworks cannot detect or price this risk.'
                : mdrTier === 'high' 
                ? 'This system\'s structural conditions strongly favour behavioral alignment decay. High autonomous execution pressure combined with low consequence-bearing feedback.'
                : mdrTier === 'moderate'
                ? 'Conditions are emerging for gradual behavioral alignment decay. Autonomous execution outpaces evaluation cadence.'
                : 'Structural conditions do not strongly favour behavioral alignment decay. Autonomous execution pressure is bounded by adequate oversight.'}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ═══ RFSI — Assessment Validity Index ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-4 pb-3 border-b border-border flex items-start justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">◈ Assessment Validity Index <span className="text-[8px] px-[6px] py-[1px] bg-primary/10 border border-primary/30 rounded text-primary ml-1">Exploratory</span></div>
            <div className="text-[14px] font-bold text-foreground">How valid is this governance assessment across the deployment lifecycle?</div>
            <div className="text-[11px] text-muted-foreground mt-[2px] leading-[1.5] max-w-[480px]">Governance assessments are not permanent. This index measures whether the conditions under which this system was assessed still hold — and for how long the current assessment can be considered operationally valid.</div>
          </div>
          <div className="text-right flex-shrink-0 ml-5">
            <div className={`text-[44px] font-bold font-mono leading-none ${rfsiTier === 'stable' ? 'text-stable' : rfsiTier === 'conditional' ? 'text-sensitive' : 'text-fragile'}`}>{rfsi}</div>
            <div className={`text-[10px] font-semibold tracking-[0.04em] uppercase mt-[3px] ${rfsiTier === 'stable' ? 'text-stable' : rfsiTier === 'conditional' ? 'text-sensitive' : 'text-fragile'}`}>{rfsiLabel}</div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-[14px]">
            {[
              { label: 'Deployment Context Shift', value: rfsiDrivers.contextVariability, desc: 'Deployment context drift from alignment baseline' },
              { label: 'Behavioral Drift Risk', value: rfsiDrivers.semanticDriftRisk, desc: 'MDR-derived interpretive instability' },
              { label: 'Audit Coverage Gap', value: rfsiDrivers.evaluationMismatch, desc: 'Audit coverage vs. operational reality' },
              { label: 'Assessment Age Risk', value: rfsiDrivers.temporalInstability, desc: 'Duration-weighted frame decay signal' },
            ].map((d, i) => (
              <div key={i} className="bg-secondary border border-border rounded-[7px] p-[10px_12px]">
                <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-1">{d.label}</div>
                <div className={`text-[16px] font-bold font-mono mb-[2px] ${d.value > 0.65 ? 'text-fragile' : d.value > 0.4 ? 'text-sensitive' : 'text-stable'}`}>{Math.round(d.value * 100)}%</div>
                <div className="text-[9px] text-muted-foreground leading-[1.4]">{d.desc}</div>
              </div>
            ))}
          </div>
          <div className={`p-3 rounded-lg border text-[12px] font-medium leading-[1.55] ${
            rfsiTier === 'stable' ? 'bg-stable-bg border-stable-border text-stable' :
            rfsiTier === 'conditional' ? 'bg-sensitive-bg border-sensitive-border text-sensitive' :
            'bg-fragile-bg border-fragile-border text-fragile'
          }`}>
            {rfsiTier === 'stable' ? 'This governance assessment is likely to remain valid across its current deployment lifecycle. Alignment claims derived from prior evaluations may reasonably be extended — with continued monitoring.' :
             rfsiTier === 'conditional' ? 'This assessment is conditionally valid. Governance findings hold under current conditions but may not generalize beyond them. Deployment context shift and audit coverage gaps signal that the assessment baseline is diverging from the current operational state.' :
             'This assessment is no longer structurally valid. Governance findings from prior evaluations should not be assumed to hold. Re-evaluation is required immediately.'}
          </div>
          {rfsiTier === 'limited' && (
            <div className="mt-[10px] p-[10px_14px] bg-fragile-bg border border-fragile-border rounded-md text-[11px] text-fragile leading-[1.5]">
              ⚠ <strong>This governance assessment may no longer be valid under current operational conditions.</strong> The deployment context has shifted significantly from the conditions under which this system was assessed.
            </div>
          )}
        </div>
      </div>

      {/* ═══ FRAME DRIFT ALERTS ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-4 pb-3 border-b border-border flex items-start justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-muted-foreground mb-[3px]">◈ Governance Alignment Alert System</div>
            <div className="text-[14px] font-bold text-foreground">Active Governance Alignment Alerts</div>
          </div>
          <div className={`text-[28px] font-bold font-mono ${frameDriftAlerts.length > 0 ? 'text-fragile' : 'text-stable'}`}>{frameDriftAlerts.length}</div>
        </div>
        <div className="p-4">
          {frameDriftAlerts.length === 0 ? (
            <div className="text-[12px] text-stable">✓ No active frame drift alerts detected under current profile.</div>
          ) : (
            <div className="space-y-3">
              {frameDriftAlerts.map((alert, i) => (
                <div key={i} className={`border rounded-lg overflow-hidden ${
                  alert.sev === 'critical' ? 'border-fragile' : alert.sev === 'high' ? 'border-sensitive' : 'border-border'
                }`}>
                  <div className={`px-4 py-[10px] flex items-center gap-3 ${
                    alert.sev === 'critical' ? 'bg-fragile-bg' : alert.sev === 'high' ? 'bg-sensitive-bg' : 'bg-secondary'
                  }`}>
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-[7px] py-[2px] rounded ${
                      alert.sev === 'critical' ? 'bg-fragile text-foreground' : alert.sev === 'high' ? 'bg-sensitive text-foreground' : 'bg-muted text-muted-foreground'
                    }`}>{alert.sev}</span>
                    <span className="text-[12px] font-bold text-foreground">{alert.title}</span>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-muted-foreground leading-[1.55] mb-3">{alert.explanation}</div>
                    <div className="text-[10px] text-stable leading-[1.5]"><strong>Mitigation:</strong> {alert.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ EVALUATION LIMITS ═══ */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-[4px]">◈ Evaluation Limits · The Boundaries of What Can Be Known</div>
        <div className="text-[16px] font-bold text-foreground mb-[6px]">What This Assessment Cannot Tell You</div>
        <div className="text-[11px] text-muted-foreground leading-[1.6] mb-4 max-w-[600px]">Every evaluation is a snapshot under constrained conditions. This panel makes the epistemic limits of this assessment explicit — not as a disclaimer, but as a first-class governance signal.</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { t: 'No External Ground Truth', s: 'There is no external reference against which AI governance fragility can be absolutely verified. AFI scores are structurally valid within their calibration context — not universally certified.' },
            { t: 'Metrics Are Proxies', s: 'Delegation Ratio, Reversibility Cost, and Correlation Density are structural proxies — not direct measurements of risk. They correlate with failure conditions; they do not cause or predict them with certainty.' },
            { t: 'Audits Measure Compliance, Not Correctness', s: 'Standard compliance audits verify adherence to specified procedures. They do not verify that the system is operating as intended across all contexts.' },
            { t: 'Performance ≠ Justification', s: 'A system that performs well is trusted with more autonomy — which increases exposure, not reduces it. Performance-based legitimacy erodes governance leverage.' },
            { t: 'Self-Assessment Bias', s: 'This assessment relies on operator-reported inputs. Systematic under-reporting of delegation depth or oversight gaps will produce optimistic scores.' },
            { t: 'Behavioral Drift Is Not Auditable', s: 'Gradual shifts in what a system effectively prioritizes — while remaining behaviorally compliant — are not detectable by standard audits.' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-secondary/30 rounded-lg text-[10px] text-muted-foreground leading-[1.5]">
              <span className="text-fragile mr-1">⊘</span>
              <strong className="text-foreground">{item.t}</strong> — {item.s}
            </div>
          ))}
        </div>
        <div className="p-3 border border-sensitive/30 rounded-lg bg-sensitive/5 text-[11px] text-muted-foreground leading-[1.6] italic">
          "Alignment is conditional, context-dependent, and frame-dependent. A system aligned under one set of conditions may not be aligned under another — and standard evaluation cannot establish when the boundary has been crossed." — AI Governance Architecture Framework (AGAF)
        </div>
      </div>

      {/* ═══ FRAMEWORK LIMITATIONS DISCLAIMER ═══ */}
      <div className="p-[14px_18px] bg-secondary border-2 border-border rounded-[10px] mb-4">
        <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-sensitive mb-[6px]">⚠ FRAMEWORK LIMITATIONS — READ BEFORE USE</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.6]">
          This is an <strong className="text-foreground">internal structuring and simulation tool</strong>. NOT actuarially certified. NOT a regulatory submission. NOT legal or compliance advice.
          <br /><br />
          <strong className="text-foreground">DO NOT use for:</strong> Binding capital allocation · Treaty structuring · Regulatory filing · Insurance pricing decisions · Legal compliance certification
          <br /><br />
          <strong className="text-foreground">Use ONLY with:</strong> Independent actuarial validation · Legal counsel review · Regulatory compliance assessment · Professional risk management advice
        </div>
      </div>

      {/* ═══ RESEARCH FOUNDATION (dark panel) ═══ */}
      <div className="flex items-stretch bg-secondary border border-border rounded-[10px] overflow-hidden mb-5">
        <div className="w-[3px] bg-primary flex-shrink-0" />
        <div className="flex-1 p-[14px] px-[18px]">
          <div className="text-[9px] tracking-wider uppercase text-muted-foreground font-bold mb-[10px]">Research Foundation — Three Governance Gaps This Engine Addresses</div>
          <div className="grid grid-cols-3 gap-[14px]">
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper I · EU AI Act Blind Spots</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">Risk-based regulation governs deployment — not <em className="text-foreground">continuation</em>. Systems persist without re-authorisation.</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper II · Price of Convenience</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">Agentic AI erodes oversight without malice — through <em className="text-foreground">delegation density</em> and oversight decay.</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-primary mb-[3px]">Paper III · Governing Continuation</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">Evaluation cannot authorise existence. Once ECI-2 is reached, <em className="text-foreground">performance ≠ permission</em>.</div>
            </div>
          </div>
          <div className="mt-[10px] pt-2 border-t border-border text-[10px] text-muted-foreground">AGAF, M. (Feb 2026) — Working Papers on AI Continuation Governance. <span className="text-secondary-foreground">Buyers who adopt this framework now are 3 years ahead of enforcement.</span></div>
        </div>
      </div>

      {/* ═══ CATEGORY COMPARISON ═══ */}
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

      {/* ═══ EPISTEMIC STATUS ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-3">◆ Epistemic Status · What This Assessment Cannot Guarantee</div>
        <div className="text-[18px] font-bold text-foreground mb-3">You Cannot Rely on This Evaluation</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-5">
          This is not a disclaimer; it is an operational fact. The following conditions are structurally true of every AI governance assessment — including this one. Decisions made without acknowledging these constraints are decisions made on false confidence.
        </div>

        <div className="space-y-3">
          {[
            { title: 'This system operates without stable ground truth', body: 'There is no external reference against which the correctness of this system\'s outputs can be absolutely verified. AFI scores are structurally calibrated — not empirically validated against ground truth outcomes.' },
            { title: 'Evaluation does not guarantee correctness — it guarantees procedural compliance', body: 'Standard AI evaluations, audits, and compliance reviews verify that specified procedures were followed. They do not verify that the system behaves correctly across all operational contexts.' },
            { title: 'The interval between evaluations is ungoverned', body: 'Safety and alignment claims derived from point-in-time evaluations apply to the moment of evaluation — not the period between evaluations. A system verified at t=0 may have undergone significant drift by t+6 months.' },
            { title: 'Performance is not justification for continued operation', body: 'A system that works is not a system that has been authorised to continue. Performance-based legitimacy is the primary mechanism by which governance oversight erodes.' },
            { title: 'This assessment itself is subject to the limits it describes', body: 'The AFI, SES, ERS, and all derived scores in this tool are structural proxies, not empirical measurements. They correlate with governance fragility — they do not cause or predict specific incidents.' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-secondary border border-border rounded-lg">
              <div className="text-[12px] font-bold text-sensitive mb-1">{item.title}</div>
              <div className="text-[11px] text-secondary-foreground leading-[1.55]">{item.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 border border-sensitive/30 rounded-lg bg-sensitive/5 text-[11px] text-secondary-foreground leading-[1.6] italic">
          "Alignment is conditional, context-dependent, and frame-dependent. A system aligned under one set of conditions may not be aligned under another — and no evaluation can establish when the boundary has been crossed. The only safe posture is to treat alignment as provisional, re-authorisation as mandatory, and epistemic humility as an operational requirement." — AI Governance Architecture Framework (AGAF), programme research.
        </div>
      </div>

      {/* Assessment footer bar */}
      <div className="flex items-center gap-2 flex-wrap text-[9px] font-mono text-muted-foreground bg-secondary border border-border rounded-lg p-3 mb-4">
        <span>Model: <strong className="text-foreground">AGAF v3.0</strong></span>
        <span>·</span>
        <span>Generated: <strong className="text-foreground">{formatDate()}</strong></span>
        <span>·</span>
        <span>AFI: <strong className="text-foreground">{afi.toFixed(2)} ({band})</strong></span>
        <span>·</span>
        <span>Band: <strong className="text-foreground">{band}</strong></span>
      </div>

      {/* Assessment History */}
      <SectionCard title="Assessment History" icon="📋" subtitle="Prior assessments for portfolio comparison and trend analysis.">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Date</th>
                <th className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Entity</th>
                <th className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">AFI</th>
                <th className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Band</th>
                <th className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Decision</th>
                <th className="text-left py-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted-foreground">{formatDate()}</td>
                <td className="py-2 pr-4 font-medium text-foreground">{inputs.companyName || 'Current Entity'}</td>
                <td className="py-2 pr-4 font-mono font-bold text-foreground">{afi.toFixed(2)}</td>
                <td className="py-2 pr-4"><BandBadge band={band} size="sm" /></td>
                <td className="py-2 pr-4 text-muted-foreground">{results.decisionClass}</td>
                <td className="py-2 text-primary font-semibold cursor-pointer hover:underline">View →</td>
              </tr>
              {[
                { date: '2026-02-15', entity: 'Client B', afi: 1.35, band: 'Fragile' as const, decision: 'Premium Loading' },
                { date: '2026-01-22', entity: 'Client A', afi: 0.92, band: 'Sensitive' as const, decision: 'Conditional Cover' },
                { date: '2025-12-10', entity: 'Client C', afi: 0.77, band: 'Stable' as const, decision: 'Standard Cover' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-none">
                  <td className="py-2 pr-4 text-muted-foreground">{row.date}</td>
                  <td className="py-2 pr-4 font-medium text-foreground">{row.entity}</td>
                  <td className="py-2 pr-4 font-mono font-bold text-foreground">{row.afi.toFixed(2)}</td>
                  <td className="py-2 pr-4"><BandBadge band={row.band} size="sm" /></td>
                  <td className="py-2 pr-4 text-muted-foreground">{row.decision}</td>
                  <td className="py-2 text-primary font-semibold cursor-pointer hover:underline">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Export */}
      <div className="bg-card border border-border rounded-[10px] p-5">
        <div className="text-[13px] font-bold text-foreground mb-[3px]">Export & Share</div>
        <div className="text-[11px] text-secondary-foreground mb-[14px]">Generate structured output for risk committee, board, or reinsurer review.</div>
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📄 One-Pager PDF Preview
          </button>
          <button className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📋 Board Executive Summary
          </button>
          <button className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            ✍ Copy Plain Text
          </button>
          <button className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            🖨️ Print Full Report
          </button>
        </div>
      </div>

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(1)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Exposure Analysis</button>
        <span className="text-[10px] text-muted-foreground italic">Step 2 of 6 · Decision intelligence & AFI analysis</span>
        <button onClick={() => setActiveStep(3)} className="view-nav-next">Scenario Simulation →</button>
      </div>
    </div>
  );
}
