# Backend App Rules

These rules define the backend standard for the ICU Ventilation Admission, Tracking & Decision-Support App described in `../../app-write-up.md`.

The backend must protect patients first. It may calculate, validate, flag, version, audit, and support review. It must not diagnose, prescribe, intubate, extubate, choose ventilator settings, or train from unreviewed data.

## Rule files

- `architecture.md` — backend stack, modules, layers, and clinical-safety boundaries.
- `project-structure.md` — required folders, file naming, and module placement.
- `api-conventions.md` — route groups, request/response contracts, versioning, pagination, and offline idempotency.
- `security-validation.md` — authentication, facility RBAC, privacy, validation, audit, and export rules.
- `prisma-data-model.md` — Prisma model, enum, versioning, review, dataset, and migration standards.
- `testing.md` — backend test expectations for safety, security, clinical calculators, APIs, review, sync, and governance.

## Product requirements the backend must enforce

- Inclusive MVP support for neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and unknown/other pathways.
- Facility verification and facility-level data isolation for Ugandan ICU/HDU deployment.
- Role-based access for platform admins, facility admins, clinicians, ICU nurses, specialist reviewers, research/data governance officers, and read-only reviewers.
- Time-stamped admission, ABG, ventilator, airway, humidification, daily review, outcome, dataset, reference-rule, model-version, and audit records.
- Three separated data layers: approved reference rules, facility clinical data, and reviewed de-identified training datasets.
- Offline-first writes with sync status, idempotency keys, conflict handling, and no silent overwrite of reviewed data.
- Versioned clinical calculations and flags with clear source/reference metadata.
- Model support only through governed model versions and shadow mode until approved.

## Non-negotiable backend rules

1. Never output autonomous treatment orders.
2. Never silently overwrite clinician-entered or reviewed clinical data.
3. Never allow unreviewed records, raw pasted notes, or demo data into approved training datasets.
4. Never send patient identifiers to external AI/model services.
5. Always preserve repeat ABGs and ventilator updates as time-stamped versions.
6. Always store enough metadata to explain who entered, edited, reviewed, exported, or overrode a record.
7. Always enforce facility membership before exposing patient-level data.
8. Always make missing data and uncertainty explicit in API outputs.

## Implementation priority

Build in this order: secure foundation, facility model, 3-step admission save, tracking/ABG/ventilator updates, calculations/flags, audit/review, dataset workflow, offline sync, admin dashboards, then model shadow-mode governance.
