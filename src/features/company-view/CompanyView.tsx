import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/hooks/useAppState';
import { SECTOR_MULTIPLIERS } from '@/lib/constants';
import { formatCurrency } from '@/lib/formatters';
import { getBand, calcAFI } from '@/lib/scoring';
import { Chart, ArcElement, DoughnutController } from 'chart.js';

Chart.register(ArcElement, DoughnutController);

const SIM_BASE = 120;
const SIM_AUTO_M = [0, 1.0, 1.2, 1.5, 1.9, 2.5];
const SIM_CRIT_M = [0, 1.0, 1.25, 1.55, 1.8, 2.1];
const SIM_DEP_M  = [0, 1.0, 1.15, 1.3, 1.55, 1.85];
const SIM_OVST_R = [0, 0.40, 0.28, 0.16, 0.06, 0.0];
const SIM_REV_M  = [0, 1.0, 1.3, 1.7, 2.4, 3.5];
const SIM_AUTO_LABELS  = ['','Manual only','Mostly manual','Hybrid','Mostly autonomous','Fully autonomous'];
const SIM_OVST_LABELS  = ['','Comprehensive','Strong','Moderate','Limited','Minimal / None'];
const SIM_CRIT_LABELS  = ['','Support / Advisory','Operational support','Core operations','Business-critical','Mission-critical'];
const SIM_DEP_LABELS   = ['','Multi-provider, low lock-in','Multi-provider','Mixed dependency','Single provider','Single provider, locked in'];
const SIM_REV_LABELS   = ['','Under €10M (SME)','€10M–€50M','€50M–€500M','€500M–€5B','Over €5B'];

const fmtK = (v: number) => v >= 1000 ? `€${(v/1000).toFixed(1)}M` : `€${Math.round(v)}k`;

/* ── Mini AFI Gauge for Hero ──────────────────────────────── */
function CvAfiGauge({ afi, band }: { afi: number; band: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    const color = afi >= 1.35 ? '#b53020' : afi >= 0.85 ? '#9c6200' : '#146030';
    const maxAFI = 3.0;
    const norm = Math.min(afi, maxAFI);
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: { datasets: [{ data: [norm, maxAFI - norm], backgroundColor: [color, '#e1e4e8'], borderWidth: 0, circumference: 180, rotation: 270 }] },
      options: { responsive: false, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
      plugins: [{
        id: 'cvCenter',
        afterDraw: (chart) => {
          const cx = chart.width / 2;
          const cy = chart.height / 2 + 10;
          chart.ctx.save();
          chart.ctx.font = 'bold 20px "IBM Plex Mono", monospace';
          chart.ctx.fillStyle = color;
          chart.ctx.textAlign = 'center';
          chart.ctx.textBaseline = 'middle';
          chart.ctx.fillText(afi.toFixed(2), cx, cy);
          chart.ctx.restore();
        }
      }]
    });
    return () => { chartRef.current?.destroy(); };
  }, [afi, band]);

  return <canvas ref={canvasRef} width={120} height={70} style={{ display: 'block' }} />;
}

