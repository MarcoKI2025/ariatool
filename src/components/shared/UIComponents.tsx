import React, { useState } from 'react';
import { Band } from '@/lib/types';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  band?: Band;
  icon?: string;
}

export function MetricCard({ label, value, sublabel, band, icon }: MetricCardProps) {
  const colorClass = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : band === 'Stable' ? 'text-stable' : 'text-foreground';

  return (
    <div className="bg-card border border-border rounded-[10px] p-4">
      <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-[6px] flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className={`text-[26px] font-bold leading-[1.1] font-mono ${colorClass}`}>
        {value}
      </div>
      {sublabel && <div className="text-[11px] text-secondary-foreground mt-1">{sublabel}</div>}
    </div>
  );
}

interface BandBadgeProps {
  band: Band;
  size?: 'sm' | 'md';
}

export function BandBadge({ band, size = 'sm' }: BandBadgeProps) {
  const cls = band === 'Fragile' ? 'badge-fragile' : band === 'Sensitive' ? 'badge-sensitive' : 'badge-stable';
  const sz = size === 'md' ? 'text-[11px] px-3 py-1' : 'text-[9px] px-[7px] py-[2px]';
  return (
    <span className={`inline-flex items-center font-bold tracking-[0.05em] uppercase rounded ${cls} ${sz}`}>
      {band}
    </span>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  highlight?: boolean;
  icon?: string;
  badgeText?: string;
  confidenceBadge?: string;
}

export function SectionCard({ title, subtitle, children, highlight, icon, badgeText, confidenceBadge }: SectionCardProps) {
  return (
    <div className={`bg-card border rounded-[10px] p-5 mb-[14px] ${highlight ? 'border-purple-border bg-purple-bg' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-[10px] font-bold tracking-[0.09em] uppercase text-secondary-foreground flex items-center gap-[6px]">
          {icon && <span>{icon}</span>}
          {title}
        </div>
        <div className="flex items-center gap-2">
          {badgeText && (
            <span className="text-[9px] font-semibold text-muted-foreground px-[7px] py-[2px] bg-secondary border border-border rounded">{badgeText}</span>
          )}
          {confidenceBadge && (
            <span className="text-[8px] font-bold px-[7px] py-[2px] bg-purple-bg text-primary border border-purple-border rounded">◈ {confidenceBadge}</span>
          )}
        </div>
      </div>
      {subtitle && <div className="text-[11px] text-muted-foreground mt-[3px] mb-[10px] leading-[1.5]" dangerouslySetInnerHTML={{ __html: subtitle }} />}
      {children}
    </div>
  );
}

interface BannerProps {
  band: Band;
  title: string;
  children: React.ReactNode;
}

export function Banner({ band, title, children }: BannerProps) {
  const cls = band === 'Fragile'
    ? 'bg-fragile-bg border-fragile-border'
    : band === 'Sensitive'
    ? 'bg-sensitive-bg border-sensitive-border'
    : 'bg-stable-bg border-stable-border';
  const titleColor = band === 'Fragile' ? 'text-fragile' : band === 'Sensitive' ? 'text-sensitive' : 'text-stable';

  return (
    <div className={`rounded-[10px] border p-5 mb-4 ${cls}`}>
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[5px]">
        Executive Signal
      </div>
      <div className={`text-[18px] font-extrabold tracking-[0.01em] mb-[14px] ${titleColor}`}>
        {title}
      </div>
      {children}
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  description: string;
  tooltip?: string;
  explainText?: string;
}

export function SliderRow({ label, value, onChange, min = 1, max = 5, description, tooltip, explainText }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-[14px] border-b border-border last:border-none last:pb-0">
      <div className="flex items-center gap-[6px] mb-[6px]">
        <span className="flex-1 text-[13px] font-medium text-foreground">
          {label}
          {tooltip && (
            <span className="tip">
              <i className="tip-ic">i</i>
              <span className="tip-box">{tooltip}</span>
            </span>
          )}
        </span>
        <span className="min-w-[28px] h-[22px] rounded-[5px] bg-primary text-primary-foreground text-[11px] font-bold font-mono flex items-center justify-center px-[6px]">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
        className="w-full my-[6px]"
      />
      <div className="text-[11px] text-muted-foreground">{description}</div>
      {explainText && (
        <div className="expand-wrap">
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'} Explain this
          </button>
          {expanded && (
            <div className="expand-content">{explainText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function LockedState({ title, description, onAction, actionLabel }: {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4 opacity-30">🔒</div>
      <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
      <p className="text-[13px] text-muted-foreground max-w-md mb-6 leading-relaxed">{description}</p>
      {onAction && (
        <button onClick={onAction} className="px-6 py-[10px] bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors">
          {actionLabel || 'Run Analysis'}
        </button>
      )}
    </div>
  );
}
