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
    <header className="h-[52px] bg-card border-b border-border px-[30px] flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-[14px]">
        <span className="text-[10px] tracking-[0.08em] uppercase text-muted-foreground border-r border-border pr-[14px] font-semibold">
          AI Governance Infrastructure Layer
        </span>
        <span className="text-[12px] font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-[10px]">
        <div className={`inline-flex items-center gap-[6px] px-[10px] py-1 rounded-md border text-[10px] font-semibold tracking-[0.04em] uppercase ${
          analysisComplete
            ? 'bg-stable-bg border-stable-border text-stable'
            : 'bg-secondary border-border text-muted-foreground'
        }`}>
          <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
            analysisComplete ? 'bg-stable animate-pulse-dot' : 'bg-muted-foreground'
          }`} />
          <span>{analysisComplete ? 'Results ready' : 'No analysis run'}</span>
        </div>
        <span className="font-mono text-[10px] bg-secondary border border-border px-2 py-[3px] rounded text-muted-foreground">
          v3.0 · GEE
        </span>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-light flex items-center justify-center text-[10px] font-bold text-primary-foreground">
          AJ
        </div>
      </div>
    </header>
  );
}
