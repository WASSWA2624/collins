# Phase 13 - Dashboard

## Goal

Show facility and governance summaries for approved roles without exposing unsafe model output.

## Inspect And Reuse First

- Inspect dashboard/admin screens, review/dataset services, selectors, charts, accessibility support, and role guards.
- Reuse existing dashboard components only when they remain minimal and readable.

## Implementation Scope

- Show active workload, review backlog, sync conflicts, dataset readiness, override summaries, and governance metrics by role.
- Keep normal clinician dashboards operational, not predictive.
- Hide model cards, drift, and override monitoring from normal clinicians.
- Avoid patient identifiers in aggregate dashboard views unless a protected drill-down requires them.

## Paired Backend Requirements

- Verify backend dashboard/admin routes and services for active workload, review backlog, sync conflicts, dataset readiness, range verification backlog, audit summaries, and governance metrics.
- Implement missing backend routes, validators, controllers, services, Prisma queries/indexes/migrations, Zod contracts, RBAC/facility isolation, auditability, and tests in this phase.
- Ensure frontend dashboards use backend-authorized aggregates and never expose governance/model details to normal clinicians.

## Cleanup During Future Work

- Remove duplicate chart/status components after shared dashboard components exist.
- Remove metrics that cannot be traced to reviewed or approved records.

## Future Tests

- Dashboard role-aware visibility tests.
- Responsive chart and layout checks across web, Android, and iOS.
- Accessibility tests for charts, filters, and status summaries.
