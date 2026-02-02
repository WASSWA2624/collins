# Phase 8: Minimal Runnable App

## Purpose
Create a **minimal runnable application** where **Home** is served through the main layout at the base route (`/`) to verify the app shell infrastructure works correctly before implementing app-specific features. This phase ensures the app can start, display content, and handle basic routing while maintaining 100% compliance with all project rules.

**Goal**: After this phase, the app should be **fully runnable** with:
- A **Home** screen at `/` via the main layout (`/(main)/index.jsx`)
- Error handling routes (404, error)
- Full internationalization (i18n)
- Full test coverage
- Complete rule compliance

## Rule References
- `.cursor/rules/app-router.mdc` (Route structure - **MANDATORY**)
- `.cursor/rules/platform-ui.mdc` (Screen structure - **MANDATORY**)
- `.cursor/rules/component-structure.mdc` (Component structure - **MANDATORY**)
- `.cursor/rules/i18n.mdc` (100% internationalization - **MANDATORY**)
- `.cursor/rules/theme-design.mdc` (Theming)
- `.cursor/rules/accessibility.mdc` (A11y requirements)
- `.cursor/rules/testing.mdc` (Testing requirements)
- `.cursor/rules/errors-logging.mdc` (Error handling)

## Prerequisites
- Phase 7 completed (app shell with providers, route groups, guards, navigation skeleton)
- Platform UI components available (Phase 6)
- Theme system available (Phase 3)
- i18n system available (Phase 1)

## Implementation Guidelines

**IMPORTANT**: All screens and routes must follow the rules defined in the rule references above. This dev-plan does not redefine rules—only provides phase-specific implementation steps.

**Key Requirements**:
- **100% Internationalization**: All UI text MUST use i18n—NO hardcoded strings
- **100% Test Coverage**: All screens and routes must have comprehensive tests
- **Rule Compliance**: Every step must verify compliance with referenced rules
- **Minimal but Complete**: Keep screens minimal but fully functional and compliant

## App Folder Organization Rules

**IMPORTANT**: All UI and helper components in `src/app/` must follow proper organization per `app-router.mdc` and `component-structure.mdc`:

### Layout Helpers & Styles Organization
- **Layout-specific helpers** (e.g., `ThemeProviderWrapper.jsx`): 
  - **Moved to `src/platform/layouts/common/`** per `component-structure.mdc`
  - Reusable layout components belong in `platform/layouts/`, not `app/`
  - Example: `ThemeProviderWrapper` → `platform/layouts/common/ThemeProviderWrapper/`
  
- **Layout styles** (e.g., `RootLayoutStyles.jsx`):
  - **Moved to `src/platform/layouts/common/`** per `component-structure.mdc`
  - All layout styles belong in `platform/layouts/`, not `app/`
  - Must use correct styled-components entrypoint per `theme-design.mdc`:
    - Native styles: Use `styled-components/native` (for React Native compatibility)
    - Web styles: Use `styled-components` (for web platform)
  - **Forbidden**: Default exports in style files to prevent Expo Router from treating them as routes
  - Style files should only export styled components, not default exports

### Route Files Organization
- **Route files** (`index.jsx`, `+not-found.jsx`, `_error.jsx`, `(main)/index.jsx`):
  - Must be lightweight and delegate logic to hooks or features (per `app-router.mdc`)
  - Can import platform UI components only (per `app-router.mdc`)
  - Must use default exports (per `app-router.mdc`)
  - Should not contain business logic or complex UI

### Route Group Layouts
- **Group layouts** (`(main)/_layout.jsx`, `(training)/_layout.jsx`, `(settings)/_layout.jsx`):
  - **MUST stay in `app/`** (required by Expo App Router routing system)
  - **Should be minimal wrappers** that import and re-export platform layout components
  - **All layout logic belongs in `platform/layouts/route-layouts/`**
  - Platform-specific route layout components are in `platform/layouts/route-layouts/MainRouteLayout/`
  - Metro bundler automatically resolves platform-specific files when importing from platform
  - **Single `_layout.jsx` file per route group** (no platform-specific variants needed in `app/`)
  - Example: `app/(main)/_layout.jsx` imports from `@platform/layouts` and re-exports `MainRouteLayout`

