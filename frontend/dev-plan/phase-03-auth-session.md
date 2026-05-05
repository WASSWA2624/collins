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

## Cleanup During Future Work

- Remove duplicated auth state once a single Redux owner and selector set is verified.
- Remove legacy unauthenticated routes that bypass the session guard.

## Future Tests

- Auth flow tests for login, logout, restore, expiry, and error states.
- API client tests for authenticated requests and refresh behavior.
- Accessibility tests for critical auth forms and alerts.
