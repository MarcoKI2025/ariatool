import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge } from '@/components/shared/UIComponents';
import { buildExecutiveReport, buildORSAExport } from '@/lib/reportBuilder';
import { exportORSA } from '@/lib/orsaExport';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';
import { AnalysisResults, ExposureInputs } from '@/lib/types';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { AppFooter } from '@/components/shared/AppFooter';

// ═══════════════════════════════════════════════════════════════
// RESPONSIBILITY & OWNERSHIP STRUCTURE PANEL
// ═══════════════════════════════════════════════════════════════

function ResponsibilityOwnershipPanel({ results, inputs }: { results: AnalysisResults; inputs: ExposureInputs }) {
  const { components } = results;
  const providerCount = inputs.providers?.length || 0;
  const fragScore = Math.min(99, Math.round((components.dr * 0.3 + (1 - components.jd) * 0.3 + Math.min(1, providerCount / 3) * 0.2 + components.rc * 0.2) * 100));
  const stewScore = Math.min(99, Math.round((1 - (inputs.oversightLevel / 5) * 0.4 - (inputs.humanCheckpoints / 5) * 0.3 - components.jd * 0.3) * 100));
  const attribScore = Math.min(99, Math.round((components.dr * 0.5 + (1 - components.jd) * 0.3 + (inputs.executionAuthority / 5) * 0.2) * 100));
  const overallStatus = fragScore >= 60 ? 'Fragmented' : fragScore >= 35 ? 'Partial' : 'Clear';
  const statusColor = fragScore >= 60 ? 'text-fragile' : fragScore >= 35 ? 'text-sensitive' : 'text-stable';
  const showNoOwner = fragScore >= 50;
  const deployerIcon = components.jd >= 0.5 ? '✓' : '?';
  const oversightIcon = inputs.oversightLevel >= 4 ? '✓' : '?';

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Responsibility & Ownership Structure</div>
          <div className="text-[15px] font-bold text-foreground">Who Is Responsible? — And Can They Be Held Accountable?</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">This panel makes the responsibility structure explicit. Diffuse responsibility is not a neutral fact — it is a governance failure that creates unpriced liability. When no clear owner is identifiable, the system is effectively unownable.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className={`text-[32px] font-bold font-mono ${statusColor}`}>{fragScore}</div>
          <div className={`text-[10px] font-bold ${statusColor}`}>{overallStatus}</div>
        </div>
      </div>
      {showNoOwner && (
        <div className="p-3 bg-fragile-bg border border-fragile-border rounded-lg mb-4">
          <div className="text-[11px] font-bold text-fragile mb-1">⊘ No Clear System Owner Detected</div>
          <div className="text-[10px] text-fragile/80 leading-[1.5]">The structural profile does not indicate a single identifiable actor with both authority and accountability. High delegation + low justificatory density + multi-provider dependency = responsibility vacuum — where consequences are distributed but authority is diffuse.</div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Responsibility Fragmentation Score', val: fragScore, sub: 'Accountability distributed across multiple actors without clear assignment' },
          { label: 'Stewardship Clarity Index', val: stewScore, sub: 'No identifiable steward with authority to govern continuation' },
          { label: 'Decision Attribution Gap', val: attribScore, sub: 'AI decisions not fully attributable to identifiable human judgment' },
        ].map((m, i) => (
          <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
            <div className={`text-[22px] font-bold font-mono ${m.val >= 60 ? 'text-fragile' : m.val >= 35 ? 'text-sensitive' : 'text-stable'}`}>{m.val}</div>
            <div className="text-[9px] text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Responsibility Structure — Actor-by-Actor</div>
      <div className="space-y-2 mb-4">
        {[
          { icon: deployerIcon, status: deployerIcon === '✓' ? 'ok' : 'gap', title: 'Deployer Accountability', body: 'Deployer is responsible for use, oversight assignment, and log retention (Art. 26) — but cannot control model behavior, provider availability, or upstream system changes. Accountability is real but structurally bounded.' },
          { icon: '~', status: 'partial', title: 'Provider Accountability', body: 'External AI providers bear technical responsibility for model behavior but face no operational accountability for consequences at deployment sites. Provider terms typically disclaim downstream liability.' },
          { icon: oversightIcon, status: oversightIcon === '✓' ? 'ok' : 'gap', title: 'Oversight Actor — Named Human with Stop Authority', body: 'The system requires a named, empowered individual with both authority to suspend and operational knowledge to do so safely. Without this actor, continuation is structurally ungoverned.' },
          { icon: '✗', status: 'gap', title: 'Cross-System Liability — Cascade Accountability', body: 'When failure propagates across correlated infrastructure, cascade responsibility is entirely unresolved. No actor is accountable for aggregate portfolio impact.' },
        ].map((a, i) => {
          const bgMap: Record<string, string> = { ok: 'bg-stable text-foreground', partial: 'bg-sensitive text-foreground', gap: 'bg-fragile text-foreground' };
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${bgMap[a.status]}`}>{a.icon}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{a.title}</div>
                <div className="text-[10px] text-muted-foreground mt-[2px] leading-[1.5]">{a.body}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 bg-secondary border border-border rounded-lg text-[11px] text-secondary-foreground leading-[1.55]">
        <strong className="text-foreground">Underwriting Implication:</strong> Fragmented responsibility directly affects loss attribution, subrogation rights, and recovery pathways. Where no clear owner exists, insurers absorb residual liability by default.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXECUTIVE REPORT
// ═══════════════════════════════════════════════════════════════

export function ExecutiveReport() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showOverlay, setShowOverlay] = useState(false);
  const [showOnePager, setShowOnePager] = useState(false);

  if (!analysisComplete || !results) {
    return <LockedState title="Executive Report Locked" description="Complete the Exposure Analysis to generate a board-level executive report suitable for risk committees and reinsurers." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, eciTier, eciName, components, premium, amplificationFactor, correlationFactor, structuralScore } = results;
  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const score = Math.min(99, Math.round(afi * 60));
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const entity = inputs.companyName || 'Entity';
  const industry = inputs.industry || '—';
  const dr100 = Math.round(components.dr * 100);
  const jd100 = Math.round(components.jd * 100);
  const rc100 = Math.round(components.rc * 100);
  const cd100 = Math.round(components.cd * 100);

  const opsStatus = band === 'Fragile' ? 'ESCALATE TO COMMITTEE' : band === 'Sensitive' ? 'CONDITIONAL REVIEW' : 'STANDARD PROCESS';
  const opsRationale = band === 'Fragile'
    ? 'Standard coverage terms cannot be issued. Structural exposure exceeds underwriting tolerance — mandatory remediation required before any coverage offer.'
    : band === 'Sensitive'
    ? 'Conditional coverage available. Structural improvements required within 90 days — failure to deliver documented improvements warrants escalation to full committee review.'
    : 'Structural governance signals within normal parameters. Standard underwriting process applies.';

  const copyReport = () => {
    const text = buildExecutiveReport(inputs, results);
    navigator.clipboard.writeText(text);
    toast.success('Executive summary copied to clipboard');
  };

  const exportBoardPDF = () => {
    // Build a printable HTML document and trigger print dialog (browser PDF)
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>ARIA Board Report</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#1e2430;margin:40px;line-height:1.6}
h1{font-size:22px;margin-bottom:4px}h2{font-size:14px;margin-top:24px;border-bottom:2px solid #1e2430;padding-bottom:4px}
.badge{display:inline-block;padding:4px 12px;border-radius:4px;font-weight:700;font-size:12px}
.fragile{background:#fef3f1;color:#c9392a;border:1px solid #edc4bd}
.sensitive{background:#fef9ee;color:#b87400;border:1px solid #dfc98e}
.stable{background:#eff7f2;color:#227a44;border:1px solid #a8d2b8}
.metric{display:inline-block;margin-right:24px}.metric-label{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280}
.metric-value{font-size:20px;font-weight:700;font-family:monospace}
table{width:100%;border-collapse:collapse;margin:12px 0}td,th{padding:6px 10px;border:1px solid #e1e4e8;text-align:left;font-size:10px}
th{background:#f4f5f7;font-weight:700;text-transform:uppercase;font-size:9px;letter-spacing:0.05em}
.disclaimer{background:#fef3f1;border:1px solid #edc4bd;padding:12px;border-radius:4px;font-size:9px;color:#c9392a;margin:16px 0}
.footer{border-top:2px solid #1e2430;padding-top:8px;margin-top:32px;font-size:8px;color:#6b7280;display:flex;justify-content:space-between}
@media print{body{margin:20px}@page{margin:1cm}}
</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
<div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280">Governance Intelligence Report</div>
<h1>AI Risk Assessment Summary</h1>
<div style="font-size:11px;color:#6b7280">Entity: ${entity} · Industry: ${industry} · ${dateStr}</div></div>
<div style="text-align:right"><div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#6b7280">Report ID</div>
<div style="font-size:14px;font-weight:700;font-family:monospace">${reportId}</div></div></div>

<div class="disclaimer">⚠ GOVERNANCE INTELLIGENCE PLATFORM — This report provides decision-support signals only. Not binding underwriting decisions, not actuarial loss predictions, not regulatory certifications. All outputs require human review.</div>

<h2>Assessment Verdict</h2>
<div style="margin:12px 0"><span class="badge ${band.toLowerCase()}">${band.toUpperCase()} — ${decisionClass}</span></div>
<div style="margin:12px 0">
<span class="metric"><span class="metric-label">AFI Score</span><br><span class="metric-value">${afi.toFixed(2)}</span></span>
<span class="metric"><span class="metric-label">Band</span><br><span class="metric-value">${band}</span></span>
<span class="metric"><span class="metric-label">Structural Score</span><br><span class="metric-value">${structuralScore}</span></span>
<span class="metric"><span class="metric-label">Decision</span><br><span class="metric-value" style="font-size:14px">${decisionClass}</span></span>
</div>

<h2>AFI Components</h2>
<table><tr><th>Component</th><th>Value</th><th>Assessment</th></tr>
<tr><td>Delegation Ratio (DR)</td><td>${dr100}%</td><td>${dr100 > 70 ? 'High' : dr100 > 40 ? 'Moderate' : 'Low'}</td></tr>
<tr><td>Justificatory Density (JD)</td><td>${jd100}%</td><td>${jd100 < 40 ? 'Low (risk)' : jd100 < 60 ? 'Moderate' : 'Adequate'}</td></tr>
<tr><td>Reversibility Cost (RC)</td><td>${rc100}%</td><td>${rc100 > 70 ? 'High' : rc100 > 40 ? 'Moderate' : 'Low'}</td></tr>
<tr><td>Continuation Density (CD)</td><td>${cd100}%</td><td>${cd100 > 70 ? 'High' : cd100 > 40 ? 'Moderate' : 'Low'}</td></tr>
</table>

<h2>Loss Envelope (Qualitative Assessment)</h2>
<table><tr><th>Scenario</th><th>Assessment</th></tr>
<tr><td>Expected Loss Band</td><td>${lossEnvelope.expected}</td></tr>
<tr><td>Stress Scenario Band</td><td>${lossEnvelope.stress}</td></tr>
<tr><td>Tail / Systemic Band</td><td>${lossEnvelope.tail}</td></tr>
<tr><td>Portfolio Cluster</td><td>${lossEnvelope.portfolio}</td></tr>
</table>

<h2>Risk Indices</h2>
<table><tr><th>Index</th><th>Score</th><th>Assessment</th></tr>
<tr><td>AGRI (Agentic Risk)</td><td>${results.agri}</td><td>${results.agri >= 60 ? 'High' : results.agri >= 35 ? 'Moderate' : 'Low'}</td></tr>
<tr><td>ALRI (AI Liability Risk)</td><td>${results.alri}</td><td>${results.alri >= 60 ? 'High' : results.alri >= 35 ? 'Moderate' : 'Low'}</td></tr>
<tr><td>SCRI (Systemic Concentration)</td><td>${results.scri}</td><td>${results.scri >= 60 ? 'High' : results.scri >= 35 ? 'Moderate' : 'Low'}</td></tr>
</table>

<div class="disclaimer">Epistemic Status: This assessment is a structural governance signal — not actuarially certified. All loss figures are market-calibrated proxies. Self-attested inputs. Not legal advice. Framework: AGAF v4.2.0</div>

<div class="footer"><span>ARIA AI Governance Engine v4.2.0 · AGAF Framework · ${dateStr}</span><span>CONFIDENTIAL — Board & Committee Use Only</span></div>
</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
    toast.success('Board report opened for PDF export');
  };

  const reportId = `ARIA-${Date.now().toString(36).toUpperCase()}`;

   return (
    <div>
      {/* Enterprise Report Header */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
              Governance Intelligence Report
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              AI Risk Assessment Summary
            </h1>
          </div>
          <div className="sm:text-right">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">
              REPORT ID
            </div>
            <div className="text-[13px] font-mono font-bold text-foreground">
              {reportId}
            </div>
            <div className="text-[9px] text-muted-foreground mt-1">
              Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

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

      <UseRestrictionBanner />

      {/* Main verdict */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-4">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-3">AI Systemic Risk Assessment · Governance Exposure Engine v3.0</div>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
            <div className="text-[16px] sm:text-[22px] font-extrabold text-foreground leading-[1.25] mb-3 max-w-[580px]">
              Structural AI dependency creates underwriting exposure that current models do not price, reserve for, or capture.
            </div>
            <div className={`inline-block px-3 py-[6px] rounded-lg text-[12px] font-bold ${
              band === 'Fragile' ? 'bg-fragile text-foreground' :
              band === 'Sensitive' ? 'bg-sensitive text-foreground' :
              'bg-stable text-foreground'
            }`}>
              THIS MEANS: {band === 'Fragile' ? 'Standard coverage is not justified. Apply mandatory premium loading and require structural remediation before renewal.' :
                band === 'Sensitive' ? 'Conditional coverage — improvements required within 90 days.' :
                'Standard coverage terms apply.'}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-[28px] sm:text-[48px] font-extrabold font-mono leading-none ${
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
          Risk characterization based on structural governance factors: AFI score, delegation depth, provider concentration, continuation cost. Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries." Framework is governance-oriented, not actuarially certified.
        </div>
      </div>

      {/* ═══ LOSS ENVELOPE ═══ */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-4">
        <div className="mb-4">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">Market-Calibrated Loss Envelope</div>
          <div className="text-[11px] text-secondary-foreground">Lloyd's AI/Tech-E&O Guidelines 2024–25 · Munich Re Q4 2025 · Swiss Re sigma insights 01/2026</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Expected Loss', value: lossEnvelope.expected, sub: 'Base scenario · median market outcome', bg: 'bg-stable-bg', border: 'border-stable-border', color: 'text-stable', labelColor: 'text-stable' },
            { label: 'Base Risk Band', value: lossEnvelope.stress, sub: 'Structural governance exposure', bg: 'bg-sensitive-bg', border: 'border-sensitive-border', color: 'text-sensitive', labelColor: 'text-sensitive' },
            { label: 'Critical Risk Band', value: lossEnvelope.tail, sub: 'Provider concentration · Tail risk', bg: 'bg-fragile-bg', border: 'border-fragile-border', color: 'text-fragile', labelColor: 'text-fragile' },
            { label: 'Systemic Exposure', value: lossEnvelope.portfolio, sub: 'Correlated entity cluster (8–15 entities)', bg: 'bg-fragile-bg', border: 'border-fragile-border', color: 'text-fragile', labelColor: 'text-fragile' },
          ].map((cell, i) => (
            <div key={i} className={`${cell.bg} border ${cell.border} rounded-xl p-4 sm:p-5`}>
              <div className={`text-[8px] font-bold tracking-[0.09em] uppercase ${cell.labelColor} mb-2`}>{cell.label}</div>
              <div className={`text-[24px] sm:text-[28px] font-bold font-mono leading-none ${cell.color}`}>{cell.value}</div>
              <div className="text-[9px] text-muted-foreground mt-2">{cell.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-fragile-bg border border-fragile-border rounded-lg p-3 flex items-start gap-3">
          <span className="text-fragile text-sm flex-shrink-0 mt-[1px]">⚠</span>
          <div className="text-[11px] text-secondary-foreground leading-[1.55]">
            <strong className="text-fragile">Correlated AI infrastructure</strong> creates significant non-linear risk amplification vs. isolated incidents. Swiss Re sigma insights 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk." Reinsurance treaty review required above AFI 1.35.
          </div>
        </div>
      </div>

      {/* ═══ MANDATORY CONDITIONS (Fragile only) ═══ */}
      {afi >= 1.35 && (
        <div className="bg-fragile-bg border-2 border-fragile rounded-xl p-5 sm:p-6 mb-4">
          <div className="flex items-start gap-3 mb-5">
            <div className="text-fragile text-2xl">⚠</div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-fragile mb-2">
                Required Underwriting Actions — Mandatory Conditions Before Standard Coverage Applies
              </div>
              <div className="text-[11px] text-secondary-foreground leading-relaxed">
                Governance fragility index exceeds standard assumptions. All conditions below must be met before coverage can be offered. These are binding underwriting requirements.
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { num: '1', title: 'Apply significant premium loading above standard', desc: 'Mandatory — structural risk exceeds standard pricing assumptions. Treat as minimum pricing floor, not target. Standard actuarial models do not capture continuation governance exposure.', source: "Lloyd's AI Underwriting Framework 2025" },
              { num: '2', title: 'Require dependency diversification within 90 days', desc: 'Mandatory — minimum 3 providers across critical model endpoints. Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic risk." Single-provider concentration creates cascade risk.', source: 'Munich Re AI Risk Guidelines Q4 2025' },
              { num: '3', title: 'Enforce quarterly governance re-authorisation cadence', desc: 'Condition of coverage — system persists by default without explicit continuation decision. Art. 72 post-market monitoring insufficient without re-authorisation trigger.', source: 'EU AI Act Art. 72 / EIOPA Opinion Aug 2025' },
              { num: '4', title: 'Limit coverage scope to operational layers only', desc: 'Recommended — full-stack coverage uneconomic at current lock-in depth. Exclude autonomous execution liability, model drift cascade exposure, and cross-entity correlation risk.', source: 'LMA E&O Guidelines 2025' },
            ].map((action, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-card border border-fragile/30 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-fragile flex items-center justify-center font-bold text-foreground text-sm flex-shrink-0">{action.num}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-foreground mb-1 leading-tight">{action.title}</div>
                  <div className="text-[11px] text-secondary-foreground leading-relaxed mb-2">{action.desc}</div>
                  <div className="text-[9px] text-muted-foreground italic">Source: {action.source}</div>
                </div>
                <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-fragile-bg border border-fragile-border rounded text-[9px] font-bold text-fragile uppercase tracking-wide">● Required</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-secondary border border-fragile/30 rounded-lg">
            <div className="text-[10px] font-bold text-fragile mb-2 uppercase tracking-wide">Non-Compliance Impact</div>
            <div className="text-[11px] text-secondary-foreground leading-relaxed">
              Failure to implement these conditions within the specified timeline results in coverage termination at next renewal. Structural fragility at this level cannot be insured under standard terms. Committee escalation required for any binding decision.
            </div>
          </div>
        </div>
      )}

      {/* Risk Position + Financial Exposure */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <div className="p-4 sm:p-5 sm:border-r border-b sm:border-b-0 border-border">
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Risk Position</div>
            <div className="space-y-[10px]">
              {(band === 'Fragile' ? [
                { color: 'bg-fragile', title: 'Above underwriting tolerance', sub: `AFI ${afi.toFixed(2)} — exceeds Fragile threshold (1.35)` },
                { color: 'bg-fragile', title: 'Standard coverage not justified', sub: 'Structural change required before standard rates apply' },
                { color: 'bg-sensitive', title: 'Premium loading mandatory', sub: 'Significant loading above standard — mandatory pricing adjustment' },
              ] : band === 'Sensitive' ? [
                { color: 'bg-sensitive', title: 'Approaching underwriting tolerance', sub: `AFI ${afi.toFixed(2)} — within Sensitive range (0.85–1.35)` },
                { color: 'bg-sensitive', title: 'Conditional coverage available', sub: 'Structural improvements required within 90 days' },
                { color: 'bg-sensitive', title: 'Precautionary premium loading', sub: 'Elevated loading above standard — recommended pricing adjustment' },
              ] : [
                { color: 'bg-stable', title: 'Within underwriting tolerance', sub: `AFI ${afi.toFixed(2)} — below Stable threshold (0.85)` },
                { color: 'bg-stable', title: 'Standard coverage terms apply', sub: 'No structural remediation required' },
                { color: 'bg-stable', title: 'Standard pricing', sub: 'No mandatory loading — routine governance monitoring' },
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-[10px]">
                  <div className={`w-[6px] h-[6px] rounded-full ${item.color} flex-shrink-0 mt-[5px]`} />
                  <div>
                    <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Financial Exposure</div>
            <div className="space-y-[10px]">
              {[
                { color: 'bg-stable', title: `Base risk band: ${lossEnvelope.expected}`, sub: 'Structural baseline — AFI-derived characterization' },
                { color: 'bg-sensitive', title: `Elevated risk band: ${lossEnvelope.stress}`, sub: 'Provider concentration and delegation factors' },
                { color: 'bg-fragile', title: `Critical risk band: ${lossEnvelope.tail}`, sub: 'Tail exposure — correlated dependency structures' },
                { color: 'bg-fragile', title: `Systemic exposure: ${lossEnvelope.portfolio}`, sub: 'If 8–15 entities share similar AI infrastructure' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-[10px]">
                  <div className={`w-[6px] h-[6px] rounded-full ${item.color} flex-shrink-0 mt-[5px]`} />
                  <div>
                    <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-border">
          <div className="p-4 sm:p-5 sm:border-r border-b sm:border-b-0 border-border">
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Systemic Signals</div>
            <div className="space-y-[10px]">
              {[
                { color: 'bg-fragile', title: 'Continuation risk', sub: 'System persists without explicit re-authorisation — accumulating liability' },
                { color: 'bg-fragile', title: 'Dependency concentration', sub: 'External provider reliance creates single points of failure' },
                { color: 'bg-sensitive', title: 'Aggregation exposure', sub: 'Shared infrastructure creates portfolio-level correlated risk' },
                { color: 'bg-primary', title: 'Non-linear loss amplification', sub: `Cascade propagation across 5 layers — ${amplificationFactor} amplification` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-[10px]">
                  <div className={`w-[6px] h-[6px] rounded-full ${item.color} flex-shrink-0 mt-[5px]`} />
                  <div>
                    <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Required Action</div>
            <div className="space-y-[10px]">
              {(band === 'Fragile' ? [
                { color: 'bg-fragile', title: 'Apply premium loading (150–180%)', sub: 'Mandatory — structural risk exceeds standard pricing' },
                { color: 'bg-fragile', title: 'Require dependency diversification', sub: 'Mandatory within 90 days — minimum 3 providers' },
                { color: 'bg-sensitive', title: 'Enforce governance cadence', sub: 'Condition of coverage — quarterly re-authorisation minimum' },
                { color: 'bg-sensitive', title: 'Limit coverage to operational layers', sub: 'Recommended — full-stack coverage uneconomic at current lock-in' },
              ] : band === 'Sensitive' ? [
                { color: 'bg-sensitive', title: 'Increase governance review cadence', sub: 'Required — quarterly review minimum recommended' },
                { color: 'bg-sensitive', title: 'Document exit paths', sub: 'Required — verify dependency exit capability before renewal' },
                { color: 'bg-primary', title: 'Apply precautionary loading (80–120%)', sub: 'Recommended — trajectory warrants proactive pricing' },
              ] : [
                { color: 'bg-stable', title: 'Maintain governance cadence', sub: 'Re-assess annually — structural changes require re-assessment' },
                { color: 'bg-primary', title: 'Monitor delegation density', sub: 'Key drift vector — tends to increase silently over time' },
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-[10px]">
                  <div className={`w-[6px] h-[6px] rounded-full ${item.color} flex-shrink-0 mt-[5px]`} />
                  <div>
                    <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Required Underwriting Actions — dynamic by band */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Required Underwriting Actions</div>
        <div className="text-[14px] font-bold text-foreground mb-4">
          {band === 'Fragile' ? 'Mandatory conditions before standard coverage terms apply' :
           band === 'Sensitive' ? 'Conditional requirements for coverage renewal' :
           'Standard governance maintenance requirements'}
        </div>
        <div className="space-y-3">
          {(band === 'Fragile' ? [
            { num: 1, title: 'Apply mandatory premium loading (150–180%)', desc: 'Structural risk exceeds standard pricing assumptions. AFI-derived loading must be applied before any coverage is offered.' },
            { num: 2, title: 'Require dependency diversification within 90 days', desc: 'Single-provider concentration creates uninsurable systemic risk. Minimum 3 independent providers across model, compute, and orchestration layers.' },
            { num: 3, title: 'Enforce quarterly re-authorisation cadence', desc: 'Condition of coverage — each deployed AI system must undergo formal re-authorisation at least quarterly with explicit sign-off from named oversight actor.' },
            { num: 4, title: 'Limit coverage scope to operational layers', desc: 'Full-stack coverage is uneconomic at current structural lock-in levels. Recommended to limit coverage to operational impact layers only.' },
          ] : band === 'Sensitive' ? [
            { num: 1, title: 'Increase governance review cadence to quarterly', desc: 'Current oversight density is insufficient given dependency trajectory. Quarterly structured reviews required.' },
            { num: 2, title: 'Document and test dependency exit paths', desc: 'Reversibility cost is elevated — exit capability must be verified and documented before next renewal.' },
            { num: 3, title: 'Apply precautionary premium loading (80–120%)', desc: 'Below Fragile threshold but trajectory warrants proactive pricing adjustment to reflect emerging structural risk.' },
          ] : [
            { num: 1, title: 'Maintain current governance cadence', desc: 'Continue annual re-assessment cycle. Any material change in AI deployment scope, provider dependencies, or delegation authority triggers mandatory re-assessment.' },
            { num: 2, title: 'Monitor key drift vectors', desc: 'Delegation density and provider concentration tend to increase silently. Establish threshold alerts for proactive governance intervention.' },
          ]).map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-secondary border border-border rounded-lg">
              <div className={`w-[24px] h-[24px] rounded-full text-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-[2px] ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`}>{action.num}</div>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{action.title}</div>
                <div className="text-[11px] text-muted-foreground leading-[1.55] mt-[2px]">{action.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsibility & Ownership Structure */}
      <ResponsibilityOwnershipPanel results={results} inputs={inputs} />

      {/* Epistemic Status — Dark section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-sensitive mb-3">◆ Epistemic Status · What This Assessment Cannot Guarantee</div>
        <div className="text-[18px] font-bold text-foreground mb-3">You Cannot Rely on This Evaluation</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.6] mb-4">
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
            <div key={i} className="p-3 bg-secondary border border-border rounded-lg">
              <div className="text-[11px] font-bold text-sensitive mb-1">{item.title}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.5]">{item.body}</div>
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
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowOnePager(true)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors">
            📄 One-Pager PDF Preview
          </button>
          <button onClick={() => setShowOverlay(true)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors">
            📋 Board Executive Summary
          </button>
          <button onClick={() => exportORSA(results, inputs)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors">
            📄 Export ORSA Section
          </button>
          <button onClick={exportBoardPDF} className="px-5 py-2.5 bg-foreground text-background rounded-lg text-[13px] font-semibold hover:bg-foreground/90 transition-colors">
            🖨 Export Board PDF
          </button>
        </div>
      </div>

      {/* ═══ ONE-PAGER PDF PREVIEW OVERLAY ═══ */}
      {showOnePager && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-6 overflow-y-auto" onClick={() => setShowOnePager(false)}>
          <div className="bg-white w-[820px] max-w-full rounded shadow-2xl" onClick={e => e.stopPropagation()} style={{ fontFamily: 'Inter, sans-serif', color: '#141410' }}>
            {/* Toolbar */}
            <div className="sticky top-0 bg-[#f4f3ef] border-b border-[#dedbd2] px-4 py-2.5 flex items-center justify-between z-10 rounded-t">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>⚡ AI Exposure Engine · One-Pager Preview</div>
              <div className="flex gap-2">
                <button onClick={() => setShowOnePager(false)} style={{ fontSize: 11, padding: '4px 12px', background: '#f0eeea', border: '1px solid #dedbd2', borderRadius: 4, cursor: 'pointer' }}>✕ Close</button>
                <button onClick={() => window.print()} style={{ fontSize: 11, padding: '4px 12px', background: '#4038b8', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>🖨 Print / Save PDF</button>
              </div>
            </div>
            <div style={{ padding: '52px 60px', fontSize: 11, lineHeight: 1.6 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #141410' }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#96938c', marginBottom: 4 }}>AI Governance Infrastructure Layer</div>
                  <div style={{ fontSize: 7, color: '#96938c' }}>Decision Intelligence System v3.0 · Structural AI Risk Operating Layer</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 10 }}>
                  <div><strong>{entity}</strong></div>
                  <div style={{ color: '#5a5850' }}>{industry}</div>
                  <div style={{ color: '#5a5850' }}>{dateStr}</div>
                  <div style={{ marginTop: 4 }}><span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px', background: '#fef1f0', border: '1px solid #e8b8b2', borderRadius: 3, color: '#b53020', textTransform: 'uppercase' }}>CONFIDENTIAL</span></div>
                </div>
              </div>

              {/* Operational Decision Status */}
              <div style={{
                padding: '16px 20px', borderRadius: 6, marginBottom: 18, position: 'relative', overflow: 'hidden',
                background: band === 'Fragile' ? '#fef1f0' : band === 'Sensitive' ? '#fef5e6' : '#eaf6ee',
                border: `1px solid ${band === 'Fragile' ? '#e8b8b2' : band === 'Sensitive' ? '#e8c878' : '#90d0a8'}`,
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 28, fontWeight: 700, color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030', letterSpacing: '0.08em' }}>{opsStatus}</div>
                </div>
                <div style={{ fontSize: 10, color: '#5a5850', marginTop: 6, lineHeight: 1.5 }}>{opsRationale}</div>
              </div>

              {/* Verdict */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', borderRadius: 6, marginBottom: 18,
                background: band === 'Fragile' ? '#fef1f0' : band === 'Sensitive' ? '#fef5e6' : '#eaf6ee',
                borderLeft: `4px solid ${band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030'}`,
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030' }}>{score}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030' }}>
                    {band.toUpperCase()} — {band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching threshold' : 'Within tolerance'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#5a5850', marginTop: 4 }}>
                    {band === 'Fragile' ? 'STRUCTURAL EXPOSURE SIGNALS — COMMITTEE REVIEW REQUIRED' : band === 'Sensitive' ? 'ELEVATED STRUCTURAL SIGNALS — CONDITIONAL REVIEW PROCESS' : 'GOVERNANCE SIGNALS WITHIN RANGE — STANDARD UNDERWRITING PROCESS'}
                  </div>
                  <div style={{ fontSize: 9, color: '#96938c', marginTop: 4, lineHeight: 1.5 }}>
                    {band === 'Fragile' ? 'This system creates structural AI risk not priced, modelled, or reserved for in standard underwriting frameworks.' : band === 'Sensitive' ? 'Governance gaps and dependency concentration signal drift toward Fragile classification.' : 'Structural exposure is within manageable bounds.'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', color: '#96938c', textTransform: 'uppercase' }}>ECI</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030' }}>ECI-{eciTier}</div>
                  <div style={{ fontSize: 8, color: '#96938c' }}>{eciName}</div>
                </div>
              </div>

              {/* Key Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
                {[
                  { l: 'AFI', v: afi.toFixed(2), c: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030' },
                  { l: 'DR (Delegation)', v: `${dr100}%`, c: dr100 > 65 ? '#b53020' : dr100 > 40 ? '#9c6200' : '#146030' },
                  { l: 'RC (Reversibility)', v: `${rc100}%`, c: rc100 > 65 ? '#b53020' : rc100 > 40 ? '#9c6200' : '#146030' },
                  { l: 'CD (Continuation)', v: `${cd100}%`, c: cd100 > 65 ? '#b53020' : cd100 > 40 ? '#9c6200' : '#146030' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 4, textAlign: 'center' }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#96938c', marginBottom: 3 }}>{m.l}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: m.c }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Loss Envelope */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#96938c', marginBottom: 6 }}>Financial Exposure — Loss Envelope</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'Expected', v: lossEnvelope.expected },
                    { l: 'Stress', v: lossEnvelope.stress },
                    { l: 'Tail (99th)', v: lossEnvelope.tail },
                    { l: 'Portfolio', v: lossEnvelope.portfolio },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 4, textAlign: 'center' }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 3 }}>{m.l}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: '#141410' }}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 8, color: '#96938c', marginTop: 6, lineHeight: 1.5 }}>
                  ⚠ Non-linear amplification across correlated AI infrastructure. Portfolio loss assumes 5 entities with similar AI infrastructure stack. Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds systemic and accumulation risk."
                </div>
              </div>

              {/* Required Actions */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#96938c', marginBottom: 6 }}>Required Underwriting Actions</div>
                {(band === 'Fragile' ? [
                  'Immediate actuarial review — current structural exposure exceeds standard models',
                  'Apply 150–180% premium loading — mandatory floor',
                  'Require dependency diversification within 90 days (min. 3 providers)',
                  'Quarterly governance re-authorisation mandate',
                ] : band === 'Sensitive' ? [
                  'Apply precautionary premium loading (80–120%)',
                  'Increase governance review cadence to quarterly',
                  'Document and test dependency exit paths',
                ] : [
                  'Standard monitoring — maintain governance cadence',
                  'Annual reassessment at renewal',
                ]).map((action, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 10px', background: i % 2 === 0 ? '#f8f7f3' : 'transparent', borderRadius: 3, fontSize: 10, lineHeight: 1.5 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030', flexShrink: 0 }}>{i + 1}.</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimers */}
              <div style={{ padding: '10px 14px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 4, fontSize: 8, color: '#96938c', lineHeight: 1.6, marginBottom: 18 }}>
                <strong style={{ color: '#5a5850' }}>Epistemic Status:</strong> Structural governance signal — not actuarially certified. Risk bands are qualitative indicators based on Swiss Re sigma insights 01/2026. Self-attested inputs. Not legal advice.
              </div>

              {/* Footer */}
              <div style={{ borderTop: '1px solid #dedbd2', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#96938c' }}>
                <span>AI Governance Engine v3.0 · AGAF Framework · {dateStr}</span>
                <span>{band === 'Fragile' ? '⚠ FRAGILE — Action Required' : band === 'Sensitive' ? '⚡ SENSITIVE — Monitor' : '✓ STABLE'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOARD EXECUTIVE SUMMARY OVERLAY ═══ */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-6 overflow-y-auto" onClick={() => setShowOverlay(false)}>
          <div className="bg-white w-[860px] max-w-full rounded shadow-2xl" onClick={e => e.stopPropagation()} style={{ fontFamily: 'Inter, sans-serif', color: '#141410' }}>
            {/* Toolbar */}
            <div className="sticky top-0 bg-[#f4f3ef] border-b border-[#dedbd2] px-4 py-2.5 flex items-center justify-between z-10 rounded-t">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>AI Governance Infrastructure Layer · Board Executive Summary</div>
              <div className="flex gap-2">
                <button onClick={() => setShowOverlay(false)} style={{ fontSize: 11, padding: '4px 12px', background: '#f0eeea', border: '1px solid #dedbd2', borderRadius: 4, cursor: 'pointer' }}>✕ Close</button>
                <button onClick={() => window.print()} style={{ fontSize: 11, padding: '4px 12px', background: '#4038b8', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>🖨 Print / Save PDF</button>
              </div>
            </div>
            <div style={{ padding: '52px 60px', fontSize: 11, lineHeight: 1.6 }}>
              {/* Cover */}
              <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #141410' }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#96938c', marginBottom: 8 }}>AI Governance Infrastructure Layer · Board Executive Summary</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#141410', marginBottom: 6 }}>{entity}</div>
                <div style={{ fontSize: 11, color: '#5a5850', lineHeight: 1.6, marginBottom: 16 }}>
                  {industry} · Structural AI Governance Assessment · AI Governance Engine v3.0<br />
                  This document constitutes a formal governance assessment. Not a compliance report. Intended for risk committee and board review only.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {[
                    { l: 'Assessment Date', v: dateStr },
                    { l: 'AFI Score', v: `${afi.toFixed(2)} · ${band}` },
                    { l: 'ECI Tier', v: `${eciTier} — ${eciName}` },
                    { l: 'Operational Status', v: opsStatus },
                    { l: 'Score', v: `${score}/100` },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '6px 8px', background: '#f8f7f3', borderRadius: 4, border: '1px solid #dedbd2' }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 2 }}>{m.l}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#141410' }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 8 }}>Operational Decision Status</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 6,
                  borderLeft: `4px solid ${band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030'}`,
                  background: band === 'Fragile' ? '#fef1f0' : band === 'Sensitive' ? '#fef5e6' : '#eaf6ee',
                }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, fontWeight: 700, color: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030', flexShrink: 0 }}>{opsStatus}</div>
                  <div>
                    <div style={{ fontSize: 10, color: '#5a5850', lineHeight: 1.6 }}>{opsRationale}</div>
                    <div style={{ fontSize: 9, color: '#96938c', marginTop: 4 }}>AFI {afi.toFixed(2)} · {band} · Score {score}/100 · ECI {eciTier}</div>
                  </div>
                </div>
              </div>

              {/* Structural Risk Indicators */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 8 }}>Structural Risk Indicators</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { l: 'Authority Fragility Index', v: afi.toFixed(2), c: band === 'Fragile' ? '#b53020' : band === 'Sensitive' ? '#9c6200' : '#146030', s: `${band} · ${band === 'Fragile' ? 'Above underwriting tolerance' : band === 'Sensitive' ? 'Approaching threshold' : 'Within tolerance'}` },
                    { l: 'Delegation Density', v: `${dr100}`, c: dr100 > 65 ? '#b53020' : dr100 > 40 ? '#9c6200' : '#146030', s: 'Autonomous decision share without human review' },
                    { l: 'Reversibility Cost Index', v: `${rc100}`, c: rc100 > 65 ? '#b53020' : rc100 > 40 ? '#9c6200' : '#146030', s: 'Structural lock-in — exit difficulty and cost' },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 6 }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#96938c', marginBottom: 4 }}>{m.l}</div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: m.c }}>{m.v}</div>
                      <div style={{ fontSize: 9, color: '#96938c', marginTop: 2 }}>{m.s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loss Envelope */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 8 }}>Financial Exposure — Loss Envelope</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { l: 'Expected Loss', v: lossEnvelope.expected, s: 'Base scenario' },
                    { l: 'Stress Scenario', v: lossEnvelope.stress, s: 'Governance exposure' },
                    { l: 'Tail Risk', v: lossEnvelope.tail, s: '99th percentile' },
                    { l: 'Portfolio', v: lossEnvelope.portfolio, s: `${amplificationFactor}` },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 6, textAlign: 'center' }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 4 }}>{m.l}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: '#141410' }}>{m.v}</div>
                      <div style={{ fontSize: 8, color: '#96938c', marginTop: 2 }}>{m.s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Actions */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96938c', marginBottom: 8 }}>Required Underwriting Actions</div>
                {(band === 'Fragile' ? [
                  { cls: 'r', t: 'Apply 150–180% premium loading — mandatory floor', s: 'Structural risk exceeds standard pricing.' },
                  { cls: 'r', t: 'Require dependency diversification within 90 days', s: 'Minimum 3 providers required. Reduces aggregate tail exposure 40–60%.' },
                  { cls: 'r', t: 'Commission exit feasibility assessment', s: 'ECI tier indicates institutional dependency — exit path must be documented.' },
                  { cls: 'a', t: 'Institute quarterly governance re-authorisation', s: 'Without re-authorisation cadence, structural risk accumulates without upper bound.' },
                  { cls: 'a', t: 'Reinsurance treaty review required', s: `Portfolio aggregate: ${lossEnvelope.portfolio} under correlated cascade.` },
                ] : band === 'Sensitive' ? [
                  { cls: 'a', t: 'Apply precautionary premium loading (80–120%)', s: 'Below Fragile threshold but trajectory warrants adjustment.' },
                  { cls: 'a', t: 'Increase governance review cadence to quarterly', s: 'Current oversight insufficient given dependency trajectory.' },
                  { cls: 'a', t: 'Document and test dependency exit paths', s: 'Reversibility cost is elevated — verify exit capability.' },
                ] : [
                  { cls: 'g', t: 'Maintain annual re-assessment at renewal', s: 'AFI is within tolerance — re-assess on material change.' },
                  { cls: 'g', t: 'Confirm governance cadence documentation', s: 'Standard coverage conditional on maintained governance.' },
                ]).map((action, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', marginBottom: 6, borderRadius: 6,
                    borderLeft: `3px solid ${action.cls === 'r' ? '#b53020' : action.cls === 'a' ? '#9c6200' : '#146030'}`,
                    background: action.cls === 'r' ? '#fef1f0' : action.cls === 'a' ? '#fef5e6' : '#eaf6ee',
                  }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 12, color: action.cls === 'r' ? '#b53020' : action.cls === 'a' ? '#9c6200' : '#146030', flexShrink: 0 }}>{i + 1}.</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#141410' }}>{action.t}</div>
                      <div style={{ fontSize: 9, color: '#5a5850', marginTop: 2 }}>{action.s}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consequences */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: band === 'Fragile' ? '#b53020' : '#96938c', marginBottom: 8 }}>
                  {band === 'Fragile' ? '⊘ If This Decision Is Ignored — Structural Consequences' : band === 'Sensitive' ? '⚠ If Remediation Is Deferred — Escalation Consequences' : '↗ Structural Drift Risk'}
                </div>
                {(band === 'Fragile' ? [
                  { t: 'Reserve Understatement', s: `Expected loss band: ${lossEnvelope.expected} — understates required reserves without premium loading.` },
                  { t: `Portfolio Contagion: ${lossEnvelope.portfolio}`, s: `${amplificationFactor} — cascade amplification across correlated infrastructure.` },
                  { t: 'Statutory Penalty Exposure', s: 'Active Art. 26 + Art. 72 violations: up to €15M or 3% global turnover (Art. 99 §4).' },
                ] : band === 'Sensitive' ? [
                  { t: 'Trajectory to NOT APPROVED', s: 'Without intervention within 90 days, automatic escalation at next assessment.' },
                  { t: 'Reserve Basis Invalidation', s: 'Conditional exposure invalidated if improvements not delivered.' },
                ] : [
                  { t: 'Non-Linear Structural Drift', s: 'Delegation and dependency increase over time without active governance.' },
                  { t: 'Assessment Age Risk', s: 'Every unreviewed period is an ungoverned interval.' },
                ]).map((c, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 4, marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#141410' }}>{c.t}</div>
                    <div style={{ fontSize: 9, color: '#5a5850', marginTop: 2, lineHeight: 1.5 }}>{c.s}</div>
                  </div>
                ))}
              </div>

              {/* Epistemic note */}
              <div style={{ padding: '10px 14px', background: '#f8f7f3', border: '1px solid #dedbd2', borderRadius: 4, fontSize: 8, color: '#96938c', lineHeight: 1.6, marginBottom: 18 }}>
                <strong style={{ color: '#5a5850' }}>Epistemic Status:</strong> This assessment is a structural governance signal — not actuarially certified. All loss figures are market-calibrated proxies. Self-attested inputs. Not legal advice. Not a compliance certification. Intended for risk committee, board, and reinsurer review only.
              </div>

              {/* Footer */}
              <div style={{ borderTop: '2px solid #141410', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#96938c' }}>
                <span>AI Governance Engine v3.0 · AGAF Framework · {dateStr}</span>
                <span>CONFIDENTIAL — Board & Committee Use Only</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit & Traceability Metadata */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-foreground mb-3">
          Assessment Metadata
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
          <div>
            <div className="text-muted-foreground mb-1">Framework Version</div>
            <div className="font-mono font-semibold text-foreground">AGAF v4.1.0</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Assessment Date</div>
            <div className="font-mono font-semibold text-foreground">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Assessment ID</div>
            <div className="font-mono font-semibold text-foreground">{reportId}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Entity Profile</div>
            <div className="font-mono font-semibold text-foreground">
              {inputs.industry || 'Not specified'}
            </div>
          </div>
        </div>
        <div className="mt-3 text-[9px] text-muted-foreground">
          This assessment snapshot is exportable for compliance and audit purposes.
          All input parameters and calculation logic are traceable via Evidence Log.
        </div>
      </div>

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(4)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Insurance Decision</button>
        <span className="text-[10px] text-muted-foreground italic">Step 5 of 6 · Board-level documentation</span>
        <button onClick={() => setActiveStep(6)} className="view-nav-next">Model Governance →</button>
      </div>

      <AppFooter />
    </div>
  );
}
