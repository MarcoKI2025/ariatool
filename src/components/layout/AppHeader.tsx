import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { MethodologyModal } from '@/features/methodology/MethodologyModal';

const VIEW_TITLES: Record<string, string> = {
  '1': 'Exposure Analysis', '2': 'Decision Intelligence', '3': 'Scenario Simulation',
  '4': 'Insurance Decision', '5': 'Executive Report', '6': 'Model Governance',
  '7': 'Portfolio View', '8': 'Evidence Log', '9': 'Integration Hub',
  '10': 'Recursive Risk', '11': 'Temporal Tracking', company: 'Company View',
};

export function AppHeader() {
  const { state, setPerspective, resetAnalysis } = useApp();
  const { perspective, activeStep, inputs, results } = state;
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const key = perspective === 'company' ? 'company' : String(activeStep);
  const title = VIEW_TITLES[key] || 'ARIA';

  return (
    <>
      <header
        className="h-12 flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
        style={{
          background: 'hsl(var(--sf))',
          borderBottom: '1px solid hsl(var(--bd))',
        }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] min-w-0">
          <span className="font-mono font-medium" style={{ color: 'hsl(var(--t3))' }}>
            Step {activeStep} of 11
          </span>
          <span style={{ color: 'hsl(var(--t3))' }}>·</span>
          <span className="font-semibold truncate" style={{ color: 'hsl(var(--tx))' }}>
            {title}
          </span>
          {inputs.companyName && (
            <>
              <span style={{ color: 'hsl(var(--t3))' }}>·</span>
              <span className="truncate max-w-[160px]" style={{ color: 'hsl(var(--t2))' }}>
                {inputs.companyName}
              </span>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMethodologyOpen(true)}
            className="text-[11px] px-3 py-1.5 rounded border font-medium transition-colors hover:bg-secondary"
            style={{ color: 'hsl(var(--t2))', borderColor: 'hsl(var(--bd))' }}
          >
            Methodology
          </button>
          {results && (
            <button
              onClick={() => {
                if (confirm('Reset analysis? All progress will be lost.')) resetAnalysis();
              }}
              className="text-[11px] px-3 py-1.5 rounded border font-medium transition-colors hover:bg-destructive/5 hover:text-destructive"
              style={{ color: 'hsl(var(--t2))', borderColor: 'hsl(var(--bd))' }}
            >
              Reset
            </button>
          )}
          {/* Perspective toggle */}
          <div className="flex items-center rounded border overflow-hidden" style={{ borderColor: 'hsl(var(--bd))' }}>
            {(['underwriter', 'company'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPerspective(p)}
                className="px-2.5 py-1 rounded text-[11px] font-medium transition-colors capitalize"
                style={{
                  background: perspective === p ? 'hsl(var(--primary))' : 'transparent',
                  color: perspective === p ? 'white' : 'hsl(var(--t2))',
                }}
              >
                {p === 'underwriter' ? 'Underwriter' : 'Company'}
              </button>
            ))}
          </div>
        </div>
      </header>
      <MethodologyModal open={methodologyOpen} onOpenChange={setMethodologyOpen} />
    </>
  );
}
