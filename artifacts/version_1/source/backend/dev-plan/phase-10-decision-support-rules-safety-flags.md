# Phase 10 - Decision-Support Rules And Safety Flags

## Goal

Provide rule-based clinical decision support that is advisory, pathway-aware, and testable.

## Inspect And Reuse First

- Inspect `src/clinical` helpers, rule metadata, admissions services, review services, and existing clinical tests.
- Reuse pure helpers for calculations and flags before adding new service logic.

## Implementation Scope

- Keep rule-based MVP behavior first.
- Implement clinical reference datasets as validated ranges, not only exact values.
- Require range records to include, where relevant: clinical condition/scenario, patient pathway/population applicability, parameter name, lower bound, upper bound, unit, source/evidence reference, version, facility/global scope, verification status, verified by, verified at, review notes, and audit trail.
- Use only verified reference range records for decision-support calculations, flags, and prompts.
- Allow the development seed/reference dataset to mark initial records verified so the MVP can run; production additions and edits must require authorized clinician review before use.
- Make missing data and uncertainty explicit.
- Use population-specific calculations and wording.
- Do not use adult PBW formulas for neonatal, pediatric, adolescent, or unknown pathways.
- Require clinician confirmation or override reason where relevant.
- Keep model predictions hidden from normal clinicians and unavailable for clinical decisions until governance approval.

## Cleanup During Future Work

- Remove duplicated calculations embedded in controllers or services.
- Remove unsafe phrasing from seed data, fixtures, and response messages when encountered.

## Future Tests

- Pure clinical calculator tests across supported pathways.
- Range-based reference dataset validation tests.
- Verified-only decision-use tests proving unverified range records are ignored.
- Safety flag tests for missing data and uncertainty.
- Forbidden wording tests for all user-facing clinical summaries.
- Contract tests proving responses remain advisory.
