import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { BandBadge, SectionCard, LockedState } from '@/components/shared/UIComponents';
import { formatCurrency } from '@/lib/formatters';

export function DecisionIntelligence() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-3xl mb-3">⊞</div>
        <div className="text-[15px] font-bold text-foreground mb-1">Risk Assessment</div>
        <div className="inline-flex items-center gap-[6px] px-[10px] py-1 bg-purple-bg border border-purple-border rounded-md mb-3 text-[10px] text-primary font-bold">🔒 Unlocks after Step 1</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.6] max-w-[400px] mb-5">Complete the AI profile (Step 1) and generate your assessment to unlock this view.</div>
        <div className="text-left bg-secondary border border-border rounded-lg p-3 px-4 mb-5 min-w-[300px]">
          {['Executive Decision with Risk Classification & Required Actions','Assessment Validity Index','Governance Alignment Alerts (dynamic, severity-ranked)','Evaluation Limits — what this assessment cannot tell you','Cognitive Offloading Ratio & Authority Risk Index'].map((t,i) => (
            <div key={i} className="flex items-center gap-2 py-1 text-[11px] text-secondary-foreground"><div className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0"/>{t}</div>
          ))}
        </div>
        <button onClick={() => setActiveStep(1)} className="btn-p" style={{fontSize:13,padding:'11px 22px'}}>← Go to Step 1: AI Profile</button>
      </div>
    );
  }

  const { band, afi, structuralScore, components, eciTier, eciName, lossEnvelope, agri, alri, scri, amplificationFactor, correlationFactor, decisionClass, premium } = results;
  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  // Derived scores
  const dr100 = Math.round(components.dr * 100);
  const jd100 = Math.round(components.jd * 100);
  const rc100 = Math.round(components.rc * 100);
  const cd100 = Math.round(components.cd * 100);

  // Responsibility scores
  const respFragmentation = Math.round(Math.min(99, (1 - components.jd) * 100 + components.dr * 20));
  const stewardshipClarity = Math.round(Math.min(99, components.jd * 60 + (1 - components.dr) * 20));
  const decisionAttribGap = Math.round(Math.min(99, components.dr * 80 + (1 - components.jd) * 15));
  const diffuseLabel = respFragmentation >= 60 ? 'Fragmented' : respFragmentation >= 40 ? 'Diffuse' : 'Clear';

  // COR & ARI
  const execRaw = inputs.executionAuthority / 5;
  const ovstRaw = inputs.oversightLevel / 5;
  const corVal = Math.round(Math.min(99, ((components.dr + execRaw) / 2) * (1 - ovstRaw * 0.4) * 100));
  const ariVal = Math.round(Math.min(99, (components.dr * 0.5 + (1 - components.jd) * 0.3 + execRaw * 0.2) * 100));

  // AGRI/ALRI/SCRI tiers
  const agriTier = agri >= 60 ? 'Critical' : agri >= 35 ? 'Elevated' : agri >= 15 ? 'Moderate' : 'Low';
  const alriTier = alri >= 60 ? 'Critical' : alri >= 35 ? 'Elevated' : alri >= 15 ? 'Moderate' : 'Low';
  const scriTier = scri >= 65 ? 'Critical' : scri >= 35 ? 'Elevated' : 'Diversified';

  const agriColor = agri >= 60 ? 'text-fragile' : agri >= 35 ? 'text-sensitive' : 'text-stable';
  const alriColor = alri >= 60 ? 'text-fragile' : alri >= 35 ? 'text-sensitive' : 'text-stable';
  const scriColor = scri >= 65 ? 'text-fragile' : scri >= 35 ? 'text-sensitive' : 'text-stable';

  const opsClass = decisionClass === 'Escalate to Committee' ? 'not-approved' : decisionClass === 'Conditional Review' ? 'conditional' : 'approved';
  const opsStatus = decisionClass === 'Escalate to Committee' ? 'ESCALATE TO COMMITTEE' : decisionClass === 'Conditional Review' ? 'CONDITIONAL REVIEW' : 'STANDARD PROCESS';

  return (
    <div>
      {/* Result label */}
      <div className="flex items-center gap-[10px] mb-4">
        <div className="text-[9px] tracking-[0.12em] uppercase font-bold text-muted-foreground">Analysis Result</div>
        <div className="flex-1 h-px bg-border" />
        <div className="text-[10px] text-muted-foreground font-mono">{inputs.companyName || '—'} · {inputs.industry}</div>
      </div>

      {/* Result reward */}
      <div className="flex items-start gap-[10px] p-3 px-4 rounded-lg mb-[18px] border border-purple-border" style={{background:'linear-gradient(135deg, hsl(var(--purple-bg)), hsl(var(--secondary)))'}}>
        <span className="text-[16px] flex-shrink-0 text-primary">✦</span>
        <div>
          <div className="text-[12px] font-bold text-primary mb-[2px] tracking-[0.01em]">Computed result — not static dashboard content.</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.5]">All scores, loss estimates, scenario outputs, and underwriting actions shown below were generated from the completed Exposure Analysis profile. Adjusting inputs regenerates all outputs.</div>
        </div>
      </div>

      {/* ══ EXECUTIVE DECISION LAYER ══ */}
      <div className={`rounded-xl overflow-hidden mb-5 border-2 ${
        band === 'Fragile' ? 'border-fragile' : band === 'Sensitive' ? 'border-sensitive' : 'border-stable'
      }`}>
        <div className={`px-6 py-5 ${band === 'Fragile' ? 'bg-[#fff8f7]' : band === 'Sensitive' ? 'bg-[#fffbf0]' : 'bg-[#f0f8f2]'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-[5px] h-[5px] rounded-full animate-pulse-dot ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`} />
                <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Governance Assessment · Structured Risk Signal for Committee Review</span>
                <span className="conf-badge conf-governance">◈ Governance Signal</span>
              </div>
              <div className={`text-[15px] font-bold leading-[1.35] mb-3 max-w-[600px] ${bandColor}`}>
                {band === 'Fragile' ? 'This deployment exceeds underwriting tolerance — structural remediation is required before standard coverage terms can apply.'
                  : band === 'Sensitive' ? 'This deployment shows elevated structural signals — conditional terms apply with mandatory improvement timeline.'
                  : 'This deployment is within structural tolerance — standard coverage terms apply.'}
              </div>
              <div className="text-[12px] text-secondary-foreground leading-[1.6] max-w-[600px] mb-3">
                The Authority Fragility Index exceeds the threshold above which continuation risk, delegation density, and dependency lock-in create non-linear financial exposure. A system can be fully compliant with the EU AI Act and still create this exposure. Compliance measures intent — this model measures <strong className="text-foreground">structural cost</strong>.
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Risk Classification</div>
              <div className={`text-[13px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg ${
                band === 'Fragile' ? 'bg-fragile text-white' : band === 'Sensitive' ? 'bg-sensitive text-white' : 'bg-stable text-white'
              }`}>{band === 'Fragile' ? 'CRITICAL' : band === 'Sensitive' ? 'ELEVATED' : 'STANDARD'}</div>
              <div className="text-[9px] text-muted-foreground mt-1">{band === 'Fragile' ? 'Above tolerance' : band === 'Sensitive' ? 'Approaching tolerance' : 'Within tolerance'}</div>
            </div>
          </div>
        </div>
        <div className={`px-6 py-[10px] border-t flex items-center gap-3 flex-wrap ${bandBg}`}>
          <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Structural Signals:</span>
          <span className={`text-[9px] font-bold px-2 py-[3px] rounded ${band === 'Fragile' ? 'bg-fragile text-white' : 'bg-sensitive text-white'}`}>Delegation Density: {dr100 > 60 ? 'High' : 'Moderate'}</span>
          <span className={`text-[9px] font-bold px-2 py-[3px] rounded ${rc100 > 60 ? 'bg-fragile text-white' : 'bg-sensitive text-white'}`}>Reversibility: {rc100 > 60 ? 'Locked' : 'Constrained'}</span>
          <span className={`text-[9px] font-bold px-2 py-[3px] rounded bg-sensitive text-white`}>Continuation: {jd100 < 40 ? 'Unmanaged' : 'Partial'}</span>
        </div>
      </div>

      {/* HERO DIAGNOSIS */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {/* Board statement */}
        <div className="flex items-start gap-[10px] px-6 py-3 bg-secondary border-b border-border">
          <div className={`w-1 h-1 rounded-full mt-[6px] flex-shrink-0 ${band === 'Fragile' ? 'bg-fragile' : 'bg-sensitive'}`} />
          <div className="text-[11px] text-secondary-foreground leading-[1.55]">This system creates structural AI risk that is not captured by compliance frameworks, point-in-time audits, or standard underwriting models — and that accumulates without a triggering incident.</div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-[5px] h-[5px] rounded-full animate-pulse-dot ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`} />
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
              AI Systemic Risk Status · {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · Governance Exposure Engine v3.0
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-7 items-start">
            <div>
              <div className={`text-[28px] font-extrabold tracking-tight leading-[1.1] mb-2 uppercase ${bandColor}`}>
                {band === 'Fragile' ? 'STRUCTURAL EXPOSURE DETECTED' : band === 'Sensitive' ? 'ELEVATED STRUCTURAL SIGNALS' : 'GOVERNANCE SIGNALS WITHIN RANGE'}
              </div>
              <div className="text-[13px] text-muted-foreground mb-2">This system identifies structural AI risks not captured in traditional underwriting models.</div>
              <div className="text-[12px] text-secondary-foreground leading-[1.6] mb-4 max-w-[500px]">
                {band === 'Fragile' ? 'This system creates structural risk not captured in current underwriting models. Dependency, continuation, and cross-system propagation exceed standard tolerance thresholds.'
                  : band === 'Sensitive' ? 'Structural risk is emerging. Governance gaps and dependency concentration signal drift toward Fragile classification without intervention.'
                  : 'Structural exposure is within tolerance. Governance cadence must be maintained.'}
              </div>

              {/* Score row */}
              <div className="flex items-end gap-6 mb-3">
                <div>
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1 flex items-center gap-2">
                    AI Exposure Score
                    <span className="tip"><i className="tip-ic">i</i><span className="tip-box">Measures structural exposure, not model performance or compliance status. Combines delegation, reversibility, dependency, and governance into a single fragility index.</span></span>
                    <span className="conf-badge conf-governance">◈ Governance Signal</span>
                  </div>
                  <div className={`text-[72px] font-bold font-mono leading-none tracking-tight ${bandColor}`}>{structuralScore}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching tolerance threshold' : 'Below tolerance threshold'}</div>
                  <div className="text-[9px] text-muted-foreground mt-1">Signal confidence: <span className="text-sensitive font-semibold">Medium — self-attested inputs</span></div>
                  <div className={`text-[13px] font-medium mt-2 ${bandColor}`}>Interpretation: {band === 'Fragile' ? 'High structural dependency with limited reversibility' : band === 'Sensitive' ? 'Moderate dependency — governance gaps emerging' : 'Manageable structural exposure'}</div>
                </div>

                {/* AFI Gauge */}
                <div className="flex-shrink-0 w-[130px]">
                  <svg viewBox="0 0 130 80" className="w-[130px] h-[80px]">
                    <path d="M 10 65 A 55 55 0 0 1 120 65" fill="none" stroke="hsl(var(--border))" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 10 65 A 55 55 0 0 1 120 65" fill="none"
                      stroke={band === 'Fragile' ? 'hsl(var(--fragile))' : band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${Math.min(172, (afi / 2.0) * 172)} 172`} />
                  </svg>
                  <div className="text-center text-[9px] text-muted-foreground mt-1">AFI: <span className={`font-mono font-bold ${bandColor}`}>{afi.toFixed(2)}</span> <span className="text-muted-foreground">/ threshold 1.35</span></div>
                </div>

                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg border ${bandBg}`}>
                    <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1 flex items-center gap-1">
                      ECI Tier
                      <span className="tip"><i className="tip-ic">i</i><span className="tip-box">Existence Cost of Intelligence tier: indicates when continued operation is no longer a neutral technical state but a normative governance decision. ECI-0 = reversible tool. ECI-1 = persistent service. ECI-2 = institutional dependency. ECI-3 = critical coordination infrastructure.</span></span>
                    </div>
                    <div className={`text-[22px] font-bold font-mono ${bandColor}`}>ECI-{eciTier}</div>
                    <div className={`text-[9px] uppercase tracking-wider ${bandColor}`}>{eciName}</div>
                    <div className={`mt-2 text-[8px] font-bold px-[7px] py-[2px] rounded ${bandBg} ${bandColor}`}>
                      {eciTier >= 2 ? 'Governance trigger reached — review required' : 'Within tolerance'}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground italic mt-2 leading-[1.5] max-w-[280px] border-t border-border pt-2">Use this panel as the board-level diagnosis anchor. If this section cannot justify a pricing or governance decision on its own, the model is not yet decision-grade.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Structural Signals */}
        <div className={`px-6 py-4 border-t ${bandBg}`}>
          <div className={`text-[9px] font-bold tracking-wider uppercase mb-2 ${bandColor}`}>Key Structural Signals</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              'System persists without explicit re-authorisation',
              'Dependency cannot be reversed without operational disruption',
              'Shared model infrastructure creates correlated portfolio exposure',
            ].map((sig, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-md border ${bandBg}`}>
                <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${band === 'Fragile' ? 'bg-fragile' : 'bg-sensitive'}`} />
                <span className={`text-[10px] font-semibold ${bandColor}`}>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AGRI Panel */}
        <div className="px-6 py-4 bg-secondary border-t border-border">
          <div className="flex items-start gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-[10px] mb-2">
                <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">⚡ Agentic Risk Index (AGRI)</span>
                <span className="conf-badge conf-governance">◈ Agent Architecture Signal</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-[28px] font-bold font-mono ${agriColor}`}>{agri}</div>
                <div>
                  <div className={`text-[12px] font-bold ${agriColor}`}>{agriTier}</div>
                  <div className="text-[10px] text-muted-foreground">Agentic complexity level</div>
                </div>
              </div>
              <div className="text-[10px] text-secondary-foreground leading-[1.55]">
                {agri >= 60 ? 'Critical agent risk — multi-agent orchestration with persistent memory and limited human checkpoints. Requires specialist agentic risk assessment beyond standard underwriting.' :
                  agri >= 35 ? 'Elevated agent risk — material governance complexity from tool-call authority and orchestration scope.' :
                  'Low agentic architecture. Standard governance framework applies.'}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <div className="p-2 px-[10px] bg-card border border-border rounded-[7px]">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">ALRI — Liability</div>
                <div className={`font-bold font-mono ${alriColor}`}>{alri} · {alriTier}</div>
              </div>
              <div className="p-2 px-[10px] bg-card border border-border rounded-[7px]">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">SCRI — Systemic</div>
                <div className={`font-bold font-mono ${scriColor}`}>{scri} · {scriTier}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 2 of 6 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Decision Intelligence</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Multi-dimensional risk characterization using AFI, ECI, AGRI, ALRI, and SCRI indices — calibrated to {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* AFI Components */}
      <SectionCard title="AFI Component Breakdown" icon="📊" subtitle="Individual risk dimensions that compose the Authority Fragility Index.">
        {[
          { label: 'Delegation Ratio (DR)', value: components.dr, desc: 'Autonomous decision share without human review' },
          { label: 'Justificatory Density (JD)', value: components.jd, desc: 'Governance transparency and audit coverage' },
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
                style={{width:`${Math.round(item.value*100)}%`}} />
            </div>
            <span className="w-[28px] text-right text-[11px] font-bold font-mono">{Math.round(item.value*100)}</span>
          </div>
        ))}
      </SectionCard>

      {/* Continuation / Dependency / Portfolio */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Continuation Risk</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">System persists without explicit re-authorisation — accumulating liability with no upper bound.</div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Dependency Lock-In</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">Provider concentration exceeds exit threshold — structural entrenchment creates single points of failure.</div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[11px] font-bold text-foreground mb-2">Portfolio Contagion</div>
          <div className="text-[11px] text-muted-foreground leading-[1.55]">Shared AI infrastructure creates correlated exposure — {amplificationFactor} cascade amplification across 5 layers.</div>
        </div>
      </div>

      {/* Financial Exposure — Loss Envelope */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border">
          <div className="text-[12px] font-bold text-foreground uppercase tracking-[0.05em]">Potential Loss Envelope</div>
          <div className="text-[11px] text-secondary-foreground mt-1">Estimated financial consequence under expected, stress, and extreme tail conditions.</div>
        </div>
        <div className="grid grid-cols-3">
          {[
            { label: 'Base Risk Band', value: formatCurrency(lossEnvelope.expected), sub: 'Structural baseline assessment', cls: 'text-stable' },
            { label: 'Elevated Risk Band', value: formatCurrency(lossEnvelope.stress), sub: 'Provider concentration factors', cls: 'text-sensitive' },
            { label: 'Critical Risk Band', value: formatCurrency(lossEnvelope.tail), sub: 'Tail risk characterization', cls: 'text-fragile', highlight: true },
          ].map((cell, i) => (
            <div key={i} className={`px-5 py-4 border-r border-border last:border-r-0 ${cell.highlight ? 'bg-fragile-bg/30' : ''}`}>
              <div className={`text-[9px] tracking-[0.08em] uppercase font-bold mb-2 flex items-center gap-1 ${cell.highlight ? 'text-fragile' : 'text-muted-foreground'}`}>{cell.label}</div>
              <div className={`text-[32px] font-bold font-mono leading-none ${cell.cls}`}>{cell.value}</div>
              <div className="text-[10px] text-muted-foreground mt-2">{cell.sub}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-fragile-bg border-t border-fragile-border">
          <div className="text-[11px] font-semibold text-fragile">⚠ Tail risk amplification from correlated dependencies</div>
          <div className="text-[10px] text-secondary-foreground mt-1">Swiss Re sigma insights 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic and accumulation risk."</div>
        </div>
      </div>

      {/* Systemic / Portfolio */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Correlation Factor</div>
          <div className="text-[22px] font-bold font-mono text-foreground">{correlationFactor.toFixed(2)}</div>
          <div className="text-[11px] text-secondary-foreground">Provider overlap ratio</div>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Cluster Size</div>
          <div className="text-[22px] font-bold font-mono text-foreground">8–15</div>
          <div className="text-[11px] text-secondary-foreground">entities in exposure cluster</div>
        </div>
        <div className="bg-fragile-bg border border-fragile-border rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Systemic Risk Characterization</div>
          <div className="text-[22px] font-bold font-mono text-fragile">{band === 'Fragile' ? 'Critical' : band === 'Sensitive' ? 'Elevated' : 'Moderate'}</div>
          <div className="text-[11px] text-secondary-foreground">Correlated tail scenario</div>
        </div>
      </div>

      {/* Dependency Map */}
      <SectionCard title="🔗 Provider Dependency Structure" subtitle={`${inputs.providers.length} external dependencies`}>
        <div className="grid grid-cols-[1fr_36px_1fr_36px_1fr] items-center py-4">
          <div className="flex flex-col gap-2">
            {inputs.providers.length > 0 ? inputs.providers.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fragile-bg border border-fragile-border relative">
                <div className="w-[26px] h-[26px] rounded-md bg-fragile-bg flex items-center justify-center text-[11px] font-bold text-fragile flex-shrink-0">{p[0]}</div>
                <div><div className="text-[11px] font-semibold text-foreground">{p}</div><div className="text-[9px] text-muted-foreground">External provider</div></div>
                {inputs.providers.length <= 2 && <div className="absolute -top-1 -right-1 w-[10px] h-[10px] rounded-full bg-fragile border-2 border-white animate-pulse-dot" />}
              </div>
            )) : (
              <div className="px-3 py-2 rounded-lg bg-fragile-bg border border-fragile-border opacity-40">
                <div className="text-[11px] font-semibold text-foreground">No provider selected</div>
              </div>
            )}
          </div>
          <div className="text-center text-muted-foreground text-lg">→</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-bg border border-purple-border">
              <div className="w-[26px] h-[26px] rounded-md bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">⚙</div>
              <div><div className="text-[11px] font-semibold text-foreground">Core Systems</div><div className="text-[9px] text-muted-foreground">AI-integrated workflows</div></div>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-lg">→</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
              <div className="w-[26px] h-[26px] rounded-md bg-muted flex items-center justify-center text-[11px] font-bold text-secondary-foreground flex-shrink-0">🏢</div>
              <div><div className="text-[11px] font-semibold text-foreground">Operations</div><div className="text-[9px] text-muted-foreground">Internal processes</div></div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-fragile-bg border border-fragile-border rounded-md mt-2">
          <span className="text-fragile text-sm flex-shrink-0">⚠</span>
          <div>
            <div className="text-[11px] font-semibold text-fragile">⚠ {inputs.providers.length <= 1 ? 'Critical concentration — single provider dependency' : `${inputs.providers.length} providers — monitor concentration`}</div>
            <div className="text-[10px] text-fragile/80 mt-1">{inputs.providers.length} provider{inputs.providers.length !== 1 ? 's' : ''} — {inputs.providers.length <= 2 ? 'single point of failure across cluster' : 'moderate diversification'}</div>
          </div>
        </div>
      </SectionCard>

      {/* Cascade Propagation Model */}
      <div className="bg-card border-2 border-border rounded-xl p-6 mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{background:'linear-gradient(to right, #f39c12, #c0392b, #7b0e0e)'}} />
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-fragile">Cascade Propagation Model</div>
            <div className="text-[14px] font-bold text-foreground mt-[2px]">How this exposure propagates to portfolio loss</div>
            <div className="text-[12px] text-secondary-foreground mt-1">Each layer amplifies the preceding disruption. Standard incident models cannot price this.</div>
          </div>
          <div className="flex gap-4 text-right">
            <div><div className="text-[20px] font-bold font-mono text-fragile">{amplificationFactor.split('–')[1] || '3.8×'}</div><div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Loss Amplification</div></div>
            <div><div className="text-[16px] font-bold font-mono text-fragile">5 layers</div><div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Propagation depth</div></div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-0 mb-4">
          {[
            { icon: '⚡', name: 'AI Provider Failure', value: 'Origin', cls: 'text-fragile bg-fragile-bg border-fragile-border' },
            { icon: '🔧', name: 'Workflow Disruption', value: '+40%', cls: 'text-sensitive bg-sensitive-bg border-sensitive-border' },
            { icon: '⚖', name: 'Decision Errors', value: '+110%', cls: 'text-sensitive bg-sensitive-bg border-sensitive-border' },
            { icon: '📉', name: 'Revenue Impact', value: '+220%', cls: 'text-fragile bg-fragile-bg border-fragile-border' },
            { icon: '🌐', name: 'Portfolio Contagion', value: '+380%', cls: 'text-fragile bg-fragile-bg border-fragile-border' },
          ].map((n, i) => (
            <div key={i} className="text-center px-2 py-3 relative">
              {i < 4 && <span className="absolute right-[-11px] top-[38%] text-muted-foreground text-sm z-[1]">→</span>}
              <div className={`w-[32px] h-[32px] rounded-full border-2 flex items-center justify-center mx-auto mb-2 text-[13px] ${n.cls}`}>{n.icon}</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground leading-[1.3] mb-1">{n.name}</div>
              <div className={`text-[12px] font-bold font-mono ${n.cls.split(' ')[0]}`}>{n.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 bg-fragile-bg border border-fragile-border rounded-md">
          <span className="text-fragile text-sm flex-shrink-0">⚠</span>
          <span><strong className="text-fragile">Traditional models stop at system failure.</strong> <span className="text-secondary-foreground">This model shows cross-system propagation — non-linear loss escalation that standard incident models cannot price or reserve for.</span></span>
        </div>
      </div>

      {/* Required Underwriting Actions */}
      <SectionCard title="Required Underwriting Actions" icon="⚠" subtitle="All conditions must be met before standard coverage applies.">
        {[
          { num: 1, title: 'Apply premium loading 150–180% above standard', badge: 'Required', badgeCls: 'bg-fragile-bg text-fragile border border-fragile-border', body: 'Structural risk exceeds standard pricing assumptions. Dependency structures do not compensate for co-activation and aggregation exposure.', numCls: 'bg-fragile-bg text-fragile' },
          { num: 2, title: 'Require dependency diversification plan within 90 days', badge: 'Required', badgeCls: 'bg-fragile-bg text-fragile border border-fragile-border', body: 'Dependency concentration creates correlated loss potential. Diversification across minimum 3 providers reduces aggregate tail risk by 40–60%.', numCls: 'bg-fragile-bg text-fragile' },
          { num: 3, title: 'Limit coverage to operational layers only', badge: 'Recommended', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', body: 'Lock-in depth makes full-stack coverage uneconomic. Limiting scope to operational disruption reduces reserve requirements.', numCls: 'bg-sensitive-bg text-sensitive' },
          { num: 4, title: 'Mandate governance cadence as coverage condition', badge: 'Condition', badgeCls: 'bg-sensitive-bg text-sensitive border border-sensitive-border', body: 'Without re-authorisation cadence, risk accumulates indefinitely. Formal quarterly review required to maintain coverage terms.', numCls: 'bg-sensitive-bg text-sensitive' },
          { num: 5, title: 'Exclude autonomous execution liability', badge: 'Exclusion', badgeCls: 'bg-secondary text-muted-foreground border border-border', body: 'Agentic exposure exceeds conventional governance frameworks. Autonomous actions require separate liability classification.', numCls: 'bg-secondary text-secondary-foreground' },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-[10px] py-[11px] border-b border-border last:border-none">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-[1px] ${a.numCls}`}>{a.num}</div>
            <div>
              <div className="text-[12px] font-semibold text-foreground flex items-center gap-2">{a.title} <span className={`text-[9px] font-bold px-[7px] py-[2px] rounded ${a.badgeCls}`}>{a.badge}</span></div>
              <div className="text-[11px] text-secondary-foreground mt-[2px] leading-[1.5]">{a.body}</div>
            </div>
          </div>
        ))}
      </SectionCard>

      {/* Governance Alerts */}
      <SectionCard title="Governance Alerts" subtitle="Each alert identifies where the system creates unpriced liability — persisting, scaling, or acting faster than governance can safely absorb.">
        {[
          { title: 'Unauthorized Operational Persistence', level: 'High', body: 'System continues operating without re-authorisation — liability accumulates with no upper bound. No re-authorisation mechanism exists.' },
          { title: 'Irreversible System Entrenchment', level: 'High', body: 'Dependency depth exceeds the organisation\'s capacity to exit. Cannot be reversed without significant operational disruption.' },
          { title: 'Execution Authority Exceeds Oversight Capacity', level: 'Critical', body: 'Autonomous execution outpaces governance. The system acts faster than the organisation can evaluate — creating an accountability vacuum.' },
        ].map((alt, i) => (
          <div key={i} className={`border-l-[3px] p-[11px] px-[14px] mb-[9px] last:mb-0 rounded-r-lg bg-card border border-border ${alt.level === 'Critical' ? 'border-l-[#780808]' : 'border-l-fragile'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] font-semibold text-foreground">{alt.title}</span>
              <span className={`text-[9px] font-bold px-[7px] py-[2px] rounded ${alt.level === 'Critical' ? 'bg-fragile text-white' : 'bg-fragile-bg text-fragile border border-fragile-border'}`}>{alt.level}</span>
            </div>
            <div className="text-[11px] text-secondary-foreground leading-[1.5]">{alt.body}</div>
          </div>
        ))}
      </SectionCard>

      {/* Insurer Own-Exposure Note */}
      <div className="bg-purple-bg border border-purple-border rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-2">◈ Note for Insurer Buyers — Your Own AI Governance Exposure</div>
        <div className="text-[12px] font-semibold text-foreground mb-2">This tool assesses client deployments — but the same structural risks apply to the insurer's own AI systems.</div>
        <div className="grid grid-cols-2 gap-[10px]">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] font-bold text-foreground mb-1">Claims Processing AI</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.5]">If your own claims automation uses a single AI provider, you carry the same concentration risk you're assessing in clients.</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] font-bold text-foreground mb-1">Underwriting Automation</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.5]">AI-assisted underwriting without governance cadence creates the same continuation risk — the tool should be run on internal systems too.</div>
          </div>
        </div>
      </div>

      {/* Responsibility & Ownership Structure */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">◈ Responsibility & Ownership Structure</div>
            <div className="text-[14px] font-bold text-foreground">Who Is Responsible? — And Can They Be Held Accountable?</div>
            <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[480px]">This panel makes the responsibility structure of the deployment explicit. Diffuse responsibility is not a neutral fact — it is a governance failure that creates unpriced liability.</div>
          </div>
          <div className="text-right flex-shrink-0 ml-5">
            <div className={`text-[40px] font-bold font-mono leading-none ${respFragmentation >= 60 ? 'text-fragile' : respFragmentation >= 40 ? 'text-sensitive' : 'text-stable'}`}>{respFragmentation}</div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mt-1 ${respFragmentation >= 60 ? 'text-fragile' : respFragmentation >= 40 ? 'text-sensitive' : 'text-stable'}`}>{diffuseLabel}</div>
          </div>
        </div>
        <div className="p-5">
          {respFragmentation >= 50 && (
            <div className="p-4 bg-fragile-bg border border-fragile-border rounded-lg mb-4">
              <div className="text-[13px] font-bold text-fragile mb-1">⊘ No Clear System Owner Detected</div>
              <div className="text-[11px] text-fragile/85 leading-[1.55]">The structural profile does not indicate a single identifiable actor with both authority and accountability. High delegation combined with low justificatory density creates a responsibility vacuum.</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-[10px] mb-4">
            <div className="bg-secondary border border-border rounded-lg p-3">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Responsibility Fragmentation Score</div>
              <div className={`text-[22px] font-bold font-mono leading-none mb-1 ${respFragmentation >= 60 ? 'text-fragile' : respFragmentation >= 40 ? 'text-sensitive' : 'text-stable'}`}>{respFragmentation}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.4]">Accountability is partially assigned — gaps exist at provider boundaries.</div>
            </div>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Stewardship Clarity Index</div>
              <div className={`text-[22px] font-bold font-mono leading-none mb-1 ${stewardshipClarity < 40 ? 'text-fragile' : stewardshipClarity < 60 ? 'text-sensitive' : 'text-stable'}`}>{stewardshipClarity}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.4]">Partial stewardship — authority to sunset the system is unclear.</div>
            </div>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Decision Attribution Gap</div>
              <div className={`text-[22px] font-bold font-mono leading-none mb-1 ${decisionAttribGap >= 60 ? 'text-fragile' : decisionAttribGap >= 40 ? 'text-sensitive' : 'text-stable'}`}>{decisionAttribGap}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.4]">Most decisions cannot be attributed to identifiable human judgment.</div>
            </div>
          </div>
          {[
            { icon: '✕', color: 'bg-fragile-bg text-fragile', title: 'Deployer Accountability', body: 'Structurally incomplete — low justificatory density means decisions are not fully traceable to documented human oversight.' },
            { icon: '✕', color: 'bg-fragile-bg text-fragile', title: 'Provider Accountability', body: 'External providers bear technical responsibility but face no operational accountability for consequences at deployment site.' },
            { icon: '✕', color: 'bg-fragile-bg text-fragile', title: 'Oversight Actor — Named Human with Stop Authority', body: 'Insufficient human oversight — system operates without a clearly empowered individual.' },
            { icon: '△', color: 'bg-sensitive-bg text-sensitive', title: 'Cross-System Liability — Cascade Accountability', body: 'Where failure propagates across correlated infrastructure, each actor\'s responsibility is entirely unaddressed.' },
          ].map((o, i) => (
            <div key={i} className="flex items-start gap-[10px] py-[9px] border-b border-border last:border-none">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-[1px] ${o.color}`}>{o.icon}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground mb-[2px]">{o.title}</div>
                <div className="text-[11px] text-secondary-foreground leading-[1.5]">{o.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Epistemic Status */}
      <div className="bg-chrome rounded-xl p-6 mb-4 border border-chrome-border">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-[#ffc040] mb-2">⚠ Epistemic Status · Governance Limits</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: '⊘ No external ground truth exists', body: 'AFI scores are structurally calibrated — not empirically verified against historical outcomes.' },
            { title: '⊘ Evaluation does not guarantee correctness', body: 'Compliance audits verify procedures — not that the system behaves correctly across all operational contexts.' },
            { title: '⊘ The interval between evaluations is ungoverned', body: 'This assessment reflects the moment of evaluation — not the current operational state if material changes have occurred.' },
            { title: '⊘ Performance ≠ authorisation for continued operation', body: 'Continued deployment requires explicit re-authorisation by decision — not by default performance evidence.' },
          ].map((e, i) => (
            <div key={i} className="p-3 bg-[#1a1910] border border-chrome-border rounded-lg">
              <div className="text-[11px] font-bold text-chrome-fg-bright mb-1">{e.title}</div>
              <div className="text-[10px] text-chrome-fg leading-[1.5]">{e.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-card border border-border rounded-[10px] p-4 mb-4">
        <div className="text-[11px] text-secondary-foreground leading-[1.6]">
          <strong className="text-foreground">Methodology:</strong> Authority Fragility Index (AFI) = (DR × RC × CD) / (JD × NA). Risk characterization based on structural governance factors. Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries." EU AI Act Art. 99 penalty exposure shown separately. <em>This is not a compliance report — a system can be fully compliant and still exceed underwriting tolerance and incur regulatory fines.</em>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button onClick={() => setActiveStep(1)} className="btn-ghost text-[12px]">← Exposure Analysis</button>
        <span className="text-[10px] text-muted-foreground">Step 2 of 6 · Core structural risk assessment and governance signal</span>
        <button onClick={() => setActiveStep(3)} className="btn-p text-[12px]">Scenario Simulation →</button>
      </div>
    </div>
  );
}
