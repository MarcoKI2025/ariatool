/**
 * Temporal Tracking Engine
 * Stores and analyzes risk metric snapshots over time
 */

import { useState, useCallback } from 'react';

export interface RiskSnapshot {
  id: string;
  entityName: string;
  timestamp: string;
  afi: number;
  agri: number;
  scri: number;
  alri: number;
  mdr: number;
  assessmentType: 'Scheduled' | 'Triggered' | 'Continuous';
  notes: string;
}

export interface TemporalAnalysis {
  afiTrend: 'Improving' | 'Stable' | 'Deteriorating';
  afiVelocity: number;
  projectedAFI30Days: number;
  projectedAFI90Days: number;
  alerts: TemporalAlert[];
}

export interface TemporalAlert {
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

const STORAGE_KEY = 'aria_temporal_snapshots';

function loadSnapshots(entityName: string): RiskSnapshot[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[entityName] || [];
  } catch { return []; }
}

function saveSnapshots(entityName: string, snapshots: RiskSnapshot[]) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    all[entityName] = snapshots;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* silent */ }
}

function analyzeSnapshots(snapshots: RiskSnapshot[]): TemporalAnalysis | null {
  if (snapshots.length < 2) return null;

  const sorted = [...snapshots].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const timeDiffDays = Math.max(1, (new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()) / (1000 * 60 * 60 * 24));
  const afiDelta = last.afi - first.afi;
  const afiVelocity = afiDelta / timeDiffDays;

  const afiTrend: TemporalAnalysis['afiTrend'] =
    afiDelta < -0.1 ? 'Improving' :
    afiDelta > 0.1 ? 'Deteriorating' : 'Stable';

  const projectedAFI30Days = Math.max(0, last.afi + afiVelocity * 30);
  const projectedAFI90Days = Math.max(0, last.afi + afiVelocity * 90);

  const alerts: TemporalAlert[] = [];
  if (afiVelocity > 0.01) alerts.push({ severity: 'warning', message: `AFI increasing at ${(afiVelocity * 30).toFixed(2)} points/month` });
  if (afiVelocity > 0.03) alerts.push({ severity: 'critical', message: `Rapid AFI deterioration — projected ${projectedAFI90Days.toFixed(2)} in 90 days` });
  if (last.afi > 1.35 && afiTrend === 'Deteriorating') alerts.push({ severity: 'critical', message: 'Already in Fragile band and worsening' });
  if (afiTrend === 'Improving') alerts.push({ severity: 'info', message: 'Risk profile improving — continue monitoring' });

  return { afiTrend, afiVelocity, projectedAFI30Days, projectedAFI90Days, alerts };
}

export function useTemporalTracking(entityName: string) {
  const [snapshots, setSnapshots] = useState<RiskSnapshot[]>(() => loadSnapshots(entityName));

  const addSnapshot = useCallback((data: Omit<RiskSnapshot, 'id' | 'entityName' | 'timestamp'>) => {
    const newSnapshot: RiskSnapshot = {
      ...data,
      id: crypto.randomUUID(),
      entityName,
      timestamp: new Date().toISOString(),
    };
    setSnapshots(prev => {
      const updated = [...prev, newSnapshot];
      saveSnapshots(entityName, updated);
      return updated;
    });
  }, [entityName]);

  const clearSnapshots = useCallback(() => {
    setSnapshots([]);
    saveSnapshots(entityName, []);
  }, [entityName]);

  const analysis = analyzeSnapshots(snapshots);

  return { snapshots, analysis, addSnapshot, clearSnapshots };
}