## Steps

### Step 8.0: Organize App Folder Structure (Prerequisite)
**Goal**: Ensure all UI and helper components in `src/app/` follow proper organization per rules.

**Rule References**:
- App router: `app-router.mdc` (route structure, layout organization)
- Component structure: `component-structure.mdc` (UI component organization)
- Theme design: `theme-design.mdc` (styled-components entrypoints)
- Platform UI: `platform-ui.mdc` (platform separation, style imports)

**Actions**:
1. **Verify layout helpers are in platform folder**:
   - `ThemeProviderWrapper` should be in `src/platform/layouts/common/ThemeProviderWrapper/` per `component-structure.mdc`
   - All reusable layout components belong in `platform/layouts/`, not `app/`
   - Root layout (`app/_layout.jsx`) imports from `@platform/layouts/common/ThemeProviderWrapper`

2. **Verify layout styles are in platform folder**:
   - `RootLayoutStyles` should be in `src/platform/layouts/common/RootLayoutStyles/` per `component-structure.mdc`
   - All layout styles belong in `platform/layouts/`, not `app/`
   - Root layout imports from `@platform/layouts/common/RootLayoutStyles`
   - Style files use correct styled-components entrypoints per `theme-design.mdc`
   - **Forbidden**: Default exports in style files to prevent Expo Router route conflicts

3. **Verify route file organization**:
   - All route files (`index.jsx`, `+not-found.jsx`, `_error.jsx`, `(main)/index.jsx`) are lightweight
   - Route files delegate logic to hooks or features (per `app-router.mdc`)
   - Route files only import platform UI components (per `app-router.mdc`)

4. **Verify route group layouts are minimal wrappers**:
   - Route groups use parentheses: `(main)`, `(training)`, `(settings)` (per `app-router.mdc`)
   - Each route group has a single `_layout.jsx` file (no platform-specific variants in `app/`)
   - Route layouts are minimal wrappers that import from `@platform/layouts/route-layouts/`
   - All layout logic is in `platform/layouts/route-layouts/MainRouteLayout/`
   - Metro bundler automatically resolves platform-specific files when importing from platform

**Expected Outcome**:
- All layout helpers are in `platform/layouts/common/` (not in `app/`)
- All layout styles are in `platform/layouts/common/` (not in `app/`)
- Route group layouts are minimal wrappers (single `_layout.jsx` file per group)
- Route layouts import from `@platform/layouts/route-layouts/`
- All layout logic is in `platform/layouts/route-layouts/MainRouteLayout/`
- No default exports in style files (to prevent route conflicts)
- Route files are lightweight and follow rules
- Route groups follow proper structure

**Verification**:
- ✅ Layout helpers are in `platform/layouts/common/` (not in `app/`)
- ✅ Layout styles are in `platform/layouts/common/` (not in `app/`)
- ✅ Route group layouts are minimal wrappers (single `_layout.jsx` file)
- ✅ Route layouts import from platform (not implementing logic directly)
- ✅ All layout logic is in `platform/layouts/route-layouts/`
- ✅ No style files have default exports
- ✅ Route files are lightweight
- ✅ Route groups follow proper structure

---

### Step 8.1: Create Home Screen Component
**Goal**: Implement a minimal **Home** screen component (generic, non app-specific).

**Rule References**:
- Screen structure: `platform-ui.mdc` (screen file structure, platform separation)
- Component structure: `component-structure.mdc` (file structure, grouping - **MANDATORY**)
- i18n: `i18n.mdc` (100% internationalization requirement)
- Theming: `theme-design.mdc` (theme tokens, responsive design, styled-components entrypoints - **MANDATORY**)
- Accessibility: `accessibility.mdc` (a11y labels, focus order)

**Actions**:
1. Create screen category folder structure (per `component-structure.mdc` - **MANDATORY grouping**):
   - Create `src/platform/screens/common/` category folder (grouping related generic/common screens)

