import React, { useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import {
  calculatePeerComparison,
  getRankingColor,
  getRankingBg,
  getRankingLabel,
} from '@/lib/benchmarking';

export function PeerBenchmarking() {
  const { state } = useApp();
  const { inputs, results } = state;
  const afi = results?.afi || 0;

  const comparison = useMemo(() => {
    if (afi <= 0) return null;
    return calculatePeerComparison(afi, inputs.industry || 'General', inputs);
  }, [afi, inputs]);

  if (!comparison) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground text-sm">Complete exposure analysis to view peer benchmarking.</div>
      </div>
    );
  }

  const { benchmark: bm } = comparison;
  const maxAfi = Math.max(bm.p90 + 0.5, afi + 0.3);
  const pos = (v: number) => `${Math.min(100, Math.max(0, (v / maxAfi) * 100))}%`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-1">◈ Industry Comparison Engine</div>
        <div className="text-[15px] font-bold text-foreground mb-1">Peer Benchmarking Analysis</div>
        <div className="text-[11px] text-secondary-foreground leading-relaxed max-w-[640px]">
          Compare AFI score against <strong>{bm.sampleSize}</strong> peer entities in {bm.industry}.
          Data sourced from {bm.dataSource}.
        </div>
      </div>

      {/* Ranking Hero */}
      <div className={`rounded-xl p-4 sm:p-6 border-2 ${getRankingBg(comparison.ranking)}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">Peer Ranking</div>
            <div className={`text-[22px] sm:text-[28px] font-extrabold ${getRankingColor(comparison.ranking)}`}>
              {getRankingLabel(comparison.ranking)}
            </div>
            <div className="text-[11px] text-secondary-foreground mt-1">{comparison.percentileLabel}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Percentile</div>
            <div className={`text-[36px] font-extrabold font-mono leading-none ${getRankingColor(comparison.ranking)}`}>
              {comparison.percentile}<span className="text-[14px]">th</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Better Than</div>
            <div className="text-[18px] font-bold font-mono text-stable">{comparison.betterThanPercent}%<span className="text-[11px] font-normal text-muted-foreground ml-1">of peers</span></div>
          </div>
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Worse Than</div>
            <div className="text-[18px] font-bold font-mono text-fragile">{comparison.worseThanPercent}%<span className="text-[11px] font-normal text-muted-foreground ml-1">of peers</span></div>
          </div>
        </div>
      </div>

      {/* Distribution Bar */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[12px] font-bold text-foreground mb-3">Industry AFI Distribution</div>
        <div className="relative h-10 bg-secondary rounded-full overflow-hidden mb-2">
          {/* Quartile zones */}
          <div className="absolute inset-y-0 left-0 bg-stable/20 rounded-l-full" style={{ width: pos(bm.p25) }} />
          <div className="absolute inset-y-0 bg-sensitive/20" style={{ left: pos(bm.p25), width: `calc(${pos(bm.p75)} - ${pos(bm.p25)})` }} />
          <div className="absolute inset-y-0 bg-fragile/20 rounded-r-full" style={{ left: pos(bm.p75), right: 0 }} />
          {/* Average marker */}
          <div className="absolute inset-y-0 w-[2px] bg-muted-foreground/50" style={{ left: pos(bm.afiMean) }} />
          {/* Your position */}
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-primary shadow-lg" style={{ left: `calc(${pos(afi)} - 8px)` }} />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>p25: {bm.p25.toFixed(2)}</span>
          <span>Median: {bm.p50.toFixed(2)}</span>
          <span>p75: {bm.p75.toFixed(2)}</span>
          <span>p90: {bm.p90.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> You: {afi.toFixed(2)}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-[2px] bg-muted-foreground/50" /> Avg: {bm.afiMean.toFixed(2)}</span>
        </div>
      </div>

      {/* vs Average + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">vs. Industry Average</div>
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-secondary-foreground">Your AFI:</span>
            <span className="font-mono font-bold text-foreground">{afi.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-secondary-foreground">Industry Avg:</span>
            <span className="font-mono font-bold text-foreground">{bm.afiMean.toFixed(2)}</span>
          </div>
          <div className={`text-[18px] font-bold font-mono mt-2 ${comparison.vsAverage > 0 ? 'text-fragile' : 'text-stable'}`}>
            {comparison.vsAverage >= 0 ? '+' : ''}{comparison.vsAverage.toFixed(2)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {comparison.vsAverage > 0
              ? `${Math.abs(comparison.vsAverage / bm.afiMean * 100).toFixed(0)}% riskier than industry average`
              : `${Math.abs(comparison.vsAverage / bm.afiMean * 100).toFixed(0)}% safer than industry average`}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Industry Risk Distribution</div>
          {[
            { label: 'Stable', pct: bm.stablePercent, color: 'bg-stable' },
            { label: 'Sensitive', pct: bm.sensitivePercent, color: 'bg-sensitive' },
            { label: 'Fragile', pct: bm.fragilePercent, color: 'bg-fragile' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-secondary-foreground w-[70px]">{b.label}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
              </div>
              <span className="text-[10px] font-mono font-medium text-foreground w-[32px] text-right">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[12px] font-bold text-foreground mb-3">Key Differentiators vs. Industry Average</div>
        <div className="space-y-2">
          {comparison.deltas.map((d, i) => {
            const isGood = d.higherIsBad ? d.delta <= 0 : d.delta >= 0;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-foreground">{d.label}</span>
                    <span className={`text-[11px] font-bold font-mono ${isGood ? 'text-stable' : 'text-fragile'}`}>
                      {d.delta >= 0 ? '+' : ''}{d.delta.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-[2px]">
                    You: {d.yours.toFixed(1)} · Avg: {d.avg.toFixed(1)}
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-[2px] rounded ${isGood ? 'bg-stable-bg text-stable' : 'bg-fragile-bg text-fragile'}`}>
                  {isGood ? '✓ OK' : '⚠ GAP'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Path to Top Quartile */}
      {comparison.ranking !== 'best-in-class' && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-5">
          <div className="text-[12px] font-bold text-foreground mb-2">Path to Top Quartile</div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[10px] text-secondary-foreground">Target AFI (p25):</span>
            <span className="text-[16px] font-bold font-mono text-stable">{bm.p25.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">(Current: {afi.toFixed(2)})</span>
          </div>
          <div className="text-[10px] text-muted-foreground mb-3">
            Reduction needed: <strong className="text-foreground">{(bm.p25 - afi).toFixed(2)} points</strong>
          </div>
          <div className="text-[10px] font-bold text-secondary-foreground mb-2">Priority Actions:</div>
          <div className="space-y-1">
            {comparison.deltas.filter(d => d.higherIsBad ? d.delta > 0 : d.delta < 0).map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px] text-secondary-foreground">
                <span className="text-primary flex-shrink-0">→</span>
                <span>
                  {d.higherIsBad
                    ? `Reduce ${d.label.toLowerCase()} towards industry average (${d.avg.toFixed(1)})`
                    : `Increase ${d.label.toLowerCase()} to industry average (${d.avg.toFixed(1)})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-secondary/30 border border-border rounded-xl p-4 flex items-start gap-3">
        <span className="text-muted-foreground text-sm flex-shrink-0">ℹ️</span>
        <div className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-secondary-foreground">Benchmarking Data:</strong> Industry statistics from {bm.sampleSize} anonymized ARIA assessments
          ({bm.dataSource}). Peer comparison is indicative and should be used alongside entity-specific risk assessment.
        </div>
      </div>
    </div>
  );
}
