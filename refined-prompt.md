Implement the **backend only** for the `collins` monorepo so it is fully aligned with `app-write-up.md`, the backend app rules, and the backend dev-plan. Do **not** modify any frontend files.

Before editing, inspect these files/directories and base all changes on the existing architecture:

* `app-write-up.md`
* `backend/app-rules/**`
* `backend/dev-plan/**`
* `backend/package.json`
* `backend/.env.example`
* `backend/prisma/schema.prisma`
* `backend/prisma/migrations/**`
* `backend/prisma/seed.*`
* `backend/src/**`
* Existing backend routes, validators, controllers, services, repositories, middleware, response helpers, auth/RBAC/ABAC utilities, audit logging, facility/tenant scope logic, sync/offline/idempotency logic, and Prisma client setup.

Implement the backend requirements from `app-write-up.md` completely, but keep changes minimal and focused. Preserve the existing backend layering:

`route → validator/controller → service/repository → Prisma`

Modify existing files where possible. Create new files only where necessary. Do not touch `frontend/**`.

Prisma/database rules:

* Inspect the current Prisma schema first.
* Replace or restructure `backend/prisma/schema.prisma` only where truly required by `app-write-up.md` and the backend dev-plan.
* Do not introduce unnecessary tables, enums, relations, indexes, or persisted contracts.
* If schema changes are required, add proper MySQL-compatible Prisma models, indexes, relations, constraints, timestamps, facility/tenant scoping fields, audit fields, reviewed/versioned clinical data fields, and migration-ready structure.
* Preserve the three data layers:

  1. reference clinical rules,
  2. facility clinical records,
  3. reviewed de-identified training datasets.
* Never allow unreviewed records, raw notes, demo data, or patient identifiers into training/export workflows.

Backend features to implement or complete:

* `/api/v1` route structure.
* Zod request validation.
* Standard response/error helpers.
* Auth, facility scope, tenancy, RBAC/ABAC, permission checks, and audit logging.
* Patient/admission clinical record flows.
* ABG and ventilator update flows using append-only/versioned updates.
* Server-side recalculation of all clinical flags; never trust client-calculated safety flags.
* Dataset capture, review queue, de-identification, approval/rejection, export/training eligibility workflow.
* Dashboard/reporting endpoints with no patient identifier leakage.
* Reference rules and clinical decision-support endpoints.
* Offline/sync support: local draft sync, idempotency keys, sync queue handling, retry-safe writes, conflict detection, and no silent overwrite.
* Safe loading, empty, error, conflict, permission-denied, and reviewer-required API states.

Clinical safety rules:

* Keep the app decision-support only.
* Do not implement diagnosis, prescriptions, autonomous ventilator settings, intubation/extubation orders, medication orders, rationing, or transfer-denial decisions.
* Preserve population/pathway-specific logic for neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and unknown cases.
* Preserve and calculate server-side:

  * reference weight,
  * VT/kg reference weight,
  * P/F ratio,
  * S/F fallback,
  * minute ventilation,
  * driving pressure,
  * ABG flags,
  * oxygen cautions,
  * ARDS/respiratory-failure prompts,
  * COPD/hypercapnia cautions,
  * humidification cautions,
  * review priority.

Likely files to modify/create, depending on current structure:

* `backend/prisma/schema.prisma`
* `backend/src/app.js`
* `backend/src/server.js`
* `backend/src/routes/index.js`
* `backend/src/routes/v1/**`
* `backend/src/controllers/**`
* `backend/src/validators/**`
* `backend/src/services/**`
* `backend/src/repositories/**`
* `backend/src/middleware/auth*.js`
* `backend/src/middleware/rbac*.js`
* `backend/src/middleware/facilityScope*.js`
* `backend/src/middleware/error*.js`
* `backend/src/utils/response*.js`
* `backend/src/utils/audit*.js`
* `backend/src/utils/idempotency*.js`
* `backend/src/utils/deidentify*.js`
* `backend/src/clinical/**`
* `backend/src/sync/**`
* `backend/src/config/**`
* `backend/tests/**` or existing test directory.

Acceptance criteria:

* Backend starts successfully without frontend changes.
* All required `/api/v1` endpoints are wired, validated, scoped, audited, and return standard responses.
* Prisma schema matches `app-write-up.md` and supports the required backend workflows.
* Clinical calculations and safety flags are recalculated server-side.
* ABG and ventilator updates are append-only/versioned and never silently overwrite reviewed clinical data.
* Dataset/training/export workflows only use reviewed, de-identified, approved records.
* Patient identifiers and raw notes are excluded from training/export responses.
* Facility scope, tenancy, RBAC/ABAC, audit logs, privacy, and security rules are enforced consistently.
* Offline sync writes are idempotent, conflict-aware, retry-safe, and never silently overwrite existing records.
* No unrelated refactors, duplicate utilities, circular imports, unsafe logs, hardcoded secrets, hardcoded permissions, or patient identifier leaks.

Testing and verification:

* Run backend lint/type checks if available.
* Run Prisma validation/generation:

  * `npx prisma validate`
  * `npx prisma generate`
* If migrations are required, create migration-ready Prisma changes and verify MySQL compatibility.
* Run backend tests if available.
* Add or update focused tests for:

  * auth/facility scope,
  * RBAC/ABAC,
  * ABG calculations,
  * ventilator update versioning,
  * dataset review/de-identification/export eligibility,
  * idempotent sync/conflict handling,
  * permission-denied and reviewer-required states.
* Manually verify key API flows with representative requests and confirm standard success/error responses.

Return only:

1. Modified files with full code and exact repository paths.
2. New files with full code and exact repository paths.
3. Deleted files, only if deletion is truly required, with a safe deletion script.
4. A concise verification summary listing commands run, tests performed, and any remaining risks.
