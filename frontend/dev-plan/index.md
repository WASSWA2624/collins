# Frontend Implementation Roadmap

Run these phases in order. Every phase starts by inspecting existing routes, screens, platform components, state slices, selectors, API services, offline utilities, tests, aliases, Metro/Babel/Expo config, and shared helpers. Reuse compliant code and clean up only the area being implemented.

Every frontend phase must be paired with backend verification or implementation in the same phase. Check backend routes, validators, controllers, services, repository/helpers, Prisma schema and migrations, Zod validation, auth/RBAC, facility isolation, audit logging, offline idempotency, conflict handling, and backend tests before marking frontend work complete.

1. [Project foundations and startup checks](./phase-01-project-foundations-startup.md)
2. [Onboarding](./phase-02-onboarding.md)
3. [Authentication and session handling](./phase-03-auth-session.md)
4. [Facility, user roles, and permissions](./phase-04-facility-user-roles-permissions.md)
5. [Home workflow](./phase-05-home-workflow.md)
6. [Admit](./phase-06-patient-registration-admission-model.md)
7. [Required three-step admission flow](./phase-07-three-step-admission-flow.md)
8. [Clinical tracking](./phase-08-clinical-tracking.md)
9. [ABG and ventilator updates](./phase-09-abg-ventilator-updates.md)
10. [Decision-support rules and safety flags](./phase-10-decision-support-rules-safety-flags.md)
11. [Dataset capture](./phase-11-dataset-capture.md)
12. [Review Queue](./phase-12-validation-review-queue.md)
13. [Dashboard](./phase-13-dashboards.md)
14. [Training / Help](./phase-14-training-help.md)
15. [Settings](./phase-15-settings.md)
16. [Governance, exports, audit, and model-readiness](./phase-16-governance-exports-audit-model-readiness.md)
