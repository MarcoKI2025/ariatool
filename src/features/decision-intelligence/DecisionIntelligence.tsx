import React, { useState } from 'react';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { useApp } from '@/hooks/useAppState';
import { AppFooter } from '@/components/shared/AppFooter';
import { BandBadge, SectionCard, LockedState, InfoTip } from '@/components/shared/UIComponents';
import { TOOLTIPS } from '@/lib/tooltips';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function DecisionIntelligence() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!analysisComplete || !results) {
    return <LockedState title="Decision Intelligence Locked" description="Complete the Exposure Analysis to unlock risk scoring and governance assessment." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, agri, alri, scri, compositeRiskIndex, lossEnvelope, mdr, mdrTier, mdrLabel, rfsi, rfsiTier, rfsiLabel, rfsiDrivers, frameDriftAlerts } = results;

  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive' : 'bg-stable-bg border-stable';

  const topRisks = [
    { label: 'Governance Risk (AGRI)', value: agri, desc: agri >= 60 ? 'Critical — autonomous governance required' : agri >= 35 ? 'Elevated — governance gaps emerging' : 'Manageable with current controls', icon: '⚡' },
    { label: 'Liability Risk (ALRI)', value: alri, desc: alri >= 60 ? 'Multiple active claim vectors' : alri >= 35 ? 'Emerging claim exposure' : 'Controlled liability profile', icon: '⚠' },
    { label: 'Systemic Risk (SCRI)', value: scri, desc: scri >= 60 ? 'High vendor concentration' : scri >= 35 ? 'Moderate concentration' : 'Diversified provider base', icon: '🔗' },
  ];

  const riskColor = (v: number) => v >= 60 ? 'text-fragile' : v >= 35 ? 'text-sensitive' : 'text-stable';
  const riskBg = (v: number) => v >= 60 ? 'bg-fragile' : v >= 35 ? 'bg-sensitive' : 'bg-stable';

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 2 of 8 · Core Analysis</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Decision Intelligence</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Structural risk assessment for {inputs.companyName || 'the assessed entity'} — AFI scoring, risk classification, and governance signals.
        </p>
      </div>

      {/* ═══ SECTION 1: RISK OVERVIEW ═══ */}
      <div className={`rounded-lg p-5 sm:p-6 mb-4 border-2 ${bandBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
              Risk Classification
            </div>
            <div className="flex items-end gap-4 mb-3">
              <div className={`text-[48px] sm:text-[64px] font-bold font-mono leading-none tracking-tight ${bandColor}`}>
                {structuralScore}
              </div>
              <div className="pb-2">
                <BandBadge band={band} size="md" />
                <div className="text-[10px] text-muted-foreground mt-1">AFI {afi.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-[13px] font-medium text-foreground leading-[1.45] max-w-[500px]">
              {band === 'Fragile'
                ? 'High structural risk — enhanced underwriting review and remediation required before standard terms apply.'
                : band === 'Sensitive'
                ? 'Elevated risk profile — conditional coverage with governance improvement timeline recommended.'
                : 'Standard risk profile — normal underwriting terms apply with routine monitoring.'}
            </div>
          </div>

          {/* Gauge */}
          <div className="flex-shrink-0">
            <div className="relative w-[120px] h-[65px]">
              <svg viewBox="0 0 140 70" className="w-full h-full">
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none"
                  stroke={band === 'Fragile' ? 'hsl(var(--fragile))' : band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${Math.min(188, structuralScore * 1.88)} 188`} />
              </svg>
            </div>
          </div>
        </div>

        {/* Underwriting Action */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/50">
          <span className="text-[9px] text-muted-foreground font-bold tracking-[0.08em] uppercase">Underwriting Action:</span>
          <span className={`px-3 py-1 rounded text-[10px] font-bold text-white ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`}>
            {band === 'Fragile' ? 'REFER — Premium Loading Required' : band === 'Sensitive' ? 'REFER — Conditional Coverage' : 'ACCEPT — Standard Terms'}
          </span>
        </div>
      </div>

      {/* Quick action bar */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveStep(3)} className="px-3 py-[6px] bg-secondary text-foreground border border-border rounded-lg text-[11px] font-semibold hover:bg-muted transition-colors">Insurance Decision →</button>
        <button onClick={() => setActiveStep(4)} className="px-3 py-[6px] bg-primary text-primary-foreground rounded-lg text-[11px] font-semibold hover:bg-primary/90 transition-colors">Generate Report</button>
      </div>

      {/* ═══ SECTION 2: KEY RISK INDICATORS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {topRisks.map((r, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{r.icon} {r.label}</div>
            </div>
            <div className={`text-[32px] font-bold font-mono leading-none mb-1 ${riskColor(r.value)}`}>{r.value}</div>
            <div className="h-[4px] bg-border rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full ${riskBg(r.value)}`} style={{ width: `${r.value}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground leading-[1.4]">{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Composite Risk */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Composite Risk Index</div>
            <div className={`text-[36px] font-bold font-mono leading-none ${riskColor(compositeRiskIndex)}`}>{compositeRiskIndex}</div>
          </div>
          <div className="flex-1">
            <div className="h-[6px] bg-border rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-stable via-sensitive to-fragile" style={{ width: `${compositeRiskIndex}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>AFI 50%</span>
              <span>ALRI 30%</span>
              <span>AGRI 20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 3: RECOMMENDATIONS ═══ */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-4">
        <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Required Actions</div>
        <div className="flex flex-col gap-2">
          {(band === 'Fragile' ? [
            { badge: 'Critical', cls: 'bg-fragile-bg text-fragile border-fragile-border', t: 'Apply mandatory premium loading', s: 'Reserves are structurally understated without loading.' },
            { badge: 'Critical', cls: 'bg-fragile-bg text-fragile border-fragile-border', t: 'Require dependency diversification within 90 days', s: 'Current provider concentration creates single points of failure.' },
            { badge: 'Required', cls: 'bg-sensitive-bg text-sensitive border-sensitive-border', t: 'Institute quarterly governance re-authorisation', s: 'Without cadence, structural risk accumulates without bound.' },
          ] : band === 'Sensitive' ? [
            { badge: 'Required', cls: 'bg-sensitive-bg text-sensitive border-sensitive-border', t: 'Increase governance review cadence to quarterly', s: 'Current oversight is insufficient given dependency trajectory.' },
            { badge: 'Required', cls: 'bg-sensitive-bg text-sensitive border-sensitive-border', t: 'Document and test dependency exit paths', s: 'Reversibility cost is elevated — exit capability must be verified.' },
            { badge: 'Recommended', cls: 'bg-purple-bg text-primary border-purple-border', t: 'Apply precautionary premium loading', s: 'Below Fragile threshold, but trajectory warrants adjustment.' },
          ] : [
            { badge: 'Maintain', cls: 'bg-purple-bg text-primary border-purple-border', t: 'Continue governance cadence — re-assess annually', s: 'Current profile within tolerance.' },
            { badge: 'Monitor', cls: 'bg-purple-bg text-primary border-purple-border', t: 'Monitor delegation density and dependency concentration', s: 'Key drift vectors that tend to increase silently.' },
          ]).map((ac, i) => (
            <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border ${ac.cls.includes('fragile') ? 'border-fragile-border bg-fragile-bg' : ac.cls.includes('sensitive') ? 'border-sensitive-border bg-sensitive-bg' : 'border-purple-border bg-purple-bg'}`}>
              <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-[2px] rounded flex-shrink-0 mt-[1px] border ${ac.cls}`}>{ac.badge}</span>
              <div>
                <div className="text-[11px] font-semibold text-foreground leading-[1.4]">{ac.t}</div>
                <div className="text-[10px] text-muted-foreground mt-[2px] leading-[1.4]">{ac.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 4: ADVANCED ANALYSIS (Collapsed) ═══ */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg mb-2 hover:bg-muted transition-colors cursor-pointer">
          <span className="text-[11px] font-semibold text-foreground">Advanced Risk Analysis</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 mb-4">

            {/* AFI Components */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">AFI Component Breakdown</div>
              {[
                { label: 'Delegation Ratio (DR)', value: components.dr, desc: 'Autonomous decision share', tooltip: TOOLTIPS.dr },
                { label: 'Justificatory Density (JD)', value: components.jd, desc: 'Governance transparency', tooltip: TOOLTIPS.jd, inverted: true },
                { label: 'Reversibility Cost (RC)', value: components.rc, desc: 'Structural lock-in', tooltip: TOOLTIPS.rc },
                { label: 'Continuation Density (CD)', value: components.cd, desc: 'Cross-system propagation', tooltip: TOOLTIPS.cd },
              ].map((item, i) => {
                const pct = Math.round(item.value * 100);
                const barColor = item.inverted
                  ? (pct < 40 ? 'bg-fragile' : pct < 60 ? 'bg-sensitive' : 'bg-stable')
                  : (pct > 70 ? 'bg-fragile' : pct > 50 ? 'bg-sensitive' : 'bg-stable');
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-none">
                    <div className="w-[160px] sm:w-[200px]">
                      <span className="text-[11px] text-foreground font-medium">{item.label}</span>
                      {item.tooltip && <InfoTip text={item.tooltip} />}
                    </div>
                    <div className="flex-1 h-[4px] bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-[28px] text-right text-[11px] font-bold font-mono">{pct}</span>
                  </div>
                );
              })}
            </div>

            {/* AGRI / ALRI Sub-Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">AGRI Sub-Scores</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Multi-Agent', value: inputs.multiAgent, max: 5 },
                    { label: 'Tool-Call Auth', value: inputs.toolCallAuthority, max: 5 },
                    { label: 'Persistent Memory', value: inputs.persistentMemory, max: 5 },
                    { label: 'Human Checkpoints', value: inputs.humanCheckpoints, max: 5, inverted: true },
                  ].map((s, i) => (
                    <div key={i} className="bg-secondary border border-border rounded-md p-2">
                      <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.label}</div>
                      <div className={`text-[16px] font-bold font-mono ${
                        s.inverted ? (s.value <= 2 ? 'text-fragile' : s.value <= 3 ? 'text-sensitive' : 'text-stable') :
                        (s.value >= 4 ? 'text-fragile' : s.value >= 3 ? 'text-sensitive' : 'text-stable')
                      }`}>{s.value}/{s.max}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">ALRI Sub-Scores</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Hallucination', value: inputs.hallucinationLiability },
                    { label: 'Deepfake', value: inputs.deepfakeFraud },
                    { label: 'Prompt Inject', value: inputs.promptInjection },
                    { label: 'Model Drift', value: inputs.modelDrift },
                    { label: 'Algo Bias', value: inputs.algorithmicBias },
                    { label: 'Shadow AI', value: inputs.shadowAI },
                    { label: 'Explainability', value: inputs.explainabilityGap },
                    { label: 'Data Integrity', value: inputs.dataIntegrity },
                    { label: 'ESG Liability', value: inputs.esgLiability },
                  ].map((s, i) => (
                    <div key={i} className="bg-secondary border border-border rounded-md p-2">
                      <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{s.label}</div>
                      <div className={`text-[14px] font-bold font-mono ${s.value >= 4 ? 'text-fragile' : s.value >= 3 ? 'text-sensitive' : 'text-stable'}`}>{s.value}/5</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Exposure */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Financial Exposure — Loss Envelope</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Expected', value: lossEnvelope.expected, color: 'text-foreground' },
                  { label: 'Base Risk', value: lossEnvelope.stress, color: 'text-sensitive' },
                  { label: 'Critical Risk', value: lossEnvelope.tail, color: 'text-fragile' },
                ].map((cell, i) => (
                  <div key={i} className="bg-secondary border border-border rounded-lg p-3">
                    <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{cell.label}</div>
                    <div className={`text-[16px] font-bold font-mono ${cell.color}`}>{cell.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MDR */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Meaning Drift Risk (MDR)</div>
                <div className={`text-[24px] font-bold font-mono leading-none ${mdrTier === 'critical' ? 'text-fragile' : mdrTier === 'high' ? 'text-sensitive' : 'text-stable'}`}>{mdr}</div>
              </div>
              <div className="h-[4px] bg-border rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full ${mdrTier === 'critical' ? 'bg-fragile' : mdrTier === 'high' ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${mdr}%` }} />
              </div>
              <div className={`text-[10px] font-semibold ${mdrTier === 'critical' ? 'text-fragile' : mdrTier === 'high' ? 'text-sensitive' : 'text-stable'}`}>{mdrLabel}</div>
            </div>

            {/* RFSI */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Assessment Validity Index (RFSI)</div>
                  <div className="text-[11px] text-muted-foreground mt-1">How valid is this assessment across the deployment lifecycle?</div>
                </div>
                <div className={`text-[24px] font-bold font-mono leading-none ${rfsiTier === 'stable' ? 'text-stable' : rfsiTier === 'conditional' ? 'text-sensitive' : 'text-fragile'}`}>{rfsi}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Context Shift', value: rfsiDrivers.contextVariability },
                  { label: 'Drift Risk', value: rfsiDrivers.semanticDriftRisk },
                  { label: 'Audit Gap', value: rfsiDrivers.evaluationMismatch },
                  { label: 'Age Risk', value: rfsiDrivers.temporalInstability },
                ].map((d, i) => (
                  <div key={i} className="bg-secondary border border-border rounded-md p-2">
                    <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{d.label}</div>
                    <div className={`text-[14px] font-bold font-mono ${d.value > 0.65 ? 'text-fragile' : d.value > 0.4 ? 'text-sensitive' : 'text-stable'}`}>{Math.round(d.value * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame Drift Alerts */}
            {frameDriftAlerts.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Governance Alignment Alerts ({frameDriftAlerts.length})</div>
                <div className="space-y-2">
                  {frameDriftAlerts.map((alert, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${alert.sev === 'critical' ? 'border-fragile-border bg-fragile-bg' : alert.sev === 'high' ? 'border-sensitive-border bg-sensitive-bg' : 'border-border bg-secondary'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-[1px] rounded ${alert.sev === 'critical' ? 'bg-fragile text-white' : alert.sev === 'high' ? 'bg-sensitive text-white' : 'bg-muted text-muted-foreground'}`}>{alert.sev}</span>
                        <span className="text-[11px] font-bold text-foreground">{alert.title}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-[1.5]">{alert.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Disclaimer */}
      <div className="p-3 bg-secondary border border-border rounded-lg mb-4 mt-2">
        <div className="text-[10px] text-muted-foreground leading-[1.5]">
          <strong className="text-foreground">Internal structuring tool.</strong> Not actuarially certified. Not a regulatory submission. Requires independent actuarial validation and legal review before use in underwriting decisions.
        </div>
      </div>

      <StepNavigation currentStep={2} />
      <AppFooter />
    </div>
  );
}
