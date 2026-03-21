import React from 'react';
import { useApp } from '@/hooks/useAppState';

export function AppHeader() {
  const { state } = useApp();
  const { perspective, analysisComplete } = state;

  const isCompany = perspective === 'company';
  const title = isCompany
    ? 'Company View · AI Risk Executive Summary'
    : 'Governance Assessment Framework · Structured AI Risk Signal for Committee Review';

  return (
    <header className="h-[52px] bg-chrome border-b border-chrome-border px-[30px] flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-[14px]">
        <span className="text-[10px] tracking-[0.08em] uppercase text-chrome-fg-muted border-r border-chrome-border pr-[14px] font-semibold">
          AI Governance Infrastructure Layer
        </span>
        <span className="text-[12px] font-semibold text-chrome-fg-bright">{title}</span>
      </div>
      <div className="flex items-center gap-[10px]">
        {/* Results status badge */}
        <div className={`inline-flex items-center gap-[6px] px-[10px] py-1 rounded-md border text-[10px] font-semibold tracking-[0.04em] uppercase ${
          analysisComplete
            ? 'bg-stable/10 border-stable/30 text-stable'
            : 'bg-chrome-hover border-chrome-border text-chrome-fg-muted'
        }`}>
          <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-chrome-fg-muted'
          }`} />
          <span>{analysisComplete ? 'Results ready — navigate via sidebar →' : 'No analysis run'}</span>
        </div>
        {/* Decision support badge */}
        <div className="inline-flex items-center gap-[4px] px-[8px] py-1 rounded-md border border-sensitive/30 bg-sensitive/10 text-[9px] font-bold tracking-[0.04em] uppercase text-sensitive">
          ◆ Decision support · Not decision making
        </div>
        <span className="font-mono text-[10px] bg-chrome-hover border border-chrome-border px-2 py-[3px] rounded text-chrome-fg-muted">
          v3.0 · GEE
        </span>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-chrome-accent to-purple-light flex items-center justify-center text-[10px] font-bold text-white">
          AJ
        </div>
      </div>
    </header>
  );
}
