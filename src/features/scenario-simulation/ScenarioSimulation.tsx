import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { LockedState } from '@/components/shared/UIComponents';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { AppFooter } from '@/components/shared/AppFooter';
import { AgenticSwarmVisualization } from '@/features/agentic/AgenticSwarmVisualization';
import { AgentCoordinationView } from '@/features/agent-coordination/AgentCoordinationView';
import { ParametricTriggerLab } from '@/features/parametric/ParametricTriggerLab';
import { formatCurrency } from '@/lib/formatters';
import { computeFullAnalysis } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';
import { SectionDivider } from '@/components/shared/SectionDivider';

interface ScenarioData {
  id: string;
  icon: string;
  name: string;
  executiveRisk: number;
  executiveLabel: string;
  continuation: number;
  continuationLabel: string;
  dependency: number;
  dependencyLabel: string;
  agentic: number;
  agenticLabel: string;
  aggregation: number;
  aggregationLabel: string;
  recovery: string;
  downtimeProfile: string;
  narrative: string;
  underwritingImplication: string;
  operationalImplication: string;
  stressMultipliers: { metric: string; best: number; expected: number; stress: number }[];
  cascadeLayers: { icon: string; name: string; value: string; layer: string }[];
  whatChanges: { governance: string; financial: string; operational: string };
  lossShift: { expected: string; stress: string; tail: string };
}

