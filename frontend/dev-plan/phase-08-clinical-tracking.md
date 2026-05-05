# Phase 08 - Tracking

## Goal

Show active admitted patients and their clinical status without overwriting history.

## Inspect And Reuse First

- Inspect history/tracking screens, admission detail screens, timeline components, sync state, review state, and API services.
- Reuse existing list/detail components where compliant.

## Implementation Scope

- Rename user-facing History behavior to Tracking where appropriate.
- Show active facility, active patients, bed/location where allowed, risk/review status, missing data, draft state, sync state, and conflicts.
- Keep patient details role-aware and facility-scoped.
- Avoid decision orders; show prompts such as "review" or "consider senior review".

## Paired Backend Requirements

- Verify backend active admissions, admission detail, timeline, review status, and sync/conflict endpoints or service queries.
- Implement missing backend routes, validators, controllers, services, Prisma indexes/migrations, Zod response contracts, RBAC/facility isolation, audit behavior, and tests in this phase.
- Ensure frontend Tracking never depends on client-only status when backend-confirmed review or conflict status exists.

## Cleanup During Future Work

- Remove legacy History labels after Tracking routes and tests are stable.
- Remove duplicate status badges after shared status components cover sync, review, and conflicts.

## Future Tests

- Tracking list/detail tests for role and facility visibility.
- Sync conflict display tests.
- Accessibility tests for critical status alerts.
- Route tests for legacy label migration.
