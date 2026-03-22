import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeLivePreview } from '@/lib/scoring';
import { USE_CASES, PROVIDERS, INDUSTRIES, COMPANY_SIZES, REVENUE_RANGES } from '@/lib/constants';
import { SliderRow, SectionCard, InfoTip } from '@/components/shared/UIComponents';
import { DEMO_PROFILES, applyDemoProfile } from '@/lib/demoData';
import { ExposureResults } from './ExposureResults';
import { SLIDER_CATEGORIES } from '@/lib/sliderConfigs';
import { TOOLTIPS } from '@/lib/tooltips';
import { ExposureInputs } from '@/lib/types';
import { IATAssessmentPanel } from '@/features/iat/IATAssessmentPanel';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';

const PROGRESS_STEPS = ['Company', 'Core AFI', 'Agent', 'Liability', 'Governance', 'Systemic'];

export function ExposureAnalysis() {
  const { state, updateInputs, setInputs, runAnalysis } = useApp();
  const { inputs, analysisComplete } = state;
  const [dismissedWelcome, setDismissedWelcome] = useState(false);
  const [showForm, setShowForm] = useState(!analysisComplete);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      runAnalysis();
      setTimeout(() => setIsLoading(false), 500);
    }, 5000);
  }, [runAnalysis]);

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

  // Progress calculation based on categories touched
  const hasCompany = inputs.companyName.length > 0 && inputs.industry.length > 0;
  const hasCoreAFI = inputs.automation !== 3 || inputs.executionAuthority !== 3 || inputs.oversightLevel !== 3;
  const hasAgent = inputs.multiAgent !== 1 || inputs.toolCallAuthority !== 1;
  const hasLiability = inputs.hallucinationLiability !== 1 || inputs.deepfakeFraud !== 1;
  const hasGov = inputs.shadowAI !== 3 || inputs.explainabilityGap !== 3;
  const hasSystemic = inputs.cloudConcentration !== 3 || inputs.modelConcentration !== 3;
  const progressIdx = hasSystemic ? 5 : hasGov ? 4 : hasLiability ? 3 : hasAgent ? 2 : hasCoreAFI ? 1 : hasCompany ? 1 : 0;

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

      {/* Demo profiles */}
      <div className="rounded-xl p-[18px] px-5 mb-5 border border-border bg-secondary">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[12px] font-bold text-foreground tracking-[0.01em]">⚡ New here? Start with a demo profile</div>
            <div className="text-[10px] text-secondary-foreground mt-[3px]">Click any scenario below to pre-fill all inputs instantly — then click "Generate AI Risk Assessment" to see the full analysis. Takes 10 seconds.</div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {DEMO_PROFILES.map((p, i) => (
            <button
              key={i}
              onClick={() => setInputs(applyDemoProfile(p))}
              className="text-center p-3 rounded-[9px] border border-border bg-secondary-hover hover:bg-secondary-active hover:border-primary transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <div className="text-[10px] font-bold text-foreground leading-[1.3] text-center mb-[2px]">{p.id}</div>
              <div className="text-[10px] font-bold text-foreground leading-[1.3] text-center">{p.name}</div>
              <div className="text-[9px] text-secondary-foreground font-medium mt-[1px]">{p.industry}</div>
              <div className={`mt-[3px] text-[8px] font-bold uppercase tracking-[0.06em] px-[7px] py-[2px] rounded-[3px] ${
                p.band === 'Fragile' ? 'badge-fragile' :
                p.band === 'Sensitive' ? 'badge-sensitive' :
                'badge-stable'
              }`}>{p.band}</div>
            </button>
          ))}
        </div>
        <div className="mt-[10px] text-[10px] text-muted-foreground italic">Each profile reflects a real-world AI deployment pattern with different risk characteristics. Adjust any slider after loading to explore scenarios.</div>
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
            <div className={`flex items-center gap-[6px] text-[10px] font-medium ${i <= progressIdx ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-[7px] h-[7px] rounded-full ${i <= progressIdx ? 'bg-primary' : 'bg-border'}`} />
              {step}
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < progressIdx ? 'bg-primary' : 'bg-border'}`} />
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
            <div className="grid grid-cols-2 gap-[14px] mb-3">
              <div>
                <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">Company Size</label>
                <select
                  value={inputs.size}
                  onChange={(e) => updateInputs({ size: e.target.value })}
                  className="w-full px-3 py-[9px] border border-border rounded-lg bg-card text-foreground text-[13px] focus:border-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-secondary-foreground mb-[5px] block">Annual Revenue</label>
                <select
                  value={inputs.revenue}
                  onChange={(e) => updateInputs({ revenue: e.target.value })}
                  className="w-full px-3 py-[9px] border border-border rounded-lg bg-card text-foreground text-[13px] focus:border-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="">Select revenue range</option>
                  {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
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

          {/* Render all 6 slider categories from config */}
          {SLIDER_CATEGORIES.map((cat) => (
            <SectionCard
              key={cat.key}
              title={cat.title}
              icon={cat.icon}
              subtitle={cat.subtitle}
              badgeText={cat.badge}
              confidenceBadge={cat.confidenceBadge}
            >
              {cat.sliders.map((slider) => (
                <SliderRow
                  key={slider.id}
                  label={slider.name}
                  value={(inputs as Record<string, any>)[slider.fieldKey] ?? slider.defaultValue}
                  onChange={(v) => updateInputs({ [slider.fieldKey]: v } as Partial<ExposureInputs>)}
                  min={slider.min}
                  max={slider.max}
                  description={slider.description}
                  tooltip={slider.tooltip}
                  explainText={slider.explainText}
                  scaleLabels={slider.labels}
                />
              ))}
            </SectionCard>
          ))}

          {/* IAT Assessment Panel */}
          <IATAssessmentPanel />
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
            AFI {preview.afi.toFixed(2)}<InfoTip text={TOOLTIPS.afi} /> — {preview.band === 'Fragile' ? 'High governance fragility detected' : preview.band === 'Sensitive' ? 'Drift risk emerging — monitoring required' : 'Governance drift currently contained'}
          </div>

          {/* AFI Components */}
          <div className="mb-3 space-y-[6px]">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">AFI Components</div>
            {[
              { label: 'DR', value: preview.components.dr, name: 'Delegation Ratio', tooltip: TOOLTIPS.dr },
              { label: 'JD', value: preview.components.jd, name: 'Justificatory Density', tooltip: TOOLTIPS.jd },
              { label: 'RC', value: preview.components.rc, name: 'Reversibility Cost', tooltip: TOOLTIPS.rc },
              { label: 'CD', value: preview.components.cd, name: 'Continuation Density', tooltip: TOOLTIPS.cd },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground w-5 cursor-help" title={c.name}>{c.label}<InfoTip text={(c as any).tooltip} /></span>
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
        <button onClick={handleRunAnalysis} className="text-white text-[14px] font-semibold bg-transparent border-none cursor-pointer tracking-[0.01em]">
          ⊕ Generate AI Risk Assessment
        </button>
        <div className="text-[10px] text-white/40 tracking-[0.04em]">
          {inputs.companyName ? `${inputs.companyName} · ` : ''}AFI {preview.afi.toFixed(2)} · {preview.band} · 28 inputs
        </div>
      </div>

      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
