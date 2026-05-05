# Phase 02 - Onboarding

## Goal

Guide first-run users into a safe facility-aware workflow without a standalone disclaimer page.

## Inspect And Reuse First

- Inspect existing onboarding routes, settings/disclaimer screens, navigation guards, auth state, persistence, and i18n strings.
- Reuse compliant onboarding and safety text components before adding new UI.

## Implementation Scope

- Remove the current standalone disclaimer page as a future implementation task.
- Replace it with concise in-flow clinical safety wording in onboarding and critical clinical forms where it helps decision-making.
- Keep wording advisory and avoid autonomous clinical orders.
- Do not block clinically valid saving because optional data is missing; show explicit missing-data or uncertainty prompts where app rules allow.
- Keep onboarding responsive and simple across web, Android, and iOS.

## Cleanup During Future Work

- Remove old disclaimer routes, links, state flags, and translations only after in-flow safety wording and route migration are tested.
- Remove duplicated onboarding copy after one reusable safety notice component exists.

## Future Tests

- Route/navigation tests proving the standalone disclaimer route is no longer required.
- Accessibility tests for onboarding safety wording and controls.
- Forbidden wording tests for onboarding and clinical safety copy.
