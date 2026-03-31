import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { NAV_STEPS } from '@/lib/constants';

const NAV_SECTIONS = [
  { label: 'Assessment', steps: [1, 2, 3] },
  { label: 'Results', steps: [4, 5, 6] },
  { label: 'Portfolio', steps: [7, 8] },
  { label: 'Advanced', steps: [9, 10] },
];

export function AppSidebar() {
  const { state, setActiveStep, setPerspective } = useApp();
  const { perspective, activeStep, analysisComplete, results } = state;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside
      className="app-sidebar w-full lg:w-[240px] lg:min-w-[240px] flex flex-col lg:h-screen flex-shrink-0 sticky top-0 z-50 lg:static lg:z-auto"
      style={{ background: 'hsl(var(--nav))', borderRight: '1px solid hsl(var(--nav-border))' }}
    >
      {/* Brand */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid hsl(var(--nav-border))' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] flex-shrink-0 font-bold tracking-tight"
            style={{ background: 'hsl(var(--primary))', color: 'white' }}
          >
            A
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-tight" style={{ color: 'hsl(var(--nav-fg-active))' }}>
              ARIA
            </div>
            <div className="text-[10px] font-normal" style={{ color: 'hsl(var(--nav-label))' }}>
              Risk Engine v4.3
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto text-lg p-1"
            style={{ color: 'white' }}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* AFI Status pill */}
      {analysisComplete && results && (
        <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block px-4 pt-3 pb-1`}>
          <div className="px-3 py-2.5 rounded-lg" style={{ background: 'hsl(var(--nav-active-bg))', border: '1px solid hsl(var(--nav-border))' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'hsl(var(--nav-label))' }}>
                Current Assessment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold font-mono" style={{ color: 'hsl(var(--nav-fg-active))' }}>
                AFI {results.afi.toFixed(2)}
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded"
                style={{
                  background: results.band === 'Stable' ? 'hsl(var(--stable) / 0.2)' : results.band === 'Sensitive' ? 'hsl(var(--sensitive) / 0.2)' : 'hsl(var(--fragile) / 0.2)',
                  color: results.band === 'Stable' ? 'hsl(var(--stable))' : results.band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--fragile))',
                }}
              >
                {results.band.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`${mobileOpen ? 'block' : 'hidden'} lg:block px-3 py-3 flex-1 overflow-y-auto`}>
        <div className="space-y-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div
                className="px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] uppercase"
                style={{ color: 'hsl(var(--nav-label))' }}
              >
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.steps.map((stepId) => {
                  const step = NAV_STEPS.find((s) => s.id === stepId);
                  if (!step) return null;
                  const isActive = activeStep === step.id && perspective === 'underwriter';
                  const isLocked = !analysisComplete && step.id > 1;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        if (!isLocked) {
                          setPerspective('underwriter');
                          setActiveStep(step.id);
                          setMobileOpen(false);
                        }
                      }}
                      disabled={isLocked}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors text-[12px] font-medium"
                      style={{
                        background: isActive ? 'hsl(var(--nav-active-bg))' : 'transparent',
                        color: isActive
                          ? 'white'
                          : isLocked
                          ? 'hsl(var(--nav-border))'
                          : 'hsl(var(--nav-fg))',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {step.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
