# Phase 05 - Home Workflow

## Goal

Provide backend summaries needed by Home without creating clinical decisions outside the clinical workflow.

## Inspect And Reuse First

- Inspect admission listing, review, sync, facility, and dashboard modules for existing summary data.
- Reuse existing service queries and response helpers before adding a dedicated Home endpoint.

## Implementation Scope

- Expose active facility context, user role, active patient counts, draft/sync/review counts, and safe navigation status if needed.
- Keep Home summaries facility-scoped and free of patient identifiers unless a role and route explicitly require them.
- Avoid decision-support output on Home; use status summaries such as "needs review" or "sync conflict".

## Cleanup During Future Work

- Remove duplicated summary calculations between Home and dashboards by extracting service helpers only when duplication becomes real.
- Remove obsolete landing/disclaimer backend flags once frontend onboarding handles in-flow safety wording.

## Future Tests

- Route contract tests for Home summary endpoints if added.
- Facility isolation tests for counts and patient summaries.
- Role tests for reviewer/admin-only counts.
