# Phase 04 - Facility, User Roles, And Permissions

## Goal

Ensure every facility-scoped operation is isolated by membership and role.

## Inspect And Reuse First

- Inspect facility, membership, admin, auth middleware, Prisma schema relations, tests, and any shared authorization helpers.
- Reuse existing membership checks and role utilities when they consistently enforce facility boundaries.

## Implementation Scope

- Support roles needed by clinicians, reviewers, facility admins, dataset/governance users, and model-governance users.
- Keep role-aware visibility as a frontend convenience; backend enforcement remains authoritative.
- Require facilityId scoping for all facility records and queries.
- Audit membership, role, and facility-setting changes.

## Cleanup During Future Work

- Remove ad hoc role checks duplicated inside controllers once shared service or middleware checks cover them.
- Remove unused role names only after confirming they are not referenced by frontend navigation or tests.

## Future Tests

- RBAC tests for each protected route category.
- Facility isolation tests proving users cannot read or write another facility's records.
- Zod validation tests for facility and membership changes.
- Audit tests for role and permission changes.
