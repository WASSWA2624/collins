# Phase 08 - Clinical Tracking

## Goal

Track admitted patients over time without overwriting clinical history.

## Inspect And Reuse First

- Inspect admission detail, clinical snapshot, daily review, outcome, review status, and audit services.
- Reuse existing timeline and latest-summary helpers when compliant.

## Implementation Scope

- Provide facility-scoped tracking lists, patient timelines, current status, sync state, and review state.
- Preserve append-only clinical history and show conflicts without silent overwrite.
- Allow clinician override with reason where relevant.
- Keep tracking summaries advisory and explicit about missing data.

## Cleanup During Future Work

- Remove duplicate timeline builders once a single service can supply Tracking, Review Queue, and Dashboard safely.
- Remove obsolete status values only after sync and review migrations preserve reviewed records.

## Future Tests

- Tracking route contract tests.
- Facility isolation tests for list and detail views.
- Append-only timeline tests.
- Conflict status and retryable sync-state tests.
