import React from 'react';

interface SectionDividerProps {
  title: string;
  subtitle?: string;
  step?: string;
  icon?: string;
}

export function SectionDivider({ title, subtitle, step, icon }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-4 first:mt-0">
      {icon && (
        <span className="text-base flex-shrink-0">{icon}</span>
      )}
      <div className="flex-shrink-0">
        {step && (
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-primary mb-0.5">{step}</div>
        )}
        <div className="text-[13px] font-bold text-foreground tracking-tight">{title}</div>
        {subtitle && (
          <div className="text-[10px] text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
