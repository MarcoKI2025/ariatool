import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { MethodologyModal } from '@/features/methodology/MethodologyModal';

const VIEW_TITLES: Record<string, string> = {
  '1': 'Exposure Analysis', '2': 'Decision Intelligence', '3': 'Insurance Decision',
  '4': 'Executive Report', '5': 'Model Governance', '6': 'Portfolio View',
  '7': 'Evidence Log', '8': 'Temporal Tracking', company: 'Company View',
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
        className="h-10 sm:h-12 flex items-center justify-between px-3 sm:px-6 flex-shrink-0"
        style={{
          background: 'hsl(var(--sf))',
          borderBottom: '1px solid hsl(var(--bd))',
        }}
      >
        {/* Breadcrumb — compact on mobile */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] min-w-0 overflow-hidden">
          <span className="font-mono font-medium flex-shrink-0" style={{ color: 'hsl(var(--t3))' }}>
            {activeStep}/11
          </span>
          <span style={{ color: 'hsl(var(--t3))' }}>·</span>
          <span className="font-semibold truncate" style={{ color: 'hsl(var(--tx))' }}>
            {title}
          </span>
          {inputs.companyName && (
            <span className="hidden sm:inline truncate max-w-[160px]" style={{ color: 'hsl(var(--t2))' }}>
              · {inputs.companyName}
            </span>
          )}
        </div>

        {/* Controls — hide less important on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setMethodologyOpen(true)}
            className="hidden sm:inline-flex text-[11px] px-3 py-1.5 rounded border font-medium transition-colors hover:bg-secondary"
            style={{ color: 'hsl(var(--t2))', borderColor: 'hsl(var(--bd))' }}
          >
            Methodology
          </button>
          {results && (
            <button
              onClick={() => {
                if (confirm('Reset analysis? All progress will be lost.')) resetAnalysis();
              }}
              className="hidden sm:inline-flex text-[11px] px-3 py-1.5 rounded border font-medium transition-colors hover:bg-destructive/5 hover:text-destructive"
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
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors capitalize"
                style={{
                  background: perspective === p ? 'hsl(var(--primary))' : 'transparent',
                  color: perspective === p ? 'white' : 'hsl(var(--t2))',
                }}
              >
                {p === 'underwriter' ? 'UW' : 'Co.'}
              </button>
            ))}
          </div>
        </div>
      </header>
      <MethodologyModal open={methodologyOpen} onOpenChange={setMethodologyOpen} />
    </>
  );
}
