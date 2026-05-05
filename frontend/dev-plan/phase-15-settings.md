# Phase 15 - Settings

## Goal

Keep user, facility, privacy, offline, sync, accessibility, and governance settings clear and safe.

## Inspect And Reuse First

- Inspect settings routes, privacy/disclaimer screens, user/facility state, sync settings, theme/accessibility controls, and API services.
- Reuse existing settings components when they comply with app rules and UI constraints.

## Implementation Scope

- Support account, active facility, roles, offline/sync, privacy, accessibility, language, logging, and governance visibility settings where appropriate.
- Do not use Settings as a place for clinical decision output.
- Keep clinical safety wording in-flow rather than as a standalone disclaimer page.
- Audit or surface backend-audited settings changes that affect clinical workflows, exports, governance, or model visibility.

## Cleanup During Future Work

- Remove the obsolete disclaimer route, navigation entry, translations, and persisted acknowledgement state after onboarding and in-flow safety wording are verified.
- Remove duplicated settings state after Redux ownership is clear.

## Future Tests

- Settings route and form tests.
- Accessibility tests for settings controls.
- Role-aware visibility tests for governance/model settings.
- Tests confirming no standalone disclaimer route is required.
