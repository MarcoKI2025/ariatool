import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge } from '@/components/shared/UIComponents';
import { buildExecutiveReport, buildORSAExport } from '@/lib/reportBuilder';
import { exportORSA } from '@/lib/orsaExport';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export function ExecutiveReport() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showOverlay, setShowOverlay] = useState(false);

  if (!analysisComplete || !results) {
    return <LockedState title="Executive Report Locked" description="Complete the Exposure Analysis to generate a board-level executive report suitable for risk committees and reinsurers." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, eciTier, eciName, components, premium, amplificationFactor, correlationFactor } = results;

  const copyReport = () => {
    const text = buildExecutiveReport(inputs, results);
    navigator.clipboard.writeText(text);
    toast.success('Executive summary copied to clipboard');
  };

  const copyORSA = () => {
    const text = buildORSAExport(inputs, results);
    navigator.clipboard.writeText(text);
    toast.success('ORSA-style export copied to clipboard');
  };

  return (
    <div>
      {/* Board-level finding banner */}
      <div className={`rounded-xl p-5 mb-5 border-2 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Board-Level Finding · Not a Compliance Report</div>
        <div className="text-[16px] font-extrabold text-foreground leading-[1.3] mb-2">
          {band === 'Fragile'
            ? 'This system introduces structural AI risk that exceeds current underwriting assumptions — and is not visible through compliance frameworks, audit processes, or point-in-time regulatory reviews.'
            : band === 'Sensitive'
            ? 'This system introduces moderate structural AI risk. Conditional coverage with mandatory improvement timeline.'
            : 'Structural exposure is within manageable bounds. Standard coverage terms apply.'}
        </div>
        <div className="text-[11px] text-muted-foreground">
          Structural AI exposure of this risk profile is not priced, modelled, or reserved for in standard underwriting frameworks. The risk exists regardless of compliance status. This analysis reveals the gap.
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 5 · Board-Level Documentation</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Executive Report</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Decision-oriented summary based on structural systemic risk modelling. Structured for risk committees, boards, and reinsurers.
        </p>
      </div>

      {/* Main verdict */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-3">AI Systemic Risk Assessment · Governance Exposure Engine v3.0</div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-[22px] font-extrabold text-foreground leading-[1.25] mb-3 max-w-[580px]">
              Structural AI dependency creates underwriting exposure that current models do not price, reserve for, or capture — this profile exceeds standard tolerance thresholds.
            </div>
            <div className={`inline-block px-3 py-[6px] rounded-lg text-[12px] font-bold ${
              band === 'Fragile' ? 'bg-fragile text-white' :
              band === 'Sensitive' ? 'bg-sensitive text-white' :
              'bg-stable text-white'
            }`}>
              THIS MEANS: {band === 'Fragile' ? 'Standard coverage is not justified. Apply mandatory premium loading and require structural remediation before renewal.' :
                band === 'Sensitive' ? 'Conditional coverage — improvements required within 90 days.' :
                'Standard coverage terms apply.'}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-6">
            <div className={`text-[48px] font-extrabold font-mono leading-none ${
              band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
            }`}>{afi.toFixed(2)}</div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">AFI Score</div>
            <div className="text-[11px] font-bold text-muted-foreground mt-1">{band.toUpperCase()}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground">
          Decision-oriented summary · Not a compliance report · Generated {formatDate()}
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground leading-[1.5]">
          Risk characterization based on structural governance factors: AFI score, delegation depth, provider concentration, continuation risk, justificatory density. Swiss Re sigma insights 01/2026. EU AI Act Art. 99 penalty exposure shown separately. Framework ≠ guarantee.
        </div>
      </div>

      {/* Risk Position + Financial Exposure */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SectionCard title="Risk Position" icon="📋">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Above underwriting tolerance</strong></div>
            <div>• AFI {afi.toFixed(2)} — exceeds tolerance. Standard rates not applicable</div>
            <div>• <strong className="text-foreground">Standard coverage not justified</strong></div>
            <div>• Structural change required before standard rates apply</div>
            <div>• <strong className="text-foreground">Premium loading mandatory</strong></div>
            <div>• 150–180% above standard · mandatory pricing adjustment</div>
            <div>• <strong className="text-foreground">Critical risk band: €{lossEnvelope.tail.toFixed(1)}M</strong></div>
            <div>• Provider concentration and automation factors</div>
            <div>• <strong className="text-foreground">Systemic exposure: €{Math.round(lossEnvelope.portfolio)}M</strong></div>
            <div>• If 5 entities share similar AI infrastructure</div>
          </div>
        </SectionCard>
        <SectionCard title="Financial Exposure" icon="📊">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Base risk band: {formatCurrency(lossEnvelope.expected)}</strong></div>
            <div>• Structural baseline → AI-derived characteristic</div>
            <div>• <strong className="text-foreground">Elevated risk band: €{lossEnvelope.stress.toFixed(1)}M</strong></div>
            <div>• Provider concentration and adoption factors</div>
            <div>• <strong className="text-foreground">Critical risk band: €{lossEnvelope.tail.toFixed(1)}M</strong></div>
            <div>• Systemic exposure: €{Math.round(lossEnvelope.portfolio)}M</div>
          </div>
        </SectionCard>
      </div>

      {/* Systemic Signals + Required Actions */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SectionCard title="Systemic Signals" icon="⚡">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Continuation risk</strong> — System persists without explicit re-authorisation — accumulating liability</div>
            <div>• <strong className="text-foreground">Dependency concentration</strong> — External provider reliance creates single points of failure</div>
            <div>• <strong className="text-foreground">Aggregation exposure</strong> — Shared AI creates portfolio-level correlated risk</div>
            <div>• <strong className="text-foreground">Non-linear loss amplification</strong> — Cascade propagation across 5 layers · {amplificationFactor} amplification</div>
          </div>
        </SectionCard>
        <SectionCard title="Required Actions" icon="⚠">
          <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.55]">
            <div>• <strong className="text-foreground">Apply premium loading (150–180%)</strong> — Mandatory · structural risk exceeds standard pricing</div>
            <div>• <strong className="text-foreground">Require dependency diversification</strong> — Mandatory within 90 days · minimum 3 providers</div>
            <div>• <strong className="text-foreground">Enforce governance cadence</strong> — Condition of coverage · quarterly re-authorisation</div>
            <div>• <strong className="text-foreground">Limit coverage to operational layers</strong> — Recommended · full-stack coverage uneconomic</div>
          </div>
        </SectionCard>
      </div>

      {/* Responsibility & Ownership Structure */}
      <ResponsibilityOwnershipPanel results={results} inputs={inputs} />

      {/* Epistemic Status — Dark section */}
      <div className="bg-dark-section border border-dark-section-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-3">◆ Epistemic Status · What This Assessment Cannot Guarantee</div>
        <div className="text-[18px] font-bold text-white mb-3">You Cannot Rely on This Evaluation</div>
        <div className="text-[11px] text-dark-section-fg leading-[1.6] mb-4">
          This is not a disclaimer; it is an operational fact. The following conditions are structurally true of every AI governance assessment.
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'This system operates without stable ground truth', body: 'AFI scores are structurally calibrated — not empirically verified against historical outcomes.' },
            { title: 'Evaluation does not guarantee correctness', body: 'Compliance audits verify procedures — not that the system behaves correctly across all operational contexts.' },
            { title: 'The interval between evaluations is ungoverned', body: 'A system verified at t=0 may have undergone significant interpretive drift by t+6 months.' },
            { title: 'Performance is not justification for continued operation', body: 'Performance-based legitimacy is the primary mechanism by which governance oversight erodes.' },
            { title: 'This assessment itself is subject to the limits it describes', body: 'All derived scores are structural proxies. They correlate with governance fragility — they do not predict specific incidents.' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-dark-section-border/50 border border-dark-section-border rounded-lg">
              <div className="text-[11px] font-bold text-sensitive mb-1">{item.title}</div>
              <div className="text-[10px] text-dark-section-fg leading-[1.5]">{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History */}
      <SectionCard title="Assessment History" icon="📋" subtitle="Prior assessments for portfolio comparison and trend analysis.">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                {['Date', 'Entity', 'AFI', 'Band', 'Decision', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted-foreground">{formatDate()}</td>
                <td className="py-2 pr-4 font-medium text-foreground">{inputs.companyName || 'Current Entity'}</td>
                <td className="py-2 pr-4 font-mono font-bold text-foreground">{afi.toFixed(2)}</td>
                <td className="py-2 pr-4"><BandBadge band={band} size="sm" /></td>
                <td className="py-2 pr-4 text-muted-foreground">{decisionClass}</td>
                <td className="py-2 text-primary font-semibold cursor-pointer hover:underline">View →</td>
              </tr>
              {[
                { date: '2026-02-15', entity: 'Client B', afi: 1.35, band: 'Fragile' as const, decision: 'Premium Loading' },
                { date: '2026-01-22', entity: 'Client A', afi: 0.92, band: 'Sensitive' as const, decision: 'Conditional Cover' },
                { date: '2025-12-10', entity: 'Client C', afi: 0.77, band: 'Stable' as const, decision: 'Standard Cover' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-none">
                  <td className="py-2 pr-4 text-muted-foreground">{row.date}</td>
                  <td className="py-2 pr-4 font-medium text-foreground">{row.entity}</td>
                  <td className="py-2 pr-4 font-mono font-bold text-foreground">{row.afi.toFixed(2)}</td>
                  <td className="py-2 pr-4"><BandBadge band={row.band} size="sm" /></td>
                  <td className="py-2 pr-4 text-muted-foreground">{row.decision}</td>
                  <td className="py-2 text-primary font-semibold cursor-pointer hover:underline">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Export controls */}
      <div className="bg-card border border-border rounded-[10px] p-5">
        <div className="text-[13px] font-bold text-foreground mb-[3px]">Export & Share</div>
        <div className="text-[11px] text-secondary-foreground mb-[14px]">Generate structured output for risk committee, board, or reinsurer review.</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={copyReport} className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📄 One-Pager PDF Preview
          </button>
          <button onClick={copyReport} className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📋 Board Executive Summary
          </button>
          <button onClick={() => exportORSA(results, inputs)} className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📄 Export ORSA Section
          </button>
          <button onClick={copyReport} className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            ✍ Copy Plain Text
          </button>
          <button onClick={() => setShowOverlay(true)} className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            🖨️ Print Full Report
          </button>
        </div>
      </div>

      {/* Print overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50 z-[3000] flex items-start justify-center p-6 overflow-y-auto" onClick={() => setShowOverlay(false)}>
          <div className="bg-white w-[820px] max-w-full rounded shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b border-border px-4 py-[10px] flex items-center justify-between rounded-t z-10">
              <span className="text-[11px] font-bold text-foreground tracking-[0.04em]">Executive Report — Print Preview</span>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-3 py-1 bg-primary text-primary-foreground rounded text-[11px] font-semibold">Print</button>
                <button onClick={() => setShowOverlay(false)} className="px-3 py-1 border border-border rounded text-[11px] text-muted-foreground">Close</button>
              </div>
            </div>
            <div className="p-[52px] px-[60px] text-[11px] text-foreground leading-relaxed font-sans">
              <pre className="whitespace-pre-wrap font-sans text-[11px]">{buildExecutiveReport(inputs, results)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(4)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Insurance Decision</button>
        <span className="text-[10px] text-muted-foreground italic">Step 5 of 6 · Board-level documentation</span>
        <button onClick={() => setActiveStep(6)} className="view-nav-next">Model Governance →</button>
      </div>
    </div>
  );
}
