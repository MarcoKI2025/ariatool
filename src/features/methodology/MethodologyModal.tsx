import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { FileText, Download, BookOpen, Scale, Shield, BarChart3 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    title: 'Authority Fragility Index (AFI)',
    content: `The AFI measures the structural dependency of an organisation on autonomous AI systems through five orthogonal components:

• DR (Delegation Ratio): Degree of autonomous decision-making, amplified by multi-agent orchestration and attenuated by human checkpoints.
• JD (Justificatory Density): Quality of oversight and governance reversibility mechanisms.
• RC (Reversibility Cost): Structural cost of unwinding AI dependencies, including sunset policy, switching cost, persistent memory, and concentration penalties.
• CD (Correlation Density): Breadth and depth of AI integration across operational workflows, including tool-call authority.
• NA (Normalisation Anchor): Industry-calibrated baseline (fixed at 0.50).

Formula: AFI = (DR^w_DR × RC^w_RC × CD^w_CD) / (JD^w_JD × NA^w_NA + ε)

Where elasticity exponents w default to 1.0 (linear) and ε = 0.001 prevents division by zero.`,
  },
  {
    icon: <Scale className="w-4 h-4" />,
    title: 'Band Classification & Decision Logic',
    content: `AFI scores map to three regulatory bands:

• Stable (AFI < 0.85): Standard underwriting terms. Reversible AI adoption with adequate governance.
• Sensitive (0.85 ≤ AFI < 1.35): Conditional review required. Governance gaps identified but remediable.
• Fragile (AFI ≥ 1.35): Escalate to committee. Structural dependency exceeds safe thresholds.

Decision classes follow Lloyd's AI/Tech-E&O Guidelines 2024-25:
• Approved — Standard terms, annual review
• Conditional Review — Enhanced monitoring, quarterly attestation
• Escalate to Committee — Board-level review, mandatory conditions
• Escalate to Committee — Board-level review, mandatory conditions before coverage`,
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: 'Loss Envelope Methodology',
    content: `Market-calibrated loss model based on:

• Anchor: €2.8M median AI operational loss (Financial Services baseline)
• Governance premium: 1 + min(0.80, AFI × 0.45)
• Sector multipliers: Financial Services 1.0×, Healthcare 1.2×, Manufacturing 0.85×, etc.
• Size & revenue adjustments: Larger organisations carry higher absolute exposure

Stress scenarios:
• Expected Loss: Anchor × AFI × govPremium × sectorMult × sizeMult × revenueMult
• Stress Loss: Expected × 3.4× (Munich Re correlated event factor)
• Tail Loss (99th %ile): Expected × 10.8× (EIOPA systemic stress)
• Portfolio Exposure: Tail × 6.2× (Lloyd's aggregation model, 8-15 entities)

Premium estimation applies ALRI loading (0-80%) on top of AFI-adjusted base rates.`,
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: 'Supplementary Risk Indices',
    content: `Four supplementary indices provide dimensional risk analysis:

AGRI (Agentic Risk Index): Weights multi-agent orchestration (35%), tool-call authority (30%), persistent memory (20%), and inverse human checkpoints (15%).

ALRI (AI Liability Risk Index): Weighted composite of 9 liability vectors calibrated to 2025-26 claims frequency: hallucination (20%), model drift (16%), deepfake fraud (16%), prompt injection (14%), algorithmic bias (12%), shadow AI (7%), data integrity (6%), explainability (5%), ESG/carbon (4%).

SCRI (Systemic Concentration Risk Index): Inverse diversity measure across cloud provider (30%), model provider (25%), GPU concentration (25%), and cross-vendor contagion (20%).

ECI (Existence Cost of Intelligence): 4-tier classification from Reversible Tool (Tier 0) to Critical Infrastructure (Tier 3), mapping governance obligations to dependency depth.`,
  },
  {
    icon: <FileText className="w-4 h-4" />,
    title: 'Regulatory & Market Alignment',
    content: `This framework is calibrated against:

• EU AI Act (2024): Annex III high-risk classification mapping
• EIOPA GenAI Survey (Q4 2025): Supervisory expectations for AI in insurance
• Lloyd's AI/Tech-E&O Guidelines (2024-25): Underwriting standards for AI-adjacent risks
• Munich Re Q4 2025 Emerging Risk Report: Stress factors and correlation matrices
• Swiss Re Sigma AI Addendum (2025): Market sizing and adoption curves
• NIST AI RMF 1.0: Risk management framework mapping
• ISO/IEC 42001: AI management system requirements
• CSRD (2025-2026): ESG and carbon liability from AI compute

Model assumptions are documented in the Model Governance section (Step 6) and subject to annual recalibration.`,
  },
];

export function MethodologyModal({ open, onOpenChange }: Props) {
  const handleDownloadTxt = () => {
    const textContent = SECTIONS.map(s =>
      `${'='.repeat(60)}\n${s.title}\n${'='.repeat(60)}\n\n${s.content}\n\n`
    ).join('');

    const fullDoc = `AI GOVERNANCE RISK ENGINE — METHODOLOGY WHITEPAPER\nVersion 4.3.0 · ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}\n\n${textContent}\n\n${'='.repeat(60)}\nDISCLAIMER\n${'='.repeat(60)}\n\nThis document is provided for informational purposes only and does not constitute actuarial advice, legal guidance, or regulatory compliance certification. All models, formulas, and thresholds are subject to annual recalibration based on emerging market data. Users should consult qualified actuaries and legal counsel before making underwriting decisions based on this framework.\n\n© ${new Date().getFullYear()} AI Governance Risk Engine. All rights reserved.`;

    const blob = new Blob([fullDoc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Governance_Methodology_v4.3.0_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const a = document.createElement('a');
    a.href = '/documents/ARIA_Whitepaper_Kindermann_2026.pdf';
    a.download = 'When_AI_Becomes_Structurally_Uninsurable_Kindermann_2026.pdf';
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Methodology & Whitepaper
          </DialogTitle>
          <DialogDescription>
            Complete technical documentation of the AI Governance Risk Engine v4.3.0
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {SECTIONS.map((section, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-primary">{section.icon}</div>
                <h3 className="text-[13px] font-semibold text-foreground">{section.title}</h3>
              </div>
              <pre className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans bg-secondary rounded-lg p-4 border border-border">
                {section.content}
              </pre>
            </div>
          ))}

          {/* Downloads */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Research Paper (PDF)
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-[12px] font-semibold hover:bg-secondary/80 transition-colors border border-border"
            >
              <FileText className="w-4 h-4" />
              Download Methodology (.txt)
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Research paper: "When AI Becomes Structurally Uninsurable" — Kindermann, March 2026
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
