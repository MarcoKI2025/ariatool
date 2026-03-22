import React from 'react';
import { useApp } from '@/hooks/useAppState';

export function ModelGovernanceComplete() {
  const { state, setActiveStep } = useApp();
  const { analysisComplete, results } = state;

  if (!analysisComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl text-muted-foreground mb-4">⊕</div>
        <div className="text-[15px] font-bold text-foreground mb-2">No exposure analysis available yet</div>
        <div className="text-[12px] text-secondary-foreground max-w-md mb-6">Complete the AI Risk Assessment to access the full methodology and model governance panel.</div>
        <div className="grid grid-cols-2 gap-3 mb-6 text-left max-w-md">
          {['Framework assumptions & boundary conditions', 'Explicit non-goals of this model', 'Assessment validity degradation signals', 'Revision & reauthorisation schedule'].map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-secondary-foreground"><span className="text-primary">◈</span>{t}</div>
          ))}
        </div>
        <button onClick={() => setActiveStep(1)} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">← Go to Step 1: AI Profile</button>
      </div>
    );
  }

  return (
    <div>
      <ModelGovernanceRegister />

      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">⊕ Step 6 · Model Governance · Assessment Scope Declaration · AI Governance Architecture Framework</div>
        <div className="text-[22px] font-bold text-foreground tracking-tight mb-1">This framework assesses what it claims to assess —<br/>and knows what it does not.</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.6] max-w-[700px]">
          Most risk tools give outputs without declaring assumptions. This panel makes the interpretive frame of the AI Exposure Engine explicit — the contexts in which assessments hold, the limits beyond which they degrade, and the conditions that would require revision. Based on "What Are We Aligning To?" (AGAF, Jan 2026).
        </div>
      </div>

      <AGAFMethodologyStatement />
      <AssessmentScopeDeclaration />
      <CalibrationParameters />
      <FrameworkAssumptions />
      <NonGoals />
      <MeaningDriftRegister />
      <RFSIPanel />
      <FDAPanel />
      <EvaluationLimitsPanel />
      <MethodologyWhitePaper />
      <EpistemicLimitations />
      <RegulatoryAlignment />
      <ResearchFoundation />
      <CompetitivePositioning />
      <APIIntegrationReference />
      <FrameworkRevisionSchedule />
      <ProductRoadmap />

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(5)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Executive Report</button>
        <span className="text-[10px] text-muted-foreground italic">Step 6 of 6 · Model governance & methodology</span>
        <span />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MODEL GOVERNANCE & VALIDATION STATUS (DARK PANEL)
// ═══════════════════════════════════════════════════════════════════