export function ScenarioSimulation() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [activeScenario, setActiveScenario] = useState(0);

  if (!analysisComplete || !results) {
    return <LockedState title="Scenario Simulation Locked" description="Complete the Exposure Analysis to run scenario stress tests against your AI deployment profile." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components, lossEnvelope } = results;

  const scenarios: ScenarioData[] = [
    {
      id: 'collapse',
      icon: '🏚',
      name: 'Primary System Collapse',
      executiveRisk: Math.min(99, structuralScore),
      executiveLabel: structuralScore >= 70 ? 'High' : structuralScore >= 40 ? 'Moderate' : 'Low',
      continuation: Math.min(99, Math.round(components.cd * 100 + 10)),
      continuationLabel: components.cd > 0.6 ? 'High' : 'Moderate',
      dependency: Math.min(99, Math.round(components.rc * 100 + 5)),
      dependencyLabel: components.rc > 0.6 ? 'High' : 'Moderate',
      agentic: Math.min(99, results.agri),
      agenticLabel: results.agri >= 60 ? 'High' : results.agri >= 35 ? 'Moderate' : 'Low',
      aggregation: Math.min(99, Math.round(afi * 55)),
      aggregationLabel: afi >= 1.35 ? 'High' : afi >= 0.85 ? 'Moderate' : 'Low',
      recovery: '1–4 weeks',
      downtimeProfile: 'Partial degradation with manual workaround capacity',
      narrative: 'System collapse creates significant operational disruption. Manual fallback absorbs partial load, but efficiency losses compound daily. Re-authorisation backlog creates secondary governance failure.',
      underwritingImplication: 'Loss falls within standard business interruption parameters. Standard BI clause applies with current loading.',
      operationalImplication: 'Failure is containable within the system perimeter with adequate incident response and manual override capacity.',
      stressMultipliers: [
        { metric: 'Executive Risk', best: Math.round(structuralScore * 0.6), expected: structuralScore, stress: Math.min(99, Math.round(structuralScore * 1.3)) },
        { metric: 'Continuation', best: Math.round(components.cd * 60), expected: Math.round(components.cd * 100 + 10), stress: Math.min(99, Math.round(components.cd * 140)) },
        { metric: 'Dependency', best: Math.round(components.rc * 60), expected: Math.round(components.rc * 100 + 5), stress: Math.min(99, Math.round(components.rc * 130)) },
        { metric: 'Agentic', best: Math.round(results.agri * 0.5), expected: results.agri, stress: Math.min(99, Math.round(results.agri * 1.4)) },
        { metric: 'Aggregation', best: Math.round(afi * 30), expected: Math.round(afi * 55), stress: Math.min(99, Math.round(afi * 80)) },
      ],
      cascadeLayers: [
        { icon: '⚡', name: 'System Failure', value: 'Origin', layer: 'Layer 0' },
        { icon: '🔧', name: 'Workflow Halt', value: 'Elevated', layer: 'Layer 1' },
        { icon: '⚖', name: 'Decision Backlog', value: 'Critical', layer: 'Layer 2' },
        { icon: '📉', name: 'Revenue Loss', value: 'Critical', layer: 'Layer 3' },
        { icon: '🌐', name: 'Reputation', value: 'Systemic', layer: 'Layer 4' },
      ],
      whatChanges: {
        governance: 'Manual fallback activated. Re-authorisation backlog accumulates. Oversight capacity degrades under volume.',
        financial: 'BI clause triggered. Daily efficiency losses compound. Recovery costs scale non-linearly with downtime duration.',
        operational: 'Partial operations continue via manual workaround. Staff redeployment required. SLA breaches likely after day 3.',
      },
      lossShift: {
        expected: 'Elevated Exposure',
        stress: 'Critical Exposure',
        tail: 'Systemic Exposure',
      },
    },
    {
      id: 'dependency',
      icon: '🔗',
      name: 'External Dependency Failure',
      executiveRisk: Math.min(99, Math.round(components.rc * 110)),
      executiveLabel: components.rc > 0.7 ? 'Critical' : components.rc > 0.5 ? 'High' : 'Moderate',
      continuation: Math.min(99, Math.round((components.cd + components.rc) * 55)),
      continuationLabel: 'High',
      dependency: 99,
      dependencyLabel: 'Critical',
      agentic: Math.min(99, Math.round(results.agri * 0.8)),
      agenticLabel: 'Moderate',
      aggregation: Math.min(99, Math.round(afi * 65)),
      aggregationLabel: afi >= 1.0 ? 'High' : 'Moderate',
      recovery: '3–8 days',
      downtimeProfile: 'Service interruption — no immediate failover pathway',
      narrative: 'External provider failure exposes single-point dependency. Full AI stack unavailability until failover or provider recovery. Business continuity plan effectiveness depends on pre-existing diversification.',
      underwritingImplication: 'Dependency failure triggers tech E&O and business interruption clauses simultaneously. Aggregate exposure depends on portfolio-level provider concentration.',
      operationalImplication: 'No immediate workaround available. Recovery timeline depends entirely on provider resolution. Manual processes may absorb partial load.',
      stressMultipliers: [
        { metric: 'Executive Risk', best: Math.round(components.rc * 60), expected: Math.round(components.rc * 110), stress: Math.min(99, Math.round(components.rc * 150)) },
        { metric: 'Continuation', best: Math.round((components.cd + components.rc) * 30), expected: Math.round((components.cd + components.rc) * 55), stress: Math.min(99, Math.round((components.cd + components.rc) * 80)) },
        { metric: 'Dependency', best: 75, expected: 99, stress: 99 },
        { metric: 'Agentic', best: Math.round(results.agri * 0.4), expected: Math.round(results.agri * 0.8), stress: Math.min(99, Math.round(results.agri * 1.2)) },
        { metric: 'Aggregation', best: Math.round(afi * 35), expected: Math.round(afi * 65), stress: Math.min(99, Math.round(afi * 90)) },
      ],
      cascadeLayers: [
        { icon: '🔗', name: 'Provider Down', value: 'Origin', layer: 'Layer 0' },
        { icon: '⚡', name: 'API Failure', value: 'Elevated', layer: 'Layer 1' },
        { icon: '🔧', name: 'Stack Unavailable', value: 'Critical', layer: 'Layer 2' },
        { icon: '📉', name: 'Business Halt', value: 'Critical', layer: 'Layer 3' },
        { icon: '🌐', name: 'Portfolio Impact', value: 'Systemic', layer: 'Layer 4' },
      ],
      whatChanges: {
        governance: 'No governance action possible — dependency is external. Waiting state with no mitigation lever.',
        financial: 'Tech E&O and BI triggered simultaneously. Multi-clause activation. Reserve adequacy questioned.',
        operational: 'Complete AI stack unavailable. No failover. Manual processes absorb partial load at degraded efficiency.',
      },
      lossShift: {
        expected: 'Elevated Exposure',
        stress: 'Critical Exposure',
        tail: 'Systemic Exposure',
      },
    },
    {
      id: 'shutdown',
      icon: '🏛',
      name: 'Forced Operational Shutdown',
      executiveRisk: Math.min(99, Math.round(afi * 75)),
      executiveLabel: afi >= 1.0 ? 'Critical' : 'High',
      continuation: 99,
      continuationLabel: 'Critical',
      dependency: Math.min(99, Math.round(components.rc * 85)),
      dependencyLabel: 'High',
      agentic: Math.min(99, Math.round(results.agri * 1.1)),
      agenticLabel: results.agri >= 50 ? 'High' : 'Moderate',
      aggregation: Math.min(99, Math.round(afi * 70)),
      aggregationLabel: 'High',
      recovery: '14–30 days',
      downtimeProfile: 'Full operational halt — enforcement action or governance failure',
      narrative: 'Regulatory enforcement or internal governance failure forces complete operational shutdown. No AI-dependent process can continue. Recovery requires full governance remediation and re-authorisation.',
      underwritingImplication: 'Regulatory halt creates maximum disruption with extended recovery. D&O and regulatory penalty clauses are triggered. Coverage gap likely.',
      operationalImplication: 'Complete operational halt with no workaround. All AI-dependent processes must revert to manual or cease entirely.',
      stressMultipliers: [
        { metric: 'Executive Risk', best: Math.round(afi * 45), expected: Math.round(afi * 75), stress: Math.min(99, Math.round(afi * 95)) },
        { metric: 'Continuation', best: 70, expected: 99, stress: 99 },
        { metric: 'Dependency', best: Math.round(components.rc * 50), expected: Math.round(components.rc * 85), stress: Math.min(99, Math.round(components.rc * 110)) },
        { metric: 'Agentic', best: Math.round(results.agri * 0.6), expected: Math.round(results.agri * 1.1), stress: Math.min(99, Math.round(results.agri * 1.5)) },
        { metric: 'Aggregation', best: Math.round(afi * 40), expected: Math.round(afi * 70), stress: Math.min(99, Math.round(afi * 95)) },
      ],
      cascadeLayers: [
        { icon: '🏛', name: 'Enforcement', value: 'Origin', layer: 'Layer 0' },
        { icon: '⛔', name: 'Full Halt', value: 'Elevated', layer: 'Layer 1' },
        { icon: '⚖', name: 'Legal Exposure', value: 'Critical', layer: 'Layer 2' },
        { icon: '📉', name: 'Revenue Collapse', value: 'Critical', layer: 'Layer 3' },
        { icon: '🌐', name: 'Market Signal', value: 'Systemic', layer: 'Layer 4' },
      ],
      whatChanges: {
        governance: 'Full governance remediation required. Re-authorisation cycle: 14–30 days minimum. Board-level intervention mandatory.',
        financial: 'D&O triggered. Regulatory penalties (Art. 99: up to €35M or 7% revenue). Coverage gap for regulatory shutdown.',
        operational: 'All AI-dependent processes cease. Manual reversion or complete halt. Staff capacity insufficient for full manual operation.',
      },
      lossShift: {
        expected: 'Elevated Exposure',
        stress: 'Critical Exposure',
        tail: 'Systemic Exposure',
      },
    },
    {
      id: 'cascade',
      icon: '🌐',
      name: 'Correlated Cascade Event',
      executiveRisk: Math.min(99, Math.round(afi * 80)),
      executiveLabel: 'Critical',
      continuation: Math.min(99, Math.round((components.cd + afi) * 45)),
      continuationLabel: 'Critical',
      dependency: Math.min(99, Math.round(components.rc * 95 + 5)),
      dependencyLabel: 'Critical',
      agentic: Math.min(99, Math.round(results.agri * 1.2)),
      agenticLabel: 'High',
      aggregation: 99,
      aggregationLabel: 'Critical',
      recovery: '21–60 days',
      downtimeProfile: 'Systemic failure across multiple entities and portfolio layers',
      narrative: 'Shared dependency structures create simultaneous multi-entity failure. Cascade propagates through correlated AI infrastructure. Portfolio-level loss amplification renders individual entity recovery irrelevant until systemic stabilisation.',
      underwritingImplication: 'Portfolio-level loss event. Treaty limits likely breached. Aggregate exposure exceeds individual entity reserves. Reinsurance cascade triggered.',
      operationalImplication: 'Cross-entity cascade means individual recovery plans are insufficient. Systemic stabilisation required before entity-level remediation.',
      stressMultipliers: [
        { metric: 'Executive Risk', best: Math.round(afi * 50), expected: Math.round(afi * 80), stress: 99 },
        { metric: 'Continuation', best: Math.round((components.cd + afi) * 25), expected: Math.round((components.cd + afi) * 45), stress: Math.min(99, Math.round((components.cd + afi) * 70)) },
        { metric: 'Dependency', best: Math.round(components.rc * 60), expected: Math.min(99, Math.round(components.rc * 95 + 5)), stress: 99 },
        { metric: 'Agentic', best: Math.round(results.agri * 0.7), expected: Math.round(results.agri * 1.2), stress: Math.min(99, Math.round(results.agri * 1.6)) },
        { metric: 'Aggregation', best: Math.round(afi * 55), expected: 99, stress: 99 },
      ],
      cascadeLayers: [
        { icon: '🌐', name: 'Shared Infra Fail', value: 'Origin', layer: 'Layer 0' },
        { icon: '⚡', name: 'Multi-Entity Hit', value: 'Elevated', layer: 'Layer 1' },
        { icon: '📉', name: 'Portfolio Loss', value: 'Critical', layer: 'Layer 2' },
        { icon: '🔗', name: 'Treaty Breach', value: 'Critical', layer: 'Layer 3' },
        { icon: '💥', name: 'Systemic Event', value: 'Systemic', layer: 'Layer 4' },
      ],
      whatChanges: {
        governance: 'Individual entity governance irrelevant — systemic stabilisation required first. Cross-entity coordination mandatory.',
        financial: 'Treaty limits breached. Aggregate exposure exceeds reserves. Reinsurance cascade. Portfolio-level repricing required.',
        operational: 'Individual recovery plans insufficient. Systemic stabilisation precedes entity remediation. Industry-wide coordination needed.',
      },
      lossShift: {
        expected: 'Elevated Exposure',
        stress: 'Critical Exposure',
        tail: 'Systemic Exposure',
      },
    },
  ];

  const s = scenarios[activeScenario];

  const tierColor = (v: number) => v >= 70 ? 'text-fragile' : v >= 40 ? 'text-sensitive' : 'text-stable';
  const tierBg = (v: number) => v >= 70 ? 'bg-fragile' : v >= 40 ? 'bg-sensitive' : 'bg-stable';

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 3 · Stress Testing</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Scenario Simulation</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[620px] leading-relaxed">
          Models exposure impact under adverse conditions. Each scenario stresses different structural failure vectors — calibrated against your deployment profile.
        </p>
      </div>

      <UseRestrictionBanner />

      {/* How to interpret */}
      <div className="bg-secondary border border-border rounded-lg p-4 mb-5 text-[11px] text-muted-foreground leading-[1.55]">
        <strong className="text-foreground">How to interpret scenarios:</strong> Each scenario applies stress multipliers to your AFI parameters. The resulting metrics show how exposure escalates across failure types. Best Case = controlled degradation. Expected = typical failure profile. Stress = correlated cascade conditions.
      </div>

      {/* Scenario tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => setActiveScenario(i)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-[10px] rounded-lg border text-[11px] sm:text-[12px] font-medium transition-all flex-shrink-0 ${
              activeScenario === i
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            <span>{sc.icon}</span>
            <span className="hidden sm:inline">{sc.name}</span>
            <span className="sm:hidden">{sc.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <SectionDivider title="Impact Assessment" icon="📊" subtitle="Key exposure metrics under selected scenario" />

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
        {[
          { label: 'Executive Risk', value: s.executiveRisk, sub: s.executiveLabel },
          { label: 'Continuation', value: s.continuation, sub: s.continuationLabel },
          { label: 'Dependency', value: s.dependency, sub: s.dependencyLabel },
          { label: 'Agentic', value: s.agentic, sub: s.agenticLabel },
          { label: 'Aggregation', value: s.aggregation, sub: s.aggregationLabel },
        ].map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{m.label}</div>
            <div className={`text-[28px] sm:text-[36px] font-bold font-mono leading-none ${tierColor(m.value)}`}>{m.value}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Recovery + Downtime */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="text-2xl">⏱</div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Time to Recovery</div>
            <div className={`text-[24px] font-bold font-mono leading-none ${
              s.recovery.includes('60') || s.recovery.includes('30') ? 'text-fragile' : s.recovery.includes('weeks') ? 'text-sensitive' : 'text-stable'
            }`}>{s.recovery}</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="text-2xl">🌊</div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Operational Downtime Profile</div>
            <div className="text-[13px] font-medium text-foreground">{s.downtimeProfile}</div>
          </div>
        </div>
      </div>

      <SectionDivider title="Stress Analysis" icon="⟲" subtitle="Stress multiplier table and cascade propagation" />

      {/* ═══ Stress Multiplier Table ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Stress Multiplier Table</div>
          <div className="text-[11px] text-secondary-foreground mt-[2px]">How each metric shifts under Best Case, Expected, and Stress conditions</div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-2 px-5 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Metric</th>
              <th className="text-center py-2 px-3 text-[9px] font-bold tracking-wider uppercase text-stable">Best Case</th>
              <th className="text-center py-2 px-3 text-[9px] font-bold tracking-wider uppercase text-sensitive">Expected</th>
              <th className="text-center py-2 px-3 text-[9px] font-bold tracking-wider uppercase text-fragile">Stress</th>
            </tr>
          </thead>
          <tbody>
            {s.stressMultipliers.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-none">
                <td className="py-2 px-5 font-medium text-foreground">{row.metric}</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-stable">{row.best}</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-sensitive">{row.expected}</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-fragile">{Math.min(99, row.stress)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ Cascade Propagation Circles ═══ */}
      <div className="bg-card border-2 border-border rounded-xl p-6 mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, hsl(var(--sensitive)), hsl(var(--fragile)), #7b0e0e)' }} />
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-fragile">Cascade Propagation — {s.name}</div>
            <div className="text-[16px] font-bold text-foreground mt-[3px] mb-[3px]">How failure travels across systems — and amplifies at each layer</div>
            <div className="text-[12px] text-secondary-foreground">Each operational layer amplifies the preceding disruption.</div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-0 mb-4 overflow-x-auto">
          {s.cascadeLayers.map((node, i) => (
            <div key={i} className="text-center px-2 py-3 relative">
              {i < 4 && <span className="absolute right-[-11px] top-[38%] text-muted-foreground text-sm z-[1]">→</span>}
              <div className={`w-[44px] h-[44px] rounded-full border-2 flex items-center justify-center mx-auto mb-2 text-[16px] ${
                i >= 3 ? 'bg-fragile-bg border-fragile-border' : i >= 1 ? 'bg-sensitive-bg border-sensitive-border' : 'bg-fragile-bg border-fragile-border'
              }`}>{node.icon}</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground leading-[1.3] mb-1">{node.name}</div>
              <div className={`text-[14px] font-bold font-mono ${i >= 3 ? 'text-fragile' : i >= 1 ? 'text-sensitive' : 'text-fragile'}`}>{node.value}</div>
              <div className="text-[9px] text-muted-foreground">{node.layer}</div>
            </div>
          ))}
        </div>

        <div className="bg-secondary border border-border rounded-lg p-[14px] flex items-start gap-[10px]">
          <span className="text-fragile text-sm flex-shrink-0 mt-[1px]">⚠</span>
          <div>
            <div className="text-[12px] font-semibold text-foreground leading-[1.4]">This level of propagation is not captured in traditional risk models.</div>
            <div className="text-[11px] text-secondary-foreground mt-[3px]">Each layer amplifies the preceding disruption, creating non-linear risk escalation that exceeds standard BI assumptions.</div>
          </div>
        </div>
      </div>

      {/* ═══ What Changes Under This Scenario ═══ */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">What Changes Under This Scenario</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-primary mb-2">Governance Impact</div>
            <div className="text-[11px] text-secondary-foreground leading-[1.55]">{s.whatChanges.governance}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-sensitive mb-2">Financial Impact</div>
            <div className="text-[11px] text-secondary-foreground leading-[1.55]">{s.whatChanges.financial}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-fragile mb-2">Operational Impact</div>
            <div className="text-[11px] text-secondary-foreground leading-[1.55]">{s.whatChanges.operational}</div>
          </div>
        </div>
      </div>

      {/* ═══ Loss Envelope Shift ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Loss Envelope Shift Under Scenario</div>
          <div className="text-[11px] text-secondary-foreground mt-[2px]">How the loss bands change compared to baseline exposure</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {[
            { label: 'Expected Loss', baseline: lossEnvelope.expected, shifted: s.lossShift.expected, color: 'text-stable' },
            { label: 'Stress Loss', baseline: lossEnvelope.stress, shifted: s.lossShift.stress, color: 'text-sensitive' },
            { label: 'Tail Loss', baseline: lossEnvelope.tail, shifted: s.lossShift.tail, color: 'text-fragile' },
          ].map((cell, i) => {
            return (
              <div key={i} className={`p-4 ${i < 2 ? 'sm:border-r border-b sm:border-b-0 border-border' : ''}`}>
                <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{cell.label}</div>
                <div className="flex items-end gap-2 mb-1">
                  <span className={`text-[18px] sm:text-[20px] font-bold font-mono leading-none ${cell.color}`}>{cell.shifted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground line-through">{cell.baseline}</span>
                  <span className="text-[10px] font-bold text-fragile">↑ Elevated</span>
                </div>
                <div className="mt-2 h-[5px] bg-secondary rounded overflow-hidden">
                  <div className={`h-full rounded ${i === 2 ? 'bg-fragile' : i === 1 ? 'bg-sensitive' : 'bg-stable'}`} style={{ width: `${Math.min(100, (i + 1) * 30)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact narrative */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[12px] text-foreground leading-[1.65]">
          <strong className="text-foreground">Impact Narrative — </strong>{s.narrative}
        </div>
      </div>

      {/* Implications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-card border-l-4 border-l-fragile border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-2">Underwriting Implication</div>
          <div className="text-[12px] text-muted-foreground leading-[1.55]">{s.underwritingImplication}</div>
        </div>
        <div className="bg-card border-l-4 border-l-sensitive border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-sensitive mb-2">Operational Risk Implication</div>
          <div className="text-[12px] text-muted-foreground leading-[1.55]">{s.operationalImplication}</div>
        </div>
      </div>

      <SectionDivider title="Scenario Comparison" icon="📋" subtitle="All scenarios side-by-side" />

      {/* ═══ Scenario Comparison Matrix ═══ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Scenario Comparison Matrix</div>
          <div className="text-[11px] text-secondary-foreground mt-[2px]">All four scenarios side-by-side — expected values</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-2 px-4 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Metric</th>
                {scenarios.map(sc => (
                  <th key={sc.id} className={`text-center py-2 px-3 text-[9px] font-bold tracking-wider uppercase ${sc.id === s.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    {sc.icon} {sc.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Executive Risk', 'Continuation', 'Dependency', 'Agentic', 'Aggregation'].map((metric, mi) => (
                <tr key={metric} className="border-b border-border last:border-none">
                  <td className="py-2 px-4 font-medium text-foreground">{metric}</td>
                  {scenarios.map(sc => {
                    const vals = [sc.executiveRisk, sc.continuation, sc.dependency, sc.agentic, sc.aggregation];
                    const v = vals[mi];
                    return (
                      <td key={sc.id} className={`py-2 px-3 text-center font-mono font-bold ${tierColor(v)} ${sc.id === s.id ? 'bg-primary/5' : ''}`}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t-2 border-border">
                <td className="py-2 px-4 font-medium text-foreground">Recovery</td>
                {scenarios.map(sc => (
                  <td key={sc.id} className={`py-2 px-3 text-center text-[10px] font-semibold text-foreground ${sc.id === s.id ? 'bg-primary/5' : ''}`}>
                    {sc.recovery}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ ROBUSTNESS TESTING ═══ */}
      <RobustnessTestingPanel inputs={inputs} baseAfi={afi} />

      {/* Agentic Swarm Visualization */}
      <AgenticSwarmVisualization agri={results.agri} />

      {/* Agent Coordination Analysis */}
      <AgentCoordinationView />

      {/* Parametric Trigger Lab */}
      <ParametricTriggerLab />

      {/* View nav footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(2)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Decision Intelligence</button>
        <span className="text-[10px] text-muted-foreground italic hidden sm:inline">Step 3 of 6 · Scenario stress testing</span>
        <button onClick={() => setActiveStep(4)} className="view-nav-next">Insurance Decision →</button>
      </div>

      <AppFooter />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROBUSTNESS TESTING PANEL
// ═══════════════════════════════════════════════════════════════

interface RobustnessVariation {
  parameter: string;
  current: number;
  downAFI: string;
  upAFI: string;
  maxDelta: string;
  impact: 'High' | 'Medium' | 'Low';
  crossesThreshold: boolean;
}

function RobustnessTestingPanel({ inputs, baseAfi }: { inputs: ExposureInputs; baseAfi: number }) {
  const [showResults, setShowResults] = useState(false);

  const parameters: { key: keyof ExposureInputs; label: string }[] = [
    { key: 'automation', label: 'Automation Level' },
    { key: 'executionAuthority', label: 'Execution Authority' },
    { key: 'oversightLevel', label: 'Oversight Quality' },
    { key: 'switchingCost', label: 'Switching Cost' },
    { key: 'integrationDepth', label: 'Integration Depth' },
    { key: 'cloudConcentration', label: 'Cloud Concentration' },
    { key: 'modelConcentration', label: 'Model Concentration' },
  ];

  const results = useMemo(() => {
    const variations: RobustnessVariation[] = parameters.map(param => {
      const currentVal = inputs[param.key] as number;

      const upInputs = { ...inputs, [param.key]: Math.min(5, currentVal * 1.1) };
      const downInputs = { ...inputs, [param.key]: Math.max(1, currentVal * 0.9) };

      const upAFI = computeFullAnalysis(upInputs).afi;
      const downAFI = computeFullAnalysis(downInputs).afi;

      const upDelta = Math.abs(upAFI - baseAfi);
      const downDelta = Math.abs(downAFI - baseAfi);
      const maxDelta = Math.max(upDelta, downDelta);

      const crossesThreshold =
        (baseAfi < 0.85 && (upAFI >= 0.85 || downAFI >= 0.85)) ||
        (baseAfi >= 0.85 && baseAfi < 1.35 && (upAFI >= 1.35 || downAFI < 0.85)) ||
        (baseAfi >= 1.35 && downAFI < 1.35);

      return {
        parameter: param.label,
        current: currentVal,
        downAFI: downAFI.toFixed(3),
        upAFI: upAFI.toFixed(3),
        maxDelta: maxDelta.toFixed(3),
        impact: maxDelta > 0.15 ? 'High' as const : maxDelta > 0.08 ? 'Medium' as const : 'Low' as const,
        crossesThreshold,
      };
    });

    variations.sort((a, b) => parseFloat(b.maxDelta) - parseFloat(a.maxDelta));

    const stability = variations.filter(v => v.impact === 'Low').length >= 5 ? 'Stable' :
      variations.filter(v => v.impact === 'High').length >= 3 ? 'Volatile' : 'Moderate';

    return { variations, stability };
  }, [inputs, baseAfi]);

  const stabilityColor = results.stability === 'Volatile' ? 'text-fragile' : results.stability === 'Moderate' ? 'text-sensitive' : 'text-stable';

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-4">
      <div className="mb-4">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">⟲ Parameter Robustness Testing · AFI Sensitivity Analysis</div>
        <div className="text-[11px] text-secondary-foreground leading-[1.55]">
          Test how stable the AFI score is by applying ±10% variation to each input parameter. Identifies which governance dimensions most strongly influence risk classification.
        </div>
      </div>

      {!showResults ? (
        <div className="text-center py-6">
          <button
            onClick={() => setShowResults(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(250,70%,56%)] to-[hsl(250,80%,62%)] text-white rounded-xl font-semibold text-[13px] shadow-lg hover:from-[hsl(250,70%,50%)] hover:to-[hsl(250,80%,56%)] transition-all"
          >
            🎲 Run Robustness Test
          </button>
          <div className="text-[10px] text-muted-foreground mt-2">Applies ±10% variation to each parameter · Shows maximum AFI delta</div>
        </div>
      ) : (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-secondary border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Baseline AFI Score</div>
              <div className="text-[28px] font-bold font-mono text-foreground">{baseAfi.toFixed(3)}</div>
            </div>
            <div className="bg-secondary border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Overall Stability</div>
              <div className={`text-[28px] font-bold font-mono ${stabilityColor}`}>{results.stability}</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-2 pr-3 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Parameter</th>
                  <th className="text-center py-2 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Current</th>
                  <th className="text-center py-2 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">AFI −10%</th>
                  <th className="text-center py-2 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">AFI +10%</th>
                  <th className="text-center py-2 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Max Δ</th>
                  <th className="text-center py-2 px-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Impact</th>
                  <th className="text-center py-2 pl-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {results.variations.map((v, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-2 pr-3 font-medium text-foreground">{v.parameter}</td>
                    <td className="py-2 px-2 text-center font-mono text-muted-foreground">{v.current.toFixed(1)}</td>
                    <td className="py-2 px-2 text-center font-mono text-muted-foreground">{v.downAFI}</td>
                    <td className="py-2 px-2 text-center font-mono text-muted-foreground">{v.upAFI}</td>
                    <td className={`py-2 px-2 text-center font-mono font-bold ${
                      v.impact === 'High' ? 'text-fragile' : v.impact === 'Medium' ? 'text-sensitive' : 'text-stable'
                    }`}>{v.maxDelta}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-[2px] rounded text-[8px] font-bold tracking-wider uppercase ${
                        v.impact === 'High' ? 'badge-fragile' : v.impact === 'Medium' ? 'badge-sensitive' : 'badge-stable'
                      }`}>{v.impact}</span>
                    </td>
                    <td className="py-2 pl-2 text-center">
                      {v.crossesThreshold ? (
                        <span className="text-fragile font-bold text-[10px]">⚠ Yes</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interpretation */}
          <div className="bg-secondary border border-border rounded-lg p-4 mb-4">
            <div className="text-[10px] font-bold text-foreground mb-2">How to Interpret Robustness Results</div>
            <div className="space-y-1.5 text-[10px] text-secondary-foreground leading-[1.55]">
              <div><strong className="text-fragile">High Impact (Δ &gt; 0.15):</strong> Small changes cause significant AFI movement. These are critical governance levers — monitor closely.</div>
              <div><strong className="text-sensitive">Threshold Crossings (⚠):</strong> Parameter variation pushes AFI across risk band boundary (0.85 or 1.35). System is close to reclassification.</div>
              <div><strong className="text-stable">Stable Overall:</strong> Most parameters show Low impact — AFI is robust to minor drift. <strong className="text-fragile">Volatile:</strong> 3+ High impact parameters — governance posture requires active management.</div>
            </div>
          </div>

          <button
            onClick={() => setShowResults(false)}
            className="px-4 py-2 border border-border rounded-lg font-semibold text-[11px] hover:bg-secondary transition-colors"
          >
            ← Back to Scenarios
          </button>
        </div>
      )}

    </div>
  );
}
