import React from 'react';
import { useApp } from '@/hooks/useAppState';

export function EvidenceLog() {
  const { state } = useApp();
  const auditLog = state.auditLog || [];

  const exportLog = () => {
    const csv = [
      ['Timestamp', 'Action', 'Details'],
      ...auditLog.map(entry => [
        new Date(entry.timestamp).toISOString(),
        entry.action,
        `"${entry.details.replace(/"/g, '""')}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionLabels: Record<string, string> = {
    analysis_run: 'Analysis Run',
    parameter_change: 'Parameter Change',
    profile_load: 'Profile Loaded',
  };

  const actionColors: Record<string, string> = {
    analysis_run: 'bg-primary/10 text-primary',
    parameter_change: 'bg-sensitive-bg text-sensitive',
    profile_load: 'bg-stable-bg text-stable',
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-primary/70 mb-2">
            Compliance · Audit Trail
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            Evidence Log
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Complete audit trail of all parameter changes and analysis runs. Required for underwriting-grade documentation and regulatory compliance.
          </p>
        </div>
        <button
          onClick={exportLog}
          disabled={auditLog.length === 0}
          className="px-4 py-2 text-[11px] font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          ⬇ Export Log (.csv)
        </button>
      </div>

      {/* Log Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</th>
              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-[12px] text-muted-foreground">
                  No audit entries yet. Run an analysis or change parameters to begin logging.
                </td>
              </tr>
            ) : (
              [...auditLog].reverse().map((entry, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-[11px] text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${actionColors[entry.action] || 'bg-secondary text-foreground'}`}>
                      {actionLabels[entry.action] || entry.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-foreground">
                    {entry.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground font-mono">{auditLog.length}</div>
          <div className="text-[10px] text-muted-foreground mt-1">Total Entries</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground font-mono">
            {auditLog.filter(e => e.action === 'analysis_run').length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Analysis Runs</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground font-mono">
            {auditLog.filter(e => e.action === 'parameter_change').length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Parameter Changes</div>
        </div>
      </div>
    </div>
  );
}
