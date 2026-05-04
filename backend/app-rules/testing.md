# Backend Testing Rules

## Minimum test layers

- Unit tests for pure clinical calculators and flag helpers.
- Validator tests for Zod schemas.
- Service tests for facility isolation, audit, review, dataset transitions, and sync conflict behavior.
- API tests for route contracts and error handling.
- Security tests for auth, RBAC, and forbidden cross-facility access.
- Migration/schema checks for required indexes and constraints.

## Calculator and clinical flag tests

Test at least:

- Adult PBW calculation by sex and height.
- No adult PBW calculation for neonatal/pediatric/unknown pathways.
- VT per reference weight.
- P/F ratio only when PaO2 and FiO2 are available from the same time point.
- S/F screening fallback when ABG is unavailable, including high SpO2 caution.
- Minute ventilation.
- Driving pressure only when plateau and PEEP are available/applicable.
- ABG pattern flags: respiratory acidosis, respiratory alkalosis, metabolic acidosis pattern, metabolic alkalosis pattern, mixed/uncertain.
- ARDS/acute respiratory-failure helper wording: never “diagnosed ARDS”.
- COPD/hypercapnia caution.
- Plateau pressure, driving pressure, severe hypoxaemia, missing FiO2, missing size/weight, and humidification caution flags.

## API and workflow tests

Test:

- Auth registration/login/me/logout/refresh.
- Facility search, verification, membership request/approval.
- Admission creation for adult, neonatal, pediatric, obstetric, burns/trauma, and unknown pathways.
- Admission save with missing non-blocking fields.
- Tracking board filters by facility and active status.
- Repeat ABG creates a new version.
- Repeat ventilator update creates a new time-stamped record.
- Airway, humidification, daily review, and outcome writes.
- Review queue approve/correct/exclude transitions.
- Dataset note import cannot become training data without reviewer and governance approvals.
- Approved dataset export requires approved role and audit log.

## Security and privacy tests

Test:

- Facility users cannot read or write another facility’s patient records.
- Read-only reviewers cannot edit.
- Clinicians cannot verify facilities or activate models.
- Patient identifiers are excluded from de-identified payloads.
- Demo/training data does not mix with real patient data.
- External model payload builders reject identifiers.
- Audit logs are created for sensitive events.

## Offline sync tests

Test:

- Idempotency key duplicate returns the original result.
- Same idempotency key with different payload returns conflict.
- Offline ABG sync appends a new version.
- Offline writes do not overwrite reviewed data.
- Conflict response preserves both client and server values.
- Failed validation returns actionable field errors.

## Model governance tests

Test:

- Model outputs are hidden from clinical users during shadow mode.
- Model activation requires approved metadata and permitted admin role.
- Model retirement prevents new active use while preserving historical audit.
- Model cards and dataset cards are required before any live decision-support pilot.

## Acceptance gate

No clinical workflow should be marked ready until tests prove that final decisions remain with clinicians, unreviewed records cannot train models, and all patient-level data is isolated by facility.