/* ── Financial Decision Engine Block ─────────────────────── */
function FinancialDecisionEngine({ afi, band, sim, inputs }: { afi: number; band: string; sim: any; inputs: any }) {
  const getRiskBand = (v: number) => v < 0.5 ? 'Low' : v < 0.85 ? 'Low-Medium' : v < 1.35 ? 'Medium-High' : 'High';
  const baseBand = getRiskBand(afi * 0.6);
  const elevBand = getRiskBand(afi * 0.9);
  const critBand = getRiskBand(afi * 1.2);

  // Risk Index (simplified)
  const afiNorm = Math.min(100, Math.round(afi / 3.0 * 100));
  const riskIdx = Math.round(afiNorm * 0.50 + 25 * 0.30 + 20 * 0.20); // simplified without full slider access
  const riskColor = riskIdx >= 65 ? 'hsl(4 72% 46%)' : riskIdx >= 40 ? 'hsl(32 90% 38%)' : 'hsl(152 55% 30%)';
  const riskLabel = riskIdx >= 65 ? 'High Risk' : riskIdx >= 40 ? 'Moderate Risk' : 'Low Risk';
  const riskSub = riskIdx >= 65 ? 'Immediate governance action required' : riskIdx >= 40 ? 'Governance improvements recommended' : 'Profile within acceptable parameters';
  const ringOffset = Math.round(226 - (riskIdx / 100) * 226);

  // Industry comparison
  const secAvgs: Record<string, number> = { 'Financial Services': 48, 'Healthcare': 55, 'Insurance': 44, 'Legal / RegTech': 50, 'Technology': 38, 'Retail / E-Commerce': 32, 'Manufacturing': 35, 'Government / Public': 28 };
  const sectorAvg = secAvgs[inputs.industry] || 45;
  const diff = riskIdx - sectorAvg;
  const diffPct = Math.round(Math.abs(diff) / sectorAvg * 100);

  // Scenarios
  const scenarios = [
    { icon: '⚡', label: 'Autonomous decision error', risk: band === 'Fragile' ? 'High' : 'Medium', col: band === 'Fragile' ? 'hsl(var(--red))' : 'hsl(var(--amb))' },
    { icon: '🔗', label: 'System cascade / infrastructure failure', risk: 'High', col: 'hsl(var(--red))' },
    { icon: '⚖', label: 'Regulatory / compliance breach', risk: 'Medium', col: 'hsl(var(--amb))' },
  ];

  // Trajectory
  const growthRate = band === 'Fragile' ? 0.35 : band === 'Sensitive' ? 0.20 : 0.10;
  const trend6m = band === 'Fragile' ? elevBand : baseBand;
  const trend12m = band === 'Fragile' ? critBand : band === 'Sensitive' ? elevBand : baseBand;
  const monthsToAug = Math.max(0, Math.round((new Date('2026-08-02').getTime() - Date.now()) / 86400000 / 30));

  const fmtM = (v: number) => v >= 1000 ? `€${(v/1000).toFixed(1)}M` : `€${Math.round(v)}k`;

  return (
    <div className="mx-2 sm:mx-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #b53020, #e09000, #4038b8, #6058d8)' }} />
      
      {/* Row 1: Risk Index + Characterization + Industry */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border" style={{ paddingTop: 4 }}>
        {/* AI Risk Index */}
        <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 md:border-r border-b md:border-b-0 border-border">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-4">AI Risk Index</div>
          <div className="relative mb-4" style={{ width: 110, height: 110 }}>
            <svg viewBox="0 0 110 110" style={{ width: 110, height: 110, transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r="44" fill="none" stroke="hsl(var(--s2))" strokeWidth="9" />
              <circle cx="55" cy="55" r="44" fill="none" stroke={riskColor} strokeWidth="9" strokeDasharray="276" strokeDashoffset={Math.round(276 - (riskIdx / 100) * 276)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .6s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[34px] font-bold font-mono leading-none" style={{ color: riskColor }}>{riskIdx}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">/ 100</div>
            </div>
          </div>
          <div className="text-sm font-bold" style={{ color: riskColor }}>{riskLabel}</div>
          <div className="text-[11px] text-muted-foreground mt-1 max-w-[180px]">{riskSub}</div>
        </div>

        {/* Risk Characterization */}
        <div className="p-4 sm:p-8 md:border-r border-b md:border-b-0 border-border">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-6">Risk Characterization</div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-secondary-foreground">Baseline (expected)</span>
              <span className="text-[16px] font-bold font-mono text-foreground">{baseBand}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-secondary-foreground">Stress scenario (correlated event)</span>
              <span className="text-[16px] font-bold font-mono text-sensitive">{elevBand}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-secondary-foreground">Tail risk (99th percentile)</span>
              <span className="text-[16px] font-bold font-mono text-fragile">{critBand}</span>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
            Indicative governance-heuristic risk bands. Not actuarially certified.
          </div>
        </div>

        {/* Industry Comparison */}
        <div className="p-4 sm:p-8">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-6">Industry Comparison · Your Sector</div>
          <div className="mb-5">
            <div className="flex justify-between mb-2 text-[12px] text-secondary-foreground">
              <span>Your profile</span>
              <span className="font-mono text-foreground font-bold">{riskIdx} / 100</span>
            </div>
            <div className="bg-secondary rounded h-3 overflow-hidden mb-5">
              <div className="h-full rounded" style={{ background: riskColor, width: `${riskIdx}%`, transition: 'width .5s ease' }} />
            </div>
            <div className="flex justify-between mb-2 text-[12px] text-secondary-foreground">
              <span>Sector average</span>
              <span className="font-mono text-muted-foreground font-bold">{sectorAvg} / 100</span>
            </div>
            <div className="bg-secondary rounded h-3 overflow-hidden mb-5">
              <div className="h-full rounded" style={{ background: 'hsl(220 6% 52%)', width: `${sectorAvg}%`, transition: 'width .5s ease' }} />
            </div>
          </div>
          <div className="text-[12px] font-bold py-2.5 px-4 rounded-lg text-center border" style={{
            background: diff > 10 ? 'hsl(var(--rb))' : diff > 0 ? 'hsl(var(--ab))' : 'hsl(var(--gb))',
            color: diff > 10 ? 'hsl(var(--red))' : diff > 0 ? 'hsl(var(--amb))' : 'hsl(var(--grn))',
            borderColor: diff > 10 ? 'hsl(var(--rbr))' : diff > 0 ? 'hsl(var(--abr))' : 'hsl(var(--gbr))'
          }}>
            {diff > 10 ? `+${diffPct}% above sector average — elevated exposure` : diff > 0 ? 'Slightly above sector average' : 'Below sector average — well-governed'}
          </div>
        </div>
      </div>

      {/* Row 2: Loss Scenarios + Trajectory + Do Nothing */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Top Loss Scenarios */}
        <div className="p-4 sm:p-8 md:border-r border-b md:border-b-0 border-border">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-5">Top Loss Scenarios</div>
          <div className="flex flex-col gap-3">
            {scenarios.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-xl">
                <span className="text-xl">{s.icon}</span>
                <span className="flex-1 text-[12px] text-foreground leading-snug">{s.label}</span>
                <span className="text-[15px] font-bold font-mono" style={{ color: s.col }}>{s.risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exposure Trajectory */}
        <div className="p-4 sm:p-8 md:border-r border-b md:border-b-0 border-border">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-5">Exposure Trajectory · 12 Months</div>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-[12px] text-secondary-foreground">Today</span>
              <span className="text-[16px] font-bold font-mono text-foreground">{baseBand}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[12px] text-secondary-foreground">In 6 months</span>
              <span className="text-[16px] font-bold font-mono text-sensitive">{trend6m}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[12px] text-secondary-foreground">In 12 months</span>
              <span className="text-[16px] font-bold font-mono text-fragile">{trend12m}</span>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-3 mb-5" style={{ height: 50 }}>
            {[
              { l: 'Now', h: 16, c: 'hsl(220 6% 52%)' },
              { l: '6mo', h: band === 'Fragile' ? 32 : 22, c: 'hsl(var(--amb))' },
              { l: '12mo', h: 46, c: 'hsl(var(--red))' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 justify-end">
                <div className="w-full rounded-t" style={{ height: bar.h, background: bar.c }} />
                <span className="text-[10px] text-muted-foreground">{bar.l}</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Without governance changes: +{Math.round(growthRate * 100)}% exposure growth in 12 months. {band === 'Fragile' ? 'EU AI Act (Aug 2026) adds regulatory loading on top.' : 'Regulatory obligations from Aug 2026 will accelerate this.'}
          </div>
        </div>

        {/* What If You Do Nothing */}
        <div className="p-4 sm:p-8">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-5">If Nothing Changes · 12 Month Impact</div>
          <div className="flex flex-col gap-5">
            {[
              { icon: '📈', label: `+${Math.round(growthRate * 100)}% exposure growth`, sub: 'Risk compounds without structural intervention', col: riskColor },
              { icon: '💸', label: `+${fmtM(Math.round(sim.mid * growthRate / 10) * 10)} additional annual exposure`, sub: 'Incremental loss exposure in 12 months vs today', col: 'hsl(var(--red))' },
              { icon: '⚖', label: 'EU AI Act Art. 26 — August 2026', sub: `Deployer obligations in ${monthsToAug} months`, col: 'hsl(var(--amb))' },
              { icon: '🔒', label: 'Insurers adding AI exclusions now', sub: 'Coverage gaps grow without governance evidence', col: band === 'Fragile' ? 'hsl(var(--red))' : 'hsl(var(--amb))' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-[13px] font-bold leading-snug" style={{ color: item.col }}>{item.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Strategic Interpretation Block ──────────────────────── */
function StrategicInterpretation({ band, components }: { band: string; components: { dr: number; jd: number; rc: number; cd: number } }) {
  const interp: Record<string, string> = {
    Fragile: 'Your current AI deployment creates <strong>significant structural exposure</strong> due to high execution authority, deep process integration, and insufficient governance oversight. This fragility profile is not primarily a compliance issue — it is a <strong>governance architecture issue</strong> that insurers price as non-standard, typically requiring premium loading of 40–80% above baseline. The exposure is real but addressable through targeted improvements to oversight cadence, execution authority limits, and dependency diversification.',
    Sensitive: 'Your current AI deployment creates <strong>meaningful structural exposure</strong> due to elevated autonomy, process relevance, and moderate governance gaps. Insurers apply conditional terms here — coverage is available, but with governance requirements and likely premium loading. <strong>Three targeted improvements</strong> could move you to standard coverage terms within 60–90 days, representing a meaningful reduction in annual insurance cost.',
    Stable: 'Your current AI deployment sits <strong>within manageable parameters</strong>. Governance signals are within normal range — structural dependency is balanced by adequate oversight and cadence. Standard insurance terms are likely available. The focus now should be maintaining this profile as your AI deployments evolve.',
  };

  return (
    <div className="mx-2 sm:mx-8 mt-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #b53020, #e09000, #4038b8, #6058d8)' }} />
      <div className="grid grid-cols-1 sm:grid-cols-[56px_1fr] gap-3 sm:gap-5 p-4 sm:p-10 pt-6 sm:pt-8">
        <div className="text-2xl sm:text-3xl text-primary text-center pt-1 hidden sm:block">◈</div>
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">Governance Assessment · Structured Risk Signal for Committee Review</div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-bold tracking-[0.07em] uppercase py-1.5 px-3 bg-purple-bg border border-purple-border rounded text-primary">◆ Governance Signal</span>
              <div className="text-right">
                <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Risk Classification</div>
                <div className="text-xl font-extrabold font-mono mt-1" style={{ color: band === 'Fragile' ? '#c9392a' : band === 'Sensitive' ? '#b87400' : '#227a44' }}>{band === 'Fragile' ? 'HIGH' : band === 'Sensitive' ? 'MODERATE' : 'LOW'}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{band === 'Fragile' ? 'Above tolerance' : band === 'Sensitive' ? 'Approaching threshold' : 'Within tolerance'}</div>
              </div>
            </div>
          </div>
          <div className="text-lg font-bold text-foreground leading-snug mb-4" dangerouslySetInnerHTML={{ __html: interp[band]?.split('.').slice(0, 2).join('.') + '.' || '' }} />
          <p className="text-[13px] text-secondary-foreground leading-[1.8] mb-6" dangerouslySetInnerHTML={{ __html: interp[band] || interp.Stable }} />
          
          {/* Action items */}
          <div className="flex flex-col gap-3 mb-6">
            {(band === 'Fragile' ? [
              { tag: 'REMEDIATE', tagCol: '#c9392a', tagBg: 'hsl(var(--rb))', title: 'Reduce execution authority and implement quarterly re-authorisation', sub: 'Current autonomy level exceeds governance capacity. Structural change required.' },
              { tag: 'ESCALATE', tagCol: '#b87400', tagBg: 'hsl(var(--ab))', title: 'Engage insurance broker with this assessment', sub: 'Premium loading likely without documented governance improvement plan.' },
            ] : [
              { tag: 'MAINTAIN', tagCol: '#227a44', tagBg: 'hsl(var(--gb))', title: 'Continue governance cadence — re-assess annually', sub: 'Current profile is within tolerance. Structural changes require re-assessment.' },
              { tag: 'MONITOR', tagCol: '#227a44', tagBg: 'hsl(var(--gb))', title: 'Monitor delegation density and dependency concentration', sub: 'Key drift vectors to watch — both tend to increase silently over time.' },
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-secondary border border-border rounded-xl">
                <span className="text-[10px] font-bold tracking-[0.06em] uppercase py-1 px-3 rounded-md" style={{ color: item.tagCol, border: `1px solid ${item.tagCol}40`, background: item.tagBg }}>{item.tag}</span>
                <div>
                  <div className="text-[13px] font-bold text-foreground">{item.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Structural signals strip */}
          <div className="flex items-center gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-border flex-wrap">
            <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Structural Signals:</span>
            {[
              `Delegation Density: ${components.dr > 0.6 ? 'High' : components.dr > 0.4 ? 'Moderate' : 'Low'} (${Math.round(components.dr * 100)})`,
              `Reversibility: ${components.rc > 0.6 ? 'Locked' : components.rc > 0.4 ? 'Constrained' : 'Flexible'} (${Math.round(components.rc * 100)})`,
              `Continuation: ${components.cd > 0.6 ? 'Ungoverned' : components.cd > 0.4 ? 'Monitored' : 'Governed'}`,
            ].map((signal, i) => (
              <span key={i} className="text-[11px] font-semibold py-1.5 px-4 border border-border rounded-lg text-foreground">{signal}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyView() {
  const { state, setInputs, runAnalysis, setPerspective, setActiveStep } = useApp();
  const { results, inputs, analysisComplete } = state;
  const heroRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  

  // Simulator state
  const [simAuto, setSimAuto] = useState(4);
  const [simOvst, setSimOvst] = useState(2);
  const [simCrit, setSimCrit] = useState(5);
  const [simDep, setSimDep] = useState(4);
  const [simRev, setSimRev] = useState(3);
  const [simSec, setSimSec] = useState(1.4);
  const [simEuaia, setSimEuaia] = useState(1.4);

  // Sync from analysis
  useEffect(() => {
    if (results && inputs) {
      setSimAuto(Math.min(5, Math.max(1, Math.round(inputs.automation))));
      setSimOvst(Math.min(5, Math.max(1, Math.round(inputs.oversightLevel))));
      setSimCrit(Math.min(5, Math.max(1, Math.round(inputs.criticality))));
      setSimDep(Math.min(5, Math.max(1, inputs.providers.length <= 1 ? 5 : inputs.providers.length <= 2 ? 3 : 1)));
      const secMult = SECTOR_MULTIPLIERS[inputs.industry] || 1.0;
      setSimSec(secMult);
    }
  }, [results, inputs]);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };
    const main = document.querySelector('main');
    if (main) {
      main.addEventListener('scroll', handleScroll);
      return () => main.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Calculate premium
  const sim = useMemo(() => {
    const rawPrem = SIM_BASE * SIM_AUTO_M[simAuto] * SIM_CRIT_M[simCrit] * SIM_DEP_M[simDep] * SIM_REV_M[simRev] * simSec * simEuaia;
    const ovstRed = SIM_OVST_R[simOvst];
    const mid = rawPrem * (1 - ovstRed);
    const bandPct = simAuto >= 4 ? 0.20 : simAuto >= 3 ? 0.25 : 0.30;
    const lo = Math.round(mid * (1 - bandPct) / 10) * 10;
    const hi = Math.round(mid * (1 + bandPct) / 10) * 10;
    const midR = Math.round(mid / 10) * 10;
    const confPct = Math.min(85, 30 + (5-simAuto)*4 + simOvst*4);
    // Benchmark
    const worst = SIM_BASE * 2.5 * 2.1 * 1.85 * SIM_REV_M[simRev] * simSec * simEuaia;
    const best = SIM_BASE * 1.0 * 1.0 * 1.0 * SIM_REV_M[simRev] * simSec * simEuaia * 0.6;
    const benchPct = Math.max(5, Math.min(95, Math.round((mid - best) / (worst - best) * 100)));
    return { lo, mid: midR, hi, confPct, benchPct, ovstRed };
  }, [simAuto, simOvst, simCrit, simDep, simRev, simSec, simEuaia]);

  const sliderFill = (val: number, min: number, max: number) => `${((val - min) / (max - min)) * 100}%`;




  // Locked state
  if (!analysisComplete || !results) {
    return (
      <div style={{ margin: '20px 28px', padding: '28px 32px', background: 'hsl(var(--s2))', border: '1px solid hsl(var(--bd))', borderRadius: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>◈</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'hsl(var(--tx))', marginBottom: 6 }}>Run your AI Risk Assessment first</div>
        <div style={{ fontSize: 12, color: 'hsl(var(--t2))', lineHeight: 1.65, marginBottom: 24, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
          The Company View shows your executive AI risk summary — risk level, estimated insurance cost, cost drivers, and premium reduction actions. It's generated from your exposure profile in Step 1.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setPerspective('underwriter'); setActiveStep(1); }} className="btn-p" style={{ fontSize: 13, padding: '12px 24px' }}>→ Start AI Risk Assessment</button>
          <button onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))} className="btn-s" style={{ fontSize: 13, padding: '12px 24px' }}>▶ Load Demo Scenario</button>
        </div>
        <div style={{ marginTop: 16, fontSize: 10, color: 'hsl(var(--t3))' }}>Takes 3 minutes · No account required · Results are not stored</div>
      </div>
    );
  }

  const { band, afi, structuralScore, eciTier, eciName, components, lossEnvelope, premium } = results;
  const bandColor = band === 'Fragile' ? 'hsl(var(--red))' : band === 'Sensitive' ? 'hsl(var(--amb))' : 'hsl(var(--grn))';
  const companyName = inputs.companyName || 'Your Organisation';
  const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Cost drivers
  const drivers = [
    { label: 'Provider Concentration', sub: 'Single-provider dependency creates correlated tail risk', level: components.cd > 0.6 ? 'high' : components.cd > 0.4 ? 'medium' : 'low', pct: Math.round(components.cd * 100) },
    { label: 'Execution Autonomy', sub: 'High delegation density with limited human override capability', level: components.dr > 0.6 ? 'high' : components.dr > 0.4 ? 'medium' : 'low', pct: Math.round(components.dr * 100) },
    { label: 'Limited Oversight', sub: 'Low governance review frequency and justificatory density', level: components.jd < 0.4 ? 'high' : components.jd < 0.6 ? 'medium' : 'low', pct: Math.round((1 - components.jd) * 100) },
    { label: 'Infrastructure Lock-In', sub: 'High reversibility cost — exit would cause operational disruption', level: components.rc > 0.6 ? 'high' : components.rc > 0.4 ? 'medium' : 'low', pct: Math.round(components.rc * 100) },
    { label: 'Weak Ownership Clarity', sub: 'No single actor has full authority and accountability for this system', level: components.dr > 0.5 && components.jd < 0.5 ? 'high' : 'medium', pct: Math.round((components.dr + (1 - components.jd)) / 2 * 100) },
  ];

  const levers = [
    { rank: 1, title: 'Implement Quarterly Governance Re-authorisation', body: 'Require explicit board-level re-authorisation of AI deployments every 90 days. This alone reduces continuation risk and demonstrates governance maturity to underwriters.', saving: fmtK(Math.round(premium.mid * 0.15 / 10) * 10), before: 'Annual / None', after: 'Quarterly' },
    { rank: 2, title: 'Diversify AI Provider Infrastructure', body: 'Reduce single-provider dependency to minimum 3 providers. This eliminates the concentration premium loading and reduces correlated tail risk by 40-60%.', saving: fmtK(Math.round(premium.mid * 0.20 / 10) * 10), before: '1 provider', after: '3+ providers' },
    { rank: 3, title: 'Establish Named AI System Ownership', body: 'Assign a named individual with stop authority and accountability for each AI deployment. Clear ownership reduces the responsibility fragmentation premium.', saving: fmtK(Math.round(premium.mid * 0.10 / 10) * 10), before: 'Diffuse', after: 'Named owner' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Sticky mini header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-3 sm:px-9 py-2.5 flex items-center justify-between gap-3" style={{
        opacity: showSticky ? 1 : 0, transform: showSticky ? 'none' : 'translateY(-4px)',
        transition: 'opacity .2s, transform .2s', pointerEvents: showSticky ? 'auto' : 'none',
      }}>
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <span className="text-[12px] sm:text-[13px] font-bold text-foreground truncate">{companyName}</span>
          <span className={band === 'Fragile' ? 'badge-fragile' : band === 'Sensitive' ? 'badge-sensitive' : 'badge-stable'} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{band}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <span className="text-[11px] sm:text-[12px] font-bold font-mono text-primary">{fmtK(sim.lo)} – {fmtK(sim.hi)} / yr</span>
          <button onClick={() => document.dispatchEvent(new CustomEvent('open-company-demo'))} className="btn-p hidden sm:inline-flex" style={{ padding: '6px 14px', fontSize: 11 }}>Load Demo</button>
        </div>
      </div>

      {/* Company View Header */}
      <div className="px-4 sm:px-7 pt-5">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 pb-4 border-b border-border">
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Company View — Executive AI Risk Summary</div>
            <div className="text-[15px] sm:text-[18px] font-bold text-foreground tracking-tight mb-1.5">What does your AI cost — and what can you do about it?</div>
            <div className="text-[11px] text-secondary-foreground leading-[1.6] max-w-[600px]">This view translates the structural AI risk assessment into plain business language: your overall risk level, estimated annual insurance cost, what drives it, and three concrete actions to reduce it.</div>
          </div>
          <button onClick={() => setPerspective('underwriter')} className="btn-ghost text-[11px] flex-shrink-0">⊕ Underwriter View →</button>
        </div>

        {/* 4 section preview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3">
          {[
            { bg: 'hsl(var(--rb))', border: 'hsl(var(--rbr))', color: 'hsl(var(--red))', label: '① Risk Level', desc: 'Overall AI risk score, ECI tier' },
            { bg: 'hsl(var(--pb))', border: 'hsl(var(--pbr))', color: 'hsl(var(--pur))', label: '② Insurance Cost', desc: 'Annual premium range & drivers' },
            { bg: 'hsl(var(--gb))', border: 'hsl(var(--gbr))', color: 'hsl(var(--grn))', label: '③ Cost Reduction', desc: 'Concrete actions & savings' },
            { bg: 'hsl(var(--ab))', border: 'hsl(var(--abr))', color: 'hsl(var(--amb))', label: '④ Regulatory', desc: 'EU AI Act & DORA signal' },
          ].map((c, i) => (
            <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: c.color, marginBottom: 3 }}>{c.label}</div>
              <div className="text-[10px] text-secondary-foreground leading-[1.4]">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE PRICING SIMULATOR */}
      <div style={{ background: 'hsl(var(--s2))', borderBottom: '1px solid hsl(var(--bd))' }}>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 px-4 sm:px-7 pt-5">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--pur))', marginBottom: 3 }}>◈ AI Insurance Pricing Simulator · Live Calculation</div>
            <div className="text-[13px] sm:text-[14px] font-bold text-foreground tracking-tight">What does your AI profile cost to insure?</div>
            <div style={{ fontSize: 11, color: 'hsl(var(--t2))', marginTop: 3, lineHeight: 1.5 }}>Adjust the parameters below — the premium estimate updates in real time.</div>
          </div>
          <div className="flex-shrink-0 py-2 px-3.5 bg-purple-bg border border-purple-border rounded-lg text-center min-w-[100px]">
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--pur))', marginBottom: 3 }}>Live Estimate</div>
            <div className="text-[18px] sm:text-[20px] font-bold font-mono text-primary">{fmtK(sim.mid)}</div>
            <div className="text-[9px] text-muted-foreground">per year</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-0 px-4 sm:px-7 py-5">
          {/* LEFT: Input controls */}
          <div className="pr-0 md:pr-6 md:border-r border-b md:border-b-0 border-border pb-5 md:pb-0 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-[14px]">
              {/* Autonomy */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Execution Autonomy</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'hsl(var(--tx))' }}>{SIM_AUTO_LABELS[simAuto]}</span>
                </div>
                <input type="range" min={1} max={5} value={simAuto} onChange={e => setSimAuto(+e.target.value)} style={{ '--fill': sliderFill(simAuto, 1, 5) } as React.CSSProperties} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 8, color: 'hsl(var(--t3))' }}>Manual</span>
                  <span style={{ fontSize: 8, color: 'hsl(var(--t3))' }}>Fully autonomous</span>
                </div>
              </div>
              {/* Oversight */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Human Oversight</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'hsl(var(--tx))' }}>{SIM_OVST_LABELS[simOvst]}</span>
                </div>
                <input type="range" min={1} max={5} value={simOvst} onChange={e => setSimOvst(+e.target.value)} style={{ '--fill': sliderFill(simOvst, 1, 5) } as React.CSSProperties} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 8, color: 'hsl(var(--t3))' }}>Minimal</span>
                  <span style={{ fontSize: 8, color: 'hsl(var(--t3))' }}>Comprehensive</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-[14px]">
              {/* Criticality */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Business Criticality</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'hsl(var(--tx))' }}>{SIM_CRIT_LABELS[simCrit]}</span>
                </div>
                <input type="range" min={1} max={5} value={simCrit} onChange={e => setSimCrit(+e.target.value)} style={{ '--fill': sliderFill(simCrit, 1, 5) } as React.CSSProperties} />
              </div>
              {/* Dependency */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Provider Dependency</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'hsl(var(--tx))' }}>{SIM_DEP_LABELS[simDep]}</span>
                </div>
                <input type="range" min={1} max={5} value={simDep} onChange={e => setSimDep(+e.target.value)} style={{ '--fill': sliderFill(simDep, 1, 5) } as React.CSSProperties} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Revenue */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
                  <span>Annual Revenue</span>
                </div>
                <select className="fi-in" value={simRev} onChange={e => setSimRev(+e.target.value)} style={{ fontSize: 12 }}>
                  {SIM_REV_LABELS.slice(1).map((l, i) => <option key={i+1} value={i+1}>{l}</option>)}
                </select>
              </div>
              {/* EU AI Act */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--t2))', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>EU AI Act Classification</div>
                <select className="fi-in" value={simEuaia} onChange={e => setSimEuaia(+e.target.value)} style={{ fontSize: 12 }}>
                  <option value={1.0}>Minimal Risk</option>
                  <option value={1.15}>Limited Risk (transparency)</option>
                  <option value={1.4}>High-Risk — Annex III</option>
                  <option value={1.6}>High-Risk — Annex I (product safety)</option>
                  <option value={2.0}>Unacceptable / Prohibited</option>
                </select>
              </div>
            </div>
            <div style={{ fontSize: 9, color: 'hsl(var(--t3))', padding: '4px 0', lineHeight: 1.6 }}>
              ⊙ Using standalone inputs
            </div>
          </div>

          {/* RIGHT: Live Price Panel */}
          <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Main price */}
            <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, hsl(var(--pb)), hsl(var(--s2)))', border: '1px solid hsl(var(--pbr))', borderRadius: 12, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--pur))', marginBottom: 8 }}>Estimated Annual AI Liability Premium</div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'hsl(var(--tx))', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 3, transition: 'all .3s' }}>{fmtK(sim.mid)}</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--t2))', marginBottom: 14 }}>Range: {fmtK(sim.lo)} – {fmtK(sim.hi)} / year</div>
              <div style={{ background: 'hsl(var(--s3))', borderRadius: 4, height: 5, marginBottom: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, hsl(var(--pur)), #7068e0)', borderRadius: 4, width: `${sim.confPct}%`, transition: 'width .4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'hsl(var(--t3))' }}>
                <span>Exploratory</span>
                <span>{sim.confPct > 65 ? 'Directional estimate' : sim.confPct > 45 ? 'Low-medium' : 'Exploratory only'}</span>
                <span>Validated</span>
              </div>
            </div>

            {/* Cost driver rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { icon: '⚡', cls: simAuto >= 4 ? 'red' : simAuto >= 3 ? 'amber' : 'green', action: 'Execution Autonomy', sub: `${SIM_AUTO_LABELS[simAuto]} · Level ${simAuto}/5`, neg: simAuto >= 3 },
                { icon: '👁', cls: simOvst <= 2 ? 'red' : simOvst <= 3 ? 'amber' : 'green', action: 'Human Oversight', sub: `${SIM_OVST_LABELS[simOvst]} · Level ${simOvst}/5`, neg: simOvst <= 2 },
                { icon: '🔗', cls: simDep >= 4 ? 'red' : simDep >= 3 ? 'amber' : 'green', action: 'Provider Dependency', sub: `${SIM_DEP_LABELS[simDep]} · Level ${simDep}/5`, neg: simDep >= 3 },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'hsl(var(--sf))', border: '1px solid hsl(var(--bd))', borderRadius: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, background: r.cls === 'red' ? 'hsl(var(--rb))' : r.cls === 'amber' ? 'hsl(var(--ab))' : 'hsl(var(--gb))' }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(var(--tx))' }}>{r.action}</div>
                    <div style={{ fontSize: 9, color: 'hsl(var(--t3))' }}>{r.sub}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: r.neg ? 'hsl(var(--red))' : 'hsl(var(--grn))' }}>{r.neg ? '↑' : '↓'}</div>
                </div>
              ))}
            </div>

            {/* Benchmark */}
            <div style={{ padding: '12px 14px', background: 'hsl(var(--s2))', border: '1px solid hsl(var(--bd))', borderRadius: 8, marginTop: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--t3))', marginBottom: 8 }}>◈ Peer Benchmark · Similar profile in your sector</div>
              <div style={{ height: 8, background: 'hsl(var(--bd))', borderRadius: 4, overflow: 'hidden', position: 'relative', marginBottom: 6 }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${sim.benchPct}%`, background: sim.benchPct > 65 ? 'linear-gradient(90deg, #146030, #b53020)' : 'linear-gradient(90deg, #146030, #9c6200)', transition: 'width .5s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'hsl(var(--t3))' }}>
                <span>Best governance</span><span>Sector avg</span><span>Worst governance</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 6, textAlign: 'center', color: sim.benchPct > 65 ? 'hsl(var(--red))' : sim.benchPct > 40 ? 'hsl(var(--amb))' : 'hsl(var(--grn))' }}>
                Your profile: {sim.benchPct > 70 ? `above average risk · Top ${100-sim.benchPct}% of sector` : sim.benchPct > 40 ? 'near sector average' : 'below average risk · well-governed'}
              </div>
            </div>



          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div ref={heroRef} className="px-10 pt-10 pb-8">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: bandColor, animation: 'pulse-dot 2s infinite' }} />
          Company View · AI Risk Executive Summary · {now}
        </div>
        <div className="flex items-start justify-between gap-6 mb-2">
          <div className="text-[36px] font-bold tracking-tight text-foreground">{companyName}</div>
          <div className="flex-shrink-0 text-center pt-1">
            <CvAfiGauge afi={afi} band={band} />
            <div className="text-[10px] text-muted-foreground mt-1 tracking-[0.06em] uppercase">Fragility Score</div>
          </div>
        </div>
        <div className="text-sm text-secondary-foreground mb-10">{inputs.industry ? inputs.industry + ' · ' : ''}AI Governance Architecture Framework · Structural Exposure Assessment</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Premium card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden" style={{ borderTop: `4px solid hsl(var(--pur))` }}>
            <div className="p-7">
              <div className="text-[10px] font-extrabold tracking-[0.08em] uppercase text-muted-foreground">Estimated Annual AI Insurance Premium</div>
              <div className="text-[30px] font-bold font-mono text-primary mt-3 mb-3">{fmtK(sim.lo)} – {fmtK(sim.hi)}</div>
              <div className="text-[12px] text-secondary-foreground leading-relaxed mb-4">Based on structural governance assessment. Indicative range for committee orientation.</div>
              <div className="pt-5 border-t border-border">
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.08em] mb-3">After governance improvements →</div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold font-mono text-fragile">{fmtK(sim.mid)}</span>
                  <span className="text-[15px] text-muted-foreground">→</span>
                  <span className="text-[15px] font-bold font-mono text-stable">{fmtK(Math.round(sim.mid * 0.55 / 10) * 10)}</span>
                  <span className="text-[10px] font-bold py-1 px-2.5 bg-stable-bg text-stable border border-stable-border rounded">Save ~45%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden" style={{ borderTop: `4px solid ${bandColor}` }}>
            <div className="p-7">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Overall AI Risk</div>
              <div className="text-[24px] font-bold mt-3 mb-3" style={{ color: bandColor }}>{band} — Score {structuralScore}/100</div>
              <div className="text-[12px] text-secondary-foreground leading-relaxed">
                {band === 'Fragile' ? 'Above underwriting tolerance. Structural remediation required before standard coverage.' :
                 band === 'Sensitive' ? 'Approaching threshold. Conditional review process with 90-day improvement plan.' :
                 'Within tolerance. Standard coverage terms apply.'}
              </div>
              <div className="mt-5 pt-5 border-t border-border flex gap-4">
                <div className="flex-1 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.07em] mb-1">AFI</div>
                  <div className="text-lg font-bold font-mono" style={{ color: bandColor }}>{afi.toFixed(2)}</div>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.07em] mb-1">ECI</div>
                  <div className="text-lg font-bold font-mono" style={{ color: bandColor }}>ECI-{eciTier}</div>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.07em] mb-1">Band</div>
                  <div className="text-sm font-bold" style={{ color: bandColor }}>{band}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden" style={{ borderTop: '4px solid hsl(var(--amb))' }}>
            <div className="p-7">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground">Regulatory Exposure</div>
              <div className="text-[24px] font-bold text-sensitive mt-3 mb-3">High-Risk (Annex III)</div>
              <div className="text-[12px] text-secondary-foreground leading-relaxed">EU AI Act obligations apply from Aug 2026. Art. 99 penalty exposure up to €15M / 3% global turnover.</div>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.08em] mb-3">Compliance window</div>
                <div className="bg-secondary rounded-md overflow-hidden h-2">
                  <div className="h-full rounded-md" style={{ background: 'linear-gradient(90deg, #146030, #208040)', width: '40%' }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">Today</span>
                  <span className="text-[10px] text-muted-foreground">Aug 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FINANCIAL DECISION ENGINE ══ */}
      <FinancialDecisionEngine afi={afi} band={band} sim={sim} inputs={inputs} />

      {/* ══ STRATEGIC INTERPRETATION ══ */}
      <StrategicInterpretation band={band} components={components} />

      {/* COST DRIVERS */}
      <div className="px-10 pt-10">
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Cost Drivers</div>
          <div className="text-xl font-bold text-foreground">What's Driving Your Insurance Cost</div>
          <div className="text-[12px] text-secondary-foreground mt-2">Ranked by impact on annual premium. Address high-impact drivers first for maximum cost reduction.</div>
        </div>
        <div className="flex flex-col gap-3">
          {drivers.map((d, i) => (
            <div key={i} className="grid grid-cols-[240px_1fr_120px] gap-6 p-6 bg-card border border-border rounded-2xl items-center shadow-sm">
              <div>
                <div className="text-sm font-bold text-foreground mb-1.5">{d.label}</div>
                <div className="text-[12px] text-secondary-foreground leading-relaxed">{d.sub}</div>
              </div>
              <div>
                <div className="h-3 bg-secondary rounded-md overflow-hidden">
                  <div className="h-full rounded-md" style={{ width: `${d.pct}%`, background: d.level === 'high' ? 'linear-gradient(90deg, hsl(var(--red)), #d85040)' : d.level === 'medium' ? 'linear-gradient(90deg, hsl(var(--amb)), #c88000)' : 'linear-gradient(90deg, hsl(var(--grn)), #208040)' }} />
                </div>
              </div>
              <div className="text-right text-[13px] font-bold font-mono" style={{ color: d.level === 'high' ? 'hsl(var(--red))' : d.level === 'medium' ? 'hsl(var(--amb))' : 'hsl(var(--grn))' }}>{d.pct}% · {d.level === 'high' ? 'High' : d.level === 'medium' ? 'Medium' : 'Low'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PREMIUM REDUCTION LEVERS */}
      <div className="px-10 pt-10">
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Premium Reduction Levers</div>
          <div className="text-xl font-bold text-foreground">Three Actions to Reduce Your AI Insurance Cost</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {levers.map(l => (
            <div key={l.rank} className="bg-card border border-border rounded-2xl shadow-sm p-7 relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 left-0 w-1 bottom-0 bg-stable rounded-l-2xl" />
              <div className="w-8 h-8 rounded-full bg-stable-bg border border-stable-border flex items-center justify-center text-[11px] font-bold text-stable">{l.rank}</div>
              <div className="text-[15px] font-bold text-foreground leading-snug">{l.title}</div>
              <div className="text-[12px] text-secondary-foreground leading-relaxed flex-1">{l.body}</div>
              <div className="flex items-center justify-between bg-stable-bg border border-stable-border rounded-xl p-4">
                <span className="text-[10px] font-bold tracking-[0.07em] uppercase text-stable">Est. Saving</span>
                <span className="text-lg font-bold font-mono text-stable">{l.saving}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-semibold py-1 px-2.5 rounded bg-fragile-bg text-fragile">{l.before}</span>
                <span className="text-[11px] text-muted-foreground">→</span>
                <span className="text-[10px] font-semibold py-1 px-2.5 rounded bg-stable-bg text-stable">{l.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGULATORY READINESS */}
      <div className="px-10 pt-10">
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Governance & Regulatory Readiness</div>
          <div className="text-xl font-bold text-foreground">Are You Ready for August 2026?</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Oversight Maturity', level: components.jd > 0.6 ? 'green' : components.jd > 0.4 ? 'yellow' : 'red', label: components.jd > 0.6 ? 'Adequate' : components.jd > 0.4 ? 'Partial' : 'Insufficient', body: 'Human oversight density and governance review frequency. Art. 14 requires "appropriate" human oversight.', why: 'Directly affects insurability and premium loading' },
            { name: 'Deployer Obligation Readiness', level: components.dr < 0.4 ? 'green' : components.dr < 0.6 ? 'yellow' : 'red', label: components.dr < 0.4 ? 'On Track' : components.dr < 0.6 ? 'Gaps Identified' : 'Not Ready', body: 'Readiness for Art. 26 deployer obligations (Aug 2026). Includes FRIA, incident reporting, post-market monitoring.', why: 'Non-compliance: up to €15M / 3% global turnover' },
            { name: 'Post-Market Monitoring', level: 'yellow', label: 'Under Development', body: 'Art. 72 requires continuous monitoring systems. Most deployments currently lack structured AI-specific monitoring.', why: 'Required for all high-risk AI from Aug 2026' },
          ].map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl shadow-sm p-7 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: r.level === 'green' ? '#18a050' : r.level === 'yellow' ? '#e09000' : '#c03020', animation: r.level !== 'green' ? 'pulse-dot 2s infinite' : undefined }} />
                <span className="text-[13px] font-bold" style={{ color: r.level === 'green' ? 'hsl(var(--grn))' : r.level === 'yellow' ? 'hsl(var(--amb))' : 'hsl(var(--red))' }}>{r.label}</span>
              </div>
              <div className="text-sm font-bold text-foreground">{r.name}</div>
              <div className="text-[12px] text-secondary-foreground leading-relaxed">{r.body}</div>
              <div className="text-[10px] text-muted-foreground pt-3 border-t border-border">{r.why}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION PLAN */}
      <div className="px-10 pt-10">
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Recommended Action Plan</div>
          <div className="text-xl font-bold text-foreground">What To Do Next</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { num: '1', title: 'Schedule AI Governance Review', body: 'Book a 90-minute governance review session with your risk committee. Use this assessment as the agenda basis. Focus on the three cost drivers identified above.', horizon: 'This Week' },
            { num: '2', title: 'Document AI System Inventory', body: 'Create a structured inventory of all AI systems, their providers, integration points, and decision authority. This is a prerequisite for EU AI Act Art. 26 compliance.', horizon: '30 Days' },
            { num: '3', title: 'Engage Insurance Broker', body: 'Share this assessment with your insurance broker or risk advisor. Use the pricing simulator outputs to start a conversation about AI-specific coverage terms.', horizon: '60 Days' },
          ].map(a => (
            <div key={a.num} className="bg-card border border-border rounded-2xl shadow-sm p-7 flex flex-col gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-bg border border-purple-border flex items-center justify-center text-sm font-bold font-mono text-primary">{a.num}</div>
              <div className="text-[15px] font-bold text-foreground leading-snug">{a.title}</div>
              <div className="text-[12px] text-secondary-foreground leading-[1.7] flex-1">{a.body}</div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-primary">{a.horizon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="mx-10 my-10 p-8 bg-purple-bg border border-purple-border rounded-2xl flex items-center justify-between gap-6">
        <div className="text-sm text-secondary-foreground leading-relaxed">
          <strong className="text-base font-bold block mb-1 text-foreground">Ready to take action?</strong>
          Download the executive report for your board, or switch to the Underwriter View for the full structural analysis.
        </div>
        <button onClick={() => setPerspective('underwriter')} className="btn-p" style={{ padding: '14px 28px', fontSize: 14, borderRadius: 12, flexShrink: 0 }}>⊕ Full Underwriter Analysis →</button>
      </div>
    </div>
  );
}
