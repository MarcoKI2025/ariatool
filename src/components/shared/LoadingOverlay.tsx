import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  steps?: string[];
}

const DEFAULT_STEPS = [
  'Initializing Analysis...',
  'Computing AFI parameters...',
  'Running scenario simulations...',
  'Generating risk profiles...',
  'Finalizing outputs...'
];

const SUB_TEXTS = [
  'Structural risk modeling engine',
  'Authority Fragility Index calculation',
  'Stress testing framework',
  'Loss envelope analysis',
  'Board-level summary generation'
];

export function LoadingOverlay({ isVisible, steps }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeSteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev >= activeSteps.length - 1 ? prev : prev + 1));
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, activeSteps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(20, 20, 16, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-card border border-border rounded-[14px] p-8 text-center min-w-[320px] max-w-[380px]" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        {/* Spinner */}
        <div className="w-[34px] h-[34px] border-[3px] border-border border-t-primary rounded-full mx-auto mb-[18px]" style={{ animation: 'spin 0.8s linear infinite' }} />
        
        <div className="text-[14px] font-semibold text-foreground min-h-[22px] mb-1">
          {activeSteps[currentStep]}
        </div>
        <div className="text-[11px] text-muted-foreground min-h-[16px]">
          {SUB_TEXTS[currentStep] || ''}
        </div>
        
        {/* Progress bar */}
        <div className="h-[3px] bg-border rounded-sm mt-5 overflow-hidden">
          <div
            className="h-full bg-primary rounded-sm transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
