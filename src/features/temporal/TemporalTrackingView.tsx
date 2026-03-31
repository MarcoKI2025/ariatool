import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { useTemporalTracking } from '@/lib/temporal-tracking';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function TemporalTrackingView() {
  const { state } = useApp();
  const { inputs, results } = state;
  const entityName = inputs.companyName || 'Current Entity';

  const { snapshots, analysis, addSnapshot, clearSnapshots } = useTemporalTracking(entityName);

  const handleSaveSnapshot = () => {
    if (results) {
      addSnapshot({
        afi: results.afi,
        agri: results.agri || 0,
        scri: results.compositeRiskIndex || 0,
        alri: results.alri || 0,
        mdr: results.mdr || 0,
        assessmentType: 'Triggered',
        notes: 'Manual snapshot',
      });
    }
  };

  const chartData = snapshots.map(s => ({
    date: new Date(s.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    AFI: parseFloat(s.afi.toFixed(2)),
    AGRI: parseFloat(s.agri.toFixed(2)),
  }));

  if (!results) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="text-3xl mb-3">📈</div>
        <div className="text-[13px] font-semibold">Complete Exposure Analysis first</div>
        <div className="text-[11px] mt-1">Run an analysis to start temporal tracking</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-bold text-foreground tracking-tight">
            📈 Temporal Analysis
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1">
            Risk evolution over time for <span className="font-semibold text-foreground">{entityName}</span> · {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveSnapshot}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-semibold hover:bg-primary/90 transition-colors"
          >
            💾 Save Snapshot
          </button>
          {snapshots.length > 0 && (
            <button
              onClick={clearSnapshots}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-[11px] font-medium hover:bg-secondary/80 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {snapshots.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="text-[36px] mb-3">📊</div>
          <div className="text-[14px] font-semibold text-foreground mb-1">No Historical Data Yet</div>
          <div className="text-[11px] text-muted-foreground mb-4">
            Save your first snapshot to start tracking risk evolution over time.
          </div>
          <button
            onClick={handleSaveSnapshot}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors"
          >
            Save First Snapshot
          </button>
        </div>
      )}

      {/* Current snapshot summary */}
      {snapshots.length > 0 && (
        <>
          <SectionDivider title="Current Position" icon="📍" subtitle="Latest recorded metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'AFI', value: results.afi.toFixed(2), sub: results.band },
              { label: 'AGRI', value: (results.agri || 0).toFixed(2), sub: 'Agentic Risk' },
              { label: 'SCRI', value: (results.compositeRiskIndex || 0).toFixed(2), sub: 'Composite' },
              { label: 'Snapshots', value: snapshots.length.toString(), sub: `Since ${new Date(snapshots[0].timestamp).toLocaleDateString('de-DE')}` },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-lg px-4 py-3">
                <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</div>
                <div className="text-[20px] font-bold font-mono text-foreground mt-0.5">{item.value}</div>
                <div className="text-[9px] text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trend analysis */}
      {analysis && snapshots.length >= 2 && (
        <>
          <SectionDivider title="Trend Analysis" icon="📉" subtitle="Velocity, projections, and alerts" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'TREND',
                value: analysis.afiTrend,
                color: analysis.afiTrend === 'Improving' ? 'text-stable' : analysis.afiTrend === 'Stable' ? 'text-sensitive' : 'text-fragile',
              },
              {
                label: 'VELOCITY',
                value: `${analysis.afiVelocity >= 0 ? '+' : ''}${analysis.afiVelocity.toFixed(4)}/d`,
                color: analysis.afiVelocity <= 0 ? 'text-stable' : 'text-fragile',
              },
              {
                label: '30-DAY PROJECTION',
                value: analysis.projectedAFI30Days.toFixed(2),
                color: analysis.projectedAFI30Days > 1.35 ? 'text-fragile' : analysis.projectedAFI30Days > 0.85 ? 'text-sensitive' : 'text-stable',
              },
              {
                label: '90-DAY PROJECTION',
                value: analysis.projectedAFI90Days.toFixed(2),
                color: analysis.projectedAFI90Days > 1.35 ? 'text-fragile' : analysis.projectedAFI90Days > 0.85 ? 'text-sensitive' : 'text-stable',
              },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-lg px-4 py-3">
                <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</div>
                <div className={`text-[16px] font-bold font-mono mt-0.5 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {analysis.alerts.length > 0 && (
            <div className="space-y-2">
              {analysis.alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-3 text-[11px] border ${
                    alert.severity === 'critical'
                      ? 'bg-fragile-bg border-fragile-border text-fragile'
                      : alert.severity === 'warning'
                      ? 'bg-sensitive-bg border-sensitive-border text-sensitive'
                      : 'bg-stable-bg border-stable-border text-stable'
                  }`}
                >
                  <span className="font-bold uppercase mr-2">{alert.severity}</span>
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <SectionDivider title="Risk Metrics Over Time" icon="📈" />
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                    }}
                  />
                  <ReferenceLine y={0.85} stroke="hsl(var(--stable))" strokeDasharray="5 5" label={{ value: 'Stable', fontSize: 9, fill: 'hsl(var(--stable))' }} />
                  <ReferenceLine y={1.35} stroke="hsl(var(--fragile))" strokeDasharray="5 5" label={{ value: 'Fragile', fontSize: 9, fill: 'hsl(var(--fragile))' }} />
                  <Line type="monotone" dataKey="AFI" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="AGRI" stroke="hsl(var(--sensitive))" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Snapshot history */}
      {snapshots.length > 0 && (
        <>
          <SectionDivider title="Snapshot History" icon="🗂️" subtitle={`${snapshots.length} recorded assessments`} />
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border">
                    <th className="px-4 py-2.5 text-left font-bold text-muted-foreground uppercase tracking-wide text-[9px]">Date</th>
                    <th className="px-4 py-2.5 text-right font-bold text-muted-foreground uppercase tracking-wide text-[9px]">AFI</th>
                    <th className="px-4 py-2.5 text-right font-bold text-muted-foreground uppercase tracking-wide text-[9px]">AGRI</th>
                    <th className="px-4 py-2.5 text-right font-bold text-muted-foreground uppercase tracking-wide text-[9px]">SCRI</th>
                    <th className="px-4 py-2.5 text-left font-bold text-muted-foreground uppercase tracking-wide text-[9px]">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[...snapshots].reverse().map(s => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2 text-foreground">{new Date(s.timestamp).toLocaleString('de-DE')}</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-foreground">{s.afi.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-mono text-muted-foreground">{s.agri.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-mono text-muted-foreground">{s.scri.toFixed(2)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{s.assessmentType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="text-[9px] text-muted-foreground/60 text-center pt-4 border-t border-border">
        Temporal tracking uses local storage. Snapshots persist across sessions but are device-specific. Export functionality planned for v4.4.
      </div>

      <StepNavigation currentStep={9} />
    </div>
  );
}
