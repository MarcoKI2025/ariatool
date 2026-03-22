

## Plan: Add AFI Gauge and Radar Chart Components

### What This Does
Add two Chart.js-based visualizations — a semi-circle AFI Gauge and a pentagonal AFI Components Radar chart — and integrate them into the Exposure Results view.

### Changes

**1. Install `chart.js` and `react-chartjs-2`**
- Add both packages (recharts is already installed but Chart.js is needed for the canvas gauge and radar)

**2. Create `src/components/charts/AFIGauge.tsx`**
- Canvas-based semi-circle doughnut chart using Chart.js directly
- Shows AFI value (0–3.0) as colored arc: green (<0.85), amber (0.85–1.35), red (>1.35)
- Center text plugin: AFI score in IBM Plex Mono 36px, band label below
- Threshold markers (0.85, 1.35) at bottom
- 75% cutout, 180° circumference, rotation 270°

**3. Create `src/components/charts/AFIRadar.tsx`**
- Radar chart via `react-chartjs-2` `<Radar>` component
- 5 axes: DR, JD, RC, CD, NA (scale 0–1)
- Red fill with 15% opacity, dark grid lines (#2e2c22)
- Dark tooltip matching design system (#111108)
- IBM Plex Mono for tick labels, Inter for point labels

**4. Modify `src/features/exposure/ExposureResults.tsx`**
- Insert AFI Gauge in a new SectionCard after the hero section (before Step 1 Diagnosis)
- Insert AFI Radar in a companion card alongside or below the gauge
- Add a legend row with band color indicators (Stable/Sensitive/Fragile)
- Show component values (DR, JD, RC, CD, NA) with labels beneath the radar

### Technical Notes
- Chart.js registration: ArcElement, DoughnutController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip
- Both charts use `useRef` + `useEffect` pattern for the gauge (imperative), and `<Radar>` wrapper for the radar
- Colors use hardcoded hex values matching the CSS variables for consistency across light/dark modes

