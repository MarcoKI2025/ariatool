import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState, BandBadge } from '@/components/shared/UIComponents';

export function DependencyMap() {
  const { state, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Dependency Map Locked" description="Complete the Exposure Analysis to view the dependency map and concentration analysis." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const providers = inputs.providers;
  const isSingle = providers.length <= 1;
  const { band } = results;

  const internalSystems = [
    { name: 'Core Operations', sub: 'Business processes', icon: 'CO' },
    { name: 'Data Pipeline', sub: 'ETL & processing', icon: 'DP' },
    { name: 'User Interface', sub: 'Customer-facing', icon: 'UI' },
    { name: 'Compliance', sub: 'Regulatory reporting', icon: 'CR' },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 3 of 6 · Infrastructure</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Dependency Map</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Third-party concentration and single-point-of-failure analysis for {inputs.companyName || 'the assessed entity'}.
        </p>
      </div>

      {/* Concentration summary */}
      <SectionCard title="Concentration Summary" icon="🔗" highlight={isSingle}>
        <div className="flex items-center gap-3 mb-3">
          <BandBadge band={isSingle ? 'Fragile' : providers.length <= 2 ? 'Sensitive' : 'Stable'} size="md" />
          <span className="text-[13px] font-semibold text-foreground">
            {providers.length} provider{providers.length !== 1 ? 's' : ''} — {isSingle ? 'Critical concentration risk' : providers.length <= 2 ? 'Moderate concentration' : 'Diversified'}
          </span>
        </div>
        <div className="text-[12px] text-secondary-foreground leading-relaxed">
          {isSingle
            ? 'Single-provider dependency creates systemic fragility. Any disruption to this provider — outage, pricing change, regulatory action, or strategic pivot — affects the entire AI stack with no fallback path.'
            : providers.length <= 2
            ? 'Limited provider diversification. While some redundancy exists, correlated failure between providers sharing infrastructure could still cause significant disruption.'
            : 'Provider diversification reduces concentration risk. Multiple providers enable failover capability and reduce single-point-of-failure exposure.'}
        </div>
      </SectionCard>

      {/* Dependency flow visualization */}
      <SectionCard title="Architecture Risk View" icon="◈">
        <div className="grid grid-cols-[1fr_36px_1fr_36px_1fr] items-center py-4">
          {/* External providers */}
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">External Providers</div>
            {providers.length === 0 ? (
              <div className="rounded-lg p-3 border border-fragile-border bg-[hsl(7,50%,6%)] opacity-50">
                <div className="text-[11px] font-semibold text-foreground">No provider selected</div>
                <div className="text-[9px] text-muted-foreground">Unspecified</div>
              </div>
            ) : providers.map((p, i) => (
              <div key={i} className="rounded-lg p-3 border border-fragile-border bg-[hsl(7,50%,6%)] flex items-center gap-2 relative">
                <div className="w-[26px] h-[26px] rounded-md bg-[hsl(7,50%,12%)] text-fragile flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {p.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{p}</div>
                  <div className="text-[9px] text-muted-foreground">External provider</div>
                </div>
                {isSingle && <div className="absolute -top-1 -right-1 w-[10px] h-[10px] rounded-full bg-fragile border-2 border-card animate-pulse-dot" />}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="text-center text-muted-foreground text-lg">→</div>

          {/* Core AI layer */}
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">AI / Orchestration Layer</div>
            <div className="rounded-lg p-3 border border-purple-border bg-[hsl(245,40%,8%)] flex items-center gap-2">
              <div className="w-[26px] h-[26px] rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">AI</div>
              <div>
                <div className="text-[11px] font-semibold text-foreground">AI Governance Engine</div>
                <div className="text-[9px] text-muted-foreground">{providers.length} external dependenc{providers.length === 1 ? 'y' : 'ies'}</div>
              </div>
            </div>
            <div className="rounded-lg p-3 border border-purple-border bg-[hsl(245,40%,8%)] flex items-center gap-2">
              <div className="w-[26px] h-[26px] rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">ML</div>
              <div>
                <div className="text-[11px] font-semibold text-foreground">Model Pipeline</div>
                <div className="text-[9px] text-muted-foreground">Training & inference</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center text-muted-foreground text-lg">→</div>

          {/* Internal systems */}
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">Internal Systems</div>
            {internalSystems.map((sys, i) => (
              <div key={i} className="rounded-lg p-3 border border-border bg-secondary flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-border text-secondary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">{sys.icon}</div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{sys.name}</div>
                  <div className="text-[9px] text-muted-foreground">{sys.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* SPOF warning */}
      {isSingle && (
        <div className="p-3 bg-[hsl(7,50%,6%)] border border-fragile-border rounded-lg flex items-start gap-[7px] mb-4">
          <span className="text-fragile text-[13px] flex-shrink-0 mt-[1px]">⚠</span>
          <div>
            <div className="text-[11px] text-fragile font-semibold">Single Point of Failure Detected</div>
            <div className="text-[10px] text-fragile/80 mt-[2px]">
              {providers[0] || 'The selected provider'} represents a single point of failure. Provider disruption would cascade across all AI-dependent operations with no fallback path.
            </div>
          </div>
        </div>
      )}

      {/* Diversification commentary */}
      <SectionCard title="Diversification Assessment" icon="📋">
        <div className="text-[12px] text-secondary-foreground leading-relaxed">
          {providers.length >= 3
            ? 'Provider diversification is adequate. Multiple providers reduce correlated failure risk. Continue monitoring for infrastructure overlap between providers (shared cloud, compute, or data centre dependencies).'
            : providers.length === 2
            ? 'Partial diversification detected. Two providers offer some redundancy but may share underlying infrastructure (cloud, GPU compute, training data). Investigate whether providers are truly independent or share correlated failure paths.'
            : 'Critical concentration — single provider or no provider specified. This represents maximum structural fragility. Diversification should be the immediate priority for any remediation programme.'}
        </div>
      </SectionCard>
    </div>
  );
}
