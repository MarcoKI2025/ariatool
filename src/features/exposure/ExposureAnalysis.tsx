import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useApp } from '@/hooks/useAppState';
import { computeLivePreview } from '@/lib/scoring';
import { USE_CASES, PROVIDERS, INDUSTRIES, COMPANY_SIZES, REVENUE_RANGES } from '@/lib/constants';
import { SliderRow, SectionCard, InfoTip } from '@/components/shared/UIComponents';
import { DEMO_PROFILES, applyDemoProfile, computeDemoProfilePreview } from '@/lib/demoData';
import { ExposureResults } from './ExposureResults';
import { SLIDER_CATEGORIES } from '@/lib/sliderConfigs';
import { TOOLTIPS } from '@/lib/tooltips';
import { ExposureInputs } from '@/lib/types';

import { CaseStudyPanel } from '@/features/case-studies/CaseStudyPanel';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { RealCaseFactsCard } from '@/features/demo/RealCaseFactsCard';

const PROGRESS_STEPS = ['Company', 'Core AFI', 'Agent', 'Liability', 'Governance', 'Systemic'];

export function ExposureAnalysis() {
  const { state, updateInputs, setInputs, runAnalysis } = useApp();
  const { inputs, analysisComplete } = state;
  const [dismissedWelcome, setDismissedWelcome] = useState(false);
  const [showForm, setShowForm] = useState(!analysisComplete);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToTop = useCallback(() => {
    const main = document.querySelector('.app-content');
    if (main) main.scrollTo(0, 0);
  }, []);

  const handleRunAnalysis = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      runAnalysis();
      setTimeout(() => {
        setIsLoading(false);
        setShowForm(false);
        scrollToTop();
      }, 500);
    }, 5000);
  }, [runAnalysis, scrollToTop]);

  const preview = useMemo(() => computeLivePreview(inputs), [inputs]);

  // Listen for "show form" event from results view
  useEffect(() => {
    const handler = () => {
      setShowForm(true);
      setTimeout(() => document.querySelector('.app-content')?.scrollTo(0, 0), 50);
    };
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
  const hasCoreAFI = inputs.automation > 1 || inputs.executionAuthority > 1 || inputs.oversightLevel > 1;
  const hasAgent = inputs.multiAgent > 1 || inputs.toolCallAuthority > 1;
  const hasLiability = inputs.hallucinationLiability > 1 || inputs.deepfakeFraud > 1;
  const hasGov = inputs.shadowAI > 1 || inputs.explainabilityGap > 1;
  const hasSystemic = inputs.cloudConcentration > 1 || inputs.modelConcentration > 1;
  const progressIdx = hasSystemic ? 5 : hasGov ? 4 : hasLiability ? 3 : hasAgent ? 2 : hasCoreAFI ? 1 : hasCompany ? 1 : 0;

  return (
    <div className="overflow-x-hidden">

      {/* Welcome banner — compact on mobile */}
      {!dismissedWelcome && !analysisComplete && (
        <div className="bg-card border border-border rounded-lg p-3 sm:p-5 mb-3 sm:mb-5 relative">
          <h2 className="text-[14px] sm:text-[16px] font-bold text-foreground mb-0.5 sm:mb-1">Configure AI Risk Profile</h2>
          <p className="text-[11px] sm:text-[12px]" style={{ color: 'hsl(var(--t2))' }}>
            Complete all sections below. Results unlock after running analysis.
          </p>
          <button onClick={() => setDismissedWelcome(true)} className="absolute top-2 right-2 sm:top-3 sm:right-3 text-muted-foreground hover:text-foreground text-sm" title="Dismiss">✕</button>
        </div>
      )}

      <div className="mb-3 sm:mb-6">
        <div className="label-xs mb-1">Step 1 of 10 · Entry Point</div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1 tracking-tight">Exposure Analysis</h1>
        <p className="text-[11px] sm:text-[13px] text-muted-foreground max-w-[580px] leading-relaxed hidden sm:block">
          Configure the AI deployment profile. All downstream outputs derive exclusively from this input.
        </p>
      </div>

      {/* Analysis status — compact on mobile */}
      <div className={`flex items-start gap-2 sm:gap-[10px] p-2.5 sm:p-[11px] px-3 sm:px-[15px] rounded-lg mb-3 sm:mb-[18px] border transition-all ${
        analysisComplete ? 'bg-stable-bg border-stable-border' : 'bg-secondary border-border'
      }`}>
        <div className="text-xs sm:text-sm flex-shrink-0 mt-[1px]">{analysisComplete ? '✓' : '🔒'}</div>
        <div>
          <div className={`text-[11px] sm:text-[12px] font-semibold mb-[2px] ${analysisComplete ? 'text-stable' : 'text-foreground'}`}>
            {analysisComplete ? 'Analysis complete.' : 'Complete analysis to unlock all downstream outputs.'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-secondary-foreground leading-[1.5] hidden sm:block">
            {analysisComplete ? 'All downstream steps are now calibrated to the submitted profile.' : 'Every downstream signal is computed from the submitted profile, not pre-filled.'}
          </div>
        </div>
      </div>

      {/* Demo profiles — wrapping chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DEMO_PROFILES.map((p, i) => (
          <button
            key={i}
            onClick={() => setInputs(applyDemoProfile(p))}
            className="px-3 py-1.5 rounded border text-[11px] font-medium transition-colors whitespace-nowrap"
            style={{
              background: 'hsl(var(--sf))',
              borderColor: 'hsl(var(--bd))',
              color: 'hsl(var(--t2))',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--primary))';
              (e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--bd))';
              (e.currentTarget as HTMLElement).style.color = 'hsl(var(--t2))';
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Progress bar — compact on mobile */}
      <div className="mb-3 sm:mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] sm:text-[10px] font-medium" style={{ color: 'hsl(var(--t3))' }}>Profile completion</span>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold" style={{ color: 'hsl(var(--primary))' }}>{progressIdx + 1} / 6</span>
        </div>
        <div className="h-1 sm:h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${((progressIdx + 1) / 6) * 100}%`, background: 'hsl(var(--primary))' }} />
        </div>
        <div className="hidden sm:flex justify-between mt-1">
          {['Company', 'Core AFI', 'Agent', 'Liability', 'Governance', 'Systemic'].map((label, i) => (
            <span key={i} className="text-[9px] font-medium" style={{ color: i <= progressIdx ? 'hsl(var(--primary))' : 'hsl(var(--t3))' }}>{label}</span>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
        {/* Left: form */}
        <div>
          {/* Company Profile */}
          <SectionCard title="Company Profile" icon="🏢" subtitle="Establish the entity and its AI deployment context for structural risk classification.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-3">
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
        </div>

        {/* Right: Live interpretation panel */}
        <div className="bg-card border border-border rounded-[10px] p-4 lg:sticky lg:top-2">
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

      {/* Case Study Library */}
      <CaseStudyPanel />

      {/* Bottom action bar — tighter on mobile */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 flex flex-col items-center gap-1 sm:gap-2 px-3 sm:px-10 py-2.5 sm:py-5 z-10 bg-background">
        <button
          onClick={handleRunAnalysis}
          className="w-full max-w-4xl bg-gradient-to-r from-[hsl(250,70%,56%)] to-[hsl(250,80%,62%)] hover:from-[hsl(250,70%,50%)] hover:to-[hsl(250,80%,56%)] text-white text-[12px] sm:text-[15px] font-semibold rounded-xl py-3 sm:py-4 px-4 sm:px-8 border-none cursor-pointer tracking-[0.01em] shadow-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
        >
          Generate AI Risk Assessment →
        </button>
        <div className="text-[9px] sm:text-[11px] text-muted-foreground tracking-[0.03em] text-center hidden sm:block">
          Computes Risk Score · Insurance Cost Range · Regulatory Signal · Board-Ready Report
        </div>
      </div>

      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