function ModelGovernanceRegister() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-[12px_14px] sm:p-[16px_22px] border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-1">◈ Model Governance Register · AGAF v3.0 · Required for audit trail</div>
          <div className="text-[15px] font-bold text-foreground">Model Governance & Validation Status</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-secondary-foreground mb-1">Validation Status</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-[5px] bg-sensitive-bg border border-sensitive-border rounded-md">
            <div className="w-[7px] h-[7px] rounded-full bg-sensitive animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-bold text-sensitive tracking-wide uppercase">Internally Reviewed · Not Independently Validated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-border">
        {[
          { label: 'Model Type', title: 'Structural Heuristic', desc: 'Rule-based weighted ratio. Deterministic, not stochastic. No ML, no historical claims distribution, no Monte Carlo. Outputs are structural proxy signals — not probabilistic estimates.' },
          { label: 'Data Basis', title: 'Qualitative · Market-Derived', desc: 'Inputs: self-attested operator assessment (12 parameters). Loss anchors: published market guidance (Lloyd\'s CRI 2024, EIOPA 2024). No proprietary claims database. No system-derived inputs.' },
          { label: 'Last Calibration', title: 'Q4 2025 Market Data', desc: 'Multipliers anchored to Q4 2025 market guidance. Formula thresholds (AFI 0.85 / 1.35) internally calibrated. Annual recalibration recommended. Next trigger: EIOPA Opinion implementation 2026–2027.' },
        ].map((item, i) => (
          <div key={i} className={`p-[14px_18px] ${i < 2 ? 'sm:border-r border-b sm:border-b-0 border-border' : ''}`}>
            <div className="text-[9px] font-bold tracking-wider uppercase text-secondary-foreground mb-[5px]">{item.label}</div>
            <div className="text-[13px] font-bold text-foreground mb-[3px]">{item.title}</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.4]">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-border">
        <div className="p-[14px_18px] sm:border-r border-b sm:border-b-0 border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-secondary-foreground mb-[5px]">Validation Pathway</div>
          <div className="flex flex-col gap-[5px]">
            {[
              { done: true, text: 'Internal logical consistency review ✓' },
              { done: true, text: 'Framework alignment check (NIST, EIOPA) ✓' },
              { done: false, text: 'Independent actuarial review — pending' },
              { done: false, text: 'Backtesting against claims data — pending' },
              { done: false, text: 'Regulatory acknowledgement (BaFin/FCA) — pending' },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-[7px]">
                <div className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${v.done ? 'bg-stable' : 'bg-sensitive'}`} />
                <span className={`text-[10px] ${v.done ? 'text-foreground' : 'text-muted-foreground'}`}>{v.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-[14px_18px] sm:border-r border-b sm:border-b-0 border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-[5px]">Known Failure Modes</div>
          <div className="flex flex-col gap-[5px]">
            {[
              'Self-assessment bias — inputs unverified',
              'Non-linear risks not captured (model hallucination, data poisoning)',
              'Cross-entity correlation unmodelled (independence assumed)',
              'Non-EU jurisdictions require separate calibration',
            ].map((f, i) => (
              <div key={i} className="text-[10px] text-foreground px-2 py-1.5 bg-fragile-bg rounded border-l-2 border-fragile">{f}</div>
            ))}
          </div>
        </div>
        <div className="p-[14px_18px]">
          <div className="text-[9px] font-bold tracking-wider uppercase text-secondary-foreground mb-[5px]">Approved Use Cases</div>
          <div className="flex flex-col gap-1">
            {[
              { ok: true, text: 'Pre-underwriting intake triage' },
              { ok: true, text: 'Risk committee preparation' },
              { ok: true, text: 'ORSA supplementary input' },
              { ok: true, text: 'Board governance documentation' },
              { ok: false, text: 'Standalone pricing / reserving' },
              { ok: false, text: 'Treaty structuring without actuarial validation' },
            ].map((u, i) => (
              <div key={i} className={`text-[10px] px-[7px] py-[3px] rounded ${u.ok ? 'text-stable bg-stable-bg' : 'text-fragile bg-fragile-bg'}`}>
                {u.ok ? '✓' : '✗'} {u.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-[14px] sm:px-[18px] py-3 flex flex-wrap items-center gap-[10px]">
        <div className="text-[10px] text-secondary-foreground">Model ID: <span className="font-mono text-primary">AGAF-v3.0-AFI-2026Q1</span></div>
        <div className="w-px h-3 bg-border" />
        <div className="text-[10px] text-secondary-foreground">Formula: <span className="font-mono text-secondary-foreground/80">AFI = (DR × RC × CD) / (JD × NA + 0.001)</span></div>
        <div className="w-px h-3 bg-border" />
        <div className="text-[10px] text-secondary-foreground">Thresholds: <span className="font-mono text-secondary-foreground/80">Stable &lt;0.85 · Sensitive 0.85–1.35 · Fragile &gt;1.35</span></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FRAMEWORK ASSUMPTIONS & BOUNDARY CONDITIONS
// ═══════════════════════════════════════════════════════════════════

function FrameworkAssumptions() {
  const assumptions = [
    { status: 'holds' as const, title: 'Single-entity assessment scope', desc: 'AFI is computed for one deployment profile at a time. Portfolio-level systemic risk characterization recognizes correlated exposure when entities share infrastructure, but does not quantitatively model inter-entity correlation dynamics directly.', degrade: 'Degrades when: entities share custom-trained models, proprietary fine-tuning, or non-standard integration architectures.' },
    { status: 'holds' as const, title: 'Structural risk is measurable through governance signals', desc: 'The AFI assumes that delegation, reversibility, correlation density, and oversight levels are the primary structural drivers of AI governance fragility — and that these can be approximated through operator self-assessment.', degrade: 'Degrades when: operator self-assessment is systematically biased, or when fragility arises from technical factors not captured by the 5 AFI components.' },
    { status: 'cond' as const, title: 'Risk characterization reflects structural governance factors', desc: 'Risk bands derived from AFI score, delegation depth, provider concentration, and continuation cost. Swiss Re sigma 01/2026: "AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries."', degrade: 'Degrades when: a major AI-related loss event reveals new risk categories not captured in current governance frameworks.' },
    { status: 'cond' as const, title: 'Reference frame is stable across deployment lifecycle', desc: 'The framework assumes that the deployment context described at input time remains representative of the system\'s actual operational state. Semantic drift, scope expansion, and recursive optimisation can change this without triggering a re-assessment.', degrade: 'Degrades when: the system has been operational for 24+ months, has undergone model updates without re-authorisation, or has expanded scope beyond original intended purpose.' },
    { status: 'lim' as const, title: 'Alignment claims are verifiable', desc: 'The AFI does not — and cannot — verify that the assessed system is "aligned" in any strong sense. There is no external ground truth for AI governance fragility. The score is a structural signal, not a safety certification.', degrade: 'This limitation is permanent and structural, not a gap to be closed by future calibration. "What Are We Aligning To?" (AGAF, Jan 2026) establishes this boundary formally.' },
  ];

  const iconMap = { holds: { icon: '✓', cls: 'bg-stable text-foreground' }, cond: { icon: '~', cls: 'bg-sensitive text-foreground' }, lim: { icon: '✗', cls: 'bg-fragile text-foreground' } };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Scope & Assumptions</div>
          <div className="text-[15px] font-bold text-foreground">Framework Assumptions & Boundary Conditions</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">Explicit assumptions under which AFI scores and loss estimates are valid. Each assumption has a degradation condition — the context in which it no longer holds.</div>
        </div>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-stable/10 text-stable border border-stable/30">Explicitly Declared</span>
      </div>
      <div className="space-y-3">
        {assumptions.map((a, i) => {
          const { icon, cls } = iconMap[a.status];
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${cls}`}>{icon}</div>
              <div>
                <div className="text-[11px] font-bold text-foreground mb-1">{a.title}</div>
                <div className="text-[10px] text-secondary-foreground leading-[1.5] mb-1">{a.desc}</div>
                <div className="text-[10px] text-sensitive/80 italic leading-[1.4]">{a.degrade}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXPLICIT NON-GOALS
// ═══════════════════════════════════════════════════════════════════

function NonGoals() {
  const nonGoals = [
    { title: 'AI Model Performance Assessment', desc: 'This framework does not measure accuracy, hallucination rates, bias, or technical model quality. A high-performing model can have a high AFI. These dimensions are orthogonal.' },
    { title: 'EU AI Act Compliance Determination', desc: 'AFI is not a compliance score. A system can be fully compliant with all EU AI Act obligations and still score Fragile. Compliance governs use — this framework governs structural dependency.' },
    { title: 'Actuarial Loss Certification', desc: 'Loss figures are market-calibrated estimates, not actuarially certified. They support underwriting decisions — not formal actuarial reserving methodology.' },
    { title: 'Individual Incident Attribution', desc: 'The framework measures structural exposure — not incident probability. It cannot predict when or where a failure will occur, only how fragile the governance structure is.' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">§9.3 · Constraint Spaces</div>
          <div className="text-[15px] font-bold text-foreground">Explicit Non-Goals of This Framework</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">Domains where this framework does not optimise and should not be extrapolated. Formalising non-goals reduces the risk of over-extension into ill-defined domains.</div>
        </div>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/30">Formally Declared</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nonGoals.map((ng, i) => (
          <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
            <div className="text-[11px] font-bold text-foreground mb-1"><span className="text-fragile mr-1">✗</span>{ng.title}</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.5]">{ng.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MEANING DRIFT REGISTER (MDR)
// ═══════════════════════════════════════════════════════════════════

function MeaningDriftRegister() {
  const { state } = useApp();
  const { results } = state;
  if (!results) return null;

  const { mdr, mdrTier, mdrLabel } = results;
  const mdrColor = mdr >= 0.6 ? 'text-fragile' : mdr >= 0.35 ? 'text-sensitive' : 'text-stable';

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">§5.1 · Behavioral Alignment Decay</div>
          <div className="text-[15px] font-bold text-foreground">Meaning Drift Register (MDR)</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">Behavioral Alignment Decay: the gradual reconfiguration of a system's operational priorities under sustained autonomous execution, such that effective behavior diverges from original governance intent without producing detectable compliance violations.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className={`text-[28px] font-bold font-mono ${mdrColor}`}>{mdr.toFixed(2)}</div>
          <div className={`text-[10px] font-bold ${mdrColor}`}>{mdrLabel}</div>
        </div>
      </div>

      {/* Consequence Externalization */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="text-[9px] font-bold tracking-wider uppercase text-primary mb-2">§8 · Consequence Externalization — Root Cause of Drift</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.55] mb-[6px]">
          AGAF §8 identifies consequence externalization as the structural root beneath behavioral alignment decay: when the costs of reinterpretation are fully absorbed by rollback, retraining, and governance intervention, <em className="text-foreground">interpretation becomes cheap</em>. The system has no internal incentive to preserve stable governance alignment.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <div className="bg-secondary border border-border rounded-md p-[9px_11px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-secondary-foreground mb-1">Externalization Vectors</div>
            <div className="text-[10px] text-secondary-foreground/80 leading-[1.5]">Rollback · Retraining · Patching · Policy update · Governance intervention</div>
            <div className="text-[9px] text-secondary-foreground/50 mt-1 italic">Each absorbs the cost of drift externally — removing internal stabilizing pressure</div>
          </div>
          <div className="bg-secondary border border-border rounded-md p-[9px_11px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-secondary-foreground mb-1">Design Implication (§10)</div>
            <div className="text-[10px] text-secondary-foreground/80 leading-[1.5]">Consequence-carrying invariants — constraints that make behavioral drift internally costly, not merely externally correctable</div>
            <div className="text-[9px] text-secondary-foreground/50 mt-1 italic">Not yet implementable — open research direction per §13</div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`p-3 rounded-lg border ${mdr >= 0.6 ? 'bg-fragile-bg border-fragile-border' : mdr >= 0.35 ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border'}`}>
        <div className={`text-[11px] font-bold ${mdrColor} mb-1`}>{mdrLabel}</div>
        <div className="text-[10px] text-secondary-foreground leading-[1.5]">
          {mdr >= 0.6
            ? 'High structural conditions for behavioral alignment decay. System operates under sustained autonomous execution pressure with limited governance feedback. Drift is not observed — it is structurally expected.'
            : mdr >= 0.35
            ? 'Moderate drift conditions. Some governance feedback mechanisms exist but may be insufficient for long-horizon operation. Monitor for scope expansion and model updates without re-authorisation.'
            : 'Low drift conditions. Governance feedback mechanisms are adequate for current deployment profile. Regular monitoring recommended.'}
        </div>
      </div>

      <div className="mt-3 text-[10px] text-muted-foreground leading-[1.5] italic">
        Behavioral Alignment Decay (§5.1, AGAF): "the gradual reconfiguration of a system's operational priorities under sustained autonomous execution and feedback, such that effective behavior diverges from original governance intent without producing detectable compliance violations." · Table 2: Observable: Rarely · Episodic Eval: No · Long-Horizon Risk: <strong className="text-fragile">High</strong>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// METHODOLOGY WHITE PAPER
// ═══════════════════════════════════════════════════════════════════

function MethodologyWhitePaper() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-5 pb-4 flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Methodology · Assessment Framework White Paper</div>
          <div className="text-[15px] font-bold text-foreground">AI Governance Architecture Framework — Methodology Statement v1.0</div>
          <div className="text-[11px] text-muted-foreground mt-1 leading-[1.5] max-w-[560px]">For actuarial, risk committee, and regulatory review. This document describes the conceptual basis, structural logic, and known limitations of the AGAF assessment constructs.</div>
        </div>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/30">For Due Diligence</span>
      </div>

      <div className="border-t border-border p-5 pb-4">
        <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[10px]">1 · Problem Statement</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.7]">Standard underwriting intake processes for AI deployments lack structured instruments to surface structural governance risks: the degree to which a system persists beyond its governance mandate (continuation risk), the cost and difficulty of exiting the dependency (reversibility), the diffusion of accountability across provider chains (responsibility fragmentation), and the long-horizon erosion of behavioral alignment (meaning drift). These risks are not captured by compliance checklists, point-in-time audits, or standard risk questionnaires. They require a structural proxy framework — one that translates qualitative governance conditions into comparable, repeatable signals. AGAF addresses this gap.</div>
      </div>

      <div className="border-t border-border p-5 pb-4">
        <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[10px]">2 · The AFI Formula — Structural Logic</div>
        <div className="font-mono text-[13px] font-bold text-primary p-[10px_14px] bg-primary/5 border border-primary/20 rounded-md mb-[10px]">AFI = (DR × RC × CD) / (JD × NA + 0.001)</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.7] mb-[10px]">The formula captures two competing forces. The numerator (DR × RC × CD) represents structural lock-in pressure: how deeply the system is embedded (Delegation Ratio), how difficult exit is (Reversibility Cost), and how correlated its failure vectors are (Correlation Density). The denominator (JD × NA) represents governance counterweight: how well decisions are documented and traceable (Justificatory Density) and how much normative autonomy is retained (Normative Autonomy). The formula is a structural heuristic — it captures directional governance fragility, not absolute probability of loss.</div>
        <div className="text-[11px] text-muted-foreground italic">Conceptual basis: The tension between delegation depth and governance counterweight is grounded in Kindermann (2026), 'What Are We Aligning To?' — specifically the analysis of how justificatory structures degrade under sustained autonomous execution pressure.</div>
      </div>

      <div className="border-t border-border p-5 pb-4">
        <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[10px]">3 · Secondary Constructs</div>
        <div className="grid grid-cols-2 gap-[10px]">
          {[
            { color: 'border-l-primary', label: 'MDR — Meaning Drift Risk', desc: 'Geometric mean of three structural drivers: autonomous execution pressure, governance feedback gap, and ungoverned operating horizon. Based on Kindermann (2026) §5. Classified: Exploratory.' },
            { color: 'border-l-primary', label: 'RFSI — Reference Frame Stability', desc: 'Inverse geometric mean of context variability, semantic drift risk, evaluation mismatch, and temporal instability. Measures how valid the current governance assessment remains over time. Classified: Exploratory.' },
            { color: 'border-l-stable', label: 'ECI — Existence Cost of Intelligence', desc: 'Four-tier classification (Reversible Tool / Persistent Service / Institutional Dependency / Critical Infrastructure) based on AFI threshold and deployment duration. Grounded in EU AI Act Art. 26 scope logic.' },
            { color: 'border-l-stable', label: 'IAT — Infrastructural AI Trigger', desc: '7-criterion structured check for AI deployment lock-in patterns: duration, criticality, institutional dependency, exit cost, change without re-authorisation, FRIA status, post-market monitoring. Grounded in EU AI Act Art. 26.' },
          ].map((c, i) => (
            <div key={i} className={`p-[10px_12px] bg-secondary rounded-md border-l-[3px] ${c.color}`}>
              <div className="text-[10px] font-bold text-primary mb-1">{c.label}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-5">
        <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-[10px]">4 · Loss Envelope Model</div>
        <div className="text-[12px] text-secondary-foreground leading-[1.7]">The loss model uses a single reference anchor (€2.8M median AI operational loss event, Lloyd's City Risk Index 2024, AI sub-peril) scaled by the AFI score and a governance premium loading. Stress and tail scenarios apply published market multipliers. These are directional calibration anchors — not stochastic outputs. The model does not use copulas, Monte Carlo simulation, or any probabilistic distribution. It is designed to produce committee-grade loss range estimates for triage — not actuarially certified reserves.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AGAF METHODOLOGY STATEMENT
// ═══════════════════════════════════════════════════════════════════

function AGAFMethodologyStatement() {
  return (
    <div className="bg-secondary border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-[10px]">◈ AI Governance Architecture Framework (AGAF) — Methodology Statement</div>
      <div className="text-[13px] font-bold text-foreground mb-2">What AGAF is — and what it is not</div>
      <div className="text-[11px] text-secondary-foreground leading-[1.65] mb-[14px]">
        AGAF operationalises governance concepts from published academic research into a structured assessment instrument. The conceptual foundations draw on Kindermann (2026) — a series of working papers on AI governance architecture including <em>'Semantic Drift and Temporal Coherence in Long-Horizon AI Systems'</em>, <em>'What Are We Aligning To?'</em>, and <em>'Blind Spots of the EU AI Act'</em> — alongside NIST AI RMF 1.0, EIOPA AI Opinion (August 2025), EU AI Act 2024/1689, and LMA E&O Guidelines 2025. <strong className="text-foreground">The AFI, MDR, RFSI, ECI, RFS, and IAT constructs are proprietary operationalisations</strong> of these concepts into measurable structural proxy signals.
      </div>
      <div className="grid grid-cols-2 gap-3 mb-[14px]">
        <div className="bg-stable-bg border border-stable-border rounded-lg p-3">
          <div className="text-[9px] font-bold tracking-wider uppercase text-stable mb-[6px]">✓ AGAF is designed for</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.6]">Structured pre-underwriting intake · Risk committee preparation · Board-level governance documentation · AI deployment intake screening · Internal audit challenge · Regulatory conversation framing (EIOPA, BaFin, FCA) · Accumulation watchlist management</div>
        </div>
        <div className="bg-fragile-bg border border-fragile-border rounded-lg p-3">
          <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-[6px]">✗ AGAF is not designed for</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.6]">Standalone pricing decisions · Treaty structuring · Capital allocation · Actuarial reserving · Regulatory filing · Standalone compliance certification · Replacement for independent actuarial validation</div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground leading-[1.6] border-t border-border pt-[10px]">
        <strong className="text-secondary-foreground">Standards & research grounding:</strong> Kindermann (2026) — Working Papers on AI Governance Architecture. Regulatory: NIST AI RMF 1.0 · OECD AI Principles · EIOPA AI Opinion August 2025 · LMA AI/E&O Guidelines 2025 · EU AI Act Reg. (EU) 2024/1689 · ISO/IEC 42001 · DORA Reg. (EU) 2022/2554.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ASSESSMENT SCOPE DECLARATION
// ═══════════════════════════════════════════════════════════════════

function AssessmentScopeDeclaration() {
  const { state } = useApp();
  const { inputs } = state;
  const declarations = [
    { key: 'Industry context:', value: inputs.industry || '—', status: 'ok' },
    { key: 'Deployment pattern:', value: `${inputs.useCases?.length || 0} use cases · ${inputs.providers?.length || 0} providers`, status: 'ok' },
    { key: 'AFI calibration basis:', value: "Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025 · EIOPA AI Consultation 2024", status: 'ok' },
    { key: 'Loss model anchor:', value: '€2.8M median AI operational loss event (Lloyd\'s CRI 2024) · Governance loading: AFI-scaled', status: 'ok' },
    { key: 'Frame validity period:', value: 'Valid under current EU AI Act implementation phase · Degradation expected post-2027 standard-setting', status: 'ok' },
    { key: 'Known frame limitations:', value: 'Does not capture behavioral alignment decay, evaluation decay, or recursive optimisation effects (see §6.3, AGAF). Consequence externalization (§8) is visible as a signal but not yet measurable as a bounded invariant.', status: 'warn' },
    { key: 'Revision trigger:', value: 'AFI recalibration required when EU AI Act Art. 113(3) / Recital 179 mandatory review cycle introduces formal continuation governance thresholds (expected 2026–2027)', status: 'warn' },
    { key: 'Ground truth status:', value: 'No external ground truth exists for AI governance fragility — assessment is contextually valid, not absolutely verified (AGAF §4)', status: 'lim' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Assessment Scope Declaration — Under Which Conditions This Assessment Is Valid</div>
      <div className="space-y-0">
        {declarations.map((d, i) => (
          <div key={i} className="flex items-start gap-3 py-[9px] border-b border-border last:border-none">
            <div className="w-[160px] text-[10px] font-bold text-muted-foreground flex-shrink-0">{d.key}</div>
            <div className={`text-[10px] leading-[1.5] flex-1 ${d.status === 'ok' ? 'text-stable' : d.status === 'warn' ? 'text-sensitive' : 'text-fragile'}`}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CALIBRATION PARAMETERS
// ═══════════════════════════════════════════════════════════════════

function CalibrationParameters() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-[10px]">Calibration Parameters · Loss Model Configuration</div>
      <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-4">
        Loss estimates are anchored to published market data — not proprietary claims databases. These multipliers can be replaced with portfolio-specific actuarial assumptions without changing the governance signal layer.
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'ANCHOR', value: '€2.8M', sub: 'Lloyd\'s CRI 2024 median AI operational loss' },
          { label: 'STRESS_MULT', value: '3.4×', sub: 'Lloyd\'s correlated loss stress multiplier' },
          { label: 'TAIL_MULT', value: '5.6×', sub: 'Swiss Re sigma 01/2026 tail risk factor' },
          { label: 'PORT_FACTOR', value: '12×', sub: 'Portfolio aggregate (8–15 entity cluster)' },
        ].map((p, i) => (
          <div key={i} className="bg-secondary border border-border rounded-lg p-3 text-center">
            <div className="text-[10px] font-mono font-bold text-primary mb-1">{p.label}</div>
            <div className="text-[18px] font-bold font-mono text-foreground">{p.value}</div>
            <div className="text-[9px] text-secondary-foreground mt-1 leading-[1.3]">{p.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3 p-3 bg-secondary border border-border rounded-lg">
        <span className="text-primary text-[14px] mt-0.5">⚙</span>
        <div>
          <div className="text-[11px] font-bold text-foreground mb-1">For Portfolio-Specific Calibration</div>
          <div className="text-[10px] text-secondary-foreground leading-[1.6]">Replace default multipliers with your own actuarial assumptions by modifying the four constants: <code className="bg-secondary border border-border px-1 rounded text-[9px] text-primary">ANCHOR</code>, <code className="bg-secondary border border-border px-1 rounded text-[9px] text-primary">STRESS_MULT</code>, <code className="bg-secondary border border-border px-1 rounded text-[9px] text-primary">TAIL_MULT</code>, <code className="bg-secondary border border-border px-1 rounded text-[9px] text-primary">PORT_FACTOR</code>. The governance signal (AFI, RFS, MDR) is independent of the loss calibration.</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RFSI PANEL — Reference Frame Stability Index
// ═══════════════════════════════════════════════════════════════════

function RFSIPanel() {
  const { state } = useApp();
  const { results } = state;
  if (!results) return null;

  const { rfsi, rfsiTier, rfsiLabel, rfsiDrivers } = results;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-4 pb-3 border-b border-border flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-1">◈ Reference Frame Stability Index (RFSI) <span className="text-[8px] px-[6px] py-[1px] bg-primary/10 border border-primary/30 rounded text-primary ml-1">Exploratory</span></div>
          <div className="text-[14px] font-bold text-foreground">How valid is this governance assessment over time?</div>
          <div className="text-[11px] text-muted-foreground mt-[2px] leading-[1.5] max-w-[480px]">Governance assessments are not permanent. This index measures whether the conditions under which this system was assessed still hold — and for how long the current assessment can be considered operationally valid.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-5">
          <div className={`text-[44px] font-bold font-mono leading-none ${rfsiTier === 'stable' ? 'text-stable' : rfsiTier === 'conditional' ? 'text-sensitive' : 'text-fragile'}`}>{rfsi}</div>
          <div className={`text-[10px] font-semibold tracking-[0.04em] uppercase mt-[3px] ${rfsiTier === 'stable' ? 'text-stable' : rfsiTier === 'conditional' ? 'text-sensitive' : 'text-fragile'}`}>{rfsiLabel}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-[10px] mb-[14px]">
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
          {rfsiTier === 'stable' ? 'This governance assessment is likely to remain valid across its current deployment lifecycle.' :
           rfsiTier === 'conditional' ? 'This assessment is conditionally valid. Governance findings hold under current conditions but may not generalize beyond them.' :
           'This assessment is no longer structurally valid. Re-evaluation is required immediately.'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FDA PANEL — Frame Drift Alerts
// ═══════════════════════════════════════════════════════════════════

function FDAPanel() {
  const { state } = useApp();
  const { results } = state;
  if (!results) return null;

  const { frameDriftAlerts } = results;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-4 pb-3 border-b border-border flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-muted-foreground mb-[3px]">◈ Frame Drift Alert System (FDA)</div>
          <div className="text-[14px] font-bold text-foreground">Active Governance Alignment Alerts</div>
          <div className="text-[11px] text-muted-foreground mt-[2px] leading-[1.5] max-w-[480px]">Alerts generated when structural governance indicators cross pre-defined thresholds. These represent conditions under which the current assessment framework may no longer hold.</div>
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
  );
}

// ═══════════════════════════════════════════════════════════════════
// EVALUATION LIMITS PANEL
// ═══════════════════════════════════════════════════════════════════

function EvaluationLimitsPanel() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
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
          <div key={i} className="p-3 bg-secondary border border-border rounded-lg text-[10px] text-muted-foreground leading-[1.5]">
            <span className="text-fragile mr-1">⊘</span>
            <strong className="text-foreground">{item.t}</strong> — {item.s}
          </div>
        ))}
      </div>
      <div className="p-3 border border-sensitive rounded-lg bg-sensitive-bg text-[11px] text-foreground leading-[1.6] italic">
        "Alignment is conditional, context-dependent, and frame-dependent. A system aligned under one set of conditions may not be aligned under another — and standard evaluation cannot establish when the boundary has been crossed." — AI Governance Architecture Framework (AGAF)
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EPISTEMIC LIMITATIONS
// ═══════════════════════════════════════════════════════════════════

function EpistemicLimitations() {
  const limitations = [
    { title: "This system operates without stable ground truth", text: "AFI scores are structurally calibrated — not empirically verified against historical outcomes." },
    { title: "Evaluation does not guarantee correctness", text: "Compliance audits verify procedures — not that the system behaves correctly across all operational contexts." },
    { title: "The interval between evaluations is ungoverned", text: "A system verified at t=0 may have undergone significant interpretive drift by t+6 months." },
    { title: "Performance is not justification for continued operation", text: "Performance-based legitimacy is the primary mechanism by which governance oversight erodes." },
    { title: "This assessment itself is subject to the limits it describes", text: "All derived scores are structural proxies. They correlate with governance fragility — they do not predict specific incidents." },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-2">◈ Epistemic Status · What This Assessment Cannot Guarantee</div>
        <div className="text-[18px] font-bold text-foreground mb-3">You Cannot Rely on This Evaluation</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-5 max-w-[700px]">
          This is not a disclaimer; it is an operational fact. The following conditions are structurally true of every AI governance assessment.
        </div>
        <div className="grid grid-cols-2 gap-3">
          {limitations.map((lim, i) => (
            <div key={i} className="p-3 bg-muted border border-border rounded-lg">
              <div className="text-[11px] font-semibold text-sensitive/70 mb-1">{lim.title}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{lim.text}</div>
            </div>
          ))}
        </div>
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
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Regulatory Alignment Map · Framework Grounding</div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: 'EU', color: 'bg-primary/20 border-primary/40 text-primary', title: 'EU AI Act 2024/1689', sub: 'Enforcement begins 2026–2027', content: [{ article: 'Art. 26', text: 'High-risk AI system obligations' }, { article: 'Art. 27', text: 'Fundamental Rights Impact Assessment (FRIA)' }, { article: 'Art. 72', text: 'Post-market monitoring requirements' }, { article: 'Art. 99', text: 'Penalty framework (€35M or 7% global revenue)' }] },
          { icon: 'EP', color: 'bg-sensitive/20 border-sensitive/40 text-sensitive', title: 'EIOPA Opinion August 2025', sub: 'AI in Insurance Supervision', quote: '"Proportionality principle requires risk-based governance approach tailored to AI system characteristics."' },
          { icon: 'US', color: 'bg-stable/20 border-stable/40 text-stable', title: 'NIST AI RMF 1.0', sub: 'Risk Management Framework', items: ['GOVERN: Governance structures', 'MAP: Context establishment', 'MEASURE: Assessment & benchmarking', 'MANAGE: Risk response actions'] },
          { icon: 'SR', color: 'bg-fragile/20 border-fragile/40 text-fragile', title: 'Swiss Re sigma 01/2026', sub: 'AI Insurance Market Guidance', quote: '"AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries."' },
        ].map((r, i) => (
          <div key={i} className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${r.color}`}>{r.icon}</div>
              <div>
                <div className="text-[11px] font-bold text-foreground">{r.title}</div>
                <div className="text-[9px] text-muted-foreground">{r.sub}</div>
              </div>
            </div>
            {'content' in r && r.content ? (
              <div className="flex flex-col gap-1.5 text-[10px]">
                {r.content.map((c: {article: string; text: string}, j: number) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="text-primary font-mono font-bold text-[9px] mt-0.5">{c.article}</div>
                    <div className="text-secondary-foreground leading-[1.4] flex-1">{c.text}</div>
                  </div>
                ))}
              </div>
            ) : 'items' in r && r.items ? (
              <div className="flex flex-col gap-1.5 text-[10px]">
                {r.items.map((t: string, j: number) => (
                  <div key={j} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-stable" /><span className="text-secondary-foreground">{t}</span></div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{r.quote}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESEARCH FOUNDATION
// ═══════════════════════════════════════════════════════════════════

function ResearchFoundation() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="flex">
        <div className="w-[3px] bg-primary flex-shrink-0" />
        <div className="flex-1 p-[14px_18px]">
          <div className="text-[9px] tracking-wider uppercase text-secondary-foreground font-bold mb-[10px]">Research Foundation — Three Governance Gaps This Engine Addresses</div>
          <div className="grid grid-cols-3 gap-[14px]">
            {[
              { title: 'Paper I · EU AI Act Blind Spots', text: 'Risk-based regulation governs deployment — not continuation. Systems persist without re-authorisation. This engine operationalises that gap as a measurable AFI signal.' },
              { title: 'Paper II · Price of Convenience', text: 'Agentic AI erodes oversight without malice — through delegation density and oversight decay. This engine makes that erosion visible before it becomes structural.' },
              { title: 'Paper III · Governing Continuation', text: 'Evaluation cannot authorise existence. Once ECI-2 is reached, performance ≠ permission. This engine triggers viability review before optionality is lost.' },
            ].map((p, i) => (
              <div key={i}>
                <div className="text-[10px] font-semibold text-primary/60 mb-[3px]">{p.title}</div>
                <div className="text-[10px] text-secondary-foreground/80 leading-[1.5]">{p.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-[10px] pt-2 border-t border-border text-[10px] text-secondary-foreground/70">
            AGAF, M. (Feb 2026) — Working Papers on AI Continuation Governance. The EU AI Act 2029 review cycle creates the regulatory mandate. <span className="text-secondary-foreground">Buyers who adopt this framework now are 3 years ahead of enforcement.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPETITIVE POSITIONING
// ═══════════════════════════════════════════════════════════════════

function CompetitivePositioning() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-5">
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Competitive Positioning · What This Engine Does Differently</div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: 'vs. Standard Cyber Insurance', what: 'Traditional cyber/E&O policies', gap: 'Coverage designed for network breaches — not AI-specific structural risks', miss: ['Continuation risk (persists without re-authorisation)', 'Provider concentration (cascade exposure)', 'Responsibility fragmentation (unclear ownership)', 'Behavioral drift (alignment decay)'], borderColor: 'border-fragile/30' },
          { title: 'vs. Parametric AI Solutions', what: 'Munich Re aiSure, Armilla parametric triggers', gap: 'Event-triggered payouts without governance assessment', miss: ['Pre-incident structural fragility assessment', 'Governance posture baseline', 'Committee intake workflow', 'Underwriting decision support signals'], borderColor: 'border-sensitive/30' },
          { title: 'vs. Compliance Audit Tools', what: 'EU AI Act compliance checklists, FRIA generators', gap: 'Binary compliance — not risk quantification', miss: ['Compliance ≠ governance — compliant system can be fragile', 'No premium loading recommendations', 'No loss envelope estimation', 'No underwriter decision support'], borderColor: 'border-primary/30' },
          { title: 'vs. Manual Underwriting', what: 'Traditional questionnaire review', gap: 'Subjective, non-systematic, high variance', miss: ['Reproducible scoring methodology', 'Quantified fragility thresholds', 'Structured constructs (AFI, MDR, RFSI)', 'Scalable across portfolio'], borderColor: 'border-border' },
        ].map((c, i) => (
          <div key={i} className={`bg-secondary border ${c.borderColor} rounded-lg p-4`}>
            <div className="text-[11px] font-bold text-foreground mb-1">{c.title}</div>
            <div className="text-[9px] text-muted-foreground mb-2 italic">{c.what}</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.4] mb-3"><strong className="text-foreground">Coverage gap:</strong> {c.gap}</div>
            <div className="text-[9px] font-bold text-muted-foreground mb-1.5 uppercase">What They Miss:</div>
            <div className="flex flex-col gap-1">
              {c.miss.map((m, j) => (
                <div key={j} className="flex items-start gap-1.5 text-[10px] text-secondary-foreground"><span className="text-fragile mt-0.5">⊘</span><span className="leading-[1.4]">{m}</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// API INTEGRATION REFERENCE
// ═══════════════════════════════════════════════════════════════════

function APIIntegrationReference() {
  const postRequest = `{
  "entity": { "name": "Meridian Financial Group", "industry": "financial_services", "jurisdiction": "EU" },
  "parameters": { "automation_level": 4, "execution_authority": 4, "human_oversight": 2, "review_cadence": 2, "switching_cost": 4, "provider_concentration": 4, "integration_depth": 4, "correlation_density": 3 },
  "providers": ["OpenAI", "Azure"],
  "model_version": "AGAF-v3.0"
}`;
  const postResponse = `{
  "assessment_id": "AGAF-2026-03-20-MFG-001",
  "scores": { "afi": 2.23, "afi_band": "Fragile", "structural_exposure_score": 98, "eci_tier": 3 },
  "committee_signal": "ESCALATE_TO_COMMITTEE",
  "loss_envelope": { "expected": 11.2, "stress": 38.2, "tail_99pct": 121.3, "portfolio_aggregate": 752, "currency": "EUR", "unit": "million" },
  "governance_flags": ["no_clear_system_owner", "iat_trigger_level_3", "mdr_high", "rfsi_degraded"],
  "recommended_actions": ["actuarial_review_required", "dependency_diversification_90d", "governance_reauthorisation_quarterly"]
}`;
  const getResponse = `{
  "portfolio_summary": { "entities_assessed": 12, "fragile_count": 4, "sensitive_count": 5, "stable_count": 3 },
  "concentration_risk": { "primary_provider": "OpenAI", "entities_exposed": 9, "correlated_tail_exposure": 752, "treaty_adequacy": "REVIEW_REQUIRED" },
  "accumulation_alert": true,
  "recommended_treaty_action": "mandatory_sublimit_review"
}`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-5 pb-4 flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">Integration · API Specification</div>
          <div className="text-[15px] font-bold text-foreground">AGAF Engine — API Integration Reference</div>
          <div className="text-[11px] text-muted-foreground mt-1 leading-[1.5] max-w-[560px]">Simulated API specification for underwriting platform integration (Guidewire, SAP Fioneer, ServiceNow).</div>
        </div>
        <span className="px-[7px] py-[2px] rounded text-[9px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/30">Integration-Ready</span>
      </div>
      <div className="mx-5 mb-3 bg-secondary border border-border rounded-[9px] overflow-hidden">
        <div className="px-4 py-[10px] bg-secondary border-b border-border flex items-center gap-[10px]">
          <span className="text-[10px] font-bold px-2 py-[3px] bg-stable-bg text-stable rounded font-mono">POST</span>
          <code className="text-[11px] text-secondary-foreground font-mono">/v1/agaf/assessment</code>
          <span className="text-[9px] text-muted-foreground ml-auto">Run full governance assessment</span>
        </div>
        <div className="p-[14px_16px]">
          <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">Request Body</div>
          <pre className="text-[10px] text-stable bg-secondary border border-border rounded-md p-3 overflow-x-auto mb-3 leading-[1.6] font-mono">{postRequest}</pre>
          <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">Response (200 OK)</div>
          <pre className="text-[10px] text-primary bg-secondary border border-border rounded-md p-3 overflow-x-auto leading-[1.6] font-mono">{postResponse}</pre>
        </div>
      </div>
      <div className="mx-5 mb-3 bg-secondary border border-border rounded-[9px] overflow-hidden">
        <div className="px-4 py-[10px] bg-secondary border-b border-border flex items-center gap-[10px]">
          <span className="text-[10px] font-bold px-2 py-[3px] bg-purple-bg text-primary rounded font-mono">GET</span>
          <code className="text-[11px] text-secondary-foreground font-mono">/v1/agaf/portfolio/concentration</code>
          <span className="text-[9px] text-muted-foreground ml-auto">Returns correlated exposure</span>
        </div>
        <div className="p-[14px_16px]">
          <pre className="text-[10px] text-primary bg-secondary border border-border rounded-md p-3 overflow-x-auto leading-[1.6] font-mono">{getResponse}</pre>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[10px] mx-5 mb-4">
        {[
          { name: 'Guidewire PolicyCenter', desc: 'POST → parse committee_signal + loss_envelope → populate AI Risk Assessment field.' },
          { name: 'SAP Fioneer / Insurance', desc: 'AGAF JSON → SAP BTP via REST adapter. AFI score + flags → Risk Management module.' },
          { name: 'ServiceNow GRC', desc: 'assessment_id + governance_flags → ServiceNow IRM. committee_signal triggers workflow.' },
        ].map((t, i) => (
          <div key={i} className="bg-secondary border border-border rounded-lg p-3">
            <div className="text-[10px] font-bold text-foreground mb-[5px]">{t.name}</div>
            <div className="text-[10px] text-muted-foreground leading-[1.5]">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FRAMEWORK REVISION SCHEDULE
// ═══════════════════════════════════════════════════════════════════

function FrameworkRevisionSchedule() {
  const revisions = [
    { when: 'Annually', what: 'Loss anchor recalibration against Lloyd\'s, Munich Re, EIOPA annual publications', why: 'Market conditions shift. Current anchors are calibrated to 2024–25 data.' },
    { when: 'On deployment event', what: 'Re-assess any profile where system autonomy, integration depth, or provider structure has materially changed', why: 'AFI is a point-in-time structural signal. Material changes invalidate prior assessments.' },
    { when: '2027', what: 'EU AI Act harmonised standards integration — update AFI thresholds if GPAI governance standards define formal continuation metrics', why: 'CEN/CENELEC and ISO/IEC are developing AI management standards.' },
    { when: '2027 (Aug)', what: 'Full framework review aligned with EU AI Act Art. 113(3) application date', why: 'Art. 113(3) sets 2 August 2027 as the application date. Primary window for continuation governance threshold-setting.' },
    { when: 'On major loss event', what: 'Emergency recalibration if AI-specific insurance loss event exceeds €500M industry aggregate', why: 'Current loss anchors are based on projected, not realised, claims.' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="p-5 pb-4 flex items-start justify-between">
        <div>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">§9.4 · Ongoing Negotiation</div>
          <div className="text-[15px] font-bold text-foreground">Framework Revision & Reauthorisation Schedule</div>
          <div className="text-[11px] text-muted-foreground mt-1 leading-[1.5] max-w-[560px]">Governance assessment validity is an ongoing condition — not a static certification.</div>
        </div>
        <span className="px-[7px] py-[2px] rounded text-[9px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/30">Versioned</span>
      </div>
      <div className="divide-y divide-border">
        {revisions.map((r, i) => (
          <div key={i} className="px-5 py-3 flex items-start gap-4">
            <div className="w-[120px] flex-shrink-0 text-[11px] font-bold text-primary">{r.when}</div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-foreground mb-[3px]">{r.what}</div>
              <div className="text-[10px] text-muted-foreground leading-[1.5]">{r.why}</div>
            </div>
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
  const phases = [
    { label: 'Q3–Q4 2026 · Infrastructure', color: 'border-t-primary', labelColor: 'text-primary', items: [
      { title: 'SaaS Backend (FastAPI + PostgreSQL)', desc: 'Multi-tenant, auth, audit log, API endpoints. Prerequisite for all enterprise sales.' },
      { title: 'Real-time Model Drift API', desc: 'Connect to live AI system telemetry — output variance, confidence drift, performance degradation signals.' },
      { title: 'Guidewire / Duck Creek Widget', desc: 'API-first embedded widget for insurance platform integration.' },
    ]},
    { label: 'Q1–Q2 2027 · Intelligence Layer', color: 'border-t-sensitive', labelColor: 'text-sensitive', items: [
      { title: 'Parametric Smart Contract Engine', desc: 'On-chain parametric triggers — when AFI crosses threshold, policy terms adjust automatically.' },
      { title: 'Digital Twin Stress Testing', desc: 'Run AI system against 10,000 simulated scenarios. Pre-bind stress testing for underwriters.' },
      { title: 'Live Loss Feed Integration', desc: 'API connection to Swiss Re / Munich Re anonymised loss data for empirical AFI calibration.' },
    ]},
    { label: 'Q3 2027–2028 · Next Generation', color: 'border-t-stable', labelColor: 'text-stable', items: [
      { title: 'Quantum Vulnerability Index (QVI)', desc: 'Quantum-AI convergence risk: cryptographic break risk, quantum-ML adversarial attacks.' },
      { title: 'Climate × AI Intersection Overlay', desc: 'Data centre temperature/energy stress scenarios × AI dependency.' },
      { title: 'Multi-Entity Portfolio Cascade Engine', desc: 'Full portfolio cascade simulation across 8–15 correlated entities.' },
    ]},
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">◈ Product Roadmap</div>
        <span className="text-[8px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded">2026–2028</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {phases.map((phase, i) => (
          <div key={i} className={`p-4 bg-secondary border border-border rounded-lg border-t-[3px] ${phase.color}`}>
            <div className={`text-[9px] font-bold tracking-[0.1em] uppercase ${phase.labelColor} mb-3`}>{phase.label}</div>
            <div className="flex flex-col gap-2">
              {phase.items.map((item, j) => (
                <div key={j} className="p-2.5 bg-card border border-border rounded">
                  <div className="text-[11px] font-semibold text-foreground mb-1">{item.title}</div>
                  <div className="text-[9px] text-secondary-foreground leading-[1.4]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
