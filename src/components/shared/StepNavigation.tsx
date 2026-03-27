import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

interface StepNavigationProps {
  currentStep: number;
  subtitle?: string;
}

export function StepNavigation({ currentStep, subtitle }: StepNavigationProps) {
  const { setActiveStep } = useApp();
  const prev = NAV_STEPS.find(s => s.id === currentStep - 1);
  const next = NAV_STEPS.find(s => s.id === currentStep + 1);

  return (
    <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
      <div>
        {prev && (
          <button
            onClick={() => setActiveStep(prev.id)}
            className="text-[12px] font-medium transition-colors"
            style={{ color: 'hsl(var(--t2))' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--primary))')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--t2))')}
          >
            ← {prev.title}
          </button>
        )}
      </div>
      <div>
        {next && (
          <button
            onClick={() => setActiveStep(next.id)}
            className="text-[12px] font-medium transition-colors"
            style={{ color: 'hsl(var(--primary))' }}
          >
            {next.title} →
          </button>
        )}
      </div>
    </div>
  );
}
