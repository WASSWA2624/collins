# Frontend Navigation and Workflow Rules

## Required main navigation labels

Use short ICU-friendly labels:

1. Home
2. Admit
3. Tracking
4. ABG / Vent Update
5. Dataset Capture
6. Review Queue
7. Dashboard
8. Training / Help
9. Settings

Normal clinicians should see clinical summaries, risk flags, missing data, and reference-backed prompts. They should not see matched-case debug details or model internals.

## Home screen

Home must prioritize four large actions:

- Admit patient.
- Update ABG / ventilator.
- View tracking board.
- Paste ICU note.

Home must also show:

- active facility;
- offline/sync status;
- active ventilated patients count;
- red-flag count;
- records needing review count.

## Admission workflow: maximum 3 steps

### Step 1 — Patient & reason

Capture bed/location, app patient ID, optional hospital number/name/initials, age or estimated age, patient pathway, relevant age/sex/size fields, reason for ventilation/ICU review, comorbidities, and special conditions.

### Step 2 — Oxygen, ABG & ventilator

Capture oxygen/ventilation support, SpO2, FiO2, respiratory rate, heart rate, BP/MAP, GCS/AVPU/RASS where available, ABG values, ventilator mode/settings, airway route/tube details, and humidification.

All fields should allow `unknown/not available` where appropriate. Missing critical fields should be highlighted but should not block draft saving.

### Step 3 — Save & review

Show one live summary card with patient/bed, pathway/reference weight, VT/kg, P/F or S/F, acid-base flag, oxygen target caution, ARDS/COPD/oedema flags, unsafe-value flags, and missing data. The primary button is “Save admission”. After save, redirect to Tracking.

## Tracking workflow

Tracking should look like a bed board and show:

- bed;
- app patient ID;
- time on support;
- SpO2/FiO2;
- PEEP;
- VT/kg reference weight;
- ABG flag;
- review status.

Status colors:

- Green: no major safety flag based on entered data.
- Yellow: missing key data or moderate abnormality.
- Red: urgent review flag or potentially unsafe setting.
- Grey: draft/offline/unreviewed data.

## Fast ABG / ventilator update

A nurse or clinician should be able to update a patient quickly:

1. Select bed/patient.
2. Enter ABG and current ventilator settings.
3. Review recalculated trends.
4. Save.
5. New values become a time-stamped version.

Never overwrite old ABGs in the UI.

## Dataset Capture workflow

1. User pastes an ICU-style note.
2. Parser extracts possible fields.
3. App shows editable structured preview.
4. Missing or uncertain values are highlighted.
5. User confirms.
6. Record is saved as submitted.
7. Specialist reviewer approves, requests correction, or rejects before dataset/training use.

## Review Queue workflow

Visible only to specialist reviewers and approved admin/research roles. It should show records needing review, ABG edits, parser-extracted notes, conflicts, excluded records, and reasons.

## Dashboard workflow

- Facility admin dashboard: active ICU admissions, ventilated patients, red flags, ABGs pending review, submitted dataset entries, facility users, equipment profile, bed-level activity, sync failures.
- Platform admin dashboard: facilities, pending verification, active users, dataset review queue, reference versions, model versions, audit log search, data quality warnings.
- Specialist dashboard: review queue, parser confirmation, excluded records, shadow-mode disagreement cases.
