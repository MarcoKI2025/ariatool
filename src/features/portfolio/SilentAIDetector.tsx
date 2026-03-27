import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BookSize = 'Small' | 'Medium' | 'Large' | 'Enterprise';

const BOOK_SIZE_FACTOR: Record<BookSize, number> = { Small: 0.7, Medium: 1.0, Large: 1.3, Enterprise: 1.6 };

function levelColor(score: number): string {
  if (score >= 75) return 'text-fragile';
  if (score >= 50) return 'text-sensitive';
  if (score >= 25) return 'text-sensitive';
  return 'text-stable';
}
function levelBg(score: number): string {
  if (score >= 75) return 'bg-fragile-bg border-fragile-border';
  if (score >= 50) return 'bg-sensitive-bg border-sensitive-border';
  if (score >= 25) return 'bg-sensitive-bg border-sensitive-border';
  return 'bg-stable-bg border-stable-border';
}
function barColor(score: number): string {
  if (score >= 75) return 'bg-fragile';
  if (score >= 50) return 'bg-sensitive';
  if (score >= 25) return 'bg-sensitive';
  return 'bg-stable';
}

export function SilentAIDetector() {
  const [cyberBook, setCyberBook] = useState<BookSize>('Medium');
  const [eoBook, setEoBook] = useState<BookSize>('Medium');
  const [aiPenetration, setAiPenetration] = useState(30);
  const [avgIntegration, setAvgIntegration] = useState(2);
  const [hasExclusions, setHasExclusions] = useState(false);
  const [hasUWQuestions, setHasUWQuestions] = useState(false);

  const result = useMemo(() => {
    const bookSizeFactor = Math.max(BOOK_SIZE_FACTOR[cyberBook], BOOK_SIZE_FACTOR[eoBook]);
    const base = (aiPenetration / 100) * 40 + (avgIntegration / 5) * 30;
    const adjustments = (hasExclusions ? -15 : 0) + (hasUWQuestions ? -10 : 0);
    const ses_silent = Math.min(100, Math.max(0, Math.round((base + adjustments) * bookSizeFactor)));
    const unpricedPct = Math.round(aiPenetration * (hasExclusions ? 0.3 : 0.8));

    let tier: string, recommendation: string;
    if (ses_silent < 25) {
      tier = 'Monitor';
      recommendation = 'Monitor — AI penetration within manageable bounds';
    } else if (ses_silent < 50) {
      tier = 'Review';
      recommendation = 'Review — Consider explicit AI questionnaire in next renewal cycle';
    } else if (ses_silent < 75) {
      tier = 'Audit Required';
      recommendation = 'Audit Required — Silent accumulation likely material';
    } else {
      tier = 'Immediate Action';
      recommendation = 'Immediate Action — Portfolio audit and exclusion review recommended';
    }

    return { ses_silent, unpricedPct, tier, recommendation };
  }, [cyberBook, eoBook, aiPenetration, avgIntegration, hasExclusions, hasUWQuestions]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className={`rounded-xl border-2 p-6 ${levelBg(result.ses_silent)}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Silent Exposure Score:</span>
          <span className={`text-[14px] font-extrabold ${levelColor(result.ses_silent)}`}>{result.tier.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <span className={`text-[36px] font-extrabold font-mono ${levelColor(result.ses_silent)}`}>{result.ses_silent}</span>
          <div className="flex-1">
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${barColor(result.ses_silent)}`} style={{ width: `${result.ses_silent}%` }} />
            </div>
          </div>
        </div>
        <div className="text-[12px] text-foreground font-medium">{result.recommendation}</div>
        <div className="text-[11px] text-muted-foreground mt-2">
          Estimated <strong className="text-foreground">{result.unpricedPct}%</strong> of book with unpriced AI exposure
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2 block">Cyber / Tech E&O Book Size</label>
            <Select value={cyberBook} onValueChange={(v) => setCyberBook(v as BookSize)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['Small', 'Medium', 'Large', 'Enterprise'] as BookSize[]).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2 block">E&O / Professional Liability Book Size</label>
            <Select value={eoBook} onValueChange={(v) => setEoBook(v as BookSize)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['Small', 'Medium', 'Large', 'Enterprise'] as BookSize[]).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2 block">% of Insureds Likely Using AI: {aiPenetration}%</label>
            <Slider value={[aiPenetration]} onValueChange={([v]) => setAiPenetration(v)} min={0} max={100} step={10} />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2 block">Average AI Integration Depth: {avgIntegration}/5</label>
            <Slider value={[avgIntegration]} onValueChange={([v]) => setAvgIntegration(v)} min={1} max={5} step={1} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <label className="text-[11px] font-medium text-foreground">Explicit AI Exclusions in Place</label>
            <Switch checked={hasExclusions} onCheckedChange={setHasExclusions} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <label className="text-[11px] font-medium text-foreground">AI-Specific Underwriting Questions Asked</label>
            <Switch checked={hasUWQuestions} onCheckedChange={setHasUWQuestions} />
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r border-b border-border bg-sensitive-bg">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-sensitive mb-2">What's Covered Implicitly</div>
            <ul className="text-[11px] text-foreground space-y-1.5">
              <li>• AI-driven decision errors (under E&O)</li>
              <li>• AI data breach (under Cyber)</li>
              <li>• AI system outage (under BI)</li>
              <li>• Algorithmic discrimination claims (under PI)</li>
            </ul>
          </div>
          <div className="p-4 border-b border-border bg-fragile-bg">
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-fragile mb-2">Should Be Excluded or Repriced</div>
            <ul className="text-[11px] text-foreground space-y-1.5">
              <li>• Hallucination-driven financial losses</li>
              <li>• AI model drift causing systematic errors</li>
              <li>• Autonomous operations without oversight</li>
              <li>• Correlated AI provider failure cascades</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground text-center">
        This is a qualitative heuristic signal for portfolio review. It does not represent actual policy analysis.
      </div>
    </div>
  );
}
