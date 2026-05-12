# Phase 16 - Governance, Exports, Audit, And Model-Readiness

## Goal

Prepare role-gated governance workflows while keeping normal clinical use rule-based and safe.

## Inspect And Reuse First

- Inspect model/governance screens, dataset export flows, review queue, audit metadata display, API services, and role guards.
- Reuse existing admin/governance foundations when compliant.

## Implementation Scope

- Keep predictive models hidden from normal clinicians.
- Use shadow-mode only until governance approval.
- Show model cards, dataset cards, drift monitoring, and override monitoring only for approved roles.
- Show exports as reviewed, de-identified, ethics-approved, traceable, and auditable.
- Do not send patient identifiers to external AI/model services.

## Paired Backend Requirements

- Verify backend governance routes for exports, audit logs, model cards, dataset cards, drift monitoring, override monitoring, reference range lifecycle, and shadow-mode model output.
- Implement missing backend validators, controllers, services, Prisma schema/migrations, Zod contracts, RBAC/facility isolation, audit logging, export controls, and tests in this phase.
- Ensure only verified range records and reviewed/de-identified/ethics-approved datasets can support decision logic, exports, or model-readiness workflows.

## Cleanup During Future Work

- Remove clinician-facing model/debug/matched-case details unless governance explicitly approves a role-gated workflow.
- Remove export UI paths that bypass review, de-identification, or ethics approval.

## Future Tests

- Role-aware tests for model cards, dataset cards, drift, override monitoring, and exports.
- Range reference governance tests for verification, activation, retirement, and audit visibility.
- Tests blocking unreviewed records, raw notes, demo data, and identifiers from approved exports.
- Accessibility tests for governance tables and alerts.
- Forbidden wording tests for model and governance output.
