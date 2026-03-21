import React, { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useAppState';
import { DEMO_PROFILES, applyDemoProfile } from '@/lib/demoData';

export function CompanyDemoOverlay() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const { setInputs, runAnalysis, setPerspective } = useApp();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('open-company-demo', handler);
    return () => document.removeEventListener('open-company-demo', handler);
  }, []);

  const demoProfiles = DEMO_PROFILES;

  const launch = () => {
    if (selected === null) return;
    const profile = demoProfiles[selected];
    setInputs(applyDemoProfile(profile));
    setTimeout(() => {
      runAnalysis();
      setPerspective('company');
      setOpen(false);
      setSelected(null);
    }, 100);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm overflow-y-auto flex flex-col" onClick={() => setOpen(false)}>
      <div className="max-w-[960px] w-full mx-auto p-10 pb-16" onClick={e => e.stopPropagation()}>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="flex items-start justify-between mb-9">
            <div>
              <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-stable mb-2 flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-stable animate-pulse-dot" />
                Company Demo · 3 Scenarios
              </div>
              <div className="text-4xl font-bold text-foreground tracking-tight leading-[1.1] mb-[10px]">
                See the <span className="text-stable">Executive View</span> in action
              </div>
              <div className="text-sm text-muted-foreground max-w-[520px] leading-relaxed">
                Select a pre-configured company profile to see the full Company View with risk level, insurance cost estimate, and premium reduction recommendations.
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground flex items-center justify-center text-base">✕</button>
          </div>

          <div className="grid grid-cols-3 gap-[14px] mb-8">
            {demoProfiles.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`text-left bg-secondary border rounded-xl p-5 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-[2px] flex flex-col gap-[10px] relative overflow-hidden ${
                  selected === i ? 'border-stable bg-stable-bg' : 'border-border'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl opacity-60 ${
                  p.band === 'Fragile' ? 'bg-gradient-to-r from-fragile to-fragile/50' :
                  p.band === 'Sensitive' ? 'bg-gradient-to-r from-sensitive to-sensitive/50' :
                  'bg-gradient-to-r from-stable to-stable/50'
                }`} />
                <div className="text-sm font-bold text-foreground">{p.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{p.industry}</div>
                <div className="text-[10px] text-muted-foreground leading-[1.55] flex-1">{p.description}</div>
                <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-[3px] rounded w-fit ${
                  p.band === 'Fragile' ? 'badge-fragile' : p.band === 'Sensitive' ? 'badge-sensitive' : 'badge-stable'
                }`}>{p.band}</div>
                <div className="text-[11px] font-bold font-mono text-muted-foreground">{p.premiumEstimate}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={launch}
              disabled={selected === null}
              className="inline-flex items-center gap-[10px] px-8 py-[14px] bg-primary border border-primary text-primary-foreground rounded-[10px] text-[13px] font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>▶</span>
              <span>{selected !== null ? `Launch ${demoProfiles[selected].name}` : 'Select a scenario above'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoPitchOverlay() {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const handler = () => { setOpen(true); setSlide(0); };
    document.addEventListener('open-demo-pitch', handler);
    return () => document.removeEventListener('open-demo-pitch', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setSlide(s => Math.min(s + 1, slides.length - 1)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setSlide(s => Math.max(s - 1, 0)); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const slides = [
    {
      eyebrow: 'The Problem',
      title: 'AI Creates Risk That Insurance Cannot See',
      subtitle: 'Traditional compliance checklists and underwriting models were built for software, not for autonomous AI systems.',
      stats: [
        { value: '73%', label: 'of enterprises have no AI-specific risk governance' },
        { value: '€8.2B', label: 'estimated unpriced AI liability exposure in EU insurance market' },
        { value: '0', label: 'standardised frameworks exist for AI underwriting' },
      ],
    },
    {
      eyebrow: 'Invisible Structural Risk',
      title: 'Three Risks Insurance Doesn\'t Price',
      subtitle: 'These risks are structural — they exist regardless of compliance status.',
      bullets: [
        { icon: '⚡', title: 'Continuation Risk', desc: 'The system persists without re-authorisation — accumulating liability with no upper bound.' },
        { icon: '🔗', title: 'Dependency Lock-In', desc: 'Cannot be exited without disruption — structural entrenchment creates single points of failure.' },
        { icon: '🌐', title: 'Cross-System Propagation', desc: 'Failure amplifies across operational layers — non-linear loss escalation.' },
      ],
    },
    {
      eyebrow: 'The Framework',
      title: 'Authority Fragility Index (AFI)',
      subtitle: 'AFI = (DR × RC × CD) / (JD × NA)',
      bullets: [
        { icon: '📊', title: 'Delegation Ratio (DR)', desc: 'How much decision authority is delegated to AI without human review.' },
        { icon: '🔒', title: 'Reversibility Cost (RC)', desc: 'How difficult and expensive it is to exit or replace the AI system.' },
        { icon: '🌐', title: 'Continuation Density (CD)', desc: 'How deeply integrated the system is across operations.' },
        { icon: '👁', title: 'Justificatory Density (JD)', desc: 'How transparent and auditable governance processes are.' },
      ],
    },
    {
      eyebrow: 'Live Example',
      title: 'Meridian Financial Group',
      subtitle: 'High-frequency autonomous trading · Single-provider dependency · Minimal human oversight',
      stats: [
        { value: '1.72', label: 'AFI Score — Fragile' },
        { value: '€420k–€680k', label: 'Estimated Annual Premium' },
        { value: 'ECI-3', label: 'Critical Infrastructure Classification' },
      ],
    },
    {
      eyebrow: 'How It Works',
      title: '6-Step Structured Assessment',
      subtitle: 'Each step builds on the previous — creating a coherent governance signal.',
      bullets: [
        { icon: '1', title: 'Exposure Analysis', desc: '29 structured inputs covering deployment, agentic, liability, and systemic risk.' },
        { icon: '2', title: 'Decision Intelligence', desc: 'AFI scoring, ECI classification, and multi-dimensional risk characterization.' },
        { icon: '3', title: 'Scenario Simulation', desc: 'Stress testing across 4 failure scenarios with cascade propagation.' },
        { icon: '4', title: 'Insurance Decision', desc: 'Loss envelope, underwriting signals, and committee decision framework.' },
        { icon: '5', title: 'Executive Report', desc: 'Board-level output suitable for risk committees and reinsurers.' },
        { icon: '6', title: 'Model Governance', desc: 'Methodology, assumptions, limitations, and product roadmap.' },
      ],
    },
    {
      eyebrow: 'Why Underwriters Care',
      title: 'Portfolio-Level Correlated Risk',
      subtitle: 'When multiple insureds share AI infrastructure, a single disruption creates simultaneous claims.',
      stats: [
        { value: '3.4–5.6×', label: 'Cascade amplification vs. isolated incidents' },
        { value: '5 layers', label: 'Propagation depth across operational systems' },
        { value: '€280M+', label: 'Potential portfolio aggregate from shared AI infrastructure' },
      ],
    },
    {
      eyebrow: 'Buyer Value',
      title: 'From Cost Centre to Competitive Advantage',
      subtitle: 'Companies that improve their governance profile save significantly on AI insurance premiums.',
      stats: [
        { value: '25–40%', label: 'Premium reduction from governance improvements' },
        { value: '3 actions', label: 'Concrete recommendations with estimated savings' },
        { value: '90 days', label: 'Typical improvement timeline for material change' },
      ],
    },
    {
      eyebrow: 'Next Steps',
      title: 'Ready to Assess Your Portfolio?',
      subtitle: 'Run a demo with pre-built scenarios or configure your own exposure analysis. Full results in under 3 minutes.',
      bullets: [
        { icon: '▶', title: 'Try a Demo Profile', desc: 'Pre-configured scenarios: Fragile, Sensitive, and Stable.' },
        { icon: '⊕', title: 'Run Your Own Assessment', desc: 'Configure 29 inputs and generate a full structural risk analysis.' },
        { icon: '📋', title: 'Export for Committee', desc: 'Board-level executive summary, ORSA extract, and plain-text export.' },
      ],
    },
  ];

  if (!open) return null;

  const s = slides[slide];

  return (
    <div className="fixed inset-0 z-[2000] bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((slide + 1) / slides.length) * 100}%` }} />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4">
        <span className="text-[11px] font-mono text-muted-foreground">{slide + 1} / {slides.length}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">AI Governance Engine · 3-Min Pitch</span>
          <button onClick={() => setOpen(false)} className="px-4 py-[6px] border border-border rounded-lg text-[11px] text-muted-foreground hover:text-foreground">Exit Demo</button>
        </div>
      </div>
      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center px-20">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-primary mb-4">{s.eyebrow}</div>
            <h2 className="text-5xl font-bold text-foreground tracking-tight mb-4 leading-[1.1]">{s.title}</h2>
            <p className="text-lg text-secondary-foreground">{s.subtitle}</p>
          </div>

          {/* Stats grid */}
          {s.stats && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {s.stats.map((st, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-[32px] font-bold font-mono text-primary leading-none mb-2">{st.value}</div>
                  <div className="text-[11px] text-muted-foreground">{st.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Bullets */}
          {s.bullets && (
            <div className={`grid ${s.bullets.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mt-8`}>
              {s.bullets.map((b, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-bold flex-shrink-0">{b.icon}</div>
                  <div>
                    <div className="text-[12px] font-bold text-foreground mb-1">{b.title}</div>
                    <div className="text-[11px] text-muted-foreground leading-[1.5]">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-6">
        <button onClick={() => setSlide(s2 => Math.max(0, s2 - 1))} disabled={slide === 0} className="px-5 py-[8px] border border-border rounded-lg text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-30">← Back</button>
        <div className="flex gap-[6px]">
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === slide ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <button onClick={() => slide < slides.length - 1 ? setSlide(s2 => s2 + 1) : setOpen(false)} className="px-5 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold">
          {slide < slides.length - 1 ? 'Next →' : 'Close'}
        </button>
      </div>
    </div>
  );
}
