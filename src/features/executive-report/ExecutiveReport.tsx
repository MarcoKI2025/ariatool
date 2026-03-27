import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { LockedState, BandBadge } from '@/components/shared/UIComponents';
import { buildExecutiveReport } from '@/lib/reportBuilder';
import { exportORSA } from '@/lib/orsaExport';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { calculatePremium, formatPremiumCurrency, formatPremiumPercentage } from '@/lib/pricing';
import { calculatePeerComparison, getRankingLabel, getRankingColor } from '@/lib/benchmarking';
import { toast } from 'sonner';
import { AnalysisResults, ExposureInputs } from '@/lib/types';
import { computeEvolutionAnalysis, EvolutionAnalysis } from '@/lib/evolutionEngine';
import { exportToStructuredJSON, exportToCSV, generateAPIPayload } from '@/lib/exportFormats';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { AppFooter } from '@/components/shared/AppFooter';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function levelColor(level: string): string {
  if (['Critical', 'High', 'Fragile', 'Structurally Locked-In', 'Uninsurable', 'NOT INSURABLE'].includes(level)) return 'text-fragile';
  if (['Elevated', 'Medium', 'Moderate', 'Sensitive', 'At Risk', 'CONDITIONAL', 'Partially Reversible'].includes(level)) return 'text-sensitive';
  return 'text-stable';
}
function levelBg(level: string): string {
  if (['Critical', 'High', 'Fragile'].includes(level)) return 'bg-fragile-bg border-fragile-border';
  if (['Elevated', 'Medium', 'Moderate', 'Sensitive'].includes(level)) return 'bg-sensitive-bg border-sensitive-border';
  return 'bg-stable-bg border-stable-border';
}

function insurabilityLabel(ev: EvolutionAnalysis): 'NOT INSURABLE' | 'CONDITIONAL' | 'INSURABLE' {
  const d = ev.coverageDecision.decision;
  if (d === 'Decline') return 'NOT INSURABLE';
  if (d === 'Accept') return 'INSURABLE';
  return 'CONDITIONAL';
}

// ═══════════════════════════════════════════════════════════════
// EXECUTIVE REPORT
// ═══════════════════════════════════════════════════════════════

export function ExecutiveReport() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showOnePager, setShowOnePager] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const evolution = useMemo<EvolutionAnalysis | null>(() => {
    if (!analysisComplete || !results) return null;
    return computeEvolutionAnalysis(inputs, results);
  }, [analysisComplete, inputs, results]);

  if (!analysisComplete || !results) {
    return <LockedState title="Executive Report Locked" description="Complete the Exposure Analysis to generate a board-level executive report." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, eciTier, eciName, components, amplificationFactor, structuralScore } = results;
  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const score = Math.min(99, Math.round(afi * 60));
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const entity = inputs.companyName || 'Entity';
  const industry = inputs.industry || '—';
  const dr100 = Math.round(components.dr * 100);
  const jd100 = Math.round(components.jd * 100);
  const rc100 = Math.round(components.rc * 100);
  const cd100 = Math.round(components.cd * 100);
  const reportId = `ARIA-${Date.now().toString(36).toUpperCase()}`;

  // evolution already computed above

  const insLabel = evolution ? insurabilityLabel(evolution) : (band === 'Fragile' ? 'NOT INSURABLE' : band === 'Sensitive' ? 'CONDITIONAL' : 'INSURABLE');
  const confidenceLevel = evolution?.confidence.level || 'Medium';

  // Core message
  const coreMessage = band === 'Fragile'
    ? 'Structural AI dependencies create underwriting exposure not captured by current models.'
    : band === 'Sensitive'
    ? 'Emerging structural AI risk requires conditional coverage with mandatory governance improvements.'
    : 'AI governance profile is within standard underwriting parameters.';

  // Recommended action
  const recommendedAction = band === 'Fragile'
    ? 'Escalate to Committee — decline under standard terms'
    : band === 'Sensitive'
    ? 'Conditional approval — require governance controls within 90 days'
    : 'Standard underwriting process — approve with annual re-assessment';

  // Risk categories
  const cascadeLevel = evolution ? (evolution.cascadeRiskScore > 0.6 ? 'Critical' : evolution.cascadeRiskScore > 0.35 ? 'High' : 'Moderate') : 'N/A';
  const systemicLevel = evolution?.systemicCorrelation || 'N/A';
  const governanceLevel = afi > 1.35 ? 'Critical' : afi > 0.85 ? 'Elevated' : 'Adequate';

  // Insurability conditions
  const conditions: string[] = [];
  if (evolution?.exitRisk.level === 'Structurally Locked-In' || rc100 > 50) {
    conditions.push('Implement hard guardrails: named human with stop authority and quarterly re-authorisation mandate');
  }
  if (evolution?.systemicCorrelation === 'High' || results.scri > 40) {
    conditions.push('Reduce dependency concentration: minimum 3 providers across critical AI endpoints');
  }
  if (afi > 0.85) {
    conditions.push('Introduce oversight controls: automated drift monitoring with escalation triggers');
  }
  if (conditions.length === 0) conditions.push('Maintain current governance cadence with annual re-assessment');

  const copyReport = () => {
    const text = buildExecutiveReport(inputs, results, state.recursiveRisk);
    navigator.clipboard.writeText(text);
    toast.success('Executive summary copied to clipboard');
  };

  const exportBoardPDF = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ARIA Board Report</title>
