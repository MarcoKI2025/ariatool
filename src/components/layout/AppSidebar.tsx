import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

export function AppSidebar() {
  const { state, setActiveStep, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;

  return (
    <aside className="w-[236px] min-w-[236px] bg-chrome flex flex-col h-screen flex-shrink-0">
      {/* Brand */}
      <div className="px-[18px] pt-[22px] pb-[18px] border-b border-chrome-border">
        <div className="flex items-center gap-[10px] mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-light flex items-center justify-center text-sm flex-shrink-0 text-white font-bold">⚡</div>
          <div>
            <div className="text-[13px] font-semibold text-chrome-fg-bright tracking-tight">AI Governance Engine</div>
          </div>
        </div>
        <div className="text-[10px] text-chrome-fg-muted leading-[1.45] mb-3">Governance Assessment · AI Risk Signal<br/>Framework · Committee Decision Support</div>
        {/* Session status */}
        <div className={`flex items-center gap-[6px] px-[10px] py-[6px] rounded-md border ${
          analysisComplete 
            ? 'bg-[#1c1b14] border-stable/30' 
            : 'bg-[#1c1b14] border-chrome-border'
        }`}>
          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-[#484642]'
          }`} />
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${
            analysisComplete ? 'text-stable' : 'text-[#585650]'
          }`}>
            {analysisComplete ? 'Exposure captured' : 'Session not initialised'}
          </span>
        </div>
      </div>

      {/* Nav steps */}
      <nav className="px-[10px] py-3 flex-1 overflow-y-auto">
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-[#585650] px-2 pb-[10px]">Workflow</div>
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
                isActive ? 'bg-[#1e1d14] text-chrome-fg-bright font-semibold' :
                isDone ? 'text-stable' :
                isLocked || isDisabled ? 'opacity-40 cursor-not-allowed' :
                'text-[#a0a09a] hover:bg-[#1e1d14] hover:text-[#d4d0c4]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 font-mono ${
                isActive ? 'bg-primary text-white' :
                isDone ? 'bg-stable text-white' :
                isLocked ? 'bg-[#2a2820] text-[#484642]' :
                'bg-[#262420] text-[#686460]'
              }`}>
                {isDone ? '✓' : step.id}
              </div>
              <div className="flex flex-col gap-[1px] flex-1">
                <span className={`text-[12px] leading-[1.2] ${
                  isActive ? 'text-[#e8e4d8] font-semibold' :
                  isDone ? 'text-stable' :
                  isLocked ? 'opacity-50' : ''
                }`}>{step.title}</span>
                <span className={`text-[9px] tracking-[0.02em] leading-[1.3] ${
                  isActive ? 'text-[#9088c8]' :
                  isDone ? 'text-stable/60' :
                  isLocked ? 'opacity-35 text-[#96938c]' :
                  'text-[#96938c]'
                }`}>{step.sublabel}</span>
              </div>
              {isLocked && <span className="ml-auto text-[9px] opacity-40">🔒</span>}
              {isDone && !isActive && <span className="ml-auto text-[10px] text-stable">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* Perspective switcher */}
      <div className="px-[10px] py-3 border-t border-[#1e1d14]">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#484642] px-0 pb-[6px]">Switch perspective</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setPerspective('underwriter')}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'underwriter'
                ? 'bg-[#1c1a38] border-primary text-[#c0bcf8] shadow-[0_2px_8px_rgba(64,56,184,0.25)]'
                : 'border-[#2a2820] text-[#686460] hover:bg-[#1e1d14] hover:border-[#3a3828] hover:text-[#b0aca0]'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">⊕</span>
            <span className="flex-1">
              <span className={`block text-[11px] font-bold ${perspective === 'underwriter' ? '' : ''}`}>Underwriter View</span>
              <span className={`block text-[9px] mt-[2px] ${perspective === 'underwriter' ? 'text-[#8880d0]' : 'text-[#484642]'}`}>Full structural analysis · AFI · Loss envelope · Committee signals</span>
            </span>
          </button>
          <button
            onClick={() => setPerspective('company')}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'company'
                ? 'bg-[#0e1e10] border-[#1a6030] text-[#70c890] shadow-[0_2px_8px_rgba(20,96,48,0.25)]'
                : 'border-[#2a2820] text-[#686460] hover:bg-[#1e1d14] hover:border-[#3a3828] hover:text-[#b0aca0]'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">◈</span>
            <span className="flex-1">
              <span className={`block text-[11px] font-bold`}>Company View</span>
              <span className={`block text-[9px] mt-[2px] ${perspective === 'company' ? 'text-[#4a9060]' : 'text-[#484642]'}`}>Executive summary · Insurance cost · Premium reduction levers</span>
            </span>
          </button>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-[10px] py-3 border-t border-[#1e1d14]">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-demo-pitch'))}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-[#686460] hover:text-[#a0a09a] text-[12px] transition-colors"
        >
          <span className="text-primary">▶</span> Demo Mode · 3-Min Pitch
        </button>
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md mt-1 text-[#4ab854] hover:text-[#60d870] text-[11px] font-semibold transition-colors bg-gradient-to-r from-[#0d1a0a] to-[#0a1f0a] border border-[#1a4a1a] rounded-[7px]"
        >
          <span>▶</span> Company Demo · 3 Scenarios
        </button>
        <button
          onClick={resetAnalysis}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] mt-2 rounded-md text-[#686460] hover:text-fragile text-[11px] border border-[#2a2820] hover:border-fragile/30 transition-all"
        >
          <span className="text-[12px]">↺</span> <span>Reset Analysis</span>
        </button>
      </div>
    </aside>
  );
}
