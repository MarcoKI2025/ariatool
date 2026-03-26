import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

interface StepNavigationProps {
  currentStep: number;
  subtitle?: string;
}

export function StepNavigation({ currentStep, subtitle }: StepNavigationProps) {
  const { setActiveStep } = useApp();
  const totalSteps = NAV_STEPS.length;
  const prev = NAV_STEPS.find(s => s.id === currentStep - 1);
  const next = NAV_STEPS.find(s => s.id === currentStep + 1);
  const current = NAV_STEPS.find(s => s.id === currentStep);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border mt-7">
      {prev ? (
        <button
          onClick={() => setActiveStep(prev.id)}
          className="inline-flex items-center gap-1.5 bg-transparent text-secondary-foreground border border-border px-4 py-2 rounded-lg text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer"
        >
          ← {prev.title}
        </button>
      ) : (
        <span />
      )}

      <span className="text-[10px] text-muted-foreground italic hidden sm:inline">
        {subtitle || `Step ${currentStep} of ${totalSteps} · ${current?.sublabel || ''}`}
      </span>

      {next ? (
        <button
          onClick={() => setActiveStep(next.id)}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {next.title} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
