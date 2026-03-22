import React from 'react';
import { useApp } from '@/hooks/useAppState';

export function ModelGovernanceComplete() {
  const { state } = useApp();
  const { analysisComplete } = state;

  if (!analysisComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl text-muted-foreground mb-4">⊕</div>
        <div className="text-[15px] font-bold text-foreground mb-2">No exposure analysis available yet</div>
        <div className="text-[12px] text-secondary-foreground max-w-md mb-6">Complete the AI Risk Assessment to access the full methodology and model governance panel.</div>
        <div className="grid grid-cols-2 gap-3 mb-6 text-left max-w-md">
          <div className="flex items-start gap-2 text-[11px] text-secondary-foreground"><span className="text-primary">◈</span>Framework assumptions &amp; boundary conditions</div>
          <div className="flex items-start gap-2 text-[11px] text-secondary-foreground"><span className="text-primary">◈</span>Explicit non-goals of this model</div>
          <div className="flex items-start gap-2 text-[11px] text-secondary-foreground"><span className="text-primary">◈</span>Assessment validity degradation signals</div>
          <div className="flex items-start gap-2 text-[11px] text-secondary-foreground"><span className="text-primary">◈</span>Revision &amp; reauthorisation schedule</div>
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event('show-exposure-form'))}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
        >
          ← Go to Step 1: AI Profile
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">Step 6 of 6 · Governance Documentation</div>
        <div className="text-[22px] font-bold text-foreground tracking-tight mb-1">Model Governance</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.6] max-w-[600px]">
          Methodology, assumptions, epistemic boundaries, and regulatory alignment.
          Required for audit trail and independent validation.
        </div>
      </div>

      <AGAFMethodologyStatement />
      <AssessmentScopeDeclaration />
      <CalibrationParameters />
      <ModelGovernanceRegister />
      <MethodologyDeepDive />
      <EpistemicLimitations />
      <RegulatoryAlignment />
      <ResearchFoundation />
      <CompetitivePositioning />
      <ProductRoadmap />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MODEL GOVERNANCE REGISTER
// ═══════════════════════════════════════════════════════════════════

function ModelGovernanceRegister() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-5 pb-4 flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Model Governance Register · AGAF v3.0 · Required for audit trail</div>
          <div className="text-[15px] font-bold text-foreground">Model Governance &amp; Validation Status</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Validation Status</div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sensitive animate-pulse" />
            <span className="text-[10px] font-bold text-sensitive">Internally Reviewed · Not Independently Validated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 border-t border-border">
        <div className="p-4 border-r border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Model Type</div>
          <div className="text-[13px] font-bold text-foreground mb-1">Structural Heuristic</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.5]">
            Rule-based weighted ratio. Deterministic, not stochastic. No ML, no historical claims distribution,
            no Monte Carlo. Outputs are structural proxy signals — not probabilistic estimates.
          </div>
        </div>
        <div className="p-4 border-r border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Data Basis</div>
          <div className="text-[13px] font-bold text-foreground mb-1">Qualitative · Market-Derived</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.5]">
            Inputs: self-attested operator assessment (12 parameters). Loss anchors: published market guidance
            (Lloyd's CRI 2024, EIOPA 2024). No proprietary claims database. No system-derived inputs.
          </div>
        </div>
        <div className="p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Last Calibration</div>
          <div className="text-[13px] font-bold text-foreground mb-1">Q4 2025 Market Data</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.5]">
            Multipliers anchored to Q4 2025 market guidance. Formula thresholds (AFI 0.85 / 1.35) internally
            calibrated. Annual recalibration recommended. Next trigger: EIOPA Opinion implementation 2026–2027.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 border-t border-border">
        <div className="p-4 border-r border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Validation Pathway</div>
          <div className="flex flex-col gap-1.5">
            <ValidationItem done text="Internal logic review complete" />
            <ValidationItem done text="Parameter sensitivity tested" />
            <ValidationItem done={false} text="Independent actuarial review" />
            <ValidationItem done={false} text="External academic peer review" />
            <ValidationItem done={false} text="Empirical backtesting (requires loss data)" />
          </div>
        </div>
        <div className="p-4 border-r border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Known Failure Modes</div>
          <div className="flex flex-col gap-1.5">
            <FailureMode text="Self-assessment bias in input data" />
            <FailureMode text="No real-time drift detection" />
            <FailureMode text="Static snapshot — not continuous monitoring" />
            <FailureMode text="Unmodelled portfolio cascade effects" />
          </div>
        </div>
        <div className="p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Approved Use Cases</div>
          <div className="flex flex-col gap-1.5">
            <ApprovedUse approved text="Pre-underwriting intake triage" />
            <ApprovedUse approved text="Risk committee preparation" />
            <ApprovedUse approved text="ORSA supplementary signal" />
            <ApprovedUse approved={false} text="Standalone pricing decisions" />
            <ApprovedUse approved={false} text="Regulatory filing" />
            <ApprovedUse approved={false} text="Binding capital allocation" />
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-sensitive" />
        <span className="text-[9px] text-muted-foreground">
          Last updated: Q4 2025 · Next calibration trigger: EIOPA Opinion implementation (est. Q3 2026)
        </span>
      </div>
    </div>
  );
}

