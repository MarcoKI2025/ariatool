import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;

  return (
    <aside className="w-[236px] min-w-[236px] bg-nav flex flex-col h-screen flex-shrink-0 border-r border-nav-border">
      {/* Brand */}
      <div className="px-[18px] pt-[22px] pb-[18px] border-b border-[hsl(40,8%,12%)]">
        <div className="flex items-center gap-[10px] mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-light flex items-center justify-center text-sm flex-shrink-0 text-primary-foreground font-bold">⊕</div>
          <div>
            <div className="text-[13px] font-semibold text-foreground tracking-tight">AI Governance Engine</div>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground leading-[1.45] mb-3">Structured Governance Assessment Framework</div>
        {/* Session status */}
        <div className="flex items-center gap-[6px] px-[10px] py-[6px] bg-secondary rounded-md border border-border">
          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-[hsl(40,6%,28%)]'
          }`} />
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${
            analysisComplete ? 'text-stable' : 'text-muted-foreground'
          }`}>
            {analysisComplete ? 'Exposure captured' : 'Session not initialised'}
          </span>
        </div>
      </div>

      {/* Perspective switcher */}
      <div className="px-[10px] pt-3 pb-2">
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-muted-foreground px-2 pb-2">Perspective</div>
        <button
          onClick={() => setPerspective('underwriter')}
          className={`w-full text-left px-[10px] py-[8px] rounded-md mb-1 transition-colors ${
            perspective === 'underwriter'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50'
          }`}
        >
          <div className="text-[11px] font-semibold">Underwriter View</div>
          <div className="text-[9px] opacity-60 mt-[2px]">Full structural analysis · AFI · Loss envelope</div>
        </button>
        <button
          onClick={() => setPerspective('company')}
          className={`w-full text-left px-[10px] py-[8px] rounded-md transition-colors ${
            perspective === 'company'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50'
          }`}
        >
          <div className="text-[11px] font-semibold">Company View</div>
          <div className="text-[9px] opacity-60 mt-[2px]">Executive summary · Insurance cost · Levers</div>
        </button>
      </div>

      {/* Nav steps */}
      <nav className="px-[10px] py-3 flex-1 overflow-y-auto">
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-muted-foreground px-2 pb-[10px]">Underwriter Workflow</div>
        {NAV_STEPS.map((step) => {
          const isActive = activeStep === step.id && perspective === 'underwriter';
          const isDone = analysisComplete && step.id === 1;
          const isLocked = !analysisComplete && step.id > 1;
          const isDisabled = perspective === 'company';

          return (
            <button
              key={step.id}
              onClick={() => !isLocked && !isDisabled && setActiveStep(step.id)}
              disabled={isLocked || isDisabled}
              className={`w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] mb-[2px] text-left transition-colors relative select-none ${
                isActive ? 'bg-secondary text-foreground font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-40 cursor-not-allowed' :
                'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-primary-foreground' :
                isDone ? 'bg-stable text-primary-foreground' :
                isLocked ? 'bg-[hsl(40,8%,15%)] text-[hsl(40,6%,28%)]' :
                'bg-[hsl(40,8%,13%)] text-muted-foreground'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-[1px] flex-1">
                <span className="text-[12px] leading-[1.2]">{step.title}</span>
                <span className={`text-[9px] tracking-[0.02em] leading-[1.3] ${
                  isActive ? 'text-purple-light' :
                  isDone ? 'text-stable/60' :
                  'text-muted-foreground/60'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[9px] opacity-40">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[10px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-[10px] py-3 border-t border-[hsl(40,8%,8%)]">
        <button
          onClick={() => {
            // Will be handled by demo overlay
            document.dispatchEvent(new CustomEvent('open-demo-pitch'));
          }}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-muted-foreground hover:text-foreground text-[12px] transition-colors"
        >
          <span>▶</span> Demo Mode · 3-Min Pitch
        </button>
        <button
          onClick={() => {
            document.dispatchEvent(new CustomEvent('open-company-demo'));
          }}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-muted-foreground hover:text-foreground text-[12px] transition-colors"
        >
          <span>🏢</span> Company Demo · 3 Scenarios
        </button>
        <button
          onClick={resetAnalysis}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-muted-foreground hover:text-destructive text-[12px] transition-colors"
        >
          <span>↺</span> Reset Analysis
        </button>
      </div>
    </aside>
  );
}
