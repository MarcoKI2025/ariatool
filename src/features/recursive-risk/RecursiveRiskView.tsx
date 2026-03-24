import React, { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionDivider } from '@/components/shared/SectionDivider';
import {
  calculateRSI,
  calculateMCCI,
  detectCompoundingGains,
  assessConfidence,
  formatStars,
  type RecursiveRiskFactors,
  type MetacognitiveCapabilities,
  type PerformanceDataPoint,
} from '@/lib/recursive-risk';

const METACOG_LABELS: Record<string, string> = {
  performanceTracking: 'Performance Tracking',
  metricComparison: 'Metric Comparison',
  trendAnalysis: 'Trend Analysis',
  errorDetection: 'Error Detection',
  biasDetection: 'Bias Detection',
  degeneracyDetection: 'Degeneracy Detection',
  multiGenerationPlanning: 'Multi-Generation Planning',
  computeAwarePlanning: 'Compute-Aware Planning',
  explorationExploitationBalance: 'Exploration/Exploitation Balance',
  persistentMemory: 'Persistent Memory',
  crossSessionLearning: 'Cross-Session Learning',
  knowledgeBase: 'Knowledge Base',
  templateSystems: 'Template Systems',
  patternAbstraction: 'Pattern Abstraction',
  frameworkDevelopment: 'Framework Development',
};

