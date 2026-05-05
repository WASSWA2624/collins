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

## Cleanup During Future Work

- Remove dataset flows that bypass reviewer approval or de-identification.
- Remove raw-note persistence from approved dataset paths.

## Future Tests

- Dataset capture form and preview tests.
- Tests blocking unreviewed records, raw notes, identifiers, and demo data from approved datasets.
- Offline draft and sync tests for captured candidates.
- Role-aware visibility tests for dataset approval controls.
