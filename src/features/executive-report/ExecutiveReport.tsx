import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge } from '@/components/shared/UIComponents';
import { buildExecutiveReport, buildORSAExport } from '@/lib/reportBuilder';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export function ExecutiveReport() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showOverlay, setShowOverlay] = useState(false);

  if (!analysisComplete || !results) {
    return <LockedState title="Executive Report Locked" description="Complete the Exposure Analysis to generate a board-level executive report suitable for risk committees and reinsurers." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, eciTier, eciName, components } = results;

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
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 5 of 6 · Reporting</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Executive Report</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Board-level finding for risk committees, boards, and reinsurers. This is a governance assessment, not a compliance report.
        </p>
      </div>

      {/* Board finding */}
      <div className={`rounded-xl p-6 mb-4 border-2 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' :
        'bg-stable-bg border-stable-border'
      }`}>
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-primary mb-3">AI Governance Assessment — Executive Summary</div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[28px] font-extrabold text-foreground tracking-tight leading-[1.1] mb-2">
              {band === 'Fragile' ? 'STRUCTURAL EXPOSURE SIGNALS — COMMITTEE REVIEW REQUIRED' :
               band === 'Sensitive' ? 'ELEVATED STRUCTURAL SIGNALS — CONDITIONAL REVIEW' :
               'GOVERNANCE SIGNALS WITHIN RANGE — STANDARD PROCESS'}
            </div>
            <div className="text-[13px] text-muted-foreground max-w-[480px] leading-[1.5]">
              {band === 'Fragile' ? 'This system creates structural AI risk not priced, modelled, or reserved for in standard underwriting frameworks.' :
               band === 'Sensitive' ? 'Governance gaps signal drift toward Fragile classification. Conditional coverage available.' :
               'Structural exposure is within manageable bounds. Standard coverage terms apply.'}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-5">
            <div className={`text-[22px] font-extrabold font-mono ${
              band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'
            }`}>{decisionClass.toUpperCase()}</div>
          </div>
        </div>

        <div className="flex gap-6">
          {[
            { label: 'Entity', value: inputs.companyName || '—' },
            { label: 'Industry', value: inputs.industry },
            { label: 'Date', value: formatDate() },
            { label: 'Framework', value: 'AGAF v3.0' },
          ].map((item, i) => (
            <div key={i} className="text-[9px] text-muted-foreground leading-[1.6]">
              <strong className="block text-[11px] text-foreground font-bold">{item.value}</strong>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">AFI Score</div>
          <div className={`text-xl font-bold font-mono ${band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>{afi.toFixed(2)}</div>
          <div className="text-[9px] text-muted-foreground">{band}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">ECI Tier</div>
          <div className="text-xl font-bold font-mono text-foreground">ECI-{eciTier}</div>
          <div className="text-[9px] text-muted-foreground">{eciName}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Decision</div>
          <div className="text-xl font-bold text-foreground">{decisionClass}</div>
          <div className="text-[9px] text-muted-foreground">Underwriting position</div>
        </div>
      </div>

      {/* Loss envelope */}
      <div className="grid grid-cols-4 gap-0 bg-card border border-border rounded-lg overflow-hidden mb-4">
        {[
          { label: 'Expected', value: lossEnvelope.expected },
          { label: 'Stress', value: lossEnvelope.stress },
          { label: 'Tail 99th%', value: lossEnvelope.tail },
          { label: 'Portfolio', value: lossEnvelope.portfolio },
        ].map((item, i) => (
          <div key={i} className="p-3 border-r border-border last:border-none">
            <div className="text-[8px] font-bold tracking-[0.07em] uppercase text-muted-foreground mb-[5px]">{item.label}</div>
            <div className="text-base font-bold font-mono text-foreground">{formatCurrency(item.value)}</div>
          </div>
        ))}
      </div>

      {/* Structural concerns */}
      <SectionCard title="Structural Concerns" icon="⚠">
        <div className="space-y-2">
          {[
            { label: 'Delegation Ratio', value: `${Math.round(components.dr * 100)}%`, concern: components.dr > 0.6 },
            { label: 'Oversight Density', value: `${Math.round(components.jd * 100)}%`, concern: components.jd < 0.4 },
            { label: 'Reversibility Cost', value: `${Math.round(components.rc * 100)}%`, concern: components.rc > 0.6 },
            { label: 'Continuation Density', value: `${Math.round(components.cd * 100)}%`, concern: components.cd > 0.6 },
          ].filter(i => i.concern).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-fragile-bg border border-fragile-border rounded-md">
              <span className="text-fragile text-xs">⚠</span>
              <span className="text-[11px] text-foreground font-medium">{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Epistemic Status */}
      <div className="bg-card border border-border rounded-[10px] p-5 mb-[14px]">
        <div className="text-[10px] font-bold tracking-[0.09em] uppercase text-primary mb-3">Epistemic Status · Governance Limits</div>
        <div className="grid grid-cols-2 gap-4 text-[11px] text-muted-foreground leading-[1.6]">
          <div>
            <strong className="text-foreground">⊘ No external ground truth exists</strong> for AI governance fragility. AFI scores are structurally calibrated — not empirically verified against historical outcomes.
          </div>
          <div>
            <strong className="text-foreground">⊘ Evaluation does not guarantee correctness.</strong> Compliance audits verify procedures — not that the system behaves correctly across all operational contexts.
          </div>
          <div>
            <strong className="text-foreground">⊘ The interval between evaluations is ungoverned.</strong> This assessment reflects the moment of evaluation — not the current operational state if material changes have occurred.
          </div>
          <div>
            <strong className="text-foreground">⊘ Performance ≠ authorisation for continued operation.</strong> Continued deployment requires explicit re-authorisation by decision — not by default performance evidence.
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-secondary border border-border rounded-lg p-4 mb-4 text-[11px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground block mb-1">This report is a structured governance assessment finding.</strong>
        It is not an actuarially certified risk model, legal advice, compliance certification, or regulatory filing.
        All inputs are self-attested. Loss figures are market-calibrated directional estimates for committee discussion.
        <div className="mt-2 text-primary font-semibold">
          This document constitutes a formal governance assessment. Intended for risk committee, board, and reinsurer review only.
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4 text-[11px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground block mb-1">Methodology</strong>
        Authority Fragility Index (AFI) = (DR × RC × CD) / (JD × NA). Risk characterization based on structural governance factors.
        Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries."
        EU AI Act Art. 99 penalty exposure shown separately.
        <div className="mt-2">This is not a compliance report — a system can be fully compliant and still exceed underwriting tolerance and incur regulatory fines.</div>
      </div>

      {/* Export controls */}
      <div className="bg-card border border-border rounded-[10px] p-5">
        <div className="text-[13px] font-bold text-foreground mb-[3px]">Export & Distribution</div>
        <div className="text-[11px] text-secondary-foreground mb-[14px]">Generate outputs for risk committee review.</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={copyReport} className="px-4 py-[8px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
            📋 Copy Executive Summary
          </button>
          <button onClick={copyORSA} className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            📄 Export ORSA-Style Text
          </button>
          <button onClick={() => setShowOverlay(true)} className="px-4 py-[8px] bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">
            🖨️ Print View
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
    </div>
  );
}
