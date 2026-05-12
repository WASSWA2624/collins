# Phase 07 - Required Three-Step Admission Flow

## Goal

Back the required admission workflow with a minimal contract that supports exactly these user-facing steps: Patient & reason; Oxygen, ABG & ventilator; Save & review.

## Inspect And Reuse First

- Inspect existing admission creation, patching, clinical snapshot, ABG, ventilator, and review-readiness services.
- Reuse existing append-only and idempotent write helpers instead of creating a separate wizard persistence path.

## Implementation Scope

- Step 1 stores patient pathway, reason for support, facility context, and permitted missing fields.
- Step 2 stores oxygen support, ABG values, ventilator values, timing, device context, and explicit uncertainty.
- Step 3 validates save readiness, returns warnings for missing data, and records clinician review/override reason where relevant.
- Keep the server authoritative for recalculated flags and safety summaries.
- Never turn warnings into exact orders or autonomous diagnoses.

## Cleanup During Future Work

- Collapse legacy multi-step admission or assessment endpoints only after the three-step contract is covered by tests and clients have migrated.
- Remove duplicated validation schemas by composing shared Zod schemas.

## Future Tests

- Contract tests for each admission step and final save/review response.
- Zod tests for body, params, and query validation.
- Missing-data and uncertainty tests for all supported pathways.
- Audit tests for save, review, and clinician override events.
