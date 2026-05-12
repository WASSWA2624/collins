# Phase 02 - Onboarding

## Goal

Support first-run onboarding without storing facility clinical records before authentication and facility context are established.

## Inspect And Reuse First

- Inspect existing auth, facility, user, settings, and reference modules for already-supported onboarding data.
- Reuse existing facility and user services when they satisfy app rules; avoid creating a parallel onboarding store.

## Implementation Scope

- Define only backend data needed for onboarding progress, consent acknowledgement, supported facility selection, and user setup.
- Keep onboarding state separate from patient records and reviewed training datasets.
- Do not emit clinical recommendations during onboarding.
- Use advisory clinical safety text only where the API stores acknowledgement metadata.

## Cleanup During Future Work

- Remove duplicated onboarding flags or legacy disclaimer acknowledgements once the frontend replaces the standalone disclaimer page with in-flow clinical safety wording.
- Keep audit records for acknowledgement edits when required by governance.

## Future Tests

- Route contract and Zod validation tests for onboarding state if backend endpoints are added.
- Auth boundary tests proving unauthenticated onboarding endpoints cannot access facility clinical records.
- Audit tests for acknowledgement edits when persisted.
