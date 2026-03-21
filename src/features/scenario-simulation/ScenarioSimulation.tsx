import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge } from '@/components/shared/UIComponents';

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
}

export function ScenarioSimulation() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const [activeScenario, setActiveScenario] = useState(0);

  if (!analysisComplete || !results) {
    return <LockedState title="Scenario Simulation Locked" description="Complete the Exposure Analysis to run scenario stress tests against your AI deployment profile." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const { band, afi, structuralScore, components } = results;

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
      narrative: `System collapse creates significant operational disruption. Manual fallback absorbs partial load, but efficiency losses compound daily. Re-authorisation backlog creates secondary governance failure.`,
      underwritingImplication: 'Loss falls within standard business interruption parameters. Standard BI clause applies with current loading.',
      operationalImplication: 'Failure is containable within the system perimeter with adequate incident response and manual override capacity.',
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
      narrative: `External provider failure exposes single-point dependency. Full AI stack unavailability until failover or provider recovery. Business continuity plan effectiveness depends on pre-existing diversification.`,
      underwritingImplication: 'Dependency failure triggers tech E&O and business interruption clauses simultaneously. Aggregate exposure depends on portfolio-level provider concentration.',
      operationalImplication: 'No immediate workaround available. Recovery timeline depends entirely on provider resolution. Manual processes may absorb partial load.',
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
      narrative: `Regulatory enforcement or internal governance failure forces complete operational shutdown. No AI-dependent process can continue. Recovery requires full governance remediation and re-authorisation.`,
      underwritingImplication: 'Regulatory halt creates maximum disruption with extended recovery. D&O and regulatory penalty clauses are triggered. Coverage gap likely.',
      operationalImplication: 'Complete operational halt with no workaround. All AI-dependent processes must revert to manual or cease entirely.',
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
      narrative: `Shared dependency structures create simultaneous multi-entity failure. Cascade propagates through correlated AI infrastructure. Portfolio-level loss amplification renders individual entity recovery irrelevant until systemic stabilisation.`,
      underwritingImplication: 'Portfolio-level loss event. Treaty limits likely breached. Aggregate exposure exceeds individual entity reserves. Reinsurance cascade triggered.',
      operationalImplication: 'Cross-entity cascade means individual recovery plans are insufficient. Systemic stabilisation required before entity-level remediation.',
    },
  ];

  const s = scenarios[activeScenario];

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 3 · Stress Testing</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Scenario Simulation</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[620px] leading-relaxed">
          Models exposure impact under adverse conditions. Each scenario stresses different structural failure vectors — calibrated against your deployment profile.
        </p>
      </div>

      {/* How to interpret */}
      <div className="bg-secondary border border-border rounded-lg p-4 mb-5 text-[11px] text-muted-foreground leading-[1.55]">
        <strong className="text-foreground">How to interpret scenarios:</strong> Each scenario applies stress multipliers to your AFI parameters. The resulting metrics show how exposure escalates across failure types. Best Case = controlled degradation. Expected = typical failure profile. Stress = correlated cascade conditions.
      </div>

      {/* Scenario tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => setActiveScenario(i)}
            className={`flex items-center gap-2 px-4 py-[10px] rounded-lg border text-[12px] font-medium transition-all ${
              activeScenario === i
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            <span>{sc.icon}</span>
            {sc.name}
          </button>
        ))}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Executive Risk', value: s.executiveRisk, sub: s.executiveLabel },
          { label: 'Continuation', value: s.continuation, sub: s.continuationLabel },
          { label: 'Dependency', value: s.dependency, sub: s.dependencyLabel },
          { label: 'Agentic', value: s.agentic, sub: s.agenticLabel },
          { label: 'Aggregation', value: s.aggregation, sub: s.aggregationLabel },
        ].map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{m.label}</div>
            <div className={`text-[36px] font-bold font-mono leading-none ${
              m.value >= 70 ? 'text-fragile' : m.value >= 40 ? 'text-sensitive' : 'text-stable'
            }`}>{m.value}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Recovery + Downtime */}
      <div className="grid grid-cols-2 gap-3 mb-4">
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

      {/* Impact narrative */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="text-[12px] text-foreground leading-[1.65]">
          <strong className="text-foreground">Impact Narrative — </strong>{s.narrative}
        </div>
      </div>

      {/* Implications */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border-l-4 border-l-fragile border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-2">Underwriting Implication</div>
          <div className="text-[12px] text-muted-foreground leading-[1.55]">{s.underwritingImplication}</div>
        </div>
        <div className="bg-card border-l-4 border-l-sensitive border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-wider uppercase text-sensitive mb-2">Operational Risk Implication</div>
          <div className="text-[12px] text-muted-foreground leading-[1.55]">{s.operationalImplication}</div>
        </div>
      </div>

      {/* View nav footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-7">
        <button onClick={() => setActiveStep(2)} className="inline-flex items-center gap-[6px] bg-transparent text-secondary-foreground border border-border px-3 py-[6px] rounded-md text-[11px] font-medium hover:bg-secondary transition-colors cursor-pointer">← Decision Intelligence</button>
        <span className="text-[10px] text-muted-foreground italic">Step 3 of 6 · Scenario stress testing</span>
        <button onClick={() => setActiveStep(4)} className="view-nav-next">Insurance Decision →</button>
      </div>
    </div>
  );
}
