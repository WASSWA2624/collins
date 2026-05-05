# Phase 13 - Dashboards

## Goal

Expose facility-scoped operational and governance summaries without leaking identifiers or creating clinical orders.

## Inspect And Reuse First

- Inspect admin, review, dataset, admissions, sync, and audit services for existing dashboard data.
- Reuse existing aggregate queries and role checks before adding dashboard-specific endpoints.

## Implementation Scope

- Provide counts, trends, review backlog, sync conflicts, dataset readiness, override summaries, and drift/governance metrics for approved roles.
- Keep clinician dashboards focused on workload and review status, not predictive model output.
- Hide model and governance dashboards from normal clinicians.
- Avoid patient identifiers in aggregate responses unless a protected drill-down route explicitly requires them.

## Cleanup During Future Work

- Remove duplicated aggregate queries once shared dashboard service helpers are verified.
- Remove metrics that cannot be audited or traced to approved records.

## Future Tests

- Dashboard route contract tests.
- Role-aware access tests for clinician, reviewer, admin, and governance users.
- Facility isolation tests for aggregate data.
- Audit/provenance tests for exported dashboard metrics where relevant.
