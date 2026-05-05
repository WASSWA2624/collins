# Phase 06 - Patient Registration And Admission Model

## Goal

Keep patient registration and admission data clinically useful, facility-scoped, and safe for offline creation.

## Inspect And Reuse First

- Inspect admission routes, validators, controllers, services, Prisma admission models, idempotency helpers, and tests.
- Reuse existing admission creation and update logic when it supports required pathways and missing-data rules.

## Implementation Scope

- Support patient pathways: neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and other/unknown.
- Allow `unknown`, `not_available`, or `null` for clinically missing fields where rules allow saving.
- Keep patient identifiers out of external AI/model payloads and approved training datasets.
- Preserve idempotency keys and client timestamps for offline admission creation.
- Audit registration edits and admission lifecycle changes.

## Cleanup During Future Work

- Remove duplicated admission models or legacy assessment-only fields once the required admission model covers them.
- Keep migrations narrow and avoid public contract changes without a compatibility path.

## Future Tests

- Admission route contract and Zod validation tests.
- Facility isolation and RBAC tests for admission creation, listing, detail, and patching.
- Offline idempotency tests for duplicate admission submissions.
- Clinical wording tests for pathway-specific missing-data messages.
