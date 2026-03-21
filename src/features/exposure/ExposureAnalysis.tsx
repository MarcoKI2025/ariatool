import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeLivePreview } from '@/lib/scoring';
import { USE_CASES, PROVIDERS, INDUSTRIES } from '@/lib/constants';
import { SliderRow, SectionCard } from '@/components/shared/UIComponents';
import { DEMO_PROFILES, applyDemoProfile } from '@/lib/demoData';
import { ExposureResults } from './ExposureResults';

const PROGRESS_STEPS = ['Company', 'Deployment', 'Agentic', 'Governance'];

export function ExposureAnalysis() {
  const { state, updateInputs, setInputs, runAnalysis } = useApp();
  const { inputs, analysisComplete } = state;
  const [dismissedWelcome, setDismissedWelcome] = useState(false);
  const [showForm, setShowForm] = useState(!analysisComplete);

  const preview = useMemo(() => computeLivePreview(inputs), [inputs]);

  // Listen for "show form" event from results view
  useEffect(() => {
    const handler = () => setShowForm(true);
    document.addEventListener('show-exposure-form', handler);
    return () => document.removeEventListener('show-exposure-form', handler);
  }, []);

  // When analysis completes, switch to results
  useEffect(() => {
    if (analysisComplete) setShowForm(false);
  }, [analysisComplete]);

  // If analysis is complete and not showing form, show results
  if (analysisComplete && !showForm) {
    return <ExposureResults />;
  }

  const toggleChip = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  // Simple progress calculation
  const hasCompany = inputs.companyName.length > 0 && inputs.industry.length > 0;
  const hasDeployment = inputs.automation !== 3 || inputs.criticality !== 3;
  const hasAgentic = inputs.executionAuthority !== 3 || inputs.actionDensity !== 3;
  const hasGov = inputs.reviewCadence !== 3 || inputs.sunsetPolicy !== 3;
  const progressIdx = hasGov ? 3 : hasAgentic ? 2 : hasDeployment ? 1 : hasCompany ? 1 : 0;

  return (
    <div>
      {/* Welcome banner */}
      {!dismissedWelcome && !analysisComplete && (
        <div className="flex items-start gap-4 p-[18px] rounded-xl mb-5 border border-purple-border" style={{ background: 'linear-gradient(135deg, hsl(var(--purple-bg)), hsl(var(--card)))' }}>
          <div className="w-9 h-9 rounded-[9px] bg-primary flex items-center justify-center text-[16px] flex-shrink-0 text-white font-bold">⊕</div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-foreground mb-1 tracking-tight">Assess your AI risk exposure in 3 minutes</div>
            <div className="text-[12px] text-secondary-foreground leading-[1.6] mb-[10px]">
              Configure your AI deployment profile below — receive an executive risk score, estimated insurance cost range, and regulatory exposure signal ready for committee review.
            </div>
            <div className="flex gap-5 flex-wrap">
              {['Fill in your AI profile', 'Generate risk assessment', 'Review results & export to board'].map((txt, i) => (
                <div key={i} className="flex items-center gap-[6px] text-[11px] text-secondary-foreground">
                  <span className="w-[18px] h-[18px] rounded-full bg-primary text-white inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0">{i + 1}</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setDismissedWelcome(true)} className="text-muted-foreground hover:text-foreground text-[16px] p-1 flex-shrink-0 leading-none" title="Dismiss">✕</button>
        </div>
      )}

      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 1 of 6 · Entry Point</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Exposure Analysis</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Configure the AI deployment profile. All downstream outputs — risk scores, financial exposure, underwriting recommendations — derive exclusively from this input.
        </p>
      </div>

      {/* Analysis status */}
      <div className={`flex items-start gap-[10px] p-[11px] px-[15px] rounded-lg mb-[18px] border transition-all ${
        analysisComplete ? 'bg-stable-bg border-stable-border' : 'bg-secondary border-border'
      }`}>
        <div className="text-sm flex-shrink-0 mt-[1px]">{analysisComplete ? '✓' : '🔒'}</div>
        <div>
          <div className={`text-[12px] font-semibold mb-[2px] ${analysisComplete ? 'text-stable' : 'text-foreground'}`}>
            {analysisComplete ? 'Analysis complete — systemic risk model generated.' : 'Complete Exposure Analysis to unlock risk insights, scenarios, insurance decisions, and board-level outputs.'}
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.5]">
            {analysisComplete ? 'All downstream steps are now calibrated to the submitted profile.' : 'This guided flow prevents static dashboard behaviour — every downstream signal is computed from the submitted profile, not pre-filled.'}
          </div>
        </div>
      </div>

      {/* Demo profiles - dark section matching HTML */}
      <div className="rounded-xl p-[18px] px-5 mb-5 border border-chrome-border bg-chrome">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[12px] font-bold text-chrome-fg-bright tracking-[0.01em]">⚡ New here? Start with a demo profile</div>
            <div className="text-[10px] text-[#c0bca8] mt-[3px]">Click any scenario below to pre-fill all inputs instantly — then click "Generate AI Risk Assessment" to see the full analysis. Takes 10 seconds.</div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {DEMO_PROFILES.map((p, i) => (
            <button
              key={i}
              onClick={() => setInputs(applyDemoProfile(p))}
              className="text-center p-3 rounded-[9px] border border-[#3a3828] bg-[#1e1d14] hover:bg-[#2e2c20] hover:border-primary transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <div className="text-lg mb-[2px]">{p.icon}</div>
              <div className="text-[10px] font-bold text-[#f0ece0] leading-[1.3] text-center">{p.name}</div>
              <div className="text-[9px] text-[#c0bca8] font-medium mt-[1px]">{p.industry}</div>
              <div className={`mt-[3px] text-[8px] font-bold uppercase tracking-[0.06em] px-[7px] py-[2px] rounded-[3px] ${
                p.band === 'Fragile' ? 'bg-[#3a1210] text-[#ff8878] border border-[#5a2018]' :
                p.band === 'Sensitive' ? 'bg-[#3a2800] text-[#ffc040] border border-[#5a4000]' :
                'bg-[#0e2a18] text-[#60d090] border border-[#1a4a28]'
              }`}>{p.band}</div>
            </button>
          ))}
        </div>
        <div className="mt-[10px] text-[10px] text-[#a0a098] italic">Each profile reflects a real-world AI deployment pattern with different risk characteristics. Adjust any slider after loading to explore scenarios.</div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Or fill in manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Context frame */}
      <div className="flex items-start gap-3 p-[14px] px-4 rounded-[9px] mb-5 border border-purple-border" style={{ background: 'linear-gradient(135deg, hsl(var(--purple-bg)), hsl(var(--secondary)))' }}>
        <span className="text-[16px] flex-shrink-0 mt-[1px] text-primary">◈</span>
        <div>
          <div className="text-[12px] font-semibold text-foreground mb-[3px]">This analysis identifies structural AI risks that traditional underwriting and compliance frameworks do not capture.</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.55]">Specifically: continuation risk (the system persists without re-authorisation), dependency lock-in (cannot be exited without disruption), and cross-system propagation (failure amplifies across operational layers). All downstream outputs derive exclusively from this input.</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-0 mb-5">
        {PROGRESS_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-[6px] text-[11px] font-medium ${i <= progressIdx ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-[7px] h-[7px] rounded-full ${i <= progressIdx ? 'bg-primary' : 'bg-border'}`} />
              {step}
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < progressIdx ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
        {/* Left: form */}
        <div>
          {/* Company Profile */}
          <SectionCard title="Company Profile" icon="🏢" subtitle="Establish the entity and its AI deployment context for structural risk classification.">
            <div className="grid grid-cols-2 gap-[14px] mb-3">
              <div>
                <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">Company Name</label>
                <input
                  type="text"
                  value={inputs.companyName}
                  onChange={(e) => updateInputs({ companyName: e.target.value })}
                  placeholder="e.g. Meridian Financial Group"
                  className="w-full px-3 py-[9px] border border-border rounded-lg bg-card text-foreground text-[13px] focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">Industry</label>
                <select
                  value={inputs.industry}
                  onChange={(e) => updateInputs({ industry: e.target.value })}
                  className="w-full px-3 py-[9px] border border-border rounded-lg bg-card text-foreground text-[13px] focus:border-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">Primary AI Use Cases</label>
            <div className="flex flex-wrap gap-[6px] mb-3">
              {USE_CASES.map(uc => (
                <span key={uc} onClick={() => updateInputs({ useCases: toggleChip(inputs.useCases, uc) })} className={`chip ${inputs.useCases.includes(uc) ? 'active' : ''}`}>{uc}</span>
              ))}
            </div>
            <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">External AI Dependencies</label>
            <div className="flex flex-wrap gap-[6px]">
              {PROVIDERS.map(p => (
                <span key={p} onClick={() => updateInputs({ providers: toggleChip(inputs.providers, p) })} className={`chip ${inputs.providers.includes(p) ? 'active' : ''}`}>{p}</span>
              ))}
            </div>
          </SectionCard>

          {/* Deployment */}
          <SectionCard title="Deployment Characteristics" icon="📊" subtitle="Defines scope and authority of AI. High values amplify Delegation Ratio and Correlation Density." badgeText="4 inputs" confidenceBadge="Self-Declared">
            <SliderRow label="Automation Level" value={inputs.automation} onChange={v => updateInputs({ automation: v })} description="1 = Manual processes · 5 = Fully autonomous execution" />
            <SliderRow label="Business Criticality" value={inputs.criticality} onChange={v => updateInputs({ criticality: v })} description="1 = Low importance · 5 = Mission-critical operations" />
            <SliderRow label="Integration Depth" value={inputs.integrationDepth} onChange={v => updateInputs({ integrationDepth: v })} description="1 = Isolated tool · 5 = Deeply embedded in infrastructure" />
            <SliderRow label="AI Workflow Breadth" value={inputs.workflowBreadth} onChange={v => updateInputs({ workflowBreadth: v })} description="1 = Single workflow · 5 = Organisation-wide deployment" />
          </SectionCard>

          {/* Agentic */}
          <SectionCard title="Agentic Exposure Parameters" icon="🤖" subtitle="Autonomous systems create non-linear exposure through action density and execution authority." badgeText="8 inputs · Core + Agent extensions">
            <SliderRow label="Execution Authority" value={inputs.executionAuthority} onChange={v => updateInputs({ executionAuthority: v })} description="1 = No autonomous action · 5 = Full autonomous execution" />
            <SliderRow label="Action Density" value={inputs.actionDensity} onChange={v => updateInputs({ actionDensity: v })} description="1 = Infrequent actions · 5 = Continuous autonomous actions" />
            <SliderRow label="External Tool Access" value={inputs.toolCallScope} onChange={v => updateInputs({ toolCallScope: v })} description="1 = No external access · 5 = Broad API and tool integrations" />
            <SliderRow label="Human Oversight Level" value={inputs.oversightLevel} onChange={v => updateInputs({ oversightLevel: v })} description="1 = No oversight · 5 = Comprehensive human-in-the-loop" />

            {/* Agent Architecture sub-section */}
            <div className="mt-4 mb-2 p-[10px] px-[14px] bg-secondary border border-border rounded-lg border-l-[3px] border-l-primary">
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-primary mb-[3px]">⚡ AI Agent Architecture — New Risk Dimensions</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">The following inputs apply specifically to <strong className="text-foreground">agentic AI systems</strong> — autonomous agents that plan, use tools, spawn sub-agents, or maintain persistent memory.</div>
            </div>

            <SliderRow label="Multi-Agent Orchestration" value={inputs.multiAgent} onChange={v => updateInputs({ multiAgent: v })} description="1 = Single model · 3 = Orchestrates 2–5 sub-agents · 5 = Complex multi-agent network" />
            <SliderRow label="Tool-Call Authority Scope" value={inputs.toolCallAuthority} onChange={v => updateInputs({ toolCallAuthority: v })} description="1 = Read-only / no tools · 3 = API access, database writes · 5 = Financial transactions, code execution" />
            <SliderRow label="Persistent Memory Exposure" value={inputs.persistentMemory} onChange={v => updateInputs({ persistentMemory: v })} description="1 = Stateless / no memory · 3 = Session memory · 5 = Full persistent memory" />
            <SliderRow label="Human Checkpoint Coverage" value={inputs.humanCheckpoints} onChange={v => updateInputs({ humanCheckpoints: v })} description="1 = No checkpoints · 3 = High-value actions only · 5 = Approval before every action" />
          </SectionCard>

          {/* AI-Specific Liability */}
          <SectionCard title="AI-Specific Liability Exposure" icon="⚠" subtitle="These dimensions reflect actual AI liability claim patterns emerging in 2025–2026." badgeText="9 inputs · 2025–26 claim vectors" confidenceBadge="2025–2026 Claim Patterns">
            <SliderRow label="Hallucination Liability Exposure" value={inputs.hallucinationLiability} onChange={v => updateInputs({ hallucinationLiability: v })} description="1 = All outputs human-verified · 3 = Some automated, spot-checked · 5 = AI outputs directly to customers" />
            <SliderRow label="Deepfake / Synthetic Fraud Exposure" value={inputs.deepfakeFraud} onChange={v => updateInputs({ deepfakeFraud: v })} description="1 = Strong auth protocols · 3 = Standard video/voice auth · 5 = Video/voice for high-value, no controls" />
            <SliderRow label="Prompt Injection & Input Manipulation" value={inputs.promptInjection} onChange={v => updateInputs({ promptInjection: v })} description="1 = Only trusted internal content · 3 = Some external, sandboxed · 5 = Untrusted external + financial actions" />
            <SliderRow label="Model Drift & Data Poisoning" value={inputs.modelDrift} onChange={v => updateInputs({ modelDrift: v })} description="1 = Formal drift monitoring · 3 = Periodic manual review · 5 = No drift monitoring" />
            <SliderRow label="Algorithmic Bias & Discriminatory Output" value={inputs.algorithmicBias} onChange={v => updateInputs({ algorithmicBias: v })} description="1 = Regular bias audits · 3 = Some testing, no systematic audit · 5 = No bias testing" />
            <SliderRow label="Shadow AI & Uncontrolled Deployment" value={inputs.shadowAI} onChange={v => updateInputs({ shadowAI: v })} description="1 = Approved tools only, monitored · 3 = Policy exists but not enforced · 5 = No AI usage policy" />
            <SliderRow label="Explainability Gap & Black Box Liability" value={inputs.explainabilityGap} onChange={v => updateInputs({ explainabilityGap: v })} description="1 = Full explainability · 3 = Partial — high-level only · 5 = Black box — not interpretable" />
            <SliderRow label="Data Supply Chain Integrity" value={inputs.dataIntegrity} onChange={v => updateInputs({ dataIntegrity: v })} description="1 = Formal data lineage, verified · 3 = Partial validation · 5 = Third-party data without verification" />
            <SliderRow label="ESG & Carbon Liability Exposure" value={inputs.esgLiability} onChange={v => updateInputs({ esgLiability: v })} description="1 = Green-certified compute, CSRD-documented · 3 = Standard cloud, partial reporting · 5 = High-intensity, no monitoring" />
          </SectionCard>

          {/* Systemic & Concentration */}
          <SectionCard title="Systemic & Concentration Risk" icon="🌐" subtitle='Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk."' badgeText="4 inputs · Swiss Re sigma 01/2026">
            <SliderRow label="Cloud Provider Concentration" value={inputs.cloudConcentration} onChange={v => updateInputs({ cloudConcentration: v })} description="1 = Single provider (critical) · 3 = Two providers · 5 = Multi-cloud, no single >40%" />
            <SliderRow label="AI Model Provider Concentration" value={inputs.modelConcentration} onChange={v => updateInputs({ modelConcentration: v })} description="1 = Single model provider · 3 = Two providers, fallback exists · 5 = Multi-provider + open-weight" />
            <SliderRow label="GPU / Compute Infrastructure Concentration" value={inputs.gpuConcentration} onChange={v => updateInputs({ gpuConcentration: v })} description="1 = Single data centre · 3 = Two facilities · 5 = Geographically distributed, multi-vendor" />
            <SliderRow label="Cross-Vendor Contagion Exposure" value={inputs.crossVendorContagion} onChange={v => updateInputs({ crossVendorContagion: v })} description="1 = Vendors share infrastructure (hidden correlation) · 3 = Partial independence · 5 = Full vendor independence" />
          </SectionCard>

          {/* Governance & Dependency */}
          <SectionCard title="Governance & Dependency" icon="🔒" subtitle="Low scores here signal systemic entrenchment — the system cannot be safely exited without significant disruption." badgeText="4 inputs">
            <SliderRow label="Review Cadence" value={inputs.reviewCadence} onChange={v => updateInputs({ reviewCadence: v })} description="1 = Never reviewed · 5 = Continuous review process" />
            <SliderRow label="Sunset Policy" value={inputs.sunsetPolicy} onChange={v => updateInputs({ sunsetPolicy: v })} description="1 = No sunset process · 5 = Formal decommission framework" />
            <SliderRow label="Switching Cost" value={inputs.switchingCost} onChange={v => updateInputs({ switchingCost: v })} description="1 = Trivial to switch · 5 = Prohibitively expensive" />
            <SliderRow label="Data Portability" value={inputs.portability} onChange={v => updateInputs({ portability: v })} description="1 = Fully portable · 5 = Completely locked in" />
          </SectionCard>
        </div>

        {/* Right: Live interpretation panel */}
        <div className="bg-card border border-border rounded-[10px] p-4 sticky top-2">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-secondary-foreground mb-3">Real-time Risk Signal</div>
          <div className="flex items-end gap-3 mb-3">
            <span className={`text-[40px] font-bold font-mono leading-none ${
              preview.band === 'Fragile' ? 'text-fragile' : preview.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
            }`}>{preview.score}</span>
            <span className={`px-[10px] py-1 rounded-[5px] text-[10px] font-bold tracking-[0.06em] uppercase ${
              preview.band === 'Fragile' ? 'badge-fragile' : preview.band === 'Sensitive' ? 'badge-sensitive' : 'badge-stable'
            }`}>{preview.band}</span>
          </div>
          {/* Meter */}
          <div className="h-[6px] bg-border rounded-[3px] overflow-hidden mb-2">
            <div className={`h-full rounded-[3px] transition-all duration-400 ${
              preview.band === 'Fragile' ? 'bg-fragile' : preview.band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'
            }`} style={{ width: `${Math.min(100, preview.score)}%` }} />
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.55] mb-3">
            AFI {preview.afi.toFixed(2)} — {preview.band === 'Fragile' ? 'High governance fragility detected' : preview.band === 'Sensitive' ? 'Drift risk emerging — monitoring required' : 'Governance drift currently contained'}
          </div>

          {/* AFI Components */}
          <div className="mb-3 space-y-[6px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">AFI Components</div>
            {[
              { label: 'DR', value: preview.components.dr },
              { label: 'JD', value: preview.components.jd },
              { label: 'RC', value: preview.components.rc },
              { label: 'CD', value: preview.components.cd },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground w-5">{c.label}</span>
                <div className="flex-1 h-[4px] bg-border rounded overflow-hidden">
                  <div className={`h-full rounded ${c.value > 0.7 ? 'bg-fragile' : c.value > 0.5 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(c.value * 100)}%` }} />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground w-6 text-right">{Math.round(c.value * 100)}</span>
              </div>
            ))}
          </div>

          {/* Signals */}
          <div className="flex flex-col gap-[5px]">
            {preview.signals.slice(0, 5).map((sig, i) => (
              <div key={i} className="flex items-start gap-[7px] p-[6px] px-[9px] bg-secondary border border-border rounded-md">
                <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 mt-[3px] ${
                  sig.color === 'fragile' ? 'bg-fragile' : sig.color === 'sensitive' ? 'bg-sensitive' : 'bg-stable'
                }`} />
                <span className="text-[10px] text-secondary-foreground leading-[1.4]">{sig.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-[9px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-1">What does this measure?</div>
            <div className="text-[10px] text-secondary-foreground leading-[1.55]">
              The Authority Fragility Index (AFI) captures structural dependency, continuation risk, and governance opacity in a single signal. It is not a compliance score — a system can be fully compliant and still show high AFI.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar - PURPLE like HTML */}
      <div className="fixed bottom-0 left-[236px] right-0 bg-primary flex items-center justify-center flex-col gap-1 px-[28px] py-[14px] z-10 border-t border-white/10">
        <button onClick={runAnalysis} className="text-white text-[14px] font-semibold bg-transparent border-none cursor-pointer tracking-[0.01em]">
          ⊕ Generate AI Risk Assessment
        </button>
        <div className="text-[10px] text-white/40 tracking-[0.04em]">
          {inputs.companyName ? `${inputs.companyName} · ` : ''}AFI {preview.afi.toFixed(2)} · {preview.band}
        </div>
      </div>
    </div>
  );
}
