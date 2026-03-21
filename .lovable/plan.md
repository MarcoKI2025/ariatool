

## Plan: Update Demo Profiles to Match HTML Specification

### What This Does
Replace the current 5 demo profiles with the exact 3 profiles from the HTML spec (Meridian Financial, HealthPath Analytics, CivicAI Gov), updating slider field names, descriptions, signals, dependencies, and metadata to match the spec exactly.

### Files to Modify

**1. `src/lib/types.ts`** — Update `DemoProfile` interface
- Add fields: `id`, `size`, `description`, `afi`, `signals`, `dependencies` (rename from `providers`)
- Remove: `useCases`, `icon`, `note`
- Keep: `name`, `industry`, `band`, `premiumEstimate` (rename `premiumRange` in data to match existing field name), `sliders`

**2. `src/lib/demoData.ts`** — Replace profiles entirely
- Remove all 5 current profiles, replace with 3 from spec
- Map spec slider names to existing `ExposureInputs` field names:
  - `autonomy` → `automation`
  - `execution` → `executionAuthority`
  - `oversight` → `oversightLevel`
  - `sunsetCapability` → `sunsetPolicy`
  - `deploymentDensity` → `actionDensity` (closest mapping)
  - `systemBreadth` → `workflowBreadth`
  - `criticalityScore` → `criticality`
  - `multiAgentOrch` → `multiAgent`
  - `hallucinationExposure` → `hallucinationLiability`
  - `deepfakeRisk` → `deepfakeFraud`
  - `explainability` → `explainabilityGap`
  - `esgAlignment` → `esgLiability`
  - `cloudProviderConcentration` → `cloudConcentration`
  - `modelProviderConcentration` → `modelConcentration`
  - `gpuConcentration` → `gpuConcentration` (same)
  - `crossVendorContagion` → `crossVendorContagion` (same)
- Update `applyDemoProfile` to use new field names
- Profiles: Meridian (Fragile, €420k–€680k), HealthPath (Sensitive, €210k–€340k), CivicAI (Stable, €80k–€140k)

**3. `src/features/demo/DemoOverlays.tsx`** — Update CompanyDemoOverlay
- Use all 3 profiles directly (no index skipping — line 17 fix: `DEMO_PROFILES[0], [1], [2]`)
- Update card rendering to use new fields: `description` instead of `note`, `premiumEstimate` for price display
- Add `signals` display if present in the profile card

### Technical Notes
- The slider values differ between spec and current code — use the spec values exactly
- `dependencies` field on profile maps to `providers` in `ExposureInputs`
- No changes to scoring logic or UI layout — only data replacement

