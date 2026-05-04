# Backend Security and Validation Rules

## Authentication

- Hash passwords with a modern password hashing strategy. The current bcrypt foundation is acceptable for development; tune cost factors before production.
- Use short-lived access tokens and refresh-token rotation before production.
- Add account lockout/rate limiting for repeated failed login attempts.
- Support email/phone verification and password reset before real facility deployment.
- Do not expose password hashes, tokens, secrets, or internal auth errors.

## Authorization and facility isolation

Every patient-level request must prove:

1. The user is authenticated.
2. The user has an approved membership for the target facility.
3. The user's role allows the requested action.
4. The target record belongs to that facility.

Role expectations:

- Platform Admin: facility verification, global configuration, aggregate quality, reference/model governance.
- Facility Admin: one-facility user management, equipment profile, dashboard, local policy configuration.
- Clinician/Data Entry User: create admissions and clinical updates for assigned facility.
- ICU Nurse/Monitoring User: vitals, ventilator, airway, humidification, and daily monitoring updates.
- Specialist/Data Reviewer: review, correct, approve, exclude, and resolve conflicts.
- Research/Data Governance Officer: approved de-identified datasets and governed exports.
- Read-only Reviewer: reports and reviewed cases without edits.

## Privacy-by-design

- Prefer app-generated patient IDs.
- Patient name/initials and hospital number are optional and policy-controlled.
- Store the minimum necessary patient identifiers.
- Encrypt traffic with HTTPS/TLS in production.
- Plan encryption-at-rest for database, backups, and offline sync payloads.
- Do not send patient identifiers to online AI services.
- De-identify before dataset export.
- Keep live clinical data, reviewed dataset data, and demo/training data separate.
- Add retention/deletion policy support before production.

## Clinical input validation

Numeric clinical fields must store value, unit, measured time, entered time, source, entered by, and validation status when implemented.

Examples:

| Field | Soft warning | Impossible flag |
| --- | --- | --- |
| pH | `<7.25` or `>7.55` | `<6.8` or `>7.8` |
| PaO2 mmHg | `<60` or `>200` | `<20` or `>600` |
| PaCO2 mmHg | `<25` or `>70` | `<10` or `>150` |
| SpO2 % | `<90` or `>100` | `<40` or `>100` |
| FiO2 | `<0.21` or `>1.0` | `<=0` or `>1.0` |
| PEEP cmH2O | `<5` in ARDS pattern or `>15` | `<0` or `>30` |
| Plateau pressure cmH2O | `>=30` | `>60` |

Rules:

- Missing ICU data should be accepted as `unknown`, `not_available`, or `null` when clinically appropriate.
- Impossible values should be blocked or require reviewer override.
- Suspicious values should save only with a warning/review status when the workflow allows it.
- Server must recalculate clinical flags even if the frontend sends calculated values.

## Audit requirements

Audit these events:

- Login-sensitive events and permission changes.
- Facility verification and equipment-profile changes.
- Admission creation/update/status change.
- Clinical snapshot, ABG, ventilator, airway, humidification, daily review, and outcome writes.
- Reviewer approval, correction request, exclusion, and conflict resolution.
- Dataset import, de-identification, approval, export, and exclusion.
- Reference rule creation, approval, activation, retirement.
- Model version creation, shadow-mode activation, approval, retirement.
- Clinician override and override reason.

Audit entries must include user, facility, action, entity type/id, before/after JSON where appropriate, reason, and timestamp.

## Export and research governance

Before exporting or using data for model training, require:

- Approved reviewer status.
- De-identified payload.
- Ethics approval/waiver metadata.
- Facility permission/data-sharing metadata.
- Dataset version and dataset card.
- Approved research/data governance role.
- Audit log entry.

## External services and AI safety

- No patient identifiers in AI/model payloads.
- No live model recommendations before governance approval.
- Model outputs in shadow mode are admin/research only and must not affect clinician decisions.
- Store model version, intended use, contraindicated use, and validation status with every model output.
