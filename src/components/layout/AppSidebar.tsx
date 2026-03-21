import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;

  return (
    <aside className="w-[236px] min-w-[236px] bg-chrome flex flex-col h-screen flex-shrink-0 border-r border-chrome-border">
      {/* Brand */}
      <div className="px-[18px] pt-[22px] pb-[18px] border-b border-chrome-border">
        <div className="flex items-center gap-[10px] mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chrome-accent to-purple-light flex items-center justify-center text-sm flex-shrink-0 text-white font-bold">⊕</div>
          <div>
            <div className="text-[13px] font-semibold text-chrome-fg-bright tracking-tight">AI Governance Engine</div>
          </div>
        </div>
        <div className="text-[10px] text-chrome-fg-muted leading-[1.45] mb-3">Governance Assessment · AI Risk Signal<br/>Framework · Committee Decision Support</div>
        {/* Session status */}
        <div className={`flex items-center gap-[6px] px-[10px] py-[6px] rounded-md border ${
          analysisComplete 
            ? 'bg-stable/10 border-stable/30' 
            : 'bg-chrome-hover border-chrome-border'
        }`}>
          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-chrome-fg-muted'
          }`} />
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${
            analysisComplete ? 'text-stable' : 'text-chrome-fg-muted'
          }`}>
            {analysisComplete ? 'Exposure captured' : 'Session not initialised'}
          </span>
        </div>
      </div>

      {/* Nav steps */}
      <nav className="px-[10px] py-3 flex-1 overflow-y-auto">
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-chrome-fg-muted px-2 pb-[10px]">Workflow</div>
        {NAV_STEPS.map((step) => {
          const isActive = activeStep === step.id && perspective === 'underwriter';
          const isDone = analysisComplete && step.id === 1;
          const isLocked = !analysisComplete && step.id > 1;
          const isDisabled = perspective === 'company';

          return (
            <button
              key={step.id}
              onClick={() => { if (!isLocked && !isDisabled) { setPerspective('underwriter'); setActiveStep(step.id); } }}
              disabled={isLocked || isDisabled}
              className={`w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] mb-[2px] text-left transition-colors relative select-none ${
                isActive ? 'bg-chrome-active text-chrome-fg-bright font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-30 cursor-not-allowed' :
                'text-chrome-fg hover:bg-chrome-hover'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-white' :
                isDone ? 'bg-stable text-white' :
                isLocked ? 'bg-chrome-hover text-chrome-fg-muted' :
                'bg-chrome-hover text-chrome-fg-muted'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-[1px] flex-1">
                <span className="text-[12px] leading-[1.2]">{step.title}</span>
                <span className={`text-[9px] tracking-[0.02em] leading-[1.3] ${
                  isActive ? 'text-chrome-accent' :
                  isDone ? 'text-stable/60' :
                  'text-chrome-fg-muted'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[9px] text-chrome-fg-muted">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[10px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Perspective switcher */}
      <div className="px-[10px] py-3 border-t border-chrome-border">
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-chrome-fg-muted px-2 pb-2">Switch Perspective</div>
        <button
          onClick={() => setPerspective('underwriter')}
          className={`w-full text-left px-[10px] py-[8px] rounded-md mb-1 transition-colors border ${
            perspective === 'underwriter'
              ? 'bg-chrome-active border-chrome-accent/40 text-chrome-fg-bright'
              : 'border-transparent text-chrome-fg hover:bg-chrome-hover'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[13px]">🔍</span>
            <div>
              <div className="text-[11px] font-semibold">Underwriter View</div>
              <div className="text-[9px] text-chrome-fg-muted mt-[1px]">Full structural analysis · AFI ·<br/>Loss envelope · Committee signals</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => setPerspective('company')}
          className={`w-full text-left px-[10px] py-[8px] rounded-md transition-colors border ${
            perspective === 'company'
              ? 'bg-chrome-active border-chrome-accent/40 text-chrome-fg-bright'
              : 'border-transparent text-chrome-fg hover:bg-chrome-hover'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[13px]">◆</span>
            <div>
              <div className="text-[11px] font-semibold">Company View</div>
              <div className="text-[9px] text-chrome-fg-muted mt-[1px]">Executive summary ·<br/>Insurance cost · Premium<br/>reduction levers</div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer actions */}
      <div className="px-[10px] py-3 border-t border-chrome-border">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-demo-pitch'))}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-chrome-fg hover:text-chrome-fg-bright hover:bg-chrome-hover text-[12px] transition-colors"
        >
          <span className="text-chrome-accent">▶</span> Demo Mode · 3-Min Pitch
        </button>
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-chrome-fg hover:text-chrome-fg-bright hover:bg-chrome-hover text-[12px] transition-colors"
        >
          <span className="text-chrome-accent">◆</span> Company Demo · 3 Scenarios
        </button>
        <button
          onClick={resetAnalysis}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-chrome-fg hover:text-fragile hover:bg-chrome-hover text-[12px] transition-colors"
        >
          <span>↺</span> Reset Analysis
        </button>
      </div>
    </aside>
  );
}
