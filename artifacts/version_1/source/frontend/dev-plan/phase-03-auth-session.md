# Phase 03 - Authentication And Session Handling

## Goal

Provide stable login, logout, restore, and session-expiry behavior across web, Android, and iOS.

## Inspect And Reuse First

- Inspect auth routes, session screens, Redux slices, persisted state, API client interceptors, secure storage, and tests.
- Reuse existing auth and session handling when it preserves API conventions and error boundaries.

## Implementation Scope

- Keep auth UI minimal, accessible, and clear.
- Restore sessions safely without showing facility clinical data before the session and active facility are known.
- Show retryable network states without losing drafts.
- Keep token and user data out of logs.

## Paired Backend Requirements

- Verify and reuse existing auth routes, validators, controllers, services, Prisma user/session models, JWT/session helpers, and `/api/v1` response shapes.
- If session behavior is missing or incomplete, implement backend changes, migrations, Zod validation, auth security tests, frontend API client handling, and session UI tests in the same phase.
- Confirm RBAC and facility context returned by the backend are sufficient for role-aware frontend navigation.

## Cleanup During Future Work

- Remove duplicated auth state once a single Redux owner and selector set is verified.
- Remove legacy unauthenticated routes that bypass the session guard.

## Future Tests

- Auth flow tests for login, logout, restore, expiry, and error states.
- API client tests for authenticated requests and refresh behavior.
- Accessibility tests for critical auth forms and alerts.
