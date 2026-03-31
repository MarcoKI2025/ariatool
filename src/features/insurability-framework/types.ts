export interface ConditionEvaluation {
  condition: 'Predictability' | 'Controllability' | 'Independence' | 
             'Temporal Boundedness' | 'Accumulation Tolerance';
  score: 1 | 2 | 3;
  label: 'Strong' | 'Moderate' | 'Challenged';
  evidence: string[];
  reasoning: string;
  recommendation: string;
}

export interface FrameworkResult {
  conditions: ConditionEvaluation[];
  overallTier: 1 | 2 | 3;
  tierLabel: 'Tier 1: Insurable' | 'Tier 2: Conditionally Insurable' | 'Tier 3: Beyond Standard Transfer';
  criticalConditions: string[];
  summary: string;
}
