import React from 'react';

interface LiveIndicatorProps {
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function LiveIndicator({ 
  label = "Live sync active", 
  size = 'md',
  className = '' 
}: LiveIndicatorProps) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const fontSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';
  
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className={`${dotSize} rounded-full bg-stable animate-pulse`} />
      <span className={`${fontSize} text-stable font-medium`}>
        {label}
      </span>
    </div>
  );
}
