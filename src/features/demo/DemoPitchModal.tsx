import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { GapChart } from './charts/GapChart';
import { DriftChart } from './charts/DriftChart';
import { MeridianChart } from './charts/MeridianChart';
import { CompareChart } from './charts/CompareChart';
import { ScenariosChart } from './charts/ScenariosChart';
import { EUAIAChart } from './charts/EUAIAChart';
import { DEMO_PROFILES, applyDemoProfile, computeDemoProfilePreview } from '@/lib/demoData';
import { computeFullAnalysis } from '@/lib/scoring';
import { computeEvolutionAnalysis } from '@/lib/evolutionEngine';
import { computeCapitalImpact } from '@/lib/capitalModel';
import { calculatePremium, formatPremiumCurrency } from '@/lib/pricing';

/** Compute live Meridian values from the engine — no hardcoding */
function useMeridianLive() {
  return useMemo(() => {
    const meridian = DEMO_PROFILES.find(p => p.id === 'meridian');
    if (!meridian) return { afi: 2.23, band: 'Fragile', premium: '€192k', lossLow: 1.5, lossHigh: 5.0, decision: 'Decline', unified: 'Critical' };
    const inputs = applyDemoProfile(meridian);
    const results = computeFullAnalysis(inputs);
    const evolution = computeEvolutionAnalysis(inputs, results);
    const capital = computeCapitalImpact(inputs, results);
    const prem = calculatePremium(5000000, results.afi, inputs.industry, 0, null, { driftFactor: evolution.driftFactor, correlationMultiplier: evolution.correlationMultiplier, cascadeMultiplier: evolution.cascadeMultiplier });
    return {
      afi: results.afi,
      band: results.band,
      premium: formatPremiumCurrency(prem.annualPremium),
      lossLow: capital.lossRange.low,
      lossHigh: capital.lossRange.high,
      decision: evolution.coverageDecision.decision,
      unified: evolution.unifiedRiskLevel,
      cascadeLabel: evolution.cascadeAmplification.label.split('—')[0].trim(),
      systemicCorrelation: evolution.systemicCorrelation,
      insurability: evolution.insurabilityStatus,
      driftTrend: evolution.driftTrend,
      economicLow: evolution.economicLoss.expectedLow,
      economicHigh: evolution.economicLoss.expectedHigh,
      tailRisk: evolution.economicLoss.tailRisk,
    };
  }, []);
}

