import React from 'react';
import { useApp } from '@/hooks/useAppState';


const VIEW_TITLES: Record<string, string> = {
  '1': 'Exposure Analysis',
  '2': 'Decision Intelligence',
  '3': 'Scenario Simulation',
  '4': 'Insurance Decision',
  '5': 'Executive Report',
  '6': 'Model Governance',
  company: 'Company View',
};

const VIEW_SUBTITLES: Record<string, string> = {
  '1': 'Structural AI Risk Assessment',
  '2': 'AI Fragility Index & Signals',
  '3': 'Stress Testing Framework',
  '4': 'Loss Envelope Analysis',
  '5': 'Board-Level Findings',
  '6': 'Methodology & Assumptions',
  company: 'AI Risk Executive Summary',
};

export function AppHeader() {
  const { state, toggleDarkMode } = useApp();
  const { perspective, activeStep, analysisComplete, darkMode } = state;

  const key = perspective === 'company' ? 'company' : String(activeStep);
  const title = VIEW_TITLES[key] || VIEW_TITLES['1'];
  const subtitle = VIEW_SUBTITLES[key] || '';

  return (
    <header className="h-[56px] bg-card border-b border-border px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-[14px] font-semibold text-foreground truncate leading-tight">{title}</h1>
          <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium ${
          analysisComplete
            ? 'bg-stable-bg text-stable'
            : 'bg-secondary text-muted-foreground'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground/40'
          }`} />
          <span>{analysisComplete ? 'Ready' : 'Pending'}</span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-muted-foreground">
          v3.0
        </span>
      </div>
    </header>
  );
}
