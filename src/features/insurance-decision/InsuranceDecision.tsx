import React from 'react';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge, InfoTip } from '@/components/shared/UIComponents';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TOOLTIPS } from '@/lib/tooltips';
import { EducationalParametricSimulator } from '@/features/parametric/EducationalParametricSimulator';
import { PremiumCalculator } from '@/features/pricing/PremiumCalculator';
import { AppFooter } from '@/components/shared/AppFooter';
import { SectionDivider } from '@/components/shared/SectionDivider';

export function InsuranceDecision() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Insurance Decision Locked" description="Complete the Exposure Analysis to view the underwriting decision console with loss envelope and committee signals." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, amplificationFactor, correlationFactor, components, premium, eciTier, eciName, structuralScore, alri, agri, scri, compositeRiskIndex } = results;

  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';

  // Threshold bar position (0-100 scale, AFI mapped to position)
  const thresholdPos = Math.min(100, Math.round((afi / 3.0) * 100));

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 4 of 6 · Underwriting Decision</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Insurance & Financial Exposure</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Financial exposure modelling and underwriting decision framework for {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      <UseRestrictionBanner />

      {/* ═══ 1. HERO DECISION BANNER ═══ */}
      <div className={`rounded-xl p-4 sm:p-8 mb-4 border-2 relative overflow-hidden ${
        band === 'Fragile' ? 'bg-card border-fragile' :
        band === 'Sensitive' ? 'bg-card border-sensitive' :
        'bg-card border-stable'
      }`}>
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">
          ◆ Governance Exposure Engine · Underwriting Decision
        </div>
        <div className={`text-[18px] sm:text-[42px] font-extrabold tracking-wider uppercase leading-[1.1] mb-4 ${bandColor}`}>
          {decisionClass === 'Escalate to Committee' ? 'Escalate to Committee' :
           decisionClass === 'Conditional Review' ? 'Conditional Review' :
           'Standard Coverage'}
        </div>
        <div className="text-[13px] text-secondary-foreground leading-[1.6] max-w-[700px] mb-4">
          {band === 'Fragile'
            ? 'AI deployment creates structural risk that exceeds current underwriting tolerance and cannot be adequately priced using standard rating factors. This profile requires committee-level review before any coverage terms are offered.'
            : band === 'Sensitive'
            ? 'Elevated structural signals require conditional review. Coverage available with mandatory improvement timeline.'
            : 'Structural exposure within manageable bounds. Standard underwriting process applies.'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Decision Class</div>
            <div className="text-[14px] font-bold text-foreground">{decisionClass}</div>
          </div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AFI Position<InfoTip text={TOOLTIPS.afi} /></div>
            <div className="text-[14px] font-bold text-foreground font-mono">{afi.toFixed(2)} · {band}</div>
          </div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Premium Range<InfoTip text={TOOLTIPS.premium} /></div>
            <div className="text-[14px] font-bold text-foreground font-mono">{premium.band}</div>
          </div>
        </div>
      </div>

      {/* ═══ 2. JUSTIFICATION CHIPS ═══ */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="px-3 py-[6px] bg-card border border-border rounded-lg text-[10px] font-medium text-muted-foreground">
          AFI {afi.toFixed(2)}
        </span>
        <span className="px-3 py-[6px] bg-card border border-border rounded-lg text-[10px] font-medium text-muted-foreground">
          ECI-{eciTier} · {eciName}
        </span>
        <BandBadge band={band} size="sm" />
      </div>

      {/* ═══ 3. "THIS MEANS" CALLOUT ═══ */}
      <div className={`bg-card rounded-xl p-5 mb-4 border-l-4 ${band === 'Fragile' ? 'border-l-fragile' : band === 'Sensitive' ? 'border-l-sensitive' : 'border-l-stable'} border border-border flex items-start gap-[14px]`}>
        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
          band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
        }`}>
          <span className="text-[11px] text-foreground font-bold">!</span>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-bold mb-[5px]">
            {band === 'Fragile' ? 'Standard coverage is not justified without structural changes' :
             band === 'Sensitive' ? 'Conditional coverage — structural improvements required' :
             'Standard coverage terms apply'}
          </div>
          <div className="text-[13px] font-semibold text-foreground leading-[1.4] mb-2">
            {band === 'Fragile' ? 'It is possible to fully comply with current AI regulation — EU AI Act, internal audit, third-party compliance frameworks — and still carry structural risk that exceeds underwriting tolerance.' :
             band === 'Sensitive' ? 'Conditional coverage only — structural improvements required within 90 days.' :
             'Standard coverage terms apply. Maintain governance cadence and reassess at renewal.'}
          </div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            {band === 'Fragile' ? 'A compliant system that remains fragile is a compliant system that will still generate losses.' :
             band === 'Sensitive' ? 'Elevated structural signals require monitoring and improvement to prevent escalation.' :
             'Governance posture is within tolerance. Routine monitoring applies.'}
          </div>
        </div>
      </div>

      <SectionDivider title="Financial Exposure Model" icon="💰" subtitle="Loss envelope, threshold position, and AFI component analysis" />

      {/* ═══ 4. INSURANCE & FINANCIAL EXPOSURE TITLE + COMMITTEE PANEL ═══ */}
      <h2 className="text-[18px] font-bold text-foreground mb-1 tracking-tight">Insurance & Financial Exposure</h2>
      <p className="text-[12px] text-muted-foreground mb-4 leading-[1.5]">Structural risk characterization for underwriting and financial exposure modelling.</p>

      <div className={`rounded-xl p-5 mb-4 border-2 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className={`text-[16px] font-extrabold tracking-wider uppercase mb-3 ${bandColor}`}>
          {band === 'Fragile' ? 'Committee Review Required' :
           band === 'Sensitive' ? 'Conditional Review — Elevated Exposure' :
           'Standard Terms — Within Tolerance'}
        </div>
        <div className="text-[11px] text-muted-foreground leading-[1.55] mb-4">
          {band === 'Fragile' ? `AFI ${afi.toFixed(2)} exceeds standard underwriting threshold. Structural risk requires committee-level review before coverage terms can be offered.` :
           band === 'Sensitive' ? `AFI ${afi.toFixed(2)} indicates elevated structural exposure. Coverage available with mandatory improvement timeline and premium loading.` :
           `AFI ${afi.toFixed(2)} is within standard underwriting tolerance. Standard coverage terms apply with routine monitoring.`}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Loss Risk Band', value: lossEnvelope.expected, sub: 'Expected scenario' },
            { label: 'AFI Score', value: afi.toFixed(2), sub: `${band} — ${afi >= 1.35 ? 'above threshold' : 'within range'}` },
            { label: 'Correlation Factor', value: correlationFactor.toFixed(2), sub: 'Cross-system propagation' },
            { label: 'Amplification', value: 'Non-linear', sub: 'Not fully captured in traditional models' },
          ].map((m, i) => (
            <div key={i}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono text-foreground">{m.value}</div>
              <div className="text-[9px] text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 5. INSURABILITY THRESHOLD BAR ═══ */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Insurability Threshold Position</div>
        <div className="relative h-[24px] rounded-full overflow-hidden mb-2" style={{
          background: 'linear-gradient(to right, hsl(var(--stable)) 0%, hsl(var(--stable)) 28%, hsl(var(--sensitive)) 28%, hsl(var(--sensitive)) 45%, hsl(var(--fragile)) 45%, hsl(var(--fragile)) 100%)'
        }}>
          <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-lg z-10" style={{ left: `${thresholdPos}%`, transform: 'translateX(-50%)' }} />
          <div className="absolute top-[-2px] w-[12px] h-[12px] rounded-full bg-white border-2 border-foreground shadow z-10" style={{ left: `${thresholdPos}%`, transform: 'translateX(-50%)' }} />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>Insurable · Standard Terms</span>
          <span>Conditional · Loaded</span>
          <span>Uninsurable without Remediation</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] font-mono text-muted-foreground">AFI 0.0</span>
          <span className="text-[8px] font-mono text-muted-foreground">0.85</span>
          <span className="text-[8px] font-mono text-muted-foreground">1.35</span>
          <span className="text-[8px] font-mono text-muted-foreground">3.0</span>
        </div>
      </div>

      {/* ═══ 6. AFI COMPONENT BARS ═══ */}
      <SectionCard title="AFI Component Breakdown" icon="📊" subtitle="Structural risk dimensions contributing to the AFI score.">
        {[
          { label: 'Delegation Ratio (DR)', value: components.dr, tooltip: TOOLTIPS.dr },
          { label: 'Justificatory Density (JD)', value: components.jd, tooltip: TOOLTIPS.jd, inverted: true },
          { label: 'Reversibility Cost (RC)', value: components.rc, tooltip: TOOLTIPS.rc },
          { label: 'Continuation Density (CD)', value: components.cd, tooltip: TOOLTIPS.cd },
        ].map((item, i) => {
          const pct = Math.round(item.value * 100);
          const barColor = item.inverted
            ? (pct < 40 ? 'bg-fragile' : pct < 60 ? 'bg-sensitive' : 'bg-stable')
            : (pct > 70 ? 'bg-fragile' : pct > 50 ? 'bg-sensitive' : 'bg-stable');
          return (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 py-[9px] border-b border-border last:border-none">
              <div className="w-full sm:w-[200px]">
                <span className="text-[12px] text-foreground font-medium">{item.label}</span>
                <InfoTip text={item.tooltip} />
              </div>
              <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
                <div className={`h-full rounded-[3px] ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-[28px] text-right text-[11px] font-bold font-mono">{pct}</span>
            </div>
          );
        })}
      </SectionCard>

      {/* ═══ 7. FINANCIAL EXPOSURE — LOSS ENVELOPE ═══ */}
      <SectionCard title="Financial Exposure — Market-Calibrated Loss Envelope" icon="📊" subtitle="Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Expected scenario · median market outcome', color: 'text-foreground', highlight: false },
            { label: 'Base Risk Band', value: lossEnvelope.stress, sub: 'Structural governance exposure', color: 'text-sensitive', highlight: false },
            { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Provider concentration · Tail risk', color: 'text-fragile', highlight: true },
          ].map((cell, i) => (
            <div key={i} className={`rounded-xl p-5 border ${cell.highlight ? 'bg-fragile-bg border-fragile-border' : 'bg-card border-border'}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-2 ${cell.highlight ? 'text-fragile' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[24px] font-bold font-mono leading-none ${cell.color}`}>{cell.value}</div>
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
            const height = Math.max(8, (i + 1) * 35);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-muted-foreground">{bar.value}</span>
                <div className={`w-full rounded-t-md ${bar.color}`} style={{ height: `${height}px` }} />
                <span className="text-[8px] text-muted-foreground uppercase tracking-wider">{bar.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-secondary border border-border rounded-lg text-[10px] text-muted-foreground">
          ⚠ Tail risk amplification: Correlated AI infrastructure creates significant non-linear aggregate exposure vs. isolated incidents. Swiss Re sigma insights 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk."
        </div>
      </SectionCard>

      <SectionDivider title="Cascade Propagation" icon="🌐" subtitle="How failure travels across systems and amplifies at each layer" />

      {/* ═══ 8. CASCADE PROPAGATION — CIRCLES + ARROWS ═══ */}
      <div className="bg-card border-2 border-border rounded-xl p-3 sm:p-6 mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #f39c12, #c0392b, #7b0e0e)' }} />
        <div className="flex flex-col sm:flex-row items-start justify-between mb-5 gap-3">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-fragile">How this system propagates to portfolio loss</div>
            <div className="text-[14px] sm:text-[16px] font-bold text-foreground mt-[3px] mb-[3px]">How failure travels across systems — and amplifies at each layer</div>
            <div className="text-[12px] text-secondary-foreground">Each operational layer amplifies the preceding disruption.</div>
          </div>
         <div className="flex gap-4 text-left sm:text-right">
            <div>
              <div className="text-[18px] sm:text-[24px] font-bold font-mono text-fragile">Non-linear</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Amplification Type</div>
            </div>
            <div>
              <div className="text-[14px] sm:text-[18px] font-bold font-mono text-fragile">6–48h</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Propagation Time</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-0 mb-4 overflow-x-auto">
          {[
            { icon: '⚡', name: 'AI Provider Failure', value: 'Origin', layer: 'Layer 0', color: 'text-fragile' },
            { icon: '🔧', name: 'Workflow Disruption', value: 'Elevated', layer: 'Layer 1', color: 'text-sensitive' },
            { icon: '⚖', name: 'Decision Errors', value: 'Critical', layer: 'Layer 2', color: 'text-sensitive' },
            { icon: '📉', name: 'Revenue Impact', value: 'Critical', layer: 'Layer 3', color: 'text-fragile' },
            { icon: '🌐', name: 'Portfolio Contagion', value: 'Systemic', layer: 'Layer 4', color: 'text-fragile' },
          ].map((node, i) => (
            <div key={i} className="text-center px-2 py-3 relative">
              {i < 4 && <span className="absolute right-[-11px] top-[38%] text-muted-foreground text-sm z-[1]">→</span>}
              <div className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center mx-auto mb-2 text-[14px] ${
                i <= 1 ? 'bg-fragile-bg border-fragile-border' : i >= 3 ? 'bg-fragile-bg border-fragile-border' : 'bg-sensitive-bg border-sensitive-border'
              }`}>{node.icon}</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground leading-[1.3] mb-1">{node.name}</div>
              <div className={`text-[13px] font-bold font-mono ${node.color}`}>{node.value}</div>
              <div className="text-[9px] text-muted-foreground">{node.layer}</div>
            </div>
          ))}
        </div>

        <div className="bg-secondary border border-border rounded-lg p-[14px] flex items-start gap-[10px]">
          <span className="text-fragile text-sm flex-shrink-0 mt-[1px]">⚠</span>
          <div>
            <div className="text-[12px] font-semibold text-foreground leading-[1.4]">Traditional models stop at system failure. This level of propagation is not captured in traditional risk models.</div>
            <div className="text-[11px] text-secondary-foreground mt-[3px]">This model extends into cross-system propagation — each layer amplifies the preceding disruption, creating non-linear risk escalation.</div>
          </div>
        </div>
      </div>

      <SectionDivider title="Underwriting Decision" icon="⚖" subtitle="Risk position, required actions, and operational decision" />

      {/* ═══ 9. RISK POSITION + REQUIRED ACTIONS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <SectionCard title="Risk Position" icon="📋">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            {band === 'Fragile' ? (<>
              <div>• <strong className="text-foreground">Above underwriting tolerance</strong> — Structural baseline → AI-derived characteristic</div>
              <div>• <strong className="text-foreground">Standard coverage not justified</strong> — Structural change required before standard rates apply</div>
              <div>• <strong className="text-foreground">Premium loading mandatory</strong> — Significant loading above standard required</div>
              <div>• <strong className="text-foreground">Critical risk band: {lossEnvelope.tail}</strong> — Provider concentration and automation factors</div>
              <div>• <strong className="text-foreground">Systemic exposure: {lossEnvelope.portfolio}</strong> — If 5 entities share similar AI infrastructure</div>
            </>) : band === 'Sensitive' ? (<>
              <div>• <strong className="text-foreground">Approaching underwriting threshold</strong> — Elevated structural signals detected</div>
              <div>• <strong className="text-foreground">Conditional coverage available</strong> — With mandatory improvement timeline</div>
              <div>• <strong className="text-foreground">Premium loading elevated</strong> — Precautionary loading above standard baseline</div>
              <div>• <strong className="text-foreground">Stress loss band: {lossEnvelope.stress}</strong> — Governance drift scenario</div>
            </>) : (<>
              <div>• <strong className="text-foreground">Within underwriting tolerance</strong> — Standard structural exposure profile</div>
              <div>• <strong className="text-foreground">Standard coverage terms apply</strong> — No mandatory premium loading</div>
              <div>• <strong className="text-foreground">Expected loss band: {lossEnvelope.expected}</strong> — Standard scenario</div>
              <div>• <strong className="text-foreground">Routine monitoring</strong> — Annual reassessment at renewal</div>
            </>)}
          </div>
        </SectionCard>
        <SectionCard title="Required Actions" icon="⚠">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            {band === 'Fragile' ? (<>
              <div>• <strong className="text-foreground">Apply significant premium loading</strong> — Mandatory · structural risk exceeds standard pricing</div>
              <div>• <strong className="text-foreground">Require dependency diversification</strong> — Mandatory within 90 days · minimum 3 providers</div>
              <div>• <strong className="text-foreground">Enforce governance cadence</strong> — Condition of coverage · quarterly re-authorisation</div>
              <div>• <strong className="text-foreground">Limit coverage to operational layers</strong> — Recommended · full-stack coverage uneconomic</div>
            </>) : band === 'Sensitive' ? (<>
              <div>• <strong className="text-foreground">Apply precautionary premium loading</strong> — Conditional · elevated structural signals</div>
              <div>• <strong className="text-foreground">Require governance improvement plan</strong> — Within 90 days · documented milestones</div>
              <div>• <strong className="text-foreground">Monitor structural drift</strong> — Quarterly reassessment mandatory</div>
            </>) : (<>
              <div>• <strong className="text-foreground">Maintain governance cadence</strong> — Annual reassessment at renewal</div>
              <div>• <strong className="text-foreground">Monitor for structural changes</strong> — Report material changes to underwriter</div>
              <div>• <strong className="text-foreground">Standard monitoring applies</strong> — No immediate remediation required</div>
            </>)}
          </div>
        </SectionCard>
      </div>

      {/* ═══ OPERATIONAL DECISION PANEL (full-width dark ops-decision block) ═══ */}
      {(() => {
        const statusCls = decisionClass === 'Approved' ? 'approved' : decisionClass === 'Conditional Review' ? 'conditional' : decisionClass === 'Escalate to Committee' ? 'escalate' : 'not-approved';
        const bgMap: Record<string, string> = { approved: 'bg-secondary border-b border-stable/40', conditional: 'bg-secondary border-b border-sensitive/40', escalate: 'bg-secondary border-b border-primary/50', 'not-approved': 'bg-secondary border-b border-fragile/40' };
        const topBarMap: Record<string, string> = { approved: 'hsl(var(--stable))', conditional: 'hsl(var(--sensitive))', escalate: 'hsl(var(--primary))', 'not-approved': 'hsl(var(--fragile))' };
        const eyebrowColorMap: Record<string, string> = { approved: 'text-stable', conditional: 'text-sensitive', escalate: 'text-primary', 'not-approved': 'text-fragile' };
        const statusColorMap: Record<string, string> = { approved: 'text-stable', conditional: 'text-sensitive', escalate: 'text-primary', 'not-approved': 'text-fragile' };
        const rationaleColorMap: Record<string, string> = { approved: 'text-chrome-fg', conditional: 'text-chrome-fg', escalate: 'text-foreground', 'not-approved': 'text-chrome-fg' };
        const consBgMap: Record<string, string> = { approved: 'bg-muted border-stable/40', conditional: 'bg-muted border-sensitive/40', escalate: 'bg-muted border-primary/40', 'not-approved': 'bg-muted border-fragile/40' };
        const dotBgMap: Record<string, string> = { approved: 'bg-stable', conditional: 'bg-sensitive', escalate: 'bg-primary', 'not-approved': 'bg-fragile' };

        const statusText = decisionClass === 'Approved' ? 'APPROVED — STANDARD TERMS' : decisionClass === 'Conditional Review' ? 'CONDITIONAL REVIEW' : decisionClass === 'Escalate to Committee' ? 'ESCALATE TO COMMITTEE' : 'NOT APPROVED';
        const rationale = band === 'Fragile' ? 'Standard coverage terms cannot be issued at current structural exposure levels. The deployment profile exceeds underwriting tolerance — conditional re-entry requires documented structural remediation.' :
          band === 'Sensitive' ? 'Conditional coverage with mandatory governance improvements within 90 days. Failure to meet conditions results in escalation to NOT APPROVED.' :
          'Structural exposure within manageable bounds. Standard coverage terms with routine monitoring apply.';
        const consIcon = band === 'Fragile' ? '⊘' : band === 'Sensitive' ? '↗' : '✓';
          const consTxt = band === 'Fragile' ? `Issuing standard coverage at current AFI would significantly understate required reserves. Premium loading is mandatory. Dependency diversification and governance re-authorisation are conditions of any coverage offer.` :
           band === 'Sensitive' ? 'Without governance improvements within 90 days, this profile escalates to NOT APPROVED at next assessment.' :
          'Governance cadence must be maintained. Structural changes require re-assessment.';

        return (
          <div className={`rounded-none -mx-2 sm:-mx-4 md:-mx-5 lg:-mx-7 mb-6 relative overflow-hidden ${bgMap[statusCls]}`}>
            <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: topBarMap[statusCls] }} />
            <div className="p-[16px_16px_16px] sm:p-[28px_30px_24px]">
              <div className={`text-[9px] font-bold tracking-[0.12em] uppercase mb-2 flex items-center gap-[6px] ${eyebrowColorMap[statusCls]}`}>
                <div className={`w-[5px] h-[5px] rounded-full animate-pulse ${dotBgMap[statusCls]}`} />
                Governance Assessment Signal · AI Governance Engine · {inputs.companyName || '—'}
                <span className="text-[8px] font-bold px-[7px] py-[2px] bg-purple-bg text-primary border border-purple-border rounded ml-1">◈ Committee-Grade</span>
              </div>
              <div className={`text-[18px] sm:text-[42px] font-extrabold font-mono leading-none tracking-wider uppercase mb-3 ${statusColorMap[statusCls]}`}>
                {statusText}
              </div>
              <div className={`text-[13px] leading-[1.55] mb-4 max-w-[700px] ${rationaleColorMap[statusCls]}`}>
                {rationale}
              </div>
              <div className={`rounded-lg p-4 border flex items-start gap-3 mb-4 ${consBgMap[statusCls]}`}>
                <span className="text-[18px] flex-shrink-0">{consIcon}</span>
                <div className={`text-[11px] leading-[1.55] ${rationaleColorMap[statusCls]}`}>{consTxt}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-[10px]">
                {[
                  { label: 'Decision Basis:', value: `AFI ${afi.toFixed(2)} · ${band} · ${afi >= 1.35 ? 'Above tolerance' : afi >= 0.85 ? 'Approaching threshold' : 'Within tolerance'}` },
                  { label: 'Valid Until:', value: band === 'Fragile' ? 'Next structural re-assessment' : 'Until next renewal or material change' },
                  { label: 'Escalation Required:', value: band === 'Fragile' ? 'Risk Committee Review' : band === 'Sensitive' ? 'Senior Underwriter' : 'Standard Monitoring' },
                  { label: 'Generated:', value: formatDate() },
                ].map((meta, i) => (
                  <div key={i} className="text-muted-foreground">
                    <span className="font-bold">{meta.label}</span>
                    <span className="text-foreground ml-1">{meta.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ CONSEQUENCE LAYER ═══ */}
      <div className={`rounded-xl p-[16px_20px] mb-4 border ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' :
        'bg-secondary border-border'
      }`}>
        <div className={`text-[9px] font-bold tracking-[0.12em] uppercase mb-[10px] ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-muted-foreground'
        }`}>
          ⊘ If This Decision Is Ignored — Structural Consequences
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
          {(band === 'Fragile' ? [
            { ic: '€', title: 'Reserve Understatement', body: `Issuing standard coverage without premium loading significantly understates required reserves. Expected loss band: ${lossEnvelope.expected}. Tail risk band: ${lossEnvelope.tail}.` },
            { ic: '⚖', title: 'Regulatory Penalty Exposure', body: 'Active Art. 26 §2 and Art. 72 obligations create immediate Art. 99 §4 exposure of up to €15M or 3% global turnover — independent of any loss event.' },
            { ic: '🌐', title: `Portfolio Contagion: ${lossEnvelope.portfolio}`, body: `Correlated dependency structures amplify individual loss across portfolio cluster. 8–15 entities sharing similar AI infrastructure create systemic exposure. Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk."` },
          ] : band === 'Sensitive' ? [
            { ic: '↗', title: 'Trajectory to NOT APPROVED', body: 'Without structural intervention within 90 days, this profile escalates to NOT APPROVED at next assessment cycle. Governance gaps compound non-linearly.' },
            { ic: '€', title: 'Conditional Reserve Gap', body: `Current structural exposure of ${lossEnvelope.expected} is priced under conditional terms. If governance improvements are not delivered, the reserve basis is invalidated.` },
            { ic: '⚖', title: 'Compliance Window Closing', body: 'EU AI Act Art. 26 and Art. 72 obligations are enforceable now. Without documented human oversight assignment, this entity is in active statutory violation.' },
          ] : [
            { ic: '📋', title: 'Governance Cadence Is Mandatory', body: 'Standard coverage is conditional on maintained governance cadence. Any increase in delegation depth without re-assessment constitutes a material structural change.' },
            { ic: '↗', title: 'Structural Drift Is Non-Linear', body: 'Dependency and delegation tend to increase over time. Current within-tolerance status does not project forward — re-assessment at each renewal is structural, not formal.' },
            { ic: '⊘', title: 'Unreviewed Operation Accumulates Liability', body: 'Every month of operation without formal re-authorisation is an unreviewed period. Assessment age risk increases continuously.' },
          ]).map((c, i) => (
            <div key={i} className={`rounded-[7px] p-[11px_13px] border ${
              band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' :
              band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' :
              'bg-secondary border-border'
            }`}>
              <div className="text-[16px] mb-[6px]">{c.ic}</div>
              <div className={`text-[11px] font-bold mb-1 ${
                band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-foreground'
              }`}>{c.title}</div>
              <div className={`text-[10px] leading-[1.5] ${
                band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-muted-foreground'
              }`}>{c.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 10. PREMIUM ESTIMATE ROW ═══ */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Premium Estimate & Structural Factors</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AFI Score</div>
            <div className={`text-[28px] font-bold font-mono leading-none ${bandColor}`}>{afi.toFixed(2)}</div>
            <div className="text-[9px] text-muted-foreground mt-1">{band} · Structural fragility index</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Premium Range</div>
            <div className="text-[28px] font-bold font-mono leading-none text-foreground">{premium.band}</div>
            <div className="text-[9px] text-muted-foreground mt-1">Annual indicative premium band</div>
          </div>
          <div>
             <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Composite Risk Index<InfoTip text={TOOLTIPS.compositeRisk} /></div>
            <div className={`text-[28px] font-bold font-mono leading-none ${compositeRiskIndex >= 60 ? 'text-fragile' : compositeRiskIndex >= 35 ? 'text-sensitive' : 'text-stable'}`}>{compositeRiskIndex}</div>
            <div className="text-[9px] text-muted-foreground mt-1">AFI 50% + ALRI 30% + AGRI 20%</div>
          </div>
        </div>
      </div>




      <SectionDivider title="Coverage Conditions" icon="📋" subtitle="Underwriting conditions, anti-stacking, and reinsurance" />

      {/* ═══ 12. UNDERWRITING CONDITIONS (numbered) ═══ */}
      <SectionCard title="Underwriting Conditions for AI Coverage" icon="📋" subtitle="Required structural conditions before standard terms apply.">
        <div className="space-y-3">
          {[
            { num: 1, title: 'Implement quarterly AI re-authorisation cadence', status: 'MANDATORY', statusColor: 'bg-fragile text-foreground', desc: 'Each deployed AI system must undergo formal re-authorisation at least quarterly. Performance-based continuation is not acceptable as a governance standard. Re-authorisation must include explicit sign-off from a named human with stop authority.' },
            { num: 2, title: 'Establish multi-provider diversification (≥3 providers)', status: 'MANDATORY', statusColor: 'bg-fragile text-foreground', desc: 'Single-provider dependency creates uninsurable concentration risk. Minimum 3 independent providers across model, compute, and orchestration layers. Timeline: 90 days from coverage inception.' },
            { num: 3, title: 'Deploy automated oversight with kill-switch capability', status: 'CONDITIONAL', statusColor: 'bg-sensitive text-foreground', desc: 'Automated monitoring must include anomaly detection, threshold alerts, and immediate suspension capability. Human-in-the-loop escalation for all decisions exceeding defined impact thresholds.' },
            { num: 4, title: 'Maintain governance transparency — audit trail requirement', status: 'CONDITIONAL', statusColor: 'bg-sensitive text-foreground', desc: 'All AI-influenced decisions must produce traceable audit records. Justificatory density must demonstrably improve above current baseline to maintain coverage terms.' },
            { num: 5, title: 'Establish incident response and communication protocol', status: 'RECOMMENDED', statusColor: 'bg-primary text-foreground', desc: 'AI-specific incident response plan required, including communication protocol for regulators, affected parties, and insurers. Response time targets: detection <1h, containment <4h, notification <24h.' },
            { num: 6, title: 'Conduct annual AI governance audit by independent assessor', status: 'RECOMMENDED', statusColor: 'bg-primary text-foreground', desc: 'Annual independent governance review to verify structural conditions are maintained. Assessment must cover all AFI dimensions including continuation risk and dependency concentration.' },
          ].map((cond, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-[24px] h-[24px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-[2px]">{cond.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-foreground">{cond.title}</span>
                  <span className={`px-2 py-[1px] rounded text-[8px] font-bold tracking-wider uppercase ${cond.statusColor}`}>{cond.status}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-[1.55]">{cond.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ═══ 13. REINSURANCE TREATY IMPLICATIONS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-2">Excess-of-Loss XL Treaty</div>
          <div className="text-[13px] font-bold text-foreground mb-2">Reinsurance Layer Implications</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            AI-correlated losses may trigger reinsurance attachment points simultaneously across multiple cedants. Traditional property/casualty reinsurance structures are not designed for this correlation pattern. Treaty wording review required.
          </div>
          <div className="mt-3 text-[10px] font-bold text-fragile">⚠ Treaty language gap — AI correlation not addressed</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-primary mb-2">Loss of Function Endorsement</div>
          <div className="text-[13px] font-bold text-foreground mb-2">AI-Specific Coverage Extension</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">
            Standard business interruption wording does not address "loss of AI function" — where the system continues operating but produces degraded, biased, or harmful outputs. Endorsement required to cover functional degradation, not just failure.
          </div>
          <div className="mt-3 text-[10px] font-bold text-primary">◆ New endorsement category required</div>
        </div>
      </div>

      {/* ═══ 14. ANTI-STACKING ═══ */}
      <SectionCard title="Anti-Stacking Safeguards — Get Ahead of Multi-Limit Exposure" icon="🛡️">
        <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
          <div>• <strong className="text-foreground">Add AI SPOF exclusion to property/BI wording</strong> — Prevents unintended coverage stacking when AI failure triggers business interruption</div>
          <div>• <strong className="text-foreground">Set "first dollar" deductible on AI-linked claims</strong> — Reduces frequency on small-ticket AI-related losses that create adverse selection</div>
          <div>• <strong className="text-foreground">Cap aggregate AI exposure per treaty</strong> — Sets maximum per-entity and per-portfolio limits on AI-related claims</div>
        </div>
      </SectionCard>

      {/* ═══ 15. REINSURANCE € BOXES (dark panel) ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-3">◆ Existing Insurance applicable in Reinsurance</div>
        <div className="text-[14px] font-bold text-foreground mb-4">Estimated coverage applicable in AI-correlated scenarios</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Cyber / Tech E&O', value: 'Elevated Exposure', color: 'text-sensitive', desc: 'Existing cyber policy — partial coverage of AI-related incidents' },
            { label: 'Professional Indemnity', value: 'Elevated Exposure', color: 'text-fragile', desc: 'PI policy — AI-influenced advice and decisions' },
            { label: 'D&O / Management Liability', value: 'Elevated Exposure', color: 'text-fragile', desc: 'Directors & Officers — governance failure liability' },
          ].map((m, i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-[28px] font-bold font-mono leading-none ${m.color}`}>{m.value}</div>
              <div className="text-[10px] text-secondary-foreground mt-2">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 16. UNDERWRITING DECISION LOG ═══ */}
      <SectionCard title="Underwriting Decision Log — Full Audit Trail" icon="📋" subtitle="Chronological record of all underwriting signals and decisions.">
        <div className="space-y-3">
          {[
            { num: 1, time: 'T+0', title: 'Exposure Analysis submitted', status: 'COMPLETE', statusColor: 'bg-stable text-foreground', desc: `${inputs.companyName || 'Entity'} · ${inputs.industry} · ${inputs.useCases?.length || 0} AI use cases · ${inputs.providers?.length || 0} provider dependencies` },
            { num: 2, time: 'T+0', title: 'AFI calculated at {afi}', status: band.toUpperCase(), statusColor: band === 'Fragile' ? 'bg-fragile text-foreground' : band === 'Sensitive' ? 'bg-sensitive text-foreground' : 'bg-stable text-foreground', desc: `Structural Exposure Score: ${structuralScore}. ECI Tier: ${eciTier} (${eciName}). Delegation ratio: ${Math.round(components.dr * 100)}%. Justificatory density: ${Math.round(components.jd * 100)}%.` },
            { num: 3, time: 'T+0', title: 'Risk indices computed', status: 'ASSESSED', statusColor: 'bg-primary text-foreground', desc: `ALRI: ${alri}. AGRI: ${agri}. SCRI: ${scri}. Composite: ${compositeRiskIndex}. MDR: ${results.mdr}% (${results.mdrLabel}).` },
            { num: 4, time: 'T+0', title: 'Financial exposure modelled', status: 'MODELLED', statusColor: 'bg-primary text-foreground', desc: `Expected: ${lossEnvelope.expected}. Stress: ${lossEnvelope.stress}. Tail: ${lossEnvelope.tail}. Portfolio aggregate: ${lossEnvelope.portfolio}.` },
            { num: 5, time: 'T+0', title: 'Decision class determined', status: decisionClass.toUpperCase().replace(/ /g, '_'), statusColor: band === 'Fragile' ? 'bg-fragile text-foreground' : 'bg-sensitive text-foreground', desc: `${decisionClass}. Premium band: ${premium.band}. Structural loading: +${Math.round(Math.min(80, afi * 45))}%.` },
            { num: 6, time: 'T+0', title: 'Awaiting committee review', status: 'PENDING', statusColor: 'bg-secondary text-foreground border border-border', desc: 'All signals computed. Decision requires human underwriter sign-off before coverage terms are issued. No automated binding authority.' },
          ].map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold flex-shrink-0">{entry.num}</div>
                {i < 5 && <div className="w-px h-full bg-border min-h-[20px]" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-foreground">{entry.title.replace('{afi}', afi.toFixed(2))}</span>
                  <span className={`px-2 py-[1px] rounded text-[8px] font-bold tracking-wider uppercase ${entry.statusColor}`}>{entry.status}</span>
                </div>
                <div className="text-[10px] text-muted-foreground leading-[1.5]">{entry.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionDivider title="Market Position & Portfolio" icon="🌍" subtitle="Market context, portfolio exposure, and provider dependency" />

      {/* ═══ 17. WHAT THE MARKET SEES ═══ */}
      <div className="bg-card border border-border rounded-xl p-7 mb-5">
        <div className="mb-5">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-[6px]">What the Market Sees — AI Risk in Context</div>
          <div className="text-[18px] font-bold text-foreground mb-1 tracking-tight">How this framework positions relative to market</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[14px] pb-[10px] border-b-2 border-border">Emerging AI Market Consensus</div>
            {[
              { text: 'Swiss Re sigma insights 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk."', source: 'Swiss Re' },
              { text: 'Swiss Re sigma insights 01/2026: "AI adoption creates emerging risk dimensions that do not fit neatly within traditional insurance boundaries."', source: 'Swiss Re' },
              { text: 'Swiss Re sigma insights 01/2026: "Reallocation rather than pure growth of insurable demand."', source: 'Swiss Re' },
              { text: 'EU AI Act Art. 99: Penalties of up to €35M or 7% of global turnover for non-compliance.', source: 'EU AI Act' },
            ].map((item, i) => (
              <div key={i} className="py-[6px] text-[11px] text-secondary-foreground leading-[1.55]">
                <span className="text-fragile font-bold mr-1">▸</span> {item.text}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-primary mb-[14px] pb-[10px] border-b-2 border-primary">Kindermann AI Governance Framework</div>
            {[
              { text: 'Structural risk detection: Quantifies continuation risk, dependency lock-in, and cross-system propagation — invisible to compliance-only approaches.' },
              { text: 'AFI as single structural signal: One number that captures governance fragility, not compliance posture. Designed for underwriting, not checkbox audits.' },
              { text: 'Portfolio-level correlation: First framework to model AI infrastructure concentration as a portfolio-wide systemic risk factor.' },
              { text: 'Epistemic honesty: Explicitly declares what this assessment cannot guarantee — unlike tools that imply certainty where none exists.' },
            ].map((item, i) => (
              <div key={i} className="py-[6px] text-[11px] text-secondary-foreground leading-[1.55]">
                <span className="text-stable font-bold mr-1">◆</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 18. WHAT THE INSURER PORTFOLIO SEES (dark) ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-2">◆ What the insurer portfolio sees</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Direct Entity Loss', value: lossEnvelope.expected, color: 'text-sensitive' },
            { label: 'Correlated Cluster', value: lossEnvelope.stress, color: 'text-fragile' },
            { label: 'Portfolio Aggregate', value: lossEnvelope.portfolio, color: 'text-fragile' },
          ].map((m, i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-[28px] font-bold font-mono leading-none ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-[11px] text-secondary-foreground leading-[1.55]">
          <div>• <strong className="text-foreground">Multi-entity cascade exposure</strong> — if 5+ entities in portfolio share AI infrastructure stack, a single provider event triggers correlated losses across all entities.</div>
          <div>• <strong className="text-foreground">Aggregate treaty implications</strong> — portfolio aggregate exceeds standard catastrophe reserve assumptions. Reinsurance treaty review required.</div>
          <div>• <strong className="text-foreground">Concentration creates systemic risk</strong> — AI provider concentration in a portfolio mirrors natural catastrophe concentration. Geographic diversification does not help.</div>
        </div>
      </div>

      {/* ═══ STEP 5: PORTFOLIO EXPOSURE ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">5</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Portfolio Exposure</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-fragile-bg border border-fragile-border rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[13px] font-bold text-foreground">📊 Portfolio-Level Exposure Signal<InfoTip text="Estimated aggregate exposure across multiple entities with similar dependency profiles. Swiss Re sigma 01/2026: Provider concentration creates accumulation risk." /></div>
            <div className="text-[11px] text-secondary-foreground mt-1">If multiple entities share similar dependency structures, losses cluster non-linearly and exceed individual assessments.</div>
          </div>
          <span className="px-[7px] py-[2px] rounded text-[9px] font-bold tracking-wider uppercase badge-fragile">Systemic Cluster Detected</span>
        </div>
        <div className="text-[13px] text-foreground font-medium mb-3">
          If 8–15 entities share similar AI infrastructure, <strong className="text-fragile font-mono">systemic correlation risk emerges</strong> <span className="text-[10px] text-muted-foreground font-normal">— Swiss Re sigma 01/2026: Provider concentration creates accumulation risk</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Correlation Factor</div>
            <div className="text-[22px] font-bold font-mono text-foreground">{correlationFactor.toFixed(2)}</div>
            <div className="text-[9px] text-muted-foreground">Provider overlap ratio</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Cluster Size</div>
            <div className="text-[22px] font-bold font-mono text-foreground">8–15</div>
            <div className="text-[9px] text-muted-foreground">entities in exposure cluster</div>
          </div>
          <div className="bg-fragile-bg border border-fragile-border rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Systemic Risk</div>
            <div className="text-[22px] font-bold font-mono text-fragile">{lossEnvelope.portfolio}</div>
            <div className="text-[9px] text-muted-foreground">Correlated tail scenario</div>
          </div>
        </div>
        <div className="p-[7px_11px] bg-sensitive-bg border border-sensitive-border rounded-md text-[11px]">
          <strong className="text-sensitive">Provider Concentration: </strong>
          <span className="text-secondary-foreground">{inputs.providers?.length || 0} providers — {(inputs.providers?.length || 0) <= 1 ? 'single point of failure across cluster' : 'diversification reduces systemic exposure'}</span>
        </div>
      </div>

      {/* ═══ STEP 5b: PROVIDER DEPENDENCY MAP ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">5b</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Provider Dependency Map</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[13px] font-bold text-foreground">🔗 Provider Dependency Structure<InfoTip text="Maps the flow from external AI providers through your core systems to internal operations. Red nodes indicate single points of failure." /></div>
            <div className="text-[11px] text-secondary-foreground mt-1">{inputs.providers?.length || 0} external dependencies</div>
          </div>
          <span className={`px-[7px] py-[2px] rounded text-[9px] font-bold tracking-wider uppercase ${(inputs.providers?.length || 0) <= 1 ? 'badge-fragile' : (inputs.providers?.length || 0) <= 2 ? 'badge-sensitive' : 'badge-stable'}`}>
            {(inputs.providers?.length || 0) <= 1 ? 'Critical' : (inputs.providers?.length || 0) <= 2 ? 'Elevated' : 'Diversified'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 my-4">
          <div className="flex flex-col gap-2">
            {(inputs.providers?.length ? inputs.providers : ['No provider selected']).map((p, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputs.providers?.length ? 'bg-fragile-bg border-fragile-border' : 'bg-secondary border-border opacity-40'}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${inputs.providers?.length ? 'bg-fragile-bg text-fragile' : 'bg-secondary text-muted-foreground'}`}>
                  {inputs.providers?.length ? '☁' : '?'}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{p}</div>
                  <div className="text-[9px] text-muted-foreground">External Provider</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground text-lg mx-3">→</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-purple-bg">
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-[10px]">⚙</div>
            <div>
              <div className="text-[11px] font-semibold text-foreground">Core Systems</div>
              <div className="text-[9px] text-muted-foreground">AI-integrated workflows</div>
            </div>
          </div>
          <div className="text-muted-foreground text-lg mx-3">→</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary">
            <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-[10px]">🏢</div>
            <div>
              <div className="text-[11px] font-semibold text-foreground">Operations</div>
              <div className="text-[9px] text-muted-foreground">Internal processes</div>
            </div>
          </div>
        </div>
        <div className="bg-sensitive-bg border border-sensitive-border rounded-lg p-3 flex items-start gap-2">
          <span className="text-sensitive text-sm flex-shrink-0">⚠</span>
          <div>
            <div className="text-[11px] font-semibold text-foreground">⚠ {(inputs.providers?.length || 0) <= 1 ? 'Critical concentration' : 'Concentration risk'} — {inputs.providers?.length || 0} providers specified</div>
            <div className="text-[10px] text-secondary-foreground">{inputs.providers?.length || 0} providers — {(inputs.providers?.length || 0) <= 1 ? 'single point of failure across cluster' : 'diversification reduces but does not eliminate correlated failure risk'}</div>
          </div>
        </div>
      </div>

      {/* ═══ STEP 6: RECOMMENDED UNDERWRITING ACTIONS ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">6</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Recommended Underwriting Actions</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="space-y-0">
          {[
            { num: 1, title: 'Apply significant premium loading above standard', badge: 'Required', badgeColor: 'bg-fragile-bg text-fragile border-fragile-border', numBg: 'bg-fragile-bg text-fragile', desc: 'Structural risk exceeds standard pricing assumptions. Dependency structures do not compensate for co-activation and aggregation exposure.' },
            { num: 2, title: 'Require dependency diversification plan within 90 days', badge: 'Required', badgeColor: 'bg-fragile-bg text-fragile border-fragile-border', numBg: 'bg-fragile-bg text-fragile', desc: 'Dependency concentration creates correlated loss potential. Diversification across minimum 3 providers reduces aggregate tail risk. Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic risk."' },
            { num: 3, title: 'Limit coverage to operational layers only', badge: 'Recommended', badgeColor: 'bg-sensitive-bg text-sensitive border-sensitive-border', numBg: 'bg-sensitive-bg text-sensitive', desc: 'Lock-in depth makes full-stack coverage uneconomic. Limiting scope to operational disruption reduces reserve requirements.' },
            { num: 4, title: 'Mandate governance cadence as coverage condition', badge: 'Condition', badgeColor: 'bg-sensitive-bg text-sensitive border-sensitive-border', numBg: 'bg-sensitive-bg text-sensitive', desc: 'Without re-authorisation cadence, risk accumulates indefinitely. Formal quarterly review required to maintain coverage terms.' },
            { num: 5, title: 'Exclude autonomous execution liability', badge: 'Exclusion', badgeColor: 'bg-secondary text-muted-foreground border-border', numBg: 'bg-secondary text-muted-foreground', desc: 'Agentic exposure exceeds conventional governance frameworks. Autonomous actions require separate liability classification.' },
          ].map((act, i) => (
            <div key={i} className={`flex items-start gap-3 py-3 ${i < 4 ? 'border-b border-border' : ''}`}>
              <div className={`w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${act.numBg}`}>{act.num}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground mb-1">
                  {act.title} <span className={`ml-1 px-[6px] py-[1px] rounded text-[9px] font-bold tracking-wider uppercase border ${act.badgeColor}`}>{act.badge}</span>
                </div>
                <div className="text-[11px] text-secondary-foreground leading-[1.5]">{act.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STEP 7: GOVERNANCE ALERTS ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">7</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Governance Alerts</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[11px] text-secondary-foreground mb-3 leading-[1.5]">Each alert identifies where the system creates unpriced liability — persisting, scaling, or acting faster than governance can safely absorb.</div>
        {[
          { title: 'Unauthorized Operational Persistence', severity: 'High', color: 'border-l-sensitive', desc: `System continues operating without re-authorisation — liability accumulates with no upper bound. No re-authorisation mechanism exists. Proceeds toward critical exposure at current trajectory (score ${Math.round(components.cd * 100)}/100).` },
          { title: 'Irreversible System Entrenchment', severity: 'High', color: 'border-l-sensitive', desc: `Dependency depth exceeds the organisation's capacity to exit. Cannot be reversed without significant operational disruption. Exit cost creates permanent structural lock-in (score ${Math.round(components.rc * 100)}/100).` },
          { title: 'Execution Authority Exceeds Oversight Capacity', severity: 'Critical', color: 'border-l-fragile', desc: `Autonomous execution outpaces governance. The system acts faster than the organisation can evaluate — creating an accountability vacuum where liability accumulates undetected (score ${Math.round(components.dr * 100)}/100).` },
        ].map((alert, i) => (
          <div key={i} className={`p-3 mb-2 rounded-lg border border-border ${alert.color} border-l-4`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-foreground">{alert.title}</span>
              <span className={`px-[7px] py-[2px] rounded text-[9px] font-bold tracking-wider uppercase ${alert.severity === 'Critical' ? 'badge-fragile' : 'badge-sensitive'}`}>{alert.severity}</span>
            </div>
            <div className="text-[11px] text-secondary-foreground leading-[1.5]">{alert.desc}</div>
          </div>
        ))}
      </div>

      {/* ═══ INSURER OWN-EXPOSURE NOTE ═══ */}
      <div className="bg-purple-bg border border-purple-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-2">◈ Note for Insurer Buyers — Your Own AI Governance Exposure</div>
        <div className="text-[12px] font-semibold text-foreground mb-2">This tool assesses client deployments — but the same structural risks apply to the insurer's own AI systems.</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Solvency II — ORSA Integration', desc: 'EU insurers must integrate AI governance risk into the Own Risk and Solvency Assessment (ORSA) under Solvency II Art. 45. AFI scores from your own AI deployments are directly relevant ORSA inputs.' },
            { title: 'Solvency II Art. 44/46 — Internal Control & Audit', desc: 'Art. 44 requires an effective internal control system — which must cover AI-assisted decision-making. Art. 46 requires internal audit independence.' },
            { title: 'DORA — Digital Operational Resilience', desc: 'As of Jan 2025, DORA applies to EU insurers — requiring ICT risk management, third-party provider oversight, and incident reporting. AI provider concentration is a direct DORA ICT third-party concentration risk.' },
            { title: 'Reserving Implications', desc: 'Issuing AI liability coverage without a structural governance assessment creates reserve risk. AFI-based underwriting protects reserve adequacy — standard cyber pricing systematically underestimates AI governance exposure.' },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] font-bold text-foreground mb-1">{item.title}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STEP 8: EU AI ACT REGULATORY EXPOSURE ═══ */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">8</div>
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">EU AI Act Regulatory Exposure</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* EU AI ACT PENALTY CALCULATOR */}
      <div className="bg-secondary border border-border rounded-xl overflow-hidden mb-4 border border-border relative">
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #b53020, #780808)' }} />
        <div className="p-[18px_22px_14px]">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-fragile mb-[6px]">⚖ EU AI Act — Art. 99 Regulatory Penalty Exposure</div>
          <div className="text-[13px] font-bold text-foreground mb-1">Statutory fine ceilings applicable to this deployment</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.5] mb-[14px]">Penalties apply independently of AFI score or insurance status. A system within underwriting tolerance can still incur maximum fines.</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-[14px]">
            <div className="bg-fragile-bg border border-fragile-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-[0.09em] uppercase text-fragile mb-[6px]">Art. 99 §3 · Prohibited Practices</div>
              <div className="text-[24px] font-bold font-mono text-fragile leading-none mb-1">€35M</div>
              <div className="text-[10px] text-fragile/80">or 7% worldwide annual turnover</div>
              <div className="text-[9px] text-secondary-foreground mt-[6px] leading-[1.45]">Triggered by: Art. 5 violations (subliminal manipulation, social scoring, predictive policing, biometric scraping)</div>
            </div>
            <div className="bg-sensitive-bg border border-sensitive-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-[0.09em] uppercase text-sensitive mb-[6px]">Art. 99 §4 · Provider & Deployer</div>
              <div className="text-[24px] font-bold font-mono text-sensitive leading-none mb-1">€15M</div>
              <div className="text-[10px] text-sensitive/80">or 3% worldwide annual turnover</div>
              <div className="text-[9px] text-secondary-foreground mt-[6px] leading-[1.45]">Triggered by: Art. 16, Art. 26, Art. 50 obligations. Covers failure to implement human oversight or maintain logs.</div>
            </div>
            <div className="bg-stable-bg border border-stable-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-[0.09em] uppercase text-stable mb-[6px]">Art. 99 §5 · Misleading Regulators</div>
              <div className="text-[24px] font-bold font-mono text-stable leading-none mb-1">€7.5M</div>
              <div className="text-[10px] text-stable/80">or 1% worldwide annual turnover</div>
              <div className="text-[9px] text-secondary-foreground mt-[6px] leading-[1.45]">Triggered by: Supplying incorrect or misleading information to notified bodies or authorities.</div>
            </div>
          </div>
          <div className="p-[10px_14px] bg-fragile-bg border border-fragile-border rounded-md text-[11px] text-foreground leading-[1.5]">
            <strong className="text-fragile">Critical distinction for underwriters:</strong> Art. 99 §4 penalties apply directly to Art. 26 deployer failures — including failure to assign qualified human oversight (§2), failure to maintain logs for 6 months (§6), and failure to suspend use when risk is identified (§5). Standard cyber policies do not cover regulatory fines of this type.
          </div>
        </div>
      </div>

      {/* EU AI ACT COMPLIANCE CHECKLIST */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-[14px_20px] border-b border-border flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-[3px]">EU AI Act · Deployer Obligations Checklist</div>
            <div className="text-[13px] font-bold text-foreground">Active Regulatory Obligations — Art. 26 + Art. 27 + Art. 72</div>
          </div>
        </div>
        <div className="px-5">
          {[
            { icon: '✗', iconBg: 'bg-fragile-bg border-fragile-border text-fragile', title: 'Art. 26 §2 — Human Oversight Assignment', badge: '€15M Risk', badgeColor: 'bg-fragile-bg text-fragile border-fragile-border', desc: 'Deployers must assign human oversight to natural persons with the necessary competence, training, and authority.' },
            { icon: '✗', iconBg: 'bg-fragile-bg border-fragile-border text-fragile', title: 'Art. 26 §5-6 — Monitoring & Log Retention', badge: '€15M Risk', badgeColor: 'bg-fragile-bg text-fragile border-fragile-border', desc: 'Deployers must monitor the system and maintain automatically generated logs for at least 6 months.' },
            { icon: '~', iconBg: 'bg-sensitive-bg border-sensitive-border text-sensitive', title: 'Art. 27 — Fundamental Rights Impact Assessment', badge: 'Conditional', badgeColor: 'bg-sensitive-bg text-sensitive border-sensitive-border', desc: 'Required for public bodies and private entities providing public services deploying high-risk AI.' },
            { icon: '~', iconBg: 'bg-sensitive-bg border-sensitive-border text-sensitive', title: 'Art. 72 — Post-Market Monitoring System', badge: 'Lifecycle', badgeColor: 'bg-sensitive-bg text-sensitive border-sensitive-border', desc: 'Providers must establish a post-market monitoring system that actively collects and analyses performance data throughout the system\'s lifetime.' },
            { icon: '~', iconBg: 'bg-sensitive-bg border-sensitive-border text-sensitive', title: 'Art. 9 — Continuous Risk Management System', badge: 'Lifecycle', badgeColor: 'bg-sensitive-bg text-sensitive border-sensitive-border', desc: 'Art. 9 requires a risk management system as a continuous iterative process throughout the entire AI lifecycle.' },
            { icon: 'i', iconBg: 'bg-stable-bg border-stable-border text-stable', title: 'Art. 73 — Serious Incident Reporting (15-day window)', badge: '', badgeColor: '', desc: 'Providers must report serious incidents to market surveillance authorities within 15 days of establishing a causal link.' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 py-3 ${i < 5 ? 'border-b border-border' : ''}`}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center text-[10px] flex-shrink-0 mt-[1px] border ${item.iconBg}`}>{item.icon}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground mb-[2px]">
                  {item.title}
                  {item.badge && <span className={`ml-[6px] px-[6px] py-[1px] rounded text-[9px] font-bold tracking-wider uppercase border ${item.badgeColor}`}>{item.badge}</span>}
                </div>
                <div className="text-[11px] text-secondary-foreground leading-[1.5]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EU AI ACT ENFORCEMENT TIMELINE */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="p-[14px_20px] border-b border-border">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-[3px]">EU AI Act — Enforcement Timeline · Regulation (EU) 2024/1689</div>
          <div className="text-[13px] font-bold text-foreground">When Obligations Apply — What Is Active Now</div>
        </div>
        <div className="px-5">
          {[
            { date: '2 Feb 2025', badge: 'ACTIVE', badgeColor: 'bg-fragile-bg text-fragile', title: 'Chapters I & II — AI Definitions + Prohibited Practices', desc: 'All 8 prohibited AI practices under Art. 5 are now enforceable. Violations subject to fines up to €35M / 7% global turnover (Art. 99 §3).' },
            { date: '2 Aug 2025', badge: 'IMMINENT', badgeColor: 'bg-sensitive-bg text-sensitive', title: 'Chapter III §4 (Notified Bodies) · Chapter V (GPAI) · Chapter XII (Penalties)', desc: 'Full penalty regime activates (Art. 99). GPAI provider obligations begin. This is the penalty enforcement activation date for Art. 99 §4 (€15M / 3%) violations.' },
            { date: '2 Aug 2026', badge: 'FULL APPLY', badgeColor: 'bg-fragile-bg text-fragile', title: 'Full Regulation Applies — All High-Risk AI Obligations Active', desc: 'Complete application of all provisions including Art. 9, Art. 14, Art. 26, Art. 27, Art. 72, Art. 73. This is the primary underwriting risk horizon.' },
            { date: '2 Aug 2027', badge: '', badgeColor: '', title: 'Art. 6(1) — High-Risk AI as Safety Component in Regulated Products', desc: 'Art. 6(1) obligations apply to AI systems that are safety components in products covered by Union harmonisation legislation (Annex I).' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-[14px] py-3 ${i < 3 ? 'border-b border-border' : ''}`}>
              <div className="font-mono text-[11px] font-bold min-w-[100px] flex-shrink-0 mt-[2px]">
                <span className={item.badge ? (item.badge === 'ACTIVE' || item.badge === 'FULL APPLY' ? 'text-fragile' : 'text-sensitive') : 'text-secondary-foreground'}>{item.date}</span>
                {item.badge && <span className={`ml-1 px-[5px] py-[1px] rounded text-[8px] font-bold tracking-wider ${item.badgeColor}`}>{item.badge}</span>}
              </div>
              <div>
                <div className="text-[12px] font-semibold text-foreground mb-[2px]">{item.title}</div>
                <div className="text-[11px] text-secondary-foreground leading-[1.5]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider title="Premium Calculator" icon="💰" subtitle="Interactive actuarial pricing with coverage and deductible options" />

      {/* ═══ PREMIUM CALCULATOR ═══ */}
      <div className="bg-card border-2 border-primary/30 rounded-xl p-4 sm:p-6 mb-4">
        <PremiumCalculator />
      </div>

      {/* View nav footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(3)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Scenario Simulation</button>
        <span className="text-[10px] text-muted-foreground italic">Step 4 of 6 · Insurance & financial exposure</span>
        <button onClick={() => setActiveStep(5)} className="view-nav-next">Executive Report →</button>
      </div>
    </div>
  );
}
