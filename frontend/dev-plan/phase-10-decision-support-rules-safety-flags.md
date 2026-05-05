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

## Cleanup During Future Work

- Remove unsafe recommendation copy and any online-AI clinician path unless governance has approved it.
- Remove duplicated calculations from screens by centralizing pure preview helpers.

## Future Tests

- Pure calculation tests across supported pathways.
- Forbidden wording tests for summaries, flags, and alerts.
- Accessibility tests for critical advisory alerts.
- Role tests proving model internals are hidden from normal clinicians.
