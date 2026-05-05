# Backend Development Plan

This backend roadmap is chronological and intentionally narrow. It starts with startup and project foundations, then moves through onboarding, authentication, facility access, Home, admission, tracking, clinical decision-support, dataset governance, review, dashboards, training, settings, exports, audit, and future model-readiness.

Existing backend modules already cover substantial parts of this plan, including `/api/v1` routing, authentication/session handling, facility membership, admissions, append-only ABG and ventilator updates, review, dataset exports, sync conflicts, audit events, governance metadata, and pure clinical helpers. Future implementation must inspect existing routes, validators, controllers, services, Prisma usage, and tests first; reuse compliant code; and replace only code that conflicts with the app rules or clinical safety requirements.

## Global Backend Rules

- Preserve `/api/v1` versioned routes and route -> validator -> controller -> service layering.
- Keep Prisma access inside services or repository helpers.
- Validate `body`, `params`, and `query` with Zod for every route contract.
- When a frontend phase needs backend support, verify or implement the required backend route, validator, controller, service, repository/helper, Prisma schema, migration, Zod validation, auth/RBAC, facility isolation, audit logging, offline idempotency, conflict handling, and backend tests in the same chronological phase.
- Return the standard success/error response shape.
- Enforce facility membership, role checks, and facility-level isolation on every facility record.
- Audit clinical edits, reviews, exports, overrides, and model outputs.
- Keep ABG and ventilator records append-only.
- Preserve offline idempotency keys, client timestamps, retryable states, conflict status display, and no silent overwrites.
- Keep clinical calculation helpers pure and covered by focused tests.
- Use advisory wording only: "check", "review", "consider senior review", "confirm clinically", and "clinician confirms final settings".
- Never emit autonomous diagnoses, exact ventilator-setting orders, direct airway action commands, treatment/resource-allocation orders, or transfer refusal orders.
- Keep reference/evidence rules, facility clinical records, and reviewed de-identified ethics-approved training datasets separated.

## Range-Based Reference Dataset Rules

Clinical reference datasets must support validated ranges, not only exact values. Range records must include, where relevant: clinical condition or scenario, patient pathway and population applicability, parameter name, lower bound, upper bound, unit, source/evidence reference, version, facility/global scope, verification status, verified by, verified at, review notes, and audit trail.

Decision-support logic may use only reference records marked as verified. The development seed/reference dataset may mark initial records as verified so MVP rule-based decision support can run. In production, newly added or edited range records must require authorized clinician review and verification before they affect clinical calculations, flags, or prompts.

## Chronological Roadmap

1. [Project foundations and startup checks](./dev-plan/phase-01-project-foundations-startup.md)
2. [Onboarding](./dev-plan/phase-02-onboarding.md)
3. [Authentication and session handling](./dev-plan/phase-03-auth-session.md)
4. [Facility, user roles, and permissions](./dev-plan/phase-04-facility-user-roles-permissions.md)
5. [Home workflow](./dev-plan/phase-05-home-workflow.md)
6. [Admit](./dev-plan/phase-06-patient-registration-admission-model.md)
7. [Required three-step admission flow](./dev-plan/phase-07-three-step-admission-flow.md)
8. [Clinical tracking](./dev-plan/phase-08-clinical-tracking.md)
9. [ABG and ventilator updates](./dev-plan/phase-09-abg-ventilator-updates.md)
10. [Decision-support rules and safety flags](./dev-plan/phase-10-decision-support-rules-safety-flags.md)
11. [Dataset capture](./dev-plan/phase-11-dataset-capture.md)
12. [Review Queue](./dev-plan/phase-12-validation-review-queue.md)
13. [Dashboard](./dev-plan/phase-13-dashboards.md)
14. [Training / Help](./dev-plan/phase-14-training-help.md)
15. [Settings](./dev-plan/phase-15-settings.md)
16. [Governance, exports, audit, and model-readiness](./dev-plan/phase-16-governance-exports-audit-model-readiness.md)

## Cleanup Policy For Future Phases

Each phase must include a cleanup pass for only the area it touches. Remove duplicated, obsolete, or non-compliant backend code after a compliant replacement exists and tests cover the public contract. Do not change public contracts unless the phase explicitly requires a safer contract and migration path.
