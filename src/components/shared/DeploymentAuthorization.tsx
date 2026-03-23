import React from 'react';
import type { Band, AFIComponents } from '@/lib/types';

interface Props {
  band: Band;
  afi: number;
  structuralScore: number;
  components: AFIComponents;
  agri: number;
  alri: number;
  companyName: string;
}

type AuthStatus = 'APPROVED' | 'CONDITIONALLY APPROVED' | 'NOT APPROVED' | 'PROHIBITED';

function deriveAuthStatus(band: Band, afi: number, agri: number, alri: number): AuthStatus {
  if (band === 'Fragile' && (agri >= 60 || alri >= 60)) return 'PROHIBITED';
  if (band === 'Fragile') return 'NOT APPROVED';
  if (band === 'Sensitive') return 'CONDITIONALLY APPROVED';
  return 'APPROVED';
}

const STATUS_CONFIG: Record<AuthStatus, { bg: string; border: string; text: string; icon: string; sentence: (name: string) => string }> = {
  'APPROVED': {
    bg: 'bg-stable-bg',
    border: 'border-stable',
    text: 'text-stable',
    icon: '✓',
    sentence: (name) => `Deployment of ${name} is acceptable under current governance structure.`,
  },
  'CONDITIONALLY APPROVED': {
    bg: 'bg-sensitive-bg',
    border: 'border-sensitive',
    text: 'text-sensitive',
    icon: '⚠',
    sentence: (name) => `Deployment of ${name} is conditionally acceptable with additional oversight and control mechanisms.`,
  },
  'NOT APPROVED': {
    bg: 'bg-fragile-bg',
    border: 'border-fragile',
    text: 'text-fragile',
    icon: '✗',
    sentence: (name) => `Deployment of ${name} is not advisable due to unresolved governance risks.`,
  },
  'PROHIBITED': {
    bg: 'bg-fragile-bg',
    border: 'border-fragile',
    text: 'text-fragile',
    icon: '⛔',
    sentence: (name) => `Deployment of ${name} should be avoided as current conditions indicate systemic exposure risk.`,
  },
};

export function DeploymentAuthorization({ band, afi, structuralScore, components, agri, alri, companyName }: Props) {
  const status = deriveAuthStatus(band, afi, agri, alri);
  const config = STATUS_CONFIG[status];
  const name = companyName || 'this system';

  return (
    <div className={`rounded-xl border-2 ${config.border} ${config.bg} p-5 sm:p-6 mb-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
          Deployment Authorization Status
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[12px] font-extrabold tracking-wide ${
          status === 'APPROVED' ? 'bg-stable text-white' :
          status === 'CONDITIONALLY APPROVED' ? 'bg-sensitive text-white' :
          'bg-fragile text-white'
        }`}>
          {config.icon} {status}
        </span>
      </div>

      {/* Decision sentence */}
      <div className={`text-[16px] sm:text-[18px] font-bold leading-[1.35] mb-4 ${config.text}`}>
        {config.sentence(name)}
      </div>

      {/* Decision basis */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-card/60 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Exposure Score</div>
          <div className={`text-[20px] font-bold font-mono ${config.text}`}>{structuralScore}</div>
        </div>
        <div className="bg-card/60 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Delegation Intensity</div>
          <div className={`text-[20px] font-bold font-mono ${components.dr > 0.6 ? 'text-fragile' : components.dr > 0.4 ? 'text-sensitive' : 'text-stable'}`}>
            {Math.round(components.dr * 100)}%
          </div>
        </div>
        <div className="bg-card/60 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Governance Density</div>
          <div className={`text-[20px] font-bold font-mono ${components.jd < 0.4 ? 'text-fragile' : components.jd < 0.6 ? 'text-sensitive' : 'text-stable'}`}>
            {Math.round(components.jd * 100)}%
          </div>
        </div>
        <div className="bg-card/60 rounded-lg p-3 border border-border">
          <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Dependency Level</div>
          <div className={`text-[20px] font-bold font-mono ${components.rc > 0.6 ? 'text-fragile' : components.rc > 0.4 ? 'text-sensitive' : 'text-stable'}`}>
            {Math.round(components.rc * 100)}%
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="text-[10px] text-muted-foreground leading-[1.6] p-3 bg-card/40 rounded-lg border border-border">
        <strong className="text-foreground">Basis:</strong> This assessment reflects governance-related risk signals derived from system structure, delegation patterns, and dependency factors. It does not represent actuarial validation or pricing. Values are indicative and subject to uncertainty.
      </div>
    </div>
  );
}
