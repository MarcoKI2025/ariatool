

## Plan: Add Premium Simulation Horizontal Bar Chart

### What This Does
Add the `createPremiumChart` from the HTML spec — a horizontal stacked bar chart showing premium ranges across Current, Optimized, and Worst Case scenarios. Place it in the Insurance Decision view (Step 4).

### File to Modify

**`src/features/insurance-decision/InsuranceDecision.tsx`**

- Import `BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell` from `recharts`
- Add a new `SectionCard` titled **"Premium Simulation"** after the existing premium/loss sections
- Build 3 scenarios from `results.premium`:
  - **Current**: `{ label: 'Current', low: premium.lo, high: premium.hi }`
  - **Optimized**: `{ label: 'Optimized', low: Math.round(premium.lo * 0.65), high: Math.round(premium.mid * 0.85) }`
  - **Worst Case**: `{ label: 'Worst Case', low: Math.round(premium.mid * 1.5), high: Math.round(premium.hi * 1.8) }`
- Chart: horizontal stacked bars (`indexAxis: 'y'` → Recharts `layout="vertical"`)
  - Dataset 1 "Low End": solid purple `rgba(64, 56, 184, 0.7)`
  - Dataset 2 "Range": light purple `rgba(64, 56, 184, 0.3)` (value = `high - low`)
  - No legend
  - X-axis: `€Xk` format ticks, grid `#dedbd2`
  - Y-axis: scenario labels, no grid
  - Dark tooltip showing `€{low}k – €{high}k / year`
- Height: ~180px

### Technical Notes
- Stacked horizontal bar = Recharts `BarChart` with `layout="vertical"` and `stackId="a"` on both `Bar` components
- Premium values already in `k` from `results.premium`

