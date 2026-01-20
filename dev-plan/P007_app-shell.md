# Phase 7: App Shell (App Router + Guards + Navigation Skeleton)

## Purpose
Wire the **app shell** infrastructure: providers, app bootstrap, routing groups, guards, and navigation skeleton. This phase establishes the foundational infrastructure that will support app-specific routes and screens created in Phase 8.

**Note**: This phase does **not** create app-specific routes or screens (e.g., login, home). Those will be implemented in Phase 8 (Minimal Runnable App) and Phase 10 (Screens & Routes). This phase focuses solely on reusable infrastructure.

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

### Step 7.7: Create auth route group folder
**Goal**: Establish folder structure for authentication-related routes.

**Rule References**:
- Route groups: `app-router.mdc` (route groups use `(group-name)` syntax)

**Actions**:
- Create `src/app/(auth)/` directory per `app-router.mdc`
- This folder will contain routes that require unauthenticated users

**Expected Outcome**:
- Auth route group folder exists

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- **Verification**: Folder structure verified before proceeding to Step 7.8

---

### Step 7.8: Create main route group folder
**Goal**: Establish folder structure for authenticated/main app routes.

**Rule References**:
- Route groups: `app-router.mdc` (route groups use `(group-name)` syntax)

**Actions**:
- Create `src/app/(main)/` directory per `app-router.mdc`
- This folder will contain routes that require authenticated users

**Expected Outcome**:
- Main route group folder exists

**Tests (mandatory - per `testing.mdc`)**:
- Verify folder structure exists
- **Verification**: Folder structure verified before proceeding to Step 7.9

---

### Step 7.9: Create auth group layout
**Goal**: Define layout wrapper for authentication routes.

**Rule References**:
- Layout structure: `app-router.mdc` (layouts use `_layout.jsx`, default exports, `<Slot />` for child routes)
- Guard placement: `app-router.mdc` (guards in layouts, not screens)

**Actions**:
- Create `src/app/(auth)/_layout.jsx` per `app-router.mdc`
- Export default component that renders `<Slot />` (from `expo-router`)
- This layout will later contain auth guard logic per `app-router.mdc`

**Expected Outcome**:
- Auth group layout exists and renders routes

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/auth-layout.test.js`
- Test that layout renders without errors
- Test that child routes are rendered via `<Slot />` (mock child routes)
- Mock `expo-router` exports as needed
- Test all branches
- **Verification**: Tests pass and coverage meets `testing.mdc` requirements before proceeding to Step 7.10

---

### Step 7.10: Create main group layout
**Goal**: Define layout wrapper for main/authenticated routes.

**Rule References**:
- Layout structure: `app-router.mdc` (layouts use `_layout.jsx`, default exports, `<Slot />` for child routes)
- Guard placement: `app-router.mdc` (guards in layouts, not screens)

**Actions**:
- Create `src/app/(main)/_layout.jsx` per `app-router.mdc`
- Export default component that renders `<Slot />` (from `expo-router`)
- This layout will later contain auth guard and navigation skeleton per `app-router.mdc`

**Expected Outcome**:
- Main group layout exists and renders routes

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/main-layout.test.js`
- Test that layout renders without errors
- Test that child routes are rendered via `<Slot />` (mock child routes)
- Mock `expo-router` exports as needed
- Test all branches
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

### Step 7.12: Implement auth guard hook
**Goal**: Create reusable hook that checks authentication state and redirects if needed.

**Rule References**:
- Hooks: `hooks-utils.mdc` (hooks layer responsibilities, hook design rules)
- Navigation guards: `app-router.mdc` (guards in layouts)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- Create `src/navigation/guards/auth.guard.js`
- Export `useAuthGuard` hook per `hooks-utils.mdc`:
  - Checks if user is authenticated (via Redux selector or hook per `hooks-utils.mdc`)
  - Redirects to login route if unauthenticated (using `router.replace()` from `expo-router`)
  - Accepts optional redirect path parameter (defaults to `/login` as placeholder; actual route path will be determined in Phase 8)
  - Returns auth state (authenticated boolean, user data if available)
- Hook should be idempotent and safe to call multiple times
- **Note**: Redirect paths should match the actual routes created in Phase 8 (Minimal Runnable App)

