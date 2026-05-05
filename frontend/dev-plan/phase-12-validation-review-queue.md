# Phase 12 - Validation And Review Queue

## Goal

Give reviewers a focused queue for validating records, corrections, exclusions, and dataset readiness.

## Inspect And Reuse First

- Inspect review queue screens, role guards, admission summaries, dataset capture state, audit metadata, and API services.
- Reuse existing review components and selectors where compliant.

## Implementation Scope

- Show records needing review, missing data, uncertainty, sync conflicts, corrections, exclusions, and override reasons.
- Preserve reviewed data and show conflict status rather than silently overwriting.
- Keep reviewer actions role-gated and facility-scoped.
- Make export readiness clear without approving training data automatically.

## Cleanup During Future Work

- Remove duplicated review status displays after shared review/status components are verified.
- Remove obsolete reviewer-only routes after role-aware navigation is canonical.

## Future Tests

- Review Queue visibility and action tests.
- Offline conflict and reviewed-data preservation tests.
- Accessibility tests for review alerts and correction forms.
- Forbidden wording tests for reviewer notes and summaries.
