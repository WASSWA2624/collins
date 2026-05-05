# Phase 11 - Dataset Capture

## Goal

Capture candidate records for reviewed, de-identified, ethics-approved datasets without mixing them with live facility records.

## Inspect And Reuse First

- Inspect dataset, review, admissions, audit, export, and governance modules before adding dataset logic.
- Reuse existing review status and export candidate services when compliant.

## Implementation Scope

- Keep reference/evidence rules, facility clinical records, and training datasets separated.
- Treat range-based reference datasets as the reference/evidence layer, not as facility clinical records or training datasets.
- Do not allow captured notes or unreviewed facility records to create or modify clinical reference ranges without authorized review, verification, versioning, and audit.
- Only reviewed and approved records can enter approved training datasets.
- Exclude patient identifiers, raw notes, and demo data from approved datasets.
- Preserve provenance, review status, facility permissions, de-identification metadata, and ethics approval references.
- Audit dataset capture, exclusion, review, and export events.

## Cleanup During Future Work

- Remove duplicate dataset-candidate queries after one reviewed-data service supports capture and export.
- Remove unsafe demo/training data paths from approved dataset flows.

## Future Tests

- Dataset candidate route contract tests.
- Data-layer separation tests for reference ranges, facility records, and training datasets.
- Tests excluding unreviewed records, identifiers, raw notes, and demo data.
- Audit tests for dataset capture and exclusion.
- Facility and role tests for dataset access.
