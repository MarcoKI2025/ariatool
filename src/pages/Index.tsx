import React, { useEffect, useRef, useState, Component, type ReactNode } from 'react';
import { AppProvider, useApp } from '@/hooks/useAppState';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { ExposureAnalysis } from '@/features/exposure/ExposureAnalysis';
import { DecisionIntelligence } from '@/features/decision-intelligence/DecisionIntelligence';
import { ScenarioSimulation } from '@/features/scenario-simulation/ScenarioSimulation';
import { InsuranceDecision } from '@/features/insurance-decision/InsuranceDecision';
import { ExecutiveReport } from '@/features/executive-report/ExecutiveReport';
import { ModelGovernance } from '@/features/model-governance/ModelGovernance';
import { PortfolioView } from '@/features/portfolio/PortfolioView';
import { EvidenceLog } from '@/features/evidence-log/EvidenceLog';
import { IntegrationHub } from '@/features/integration-hub/IntegrationHub';
import { RecursiveRiskView } from '@/features/recursive-risk/RecursiveRiskView';
import { TemporalTrackingView } from '@/features/temporal/TemporalTrackingView';
import { CompanyView } from '@/features/company-view/CompanyView';
import { CompanyDemoOverlay, DemoPitchOverlay } from '@/features/demo/DemoOverlays';

const ACCESS_KEY = 'aria_access_granted';
const CORRECT_PASSWORD = 'airisk';

function PasswordGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Small delay for UX feel
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(ACCESS_KEY, 'true');
        onAuthenticated();
      } else {
        setError(true);
        setPassword('');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-[14px]">AI</div>
            <div>
              <div className="text-[15px] font-bold text-foreground tracking-tight">ARIA</div>
              <div className="text-[10px] text-muted-foreground">AI Governance Engine v4.2.0</div>
            </div>
          </div>

          <div className="text-[13px] font-semibold text-foreground mb-1">Access Required</div>
          <p className="text-[11px] text-muted-foreground mb-5 leading-relaxed">
            Enter the access password to continue to the governance platform.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-[10px] font-bold tracking-wide uppercase text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter access password"
                autoFocus
                className={`w-full px-3 py-2.5 text-[13px] border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  error ? 'border-fragile ring-2 ring-fragile/20' : 'border-border'
                }`}
              />
              {error && (
                <div className="text-[10px] text-fragile mt-1.5 font-medium">
                  Incorrect password. Please try again.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Access Platform'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center">
            <div className="text-[9px] text-muted-foreground">
              ARIA v4.2.0 · Governance Intelligence Platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary to catch HMR glitches gracefully
class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {
    setTimeout(() => this.setState({ hasError: false }), 100);
  }
  render() {
    if (this.state.hasError) {
      return <div className="flex items-center justify-center h-screen bg-background text-muted-foreground text-sm">Loading…</div>;
    }
    return this.props.children;
  }
}

function AppContent() {
  const { state } = useApp();
  const { perspective, activeStep } = state;
  const mainRef = useRef<HTMLElement>(null);

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
      case 7: return <PortfolioView />;
      case 8: return <EvidenceLog />;
      case 9: return <IntegrationHub />;
      case 10: return <RecursiveRiskView />;
      case 11: return <TemporalTrackingView />;
      default: return <ExposureAnalysis />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="app-main flex-1 flex flex-col overflow-hidden min-w-0">
        <AppHeader />
        <main ref={mainRef} className="app-content flex-1 overflow-y-auto p-3 pb-32 sm:p-6 sm:pb-32 md:p-10 md:pb-32 lg:p-14 lg:pb-32">
          {renderStep()}
        </main>
      </div>
      <CompanyDemoOverlay />
      <DemoPitchOverlay />
    </div>
  );
}

export default function Index() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(ACCESS_KEY) === 'true';
  });

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AppErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}
