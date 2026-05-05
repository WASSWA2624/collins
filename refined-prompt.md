# Task: Refactor development plan files into a chronological implementation roadmap

You are working in a local monorepo with:

* `backend`: Node.js 20+, Express 5, ESM JavaScript, Prisma, MySQL, Zod, JWT/session auth
* `frontend`: Expo 54, Expo Router 6, React Native, React 19, Redux Toolkit, redux-persist, styled-components, Zod, offline/network foundations

Refactor only the development planning files so the app can be built chronologically from onboarding through final clinical decision-support, dataset governance, review, and training workflows.

Do not change application source code, tests, package files, schemas, migrations, configs, or runtime behavior.

## Files allowed to change

Only modify or create files under:

* `backend/dev-plan.md`
* `backend/dev-plan/*`
* `frontend/dev-plan.md`
* `frontend/dev-plan/*`

Do not modify app code or app rules.

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

Follow these documents over the raw task when there is a conflict.

## Development plan refactor requirements

Update the dev-plan structure so implementation is chronological, minimal, and non-duplicated.

The roadmap must progress from:

1. project foundations and startup checks
2. onboarding
3. authentication and session handling
4. facility/user roles and permissions
5. Home workflow
6. patient registration/admission
7. required 3-step admission flow:

   * Patient & reason
   * Oxygen, ABG & ventilator
   * Save & review
8. clinical tracking
9. ABG / ventilator updates
10. decision-support rules and safety flags
11. dataset capture
12. validation and review queue
13. dashboards
14. training/help
15. settings
16. governance, exports, audit, and future model-readiness

Each dev-plan file should focus on one clear functionality or phase. Create additional numbered dev-plan files if needed. Avoid duplicates, overlapping tasks, and vague catch-all files.

When existing functionality already exists, the plan must instruct future implementation to inspect it first, verify compliance with app rules, reuse it when compliant, and only replace it when necessary.

Include cleanup steps in the plan for removing unnecessary, duplicated, or obsolete code during future implementation phases, but do not perform that cleanup now.

Explicitly include removal of the current disclaimer page as a future implementation task, replacing it with appropriate in-flow clinical safety wording where required.

## Backend planning constraints

The updated dev plan must preserve existing backend architecture:

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

## Frontend planning constraints

The updated dev plan must preserve existing frontend architecture:

* Expo Router routes under `src/app`
* reusable platform code under `src/platform/*`
* Redux Toolkit state ownership
* API client conventions
* offline draft/sync queue behavior
* theme, accessibility, i18n, logging, and error boundaries
* styled-components UI conventions
* role-aware navigation and screen visibility

The roadmap must require minimal, clean, responsive UI across web, Android, and iOS. Mobile web should closely match Android and iOS layouts. Screens must remain simple, readable, and straightforward, with clear spacing, accessible forms, visible critical information, and no unnecessary UI complexity.

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

* missing data and uncertainty to be explicit
* clinician override with reason where relevant
* auditability for edits, reviews, exports, overrides, and model outputs
* population-specific calculations and wording
* no adult PBW formulas for neonatal, pediatric, adolescent, or unknown pathways
* no unreviewed records, raw notes, or demo data in approved training datasets
* no patient identifiers sent to external AI/model services

## Patient pathways

Where relevant, the roadmap must support:

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

## Data, sync, and governance boundaries

Preserve separation between:

1. reference/evidence rules
2. facility clinical records
3. reviewed, de-identified, ethics-approved training datasets

For offline/sync planning, require:

* idempotency keys
* client timestamps
* no silent overwrites
* conflict status display
* retryable sync states
* preservation of reviewed data

For AI/model planning, require:

* rule-based MVP behavior first
* predictive models hidden from normal clinicians
* shadow-mode only until governance approval
* model cards, dataset cards, drift monitoring, and override monitoring only for approved roles

## Tests in the roadmap

Because this task changes planning files only, do not add runtime tests now. Instead, every relevant phase must specify focused tests future implementation must add or update, especially for:

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

Implement only this dev-plan refactor.

Avoid unrelated refactors.

Do not change public contracts.

Create missing dev-plan folders/files only when required.

Preserve existing names, paths, and planning intent unless reorganization is necessary.

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