**Expected Outcome**:
- Auth guard hook exists and can redirect unauthenticated users

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/navigation/guards/auth.guard.test.js` per `testing.mdc` (mirror source structure)
- Test hook returned API (authenticated state, user data)
- Test state transitions (authenticated → unauthenticated, unauthenticated → authenticated)
- Test side effects (redirect behavior) - mock `expo-router` router
- Test error handling (network errors, selector errors)
- Test all branches (authenticated vs unauthenticated, with/without redirect path parameter)
- Mock Redux selectors/hooks; never use real store
- Mock `expo-router`; never perform real navigation
- **Coverage**: 100% coverage required (critical path: auth/access control per `testing.mdc`)
- **Verification**: Tests pass, 100% coverage achieved, all branches tested before proceeding to Step 7.13

---

### Step 7.13: Implement role guard hook
**Goal**: Create reusable hook that checks user roles and redirects if access denied.

**Rule References**:
- Hooks: `hooks-utils.mdc` (hooks layer responsibilities, hook design rules)
- Navigation guards: `app-router.mdc` (guards in layouts)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)
- Security: `security.mdc` (feature gating, access control)

**Actions**:
- Create `src/navigation/guards/role.guard.js`
- Export `useRoleGuard` hook per `hooks-utils.mdc`:
  - Accepts required role(s) as parameter
  - Checks if user has required role (via Redux selector or hook per `hooks-utils.mdc`)
  - Accepts optional redirect path parameter for access denied (defaults to `/home` as placeholder; actual route path will be determined in Phase 8)
  - Redirects to safe route if access denied per `security.mdc`
  - Exposes error code via state/return value
  - Returns access state (hasAccess boolean, error code if denied)
- **Note**: Redirect paths should match the actual routes created in Phase 8 (Minimal Runnable App)

**Expected Outcome**:
- Role guard hook exists and can restrict access based on user roles

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/navigation/guards/role.guard.test.js` per `testing.mdc` (mirror source structure)
- Test hook returned API (hasAccess, error code)
- Test state transitions (hasAccess true → false, false → true)
- Test side effects (redirect behavior) - mock `expo-router` router
- Test error handling (network errors, selector errors)
- Test all branches (has required role vs lacks role, single role vs multiple roles, with/without redirect path)
- Test edge cases (empty roles array, invalid roles, null user)
- Mock Redux selectors/hooks; never use real store
- Mock `expo-router`; never perform real navigation
- **Coverage**: 100% coverage required (critical path: auth/access control per `testing.mdc`)
- **Verification**: Tests pass, 100% coverage achieved, all branches tested before proceeding to Step 7.14

---

### Step 7.14: Wire auth guard in auth layout
**Goal**: Redirect authenticated users away from auth routes (e.g., login when already logged in).

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- In `src/app/(auth)/_layout.jsx`:
  - Import `useAuthGuard` from `@navigation/guards` per `coding-conventions.mdc`
  - Call the hook per `app-router.mdc`
  - If authenticated, redirect to home route (redirect path should match the actual home route created in Phase 8)

**Expected Outcome**:
- Authenticated users cannot access login/register routes (redirected to home)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/auth-layout-guard.test.js` per `testing.mdc` (mirror source structure)
- Mock `useAuthGuard` hook
- Test that unauthenticated users can access auth routes (no redirect)
- Test that authenticated users are redirected to home route when accessing auth routes
- Test all branches (authenticated vs unauthenticated states)
- Mock `expo-router` router; never perform real navigation
- Test integration between layout and guard hook
- **Coverage**: 100% coverage required (critical path: auth/access control per `testing.mdc`)
- **Verification**: Tests pass, 100% coverage achieved, all branches tested before proceeding to Step 7.15

---

### Step 7.15: Wire auth guard in main layout
**Goal**: Protect main routes, requiring authentication.

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- In `src/app/(main)/_layout.jsx`:
  - Import `useAuthGuard` from `@navigation/guards` per `coding-conventions.mdc`
  - Call the hook at the top of the component per `app-router.mdc`
  - If unauthenticated, user will be redirected to login route (redirect path should match the actual login route created in Phase 8 or Phase 10)

**Expected Outcome**:
- Unauthenticated users cannot access main routes (redirected to login)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/main-layout-guard.test.js` per `testing.mdc` (mirror source structure)
- Mock `useAuthGuard` hook
- Test that authenticated users can access main routes (no redirect)
- Test that unauthenticated users are redirected to login route when accessing main routes
- Test all branches (authenticated vs unauthenticated states)
- Mock `expo-router` router; never perform real navigation
- Test integration between layout and guard hook
- **Coverage**: 100% coverage required (critical path: auth/access control per `testing.mdc`)
- **Verification**: Tests pass, 100% coverage achieved, all branches tested before proceeding to Step 7.16

