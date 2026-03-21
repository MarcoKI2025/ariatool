import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { IATStatus } from '@/lib/types';

const IAT_CRITERIA = [
  {
    id: 1,
    title: 'Duration of Continuous Operation',
    description: 'AI system has been operating continuously for >24 months without formal re-authorisation.',
    ref: 'AGAF §4.1',
  },
  {
    id: 2,
    title: 'Process Criticality',
    description: 'Removal would cause material operational impairment — the organisation cannot function normally without it.',
    ref: 'AGAF §4.2',
  },
  {
    id: 3,
    title: 'Institutional Dependency',
    description: 'Workflows, staffing, or competency structures have adapted to assume AI availability.',
    ref: 'AGAF §4.3',
  },
  {
    id: 4,
    title: 'Switching & Exit Cost Threshold',
    description: 'Exit or replacement cost exceeds €500k or >10% of operational budget.',
    ref: 'AGAF §4.4',
  },
  {
    id: 5,
    title: 'Continuous Change Without Reauthorisation',
    description: 'System behaviour has changed (model updates, fine-tuning, drift) without governance review.',
    ref: 'AGAF §4.5',
  },
  {
    id: 6,
    title: 'FRIA Not Conducted / Outdated',
    description: 'Fundamental Rights Impact Assessment per EU AI Act Art. 27 has not been conducted or is >12 months old.',
    ref: 'Art. 27',
    badge: 'EU AI Act',
  },
  {
    id: 7,
    title: 'No Post-Market Monitoring Plan',
    description: 'No active post-market monitoring system in place as required under EU AI Act Art. 72.',
    ref: 'Art. 72',
    badge: 'EU AI Act',
  },
];

function getIATStatus(iatState: Record<number, boolean>): { count: number; status: IATStatus; label: string; color: string } {
  const count = Object.values(iatState).filter(Boolean).length;
  const has6or7 = iatState[6] || iatState[7];

  if (count === 0) return { count, status: 'none', label: 'No Trigger', color: 'muted-foreground' };
  if (count <= 2 && !has6or7) return { count, status: 'approaching', label: 'Approaching Threshold', color: 'sensitive' };
  if (count >= 5 || has6or7) return { count, status: 'infrastructural', label: 'Infrastructural AI Status', color: 'fragile' };
  return { count, status: 'triggered', label: 'Continuation Governance Triggered', color: 'primary' };
}

export function IATAssessmentPanel() {
  const { state, toggleIAT } = useApp();
  const { iatState } = state;
  const { count, status, label, color } = getIATStatus(iatState);

  const borderColor = status === 'infrastructural' ? 'border-fragile' : status === 'triggered' ? 'border-primary' : status === 'approaching' ? 'border-sensitive' : 'border-border';
  const bgColor = status === 'infrastructural' ? 'bg-fragile-bg' : status === 'triggered' ? 'bg-purple-bg' : status === 'approaching' ? 'bg-sensitive-bg' : 'bg-secondary';

  return (
    <div className="bg-card border border-border rounded-[10px] p-5 mb-[14px]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[10px] font-bold tracking-[0.09em] uppercase text-secondary-foreground flex items-center gap-[6px]">
            🏛 Infrastructural AI Status & Regulatory Compliance Assessment
          </div>
          <div className="text-[11px] text-muted-foreground mt-[3px] mb-[10px] leading-[1.5]">
            Click each criterion that applies to the assessed AI deployment. Triggering structural or compliance criteria changes the IAT classification.
          </div>
        </div>
        <span className={`text-[10px] font-bold tracking-wider uppercase px-[10px] py-[4px] rounded-md border ${
          status === 'infrastructural' ? 'badge-fragile' :
          status === 'triggered' ? 'bg-pur text-primary border-purple-border bg-purple-bg' :
          status === 'approaching' ? 'badge-sensitive' :
          'bg-secondary text-muted-foreground border-border'
        }`}>
          {count}/7 Criteria Met
        </span>
      </div>

      {/* Criteria grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] mb-4">
        {IAT_CRITERIA.map((criterion) => {
          const checked = iatState[criterion.id];
          return (
            <button
              key={criterion.id}
              onClick={() => toggleIAT(criterion.id)}
              className={`text-left p-[14px] rounded-lg border transition-all hover:shadow-sm ${
                checked
                  ? 'bg-purple-bg border-primary'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-[10px]">
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-[1px] transition-colors ${
                  checked ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-semibold text-foreground leading-[1.3] mb-[4px]">
                    {criterion.title}
                    {criterion.badge && (
                      <span className="ml-2 text-[8px] font-bold px-[6px] py-[1px] bg-purple-bg text-primary border border-purple-border rounded uppercase tracking-wider">
                        {criterion.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-[1.5]">{criterion.description}</div>
                  <div className="text-[9px] text-muted-foreground mt-[4px] font-mono">{criterion.ref}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result panel */}
      <div className={`rounded-lg border-l-4 ${borderColor} ${bgColor} p-4 border border-border`}>
        <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 text-${color}`}>
          {label}
        </div>
        <div className="text-[11px] text-muted-foreground leading-[1.55]">
          {status === 'none' && 'No IAT criteria currently triggered. System does not meet the threshold for Infrastructural AI classification.'}
          {status === 'approaching' && `${count} structural criteria triggered. Approaching the threshold for Continuation Governance requirements. Monitor and reassess.`}
          {status === 'triggered' && `${count} structural criteria triggered. Continuation Governance is now required — the system has reached the structural threshold for enhanced oversight and periodic re-authorisation.`}
          {status === 'infrastructural' && `${count} criteria triggered including compliance violations. This system meets the definition of Infrastructural AI — it cannot be removed without material operational disruption and regulatory non-compliance has been identified. Mandatory remediation required.`}
        </div>
      </div>
    </div>
  );
}
