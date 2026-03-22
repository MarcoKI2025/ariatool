import React, { useState, useRef, useEffect } from 'react';
import { Band } from '@/lib/types';

interface InfoTipProps {
  text: string;
}

export function InfoTip({ text }: InfoTipProps) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && boxRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const box = boxRef.current;
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.bottom + 8}px`;
      const boxRect = box.getBoundingClientRect();
      if (boxRect.right > window.innerWidth) {
        box.style.left = `${window.innerWidth - boxRect.width - 20}px`;
      }
    }
  }, [show]);

  return (
    <span
      className="relative inline-flex items-center cursor-help ml-[5px]"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      ref={triggerRef}
    >
      <i className="w-[14px] h-[14px] rounded-full bg-muted border border-border text-muted-foreground text-[9px] font-bold not-italic inline-flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors">i</i>
      {show && (
        <div
          ref={boxRef}
          className="fixed z-[9000] bg-[hsl(220,16%,13%)] text-[hsl(220,10%,92%)] text-[11px] p-[10px_13px] rounded-lg w-[280px] leading-[1.6] border border-[hsl(220,10%,24%)] pointer-events-none"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
        >
          {text}
        </div>
      )}
    </span>
  );
}

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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className={`text-[26px] font-bold leading-[1.1] font-mono ${colorClass}`}>
        {value}
      </div>
      {sublabel && <div className="text-[11px] text-secondary-foreground mt-2">{sublabel}</div>}
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
    <div className={`bg-card border rounded-xl p-7 mb-5 ${highlight ? 'border-purple-border bg-purple-bg' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-3">
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
      {subtitle && <div className="text-[11px] text-muted-foreground mt-1 mb-4 leading-[1.6]" dangerouslySetInnerHTML={{ __html: subtitle }} />}
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
    <div className={`rounded-xl border p-7 mb-6 ${cls}`}>
      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[5px]">
        Executive Signal
      </div>
      <div className={`text-[18px] font-extrabold tracking-[0.01em] mb-5 ${titleColor}`}>
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
  scaleLabels?: Record<number, string>;
}

export function SliderRow({ label, value, onChange, min = 1, max = 5, description, tooltip, explainText, scaleLabels }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  // Position tooltip on hover
  React.useEffect(() => {
    if (showTooltip && tooltipRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const box = tooltipRef.current;
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.bottom + 8}px`;
      // Adjust if off-screen right
      const boxRect = box.getBoundingClientRect();
      if (boxRect.right > window.innerWidth) {
        box.style.left = `${window.innerWidth - boxRect.width - 20}px`;
      }
    }
  }, [showTooltip]);

  return (
    <div className="py-5 border-b border-border last:border-none last:pb-0">
      <div className="flex items-center gap-[6px] mb-[6px]">
        <span className="flex-1 text-[13px] font-medium text-foreground">
          {label}
          {tooltip && (
            <span
              className="relative inline-flex items-center cursor-help ml-[5px]"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              ref={triggerRef}
            >
              <i className="w-[14px] h-[14px] rounded-full bg-muted border border-border text-muted-foreground text-[9px] font-bold not-italic inline-flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors">i</i>
              {showTooltip && (
                <div
                  ref={tooltipRef}
                  className="fixed z-[9000] bg-[hsl(220,16%,13%)] text-[hsl(220,10%,92%)] text-[11px] p-[10px_13px] rounded-lg w-[280px] leading-[1.6] border border-[hsl(220,10%,24%)] pointer-events-none"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
                >
                  {tooltip}
                </div>
              )}
            </span>
          )}
        </span>
        <span className="min-w-[28px] h-[22px] rounded-[5px] bg-primary text-primary-foreground text-[11px] font-bold font-mono flex items-center justify-center px-[6px]">
          {value}
        </span>
      </div>
      <div className="text-[11px] text-muted-foreground mb-[6px]">{description}</div>
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
      {/* Scale labels */}
      {scaleLabels && (
        <div className="flex justify-between mt-[2px]">
          <span className="text-[9px] text-muted-foreground">{scaleLabels[min]}</span>
          <span className="text-[9px] text-muted-foreground font-medium">{scaleLabels[value]}</span>
          <span className="text-[9px] text-muted-foreground">{scaleLabels[max]}</span>
        </div>
      )}
      {explainText && (
        <div className="mt-2">
          <button className="text-[10px] text-primary hover:text-primary/80 font-medium cursor-pointer bg-transparent border-none" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'} Explain this
          </button>
          {expanded && (
            <div className="mt-1 text-[11px] text-secondary-foreground leading-[1.55] p-[8px_10px] bg-secondary border border-border rounded-md">{explainText}</div>
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
