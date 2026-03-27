import React, { useState, useRef, useEffect } from 'react';
import { Band } from '@/lib/types';

/* ── InfoTip ── */
export function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && boxRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const box = boxRef.current;
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.bottom + 6}px`;
      if (box.getBoundingClientRect().right > window.innerWidth) {
        box.style.left = `${window.innerWidth - box.getBoundingClientRect().width - 16}px`;
      }
    }
  }, [show]);

  return (
    <span
      ref={triggerRef}
      className="tip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="tip-ic">i</span>
      {show && (
        <div ref={boxRef} className="tip-box" style={{ display: 'block' }}>
          {text}
        </div>
      )}
    </span>
  );
}

/* ── MetricCard ── */
interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  band?: Band;
  icon?: string;
}

export function MetricCard({ label, value, sublabel, band }: MetricCardProps) {
  const valueColor =
    band === 'Fragile' ? 'hsl(var(--fragile))' :
    band === 'Sensitive' ? 'hsl(var(--sensitive))' :
    band === 'Stable' ? 'hsl(var(--stable))' : 'hsl(var(--tx))';

  return (
    <div className="bg-card border border-border rounded-lg p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="label-xs mb-1.5">{label}</div>
      <div
        className="text-[26px] font-bold metric-value leading-none"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-[11px] mt-1" style={{ color: 'hsl(var(--t2))' }}>{sublabel}</div>
      )}
    </div>
  );
}

/* ── BandBadge ── */
export function BandBadge({ band, size = 'sm' }: { band: Band; size?: 'sm' | 'md' }) {
  const styles: Record<Band, React.CSSProperties> = {
    Stable: { background: 'hsl(var(--stable-bg))', color: 'hsl(var(--stable))', border: '1px solid hsl(var(--stable-border))' },
    Sensitive: { background: 'hsl(var(--sensitive-bg))', color: 'hsl(var(--sensitive))', border: '1px solid hsl(var(--sensitive-border))' },
    Fragile: { background: 'hsl(var(--fragile-bg))', color: 'hsl(var(--fragile))', border: '1px solid hsl(var(--fragile-border))' },
  };
  const sz = size === 'md' ? 'text-[11px] px-3 py-1' : 'text-[10px] px-2 py-0.5';
  return (
    <span className={`inline-flex items-center rounded font-bold uppercase tracking-wide ${sz}`} style={styles[band]}>
      {band}
    </span>
  );
}

/* ── SectionCard ── */
interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  icon?: string;
  badgeText?: string;
  confidenceBadge?: string;
  action?: React.ReactNode;
}

export function SectionCard({ title, subtitle, children, className = '', highlight, icon, badgeText, confidenceBadge, action }: SectionCardProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 mb-4 ${highlight ? 'border-primary/30 bg-primary/5' : ''} ${className}`} style={{ boxShadow: 'var(--shadow-card)' }}>
      {(title || subtitle) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <div className="label-xs mb-1 flex items-center gap-1.5">{icon && <span>{icon}</span>}{title}</div>}
            {subtitle && <div className="text-[12px]" style={{ color: 'hsl(var(--t2))' }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {badgeText && (
              <span className="text-[9px] font-semibold text-muted-foreground px-[7px] py-[2px] bg-secondary border border-border rounded">{badgeText}</span>
            )}
            {confidenceBadge && (
              <span className="text-[8px] font-bold px-[7px] py-[2px] bg-primary/10 text-primary border border-primary/20 rounded">◈ {confidenceBadge}</span>
            )}
            {action && action}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

/* ── Banner ── */
interface BannerProps {
  band: Band;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Banner({ band, title, subtitle, children }: BannerProps) {
  const borderColor =
    band === 'Fragile' ? 'hsl(var(--fragile))' :
    band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))';
  const textColor =
    band === 'Fragile' ? 'hsl(var(--fragile))' :
    band === 'Sensitive' ? 'hsl(var(--sensitive))' : 'hsl(var(--stable))';

  return (
    <div className="rounded-lg p-6 mb-4 border bg-card" style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}>
      <div className="label-xs mb-2">Underwriting Decision</div>
      <div className="text-[18px] font-bold tracking-tight mb-1" style={{ color: textColor }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-[12px] mb-3" style={{ color: 'hsl(var(--t2))' }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── SliderRow ── */
interface SliderRowProps {
  label: string;
  description?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  explainText?: string;
  scaleLabels?: Record<number, string>;
}

export function SliderRow({ label, description, value, onChange, min = 1, max = 5, step = 1, tooltip, explainText, scaleLabels }: SliderRowProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-3 border-b border-border last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium" style={{ color: 'hsl(var(--tx))' }}>{label}</span>
            {tooltip && <InfoTip text={tooltip} />}
          </div>
          {description && (
            <div className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--t3))' }}>
              {description}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-0.5 flex-shrink-0">
          <span className="text-[16px] font-bold font-mono" style={{ color: 'hsl(var(--tx))' }}>{value}</span>
          <span className="text-[11px]" style={{ color: 'hsl(var(--t3))' }}>/5</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${pct}%`, accentColor: 'hsl(var(--primary))' } as React.CSSProperties}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      />
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
            <div className="mt-1 text-[11px] text-muted-foreground leading-[1.55] p-[8px_10px] bg-secondary border border-border rounded-md">{explainText}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── LockedState ── */
export function LockedState({ title, description, onAction, actionLabel }: {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center text-[22px] mb-4"
        style={{ background: 'hsl(var(--s2))', border: '1px solid hsl(var(--bd))' }}
      >
        🔒
      </div>
      <div className="text-[16px] font-bold mb-2" style={{ color: 'hsl(var(--tx))' }}>{title}</div>
      <div className="text-[13px] max-w-md mb-6" style={{ color: 'hsl(var(--t2))' }}>
        {description}
      </div>
      {onAction && (
        <button onClick={onAction} className="btn-p">
          {actionLabel || 'Continue'}
        </button>
      )}
    </div>
  );
}
