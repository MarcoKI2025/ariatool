import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { calcAFI, getBand, computeAFIComponents, getBandClass } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';
import { DEFAULT_INPUTS } from '@/lib/constants';
import { DependencyNetwork } from './DependencyNetwork';

interface PortfolioEntity {
  id: string;
  name: string;
  inputs: ExposureInputs;
  weight: number;
}

function ComponentCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground font-mono">{(value * 100).toFixed(0)}</div>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function PortfolioView() {
  const { state } = useApp();
  const [entities, setEntities] = useState<PortfolioEntity[]>([
    { id: '1', name: 'Client A', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '2', name: 'Client B', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '3', name: 'Client C', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 34 },
  ]);

  const addEntity = () => {
    const newId = Date.now().toString();
    setEntities([...entities, {
      id: newId,
      name: `Client ${String.fromCharCode(64 + entities.length + 1)}`,
      inputs: { ...DEFAULT_INPUTS } as ExposureInputs,
      weight: 0
    }]);
  };

  const removeEntity = (id: string) => {
    if (entities.length <= 2) return;
    setEntities(entities.filter(e => e.id !== id));
  };

  const updateEntityWeight = (id: string, weight: number) => {
    setEntities(entities.map(e => e.id === id ? { ...e, weight } : e));
  };

  const updateEntityName = (id: string, name: string) => {
    setEntities(entities.map(e => e.id === id ? { ...e, name } : e));
  };

  // Calculate portfolio-weighted AFI
  const totalWeight = entities.reduce((sum, e) => sum + e.weight, 0);
  const normalizedEntities = entities.map(e => ({
    ...e,
    normalizedWeight: totalWeight > 0 ? e.weight / totalWeight : 1 / entities.length
  }));

  const portfolioComponents = normalizedEntities.reduce((acc, entity) => {
    const components = computeAFIComponents(entity.inputs);
    return {
      dr: acc.dr + components.dr * entity.normalizedWeight,
      jd: acc.jd + components.jd * entity.normalizedWeight,
      rc: acc.rc + components.rc * entity.normalizedWeight,
      cd: acc.cd + components.cd * entity.normalizedWeight,
      na: acc.na + components.na * entity.normalizedWeight,
    };
  }, { dr: 0, jd: 0, rc: 0, cd: 0, na: 0 });

  const portfolioAFI = calcAFI(
    portfolioComponents.dr,
    portfolioComponents.jd,
    portfolioComponents.rc,
    portfolioComponents.cd,
    portfolioComponents.na
  );

  const portfolioBand = getBand(portfolioAFI);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-primary/70 mb-2">
          Advanced · Multi-Entity Analysis
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Portfolio Aggregation
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Assess aggregate structural risk across multiple client deployments. Portfolio AFI is computed as weighted average of entity-level components.
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Portfolio-Level Risk Assessment
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {entities.length} entities · Weighted aggregate analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Portfolio AFI</div>
            <div className={`text-3xl font-bold font-mono text-${getBandClass(portfolioBand)}`}>
              {portfolioAFI.toFixed(2)}
            </div>
            <div className={`text-xs font-semibold mt-1 text-${getBandClass(portfolioBand)}`}>
              {portfolioBand}
            </div>
          </div>
        </div>

        {/* Portfolio Components */}
        <div className="grid grid-cols-5 gap-3">
          <ComponentCell label="DR" value={portfolioComponents.dr} />
          <ComponentCell label="JD" value={portfolioComponents.jd} />
          <ComponentCell label="RC" value={portfolioComponents.rc} />
          <ComponentCell label="CD" value={portfolioComponents.cd} />
          <ComponentCell label="NA" value={portfolioComponents.na} />
        </div>
      </div>

      {/* Entity List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Entity Breakdown</h3>
          <button
            onClick={addEntity}
            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            + Add Entity
          </button>
        </div>

        <div className="space-y-3">
          {normalizedEntities.map((entity) => {
            const components = computeAFIComponents(entity.inputs);
            const afi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
            const band = getBand(afi);

            return (
              <div key={entity.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    value={entity.name}
                    onChange={e => updateEntityName(entity.id, e.target.value)}
                    className="flex-1 min-w-[140px] px-3 py-2 bg-secondary border border-border rounded-md text-[13px] font-semibold text-foreground"
                  />
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span>Weight:</span>
                    <input
                      type="number"
                      value={entity.weight}
                      onChange={e => updateEntityWeight(entity.id, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 bg-secondary border border-border rounded-md text-[12px] text-center"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    ({(entity.normalizedWeight * 100).toFixed(1)}% of total)
                  </span>
                  {entities.length > 2 && (
                    <button
                      onClick={() => removeEntity(entity.id)}
                      className="px-2 py-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  <MetricCell label="DR" value={(components.dr * 100).toFixed(0)} />
                  <MetricCell label="JD" value={(components.jd * 100).toFixed(0)} />
                  <MetricCell label="RC" value={(components.rc * 100).toFixed(0)} />
                  <MetricCell label="CD" value={(components.cd * 100).toFixed(0)} />
                  <MetricCell label="NA" value={(components.na * 100).toFixed(0)} />
                  <MetricCell label="AFI" value={afi.toFixed(2)} />
                  <div className={`bg-${getBandClass(band)}-bg border border-${getBandClass(band)}-border rounded-lg p-3 text-center`}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Band</div>
                    <div className={`text-sm font-semibold text-${getBandClass(band)}`}>{band}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio Interpretation</h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Portfolio AFI represents the weighted-average structural fragility across all entities in this cluster.
          This aggregation assumes entities share common infrastructure dependencies (model providers, cloud platforms,
          governance frameworks). Actual portfolio risk may be higher if entities exhibit correlated failure modes
          not captured in independent AFI assessments. Use this for concentration risk evaluation and treaty structuring.
        </p>
      </div>
    </div>
  );
}
