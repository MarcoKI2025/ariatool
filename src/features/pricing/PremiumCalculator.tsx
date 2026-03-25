import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import {
  calculatePremium,
  generatePremiumScenarios,
  DEDUCTIBLE_OPTIONS,
  formatPremiumCurrency,
  formatPremiumPercentage,
  type PremiumCalculation,
  type PremiumScenario,
} from '@/lib/pricing';
import { computeEvolutionAnalysis } from '@/lib/evolutionEngine';

export function PremiumCalculator() {
  const { state } = useApp();
  const afi = state.results?.afi || 0;
  const industry = state.inputs.industry || 'General AI System';

  const [coverage, setCoverage] = useState(5000000);
  const [deductible, setDeductible] = useState(0);
  const [calculation, setCalculation] = useState<PremiumCalculation | null>(null);
  const [scenarios, setScenarios] = useState<PremiumScenario[]>([]);

  // Compute evolution factors for premium integration
  const evolution = useMemo(() => {
    if (!state.results) return null;
    return computeEvolutionAnalysis(state.inputs, state.results);
  }, [state.results, state.inputs]);

  const evolutionFactors = useMemo(() => {
    if (!evolution) return null;
    return { driftFactor: evolution.driftFactor, correlationMultiplier: evolution.correlationMultiplier, cascadeMultiplier: evolution.cascadeMultiplier };
  }, [evolution]);

  useEffect(() => {
    if (afi > 0) {
      const rr = state.recursiveRisk ? { rsiScore: state.recursiveRisk.rsiScore, mcciScore: state.recursiveRisk.mcciScore } : null;
      setCalculation(calculatePremium(coverage, afi, industry, deductible, rr, evolutionFactors));
      setScenarios(generatePremiumScenarios(coverage, afi, industry));
    }
  }, [coverage, afi, industry, deductible, state.recursiveRisk, evolutionFactors]);

  if (!calculation) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground text-sm">Complete exposure analysis to calculate premium.</div>
      </div>
    );
  }

  const bandLabel = afi < 0.85 ? 'Stable' : afi < 1.35 ? 'Sensitive' : 'Fragile';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-1">◈ Actuarial Pricing Engine</div>
        <div className="text-[15px] font-bold text-foreground mb-1">Premium Calculation</div>
        <div className="text-[11px] text-secondary-foreground leading-relaxed max-w-[600px]">
          Convert AFI risk assessment into indicative insurance premium using industry-standard actuarial formulas.
          Pricing reflects risk band, industry volatility, and deductible structure.
        </div>
      </div>

      {/* Coverage & Deductible Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Coverage */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Coverage Limit</div>
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2 mb-3">
            <span className="text-muted-foreground font-mono text-sm">€</span>
            <input
              type="number"
              value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              className="flex-1 text-[18px] font-bold font-mono bg-transparent border-none outline-none text-foreground w-full"
              step={100000}
              min={500000}
              max={50000000}
            />
          </div>
          <input
            type="range"
            value={coverage}
            onChange={(e) => setCoverage(Number(e.target.value))}
            min={500000}
            max={50000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            <span>€500k</span>
            <span>€50M</span>
          </div>
        </div>

        {/* Deductible */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Deductible (Retention)</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEDUCTIBLE_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => setDeductible(option.amount)}
                className={`text-left px-3 py-2 rounded-lg border transition-colors text-[12px] ${
                  deductible === option.amount
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-[9px] text-muted-foreground">
                  {option.factor < 1.0 ? `−${((1 - option.factor) * 100).toFixed(0)}%` : 'Baseline'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Result */}
      <div className={`rounded-xl p-4 sm:p-6 border-2 ${
        afi >= 1.35 ? 'bg-fragile-bg border-fragile' :
        afi >= 0.85 ? 'bg-sensitive-bg border-sensitive' :
        'bg-stable-bg border-stable'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">Recommended Annual Premium</div>
            <div className={`text-[28px] sm:text-[36px] font-extrabold font-mono leading-none ${
              afi >= 1.35 ? 'text-fragile' : afi >= 0.85 ? 'text-sensitive' : 'text-stable'
            }`}>
              {formatPremiumCurrency(calculation.annualPremium)}
            </div>
            <div className="text-[11px] text-secondary-foreground mt-2">
              {formatPremiumPercentage(calculation.premiumRate)} of coverage · AFI {calculation.afi.toFixed(2)} ({bandLabel})
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Coverage</div>
            <div className="text-[16px] font-bold font-mono text-foreground">{formatPremiumCurrency(coverage)}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">Premium Breakdown</div>
          <div className="flex justify-between text-[11px]">
            <span className="text-secondary-foreground">Base Premium ({formatPremiumPercentage(calculation.baseRate * 100)})</span>
            <span className="font-mono font-medium text-foreground">{formatPremiumCurrency(calculation.basePremium)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-secondary-foreground">AFI Adjustment ({calculation.afiMultiplier.toFixed(2)}×)</span>
            <span className={`font-mono font-medium ${calculation.afiAdjustment > 0 ? 'text-fragile' : 'text-stable'}`}>
              {calculation.afiAdjustment >= 0 ? '+' : ''}{formatPremiumCurrency(calculation.afiAdjustment)}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-secondary-foreground">Industry Factor ({calculation.volatilityFactor.toFixed(2)}×)</span>
            <span className={`font-mono font-medium ${calculation.industryAdjustment > 0 ? 'text-sensitive' : 'text-stable'}`}>
              {calculation.industryAdjustment >= 0 ? '+' : ''}{formatPremiumCurrency(calculation.industryAdjustment)}
            </span>
          </div>
          {deductible > 0 && (
            <div className="flex justify-between text-[11px]">
              <span className="text-secondary-foreground">Deductible Discount ({calculation.deductibleFactor.toFixed(2)}×)</span>
              <span className="font-mono font-medium text-stable">−{formatPremiumCurrency(calculation.deductibleDiscount)}</span>
            </div>
          )}
          {evolutionFactors && evolutionFactors.driftFactor > 1.01 && (
            <div className="flex justify-between text-[11px]">
              <span className="text-secondary-foreground">Drift Loading ({evolutionFactors.driftFactor.toFixed(2)}×)</span>
              <span className="font-mono font-medium text-sensitive">+included</span>
            </div>
          )}
          {evolutionFactors && evolutionFactors.correlationMultiplier > 1.01 && (
            <div className="flex justify-between text-[11px]">
              <span className="text-secondary-foreground">Correlation Loading ({evolutionFactors.correlationMultiplier.toFixed(2)}×)</span>
              <span className="font-mono font-medium text-sensitive">+included</span>
            </div>
          )}
          {evolutionFactors && evolutionFactors.cascadeMultiplier > 1.01 && (
            <div className="flex justify-between text-[11px]">
              <span className="text-secondary-foreground">Cascade Loading ({evolutionFactors.cascadeMultiplier.toFixed(2)}×)</span>
              <span className="font-mono font-medium text-sensitive">+included</span>
            </div>
          )}
        </div>
      </div>

      {/* Coverage Decision from Evolution Engine */}
      {evolution && (
        <div className={`rounded-xl p-4 border-2 ${
          evolution.coverageDecision.decision === 'Decline' ? 'bg-fragile-bg border-fragile' :
          evolution.coverageDecision.decision === 'Limited Coverage' ? 'bg-fragile-bg border-fragile' :
          evolution.coverageDecision.decision === 'Accept with Conditions' ? 'bg-sensitive-bg border-sensitive' :
          'bg-stable-bg border-stable'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-1">Coverage Decision</div>
              <div className={`text-[18px] font-extrabold ${
                evolution.coverageDecision.decision === 'Decline' ? 'text-fragile' :
                evolution.coverageDecision.decision === 'Limited Coverage' ? 'text-fragile' :
                evolution.coverageDecision.decision === 'Accept with Conditions' ? 'text-sensitive' :
                'text-stable'
              }`}>{evolution.coverageDecision.decision}</div>
              {evolution.coverageDecision.maxTenor && (
                <div className="text-[10px] text-muted-foreground mt-1">Maximum policy tenor: {evolution.coverageDecision.maxTenor} months</div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Insurability</div>
              <div className={`text-[14px] font-bold ${
                evolution.insurabilityStatus === 'Uninsurable' || evolution.insurabilityStatus === 'Critical' ? 'text-fragile' :
                evolution.insurabilityStatus === 'At Risk' ? 'text-sensitive' : 'text-stable'
              }`}>{evolution.insurabilityStatus}</div>
            </div>
          </div>
          {evolution.coverageDecision.conditions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Conditions</div>
              {evolution.coverageDecision.conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-[8px] mt-[2px] flex-shrink-0 ${c.priority === 'required' ? 'text-fragile' : 'text-muted-foreground'}`}>
                    {c.priority === 'required' ? '⊘' : '▸'}
                  </span>
                  <span className="text-[10px] text-secondary-foreground leading-[1.4]">
                    {c.action}
                    {c.priority === 'required' && <span className="text-fragile font-bold ml-1 text-[8px]">REQUIRED</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cost of Fragility */}
      {calculation.costOfFragility > 0 && (
        <div className="bg-fragile-bg border border-fragile-border rounded-xl p-4 flex items-start gap-3">
          <span className="text-fragile text-lg flex-shrink-0">⚠</span>
          <div>
            <div className="text-[11px] font-bold text-fragile mb-1">Cost of High AFI Score</div>
            <div className="text-[11px] text-secondary-foreground leading-relaxed">
              Your {bandLabel} risk classification adds <strong className="text-fragile">{formatPremiumCurrency(calculation.costOfFragility)}</strong> to
              annual premium compared to baseline. Improving governance to reduce AFI could generate significant savings.
            </div>
            <div className="text-[10px] text-primary mt-2 font-medium">💡 Invest in governance improvements to reduce premium long-term</div>
          </div>
        </div>
      )}

      {/* Scenarios */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Alternative Premium Scenarios</div>
        <div className="space-y-2">
          {scenarios.map((scenario, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
              i === 0 ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/20'
            }`}>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-foreground">{scenario.name}</div>
                <div className="text-[10px] text-muted-foreground">{scenario.description}</div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <div className="text-[14px] font-bold font-mono text-foreground">{formatPremiumCurrency(scenario.premium)}</div>
                {scenario.savings !== undefined && scenario.savings > 0 && (
                  <div className="text-[9px] font-bold text-stable">Save {formatPremiumCurrency(scenario.savings)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Return on Investment Analysis</div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Annual Premium', value: formatPremiumCurrency(calculation.annualPremium) },
            { label: 'Coverage Protected', value: formatPremiumCurrency(coverage) },
            { label: 'Protection Ratio', value: `${(coverage / calculation.annualPremium).toFixed(1)}:1` },
          ].map((m, i) => (
            <div key={i} className="p-3 bg-secondary/30 border border-border rounded-lg text-center">
              <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
              <div className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground">{m.value}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground leading-relaxed">
          For every €1 in premium, you protect €{(coverage / calculation.annualPremium).toFixed(0)} in potential AI-related losses.
          Coverage includes model failures, governance breaches, regulatory fines, and third-party liability.
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-secondary/30 border border-border rounded-xl p-4 flex items-start gap-3">
        <span className="text-muted-foreground text-sm flex-shrink-0">ℹ️</span>
        <div className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-secondary-foreground">Pricing Methodology:</strong> Premiums calculated using industry-standard actuarial formulas.
          Base rates derived from historical loss ratios ({formatPremiumPercentage(calculation.baseRate * 100)} for {industry}).
          AFI multiplier reflects governance risk ({calculation.afiMultiplier.toFixed(2)}×). Deductible reduces premium via first-loss retention.
          Final pricing is indicative and subject to underwriter approval. Values may vary based on entity-specific factors.
        </div>
      </div>
    </div>
  );
}
