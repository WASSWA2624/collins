# Task: Update dev-plan files for synchronized frontend/backend implementation and verified range-based datasets

You are working in a local monorepo with:

* `backend`: Node.js 20+, Express 5, ESM JavaScript, Prisma, MySQL, Zod, JWT/session auth
* `frontend`: Expo 54, Expo Router 6, React Native, React 19, Redux Toolkit, redux-persist, styled-components, Zod, offline/network foundations

Update the development planning files so future implementation proceeds chronologically, with frontend work always checked and implemented together with its required backend support, migrations, validation, tests, and dataset governance.

Do not change application source code, schemas, migrations, package files, configs, tests, or runtime behavior in this task.

## Files allowed to change

Only modify or create files under:

* `backend/dev-plan.md`
* `backend/dev-plan/*`
* `frontend/dev-plan.md`
* `frontend/dev-plan/*`

## Required inspection before editing

Before making changes, inspect and follow:

* `app-write-up.md`
* `backend/app-rules/*`
* `backend/dev-plan.md`
* `backend/dev-plan/*`
* `frontend/app-rules/*`
* `frontend/dev-plan.md`
* `frontend/dev-plan/*`
* relevant existing backend and frontend source files, tests, routes, services, screens, state, APIs, and shared utilities

Follow these documents over this task when there is a conflict.

## Required dev-plan updates

Refactor the dev plans so every frontend phase explicitly includes the matching backend checks and implementation requirements.

For each feature phase, require future implementation to verify and update, when needed:

* frontend route/screen/state/API client behavior
* backend route, validator, controller, service, repository/helper behavior
* Prisma schema changes and migrations
* Zod request/response validation
* auth, RBAC, and facility isolation
* audit logging
* offline idempotency and conflict handling
* tests for both frontend and backend behavior

If backend support already exists, the plan must instruct future implementation to verify compliance and reuse it. If it is missing or incomplete, implement the backend in the same phase as the frontend change. Avoid frontend-only feature plans when backend support is required.

## Chronological workflow alignment

Ensure the roadmap remains chronological and aligned to:

1. project foundations and startup checks
2. onboarding
3. authentication and session handling
4. facility, user, role, and permission setup
5. Home
6. Admit
7. required 3-step admission flow:

   * Patient & reason
   * Oxygen, ABG & ventilator
   * Save & review
8. Tracking
9. ABG / Vent Update
10. decision-support rules and safety flags
11. Dataset Capture
12. Review Queue
13. Dashboard
14. Training / Help
15. Settings
16. governance, exports, audit, and future model-readiness

Support all patient pathways where relevant:

* neonate
* infant
* child
* adolescent
* adult
* obstetric/post-partum
* burns
* trauma
* peri-operative
* medical
* surgical
* other/unknown

Allow `unknown`, `not_available`, or `null` for clinically missing fields where app rules allow saving.

## Range-based dataset planning

Update the dev plans so clinical reference datasets use validated ranges, not only exact values.

The dataset plan must require range records to include, where relevant:

* clinical condition or scenario
* patient pathway and population applicability
* parameter name
* lower bound
* upper bound
* unit
* source/evidence reference
* version
* facility/global scope
* verification status
* verified by
* verified at
* review notes
* audit trail

Decision-support logic must only use dataset records marked as verified. For the current development seed/reference dataset only, plan for initial records to be marked verified so MVP decision-support can run. In production, newly added dataset records must require review and verification by authorized clinicians before use.

The plan must preserve separation between:

1. reference/evidence rules
2. facility clinical records
3. reviewed, de-identified, ethics-approved training datasets

Do not allow unreviewed records, raw notes, demo data, or patient identifiers into approved training datasets.

## Backend architecture constraints

Preserve existing backend patterns:

* `/api/v1` versioned routes
* route → validator → controller → service layering
* Prisma access inside services/repository helpers
* Zod validation for `body`, `params`, and `query`
* standard success/error response shape
* facility membership and facility-level isolation
* audit logging
* append-only ABG and ventilator records
* offline idempotency and conflict handling
* pure clinical calculation helpers with tests

## Frontend architecture constraints

Preserve existing frontend patterns:

* Expo Router routes under `src/app`
* reusable platform code under `src/platform/*`
* Redux Toolkit state ownership
* API client conventions
* offline draft/sync queue behavior
* theme, accessibility, i18n, logging, and error boundaries
* styled-components UI conventions
* role-aware navigation and screen visibility

Keep UI planning minimal, readable, responsive, and consistent across web, Android, iOS, and mobile web.

## Clinical safety requirements

This app is clinical decision support only. Do not plan autonomous clinical orders.

Allowed wording:

* “check”
* “review”
* “consider senior review”
* “confirm clinically”
* “clinician confirms final settings”

Forbidden outputs:

* “Diagnosed ARDS”
* exact ventilator-setting orders
* “intubate now”
* “extubate now”
* medication, fluid, vasopressor, paralysis, ECMO, rationing, or transfer-denial orders

The plan must require:

* explicit missing data and uncertainty
* clinician override with reason where relevant
* auditability for edits, reviews, exports, overrides, and model outputs
* population-specific calculations and wording
* no adult PBW formulas for neonatal, pediatric, adolescent, or unknown pathways
* no patient identifiers sent to external AI/model services

## Offline, sync, and governance requirements

For offline/sync planning, require:

* idempotency keys
* client timestamps
* no silent overwrites
* conflict status display
* retryable sync states
* reviewed data preservation

For model/AI planning, require:

* rule-based MVP behavior first
* predictive models hidden from normal clinicians
* shadow-mode only until governance approval
* model cards, dataset cards, drift monitoring, and override monitoring only for approved roles

## Tests in the roadmap

Because this task changes planning files only, do not add runtime tests now. Instead, every relevant phase must specify future focused tests for:

* range-based dataset validation and verified-only decision use
* clinical calculators and flags
* forbidden clinical wording
* route contracts and response shapes
* Zod validation
* auth, RBAC, and facility isolation
* append-only ABG/ventilator updates
* offline drafts, sync queue, retry, and conflicts
* role-aware frontend visibility
* accessibility for critical forms and alerts

## Scope limits

Implement only this dev-plan update.

Avoid unrelated refactors.

Do not change public contracts.

Create missing dev-plan files only when required.

Avoid duplicate or overlapping dev-plan files.

Document unavoidable assumptions in the final implementation summary.

## Final response required

Return:

* brief implementation summary
* complete changed dev-plan files only
* each file labeled as `Modified file`, `New file`, or `Deleted file`
* exact repository-relative paths
* tests added/updated, or state that no runtime tests were changed because this was docs-only
* commands to run, if any
* safe deletion script if any files are deleted
