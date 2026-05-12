# Phase 09 - ABG / Vent Update

## Goal

Provide a fast append-only update workflow for ABG and ventilator records.

## Inspect And Reuse First

- Inspect ABG/ventilator forms, assessment update pieces, API services, offline queue, clinical summary, and tests.
- Reuse existing form fields and validators when they support append-only writes.

## Implementation Scope

- Add or refine the ABG / Vent Update workflow for selected active admissions.
- Preserve client timestamps, idempotency keys, source, uncertainty, and retry state.
- Display latest values and history without editing prior records in place.
- Show advisory flags and missing data, not exact setting orders.

## Paired Backend Requirements

- Verify backend append-only ABG and ventilator routes, validators, controllers, services, Prisma records, idempotency helpers, conflict detection, and audit logging.
- If append-only behavior or validation is incomplete, implement backend changes and migrations in the same phase as frontend ABG / Vent Update work.
- Add paired tests for frontend queue/retry/conflict UI and backend route contracts, Zod validation, append-only writes, facility isolation, audit, and idempotency.

## Cleanup During Future Work

- Remove any UI that edits historical ABG or ventilator records in place after append-only updates are verified.
- Remove duplicated numeric input components after shared clinical field components exist.

## Future Tests

- Append-only ABG and ventilator form tests.
- Offline queue, retry, and conflict tests.
- Accessibility tests for numeric fields and alerts.
- Clinical flag and forbidden wording tests for update summaries.
