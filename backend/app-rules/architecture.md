# Backend Architecture Rules

## Stack

- Node.js 20+.
- Express.js API under `/api/v1` by default through `API_VERSION`.
- Prisma ORM.
- MySQL database.
- Zod request validation.
- JWT/session authentication foundation.
- Rule-based calculators and clinical flag services for the MVP.

## Layering

Use a clear module boundary for every domain:

```txt
routes -> validators -> controllers -> services -> prisma repositories/helpers
                                      -> clinical rule/calculation helpers
                                      -> audit helper
```

- Routes define HTTP shape only.
- Validators define `body`, `params`, and `query` contracts with Zod.
- Controllers translate HTTP requests into service calls.
- Services own business logic, facility authorization, clinical state transitions, and audit writes.
- Prisma access should stay inside services or small repository helpers, not inside routes.
- Clinical calculators must be pure, unit-tested functions.

## Required backend domains

- `health` — readiness/liveness checks.
- `auth` — register, login, logout, refresh, current user, account hardening.
- `facilities` — registry/NHFR search, facility profile, equipment profile, ABG availability, verification, memberships.
- `admissions` — 3-step admission payloads, patient pathway, tracking board, patient/admission status.
- `clinical-snapshots` — vitals, oxygenation, diagnosis flags, clinical context.
- `abg-tests` — append-only ABG versions and ABG interpretation flags.
- `ventilator-settings` — append-only ventilation settings, VT/kg, minute ventilation, pressure flags.
- `airway-devices` — tube route/type/size/depth/cuff pressure documentation.
- `humidification` — HME/heated humidifier documentation and caution prompts.
- `daily-reviews` — liberation/readiness, SBT status, prone status, VAP bundle data.
- `outcomes` — discharge, transfer, death, extubation, reintubation, ventilator days.
- `review` — specialist approval, correction request, exclusion, conflict resolution.
- `dataset` — note parsing, structured preview, de-identification, dataset approval/export.
- `references` — versioned rule/reference library and clinical governance approval.
- `models` — model cards, dataset cards, shadow-mode status, activation/retirement metadata.
- `sync` — offline queue ingestion, idempotency, conflict detection, retry status.
- `admin` — platform/facility dashboards, audit search, dataset quality, model monitoring.

## Clinical decision-support boundary

Allowed backend outputs:

- Calculations: reference weight, VT/kg reference weight, P/F ratio, S/F screening ratio, minute ventilation, driving pressure.
- Flags: missing data, impossible data, suspicious data, ABG pattern, oxygenation severity helper, COPD/hypercapnia caution, humidification caution, plateau/driving-pressure caution, review priority.
- Prompts: “review,” “check,” “consider senior review,” “confirm clinically,” and “clinician confirms final settings.”

Forbidden backend outputs:

- “Diagnosed ARDS.”
- “Set PEEP/VT/FiO2 to ...”.
- “Intubate/extubate now.”
- Medication, fluid, vasopressor, paralysis, ECMO, rationing, or transfer-denial orders.

## Population-specific clinical logic

Every calculation service must receive the selected `patientPathway` and required size/age fields. Do not apply adult PBW formulas to neonates, infants, children, adolescents, or unknown pathways.

- Adult and obstetric/post-partum pathways may use adult PBW plus pathway-specific cautions.
- Neonatal pathways must use neonatal-specific weight, gestational age, corrected age, and local references.
- Pediatric/adolescent pathways must use configured pediatric reference rules.
- Burns, trauma, peri-operative, medical, and surgical pathways must combine age-group rules with specialty prompts.
- Unknown pathways may save documentation but must avoid pathway-specific recommendations until confirmed.

## Data separation

Keep these layers separate in code and database queries:

1. Reference/evidence rules that power MVP decision support.
2. Facility clinical records used for live tracking, audit, and review.
3. Reviewed, de-identified, ethics-approved training dataset records.

No service may promote data from layer 2 to layer 3 without reviewer approval, governance metadata, de-identification, and audit logging.

## Offline-first architecture

Clinical writes must be safe when submitted later from offline devices:

- Accept client-generated idempotency keys for queued creates/updates.
- Preserve ABG and ventilator updates as new versions.
- Detect conflicts instead of overwriting reviewed data.
- Return user-friendly conflict status and data for reviewer resolution.
- Audit the original offline timestamp, server receipt timestamp, submitter, device/client id where available, and resolved status.

## Model architecture

MVP is rule-based and calculator-based. Predictive models must remain hidden from clinicians during development, internal validation, external validation, and silent/shadow mode. Any later live model output must include model name, version, intended use, confidence/uncertainty, contraindicated uses, activation approval, and audit trail.