2. Create platform-specific screen files (per `component-structure.mdc` Rule #2 - **MANDATORY platform separation**):
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.android.jsx`
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.ios.jsx`
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.web.jsx`
   - Each file must:
     - Import styles from matching platform style file (per `platform-ui.mdc` - **MANDATORY**)
     - Follow mandatory import order (per `component-structure.mdc`):
       1. External dependencies (React, React Native)
       2. Platform components (from `@platform/components` barrel)
       3. Hooks and utilities (absolute imports via aliases)
       4. Styles (relative import - platform-specific)
       5. Component-specific hook (relative import)
       6. Types and constants (relative import)
     - Use i18n for ALL text (no hardcoded strings)
     - Use theme tokens (no hardcoded colors/sizes)
     - Include accessibility labels and roles
     - Handle loading and error states (minimal, using platform UI components)
    - **Note**: This is intentionally generic. App-specific content and navigation is introduced in Phase 10+.

3. Create platform-specific style files (per `component-structure.mdc` Rule #3 - **MANDATORY**):
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.android.styles.jsx`
     - Must use `styled-components/native` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.ios.styles.jsx`
     - Must use `styled-components/native` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - Create `src/platform/screens/common/HomeScreen/HomeScreen.web.styles.jsx`
     - Must use `styled-components` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - All styles must use theme tokens (no hardcoded values)

4. Create hook file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/HomeScreen/useHomeScreen.js`
   - Contains shared behavior/logic for all platforms
   - Component files delegate logic to this hook

5. Create types file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/HomeScreen/types.js`
   - Contains shared constants, types, and variants

6. Create barrel export file (per `component-structure.mdc` Rule #5 - **MANDATORY**):
   - Create `src/platform/screens/common/HomeScreen/index.js` (must be `.js`, not `.jsx`)
   - Export structure (per `component-structure.mdc` - **MANDATORY order**):
     ```javascript
     /**
      * HomeScreen Component
      * Platform selector export (platform file resolution)
      * File: index.js
      */
     
     // 1. Default export (component) - REQUIRED
     export { default } from './HomeScreen';
     
     // 2. Hook exports (if applicable) - OPTIONAL
     export { default as useHomeScreen } from './useHomeScreen';
     
     // 3. Type/constant exports (if applicable) - OPTIONAL
     export { VARIANTS, SIZES, STATES } from './types';
     ```

**Expected Outcome**:
- Home screen component exists in `common/` category folder (grouped per `component-structure.mdc`)
- All three platform files exist (`.android.jsx`, `.ios.jsx`, `.web.jsx`)
- All three platform style files exist with correct styled-components entrypoints
- Hook file exists (`useHomeScreen.js`)
- Types file exists (`types.js`)
- Barrel export follows mandatory structure
- All text uses i18n
- Component is responsive and accessible
- Component uses theme tokens

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/platform/screens/common/HomeScreen.test.js`
- **Platform-specific testing (MANDATORY per `testing.mdc`)**:
  - Test `.android.jsx` implementation separately (Android-specific behavior, styling, interactions)
  - Test `.ios.jsx` implementation separately (iOS-specific behavior, styling, interactions)
  - Test `.web.jsx` implementation separately (web-specific behavior, keyboard navigation, mouse interactions, browser compatibility)
  - Verify correct style file imports (`.android.styles.jsx`, `.ios.styles.jsx`, `.web.styles.jsx`)
  - Verify correct styled-components entrypoints per platform
- Test component renders without errors
- Test i18n text is displayed (mock i18n hook)
- Test theme tokens are used (verify styled-components use theme)
- Test accessibility labels and roles
- Test responsive behavior (mock different screen sizes)
- Test loading/error/empty/offline states (per `platform-ui.mdc` - **MANDATORY**)
- Test all user interactions (touch, keyboard, gestures)
- Test hook (`useHomeScreen`) separately
- Mock all dependencies (i18n, theme, navigation)
- **Coverage**: 100% coverage required per `testing.mdc` (all branches, all platforms)
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.2

---

### Step 8.2: Create Home Route (Base Route)
**Goal**: Serve the Home screen at `/` via the main layout.

**Rule References**:
- Route structure: `app-router.mdc` (route files, default exports, route groups)
- Route placement: `app-router.mdc` (index route allowed outside groups)

**Actions**:
1. Create `src/app/index.jsx`:
   - Use `Redirect` from `expo-router` to route `/` → `/(main)`
   - File must use default export (per `app-router.mdc`)
2. Create `src/app/(main)/index.jsx`:
   - Import `HomeScreen` from `@platform/screens`
   - Export default component that renders `HomeScreen`

**Expected Outcome**:
- Root index route exists and redirects to `/(main)`
- `/(main)/index.jsx` renders `HomeScreen`
- Home is accessible at `/`

**Tests (mandatory - per `testing.mdc`)**:
- Create/update `src/__tests__/app/index.test.js`
- Test redirect to `/(main)`
- Create `src/__tests__/app/(main)/index.test.js`
- Test `HomeScreen` is rendered from the main group index
- **Coverage**: 100% coverage required per `testing.mdc`
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.3

---

### Step 8.3: Create NotFound Screen Component
**Goal**: Implement a 404 not found screen component.

**Rule References**:
- Screen structure: `platform-ui.mdc` (screen file structure, platform separation)
- Component structure: `component-structure.mdc` (file structure, grouping - **MANDATORY**)
- i18n: `i18n.mdc` (100% internationalization requirement)
- Error handling: `errors-logging.mdc` (no raw error details exposed)
- Theming: `theme-design.mdc` (theme tokens, responsive design, styled-components entrypoints - **MANDATORY**)
- Accessibility: `accessibility.mdc` (a11y labels, focus order)

**Actions**:
1. Use existing screen category folder (per `component-structure.mdc` - **MANDATORY grouping**):
   - Use `src/platform/screens/common/` category folder (created in Step 8.1)

2. Create platform-specific screen files (per `component-structure.mdc` Rule #2 - **MANDATORY platform separation**):
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.android.jsx`
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.ios.jsx`
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.web.jsx`
   - Each file must:
     - Import styles from matching platform style file (per `platform-ui.mdc` - **MANDATORY**)
     - Use i18n for ALL text (no hardcoded strings)
     - Use theme tokens (no hardcoded colors/sizes)
     - No technical details exposed (per `errors-logging.mdc`)
     - Provide a navigation action back to Home (`/`)
     - Responsive design (mobile-first)
     - Accessibility labels and roles

3. Create platform-specific style files (per `component-structure.mdc` Rule #3 - **MANDATORY**):
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.android.styles.jsx` (uses `styled-components/native`)
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.ios.styles.jsx` (uses `styled-components/native`)
   - Create `src/platform/screens/common/NotFoundScreen/NotFoundScreen.web.styles.jsx` (uses `styled-components`)
   - All styles must use theme tokens (no hardcoded values)

4. Create hook file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/NotFoundScreen/useNotFoundScreen.js`

5. Create types file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/NotFoundScreen/types.js`

6. Create barrel export file (per `component-structure.mdc` Rule #5 - **MANDATORY**):
   - Create `src/platform/screens/common/NotFoundScreen/index.js`
   - Export structure (per `component-structure.mdc` - **MANDATORY order**):
     ```javascript
     /**
      * NotFoundScreen Component
      * Platform selector export (platform file resolution)
      * File: index.js
      */
     
     // 1. Default export (component) - REQUIRED
     export { default } from './NotFoundScreen';
     
     // 2. Hook exports (if applicable) - OPTIONAL
     export { default as useNotFoundScreen } from './useNotFoundScreen';
     
     // 3. Type/constant exports (if applicable) - OPTIONAL
     export { VARIANTS, SIZES, STATES } from './types';
     ```

**Expected Outcome**:
- NotFound screen component exists in `common/` category folder (grouped per `component-structure.mdc`)
- All three platform files exist (`.android.jsx`, `.ios.jsx`, `.web.jsx`)
- All three platform style files exist with correct styled-components entrypoints
- Hook file exists (`useNotFoundScreen.js`)
- Types file exists (`types.js`)
- Barrel export follows mandatory structure
- All text uses i18n
- Component is responsive and accessible
- No technical error details exposed

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/platform/screens/common/NotFoundScreen.test.js`
- Platform-specific tests for `.android.jsx`, `.ios.jsx`, `.web.jsx`
- Verify correct style file imports (`.android.styles.jsx`, `.ios.styles.jsx`, `.web.styles.jsx`)
- Verify navigation action back to Home works (mock navigation)
- Verify accessibility labels/roles
- **Coverage**: 100% coverage required per `testing.mdc`
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.4

---

### Step 8.4: Create NotFound Route
**Goal**: Create the 404 not found route.

**Rule References**:
- Route structure: `app-router.mdc` (error routes, `+not-found.jsx` naming)
- Route placement: `app-router.mdc` (error routes allowed outside groups)

**Actions**:
1. Create `src/app/+not-found.jsx`:
   - Import `NotFoundScreen` from `@platform/screens` (barrel export - screen is in `common/NotFoundScreen` category folder per `component-structure.mdc`)
   - Export default component that renders `NotFoundScreen`
   - File must use default export (per `app-router.mdc`)
   - No route group needed (error routes are allowed outside groups per `app-router.mdc`)

**Expected Outcome**:
- NotFound route exists and renders not found screen
- Route is accessible for any unmatched paths

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/+not-found.test.js`
- Test route renders without errors
- Test `NotFoundScreen` is rendered
- Mock `expo-router` and `NotFoundScreen` component
- **Coverage**: 100% coverage required per `testing.mdc`
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.5

---

### Step 8.5: Create Error Screen Component
**Goal**: Implement a generic error screen component.

**Rule References**:
- Screen structure: `platform-ui.mdc` (screen file structure, platform separation)
- Component structure: `component-structure.mdc` (file structure, grouping - **MANDATORY**)
- i18n: `i18n.mdc` (100% internationalization requirement)
- Error handling: `errors-logging.mdc` (no raw error details exposed, safe error messages)
- Theming: `theme-design.mdc` (theme tokens, responsive design, styled-components entrypoints - **MANDATORY**)
- Accessibility: `accessibility.mdc` (a11y labels, focus order)

**Actions**:
1. Use existing screen category folder (per `component-structure.mdc` - **MANDATORY grouping**):
   - Use `src/platform/screens/common/` category folder (created in Step 8.1)

2. Create platform-specific screen files (per `component-structure.mdc` Rule #2 - **MANDATORY platform separation**):
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.android.jsx`
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.ios.jsx`
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.web.jsx`
   - Each file must:
     - Import styles from matching platform style file (per `platform-ui.mdc` - **MANDATORY**)
     - Follow mandatory import order (per `component-structure.mdc`):
       1. External dependencies (React, React Native)
       2. Platform components (from `@platform/components` barrel)
       3. Hooks and utilities (absolute imports via aliases)
       4. Styles (relative import - platform-specific)
       5. Component-specific hook (relative import)
       6. Types and constants (relative import)
     - User-friendly error message
     - Retry button (if applicable)
     - Navigation button back to safe route
     - Use theme tokens (no hardcoded colors/sizes)
     - Use i18n for ALL text (no hardcoded strings)
     - No raw error details exposed (per `errors-logging.mdc`)
     - Use safe error messages from error handler (per `errors-logging.mdc`)
     - Responsive design (mobile-first)
     - Accessibility labels and roles

3. Create platform-specific style files (per `component-structure.mdc` Rule #3 - **MANDATORY**):
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.android.styles.jsx`
     - Must use `styled-components/native` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.ios.styles.jsx`
     - Must use `styled-components/native` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - Create `src/platform/screens/common/ErrorScreen/ErrorScreen.web.styles.jsx`
     - Must use `styled-components` entrypoint (per `theme-design.mdc` - **MANDATORY**)
   - All styles must use theme tokens (no hardcoded values)

4. Create hook file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/ErrorScreen/useErrorScreen.js`
   - Contains shared behavior/logic for all platforms
   - Component files delegate logic to this hook

5. Create types file (per `component-structure.mdc` Rule #4 - **MANDATORY**):
   - Create `src/platform/screens/common/ErrorScreen/types.js`
   - Contains shared constants, types, and variants

6. Create barrel export file (per `component-structure.mdc` Rule #5 - **MANDATORY**):
   - Create `src/platform/screens/common/ErrorScreen/index.js` (must be `.js`, not `.jsx`)
   - Export structure (per `component-structure.mdc` - **MANDATORY order**):
     ```javascript
     /**
      * ErrorScreen Component
      * Platform selector export (platform file resolution)
      * File: index.js
      */
     
     // 1. Default export (component) - REQUIRED
     export { default } from './ErrorScreen';
     
     // 2. Hook exports (if applicable) - OPTIONAL
     export { default as useErrorScreen } from './useErrorScreen';
     
     // 3. Type/constant exports (if applicable) - OPTIONAL
     export { VARIANTS, SIZES, STATES } from './types';
     ```

**Expected Outcome**:
- Error screen component exists in `common/` category folder (grouped per `component-structure.mdc`)
- All three platform files exist (`.android.jsx`, `.ios.jsx`, `.web.jsx`)
- All three platform style files exist with correct styled-components entrypoints
- Hook file exists (`useErrorScreen.js`)
- Types file exists (`types.js`)
- Barrel export follows mandatory structure
- All text uses i18n
- Component is responsive and accessible
- No raw error details exposed (only safe messages)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/platform/screens/common/ErrorScreen.test.js`
- **Platform-specific testing (MANDATORY per `testing.mdc`)**:
  - Test `.android.jsx` implementation separately (Android-specific behavior, styling, interactions)
  - Test `.ios.jsx` implementation separately (iOS-specific behavior, styling, interactions)
  - Test `.web.jsx` implementation separately (web-specific behavior, keyboard navigation, mouse interactions, browser compatibility)
  - Verify correct style file imports (`.android.styles.jsx`, `.ios.styles.jsx`, `.web.styles.jsx`)
  - Verify correct styled-components entrypoints per platform
- Test component renders without errors
- Test i18n text is displayed (mock i18n hook)
- Test safe error messages are displayed (mock error handler)
- Test no raw error details are exposed
- Test retry button works (if applicable, mock retry handler)
- Test navigation button works (mock navigation)
- Test accessibility labels and roles
- Test all user interactions (touch, keyboard, gestures)
- Test hook (`useErrorScreen`) separately
- Mock all dependencies (i18n, theme, navigation, error handler)
- **Coverage**: 100% coverage required per `testing.mdc` (all branches, all platforms)
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.6

---

### Step 8.6: Create Error Route
**Goal**: Create the generic error route.

**Rule References**:
- Route structure: `app-router.mdc` (error routes, `_error.jsx` naming)
- Route placement: `app-router.mdc` (error routes allowed outside groups)

**Actions**:
1. Create `src/app/_error.jsx`:
   - Import `ErrorScreen` from `@platform/screens` (barrel export - screen is in `common/ErrorScreen` category folder per `component-structure.mdc`)
   - Export default component that renders `ErrorScreen`
   - File must use default export (per `app-router.mdc`)
   - Handle error prop from Expo Router (if available)
   - No route group needed (error routes are allowed outside groups per `app-router.mdc`)

**Expected Outcome**:
- Error route exists and renders error screen
- Route handles errors gracefully

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/app/_error.test.js`
- Test route renders without errors
- Test `ErrorScreen` is rendered
- Test error prop is handled (if applicable)
- Mock `expo-router` and `ErrorScreen` component
- **Coverage**: 100% coverage required per `testing.mdc`
- **Verification**: Tests pass and coverage meets requirements before proceeding to Step 8.7

---

### Step 8.7: Add i18n Translations for All Screens
**Goal**: Ensure 100% internationalization coverage for all new screens.

**Rule References**:
- i18n: `i18n.mdc` (100% internationalization requirement)

**Actions**:
1. Update `src/i18n/locales/en.json`:
   - Add translations for Home screen
   - Add translations for NotFound screen (404 message, navigation button)
   - Add translations for Error screen (error message, retry button, navigation button)
  - **CRITICAL**: During development, only `en.json` is updated. All other locale files will be created in Phase 13 (Finalization).

2. Verify translation keys are used in all screen components (all platform files):
   - HomeScreen (`.android.jsx`, `.ios.jsx`, `.web.jsx`) uses i18n for all text
   - NotFoundScreen (`.android.jsx`, `.ios.jsx`, `.web.jsx`) uses i18n for all text
   - ErrorScreen (`.android.jsx`, `.ios.jsx`, `.web.jsx`) uses i18n for all text
   - **Note**: All three platform files for each screen must use i18n (per `component-structure.mdc` - platform separation)

**Expected Outcome**:
- All screen text is internationalized
- `en.json` locale file has complete translations for all new screens
- No hardcoded strings in any screen component
- All other locale files will be created in Phase 13 (Finalization)

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/i18n/minimal-app-translations.test.js`
- Test all translation keys exist in `en.json` locale file
- Test no hardcoded strings in screen components (grep for hardcoded text)
- Test i18n hook is used in all screens
- **Coverage**: 100% i18n coverage required for `en.json` per `i18n.mdc`
- **Verification**: All translations complete in `en.json` and verified before proceeding to Step 8.8

---

### Step 8.8: Update Platform Screens Barrel Export
**Goal**: Export all new screens from the platform screens barrel.

**Rule References**:
- Barrel exports: `coding-conventions.mdc` (barrel exports via `index.js`)
- Component structure: `component-structure.mdc` (screens grouped in category folders)

**Actions**:
1. Update `src/platform/screens/index.js`:
   - Export `HomeScreen` from `common/HomeScreen` (per `component-structure.mdc` - screens grouped in category folders)
   - Export `NotFoundScreen` from `common/NotFoundScreen` (per `component-structure.mdc` - screens grouped in category folders)
   - Export `ErrorScreen` from `common/ErrorScreen` (per `component-structure.mdc` - screens grouped in category folders)
   - **Note**: Import paths must reflect category folder structure (e.g., `export { default as HomeScreen } from './common/HomeScreen'`)

**Expected Outcome**:
- All new screens are exported from barrel
- Screens can be imported via `@platform/screens` (e.g., `import { HomeScreen, NotFoundScreen } from '@platform/screens'`)
- Export paths reflect category folder structure

**Tests (mandatory - per `testing.mdc`)**:
- Verify barrel export file exists and exports all screens
- Test imports work correctly (mock test)
- Verify import paths match category folder structure
- **Verification**: Barrel exports verified before proceeding to Step 8.9

---

### Step 8.9: Verify App Runs Successfully
**Goal**: Verify the app starts and displays content correctly.

**Rule References**:
- Bootstrap: `bootstrap-config.mdc` (app initialization order)
- App router: `app-router.mdc` (route structure)

**Actions**:
1. Run `npx expo start` and verify:
   - App starts without errors
   - Home page displays at `/` route via `/(main)`
   - 404 page displays for unmatched routes
   - Error page displays for errors
   - All providers are working (Redux, Theme, i18n)
   - Navigation works correctly
   - Theme switching works (if applicable)
   - i18n switching works (if applicable)

2. Test on multiple platforms (if possible):
   - Web
   - iOS (if available)
   - Android (if available)

**Expected Outcome**:
- App runs successfully on all platforms
- All routes are accessible
- All screens display correctly
- All providers work correctly

**Tests (mandatory - per `testing.mdc`)**:
- Manual verification checklist:
  - ✅ App starts without errors
  - ✅ Home page accessible
  - ✅ 404 page works
  - ✅ Error page works
  - ✅ Theme system works
  - ✅ i18n system works
  - ✅ Navigation works
  - ✅ Responsive design works
  - ✅ Accessibility works (basic checks)
- **Verification**: App runs successfully before proceeding to completion

---

## Completion Criteria

**Rule References**: All completion criteria must comply with referenced rules above (`app-router.mdc`, `platform-ui.mdc`, `component-structure.mdc`, `i18n.mdc`, `theme-design.mdc`, `accessibility.mdc`, `testing.mdc`, `errors-logging.mdc`).

- ✅ **App folder organization (MANDATORY per `app-router.mdc`)**: 
  - Layout helpers are in `src/platform/layouts/common/` (not in `app/`)
  - Layout styles are in `src/platform/layouts/common/` (not in `app/`)
  - Route group layouts are minimal wrappers (single `_layout.jsx` file per group)
  - Route layouts import from `@platform/layouts/route-layouts/` (all logic in platform)
  - Layout styles use correct styled-components entrypoints (per `theme-design.mdc`)
  - No default exports in style files (to prevent Expo Router route conflicts)
  - Route files are lightweight and delegate logic to hooks/features (per `app-router.mdc`)
  - Route groups follow proper structure with parentheses (per `app-router.mdc`)
- ✅ **Screen grouping (MANDATORY per `component-structure.mdc`)**: All screens grouped in category folders (`common/` for HomeScreen, NotFoundScreen, ErrorScreen)
- ✅ **Platform separation (MANDATORY per `component-structure.mdc`)**: All screens have `.android.jsx`, `.ios.jsx`, `.web.jsx` files
- ✅ **Style files (MANDATORY per `component-structure.mdc`)**: All screens have `.android.styles.jsx`, `.ios.styles.jsx`, `.web.styles.jsx` files with correct styled-components entrypoints (per `theme-design.mdc`)
- ✅ **Hook files (MANDATORY per `component-structure.mdc`)**: All screens have `useScreenName.js` hook files
- ✅ **Types files (MANDATORY per `component-structure.mdc`)**: All screens have `types.js` files
- ✅ **Barrel exports (MANDATORY per `component-structure.mdc`)**: All screens have `index.js` barrel files with correct export structure (Component → Hooks → Types)
- ✅ Home screen component exists in `common/` category folder and follows platform UI structure
- ✅ Root index route (`index.jsx`) redirects to `/(main)`
- ✅ Main group index route (`(main)/index.jsx`) renders Home screen
- ✅ NotFound screen component exists in `common/` category folder and follows platform UI structure
- ✅ NotFound route (`+not-found.jsx`) exists and renders not found screen
- ✅ Error screen component exists in `common/` category folder and follows platform UI structure
- ✅ Error route (`_error.jsx`) exists and renders error screen
- ✅ **100% internationalization**: All screen text uses i18n, `en.json` locale file updated with all translations
- ✅ **100% test coverage**: All screens and routes have comprehensive tests per `testing.mdc` (including platform-specific testing for all three platforms)
- ✅ **Rule compliance**: All screens and routes comply with all referenced rules
- ✅ **App runs successfully**: App starts, displays content, and handles navigation correctly
- ✅ All screens use theme tokens (no hardcoded values)
- ✅ All screens are responsive (mobile-first design)
- ✅ All screens are accessible (a11y labels, keyboard navigation)
- ✅ All screens handle loading/error/empty/offline states (per `platform-ui.mdc`)
- ✅ No raw error details exposed (only safe messages per `errors-logging.mdc`)
- ✅ Platform screens barrel export updated with category folder paths

**Verification Checklist**:
- ✅ **App folder organization**: Layout helpers and styles are in `platform/layouts/` (not in `app/`)
- ✅ **Route group layouts**: Single `_layout.jsx` file per group (minimal wrappers importing from platform)
- ✅ **Layout logic**: All layout logic is in `platform/layouts/route-layouts/`
- ✅ **Style files**: No default exports in style files, correct styled-components entrypoints
- ✅ **Route files**: All route files are lightweight and follow rules
- ✅ **Route groups**: All route groups follow proper structure
- ✅ Run `npm test` - all tests pass
- ✅ Run `npm run test:coverage` - coverage meets requirements
- ✅ Run `npx expo start` - app runs without errors
- ✅ Verify Home page displays
- ✅ Verify 404 page works
- ✅ Verify error page works
- ✅ Verify i18n works (switch languages)
- ✅ Verify theme works (switch themes if applicable)
- ✅ Verify navigation works
- ✅ Verify responsive design works
- ✅ Verify accessibility works (basic checks)

**Next Phase**: `P009_app-layouts.md`

