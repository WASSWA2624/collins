## Task: Rebrand App to AI Vent and Improve Authentication Entry UX

Update the local monorepo app branding and sign-in experience.

Before making changes, inspect and follow:

* `app-write-up.md`
* `backend/app-rules/*`
* `backend/dev-plan.md`
* `backend/dev-plan/*`
* `frontend/app-rules/*`
* `frontend/dev-plan.md`
* `frontend/dev-plan/*`
* relevant backend/frontend source files, tests, routes, services, screens, state, APIs, assets, navigation, auth flows, and shared utilities

Follow these documents over this task if there is a conflict.

## Required changes

### Branding

* Rename the app globally from `Collins`, `Collins ICU`, or similar visible branding to **AI Vent**.
* Update visible UI copy, app metadata, page/screen titles, navigation labels, splash/header branding, auth screens, and any user-facing references where appropriate.
* Add/use the app logo consistently across the app, especially on the sign-in page and shared branded entry surfaces.
* Preserve existing paths, architecture, and behavior unless a rename is required for user-facing branding.
* Do not rename internal files, APIs, database fields, or contracts unless existing project rules clearly require it.

### Sign-in page

Update the sign-in/login screen so it includes:

* branded **AI Vent** logo/name
* email field
* password field
* sign-in button
* clear option/link/button for users without an account to create/register an account
* removal of the wording: “create account data stay hidden until your session and your CDT are verified” or equivalent wording

Improve the sign-in layout so it is polished, accessible, and responsive across:

* mobile
* tablet
* desktop/web
* iOS
* Android

Use existing styled-components, theme, accessibility, i18n, logging, error boundary, API client, Redux Toolkit, and Expo Router conventions.

### Registration entry

* If a registration screen/route already exists, link to it from sign-in using existing navigation patterns.
* If registration UI is missing but backend support exists, add the minimal required registration screen/route using existing auth patterns.
* If backend registration support is missing, add only the smallest backend/frontend changes required, preserving `/api/v1`, route → validator → controller → service layering, Zod validation, standard response shapes, auth/session conventions, audit logging, RBAC, and facility isolation.

## Architecture constraints

Preserve backend patterns for:

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

Preserve frontend patterns for:

* Expo Router routes under `src/app`
* reusable platform code under `src/platform/*`
* Redux Toolkit state ownership
* API client conventions
* offline draft/sync queue behavior
* theme, accessibility, i18n, logging, and error boundaries
* styled-components UI conventions
* role-aware navigation and screen visibility

## Clinical safety and governance

This app is decision support only.

Do not add autonomous clinical orders or unsafe wording. Allowed wording includes:

* “check”
* “review”
* “consider senior review”
* “confirm clinically”
* “clinician confirms final settings”

Forbidden outputs include:

* “Diagnosed ARDS”
* exact ventilator-setting orders
* “intubate now”
* “extubate now”
* medication, fluid, vasopressor, paralysis, ECMO, rationing, or transfer-denial orders

Ensure:

* missing data and uncertainty remain explicit where relevant
* clinician override with reason is preserved where relevant
* auditability is preserved for edits, reviews, exports, overrides, and model outputs
* population-specific calculations and wording are preserved
* no adult PBW formulas are used for neonatal, pediatric, adolescent, or unknown pathways
* no unreviewed records, raw notes, or demo data enter approved training datasets
* no patient identifiers are sent to external AI/model services

Preserve separation between:

1. reference/evidence rules
2. facility clinical records
3. reviewed, de-identified, ethics-approved training datasets

For offline/sync behavior, preserve:

* idempotency keys
* client timestamps
* no silent overwrites
* conflict status display
* retryable sync states
* reviewed data

For model/AI areas, preserve:

* rule-based MVP behavior first
* predictive models hidden from normal clinicians
* shadow-mode only until governance approval
* model cards, dataset cards, drift monitoring, and override monitoring only for approved roles

Do not disrupt the ICU workflow:

* Home
* Admit
* Tracking
* ABG / Vent Update
* Dataset Capture
* Review Queue
* Dashboard
* Training / Help
* Settings

If admission-related code is touched, preserve the required 3-step admission flow:

1. Patient & reason
2. Oxygen, ABG & ventilator
3. Save & review

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

Allow `unknown`, `not_available`, or `null` for clinically missing fields where existing app rules allow saving.

## Tests

Add or update focused tests for changed behavior, especially:

* branding/UI copy updates
* auth route/screen contracts
* registration entry/navigation
* Zod validation if backend auth changes
* response shapes if backend auth changes
* auth, RBAC, and facility isolation if backend auth changes
* role-aware frontend visibility
* accessibility for sign-in/register forms and critical alerts
* forbidden clinical wording if any clinical text is touched
* offline drafts, sync queue, retry, and conflicts if touched

## Scope limits

* Implement only this requested task.
* Avoid unrelated refactors.
* Avoid changing public contracts unless necessary.
* Create missing folders/files only when required.
* Preserve existing names, paths, tests, and behavior unless the task requires a change.
* Document unavoidable assumptions in the final implementation summary.

## Coding-agent output required

Return:

* brief implementation summary
* complete changed files only
* each file labeled as `Modified file`, `New file`, or `Deleted file`
* exact repository-relative paths
* tests added/updated
* commands to run
* safe deletion script if any files are deleted
