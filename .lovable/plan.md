

## Plan: Add Risk Comparison Bar Chart to Decision Intelligence

### What This Does
Add the "Risk Comparison" grouped bar chart from the HTML spec into the Decision Intelligence view (Step 2). This chart compares "Well-Governed Baseline" vs "Your Current Profile" across Base/Elevated/Critical risk scenarios using Recharts (already available in the project).

### Files to Modify

**1. `src/features/decision-intelligence/DecisionIntelligence.tsx`**
- Import `BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer` from `recharts`
- Add a new `SectionCard` titled **"Risk Comparison — Governance Gap Analysis"** after the Financial Exposure section (after line 191)
- Chart data: 3 categories (Base Risk, Elevated Risk, Critical Risk)
  - "Well-Governed Baseline" dataset: `[1, 2, 2]` (fixed)
  - "Your Current Profile" dataset: computed from AFI using `mapToRiskLevel(afi * 0.6)`, `mapToRiskLevel(afi * 0.9)`, `mapToRiskLevel(afi * 1.2)`
  - `mapToRiskLevel`: `<0.5→1, <0.85→2, <1.35→3, ≥1.35→4`
- Chart styling matches HTML spec:
  - Well-Governed bars: `rgba(64, 56, 184, 0.55)` with `#4038b8` border
  - Your Profile bars: `rgba(181, 48, 32, 0.75)` with `#b53020` border
  - Y-axis tick labels: `['', 'Low', 'Medium', 'High', 'Critical']`
  - Legend at bottom with `10px Inter`, color `#888478`
  - Grid lines: `#dedbd2` (light theme adapted)
  - Border radius 3 on bars
  - Height: ~200px
- Tooltip styled dark: `bg-[#111108]`, white title, `#c0bcb0` body, `#3a3828` border
- Below chart: a note explaining the comparison methodology

### Technical Notes
- Uses Recharts `BarChart` with two `Bar` datasets (grouped), not stacked
- Y-axis domain `[0, 4]` with custom tick formatter
- `ResponsiveContainer` for responsive sizing
- No new dependencies needed — recharts already installed

