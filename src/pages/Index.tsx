import React from 'react';
import { AppProvider, useApp } from '@/hooks/useAppState';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { ExposureAnalysis } from '@/features/exposure/ExposureAnalysis';
import { DecisionIntelligence } from '@/features/decision-intelligence/DecisionIntelligence';
import { ScenarioSimulation } from '@/features/scenario-simulation/ScenarioSimulation';
import { InsuranceDecision } from '@/features/insurance-decision/InsuranceDecision';
import { ExecutiveReport } from '@/features/executive-report/ExecutiveReport';
import { ModelGovernance } from '@/features/model-governance/ModelGovernance';
import { CompanyView } from '@/features/company-view/CompanyView';
import { CompanyDemoOverlay, DemoPitchOverlay } from '@/features/demo/DemoOverlays';

function AppContent() {
  const { state } = useApp();
  const { perspective, activeStep } = state;

  const renderStep = () => {
    if (perspective === 'company') return <CompanyView />;
    switch (activeStep) {
      case 1: return <ExposureAnalysis />;
      case 2: return <DecisionIntelligence />;
      case 3: return <ScenarioSimulation />;
      case 4: return <InsuranceDecision />;
      case 5: return <ExecutiveReport />;
      case 6: return <ModelGovernance />;
      default: return <ExposureAnalysis />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-7 pb-20">
          {renderStep()}
        </main>
      </div>
      <CompanyDemoOverlay />
      <DemoPitchOverlay />
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