---

### Step 7.16: Wire role guards where needed (optional)
**Goal**: Apply role guards to specific routes that require role-based protection. This is optional and routes can be protected later when needed.

**Rule References**:
- Guard placement: `app-router.mdc` (guards in layouts, not screens)
- Import aliases: `coding-conventions.mdc` (use `@navigation` alias)

**Actions**:
- Identify routes that need role protection (can be minimal for now; actual routes created in Phase 8 and Phase 10)
- In route group layouts per `app-router.mdc`:
  - Import `useRoleGuard` from `@navigation/guards` per `coding-conventions.mdc`
  - Call guard with required role parameters
  - Guard will handle redirects automatically

**Expected Outcome**:
- Routes with role requirements are protected (when routes exist in Phase 8 and Phase 10)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/navigation/guards/integration.test.js` per `testing.mdc` (mirror source structure)
- Mock `useRoleGuard` hook
- Mock route layouts/components
- Test that role guards work correctly in route contexts (integration test)
- Test that multiple guards can be combined without conflicts (composition test)
- Test all branches (different role combinations, with/without redirect path)
- Mock `expo-router` router; never perform real navigation
- **Coverage**: 100% coverage required (critical path: auth/access control per `testing.mdc`)
- **Verification**: Tests pass, 100% coverage achieved, all branches tested before proceeding to Step 7.17

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
- Common generic groups: `(auth)`, `(main)`, `(public)`
- **Note**: App-specific route groups (e.g., `(clinical)`, `(admin)`, `(patient)`) should be created in Phase 10+ when implementing HMS features
- Only root routes (`index.jsx`) and error handlers (`+not-found.jsx`, `_error.jsx`) are allowed outside groups
- Each route group MUST have its own `_layout.jsx` for group-specific logic (guards, navigation, etc.)
- See `.cursor/rules/app-router.mdc` for complete requirements

**Navigation Paths**:
When navigating/linking (after routes are created in Phase 8 and Phase 10), **omit group segments** per `app-router.mdc` (do not include `/(auth)` or `/(main)` in user-facing paths):
- ✅ Correct: `router.push('/login')` or `<Link href="/home" />`
- ❌ Incorrect: `router.push('/(auth)/login')` or `<Link href="/(main)/home" />`

**Note**: Actual routes (login, home, index, not-found, etc.) will be created in Phase 8 (Minimal Runnable App) and Phase 10 (Screens & Routes). This phase only establishes the infrastructure (route groups, layouts, guards) that will support those routes.

---

## Completion Criteria

**Rule References**: All completion criteria must comply with referenced rules above (`bootstrap-config.mdc`, `app-router.mdc`, `testing.mdc`, `errors-logging.mdc`, `hooks-utils.mdc`, `security.mdc`, `coding-conventions.mdc`, `i18n.mdc`).

- ✅ Root layout file exists with proper structure (per `app-router.mdc`, `bootstrap-config.mdc`)
- ✅ ErrorBoundary catches and handles errors safely (per `errors-logging.mdc`, `bootstrap-config.mdc`)
- ✅ Redux Provider wraps app (per `bootstrap-config.mdc`, `state-management.mdc`)
- ✅ ThemeProvider wraps app (per `bootstrap-config.mdc`, `theme-design.mdc`)
- ✅ Localization Provider wraps app (per `bootstrap-config.mdc`, `i18n.mdc`)
- ✅ Bootstrap runs in correct order and failures are handled safely (per `bootstrap-config.mdc`: security → store → theme → offline)
- ✅ Auth and main route groups exist with layouts (per `app-router.mdc`)
- ✅ Guards implemented (auth, role) with configurable redirect paths (per `hooks-utils.mdc`, `security.mdc`)
- ✅ Guards wired in route layouts (redirect paths are placeholders until routes exist in Phase 8) (per `app-router.mdc`)
- ✅ Navigation skeleton renders in main layout (per `platform-ui.mdc`, `accessibility.mdc`)
- ✅ **All steps have passing tests with required coverage** (per `testing.mdc`: 100% coverage mandatory overall, all branches tested)
- ✅ **All tests verify behavior, not implementation details** (per `testing.mdc`)
- ✅ **All external dependencies mocked in tests** (per `testing.mdc`: no real network, storage, navigation in tests)
- ⏳ **Routes and screens will be implemented in Phase 8 (Minimal Runnable App) and Phase 10 (Screens & Routes)** (not part of this phase)

**Next Phase**: `P008_minimal-app.md`

