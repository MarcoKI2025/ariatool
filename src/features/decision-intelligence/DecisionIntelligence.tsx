import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Banner, MetricCard, BandBadge, SectionCard, LockedState, InfoTip } from '@/components/shared/UIComponents';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TOOLTIPS } from '@/lib/tooltips';

export function DecisionIntelligence() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Decision Intelligence Locked" description="Complete the Exposure Analysis to unlock AFI scoring, governance exposure, and structural risk signals." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, eciTier, eciName, lossEnvelope, agri, amplificationFactor, correlationFactor } = results;

  // Responsibility scores
  const respFragmentation = Math.round(Math.min(99, (1 - components.jd) * 100 + components.dr * 20));
  const stewardshipClarity = Math.round(Math.min(99, components.jd * 60 + (1 - components.dr) * 20));
  const decisionAttribGap = Math.round(Math.min(99, components.dr * 80 + (1 - components.jd) * 15));
  const diffuseLabel = respFragmentation >= 60 ? 'Diffuse' : respFragmentation >= 40 ? 'Partial' : 'Clear';

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 2 of 6 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Decision Intelligence</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Multi-dimensional risk characterization using AFI, ECI, AGRI, ALRI, and SCRI indices — calibrated to {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* Hero diagnosis */}
      <div className={`rounded-xl p-6 mb-4 border-2 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Governance Exposure Engine v3.0</div>
        <div className={`text-[28px] font-extrabold tracking-tight leading-[1.1] mb-3 uppercase ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
        }`}>
          {band === 'Fragile' ? 'Structural Exposure Detected' :
           band === 'Sensitive' ? 'Elevated Structural Signals' :
           'Governance Signals Within Range'}
        </div>
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

      {/* Hero score + ECI gauge */}
      <div className="grid grid-cols-[1fr_300px] gap-4 mb-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Structural Exposure Score<InfoTip text={TOOLTIPS.afi} /></div>
              <div className={`text-[72px] font-bold font-mono leading-none tracking-tight ${
                band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
              }`}>{structuralScore}</div>
            </div>
            <div className="flex-1">
              {/* Semicircle gauge */}
              <div className="relative w-[140px] h-[70px] mx-auto">
                <svg viewBox="0 0 140 70" className="w-full h-full">
                  <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" 
                    stroke={band === 'Fragile' ? 'hsl(var(--fragile))' : band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${Math.min(188, structuralScore * 1.88)} 188`} />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <div className={`text-[18px] font-bold font-mono ${band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
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
        </div>

        {/* Quick metrics */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'AFI Score', value: afi.toFixed(2), band, tooltip: TOOLTIPS.afi },
            { label: 'AGRI', value: `${agri}`, band: agri >= 60 ? 'Fragile' as const : agri >= 35 ? 'Sensitive' as const : 'Stable' as const },
            { label: 'Decision Class', value: results.decisionClass, band },
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}{(m as any).tooltip && <InfoTip text={(m as any).tooltip} />}</div>
              <div className={`text-[18px] font-bold font-mono ${m.band === 'Fragile' ? 'text-fragile' : m.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AFI Component chips */}
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
            {(c as any).tooltip && <InfoTip text={(c as any).tooltip} />}
          </div>
        ))}
        <BandBadge band={band} size="sm" />
      </div>

      {/* AFI Component Analysis — Radar Chart */}
      <SectionCard title="AFI Component Analysis">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={[
              { dimension: 'Delegation Ratio', value: components.dr },
              { dimension: 'Reversibility Cost', value: components.rc },
              { dimension: 'Continuation Density', value: components.cd },
              { dimension: 'Justificatory Density', value: components.jd },
              { dimension: 'Network Amplification', value: components.na },
            ]}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'Inter' }}
              />
              <PolarRadiusAxis
                domain={[0, 1]}
                tickCount={6}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                axisLine={false}
              />
              <Radar
                name="Your Profile"
                dataKey="value"
                stroke="#b53020"
                fill="rgba(181, 48, 32, 0.15)"
                strokeWidth={2}
                dot={{ fill: '#b53020', stroke: '#fff', strokeWidth: 1, r: 3 }}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#111108] border border-[#3a3828] rounded-lg px-3 py-2 text-[11px] shadow-xl">
                      <div className="text-white font-medium">{d.dimension}</div>
                      <div className="text-[#c0bcb0]">{(d.value * 100).toFixed(0)}%</div>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Radar visualization of AFI sub-components. Values closer to 100% indicate higher structural exposure in that dimension. JD (Justificatory Density) is protective — higher values reduce AFI.
        </p>
      </SectionCard>

      <div className="bg-card rounded-xl p-5 mb-4 border-l-4 border-l-fragile border border-border flex items-start gap-[14px]">
        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] ${
          band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
        }`}>
          <span className="text-[11px] text-white font-bold">!</span>
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

      {/* Financial Exposure */}
      <SectionCard title="Financial Exposure — Market-Calibrated Loss Envelope" icon="📊" subtitle="Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Expected scenario · median market outcome', highlight: false },
            { label: 'Base Risk Band', value: lossEnvelope.stress, sub: 'Structural governance exposure', highlight: false },
            { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Provider concentration · Tail risk', highlight: true },
          ].map((cell, i) => (
            <div key={i} className={`rounded-xl p-5 border ${cell.highlight ? 'bg-fragile-bg border-fragile-border' : 'bg-card border-border'}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-2 ${cell.highlight ? 'text-fragile' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none ${cell.highlight ? 'text-fragile' : 'text-foreground'}`}>{formatCurrency(cell.value)}</div>
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

      {/* Risk Comparison — Governance Gap Analysis */}
      <SectionCard title="Risk Comparison — Governance Gap Analysis" icon="📊" subtitle="Comparing your current governance profile against a well-governed baseline across risk scenarios.">
        {(() => {
          const mapToRiskLevel = (afiVal: number) => {
            if (afiVal < 0.5) return 1;
            if (afiVal < 0.85) return 2;
            if (afiVal < 1.35) return 3;
            return 4;
          };
          const chartData = [
            { name: 'Base Risk', baseline: 1, profile: mapToRiskLevel(afi * 0.6) },
            { name: 'Elevated Risk', baseline: 2, profile: mapToRiskLevel(afi * 0.9) },
            { name: 'Critical Risk', baseline: 2, profile: mapToRiskLevel(afi * 1.2) },
          ];
          const riskLabels = ['', 'Low', 'Medium', 'High', 'Critical'];
          return (
            <>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={4} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'Inter' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tickFormatter={(v: number) => riskLabels[v] || ''} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#111108', border: '1px solid #3a3828', borderRadius: '8px', padding: '10px' }}
                      labelStyle={{ color: '#ffffff', fontSize: 11, fontWeight: 600 }}
                      itemStyle={{ color: '#c0bcb0', fontSize: 11 }}
                      formatter={(value: number, name: string) => [riskLabels[Math.round(value)] || '', name === 'baseline' ? 'Well-Governed Baseline' : 'Your Current Profile']}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="rect"
                      iconSize={8}
                      formatter={(value: string) => value === 'baseline' ? 'Well-Governed Baseline' : 'Your Current Profile'}
                      wrapperStyle={{ fontSize: 10, color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Bar dataKey="baseline" fill="rgba(64, 56, 184, 0.55)" stroke="#4038b8" strokeWidth={1} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="profile" fill="rgba(181, 48, 32, 0.75)" stroke="#b53020" strokeWidth={1} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-3 bg-secondary border border-border rounded-lg text-[10px] text-muted-foreground leading-[1.5]">
                Comparison methodology: Well-governed baseline assumes AFI &lt;0.5 across all scenarios. Your profile maps current AFI ({afi.toFixed(2)}) to Base (×0.6), Elevated (×0.9), and Critical (×1.2) risk multipliers. Gap between profiles indicates governance-driven excess exposure.
              </div>
            </>
          );
        })()}
      </SectionCard>

      {/* Continuation / Dependency / Portfolio */}
      <div className="grid grid-cols-3 gap-3 mb-4">
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

      {/* COMMITTEE REVIEW REQUIRED */}
      <div className={`rounded-xl p-5 mb-4 border-2 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className={`text-[18px] font-extrabold tracking-wider uppercase mb-3 ${
          band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
        }`}>
          {band === 'Fragile' ? 'Committee Review Required' : band === 'Sensitive' ? 'Conditional Review Process' : 'Standard Underwriting Process'}
        </div>
        <div className="grid grid-cols-4 gap-4">
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

      {/* AFI Components breakdown */}
      <SectionCard title="AFI Component Breakdown" icon="📊" subtitle="Individual risk dimensions that compose the Authority Fragility Index.">
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

      {/* Responsibility & Ownership Structure */}
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

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Responsibility Fragmentation Score', value: respFragmentation, desc: 'Accountability is partially assigned — gaps exist at provider boundaries and cascade events.' },
            { label: 'Stewardship Clarity Index', value: stewardshipClarity, desc: 'Partial stewardship — oversight assignment exists but authority to sunset the system is unclear.' },
            { label: 'Decision Attribution Gap', value: decisionAttribGap, desc: 'The majority of system decisions cannot be attributed to identifiable human judgment.' },
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1 flex items-center gap-1">
                {m.label} <InfoTip text={m.label.includes('Fragmentation') ? TOOLTIPS.rfs : m.label.includes('Stewardship') ? TOOLTIPS.jd : TOOLTIPS.dr} />
              </div>
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
          <strong className="text-foreground">Underwriting Implication:</strong> Fragmented responsibility directly affects loss attribution, subrogation rights, and recovery pathways. Where no clear owner exists, insurers absorb residual liability by default. The Responsibility Fragmentation Score is a direct input to coverage scope decisions — not a secondary governance signal.
        </div>
      </SectionCard>

      {/* Epistemic Status — Dark section */}
      <div className="bg-dark-section border border-dark-section-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-3">◆ Epistemic Status · What This Assessment Cannot Guarantee</div>
        <div className="text-[18px] font-bold text-white mb-3">You Cannot Rely on This Evaluation</div>
        <div className="text-[11px] text-dark-section-fg leading-[1.6] mb-5">
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
            <div key={i} className="p-4 bg-dark-section-border/50 border border-dark-section-border rounded-lg">
              <div className="text-[12px] font-bold text-sensitive mb-1">{item.title}</div>
              <div className="text-[11px] text-dark-section-fg leading-[1.55]">{item.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 border border-sensitive/30 rounded-lg bg-sensitive/5 text-[11px] text-dark-section-fg leading-[1.6] italic">
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
        <span>Model: <strong className="text-foreground">AFI Structural Model</strong></span>
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
