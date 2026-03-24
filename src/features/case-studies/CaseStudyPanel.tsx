import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { CASE_STUDIES, type CaseStudy } from '@/data/caseStudies';
import { computeFullAnalysis } from '@/lib/scoring';
import { SectionDivider } from '@/components/shared/SectionDivider';

export function CaseStudyPanel() {
  const { setInputs, runAnalysis, setPerspective } = useApp();
  const [preview, setPreview] = useState<CaseStudy | null>(null);
  const [previewResults, setPreviewResults] = useState<ReturnType<typeof computeFullAnalysis> | null>(null);

  const handlePreview = (cs: CaseStudy) => {
    setPreview(cs);
    setPreviewResults(computeFullAnalysis(cs.inputs));
  };

  const handleLoad = (cs: CaseStudy) => {
    setInputs(cs.inputs);
    setPerspective('underwriter');
    setTimeout(() => runAnalysis(), 100);
  };

  return (
    <>
      <SectionDivider title="Case Study Library" icon="📋" subtitle="8 realistic AI deployment profiles for benchmarking" />
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="mb-4">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">◈ Industry Case Studies</div>
          <div className="text-[15px] font-bold text-foreground">Realistic AI Deployment Profiles</div>
          <div className="text-[11px] text-secondary-foreground mt-1 leading-[1.5] max-w-[560px]">
            Pre-configured profiles based on real-world AI deployment patterns. Preview risk profiles or load into the analysis engine.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {CASE_STUDIES.map(cs => {
            const isActive = preview?.id === cs.id;
            return (
              <button
                key={cs.id}
                onClick={() => handlePreview(cs)}
                className={`p-3 border rounded-lg text-left transition-all hover:border-primary/50 ${
                  isActive ? 'border-primary bg-secondary' : 'border-border'
                }`}
              >
                <div className="text-[16px] mb-1">{cs.icon}</div>
                <div className="text-[11px] font-bold text-foreground leading-tight">{cs.name}</div>
                <div className="text-[9px] text-muted-foreground mt-1">{cs.sector}</div>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        {preview && previewResults && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px]">{preview.icon}</span>
                    <div className="text-[14px] font-bold text-foreground">{preview.name}</div>
                  </div>
                  <div className="text-[11px] text-secondary-foreground leading-[1.5] max-w-[500px]">{preview.description}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className={`text-[28px] font-bold font-mono ${previewResults.band === 'Fragile' ? 'text-fragile' : previewResults.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                    {previewResults.afi.toFixed(2)}
                  </div>
                  <div className={`text-[10px] font-bold ${previewResults.band === 'Fragile' ? 'text-fragile' : previewResults.band === 'Sensitive' ? 'text-sensitive' : 'text-stable'}`}>
                    {previewResults.band}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-border">
              {[
                { label: 'Structural Score', value: previewResults.structuralScore },
                { label: 'AGRI', value: previewResults.agri },
                { label: 'ALRI', value: previewResults.alri },
                { label: 'Composite Risk', value: previewResults.compositeRiskIndex },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-[18px] font-bold font-mono text-foreground">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-b border-border">
              <div className="text-[9px] font-bold tracking-wider uppercase text-fragile mb-1">Key Vulnerability</div>
              <div className="text-[11px] text-foreground leading-[1.5]">{preview.keyVulnerability}</div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-stable mt-3 mb-1">Mitigation Hint</div>
              <div className="text-[11px] text-foreground leading-[1.5]">{preview.mitigationHint}</div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <button
                onClick={() => handleLoad(preview)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold hover:bg-primary/90 transition-colors"
              >
                Load into Analysis
              </button>
              <button
                onClick={() => { setPreview(null); setPreviewResults(null); }}
                className="px-4 py-2 border border-border rounded-lg text-[11px] font-semibold hover:bg-secondary transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-[9px] text-muted-foreground leading-[1.5]">
            ⓘ Case studies are synthetic profiles based on real-world AI deployment patterns. Loading a case study will replace your current input parameters.
          </div>
        </div>
      </div>
    </>
  );
}
