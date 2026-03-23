import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/useAppState';
import { BetaBanner } from '@/components/shared/BetaBanner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { AgentCoordinationGraph, AgentNode } from '@/lib/types';

const DISCLAIMER = 'BETA – Illustrative visualization only. Not calibrated to claims data. Educational purposes only.';

const DEMO_AGENT_GRAPHS: Record<string, AgentCoordinationGraph> = {
  meridian: {
    nodes: [
      { id: 'primary', name: 'Trading Strategy AI', type: 'primary', level: 0, autonomy: 5, authority: 5, humanOversight: false, description: 'Main decision-making AI for trade execution' },
      { id: 'market-analysis', name: 'Market Analysis Agent', type: 'sub-agent', level: 1, autonomy: 4, authority: 3, humanOversight: false, description: 'Analyzes market conditions and trends' },
      { id: 'risk-check', name: 'Risk Assessment Agent', type: 'sub-agent', level: 1, autonomy: 4, authority: 4, humanOversight: true, description: 'Evaluates position risk before execution' },
      { id: 'news-scraper', name: 'News Sentiment Tool', type: 'tool', level: 2, autonomy: 1, authority: 1, humanOversight: false, description: 'Scrapes financial news for sentiment analysis' },
      { id: 'portfolio-db', name: 'Portfolio Database', type: 'tool', level: 2, autonomy: 1, authority: 2, humanOversight: false, description: 'Current positions and account data' },
      { id: 'execution-api', name: 'Trading API', type: 'tool', level: 2, autonomy: 1, authority: 5, humanOversight: false, description: 'Executes trades on exchange' },
    ],
    edges: [
      { from: 'primary', to: 'market-analysis', delegationType: 'task', canOverride: false, requiresApproval: false },
      { from: 'primary', to: 'risk-check', delegationType: 'verification', canOverride: true, requiresApproval: false },
      { from: 'market-analysis', to: 'news-scraper', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
      { from: 'market-analysis', to: 'portfolio-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
      { from: 'risk-check', to: 'portfolio-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
      { from: 'primary', to: 'execution-api', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
    ],
    maxDepth: 2, totalAgents: 3, totalTools: 3, recursiveLoops: false, delegationDepthScore: 7, responsibilityGapScore: 8,
  },
  healthpath: {
    nodes: [
      { id: 'primary', name: 'Diagnostic Assistant AI', type: 'primary', level: 0, autonomy: 3, authority: 2, humanOversight: true, description: 'Suggests diagnoses based on symptoms' },
      { id: 'symptom-analyzer', name: 'Symptom Analysis Agent', type: 'sub-agent', level: 1, autonomy: 2, authority: 1, humanOversight: true },
      { id: 'medical-db', name: 'Medical Knowledge Base', type: 'tool', level: 2, autonomy: 1, authority: 1, humanOversight: false },
    ],
    edges: [
      { from: 'primary', to: 'symptom-analyzer', delegationType: 'task', canOverride: false, requiresApproval: true },
      { from: 'symptom-analyzer', to: 'medical-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
    ],
    maxDepth: 2, totalAgents: 2, totalTools: 1, recursiveLoops: false, delegationDepthScore: 3, responsibilityGapScore: 2,
  },
  lexcore: {
    nodes: [
      { id: 'primary', name: 'Legal Research AI', type: 'primary', level: 0, autonomy: 4, authority: 3, humanOversight: false },
      { id: 'case-finder', name: 'Case Law Agent', type: 'sub-agent', level: 1, autonomy: 4, authority: 2, humanOversight: false },
      { id: 'statute-checker', name: 'Statute Verification Agent', type: 'sub-agent', level: 1, autonomy: 3, authority: 2, humanOversight: false },
      { id: 'deep-research', name: 'Deep Research Agent', type: 'sub-agent', level: 2, autonomy: 4, authority: 2, humanOversight: false, description: 'Can delegate back to Case Finder (LOOP RISK)' },
      { id: 'legal-db', name: 'Legal Database', type: 'tool', level: 3, autonomy: 1, authority: 1, humanOversight: false },
    ],
    edges: [
      { from: 'primary', to: 'case-finder', delegationType: 'task', canOverride: false, requiresApproval: false },
      { from: 'primary', to: 'statute-checker', delegationType: 'task', canOverride: false, requiresApproval: false },
      { from: 'case-finder', to: 'deep-research', delegationType: 'task', canOverride: false, requiresApproval: false },
      { from: 'deep-research', to: 'case-finder', delegationType: 'escalation', canOverride: false, requiresApproval: false },
      { from: 'deep-research', to: 'legal-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
    ],
    maxDepth: 3, totalAgents: 4, totalTools: 1, recursiveLoops: true, delegationDepthScore: 9, responsibilityGapScore: 9,
  },
  retailflow: {
    nodes: [
      { id: 'primary', name: 'Demand Forecasting AI', type: 'primary', level: 0, autonomy: 3, authority: 3, humanOversight: true, description: 'Predicts demand across 12 markets' },
      { id: 'pricing-agent', name: 'Dynamic Pricing Agent', type: 'sub-agent', level: 1, autonomy: 3, authority: 2, humanOversight: true },
      { id: 'inventory-db', name: 'Inventory System', type: 'tool', level: 2, autonomy: 1, authority: 2, humanOversight: false },
    ],
    edges: [
      { from: 'primary', to: 'pricing-agent', delegationType: 'task', canOverride: false, requiresApproval: true },
      { from: 'pricing-agent', to: 'inventory-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
    ],
    maxDepth: 2, totalAgents: 2, totalTools: 1, recursiveLoops: false, delegationDepthScore: 4, responsibilityGapScore: 3,
  },
  civicai: {
    nodes: [
      { id: 'primary', name: 'Drafting Assistant AI', type: 'primary', level: 0, autonomy: 2, authority: 1, humanOversight: true, description: 'Assists with document drafting' },
      { id: 'template-db', name: 'Template Database', type: 'tool', level: 1, autonomy: 1, authority: 1, humanOversight: false },
    ],
    edges: [
      { from: 'primary', to: 'template-db', delegationType: 'tool-call', canOverride: false, requiresApproval: false },
    ],
    maxDepth: 1, totalAgents: 1, totalTools: 1, recursiveLoops: false, delegationDepthScore: 1, responsibilityGapScore: 1,
  },
};

function getGraphForProfile(companyName: string, industry: string): AgentCoordinationGraph {
  const name = companyName.toLowerCase();
  if (name.includes('meridian')) return DEMO_AGENT_GRAPHS.meridian;
  if (name.includes('health')) return DEMO_AGENT_GRAPHS.healthpath;
  if (name.includes('lex')) return DEMO_AGENT_GRAPHS.lexcore;
  if (name.includes('retail')) return DEMO_AGENT_GRAPHS.retailflow;
  if (name.includes('civic')) return DEMO_AGENT_GRAPHS.civicai;
  
  const ind = industry.toLowerCase();
  if (ind.includes('financial') || ind.includes('banking')) return DEMO_AGENT_GRAPHS.meridian;
  if (ind.includes('health') || ind.includes('medical')) return DEMO_AGENT_GRAPHS.healthpath;
  if (ind.includes('legal')) return DEMO_AGENT_GRAPHS.lexcore;
  if (ind.includes('retail') || ind.includes('commerce')) return DEMO_AGENT_GRAPHS.retailflow;
  if (ind.includes('government') || ind.includes('public')) return DEMO_AGENT_GRAPHS.civicai;
  return DEMO_AGENT_GRAPHS.meridian;
}

export function AgentCoordinationView() {
  const { state } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const graph = useMemo(
    () => getGraphForProfile(state.inputs.companyName, state.inputs.industry),
    [state.inputs.companyName, state.inputs.industry]
  );

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const levelGroups: Record<number, AgentNode[]> = {};
    graph.nodes.forEach(n => {
      if (!levelGroups[n.level]) levelGroups[n.level] = [];
      levelGroups[n.level].push(n);
    });
    const maxLevel = Math.max(...Object.keys(levelGroups).map(Number));
    const svgWidth = 800;
    const svgHeight = Math.max(250, Object.values(levelGroups).reduce((max, g) => Math.max(max, g.length), 0) * 90 + 60);
    
    Object.entries(levelGroups).forEach(([level, nodes]) => {
      const l = Number(level);
      const x = 80 + (l / Math.max(maxLevel, 1)) * (svgWidth - 160);
      const startY = (svgHeight - (nodes.length - 1) * 80) / 2;
      nodes.forEach((node, i) => {
        positions[node.id] = { x, y: startY + i * 80 };
      });
    });
    return { positions, width: svgWidth, height: svgHeight };
  }, [graph]);

  const depthColor = graph.delegationDepthScore <= 3 ? 'text-stable' : graph.delegationDepthScore <= 6 ? 'text-sensitive' : 'text-fragile';
  const gapColor = graph.responsibilityGapScore <= 3 ? 'text-stable' : graph.responsibilityGapScore <= 6 ? 'text-sensitive' : 'text-fragile';

  const selectedNodeData = graph.nodes.find(n => n.id === selectedNode);

  return (
    <div className="bg-card border border-sensitive rounded-xl p-5 mb-4 relative">
      {/* BETA badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-[9px] font-bold tracking-wider uppercase bg-sensitive-bg text-sensitive border border-sensitive-border rounded">BETA</span>
      </div>

      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1">
        🤖 Multi-Agent Risk Assessment — Experimental Module
      </div>
      <div className="text-[14px] font-bold text-foreground mb-1">Agent Coordination Analysis</div>
      <p className="text-[11px] text-secondary-foreground mb-3 max-w-[600px] leading-relaxed">
        Maps delegation chains in multi-agent AI systems to identify responsibility gaps and authority escalation risks. 
        Critical for emerging agent frameworks (OpenAI Swarm, Anthropic Computer Use, AutoGPT).
      </p>

      <BetaBanner text={DISCLAIMER} />

      {/* Risk Overview Cards */}
      <TooltipProvider>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-secondary border border-border rounded-lg p-3 text-center cursor-help">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Max Depth</div>
                <div className={`text-[24px] font-bold font-mono ${depthColor}`}>{graph.maxDepth}</div>
                <div className="text-[9px] text-muted-foreground">{graph.maxDepth <= 2 ? 'Acceptable' : graph.maxDepth <= 4 ? 'Review Required' : 'High Risk'}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent><p className="text-[10px] max-w-[200px]">{DISCLAIMER}</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-secondary border border-border rounded-lg p-3 text-center cursor-help">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Delegation Risk</div>
                <div className={`text-[24px] font-bold font-mono ${depthColor}`}>{graph.delegationDepthScore}/10</div>
                <div className="text-[9px] text-muted-foreground">{graph.delegationDepthScore <= 3 ? 'Low Risk' : graph.delegationDepthScore <= 6 ? 'Moderate' : 'High Risk'}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent><p className="text-[10px] max-w-[200px]">{DISCLAIMER}</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-secondary border border-border rounded-lg p-3 text-center cursor-help">
                <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Responsibility Gap</div>
                <div className={`text-[24px] font-bold font-mono ${gapColor}`}>{graph.responsibilityGapScore}/10</div>
                <div className="text-[9px] text-muted-foreground">{graph.responsibilityGapScore <= 3 ? 'Clear' : graph.responsibilityGapScore <= 6 ? 'Ambiguous' : 'Unclear'}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent><p className="text-[10px] max-w-[200px]">{DISCLAIMER}</p></TooltipContent>
          </Tooltip>

          <div className="bg-secondary border border-border rounded-lg p-3 text-center">
            <div className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Architecture</div>
            <div className="text-[16px] font-bold font-mono text-foreground">{graph.totalAgents}A / {graph.totalTools}T</div>
            <div className="text-[9px] text-muted-foreground">Agents / Tools</div>
            {graph.recursiveLoops && (
              <div className="text-[8px] font-bold text-fragile mt-1">⚠ LOOP DETECTED</div>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Graph Visualization */}
      <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-4">
        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-foreground mb-3">Delegation Chain Map</div>
        <div className="overflow-x-auto">
          <svg 
            width={nodePositions.width} 
            height={nodePositions.height} 
            viewBox={`0 0 ${nodePositions.width} ${nodePositions.height}`}
            className="w-full h-auto"
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" opacity="0.5" />
              </marker>
            </defs>

            {/* Edges */}
            {graph.edges.map((edge, i) => {
              const from = nodePositions.positions[edge.from];
              const to = nodePositions.positions[edge.to];
              if (!from || !to) return null;
              const isLoop = edge.delegationType === 'escalation';
              return (
                <g key={i}>
                  {isLoop ? (
                    <path
                      d={`M ${from.x} ${from.y} C ${from.x + 60} ${from.y - 60}, ${to.x - 60} ${to.y - 60}, ${to.x} ${to.y}`}
                      fill="none"
                      stroke="hsl(var(--fragile))"
                      strokeWidth="2"
                      strokeDasharray="6,3"
                      markerEnd="url(#arrowhead)"
                    />
                  ) : (
                    <line
                      x1={from.x + 20} y1={from.y}
                      x2={to.x - 20} y2={to.y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1.5"
                      opacity="0.4"
                      markerEnd="url(#arrowhead)"
                    />
                  )}
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 8}
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="8"
                    fontWeight="600"
                  >
                    {edge.delegationType}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graph.nodes.map(node => {
              const pos = nodePositions.positions[node.id];
              if (!pos) return null;
              const isSelected = selectedNode === node.id;
              const fillColor = node.type === 'primary' ? 'hsl(var(--primary))' :
                               node.type === 'sub-agent' ? 'hsl(var(--sensitive))' :
                               'hsl(var(--muted-foreground))';
              return (
                <g key={node.id} onClick={() => setSelectedNode(node.id)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={pos.x} cy={pos.y} r={isSelected ? 22 : 18}
                    fill={fillColor}
                    opacity={isSelected ? 1 : 0.8}
                    stroke={isSelected ? 'hsl(var(--foreground))' : 'none'}
                    strokeWidth="2"
                  />
                  {node.humanOversight && (
                    <text x={pos.x} y={pos.y - 26} textAnchor="middle" fontSize="10">👁</text>
                  )}
                  {node.authority >= 4 && node.type === 'tool' && (
                    <text x={pos.x + 20} y={pos.y - 14} textAnchor="middle" fontSize="9">⚡</text>
                  )}
                  <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                    {node.type === 'primary' ? '🤖' : node.type === 'sub-agent' ? `A${node.level}` : '⚙'}
                  </text>
                  <text x={pos.x} y={pos.y + 36} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9" fontWeight="600">
                    {node.name.length > 18 ? node.name.slice(0, 16) + '…' : node.name}
                  </text>
                  <text x={pos.x} y={pos.y + 48} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Primary AI</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sensitive" /> Sub-Agent</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-muted-foreground" /> Tool</span>
          <span className="flex items-center gap-1.5">👁 Human Oversight</span>
          <span className="flex items-center gap-1.5">⚡ High Authority</span>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNodeData && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="text-[12px] font-bold text-foreground mb-2">{selectedNodeData.name}</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
            <div><span className="text-muted-foreground">Type:</span> <span className="font-semibold text-foreground">{selectedNodeData.type}</span></div>
            <div><span className="text-muted-foreground">Level:</span> <span className="font-semibold text-foreground">{selectedNodeData.level}</span></div>
            <div><span className="text-muted-foreground">Autonomy:</span> <span className="font-semibold text-foreground">{selectedNodeData.autonomy}/5</span></div>
            <div><span className="text-muted-foreground">Authority:</span> <span className="font-semibold text-foreground">{selectedNodeData.authority}/5</span></div>
            <div><span className="text-muted-foreground">Oversight:</span> <span className={`font-semibold ${selectedNodeData.humanOversight ? 'text-stable' : 'text-fragile'}`}>{selectedNodeData.humanOversight ? '✓ Yes' : '✗ No'}</span></div>
          </div>
          {selectedNodeData.description && (
            <div className="text-[10px] text-muted-foreground mt-2">{selectedNodeData.description}</div>
          )}
        </div>
      )}

      {/* Risk Analysis */}
      <div className="space-y-2 mb-4">
        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-foreground">Risk Analysis</div>
        
        {graph.delegationDepthScore > 6 && (
          <div className="flex items-start gap-2 p-3 bg-fragile-bg border border-fragile-border rounded-lg">
            <span className="text-fragile flex-shrink-0">⚠️</span>
            <div>
              <div className="text-[11px] font-bold text-fragile">Deep Delegation Chain Detected</div>
              <div className="text-[10px] text-fragile/80">Delegation depth of {graph.maxDepth} levels creates responsibility ambiguity. Tracing accountability through {graph.maxDepth} delegation layers is complex and may create liability gaps.</div>
            </div>
          </div>
        )}

        {graph.recursiveLoops && (
          <div className="flex items-start gap-2 p-3 bg-fragile-bg border border-fragile-border rounded-lg">
            <span className="text-fragile flex-shrink-0">🔁</span>
            <div>
              <div className="text-[11px] font-bold text-fragile">Recursive Delegation Loop Detected</div>
              <div className="text-[10px] text-fragile/80">Agent delegation chain contains circular references. This creates infinite loop risk and makes it impossible to determine ultimate decision authority.</div>
            </div>
          </div>
        )}

        {graph.nodes.some(n => n.type === 'tool' && n.authority >= 4) && (
          <div className="flex items-start gap-2 p-3 bg-sensitive-bg border border-sensitive-border rounded-lg">
            <span className="text-sensitive flex-shrink-0">🔓</span>
            <div>
              <div className="text-[11px] font-bold text-sensitive">Tool Authority Escalation</div>
              <div className="text-[10px] text-sensitive/80">Tools with Authority ≥4 can execute high-impact actions (database writes, API calls, financial transactions). If a delegated agent makes poor judgment, the tool amplifies the error.</div>
            </div>
          </div>
        )}

        {graph.responsibilityGapScore > 6 && (
          <div className="flex items-start gap-2 p-3 bg-sensitive-bg border border-sensitive-border rounded-lg">
            <span className="text-sensitive flex-shrink-0">❓</span>
            <div>
              <div className="text-[11px] font-bold text-sensitive">Unclear Liability Distribution</div>
              <div className="text-[10px] text-sensitive/80">Limited human oversight combined with multi-layer delegation makes it unclear who bears responsibility for AI decisions. Insurance claim attribution will be complex if loss occurs.</div>
            </div>
          </div>
        )}

        {graph.delegationDepthScore <= 3 && graph.responsibilityGapScore <= 3 && (
          <div className="flex items-start gap-2 p-3 bg-stable-bg border border-stable-border rounded-lg">
            <span className="text-stable flex-shrink-0">✓</span>
            <div>
              <div className="text-[11px] font-bold text-stable">Low Coordination Risk</div>
              <div className="text-[10px] text-stable/80">Shallow delegation chain with clear human oversight. Responsibility attribution is straightforward and liability distribution is well-defined.</div>
            </div>
          </div>
        )}
      </div>

      {/* Governance Recommendations */}
      <div className="bg-secondary/50 border border-border rounded-lg p-4">
        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-foreground mb-2">Governance Recommendations</div>
        <div className="space-y-2 text-[10px] text-secondary-foreground leading-relaxed">
          {graph.maxDepth > 3 && (
            <div className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span><strong className="text-foreground">Limit delegation depth:</strong> Cap agent chains at 2-3 levels. Deeper chains exponentially increase responsibility gap risk.</span>
            </div>
          )}
          {!graph.nodes[0]?.humanOversight && (
            <div className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span><strong className="text-foreground">Add human oversight at primary level:</strong> Require human approval for primary AI decisions before delegation occurs.</span>
            </div>
          )}
          {graph.recursiveLoops && (
            <div className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span><strong className="text-foreground">Break recursive loops:</strong> Implement max delegation count per task. After N delegations, escalate to human review automatically.</span>
            </div>
          )}
          {graph.nodes.filter(n => !n.humanOversight).length > 2 && (
            <div className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span><strong className="text-foreground">Increase oversight frequency:</strong> Currently {graph.nodes.filter(n => !n.humanOversight).length} nodes operate without human oversight. Consider review checkpoints at each delegation level.</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong className="text-foreground">Document delegation authority:</strong> Create formal specification of which agents can delegate to which tools, under what conditions, and with what approval requirements.</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[9px] text-muted-foreground leading-[1.5] italic">
        Illustrative visualization based on demo profile architecture. Actual agent coordination structures may differ. {DISCLAIMER}
      </div>
    </div>
  );
}
