# Backend Development Plan

## Current implementation state

The backend is a new clean Express.js + Prisma + MySQL foundation aligned with `../app-write-up.md`. The submitted `collins.zip` did not contain a backend codebase, so this backend starts from a focused foundation instead of importing unrelated legacy HMS code.

Included foundation:

- Express server and versioned API routing under `/api/v1`.
- Environment configuration through `.env.example` and `src/config/env.js`.
- Prisma schema for the core ventilation app entities from the write-up.
- Zod validation pattern for request body, params, and query validation.
- Basic auth route foundation with password hashing and JWT token issuance.
- Facility, admission/tracking, review, dataset, references, models, admin, and health route foundations.
- Centralized success/error response helpers.
- Security middleware foundation using Helmet, CORS, JSON body limits, and rate limiting.
- App rules under `backend/app-rules/`.

## Completed setup/refactor work

- Created `Collins/backend/` as an independent backend codebase.
- Removed old unrelated backend assumptions and did not copy the separate HMS backend archive into this app.
- Added Prisma models for User, Facility, FacilityMembership, Patient, Admission, ClinicalSnapshot, AbgTest, VentilatorSetting, AirwayDevice, HumidificationDecision, DailyVentilationReview, Outcome, DatasetCase, ReferenceRule, ModelVersion, and AuditLog.
- Added initial API modules that match the app write-up endpoint groups.
- Added backend documentation/rules for architecture, security, validation, API conventions, Prisma, and testing.

## Chronological next implementation steps

1. Install dependencies and generate Prisma client:
   - `npm install`
   - `npm run prisma:generate`
2. Create the MySQL database and run the first migration:
   - `npm run prisma:migrate`
3. Add seed data for facility roles, reference rules, and demo/training mode.
4. Complete auth session hardening:
   - refresh tokens;
   - token rotation;
   - email/phone verification;
   - password reset;
   - account lockout policy.
5. Complete facility registry/NHFR search and verification workflow.
6. Implement admission creation, ABG updates, ventilator settings, airway, humidification, daily review, and outcome endpoints with audit logging.
7. Add reviewer approval/correction/exclusion workflows.
8. Add offline sync endpoints with idempotency keys and conflict handling.
9. Add de-identification pipeline and dataset approval/export workflow.
10. Add model shadow-mode storage, model cards, dataset cards, and drift monitoring only after reviewed dataset workflows are stable.
11. Add full automated tests for auth, validation, admission, review, audit, and dataset modules.

## Known limitations or risks

- The backend is a foundation, not a complete production implementation.
- Prisma migrations have not been generated yet because database credentials are environment-specific.
- Some route modules intentionally return planned placeholders until their domain services are implemented.
- Production clinical use requires security review, role hardening, audit completeness, facility-level data isolation, encryption-at-rest strategy, and governance approval.
- Clinical rules and reference ranges must be approved by specialists before live use.
