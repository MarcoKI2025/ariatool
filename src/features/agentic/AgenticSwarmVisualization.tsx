import React, { useState, useMemo } from 'react';
import { BetaBanner } from '@/components/shared/BetaBanner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DISCLAIMER = 'BETA – Illustrative visualization only. Not calibrated to claims data.';

export function AgenticSwarmVisualization({ agri }: { agri: number }) {
  const [delegationDepth, setDelegationDepth] = useState(3);

  const nodes = useMemo(() => {
    const result = [];
    for (let i = 0; i <= Math.min(delegationDepth, 10); i++) {
      result.push({
        level: i,
        label: i === 0 ? 'Primary AI' : `Sub-Agent ${i}`,
        risk: i === 0 ? 'Origin' : i <= 2 ? 'Delegated' : i <= 5 ? 'Deep Delegation' : 'Extreme Depth',
        color: i === 0 ? 'bg-primary' : i <= 2 ? 'bg-sensitive' : 'bg-fragile',
        borderColor: i === 0 ? 'border-primary' : i <= 2 ? 'border-sensitive' : 'border-fragile',
      });
    }
    return result;
  }, [delegationDepth]);

  const agriCritical = agri >= 75;

  return (
    <div className="bg-card border border-sensitive rounded-xl p-5 mb-4 relative">
      {/* BETA badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-[9px] font-bold tracking-wider uppercase bg-sensitive-bg text-sensitive border border-sensitive-border rounded">BETA</span>
      </div>

      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">
        ⚡ Agentic Swarm &amp; Delegation Depth — Experimental Module
      </div>
      <div className="text-[14px] font-bold text-foreground mb-3">Multi-Agent Delegation Chain Visualization</div>

      <BetaBanner text={DISCLAIMER} />

      {/* Delegation Depth Slider */}
      <TooltipProvider>
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[11px] font-medium text-foreground cursor-help">Delegation Depth</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[10px] max-w-[200px]">{DISCLAIMER}</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-[10px] font-mono font-bold text-primary">{delegationDepth} layers</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={delegationDepth} onChange={e => setDelegationDepth(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-muted-foreground">1 layer</span>
            <span className="text-[8px] text-muted-foreground">10 layers</span>
          </div>
        </div>
      </TooltipProvider>

      {/* Node visualization */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2 mb-4">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <div className="text-center px-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-1 text-[10px] font-bold text-foreground ${node.color} ${node.borderColor}`}>
                {i === 0 ? '🤖' : `A${i}`}
              </div>
              <div className="text-[8px] font-bold text-muted-foreground truncate max-w-[60px]">{node.label}</div>
              <div className={`text-[7px] ${i <= 2 ? 'text-sensitive' : 'text-fragile'}`}>{node.risk}</div>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-muted-foreground text-[10px] mx-0.5 flex-shrink-0">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Warning text */}
      <div className="text-[11px] text-secondary-foreground leading-[1.55] mb-3">
        Higher delegation depth increases responsibility fragmentation and potential cascade risk. Each additional layer reduces traceability and accountability attribution.
      </div>

      {/* AGRI threshold warning */}
      {agriCritical && (
        <div className="p-3 bg-fragile-bg border border-fragile-border rounded-lg flex items-start gap-2">
          <span className="text-fragile text-sm flex-shrink-0">🔴</span>
          <div>
            <div className="text-[11px] font-bold text-fragile">Critical Agentic Risk — requires named human oversight</div>
            <div className="text-[10px] text-fragile/80 mt-1">AGRI score of {agri} exceeds the 75-point threshold. A named human with stop authority must be designated for this deployment.</div>
          </div>
        </div>
      )}

      <div className="mt-3 text-[9px] text-muted-foreground leading-[1.5] italic">
        Illustrative visualization only. Actual delegation structures may differ.
      </div>
    </div>
  );
}
