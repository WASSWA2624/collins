# Phase 03 - Authentication And Session Handling

## Goal

Provide stable JWT/session authentication that lets users resume work safely across web, Android, and iOS clients.

## Inspect And Reuse First

- Inspect existing auth routes, validators, controllers, services, password/session helpers, middleware, and tests.
- Reuse current JWT/session code when it preserves response shapes, facility isolation, and role checks.

## Implementation Scope

- Keep login, logout, refresh, current-user, and session-expiry behavior predictable.
- Return user identity, active facility context, role summaries, and permissions needed by role-aware clients without exposing other facilities.
- Do not include patient identifiers in logs, tokens, or external model payloads.
- Enforce session invalidation and safe error messages.

## Cleanup During Future Work

- Remove duplicate session storage utilities or unused token fields after migration tests pass.
- Consolidate auth error responses under the shared error response helper.

## Future Tests

- Auth route contract tests for success and failure responses.
- Zod validation tests for login and refresh payloads.
- RBAC and facility-isolation tests for authenticated route access.
- Audit tests for security-sensitive session events where required.
