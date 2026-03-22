import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <aside className="app-sidebar w-full lg:w-[260px] lg:min-w-[260px] bg-card border-r border-border flex flex-col lg:h-screen flex-shrink-0 sticky top-0 z-50 lg:static lg:z-auto">
      {/* Brand */}
      <div className="px-5 lg:px-6 pt-6 lg:pt-7 pb-4 lg:pb-5 border-b border-border relative">
        <div className="flex items-center gap-3 mb-0 lg:mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-[13px] flex-shrink-0 text-white font-bold tracking-tight">AI</div>
          <div>
            <div className="text-[14px] font-semibold text-foreground tracking-tight">AI Governance</div>
            <div className="text-[11px] text-muted-foreground font-normal">Risk Engine v3.0</div>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden ml-auto text-foreground text-xl p-1"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Session status */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border ${
          analysisComplete ? 'bg-stable-bg border-stable-border' : 'bg-secondary border-border'
        }`}>
          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground/40'
          }`} />
          <span className={`text-[11px] font-medium ${
            analysisComplete ? 'text-stable' : 'text-muted-foreground'
          }`}>
            {analysisComplete ? 'Analysis complete' : 'No analysis run'}
          </span>
        </div>
      </div>

      {/* Nav steps */}
      <nav className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-3 py-4 flex-1 overflow-y-auto`}>
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground px-3 pb-3">Workflow</div>

        {/* Company View notice */}
        {perspective === 'company' && (
          <div className="mx-3 mb-3 px-3 py-2.5 rounded-lg border border-stable-border bg-stable-bg text-[11px] font-medium text-stable leading-relaxed">
            ◈ Company View active
            <br/>
            <span className="text-muted-foreground font-normal text-[10px]">Switch to Underwriter View to navigate steps</span>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all relative select-none ${
                isActive ? 'bg-primary/8 text-primary font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-35 cursor-not-allowed' :
                'text-foreground/70 hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-white' :
                isDone ? 'bg-stable text-white' :
                isLocked ? 'bg-border text-muted-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className={`text-[12.5px] leading-tight ${
                  isActive ? 'text-primary font-semibold' :
                  isDone ? 'text-stable' :
                  isLocked ? 'opacity-60' : ''
                }`}>{step.title}</span>
                <span className={`hidden lg:block text-[10px] leading-snug ${
                  isActive ? 'text-primary/60' :
                  isDone ? 'text-stable/60' :
                  'text-muted-foreground'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[10px] opacity-40">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[10px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Perspective switcher */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-4 py-4 border-t border-border`}>
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground pb-2">Perspective</div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => { setPerspective('underwriter'); setMobileNavOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all border flex items-center gap-3 ${
              perspective === 'underwriter'
                ? 'bg-primary/5 border-primary/15 text-primary shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span className="text-[15px] w-5 text-center flex-shrink-0">📊</span>
            <span className="flex-1">
              <span className="block text-[12px] font-semibold">Underwriter</span>
              <span className={`hidden lg:block text-[10px] mt-0.5 ${perspective === 'underwriter' ? 'text-primary/60' : 'text-muted-foreground'}`}>Full analysis · AFI · Loss envelope</span>
            </span>
          </button>
          <button
            onClick={() => { setPerspective('company'); setMobileNavOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all border flex items-center gap-3 ${
              perspective === 'company'
                ? 'bg-stable-bg border-stable/15 text-stable shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span className="text-[15px] w-5 text-center flex-shrink-0">◆</span>
            <span className="flex-1">
              <span className="block text-[12px] font-semibold">Company</span>
              <span className={`hidden lg:block text-[10px] mt-0.5 ${perspective === 'company' ? 'text-stable/60' : 'text-muted-foreground'}`}>Executive summary · Premium levers</span>
            </span>
          </button>
        </div>
      </div>

      {/* Demo shortcuts */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-4 py-3 border-t border-border`}>
        <button
          onClick={() => { document.dispatchEvent(new CustomEvent('open-demo-pitch')); setMobileNavOpen(false); }}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 text-[11px] font-medium transition-all border border-border"
        >
          <span className="text-[10px] text-primary flex-shrink-0">▶</span> Demo Mode · 3-Min Pitch
        </button>
      </div>

      {/* Footer */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-4 py-3 border-t border-border`}>
        <button
          onClick={() => { if (confirm('Reset analysis? All progress will be lost.')) { resetAnalysis(); setMobileNavOpen(false); } }}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-[11px] border border-border hover:border-destructive/30 transition-all"
        >
          <span className="text-[12px]">↺</span> Reset Analysis
        </button>
      </div>
    </aside>
  );
}
