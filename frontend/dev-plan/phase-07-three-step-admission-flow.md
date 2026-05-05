# Phase 07 - Required Three-Step Admission Flow

## Goal

Convert admission into the required three-step flow: Patient & reason; Oxygen, ABG & ventilator; Save & review.

## Inspect And Reuse First

- Inspect the existing assessment wizard, admission service calls, form components, live summary, offline queue, and route structure.
- Reuse compliant field groups and platform components, then simplify the flow.

## Implementation Scope

- Step 1 captures patient pathway, reason, facility context, and permitted missing values.
- Step 2 captures oxygen, ABG, ventilator, timing, device context, and uncertainty.
- Step 3 shows save readiness, missing data, clinician confirmation, override reason where relevant, review status, and sync state.
- Keep saves offline-safe, idempotent, and retryable.
- Never display exact ventilator-setting orders or autonomous diagnoses.

## Paired Backend Requirements

- Verify backend admission create/patch support for the three steps: Patient & reason; Oxygen, ABG & ventilator; Save & review.
- Reuse existing append-only ABG/ventilator and admission transaction services where compliant; implement missing validators, controllers, services, Prisma changes/migrations, Zod contracts, audit logs, and idempotency/conflict handling in this phase.
- Add paired frontend wizard/offline tests and backend contract, validation, facility isolation, audit, and conflict tests before the flow is marked ready.

## Cleanup During Future Work

- Replace the long assessment flow only after the three-step flow is covered by tests.
- Remove obsolete steps, labels, and route aliases after migration is verified across web, Android, and iOS.

## Future Tests

- Wizard flow tests for all three steps.
- Accessibility tests for critical forms and alerts.
- Offline draft, retry, and conflict tests for admission save.
- Forbidden wording tests for review and warning copy.
