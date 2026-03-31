import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import { LockedState } from '@/components/shared/UIComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DependencyGraphView } from './DependencyGraphView';
import { DependencyMapLinear } from './DependencyMapLinear';
import { Network, List } from 'lucide-react';

export function DependencyMap() {
  const { state, setActiveStep } = useApp();
  const { results, analysisComplete } = state;

  if (!analysisComplete || !results) {
    return (
      <LockedState
        title="Dependency Map Locked"
        description="Complete the Exposure Analysis to view the dependency map and concentration analysis."
        onAction={() => setActiveStep(1)}
        actionLabel="Go to Exposure Analysis"
      />
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-[6px]">Step 3 of 12 · Infrastructure</div>
        <h1 className="text-xl font-semibold text-foreground mb-1 tracking-tight">Dependency Map</h1>
        <p className="text-[12px] text-muted-foreground max-w-[580px] leading-relaxed">
          Interactive network visualization of shared dependencies across portfolio entities.
        </p>
      </div>

      <Tabs defaultValue="graph">
        <TabsList className="mb-4">
          <TabsTrigger value="graph" className="text-xs gap-1.5">
            <Network className="w-3.5 h-3.5" />
            Network Graph
          </TabsTrigger>
          <TabsTrigger value="linear" className="text-xs gap-1.5">
            <List className="w-3.5 h-3.5" />
            Linear View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph">
          <DependencyGraphView />
        </TabsContent>

        <TabsContent value="linear">
          <DependencyMapLinear />
        </TabsContent>
      </Tabs>
    </div>
  );
}
