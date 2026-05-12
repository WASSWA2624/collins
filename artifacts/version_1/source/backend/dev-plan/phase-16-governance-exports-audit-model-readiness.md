# Phase 16 - Governance, Exports, Audit, And Model-Readiness

## Goal

Prepare the backend for governed exports and future models while keeping the MVP rule-based and clinically safe.

## Inspect And Reuse First

- Inspect dataset exports, model cards, dataset cards, drift metrics, override monitoring, audit services, and admin/governance routes.
- Reuse existing governance metadata and audit events when compliant.

## Implementation Scope

- Keep predictive models shadow-mode only until governance approval.
- Hide predictive model outputs and controls from normal clinicians.
- Require model cards, dataset cards, drift monitoring, and override monitoring for approved roles only.
- Require versioned reference range records and dataset cards or equivalent governance metadata for range datasets used by decision support.
- Audit every create, edit, verification, activation, retirement, export, and override involving reference ranges, reviewed datasets, and model outputs.
- Ensure exports are de-identified, reviewed, ethics-approved, traceable, and auditable.
- Prevent patient identifiers from being sent to external AI/model services.
- Preserve auditability for edits, reviews, exports, overrides, and model outputs.

## Cleanup During Future Work

- Remove experimental model endpoints from clinician routes once governance routes are canonical.
- Remove export paths that bypass review, de-identification, or ethics approval.

## Future Tests

- Export contract tests for reviewed, de-identified, approved datasets.
- Reference range governance tests for verification, activation, retirement, and audit events.
- Tests blocking unreviewed records, raw notes, demo data, and identifiers.
- RBAC tests for governance-only model metadata.
- Audit tests for exports, overrides, model outputs, and drift records.