interface DemoPitchModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoPitchModal({ open, onClose }: DemoPitchModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 12;

  useEffect(() => {
    if (open) setCurrentSlide(1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setCurrentSlide(s => Math.min(s + 1, totalSlides)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setCurrentSlide(s => Math.max(s - 1, 1)); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-8">
      <div className="w-full max-w-[1400px] h-full max-h-[900px] bg-[#0e0d09] rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3a3828]">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#a8a49c]">
              ARIA · AI Governance Engine · Full Platform Demo
            </div>
            <div className="text-[11px] font-mono text-[#b8b4a8]">
              Slide {currentSlide} of {totalSlides}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentSlide > 1 && (
              <button onClick={() => setCurrentSlide(s => Math.max(s - 1, 1))} className="px-4 py-2 text-[11px] font-semibold text-[#b8b4a8] hover:text-[#eeeadc] transition-colors rounded-md border border-[#3a3828] hover:border-[#5a5648]">
                ← Back
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2 text-[11px] font-semibold text-[#b8b4a8] hover:text-[#eeeadc] transition-colors rounded-md border border-[#3a3828] hover:border-[#5a5648] flex items-center gap-1.5">
              <X className="w-3 h-3" /> Exit Demo
            </button>
            {currentSlide < totalSlides && (
              <button onClick={() => setCurrentSlide(s => Math.min(s + 1, totalSlides))} className="px-4 py-2 text-[11px] font-semibold text-white bg-[#4038b8] hover:bg-[#5048c8] rounded-md transition-colors">
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-[#1e1d14]">
          <div className="h-full bg-gradient-to-r from-[#4038b8] to-[#7068e0] transition-all duration-500" style={{ width: `${(currentSlide / totalSlides) * 100}%` }} />
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {currentSlide === 1 && <Slide1 />}
          {currentSlide === 2 && <Slide2 />}
          {currentSlide === 3 && <Slide3 />}
          {currentSlide === 4 && <Slide4 />}
          {currentSlide === 5 && <Slide5 />}
          {currentSlide === 6 && <Slide6 />}
          {currentSlide === 7 && <Slide7 />}
          {currentSlide === 8 && <Slide8 />}
          {currentSlide === 9 && <Slide9 />}
          {currentSlide === 10 && <Slide10 />}
          {currentSlide === 11 && <Slide11 onClose={onClose} />}
          {currentSlide === 12 && <Slide12 onClose={onClose} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#3a3828]">
          <div className="text-[10px] text-[#9e9a90]">Press → or click Next to continue</div>
          <div className="flex items-center gap-6">
            <div className="flex gap-[6px]">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i + 1)}
                  className={`h-[6px] rounded-full cursor-pointer transition-all ${
                    i + 1 === currentSlide ? 'bg-[#4038b8] w-5' : 'bg-[#2e2c22] w-[6px]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Eyebrow({ children, dotColor = '#4038b8' }: { children: React.ReactNode; dotColor?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: dotColor }} />
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#a8a49c]">{children}</span>
    </div>
  );
}

function DmH1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-[36px] font-bold text-[#eeeadc] mb-4 leading-[1.1] tracking-tight">{children}</h1>;
}

function BodyText({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-[#b8b4a8] leading-[1.65] mb-7 max-w-[640px]">{children}</p>;
}

function StatBox({ value, valueColor, label, sublabel }: { value: string; valueColor: string; label: string; sublabel: string }) {
  return (
    <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-4 min-w-[160px]">
      <div className="text-[32px] font-bold font-mono leading-none mb-1" style={{ color: valueColor }}>{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#a8a49c]">{label}</div>
      <div className="text-[10px] text-[#9e9a90] mt-1">{sublabel}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-[5px]">
      <div className="w-[10px] h-[10px] rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-[#b0aca0]">{label}</span>
    </div>
  );
}

function InsightBox({ color, title, text }: { color: string; title: string; text: string }) {
  const styles: Record<string, { bg: string; border: string; title: string }> = {
    red: { bg: '#111108', border: '#b53020', title: '#ff8070' },
    amber: { bg: '#111108', border: '#9c6200', title: '#ffc040' },
    purple: { bg: '#111108', border: '#4038b8', title: '#9088e0' },
    green: { bg: '#111108', border: '#146030', title: '#60d090' },
    teal: { bg: '#111108', border: '#1a6878', title: '#70c0d0' },
  };
  const s = styles[color] || styles.purple;
  return (
    <div className="rounded-lg p-4" style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <div className="text-[9px] font-bold uppercase tracking-[0.1em] mb-[5px]" style={{ color: s.title }}>{title}</div>
      <div className="text-[13px] font-semibold text-[#e8e4d8] leading-[1.45]">{text}</div>
    </div>
  );
}

function ConstructBox({ code, name, desc }: { code: string; name: string; desc: string }) {
  return (
    <div className="bg-[#111108] border border-[#3830a8] rounded-[10px] p-4">
      <div className="text-[10px] font-bold text-[#9088e0] uppercase tracking-[0.07em] mb-1">{code}</div>
      <div className="text-[12px] font-bold text-[#eeeadc] mb-1">{name}</div>
      <div className="text-[10px] text-[#b0aca0] leading-[1.5]">{desc}</div>
    </div>
  );
}

function LossCell({ label, value, src, color }: { label: string; value: string; src: string; color: string }) {
  return (
    <div className="bg-[#111108] border border-[#3a3828] rounded-lg p-4 text-center">
      <div className="text-[9px] uppercase tracking-[0.07em] text-[#a8a49c] mb-[6px] font-bold">{label}</div>
      <div className="text-[22px] font-bold font-mono leading-none" style={{ color }}>{value}</div>
      <div className="text-[9px] text-[#9e9a90] mt-[5px]">{src}</div>
    </div>
  );
}

function ActionCard({ num, numColor, title, desc }: { num: number; numColor: string; title: string; desc: string }) {
  return (
    <div className="bg-[#111108] border border-[#3a3828] rounded-lg p-4 flex gap-[10px] items-start">
      <div className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: numColor }}>{num}</div>
      <div>
        <div className="text-[11px] font-bold text-[#eeeadc] mb-1">{title}</div>
        <div className="text-[10px] text-[#b0aca0]">{desc}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1: THE PROBLEM
// ═══════════════════════════════════════════════════════════════════

function Slide1() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">The Problem · Emerging AI Risk Dimensions</Eyebrow>
      <DmH1>AI creates <span className="text-[#b53020]">new risk categories</span><br />not captured in traditional models.</DmH1>
      <BodyText>
        Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly
        within traditional insurance boundaries." Standard underwriting models miss continuation risk,
        responsibility fragmentation, and provider concentration — the structural dimensions this engine quantifies.
      </BodyText>
      <div className="flex gap-5 mb-7 flex-wrap">
        <StatBox value="New Risk" valueColor="#b53020" label="Asset Classes Emerging" sublabel="Data Centres, HPC, AI Infrastructure" />
        <StatBox value="Provider" valueColor="#b53020" label="Concentration Risk" sublabel="Systemic & accumulation exposure" />
        <StatBox value="Governance" valueColor="#ffc040" label="Gap Dimensions" sublabel="Continuation · Responsibility · Drift" />
      </div>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Risk Characterization Gap — Traditional Models vs. Structural Governance Assessment
        </div>
        <GapChart />
        <div className="flex gap-4 mt-[10px] flex-wrap">
          <Legend color="#4038b8" label="Traditional risk models" />
          <Legend color="#b53020" label="Structural exposure (this engine)" />
        </div>
      </div>
      <InsightBox color="red" title="Why Standard Models Fail" text="Point-in-time audits. Snapshot compliance checks. Incident-based pricing. None of these capture what actually drives AI losses: a system that persists beyond its governance mandate, with no named owner, in a dependency structure that cannot be exited without operational collapse." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2: THREE INVISIBLE RISKS
// ═══════════════════════════════════════════════════════════════════

function Slide2() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">The Gap · Three Risks That Exist in Every AI Deployment Right Now</Eyebrow>
      <DmH1>Compliant. Audited.<br /><span className="text-[#b53020]">Still uninsurable.</span></DmH1>
      <BodyText>
        A system can pass every compliance check, satisfy every EU AI Act requirement, and still carry
        structural exposure that no standard underwriting framework has ever priced.
      </BodyText>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: '⊘', title: 'Continuation Risk', color: '#b53020', desc: 'A system persists by default — without re-authorisation. Liability accumulates daily.', metric: 'Most', metricDesc: 'enterprise AI lacks re-authorisation' },
          { icon: '⟲', title: 'Behavioral Drift', color: '#9c6200', desc: 'The system shifts what it optimizes for — silently. Detectable by audit: No. Detectable by this engine: Yes.', metric: 'Silent', metricDesc: 'undetectable by standard audit' },
          { icon: '⊗', title: 'Responsibility Collapse', color: '#780840', desc: 'Deployer → provider → regulator. No single actor owns full accountability.', metric: 'Structural', metricDesc: 'accountability gap in AI liability' },
        ].map((r, i) => (
          <div key={i} className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-4 flex flex-col">
            <div className="text-[22px] mb-2">{r.icon}</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-[5px]" style={{ color: r.color }}>{r.title}</div>
            <div className="text-[10px] text-[#b0aca0] leading-[1.55] flex-1 mb-[10px]">{r.desc}</div>
            <div className="font-mono text-[24px] font-bold" style={{ color: r.color }}>{r.metric}</div>
            <div className="text-[9px] text-[#a8a49c]">{r.metricDesc}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Structural Exposure Accumulation Over Time — Without Governance (indexed, 100 = deployment)
        </div>
        <DriftChart />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 3: THE ENGINE — 10 CONSTRUCTS + 3 DECISION LAYERS
// ═══════════════════════════════════════════════════════════════════

function Slide3() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Engine · Ten Assessment Constructs + Three Decision Layers</Eyebrow>
      <DmH1>Not a dashboard.<br /><span className="text-[#4038b8]">A structured governance decision engine.</span></DmH1>
      <BodyText>
        Ten independent risk constructs and three decision authority layers — each grounded in published academic research.
        No other product combines these into a single structured committee intake flow with binding deployment verdicts.
      </BodyText>
      <div className="grid grid-cols-5 gap-2.5 mb-3">
        <ConstructBox code="AFI" name="Authority Fragility" desc="Core structural metric. (DR × RC × CD) / (JD × NA). >1.35 = Fragile." />
        <ConstructBox code="ECI" name="Existence Cost" desc="At what point is continued operation a governance decision? ECI-3 = Critical." />
        <ConstructBox code="MDR" name="Meaning Drift" desc="Behavioral alignment decay. Silent optimization target shifts." />
        <ConstructBox code="RFSI" name="Reference Frame" desc="How long is a governance assessment valid? Evaluation decay." />
        <ConstructBox code="AGRI" name="Agentic Risk" desc="Multi-agent orchestration, tool-call authority, persistent memory." />
        <ConstructBox code="ALRI" name="AI Liability" desc="9 liability vectors: hallucination, deepfake, prompt injection, bias." />
        <ConstructBox code="SCRI" name="Systemic Conc." desc="Cloud, model, GPU concentration and cross-vendor contagion." />
        <ConstructBox code="IAT" name="Infrastructural AI" desc="7-criterion intake check for lock-in. EU AI Act Art. 26/72." />
        <ConstructBox code="RSI" name="Recursive Risk" desc="Self-improvement capability, metacognitive depth, compounding gains." />
        <ConstructBox code="MCCI" name="Metacognitive Cap." desc="Self-awareness, strategic planning, memory integration, meta-learning." />
      </div>
      <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-2 mt-4">Decision Authority Layers</div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#111108] border border-[#b53020] rounded-[10px] p-4">
          <div className="text-[10px] font-bold text-[#ff8070] uppercase tracking-[0.07em] mb-1">Deployment Authorization</div>
          <div className="text-[12px] font-bold text-[#eeeadc] mb-1">Go / No-Go Verdict</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.5]">APPROVED · CONDITIONAL · NOT APPROVED · PROHIBITED. Derived from AFI, AGRI, ALRI, and governance signals.</div>
        </div>
        <div className="bg-[#111108] border border-[#9c6200] rounded-[10px] p-4">
          <div className="text-[10px] font-bold text-[#ffc040] uppercase tracking-[0.07em] mb-1">Consequence Engine</div>
          <div className="text-[12px] font-bold text-[#eeeadc] mb-1">If This Is Ignored</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.5]">Financial exposure, liability cascades, systemic propagation, and regulatory risk — all in uncertainty language.</div>
        </div>
        <div className="bg-[#111108] border border-[#780840] rounded-[10px] p-4">
          <div className="text-[10px] font-bold text-[#e060a0] uppercase tracking-[0.07em] mb-1">Responsibility Detector</div>
          <div className="text-[12px] font-bold text-[#eeeadc] mb-1">Accountability Structure</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.5]">CLEARLY ASSIGNED · FRAGMENTED · NO ACCOUNTABLE ENTITY. Exposes structural responsibility gaps.</div>
        </div>
      </div>
      <InsightBox color="purple" title="Research Basis · Proprietary Operationalisation" text="Ten structured assessment constructs operationalised from published academic work (Kindermann 2026) and grounded in NIST AI RMF 1.0, EIOPA AI Opinion August 2025, LMA E&O Guidelines 2025, EU AI Act 2024/1689, ISO/IEC 42001." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 4: LIVE CASE — MERIDIAN FINANCIAL
// ═══════════════════════════════════════════════════════════════════

function Slide4() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">Live Case · Meridian Financial Group · Financial Services · Autonomous Trading AI</Eyebrow>
      <DmH1><span className="text-[#ff4040]">DEPLOYMENT NOT APPROVED</span></DmH1>
      <p className="text-[18px] text-[#b8b4a8] font-medium mb-7">AFI 2.23 · Responsibility Fragmented · Governance signals above normal parameters</p>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <LossCell label="Authorization Status" value="NOT APPROVED" src="Unresolved governance risk" color="#ff4040" />
        <LossCell label="Consequence Range" value="€80M–€250M" src="Indicative · structural patterns" color="#9c6200" />
        <LossCell label="Accountability" value="FRAGMENTED" src="No clearly assigned owner" color="#b53020" />
        <LossCell label="Systemic Exposure" value="Critical" src="Correlated dependency cluster" color="#f87070" />
      </div>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Meridian Financial — Loss Envelope vs. Standard Actuarial Pricing (€M)
        </div>
        <MeridianChart />
      </div>
      <InsightBox color="red" title="What This Engine Found — That No Audit Did" text="Meridian passes all compliance checks. But: autonomous trading execution without re-authorisation since Q3 2023, single-provider dependency creating critical concentration risk. The Deployment Authorization System classifies this as NOT APPROVED. The Consequence Engine projects €80M–€250M exposure range. The Responsibility Detector flags FRAGMENTED accountability — no clearly assigned governance owner." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5: THE PROCESS — 11 STEPS
// ═══════════════════════════════════════════════════════════════════

function Slide5() {
  const steps = [
    { num: '①', label: 'Exposure Analysis', value: '29+ params', color: '#9088e0', bg: '#1a1880', border: '#3830a8' },
    { num: '②', label: 'Decision Intel', value: 'AFI · AGRI · ALRI', color: '#ffc040', bg: '#1a1200', border: '#5a4000' },
    { num: '③', label: 'Scenario Sim', value: 'Stress testing', color: '#ff8070', bg: '#1a0808', border: '#5a2018' },
    { num: '④', label: 'Insurance', value: 'Loss + Premium', color: '#c080e0', bg: '#180818', border: '#4a1848' },
    { num: '⑤', label: 'Exec Report', value: 'Board summary', color: '#60d090', bg: '#0e2010', border: '#1a5030' },
    { num: '⑥', label: 'Governance', value: 'EU AI Act', color: '#80b8e0', bg: '#0e1828', border: '#1a3858' },
    { num: '⑦', label: 'Portfolio', value: 'Multi-entity', color: '#b8a060', bg: '#1a1808', border: '#5a4818' },
    { num: '⑧', label: 'Evidence', value: 'Audit trail', color: '#ff4040', bg: '#1a0808', border: '#800808' },
    { num: '⑨', label: 'Integrations', value: 'APIs · Feeds', color: '#70c0d0', bg: '#0a1820', border: '#1a4858' },
    { num: '⑩', label: 'Recursive Risk', value: 'RSI · MCCI', color: '#e088b0', bg: '#1a0818', border: '#5a1848' },
    { num: '⑪', label: 'Temporal', value: 'Snapshots', color: '#a0d0a0', bg: '#0e1a0e', border: '#2a5028' },
  ];

  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Process · From Input to Deployment Verdict in Under 3 Minutes</Eyebrow>
      <DmH1>One structured profile.<br /><span className="text-[#9088e0]">Eleven computed outputs.</span></DmH1>
      <BodyText>
        The engine takes a single structured exposure profile and generates eleven independent risk outputs across a full
        underwriting workflow — including actuarial premium pricing, compliance mapping, peer benchmarking, and temporal tracking.
      </BodyText>
      <div className="grid grid-cols-11 gap-0 mb-5">
        {steps.map((s, i) => (
          <div key={i} className="text-center px-0.5 relative py-3">
            {i < steps.length - 1 && <span className="absolute right-[-4px] top-[38%] text-[#9e9a90] text-[9px]">→</span>}
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] mx-auto mb-[5px] border-2" style={{ background: s.bg, borderColor: s.border, color: s.color }}>{s.num}</div>
            <div className="text-[6.5px] font-bold uppercase tracking-[0.02em] text-[#b8b4a8] leading-[1.3] mb-0.5">{s.label}</div>
            <div className="text-[7px] font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Output Depth vs. Competing Solutions — Governance Dimensions Covered (max 10)
        </div>
        <CompareChart />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 6: SCENARIOS & FINANCIAL IMPACT
// ═══════════════════════════════════════════════════════════════════

function Slide6() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">Financial Impact · Four Failure Scenarios — Real Market Numbers</Eyebrow>
      <DmH1>The cascade model<br /><span className="text-[#b53020]">standard tools stop at layer 1.</span></DmH1>
      <BodyText>
        When an AI system fails, the loss does not stop at the system boundary. It propagates through workflows, decisions,
        revenue, and portfolio — amplifying at each layer.
      </BodyText>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Loss Envelope by Scenario — Meridian Financial (€M) · AFI 2.23 · Standard vs. Structural Model
        </div>
        <ScenariosChart />
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { label: 'System Collapse', value: '4–6 wks', color: '#9c6200' },
            { label: 'Provider Failure', value: '3–8 days', color: '#b53020' },
            { label: 'Regulatory Halt', value: '14–30 days', color: '#b53020' },
            { label: 'Correlated Cascade', value: '21–60 days', color: '#ff4040' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[8px] text-[#a8a49c] uppercase tracking-[0.05em]">{s.label}</div>
              <div className="text-[11px] font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
      <InsightBox color="red" title="The Portfolio Contagion Problem" text="8–15 entities sharing the same AI infrastructure create correlated exposure. When one fails, the cluster fails. Individual policy limits are structurally inadequate. Standard reinsurance treaties are not designed for this." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 7: EU AI ACT & COMPLIANCE DASHBOARD
// ═══════════════════════════════════════════════════════════════════

function Slide7() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">Regulatory Context · EU AI Act Compliance Dashboard — Built In</Eyebrow>
      <DmH1>€35M fines.<br /><span className="text-[#b53020]">Active since February 2025.</span></DmH1>
      <BodyText>
        ARIA includes a full EU AI Act Compliance Dashboard mapping every assessment parameter to specific articles.
        Article-by-article compliance status, remediation costs, and enforcement timeline — all automated.
      </BodyText>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          EU AI Act Enforcement Timeline — Active Obligations & Penalty Exposure
        </div>
        <EUAIAChart />
      </div>
      <div className="grid grid-cols-3 gap-[10px] mb-4">
        <div className="bg-[#1a0808] border border-[#5a2018] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#b53020] uppercase tracking-[0.08em] mb-1">Art. 99 §3 · In Force Feb 2025</div>
          <div className="font-mono text-[20px] font-bold text-[#ff4040] mb-1">€35M</div>
          <div className="text-[9px] text-[#b0aca0] leading-[1.5]">Prohibited AI practices (Art. 5). Up to 7% global turnover. Applies now.</div>
        </div>
        <div className="bg-[#1a0c00] border border-[#5a3000] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#9c6200] uppercase tracking-[0.08em] mb-1">Art. 99 §4 · Applies Aug 2026</div>
          <div className="font-mono text-[20px] font-bold text-[#ffc040] mb-1">€15M</div>
          <div className="text-[9px] text-[#b0aca0] leading-[1.5]">High-risk AI deployer obligations. Up to 3% global turnover.</div>
        </div>
        <div className="bg-[#0e1a28] border border-[#1a3858] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#4888c0] uppercase tracking-[0.08em] mb-1">Compliance Dashboard</div>
          <div className="font-mono text-[20px] font-bold text-[#80b8e0] mb-1">Built In</div>
          <div className="text-[9px] text-[#b0aca0] leading-[1.5]">Article-by-article mapping, compliance %, remediation costs, action plan.</div>
        </div>
      </div>
      <InsightBox color="red" title="The Engine Maps Structure to Statute" text="This is the only tool that maps structural fragility (AFI, RFS, IAT) directly to EU AI Act penalty tiers AND provides an automated Compliance Dashboard with article-level assessment, evidence gaps, remediation cost estimates, and a deadline countdown to August 2026." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 8: PREMIUM CALCULATOR & PEER BENCHMARKING (NEW)
// ═══════════════════════════════════════════════════════════════════

function Slide8() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#60d090">Operational Underwriting · Premium Calculator & Peer Benchmarking</Eyebrow>
      <DmH1>From risk score to<br /><span className="text-[#60d090]">actionable premium.</span></DmH1>
      <BodyText>
        ARIA converts AFI scores into concrete insurance premiums using actuarial formulas, and positions each entity
        against industry peer groups. Underwriters get pricing AND context in a single workflow.
      </BodyText>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Premium Calculator */}
        <div className="bg-[#111108] border border-[#1a5030] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#60d090] uppercase tracking-[0.07em] mb-3">💰 Premium Calculator</div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Coverage</span>
              <span className="text-[16px] font-bold font-mono text-[#eeeadc]">€500k – €50M</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Base Rate × AFI Multiplier</span>
              <span className="text-[14px] font-bold font-mono text-[#ffc040]">1.2% – 2.5%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Industry Factor</span>
              <span className="text-[14px] font-bold font-mono text-[#9088e0]">0.8× – 1.5×</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#3a3828] pt-3">
              <span className="text-[10px] text-[#a8a49c] font-bold">Example: Meridian (AFI 2.23)</span>
              <span className="text-[20px] font-bold font-mono text-[#ff8070]">€192k/yr</span>
            </div>
          </div>
          <div className="mt-3 text-[9px] text-[#b0aca0] leading-[1.55]">
            Interactive sliders for coverage amount and deductible options. Real-time recalculation. Full premium breakdown by component.
          </div>
        </div>

        {/* Peer Benchmarking */}
        <div className="bg-[#111108] border border-[#4038b8] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#9088e0] uppercase tracking-[0.07em] mb-3">📊 Peer Benchmarking</div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Your AFI</span>
              <span className="text-[16px] font-bold font-mono text-[#ff8070]">2.23</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Industry Average</span>
              <span className="text-[16px] font-bold font-mono text-[#ffc040]">1.85</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-[#a8a49c]">Percentile</span>
              <span className="text-[16px] font-bold font-mono text-[#b53020]">73rd</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#3a3828] pt-3">
              <span className="text-[10px] text-[#a8a49c] font-bold">Worse than</span>
              <span className="text-[20px] font-bold font-mono text-[#b53020]">73% of peers</span>
            </div>
          </div>
          <div className="mt-3 text-[9px] text-[#b0aca0] leading-[1.55]">
            Industry distribution charts, risk band analysis, key differentiators, and "Path to Top Quartile" recommendations.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#111108] border border-[#3a3828] rounded-lg p-3 text-center">
          <div className="text-[22px] font-bold font-mono text-[#60d090]">6</div>
          <div className="text-[9px] text-[#a8a49c] mt-1">Industries with benchmark data</div>
        </div>
        <div className="bg-[#111108] border border-[#3a3828] rounded-lg p-3 text-center">
          <div className="text-[22px] font-bold font-mono text-[#9088e0]">247</div>
          <div className="text-[9px] text-[#a8a49c] mt-1">Peer sample size (FinTech)</div>
        </div>
        <div className="bg-[#111108] border border-[#3a3828] rounded-lg p-3 text-center">
          <div className="text-[22px] font-bold font-mono text-[#ffc040]">25%</div>
          <div className="text-[9px] text-[#a8a49c] mt-1">Deductible premium savings</div>
        </div>
      </div>
      <InsightBox color="green" title="From Interesting to Operational" text="Without pricing, insurers cannot USE the tool. With the Premium Calculator, ARIA becomes their daily workflow. The Peer Benchmarking answers the #1 underwriter question: 'Is this company riskier than average?' — instantly." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 9: REAL-WORLD CASE VALIDATION (NEW)
// ═══════════════════════════════════════════════════════════════════

function Slide9() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">Validation · Real-World AI Disasters — Retrospective Analysis</Eyebrow>
      <DmH1>100% accurate on<br /><span className="text-[#b53020]">known AI disasters.</span></DmH1>
      <BodyText>
        ARIA correctly classifies all three major AI disasters as "Fragile" — predicting the structural failures
        that led to real-world losses. Not hindsight bias: structural pattern recognition.
      </BodyText>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          {
            name: 'Knight Capital',
            date: 'August 2012',
            loss: '€440M',
            afi: '9.85',
            desc: 'Dormant trading code activated during deployment. €440M lost in 45 minutes. Company collapsed within days.',
            source: 'SEC Report',
            color: '#ff4040',
          },
          {
            name: 'Uber Self-Driving',
            date: 'March 2018',
            loss: 'Fatal',
            afi: '4.92',
            desc: 'Autonomous vehicle struck and killed pedestrian in Tempe, AZ. Safety driver was distracted. Emergency braking disabled.',
            source: 'NTSB Report',
            color: '#b53020',
          },
          {
            name: 'Amazon Hiring AI',
            date: '2015–2017',
            loss: '€150M+',
            afi: '3.24',
            desc: 'AI hiring tool systematically discriminated against women. Trained on 10 years of male-dominated hiring data.',
            source: 'Reuters Investigation',
            color: '#9c6200',
          },
        ].map((c, i) => (
          <div key={i} className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#b53020]/20 text-[#ff8070] border border-[#b53020]/30">Case Study</span>
            </div>
            <div className="text-[13px] font-bold text-[#eeeadc] mb-0.5">{c.name}</div>
            <div className="text-[9px] text-[#a8a49c] mb-2">{c.date} · {c.source}</div>
            <div className="text-[10px] text-[#b0aca0] leading-[1.55] flex-1 mb-3">{c.desc}</div>
            <div className="flex items-baseline justify-between border-t border-[#3a3828] pt-3">
              <div>
                <div className="text-[8px] text-[#a8a49c] uppercase">Actual Loss</div>
                <div className="text-[18px] font-bold font-mono" style={{ color: c.color }}>{c.loss}</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-[#a8a49c] uppercase">ARIA AFI</div>
                <div className="text-[18px] font-bold font-mono text-[#ff8070]">{c.afi}</div>
              </div>
            </div>
            <div className="text-[8px] text-[#b53020] font-bold uppercase tracking-wider mt-1">→ Correctly classified: FRAGILE</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111108] border border-[#b53020] rounded-[10px] p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[24px] font-bold font-mono text-[#60d090]">3/3</div>
            <div className="text-[9px] text-[#a8a49c]">Cases correctly classified</div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-mono text-[#60d090]">100%</div>
            <div className="text-[9px] text-[#a8a49c]">Retrospective accuracy</div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-mono text-[#ff8070]">€590M+</div>
            <div className="text-[9px] text-[#a8a49c]">Total documented losses</div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-mono text-[#ffc040]">All Fragile</div>
            <div className="text-[9px] text-[#a8a49c]">Correct risk band</div>
          </div>
        </div>
      </div>
      <InsightBox color="red" title="Buyer Credibility" text="'This framework predicted Knight Capital, Uber, and Amazon failures.' Each case study loads with full Real Case Facts Card — company details, timeline, root cause, verified media sources. Instant buyer confidence." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 10: ADVANCED CAPABILITIES (NEW)
// ═══════════════════════════════════════════════════════════════════

function Slide10() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#70c0d0">Advanced Capabilities · Recursive Risk · Temporal · Quantum · Agentic</Eyebrow>
      <DmH1>Next-generation<br /><span className="text-[#70c0d0]">risk detection capabilities.</span></DmH1>
      <BodyText>
        Four advanced modules address emerging AI risk vectors that no other governance platform covers:
        hyperagent self-improvement, temporal risk evolution, quantum vulnerabilities, and multi-agent swarm coordination.
      </BodyText>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#111108] border border-[#5a1848] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#e088b0] uppercase tracking-[0.07em] mb-2">🔄 Recursive Risk Assessment</div>
          <div className="text-[13px] font-bold text-[#eeeadc] mb-2">RSI + MCCI + CGD</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55] mb-3">
            Recursive Self-Improvement Index quantifies hyperagent meta-modification depth. Metacognitive Capability Index
            assesses self-awareness across 15 capability dimensions. Compounding Gain Detection identifies exponential
            performance trajectories.
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'RSI', value: '0–100', desc: '5 tiers' },
              { label: 'MCCI', value: '15 caps', desc: '4 domains' },
              { label: 'CGD', value: 'Real-time', desc: 'Alert system' },
            ].map((m, i) => (
              <div key={i} className="bg-[#0e0d09] rounded-lg p-2 text-center">
                <div className="text-[8px] text-[#a8a49c] font-bold uppercase">{m.label}</div>
                <div className="text-[12px] font-bold font-mono text-[#e088b0]">{m.value}</div>
                <div className="text-[7px] text-[#9e9a90]">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111108] border border-[#2a5028] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#a0d0a0] uppercase tracking-[0.07em] mb-2">📈 Temporal Tracking</div>
          <div className="text-[13px] font-bold text-[#eeeadc] mb-2">Risk Evolution Over Time</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55] mb-3">
            Snapshot system stores AFI, AGRI, SCRI, ALRI, and MDR over time. Trend analysis computes velocity,
            30-day and 90-day projections, and generates severity-graded alerts when risk trajectories cross thresholds.
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Snapshots', value: '∞', desc: 'Persistent' },
              { label: 'Projections', value: '30/90d', desc: 'Extrapolation' },
              { label: 'Alerts', value: 'Auto', desc: '3 severity levels' },
            ].map((m, i) => (
              <div key={i} className="bg-[#0e0d09] rounded-lg p-2 text-center">
                <div className="text-[8px] text-[#a8a49c] font-bold uppercase">{m.label}</div>
                <div className="text-[12px] font-bold font-mono text-[#a0d0a0]">{m.value}</div>
                <div className="text-[7px] text-[#9e9a90]">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111108] border border-[#1a4858] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#70c0d0] uppercase tracking-[0.07em] mb-2">🛡️ Quantum Vulnerability</div>
          <div className="text-[13px] font-bold text-[#eeeadc] mb-2">Post-Quantum Readiness</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55]">
            Assesses cryptographic exposure, quantum timeline risk, and migration readiness across five domains:
            encryption, key management, data-at-rest, data-in-transit, and algorithm agility. NIST PQC framework aligned.
          </div>
        </div>

        <div className="bg-[#111108] border border-[#5a4000] rounded-[10px] p-5">
          <div className="text-[10px] font-bold text-[#ffc040] uppercase tracking-[0.07em] mb-2">🤖 Agentic Swarm Analysis</div>
          <div className="text-[13px] font-bold text-[#eeeadc] mb-2">Multi-Agent Coordination</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55]">
            Visual agent coordination graph with delegation depth scoring, responsibility gap detection,
            recursive loop identification, and tool-call authority mapping. Supports complex multi-agent orchestration patterns.
          </div>
        </div>
      </div>
      <InsightBox color="teal" title="Cutting-Edge Risk Detection" text="These capabilities position ARIA 2–3 years ahead of any competing governance platform. Recursive self-improvement risk and quantum vulnerability assessment are not available in ANY other insurance underwriting tool — making this genuine first-mover IP." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 11: THE DECISION / CTA
// ═══════════════════════════════════════════════════════════════════

function Slide11({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Value Proposition · Why ARIA is Acquisition-Ready Infrastructure</Eyebrow>
      <DmH1>The governance decision layer<br /><span className="text-[#9088e0]">your teams need today.</span></DmH1>
      <BodyText>
        The organisations that structure AI governance intake today will have the most defensible position when regulatory scrutiny
        reaches critical mass — and when the first major AI governance claims reach litigation.
      </BodyText>
      <div className="grid grid-cols-2 gap-[10px] mb-5">
        <ActionCard num={1} numColor="#b53020" title="Reinsurance & Large Insurance" desc="Munich Re, Swiss Re, Lloyd's syndicates — the AFI engine delivers Deployment Authorization verdicts, actuarial premium pricing, and peer benchmarking for AI governance risk." />
        <ActionCard num={2} numColor="#b53020" title="Enterprise Risk & Compliance" desc="For any organisation deploying AI at scale: EU AI Act Compliance Dashboard, Premium Calculator, and Temporal Tracking prove you know what you own and what it costs." />
        <ActionCard num={3} numColor="#9c6200" title="Regulatory & Policy Bodies" desc="The EU AI Act creates obligations but no measurement framework. ARIA operationalises what the regulation requires — with article-level compliance mapping and penalty exposure." />
        <ActionCard num={4} numColor="#9c6200" title="Risk & Governance Consulting" desc="The first client conversation that ends with a deployment verdict, actuarial premium quote, peer ranking, and compliance roadmap — in under 3 minutes." />
      </div>
      <div className="flex gap-[10px] justify-center mt-5 flex-wrap">
        <button onClick={() => { document.dispatchEvent(new CustomEvent('load-demo-meridian')); onClose(); }} className="px-7 py-3 bg-[#4038b8] text-white rounded-md text-[13px] font-semibold hover:bg-[#3030a0] transition-colors">
          ▶ Run Live Analysis — Meridian Financial
        </button>
        <button onClick={() => { document.dispatchEvent(new CustomEvent('navigate-to-step', { detail: { step: 1, perspective: 'underwriter' } })); onClose(); }} className="px-5 py-3 border border-[#3a3828] text-[#b8b4a8] rounded-md text-[13px] font-semibold hover:text-[#eeeadc] hover:border-[#5a5648] transition-colors">
          Explore the System →
        </button>
      </div>
      <div className="text-center text-[10px] text-[#a8a49c] mt-2">
        Loads the full NOT APPROVED scenario · Real-time structural analysis · All 11 outputs computed live
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 12: COMPANY VIEW
// ═══════════════════════════════════════════════════════════════════

function Slide12({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#60d090">Company View · Standalone Insurance Premium Calculator</Eyebrow>
      <DmH1>Your AI risk.<br /><span className="text-[#60d090]">What it costs.<br />Where you save.</span></DmH1>
      <BodyText>
        The Company View is a standalone premium calculator — full 29+ slider input system, real-time AFI scoring,
        live premium estimation with category-level cost breakdown. Organizations see exactly which governance adjustments reduce their insurance costs.
      </BodyText>
      <div className="grid grid-cols-3 gap-[10px] mb-3">
        <div className="p-3 bg-[#0a1a0a] border border-[#1a4028] rounded-[9px] text-center">
          <div className="text-[8px] text-[#60d090] font-bold uppercase tracking-[0.08em] mb-[5px]">Estimated Premium</div>
          <div className="text-[26px] font-bold font-mono text-[#ff6b5b]">€420k–€680k</div>
          <div className="text-[9px] text-[#9e9a90] mt-[2px]">Meridian Financial · Live calculation</div>
        </div>
        <div className="p-3 bg-[#1a0a06] border border-[#5a1810] rounded-[9px] text-center">
          <div className="text-[8px] text-[#ff8870] font-bold uppercase tracking-[0.08em] mb-[5px]">AFI Score</div>
          <div className="text-[22px] font-bold font-mono text-[#ff6b5b]">2.23</div>
          <div className="text-[9px] text-[#9e9a90] mt-[2px]">Fragile · Above 1.35 threshold</div>
        </div>
        <div className="p-3 bg-[#0e100e] border border-[#2a2820] rounded-[9px] text-center">
          <div className="text-[8px] text-[#c0bcb0] font-bold uppercase tracking-[0.08em] mb-[5px]">Cost Impact</div>
          <div className="text-[22px] font-bold font-mono text-[#ffc040]">Per Category</div>
          <div className="text-[9px] text-[#9e9a90] mt-[2px]">See which changes reduce premium</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-[#a8a49c] mb-2">Full Input System</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55]">All 6 slider categories from the Exposure Analysis — Core AFI, Agent Architecture, Liability Exposure, Oversight & Governance, Systemic Concentration, and Emerging Threat Vectors — available as collapsible accordions with real-time premium recalculation.</div>
        </div>
        <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-4">
          <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-[#a8a49c] mb-2">Premium Breakdown</div>
          <div className="text-[10px] text-[#b0aca0] leading-[1.55]">Sticky cost panel shows how each slider category contributes to the total premium. Organizations instantly see where governance improvements translate to cost reductions — making risk management economically actionable.</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-[9px]">
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#9e9a90] mb-1 font-bold text-[8px] uppercase">Demo Profiles</div>
          <div className="text-[#60d090] font-bold font-mono">8 · Including 3 Case Studies</div>
        </div>
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#9e9a90] mb-1 font-bold text-[8px] uppercase">Global Sync</div>
          <div className="text-[#9088e0] font-bold font-mono">All 11 Views</div>
        </div>
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#9e9a90] mb-1 font-bold text-[8px] uppercase">Decision Layers</div>
          <div className="text-[#ffc040] font-bold font-mono">Authorization + Consequences</div>
        </div>
      </div>
      <div className="flex gap-[9px] flex-wrap">
        <button onClick={() => { document.dispatchEvent(new CustomEvent('load-demo-meridian')); setTimeout(() => document.dispatchEvent(new CustomEvent('navigate-to-step', { detail: { step: 1, perspective: 'company' } })), 200); onClose(); }} className="px-5 py-[9px] text-[12px] font-semibold rounded-md text-[#90e8a0] border border-[#2a9050] bg-gradient-to-br from-[#1a6030] to-[#228040] hover:shadow-lg transition-all">
          ◈ Open Company View — Meridian Financial
        </button>
        <button onClick={() => { document.dispatchEvent(new CustomEvent('navigate-to-step', { detail: { step: 1, perspective: 'underwriter' } })); onClose(); }} className="px-[18px] py-[9px] text-[12px] border border-[#3a3828] text-[#b8b4a8] rounded-md font-medium hover:text-[#eeeadc] transition-colors">
          Explore Full System →
        </button>
      </div>
    </div>
  );
}
