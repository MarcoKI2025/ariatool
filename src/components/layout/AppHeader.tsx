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

      {/* Governance Intelligence Layer Banner */}
      <div className="hidden md:flex items-center gap-[10px] px-4 lg:px-[30px] py-[10px] flex-shrink-0 border-b border-chrome-border bg-chrome">
        <span className="text-[14px] flex-shrink-0 text-chrome-fg-muted">◈</span>
        <span className="text-[11px] leading-[1.5] flex-1 text-chrome-fg-muted">
          <strong className="text-chrome-fg-bright font-semibold">Governance Intelligence Layer — Not a standalone underwriting or pricing engine.</strong>{' '}
          Outputs are structural governance signals and directional estimates for committee review.
          Loss figures are market-calibrated proxies, not actuarially certified.
          Self-attested inputs. No backtesting. Use with actuarial validation for binding decisions.
        </span>
        <div className="hidden lg:inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded text-[9px] font-bold tracking-[0.07em] uppercase flex-shrink-0 whitespace-nowrap bg-primary text-primary-foreground">
          ◈ Decision Support · Not Decision Making
        </div>
      </div>
    </>
  );
}
