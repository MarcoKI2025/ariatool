import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, BandBadge } from '@/components/shared/UIComponents';

export function DependencyMapLinear() {
  const { state } = useApp();
  const { results, inputs } = state;

  if (!results) return null;

  const providers = inputs.providers;
  const isSingle = providers.length <= 1;

  const internalSystems = [
    { name: 'Core Operations', sub: 'Business processes', icon: 'CO' },
    { name: 'Data Pipeline', sub: 'ETL & processing', icon: 'DP' },
    { name: 'User Interface', sub: 'Customer-facing', icon: 'UI' },
    { name: 'Compliance', sub: 'Regulatory reporting', icon: 'CR' },
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="Concentration Summary" highlight={isSingle}>
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

      <SectionCard title="Architecture Risk View">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr_36px_1fr] items-center py-4 gap-4 md:gap-0">
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">External Providers</div>
            {providers.length === 0 ? (
              <div className="rounded-lg p-3 border border-fragile-border bg-fragile-bg opacity-50">
                <div className="text-[11px] font-semibold text-foreground">No provider selected</div>
              </div>
            ) : providers.map((p, i) => (
              <div key={i} className="rounded-lg p-3 border border-fragile-border bg-fragile-bg flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-fragile/10 text-fragile flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {p.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{p}</div>
                  <div className="text-[9px] text-muted-foreground">External provider</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block text-center text-muted-foreground text-lg">→</div>
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">AI / Orchestration Layer</div>
            <div className="rounded-lg p-3 border border-purple-border bg-purple-bg flex items-center gap-2">
              <div className="w-[26px] h-[26px] rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">AI</div>
              <div>
                <div className="text-[11px] font-semibold text-foreground">AI Governance Engine</div>
                <div className="text-[9px] text-muted-foreground">{providers.length} external dependenc{providers.length === 1 ? 'y' : 'ies'}</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-center text-muted-foreground text-lg">→</div>
          <div className="flex flex-col gap-2">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2">Internal Systems</div>
            {internalSystems.map((sys, i) => (
              <div key={i} className="rounded-lg p-3 border border-border bg-secondary flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-muted text-secondary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">{sys.icon}</div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{sys.name}</div>
                  <div className="text-[9px] text-muted-foreground">{sys.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {isSingle && (
        <div className="p-3 bg-fragile-bg border border-fragile-border rounded-lg flex items-start gap-[7px]">
          <span className="text-fragile text-[13px] flex-shrink-0 mt-[1px]">⚠</span>
          <div>
            <div className="text-[11px] text-fragile font-semibold">Single Point of Failure Detected</div>
            <div className="text-[10px] text-fragile/80 mt-[2px]">
              {providers[0] || 'The selected provider'} represents a single point of failure.
            </div>
          </div>
        </div>
      )}

      <SectionCard title="Diversification Assessment">
        <div className="text-[12px] text-secondary-foreground leading-relaxed">
          {providers.length >= 3
            ? 'Provider diversification is adequate. Continue monitoring for infrastructure overlap.'
            : providers.length === 2
            ? 'Partial diversification detected. Investigate whether providers share correlated failure paths.'
            : 'Critical concentration — single provider or no provider specified. Diversification should be the immediate priority.'}
        </div>
      </SectionCard>
    </div>
  );
}
