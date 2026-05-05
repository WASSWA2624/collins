# Phase 11 - Dataset Capture

## Goal

Capture candidate data for review without treating it as approved training data.

## Inspect And Reuse First

- Inspect data-source screens, note parsing, ventilation dataset utilities, review services, offline queue, and tests.
- Reuse existing parsing/preview foundations only when they preserve governance boundaries.

## Implementation Scope

- Support paste note, structured preview, editable fields, uncertainty highlights, missing value display, and submit-for-review.
- Keep patient identifiers out of approved datasets and external model services.
- Do not allow normal clinicians to approve training datasets.
- Separate live facility records from reviewed de-identified approved training datasets.

## Paired Backend Requirements

- Verify backend dataset parse/import/review routes, validators, controllers, services, Prisma models, migrations, Zod contracts, de-identification, audit logging, idempotency, and conflict handling.
- If backend capture or review support is incomplete, implement it in the same phase as frontend Dataset Capture.
- Keep range-based reference datasets separate from captured facility notes and reviewed training datasets; captured notes must not create active reference ranges without authorized review and verification.
- Add paired frontend parser/preview/offline tests and backend contract, validation, role, facility isolation, de-identification, audit, and dataset-governance tests.

## Cleanup During Future Work

- Remove dataset flows that bypass reviewer approval or de-identification.
- Remove raw-note persistence from approved dataset paths.

## Future Tests

- Dataset capture form and preview tests.
- Tests blocking unreviewed records, raw notes, identifiers, and demo data from approved datasets.
- Offline draft and sync tests for captured candidates.
- Role-aware visibility tests for dataset approval controls.
