import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GapChart } from './charts/GapChart';
import { DriftChart } from './charts/DriftChart';
import { MeridianChart } from './charts/MeridianChart';
import { CompareChart } from './charts/CompareChart';
import { ScenariosChart } from './charts/ScenariosChart';
import { EUAIAChart } from './charts/EUAIAChart';

interface DemoPitchModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoPitchModal({ open, onClose }: DemoPitchModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 9;

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
              AI Governance Engine · Infrastructure Layer Demo
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
          {currentSlide === 8 && <Slide8 onClose={onClose} />}
          {currentSlide === 9 && <Slide9 onClose={onClose} />}
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
// SLIDE 3: THE ENGINE
// ═══════════════════════════════════════════════════════════════════

function Slide3() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Engine · Six Proprietary Assessment Constructs</Eyebrow>
      <DmH1>Not a dashboard.<br /><span className="text-[#4038b8]">A structured governance assessment engine.</span></DmH1>
      <BodyText>
        Six independent risk constructs — each grounded in published academic research, each computing a distinct governance signal.
        No other product combines these into a single structured committee intake flow.
      </BodyText>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <ConstructBox code="AFI" name="Authority Fragility Index" desc="Core structural metric. (DR × RC × CD) / (JD × NA). Measures governance stability — not compliance. >1.35 = Fragile. >0.85 = Sensitive." />
        <ConstructBox code="ECI" name="Existence Cost of Intelligence" desc="At what point is continued operation no longer a neutral technical state but a governance decision? ECI-3 = Critical Infrastructure. Exit is no longer feasible." />
        <ConstructBox code="MDR" name="Meaning Drift Risk" desc="Behavioral alignment decay. A system can pass all audits while gradually shifting its optimization target. Standard models: undetectable. This engine: quantified." />
        <ConstructBox code="RFSI" name="Reference Frame Stability" desc="How long is a governance assessment actually valid? An assessment made 18 months ago under different conditions is structurally invalid." />
        <ConstructBox code="RFS" name="Responsibility Fragmentation" desc='Quantifies "no clear owner" as a liability number. When RFS > 65 and stewardship clarity < 35, the system is operationally unowned.' />
        <ConstructBox code="IAT" name="Infrastructural AI Trigger" desc="7-criterion structured intake check for AI deployment lock-in patterns. Grounded in EU AI Act Art. 26/72 scope criteria." />
      </div>
      <InsightBox color="purple" title="Real Research Basis · Proprietary Operationalisation" text="Six structured assessment constructs operationalised from published academic work (Kindermann 2026) and grounded in NIST AI RMF 1.0, EIOPA AI Opinion August 2025, LMA E&O Guidelines 2025, EU AI Act 2024/1689, ISO/IEC 42001. The academic concepts are real. The operationalisation into measurable governance signals is the proprietary IP." />
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
      <DmH1><span className="text-[#ff4040]">ESCALATE TO COMMITTEE</span></DmH1>
      <p className="text-[18px] text-[#b8b4a8] font-medium mb-7">AFI 2.23 · ECI-3 · No clear owner · Governance signals above normal parameters</p>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <LossCell label="Assessment Signal" value="ESCALATE" src="Committee review required" color="#ff4040" />
        <LossCell label="Base Risk" value="Elevated" src="Structural governance exposure" color="#9c6200" />
        <LossCell label="Critical Risk Band" value="High" src="Provider concentration · Continuation risk" color="#b53020" />
        <LossCell label="Systemic Exposure" value="Critical" src="Correlated dependency · Multi-entity cluster" color="#f87070" />
      </div>
      <div className="bg-[#111108] border border-[#3a3828] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a8a49c] mb-3">
          Meridian Financial — Loss Envelope vs. Standard Actuarial Pricing (€M)
        </div>
        <MeridianChart />
      </div>
      <InsightBox color="red" title="What This Engine Found — That No Audit Did" text="Meridian passes all compliance checks. But: autonomous trading execution without re-authorisation since Q3 2023, single-provider OpenAI dependency creating critical correlation risk, Responsibility Fragmentation Score 84, Stewardship Clarity 18 — system is effectively unowned. Art. 72 post-market monitoring: not conducted." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5: THE PROCESS
// ═══════════════════════════════════════════════════════════════════

function Slide5() {
  const steps = [
    { num: '①', label: 'Exposure Profile', value: '12 parameters', color: '#9088e0', bg: '#1a1880', border: '#3830a8' },
    { num: '②', label: 'AFI Engine', value: 'Fragility score', color: '#ffc040', bg: '#1a1200', border: '#5a4000' },
    { num: '③', label: 'Loss Model', value: '€M envelope', color: '#ff8070', bg: '#1a0808', border: '#5a2018' },
    { num: '④', label: 'Responsibility', value: 'Ownership map', color: '#c080e0', bg: '#180818', border: '#4a1848' },
    { num: '⑤', label: 'IAT Check', value: 'EU AI Act map', color: '#60d090', bg: '#0e2010', border: '#1a5030' },
    { num: '⑥', label: 'Verdict', value: 'ESCALATE', color: '#ff4040', bg: '#1a0808', border: '#800808' },
  ];

  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Process · From Input to Binding Verdict in Under 3 Minutes</Eyebrow>
      <DmH1>One structured profile.<br /><span className="text-[#9088e0]">Six computed outputs.</span></DmH1>
      <BodyText>
        The engine takes a single structured exposure profile and generates six independent risk outputs.
        Nothing is pre-filled. Every number is computed from the profile. Adjust one input: all outputs recalculate in real-time.
      </BodyText>
      <div className="grid grid-cols-6 gap-0 mb-5">
        {steps.map((s, i) => (
          <div key={i} className="text-center px-1 relative py-3">
            {i < steps.length - 1 && <span className="absolute right-[-8px] top-[38%] text-[#9e9a90] text-[13px]">→</span>}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] mx-auto mb-[7px] border-2" style={{ background: s.bg, borderColor: s.border, color: s.color }}>{s.num}</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.03em] text-[#b8b4a8] leading-[1.3] mb-1">{s.label}</div>
            <div className="text-[10px] font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
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
              <div className="text-[8px] text-[#585650] uppercase tracking-[0.05em]">{s.label}</div>
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
// SLIDE 7: EU AI ACT & REGULATORY TIMELINE
// ═══════════════════════════════════════════════════════════════════

function Slide7() {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#b53020">Regulatory Context · EU AI Act — The Liability Trigger Is Already Active</Eyebrow>
      <DmH1>€35M fines.<br /><span className="text-[#b53020]">Active since February 2025.</span></DmH1>
      <BodyText>
        The EU AI Act is already partially in force. Art. 5 penalties (up to €35M / 7% turnover) apply since February 2025.
        Art. 26 deployer obligations apply from August 2026. The compliance window is closing.
      </BodyText>
      <div className="bg-[#111108] border border-[#2e2c22] rounded-[10px] p-5 mb-4">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#585650] mb-3">
          EU AI Act Enforcement Timeline — Active Obligations & Penalty Exposure
        </div>
        <EUAIAChart />
      </div>
      <div className="grid grid-cols-3 gap-[10px] mb-4">
        <div className="bg-[#1a0808] border border-[#5a2018] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#b53020] uppercase tracking-[0.08em] mb-1">Art. 99 §3 · In Force Feb 2025</div>
          <div className="font-mono text-[20px] font-bold text-[#ff4040] mb-1">€35M</div>
          <div className="text-[9px] text-[#686458] leading-[1.5]">Prohibited AI practices (Art. 5). Up to 7% global turnover. Applies now.</div>
        </div>
        <div className="bg-[#1a0c00] border border-[#5a3000] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#9c6200] uppercase tracking-[0.08em] mb-1">Art. 99 §4 · Applies Aug 2026</div>
          <div className="font-mono text-[20px] font-bold text-[#ffc040] mb-1">€15M</div>
          <div className="text-[9px] text-[#686458] leading-[1.5]">High-risk AI deployer obligations. Up to 3% global turnover.</div>
        </div>
        <div className="bg-[#0e1a28] border border-[#1a3858] rounded-lg p-3">
          <div className="text-[8px] font-bold text-[#4888c0] uppercase tracking-[0.08em] mb-1">Art. 113(3) · Aug 2025</div>
          <div className="font-mono text-[20px] font-bold text-[#80b8e0] mb-1">Full</div>
          <div className="text-[9px] text-[#686458] leading-[1.5]">Standardisation phase begins. Governance frameworks become regulatory baseline.</div>
        </div>
      </div>
      <InsightBox color="red" title="The Engine Connects Structure to Statutory Exposure" text="This is the only tool that maps structural fragility (AFI, RFS, IAT criteria) directly to EU AI Act penalty tiers. A Fragile classification with IAT criteria 6+7 triggered means active Art. 27 + Art. 72 violations — up to €15M, today, without a triggering incident." />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 8: THE DECISION / CTA
// ═══════════════════════════════════════════════════════════════════

function Slide8({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow>The Value Proposition · Why AGAF is Acquisition-Ready Infrastructure</Eyebrow>
      <DmH1>The governance assessment layer<br /><span className="text-[#9088e0]">your teams need today.</span></DmH1>
      <BodyText>
        The organisations that structure AI governance intake today will have the most defensible position when regulatory scrutiny
        reaches critical mass — and when the first major AI governance claims reach litigation.
      </BodyText>
      <div className="grid grid-cols-2 gap-[10px] mb-5">
        <ActionCard num={1} numColor="#b53020" title="Reinsurance & Large Insurance" desc="Munich Re, Swiss Re, Lloyd's syndicates — the AFI engine gives you the structural pricing signal that lets you quote AI governance risk for the first time." />
        <ActionCard num={2} numColor="#b53020" title="Enterprise Risk & Compliance" desc="For any organisation deploying AI at scale: this is the governance layer that proves you know what you own, who is responsible for it, and what it would cost to stop it." />
        <ActionCard num={3} numColor="#9c6200" title="Regulatory & Policy Bodies" desc="The EU AI Act creates obligations but no measurement framework for continuation risk or responsibility fragmentation. This engine operationalises what the regulation requires." />
        <ActionCard num={4} numColor="#9c6200" title="Risk & Governance Consulting" desc="The first client conversation that ends with a binding operational verdict — NOT APPROVED — is a conversation that redefines the engagement scope immediately." />
      </div>
      <div className="flex gap-[10px] justify-center mt-5 flex-wrap">
        <button onClick={() => { document.dispatchEvent(new CustomEvent('load-demo-meridian')); onClose(); }} className="px-7 py-3 bg-[#4038b8] text-white rounded-md text-[13px] font-semibold hover:bg-[#3030a0] transition-colors">
          ▶ Run Live Analysis — Meridian Financial
        </button>
        <button onClick={onClose} className="px-5 py-3 border border-[#2e2c22] text-[#888478] rounded-md text-[13px] font-semibold hover:text-[#e8e4d8] hover:border-[#4a4642] transition-colors">
          Explore the System →
        </button>
      </div>
      <div className="text-center text-[10px] text-[#585650] mt-2">
        Loads the full NOT APPROVED scenario · Real-time structural analysis · All 6 outputs computed live
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 9: COMPANY VIEW
// ═══════════════════════════════════════════════════════════════════

function Slide9({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <Eyebrow dotColor="#60d090">Company View · Financial Decision Engine</Eyebrow>
      <DmH1>Your AI risk.<br /><span className="text-[#60d090]">What it costs.<br />What grows if you do nothing.</span></DmH1>
      <BodyText>
        The Company View is a complete financial risk operating layer — AI Risk Index (0–100), annual loss exposure envelope,
        industry benchmark, 12-month growth trajectory, parametric policy triggers, and one-click ORSA export.
      </BodyText>
      <div className="grid grid-cols-3 gap-[10px] mb-3">
        <div className="p-3 bg-[#0a1a0a] border border-[#1a4028] rounded-[9px] text-center">
          <div className="text-[8px] text-[#60d090] font-bold uppercase tracking-[0.08em] mb-[5px]">AI Risk Index</div>
          <div className="text-[26px] font-bold font-mono text-[#ff6b5b]">72 / 100</div>
          <div className="text-[9px] text-[#686460] mt-[2px]">High Risk · Meridian Financial</div>
        </div>
        <div className="p-3 bg-[#1a0a06] border border-[#5a1810] rounded-[9px] text-center">
          <div className="text-[8px] text-[#ff8870] font-bold uppercase tracking-[0.08em] mb-[5px]">Annual Loss Exposure</div>
          <div className="text-[22px] font-bold font-mono text-[#ff6b5b]">€4.2M</div>
          <div className="text-[9px] text-[#686460] mt-[2px]">Tail risk: €14.3M</div>
        </div>
        <div className="p-3 bg-[#0e100e] border border-[#2a2820] rounded-[9px] text-center">
          <div className="text-[8px] text-[#c0bcb0] font-bold uppercase tracking-[0.08em] mb-[5px]">12-Month Growth</div>
          <div className="text-[22px] font-bold font-mono text-[#ffc040]">+35%</div>
          <div className="text-[9px] text-[#686460] mt-[2px]">If nothing changes</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-[9px]">
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#686460] mb-1 font-bold text-[8px] uppercase">AGRI — Agentic</div>
          <div className="text-[#ffc040] font-bold font-mono">61 · Elevated</div>
        </div>
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#686460] mb-1 font-bold text-[8px] uppercase">ALRI — Liability</div>
          <div className="text-[#ff6b5b] font-bold font-mono">74 · Critical</div>
        </div>
        <div className="p-2 bg-[#0e100e] border border-[#2a2820] rounded-[7px]">
          <div className="text-[#686460] mb-1 font-bold text-[8px] uppercase">SCRI — Systemic</div>
          <div className="text-[#ff6b5b] font-bold font-mono">68 · Critical</div>
        </div>
      </div>
      <div className="flex gap-[9px] flex-wrap">
        <button onClick={() => { document.dispatchEvent(new CustomEvent('load-demo-meridian')); onClose(); }} className="px-5 py-[9px] text-[12px] font-semibold rounded-md text-[#90e8a0] border border-[#2a9050] bg-gradient-to-br from-[#1a6030] to-[#228040] hover:shadow-lg transition-all">
          ◈ Open Company View — Meridian Financial
        </button>
        <button onClick={onClose} className="px-[18px] py-[9px] text-[12px] border border-[#2e2c22] text-[#888478] rounded-md font-medium hover:text-[#e8e4d8] transition-colors">
          Explore Company View →
        </button>
      </div>
    </div>
  );
}
