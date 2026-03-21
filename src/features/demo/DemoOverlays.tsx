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

  const launch = () => {
    if (selected === null) return;
    const profile = DEMO_PROFILES[selected];
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
    <div className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-sm overflow-y-auto flex flex-col" onClick={() => setOpen(false)}>
      <div className="max-w-[960px] w-full mx-auto p-10 pb-16" onClick={e => e.stopPropagation()}>
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
          {DEMO_PROFILES.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`text-left bg-[hsl(40,8%,7%)] border rounded-xl p-5 transition-all hover:border-[hsl(40,8%,20%)] hover:bg-[hsl(40,8%,9%)] hover:-translate-y-[2px] hover:shadow-xl flex flex-col gap-[10px] relative overflow-hidden ${
                selected === i ? 'border-stable bg-[hsl(145,20%,5%)]' : 'border-[hsl(40,8%,13%)]'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl opacity-60 ${
                p.band === 'Fragile' ? 'bg-gradient-to-r from-fragile to-[hsl(7,60%,50%)]' :
                p.band === 'Sensitive' ? 'bg-gradient-to-r from-sensitive to-[hsl(36,80%,45%)]' :
                'bg-gradient-to-r from-stable to-[hsl(145,50%,40%)]'
              }`} />
              <div className="text-[26px]">{p.icon}</div>
              <div className="text-sm font-bold text-foreground">{p.name}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{p.industry}</div>
              <div className="text-[10px] text-muted-foreground leading-[1.55] flex-1">{p.note}</div>
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
            className="inline-flex items-center gap-[10px] px-8 py-[14px] bg-gradient-to-br from-stable to-[hsl(145,40%,30%)] border border-stable text-[hsl(145,60%,80%)] rounded-[10px] text-[13px] font-bold hover:shadow-lg hover:-translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>▶</span>
            <span>{selected !== null ? `Launch ${DEMO_PROFILES[selected].name}` : 'Select a scenario above'}</span>
          </button>
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
    { title: 'The Problem', subtitle: 'AI creates structural risk that existing frameworks cannot see', body: 'Traditional compliance checklists and underwriting models were built for software, not for autonomous AI systems that persist, accumulate authority, and create dependency without explicit re-authorisation.' },
    { title: 'Invisible Structural Risk', subtitle: 'Three risks insurance doesn\'t price', body: 'Continuation risk: the system persists without re-authorisation. Dependency lock-in: cannot be exited without disruption. Cross-system propagation: failure amplifies across operational layers.' },
    { title: 'The Framework', subtitle: 'Authority Fragility Index (AFI)', body: 'AFI measures how fragile an organisation\'s AI governance architecture is — specifically, how much decision authority has been delegated without proportionate oversight, reversibility, or re-authorisation cadence.' },
    { title: 'Live Example', subtitle: 'Meridian Financial Group — Fragile classification', body: 'High-frequency autonomous trading with deep infrastructure integration, single-provider dependency, and minimal human oversight. AFI 1.72 — above underwriting tolerance threshold.' },
    { title: 'How It Works', subtitle: '6-step structured assessment', body: 'Exposure Analysis → Risk Overview → Dependency Map → Insurance Decision → Executive Report → Model Governance. Each step builds on the previous, creating a coherent governance signal from entry to board-level output.' },
    { title: 'Why Underwriters Care', subtitle: 'Portfolio-level correlated risk', body: 'When multiple insureds share AI infrastructure and providers, a single disruption creates simultaneous claims across the portfolio. Standard models understate this by 3-5×. This engine quantifies the gap.' },
    { title: 'Buyer Value', subtitle: 'From cost centre to competitive advantage', body: 'Companies that improve their governance profile save 25-40% on AI insurance premiums. The assessment provides a concrete roadmap — three targeted improvements, each with estimated premium savings.' },
    { title: 'Next Steps', subtitle: 'Ready to assess your portfolio?', body: 'Run a demo with one of three pre-built scenarios, or configure your own exposure analysis. Full results in under 3 minutes — suitable for committee presentation immediately.' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-[hsl(40,8%,3%)] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((slide + 1) / slides.length) * 100}%` }} />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4">
        <span className="text-[11px] font-mono text-muted-foreground">{slide + 1} / {slides.length}</span>
        <button onClick={() => setOpen(false)} className="px-4 py-[6px] border border-border rounded-lg text-[11px] text-muted-foreground hover:text-foreground">Exit Demo</button>
      </div>
      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center px-20">
        <div className="max-w-2xl text-center">
          <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-primary mb-4">AI Governance Engine · Demo</div>
          <h2 className="text-5xl font-bold text-foreground tracking-tight mb-4">{slides[slide].title}</h2>
          <p className="text-lg text-secondary-foreground mb-6">{slides[slide].subtitle}</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">{slides[slide].body}</p>
        </div>
      </div>
      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-6">
        <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0} className="px-5 py-[8px] border border-border rounded-lg text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-30">← Back</button>
        <div className="flex gap-[6px]">
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === slide ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <button onClick={() => slide < slides.length - 1 ? setSlide(s => s + 1) : setOpen(false)} className="px-5 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold">
          {slide < slides.length - 1 ? 'Next →' : 'Close'}
        </button>
      </div>
    </div>
  );
}
