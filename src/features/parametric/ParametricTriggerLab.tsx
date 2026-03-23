import React, { useState, useMemo } from 'react';
import { BetaBanner } from '@/components/shared/BetaBanner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DISCLAIMER = 'EDUCATIONAL SIMULATOR ONLY. ARIA provides structural risk correlations, not binding insurance quotes or regulated pricing. Consult a licensed actuary for actual underwriting.';

interface TriggerConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultThreshold: number;
  defaultCurrent: number;
  description: string;
}

const TRIGGERS: TriggerConfig[] = [
  { label: 'Model Drift', unit: '%', min: 0, max: 50, step: 1, defaultThreshold: 10, defaultCurrent: 4, description: 'Percentage deviation from baseline model performance.' },
  { label: 'Hallucination Rate', unit: '%', min: 0, max: 30, step: 0.5, defaultThreshold: 5, defaultCurrent: 2, description: 'Frequency of factually incorrect or fabricated outputs.' },
  { label: 'Bias Variance', unit: 'σ', min: 0, max: 5, step: 0.1, defaultThreshold: 2.0, defaultCurrent: 0.8, description: 'Standard deviation of fairness metrics across protected groups.' },
];

export function ParametricTriggerLab() {
  const [triggers, setTriggers] = useState(
    TRIGGERS.map(t => ({ threshold: t.defaultThreshold, current: t.defaultCurrent }))
  );

  const results = useMemo(() => {
    return triggers.map((t, i) => ({
      ...TRIGGERS[i],
      threshold: t.threshold,
      current: t.current,
      breached: t.current >= t.threshold,
      proximity: Math.round((t.current / t.threshold) * 100),
    }));
  }, [triggers]);

  const anyBreached = results.some(r => r.breached);
  const allClear = results.every(r => !r.breached);

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-4 relative">
      {/* BETA badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-[9px] font-bold tracking-wider uppercase bg-sensitive-bg text-sensitive border border-sensitive-border rounded">EDUCATIONAL</span>
      </div>

      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">
        🧪 Parametric Trigger Lab — Educational Simulator
      </div>
      <div className="text-[14px] font-bold text-foreground mb-3">Parametric Insurance Trigger Simulation</div>

      {/* Mandatory disclaimer */}
      <div className="rounded-lg p-4 mb-4 border-2 border-fragile bg-fragile-bg">
        <div className="flex items-start gap-2">
          <span className="text-fragile text-lg flex-shrink-0">⛔</span>
          <div className="text-[11px] text-fragile leading-[1.55] font-bold">
            {DISCLAIMER}
          </div>
        </div>
      </div>

      {/* Coverage Status Banner */}
      <div className={`rounded-xl p-4 mb-5 border-2 flex items-center gap-4 ${
        anyBreached ? 'bg-fragile-bg border-fragile' : 'bg-stable-bg border-stable'
      }`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
          anyBreached ? 'bg-fragile' : 'bg-stable'
        }`}>
          {anyBreached ? '⚠' : '✓'}
        </div>
        <div>
          <div className={`text-[18px] font-extrabold ${anyBreached ? 'text-fragile' : 'text-stable'}`}>
            {anyBreached ? 'COVERAGE TRIGGERED' : 'NO TRIGGER — WITHIN TOLERANCE'}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {anyBreached
              ? `${results.filter(r => r.breached).length} of ${results.length} thresholds breached. Parametric payout conditions met.`
              : 'All monitored metrics within defined thresholds. No payout conditions met.'}
          </div>
        </div>
      </div>

      {/* Trigger Controls */}
      <div className="space-y-5 mb-5">
        {results.map((r, i) => (
          <TooltipProvider key={i}>
            <div className={`p-4 rounded-xl border-2 transition-colors ${
              r.breached ? 'bg-fragile-bg border-fragile' : 'bg-card border-border'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[12px] font-semibold text-foreground cursor-help">{r.label}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px] max-w-[200px]">{r.description}</p>
                  </TooltipContent>
                </Tooltip>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  r.breached ? 'bg-fragile text-white' : 'bg-stable text-white'
                }`}>
                  {r.breached ? '🔴 BREACHED' : '🟢 OK'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Threshold slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Threshold</span>
                    <span className="text-[11px] font-mono font-bold text-primary">{r.threshold}{r.unit}</span>
                  </div>
                  <input
                    type="range" min={r.min} max={r.max} step={r.step}
                    value={triggers[i].threshold}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      setTriggers(prev => prev.map((t, j) => j === i ? { ...t, threshold: v } : t));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Current value slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Current Value</span>
                    <span className={`text-[11px] font-mono font-bold ${r.breached ? 'text-fragile' : 'text-stable'}`}>{r.current}{r.unit}</span>
                  </div>
                  <input
                    type="range" min={r.min} max={r.max} step={r.step}
                    value={triggers[i].current}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      setTriggers(prev => prev.map((t, j) => j === i ? { ...t, current: v } : t));
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Proximity bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-muted-foreground">Proximity to Threshold</span>
                  <span className={`text-[9px] font-mono font-bold ${r.proximity >= 100 ? 'text-fragile' : r.proximity >= 75 ? 'text-sensitive' : 'text-stable'}`}>
                    {Math.min(r.proximity, 100)}%
                  </span>
                </div>
                <div className="h-[6px] bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    r.proximity >= 100 ? 'bg-fragile' : r.proximity >= 75 ? 'bg-sensitive' : 'bg-stable'
                  }`} style={{ width: `${Math.min(r.proximity, 100)}%` }} />
                </div>
              </div>
            </div>
          </TooltipProvider>
        ))}
      </div>

      <div className="text-[9px] text-muted-foreground leading-[1.5] italic">
        This simulator demonstrates how parametric insurance triggers work conceptually. All values, thresholds, and payout conditions are illustrative. Not a binding quote or regulatory-approved pricing tool.
      </div>
    </div>
  );
}
