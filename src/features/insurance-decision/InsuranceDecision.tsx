import React, { useState } from 'react';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { useApp } from '@/hooks/useAppState';
import { BandBadge, LockedState, InfoTip } from '@/components/shared/UIComponents';
import { formatDate } from '@/lib/formatters';
import { TOOLTIPS } from '@/lib/tooltips';
import { AppFooter } from '@/components/shared/AppFooter';
import { evaluateFramework } from '@/features/insurability-framework/frameworkLogic';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function InsuranceDecision() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!analysisComplete || !results) {
    return <LockedState title="Insurance Decision Locked" description="Complete the Exposure Analysis to view the underwriting decision." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, decisionClass, lossEnvelope, components, premium, structuralScore, alri, agri, scri, compositeRiskIndex } = results;
  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const thresholdPos = Math.min(100, Math.round((afi / 3.0) * 100));

  const framework = evaluateFramework(inputs, results);
  const tierAction = framework.overallTier === 1 ? 'Accept — Standard Terms' : framework.overallTier === 2 ? 'Refer — Enhanced Terms Required' : 'Decline — Unacceptable Risk';
  const criticalConditions = framework.conditions.filter(c => c.score >= 2);
  const passedConditions = framework.conditions.filter(c => c.score === 1);

  const decision = band === 'Fragile' ? 'DECLINE' : band === 'Sensitive' ? 'REFER' : 'ACCEPT';
  const decisionBg = band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable';

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 3 of 8 · Underwriting Decision</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Insurance Decision</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Underwriting determination for {inputs.companyName || 'the assessed entity'} based on structural risk assessment.
        </p>
      </div>

      {/* ═══ SECTION 1: UNDERWRITING DECISION ═══ */}
      <div className={`rounded-lg p-5 sm:p-6 mb-4 border-2 ${band === 'Fragile' ? 'bg-card border-fragile' : band === 'Sensitive' ? 'bg-card border-sensitive' : 'bg-card border-stable'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Underwriting Decision</div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-lg text-[16px] font-bold text-white ${decisionBg}`}>{decision}</span>
              <BandBadge band={band} size="md" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">AFI Score</div>
            <div className={`text-[36px] font-bold font-mono leading-none ${bandColor}`}>{afi.toFixed(2)}</div>
          </div>
        </div>

        <div className="text-[13px] text-foreground leading-[1.5] mb-4">
          {band === 'Fragile'
            ? 'Structural risk exceeds underwriting tolerance. Coverage requires committee review, mandatory remediation, and significant premium loading.'
            : band === 'Sensitive'
            ? 'Elevated risk profile. Conditional coverage available with governance improvement timeline and precautionary premium loading.'
            : 'Standard risk profile within tolerance. Normal underwriting terms apply with routine monitoring.'}
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/50">
          {[
            { label: 'Premium Range', value: premium.band },
            { label: 'Risk Band', value: band },
            { label: 'Composite Risk', value: `${compositeRiskIndex}` },
            { label: 'Decision Class', value: decisionClass },
          ].map((m, i) => (
            <div key={i}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className="text-[14px] font-bold font-mono text-foreground">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Insurability Threshold Position</div>
        <div className="relative h-[20px] rounded-full overflow-hidden mb-2" style={{
          background: 'linear-gradient(to right, hsl(var(--stable)) 0%, hsl(var(--stable)) 28%, hsl(var(--sensitive)) 28%, hsl(var(--sensitive)) 45%, hsl(var(--fragile)) 45%, hsl(var(--fragile)) 100%)'
        }}>
          <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-lg z-10" style={{ left: `${thresholdPos}%`, transform: 'translateX(-50%)' }} />
          <div className="absolute top-[-2px] w-[10px] h-[10px] rounded-full bg-white border-2 border-foreground shadow z-10" style={{ left: `${thresholdPos}%`, transform: 'translateX(-50%)' }} />
        </div>
        <div className="flex justify-between text-[8px] text-muted-foreground">
          <span>Accept · Standard</span>
          <span>Refer · Conditional</span>
          <span>Decline · Remediation Required</span>
        </div>
      </div>

      {/* ═══ SECTION 2: INSURABILITY ASSESSMENT ═══ */}
      <div className={`rounded-lg border-2 p-5 mb-4 ${framework.overallTier === 1 ? 'bg-stable/5 border-stable' : framework.overallTier === 2 ? 'bg-sensitive/5 border-sensitive' : 'bg-fragile/5 border-fragile'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-foreground" />
            <span className="text-[14px] font-bold text-foreground">Insurability Assessment</span>
          </div>
          <Badge className={`text-[11px] font-bold px-3 py-1 ${framework.overallTier === 1 ? 'bg-stable text-white' : framework.overallTier === 2 ? 'bg-sensitive text-white' : 'bg-fragile text-white'}`}>
            {tierAction}
          </Badge>
        </div>

        <p className="text-[12px] text-foreground leading-relaxed mb-3">{framework.summary}</p>

        {/* Critical findings */}
        {criticalConditions.length > 0 && (
          <div className="space-y-2 mb-3">
            <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Critical Findings</div>
            {criticalConditions.map((c) => (
              <div key={c.condition} className="flex items-start gap-2 p-3 bg-card border border-border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {c.score === 3 ? <XCircle className="w-4 h-4 text-fragile" /> : <AlertTriangle className="w-4 h-4 text-sensitive" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-foreground">{c.condition}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${c.score === 3 ? 'bg-fragile/15 text-fragile border-fragile/30' : 'bg-sensitive/15 text-sensitive border-sensitive/30'}`}>{c.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{c.reasoning}</p>
                  <div className="text-[10px] text-primary/80 bg-primary/5 rounded px-2 py-1 border border-primary/10 mt-2">
                    <span className="font-semibold">Recommendation:</span> {c.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {passedConditions.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1">
              <span>▶</span>
              <span>Show All Conditions ({framework.conditions.length} total)</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {passedConditions.map((c) => (
                <div key={c.condition} className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-stable flex-shrink-0" />
                  <span className="text-[12px] font-medium text-foreground">{c.condition}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-stable/15 text-stable border-stable/30 ml-auto">Strong</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* ═══ SECTION 3: REQUIRED CONTROLS & TERMS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Required Controls</div>
          <div className="space-y-2">
            {(band === 'Fragile' ? [
              { text: 'Decision audit trail with 90-day retention', status: 'Mandatory' },
              { text: 'Quarterly governance re-authorisation', status: 'Mandatory' },
              { text: 'Provider diversification (≥3 providers within 90 days)', status: 'Mandatory' },
              { text: 'Override protocols for high-value decisions', status: 'Mandatory' },
            ] : band === 'Sensitive' ? [
              { text: 'Decision audit trail with 90-day retention', status: 'Required' },
              { text: 'Governance improvement plan within 90 days', status: 'Required' },
              { text: 'Quarterly structural reassessment', status: 'Required' },
            ] : [
              { text: 'Annual governance reassessment at renewal', status: 'Maintain' },
              { text: 'Report material structural changes', status: 'Monitor' },
            ]).map((ctrl, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`} />
                <div>
                  <div className="text-[11px] font-medium text-foreground">{ctrl.text}</div>
                  <div className="text-[9px] text-muted-foreground">{ctrl.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Key Exclusions</div>
          <div className="space-y-2">
            {[
              'Pre-existing AI system failures',
              'Intentional misuse or non-compliance with required controls',
              'Autonomous execution liability beyond governance scope',
              'Losses from undisclosed AI deployments (shadow AI)',
            ].map((excl, i) => (
              <div key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-foreground">{excl}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">Coverage</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground">Premium Range:</span>
                <div className="font-bold font-mono text-foreground">{premium.band}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Loss Envelope:</span>
                <div className="font-bold font-mono text-foreground">{lossEnvelope.expected}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveStep(4)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">Generate Report →</button>
        <button onClick={() => setActiveStep(2)} className="px-4 py-2 bg-secondary text-foreground border border-border rounded-lg text-[12px] font-semibold hover:bg-muted transition-colors">← Risk Analysis</button>
      </div>

      {/* ═══ SECTION 4: ADVANCED DETAILS (Collapsed) ═══ */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg mb-2 hover:bg-muted transition-colors cursor-pointer">
          <span className="text-[11px] font-semibold text-foreground">Advanced Underwriting Details</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 mb-4">

            {/* Loss Envelope */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Financial Exposure — Loss Envelope</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Expected', value: lossEnvelope.expected, color: 'text-foreground' },
                  { label: 'Stress', value: lossEnvelope.stress, color: 'text-sensitive' },
                  { label: 'Tail Risk', value: lossEnvelope.tail, color: 'text-fragile' },
                  { label: 'Portfolio', value: lossEnvelope.portfolio, color: 'text-fragile' },
                ].map((cell, i) => (
                  <div key={i} className="bg-secondary border border-border rounded-lg p-3">
                    <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{cell.label}</div>
                    <div className={`text-[16px] font-bold font-mono ${cell.color}`}>{cell.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFI Components */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">AFI Component Breakdown</div>
              {[
                { label: 'Delegation Ratio (DR)', value: components.dr, tooltip: TOOLTIPS.dr },
                { label: 'Justificatory Density (JD)', value: components.jd, tooltip: TOOLTIPS.jd, inverted: true },
                { label: 'Reversibility Cost (RC)', value: components.rc, tooltip: TOOLTIPS.rc },
                { label: 'Continuation Density (CD)', value: components.cd, tooltip: TOOLTIPS.cd },
              ].map((item, i) => {
                const pct = Math.round(item.value * 100);
                const barColor = item.inverted
                  ? (pct < 40 ? 'bg-fragile' : pct < 60 ? 'bg-sensitive' : 'bg-stable')
                  : (pct > 70 ? 'bg-fragile' : pct > 50 ? 'bg-sensitive' : 'bg-stable');
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-none">
                    <div className="w-[160px] sm:w-[200px]">
                      <span className="text-[11px] text-foreground font-medium">{item.label}</span>
                      <InfoTip text={item.tooltip} />
                    </div>
                    <div className="flex-1 h-[4px] bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-[28px] text-right text-[11px] font-bold font-mono">{pct}</span>
                  </div>
                );
              })}
            </div>

            {/* Underwriting Conditions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Detailed Underwriting Conditions</div>
              <div className="space-y-2">
                {[
                  { title: 'Implement quarterly AI re-authorisation', status: 'Mandatory', desc: 'Each AI system must undergo formal re-authorisation quarterly with sign-off from named human with stop authority.' },
                  { title: 'Multi-provider diversification (≥3 providers)', status: 'Mandatory', desc: 'Minimum 3 independent providers across model, compute, and orchestration layers. Timeline: 90 days.' },
                  { title: 'Automated oversight with kill-switch capability', status: 'Conditional', desc: 'Anomaly detection, threshold alerts, and immediate suspension capability required.' },
                  { title: 'Governance transparency — audit trail', status: 'Conditional', desc: 'All AI-influenced decisions must produce traceable audit records.' },
                  { title: 'Incident response protocol', status: 'Recommended', desc: 'Detection <1h, containment <4h, notification <24h.' },
                  { title: 'Annual independent governance audit', status: 'Recommended', desc: 'Independent review covering all AFI dimensions.' },
                ].map((cond, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-secondary border border-border rounded-lg">
                    <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-[2px] rounded border flex-shrink-0 mt-[2px] ${
                      cond.status === 'Mandatory' ? 'bg-fragile/15 text-fragile border-fragile/30' :
                      cond.status === 'Conditional' ? 'bg-sensitive/15 text-sensitive border-sensitive/30' :
                      'bg-primary/10 text-primary border-primary/30'
                    }`}>{cond.status}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-foreground">{cond.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{cond.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EU AI Act Summary */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">EU AI Act — Regulatory Exposure Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { article: 'Art. 99 §3', penalty: '€35M / 7%', desc: 'Prohibited practices', color: 'text-fragile' },
                  { article: 'Art. 99 §4', penalty: '€15M / 3%', desc: 'Provider & deployer obligations', color: 'text-sensitive' },
                  { article: 'Art. 99 §5', penalty: '€7.5M / 1%', desc: 'Misleading regulators', color: 'text-stable' },
                ].map((reg, i) => (
                  <div key={i} className="bg-secondary border border-border rounded-lg p-3">
                    <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{reg.article}</div>
                    <div className={`text-[18px] font-bold font-mono leading-none ${reg.color}`}>{reg.penalty}</div>
                    <div className="text-[9px] text-muted-foreground mt-1">{reg.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Audit Trail */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Decision Audit Trail</div>
              <div className="flex items-center gap-2 flex-wrap text-[9px] font-mono text-muted-foreground">
                <span>AFI: <strong className="text-foreground">{afi.toFixed(2)} ({band})</strong></span>
                <span>·</span>
                <span>AGRI: <strong className="text-foreground">{agri}</strong></span>
                <span>·</span>
                <span>ALRI: <strong className="text-foreground">{alri}</strong></span>
                <span>·</span>
                <span>SCRI: <strong className="text-foreground">{scri}</strong></span>
                <span>·</span>
                <span>Composite: <strong className="text-foreground">{compositeRiskIndex}</strong></span>
                <span>·</span>
                <span>Generated: <strong className="text-foreground">{formatDate()}</strong></span>
              </div>
            </div>

          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Disclaimer */}
      <div className="p-3 bg-secondary border border-border rounded-lg mb-4 mt-2">
        <div className="text-[10px] text-muted-foreground leading-[1.5]">
          <strong className="text-foreground">Internal structuring tool.</strong> Not actuarially certified. All underwriting decisions require independent actuarial validation, legal review, and human sign-off. No automated binding authority.
        </div>
      </div>

      <StepNavigation currentStep={3} />
      <AppFooter />
    </div>
  );
}
