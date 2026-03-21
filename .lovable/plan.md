

## Plan: Add Responsive Breakpoints and Print Styles

### What This Does
Make the app responsive across desktop, tablet, and mobile breakpoints — plus print-friendly styles. Currently the sidebar is fixed at 236px and no mobile layout exists.

### Changes

**1. `src/index.css`** — Add responsive media queries and print styles at the end of the file

- **Desktop ≤1439px**: Sidebar 220px, reduced content padding (24px), smaller hero scores
- **Tablet ≤1023px**: Sidebar 200px, header 48px, stack hero score rows vertically, hide nav sublabels, reduce card/slider padding
- **Mobile ≤767px**: Stack layout vertically (flex-direction: column), sidebar becomes full-width sticky top bar, hide sidebar tagline, collapsible nav (hidden by default), full-width buttons, stack nav footer vertically, full-width tooltips, full-screen demo modals
- **Small mobile ≤479px**: Further reduce padding (12px), smaller hero scores (36px), smaller text
- **Print**: Hide sidebar/header/buttons/tooltips/modals, full-width content, page-break-inside: avoid on cards

**2. `src/components/layout/AppSidebar.tsx`** — Add mobile nav toggle
- Add a hamburger button (hidden on desktop via `lg:hidden`)
- Toggle sidebar nav visibility on mobile with local state
- Hide tagline on mobile (`hidden md:block`)
- Hide nav sublabels on tablet (`hidden lg:block`)

**3. `src/pages/Index.tsx`** — Responsive layout classes
- Change outer div from `flex h-screen` to `flex flex-col lg:flex-row h-screen`
- Sidebar: responsive width classes `w-full lg:w-[236px] lg:min-w-[236px]`
- Main content: responsive padding `p-4 md:p-5 lg:p-7`

**4. `src/components/layout/AppHeader.tsx`** — Responsive header
- Hide category label on mobile (`hidden md:inline`)
- Reduce padding on smaller screens
- Responsive header height

### Technical Notes
- Primary approach: Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) on components + CSS media queries in `index.css` for global overrides
- Mobile sidebar: sticky top with hamburger toggle using React `useState`
- Print styles use `@media print` with `!important` overrides to hide interactive elements
- No new dependencies

