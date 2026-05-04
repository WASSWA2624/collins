# Backend Development Plan

## Current implementation state

The backend is an Express.js + Prisma + MySQL foundation aligned with `../app-write-up.md`. It already includes:

- Express server and versioned API routing under `/api/v1` by default.
- Environment configuration through `.env.example` and `src/config/env.js`.
- Prisma schema covering the main ventilation app entities.
- Zod validation pattern for request body, params, and query validation.
- Basic auth route foundation with password hashing and JWT token issuance.
- Facility, admission/tracking, review, dataset, references, models, admin, and health route foundations.
- Centralized success/error response helpers.
- Security middleware foundation using Helmet, CORS, JSON body limits, and rate limiting.
- Backend app rules under `backend/app-rules/`.

This is a foundation, not a complete production clinical backend.

## App-write-up alignment gaps to close

| Area | Required backend work |
| --- | --- |
| Facility readiness | NHFR/Master Facility List search, verification workflow, equipment profile, ABG availability, facility-level isolation. |
| Inclusive patient pathways | Full support for neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and unknown pathways. |
| Admission/tracking | 3-step admission payload, active tracking board, fast ABG/ventilator update, airway, humidification, daily review, outcomes. |
| Calculations/flags | Reference weight, VT/kg, P/F, S/F, minute ventilation, driving pressure, ABG flags, ARDS/respiratory-failure helper, COPD/oedema/humidification cautions. |
| Review/audit | Specialist review queue, correction/exclusion workflow, append-only clinical versions, full audit logs. |
| Dataset governance | Note parser, structured preview, de-identification, reviewer approval, ethics/facility metadata, approved export only. |
| Offline-first | Idempotency, sync statuses, encrypted local payload expectations, conflict resolution, no silent overwrite. |
| Model governance | Dataset cards, model cards, shadow-mode only before approval, drift and override monitoring. |

## Chronological implementation plan

Detailed phase files are in `backend/dev-plan/`.

1. **Foundation, security, and facility model**
   - Harden auth, sessions, RBAC, facility memberships, registry search, facility verification, and equipment profiles.
2. **Admissions, tracking, calculations, and clinical flags**
   - Implement 3-step admission save, active tracking board, ABG/ventilator/airway/humidification writes, and rule-based calculator services.
3. **Review, audit, dataset capture, and governance**
   - Implement append-only review workflows, audit logging, de-identification, note import review, dataset approval/export, and reference rule versions.
4. **Offline sync and conflict resolution**
   - Implement sync ingestion, idempotency keys, conflict responses, retry states, and no-overwrite rules for reviewed data.
5. **Admin dashboards and model shadow mode**
   - Implement dashboard metrics, dataset/model cards, model version registry, shadow-mode storage, drift monitoring, and model retirement.

## Immediate next tasks

1. Install dependencies and generate Prisma client:
   - `npm install`
   - `npm run prisma:generate`
2. Create a local MySQL database and run the first migration:
   - `npm run prisma:migrate`
3. Add seed scaffolding for roles and demo-only references.
4. Expand RBAC middleware around facility membership and route permissions.
5. Complete `POST /api/v1/admissions` as the first end-to-end clinical write.
6. Add pure calculator/flag helpers and unit tests before wiring them into endpoints.

## Acceptance criteria for backend MVP

- A user can register, log in, and request/select a facility membership.
- Facility admins can manage users and equipment/ABG availability.
- Clinicians can admit any supported patient pathway with missing-data-safe validation.
- ABGs and ventilator updates are append-only and time-stamped.
- Calculations and flags are returned with safe wording and rule/version metadata where available.
- Tracking board is filtered by facility and active status.
- Reviewer can approve, correct, or exclude records.
- Dataset entries cannot become training data until reviewed, de-identified, and governance-approved.
- Offline queued writes are idempotent and conflict-safe.
- Audit logs capture clinical edits, reviews, exports, overrides, reference changes, and model lifecycle events.

## Known limitations and risks

- Prisma migrations are not generated in this deliverable because database credentials are environment-specific.
- Many route modules still need complete service implementations.
- Clinical rules and reference ranges require specialist approval before real patient use.
- Production deployment requires security review, encryption-at-rest strategy, backup/retention policy, and governance sign-off.
