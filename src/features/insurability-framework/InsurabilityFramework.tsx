import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, XCircle, Shield, BookOpen } from 'lucide-react';
import { useApp } from '@/hooks/useAppState';
import { evaluateFramework } from './frameworkLogic';
import { LockedState } from '@/components/shared/UIComponents';
import type { ConditionEvaluation } from './types';

const conditionIcons: Record<string, string> = {
  Predictability: '📊',
  Controllability: '🎛️',
  Independence: '🔗',
  'Temporal Boundedness': '⏱️',
  'Accumulation Tolerance': '📐',
};

function ScoreIcon({ score }: { score: 1 | 2 | 3 }) {
  if (score === 1) return <CheckCircle2 className="w-4 h-4 text-stable flex-shrink-0" />;
  if (score === 2) return <AlertTriangle className="w-4 h-4 text-sensitive flex-shrink-0" />;
  return <XCircle className="w-4 h-4 text-fragile flex-shrink-0" />;
}

function scoreBadgeClass(score: 1 | 2 | 3) {
  if (score === 1) return 'bg-stable/15 text-stable border-stable/30';
  if (score === 2) return 'bg-sensitive/15 text-sensitive border-sensitive/30';
  return 'bg-fragile/15 text-fragile border-fragile/30';
}

function tierBorderClass(tier: 1 | 2 | 3) {
  if (tier === 1) return 'border-stable bg-stable/5';
  if (tier === 2) return 'border-sensitive bg-sensitive/5';
  return 'border-fragile bg-fragile/5';
}

function ConditionCard({ condition }: { condition: ConditionEvaluation }) {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScoreIcon score={condition.score} />
            <CardTitle className="text-[13px] font-semibold">
              {condition.condition}
            </CardTitle>
          </div>
          <Badge variant="outline" className={`text-[10px] font-bold border ${scoreBadgeClass(condition.score)}`}>
            {condition.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {condition.reasoning}
        </p>

        {condition.evidence.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Evidence</div>
            <ul className="space-y-0.5">
              {condition.evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] text-foreground">
                  <span className="text-muted-foreground mt-px">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[10px] text-primary/80 bg-primary/5 rounded px-2 py-1.5 border border-primary/10">
          <span className="font-semibold">Recommendation:</span> {condition.recommendation}
        </div>
      </CardContent>
    </Card>
  );
}

export function InsurabilityFramework() {
  const { state, setActiveStep } = useApp();
  const { inputs, results, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return (
      <LockedState
        title="Insurability Framework Locked"
        description="Complete the Exposure Analysis to evaluate the five insurability conditions."
        onAction={() => setActiveStep(1)}
        actionLabel="Go to Exposure Analysis"
      />
    );
  }

  const framework = evaluateFramework(inputs, results);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">
          Step 12 of 12 · Framework
        </div>
        <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">
          Insurability Boundary Framework
        </h1>
        <p className="text-[12px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Evaluation of five insurability conditions per Kindermann (2026). Each condition is assessed
          against the entity's structural risk profile to determine tier classification.
        </p>
      </div>

      {/* Overall Tier Assignment */}
      <Card className={`border-2 ${tierBorderClass(framework.overallTier)}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-foreground" />
              <CardTitle className="text-[14px]">Framework Classification</CardTitle>
            </div>
            <Badge
              className={`text-[11px] font-bold px-3 py-1 ${
                framework.overallTier === 1
                  ? 'bg-stable text-white'
                  : framework.overallTier === 2
                  ? 'bg-sensitive text-white'
                  : 'bg-fragile text-white'
              }`}
            >
              {framework.tierLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[12px] text-foreground leading-relaxed">{framework.summary}</p>

          {framework.criticalConditions.length > 0 && (
            <Alert variant="destructive" className="border-fragile/30 bg-fragile/5">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-[11px]">
                Critical conditions: {framework.criticalConditions.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Condition summary bar */}
          <div className="flex gap-1.5 flex-wrap">
            {framework.conditions.map((c) => (
              <div
                key={c.condition}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border ${scoreBadgeClass(c.score)}`}
              >
                <ScoreIcon score={c.score} />
                {c.condition}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Five-Condition Evaluation */}
      <div className="space-y-3">
        <h2 className="text-[13px] font-bold text-foreground">Five-Condition Evaluation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {framework.conditions.map((condition) => (
            <ConditionCard key={condition.condition} condition={condition} />
          ))}
        </div>
      </div>

      {/* Framework Reference */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="py-4 px-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <span className="font-semibold">Framework Reference:</span> Kindermann, M. (2026). 
              "The Insurability Boundary in AI Risk: A Framework for Underwriting Decisions and Capital Allocation." 
              This evaluation implements the five-condition methodology described in Section 4 of the paper. 
              Classification criteria and tier assignments follow the three-tier framework defined in Section 5.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
