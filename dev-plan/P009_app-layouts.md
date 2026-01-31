# Phase 9: Ventilation App Shell UX (Dense, Responsive, Safe-by-Design)

## Purpose
Create the shared UI shell for the ventilation decision-support workflow with a strong emphasis on:
- **Intuitive navigation** for non-specialist clinicians
- **Space economy** (dense information display without clutter)
- **Fully responsive layouts** (phone ↔ tablet ↔ desktop web)
- **Fail-safe UX** (clear states, no crashes, predictable recovery)

This phase wires the app-specific shell into the route-group layouts so the app is end-to-end navigable before feature-heavy screens are built.

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
Route groups (as documented in `dev-plan/index.md`):
- `(main)`: assessment → recommendation → monitoring
- `(training)`: education/quick reference
- `(settings)`: preferences + about/disclaimer

Shell concerns implemented here:
- Global navigation pattern (adaptive by breakpoint)
- Shared header + persistent context (case/session state)
- Global banners: offline, “prototype / not clinical use”, errors
- Theme and language controls (if not already surfaced)
- Layout primitives enabling dense screens (split-pane on larger screens)

## Definition of Done
- Route-group layouts render their shell UI (no placeholder shells left unwired).
- Navigation is usable on mobile and web, with a consistent information architecture.
- The app surfaces the dataset “not clinically validated” disclaimer in a way that is visible and non-dismissable without acknowledgement (prototype safety requirement).
- All shell UI is theme-driven, responsive, and accessible.

## UX contract (must be enforced by screens in Phase 11)
- **Progressive disclosure**: show a compact summary first; expand for details.
- **Sticky summary**: keep “current case summary + key recommended settings” visible on tablet/desktop.
- **No wasted space**: use compact spacing scale and collapsible sections; avoid full-screen modals on web unless necessary.
- **Primary action clarity**: one primary action per screen, visually consistent.
- **Resilience states**: every surface supports loading/empty/error/offline.

## Steps (atomic)

## Required shell component inventory (must exist by end of Phase 9)
Create these as reusable platform UI (per `platform-ui.mdc` + `component-structure.mdc`). Screens in Phase 11 must only compose them.

- **Layout primitives**:
  - `AppFrame`: safe-area + keyboard avoidance + responsive container.
  - `SplitPaneFrame`: responsive 1-pane (mobile) / 2-pane (tablet+) layout with optional sticky right pane.
  - `ScreenHeader`: title + optional breadcrumb + right-side actions.

- **Navigation**:
  - `BottomTabs` (mobile): primary navigation (Assessment / Recommendation / Monitoring / Training / Settings).
  - `NavigationRail` (tablet/web): icon + label nav with clear “current route” indicator.

- **Global banners (stackable, space-efficient)**:
  - `OfflineBanner`: connectivity state and what still works offline.
  - `PrototypeDisclaimerBanner`: dataset intended-use warning (must be sourced from dataset model/hook, not hardcoded).
  - `GlobalErrorBanner`: user-friendly, retryable error surface (no technical details).

- **Session context**:
  - `SessionChip`: compact “current session” summary (condition + key severity signal).
  - `SessionSummaryPanel`: compact/sticky summary for tablet/web (inputs summary + last recommendation summary).

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
- Define IA entries:
  - Assessment
  - Recommendation (when a case exists)
  - Monitoring (when a case exists)
  - Training
  - Settings/About
- Implement navigation that adapts by breakpoint:
  - mobile: bottom tabs (or compact drawer if already standardized)
  - tablet/web: rail/drawer with icons + labels
- Ensure navigation labels and a11y strings are i18n’d.

Navigation rules (plan-specific; must still comply with `app-router.mdc`):
- **Route gating**:
  - Recommendation/Monitoring entries are disabled (with accessible hint) when there is no active session.
  - Training/Settings always reachable.
- **Path rules**: links must omit group segments (per `app-router.mdc`).
- **Web keyboard UX**: tab order is predictable; arrow keys optionally move within nav; focus ring visible (theme-defined).

### Step 9.1.3: Implement global header and “current session” context surface
- Header must support:
  - screen title
  - compact “current session” chip (condition + severity summary)
  - quick actions (new assessment, resume session)
- No business logic in header; it consumes hook-provided state only.

Space economy requirements:
- Header never grows beyond one row on mobile: overflow actions go into a compact menu.
- On tablet/web, header may show a small breadcrumb for deep routes (case detail, topic detail).

### Step 9.1.4: Global banners (offline + prototype disclaimer + errors)
- Implement:
  - offline banner (state from offline/network slice via hooks)
  - prototype disclaimer banner referencing dataset intended-use warning
  - global error surface (non-technical user messaging; retry path)
- Ensure banners are space-efficient (stack on mobile; inline on larger screens).

Prototype disclaimer requirements:
- The banner content must be sourced from the dataset (`intendedUse.warning`) via Phase 10 model/hook.
- The banner must be:
  - accessible (screen reader readable)
  - i18n’d (use an i18n key with interpolation, e.g., `t('ventilation.disclaimer.datasetWarning', { warning })`; do not hardcode display strings in UI)
  - non-dismissable until acknowledgement (Phase 7 guard controls access; banner still remains visible in core workflow after acknowledgement).

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
