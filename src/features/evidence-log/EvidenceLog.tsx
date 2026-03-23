import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { AppFooter } from '@/components/shared/AppFooter';

export function EvidenceLog() {
  const { state, clearAuditLog } = useApp();
  const auditLog = state.auditLog || [];

  const exportLog = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportId = `ARIA-${Date.now().toString(36).toUpperCase()}`;

    let csv = `"ARIA AI Governance Engine - Audit Trail Export"\n`;
    csv += `"Report ID: ${reportId}"\n`;
    csv += `"Export Date: ${new Date().toLocaleString()}"\n`;
    csv += `"Total Entries: ${auditLog.length}"\n`;
    csv += `"Assessment Period: ${auditLog.length > 0 ? new Date(auditLog[0].timestamp).toISOString() : 'N/A'} to ${auditLog.length > 0 ? new Date(auditLog[auditLog.length - 1].timestamp).toISOString() : 'N/A'}"\n`;
    csv += `\n`;
    csv += `"Timestamp","Action","Details"\n`;

    auditLog.forEach(entry => {
      csv += `"${new Date(entry.timestamp).toISOString()}","${entry.action}","${entry.details.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARIA_Audit_Log_${reportId}_${timestamp}.csv`;
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
      <UseRestrictionBanner />
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
        <div className="flex gap-2">
          <button
            onClick={clearAuditLog}
            disabled={auditLog.length === 0}
            className="px-4 py-2 text-[11px] font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap border border-destructive/20"
          >
            🗑 Clear Log
          </button>
          <button
            onClick={exportLog}
            disabled={auditLog.length === 0}
            className="px-4 py-2 text-[11px] font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            ⬇ Export Log (.csv)
          </button>
        </div>
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

      <AppFooter />
    </div>
  );
}
