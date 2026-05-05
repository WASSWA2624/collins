# Frontend Development Plan

This frontend roadmap is chronological and docs-only. It starts with Expo startup and project foundations, then moves through onboarding, authentication, facility access, Home, admission, tracking, ABG / ventilator updates, decision-support safety flags, dataset capture, review, dashboards, training/help, settings, exports, audit, and future model-readiness.

The app already has Expo Router routes under `src/app`, reusable platform code under `src/platform`, Redux Toolkit state, persistence, offline/network foundations, API client conventions, theme, accessibility, i18n, logging, error boundaries, styled-components UI conventions, and existing ventilation, training, settings, and data-source screens. Future implementation must inspect existing screens, state, services, shared utilities, tests, aliases, and configs first; reuse compliant code; and replace only code that conflicts with the app rules or clinical safety requirements.

## Global Frontend Rules

- Preserve Expo Router routes under `src/app`.
- Keep reusable platform code under `src/platform/*` and prefer uniform reusable UI components.
- Preserve Redux Toolkit state ownership, redux-persist, API client conventions, offline drafts, sync queue behavior, theme, accessibility, i18n, logging, and error boundaries.
- Keep styled-components conventions and avoid unnecessary UI complexity.
- Keep UI minimal, clean, readable, responsive, and consistent across web, Android, and iOS; mobile web should closely match native layouts.
- Keep role-aware navigation and screen visibility, while relying on backend enforcement for security.
- Make missing data, uncertainty, review status, and sync state visible.
- Use advisory wording only: "check", "review", "consider senior review", "confirm clinically", and "clinician confirms final settings".
- Never display autonomous diagnoses, exact ventilator-setting orders, direct airway action commands, treatment/resource-allocation orders, or transfer refusal orders.
- Keep reference/evidence rules, facility clinical records, and reviewed de-identified ethics-approved training datasets separated.

## Full-Stack Phase Gate

Every frontend phase must be implemented with its matching backend support. Before changing UI, future implementation must verify the frontend route/screen/state/API client behavior and the backend route, validator, controller, service, repository/helper behavior. If backend support already exists, verify compliance and reuse it. If it is missing or incomplete, implement the backend in the same phase before marking the frontend work complete.

Each feature phase must also check Prisma schema changes and migrations, Zod request/response validation, auth/RBAC and facility isolation, audit logging, offline idempotency and conflict handling, and focused frontend and backend tests.

## Range-Based Reference Dataset Rules

Clinical reference datasets must use validated ranges where clinically relevant, not only exact values. Range records need condition/scenario, patient pathway and population applicability, parameter name, lower bound, upper bound, unit, source/evidence reference, version, facility/global scope, verification status, verified by, verified at, review notes, and audit trail.

Decision-support UI may display or apply only backend-confirmed values from verified reference records. Frontend previews can use the development seed/reference dataset only when those seed records are marked verified for MVP development. Production additions must remain hidden from active decision support until authorized clinician review and verification are complete.

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

Each phase must include a cleanup pass for only the area it touches. Remove duplicated, obsolete, or non-compliant frontend code after a compliant replacement exists and focused tests cover user-visible behavior. Do not change public route paths or backend contracts unless a phase explicitly includes a safe migration path.
