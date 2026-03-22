import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GapChart } from './charts/GapChart';
import { DriftChart } from './charts/DriftChart';

interface DemoPitchModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoPitchModal({ open, onClose }: DemoPitchModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 8;

  // Reset slide on open
  useEffect(() => {
    if (open) setCurrentSlide(1);
  }, [open]);

  // Keyboard navigation
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

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-8">
      <div className="w-full max-w-[1400px] h-full max-h-[900px] bg-[#0e0d09] rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2e2c22]">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#585650]">
              AI Governance Engine · 3-Minute Pitch
            </div>
            <div className="text-[11px] font-mono text-[#888478]">
              Slide {currentSlide} of {totalSlides}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentSlide > 1 && (
              <button
                onClick={prevSlide}
                className="px-4 py-2 text-[11px] font-semibold text-[#888478] hover:text-[#e8e4d8] transition-colors rounded-md border border-[#2e2c22] hover:border-[#4a4642]"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-[11px] font-semibold text-[#888478] hover:text-[#e8e4d8] transition-colors rounded-md border border-[#2e2c22] hover:border-[#4a4642] flex items-center gap-1.5"
            >
              <X className="w-3 h-3" />
              Exit Demo
            </button>
            {currentSlide < totalSlides && (
              <button
                onClick={nextSlide}
                className="px-4 py-2 text-[11px] font-semibold text-white bg-[#4038b8] hover:bg-[#5048c8] rounded-md transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {currentSlide === 1 && <Slide1 />}
          {currentSlide === 2 && <Slide2 />}
          {currentSlide === 3 && <Slide3Placeholder />}
          {currentSlide === 4 && <Slide4Placeholder />}
          {currentSlide === 5 && <Slide5Placeholder />}
          {currentSlide === 6 && <Slide6Placeholder />}
          {currentSlide === 7 && <Slide7Placeholder />}
          {currentSlide === 8 && <Slide8Placeholder />}
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 py-4 border-t border-[#2e2c22]">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i + 1)}
              className={`h-2 rounded-full transition-all ${
                i + 1 === currentSlide
                  ? 'bg-[#4038b8] w-6'
                  : 'bg-[#2e2c22] hover:bg-[#4a4642] w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function StatBox({ value, valueColor, label, sublabel }: { value: string; valueColor: string; label: string; sublabel: string }) {
  return (
    <div className="bg-[#111108] border border-[#2e2c22] rounded-xl p-5 text-center">
      <div className="text-[28px] font-bold font-mono leading-none mb-2" style={{ color: valueColor }}>{value}</div>
      <div className="text-[11px] font-bold text-[#e8e4d8] mb-1">{label}</div>
      <div className="text-[9px] text-[#585650]">{sublabel}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-[#888478]">{label}</span>
    </div>
  );
}

function InsightBox({ color, title, text }: { color: string; title: string; text: string }) {
  const borderColor = color === 'red' ? '#5a2018' : color === 'amber' ? '#5a4000' : '#3830a8';
  const bgColor = color === 'red' ? '#1a0808' : color === 'amber' ? '#1a1200' : '#1a1880';
  const titleColor = color === 'red' ? '#ff8070' : color === 'amber' ? '#ffc040' : '#9088e0';

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: titleColor }}>
        {title}
      </div>
      <div className="text-[10px] text-[#888478] leading-[1.6]">{text}</div>
    </div>
  );
}

function RiskCard({ icon, title, color, desc, metric, metricDesc }: {
  icon: string; title: string; color: string; desc: string; metric: string; metricDesc: string;
}) {
  return (
    <div className="bg-[#111108] border border-[#2e2c22] rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]" style={{ backgroundColor: color + '20', color }}>
          {icon}
        </div>
        <div className="text-[12px] font-bold text-[#e8e4d8]">{title}</div>
      </div>
      <div className="text-[10px] text-[#888478] leading-[1.6] flex-1 mb-4">{desc}</div>
      <div className="border-t border-[#2e2c22] pt-3">
        <div className="text-[18px] font-bold font-mono" style={{ color }}>{metric}</div>
        <div className="text-[9px] text-[#585650]">{metricDesc}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1: THE PROBLEM
// ═══════════════════════════════════════════════════════════════════

function Slide1() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#b53020]" />
        <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#888478]">
          The Problem · Emerging AI Risk Dimensions
        </span>
      </div>

      <h1 className="text-[42px] font-bold text-[#e8e4d8] mb-6 leading-[1.1]">
        AI creates <span className="text-[#b53020]">new risk categories</span><br />
        not captured in traditional models.
      </h1>

      <p className="text-[14px] text-[#888478] leading-[1.7] mb-8 max-w-[900px]">
        Swiss Re sigma insights 01/2026: "AI introduces emerging risk dimensions that do not fit neatly
        within traditional insurance boundaries." Standard underwriting models miss continuation risk,
        responsibility fragmentation, and provider concentration — the structural dimensions this engine
        quantifies.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatBox value="New Risk" valueColor="#b53020" label="Asset Classes Emerging" sublabel="Data Centres, HPC, AI Infrastructure" />
        <StatBox value="Provider" valueColor="#b53020" label="Concentration Risk" sublabel="Systemic & accumulation exposure" />
        <StatBox value="Governance" valueColor="#ffc040" label="Gap Dimensions" sublabel="Continuation · Responsibility · Drift" />
      </div>

      <div className="bg-[#111108] border border-[#2e2c22] rounded-xl p-6 mb-6">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#585650] mb-4">
          Risk Characterization Gap — Traditional Models vs. Structural Governance Assessment
        </div>
        <GapChart />
        <div className="flex gap-4 mt-3 flex-wrap">
          <Legend color="#4038b8" label="Traditional risk models" />
          <Legend color="#b53020" label="Structural exposure (this engine)" />
        </div>
      </div>

      <InsightBox
        color="red"
        title="Why Standard Models Fail"
        text="Point-in-time audits. Snapshot compliance checks. Incident-based pricing. None of these capture what actually drives AI losses: a system that persists beyond its governance mandate, with no named owner, in a dependency structure that cannot be exited without operational collapse."
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2: THREE INVISIBLE RISKS
// ═══════════════════════════════════════════════════════════════════

function Slide2() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#b53020]" />
        <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#888478]">
          The Gap · Three Risks That Exist in Every AI Deployment Right Now
        </span>
      </div>

      <h1 className="text-[42px] font-bold text-[#e8e4d8] mb-6 leading-[1.1]">
        Compliant. Audited.<br />
        <span className="text-[#b53020]">Still uninsurable.</span>
      </h1>

      <p className="text-[14px] text-[#888478] leading-[1.7] mb-8 max-w-[900px]">
        A system can pass every compliance check, satisfy every EU AI Act requirement, and still carry
        structural exposure that no standard underwriting framework has ever priced. Here are the three
        mechanisms — and the real numbers behind them.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <RiskCard
          icon="⊘"
          title="Continuation Risk"
          color="#b53020"
          desc="A system persists by default — without re-authorisation. Liability accumulates daily. Industry assessments indicate a majority of enterprise AI deployments lack formal re-authorisation mechanisms."
          metric="Most"
          metricDesc="enterprise AI lacks re-authorisation"
        />
        <RiskCard
          icon="⟲"
          title="Behavioral Drift"
          color="#9c6200"
          desc="The system shifts what it optimizes for — silently. Observable: Rarely. Detectable by audit: No. Detectable by this engine: Yes."
          metric="Silent"
          metricDesc="undetectable by standard audit"
        />
        <RiskCard
          icon="⊗"
          title="Responsibility Collapse"
          color="#780840"
          desc="Deployer → provider → regulator. No single actor owns full accountability. Responsibility attribution in AI-related liability events is structurally contested."
          metric="Structural"
          metricDesc="accountability gap in AI liability"
        />
      </div>

      <div className="bg-[#111108] border border-[#2e2c22] rounded-xl p-6">
        <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#585650] mb-4">
          Structural Exposure Accumulation Over Time — Without Governance (indexed, 100 = deployment)
        </div>
        <DriftChart />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PLACEHOLDER SLIDES 3-8 (to be replaced with full content)
// ═══════════════════════════════════════════════════════════════════

function SlidePlaceholder({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#585650] mb-4">
        Slide {number}
      </div>
      <h1 className="text-[42px] font-bold text-[#e8e4d8] mb-4 leading-[1.1] text-center">{title}</h1>
      <p className="text-[14px] text-[#888478] text-center">{subtitle}</p>
    </div>
  );
}

function Slide3Placeholder() {
  return <SlidePlaceholder number={3} title="The Engine" subtitle="Not a dashboard. A structured governance assessment engine." />;
}
function Slide4Placeholder() {
  return <SlidePlaceholder number={4} title="Live Example" subtitle="Meridian Financial Group — AFI 1.72, Fragile classification." />;
}
function Slide5Placeholder() {
  return <SlidePlaceholder number={5} title="6-Step Assessment" subtitle="Each step builds on the previous — creating a coherent governance signal." />;
}
function Slide6Placeholder() {
  return <SlidePlaceholder number={6} title="Portfolio-Level Risk" subtitle="When multiple insureds share AI infrastructure, a single disruption creates simultaneous claims." />;
}
function Slide7Placeholder() {
  return <SlidePlaceholder number={7} title="Buyer Value" subtitle="From cost centre to competitive advantage." />;
}
function Slide8Placeholder() {
  return <SlidePlaceholder number={8} title="Next Steps" subtitle="Ready to assess your portfolio?" />;
}
