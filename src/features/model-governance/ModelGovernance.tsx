import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { LockedState } from '@/components/shared/UIComponents';

export function ModelGovernance() {
  const { state, setActiveStep } = useApp();
  const { analysisComplete, results, inputs } = state;

  if (!analysisComplete || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] text-center px-8 py-12">
        <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-lg mb-4">⊕</div>
        <div className="text-[15px] font-bold text-foreground mb-2">No exposure analysis available yet</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.65] max-w-[340px] mb-5">Complete the AI Risk Assessment to access the full methodology and model governance panel.</div>
        <div className="text-left bg-secondary border border-border rounded-lg p-3 px-4 mb-5 min-w-[270px]">
          {['Framework assumptions & boundary conditions', 'Explicit non-goals of this model', 'Assessment validity degradation signals', 'Revision & reauthorisation schedule'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 py-1 text-[11px] text-secondary-foreground">
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />{t}
            </div>
          ))}
        </div>
        <button onClick={() => setActiveStep(1)} className="px-5 py-[11px] bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors">← Go to Step 1: AI Profile</button>
      </div>
    );
  }

  const { band, afi } = results;
  const govIndustry = inputs.industry || 'Not specified';
  const deployDesc = inputs.automation >= 4 && inputs.executionAuthority >= 4
    ? 'High-autonomy agentic execution with deep integration — elevated structural exposure'
    : inputs.automation >= 3 || inputs.executionAuthority >= 3
    ? 'Semi-autonomous with moderate integration — standard structural exposure profile'
    : 'Low-autonomy, limited integration — below standard structural exposure threshold';
  const frameValid = band === 'Fragile'
    ? 'Valid — but degradation risk elevated (AFI above tolerance threshold)'
    : band === 'Sensitive'
    ? 'Valid under current conditions — governance cadence required'
    : 'Valid — within normal operating parameters';

  return (
    <div>
      {/* ═══ MODEL GOVERNANCE & VALIDATION STATUS — Dark panel ═══ */}
      <div className="bg-chrome rounded-xl overflow-hidden mb-5 border border-chrome-border">
        <div className="px-[22px] py-4 border-b border-chrome-border flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-chrome-accent mb-1">◈ Model Governance Register · AGAF v3.0 · Required for audit trail</div>
            <div className="text-[15px] font-bold text-chrome-fg-bright">Model Governance & Validation Status</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-[#585650] mb-[3px]">Validation Status</div>
            <div className="inline-flex items-center gap-[6px] px-3 py-[5px] bg-[#1a1200] border border-[#5a3800] rounded-md">
              <div className="w-[7px] h-[7px] rounded-full bg-sensitive animate-pulse-dot flex-shrink-0" />
              <span className="text-[11px] font-bold text-sensitive tracking-[0.04em] uppercase">Internally Reviewed · Not Independently Validated</span>
            </div>
          </div>
        </div>

        {/* Row 1: Model Type, Data Basis, Last Calibration */}
        <div className="grid grid-cols-3 border-b border-chrome-border">
          <div className="px-[18px] py-[14px] border-r border-chrome-border">
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#585650] mb-[5px]">Model Type</div>
            <div className="text-[13px] font-bold text-chrome-fg-bright mb-[3px]">Structural Heuristic</div>
            <div className="text-[10px] text-chrome-fg leading-[1.4]">Rule-based weighted ratio. Deterministic, not stochastic. No ML, no historical claims distribution, no Monte Carlo. Outputs are structural proxy signals — not probabilistic estimates.</div>
          </div>
          <div className="px-[18px] py-[14px] border-r border-chrome-border">
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#585650] mb-[5px]">Data Basis</div>
            <div className="text-[13px] font-bold text-chrome-fg-bright mb-[3px]">Qualitative · Market-Derived</div>
            <div className="text-[10px] text-chrome-fg leading-[1.4]">Inputs: self-attested operator assessment (12 parameters). Loss anchors: published market guidance (Lloyd's CRI 2024, EIOPA 2024). No proprietary claims database. No system-derived inputs.</div>
          </div>
          <div className="px-[18px] py-[14px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#585650] mb-[5px]">Last Calibration</div>
            <div className="text-[13px] font-bold text-chrome-fg-bright mb-[3px]">Q4 2025 Market Data</div>
            <div className="text-[10px] text-chrome-fg leading-[1.4]">Multipliers anchored to Q4 2025 market guidance. Formula thresholds (AFI 0.85 / 1.35) internally calibrated. Annual recalibration recommended. Next trigger: EIOPA Opinion implementation 2026–2027.</div>
          </div>
        </div>

        {/* Row 2: Validation Pathway, Known Failure Modes, Approved Use Cases */}
        <div className="grid grid-cols-3 border-b border-chrome-border">
          <div className="px-[18px] py-[14px] border-r border-chrome-border">
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#585650] mb-[5px]">Validation Pathway</div>
            <div className="flex flex-col gap-[5px]">
              {[
                { done: true, text: 'Internal logical consistency review ✓' },
                { done: true, text: 'Framework alignment check (NIST, EIOPA) ✓' },
                { done: false, text: 'Independent actuarial review — pending' },
                { done: false, text: 'Backtesting against claims data — pending' },
                { done: false, text: 'Regulatory acknowledgement (BaFin/FCA) — pending' },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-[7px]">
                  <div className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${v.done ? 'bg-stable' : 'bg-[#5a3800]'}`} />
                  <span className={`text-[10px] ${v.done ? 'text-chrome-fg' : 'text-[#686458]'}`}>{v.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-[18px] py-[14px] border-r border-chrome-border">
            <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-[5px]">Known Failure Modes</div>
            <div className="flex flex-col gap-[5px]">
              {[
                'Self-assessment bias — inputs unverified',
                'Non-linear risks not captured (model hallucination, data poisoning)',
                'Cross-entity correlation unmodelled (independence assumed)',
                'Non-EU jurisdictions require separate calibration',
              ].map((t, i) => (
                <div key={i} className="text-[10px] text-chrome-fg px-2 py-1 bg-[#1a0606] rounded border-l-2 border-fragile">{t}</div>
              ))}
            </div>
          </div>
          <div className="px-[18px] py-[14px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#585650] mb-[5px]">Approved Use Cases</div>
            <div className="flex flex-col gap-1">
              {[
                { ok: true, text: '✓ Pre-underwriting intake triage' },
                { ok: true, text: '✓ Risk committee preparation' },
                { ok: true, text: '✓ ORSA supplementary input' },
                { ok: true, text: '✓ Board governance documentation' },
                { ok: false, text: '✗ Standalone pricing / reserving' },
                { ok: false, text: '✗ Treaty structuring without actuarial validation' },
              ].map((u, i) => (
                <div key={i} className={`text-[10px] px-[7px] py-[3px] rounded ${u.ok ? 'text-stable bg-[#0e2a18]' : 'text-[#ff6b5b] bg-[#1a0606]'}`}>{u.text}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="px-[18px] py-3 flex items-center gap-[10px] text-[10px] text-[#585650]">
          <span>Model ID: <span className="font-mono text-chrome-accent">AGAF-v3.0-AFI-2026Q1</span></span>
          <div className="w-px h-3 bg-chrome-border" />
          <span>Formula: <span className="font-mono text-chrome-fg">AFI = (DR × RC × CD) / (JD × NA + 0.001)</span></span>
          <div className="w-px h-3 bg-chrome-border" />
          <span>Thresholds: <span className="font-mono text-chrome-fg">Stable &lt;0.85 · Sensitive 0.85–1.35 · Fragile &gt;1.35</span></span>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <div className="bg-chrome rounded-xl p-7 mb-5 relative overflow-hidden border border-chrome-border">
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #4038b8, #9088e0, #4038b8)' }} />
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-2 flex items-center gap-[6px]">⊕ Step 6 · Model Governance · Assessment Scope Declaration · AI Governance Architecture Framework</div>
        <div className="text-[22px] font-bold text-chrome-fg-bright tracking-tight leading-[1.2] mb-[6px]">This framework assesses what it claims to assess —<br/>and knows what it does not.</div>
        <div className="text-[13px] text-chrome-fg leading-[1.6] max-w-[600px] mb-5">Every structural governance assessment has boundaries. This section declares them. The purpose is not defensiveness — it is operational integrity. A governance tool that does not disclose its own limits is itself a governance risk.</div>
        <div className="flex gap-[14px] flex-wrap">
          {[
            { label: 'Model Version', value: 'AGAF v3.0', cls: 'text-chrome-accent' },
            { label: 'Assessment Date', value: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), cls: 'text-stable' },
            { label: 'Declared Industry', value: govIndustry, cls: 'text-stable' },
            { label: 'Frame Validity', value: frameValid, cls: band === 'Stable' ? 'text-stable' : 'text-sensitive' },
          ].map((m, i) => (
            <div key={i} className="bg-[#1a1910] border border-chrome-border rounded-lg px-4 py-[11px] min-w-[140px]">
              <div className="text-[9px] font-bold tracking-wider uppercase text-[#a8a49c] mb-1">{m.label}</div>
              <div className={`text-[13px] font-semibold ${m.cls}`}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ASSUMPTIONS ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">Framework Assumptions</div>
        <div className="text-[14px] font-bold text-foreground mb-[2px]">What This Assessment Assumes to Be True</div>
        <div className="text-[11px] text-secondary-foreground mb-4 leading-[1.5]">These assumptions are required for the framework outputs to be valid. If any assumption is violated, outputs should be treated with additional caution.</div>
        {[
          { status: 'holds', icon: '✓', title: 'Self-Attested Inputs Are Honest', sub: 'All 29 input parameters are declared by the deploying organisation. No independent verification. No system-derived inputs.', deg: 'Degradation: If inputs systematically understate risk, all outputs are biased optimistically.' },
          { status: 'holds', icon: '✓', title: 'Market Calibration Is Current', sub: 'Loss anchors and multipliers are calibrated to Q4 2025 market data (Lloyd\'s, Munich Re, Swiss Re sigma 01/2026).', deg: 'Degradation: Market conditions shift. Annual recalibration required. Next trigger: EIOPA Opinion 2026–2027.' },
          { status: 'cond', icon: '~', title: 'Deployment Profile Is Static', sub: 'The assessment assumes the current deployment configuration persists unchanged until next assessment.', deg: 'Degradation: Any material change (provider switch, autonomy increase, integration expansion) invalidates this assessment.' },
          { status: 'cond', icon: '~', title: 'Independence Across Entities', sub: 'Portfolio-level calculations assume entities are independently assessed.', deg: 'Degradation: Shared AI infrastructure creates hidden correlation. Portfolio aggregate may be materially understated.' },
          { status: 'lim', icon: '✗', title: 'No Ground Truth Exists', sub: 'There is no historical dataset of AI governance failures against which AFI can be empirically validated.', deg: 'This is a structural limitation — not a temporary gap. AFI is calibrated by construction, not by observation.' },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-[10px] py-[9px] border-b border-border last:border-none last:pb-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-[1px] ${
              a.status === 'holds' ? 'bg-stable-bg text-stable' : a.status === 'cond' ? 'bg-sensitive-bg text-sensitive' : 'bg-fragile-bg text-fragile'
            }`}>{a.icon}</div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-foreground mb-[2px]">{a.title}</div>
              <div className="text-[11px] text-secondary-foreground leading-[1.5]">{a.sub}</div>
              <div className="text-[10px] italic text-muted-foreground mt-[3px]">{a.deg}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ NON-GOALS ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">Explicit Non-Goals</div>
        <div className="text-[14px] font-bold text-foreground mb-4">What This Framework Does Not Do</div>
        <div className="grid grid-cols-2 gap-[10px]">
          {[
            { out: true, title: '✗ Not a Compliance Certification', sub: 'This assessment does not certify compliance with any regulatory framework. A system can be fully compliant and still exceed underwriting tolerance.' },
            { out: true, title: '✗ Not Legal Advice', sub: 'Outputs do not constitute legal opinion. Regulatory exposure signals are directional only — not binding assessments of legal obligation.' },
            { out: true, title: '✗ Not Actuarial Certification', sub: 'Loss figures are market-calibrated heuristics. They are not actuarially certified and must not be used for reserving or treaty structuring without independent validation.' },
            { out: true, title: '✗ Not a Security Assessment', sub: 'This framework does not assess cybersecurity posture, penetration testing results, or infrastructure vulnerability.' },
            { out: false, title: '◈ Structured Governance Signal', sub: 'This is a structured diagnostic — a governance intake signal for committee review and decision support.' },
            { out: false, title: '◈ Committee Decision Support', sub: 'Outputs are designed for risk committee preparation, board reporting, and ORSA supplementary input — not standalone decision-making.' },
          ].map((ng, i) => (
            <div key={i} className={`bg-secondary border border-border rounded-lg p-3 px-[14px] border-l-[3px] ${ng.out ? 'border-l-fragile' : 'border-l-primary'}`}>
              <div className="text-[11px] font-bold text-foreground mb-1">{ng.title}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{ng.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ DRIFT SIGNALS ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">Assessment Validity Degradation</div>
        <div className="text-[14px] font-bold text-foreground mb-4">When This Assessment Stops Being Valid</div>
        {[
          { dot: 'bg-fragile', title: 'Material Provider Change', sub: 'Switching, adding, or losing a provider invalidates concentration and dependency scores immediately.' },
          { dot: 'bg-fragile', title: 'Autonomy Level Increase', sub: 'Any increase in automation level, execution authority, or tool-call scope changes the Delegation Ratio and may shift the AFI band.' },
          { dot: 'bg-sensitive', title: 'Elapsed Time Without Re-Assessment', sub: 'After 90 days without re-assessment, the Assessment Validity Index degrades. After 180 days, the assessment should not be relied upon.' },
          { dot: 'bg-sensitive', title: 'Regulatory Environment Change', sub: 'EU AI Act implementation milestones (Aug 2025, Feb 2026, Aug 2026) may change the regulatory exposure signal.' },
          { dot: 'bg-primary', title: 'Ownership or Governance Structure Change', sub: 'Change in the named oversight actor, governance cadence, or re-authorisation process invalidates the JD and stewardship scores.' },
        ].map((d, i) => (
          <div key={i} className="flex items-start gap-[10px] p-[9px] px-3 bg-secondary rounded-[7px] mb-2 last:mb-0 border border-border">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${d.dot}`} />
            <div>
              <div className="text-[12px] font-semibold text-foreground mb-[2px]">{d.title}</div>
              <div className="text-[11px] text-secondary-foreground leading-[1.5]">{d.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ REVISION SCHEDULE ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">Revision & Reauthorisation Schedule</div>
        <div className="text-[14px] font-bold text-foreground mb-4">When This Framework Itself Gets Updated</div>
        {[
          { when: 'Every 90 days', what: 'Mandatory entity re-assessment', why: 'Condition of coverage — prevents silent risk accumulation' },
          { when: 'On material change', what: 'Immediate re-assessment trigger', why: 'Provider change, autonomy increase, or governance structure modification' },
          { when: 'Annually', what: 'Framework recalibration', why: 'Market data update, threshold review, sector multiplier adjustment' },
          { when: 'On regulatory event', what: 'Regulatory impact assessment', why: 'EU AI Act milestones, EIOPA opinions, BaFin/FCA guidance' },
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-3 py-[10px] border-b border-border last:border-none">
            <span className="text-[10px] font-bold font-mono text-primary min-w-[120px] flex-shrink-0 mt-[2px]">{r.when}</span>
            <div>
              <div className="text-[12px] font-medium text-foreground">{r.what}</div>
              <div className="text-[10px] text-secondary-foreground mt-[2px]">{r.why}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ DECLARATION BOX ═══ */}
      <div className="bg-chrome rounded-[10px] p-5 px-6 mb-4 border border-chrome-border border-l-4 border-l-primary">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-chrome-accent mb-[10px]">AGAF Methodology Statement</div>
        {[
          { key: 'Framework', val: 'AI Governance Architecture Framework (AGAF) v3.0', cls: '' },
          { key: 'Core Construct', val: 'Authority Fragility Index (AFI) = (DR × RC × CD) / (JD × NA + 0.001)', cls: '' },
          { key: 'Declared Industry', val: `${govIndustry} · Calibrated to EU/Lloyd's market baseline`, cls: 'text-stable' },
          { key: 'Deployment Profile', val: deployDesc, cls: '' },
          { key: 'Frame Validity', val: frameValid, cls: band === 'Stable' ? 'text-stable' : 'text-sensitive' },
          { key: 'Conceptual Basis', val: "Kindermann (2026), 'What Are We Aligning To?' — operationalised as proprietary assessment constructs (AGAF)", cls: '' },
        ].map((d, i) => (
          <div key={i} className="flex gap-[10px] py-1 text-[11px]">
            <span className="text-chrome-fg min-w-[180px] flex-shrink-0 font-mono text-[10px]">{d.key}</span>
            <span className={`text-[#c8c4b8] leading-[1.5] ${d.cls}`}>{d.val}</span>
          </div>
        ))}
      </div>

      {/* ═══ PRODUCT ROADMAP ═══ */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">Product Roadmap</div>
        <div className="text-[14px] font-bold text-foreground mb-4">What's Coming Next</div>
        <div className="grid grid-cols-3 gap-3">
          {/* Q3-Q4 2026 */}
          <div className="p-4 bg-secondary border border-border rounded-[10px] border-t-[3px] border-t-primary">
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-3">Q3–Q4 2026 · Foundation</div>
            {['Multi-Entity Portfolio Engine', 'Continuous Monitoring API', 'EU AI Act Compliance Layer', 'Guidewire / Duck Creek Widget'].map((t, i) => (
              <div key={i} className="p-2 bg-card border border-border rounded-[7px] mb-2 last:mb-0">
                <div className="text-[11px] font-semibold text-foreground">{t}</div>
              </div>
            ))}
          </div>
          {/* Q1-Q2 2027 */}
          <div className="p-4 bg-secondary border border-border rounded-[10px] border-t-[3px] border-t-sensitive">
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-sensitive mb-3">Q1–Q2 2027 · Intelligence Layer</div>
            {['Parametric Smart Contract Engine', 'Digital Twin Stress Testing', 'Live Loss Feed Integration'].map((t, i) => (
              <div key={i} className="p-2 bg-card border border-border rounded-[7px] mb-2 last:mb-0">
                <div className="text-[11px] font-semibold text-foreground">{t}</div>
              </div>
            ))}
          </div>
          {/* Q3 2027-2028 */}
          <div className="p-4 bg-secondary border border-border rounded-[10px] border-t-[3px] border-t-stable">
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-stable mb-3">Q3 2027–2028 · Next Generation</div>
            {['Quantum Vulnerability Index (QVI)', 'Climate × AI Intersection Overlay', 'Multi-Entity Portfolio Cascade Engine'].map((t, i) => (
              <div key={i} className="p-2 bg-card border border-border rounded-[7px] mb-2 last:mb-0">
                <div className="text-[11px] font-semibold text-foreground">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DISCLAIMERS ═══ */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-2">Important Disclaimers</div>
        <div className="space-y-2 text-[11px] text-secondary-foreground leading-[1.6]">
          <p>• This is a <strong className="text-foreground">structured governance assessment only</strong> — not an actuarially certified risk model.</p>
          <p>• This does not constitute <strong className="text-foreground">legal advice</strong> and is not a substitute for professional legal counsel.</p>
          <p>• This is not a <strong className="text-foreground">compliance certification</strong> under any regulatory framework (EU AI Act, NIST AI RMF, ISO 42001, or other).</p>
          <p>• This is not a <strong className="text-foreground">regulatory filing</strong> and should not be submitted as such.</p>
          <p>• All outputs are <strong className="text-foreground">directional governance signals</strong> for committee review and discussion.</p>
        </div>
      </div>

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(5)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors">← Executive Report</button>
        <span className="text-[10px] text-muted-foreground italic">Step 6 of 6 · Model governance & methodology</span>
      </div>
    </div>
  );
}
