# Phase 7: App Shell (App Router + Guards + Navigation Skeleton)

## Purpose
Wire the **app shell** infrastructure: providers, app bootstrap, routing groups, guards, and navigation skeleton. This phase establishes the foundational infrastructure that will support app-specific routes and screens created in Phase 8.

**Note**: This phase does **not** create app-specific routes or screens (e.g., assessment, training, settings). Those are implemented in Phase 8 (Minimal Runnable App) and Phase 11 (Screens & Routes). This phase focuses solely on reusable infrastructure.

## Rule References
- `.cursor/rules/app-router.mdc`
- `.cursor/rules/bootstrap-config.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 6 completed
- Bootstrap layer exists (created in Phase 4)
- UI layouts/components available (Phase 6)

## Implementation Steps

**IMPORTANT**: Follow rule references above. Do not redefine rules; reference them. Each step must be fully tested before proceeding to the next (see `testing.mdc` for mandatory testing standards).

### Step 7.1: Create root layout file structure
**Goal**: Establish the root layout file that will contain all providers.

**Rule References**:
- Provider placement: `bootstrap-config.mdc` (providers mounted only in root layout)
- File structure: `app-router.mdc` (layouts use default exports)

**Actions**:
- Create `src/app/_layout.jsx` file
- Export a default component that renders children
- File must use default export (per `app-router.mdc`)

**Expected Outcome**:
- Root layout file exists and can render children

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout.test.js`
- Test that file exists and exports a default component
- Test that component accepts and renders children
- **Verification**: Tests pass before proceeding to Step 7.2

---

### Step 7.2: Add ErrorBoundary to root layout
**Goal**: Catch and handle rendering errors at the root level.

**Rule References**:
- ErrorBoundary placement: `bootstrap-config.mdc` (global ErrorBoundary in root layout)
- Error handling: `errors-logging.mdc` (fallback UI, no raw error details)

**Actions**:
- Import `ErrorBoundary` from `@errors`
- Wrap all content in `ErrorBoundary` component
- ErrorBoundary must display fallback UI per `errors-logging.mdc` (no raw error details exposed)

**Expected Outcome**:
- Root layout catches errors and displays safe fallback UI

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout-error-boundary.test.js`
- Test that component renders normally without errors
- Test that fallback UI displays when child component throws error
- Test that fallback UI does not expose raw error details (per `errors-logging.mdc`)
- Mock error-throwing components; never use real error scenarios
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.3

---

### Step 7.3: Add Redux Provider to root layout
**Goal**: Provide Redux store context to entire app.

**Rule References**:
- Provider placement: `bootstrap-config.mdc` (Redux Provider mounted only in root layout)
- State management: `state-management.mdc` (store access patterns)

**Actions**:
- Import `Provider` from `react-redux`
- Import store from `@store`
- Wrap content (inside ErrorBoundary) with `Provider` passing store prop
- If using Redux Persist, add `PersistGate` wrapper with loading fallback

**Expected Outcome**:
- Redux store is available to all components in the app

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout-redux.test.js`
- Test that Provider renders without errors
- Test that store is accessible via `useSelector` in child components
- Mock store for testing; never use real store in unit tests
- Test all branches (with/without PersistGate)
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.4

---

### Step 7.4: Add ThemeProvider to root layout
**Goal**: Provide theme context to entire app.

**Rule References**:
- Provider placement: `bootstrap-config.mdc` (ThemeProvider mounted only in root layout)
- Theme usage: `theme-design.mdc` (theme consumption via styled-components)

**Actions**:
- Import `ThemeProvider` from `@theme`
- Import theme resolver/provider setup from `@theme`
- Wrap content (inside Redux Provider) with `ThemeProvider` passing theme prop

**Expected Outcome**:
- Theme is available to all styled-components in the app

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout-theme.test.js`
- Test that ThemeProvider renders without errors
- Test that theme is accessible in styled-components (mock styled component for verification)
- Test theme switching if applicable (per `theme-design.mdc`)
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.5

---

### Step 7.5: Add Localization Provider to root layout
**Goal**: Provide i18n context to entire app.

**Rule References**:
- Provider placement: `bootstrap-config.mdc` (Localization Provider mounted only in root layout)
- i18n usage: `i18n.mdc` (i18n provider/registry, locale handling)

**Actions**:
- Import Localization Provider from `@i18n` (or provider component from `@i18n` per `i18n.mdc`)
- Wrap content (inside ThemeProvider) with Localization Provider
- Provider should handle locale detection, translation loading, and locale switching per `i18n.mdc`

**Expected Outcome**:
- i18n context is available to all components in the app (enables `useI18n()` hook usage)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout-i18n.test.js`
- Test that Localization Provider renders without errors
- Test that i18n context is accessible via `useI18n()` hook in child components (mock hook for verification)
- Test locale switching if applicable (per `i18n.mdc`)
- Mock i18n provider; never use real i18n in unit tests
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.6

