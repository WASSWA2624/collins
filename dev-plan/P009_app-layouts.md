# Phase 9: App Layouts (Current Layout) — Responsive Shell, Navigation, and Layout Primitives

## Purpose
Create the shared, **non app-specific** UI shell and layout primitives with a strong emphasis on:
- **Responsive layouts** (phone ↔ tablet ↔ desktop web)
- **Space economy** (dense information display without clutter)
- **Accessible navigation** (keyboard + screen readers on web)
- **Fail-safe UX** (clear states, no crashes, predictable recovery)

This phase implements the **current layout** and wires it into route-group layouts so the app has a stable shell before app-specific features/screens are introduced in Phase 10+.

## Rule references
- `.cursor/rules/app-router.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/theme-design.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/testing.mdc`

## Prerequisites
- Phase 7 completed (route groups + providers wired)
- Phase 8 completed (minimal runnable app boots)

## Scope
Shell concerns implemented here (generic):
- Global navigation pattern (adaptive by breakpoint)
- Shared header
- Global banners: offline and errors
- Theme and language controls (if not already surfaced)
- Layout primitives enabling dense screens (split-pane on larger screens)

## Definition of Done
- Route-group layouts render their shell UI (no placeholder shells left unwired).
- Navigation is usable on mobile and web, with a consistent information architecture.
- All shell UI is theme-driven, responsive, and accessible.

## UX contract (must be enforced by screens in Phase 11)
- **Progressive disclosure**: show a compact summary first; expand for details.
- **Sticky summary (generic)**: allow a right pane for contextual summary on tablet/desktop when screens opt in.
- **No wasted space**: use compact spacing scale and collapsible sections; avoid full-screen modals on web unless necessary.
- **Primary action clarity**: one primary action per screen, visually consistent.
- **Resilience states**: every surface supports loading/empty/error/offline.

## Steps (atomic)

## Required shell component inventory (must exist by end of Phase 9)
Create these as reusable platform UI (per `platform-ui.mdc` + `component-structure.mdc`). Screens in Phase 11 must only compose them.

**Naming (Phase 6 vs Phase 9)**: Phase 6 introduces `TabBar`, `Header`, and `Sidebar`. Phase 9 shell uses the names below; they may be implemented by reusing or extending those P6 components: `BottomTabs` = mobile primary nav (same role as P6 TabBar); `ScreenHeader` = generic screen header (same role as P6 Header where applicable); `NavigationRail` = tablet/web nav (may extend or differ from P6 Sidebar).

- **Layout primitives**:
  - `AppFrame`: safe-area + keyboard avoidance + responsive container.
  - `SplitPaneFrame`: responsive 1-pane (mobile) / 2-pane (tablet+) layout with optional sticky right pane.
  - `ScreenHeader`: title + optional breadcrumb + right-side actions.

- **Navigation**:
  - `BottomTabs` (mobile): primary navigation (generic items; at minimum Home + Settings).
  - `NavigationRail` (tablet/web): icon + label nav with clear “current route” indicator.

- **Global banners (stackable, space-efficient)**:
  - `OfflineBanner`: connectivity state and what still works offline.
  - `GlobalErrorBanner`: user-friendly, retryable error surface (no technical details).

### Step 9.1.1: Define and wire app shell layout primitives
- Create layout primitives used across groups (e.g., `AppFrame`, `MainFrame`, `SplitPaneFrame`).
- Ensure they support:
  - single-column (mobile)
  - two-pane (tablet/desktop) with a sticky summary column
  - safe-area + keyboard avoidance
- Wire these primitives into each route group’s `_layout.jsx` (no runtime errors).

Implementation requirements:
- **Route layouts stay minimal** in `src/app/**/_layout.jsx` and must import platform layouts from `src/platform/layouts/route-layouts/**` (as established in Phase 8).
- **No hardcoded breakpoints**: consume breakpoint helpers from the theme layer (`theme-design.mdc`).
- **No styled-components in render**: all styling in `.styles.jsx` files (`component-structure.mdc`).

### Step 9.1.2: Implement adaptive primary navigation
- Define a generic IA model (labels/icons/paths) without app-specific semantics.
- Implement navigation that adapts by breakpoint:
  - mobile: bottom tabs (or compact drawer if already standardized)
  - tablet/web: rail/drawer with icons + labels
- Ensure navigation labels and a11y strings are i18n’d.

Navigation rules (plan-specific; must still comply with `app-router.mdc`):
- **Path rules**: links must omit group segments (per `app-router.mdc`).
- **Web keyboard UX**: tab order is predictable; arrow keys optionally move within nav; focus ring visible (theme-defined).

### Step 9.1.3: Implement global header (generic)
- Header must support:
  - screen title
  - optional right-side actions (route-specific)
- No business logic in header; it consumes hook-provided state only.

Space economy requirements:
- Header never grows beyond one row on mobile: overflow actions go into a compact menu.
- On tablet/web, header may show a small breadcrumb for deep routes (case detail, topic detail).

### Step 9.1.4: Global banners (offline + errors)
- Implement:
  - offline banner (state from offline/network slice via hooks)
  - global error surface (non-technical user messaging; retry path)
- Ensure banners are space-efficient (stack on mobile; inline on larger screens).

### Step 9.1.5: Theme + language controls (shell integration)
- Provide minimal controls accessible from header or settings entry.
- Ensure persistence is handled via store/hooks as per rules.

### Step 9.1.6: Add “density mode” preference (compact/comfortable)
- Add a user preference that affects spacing/typography scale via theme tokens or theme variant selection (no inline styling).
- Must not break touch targets minimum sizes on mobile.

Recommended approach:
- Implement as a **theme variant** switch (e.g., compact spacing scale) controlled via Redux and consumed by the ThemeProvider (see `theme-design.mdc` + `state-management.mdc`).
- Density must affect:
  - spacing scale
  - default list row height (without breaking 44x44 touch targets)
  - typography size/line-height (while respecting font scaling per `accessibility.mdc`)

## Testing requirements
- Layout primitives: render tests for each breakpoint variant.
- Navigation: route reachability + keyboard navigation on web.
- Banners: offline toggle + error state toggles; ensure no crashes.
- Accessibility: labels/hints on all interactive elements used in shell.

Performance checks (mandatory per `performance.mdc`):
- Ensure shell components do not cause re-render storms (memoize nav model + use memoized selectors).
- Verify split-pane layout does not render hidden panes on mobile (progressive enhancement).
