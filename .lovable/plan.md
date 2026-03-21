

## Plan: Add AFI Components Radar Chart to Decision Intelligence

### What This Does
Add a Recharts-based radar chart showing the 5 AFI components (DR, RC, CD, JD, NA) as a spider/radar visualization — matching the HTML prototype's `createAFIComponentsChart`. This gives a visual breakdown of which governance dimensions are strongest/weakest.

### File to Modify

**`src/features/decision-intelligence/DecisionIntelligence.tsx`**

- Import `Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis` from `recharts` (already partially imported)
- Add a new `SectionCard` titled **"AFI Component Analysis"** after the AFI Component chips block (after line 131)
- Radar chart data: 5 points from `components` — DR, RC, CD, JD, NA (all 0–1 range)
  - Labels: `Delegation Ratio`, `Reversibility Cost`, `Continuation Density`, `Justificatory Density`, `Network Amplification`
- Chart styling per HTML spec:
  - Fill: `rgba(181, 48, 32, 0.15)`, stroke: `#b53020`, strokeWidth: 2
  - Point: `#b53020` fill, white border
  - Grid/angle lines: `#dedbd2` (light mode adapted from `#2e2c22`)
  - Radius axis: 0–1, step 0.2, tick labels as `0%`–`100%` in 8px IBM Plex Mono
  - Angle labels: 10px Inter, `hsl(var(--muted-foreground))`
  - No legend (single dataset)
- Custom dark tooltip: `bg-[#111108]`, shows `label: XX%` format
- Height: ~250px in `ResponsiveContainer`

### Technical Notes
- Recharts `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis` — all available in recharts
- Single `Radar` dataset, no legend needed
- `tickFormatter` on radius axis: `(v) => (v * 100).toFixed(0) + '%'`

