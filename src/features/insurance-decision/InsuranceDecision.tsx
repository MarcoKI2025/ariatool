import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { Banner, MetricCard, SectionCard, LockedState, BandBadge, InfoTip } from '@/components/shared/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TOOLTIPS } from '@/lib/tooltips';

export function InsuranceDecision() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Insurance Decision Locked" description="Complete the Exposure Analysis to view the underwriting decision console with loss envelope and committee signals." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, amplificationFactor, correlationFactor, components, premium, eciTier, eciName, structuralScore } = results;

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 4 of 6 · Underwriting Decision</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Insurance & Financial Exposure</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Financial exposure modelling and underwriting decision framework for {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* Large decision banner */}
      <div className={`rounded-xl p-8 mb-4 border-2 relative overflow-hidden ${
        band === 'Fragile' ? 'bg-dark-section border-fragile' :
        band === 'Sensitive' ? 'bg-dark-section border-sensitive' :
        'bg-dark-section border-stable'
      }`}>
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-chrome-fg-muted mb-3">
          ◆ Governance Exposure Engine · Underwriting Decision
        </div>
        <div className={`text-[42px] font-extrabold tracking-wider uppercase leading-[1.1] mb-4 ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
        }`}>
          {decisionClass === 'Escalate to Committee' ? 'Escalate to Committee' :
           decisionClass === 'Conditional Review' ? 'Conditional Review' :
           'Standard Coverage'}
        </div>
        <div className="text-[13px] text-dark-section-fg leading-[1.6] max-w-[700px] mb-4">
          {band === 'Fragile' 
            ? 'AI deployment creates structural risk that exceeds current underwriting tolerance and cannot be adequately priced using standard rating factors. This profile requires committee-level review before any coverage terms are offered.'
            : band === 'Sensitive'
            ? 'Elevated structural signals require conditional review. Coverage available with mandatory improvement timeline.'
            : 'Structural exposure within manageable bounds. Standard underwriting process applies.'}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-chrome-fg-muted mb-1">Decision Class</div>
            <div className="text-[14px] font-bold text-white">{decisionClass}</div>
          </div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-chrome-fg-muted mb-1">AFI Position<InfoTip text={TOOLTIPS.afi} /></div>
            <div className="text-[14px] font-bold text-white font-mono">{afi.toFixed(2)} · {band}</div>
          </div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-chrome-fg-muted mb-1">Premium Range<InfoTip text={TOOLTIPS.premium} /></div>
            <div className="text-[14px] font-bold text-white font-mono">{formatCurrency(premium.lo, 'k')} – {formatCurrency(premium.hi, 'k')}</div>
          </div>
        </div>
      </div>

      {/* Justification chips */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="px-3 py-[6px] bg-card border border-border rounded-lg text-[10px] font-medium text-muted-foreground">
          AFI {afi.toFixed(2)}
        </span>
        <span className="px-3 py-[6px] bg-card border border-border rounded-lg text-[10px] font-medium text-muted-foreground">
          ECI-{eciTier} · {eciName}
        </span>
        <BandBadge band={band} size="sm" />
      </div>

      {/* This Means */}
      <div className="bg-card rounded-xl p-5 mb-4 border-l-4 border-l-fragile border border-border flex items-start gap-[14px]">
        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
          band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
        }`}>
          <span className="text-[11px] text-white font-bold">!</span>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-bold mb-[5px]">This Means</div>
          <div className="text-[16px] font-bold text-foreground leading-[1.3]">
            {band === 'Fragile' ? 'Standard coverage is not justified without structural changes.' :
             band === 'Sensitive' ? 'Conditional coverage only — structural improvements required within 90 days.' :
             'Standard coverage terms apply. Maintain governance cadence and reassess at renewal.'}
          </div>
          <div className="text-[12px] text-muted-foreground mt-[5px] leading-[1.5]">
            {band === 'Fragile' ? 'It is possible to fully comply with current AI regulation — EU AI Act, internal audit, third-party compliance frameworks — and still carry structural risk that exceeds underwriting tolerance. A compliant system that remains fragile is a compliant system that will still generate losses.' :
             'Coverage terms are conditional on demonstrated improvement in governance posture. Reassessment required before standard rates apply.'}
          </div>
        </div>
      </div>

      {/* Financial Exposure */}
      <SectionCard title="Financial Exposure — Market-Calibrated Loss Envelope" icon="📊" subtitle="Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Expected scenario', color: 'text-foreground' },
            { label: 'Base Risk Band', value: lossEnvelope.stress, sub: 'Structural governance exposure', color: 'text-foreground' },
            { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Provider concentration · Tail risk', color: 'text-fragile', highlight: true },
          ].map((cell, i) => (
            <div key={i} className={`rounded-xl p-5 border ${cell.highlight ? 'bg-fragile-bg border-fragile-border' : 'bg-card border-border'}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-2 ${cell.highlight ? 'text-fragile' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none ${cell.color}`}>{formatCurrency(cell.value)}</div>
              <div className="text-[10px] text-muted-foreground mt-2">{cell.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
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
          ⚠ Tail risk: Correlated AI infrastructure creates {amplificationFactor} aggregate exposure vs. isolated incidents. Portfolio loss assumes 5 entities with similar AI infrastructure stack.
        </div>
      </SectionCard>

      {/* Financial outputs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <MetricCard label="Amplification Factor" value={amplificationFactor} sublabel="Munich Re loss multiplier" />
        <MetricCard label="Correlation Factor" value={correlationFactor.toFixed(2)} sublabel="Cross-system propagation" />
        <MetricCard label="Structural Loading" value={`+${Math.round(Math.min(80, afi * 45))}%`} sublabel="Governance gap premium" />
      </div>

      {/* Scenario tabs */}
      <SectionCard title="How this scenario propagates to portfolio loss" icon="🌐" subtitle="Cascade amplification model">
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Entity Loss', value: formatCurrency(lossEnvelope.expected), sub: 'Direct' },
            { label: 'Correlated', value: formatCurrency(lossEnvelope.stress), sub: '×3.4' },
            { label: 'Tail', value: formatCurrency(lossEnvelope.tail), sub: '99th pctl' },
            { label: 'Amplified', value: amplificationFactor, sub: 'Cascade' },
            { label: 'Portfolio', value: formatCurrency(lossEnvelope.portfolio), sub: 'Aggregate' },
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-[18px] font-bold font-mono leading-none ${i >= 3 ? 'text-fragile' : 'text-foreground'}`}>{m.value}</div>
              <div className="text-[9px] text-muted-foreground mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Risk Position + Systemic Signals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <SectionCard title="Risk Position" icon="📋">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Above underwriting tolerance</strong> — Structural baseline → AI-derived characteristic</div>
            <div>• <strong className="text-foreground">Standard coverage not justified</strong> — Structural change required before standard rates apply</div>
            <div>• <strong className="text-foreground">Premium loading mandatory</strong> — 150–180% above standard · mandatory pricing adjustment</div>
            <div>• <strong className="text-foreground">Critical risk band: €{(lossEnvelope.tail).toFixed(1)}M</strong> — Provider concentration and automation factors</div>
            <div>• <strong className="text-foreground">Systemic exposure: €{Math.round(lossEnvelope.portfolio)}M</strong> — If 5 entities share similar AI infrastructure</div>
          </div>
        </SectionCard>
        <SectionCard title="Required Actions" icon="⚠">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Apply premium loading (150–180%)</strong> — Mandatory · structural risk exceeds standard pricing</div>
            <div>• <strong className="text-foreground">Require dependency diversification</strong> — Mandatory within 90 days · minimum 3 providers</div>
            <div>• <strong className="text-foreground">Enforce governance cadence</strong> — Condition of coverage · quarterly re-authorisation</div>
            <div>• <strong className="text-foreground">Limit coverage to operational layers</strong> — Recommended · full-stack coverage uneconomic</div>
          </div>
        </SectionCard>
      </div>

      {/* What the insurer portfolio sees */}
      <div className="bg-dark-section border border-dark-section-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-2">◆ What the insurer portfolio sees</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Direct Entity Loss', value: formatCurrency(lossEnvelope.expected), color: 'text-sensitive' },
            { label: 'Correlated Cluster', value: formatCurrency(lossEnvelope.stress), color: 'text-fragile' },
            { label: 'Portfolio Aggregate', value: formatCurrency(lossEnvelope.portfolio), color: 'text-fragile' },
          ].map((m, i) => (
            <div key={i} className="bg-dark-section-border/50 border border-dark-section-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-wider uppercase text-chrome-fg-muted mb-1">{m.label}</div>
              <div className={`text-[28px] font-bold font-mono leading-none ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-[11px] text-dark-section-fg leading-[1.55]">
          <div>• <strong className="text-white">Multi-entity cascade exposure</strong> — if 5+ entities in portfolio share AI infrastructure stack, a single provider event triggers correlated losses across all entities.</div>
          <div>• <strong className="text-white">Aggregate treaty implications</strong> — portfolio aggregate exceeds standard catastrophe reserve assumptions. Reinsurance treaty review required.</div>
          <div>• <strong className="text-white">Concentration creates systemic risk</strong> — AI provider concentration in a portfolio mirrors natural catastrophe concentration. Geographic diversification does not help.</div>
        </div>
      </div>

      {/* Anti-Stacking & Cap-of-Cap */}
      <SectionCard title="Anti-Stacking Safeguards — Get Ahead of Multi-Limit Exposure" icon="🛡️">
        <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
          <div>• <strong className="text-foreground">Add AI SPOF exclusion to property/BI wording</strong> — Prevents unintended coverage stacking when AI failure triggers business interruption</div>
          <div>• <strong className="text-foreground">Set "first dollar" deductible on AI-linked claims</strong> — Reduces frequency on small-ticket AI-related losses that create adverse selection</div>
          <div>• <strong className="text-foreground">Cap aggregate AI exposure per treaty</strong> — Sets maximum per-entity and per-portfolio limits on AI-related claims</div>
        </div>
      </SectionCard>

      {/* Premium Simulation Chart */}
      {(() => {
        const scenarios = [
          { label: 'Current', low: premium.lo, high: premium.hi },
          { label: 'Optimized', low: Math.round(premium.lo * 0.65), high: Math.round(premium.mid * 0.85) },
          { label: 'Worst Case', low: Math.round(premium.mid * 1.5), high: Math.round(premium.hi * 1.8) },
        ];
        const chartData = scenarios.map(s => ({
          name: s.label,
          low: s.low,
          range: s.high - s.low,
          high: s.high,
        }));
        return (
          <SectionCard title="Premium Simulation — Scenario Range" icon="💰" subtitle="Indicative annual premium · NOT actuarially certified">
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => `€${v}k`}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'Inter', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-[#111108] border border-[#3a3828] rounded-lg px-3 py-2 text-[11px] shadow-lg">
                          <div className="text-white font-semibold mb-1">{d.name}</div>
                          <div className="text-[#c0bcb0]">€{d.low}k – €{d.high}k / year</div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="low" stackId="a" fill="rgba(64, 56, 184, 0.7)" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="range" stackId="a" fill="rgba(64, 56, 184, 0.3)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-3 bg-secondary border border-border rounded-lg text-[10px] text-muted-foreground mt-3">
              Premium estimates are governance-oriented indicators only. Use with independent actuarial validation. Optimized scenario assumes governance improvements within 90 days.
            </div>
          </SectionCard>

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(3)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Scenario Simulation</button>
        <span className="text-[10px] text-muted-foreground italic">Step 4 of 6 · Insurance & financial exposure</span>
        <button onClick={() => setActiveStep(5)} className="view-nav-next">Executive Report →</button>
      </div>
    </div>
  );
}
