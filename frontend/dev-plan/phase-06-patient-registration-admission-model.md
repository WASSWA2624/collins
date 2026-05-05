# Phase 06 - Patient Registration And Admission Model

## Goal

Represent patient and admission data for all required pathways without unsafe assumptions.

## Inspect And Reuse First

- Inspect assessment/admission screens, form state, validation schemas, API payload builders, offline drafts, and tests.
- Reuse existing fields and components when they satisfy the required admission model.

## Implementation Scope

- Support neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and other/unknown pathways.
- Allow `unknown`, `not_available`, or `null` for clinically missing fields where rules allow saving.
- Keep patient identifiers out of external AI/model services and approved training datasets.
- Store drafts with facilityId, idempotency key, and client timestamp.

## Cleanup During Future Work

- Remove legacy assessment-only fields after the admission model covers required clinical data.
- Remove duplicated form schema logic by sharing validators and field definitions.

## Future Tests

- Form validation tests for every supported pathway.
- Draft persistence tests for missing and unknown values.
- Payload builder tests for idempotency keys and client timestamps.
- Forbidden wording tests for pathway-specific copy.