---

### Step 7.6: Integrate bootstrap initialization
**Goal**: Initialize app systems in correct order on startup.

**Rule References**:
- Bootstrap order: `bootstrap-config.mdc` (security → store → theme → offline, mandatory order)
- Bootstrap integration: `bootstrap-config.mdc` (bootstrap called before providers render)
- Error handling: `bootstrap-config.mdc` (fatal errors must block rendering, non-fatal errors logged)

**Actions**:
- Import `bootstrapApp` from `@bootstrap`
- Call `bootstrapApp()` per `bootstrap-config.mdc` (before rendering providers)
- Handle bootstrap errors gracefully per `bootstrap-config.mdc` (should not crash app)
- Add loading state while bootstrap completes (optional, if bootstrap is async)

**Expected Outcome**:
- Bootstrap runs in correct order per `bootstrap-config.mdc` (security → store → theme → offline)
- App handles bootstrap failures safely per `bootstrap-config.mdc`

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/root-layout-bootstrap.test.js`
- Mock `bootstrapApp` from `@bootstrap`
- Test that `bootstrapApp` is called on mount
- Test that bootstrap errors are handled gracefully (per `bootstrap-config.mdc`)
- Test that app renders after successful bootstrap
- Test all error branches (fatal vs non-fatal)
- Never call real bootstrap in tests; always mock
- **Verification**: Tests pass, coverage meets `testing.mdc` requirements (100% for critical bootstrap paths), and all branches tested before proceeding to Step 7.7

---

### Step 7.7: Create main route group folder
**Goal**: Establish folder structure for the core clinician workflow routes.

**Rule References**:
- Route groups: `app-router.mdc` (route groups use `(group-name)` syntax)

**Actions**:
- Create `src/app/(main)/` directory per `app-router.mdc`
- This folder contains the core workflow routes (assessment, recommendation, monitoring)

**Expected Outcome**:
- Main route group folder exists

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- **Verification**: Folder structure verified before proceeding to Step 7.8

---

### Step 7.8: Create training route group folder
**Goal**: Establish folder structure for training/education routes.

**Rule References**:
- Route groups: `app-router.mdc` (route groups use `(group-name)` syntax)

**Actions**:
- Create `src/app/(training)/` directory per `app-router.mdc`
- This folder contains training and quick-reference content routes

**Expected Outcome**:
- Training route group folder exists

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- **Verification**: Folder structure verified before proceeding to Step 7.9

---

### Step 7.9: Create settings route group folder
**Goal**: Establish folder structure for settings/about/disclaimer routes.

**Rule References**:
- Route groups: `app-router.mdc` (route groups use `(group-name)` syntax)

**Actions**:
- Create `src/app/(settings)/` directory per `app-router.mdc`

**Expected Outcome**:
- Settings route group folder exists

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- **Verification**: Folder structure verified before proceeding to Step 7.10

---

### Step 7.10: Create group layouts (main/training/settings)
**Goal**: Define layout wrappers for each route group.

**Rule References**:
- Layout structure: `app-router.mdc` (layouts use `_layout.jsx`, default exports, `<Slot />` for child routes)
- Guard placement: `app-router.mdc` (guards in layouts, not screens)

**Actions**:
- Create:
  - `src/app/(main)/_layout.jsx`
  - `src/app/(training)/_layout.jsx`
  - `src/app/(settings)/_layout.jsx`
- Each layout:
  - default exports a component
  - renders `<Slot />` from `expo-router`
  - stays minimal and delegates UI shell to platform layouts (per Phase 8 guidance)

**Expected Outcome**:
- Each group layout exists and renders child routes

**Tests (mandatory - per `testing.mdc`)**:
- Create:
  - `src/__tests__/app/main-layout.test.js`
  - `src/__tests__/app/training-layout.test.js`
  - `src/__tests__/app/settings-layout.test.js`
- For each:
  - renders without errors
  - renders child routes via `<Slot />` (mock child routes)
  - mocks `expo-router` as needed
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.11

---

### Step 7.11: Create guard infrastructure folder
**Goal**: Establish folder structure for navigation guards.

**Rule References**:
- Folder structure: `project-structure.mdc` (navigation guards in `src/navigation/guards/`)
- Barrel exports: `coding-conventions.mdc` (barrel exports via `index.js`)

**Actions**:
- Create `src/navigation/guards/` directory per `project-structure.mdc`
- Create `src/navigation/guards/index.js` barrel export file per `coding-conventions.mdc`

**Expected Outcome**:
- Guard infrastructure folder exists with barrel export

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- Verify barrel export file exists
- **Verification**: Folder structure verified before proceeding to Step 7.12

---

### Step 7.12: Implement acknowledgement guard hook
**Goal**: Create a reusable guard that enforces first-run acknowledgement of the prototype disclaimer.

**Rule References**:
- Hooks: `hooks-utils.mdc` (hooks layer responsibilities, hook design rules)
- Navigation guards: `app-router.mdc` (guards in layouts)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- Create `src/navigation/guards/acknowledgement.guard.js`
- Export `useAcknowledgementGuard` hook per `hooks-utils.mdc`:
  - Checks acknowledgement state from Redux (or persisted preference via hook)
  - Redirects to a dedicated disclaimer route if not acknowledged (e.g., `/disclaimer` under `(settings)`)
  - Is idempotent and safe across re-renders

**Expected Outcome**:
- Acknowledgement guard exists and can redirect before unsafe/unguarded workflow usage

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/navigation/guards/acknowledgement.guard.test.js`
- Test:
  - acknowledged vs unacknowledged branches
  - redirect behavior (mock `expo-router`)
  - error branches (missing state, corrupted persisted flag)
