

## Plan: Add TOOLTIPS Constants and Integrate Across All Views

### What This Does
The user provided a `TOOLTIPS` constant object containing rich tooltip text for all major metrics (AFI, band, DR, JD, RC, CD, ECI, MDR, RFS, RFSI, IAT, NA, premium, sigma insights, EU AI Act). These need to be added as a centralized constant and wired into every view that references these metrics — so hovering on metric labels shows the detailed explanation.

### Files to Create/Modify

**1. Create `src/lib/tooltips.ts`**
- Export the full `TOOLTIPS` object with all 16 tooltip strings exactly as provided by the user.

**2. Update `src/components/shared/UIComponents.tsx`**
- Add a reusable `<InfoTip text={...} />` inline component that renders the `i` icon with hover-triggered fixed-position dark tooltip box (same pattern already built into `SliderRow`). Extract the tooltip rendering logic into this shared component so it can be used anywhere.

**3. Update `src/features/exposure/ExposureResults.tsx`**
- Import `TOOLTIPS` and `InfoTip`
- Add tooltips to: AFI score label, DR/JD/RC/CD metric cards, ECI badge, AGRI/ALRI/SCRI panel headers, Loss Envelope labels, band badge

**4. Update `src/features/risk-overview/RiskOverview.tsx`**
- Add tooltips to: AFI label, Governance Exposure (JD), Dependency Concentration (RC), Continuation Density (CD), AGRI panel, band interpretation

**5. Update `src/features/decision-intelligence/DecisionIntelligence.tsx`**
- Add tooltips to: Structural Exposure Score, AFI Score, ECI gauge label, DR/JD/RC/CD component chips, Responsibility Fragmentation (RFS), RFSI reference, financial exposure labels, premium reference

**6. Update `src/features/insurance-decision/InsuranceDecision.tsx`**
- Add tooltips to: Decision class, AFI Position, Premium Range, Loss Envelope bands, correlation factor, amplification factor

**7. Update `src/features/company-view/CompanyView.tsx`**
- Add tooltips to: AFI gauge, premium estimate, band badge, ECI reference, cost driver explanations

**8. Update `src/features/exposure/ExposureAnalysis.tsx`**
- Add tooltips in the right sticky panel to: AFI score, DR/JD/RC/CD component labels, band badge

### Implementation Approach
- The `InfoTip` component: inline `<span>` with `onMouseEnter`/`onMouseLeave` state, renders a fixed-position dark tooltip (`bg-[#111108]`, `border-[#3a3828]`, `text-white`, `text-[11px]`, `w-[280px]`, `rounded-lg`, `z-[9000]`) — identical to the existing SliderRow tooltip pattern.
- Each metric label gets `<InfoTip text={TOOLTIPS.afi} />` appended inline.
- No layout changes, no redesign — just adding the `i` icon + hover box next to existing labels.

