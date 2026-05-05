# Phase 12 - Validation And Review Queue

## Goal

Provide a reviewer workflow that preserves reviewed data and records every decision.

## Inspect And Reuse First

- Inspect review routes, validators, services, audit events, dataset candidate logic, and role checks.
- Reuse existing review queue and status transitions where they satisfy governance requirements.

## Implementation Scope

- Support reviewer triage, validation status, comments, override reasons, and return-to-clinician workflows.
- Keep review actions facility-scoped and role-protected.
- Preserve reviewed data during sync retries and conflicts.
- Make missing data explicit instead of blocking saves unless app rules require blocking.
- Audit all reviews, approvals, rejections, exports, overrides, and edits.

## Cleanup During Future Work

- Remove obsolete review statuses only after migrations preserve reviewed data.
- Consolidate duplicate validation messages with clinical rule helpers.

## Future Tests

- Review queue route contract tests.
- RBAC and facility isolation tests for reviewer actions.
- Audit tests for review status changes.
- Sync conflict tests proving reviewed data is preserved.
