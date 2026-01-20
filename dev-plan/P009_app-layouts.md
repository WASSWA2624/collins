# Phase 9: Base Layouts & Global UI (App Shell Expansion)

## Purpose
Create the shared UI shell used by all HMS screens: layouts, headers, footers, primary navigation, theme controls, language selection, and other global UI controls that must exist before Phase 11 screens are implemented.

## Rule References
- `.cursor/rules/app-router.mdc` (Route groups and layout placement)
- `.cursor/rules/platform-ui.mdc` (Screen/layout structure)
- `.cursor/rules/component-structure.mdc` (Component organization)
- `.cursor/rules/theme-design.mdc` (Theme tokens and switching)
- `.cursor/rules/i18n.mdc` (Language selection and translations)
- `.cursor/rules/accessibility.mdc` (A11y requirements)
- `.cursor/rules/testing.mdc` (UI testing requirements)

## Prerequisites
- Phase 7 completed (app shell + route groups)
- Phase 8 completed (minimal runnable app)

## Scope
- App-level layouts for `(auth)`, `(main)`, `(patient)` groups
- Global header, footer, and navigation structures
- Theme mode controls (light/dark/high-contrast)
- Language selection controls wired to i18n
- Shared UI shell behaviors (navigation state, titles, breadcrumbs, banners)

## Definition of Done
- Layout components exist and are wired into route group `_layout.jsx` files
- Header/footer/navigation are reusable and theme-aware
- Theme and language controls are functional and persisted
- All UI text uses i18n; no hardcoded strings
- UI is accessible and passes basic interaction tests

## Steps (Atomic)

### Step 9.1.1: Define layout slots and base layout components
- Create reusable layout primitives (e.g., `AppFrame`, `AuthFrame`, `PatientFrame`)
- Establish slot conventions for header, footer, content, and overlays
- Wire layouts into group `_layout.jsx` files

### Step 9.1.2: Implement global header patterns
- Add header component(s) with title, context actions, and optional breadcrumbs
- Provide role-aware action slots (no feature imports)
- Ensure safe-area handling and accessibility semantics

### Step 9.1.3: Implement global footer patterns
- Add footer component(s) for status, legal, and quick actions
- Support variant rendering per route group (auth/main/patient)

### Step 9.1.4: Build primary navigation shell
- Create navigation definitions for main and patient areas
- Implement drawer/tab/rail components as per platform UI rules
- Enforce role-aware navigation and route guards via layouts

### Step 9.1.5: Add theme controls
- Provide UI control for light/dark/high-contrast modes
- Wire to theme state from Phase 3; persist user preference

### Step 9.1.6: Add language selection controls
- Provide language selector UI in header or settings surface
- Wire to i18n locale switching; persist user preference

### Step 9.1.7: Add global banners and shell utilities
- Offline/online banner, maintenance banner, and global loading overlay
- Toast/notice surface for app-wide messages (UI only)

## Testing Requirements
- Layout components: render + accessibility checks
- Header/footer/nav: states for loading, empty, and role changes
- Theme/language toggles: integration tests for persistence
