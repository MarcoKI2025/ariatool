import React, { useState } from 'react';
import { useApp } from '@/hooks/useAppState';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Shield, Cloud, FileText, BarChart3, Globe, Lock, CheckCircle2, ExternalLink, Zap, Database, Eye } from 'lucide-react';
import { LiveIndicator } from '@/components/shared/LiveIndicator';

/* ── Integration Data ── */
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'data' | 'compliance' | 'monitoring' | 'distribution' | 'intelligence';
  status: 'connected' | 'available';
  lastSync?: string;
  dataPoints?: number;
  features?: string[];
}

const INTEGRATIONS: Integration[] = [
  // Connected (mock active)
  {
    id: 'lloyds-exposure',
    name: "Lloyd's Exposure Database",
    description: 'Real-time AI claims frequency & severity benchmarks across syndicate portfolios.',
    icon: <Shield className="w-5 h-5" />,
    category: 'data',
    status: 'connected',
    lastSync: '2 min ago',
    dataPoints: 14829,
    features: ['Claims frequency by sector', 'Severity distributions', 'Loss development triangles', 'Portfolio benchmarks'],
  },
  {
    id: 'eu-aia-monitor',
    name: 'EU AI Act Compliance Monitor',
    description: 'Automated mapping of assessed entities against Annex III risk classifications.',
    icon: <FileText className="w-5 h-5" />,
    category: 'compliance',
    status: 'connected',
    lastSync: '15 min ago',
    dataPoints: 2341,
    features: ['Annex III classification', 'Conformity assessment tracking', 'Regulatory change alerts', 'Documentation compliance'],
  },
  {
    id: 'cloud-status',
    name: 'Cloud Infrastructure Monitor',
    description: 'Multi-cloud uptime & incident feeds from AWS, Azure, GCP for concentration risk.',
    icon: <Cloud className="w-5 h-5" />,
    category: 'monitoring',
    status: 'connected',
    lastSync: '30 sec ago',
    dataPoints: 892471,
    features: ['Real-time uptime monitoring', 'Incident correlation engine', 'Regional dependency mapping', 'SLA compliance tracking'],
  },
  // Available (sales gated)
  {
    id: 'munich-re-cat',
    name: 'Munich Re AI Cat Model',
    description: 'Catastrophe accumulation model for correlated AI infrastructure failures.',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'intelligence',
    status: 'available',
    features: ['AI catastrophe scenarios', 'Correlation matrices', 'Accumulation tracking', 'Treaty structuring data'],
  },
  {
    id: 'swiss-re-sigma',
    name: 'Swiss Re Sigma Intelligence',
    description: 'Global AI adoption curves, regulatory trajectories & market sizing data.',
    icon: <Globe className="w-5 h-5" />,
    category: 'intelligence',
    status: 'available',
    features: ['Market intelligence', 'Regulatory forecasting', 'Adoption curves by sector', 'Premium benchmarks'],
  },
  {
    id: 'eiopa-solvency',
    name: 'EIOPA Solvency II Bridge',
    description: 'Direct ORSA integration with Solvency II reporting templates.',
    icon: <Database className="w-5 h-5" />,
    category: 'compliance',
    status: 'available',
    features: ['ORSA auto-population', 'SCR calculation bridge', 'Regulatory filing prep', 'Capital adequacy mapping'],
  },
  {
    id: 'model-drift-sentinel',
    name: 'Model Drift Sentinel',
    description: 'Continuous monitoring of deployed AI model performance degradation.',
    icon: <Eye className="w-5 h-5" />,
    category: 'monitoring',
    status: 'available',
    features: ['Drift detection alerts', 'Performance baselines', 'Automated retraining triggers', 'A/B test monitoring'],
  },
  {
    id: 'reinsurance-connect',
    name: 'Reinsurance Connect',
    description: 'Treaty placement & facultative quoting via broker network.',
    icon: <Zap className="w-5 h-5" />,
    category: 'distribution',
    status: 'available',
    features: ['Automated treaty quoting', 'Broker network access', 'Capacity management', 'Claims bordereaux'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Integrations' },
  { id: 'data', label: 'Data Feeds' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'distribution', label: 'Distribution' },
];

/* ── Mock Activity Feed ── */
const ACTIVITY_FEED = [
  { time: '14:32', event: "Lloyd's DB sync complete", detail: '247 new claims ingested', type: 'success' as const },
  { time: '14:28', event: 'EU AI Act alert', detail: 'New guidance on Annex III biometric systems', type: 'warning' as const },
  { time: '14:15', event: 'AWS us-east-1 degradation', detail: '12 monitored entities affected', type: 'critical' as const },
  { time: '13:58', event: 'Cloud monitor heartbeat', detail: 'All 3 providers: operational', type: 'success' as const },
  { time: '13:41', event: "Lloyd's severity update", detail: 'Financial Services +4.2% QoQ', type: 'info' as const },
];

export function IntegrationHub() {
  const { state } = useApp();
  const [category, setCategory] = useState('all');
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const filtered = category === 'all' ? INTEGRATIONS : INTEGRATIONS.filter(i => i.category === category);
  const connected = INTEGRATIONS.filter(i => i.status === 'connected');
  const available = INTEGRATIONS.filter(i => i.status === 'available');

  const openDetail = (integration: Integration) => {
    setSelectedIntegration(integration);
    if (integration.status === 'available') {
      setSalesModalOpen(true);
    } else {
      setDetailModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-primary/70 mb-2">
          Platform · Ecosystem
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Integration Hub
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Connect to market data feeds, regulatory monitors, and reinsurance networks. Transform isolated assessments into connected intelligence.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Connected" value={String(connected.length)} accent="stable" />
        <StatCard label="Available" value={String(available.length)} accent="primary" />
        <StatCard label="Data Points" value="909k+" accent="sensitive" />
        <StatCard label="Uptime" value="99.97%" accent="stable" />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors border ${
              category === cat.id
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:bg-secondary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(integration => (
          <button
            key={integration.id}
            onClick={() => openDetail(integration)}
            className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                integration.status === 'connected'
                  ? 'bg-stable-bg text-stable'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {integration.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-foreground truncate">{integration.name}</span>
                  {integration.status === 'connected' ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-stable-bg text-stable border border-stable-border flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-secondary text-muted-foreground border border-border flex-shrink-0">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{integration.description}</p>

                {integration.status === 'connected' && (
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span>Synced {integration.lastSync}</span>
                    <span>{integration.dataPoints?.toLocaleString()} data points</span>
                  </div>
                )}

                {integration.features && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {integration.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-secondary text-muted-foreground">{f}</span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] text-muted-foreground">+{integration.features.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Live Activity Feed</h3>
        <div className="space-y-2">
          {ACTIVITY_FEED.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <span className="text-[10px] font-mono text-muted-foreground w-10 flex-shrink-0">{item.time}</span>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.type === 'success' ? 'bg-stable' :
                item.type === 'warning' ? 'bg-sensitive' :
                item.type === 'critical' ? 'bg-fragile' :
                'bg-primary'
              }`} />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-foreground">{item.event}</span>
                <span className="text-[10px] text-muted-foreground ml-2">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Statement */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Platform Architecture</h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          The AI Governance Risk Engine operates as an open platform with standardised API interfaces for market data,
          regulatory intelligence, and distribution networks. All integrations follow SOC 2 Type II compliance with
          end-to-end encryption. Data residency options available for EU, UK, US, and APAC jurisdictions.
          Contact your account manager for enterprise connectivity and custom integration requirements.
        </p>
      </div>

      {/* Sales Modal */}
      <Dialog open={salesModalOpen} onOpenChange={setSalesModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              This integration is available on the Enterprise plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              {selectedIntegration?.description}
            </p>
            {selectedIntegration?.features && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-foreground">Includes:</div>
                {selectedIntegration.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-stable flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 space-y-2">
              <button
                onClick={() => setSalesModalOpen(false)}
                className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Sales →
              </button>
              <button
                onClick={() => setSalesModalOpen(false)}
                className="w-full px-4 py-2 rounded-lg text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal for Connected */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-stable" />
              {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>Integration active · Last sync {selectedIntegration?.lastSync}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Data Points</div>
                <div className="text-lg font-bold text-foreground font-mono">{selectedIntegration?.dataPoints?.toLocaleString()}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                <div className="text-sm font-semibold text-stable">● Operational</div>
              </div>
            </div>
            {selectedIntegration?.features && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-foreground">Active Capabilities:</div>
                {selectedIntegration.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-stable flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setDetailModalOpen(false)}
              className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground text-[12px] font-medium hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const accentClasses: Record<string, string> = {
    stable: 'text-stable',
    primary: 'text-primary',
    sensitive: 'text-sensitive',
    fragile: 'text-fragile',
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold font-mono ${accentClasses[accent] || 'text-foreground'}`}>{value}</div>
    </div>
  );
}
