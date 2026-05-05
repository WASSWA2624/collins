# Phase 12 - Review Queue

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

## Paired Backend Requirements

- Verify backend review queue, approve/correct/exclude, conflict resolution, reference range verification, and dataset readiness routes and services.
- Implement missing backend validators, controllers, services, Prisma schema/migrations, Zod contracts, RBAC, facility isolation, audit logs, offline conflict handling, and tests in this same phase.
- Ensure Review Queue can verify range records for decision-support use while preserving reviewed facility data and training dataset boundaries.

## Cleanup During Future Work

- Remove duplicated review status displays after shared review/status components are verified.
- Remove obsolete reviewer-only routes after role-aware navigation is canonical.

## Future Tests

- Review Queue visibility and action tests.
- Reference range review/verification tests.
- Offline conflict and reviewed-data preservation tests.
- Accessibility tests for review alerts and correction forms.
- Forbidden wording tests for reviewer notes and summaries.
