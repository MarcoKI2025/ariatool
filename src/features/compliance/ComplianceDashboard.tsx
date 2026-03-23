import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import {
  EU_AI_ACT_REQUIREMENTS,
  calculateComplianceSummary,
  getStatusColor,
  getStatusBg,
  getStatusLabel,
} from '@/lib/compliance';

export function ComplianceDashboard() {
  const { state } = useApp();
  const { inputs, results } = state;
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (!results?.afi) return null;
    return calculateComplianceSummary(inputs, results);
  }, [inputs, results]);

  if (!summary || !results) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground text-sm">Complete exposure analysis to check EU AI Act compliance.</div>
      </div>
    );
  }

  const handleExportCSV = () => {
    let csv = '"EU AI Act Compliance Report"\n';
    csv += `"Generated","${new Date().toISOString()}"\n`;
    csv += `"Entity","${inputs.companyName || 'Not specified'}"\n`;
    csv += `"AFI Score","${results.afi.toFixed(2)}"\n\n`;
    csv += '"Article","Title","Status","Score","Gaps","Recommendations"\n';
    EU_AI_ACT_REQUIREMENTS.forEach(req => {
      const a = req.checkFunction(inputs, results);
      csv += `"${req.article}","${req.title}","${a.status}","${a.score.toFixed(0)}%","${a.gaps.join('; ')}","${a.recommendations.join('; ')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url; el.download = `EU_AI_Act_Compliance_${Date.now()}.csv`; el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-1">🇪🇺 Regulatory Compliance Engine</div>
        <div className="text-[15px] font-bold text-foreground mb-1">EU AI Act Compliance Dashboard</div>
        <div className="text-[11px] text-secondary-foreground leading-relaxed max-w-[640px]">
          Assessment against EU Artificial Intelligence Act (Regulation 2024/1689) requirements.
          Full enforcement for high-risk AI: <strong>August 2, 2026</strong>.
          Non-compliance penalties up to <strong>€35M or 7% of global revenue</strong>.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-3 sm:p-4 rounded-xl border ${getStatusBg(summary.overallStatus)}`}>
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Overall Status</div>
          <div className={`text-[16px] sm:text-[20px] font-bold ${getStatusColor(summary.overallStatus)}`}>
            {getStatusLabel(summary.overallStatus)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{summary.overallScore.toFixed(0)}% Compliant</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Articles Assessed</div>
          <div className="text-[20px] font-bold font-mono text-foreground">{EU_AI_ACT_REQUIREMENTS.length}</div>
          <div className="text-[10px] text-muted-foreground mt-1">
            <span className="text-stable">{summary.compliantCount} ✓</span>{' · '}
            <span className="text-sensitive">{summary.partialCount} ⚠</span>{' · '}
            <span className="text-fragile">{summary.nonCompliantCount} ✗</span>
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Gaps Identified</div>
          <div className={`text-[20px] font-bold font-mono ${summary.totalGaps > 3 ? 'text-fragile' : 'text-sensitive'}`}>{summary.totalGaps}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{summary.criticalGaps.length} Critical</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Remediation Cost</div>
          <div className="text-[16px] sm:text-[18px] font-bold font-mono text-foreground">{summary.remediationCostRange}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{summary.timeToCompliance}</div>
        </div>
      </div>

      {/* Penalty Warning */}
      {summary.overallStatus !== 'compliant' && (
        <div className="bg-fragile-bg border border-fragile-border rounded-xl p-4 flex items-start gap-3">
          <span className="text-fragile text-lg flex-shrink-0">⚠</span>
          <div>
            <div className="text-[11px] font-bold text-fragile mb-1">Regulatory Penalty Risk</div>
            <div className="text-[11px] text-secondary-foreground leading-relaxed">
              Current non-compliance exposes organization to EU AI Act penalties of <strong className="text-fragile">{summary.penaltyRisk}</strong>.
              Enforcement begins August 2026. Immediate remediation recommended.
            </div>
          </div>
        </div>
      )}

      {/* Article-by-Article */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="text-[13px] font-bold text-foreground">Article-by-Article Assessment</div>
          <div className="text-[10px] text-muted-foreground">Click an article to expand details, gaps, and remediation actions.</div>
        </div>
        <div className="divide-y divide-border">
          {EU_AI_ACT_REQUIREMENTS.map(req => {
            const a = req.checkFunction(inputs, results);
            const isOpen = expandedArticle === req.article;
            return (
              <div key={req.article}>
                <button
                  onClick={() => setExpandedArticle(isOpen ? null : req.article)}
                  className="w-full text-left p-3 sm:p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-primary">{req.article}</span>
                        {req.priority === 'critical' && (
                          <span className="text-[8px] font-bold px-[5px] py-[1px] bg-fragile-bg text-fragile border border-fragile-border rounded">CRITICAL</span>
                        )}
                      </div>
                      <div className="text-[12px] font-semibold text-foreground mt-[2px]">{req.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-[2px] line-clamp-1">{req.description}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-[11px] font-bold ${getStatusColor(a.status)}`}>{getStatusLabel(a.status)}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{a.score.toFixed(0)}%</div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 sm:px-4 pb-4 space-y-3">
                    {a.evidence.length > 0 && (
                      <div className="bg-stable-bg border border-stable-border rounded-lg p-3">
                        <div className="text-[9px] font-bold tracking-wider uppercase text-stable mb-2">✓ Evidence of Compliance</div>
                        {a.evidence.map((item, i) => (
                          <div key={i} className="text-[11px] text-secondary-foreground flex items-start gap-2 mb-1">
                            <span className="text-stable flex-shrink-0">•</span>{item}
                          </div>
                        ))}
                      </div>
                    )}
                    {a.gaps.length > 0 && (
                      <div className="bg-fragile-bg border border-fragile-border rounded-lg p-3">
                        <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-2">✗ Compliance Gaps</div>
                        {a.gaps.map((item, i) => (
                          <div key={i} className="text-[11px] text-secondary-foreground flex items-start gap-2 mb-1">
                            <span className="text-fragile flex-shrink-0">•</span>{item}
                          </div>
                        ))}
                      </div>
                    )}
                    {a.recommendations.length > 0 && (
                      <div className="bg-sensitive-bg border border-sensitive-border rounded-lg p-3">
                        <div className="text-[9px] font-bold tracking-wider uppercase text-sensitive mb-2">→ Remediation Actions</div>
                        {a.recommendations.map((item, i) => (
                          <div key={i} className="text-[11px] text-secondary-foreground flex items-start gap-2 mb-1">
                            <span className="text-sensitive flex-shrink-0">•</span>{item}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 text-[10px] text-muted-foreground pt-1">
                      <span>Est. Cost: <strong className="text-foreground">{req.estimatedCost}</strong></span>
                      <span>Timeline: <strong className="text-foreground">{req.timeToRemediate}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[13px] font-bold text-foreground mb-3">Recommended Action Plan</div>
        <div className="space-y-3">
          {[
            { n: '1', title: 'Address Critical Gaps (Next 30 Days)', desc: 'Focus on Art. 14 (Human Oversight) and Art. 15 (Accuracy/Robustness). Highest-priority requirements with August 2026 deadline.' },
            { n: '2', title: 'Establish Quality Management (Months 2–4)', desc: 'Implement Art. 9 risk management system and Art. 26 deployer obligations. Build documentation, audit processes, and governance structures.' },
            { n: '3', title: 'External Audit & Certification (Month 5)', desc: 'Engage notified body for conformity assessment. Required for high-risk AI systems before August 2026 deadline.' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0">{step.n}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{step.title}</div>
                <div className="text-[10px] text-secondary-foreground leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Total Investment Required</div>
            <div className="text-[16px] font-bold font-mono text-foreground">{summary.remediationCostRange}</div>
          </div>
          <div className="text-[10px] text-stable font-medium">ROI: Avoid {summary.penaltyRisk} in penalties</div>
        </div>
      </div>

      {/* Export */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleExportCSV} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors">
          📥 Export Compliance Report (CSV)
        </button>
        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-secondary text-foreground border border-border text-[11px] font-semibold hover:bg-secondary/80 transition-colors">
          🖨️ Print Report
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-secondary/30 border border-border rounded-xl p-4 flex items-start gap-3">
        <span className="text-muted-foreground text-sm flex-shrink-0">ℹ️</span>
        <div className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-secondary-foreground">Disclaimer:</strong> This compliance assessment provides directional guidance based on ARIA's governance risk parameters.
          It does NOT constitute legal advice. Final EU AI Act compliance determination requires legal review and conformity assessment by a notified body.
        </div>
      </div>
    </div>
  );
}
