import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <aside className="app-sidebar w-full lg:w-[236px] lg:min-w-[236px] bg-chrome flex flex-col lg:h-screen flex-shrink-0 sticky top-0 z-50 lg:static lg:z-auto">
      {/* Brand */}
      <div className="px-4 lg:px-[18px] pt-4 lg:pt-[22px] pb-3 lg:pb-[18px] border-b border-chrome-border relative">
        <div className="flex items-center gap-[10px] mb-0 lg:mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-light flex items-center justify-center text-[14px] flex-shrink-0 text-white font-bold">AI</div>
          <div>
            <div className="text-[13px] font-semibold text-chrome-fg-bright tracking-tight">AI Governance Engine</div>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden ml-auto text-chrome-fg-bright text-xl p-1"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
        <div className="hidden lg:block text-[10px] text-chrome-fg-muted leading-[1.45] mb-3">Governance Assessment · AI Risk Signal<br/>Framework · Committee Decision Support</div>

        {/* Session status */}
        <div className={`hidden lg:flex items-center gap-[6px] px-[10px] py-[6px] rounded-md border ${
          analysisComplete ? 'bg-chrome-hover border-stable/40' : 'bg-chrome-hover border-chrome-border'
        }`}>
          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-chrome-border'
          }`} />
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${
            analysisComplete ? 'text-stable' : 'text-chrome-fg-muted'
          }`}>
            {analysisComplete ? 'Exposure captured' : 'Session not initialised'}
          </span>
        </div>
      </div>

      {/* Nav steps */}
      <nav className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 flex-1 overflow-y-auto`}>
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-chrome-fg-muted px-2 pb-[10px]">Workflow</div>

        {/* Company View notice */}
        {perspective === 'company' && (
          <div className="mx-2 mb-3 px-[10px] py-2 rounded-[7px] border border-stable-border bg-stable-bg text-[9px] font-semibold leading-[1.5] text-stable">
            ◈ Company View active
            <br/>
            <span className="text-secondary-foreground font-normal">Switch to Underwriter View to navigate analysis steps</span>
          </div>
        )}

        {NAV_STEPS.map((step) => {
          const isActive = activeStep === step.id && perspective === 'underwriter';
          const isDone = analysisComplete && step.id === 1;
          const isLocked = !analysisComplete && step.id > 1;
          const isDisabled = perspective === 'company';

          return (
            <button
              key={step.id}
              onClick={() => { if (!isLocked && !isDisabled) { setPerspective('underwriter'); setActiveStep(step.id); setMobileNavOpen(false); } }}
              disabled={isLocked || isDisabled}
              className={`w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] mb-[2px] text-left transition-colors relative select-none ${
                isActive ? 'bg-chrome-active text-chrome-fg-bright font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-40 cursor-not-allowed' :
                'text-chrome-fg hover:bg-chrome-hover hover:text-chrome-fg-bright'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-white' :
                isDone ? 'bg-stable text-white' :
                isLocked ? 'bg-chrome-border text-chrome-fg-muted' :
                'bg-chrome-hover text-chrome-fg-muted'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-[1px] flex-1">
                <span className={`text-[12px] leading-[1.2] ${
                  isActive ? 'text-chrome-fg-bright font-semibold' :
                  isDone ? 'text-stable' :
                  isLocked ? 'opacity-60' : ''
                }`}>{step.title}</span>
                <span className={`hidden lg:block text-[9px] tracking-[0.02em] leading-[1.3] ${
                  isActive ? 'text-chrome-accent' :
                  isDone ? 'text-stable/70' :
                  'text-chrome-fg-muted'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[9px] opacity-40">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[10px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Perspective switcher */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-chrome-border`}>
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-chrome-fg-muted px-0 pb-[6px]">Switch perspective</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => { setPerspective('underwriter'); setMobileNavOpen(false); }}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'underwriter'
                ? 'bg-primary/15 border-primary text-primary shadow-[0_2px_8px_hsl(var(--primary)/0.2)]'
                : 'border-chrome-border text-chrome-fg-muted hover:bg-chrome-hover hover:text-chrome-fg-bright'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">📊</span>
            <span className="flex-1">
              <span className="block text-[11px] font-bold">Underwriter View</span>
              <span className={`hidden lg:block text-[9px] mt-[2px] ${perspective === 'underwriter' ? 'text-primary/80' : 'text-chrome-fg-muted'}`}>Full structural analysis · AFI · Loss envelope · Committee signals</span>
            </span>
          </button>
          <button
            onClick={() => { setPerspective('company'); setMobileNavOpen(false); }}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'company'
                ? 'bg-stable/15 border-stable text-stable shadow-[0_2px_8px_hsl(var(--stable)/0.2)]'
                : 'border-chrome-border text-chrome-fg-muted hover:bg-chrome-hover hover:text-chrome-fg-bright'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">◆</span>
            <span className="flex-1">
              <span className="block text-[11px] font-bold">Company View</span>
              <span className={`hidden lg:block text-[9px] mt-[2px] ${perspective === 'company' ? 'text-stable/80' : 'text-chrome-fg-muted'}`}>Executive summary · Insurance cost · Premium reduction levers</span>
            </span>
          </button>
        </div>
      </div>

      {/* Demo shortcuts */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-chrome-border`}>
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-chrome-fg-muted px-2 pb-[6px]">Demo Shortcuts</div>
        <button
          onClick={() => { document.dispatchEvent(new CustomEvent('open-demo-pitch')); setMobileNavOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-chrome-fg hover:text-chrome-fg-bright hover:bg-chrome-active hover:translate-x-[2px] text-[11px] font-medium transition-all border border-chrome-border bg-chrome-hover mb-[6px]"
        >
          <span className="text-[9px] text-primary flex-shrink-0">▶</span> Demo Mode · 3-Min Pitch
        </button>
        <button
          onClick={() => { document.dispatchEvent(new CustomEvent('open-company-demo')); setMobileNavOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-chrome-fg hover:text-chrome-fg-bright hover:bg-chrome-active hover:translate-x-[2px] text-[11px] font-medium transition-all border border-chrome-border bg-chrome-hover"
        >
          <span className="text-[9px] text-primary flex-shrink-0">▶</span> Company Demo · 3 Scenarios
        </button>
      </div>

      {/* Footer */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-chrome-border`}>
        <button
          onClick={() => { if (confirm('Reset analysis? All progress will be lost.')) { resetAnalysis(); setMobileNavOpen(false); } }}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-chrome-fg-muted hover:text-fragile hover:bg-chrome-hover text-[11px] border border-chrome-border hover:border-fragile/30 transition-all mt-1"
        >
          <span className="text-[12px]">↺</span> Reset Analysis
        </button>
      </div>
    </aside>
  );
}
