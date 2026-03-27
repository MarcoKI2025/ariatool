import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import {
  calculateRSI,
  calculateMCCI,
  detectCompoundingGains,
  assessConfidence,
  type RecursiveRiskFactors,
  type MetacognitiveCapabilities,
  type PerformanceDataPoint,
} from '@/lib/recursive-risk';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StepNavigation } from '@/components/shared/StepNavigation';

export function RecursiveRiskView() {
  const { state, updateRecursiveRisk } = useApp();
  const { inputs, results } = state;
  const [showDetail, setShowDetail] = useState(false);

  const rsiFactors = useMemo<RecursiveRiskFactors>(() => ({
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
  }), [inputs.automation, inputs.explainabilityGap, inputs.reviewCadence]);

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

  // Simulate performance trajectory based on automation and adaptation speed
  const basePerf = 50;
  const adaptRate = inputs.automation >= 4 ? 15 : inputs.automation >= 3 ? 10 : 5;
  const performanceHistory: PerformanceDataPoint[] = [
    { timestamp: new Date('2026-01-01'), performance: basePerf, iteration: 0 },
    { timestamp: new Date('2026-02-01'), performance: basePerf + adaptRate, iteration: 1 },
    { timestamp: new Date('2026-03-01'), performance: basePerf + adaptRate * 2 + (inputs.persistentMemory >= 3 ? 5 : 0), iteration: 2 },
  ];
  const cgdResult = detectCompoundingGains(performanceHistory, basePerf);

  useEffect(() => {
    updateRecursiveRisk({
      rsiScore: rsiResult.rsi,
      rsiTier: rsiResult.tier,
      mcciScore: mcciResult.mcci,
      mcciTier: mcciResult.tier,
      metaDepth: rsiResult.metaDepth,
      improvementVelocity: rsiResult.improvementVelocity,
      oversightCapability: rsiResult.oversightCapability,
      cgdAlert: cgdResult.alert,
      cgdGrowthRate: cgdResult.growthRate,
    });
  }, [rsiResult.rsi, mcciResult.mcci, cgdResult.alert]);

  const confidence = useMemo(() => {
    // Input Quality: derived from how many sliders user has actively adjusted (non-default)
    const filledInputs = [
      inputs.automation, inputs.integrationDepth, inputs.oversightLevel,
      inputs.explainabilityGap, inputs.reviewCadence
    ].filter(v => v !== undefined && v !== 3).length;
    const inputQuality = filledInputs >= 4 ? 'Verified' as const : filledInputs >= 2 ? 'Audited' as const : 'Self-Attested' as const;

    // Framework Validation: based on oversight & review cadence
    const oversightScore = (inputs.oversightLevel || 3) + (inputs.reviewCadence || 2);
    const frameworkValidation = oversightScore >= 8 ? 'Regulatory-Approved' as const : oversightScore >= 5 ? 'Peer-Reviewed' as const : 'Internal-Only' as const;

    // Industry Calibration: based on whether industry & size are set (non-generic)
    const hasIndustry = inputs.industry && inputs.industry !== 'Technology';
    const hasSize = inputs.size && inputs.size !== 'Mid-Market (201–1000)';
    const industryCalibration = (hasIndustry && hasSize) ? 'Large-Sample' as const : hasIndustry || hasSize ? 'Small-Sample' as const : 'No-Calibration' as const;

    // Temporal Stability: based on MCCI capabilities & persistent memory
    const activeCaps = Object.values(metacogCaps).filter(Boolean).length;
    const temporalStability = activeCaps >= 8 ? 'Continuous' as const : activeCaps >= 4 ? 'Quarterly' as const : 'Snapshot' as const;

    return assessConfidence({ inputQuality, frameworkValidation, industryCalibration, temporalStability });
  }, [inputs, metacogCaps]);

  // Determine overall severity
  const isCritical = rsiResult.tier === 'Critical' || rsiResult.tier === 'High';
  const isElevated = rsiResult.tier === 'Elevated';
  const severityColor = isCritical ? 'text-fragile' : isElevated ? 'text-sensitive' : 'text-stable';
  const severityBg = isCritical ? 'bg-fragile-bg border-fragile-border' : isElevated ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  // Core risk statement
  const riskStatement = isCritical
    ? 'System exhibits uncontrolled self-improvement behavior beyond governance limits.'
    : isElevated
    ? 'Self-improvement capabilities are emerging — governance must scale to match.'
    : 'Self-improvement risk is within controllable bounds.';

  // Metric interpretations
  const metrics = [
    {
      label: 'Improvement Velocity',
      value: rsiResult.improvementVelocity,
      level: rsiResult.improvementVelocity > 70 ? 'Critical' : rsiResult.improvementVelocity > 40 ? 'Elevated' : 'Low',
      meaning: rsiResult.improvementVelocity > 70
        ? 'System evolves faster than governance can adapt'
        : rsiResult.improvementVelocity > 40
        ? 'Performance gains are accelerating — monitoring required'
        : 'Improvement rate is manageable within current oversight',
      question: 'Can the system escape control through rapid evolution?',
    },
    {
      label: 'Oversight Capability',
      value: rsiResult.oversightCapability,
      level: rsiResult.oversightCapability < 40 ? 'Critical' : rsiResult.oversightCapability < 65 ? 'Elevated' : 'Adequate',
      meaning: rsiResult.oversightCapability < 40
        ? 'Human oversight is structurally insufficient to track system changes'
        : rsiResult.oversightCapability < 65
        ? 'Oversight gaps exist — audit cadence should increase'
        : 'Oversight mechanisms are aligned with system complexity',
      question: 'Can humans intervene effectively when needed?',
      inverted: true,
    },
    {
      label: 'Self-Modification Depth',
      value: rsiResult.metaDepth,
      level: rsiResult.metaDepth > 60 ? 'Critical' : rsiResult.metaDepth > 35 ? 'Elevated' : 'Low',
      meaning: rsiResult.metaDepth > 60
        ? 'System can modify its own code, prompts, and success criteria autonomously'
        : rsiResult.metaDepth > 35
        ? 'Limited self-modification detected — bounded to specific subsystems'
        : 'No meaningful self-modification capability detected',
      question: 'Can it change its own behavior without authorization?',
    },
  ];

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
        <div className="label-xs mb-1">Step 10 of 11 · Advanced</div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Recursive Risk Assessment
        </h1>
        <p className="text-[12px] text-muted-foreground mt-1">
          Self-improvement risk analysis for <span className="font-semibold text-foreground">{inputs.companyName || 'Current Entity'}</span>
        </p>
      </div>

      {/* Risk Statement */}
      <div className={`rounded-lg border p-5 ${severityBg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
            {rsiResult.tier.toUpperCase()}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground">
              RSI <span className={`font-bold metric-value ${severityColor}`}>{rsiResult.rsi.toFixed(0)}</span>/100
            </span>
            <span className="text-[10px] text-muted-foreground">
              MCCI <span className="font-bold metric-value text-foreground">{mcciResult.mcci.toFixed(0)}</span>
            </span>
          </div>
        </div>
        <div className={`text-[15px] sm:text-[17px] font-bold leading-[1.35] tracking-tight ${severityColor}`}>
          {riskStatement}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 2–4: 3 METRIC CARDS WITH INTERPRETATION
          ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Why This Assessment</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const mColor = m.level === 'Critical' ? 'text-fragile' : m.level === 'Elevated' ? 'text-sensitive' : 'text-stable';
          const mBg = m.level === 'Critical' ? 'bg-fragile-bg border-fragile-border' : m.level === 'Elevated' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';
          const barPct = m.inverted ? (100 - m.value) : m.value;
          const barColor = m.level === 'Critical' ? 'bg-fragile' : m.level === 'Elevated' ? 'bg-sensitive' : 'bg-stable';

          return (
            <div key={m.label} className={`rounded-xl border p-5 ${mBg}`}>
              {/* Level badge + label */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">{m.label}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mColor}`}>{m.level}</span>
              </div>

              {/* Visual indicator */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, barPct)}%` }} />
                </div>
                <span className={`text-[12px] font-mono font-bold ${mColor}`}>{m.value.toFixed(0)}</span>
              </div>

              {/* Interpretation */}
              <div className="text-[11px] text-foreground font-medium leading-relaxed mb-3">
                {m.meaning}
              </div>

              {/* Why it matters */}
              <div className="border-t border-border/50 pt-2.5">
                <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-1">Why This Matters</div>
                <div className="text-[10px] text-muted-foreground italic">{m.question}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          STEP 6: CRITICAL WARNING BOX
          ══════════════════════════════════════════════════ */}
      {isCritical && (
        <div className="bg-fragile-bg border-2 border-fragile rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-[18px]">⛔</span>
            <div>
              <div className="text-[13px] font-extrabold text-fragile mb-1">Unbounded Self-Improvement Warning</div>
              <div className="text-[12px] text-foreground font-medium leading-relaxed">
                Unbounded self-improvement may invalidate traditional risk controls. Standard actuarial models do not account for recursive capability acceleration.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CGD Alert */}
      {cgdResult.alert && (
        <div className="bg-sensitive-bg border border-sensitive-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-[18px]">⚡</span>
            <div>
              <div className="text-[13px] font-bold text-sensitive">Compounding Gain Detected</div>
              <div className="text-[11px] text-foreground/80 mt-1">{cgdResult.alertMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Detected flags summary */}
      {rsiResult.flags.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-3">Detected Capabilities</div>
          <div className="space-y-2">
            {rsiResult.flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                <span className="text-fragile mt-0.5">⚠</span>
                <span className="font-medium">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          COLLAPSED DETAIL: MCCI toggles, confidence, etc.
          ══════════════════════════════════════════════════ */}
      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground">
              {showDetail ? '▾ Hide Detailed Assessment' : '▸ View Detailed Assessment'}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">

          {/* MCCI Capability Toggles */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Metacognitive Capability Index (MCCI)</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Toggle detected capabilities to update the assessment</div>
              </div>
              <div className="text-right">
                <div className={`text-[22px] font-bold font-mono ${mcciResult.tier === 'Advanced' || mcciResult.tier === 'Autonomous' ? 'text-fragile' : mcciResult.tier === 'Intermediate' ? 'text-sensitive' : 'text-stable'}`}>{mcciResult.mcci.toFixed(0)}</div>
                <div className="text-[9px] text-muted-foreground">{mcciResult.tier}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {Object.entries(mcciResult.capabilities).map(([key, value]) => (
                <div key={key} className="bg-secondary/30 rounded-lg px-3 py-2.5 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-[16px] font-bold font-mono text-foreground mt-0.5">{value.toFixed(0)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
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
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Assessment Confidence</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {Object.entries(confidence.breakdown).map(([key, value]) => (
                <div key={key} className="bg-secondary/30 rounded-lg px-3 py-2.5 text-center">
                  <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-[14px] font-bold text-foreground mt-0.5">{'★'.repeat(value)}{'☆'.repeat(5 - value)}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground text-center">
              Overall: <span className="font-bold text-foreground">{confidence.overall}</span>
            </div>
          </div>

          {/* Governance Recommendations */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Governance Recommendations</div>
            <div className="space-y-2">
              {rsiResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                  <span className="text-primary mt-0.5">→</span>
                  <span className="font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </CollapsibleContent>
      </Collapsible>

      {/* Disclaimer */}
      <div className="text-[9px] text-muted-foreground/60 text-center pt-4 border-t border-border">
        Recursive risk assessment based on AGAF v4.3.0. Hyperagent capabilities are self-reported and should be verified through technical audit.
      </div>

      <StepNavigation currentStep={10} />
    </div>
  );
}