- **Coverage**: 100% coverage required for this critical guard path

---

### Step 7.13: Implement workflow/session guard hook
**Goal**: Create a reusable guard that prevents navigation to screens that require an active assessment/session.

**Rule References**:
- Hooks: `hooks-utils.mdc` (hooks layer responsibilities, hook design rules)
- Navigation guards: `app-router.mdc` (guards in layouts)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)
- State: `state-management.mdc` (state access patterns; store error codes only)

**Actions**:
- Create `src/navigation/guards/session.guard.js`
- Export `useSessionGuard` hook per `hooks-utils.mdc`:
  - Determines whether a “current assessment session” exists (from Redux via selector access through hooks)
  - Redirects to `/assessment` when a session is missing
  - Is idempotent and safe across re-renders
  - Returns a minimal API (e.g., `{ hasSession }`)
- **Note**: Session-required routes should live under a guarded sub-layout (see Step 7.14).

**Expected Outcome**:
- Session guard hook exists and can block session-required routes

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/navigation/guards/session.guard.test.js` per `testing.mdc`
- Test:
  - has session → no redirect
  - missing session → redirect to `/assessment`
  - edge cases (null/undefined state)
- Mock Redux selectors/hooks and `expo-router` router; never perform real navigation/store access
- **Coverage**: 100% coverage required
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.14

---

### Step 7.14: Create guarded session sub-layout under main
**Goal**: Apply `useSessionGuard` only to routes that require a current assessment session.

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)

**Actions**:
- Create `src/app/(main)/session/_layout.jsx`
- In `src/app/(main)/session/_layout.jsx`:
  - Import `useSessionGuard` from `@navigation/guards`
  - Call the guard and redirect to `/assessment` when session is missing
  - Render `<Slot />` for child routes

**Expected Outcome**:
- Session-required routes cannot be accessed without an active session (redirected to `/assessment`)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/main-session-layout-guard.test.js` per `testing.mdc`
- Mock `useSessionGuard` and `expo-router` router
- Test has-session vs missing-session branches
- **Coverage**: 100% coverage required

---

### Step 7.15: Wire acknowledgement guard in main + training layouts
**Goal**: Enforce first-run acknowledgement of the prototype disclaimer before entering the workflow.

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- In `src/app/(main)/_layout.jsx` and `src/app/(training)/_layout.jsx`:
  - Import `useAcknowledgementGuard` from `@navigation/guards`
  - Call the guard at the top of the layout component
  - Redirect to `/disclaimer` when not acknowledged
- Do not apply this guard inside `(settings)` so users can always reach the disclaimer.

**Expected Outcome**:
- Unacknowledged users are redirected to `/disclaimer` before using core routes

**Tests (mandatory - per `testing.mdc`)**:
- Create:
  - `src/__tests__/app/main-layout-acknowledgement-guard.test.js`
  - `src/__tests__/app/training-layout-acknowledgement-guard.test.js`
- Mock `useAcknowledgementGuard` and `expo-router` router
- Test acknowledged vs unacknowledged branches
- **Coverage**: 100% coverage required

---

### Step 7.16: Optional future access control (only if introduced later)
**Goal**: If authentication/roles are introduced later, add guards in layouts and document new route groups in `dev-plan/`.

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- Do not implement auth/role guards unless the product requirements explicitly add authentication and role-based access.

**Expected Outcome**:
- No accidental auth complexity is introduced into the ventilation prototype.

**Tests**:
- N/A unless auth/roles are added later.

---

### Step 7.17: Integrate navigation skeleton in main layout
**Goal**: Render navigation UI components (Header/TabBar/Sidebar) in main layout.

