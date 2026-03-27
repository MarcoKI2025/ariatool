import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { calcAFI, getBand, computeAFIComponents, getBandClass, computeFullAnalysis, computePortfolioAccumulation, computeCAI } from '@/lib/scoring';
import { ExposureInputs } from '@/lib/types';
import { DEFAULT_INPUTS, SIZE_AFI_ADJUSTMENT, REVENUE_AFI_ADJUSTMENT } from '@/lib/constants';
import { LiveIndicator } from '@/components/shared/LiveIndicator';
import { AppFooter } from '@/components/shared/AppFooter';
import { StepNavigation } from '@/components/shared/StepNavigation';
import { QuantumVulnerabilityAssessment } from '@/features/quantum/QuantumVulnerabilityAssessment';
import { DependencyNetwork } from './DependencyNetwork';
import { SilentAIDetector } from './SilentAIDetector';
import { fetchCloudProviderStatus } from '@/lib/liveData';
import { RealCaseAlert } from '@/features/demo/RealCaseFactsCard';
import { computeEvolutionAnalysis } from '@/lib/evolutionEngine';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PortfolioEntity {
  id: string;
  name: string;
  inputs: ExposureInputs;
  weight: number;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function levelColor(level: string): string {
  if (['Critical', 'Fragile', 'Uninsurable', 'Systemic', 'High'].includes(level)) return 'text-fragile';
  if (['Elevated', 'Sensitive', 'At Risk', 'Medium'].includes(level)) return 'text-sensitive';
  return 'text-stable';
}
function levelBg(level: string): string {
  if (['Critical', 'Fragile', 'Systemic', 'High'].includes(level)) return 'bg-fragile-bg border-fragile-border';
  if (['Elevated', 'Sensitive', 'At Risk', 'Medium'].includes(level)) return 'bg-sensitive-bg border-sensitive-border';
  return 'bg-stable-bg border-stable-border';
}

const computeEntityAFI = (inputs: ExposureInputs) => {
  const components = computeAFIComponents(inputs);
  const baseAfi = calcAFI(components.dr, components.jd, components.rc, components.cd, components.na);
  const sizeAdj = SIZE_AFI_ADJUSTMENT[inputs.size] || 0;
  const revAdj = REVENUE_AFI_ADJUSTMENT[inputs.revenue] || 0;
  const afi = Math.max(0.01, baseAfi + sizeAdj + revAdj);
  return { components, afi, band: getBand(afi) };
};

// ═══════════════════════════════════════════════════════════════
// MAIN VIEW
// ═══════════════════════════════════════════════════════════════

export function PortfolioView() {
  const { state } = useApp();
  const analysisInputs = state.inputs;
  const hasAnalysis = state.analysisComplete;
  const [showDetail, setShowDetail] = useState(false);

  // Live cloud incident count
  const [totalIncidents, setTotalIncidents] = useState(0);
  useEffect(() => {
    fetchCloudProviderStatus().then(providers => {
      setTotalIncidents(providers.reduce((sum, p) => sum + p.incidents, 0));
    });
    const interval = setInterval(() => {
      fetchCloudProviderStatus().then(providers => {
        setTotalIncidents(providers.reduce((sum, p) => sum + p.incidents, 0));
      });
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [entities, setEntities] = useState<PortfolioEntity[]>([
    { id: '1', name: hasAnalysis && analysisInputs.companyName ? analysisInputs.companyName : 'Client A', inputs: hasAnalysis ? { ...analysisInputs } : { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '2', name: 'Client B', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 33 },
    { id: '3', name: 'Client C', inputs: { ...DEFAULT_INPUTS } as ExposureInputs, weight: 34 },
  ]);

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
  const removeEntity = (id: string) => { if (entities.length <= 2) return; setEntities(entities.filter(e => e.id !== id)); };
  const updateEntityWeight = (id: string, weight: number) => { setEntities(entities.map(e => e.id === id ? { ...e, weight } : e)); };
  const updateEntityName = (id: string, name: string) => { setEntities(entities.map(e => e.id === id ? { ...e, name } : e)); };

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

  const portfolioAFI = calcAFI(portfolioComponents.dr, portfolioComponents.jd, portfolioComponents.rc, portfolioComponents.cd, portfolioComponents.na);
  const portfolioBand = getBand(portfolioAFI);

  // Evolution analysis per entity
  const entityEvolutions = useMemo(() =>
    normalizedEntities.map(entity => {
      const entityResults = computeFullAnalysis(entity.inputs);
      return computeEvolutionAnalysis(entity.inputs, entityResults);
    }),
    [normalizedEntities.map(e => JSON.stringify(e.inputs)).join(',')]
  );

  // Portfolio Accumulation Score
  const accumulation = useMemo(() => {
    const pasEntities = normalizedEntities.map(e => {
      const { afi } = computeEntityAFI(e.inputs);
      return { inputs: e.inputs, afi, weight: e.weight };
    });
    return computePortfolioAccumulation(pasEntities);
  }, [normalizedEntities.map(e => JSON.stringify(e.inputs) + e.weight).join(',')]);

  // Average CAI across entities
  const avgCAI = useMemo(() => {
    const total = normalizedEntities.reduce((sum, e) => sum + computeCAI(e.inputs), 0);
    return Math.round(total / normalizedEntities.length);
  }, [normalizedEntities.map(e => JSON.stringify(e.inputs)).join(',')]);

  const avgCorrelation = entityEvolutions.reduce((s, e) => s + e.systemicCorrelationScore, 0) / entityEvolutions.length;
  const avgCascade = entityEvolutions.reduce((s, e) => s + e.cascadeRiskScore, 0) / entityEvolutions.length;
  const worstInsurability = entityEvolutions.reduce((worst, e) => {
    const order: Record<string, number> = { 'Insurable': 0, 'At Risk': 1, 'Critical': 2, 'Uninsurable': 3 };
    return (order[e.insurabilityStatus] || 0) > (order[worst.insurabilityStatus] || 0) ? e : worst;
  }, entityEvolutions[0]);
  const hiddenCorrelationCount = entityEvolutions.filter(e => e.systemicDetail.hiddenCorrelation).length;

  const portfolioRiskLevel =
    worstInsurability.insurabilityStatus === 'Uninsurable' || avgCascade > 0.6 ? 'SYSTEMIC' :
    worstInsurability.insurabilityStatus === 'Critical' || avgCorrelation > 0.6 ? 'ELEVATED' :
    worstInsurability.insurabilityStatus === 'At Risk' ? 'MODERATE' : 'MANAGEABLE';

  const portfolioStatement =
    portfolioRiskLevel === 'SYSTEMIC'
      ? 'Correlated dependencies create potential cascade failure across entities.'
      : portfolioRiskLevel === 'ELEVATED'
      ? 'Shared infrastructure dependencies create concentrated risk exposure.'
      : portfolioRiskLevel === 'MODERATE'
      ? 'Portfolio contains entities with emerging dependency risk.'
      : 'Portfolio dependencies are sufficiently diversified.';

  const riskColor = levelColor(portfolioRiskLevel === 'SYSTEMIC' ? 'Critical' : portfolioRiskLevel === 'ELEVATED' ? 'Elevated' : portfolioRiskLevel === 'MODERATE' ? 'Sensitive' : 'Stable');
  const riskBg = levelBg(portfolioRiskLevel === 'SYSTEMIC' ? 'Critical' : portfolioRiskLevel === 'ELEVATED' ? 'Elevated' : portfolioRiskLevel === 'MODERATE' ? 'Sensitive' : 'Stable');

  const worstTailRisk = Math.max(...entityEvolutions.map(e => e.economicLoss.tailRisk));
  const stableCount = normalizedEntities.filter(e => computeEntityAFI(e.inputs).band === 'Stable').length;

  // PAS color helpers
  const pasColor = accumulation.pas >= 75 ? 'text-fragile' : accumulation.pas >= 50 ? 'text-fragile' : accumulation.pas >= 25 ? 'text-sensitive' : 'text-stable';
  const pasBg = accumulation.pas >= 75 ? 'bg-fragile' : accumulation.pas >= 50 ? 'bg-fragile' : accumulation.pas >= 25 ? 'bg-sensitive' : 'bg-stable';
  const pasBandBg = accumulation.pas >= 75 ? 'bg-fragile-bg border-fragile-border' : accumulation.pas >= 50 ? 'bg-fragile-bg border-fragile-border' : accumulation.pas >= 25 ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  const avgAFI = normalizedEntities.reduce((s, e) => {
    const { afi } = computeEntityAFI(e.inputs);
    return s + afi * e.normalizedWeight;
  }, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <RealCaseAlert />

      {/* Header */}
      <div className="mb-6">
        <div className="label-xs mb-1.5">Step 7 of 11 · Portfolio Intelligence</div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Portfolio & Systemic Risk</h1>
        <p className="text-[13px] text-muted-foreground max-w-[580px] leading-relaxed mt-1">
          Multi-entity aggregation and systemic risk assessment across your portfolio.
        </p>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="portfolio">Portfolio Risk</TabsTrigger>
          <TabsTrigger value="silent">Silent AI Detector</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
      <div className={`rounded-xl border-2 p-6 ${riskBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Portfolio Risk:</span>
          <span className={`text-[14px] font-extrabold tracking-tight ${riskColor}`}>{portfolioRiskLevel}</span>
        </div>
        <div className={`text-[17px] sm:text-[20px] font-extrabold leading-[1.3] tracking-tight ${riskColor}`}>
          {portfolioStatement}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="text-[10px] text-muted-foreground">
            Portfolio AFI: <span className={`font-bold font-mono ${riskColor}`}>{portfolioAFI.toFixed(2)}</span> ({portfolioBand})
          </div>
          <div className="text-[10px] text-muted-foreground">
            {entities.length} entities · Weighted aggregate
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 2: 4 CORE METRICS
          ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Worst Case Impact */}
        <div className={`rounded-xl border p-5 ${levelBg(worstTailRisk > 15 ? 'Critical' : worstTailRisk > 8 ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Worst Case Impact</div>
          <div className={`text-[22px] font-extrabold font-mono ${levelColor(worstTailRisk > 15 ? 'Critical' : worstTailRisk > 8 ? 'Elevated' : 'Stable')}`}>€{worstTailRisk}M</div>
          <div className="text-[9px] text-muted-foreground mt-1">Tail risk (99th percentile)</div>
        </div>
        {/* Average Correlation */}
        <div className={`rounded-xl border p-5 ${levelBg(avgCorrelation > 0.65 ? 'Critical' : avgCorrelation > 0.35 ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Avg Correlation</div>
          <div className={`text-[22px] font-extrabold font-mono ${levelColor(avgCorrelation > 0.65 ? 'Critical' : avgCorrelation > 0.35 ? 'Elevated' : 'Stable')}`}>{(avgCorrelation * 100).toFixed(0)}%</div>
          <div className="text-[9px] text-muted-foreground mt-1">Cross-entity dependency</div>
        </div>
        {/* Cascade Risk */}
        <div className={`rounded-xl border p-5 ${levelBg(avgCascade > 0.6 ? 'Critical' : avgCascade > 0.3 ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Cascade Risk</div>
          <div className={`text-[22px] font-extrabold font-mono ${levelColor(avgCascade > 0.6 ? 'Critical' : avgCascade > 0.3 ? 'Elevated' : 'Stable')}`}>{(avgCascade * 100).toFixed(0)}%</div>
          <div className="text-[9px] text-muted-foreground mt-1">Failure propagation</div>
        </div>
        {/* Portfolio Exposure Level */}
        <div className={`rounded-xl border p-5 ${levelBg(worstInsurability.insurabilityStatus === 'Uninsurable' ? 'Critical' : worstInsurability.insurabilityStatus === 'At Risk' ? 'Elevated' : 'Stable')}`}>
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Exposure Level</div>
          <div className={`text-[18px] font-extrabold ${levelColor(worstInsurability.insurabilityStatus === 'Uninsurable' ? 'Critical' : worstInsurability.insurabilityStatus === 'At Risk' ? 'Elevated' : 'Stable')}`}>{worstInsurability.insurabilityStatus}</div>
          <div className="text-[9px] text-muted-foreground mt-1">Worst entity status</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 3: WHAT CAN GO WRONG
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">What Can Go Wrong</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Shared Model Failure',
            desc: 'Multiple entities rely on the same AI model family. A single model vulnerability propagates across the portfolio simultaneously.',
            level: avgCorrelation > 0.5 ? 'High' : 'Moderate',
          },
          {
            title: 'Cloud Dependency Outage',
            desc: 'Concentrated cloud infrastructure creates single points of failure. Provider incidents affect multiple entities at once.',
            level: totalIncidents > 0 ? 'Active' : avgCorrelation > 0.4 ? 'Elevated' : 'Low',
          },
          {
            title: 'Correlated Decision Errors',
            desc: 'Entities using similar training data or governance frameworks produce correlated failures under the same stress conditions.',
            level: avgCascade > 0.5 ? 'High' : 'Moderate',
          },
        ].map((scenario) => {
          const sColor = levelColor(scenario.level === 'Active' || scenario.level === 'High' ? 'Critical' : scenario.level === 'Elevated' ? 'Elevated' : 'Stable');
          const sBg = levelBg(scenario.level === 'Active' || scenario.level === 'High' ? 'Critical' : scenario.level === 'Elevated' ? 'Elevated' : 'Stable');
          return (
            <div key={scenario.title} className={`rounded-xl border p-5 ${sBg}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">{scenario.title}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sColor}`}>{scenario.level}</span>
              </div>
              <div className="text-[11px] text-foreground font-medium leading-relaxed">{scenario.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Hidden Correlation Warning */}
      {hiddenCorrelationCount > 0 && (
        <div className="bg-sensitive-bg border-2 border-sensitive rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-[18px]">⚠️</span>
            <div>
              <div className="text-[13px] font-extrabold text-sensitive mb-1">Hidden Correlation Detected in {hiddenCorrelationCount} Entit{hiddenCorrelationCount > 1 ? 'ies' : 'y'}</div>
              <div className="text-[11px] text-foreground font-medium leading-relaxed">
                Individually moderate dependency factors combine to create aggregate systemic risk. Portfolio-wide failure scenarios cannot be excluded under correlated stress conditions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STEP 4: SIMPLIFIED ENTITY BREAKDOWN
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Entity Overview</span>
        <div className="flex-1 h-px bg-border" />
        <button onClick={addEntity} className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          + Add Entity
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
        {normalizedEntities.map((entity, idx) => {
          const { afi, band } = computeEntityAFI(entity.inputs);
          const evo = entityEvolutions[idx];
          const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
          const bandBg = band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable';

          return (
            <div key={entity.id} className="flex items-center gap-3 px-5 py-3.5">
              {/* Color indicator */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${bandBg}`} />

              {/* Name */}
              <input
                value={entity.name}
                onChange={e => updateEntityName(entity.id, e.target.value)}
                className="flex-1 min-w-[100px] bg-transparent text-[13px] font-semibold text-foreground border-none outline-none focus:underline"
              />

              {/* Band label */}
              <span className={`text-[11px] font-bold ${bandColor}`}>{band}</span>

              {/* AFI */}
              <span className="text-[11px] font-mono text-muted-foreground w-12 text-right">{afi.toFixed(2)}</span>

              {/* Coverage decision */}
              <span className="text-[9px] text-muted-foreground hidden sm:inline-block w-16 text-right">{evo?.coverageDecision.decision || '—'}</span>

              {/* Weight */}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <input
                  type="number"
                  value={entity.weight}
                  onChange={e => updateEntityWeight(entity.id, parseFloat(e.target.value) || 0)}
                  className="w-12 px-1.5 py-1 bg-secondary border border-border rounded text-[10px] text-center"
                  min="0" max="100"
                />
                <span>%</span>
              </div>

              {/* Remove */}
              {entities.length > 2 && (
                <button onClick={() => removeEntity(entity.id)} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">✕</button>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          ACCUMULATION RISK ENGINE
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Accumulation Risk Engine</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className={`rounded-xl border-2 p-6 ${pasBandBg}`}>
        {/* PAS Gauge */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">Portfolio Accumulation Score</div>
            <div className={`text-[36px] font-extrabold font-mono ${pasColor}`}>{accumulation.pas}</div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${pasBg}`} style={{ width: `${accumulation.pas}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
              <span>Low</span><span>Elevated</span><span>Critical</span><span>Systemic</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${pasBandBg} ${pasColor}`}>
            {accumulation.accumulationBand}
          </div>
        </div>

        {/* Sub-metrics: 4-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-card/50 rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Provider Overlap</div>
            <div className={`text-[20px] font-extrabold font-mono ${accumulation.sdr > 0.6 ? 'text-fragile' : accumulation.sdr > 0.3 ? 'text-sensitive' : 'text-stable'}`}>{Math.round(accumulation.sdr * 100)}%</div>
            <div className="text-[9px] text-muted-foreground">Shared Dependency Ratio</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Model Homogeneity</div>
            <div className={`text-[20px] font-extrabold font-mono ${accumulation.mcs > 0.6 ? 'text-fragile' : accumulation.mcs > 0.3 ? 'text-sensitive' : 'text-stable'}`}>{Math.round(accumulation.mcs * 100)}</div>
            <div className="text-[9px] text-muted-foreground">Model Concentration Score</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Correlated Portfolio AFI</div>
            <div className={`text-[20px] font-extrabold font-mono ${accumulation.cAFI > 1.35 ? 'text-fragile' : accumulation.cAFI > 0.85 ? 'text-sensitive' : 'text-stable'}`}>{accumulation.cAFI.toFixed(2)}</div>
            <div className="text-[9px] text-muted-foreground">Accumulation-adjusted AFI</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3">
            <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Avg Cascade Index</div>
            <div className={`text-[20px] font-extrabold font-mono ${avgCAI >= 60 ? 'text-fragile' : avgCAI >= 30 ? 'text-sensitive' : 'text-stable'}`}>{avgCAI}</div>
            <div className="text-[9px] text-muted-foreground">CAI across entities</div>
          </div>
        </div>

        {/* Dominant Provider Alert */}
        {accumulation.dominantProvider && (
          <div className="bg-fragile-bg border-2 border-fragile rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-[18px]">⚠️</span>
              <div className="text-[12px] font-bold text-fragile leading-relaxed">
                {accumulation.dominantProvider} is a single point of failure — used by {accumulation.sharedProviderCount} of {entities.length} cedants. A single outage may trigger simultaneous claims across your portfolio.
              </div>
            </div>
          </div>
        )}

        {/* High CAI Warning */}
        {avgCAI >= 60 && (
          <div className="bg-sensitive-bg border border-sensitive rounded-xl p-4 mb-4">
            <div className="text-[11px] font-bold text-sensitive">
              ⚠ High cascade potential — a failure in one entity's AI system may propagate rapidly across operationally connected cedants.
            </div>
          </div>
        )}

        {/* Accumulation Narrative */}
        <div className="text-[12px] text-foreground leading-relaxed">
          Your portfolio of <strong>{entities.length}</strong> entities shows <strong className={pasColor}>{accumulation.accumulationBand.toLowerCase()}</strong> accumulation risk.{' '}
          {Math.round(accumulation.sdr * 100)}% share at least one AI provider, creating correlated exposure.{' '}
          The correlation-adjusted AFI of <strong className="font-mono">{accumulation.cAFI.toFixed(2)}</strong>{' '}
          {accumulation.cAFI > avgAFI ? 'exceeds' : 'is close to'} the simple weighted average of <strong className="font-mono">{avgAFI.toFixed(2)}</strong>,{' '}
          indicating {accumulation.cAFI > avgAFI * 1.2 ? 'severe' : accumulation.cAFI > avgAFI * 1.05 ? 'significant' : 'low'} hidden concentration.
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 5: UNDERWRITING IMPACT
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Underwriting Impact</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Coverage Restriction */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Coverage Restriction</div>
          <div className={`text-[14px] font-bold mb-2 ${riskColor}`}>
            {portfolioRiskLevel === 'SYSTEMIC' ? 'Decline or Sublimit Required'
              : portfolioRiskLevel === 'ELEVATED' ? 'Conditional — Governance Controls Required'
              : 'Standard Terms Applicable'}
          </div>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            {portfolioRiskLevel === 'SYSTEMIC'
              ? 'Correlated failure modes across entities require coverage restrictions or exclusion clauses.'
              : 'Current portfolio composition allows standard underwriting with monitoring.'}
          </div>
        </div>

        {/* Aggregation Risk */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Aggregation Risk</div>
          <div className={`text-[14px] font-bold mb-2 ${levelColor(avgCorrelation > 0.5 ? 'Critical' : avgCorrelation > 0.3 ? 'Elevated' : 'Stable')}`}>
            {avgCorrelation > 0.5 ? 'Critical Concentration' : avgCorrelation > 0.3 ? 'Moderate Overlap' : 'Diversified'}
          </div>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            {avgCorrelation > 0.5
              ? 'Treaty structuring must account for correlated loss potential across entities.'
              : 'Entity independence is sufficient for standard aggregation limits.'}
          </div>
        </div>

        {/* Capital Allocation Pressure */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Capital Allocation</div>
          <div className={`text-[14px] font-bold mb-2 ${levelColor(stableCount === 0 ? 'Critical' : stableCount < entities.length / 2 ? 'Elevated' : 'Stable')}`}>
            {stableCount === 0 ? 'Maximum Reserve Required' : stableCount >= entities.length / 2 ? 'Capital Efficiency Available' : 'Partial Reserve Optimization'}
          </div>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            {stableCount > 0
              ? `${stableCount} of ${entities.length} entities qualify for Solvency II capital reduction (12–18% per stable entity).`
              : 'No entities qualify for capital reserve reduction under current governance scores.'}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 6: COLLAPSED ADVANCED MODULES
          ══════════════════════════════════════════════════ */}
      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground">
              {showDetail ? '▾ Hide Advanced Analysis' : '▸ View Advanced Analysis'}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">

          {/* Portfolio AFI Components */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Portfolio AFI Components (Weighted Average)</div>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'DR', value: portfolioComponents.dr },
                { label: 'JD', value: portfolioComponents.jd },
                { label: 'RC', value: portfolioComponents.rc },
                { label: 'CD', value: portfolioComponents.cd },
                { label: 'NA', value: portfolioComponents.na },
              ].map(c => (
                <div key={c.label} className="bg-secondary/50 rounded-lg p-3 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{c.label}</div>
                  <div className="text-[18px] font-bold font-mono text-foreground">{(c.value * 100).toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Solvency II Capital Efficiency */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Solvency II Capital Efficiency</div>
            {stableCount > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Stable Entities</div>
                  <div className="text-[18px] font-bold text-stable font-mono">{stableCount} / {entities.length}</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Capital Reduction</div>
                  <div className="text-[18px] font-bold text-foreground font-mono">12–18%</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cost of Capital</div>
                  <div className="text-[18px] font-bold text-foreground font-mono">8% p.a.</div>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground text-center py-3">No entities currently classified as Stable — optimize governance scores to unlock capital efficiency.</div>
            )}
          </div>

          {/* Quantum Vulnerability */}
          <QuantumVulnerabilityAssessment />

          {/* Interpretation */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Methodology Note</div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              Portfolio AFI represents the weighted-average structural fragility across all entities. Aggregation assumes shared infrastructure dependencies. Actual risk may be higher under correlated failure modes. Framework: AGAF v4.3.0.
            </div>
          </div>

        </CollapsibleContent>
      </Collapsible>

        </TabsContent>

        <TabsContent value="silent" className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Silent AI Exposure Analysis</div>
            <h2 className="text-[16px] font-bold text-foreground mb-1">Silent AI Exposure Detector</h2>
            <p className="text-[11px] text-muted-foreground mb-4">Estimate how much AI risk may already exist in your conventional book of business without explicit recognition.</p>
            <SilentAIDetector />
          </div>
        </TabsContent>
      </Tabs>

      <StepNavigation currentStep={7} />
      <AppFooter />
    </div>
  );
}