export function RecursiveRiskView() {
  const { state, updateRecursiveRisk } = useApp();
  const { inputs, results } = state;

  const [rsiFactors] = useState<RecursiveRiskFactors>({
    codeModification: inputs.automation >= 4 ? 3 : 1,
    promptEngineering: 2,
    improvementProcess: inputs.automation >= 5 ? 4 : 1,
    evaluationCriteria: 1,
    parentSelection: 1,
    performanceGainRate: 2,
    adaptationSpeed: inputs.automation >= 3 ? 3 : 1,
    learningCurve: 2,
    interpretability: 5 - (inputs.explainabilityGap || 3),
    auditCadence: inputs.reviewCadence || 2,
    domainExpertise: 3,
  });

  const [metacogCaps, setMetacogCaps] = useState<MetacognitiveCapabilities>({
    performanceTracking: false,
    metricComparison: false,
    trendAnalysis: false,
    errorDetection: false,
    biasDetection: false,
    degeneracyDetection: false,
    multiGenerationPlanning: false,
    computeAwarePlanning: false,
    explorationExploitationBalance: false,
    persistentMemory: inputs.persistentMemory >= 3,
    crossSessionLearning: false,
    knowledgeBase: false,
    templateSystems: false,
    patternAbstraction: false,
    frameworkDevelopment: false,
  });

  const rsiResult = calculateRSI(rsiFactors);
  const mcciResult = calculateMCCI(metacogCaps);

  const performanceHistory: PerformanceDataPoint[] = [
    { timestamp: new Date('2026-01-01'), performance: 50, iteration: 0 },
    { timestamp: new Date('2026-02-01'), performance: 60, iteration: 1 },
    { timestamp: new Date('2026-03-01'), performance: 75, iteration: 2 },
  ];
  const cgdResult = detectCompoundingGains(performanceHistory, 50);

  const confidence = assessConfidence({
    inputQuality: 'Self-Attested',
    frameworkValidation: 'Peer-Reviewed',
    industryCalibration: 'Large-Sample',
    temporalStability: 'Snapshot',
  });

  const rsiColor =
    rsiResult.tier === 'Minimal' || rsiResult.tier === 'Low' ? 'text-stable' :
    rsiResult.tier === 'Elevated' ? 'text-sensitive' : 'text-fragile';

  const mcciColor =
    mcciResult.tier === 'None' || mcciResult.tier === 'Basic' ? 'text-stable' :
    mcciResult.tier === 'Intermediate' ? 'text-sensitive' : 'text-fragile';

  if (!results) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="text-3xl mb-3">🔄</div>
        <div className="text-[13px] font-semibold">Complete Exposure Analysis first</div>
        <div className="text-[11px] mt-1">Run an analysis to unlock Recursive Risk Assessment</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-foreground tracking-tight">
          🔄 Recursive Risk Assessment
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1">
          Assess hyperagent metacognitive capabilities and recursive self-improvement risk for <span className="font-semibold text-foreground">{inputs.companyName || 'Current Entity'}</span>.
        </p>
      </div>

      {/* RSI Card */}
      <SectionDivider title="Recursive Self-Improvement Index (RSI)" icon="⚡" subtitle="Meta-modification depth, improvement velocity, and oversight capability" />

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={`text-[36px] font-bold font-mono ${rsiColor}`}>
              {rsiResult.rsi.toFixed(1)}
            </div>
            <div>
              <div className={`text-[13px] font-bold ${rsiColor}`}>{rsiResult.tier}</div>
              <div className="text-[10px] text-muted-foreground">of 100 max</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Meta-Modification Depth', value: rsiResult.metaDepth },
            { label: 'Improvement Velocity', value: rsiResult.improvementVelocity },
            { label: 'Oversight Capability', value: rsiResult.oversightCapability },
          ].map(item => (
            <div key={item.label} className="bg-secondary/30 rounded-lg px-4 py-3">
              <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</div>
              <div className="text-[18px] font-bold font-mono text-foreground mt-0.5">{item.value.toFixed(0)}</div>
            </div>
          ))}
        </div>

        {rsiResult.flags.length > 0 && (
          <div className="bg-fragile-bg border border-fragile-border rounded-lg p-4 mb-4">
            <div className="text-[11px] font-bold text-fragile mb-2">⚠️ DETECTED CAPABILITIES</div>
            <div className="space-y-1">
              {rsiResult.flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                  <span className="text-fragile">•</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="text-[11px] font-bold text-primary mb-2">GOVERNANCE RECOMMENDATIONS</div>
          <div className="space-y-1.5">
            {rsiResult.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                <span className="text-primary">→</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MCCI Card */}
      <SectionDivider title="Metacognitive Capability Index (MCCI)" icon="🧠" subtitle="Self-awareness, strategic planning, memory integration, meta-learning" />

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className={`text-[28px] font-bold font-mono ${mcciColor}`}>
            {mcciResult.mcci.toFixed(0)}
          </div>
          <div>
            <div className={`text-[13px] font-bold ${mcciColor}`}>{mcciResult.tier}</div>
            <div className="text-[10px] text-muted-foreground">Metacognitive tier</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Object.entries(mcciResult.capabilities).map(([key, value]) => (
            <div key={key} className="bg-secondary/30 rounded-lg px-3 py-2.5">
              <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-[16px] font-bold font-mono text-foreground mt-0.5">{value.toFixed(0)}</div>
            </div>
          ))}
        </div>

        {/* Capability toggles */}
        <div className="border-t border-border pt-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Capability Assessment (toggle detected capabilities)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(Object.keys(metacogCaps) as (keyof MetacognitiveCapabilities)[]).map(key => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={metacogCaps[key]}
                  onChange={() => setMetacogCaps(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="rounded border-border accent-primary w-3.5 h-3.5"
                />
                <span className="text-[11px] text-foreground/80 group-hover:text-foreground transition-colors">
                  {METACOG_LABELS[key] || key}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* CGD Alert */}
      {cgdResult.alert && (
        <>
          <SectionDivider title="Compounding Gain Detection" icon="⚡" />
          <div className="bg-sensitive-bg border border-sensitive-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-[20px]">⚡</span>
              <div>
                <div className="text-[13px] font-bold text-sensitive">COMPOUNDING GAIN DETECTED</div>
                <div className="text-[11px] text-foreground/80 mt-1">{cgdResult.alertMessage}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confidence Assessment */}
      <SectionDivider title="Assessment Confidence" icon="📊" subtitle="Input quality, framework validation, calibration coverage" />

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1 space-y-2">
            {Object.entries(confidence.breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-[12px] font-mono text-foreground">{formatStars(value)}</span>
              </div>
            ))}
          </div>
          <div className="sm:border-l sm:border-border sm:pl-5 flex flex-col items-center justify-center">
            <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mb-1">OVERALL</div>
            <div className="text-[14px] font-bold text-foreground">{confidence.overall}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-border">
          <div>
            <div className="text-[10px] font-bold text-stable mb-1.5">✓ SUITABLE FOR:</div>
            {confidence.suitableFor.map((item, i) => (
              <div key={i} className="text-[11px] text-foreground/80">• {item}</div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-bold text-fragile mb-1.5">✗ NOT SUITABLE FOR:</div>
            {confidence.notSuitableFor.map((item, i) => (
              <div key={i} className="text-[11px] text-foreground/80">• {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-[9px] text-muted-foreground/60 text-center pt-4 border-t border-border">
        Recursive risk assessment based on AGAF v4.3 methodology. Hyperagent capabilities are self-reported and should be verified through technical audit.
      </div>
    </div>
  );
}
