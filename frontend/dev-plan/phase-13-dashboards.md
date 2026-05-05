# Phase 13 - Dashboards

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

## Cleanup During Future Work

- Remove duplicate chart/status components after shared dashboard components exist.
- Remove metrics that cannot be traced to reviewed or approved records.

## Future Tests

- Dashboard role-aware visibility tests.
- Responsive chart and layout checks across web, Android, and iOS.
- Accessibility tests for charts, filters, and status summaries.
