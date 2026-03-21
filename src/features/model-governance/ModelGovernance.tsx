import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { SectionCard, LockedState } from '@/components/shared/UIComponents';

export function ModelGovernance() {
  const { state, setActiveStep } = useApp();
  const { analysisComplete, results, inputs } = state;

  if (!analysisComplete || !results) {
    return <LockedState title="Model Governance Locked" description="Complete the Exposure Analysis to view methodology, assumptions, limitations, and the governance framework." onAction={() => setActiveStep(1)} actionLabel="Go to Exposure Analysis" />;
  }

  const sections = [
    {
      title: 'Scope & Purpose',
      content: 'This framework provides a structured governance assessment of AI deployment risk. It identifies structural risks not captured by traditional compliance checklists or standard underwriting models — specifically: continuation risk, dependency lock-in, governance fragility, and cross-system propagation. The framework outputs directional signals for committee review, not binding actuarial figures.',
    },
    {
      title: 'Assumptions',
      items: [
        'All inputs are self-attested by the deploying organisation',
        'Sector calibration uses market-average risk profiles from Lloyd\'s AI Underwriting Framework 2024-25',
        'AFI thresholds (Stable <0.85, Sensitive <1.35, Fragile ≥1.35) are calibrated to EU/Lloyd\'s market baseline',
        'Loss figures are market-calibrated heuristics, not actuarially certified projections',
        'Provider concentration is assessed at the entity level, not portfolio level',
      ],
    },
    {
      title: 'Non-Goals',
      items: [
        'This is not a compliance certification or regulatory filing',
        'This is not legal advice or actuarial certification',
        'This does not replace professional underwriting judgment',
        'This does not validate the accuracy of self-attested inputs',
        'This is not a security assessment or penetration test',
      ],
    },
    {
      title: 'Limitations',
      items: [
        'Self-attested inputs may under- or over-state actual deployment characteristics',
        'Model assumes current deployment profile is static — does not account for planned changes',
        'Concentration analysis is limited to providers explicitly declared',
        'Loss envelope uses market-calibrated proxies, not entity-specific actuarial models',
        'Framework does not capture all possible risk dimensions (e.g., data quality, model bias)',
        'Temporal validity: Assessment reflects point-in-time profile. Material changes trigger mandatory re-assessment',
      ],
    },
    {
      title: 'Drift Considerations',
      content: 'AI systems evolve continuously through model updates, provider changes, integration expansions, and workflow modifications. Each change potentially alters the structural risk profile without triggering governance review. This framework recommends quarterly re-assessment as minimum cadence, with immediate re-assessment on any material structural change (provider change, autonomy level increase, integration expansion, or ownership change).',
    },
    {
      title: 'Revision Cadence',
      content: 'The AGAF framework itself is subject to revision. Current version: v3.0. Framework updates are driven by: (1) regulatory developments (EU AI Act implementation timeline), (2) market calibration data (Lloyd\'s, Munich Re, Swiss Re loss data), (3) emerging risk patterns from deployed AI systems, and (4) feedback from underwriting committees and risk officers.',
    },
    {
      title: 'Confidence Layer',
      content: `Current assessment confidence: ${results.band === 'Fragile' ? 'Low — committee escalation required' : results.band === 'Sensitive' ? 'Low-Medium — elevated signals require review' : 'Medium — governance signals within range'}. Confidence is constrained by self-attestation, point-in-time assessment, and the inherent uncertainty of structural AI risk modelling. All outputs should be treated as directional signals for committee discussion, not definitive risk measurements.`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 6 of 6 · Framework</div>
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Model Governance</h1>
        <p className="text-[13px] text-secondary-foreground max-w-[580px] leading-relaxed">
          Methodology, assumptions, limitations, and roadmap for the AI Governance Assessment Framework.
        </p>
      </div>

      {/* Dynamic governance context */}
      <div className="bg-secondary border border-border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Declared Industry</div>
            <div className="text-[12px] text-stable font-medium">{inputs.industry} · Calibrated to EU/Lloyd's market baseline</div>
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Frame Validity</div>
            <div className={`text-[12px] font-medium ${results.band === 'Stable' ? 'text-stable' : 'text-sensitive'}`}>
              {results.band === 'Fragile' ? 'Valid — but degradation risk elevated' :
               results.band === 'Sensitive' ? 'Valid under current conditions — governance cadence required' :
               'Valid — within normal operating parameters'}
            </div>
          </div>
        </div>
      </div>

      {sections.map((section, i) => (
        <SectionCard key={i} title={section.title} icon="◈">
          {section.content && (
            <p className="text-[12px] text-secondary-foreground leading-[1.65]">{section.content}</p>
          )}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-[12px] text-secondary-foreground leading-[1.5]">
                  <span className="text-primary mt-[2px] flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      ))}

      {/* Roadmap */}
      <SectionCard title="Roadmap / Future Enhancements" icon="🗺️">
        <div className="space-y-3">
          {[
            { phase: 'Q3 2026', title: 'Multi-entity portfolio aggregation', desc: 'Cross-entity correlation modelling for reinsurance treaty assessment' },
            { phase: 'Q4 2026', title: 'EU AI Act Art. 26 compliance layer', desc: 'Deployer obligation readiness scoring integrated with governance assessment' },
            { phase: 'Q1 2027', title: 'Audited input validation', desc: 'Replace self-attestation with system-derived parameters from architecture inventory' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-secondary border border-border rounded-lg">
              <span className="text-[9px] font-bold font-mono text-primary bg-purple-bg border border-purple-border px-2 py-[2px] rounded flex-shrink-0">{item.phase}</span>
              <div>
                <div className="text-[12px] font-semibold text-foreground">{item.title}</div>
                <div className="text-[10px] text-muted-foreground mt-[2px]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Disclaimers */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-primary mb-2">Important Disclaimers</div>
        <div className="space-y-2 text-[11px] text-muted-foreground leading-[1.6]">
          <p>• This is a <strong className="text-foreground">structured governance assessment only</strong> — not an actuarially certified risk model.</p>
          <p>• This does not constitute <strong className="text-foreground">legal advice</strong> and is not a substitute for professional legal counsel.</p>
          <p>• This is not a <strong className="text-foreground">compliance certification</strong> under any regulatory framework.</p>
          <p>• This is not a <strong className="text-foreground">regulatory filing</strong> and should not be submitted as such.</p>
          <p>• All outputs are <strong className="text-foreground">directional governance signals</strong> for committee review and discussion.</p>
        </div>
      </div>
    </div>
  );
}