**Rule References**:
- Platform UI: `platform-ui.mdc` (platform-specific components, file-level separation)
- Import aliases: `coding-conventions.mdc` (use `@platform` alias)
- Accessibility: `accessibility.mdc` (a11y labels, focus order, touch targets)
- Responsive design: `theme-design.mdc` (responsive behavior via breakpoints)

**Actions**:
- In `src/app/(main)/_layout.jsx`:
  - Import navigation components from `@platform/components` per `coding-conventions.mdc` (Header, TabBar, Sidebar)
  - Render navigation components wrapping `<Slot />`
  - Use platform-specific components per `platform-ui.mdc` (web vs mobile navigation via file-level separation)
  - Ensure proper responsive behavior per `theme-design.mdc`

**Expected Outcome**:
- Main routes display navigation skeleton (Header/TabBar on mobile, Sidebar on web, etc.)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/main-layout-navigation.test.js` per `testing.mdc` (mirror source structure)
- Test that navigation components render correctly (mock navigation components)
- Test that routes are still accessible with navigation present (mock `<Slot />`)
- Test Web platform: focus order and a11y labels for nav controls are correct per `accessibility.mdc`
- Test all branches (platform-specific rendering)
- Mock platform-specific components; test platform differentiation
- Test accessibility props (`accessibilityLabel`, `testID`) per `testing.mdc`
- **Coverage**: 100% coverage required per `testing.mdc`
- **Verification**: Tests pass, coverage meets `testing.mdc` requirements, all branches tested

---

## Routing Rules (Important)

**Rule Reference**: `app-router.mdc` (route groups, navigation rules)

**Route Grouping (MANDATORY)**:
- **All related routes MUST be grouped** using parentheses `(group-name)` per `.cursor/rules/app-router.mdc`
- Groups used by this app (documented in `dev-plan/index.md`): `(main)`, `(training)`, `(settings)`
- Only root routes (`index.jsx`) and error handlers (`+not-found.jsx`, `_error.jsx`) are allowed outside groups
- Each route group MUST have its own `_layout.jsx` for group-specific logic (guards, navigation, etc.)
- See `.cursor/rules/app-router.mdc` for complete requirements

**Navigation Paths**:
When navigating/linking (after routes are created), **omit group segments** per `app-router.mdc` (do not include `/(main)` / `/(training)` / `/(settings)` in user-facing paths):
- ✅ Correct: `router.push('/assessment')` or `<Link href="/disclaimer" />`
- ❌ Incorrect: `router.push('/(main)/assessment')` or `<Link href="/(settings)/disclaimer" />`

**Note**: Actual routes (index, assessment, disclaimer, not-found, etc.) are created in Phase 8 (Minimal Runnable App) and Phase 11 (Screens & Routes). This phase only establishes the infrastructure (route groups, layouts, guards) that will support those routes.

---

## Completion Criteria

**Rule References**: All completion criteria must comply with referenced rules above (`bootstrap-config.mdc`, `app-router.mdc`, `testing.mdc`, `errors-logging.mdc`, `hooks-utils.mdc`, `coding-conventions.mdc`, `i18n.mdc`).

- ✅ Root layout file exists with proper structure (per `app-router.mdc`, `bootstrap-config.mdc`)
- ✅ ErrorBoundary catches and handles errors safely (per `errors-logging.mdc`, `bootstrap-config.mdc`)
- ✅ Redux Provider wraps app (per `bootstrap-config.mdc`, `state-management.mdc`)
- ✅ ThemeProvider wraps app (per `bootstrap-config.mdc`, `theme-design.mdc`)
- ✅ Localization Provider wraps app (per `bootstrap-config.mdc`, `i18n.mdc`)
- ✅ Bootstrap runs in correct order and failures are handled safely (per `bootstrap-config.mdc`: security → store → theme → offline)
- ✅ Route groups exist with layouts: `(main)`, `(training)`, `(settings)` (per `app-router.mdc`)
- ✅ Guards implemented: acknowledgement guard + session guard (per `hooks-utils.mdc`)
- ✅ Guards wired in appropriate layouts (per `app-router.mdc`)
- ✅ Navigation skeleton renders in main layout (per `platform-ui.mdc`, `accessibility.mdc`)
- ✅ **All steps have passing tests with required coverage** (per `testing.mdc`: 100% coverage mandatory overall, all branches tested)
- ✅ **All tests verify behavior, not implementation details** (per `testing.mdc`)
- ✅ **All external dependencies mocked in tests** (per `testing.mdc`: no real network, storage, navigation in tests)
- ⏳ **Routes and screens will be implemented in Phase 8 (Minimal Runnable App) and Phase 10 (Screens & Routes)** (not part of this phase)

**Next Phase**: `P008_minimal-app.md`

