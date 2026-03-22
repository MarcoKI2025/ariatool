import React, { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useAppState';
import { DEMO_PROFILES, applyDemoProfile } from '@/lib/demoData';
import { DemoPitchModal } from './DemoPitchModal';

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
  const { setInputs, runAnalysis, setPerspective, setActiveStep } = useApp();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('open-demo-pitch', handler);
    return () => document.removeEventListener('open-demo-pitch', handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      const meridian = DEMO_PROFILES[0];
      setInputs(applyDemoProfile(meridian));
      setTimeout(() => {
        runAnalysis();
        setPerspective('underwriter');
        setActiveStep(1);
      }, 100);
    };
    document.addEventListener('load-demo-meridian', handler);
    return () => document.removeEventListener('load-demo-meridian', handler);
  }, [setInputs, runAnalysis, setPerspective]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.perspective) setPerspective(detail.perspective);
      if (detail?.step) setActiveStep(detail.step);
    };
    document.addEventListener('navigate-to-step', handler);
    return () => document.removeEventListener('navigate-to-step', handler);
  }, [setPerspective, setActiveStep]);

  return <DemoPitchModal open={open} onClose={() => setOpen(false)} />;
}
