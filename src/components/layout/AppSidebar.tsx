import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective } = useApp();
  const { perspective, activeStep, analysisComplete } = state;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <aside className="app-sidebar w-full lg:w-[240px] lg:min-w-[240px] bg-card border-r border-border flex flex-col lg:h-screen flex-shrink-0 sticky top-0 z-50 lg:static lg:z-auto">
      {/* Brand */}
      <div className="px-5 lg:px-5 pt-5 lg:pt-6 pb-4 lg:pb-4 border-b border-border relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-[12px] flex-shrink-0 text-white font-bold tracking-tight">AI</div>
          <div>
            <div className="text-[13px] font-semibold text-foreground tracking-tight">AI Governance</div>
            <div className="text-[10px] text-muted-foreground font-normal">Risk Engine v3.0</div>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden ml-auto text-foreground text-xl p-1"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Nav steps */}
      <nav className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-3 py-3 flex-1 overflow-y-auto`}>
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-muted-foreground px-3 pb-2">Workflow</div>

        {/* Company View notice */}
        {perspective === 'company' && (
          <div className="mx-2 mb-2 px-3 py-2 rounded-lg border border-stable-border bg-stable-bg text-[10px] font-medium text-stable leading-relaxed">
            ◈ Company View active
            <br/>
            <span className="text-muted-foreground font-normal text-[9px]">Switch to Underwriter in header</span>
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-left transition-all relative select-none ${
                isActive ? 'bg-primary/8 text-primary font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-35 cursor-not-allowed' :
                'text-foreground/70 hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-white' :
                isDone ? 'bg-stable text-white' :
                isLocked ? 'bg-border text-muted-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-0 flex-1 min-w-0">
                <span className={`text-[11.5px] leading-tight truncate ${
                  isActive ? 'text-primary font-semibold' :
                  isDone ? 'text-stable' :
                  isLocked ? 'opacity-60' : ''
                }`}>{step.title}</span>
                <span className={`hidden lg:block text-[9px] leading-snug truncate ${
                  isActive ? 'text-primary/60' :
                  isDone ? 'text-stable/60' :
                  'text-muted-foreground'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[9px] opacity-40">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[9px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Session status - bottom of sidebar */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-4 py-3 border-t border-border`}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
          analysisComplete ? 'bg-stable-bg border-stable-border' : 'bg-secondary border-border'
        }`}>
          <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground/40'
          }`} />
          <span className={`text-[10px] font-medium ${
            analysisComplete ? 'text-stable' : 'text-muted-foreground'
          }`}>
            {analysisComplete ? 'Analysis complete' : 'No analysis run'}
          </span>
        </div>
      </div>
    </aside>
  );
}
