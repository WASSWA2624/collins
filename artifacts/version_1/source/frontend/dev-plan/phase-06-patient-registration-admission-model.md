# Phase 06 - Admit

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

## Paired Backend Requirements

- Verify backend admission routes, validators, controllers, services, Prisma models, migrations, idempotency helpers, audit logging, and facility isolation for all supported pathways.
- If the Admit data model is incomplete, implement backend schema/migration and service updates in this phase before completing frontend forms.
- Add paired tests for frontend validation/draft behavior and backend route contracts, Zod validation, auth/RBAC, facility isolation, audit, and offline idempotency.

## Cleanup During Future Work

- Remove legacy assessment-only fields after the admission model covers required clinical data.
- Remove duplicated form schema logic by sharing validators and field definitions.

## Future Tests

- Form validation tests for every supported pathway.
- Draft persistence tests for missing and unknown values.
- Payload builder tests for idempotency keys and client timestamps.
- Forbidden wording tests for pathway-specific copy.
