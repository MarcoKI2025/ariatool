import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AppState, Perspective, ExposureInputs, AnalysisResults } from '@/lib/types';
import { DEFAULT_INPUTS } from '@/lib/constants';
import { computeFullAnalysis } from '@/lib/scoring';

interface AppContextType {
  state: AppState;
  setActiveStep: (step: number) => void;
  setPerspective: (p: Perspective) => void;
  updateInputs: (partial: Partial<ExposureInputs>) => void;
  setInputs: (inputs: ExposureInputs) => void;
  runAnalysis: () => void;
  resetAnalysis: () => void;
  results: AnalysisResults | null;
  inputs: ExposureInputs;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    perspective: 'underwriter',
    activeStep: 1,
    analysisComplete: false,
    inputs: { ...DEFAULT_INPUTS } as ExposureInputs,
    results: null,
  });

  const setActiveStep = useCallback((step: number) => {
    if (!state.analysisComplete && step > 1) return;
    setState(s => ({ ...s, activeStep: step }));
  }, [state.analysisComplete]);

  const setPerspective = useCallback((p: Perspective) => {
    setState(s => ({ ...s, perspective: p }));
  }, []);

  const updateInputs = useCallback((partial: Partial<ExposureInputs>) => {
    setState(s => ({ ...s, inputs: { ...s.inputs, ...partial } }));
  }, []);

  const setInputs = useCallback((inputs: ExposureInputs) => {
    setState(s => ({ ...s, inputs }));
  }, []);

  const runAnalysis = useCallback(() => {
    const results = computeFullAnalysis(state.inputs);
    setState(s => ({ ...s, analysisComplete: true, results, activeStep: 2 }));
  }, [state.inputs]);

  const resetAnalysis = useCallback(() => {
    setState({
      perspective: 'underwriter',
      activeStep: 1,
      analysisComplete: false,
      inputs: { ...DEFAULT_INPUTS } as ExposureInputs,
      results: null,
    });
  }, []);

  const value = useMemo(() => ({
    state,
    setActiveStep,
    setPerspective,
    updateInputs,
    setInputs,
    runAnalysis,
    resetAnalysis,
    results: state.results,
    inputs: state.inputs,
  }), [state, setActiveStep, setPerspective, updateInputs, setInputs, runAnalysis, resetAnalysis]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
