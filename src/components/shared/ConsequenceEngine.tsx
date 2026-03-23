import React from 'react';
import type { Band, AFIComponents } from '@/lib/types';

interface Props {
  band: Band;
  afi: number;
  components: AFIComponents;
  agri: number;
  alri: number;
  scri: number;
  companyName: string;
  revenue: string;
}

function getFinancialRange(band: Band, revenue: string): { lo: string; hi: string } {
  const isLargeRev = ['€500M–€5B', 'Over €5B'].includes(revenue);
  const isMedRev = ['€50M–€500M'].includes(revenue);

  if (band === 'Fragile') {
    if (isLargeRev) return { lo: '€80M', hi: '€250M' };
    if (isMedRev) return { lo: '€15M', hi: '€60M' };
    return { lo: '€5M', hi: '€25M' };
  }
  if (band === 'Sensitive') {
    if (isLargeRev) return { lo: '€20M', hi: '€80M' };
    if (isMedRev) return { lo: '€5M', hi: '€20M' };
    return { lo: '€1M', hi: '€8M' };
  }
  if (isLargeRev) return { lo: '€2M', hi: '€15M' };
  if (isMedRev) return { lo: '€500K', hi: '€5M' };
  return { lo: '€100K', hi: '€2M' };
}

export function ConsequenceEngine({ band, afi, components, agri, alri, scri, companyName, revenue }: Props) {
  const range = getFinancialRange(band, revenue);
  const bandColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';
  const bandBg = band === 'Fragile' ? 'bg-fragile-bg border-fragile-border' : band === 'Sensitive' ? 'bg-sensitive-bg border-sensitive-border' : 'bg-stable-bg border-stable-border';

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px]">⚡</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
            Consequence Assessment
          </div>
          <div className="text-[15px] font-bold text-foreground">Potential Consequences if Unaddressed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial Exposure */}
        <div className={`rounded-xl p-4 border ${bandBg}`}>
          <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
            Financial Exposure Range
          </div>
          <div className={`text-[24px] font-bold font-mono ${bandColor}`}>
            {range.lo} – {range.hi}
          </div>
          <div className="text-[10px] text-muted-foreground mt-2 leading-[1.55]">
            Estimated exposure range reflects potential impact under uncertainty.
            (Indicative range based on structural risk patterns, not actuarial modeling)
          </div>
        </div>

        {/* Liability Risk */}
        <div className="rounded-xl p-4 border border-border bg-card">
          <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
            Liability Exposure
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${components.dr > 0.5 ? 'bg-fragile' : 'bg-sensitive'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {components.dr > 0.5 ? 'Responsibility may be distributed across system layers' : 'Partially distributed accountability'}
                 </div>
                 <div className="text-[10px] text-muted-foreground">
                   Delegation density of {Math.round(components.dr * 100)}% — accountability may be difficult to assign in case of failure
                 </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${components.jd < 0.5 ? 'bg-fragile' : 'bg-sensitive'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {components.jd < 0.4 ? 'Documentation trail may not support regulatory defense' : 'Partial documentation trail'}
                 </div>
                 <div className="text-[10px] text-muted-foreground">
                   Justificatory density at {Math.round(components.jd * 100)}% — may require strengthening for formal examination
                 </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alri >= 35 ? 'bg-fragile' : 'bg-stable'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {alri >= 60 ? 'Elevated potential legal exposure' : alri >= 35 ? 'Emerging legal exposure pathways' : 'Controlled legal exposure'}
                 </div>
                 <div className="text-[10px] text-muted-foreground">
                   ALRI score of {alri} indicates {alri >= 60 ? 'potential exposure across multiple claim dimensions' : alri >= 35 ? 'emerging claim pathways' : 'manageable claim profile'}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Systemic Cascade */}
        <div className="rounded-xl p-4 border border-border bg-card">
          <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
            Systemic Cascade Risk
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${components.cd > 0.5 ? 'bg-fragile' : 'bg-sensitive'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {components.cd > 0.5 ? 'Local failures may propagate across connected systems' : 'Moderate cross-system coupling'}
                 </div>
                 <div className="text-[10px] text-muted-foreground">
                   Correlation density of {Math.round(components.cd * 100)}% — {components.cd > 0.5 ? 'increasing overall impact potential' : 'limited propagation vectors'}
                 </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${scri >= 50 ? 'bg-fragile' : 'bg-stable'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {scri >= 65 ? 'Dependency concentration may amplify single-point failures' : scri >= 35 ? 'Moderate concentration — diversification advisable' : 'Adequate provider diversification'}
                 </div>
                <div className="text-[10px] text-muted-foreground">
                  SCRI score of {scri} indicates {scri >= 65 ? 'systemic concentration' : 'manageable concentration'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Risk */}
        <div className="rounded-xl p-4 border border-border bg-card">
          <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
            Regulatory Exposure
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${band === 'Fragile' ? 'bg-fragile' : band === 'Sensitive' ? 'bg-sensitive' : 'bg-stable'}`} />
              <div>
                 <div className="text-[11px] font-semibold text-foreground">
                   {band === 'Fragile' ? 'Limited governance visibility may create challenges under emerging regulatory requirements' : band === 'Sensitive' ? 'Compliance gaps emerging — remediation timeline advisable' : 'Within current regulatory tolerance'}
                 </div>
                 <div className="text-[10px] text-muted-foreground">
                   {band === 'Fragile' ? 'Article 13 (transparency) and Article 14 (human oversight) requirements may not be fully met' : band === 'Sensitive' ? 'Partial alignment — documentation and oversight cadence may require strengthening' : 'Current governance cadence satisfies baseline regulatory requirements'}
                 </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${components.jd < 0.5 ? 'bg-fragile' : 'bg-stable'}`} />
              <div>
                <div className="text-[11px] font-semibold text-foreground">
                  {components.jd < 0.4 ? 'Audit trail insufficient for regulatory defense' : 'Audit trail partially established'}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Current justificatory density would {components.jd < 0.4 ? 'not withstand regulatory examination' : 'require strengthening for formal examination'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-[9px] text-muted-foreground leading-[1.6]">
        ℹ️ Financial ranges reflect structural uncertainty and are not actuarial projections.
        Actual exposure depends on entity-specific infrastructure, contractual arrangements,
        and operational resilience measures. Requires qualified underwriter corroboration.
      </div>
    </div>
  );
}
