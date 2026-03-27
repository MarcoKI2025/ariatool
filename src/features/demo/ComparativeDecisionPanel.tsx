import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, TrendingUp, Shield } from 'lucide-react';
import { PortfolioEntity } from '@/lib/portfolioImpact';

interface ComparativeDecisionProps {
  entity: PortfolioEntity;
  ariaDecision: 'Accept' | 'Conditional' | 'Decline';
  ariaReasoning: string[];
  ariaAFI: number;
  ariaBand: string;
  rsiScore?: number;
  tailRisk: number;
  premium: number;
}

export function ComparativeDecisionPanel({
  entity,
  ariaDecision,
  ariaReasoning,
  ariaAFI,
  ariaBand,
  rsiScore,
  tailRisk,
  premium,
}: ComparativeDecisionProps) {

  const traditionalDecision = useMemo(() => {
    const inputs = entity.inputs;
    // Traditional underwriting: surface-level checks
    const lowAutonomy = inputs.automation <= 3;
    const hasOversight = inputs.oversightLevel >= 3;
    const isStandardIndustry = ['Financial Services', 'Insurance', 'Technology'].includes(inputs.industry);

    if (lowAutonomy || (hasOversight && isStandardIndustry)) {
      return {
        decision: 'Accept' as const,
        premium: `€${Math.round(premium * 0.7).toLocaleString()}`,
        reasoning: [
          'EU AI Act compliance indicators present',
          'Revenue scale supports standard E&O premium',
          `${inputs.industry} risk class applicable`,
          'No obvious red flags in submitted documentation',
        ],
        confidence: 'Standard underwriting tolerance',
      };
    }
    return {
      decision: 'Conditional' as const,
      premium: `€${Math.round(premium * 0.85).toLocaleString()}`,
      reasoning: [
        'Additional compliance verification required',
        'Conditional on governance documentation',
        'May require premium loading',
      ],
      confidence: 'Requires review',
    };
  }, [entity, premium]);

  const riskReturnRatio = tailRisk / (premium / 1_000_000);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Underwriting Decision Comparison
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Traditional point-in-time evaluation vs.&nbsp;ARIA structural risk assessment for <span className="font-medium text-foreground">{entity.name}</span>
        </p>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* TRADITIONAL */}
        <Card className="border border-stable-border bg-stable-bg/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Traditional Underwriting</span>
            <Badge variant="outline" className="text-[10px] border-stable text-stable gap-1">
              {traditionalDecision.decision === 'Accept' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {traditionalDecision.decision}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-[9px]">Point-in-Time</Badge>

          <div className="space-y-2 pt-1">
            <div>
              <span className="text-[10px] text-muted-foreground">Premium Quote</span>
              <p className="text-lg font-semibold font-mono text-foreground">{traditionalDecision.premium}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">Reasoning</span>
              <ul className="mt-1 space-y-1">
                {traditionalDecision.reasoning.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-stable">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
            Approach: Compliance-focused, revenue-scaled, historical loss ratios
          </p>
        </Card>

        {/* ARIA */}
        <Card className={`border p-4 space-y-3 ${
          ariaDecision === 'Decline'
            ? 'border-fragile-border bg-fragile-bg/30'
            : ariaDecision === 'Conditional'
              ? 'border-sensitive-border bg-sensitive-bg/30'
              : 'border-stable-border bg-stable-bg/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">ARIA Assessment</span>
            <Badge variant="outline" className={`text-[10px] gap-1 ${
              ariaDecision === 'Decline'
                ? 'border-fragile text-fragile'
                : ariaDecision === 'Conditional'
                  ? 'border-sensitive text-sensitive'
                  : 'border-stable text-stable'
            }`}>
              {ariaDecision === 'Decline' ? <XCircle size={12} /> : ariaDecision === 'Conditional' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
              {ariaDecision}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-[9px]">Structural Analysis</Badge>

          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted-foreground">AFI Score</span>
                <p className="text-lg font-semibold font-mono text-foreground">{ariaAFI.toFixed(2)}</p>
                <span className="text-[10px] text-muted-foreground">{ariaBand} Band</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Tail Risk</span>
                <p className="text-lg font-semibold font-mono text-fragile">€{tailRisk.toFixed(1)}M</p>
                <span className="text-[10px] text-muted-foreground">1-in-20 scenario</span>
              </div>
            </div>

            {rsiScore !== undefined && rsiScore > 7 && (
              <div className="bg-fragile-bg border border-fragile-border rounded-md p-2">
                <div className="flex items-center gap-1.5 text-fragile text-xs font-medium">
                  <AlertCircle size={13} />
                  High RSI Detected
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  RSI Score: {rsiScore.toFixed(1)}/10 — Recursive improvement without adequate oversight
                </p>
              </div>
            )}

            <div>
              <span className="text-[10px] text-muted-foreground">Key Findings</span>
              <ul className="mt-1 space-y-1">
                {ariaReasoning.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-fragile">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
            Approach: Structural dependency analysis, recursive risk detection, portfolio impact
          </p>
        </Card>
      </div>

      {/* RISK-RETURN ANALYSIS */}
      <Card className="border border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Risk-Return Analysis</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] text-muted-foreground">Premium Income</span>
            <p className="text-base font-semibold font-mono text-foreground">€{Math.round(premium / 1000)}K</p>
            <span className="text-[9px] text-muted-foreground">Annual</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">Tail Risk Exposure</span>
            <p className="text-base font-semibold font-mono text-fragile">€{tailRisk.toFixed(1)}M</p>
            <span className="text-[9px] text-muted-foreground">1-in-20 scenario</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">Risk / Return Ratio</span>
            <p className={`text-base font-semibold font-mono ${
              riskReturnRatio > 100 ? 'text-fragile' : riskReturnRatio > 50 ? 'text-sensitive' : 'text-stable'
            }`}>
              {riskReturnRatio.toFixed(0)}:1
            </p>
            <span className="text-[9px] text-muted-foreground">
              {riskReturnRatio > 100 ? 'Unjustifiable' : riskReturnRatio > 50 ? 'Elevated' : 'Acceptable'}
            </span>
          </div>
        </div>

        {ariaDecision === 'Decline' && traditionalDecision.decision === 'Accept' && (
          <div className="bg-fragile-bg border border-fragile-border rounded-md p-3 space-y-1">
            <span className="text-xs font-semibold text-fragile">Critical Divergence</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Traditional underwriting would accept this risk at {traditionalDecision.premium} premium,
              but ARIA identifies €{tailRisk.toFixed(1)}M tail exposure that cannot be adequately priced.
              The structural dependency on autonomous decision-making creates portfolio-level
              correlation risk that traditional models do not capture.
            </p>
          </div>
        )}
      </Card>

      {/* VALUE PROPOSITION */}
      <Card className="border border-primary/20 bg-primary/5 p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">The €{Math.round(tailRisk)}M Question</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Without ARIA:</span> Portfolio accepts €{Math.round(premium / 1000)}K premium, exposes €{tailRisk.toFixed(1)}M tail risk.
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">With ARIA:</span> Structural risk identified before policy issuance. Capital protected. Portfolio correlation maintained within tolerance.
        </p>
      </Card>
    </div>
  );
}
