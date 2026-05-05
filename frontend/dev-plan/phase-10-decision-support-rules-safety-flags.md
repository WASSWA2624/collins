# Phase 10 - Decision-Support Rules And Safety Flags

## Goal

Show rule-based advisory calculations and flags with explicit uncertainty.

## Inspect And Reuse First

- Inspect local clinical preview helpers, recommendation screens, ventilation model code, live summary components, API summary handling, and tests.
- Reuse pure helper functions and backend-provided rule metadata when compliant.

## Implementation Scope

- Keep rule-based MVP behavior first.
- Show reference weight, VT/kg, P/F or S/F, ABG flags, pressure flags, oxygen caution, missing data, review status, and sync status.
- Use population-specific calculations and wording.
- Do not use adult PBW formulas for neonatal, pediatric, adolescent, or unknown pathways.
- Hide predictive or matched-case model output from normal clinicians.
- Do not send patient identifiers to external AI/model services.

## Paired Backend Requirements

- Verify backend pure clinical helpers, reference/range dataset services, rule metadata, admissions summaries, and verified-only decision-support behavior.
- Implement missing backend route, validator, controller, service, repository/helper, Prisma schema/migration, Zod contracts, audit trail, and tests for range records before frontend displays them.
- Require range records to include condition/scenario, pathway/population applicability, parameter, lower/upper bounds, unit, source, version, scope, verification status, verified by/at, review notes, and audit trail.
- Use backend-confirmed verified reference records for saved clinical summaries; frontend previews must clearly show pending/unconfirmed status until the backend confirms.

## Cleanup During Future Work

- Remove unsafe recommendation copy and any online-AI clinician path unless governance has approved it.
- Remove duplicated calculations from screens by centralizing pure preview helpers.

## Future Tests

- Pure calculation tests across supported pathways.
- Range-based dataset validation and verified-only decision-use tests.
- Forbidden wording tests for summaries, flags, and alerts.
- Accessibility tests for critical advisory alerts.
- Role tests proving model internals are hidden from normal clinicians.
