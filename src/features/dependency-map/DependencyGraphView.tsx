import React, { useMemo, useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Server, Cloud } from 'lucide-react';
import { buildDependencyGraph, DependencyNode } from './graphData';

const RISK_COLORS: Record<string, string> = {
  low: 'hsl(var(--stable))',
  medium: 'hsl(var(--sensitive))',
  high: 'hsl(var(--fragile))',
  critical: 'hsl(var(--fragile))',
};

/* ── Custom Nodes ── */

function InsuredNode({ data }: { data: any }) {
  const bg = RISK_COLORS[data.risk] || 'hsl(var(--muted))';

  return (
    <div className="relative">
      <Handle type="source" position={Position.Top} className="!w-1 !h-1 !opacity-0" />
      <Handle type="target" position={Position.Bottom} className="!w-1 !h-1 !opacity-0" />
      <div
        className="rounded-lg px-3 py-2 text-center border border-border/40 shadow-sm min-w-[110px]"
        style={{ backgroundColor: bg, color: '#fff' }}
      >
        <div className="text-[10px] font-semibold leading-tight truncate max-w-[120px]">{data.label}</div>
        <div className="text-[8px] opacity-80 mt-0.5">{data.metadata?.industry}</div>
        {data.afi !== undefined && (
          <div className="text-[9px] font-mono mt-1 bg-black/20 rounded px-1 inline-block">
            AFI {data.afi.toFixed(0)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderNode({ data }: { data: any }) {
  const Icon = data.nodeType === 'provider' ? Server : Cloud;
  return (
    <div className="relative">
      <Handle type="source" position={Position.Top} className="!w-1 !h-1 !opacity-0" />
      <Handle type="target" position={Position.Bottom} className="!w-1 !h-1 !opacity-0" />
      <Handle type="source" position={Position.Left} className="!w-1 !h-1 !opacity-0" />
      <Handle type="target" position={Position.Right} className="!w-1 !h-1 !opacity-0" />
      <div className="rounded-full w-[130px] h-[130px] flex flex-col items-center justify-center border-2 border-fragile bg-fragile/90 text-white shadow-lg">
        <Icon className="w-5 h-5 mb-1" />
        <div className="text-[10px] font-bold leading-tight text-center px-2">{data.label}</div>
        <div className="text-[8px] mt-1 bg-black/20 rounded px-1.5">CRITICAL HUB</div>
      </div>
    </div>
  );
}

const nodeTypes = { insured: InsuredNode, provider: ProviderNode };

/* ── Details Panel ── */

function NodeDetailsPanel({ node, onClose }: { node: DependencyNode | null; onClose: () => void }) {
  if (!node) return null;

  return (
    <div className="absolute top-3 right-3 z-20 w-72">
      <Card className="bg-card/95 backdrop-blur border-border shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">{node.name}</CardTitle>
              <Badge
                variant="outline"
                className={`mt-1 text-[10px] ${
                  node.risk === 'critical' || node.risk === 'high'
                    ? 'border-fragile text-fragile'
                    : node.risk === 'medium'
                    ? 'border-sensitive text-sensitive'
                    : 'border-stable text-stable'
                }`}
              >
                {node.risk.toUpperCase()} RISK
              </Badge>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-[12px]">
          {node.type === 'insured' ? (
            <>
              <Row label="Industry" value={node.metadata?.industry} />
              <Row label="Size" value={node.metadata?.size} />
              <Row label="Revenue" value={node.metadata?.revenue} />
              <Row label="AI Use Case" value={node.metadata?.useCase} />
              {node.afi !== undefined && (
                <div className="pt-1 border-t border-border">
                  <span className="text-muted-foreground">AFI</span>
                  <span className="float-right font-mono font-semibold">{node.afi.toFixed(1)}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <Row label="Type" value={node.type === 'provider' ? 'AI Model Provider' : 'Cloud Infrastructure'} />
              <Row label="Status" value="Critical Shared Dependency" />
              <p className="text-muted-foreground text-[11px] leading-relaxed pt-1 border-t border-border">
                This provider is a central hub in the dependency network. Failure would create correlated losses across multiple insureds.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ── Main Component ── */

export function DependencyGraphView() {
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);

  const graphData = useMemo(() => buildDependencyGraph(), []);

  const providerCount = graphData.nodes.filter(n => n.type !== 'insured').length;

  const initialNodes: Node[] = useMemo(() => {
    // Arrange providers in center spaced apart, insureds in a ring
    const providerPositions: Record<string, { x: number; y: number }> = {
      'azure-openai': { x: 450, y: 380 },
      'aws': { x: 250, y: 300 },
      'azure': { x: 650, y: 300 },
    };

    let insuredIdx = 0;
    const insuredCount = graphData.nodes.filter(n => n.type === 'insured').length;

    return graphData.nodes.map(node => {
      const isProvider = node.type !== 'insured';

      if (isProvider) {
        const pos = providerPositions[node.id] || { x: 450, y: 380 };
        return {
          id: node.id,
          type: 'provider',
          position: pos,
          data: { label: node.name, risk: node.risk, nodeType: node.type, metadata: node.metadata },
        };
      }

      const angle = (insuredIdx / insuredCount) * 2 * Math.PI - Math.PI / 2;
      insuredIdx++;
      const radius = 360;
      return {
        id: node.id,
        type: 'insured',
        position: { x: 450 + radius * Math.cos(angle), y: 380 + radius * Math.sin(angle) },
        data: { label: node.name, risk: node.risk, afi: node.afi, metadata: node.metadata },
      };
    });
  }, [graphData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return graphData.edges.map((edge, idx) => ({
      id: `e-${idx}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: edge.strength > 0.7,
      style: {
        stroke: edge.type === 'model' ? '#8b5cf6' : '#3b82f6',
        strokeWidth: 1 + edge.strength * 1.5,
        opacity: 0.6,
      },
    }));
  }, [graphData.edges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const gn = graphData.nodes.find(n => n.id === node.id);
      if (gn) setSelectedNode(gn);
    },
    [graphData.nodes],
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value={graphData.stats.totalInsureds} label="Insureds" />
        <StatCard value={graphData.stats.totalProviders} label="Provider Hubs" />
        <StatCard value={graphData.stats.avgConnectionsPerInsured} label="Avg Dependencies" />
        <StatCard value={`${graphData.stats.maxConcentration.percentage}%`} label={`Max Conc. (${graphData.stats.maxConcentration.provider})`} />
      </div>

      {/* Graph */}
      <div className="relative rounded-lg border border-border bg-card overflow-hidden" style={{ height: 560 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} className="!bg-background" />
          <Controls className="!bg-card !border-border !shadow-md [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
          <MiniMap
            nodeColor={n => {
              const r = n.data?.risk as string;
              if (r === 'critical' || r === 'high') return 'hsl(var(--fragile))';
              if (r === 'medium') return 'hsl(var(--sensitive))';
              return 'hsl(var(--stable))';
            }}
            className="!bg-muted !border-border"
            maskColor="hsl(var(--background) / 0.7)"
          />
        </ReactFlow>
        <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground px-1">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-stable" /> Low</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sensitive" /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fragile" /> High / Critical</span>
        <span className="ml-auto">Click node for details · Drag to rearrange · Scroll to zoom</span>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-lg font-bold font-mono text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
    </div>
  );
}
