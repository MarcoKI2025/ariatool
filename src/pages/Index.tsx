import React, { useEffect, useRef } from 'react';
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
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top whenever step or perspective changes
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [activeStep, perspective]);

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
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="app-main flex-1 flex flex-col overflow-hidden min-w-0">
        <AppHeader />
        <main ref={mainRef} className="app-content flex-1 overflow-y-auto p-4 pb-32 sm:p-6 sm:pb-32 md:p-10 md:pb-32 lg:p-14 lg:pb-32">
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
