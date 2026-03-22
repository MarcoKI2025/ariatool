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
      <nav className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 flex-1 overflow-y-auto`}>
        <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-[#585650] px-2 pb-[10px]">Workflow</div>
        
        {/* Company View notice */}
        {perspective === 'company' && (
          <div className="mx-2 mb-3 px-[10px] py-2 rounded-[7px] border text-[9px] font-semibold leading-[1.5]" style={{ background: '#0e1a0e', borderColor: '#1a4028', color: '#60d090' }}>
            ◈ Company View active
            <br/>
            <span style={{ color: '#4a9060', fontWeight: 400 }}>Switch to Underwriter View to navigate analysis steps</span>
          </div>
        )}

        {NAV_STEPS.map((step) => {
          const isActive = activeStep === step.id && perspective === 'underwriter';
          const isDone = analysisComplete && step.id === 1;
          // All steps except Step 1 are locked until analysis completes
          const isLocked = !analysisComplete && step.id > 1;
          const isDisabled = perspective === 'company';

          return (
            <button
              key={step.id}
              onClick={() => { if (!isLocked && !isDisabled) { setPerspective('underwriter'); setActiveStep(step.id); setMobileNavOpen(false); } }}
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
                <span className={`hidden lg:block text-[9px] tracking-[0.02em] leading-[1.3] ${
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
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-[#1e1d14]`}>
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#484642] px-0 pb-[6px]">Switch perspective</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => { setPerspective('underwriter'); setMobileNavOpen(false); }}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'underwriter'
                ? 'bg-[#1c1a38] border-primary text-[#c0bcf8] shadow-[0_2px_8px_rgba(64,56,184,0.25)]'
                : 'border-[#2a2820] text-[#686460] hover:bg-[#1e1d14] hover:border-[#3a3828] hover:text-[#b0aca0]'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">📊</span>
            <span className="flex-1">
              <span className="block text-[11px] font-bold">Underwriter View</span>
              <span className={`hidden lg:block text-[9px] mt-[2px] ${perspective === 'underwriter' ? 'text-[#8880d0]' : 'text-[#484642]'}`}>Full structural analysis · AFI · Loss envelope · Committee signals</span>
            </span>
          </button>
          <button
            onClick={() => { setPerspective('company'); setMobileNavOpen(false); }}
            className={`w-full text-left px-[14px] py-[11px] rounded-lg transition-all border flex items-center gap-[10px] ${
              perspective === 'company'
                ? 'bg-[#0e1e10] border-[#1a6030] text-[#70c890] shadow-[0_2px_8px_rgba(20,96,48,0.25)]'
                : 'border-[#2a2820] text-[#686460] hover:bg-[#1e1d14] hover:border-[#3a3828] hover:text-[#b0aca0]'
            }`}
          >
            <span className="text-[16px] w-6 text-center flex-shrink-0">◆</span>
            <span className="flex-1">
              <span className="block text-[11px] font-bold">Company View</span>
              <span className={`hidden lg:block text-[9px] mt-[2px] ${perspective === 'company' ? 'text-[#4a9060]' : 'text-[#484642]'}`}>Executive summary · Insurance cost · Premium reduction levers</span>
            </span>
          </button>
        </div>
      </div>

      {/* Demo shortcuts */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-[#1e1d14]`}>
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#585650] px-2 pb-[6px]">Demo Shortcuts</div>
        <button
          onClick={() => { document.dispatchEvent(new CustomEvent('open-demo-pitch')); setMobileNavOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#c0bca8] hover:text-[#e8e4d8] hover:bg-[#201e14] hover:translate-x-[2px] text-[11px] font-medium transition-all border border-[#2e2c22] bg-[#1a1910] mb-[6px]"
        >
          <span className="text-[9px] text-primary flex-shrink-0">▶</span> Demo Mode · 3-Min Pitch
        </button>
        <button
          onClick={() => { document.dispatchEvent(new CustomEvent('open-company-demo')); setMobileNavOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#c0bca8] hover:text-[#e8e4d8] hover:bg-[#201e14] hover:translate-x-[2px] text-[11px] font-medium transition-all border border-[#2e2c22] bg-[#1a1910]"
        >
          <span className="text-[9px] text-primary flex-shrink-0">▶</span> Company Demo · 3 Scenarios
        </button>
      </div>

      {/* Footer */}
      <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block px-[10px] py-3 border-t border-[#1e1d14]`}>
        <button
          onClick={() => { if (confirm('Reset analysis? All progress will be lost.')) { resetAnalysis(); setMobileNavOpen(false); } }}
          className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-md text-[#686460] hover:text-fragile hover:bg-[#1a1910] text-[11px] border border-[#2a2820] hover:border-fragile/30 transition-all mt-1"
        >
          <span className="text-[12px]">↺</span> Reset Analysis
        </button>
      </div>
    </aside>
  );
}
