# Prisma and Data Model Rules

## Schema principles

- Keep `prisma/schema.prisma` aligned with `../../app-write-up.md`.
- Use CUID string IDs for portability.
- Use explicit `createdAt`, `updatedAt`, `measuredAt`, `collectedAt`, `reviewDate`, or `outcomeDate` fields as appropriate.
- Use enums for stable status, role, pathway, review, and model approval fields.
- Use JSON fields only for flexible clinical profiles, local policy rules, and versioned payloads that truly vary by pathway.
- Add indexes for facility isolation, active tracking boards, review queues, and time-series lookups.

## Required core entities

The schema must support these app-write-up entities:

- `User`
- `Facility`
- `FacilityMembership`
- `Patient`
- `Admission`
- `ClinicalSnapshot`
- `AbgTest`
- `VentilatorSetting`
- `AirwayDevice`
- `HumidificationDecision`
- `DailyVentilationReview`
- `Outcome`
- `DatasetCase`
- `ReferenceRule`
- `ModelVersion`
- `AuditLog`

Add supplemental entities only when needed for production features, for example `SyncQueueItem`, `IdempotencyKey`, `ReviewerComment`, `DatasetVersion`, `DatasetCard`, `ModelOutput`, `ModelCard`, `ConsentOrWaiver`, or `FacilityPolicy`.

## Patient pathway model rules

`PatientPathway` must support all inclusive MVP pathways:

- `NEONATE`
- `INFANT`
- `CHILD`
- `ADOLESCENT`
- `ADULT`
- `OBSTETRIC`
- `BURNS`
- `TRAUMA`
- `PERI_OPERATIVE`
- `MEDICAL`
- `SURGICAL`
- `OTHER` or `UNKNOWN`

Do not block documentation because a pathway has limited local validation. Store the pathway, show missing-reference warnings, and avoid pathway-specific recommendations until references are approved.

## Versioning and append-only clinical records

- ABG records are append-only per admission and must have a unique `(admissionId, version)`.
- Ventilator settings are append-only time-series records.
- Airway and humidification entries should be time-stamped because devices and methods may change.
- Daily reviews are dated records and should not overwrite prior review days.
- Reviewer corrections must preserve original values, corrected values, reviewer identity, reason, and audit trail.

## Calculation storage

Store calculated values only when useful for reporting, audit, or performance:

- `referenceWeightKg`
- `referenceWeightMethod`
- `vtMlPerKgReferenceWeight`
- `minuteVolumeLMin`
- `drivingPressure`

Also store or return the `ruleVersion` used for calculations when the rule library is implemented. If source data changes, recalculate with the active or explicitly selected rule version and audit the change.

## Data quality and review statuses

Separate these concepts:

- Raw entered data.
- Clinically reviewed data.
- Approved de-identified dataset data.
- Approved-for-training data.
- Excluded data with reason.

Do not represent these states with one boolean only. Use explicit statuses and audit transitions.

Required dataset progression:

1. Draft/raw.
2. Submitted/needs review.
3. Needs correction.
4. Reviewed.
5. Approved for dataset.
6. Approved for training.
7. Excluded.

## Facility and privacy constraints

- Every patient/admission/dataset/audit record with patient-level relevance must link to `facilityId` directly or through an indexed relation.
- Patient identifiers must be optional and minimized.
- De-identified dataset payloads must not include names, hospital numbers, phone numbers, precise dates of birth, or free-text identifiers.
- Demo/training records must never share identifiers or dataset paths with real facility records.

## Reference and model governance

`ReferenceRule` must record:

- name;
- version;
- source citation;
- rule JSON;
- active dates;
- approver;
- creation timestamp.

`ModelVersion` must record:

- model name and version;
- training dataset version;
- intended use;
- contraindicated use when implemented;
- performance, calibration, and bias summaries;
- approval status;
- activation and retirement timestamps.

## Migration rules

- Generate migrations only after reviewing clinical and privacy impact.
- Do not edit production migrations manually without review.
- Include safe seed scripts for roles, demo mode, and initial approved references only after governance approves source material.
- Never seed real patient data.
