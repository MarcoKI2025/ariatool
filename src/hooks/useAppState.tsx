import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { AppState, Perspective, ExposureInputs, AnalysisResults, IATState, AuditLogEntry } from '@/lib/types';
import { DEFAULT_INPUTS } from '@/lib/constants';
import { computeFullAnalysis } from '@/lib/scoring';

const STORAGE_KEY = 'aria_state';

const DEFAULT_IAT: IATState = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };

function createDefaultState(): AppState {
  return {
    perspective: 'underwriter',
    activeStep: 1,
    analysisComplete: false,
    inputs: { ...DEFAULT_INPUTS } as ExposureInputs,
    results: null,
    iatState: { ...DEFAULT_IAT },
    darkMode: false,
    auditLog: [],
  };
}

function loadPersistedState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...createDefaultState(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return createDefaultState();
}

function persistState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      inputs: state.inputs,
      iatState: state.iatState,
      darkMode: state.darkMode,
      auditLog: state.auditLog,
    }));
  } catch (e) {
    // silent
  }
}

interface AppContextType {
  state: AppState;
  setActiveStep: (step: number) => void;
  setPerspective: (p: Perspective) => void;
  updateInputs: (partial: Partial<ExposureInputs>) => void;
  setInputs: (inputs: ExposureInputs) => void;
  runAnalysis: () => void;
  resetAnalysis: () => void;
  toggleIAT: (criterion: number) => void;
  toggleDarkMode: () => void;
  clearAuditLog: () => void;
  results: AnalysisResults | null;
  inputs: ExposureInputs;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadPersistedState);

  // Persist on changes
  useEffect(() => {
    persistState(state);
  }, [state.inputs, state.iatState, state.darkMode, state.auditLog]);

  // Apply dark mode class
  useEffect(() => {
    document.body.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const setActiveStep = useCallback((step: number) => {
    if (!state.analysisComplete && step > 1) return;
    setState(s => ({ ...s, activeStep: step }));
  }, [state.analysisComplete]);

  const setPerspective = useCallback((p: Perspective) => {
    setState(s => ({ ...s, perspective: p }));
  }, []);

  const updateInputs = useCallback((partial: Partial<ExposureInputs>) => {
    setState(s => {
      const changedFields = Object.keys(partial).join(', ');
      const entry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        action: 'parameter_change',
        details: `Updated: ${changedFields}`,
        inputs: partial,
      };
      return { ...s, inputs: { ...s.inputs, ...partial }, auditLog: [...s.auditLog, entry] };
    });
  }, []);

  const setInputs = useCallback((inputs: ExposureInputs) => {
    setState(s => {
      const entry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        action: 'profile_load',
        details: `Profile loaded: ${inputs.companyName || 'Custom'}`,
      };
      return { ...s, inputs, auditLog: [...s.auditLog, entry] };
    });
  }, []);

  const runAnalysis = useCallback(() => {
    const results = computeFullAnalysis(state.inputs);
    setState(s => {
      const entry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        action: 'analysis_run',
        details: `Analysis: ${state.inputs.companyName || 'Unnamed'} — AFI ${results.afi.toFixed(2)} (${results.band})`,
        results: { afi: results.afi, band: results.band },
      };
      return { ...s, analysisComplete: true, results, auditLog: [...s.auditLog, entry] };
    });
  }, [state.inputs]);

  const resetAnalysis = useCallback(() => {
    setState(createDefaultState());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleIAT = useCallback((criterion: number) => {
    setState(s => ({
      ...s,
      iatState: { ...s.iatState, [criterion]: !s.iatState[criterion] },
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(s => ({ ...s, darkMode: !s.darkMode }));
  }, []);

  const clearAuditLog = useCallback(() => {
    setState(s => ({ ...s, auditLog: [] }));
  }, []);

  const updateRecursiveRisk = useCallback((risk: RecursiveRiskState) => {
    setState(s => ({ ...s, recursiveRisk: risk }));
  }, []);

  const value = useMemo(() => ({
    state,
    setActiveStep,
    setPerspective,
    updateInputs,
    setInputs,
    runAnalysis,
    resetAnalysis,
    toggleIAT,
    toggleDarkMode,
    clearAuditLog,
    updateRecursiveRisk,
    results: state.results,
    inputs: state.inputs,
  }), [state, setActiveStep, setPerspective, updateInputs, setInputs, runAnalysis, resetAnalysis, toggleIAT, toggleDarkMode, clearAuditLog, updateRecursiveRisk]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // During HMR, context can momentarily be null — force a re-render
    console.warn('useApp: context not yet available, will retry on next render');
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