function ValidationItem({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className={done ? 'text-stable' : 'text-muted-foreground'}>{done ? '✓' : '○'}</span>
      <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{text}</span>
    </div>
  );
}

function FailureMode({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-[10px] text-secondary-foreground">
      <span className="text-fragile mt-px">⊘</span>
      <span className="leading-[1.4]">{text}</span>
    </div>
  );
}

function ApprovedUse({ approved, text }: { approved: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className={approved ? 'text-stable' : 'text-fragile'}>{approved ? '✓' : '✗'}</span>
      <span className={approved ? 'text-foreground' : 'text-muted-foreground'}>{text}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// METHODOLOGY DEEP DIVE
// ═══════════════════════════════════════════════════════════════════

function MethodologyDeepDive() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
        Methodology Deep Dive · AFI Formula Breakdown
      </div>

      <div className="bg-chrome rounded-lg p-4 mb-4 text-center">
        <div className="text-[18px] font-bold font-mono text-chrome-fg-bright tracking-wide">
          AFI = (DR × RC × CD) / (JD × NA)
        </div>
        <div className="text-[10px] text-chrome-fg-muted mt-1">
          Authority Fragility Index — Structural Governance Stability Metric
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        <ComponentCard label="DR" name="Delegation Ratio" value="0–1" desc="How much decision authority is transferred to AI systems" />
        <ComponentCard label="JD" name="Justificatory Density" value="0–1" desc="Frequency and depth of human oversight and review" />
        <ComponentCard label="RC" name="Reversibility Cost" value="0–1" desc="Cost and difficulty of reverting AI-driven decisions" />
        <ComponentCard label="CD" name="Correlation Density" value="0–1" desc="Degree of system interconnection and dependency" />
        <ComponentCard label="NA" name="Normalisation Anchor" value="0.5 (fixed)" desc="Baseline calibration constant for cross-entity comparison" />
      </div>

      <div className="bg-secondary/50 border border-border rounded-lg p-4">
        <div className="text-[10px] font-bold text-foreground mb-2">Interpretation Thresholds</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold font-mono text-stable w-28">AFI &lt; 0.85</span>
            <span className="text-[10px] text-secondary-foreground">Stable · Standard underwriting applies</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold font-mono text-sensitive w-28">0.85 ≤ AFI &lt; 1.35</span>
            <span className="text-[10px] text-secondary-foreground">Sensitive · Premium loading 110–130%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold font-mono text-fragile w-28">AFI ≥ 1.35</span>
            <span className="text-[10px] text-secondary-foreground">Fragile · Premium loading 150–180%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentCard({ label, name, value, desc }: { label: string; name: string; value: string; desc: string }) {
  return (
    <div className="bg-chrome rounded-lg p-3 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className="text-[14px] font-bold font-mono text-primary">{label}</span>
        <span className="text-[9px] text-chrome-fg-muted">·</span>
        <span className="text-[9px] text-chrome-fg">{name}</span>
      </div>
      <div className="text-[9px] text-chrome-fg-muted mb-1">Range: {value}</div>
      <div className="text-[9px] text-chrome-fg-muted leading-[1.3]">{desc}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EPISTEMIC LIMITATIONS
// ═══════════════════════════════════════════════════════════════════

function EpistemicLimitations() {
  const limitations = [
    { title: "No external ground truth exists", text: "for AI governance fragility. AFI scores are structurally calibrated — not empirically verified against historical outcomes." },
    { title: "Evaluation does not guarantee correctness.", text: "Compliance audits verify procedures — not that the system behaves correctly across all operational contexts." },
    { title: "The interval between evaluations is ungoverned.", text: "This assessment reflects the moment of evaluation — not the current operational state if material changes have occurred." },
    { title: "Performance ≠ authorisation for continued operation.", text: "Continued deployment requires explicit re-authorisation by decision — not by default performance evidence." },
    { title: "Model drift is not captured in real-time.", text: "Behavioral changes between assessments accumulate unobserved. Static snapshots cannot track dynamic alignment decay." },
    { title: "Dependency on self-reported inputs.", text: "No independent verification. Operator bias and incomplete knowledge affect all downstream outputs." },
    { title: "Portfolio cascade effects are unmodelled.", text: "Multi-entity correlated exposure requires data not available in single-entity assessment." },
    { title: "Regulatory frameworks are in flux.", text: "EU AI Act enforcement begins 2026–2027. Framework assumptions may require recalibration." },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">
        Epistemic Status · Governance Limits
      </div>
      <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-4 max-w-[700px]">
        The AFI model operates under structural constraints inherent to AI governance assessment.
        These are not bugs — they are fundamental limitations of assessing systems whose behavior
        is emergent and continuously changing.
      </div>
      <div className="grid grid-cols-2 gap-3">
        {limitations.map((lim, i) => (
          <div key={i} className="text-[10px] text-secondary-foreground leading-[1.5] p-3 bg-secondary/30 rounded-lg">
            <span className="text-fragile mr-1">⊘</span>
            <strong className="text-foreground">{lim.title}</strong> {lim.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REGULATORY ALIGNMENT
// ═══════════════════════════════════════════════════════════════════

function RegulatoryAlignment() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
        Regulatory Alignment Map · Framework Grounding
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-chrome border border-chrome-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold">EU</div>
            <div>
              <div className="text-[11px] font-bold text-chrome-fg-bright">EU AI Act 2024/1689</div>
              <div className="text-[9px] text-chrome-fg-muted">Enforcement begins 2026–2027</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-[10px]">
            <RegItem article="Art. 26" text="High-risk AI system obligations" />
            <RegItem article="Art. 27" text="Fundamental Rights Impact Assessment (FRIA)" />
            <RegItem article="Art. 72" text="Post-market monitoring requirements" />
            <RegItem article="Art. 99" text="Penalty framework (€35M or 7% global revenue)" />
          </div>
        </div>

        <div className="bg-chrome border border-chrome-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-sensitive/20 border border-sensitive/40 flex items-center justify-center text-sensitive text-xs font-bold">EP</div>
            <div>
              <div className="text-[11px] font-bold text-chrome-fg-bright">EIOPA Opinion August 2025</div>
              <div className="text-[9px] text-chrome-fg-muted">AI in Insurance Supervision</div>
            </div>
          </div>
          <div className="text-[10px] text-chrome-fg leading-[1.5] mb-2">
            "Proportionality principle requires risk-based governance approach tailored to AI system
            characteristics rather than one-size-fits-all compliance checklists."
          </div>
          <div className="text-[9px] text-chrome-fg-muted">Referenced in AFI framework design · Proportional risk assessment</div>
        </div>

        <div className="bg-chrome border border-chrome-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-stable/20 border border-stable/40 flex items-center justify-center text-stable text-xs font-bold">US</div>
            <div>
              <div className="text-[11px] font-bold text-chrome-fg-bright">NIST AI RMF 1.0</div>
              <div className="text-[9px] text-chrome-fg-muted">Risk Management Framework</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-[10px]">
            {['GOVERN: Governance structures', 'MAP: Context establishment', 'MEASURE: Assessment & benchmarking', 'MANAGE: Risk response actions'].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-stable" />
                <span className="text-chrome-fg">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-chrome border border-chrome-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-fragile/20 border border-fragile/40 flex items-center justify-center text-fragile text-xs font-bold">SR</div>
            <div>
              <div className="text-[11px] font-bold text-chrome-fg-bright">Swiss Re sigma 01/2026</div>
              <div className="text-[9px] text-chrome-fg-muted">AI Insurance Market Guidance</div>
            </div>
          </div>
          <div className="text-[10px] text-chrome-fg leading-[1.5] mb-3">
            "AI introduces emerging risk dimensions that do not fit neatly within traditional
            insurance boundaries. Provider concentration and continuation governance require new
            underwriting frameworks."
          </div>
          <div className="text-[9px] text-chrome-fg-muted">
            Lloyd's CRI 2024 · Munich Re AI Underwriting Framework 2024 · LMA E&O Guidelines 2025
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-stable/10 border border-stable/30 rounded-lg">
        <div className="text-[10px] font-bold text-stable mb-1.5 uppercase tracking-wide">Alignment Statement</div>
        <div className="text-[10px] text-secondary-foreground leading-[1.5]">
          AFI framework operationalises concepts from EU AI Act (continuation governance), NIST AI RMF
          (systematic assessment), EIOPA Opinion (proportionality), and Swiss Re sigma insights (emerging
          risk dimensions). The proprietary contribution is translating academic concepts into measurable
          governance signals for committee decision support.
        </div>
      </div>
    </div>
  );
}

function RegItem({ article, text }: { article: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-primary font-mono font-bold text-[9px] mt-0.5">{article}</div>
      <div className="text-chrome-fg leading-[1.4] flex-1">{text}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESEARCH FOUNDATION
// ═══════════════════════════════════════════════════════════════════

function ResearchFoundation() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
        Research Foundation · Academic Grounding
      </div>
      <div className="bg-chrome border border-chrome-border rounded-lg p-4 mb-4">
        <div className="text-[11px] font-bold text-chrome-fg-bright mb-2">
          Kindermann (2026) — AI Governance Architecture Framework (AGAF)
        </div>
        <div className="text-[10px] text-chrome-fg leading-[1.5] mb-3">
          Doctoral research on structural governance fragility in AI systems. Introduces concepts of
          Semantic Drift, Continuation Governance, and EU AI Act Blind Spots. Published framework
          identifies gaps in existing compliance approaches where systems can be compliant yet structurally
          ungoverned.
        </div>
        <div className="flex flex-wrap gap-2">
          {['Semantic Drift', 'Continuation Governance', 'Responsibility Fragmentation', '§5.2 Lock-in Patterns'].map(t => (
            <div key={t} className="px-2.5 py-1 bg-primary/15 border border-primary/30 rounded text-[9px] text-primary font-medium">{t}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ResearchCard title="OECD AI Principles" year="2024" contribution="Human-centric values, transparency requirements" />
        <ResearchCard title="ISO/IEC 42001" year="2023" contribution="AI Management System standard" />
        <ResearchCard title="IEEE P7000 Series" year="2021–2024" contribution="Ethics-based design standards" />
      </div>
      <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-wide">Proprietary IP Positioning</div>
        <div className="text-[10px] text-secondary-foreground leading-[1.5]">
          The academic concepts (continuation governance, semantic drift, responsibility collapse) are
          published research. The proprietary contribution is the operationalisation into six measurable
          constructs (AFI, ECI, MDR, RFSI, RFS, IAT) with defined thresholds, committee intake workflow,
          and structured underwriting signal generation. No competing product combines these into a single
          assessment flow.
        </div>
      </div>
    </div>
  );
}

function ResearchCard({ title, year, contribution }: { title: string; year: string; contribution: string }) {
  return (
    <div className="bg-chrome border border-chrome-border rounded-lg p-3">
      <div className="text-[11px] font-bold text-chrome-fg-bright mb-0.5">{title}</div>
      <div className="text-[9px] text-chrome-fg-muted mb-2">{year}</div>
      <div className="text-[10px] text-chrome-fg leading-[1.4]">{contribution}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPETITIVE POSITIONING
// ═══════════════════════════════════════════════════════════════════

function CompetitivePositioning() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
        Competitive Positioning · What This Engine Does Differently
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ComparisonCard
          title="vs. Standard Cyber Insurance"
          what="Traditional cyber/E&O policies"
          gap="Coverage designed for network breaches and professional negligence — not AI-specific structural risks"
          miss={["Continuation risk (system persists without re-authorisation)", "Provider concentration (cascade exposure)", "Responsibility fragmentation (unclear ownership)", "Behavioral drift (alignment decay between audits)"]}
          borderColor="border-fragile/30"
        />
        <ComparisonCard
          title="vs. Parametric AI Solutions"
          what="Munich Re aiSure, Armilla parametric triggers"
          gap="Event-triggered payouts without governance assessment layer"
          miss={["Pre-incident structural fragility assessment", "Governance posture baseline measurement", "Committee intake workflow integration", "Underwriting decision support signals"]}
          borderColor="border-sensitive/30"
        />
        <ComparisonCard
          title="vs. Compliance Audit Tools"
          what="EU AI Act compliance checklists, FRIA generators"
          gap="Binary compliance verification — not risk quantification"
          miss={["Compliance ≠ governance. A compliant system can be structurally fragile", "No premium loading recommendations", "No loss envelope estimation", "No underwriter decision support"]}
          borderColor="border-primary/30"
        />
        <ComparisonCard
          title="vs. Manual Underwriting"
          what="Traditional underwriter questionnaire review"
          gap="Subjective, non-systematic, high variance between underwriters"
          miss={["Reproducible scoring methodology", "Quantified fragility thresholds", "Structured governance constructs (AFI, MDR, RFSI)", "Scalable across portfolio"]}
          borderColor="border-blu/30"
        />
      </div>
      <div className="mt-4 p-4 bg-stable/10 border border-stable/30 rounded-lg">
        <div className="text-[11px] font-bold text-stable mb-2">This Engine's Unique Value Proposition</div>
        <div className="text-[10px] text-secondary-foreground leading-[1.6]">
          First tool to combine governance assessment (what traditional audits miss), structural fragility
          quantification (what parametric solutions lack), and underwriting decision support (what compliance
          tools don't provide) into a single committee intake workflow. Bridges the gap between "compliant
          but uninsurable" and "structured underwriting signal."
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ title, what, gap, miss, borderColor }: { title: string; what: string; gap: string; miss: string[]; borderColor: string }) {
  return (
    <div className={`bg-chrome border ${borderColor} rounded-lg p-4`}>
      <div className="text-[11px] font-bold text-chrome-fg-bright mb-1">{title}</div>
      <div className="text-[9px] text-chrome-fg-muted mb-2 italic">{what}</div>
      <div className="text-[10px] text-chrome-fg leading-[1.4] mb-3">
        <strong className="text-chrome-fg-bright">Coverage gap:</strong> {gap}
      </div>
      <div className="text-[9px] font-bold text-chrome-fg-muted mb-1.5 uppercase">What They Miss:</div>
      <div className="flex flex-col gap-1">
        {miss.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[10px] text-chrome-fg">
            <span className="text-fragile mt-0.5">⊘</span>
            <span className="leading-[1.4]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT ROADMAP
// ═══════════════════════════════════════════════════════════════════

function ProductRoadmap() {
  const roadmapQ3Q4_2026 = [
    { title: "SaaS Backend (FastAPI + PostgreSQL)", desc: "Multi-tenant, auth, audit log, API endpoints. Prerequisite for all enterprise sales. Without this, tool remains PoC." },
    { title: "Real-time Model Drift API", desc: "Connect to live AI system telemetry — output variance, confidence drift, performance degradation signals. Transforms static assessment into continuous monitoring." },
    { title: "Guidewire / Duck Creek Widget", desc: "API-first embedded widget for insurance platform integration. Underwriter sees AFI score without leaving their primary system." },
  ];
  const roadmapQ1Q2_2027 = [
    { title: "Parametric Smart Contract Engine", desc: "On-chain parametric triggers — when AFI crosses threshold, policy terms adjust automatically. Munich Re aiSure / Armilla-style implementation. Requires regulatory sandbox approval." },
    { title: "Digital Twin Stress Testing", desc: "Run client's AI system against 10,000 simulated Black Swan scenarios (Crowdstrike-style outages, mass hallucination events, cascade failures). Pre-bind stress testing for underwriters." },
    { title: "Live Loss Feed Integration", desc: "API connection to Swiss Re / Munich Re anonymised loss data for empirical AFI calibration and backtesting. Resolves the primary validation critique from actuarial review." },
  ];
  const roadmapQ3_2027_2028 = [
    { title: "Quantum Vulnerability Index (QVI)", desc: "Quantum-AI convergence risk: cryptographic break risk (Shor algorithm), quantum-ML adversarial attacks, post-quantum infrastructure exposure. Horizon: 2027–2028 per market consensus." },
    { title: "Climate × AI Intersection Overlay", desc: "Data centre temperature/energy stress scenarios × AI dependency. Swiss Re sigma 01/2026 identifies expanded energy infrastructure as new property/engineering asset class." },
    { title: "Multi-Entity Portfolio Cascade Engine", desc: "Full portfolio cascade simulation across 8–15 correlated entities with real Swiss Re/Munich Re data calibration. Resolves the primary quantitative validation gap identified by external actuarial review." },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">◈ Product Roadmap</div>
        <span className="text-[8px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded">2026–2028</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-5 max-w-[700px]">
        Items intentionally deferred from the current build. These require either empirical data,
        live API integrations, or regulatory clarity that does not yet exist. Target: enterprise
        SaaS version Q4 2026 – Q2 2027.
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-secondary border border-border rounded-lg border-t-[3px] border-t-primary">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-3">Q3–Q4 2026 · Infrastructure</div>
          <div className="flex flex-col gap-2">{roadmapQ3Q4_2026.map((item, i) => <RoadmapItem key={i} {...item} />)}</div>
        </div>
        <div className="p-4 bg-secondary border border-border rounded-lg border-t-[3px] border-t-sensitive">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-sensitive mb-3">Q1–Q2 2027 · Intelligence Layer</div>
          <div className="flex flex-col gap-2">{roadmapQ1Q2_2027.map((item, i) => <RoadmapItem key={i} {...item} />)}</div>
        </div>
        <div className="p-4 bg-secondary border border-border rounded-lg border-t-[3px] border-t-stable">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-stable mb-3">Q3 2027–2028 · Next Generation</div>
          <div className="flex flex-col gap-2">{roadmapQ3_2027_2028.map((item, i) => <RoadmapItem key={i} {...item} />)}</div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-card border border-border rounded-lg text-[10px] text-secondary-foreground leading-[1.6]">
        <strong className="text-foreground">Exit context:</strong> The current tool is positioned as a
        governance-heuristic PoC and sales/advisory instrument (est. value €1.5–2.0M as-is). Completion of
        Q3–Q4 2026 infrastructure items would move it into enterprise SaaS territory (€2.5–3.5M). Full Q1–Q2
        2027 intelligence layer with empirical backtesting addresses the primary actuarial validation critique
        and supports a €3.5–5.0M exit thesis.
      </div>
    </div>
  );
}

function RoadmapItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-2.5 bg-card border border-border rounded">
      <div className="text-[11px] font-semibold text-foreground mb-1">{title}</div>
      <div className="text-[9px] text-secondary-foreground leading-[1.4]">{desc}</div>
    </div>
  );
}