<style>body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#1e2430;margin:40px;line-height:1.6}h1{font-size:22px;margin-bottom:4px}h2{font-size:14px;margin-top:24px;border-bottom:2px solid #1e2430;padding-bottom:4px}.badge{display:inline-block;padding:4px 12px;border-radius:4px;font-weight:700;font-size:12px}.fragile{background:#fef3f1;color:#c9392a;border:1px solid #edc4bd}.sensitive{background:#fef9ee;color:#b87400;border:1px solid #dfc98e}.stable{background:#eff7f2;color:#227a44;border:1px solid #a8d2b8}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{padding:6px 10px;border:1px solid #e1e4e8;text-align:left;font-size:10px}th{background:#f4f5f7;font-weight:700;text-transform:uppercase;font-size:9px;letter-spacing:0.05em}.disclaimer{background:#fef3f1;border:1px solid #edc4bd;padding:12px;border-radius:4px;font-size:9px;color:#c9392a;margin:16px 0}.footer{border-top:2px solid #1e2430;padding-top:8px;margin-top:32px;font-size:8px;color:#6b7280;display:flex;justify-content:space-between}@media print{body{margin:20px}@page{margin:1cm}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px"><div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280">Governance Intelligence Report</div><h1>AI Risk Assessment Summary</h1><div style="font-size:11px;color:#6b7280">Entity: ${entity} · Industry: ${industry} · ${dateStr}</div></div><div style="text-align:right"><div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#6b7280">Report ID</div><div style="font-size:14px;font-weight:700;font-family:monospace">${reportId}</div></div></div>
<div class="disclaimer">⚠ GOVERNANCE INTELLIGENCE PLATFORM — Decision-support signals only. Not binding underwriting decisions.</div>
<h2>Core Finding</h2><p style="font-size:14px;font-weight:700">${coreMessage}</p>
<h2>Decision Summary</h2><table><tr><th>Status</th><th>Confidence</th><th>Action</th></tr><tr><td><span class="badge ${band.toLowerCase()}">${insLabel}</span></td><td>${confidenceLevel}</td><td>${recommendedAction}</td></tr></table>
<h2>Risk Categories</h2><table><tr><th>Category</th><th>Level</th><th>Key Indicator</th></tr><tr><td>Recursive / Agentic Risk</td><td>${cascadeLevel}</td><td>Cascade Score: ${evolution ? Math.round(evolution.cascadeRiskScore * 100) : 'N/A'}%</td></tr><tr><td>Systemic / Dependency Risk</td><td>${systemicLevel}</td><td>Correlation: ${evolution ? Math.round(evolution.systemicCorrelationScore * 100) : 'N/A'}%</td></tr><tr><td>Governance / Control Gaps</td><td>${governanceLevel}</td><td>AFI: ${afi.toFixed(2)}</td></tr></table>
<h2>Financial Impact</h2><table><tr><th>Expected</th><th>Stress</th><th>Tail</th><th>Portfolio</th></tr><tr><td>${lossEnvelope.expected}</td><td>${lossEnvelope.stress}</td><td>${lossEnvelope.tail}</td><td>${lossEnvelope.portfolio}</td></tr></table>
<h2>Path to Insurability</h2>${conditions.map((c, i) => `<p>${i + 1}. ${c}</p>`).join('')}
<div class="disclaimer">Epistemic Status: Structural governance signal — not actuarially certified. Framework: AGAF v4.3.0</div>
<div class="footer"><span>ARIA AI Governance Engine v4.3.0 · ${dateStr}</span><span>CONFIDENTIAL — Board & Committee Use Only</span></div>
</body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
    toast.success('Board report opened for PDF export');
  };

  return (
    <div>
      {/* Report header */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">Governance Intelligence Report</div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Executive Report · {entity}</h1>
          </div>
          <div className="sm:text-right">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">REPORT ID</div>
            <div className="text-[13px] font-mono font-bold text-foreground">{reportId}</div>
            <div className="text-[9px] text-muted-foreground mt-1">{dateStr}</div>
          </div>
        </div>
      </div>

      <UseRestrictionBanner />

      {/* ══════════════════════════════════════════════════
          STEP 1: CORE MESSAGE — dominant statement
          ══════════════════════════════════════════════════ */}
      <div className={`rounded-xl border-2 p-6 mb-5 ${
        band === 'Fragile' ? 'bg-fragile-bg border-fragile' :
        band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className={`text-[18px] sm:text-[22px] font-extrabold leading-[1.3] tracking-tight ${bandColor}`}>
          {coreMessage}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 2: DECISION SUMMARY BLOCK
          ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Insurability Status */}
        <div className={`rounded-xl border p-5 ${levelBg(insLabel === 'NOT INSURABLE' ? 'Critical' : insLabel === 'CONDITIONAL' ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Insurability Status</div>
          <div className={`text-[22px] font-extrabold tracking-tight ${levelColor(insLabel)}`}>{insLabel}</div>
        </div>
        {/* Confidence */}
        <div className={`rounded-xl border p-5 ${levelBg(confidenceLevel === 'Low' ? 'Critical' : confidenceLevel === 'Medium' ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Assessment Confidence</div>
          <div className={`text-[22px] font-extrabold tracking-tight ${levelColor(confidenceLevel === 'Low' ? 'Critical' : confidenceLevel === 'Medium' ? 'Elevated' : 'Stable')}`}>{confidenceLevel}</div>
        </div>
        {/* Action */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Recommended Action</div>
          <div className="text-[13px] font-bold text-foreground leading-snug">{recommendedAction}</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 3–4: 3 RISK CATEGORIES
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Why This Decision</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Block 1: Recursive / Agentic Risk */}
        <div className={`rounded-xl border p-5 ${levelBg(cascadeLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Recursive / Agentic Risk</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(cascadeLevel)}`}>{cascadeLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">
            {evolution && evolution.cascadeRiskScore > 0.6
              ? 'System exhibits uncontrolled cascade propagation — failure amplifies across dependent layers.'
              : evolution && evolution.cascadeRiskScore > 0.35
              ? 'Cascade propagation risk exists. Containment not guaranteed under stress.'
              : 'Failure modes are isolated with limited propagation potential.'}
          </div>
          {evolution && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground">Cascade</span>
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${evolution.cascadeRiskScore > 0.6 ? 'bg-fragile' : evolution.cascadeRiskScore > 0.35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(evolution.cascadeRiskScore * 100)}%` }} />
              </div>
              <span className="text-[10px] font-mono font-bold text-foreground">{Math.round(evolution.cascadeRiskScore * 100)}%</span>
            </div>
          )}
        </div>

        {/* Block 2: Systemic / Dependency Risk */}
        <div className={`rounded-xl border p-5 ${levelBg(systemicLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Systemic / Dependency Risk</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(systemicLevel)}`}>{systemicLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">
            {evolution && evolution.systemicCorrelation === 'High'
              ? 'Shared infrastructure dependencies create synchronized failure risk across the portfolio.'
              : evolution && evolution.systemicCorrelation === 'Medium'
              ? 'Moderate dependency overlap — diversification recommended.'
              : 'Dependencies are sufficiently diversified.'}
          </div>
          {evolution && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground">Correlation</span>
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${evolution.systemicCorrelationScore > 0.6 ? 'bg-fragile' : evolution.systemicCorrelationScore > 0.35 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.round(evolution.systemicCorrelationScore * 100)}%` }} />
              </div>
              <span className="text-[10px] font-mono font-bold text-foreground">{Math.round(evolution.systemicCorrelationScore * 100)}%</span>
            </div>
          )}
        </div>

        {/* Block 3: Governance / Control Gaps */}
        <div className={`rounded-xl border p-5 ${levelBg(governanceLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Governance / Control Gaps</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColor(governanceLevel)}`}>{governanceLevel}</span>
          </div>
          <div className="text-[12px] text-foreground font-medium leading-relaxed mb-3">
            {afi > 1.35
              ? 'Governance framework is structurally inadequate. Oversight decay has exceeded reversibility thresholds.'
              : afi > 0.85
              ? 'Governance gaps are emerging. Delegation is outpacing oversight cadence.'
              : 'Governance framework is aligned with current delegation levels.'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground">AFI</span>
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.min(100, score)}%` }} />
            </div>
            <span className={`text-[10px] font-mono font-bold ${bandColor}`}>{afi.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 5: WHAT THIS MEANS — financial implications
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">What This Means</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Pricing */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Pricing Implications</div>
          {(() => {
            const premium = calculatePremium(5000000, afi, inputs.industry || 'General AI System', 0);
            return (
              <>
                <div className={`text-[20px] font-bold font-mono ${bandColor}`}>{formatPremiumCurrency(premium.annualPremium)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Annual premium on €5M limit</div>
                <div className="text-[10px] text-muted-foreground">AFI multiplier: {premium.afiMultiplier.toFixed(2)}×</div>
              </>
            );
          })()}
        </div>
        {/* Coverage */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Coverage Limitations</div>
          <div className="text-[13px] font-bold text-foreground mb-1">
            {evolution?.coverageDecision.decision || decisionClass}
          </div>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            {evolution?.coverageDecision.maxTenor ? `Maximum tenor: ${evolution.coverageDecision.maxTenor} months` : 'Standard tenor applies'}
            {evolution?.coverageDecision.sublimitRecommended && ' · Sublimit recommended'}
          </div>
        </div>
        {/* Capital Exposure */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Capital Exposure</div>
          {evolution ? (
            <>
              <div className="text-[20px] font-bold font-mono text-foreground">€{evolution.economicLoss.expectedLow}M – €{evolution.economicLoss.expectedHigh}M</div>
              <div className="text-[10px] text-muted-foreground mt-1">Expected loss range</div>
              <div className="text-[10px] text-fragile font-medium">Tail: €{evolution.economicLoss.tailRisk}M</div>
            </>
          ) : (
            <>
              <div className="text-[16px] font-bold font-mono text-foreground">{lossEnvelope.expected}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Base risk band</div>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 6: WHAT WOULD MAKE THIS INSURABLE
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Path to Insurability</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className={`rounded-xl border p-5 mb-6 ${band === 'Stable' ? 'bg-stable-bg border-stable-border' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-fragile-bg border-fragile-border'}`}>
        <div className="text-[13px] font-bold text-foreground mb-3">
          {band === 'Stable' ? 'Maintain current status' : `${conditions.length} condition${conditions.length > 1 ? 's' : ''} required for standard insurability`}
        </div>
        <div className="space-y-3">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                band === 'Fragile' ? 'bg-fragile text-foreground' : band === 'Sensitive' ? 'bg-sensitive text-foreground' : 'bg-stable text-foreground'
              }`}>{i + 1}</div>
              <div className="text-[12px] text-foreground font-medium leading-relaxed">{c}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUPPORTING ANALYSIS (collapsible)
          ══════════════════════════════════════════════════ */}
      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-4 cursor-pointer">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground">
              {showDetail ? '▾ Hide Detailed Analysis' : '▸ View Detailed Analysis'}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">

          {/* AFI Components */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">AFI Component Breakdown</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Delegation (DR)', value: dr100, high: dr100 > 60 },
                { label: 'Justification (JD)', value: jd100, high: jd100 < 40 },
                { label: 'Reversibility (RC)', value: rc100, high: rc100 > 60 },
                { label: 'Continuation (CD)', value: cd100, high: cd100 > 60 },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                  <div className={`text-[22px] font-bold font-mono ${m.high ? 'text-fragile' : 'text-stable'}`}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Loss Envelope */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Loss Envelope</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Expected', value: lossEnvelope.expected, color: 'text-stable' },
                { label: 'Stress', value: lossEnvelope.stress, color: 'text-sensitive' },
                { label: 'Tail (99th)', value: lossEnvelope.tail, color: 'text-fragile' },
                { label: 'Portfolio', value: lossEnvelope.portfolio, color: 'text-fragile' },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                  <div className={`text-[18px] font-bold font-mono ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indices */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Risk Indices</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'AGRI — Agentic Risk', score: results.agri, color: results.agri >= 60 ? 'text-fragile' : results.agri >= 35 ? 'text-sensitive' : 'text-stable' },
                { label: 'ALRI — Liability Risk', score: results.alri, color: results.alri >= 60 ? 'text-fragile' : results.alri >= 35 ? 'text-sensitive' : 'text-stable' },
                { label: 'SCRI — Systemic Concentration', score: results.scri, color: results.scri >= 60 ? 'text-fragile' : results.scri >= 35 ? 'text-sensitive' : 'text-stable' },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                  <div className="flex items-end gap-2">
                    <span className={`text-[24px] font-bold font-mono ${m.color}`}>{m.score}</span>
                    <span className="text-[10px] text-muted-foreground mb-1">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Benchmarking */}
          {(() => {
            const peer = calculatePeerComparison(afi, inputs.industry || 'General', inputs);
            return (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Industry Peer Comparison · {peer.benchmark.industry} (n={peer.benchmark.sampleSize})</div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Ranking', value: getRankingLabel(peer.ranking), color: getRankingColor(peer.ranking) },
                    { label: 'Percentile', value: `${peer.percentile}th`, color: getRankingColor(peer.ranking) },
                    { label: 'vs. Industry Avg', value: `${peer.vsAverage >= 0 ? '+' : ''}${peer.vsAverage.toFixed(2)}`, color: peer.vsAverage > 0 ? 'text-fragile' : 'text-stable' },
                    { label: 'Better Than', value: `${peer.betterThanPercent}%`, color: 'text-foreground' },
                  ].map((m, i) => (
                    <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
                      <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                      <div className={`text-[16px] font-bold font-mono ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Evolution Analysis */}
          {evolution && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">System Evolution & Projections</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                <div className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AGI Proximity</div>
                  <div className={`text-[14px] font-bold ${evolution.agiProximity > 0.6 ? 'text-fragile' : evolution.agiProximity > 0.3 ? 'text-sensitive' : 'text-stable'}`}>{evolution.agiTier}</div>
                </div>
                <div className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Drift Trend</div>
                  <div className={`text-[14px] font-bold ${evolution.driftTrend === 'Critical Acceleration' ? 'text-fragile' : evolution.driftTrend === 'Increasing Risk' ? 'text-sensitive' : 'text-stable'}`}>{evolution.driftTrend}</div>
                </div>
                <div className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Exit Risk</div>
                  <div className={`text-[14px] font-bold ${levelColor(evolution.exitRisk.level === 'Structurally Locked-In' ? 'Critical' : evolution.exitRisk.level === 'Partially Reversible' ? 'Elevated' : 'Low')}`}>{evolution.exitRisk.level}</div>
                </div>
                <div className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Time-to-Instability</div>
                  <div className={`text-[14px] font-bold ${levelColor(evolution.timeToInstability.includes('3') ? 'Critical' : evolution.timeToInstability.includes('6') ? 'Elevated' : 'Low')}`}>{evolution.timeToInstability}</div>
                </div>
                <div className="p-3 bg-secondary border border-border rounded-lg text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Unified Risk</div>
                  <div className={`text-[14px] font-bold ${levelColor(evolution.unifiedRiskLevel)}`}>{evolution.unifiedRiskLevel}</div>
                </div>
              </div>
              {/* Drift Projections */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <div className="text-[8px] text-muted-foreground uppercase">Current</div>
                  <div className={`text-[14px] font-bold font-mono ${bandColor}`}>{results.afi.toFixed(2)}</div>
                  <div className={`text-[8px] font-bold ${bandColor}`}>{results.band}</div>
                </div>
                {evolution.projections.map(p => (
                  <div key={p.months} className="bg-secondary rounded-lg p-2 text-center">
                    <div className="text-[8px] text-muted-foreground uppercase">{p.label}</div>
                    <div className={`text-[14px] font-bold font-mono ${p.band === 'Fragile' ? 'text-fragile' : p.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>{p.afi.toFixed(2)} {p.afi > results.afi ? '↑' : '→'}</div>
                    <div className={`text-[8px] font-bold ${p.band === 'Fragile' ? 'text-fragile' : p.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>{p.band}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recursive Risk */}
          {state.recursiveRisk && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Recursive Risk Assessment</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'RSI Score', value: state.recursiveRisk.rsiScore.toFixed(1), color: state.recursiveRisk.rsiScore >= 50 ? 'text-fragile' : state.recursiveRisk.rsiScore >= 30 ? 'text-sensitive' : 'text-stable' },
                  { label: 'RSI Tier', value: state.recursiveRisk.rsiTier, color: 'text-foreground' },
                  { label: 'MCCI Score', value: state.recursiveRisk.mcciScore.toFixed(0), color: state.recursiveRisk.mcciScore >= 55 ? 'text-fragile' : state.recursiveRisk.mcciScore >= 30 ? 'text-sensitive' : 'text-stable' },
                  { label: 'MCCI Tier', value: state.recursiveRisk.mcciTier, color: 'text-foreground' },
                ].map((m, i) => (
                  <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
                    <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                    <div className={`text-[18px] font-bold font-mono ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Epistemic Status */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-2">Epistemic Status</div>
            <div className="text-[12px] text-foreground font-medium mb-2">This assessment is a structural governance signal — not actuarially certified.</div>
            <div className="text-[10px] text-muted-foreground leading-relaxed">
              All loss figures are market-calibrated proxies. Self-attested inputs. Not legal advice. Framework: AGAF v4.3.0. Scores correlate with governance fragility — they do not predict specific incidents.
            </div>
          </div>

        </CollapsibleContent>
      </Collapsible>

      {/* ══════════════════════════════════════════════════
          EXPORT CONTROLS
          ══════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-5 mt-6">
        <div className="text-[13px] font-bold text-foreground mb-3">Export & Share</div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={copyReport} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors">
            📋 Copy Summary
          </button>
          <button onClick={exportBoardPDF} className="px-5 py-2.5 bg-foreground text-background rounded-lg text-[13px] font-semibold hover:bg-foreground/90 transition-colors">
            🖨 Export Board PDF
          </button>
          <button onClick={() => exportORSA(results, inputs)} className="px-5 py-2.5 border border-border rounded-lg text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors">
            📄 Export ORSA Section
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-foreground mb-3">Assessment Metadata</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
          <div><div className="text-muted-foreground mb-1">Framework Version</div><div className="font-mono font-bold text-foreground">AGAF v4.3.0</div></div>
          <div><div className="text-muted-foreground mb-1">Assessment Date</div><div className="font-mono font-bold text-foreground">{dateStr}</div></div>
          <div><div className="text-muted-foreground mb-1">Report ID</div><div className="font-mono font-bold text-foreground">{reportId}</div></div>
          <div><div className="text-muted-foreground mb-1">Input Method</div><div className="font-mono font-bold text-foreground">Self-Attested</div></div>
        </div>
      </div>

      <StepNavigation currentStep={5} />
      <AppFooter />
    </div>
  );
}
