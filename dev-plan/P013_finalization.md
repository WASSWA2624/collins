# Phase 13: Finalization (Onboarding, Help, and Readiness)

## Purpose
Finalize the HMS application after core and advanced features are complete. Each step is **atomic** and covers a single deliverable.

## Rule References
- `.cursor/rules/features-domain.mdc` (Feature Template Structure - MANDATORY)
- `.cursor/rules/component-structure.mdc` (Screen Structure - MANDATORY)
- `.cursor/rules/platform-ui.mdc` (Screen Requirements - MANDATORY)
- `.cursor/rules/testing.mdc` (Testing Requirements - MANDATORY)
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 12 completed
- App Router and screens are in place

## Steps (Fully Atomic)

### Onboarding
- Step 13.1.1: Create onboarding feature skeleton (rules/model/api/usecase/events/index)
- Step 13.1.2: Implement onboarding rules and validation
- Step 13.1.3: Implement onboarding use cases
- Step 13.1.4: Create `useOnboarding` hook (UI gateway)
- Step 13.1.5: Build onboarding screens (role-aware flows)
- Step 13.1.6: Add onboarding tests (feature + hook + screens + a11y)

### Help System
- Step 13.2.1: Create help feature skeleton (rules/model/api/usecase/events/index)
- Step 13.2.2: Implement help content models and rules
- Step 13.2.3: Create `useHelp` hook (UI gateway)
- Step 13.2.4: Build contextual help screens and search
- Step 13.2.5: Add help tests (feature + hook + screens + a11y)

### Localization
- Step 13.3.1: Generate non-`en` locale files from finalized keys
- Step 13.3.2: Validate missing keys and placeholder usage
- Step 13.3.3: Verify locale metadata is surfaced in UI

### Compliance, Security, and Offline Audits
- Step 13.4.1: Audit RBAC and route guard coverage
- Step 13.4.2: Verify audit log visibility and access rules
- Step 13.4.3: Validate offline flows for critical operations
- Step 13.4.4: Run threat and privacy review per write-up requirements

### Performance and Release Readiness
- Step 13.5.1: Performance profiling and UI responsiveness checks
- Step 13.5.2: Load and stress checks for data-heavy screens
- Step 13.5.3: Final regression test suite
- Step 13.5.4: Final documentation updates
- Step 13.5.5: Release readiness checklist sign-off

**Exit Criteria**: All tests pass, localization is complete, audits are clean, and readiness checklist is signed off.
