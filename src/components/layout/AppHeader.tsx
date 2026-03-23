import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { MethodologyModal } from '@/features/methodology/MethodologyModal';

const VIEW_TITLES: Record<string, string> = {
  '1': 'Exposure Analysis',
  '2': 'Decision Intelligence',
  '3': 'Scenario Simulation',
  '4': 'Insurance Decision',
  '5': 'Executive Report',
  '6': 'Model Governance',
  '7': 'Portfolio View',
  '8': 'Evidence Log',
  '9': 'Integration Hub',
  company: 'Company View',
};

const VIEW_SUBTITLES: Record<string, string> = {
  '1': 'Structural AI Risk Assessment',
  '2': 'AI Fragility Index & Signals',
  '3': 'Stress Testing Framework',
  '4': 'Loss Envelope Analysis',
  '5': 'Board-Level Findings',
  '6': 'Methodology & Assumptions',
  '7': 'Multi-Entity Aggregation',
  '8': 'Audit Trail & Compliance',
  '9': 'Data Feeds · APIs · Ecosystem',
  company: 'AI Risk Executive Summary',
};

export function AppHeader() {
  const { state, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, analysisComplete } = state;
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const key = perspective === 'company' ? 'company' : String(activeStep);
  const title = VIEW_TITLES[key] || VIEW_TITLES['1'];
  const subtitle = VIEW_SUBTITLES[key] || '';

  return (
    <header className="h-auto min-h-[56px] bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 flex-shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-[14px] font-semibold text-foreground truncate leading-tight">{title}</h1>
          <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right: Perspective toggle + Demo + Reset + Status */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        {/* Perspective toggle */}
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setPerspective('underwriter')}
            className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
              perspective === 'underwriter'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            📊 Underwriter
          </button>
          <button
            onClick={() => setPerspective('company')}
            className={`px-3 py-1.5 text-[11px] font-medium transition-colors border-l border-border ${
              perspective === 'company'
                ? 'bg-stable text-white'
                : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            ◆ Company
          </button>
        </div>

        {/* Demo */}
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-demo-pitch'))}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border border-border"
        >
          <span className="text-primary mr-1">▶</span>Demo
        </button>

        {/* Methodology */}
        <button
          onClick={() => setMethodologyOpen(true)}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border border-border"
        >
          📄 Methodology
        </button>

        {/* Reset */}
        <button
          onClick={() => { if (confirm('Reset analysis? All progress will be lost.')) resetAnalysis(); }}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border border-border"
        >
          ↺ Reset
        </button>

        {/* Status badge */}
        <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium ${
          analysisComplete
            ? 'bg-stable-bg text-stable'
            : 'bg-secondary text-muted-foreground'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground/40'
          }`} />
          <span>{analysisComplete ? 'Ready' : 'Pending'}</span>
        </div>

        <span className="hidden md:inline font-mono text-[10px] text-muted-foreground">v3.2</span>
      </div>

      <MethodologyModal open={methodologyOpen} onOpenChange={setMethodologyOpen} />
    </header>
  );
}
