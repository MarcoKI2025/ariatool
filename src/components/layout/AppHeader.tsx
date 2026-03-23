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
  const { perspective, activeStep, analysisComplete, results, inputs } = state;
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const key = perspective === 'company' ? 'company' : String(activeStep);
  const title = VIEW_TITLES[key] || VIEW_TITLES['1'];
  const subtitle = VIEW_SUBTITLES[key] || '';

  const companyName = inputs.companyName || 'No Company Selected';
  const afi = results?.afi;
  const band = results?.band;
  const bandColor = band === 'Stable' ? 'bg-stable text-stable' : band === 'Sensitive' ? 'bg-sensitive text-sensitive' : band === 'Fragile' ? 'bg-fragile text-fragile' : 'bg-muted-foreground/20 text-muted-foreground';
  const bandBg = band === 'Stable' ? 'bg-stable/10 border-stable/30' : band === 'Sensitive' ? 'bg-sensitive/10 border-sensitive/30' : band === 'Fragile' ? 'bg-fragile/10 border-fragile/30' : 'bg-secondary border-border';

  return (
    <header className="h-auto min-h-[56px] bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 flex-shrink-0">
      {/* Left: Company context + View title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Company & AFI badge */}
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${bandBg} flex-shrink-0`}>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-foreground truncate max-w-[140px] sm:max-w-[200px]">{companyName}</div>
            {afi != null ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-bold text-foreground">AFI {afi.toFixed(2)}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${bandColor}/10 ${band === 'Stable' ? 'text-stable' : band === 'Sensitive' ? 'text-sensitive' : 'text-fragile'}`}>
                  {band}
                </span>
              </div>
            ) : (
              <div className="text-[9px] text-muted-foreground mt-0.5">Pending Analysis</div>
            )}
          </div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-border" />
        <div className="min-w-0 hidden sm:block">
          <h1 className="text-[13px] font-semibold text-foreground truncate leading-tight">{title}</h1>
          <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right: Controls */}
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

        {/* Demo - hidden on mobile */}
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-demo-pitch'))}
          className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border border-border"
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
          onClick={() => {
            if (confirm('Reset analysis? All progress will be lost.')) resetAnalysis();
          }}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border border-border"
        >
          ↺ Reset
        </button>

        {/* Status */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${analysisComplete ? 'bg-stable animate-pulse' : 'bg-muted-foreground/40'}`} />
          <span className="text-[10px] text-muted-foreground">{analysisComplete ? 'Ready' : 'Pending'}</span>
        </div>
      </div>

      <MethodologyModal open={methodologyOpen} onOpenChange={setMethodologyOpen} />
    </header>
  );
}
