import React from 'react';
import type { Band, AFIComponents } from '@/lib/types';

interface Props {
  band: Band;
  components: AFIComponents;
  agri: number;
  humanCheckpoints: number;
  oversightLevel: number;
  multiAgent: number;
}

type AccountabilityStatus = 'CLEARLY ASSIGNED' | 'FRAGMENTED' | 'NO ACCOUNTABLE ENTITY';

function deriveAccountability(
  components: AFIComponents,
  agri: number,
  humanCheckpoints: number,
  oversightLevel: number,
  multiAgent: number
): AccountabilityStatus {
  const oversightNorm = oversightLevel / 5;
  const checkpointNorm = humanCheckpoints / 5;
  const drHigh = components.dr > 0.55;
  const jdLow = components.jd < 0.4;
  const multiAgentHigh = multiAgent >= 4;

  if (drHigh && jdLow && (agri >= 55 || multiAgentHigh) && oversightNorm < 0.4) {
    return 'NO ACCOUNTABLE ENTITY';
  }
  if (drHigh || jdLow || agri >= 35 || oversightNorm < 0.5 || checkpointNorm < 0.4) {
    return 'FRAGMENTED';
  }
  return 'CLEARLY ASSIGNED';
}

function getStewardshipClarity(components: AFIComponents, oversightLevel: number): 'high' | 'medium' | 'low' {
  const score = components.jd * 0.4 + (oversightLevel / 5) * 0.3 + (1 - components.dr) * 0.3;
  if (score >= 0.6) return 'high';
  if (score >= 0.35) return 'medium';
  return 'low';
}

function getFragmentationScore(components: AFIComponents, agri: number): number {
  return Math.round(Math.min(99, (components.dr * 40 + (1 - components.jd) * 30 + agri * 0.3)));
}

const STATUS_CONFIG: Record<AccountabilityStatus, { color: string; bg: string; border: string; icon: string }> = {
  'CLEARLY ASSIGNED': { color: 'text-stable', bg: 'bg-stable-bg', border: 'border-stable', icon: '✓' },
  'FRAGMENTED': { color: 'text-sensitive', bg: 'bg-sensitive-bg', border: 'border-sensitive', icon: '⚠' },
  'NO ACCOUNTABLE ENTITY': { color: 'text-fragile', bg: 'bg-fragile-bg', border: 'border-fragile', icon: '⛔' },
};

export function ResponsibilityCollapseDetector({ band, components, agri, humanCheckpoints, oversightLevel, multiAgent }: Props) {
  const status = deriveAccountability(components, agri, humanCheckpoints, oversightLevel, multiAgent);
  const config = STATUS_CONFIG[status];
  const stewardship = getStewardshipClarity(components, oversightLevel);
  const fragmentation = getFragmentationScore(components, agri);

  const stewardshipColor = stewardship === 'high' ? 'text-stable' : stewardship === 'medium' ? 'text-sensitive' : 'text-fragile';

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px]">🔍</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
            Governance Structure Analysis
          </div>
          <div className="text-[15px] font-bold text-foreground">Accountability & Responsibility Structure</div>
        </div>
      </div>

      {/* Primary Status */}
      <div className={`rounded-xl p-4 border-2 ${config.border} ${config.bg} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Accountability Status
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
            status === 'CLEARLY ASSIGNED' ? 'bg-stable text-white' :
            status === 'FRAGMENTED' ? 'bg-sensitive text-white' :
            'bg-fragile text-white'
          }`}>
            {config.icon} {status}
          </span>
        </div>
        <div className={`text-[14px] font-bold leading-[1.4] ${config.color}`}>
          {status === 'CLEARLY ASSIGNED' && 'Responsibility appears clearly assigned and traceable.'}
          {status === 'FRAGMENTED' && 'Responsibility appears distributed across multiple system layers, which may complicate accountability in failure scenarios.'}
          {status === 'NO ACCOUNTABLE ENTITY' && 'Responsibility is not clearly defined, making accountability difficult to establish. This increases uncertainty in liability attribution and incident response.'}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
            Stewardship Clarity
          </div>
          <div className={`text-[20px] font-bold font-mono capitalize ${stewardshipColor}`}>
            {stewardship}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {stewardship === 'high' ? 'Clear ownership and oversight chain' : stewardship === 'medium' ? 'Partial ownership — gaps in oversight' : 'Ownership ambiguous — governance vacuum'}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
            Responsibility Fragmentation
          </div>
          <div className={`text-[20px] font-bold font-mono ${fragmentation >= 60 ? 'text-fragile' : fragmentation >= 35 ? 'text-sensitive' : 'text-stable'}`}>
            {fragmentation}%
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {fragmentation >= 60 ? 'Highly distributed — no single owner' : fragmentation >= 35 ? 'Partially distributed' : 'Concentrated ownership'}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
            Decision Attribution
          </div>
          <div className={`text-[20px] font-bold font-mono ${components.dr > 0.6 ? 'text-fragile' : components.dr > 0.4 ? 'text-sensitive' : 'text-stable'}`}>
            {components.dr > 0.6 ? 'Diffuse' : components.dr > 0.4 ? 'Partial' : 'Clear'}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {components.dr > 0.6 ? 'AI decisions cannot be traced to human authority' : components.dr > 0.4 ? 'Some decisions lack human attribution' : 'Decisions traceable to human authority'}
          </div>
        </div>
      </div>

      {/* Warning block for fragmented / no entity */}
      {status !== 'CLEARLY ASSIGNED' && (
        <div className={`rounded-lg p-3 border ${config.border} ${config.bg}`}>
          <div className={`text-[11px] font-bold ${config.color} mb-1`}>
            {status === 'NO ACCOUNTABLE ENTITY' ? '⛔ Accountability Structure Gap' : '⚠ Accountability Structure Observation'}
          </div>
          <div className="text-[10px] text-muted-foreground leading-[1.6]">
            {status === 'NO ACCOUNTABLE ENTITY'
              ? 'Governance ownership does not appear to be clearly assigned. In the event of AI-related loss, liability attribution may be difficult to establish. This increases uncertainty for insurers and may create challenges under EU AI Act Article 14 (human oversight) requirements.'
              : 'Responsibility appears partially distributed across teams and systems. While some oversight exists, consolidated governance ownership may be difficult to establish, which could complicate liability assignment.'}
          </div>
        </div>
      )}

      {/* Basis */}
      <div className="mt-4 text-[9px] text-muted-foreground leading-[1.5]">
        Analysis based on delegation ratio ({Math.round(components.dr * 100)}%), justificatory density ({Math.round(components.jd * 100)}%),
        oversight level ({oversightLevel}/5), human checkpoints ({humanCheckpoints}/5), and multi-agent coordination ({multiAgent}/5).
      </div>
    </div>
  );
}
