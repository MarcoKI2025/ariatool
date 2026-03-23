import React, { useMemo } from 'react';
import { ExposureInputs } from '@/lib/types';
import { PROVIDERS } from '@/lib/constants';

interface Entity {
  id: string;
  name: string;
  inputs: ExposureInputs;
  normalizedWeight: number;
}

interface Props {
  entities: Entity[];
  portfolioAFI: number;
}

/* ── SVG Network Graph ── */
export function DependencyNetwork({ entities, portfolioAFI }: Props) {
  const WIDTH = 700;
  const HEIGHT = 420;
  const CX = WIDTH / 2;
  const CY = HEIGHT / 2;

  // Collect unique providers across all entities
  const allProviders = useMemo(() => {
    const set = new Set<string>();
    entities.forEach(e => (e.inputs.providers || []).forEach(p => set.add(p)));
    return Array.from(set);
  }, [entities]);

  // Layout: providers in inner ring, entities in outer ring, hub in center
  const providerNodes = useMemo(() =>
    allProviders.map((name, i) => {
      const angle = (2 * Math.PI * i) / Math.max(allProviders.length, 1) - Math.PI / 2;
      const r = 100;
      return { name, x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r };
    }),
    [allProviders, CX, CY]
  );

  const entityNodes = useMemo(() =>
    entities.map((e, i) => {
      const angle = (2 * Math.PI * i) / Math.max(entities.length, 1) - Math.PI / 2;
      const r = 180;
      return { ...e, x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r };
    }),
    [entities, CX, CY]
  );

  // Edges: entity → provider (if entity uses that provider)
  const edges = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; shared: boolean }[] = [];
    entityNodes.forEach(en => {
      const usedProviders = en.inputs.providers || [];
      usedProviders.forEach(pName => {
        const pNode = providerNodes.find(p => p.name === pName);
        if (pNode) {
          // "shared" if more than one entity uses this provider
          const usersCount = entities.filter(e => (e.inputs.providers || []).includes(pName)).length;
          result.push({ x1: en.x, y1: en.y, x2: pNode.x, y2: pNode.y, shared: usersCount > 1 });
        }
      });
    });
    return result;
  }, [entityNodes, providerNodes, entities]);

  // Correlation matrix
  const correlationMatrix = useMemo(() => {
    return entities.map((a, i) =>
      entities.map((b, j) => {
        if (i === j) return 1;
        const aProviders = new Set(a.inputs.providers || []);
        const bProviders = new Set(b.inputs.providers || []);
        const overlap = [...aProviders].filter(p => bProviders.has(p)).length;
        const union = new Set([...aProviders, ...bProviders]).size;
        return union > 0 ? overlap / union : 0;
      })
    );
  }, [entities]);

  return (
    <div className="space-y-6">
      {/* Network Graph */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Dependency Network Graph</h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Shared provider dependencies create correlated failure paths. Red edges indicate multi-entity shared dependencies.
        </p>
        <div className="bg-secondary/50 rounded-lg p-2 overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[700px] mx-auto" style={{ minWidth: 400 }}>
            {/* Edges */}
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.shared ? 'hsl(var(--fragile))' : 'hsl(var(--border))'}
                strokeWidth={e.shared ? 2 : 1}
                strokeOpacity={e.shared ? 0.7 : 0.4}
                strokeDasharray={e.shared ? '' : '4,4'}
              />
            ))}

            {/* Center hub */}
            <circle cx={CX} cy={CY} r={28} fill="hsl(var(--primary))" opacity={0.15} />
            <circle cx={CX} cy={CY} r={20} fill="hsl(var(--primary))" opacity={0.3} />
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="hsl(var(--primary))">AFI</text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="hsl(var(--foreground))" fontFamily="monospace">{portfolioAFI.toFixed(2)}</text>

            {/* Provider nodes */}
            {providerNodes.map((p, i) => {
              const usersCount = entities.filter(e => (e.inputs.providers || []).includes(p.name)).length;
              const isConcentrated = usersCount > 1;
              return (
                <g key={`p-${i}`}>
                  <circle cx={p.x} cy={p.y} r={18}
                    fill={isConcentrated ? 'hsl(var(--fragile-bg))' : 'hsl(var(--secondary))'}
                    stroke={isConcentrated ? 'hsl(var(--fragile))' : 'hsl(var(--border))'}
                    strokeWidth={isConcentrated ? 2 : 1}
                  />
                  <text x={p.x} y={p.y + 1} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={isConcentrated ? 'hsl(var(--fragile))' : 'hsl(var(--muted-foreground))'}>
                    {p.name.slice(0, 4)}
                  </text>
                  {/* Label below */}
                  <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
                    {p.name}
                  </text>
                </g>
              );
            })}

            {/* Entity nodes */}
            {entityNodes.map((e, i) => (
              <g key={`e-${i}`}>
                <circle cx={e.x} cy={e.y} r={22}
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                />
                <text x={e.x} y={e.y - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill="hsl(var(--foreground))">
                  {e.name.length > 8 ? e.name.slice(0, 8) + '…' : e.name}
                </text>
                <text x={e.x} y={e.y + 8} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
                  {(e.normalizedWeight * 100).toFixed(0)}%
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-fragile inline-block rounded" /> Shared dependency</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-border inline-block rounded border-dashed" /> Independent</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fragile-bg border border-fragile inline-block" /> Concentrated provider</span>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Cross-Entity Correlation Matrix</h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Provider overlap as Jaccard similarity. High correlation amplifies portfolio-level tail risk.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground font-medium" />
                {entities.map(e => (
                  <th key={e.id} className="p-2 text-center text-muted-foreground font-medium truncate max-w-[80px]">{e.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entities.map((row, i) => (
                <tr key={row.id}>
                  <td className="p-2 font-medium text-foreground truncate max-w-[100px]">{row.name}</td>
                  {correlationMatrix[i].map((val, j) => {
                    const bg = i === j ? 'bg-primary/10' :
                      val >= 0.5 ? 'bg-fragile-bg' :
                      val > 0 ? 'bg-sensitive-bg' : 'bg-secondary/50';
                    const textColor = i === j ? 'text-primary' :
                      val >= 0.5 ? 'text-fragile' :
                      val > 0 ? 'text-sensitive' : 'text-muted-foreground';
                    return (
                      <td key={j} className={`p-2 text-center font-mono font-semibold ${bg} ${textColor}`}>
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
