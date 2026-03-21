import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeLivePreview } from '@/lib/scoring';
import { USE_CASES, PROVIDERS, INDUSTRIES } from '@/lib/constants';
import { SliderRow, SectionCard } from '@/components/shared/UIComponents';
import { DEMO_PROFILES, applyDemoProfile } from '@/lib/demoData';

export function ExposureAnalysis() {
  const { state, updateInputs, setInputs, runAnalysis } = useApp();
  const { inputs, analysisComplete } = state;

  const preview = useMemo(() => computeLivePreview(inputs), [inputs]);

  const toggleChip = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <div>
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
            {analysisComplete ? 'Analysis complete — systemic risk model generated.' : 'Complete Exposure Analysis to unlock risk insights.'}
          </div>
          <div className="text-[11px] text-secondary-foreground leading-[1.5]">
            {analysisComplete ? 'All downstream steps are now calibrated to the submitted profile.' : 'This guided flow prevents static dashboard behaviour — every downstream signal is computed from the submitted profile.'}
          </div>
        </div>
      </div>

      {/* Demo profiles */}
      <div className="bg-secondary rounded-xl p-[18px] mb-5 border border-border">
        <div className="text-[12px] font-bold text-foreground mb-1">⚡ Start with a demo profile</div>
        <div className="text-[10px] text-muted-foreground mb-3">Click any scenario below to pre-fill all inputs instantly.</div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_PROFILES.map((p, i) => (
            <button
              key={i}
              onClick={() => setInputs(applyDemoProfile(p))}
              className="text-left p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="text-lg mb-1">{p.icon}</div>
              <div className="text-[11px] font-bold text-foreground">{p.name}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{p.industry}</div>
              <div className={`mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-[2px] rounded inline-block ${
                p.band === 'Fragile' ? 'badge-fragile' : p.band === 'Sensitive' ? 'badge-sensitive' : 'badge-stable'
              }`}>{p.band}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Or fill in manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
        {/* Left: form */}
        <div>
          {/* Company Profile */}
          <SectionCard title="Company Profile" icon="🏢" subtitle="Establish the entity and its AI deployment context.">
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
                <span
                  key={uc}
                  onClick={() => updateInputs({ useCases: toggleChip(inputs.useCases, uc) })}
                  className={`chip ${inputs.useCases.includes(uc) ? 'active' : ''}`}
                >{uc}</span>
              ))}
            </div>
            <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">External AI Dependencies</label>
            <div className="flex flex-wrap gap-[6px]">
              {PROVIDERS.map(p => (
                <span
                  key={p}
                  onClick={() => updateInputs({ providers: toggleChip(inputs.providers, p) })}
                  className={`chip ${inputs.providers.includes(p) ? 'active' : ''}`}
                >{p}</span>
              ))}
            </div>
          </SectionCard>

          {/* Deployment */}
          <SectionCard title="Deployment Characteristics" icon="📊" subtitle="Defines scope and authority of AI.">
            <SliderRow label="Automation Level" value={inputs.automation} onChange={v => updateInputs({ automation: v })} description="1 = Manual processes · 5 = Fully autonomous execution" />
            <SliderRow label="Business Criticality" value={inputs.criticality} onChange={v => updateInputs({ criticality: v })} description="1 = Low importance · 5 = Mission-critical operations" />
            <SliderRow label="Integration Depth" value={inputs.integrationDepth} onChange={v => updateInputs({ integrationDepth: v })} description="1 = Isolated tool · 5 = Deeply embedded in infrastructure" />
            <SliderRow label="AI Workflow Breadth" value={inputs.workflowBreadth} onChange={v => updateInputs({ workflowBreadth: v })} description="1 = Single workflow · 5 = Organisation-wide deployment" />
          </SectionCard>

          {/* Agentic */}
          <SectionCard title="Agentic Exposure Parameters" icon="🤖" subtitle="Autonomous systems create non-linear exposure through action density and execution authority.">
            <SliderRow label="Execution Authority" value={inputs.executionAuthority} onChange={v => updateInputs({ executionAuthority: v })} description="1 = No autonomous action · 5 = Full autonomous execution" />
            <SliderRow label="Action Density" value={inputs.actionDensity} onChange={v => updateInputs({ actionDensity: v })} description="1 = Minimal actions · 5 = High-frequency execution" />
            <SliderRow label="Tool-Call Scope" value={inputs.toolCallScope} onChange={v => updateInputs({ toolCallScope: v })} description="1 = Read-only · 5 = Full system access" />
            <SliderRow label="Human Oversight" value={inputs.oversightLevel} onChange={v => updateInputs({ oversightLevel: v })} description="1 = Minimal · 5 = Comprehensive oversight" />
          </SectionCard>

          {/* Governance */}
          <SectionCard title="Governance & Continuity" icon="🛡️" subtitle="Measures organisational control over AI system lifecycle.">
            <SliderRow label="Review Cadence" value={inputs.reviewCadence} onChange={v => updateInputs({ reviewCadence: v })} description="1 = No formal review · 5 = Continuous review" />
            <SliderRow label="Sunset Policy" value={inputs.sunsetPolicy} onChange={v => updateInputs({ sunsetPolicy: v })} description="1 = No policy · 5 = Enforced decommission plan" />
            <SliderRow label="Switching Cost" value={inputs.switchingCost} onChange={v => updateInputs({ switchingCost: v })} description="1 = Easy to switch · 5 = Extreme lock-in" />
            <SliderRow label="Portability" value={inputs.portability} onChange={v => updateInputs({ portability: v })} description="1 = Fully portable · 5 = Zero portability" />
          </SectionCard>

          {/* Agent Extensions */}
          <SectionCard title="Agent Architecture Extensions" icon="⚙️" subtitle="Multi-agent systems, persistent memory, and tool-call authority create compounding exposure.">
            <SliderRow label="Multi-Agent Orchestration" value={inputs.multiAgent} onChange={v => updateInputs({ multiAgent: v })} description="1 = Single agent · 5 = Complex multi-agent system" />
            <SliderRow label="Tool-Call Authority" value={inputs.toolCallAuthority} onChange={v => updateInputs({ toolCallAuthority: v })} description="1 = No tool calls · 5 = Unrestricted tool execution" />
            <SliderRow label="Persistent Memory" value={inputs.persistentMemory} onChange={v => updateInputs({ persistentMemory: v })} description="1 = Stateless · 5 = Full persistent memory across sessions" />
            <SliderRow label="Human Checkpoints" value={inputs.humanCheckpoints} onChange={v => updateInputs({ humanCheckpoints: v })} description="1 = No checkpoints · 5 = Every action requires approval" />
          </SectionCard>
        </div>

        {/* Right: Live interpretation panel */}
        <div className="bg-card border border-border rounded-[10px] p-4 sticky top-2">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-secondary-foreground mb-3">Live Interpretation</div>
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

          {/* AFI Components mini */}
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
            {preview.signals.slice(0, 4).map((sig, i) => (
              <div key={i} className="flex items-start gap-[7px] p-[6px] px-[9px] bg-secondary border border-border rounded-md">
                <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 mt-[3px] ${
                  sig.color === 'fragile' ? 'bg-fragile' : sig.color === 'sensitive' ? 'bg-sensitive' : 'bg-stable'
                }`} />
                <span className="text-[10px] text-secondary-foreground leading-[1.4]">{sig.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border text-[9px] text-muted-foreground italic">
            Live preview updates as you change inputs. Run Analysis to finalise.
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-[236px] right-0 bg-card border-t border-border px-[30px] py-3 flex items-center justify-between z-10">
        <div className="text-[12px] text-secondary-foreground">
          {inputs.companyName ? `${inputs.companyName} · ` : ''}{preview.band} · AFI {preview.afi.toFixed(2)}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setInputs({ ...inputs, ...applyDemoProfile(DEMO_PROFILES[0]) })} className="px-4 py-[8px] text-[12px] text-muted-foreground border border-border rounded-lg hover:text-foreground transition-colors">
            Load Demo
          </button>
          <button onClick={runAnalysis} className="px-6 py-[10px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            ⊕ Run Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
