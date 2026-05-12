# Phase 12 - Review Queue

## Goal

Provide a reviewer workflow that preserves reviewed data and records every decision.

## Inspect And Reuse First

- Inspect review routes, validators, services, audit events, dataset candidate logic, and role checks.
- Reuse existing review queue and status transitions where they satisfy governance requirements.

## Implementation Scope

- Support reviewer triage, validation status, comments, override reasons, and return-to-clinician workflows.
- Include authorized clinician review and verification workflows for new or edited reference range records before decision-support use.
- Preserve verification metadata for range records: status, verified by, verified at, review notes, version, and audit trail.
- Keep review actions facility-scoped and role-protected.
- Preserve reviewed data during sync retries and conflicts.
- Make missing data explicit instead of blocking saves unless app rules require blocking.
- Audit all reviews, approvals, rejections, exports, overrides, and edits.

## Cleanup During Future Work

- Remove obsolete review statuses only after migrations preserve reviewed data.
- Consolidate duplicate validation messages with clinical rule helpers.

## Future Tests

- Review queue route contract tests.
- Reference range verification workflow tests.
- Verified-only decision-support tests after range review decisions.
- RBAC and facility isolation tests for reviewer actions.
- Audit tests for review status changes.
- Sync conflict tests proving reviewed data is preserved.
