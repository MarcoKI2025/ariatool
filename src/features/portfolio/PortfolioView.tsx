import React, { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useAppState';
import { calcAFI, getBand, computeAFIComponents, getBandClass } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';
import { DEFAULT_INPUTS, SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT } from '@/lib/constants';
import { DependencyNetwork } from './DependencyNetwork';
import { LiveIndicator } from '@/components/shared/LiveIndicator';
import { UseRestrictionBanner } from '@/components/shared/UseRestrictionBanner';
import { AppFooter } from '@/components/shared/AppFooter';
import { QuantumVulnerabilityAssessment } from '@/features/quantum/QuantumVulnerabilityAssessment';
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
  const analysisInputs = state.inputs;
  const hasAnalysis = state.analysisComplete;

  const [entities, setEntities] = useState<PortfolioEntity[]>([
    { id: '1', name: hasAnalysis && analysisInputs.companyName ? analysisInputs.companyName : 'Client A', inputs: hasAnalysis ? { ...analysisInputs } : { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '2', name: 'Client B', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '3', name: 'Client C', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 34 },
  ]);

  // Sync first entity with current analysis inputs when analysis changes
  useEffect(() => {
    if (hasAnalysis) {
      setEntities(prev => prev.map((e, i) => 
        i === 0 ? { ...e, name: analysisInputs.companyName || e.name, inputs: { ...analysisInputs } } : e
      ));
    }
  }, [hasAnalysis, analysisInputs]);

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

  // Helper: compute entity AFI including size/revenue adjustments (same as computeFullAnalysis)
  const computeEntityAFI = (inputs: ExposureInputs) => {
    const components = computeAFIComponents(inputs);
    const baseAfi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
    const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
    const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
    const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
    return { components, afi, band: getBand(afi) };
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

  // Capital Efficiency Calculator — uses full AFI with size/revenue adjustments
  const stableCount = normalizedEntities.filter(e => {
    const { band } = computeEntityAFI(e.inputs);
    return band === 'Stable';
  }).length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Portfolio Intelligence Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
              Portfolio Intelligence Dashboard
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Multi-Entity Risk Aggregation
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-2">
              Assess aggregate structural risk across multiple client deployments. Portfolio AFI is computed as weighted average of entity-level components.
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <LiveIndicator label={`${entities.length} entities monitored`} />
            <div className="text-[9px] text-muted-foreground mt-1">
              Last Updated: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      <UseRestrictionBanner />

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
            const { components, afi, band } = computeEntityAFI(entity.inputs);

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

      {/* Capital Efficiency Calculator */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-stable mb-1">✓ Solvency II Capital Efficiency</div>
            <div className="text-[11px] text-muted-foreground">Estimated governance-driven capital reserve optimization</div>
          </div>
          <div className="text-[9px] text-muted-foreground">Based on current portfolio composition</div>
        </div>
        {stableCount > 0 ? (
          <>
            <div className="text-center mb-4">
              <div className="text-[11px] text-muted-foreground mb-1">Projected annual capital release potential</div>
              <div className="text-[10px] text-muted-foreground leading-[1.5] max-w-md mx-auto">
                Entities classified as Stable qualify for reduced capital reserves under Solvency II Pillar 2 risk reclassification framework (EIOPA calibration: 12–18% reduction per entity).
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Stable Entities</div>
                <div className="text-lg font-bold text-stable font-mono">{stableCount} / {normalizedEntities.length}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Capital Reduction (EIOPA)</div>
                <div className="text-lg font-bold text-foreground font-mono">12–18%</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Cost of Capital Baseline</div>
                <div className="text-lg font-bold text-foreground font-mono">8% p.a.</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-[12px] text-muted-foreground">No entities currently classified as Stable</div>
            <div className="text-[10px] text-muted-foreground mt-1">Optimize governance scores to unlock capital efficiency gains</div>
          </div>
        )}
        <div className="mt-4 text-[9px] text-muted-foreground leading-[1.5] border-t border-border pt-3">
          Portfolio entities with improved governance scores (AFI reclassification from Sensitive/Fragile → Stable) require lower capital reserves under Solvency II Article 44 operational risk framework. Figures represent estimated opportunity based on current portfolio composition and standard EIOPA calibration factors. Not actuarial advice.
        </div>
      </div>

      {/* Quantum Vulnerability Assessment */}
      <QuantumVulnerabilityAssessment />

      {/* Interpretation */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio Interpretation</h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
          Portfolio AFI represents the weighted-average structural fragility across all entities in this cluster.
          This aggregation assumes entities share common infrastructure dependencies (model providers, cloud platforms,
          governance frameworks). Actual portfolio risk may be higher if entities exhibit correlated failure modes
          not captured in independent AFI assessments. Use this for concentration risk evaluation and treaty structuring.
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          Swiss Re sigma insights 01/2026: "AI adoption creates emerging risk dimensions that do not fit neatly within traditional insurance boundaries." "New exposures arising from hyperscale data centres, high-performance computing facilities and expanded power &amp; energy infrastructure."
        </p>
      </div>

      <AppFooter />
    </div>
  );
}
