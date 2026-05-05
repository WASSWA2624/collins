# Phase 04 - Facility, User Roles, And Permissions

## Goal

Make active facility and role context visible and use it to gate navigation.

## Inspect And Reuse First

- Inspect facility screens, user profile state, role selectors, navigation config, API services, and role-aware tests.
- Reuse existing facility and permission state when it aligns with backend roles.

## Implementation Scope

- Support clinician, reviewer, facility admin, dataset/governance, and model-governance visibility.
- Keep role-aware navigation as UX only; backend remains authoritative.
- Show active facility and sync status on clinical workflows.
- Prevent cross-facility confusion in drafts, queues, and review screens.

## Paired Backend Requirements

- Verify and reuse backend facility, membership, role, equipment profile, and verification routes with route -> validator -> controller -> service layering.
- If role or facility behavior is missing, implement Prisma schema/migration updates, Zod contracts, RBAC checks, facility isolation, audit logs, and backend/frontend tests in this phase.
- Ensure backend facility membership remains authoritative even when frontend hides unavailable actions.

## Cleanup During Future Work

- Remove duplicated permission checks after shared selectors and route guards cover them.
- Remove unused role labels only after checking backend contracts and tests.

## Future Tests

- Role-aware visibility tests for Home, Tracking, Review Queue, Dashboard, Dataset Capture, Training / Help, and Settings.
- Facility switch tests proving drafts and queues remain facility-scoped.
- Accessibility tests for active facility controls.
