# Phase 09 - ABG / Vent Update

## Goal

Record Current readings as append-only clinical events with server-side validation and recalculation.

## Inspect And Reuse First

- Inspect existing ABG and ventilator append endpoints, validators, services, Prisma models, versioning, idempotency, and tests.
- Reuse the current append-only implementation when it already preserves historical records.

## Implementation Scope

- Validate body, params, and query with Zod.
- Require facility membership and admission access checks before writes.
- Preserve client timestamps, server timestamps, source, idempotency keys, and conflict records.
- Recalculate derived clinical values server-side from stored data.
- Return advisory checks and review prompts only, never exact ventilator-setting orders.

## Cleanup During Future Work

- Remove any update-in-place ABG or ventilator paths after append-only paths fully replace them.
- Remove duplicated calculation code from services by using pure clinical helpers.

## Future Tests

- Append-only ABG and ventilator route tests.
- Idempotency and duplicate submission tests.
- Conflict handling tests for stale client timestamps.
- Clinical calculation and forbidden wording tests.
