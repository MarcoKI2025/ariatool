import React from 'react';
import { useApp } from '@/hooks/useAppState';
import { DEMO_PROFILES } from '@/lib/demoData';

interface CaseFacts {
  company: string;
  date: string;
  location: string;
  whatHappened: string;
  rootCause: string;
  financialLoss: string;
  casualties?: string;
  outcome: string;
  mediaLinks?: { title: string; source: string; url: string }[];
}

const CASE_FACTS: Record<string, CaseFacts> = {
  'knight-capital': {
    company: 'Knight Capital Group',
    date: 'August 1, 2012',
    location: 'New York, USA',
    whatHappened: 'A software deployment error activated dormant trading code that sent millions of erratic orders into the stock market. In just 45 minutes, before traders could halt the system, Knight Capital suffered catastrophic losses that nearly bankrupted the company.',
    rootCause: 'Legacy code not removed before deploying new algorithm. No circuit breakers for abnormal trading volume. Zero human oversight during execution.',
    financialLoss: '€440 Million',
    outcome: 'Company forced into emergency €400M financing (dilutive). Acquired by competitor Getco 6 months later. Became textbook case of algorithmic trading risk.',
    mediaLinks: [
      { title: 'Knight Capital Trading Glitch — SEC Investigation', source: 'SEC Report', url: 'https://www.sec.gov/litigation/admin/2013/34-70694.pdf' },
      { title: 'How Knight Capital Lost $440M in 30 Minutes', source: 'Bloomberg', url: 'https://www.bloomberg.com/news/articles/2012-08-02/knight-shows-how-to-lose-440-million-in-30-minutes' },
    ],
  },
  'uber-atg': {
    company: 'Uber Technologies (ATG Division)',
    date: 'March 18, 2018',
    location: 'Tempe, Arizona, USA',
    whatHappened: 'An Uber autonomous test vehicle struck and killed pedestrian Elaine Herzberg (age 49) as she crossed the street at night. The AI perception system misclassified her multiple times and failed to brake. The safety driver was distracted, watching video on a phone.',
    rootCause: 'AI perception failure in edge case scenario. Uber had disabled Volvo\'s built-in emergency braking without adequate replacement. Ineffective human oversight (safety driver distracted).',
    financialLoss: '~€15 Million settlement + $2.3B program write-down',
    casualties: '1 death (Elaine Herzberg, age 49)',
    outcome: 'Arizona revoked Uber\'s autonomous testing license. Program terminated in state. Safety driver charged with negligent homicide. Industry-wide regulatory tightening.',
    mediaLinks: [
      { title: 'NTSB Accident Investigation Report', source: 'NTSB', url: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/HAR1903.pdf' },
      { title: 'Uber Self-Driving Car Death Investigation', source: 'The Guardian', url: 'https://www.theguardian.com/technology/2018/may/24/uber-self-driving-car-death-investigation' },
    ],
  },
  'amazon-hiring': {
    company: 'Amazon',
    date: 'Discovered 2018 (Used 2014–2018)',
    location: 'Global (Primarily USA)',
    whatHappened: 'Amazon developed a machine learning system to automate resume screening for technical roles. After 3+ years of internal use, audits revealed the AI systematically discriminated against women — downrating resumes containing "women\'s" keywords and graduates from all-women\'s colleges.',
    rootCause: 'Training data bias: 10 years of historical resumes reflected male-dominated tech industry. AI learned "male = good candidate" correlation. No bias testing pre-deployment.',
    financialLoss: 'Reputational damage + potential €50–100M class action exposure (avoided by cancelling)',
    outcome: 'Program cancelled before external lawsuit. National media coverage as landmark AI bias case study. Highlighted need for algorithmic accountability.',
    mediaLinks: [
      { title: 'Amazon Scraps Secret AI Recruiting Tool', source: 'Reuters', url: 'https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G' },
      { title: 'Algorithmic Hiring Bias Research', source: 'ACM Digital Library', url: 'https://dl.acm.org/doi/10.1145/3351095.3372828' },
    ],
  },
};

function findCaseId(companyName: string): string | null {
  const profile = DEMO_PROFILES.find(p => p.name === companyName && p.caseStudy);
  return profile ? profile.id : null;
}

export function RealCaseFactsCard() {
  const { state } = useApp();
  const caseId = findCaseId(state.inputs.companyName);
  if (!caseId) return null;
  const facts = CASE_FACTS[caseId];
  if (!facts) return null;

  return (
    <div className="rounded-xl border-2 border-fragile bg-fragile-bg/30 mb-5 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-fragile/30 bg-fragile-bg/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-fragile">Real-World AI Disaster</span>
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-fragile/15 text-fragile border border-fragile/25">Actual Case</span>
          </div>
          <div className="text-[11px] font-semibold text-foreground">{facts.company} — {facts.date}</div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Company', value: facts.company },
            { label: 'Date', value: facts.date },
            { label: 'Location', value: facts.location },
            { label: 'Total Loss', value: facts.financialLoss, highlight: true },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-2.5">
              <div className="text-[8px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">{item.label}</div>
              <div className={`text-[11px] font-semibold leading-tight ${item.highlight ? 'text-fragile' : 'text-foreground'}`}>{item.value}</div>
            </div>
          ))}
        </div>

        {facts.casualties && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fragile/10 border border-fragile/20">
            <span className="text-fragile text-sm">⊘</span>
            <span className="text-[11px] font-semibold text-fragile">{facts.casualties}</span>
          </div>
        )}

        {/* What Happened */}
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">What Happened</div>
          <div className="text-[11px] text-foreground leading-[1.65]">{facts.whatHappened}</div>
        </div>

        {/* Root Cause */}
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">Root Cause</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.65]">{facts.rootCause}</div>
        </div>

        {/* Outcome */}
        <div>
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">Outcome</div>
          <div className="text-[11px] text-secondary-foreground leading-[1.65]">{facts.outcome}</div>
        </div>

        {/* Media Links */}
        {facts.mediaLinks && facts.mediaLinks.length > 0 && (
          <div>
            <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Sources & Media Coverage</div>
            <div className="flex flex-wrap gap-2">
              {facts.mediaLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors text-[10px] group"
                >
                  <span>📄</span>
                  <span>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</span>
                    <span className="text-muted-foreground ml-1.5">— {link.source}</span>
                  </span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors ml-1">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ARIA Context */}
        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/15">
          <span className="text-primary text-sm mt-0.5">ℹ</span>
          <div className="text-[10px] text-secondary-foreground leading-[1.6]">
            <span className="font-semibold text-foreground">ARIA Retrospective Analysis:</span> The parameters below reflect {facts.company}'s actual AI system design and governance setup before this disaster occurred. ARIA's scoring demonstrates the framework would have identified critical risk factors that led to the failure.
          </div>
        </div>
      </div>
    </div>
  );
}

export function RealCaseAlert() {
  const { state } = useApp();
  const caseId = findCaseId(state.inputs.companyName);
  if (!caseId) return null;
  const facts = CASE_FACTS[caseId];
  if (!facts) return null;

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border-2 border-fragile/40 bg-fragile-bg/20 mb-4">
      <span className="text-fragile text-base mt-0.5">⚠️</span>
      <div>
        <div className="text-[11px] font-bold text-foreground">
          Real AI Disaster: {facts.company} ({facts.date})
        </div>
        <div className="text-[10px] text-secondary-foreground leading-[1.6] mt-0.5">
          {facts.financialLoss}{facts.casualties ? ` + ${facts.casualties}` : ''} · {facts.whatHappened.split('.')[0]}.
        </div>
      </div>
    </div>
  );
}
