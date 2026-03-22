import React from 'react';
import { useApp } from '@/hooks/useAppState';

const VIEW_TITLES: Record<string, string> = {
  '1': 'Decision Intelligence System · Structural AI Risk Operating Layer',
  '2': 'Decision Intelligence System · Structural AI Risk Operating Layer',
  '3': 'Scenario Simulation · Stress Testing Framework',
  '4': 'Insurance Decision · Loss Envelope Analysis',
  '5': 'Executive Report · Board-Level Findings',
  '6': 'Model Governance · Methodology & Assumptions',
  company: 'Company View · AI Risk Executive Summary',
};

export function AppHeader() {
  const { state, toggleDarkMode } = useApp();
  const { perspective, activeStep, analysisComplete, darkMode } = state;

  const title = perspective === 'company'
    ? VIEW_TITLES.company
    : VIEW_TITLES[String(activeStep)] || VIEW_TITLES['1'];

  return (
    <>
      {/* Main header */}
      <header className="h-[52px] bg-card border-b border-border px-4 lg:px-[30px] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-[14px] min-w-0">
          <span className="hidden md:inline text-[10px] tracking-[0.08em] uppercase text-muted-foreground border-r border-border pr-[14px] font-semibold flex-shrink-0">
            AI Governance Infrastructure Layer
          </span>
          <span className="text-[12px] font-semibold text-foreground truncate">{title}</span>
        </div>
        <div className="flex items-center gap-[10px] flex-shrink-0">
          <div className={`hidden sm:inline-flex items-center gap-[6px] px-[10px] py-1 rounded-md border text-[10px] font-semibold tracking-[0.04em] uppercase ${
            analysisComplete
              ? 'bg-stable-bg border-stable-border text-stable'
              : 'bg-secondary border-border text-muted-foreground'
          }`}>
            <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
              analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground'
            }`} />
            <span>{analysisComplete ? 'Results ready' : 'No analysis run'}</span>
          </div>
          <span className="hidden md:inline font-mono text-[10px] bg-secondary border border-border px-2 py-[3px] rounded text-muted-foreground">
            v3.0 · GEE
          </span>
          <button
            onClick={toggleDarkMode}
            className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-[12px] hover:bg-muted transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀' : '🌙'}
          </button>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-light flex items-center justify-center text-[10px] font-bold text-white">
            AI
          </div>
        </div>
      </header>

      {/* Use Restriction Banner */}
      <div className="flex items-center gap-[8px] px-4 lg:px-[30px] py-[7px] flex-shrink-0 border-b bg-fragile-bg border-fragile-border">
        <span className="text-[10px] text-fragile font-bold flex-shrink-0">⚠</span>
        <span className="text-[10px] text-fragile font-semibold tracking-[0.02em]">
          FOR DEMONSTRATION, EVALUATION & INTERNAL STRUCTURING PURPOSES ONLY — Not for binding underwriting, regulatory submission, or capital allocation decisions.
        </span>
      </div>

      {/* Governance Intelligence Layer Banner */}
      <div className="hidden md:flex items-center gap-[10px] px-4 lg:px-[30px] py-[10px] flex-shrink-0 border-b" style={{ background: '#1a1910', borderColor: '#3a3828' }}>
        <span className="text-[14px] flex-shrink-0" style={{ color: '#a8a49c' }}>◈</span>
        <span className="text-[11px] leading-[1.5] flex-1" style={{ color: '#a8a49c' }}>
          <strong style={{ color: '#c0bcdc', fontWeight: 600 }}>Governance Intelligence Layer — Not a standalone underwriting or pricing engine.</strong>{' '}
          Outputs are structural governance signals and directional estimates for committee review.
          Loss figures are market-calibrated proxies, not actuarially certified.
          Self-attested inputs. No backtesting. Use with actuarial validation for binding decisions.
        </span>
        <div className="hidden lg:inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded text-[9px] font-bold tracking-[0.07em] uppercase flex-shrink-0 whitespace-nowrap" style={{ background: '#4038b8', color: '#fff', borderRadius: '4px' }}>
          ◈ Decision Support · Not Decision Making
        </div>
      </div>
    </>
  );
}
