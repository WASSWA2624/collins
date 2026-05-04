# ICU Ventilation Admission, Tracking & Decision-Support App

**Target setting:** ICU, high-dependency, emergency, peri-operative, neonatal, pediatric, obstetric, and other critical-care settings in Uganda where patients may need oxygen support, ventilatory support, or ventilation monitoring  
**Primary users:** ICU, neonatal, pediatric, obstetric, emergency, theatre/recovery, anaesthesia/critical care teams, nurses, respiratory-care staff where available, facility data reviewers, specialist reviewers, and facility/platform administrators  
**Core principle:** the app supports clinical judgement. It does **not** diagnose, prescribe, intubate, extubate, or set a ventilator autonomously.

---

## 1. Executive purpose

This app is a simple, safe, ICU ventilation decision-support and data-capture platform. It helps clinical users in Uganda:

1. **Admit and register a ventilated or at-risk patient** using minimal typing.
2. **Capture essential ventilation data**: patient size, oxygen support, ABG, ventilator settings, airway tube, humidification, vitals, diagnosis flags, and daily progress.
3. **Calculate high-value bedside values automatically**: population-appropriate reference weight, tidal volume per relevant reference weight, PaO2/FiO2 ratio, SpO2/FiO2 ratio when ABG is not available, minute ventilation, driving pressure where applicable, plateau-pressure flag where applicable, and acid-base flags.
4. **Show safe clinical guardrails** based on approved references and local policy.
5. **Track patient progress** over time: ABG trends, oxygen requirement, PEEP, ventilation mode, airway/humidification status, daily readiness for review/weaning, complications, and outcomes.
6. **Build a reviewed Uganda ICU ventilation dataset** for future model development, using only approved, de-identified, ethics-cleared, specialist-reviewed records.

The app must be designed for real ICU pressure: unstable patients, limited time, intermittent internet, variable equipment, busy nurses, and mixed clinician experience. The main screen should answer: **“What is the patient’s current ventilation status, what is unsafe, what is missing, and what should be reviewed now?”**

---

## 2. Expert revision summary

The original write-up had a strong software foundation. The expert update adds the following critical upgrades:


| Area                | Required update                                                                                                                                                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clinical scope      | Support **all patient populations** from the MVP: neonates, infants, children, adolescents, adults, obstetric/post-partum patients, burns, trauma, peri-operative, medical, surgical, and specialty cases. The selected patient pathway determines which fields, thresholds, and prompts are shown.                  |
| Safety              | Keep all outputs as **decision support**, not treatment orders. Every recommendation needs clinician confirmation.                                                                                                                                                                                                   |
| Ease of use         | Replace long forms with a **3-step admission workflow**, large buttons, chips, auto-calculations, and “unknown/not available” options.                                                                                                                                                                               |
| Uganda readiness    | Add National Health Facility Registry linkage, offline-first capture, low-bandwidth sync, MoH-aligned privacy controls, and facility-level verification.                                                                                                                                                             |
| Clinical logic      | Add population-appropriate weight/size calculations, VT per relevant reference weight, P/F ratio, S/F fallback, ARDS or respiratory-failure pattern flags, COPD/hypercapnia caution where relevant, oxygen target cautions, plateau/driving pressure flags where applicable, and daily liberation/readiness prompts. |
| Data quality        | Separate raw entered data, reviewed clinical data, and approved training data. Never train on unreviewed notes.                                                                                                                                                                                                      |
| Research governance | Require IRB/REC approval, UNCST where applicable, facility permission, data-sharing agreements, de-identification, and reviewer sign-off before using data for model training.                                                                                                                                       |
| AI/model use        | MVP should be rule-based and calculator-based. Predictive models should start in **silent/shadow mode** before any live decision-support use.                                                                                                                                                                        |
| Accountability      | Add audit trails, versioning, model cards, dataset cards, drift monitoring, and human override logging.                                                                                                                                                                                                              |


---

## 3. Clinical scope and safety position

### 3.1 Inclusive MVP clinical scope

The MVP should support **all patient types and all age groups** who are ventilated, receiving oxygen support, or being monitored for possible respiratory deterioration. This includes:

- neonates, including premature and term babies;
- infants, children, and adolescents;
- adults and older adults;
- pregnant and post-partum patients;
- burns, trauma, peri-operative, medical, surgical, neurologic/airway-protection, sepsis, pneumonia/COVID-related, COPD/asthma-related, ARDS-related, pulmonary oedema-related, and other critical-care cases.

The app should not exclude a patient because of age, diagnosis, specialty, facility type, or ventilation mode. Instead, the user selects the **patient pathway** at admission. The pathway controls the required fields, calculations, reference ranges, warnings, and decision-support language.

### 3.2 No patient-type exclusions

There should be **no limit on patient types**. Pediatric, neonatal, obstetric, burns, transport, theatre/recovery, and other specialty cases should be supported as patient pathways rather than blocked.

When a pathway has limited local validation or missing data, the app should still allow documentation and tracking, but it should clearly show:

- which values are missing;
- which calculations are not available for that pathway;
- which reference set is being used;
- when senior/specialist review is recommended;
- when a prompt is documentation-only rather than a validated clinical recommendation.

### 3.3 Safety language inside the app

Every output should use language like:

- “**Check** tidal volume per relevant reference weight.”
- “**Consider urgent senior review**.”
- “**Possible respiratory-failure/ARDS pattern — confirm clinically and with imaging/ultrasound if available**.”
- “**Clinician must confirm final ventilator settings**.”

Avoid language like:

- “Diagnosed ARDS.”
- “Set PEEP to…”
- “Intubate now.”
- “Extubate now.”
- “Give medication…”

### 3.4 Non-negotiable safety rules

1. The app must never make autonomous treatment orders.
2. The app must never silently change a recommendation without showing the source/version of the rule or model.
3. The app must never use unreviewed local cases to influence active clinical guidance.
4. The app must clearly show missing data and uncertainty.
5. The app must allow clinician override with a reason.
6. The app must keep an audit log of all edits, reviews, model outputs, and overrides.
7. The app must work even when internet is unavailable.
8. The app must use population-specific reference ranges, calculation rules, and wording whenever the patient pathway requires them.

## 4. Uganda deployment assumptions

The app should be built for Ugandan ICUs, where facility capacity, staffing, ABG access, oxygen supply, ventilator types, humidification devices, monitoring frequency, and internet connectivity may vary.

### 4.1 Facility verification

The app should prefill facility details from Uganda’s National Health Facility Registry / Master Facility List where possible.

Facility records should capture:


| Field                                   | Notes                                                            |
| --------------------------------------- | ---------------------------------------------------------------- |
| Facility name                           | From registry or manually entered if not found.                  |
| Registry/NHFR/Master Facility List code | Required for verified facilities where available.                |
| District and region                     | Used for reporting and facility grouping.                        |
| Ownership                               | Government, PNFP, private, military/police, other.               |
| Facility level/type                     | Hospital, regional referral, national referral, HC IV, etc.      |
| ICU/HDU available                       | Yes/no.                                                          |
| Mechanical ventilators available        | Number and type where entered by facility admin.                 |
| ABG access                              | Onsite 24/7, onsite limited, external lab, not available.        |
| Oxygen source                           | Piped oxygen, cylinders, concentrators, blended oxygen, unknown. |
| Verification status                     | Pending, verified, rejected, suspended.                          |


### 4.2 Privacy and health data protection

The app must align with Uganda health-sector data protection requirements. It should use minimum necessary patient data, facility-level access controls, encryption, audit logs, and clear data-sharing permissions.

Minimum privacy controls:

- role-based access;
- patient identifiers optional and minimized;
- encryption in transit and at rest;
- facility-level data isolation;
- audit trail for every access/edit/export;
- no patient identifiers sent to online AI services;
- explicit research-use approval before de-identified data enters training datasets;
- configurable data retention and deletion policy;
- data export only for approved roles.

---

## 5. Core users and permissions


| User type                        | Main permissions                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Platform Admin                   | Verify facilities, manage reference versions, review aggregate system quality, manage global configuration.           |
| Facility Admin                   | Manage one facility, approve sub-users, assign roles, view facility dashboard, configure local equipment/policies.    |
| Clinician/Data Entry User        | Create admissions, enter ABG/vitals/settings, update tracking records, view assigned facility patients.               |
| ICU Nurse/Monitoring User        | Update vitals, ventilator settings, airway checks, humidification checks, daily monitoring checklist.                 |
| Specialist/Data Reviewer         | Review records, edit clinical data, approve/exclude cases for dataset use, resolve conflicts, validate model outputs. |
| Research/Data Governance Officer | View approved de-identified datasets, manage consent/IRB metadata, export approved research data.                     |
| Read-only Reviewer               | View reports and reviewed cases without editing.                                                                      |


Important rules:

- A user may belong to multiple facilities.
- Only verified facility memberships can submit trusted clinical data.
- Training/demo mode should be available without verified facility access, but demo data must never mix with real patient data.
- Specialist reviewer privileges should be granted only by facility admin or platform admin.

---

## 6. Main app navigation

Use short labels suitable for a busy ICU screen:

1. **Home**
2. **Admit**
3. **Tracking**
4. **ABG / Vent Update**
5. **Dataset Capture**
6. **Review Queue**
7. **Dashboard**
8. **Training / Help**
9. **Settings**

Rename required:

- “Assessment” → **Admit**
- “History” → **Tracking**

Normal clinicians should not see matched-case debug details. They should see a simple clinical summary, risk flags, missing data, and reference-backed prompts.

---

## 7. Extremely easy ICU workflow

### 7.1 Home screen

The home screen should show only the most important actions:


| Main action                 | Description                                        |
| --------------------------- | -------------------------------------------------- |
| **Admit patient**           | Create a new ICU ventilation record.               |
| **Update ABG / ventilator** | Fast entry for repeat ABG or ventilator settings.  |
| **View tracking board**     | See all active ICU patients and risk flags.        |
| **Paste ICU note**          | Parse a short ICU-style note into structured data. |


The home screen should also show:

- active facility;
- offline/sync status;
- number of active ventilated patients;
- number of patients with red flags;
- number of records needing review.

### 7.2 Admission workflow: maximum 3 steps

The admission form should not feel like a long electronic medical record. Use a guided wizard.

#### Step 1 — Patient & reason

Capture:

- bed number or care location;
- patient app ID auto-generated;
- optional hospital number;
- optional patient name or initials depending facility policy;
- age, date of birth, or estimated age;
- patient pathway: neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, or other/unknown;
- gestational age and corrected age where relevant;
- sex/biologic sex where needed for pathway-specific calculations;
- height or length where relevant;
- actual weight;
- main reason for ventilation/ICU/HDU/critical-care review: pneumonia, sepsis, ARDS/acute respiratory failure, COPD/asthma, pulmonary oedema, trauma, burns, post-operative, neurologic/airway protection, neonatal respiratory distress, obstetric complication, other/unknown;
- comorbidities and special conditions: hypertension, diabetes, HIV, TB history, sickle cell disease, asthma/COPD, obesity, pregnancy/post-partum, renal disease, cardiac disease, prematurity, congenital disease, burns, other.

#### Step 2 — Oxygen, ABG & ventilator

Capture:

- current oxygen/ventilation support;
- SpO2;
- FiO2;
- respiratory rate;
- heart rate;
- blood pressure/MAP if available;
- GCS/AVPU or sedation state if available;
- ABG: pH, PaO2, PaCO2, HCO3, base excess, lactate, sample time;
- ventilator mode;
- VT, RR, PEEP, FiO2, pressure support, inspiratory pressure/pressure control, plateau pressure, peak pressure, I:E ratio;
- airway route and tube details;
- humidification option.

All fields should allow **unknown / not available**. Missing critical fields should be highlighted but should not block saving a draft.

#### Step 3 — Save & review

Show a single summary card:

- patient/bed;
- reference weight used for ventilation calculation;
- VT in mL/kg of relevant reference weight;
- P/F ratio or S/F ratio;
- acid-base flag;
- oxygen target caution;
- ARDS/COPD/pulmonary oedema pattern flags;
- unsafe-value flags;
- missing data;
- “Save admission” button.

After saving, redirect to **Tracking**.

### 7.3 Tracking workflow

The tracking board should display patients like a bed board.


| Bed    | Patient | Time on support | SpO2/FiO2  | PEEP | VT/kg reference weight | ABG flag | Review |
| ------ | ------- | --------------- | ---------- | ---- | ---------------------- | -------- | ------ |
| ICU-04 | App ID  | 18 h            | 89% / 0.60 | 10   | 7.8                    | pH low   | Red    |


Each patient row should have a color status:


| Color  | Meaning                                           |
| ------ | ------------------------------------------------- |
| Green  | No major safety flag based on entered data.       |
| Yellow | Missing key data or moderate abnormality.         |
| Red    | Urgent review flag or potentially unsafe setting. |
| Grey   | Draft/offline/unreviewed data.                    |


### 7.4 Fast ABG / ventilator update

A nurse or clinician should be able to update a patient in under one minute:

1. Select bed/patient.
2. Enter ABG and current ventilator settings.
3. App recalculates trends.
4. Save.
5. New values become a time-stamped version.

ABG edits should never overwrite old ABGs. They should create a new version.

### 7.5 Dataset capture from ICU note

The “Dataset Capture” screen lets users paste a short note:

> Bed ICU-04, male 54y, weight 78kg, height 170cm, COPD, HTN. ABG: pH 7.29, PaCO2 62, PaO2 58 on FiO2 0.40. SpO2 89%, RR 30, HR 116. VT 420, PEEP 5, HME.

Flow:

1. User pastes note.
2. Parser extracts fields.
3. App shows editable structured preview.
4. Missing or uncertain values are highlighted.
5. User confirms.
6. Record is saved as **Submitted**.
7. Specialist reviewer approves or rejects before training use.

Rules:

- Do not guess silently.
- Do not train on unreviewed notes.
- Keep raw note only if facility policy and research approval allow it.
- Remove identifiers before research export.

---

## 8. Clinical data fields

### 8.1 Minimum admission dataset

These are the minimum fields for a useful ventilation record:


| Group           | Required MVP fields                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Facility        | Facility ID, bed, admission date/time, data entry user.                                                                                                                  |
| Patient         | Age/estimated age, patient pathway, sex where relevant, height/length where relevant, actual weight, gestational/corrected age where relevant, optional hospital number. |
| Clinical reason | Main reason for ventilation, oxygen support, ICU/HDU/critical-care review, comorbidities, and special population flags.                                                  |
| Oxygenation     | SpO2, FiO2, oxygen/ventilation support type.                                                                                                                             |
| ABG             | pH, PaO2, PaCO2, sample time, FiO2 at sample time.                                                                                                                       |
| Ventilator      | Mode, VT, RR, PEEP, FiO2, peak pressure if available, plateau pressure if applicable/available.                                                                          |
| Airway          | ETT/tracheostomy/other airway support, tube size where applicable, route, cuff pressure if measured/applicable.                                                          |
| Humidification  | HME/heated humidifier/none/unknown.                                                                                                                                      |
| Outcome         | Alive in ICU, died in ICU, transferred, discharged, still admitted.                                                                                                      |


### 8.2 Strongly recommended fields


| Field                        | Why it matters                                                           |
| ---------------------------- | ------------------------------------------------------------------------ |
| HCO3 and base excess         | Helps distinguish respiratory vs metabolic or mixed acid-base disorders. |
| Lactate                      | Important in shock/sepsis severity and data modeling.                    |
| MAP or systolic/diastolic BP | Helps identify shock/deterioration.                                      |
| Temperature                  | Infection/sepsis context.                                                |
| GCS/AVPU/RASS                | Airway protection, sedation, daily review.                               |
| Plateau pressure             | Needed for lung-protective ventilation safety checks.                    |
| Driving pressure             | Helpful lung mechanics safety signal if plateau and PEEP are available.  |
| PIP/peak pressure            | Useful for airway resistance/obstruction flags.                          |
| CXR/ultrasound flag          | Helps ARDS/pulmonary oedema pattern confirmation.                        |
| Secretions                   | Helps humidification and airway-care prompts.                            |
| Prone positioning status     | Important for severe ARDS tracking.                                      |
| SBT readiness                | Helps daily ventilator liberation workflow.                              |
| Extubation/reintubation      | Important outcome for model training.                                    |
| Ventilator-free days         | Important research outcome.                                              |


### 8.3 Units and validation

Every numeric value must store:

- value;
- unit;
- time measured;
- time entered;
- entered by;
- source: manual, parsed note, imported device, imported lab, edited by reviewer;
- validation status: valid, suspicious, impossible, missing.

Example validation rules:


| Field                     | Soft warning                     | Hard impossible flag                                   |
| ------------------------- | -------------------------------- | ------------------------------------------------------ |
| pH                        | <7.25 or >7.55                   | <6.8 or >7.8                                           |
| PaO2 mmHg                 | <60 or >200                      | <20 or >600                                            |
| PaCO2 mmHg                | <25 or >70                       | <10 or >150                                            |
| SpO2 %                    | <90 or >100                      | <40 or >100                                            |
| FiO2                      | <0.21 or >1.0                    | <=0 or >1.0                                            |
| PEEP cmH2O                | <5 in ARDS pattern or >15        | <0 or >30                                              |
| VT mL/kg reference weight | Above pathway-specific guardrail | Clearly impossible or unsafe per pathway/reference set |
| Plateau pressure cmH2O    | >=30                             | >60                                                    |


Hard impossible flags should require correction or reviewer override.

---

## 9. Clinical calculations

### 9.1 Population-specific reference weight and size calculations

The app should use the selected patient pathway to choose the correct size or weight reference. It must not apply one adult formula to every patient.


| Patient pathway                       | App behavior                                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Neonate                               | Use actual weight, gestational age, corrected age, and local neonatal ventilation reference rules. Do not use adult PBW formulas.         |
| Infant/child/adolescent               | Use actual weight and/or height/length-based ideal/reference weight according to local pediatric protocol. Do not force adult thresholds. |
| Adult                                 | Use adult predicted body weight based on sex and height for lung-protective ventilation calculations.                                     |
| Obstetric/post-partum                 | Use the adult pathway plus obstetric/post-partum flags and local maternal critical-care protocol.                                         |
| Burns/trauma/peri-operative/specialty | Use the age group pathway plus specialty prompts and local protocol.                                                                      |
| Unknown pathway                       | Allow documentation, show missing pathway warning, and avoid pathway-specific recommendations until confirmed.                            |


For adults, predicted body weight can be calculated as:

- **Male PBW kg** = 50 + 0.91 × (height_cm − 152.4)
- **Female PBW kg** = 45.5 + 0.91 × (height_cm − 152.4)

App output should show:

- the selected patient pathway;
- the reference weight or size metric used;
- current VT in mL/kg of the relevant reference weight;
- target range display according to local protocol;
- warning if the required age, height/length, sex, gestational age, or weight value is missing.

### 9.2 Tidal volume per relevant reference weight

Formula:

- **VT per reference weight** = tidal volume in mL ÷ selected reference weight in kg

Display examples:

- “VT = 420 mL = 6.4 mL/kg PBW” for an adult pathway.
- “VT = 60 mL = 6 mL/kg actual/reference weight” for a pediatric pathway, depending local configuration.

For ARDS or acute respiratory-failure patterns, show a safety guardrail if VT is outside the pathway-specific lung-protective range.

### 9.3 Minute ventilation

Formula:

- **Minute ventilation L/min** = (VT mL ÷ 1000) × respiratory rate

Display:

- “Minute ventilation = 8.4 L/min”

### 9.4 PaO2/FiO2 ratio

Formula:

- **P/F ratio** = PaO2 ÷ FiO2

Example:

- PaO2 58 mmHg on FiO2 0.40 → P/F = 145

Use only when PaO2 and FiO2 are known from the same time point.

### 9.5 SpO2/FiO2 ratio fallback

When ABG is unavailable, calculate S/F ratio as a resource-limited screening aid:

- **S/F ratio** = SpO2 ÷ FiO2

Important display rule:

- Show “S/F screening only — ABG preferred if available.”
- Avoid overinterpreting S/F when SpO2 is above 97%, because pulse oximetry becomes less discriminating at high saturation.
- Use patient-pathway-specific interpretation where neonatal, pediatric, obstetric, or specialty guidance differs.

### 9.6 Driving pressure

Formula where plateau pressure and PEEP are applicable and available:

- **Driving pressure** = plateau pressure − PEEP

Display:

- “Driving pressure = 14 cmH2O”

If plateau pressure is missing or not applicable, the app should show: “Driving pressure cannot be calculated.”

### 9.7 Oxygen target caution

The app should not force one oxygen target for every patient.

Default target display should be pathway-aware:


| Patient pattern                                                              | Suggested display                                                                                                    |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Most acutely ill patients without hypercapnia risk                           | “Target range often 94–98% depending local policy.”                                                                  |
| COPD/chronic CO2 retention risk                                              | “Controlled oxygen target often 88–92% pending ABG/local policy.”                                                    |
| ARDS/severe hypoxaemia                                                       | “Avoid severe hypoxaemia; clinician should balance oxygenation, FiO2 exposure, PEEP, pressures, and local protocol.” |
| Neonatal, pediatric, obstetric, burns, transport, or other specialty pathway | “Use pathway-specific target range from local protocol; clinician confirms target.”                                  |


The app should ask clinicians to set the patient-specific target range.

## 10. Clinical flags and decision-support logic

### 10.1 ABG interpretation

ABG interpretation must be population-aware. Adult reference ranges can be used only when the adult pathway is selected. Neonatal, pediatric, obstetric, and specialty pathways should use approved local reference sets and should show “confirm clinically” wording.

Common adult reference ranges used for flagging only:


| Parameter   | Common adult reference range               |
| ----------- | ------------------------------------------ |
| pH          | 7.35–7.45                                  |
| PaCO2       | 35–45 mmHg                                 |
| PaO2        | 80–100 mmHg on room air, context dependent |
| HCO3        | 22–26 mmol/L                               |
| Base excess | about −2 to +2 mmol/L                      |


ABG flags:


| Pattern                     | Rule                                                           |
| --------------------------- | -------------------------------------------------------------- |
| Respiratory acidosis        | pH below pathway reference and PaCO2 above pathway reference.  |
| Respiratory alkalosis       | pH above pathway reference and PaCO2 below pathway reference.  |
| Metabolic acidosis pattern  | pH below pathway reference and HCO3 low/base excess negative.  |
| Metabolic alkalosis pattern | pH above pathway reference and HCO3 high/base excess positive. |
| Mixed/uncertain             | Conflicting pH, PaCO2, HCO3/base excess values.                |


Display wording:

- “ABG pattern suggests respiratory acidosis — confirm clinically.”
- “Mixed disorder possible — senior review recommended.”

### 10.2 ARDS / acute respiratory-failure pattern flag

The app should calculate oxygenation and ask for missing definition components using the selected pathway. It should support adult, pediatric, neonatal, obstetric, and specialty respiratory-failure pathways where local references are configured.

Possible ARDS or acute respiratory-failure pattern may require:

- acute respiratory failure/worsening within the relevant timing window for the pathway;
- bilateral opacities or compatible lung findings on CXR/CT/lung ultrasound where available;
- respiratory failure not fully explained by cardiac failure/fluid overload;
- oxygenation impairment using P/F, S/F, oxygen saturation index, oxygenation index, or another pathway-specific metric where configured;
- ventilatory support context, including invasive ventilation, CPAP/NIV, high-flow oxygen, or neonatal/pediatric respiratory support depending local policy and reference definition.

For intubated adult patients using the Berlin-style helper:


| Severity helper | P/F ratio with PEEP/CPAP ≥5 cmH2O |
| --------------- | --------------------------------- |
| Mild            | 200–300                           |
| Moderate        | 100–200                           |
| Severe          | <100                              |


For pediatric and neonatal pathways, use the approved pathway-specific severity helper instead of the adult Berlin helper.

Output:

- “Possible moderate ARDS/acute respiratory-failure pattern — confirm timing, imaging/ultrasound, pathway criteria, and oedema cause.”

Never output:

- “ARDS diagnosed” without clinician confirmation.

### 10.3 COPD / chronic hypercapnia caution

Trigger caution when COPD/asthma-COPD/chronic CO2 retention is selected or suspected and:

- PaCO2 >45;
- pH <7.35;
- SpO2 is above the clinician-set target while PaCO2 is rising;
- oxygen target not documented.

Display:

- “COPD/hypercapnia caution: document target SpO2 and review ABG trend.”

### 10.4 Pulmonary oedema pattern

ABG alone cannot diagnose pulmonary oedema. The app should require clinical support:

- crackles;
- pink/frothy sputum if documented;
- hypertension or cardiac history;
- raised JVP/peripheral oedema;
- CXR/ultrasound compatible with oedema;
- echo/cardiac data if available;
- response to diuresis/vasodilator therapy if entered later.

Output:

- “Possible pulmonary oedema pattern — confirm with clinical/imaging findings.”

### 10.5 Sepsis/pneumonia context

The app may capture sepsis/pneumonia as context for ventilation but should not manage antibiotics or prescribe fluids/vasopressors.

Display:

- “Sepsis/pneumonia context: ensure local sepsis pathway is followed.”

### 10.6 Unsafe ventilation flags

Use clear red/yellow flags.


| Flag                                        | Trigger                                                              | Suggested app message                                   |
| ------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| High VT in ARDS/respiratory-failure pattern | VT above pathway-specific guardrail                                  | “Review lung-protective ventilation.”                   |
| Very low VT with severe acidosis            | VT very low and pH <7.20                                             | “Review ventilation and acid-base status urgently.”     |
| High plateau pressure                       | Plateau ≥30 cmH2O                                                    | “Review plateau pressure and lung-protective strategy.” |
| High driving pressure                       | Driving pressure high per local threshold                            | “Review lung mechanics and settings.”                   |
| Severe hypoxaemia                           | SpO2 below target or P/F very low                                    | “Urgent clinician review.”                              |
| Hypercapnic acidaemia                       | pH low with PaCO2 high                                               | “Review ventilation, COPD risk, and ABG trend.”         |
| Missing FiO2                                | PaO2 exists but FiO2 missing                                         | “Cannot calculate P/F ratio.”                           |
| Missing size/weight data                    | VT entered but required height/length/weight/age data missing        | “Cannot calculate VT/kg reference weight.”              |
| HME caution                                 | Thick secretions/high minute ventilation/hypothermia/airway bleeding | “Review heated humidification need.”                    |


---

## 11. Decision-support modules

### 11.1 Admission decision-support module

This module should not decide admission. It should help document severity and alert clinicians.

Capture:

- oxygen/ventilation support;
- work of breathing if not intubated;
- airway protection concern;
- shock/vasopressor use;
- altered consciousness;
- ABG severity;
- resource needs: ventilator, oxygen, suction, monitoring, nurse ratio, isolation.

Output examples:

- “High respiratory support requirement — ICU senior review needed.”
- “ABG unavailable; use SpO2/FiO2 screening and request ABG if clinically indicated/available.”
- “Patient has airway-protection concern — urgent clinician review.”

### 11.2 Initial ventilator safety module

Show a checklist, not an order:


| Check                      | App behavior                                 |
| -------------------------- | -------------------------------------------- |
| Required size data entered | Calculate pathway-specific reference weight. |
| VT entered                 | Calculate mL/kg relevant reference weight.   |
| PEEP/FiO2 entered          | Calculate oxygenation trend.                 |
| Plateau entered            | Flag if high.                                |
| ABG entered                | Interpret acid-base pattern.                 |
| Tube recorded              | Ask size, route, cuff pressure if measured.  |
| Humidification recorded    | Ask HME/heated humidifier.                   |


### 11.3 ARDS / acute respiratory-failure guardrail module

For ARDS or acute respiratory-failure pattern, show pathway-specific evidence-based guardrails:

- review lung-protective VT based on pathway-specific reference weight;
- review plateau pressure;
- review PEEP/FiO2 strategy using local protocol;
- for severe ARDS pattern, show “consider prone positioning workflow if trained staff and local protocol allow”; 
- avoid routine high-frequency oscillatory ventilation prompt;
- refer to senior clinician for refractory hypoxaemia.

Do not recommend medication doses, paralysis protocols, recruitment maneuvers, or ECMO decisions in the MVP.

### 11.4 COPD/hypercapnia module

For COPD/chronic hypercapnia risk:

- ask for documented target SpO2;
- show PaCO2 and pH trend;
- warn if oxygen target is missing;
- warn if pH is falling or PaCO2 is rising;
- suggest senior review for severe acidaemia or worsening hypercapnia.

### 11.5 Weaning/readiness module

Add a daily “Liberation Review” card for intubated patients.

Capture:


| Readiness item                          | Simple input                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| Oxygenation stable?                     | Yes/no/unknown                                                                 |
| PEEP acceptable by local protocol?      | Yes/no/unknown                                                                 |
| FiO2 acceptable by local protocol?      | Yes/no/unknown                                                                 |
| Haemodynamics stable?                   | Yes/no/unknown                                                                 |
| Sedation light enough / SAT considered? | Yes/no/unknown                                                                 |
| Cough/secretions manageable?            | Yes/no/unknown                                                                 |
| Airway swelling concern?                | Yes/no/unknown                                                                 |
| SBT done today?                         | Not due / passed / failed / not done                                           |
| Reason SBT failed                       | Work of breathing, hypoxaemia, mental status, haemodynamics, secretions, other |


Output:

- “Daily weaning readiness not documented.”
- “SBT failed — document reason and reversible causes.”
- “Passed SBT — clinician to assess extubation readiness.”

### 11.6 Population-specific airway tube decision-support module

The app can support documentation and safety reminders. It must not replace airway expertise.

Fields:


| Field             | Notes                                            |
| ----------------- | ------------------------------------------------ |
| Airway route      | Oral ETT, nasal ETT, tracheostomy, other.        |
| Tube type         | Cuffed, uncuffed, reinforced, tracheostomy tube. |
| Internal diameter | Suggested/common range and editable.             |
| Depth marking     | Editable.                                        |
| Cuff pressure     | Record if measured.                              |
| Confirmation      | Clinician confirms final choice.                 |


Tube-size support should be conservative and population-specific:

- show common ranges for the selected pathway only;
- support neonatal, pediatric, adult, tracheostomy, and specialty airway documentation where configured;
- allow local policy override;
- require manual confirmation;
- warn that anatomy, indication, operator judgement, and equipment availability determine final choice.

Cuff pressure:

- record measured cuff pressure where manometer is available;
- flag missing cuff pressure as “not measured,” not as an error;
- show local policy target range.

### 11.7 Humidification module

All patients ventilated through an artificial airway need humidification. The app should help select and document the method.

Options:

- HME;
- heated humidifier;
- unknown/not available.

Guiding questions:


| Question                            | Why it matters                                            |
| ----------------------------------- | --------------------------------------------------------- |
| Thick secretions?                   | HME may worsen blockage risk.                             |
| High minute ventilation?            | HME may add dead space/resistance.                        |
| Hypothermia?                        | Heated humidification may be preferred.                   |
| Airway bleeding?                    | HME may be problematic.                                   |
| Long ventilation expected?          | Heated humidification may be considered depending policy. |
| HME available and appropriate size? | Equipment-dependent.                                      |


Output:

- “Humidification required for artificial airway.”
- “HME caution: thick secretions/high minute ventilation documented — review heated humidifier.”
- “Clinician confirms final humidification method.”

---

## 12. Data model and database design

### 12.1 Architecture

Recommended stack:

- Expo + Expo Router frontend;
- Redux Toolkit for state;
- Zod for validation;
- Express.js backend;
- Prisma ORM;
- MySQL database;
- JWT/session authentication;
- offline-first local draft storage;
- sync queue;
- audit logs;
- optional future HL7 FHIR-compatible exports.

### 12.2 Core database entities

#### User

- id
- name
- email
- phone
- passwordHash
- status
- createdAt
- updatedAt

#### Facility

- id
- registryCode
- name
- district
- region
- type
- ownership
- verificationStatus
- oxygenProfileJson
- ventilatorProfileJson
- abgAvailability
- createdAt
- updatedAt

#### FacilityMembership

- id
- userId
- facilityId
- role
- status
- approvedByUserId
- createdAt
- updatedAt

#### Patient

- id
- facilityId
- appPatientCode
- optionalName
- hospitalNumber
- patientPathway
- dateOfBirth
- ageYears
- ageMonths
- estimatedAge
- gestationalAgeWeeks
- correctedAgeWeeks
- sexForSizeCalculations
- actualWeightKg
- heightOrLengthCm
- referenceWeightKg
- referenceWeightMethod
- createdAt
- updatedAt

#### Admission

- id
- patientId
- facilityId
- bedNumber
- admittedAt
- admissionSource
- reasonForVentilation
- status
- createdByUserId
- reviewStatus
- createdAt
- updatedAt

#### ClinicalSnapshot

- id
- admissionId
- measuredAt
- heartRate
- respiratoryRate
- systolicBp
- diastolicBp
- map
- temperatureC
- spo2
- fio2
- gcs
- avpu
- rass
- mainCondition
- comorbiditiesJson
- enteredByUserId
- createdAt

#### AbgTest

- id
- admissionId
- version
- collectedAt
- ph
- pao2
- paco2
- hco3
- baseExcess
- lactate
- fio2AtSample
- spo2AtSample
- source
- enteredByUserId
- reviewedByUserId
- reviewStatus
- createdAt

#### VentilatorSetting

- id
- admissionId
- measuredAt
- mode
- tidalVolumeMl
- respiratoryRateSet
- respiratoryRateMeasured
- fio2
- peep
- pressureSupport
- inspiratoryPressure
- peakPressure
- plateauPressure
- ieRatio
- minuteVolumeLMin
- vtMlPerKgReferenceWeight
- drivingPressure
- enteredByUserId
- createdAt

#### AirwayDevice

- id
- admissionId
- measuredAt
- airwayRoute
- tubeType
- internalDiameterMm
- depthCm
- cuffPressureCmH2O
- tubeSecured
- notes
- enteredByUserId
- createdAt

#### HumidificationDecision

- id
- admissionId
- measuredAt
- method
- thickSecretions
- highMinuteVentilation
- hypothermia
- airwayBleeding
- expectedLongVentilation
- suggestedOption
- confirmedOption
- confirmedByUserId
- createdAt

#### DailyVentilationReview

- id
- admissionId
- reviewDate
- oxygenationStable
- hemodynamicsStable
- sedationLightEnough
- secretionsManageable
- sbtStatus
- sbtFailureReason
- proneStatus
- vapBundleJson
- reviewedByUserId
- createdAt

#### Outcome

- id
- admissionId
- outcomeType
- outcomeDate
- ventilatorDays
- icuLengthOfStayDays
- hospitalLengthOfStayDays
- reintubationWithin48h
- tracheostomy
- vapSuspected
- notes
- enteredByUserId
- createdAt

#### DatasetCase

- id
- facilityId
- sourceAdmissionId
- sourceType
- deidentifiedPayloadJson
- reviewStatus
- approvedForTraining
- approvedByUserId
- ethicsApprovalId
- datasetVersion
- exclusionReason
- createdAt

#### ReferenceRule

- id
- name
- version
- sourceCitation
- ruleJson
- activeFrom
- activeTo
- approvedByUserId
- createdAt

#### ModelVersion

- id
- modelName
- version
- trainingDatasetVersion
- intendedUse
- performanceSummaryJson
- calibrationSummaryJson
- biasAssessmentJson
- approvalStatus
- activatedAt
- retiredAt
- createdAt

#### AuditLog

- id
- userId
- facilityId
- action
- entityType
- entityId
- beforeJson
- afterJson
- reason
- createdAt

---

## 13. API endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Facilities

- GET `/api/facilities/search`
- POST `/api/facilities`
- POST `/api/facilities/:id/request-verification`
- PATCH `/api/admin/facilities/:id/verify`
- GET `/api/facilities/:id/equipment-profile`
- PATCH `/api/facilities/:id/equipment-profile`

### Memberships

- POST `/api/facilities/:id/memberships/request`
- PATCH `/api/facilities/:id/memberships/:membershipId`
- GET `/api/me/facilities`

### Admissions and tracking

- POST `/api/admissions`
- GET `/api/admissions?facilityId=&status=active`
- GET `/api/admissions/:id`
- PATCH `/api/admissions/:id`
- POST `/api/admissions/:id/clinical-snapshots`
- POST `/api/admissions/:id/abg-tests`
- POST `/api/admissions/:id/ventilator-settings`
- POST `/api/admissions/:id/airway-device`
- POST `/api/admissions/:id/humidification`
- POST `/api/admissions/:id/daily-review`
- POST `/api/admissions/:id/outcome`

### Review

- GET `/api/review/queue`
- POST `/api/review/:entityType/:entityId/approve`
- POST `/api/review/:entityType/:entityId/request-correction`
- POST `/api/review/:entityType/:entityId/exclude`

### Dataset capture

- POST `/api/dataset-imports/parse-note`
- POST `/api/dataset-imports`
- GET `/api/dataset-imports/pending-review`
- POST `/api/dataset-imports/:id/review`
- GET `/api/datasets/approved`
- POST `/api/datasets/:id/export` only for approved research roles

### Rules and models

- GET `/api/references/active`
- POST `/api/admin/references`
- GET `/api/models/versions`
- POST `/api/admin/models/:id/activate-shadow-mode`
- POST `/api/admin/models/:id/retire`

### Admin

- GET `/api/admin/dashboard`
- GET `/api/admin/facilities`
- GET `/api/admin/audit-logs`
- GET `/api/admin/dataset-quality`
- GET `/api/admin/model-monitoring`

---

## 14. Offline-first sync

Offline support is essential.

Offline should allow:

- create admission draft;
- enter ABG;
- enter ventilator settings;
- update airway/humidification;
- save daily review;
- queue sync action;
- view locally cached active patients for the selected facility.

Sync statuses:


| Status          | Meaning                                |
| --------------- | -------------------------------------- |
| Local draft     | Saved only on device.                  |
| Waiting to sync | Ready for upload when network returns. |
| Syncing         | Upload in progress.                    |
| Synced          | Server confirmed.                      |
| Conflict        | Server has competing update.           |
| Failed          | Upload failed; user can retry.         |
| Reviewed        | Specialist/facility reviewer approved. |


Conflict rules:

- Never overwrite reviewed data silently.
- ABG updates create new versions.
- If two users edit the same admission, preserve both and ask reviewer to resolve.
- Show user-friendly conflict messages: “Another update exists. Keep both values for reviewer?”

---

## 15. Clinical dataset and model-training strategy

### 15.1 Three separate data layers

#### Layer 1 — Evidence/reference layer

This layer contains approved clinical rules, formulas, and reference ranges.

Examples:

- population-specific reference weight formulas;
- VT/kg relevant reference weight calculation;
- P/F and S/F calculation;
- ABG ranges;
- adult, pediatric, neonatal, obstetric, and specialty respiratory-failure/ARDS pattern criteria where configured;
- oxygen target cautions;
- humidification prompts;
- daily SBT/readiness checklist.

This layer can power MVP decision support before any machine learning model is active.

#### Layer 2 — Facility clinical data layer

This layer stores real patient records entered by facility users.

These records are used for:

- patient tracking;
- audit;
- facility quality improvement;
- specialist review;
- future de-identified research if approved.

They are **not** automatically training data.

#### Layer 3 — Reviewed training dataset layer

Only de-identified, reviewed, approved records enter model training.

Required status progression:

1. Draft
2. Submitted
3. Needs correction
4. Reviewed
5. Approved for dataset
6. Approved for training
7. Excluded if unsafe/invalid/not approved

### 15.2 Approved research data sources

Potential data sources for model development:


| Source type                                                | How to use safely                                                                                                                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Published clinical guidelines                              | Use for reference rules and guardrails, not statistical model labels.                                                                                 |
| Public ICU datasets such as MIMIC-IV, eICU, AmsterdamUMCdb | Use only under their licenses/data-use agreements; do not upload restricted data to third-party AI APIs; validate carefully before Uganda deployment. |
| Uganda ICU research datasets                               | Use only with REC/IRB approval, UNCST approval where applicable, facility permission, and a data-sharing agreement.                                   |
| Prospective facility registry data from this app           | Use only after consent/waiver/ethics pathway, de-identification, review, and governance approval.                                                     |
| ICU note parser data                                       | Use only after human review; never train directly from raw pasted notes.                                                                              |


### 15.3 Uganda-specific research governance

Before using local patient data for training:

- obtain facility leadership approval;
- obtain REC/IRB approval;
- obtain UNCST approval where required;
- define consent or waiver of consent pathway;
- define data controller and data processor responsibilities;
- define de-identification process;
- define retention and deletion rules;
- define who can export data;
- define whether data can leave Uganda;
- define patient/facility re-identification safeguards;
- create a dataset card for each dataset version.

### 15.4 Model use cases allowed after validation

Start with low-risk prediction and prioritization, not direct ventilator settings.

Acceptable early model tasks:


| Model task                        | Output type                                            |
| --------------------------------- | ------------------------------------------------------ |
| Missing-data detection            | “ABG FiO2 missing; cannot calculate P/F.”              |
| Data quality score                | Completeness and plausibility.                         |
| Review prioritization             | Which records need specialist review first.            |
| Deterioration risk                | “High risk; senior review recommended.”                |
| Prolonged ventilation risk        | Risk category only.                                    |
| Extubation failure risk           | Risk category to support review, not extubation order. |
| Mortality risk for audit/research | Aggregate or clinician-reviewed use only.              |


Do not allow early models to output:

- exact ventilator settings;
- drug orders;
- intubation/extubation orders;
- transfer denial decisions;
- rationing decisions.

### 15.5 Model validation stages


| Stage                 | Description                                                                    | Clinical visibility     |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------- |
| Development           | Train/test on approved data.                                                   | Not visible clinically. |
| Internal validation   | Validate on held-out data.                                                     | Not visible clinically. |
| External validation   | Validate at different facilities/populations.                                  | Not visible clinically. |
| Silent/shadow mode    | Model runs but clinicians do not act on it; compare predictions with outcomes. | Admin/research only.    |
| Supervised pilot      | Output visible with clear uncertainty and mandatory clinician confirmation.    | Limited facilities.     |
| Full decision support | Approved, monitored, versioned, auditable.                                     | Active users.           |


### 15.6 Model monitoring

Track:

- AUROC/AUPRC where relevant;
- calibration plots;
- sensitivity/specificity at chosen thresholds;
- false positive/false negative review;
- performance by facility, age group, patient pathway, sex where relevant, diagnosis, HIV status if collected and approved, and equipment availability;
- missingness by facility;
- drift over time;
- override frequency;
- adverse event review.

Every model needs:

- model card;
- intended use statement;
- contraindicated use statement;
- training dataset version;
- validation dataset version;
- clinical owner;
- technical owner;
- activation date;
- retirement plan.

---

## 16. UI/UX design rules for an extremely easy app

### 16.1 Design principles

1. **One screen, one task.**
2. **Large touch targets** for gloved hands.
3. **Minimal typing**: chips, dropdowns, steppers, numeric keypad.
4. **Use “unknown/not available”** instead of blocking users.
5. **Auto-calculate everything possible.**
6. **Show red flags clearly.**
7. **Show missing data separately from clinical danger.**
8. **Use plain clinical language.**
9. **No long paragraphs on clinical screens.**
10. **Always show active facility and sync status.**

### 16.2 Live summary card

The summary card should stay visible on tablet/web and be collapsible on mobile.

It should show:

- bed and app ID;
- pathway and reference weight;
- VT/kg relevant reference weight;
- P/F or S/F ratio;
- pH/PaCO2 flag;
- oxygen target range;
- plateau/driving pressure if available;
- ARDS/COPD/oedema pattern flags;
- missing key values;
- reviewer status.

### 16.3 Example summary card

This example uses an adult pathway. Neonatal, pediatric, obstetric, burns, and other pathways should show pathway-specific fields and reference rules.

```text
ICU-04 | Adult male 54y | PBW 66 kg
VT 420 mL = 6.4 mL/kg PBW
ABG: pH 7.29 | PaCO2 62 | PaO2 58 on FiO2 0.40
P/F ratio: 145
Pattern flags: Respiratory acidosis | Possible moderate ARDS/respiratory-failure pattern
Missing: Plateau pressure, imaging confirmation
Action: Senior review recommended. Clinician confirms final settings.
```

### 16.4 Do not overload clinicians

Use progressive disclosure:

- normal users see summary and safe prompts;
- reviewers can open detail;
- admins can open matched cases, model details, and dataset quality screens.

---

## 17. Admin dashboard

### Platform admin dashboard

Show:

- total facilities;
- pending facility verification;
- active users;
- dataset review queue;
- sync failures;
- reference rule versions;
- model versions;
- audit log search;
- data quality warnings by facility.

### Facility admin dashboard

Show:

- active ICU admissions;
- ventilated patients;
- patients with red flags;
- ABGs pending review;
- dataset entries submitted;
- facility users and roles;
- equipment profile;
- bed-level activity;
- offline sync failures.

### Specialist reviewer dashboard

Show:

- records needing review;
- ABG edits needing review;
- parser-extracted notes needing confirmation;
- excluded records and reasons;
- model-output disagreement cases in shadow mode.

---

## 18. Security and governance

### 18.1 Security controls

- HTTPS/TLS.
- Password hashing with a modern algorithm.
- Role-based access control.
- Facility-level access isolation.
- Device-level PIN/biometric lock if feasible.
- Encryption for offline local storage.
- Audit logs.
- Automatic session timeout.
- Export controls.
- Admin alerts for suspicious access.

### 18.2 Privacy-by-design

- Optional patient name.
- Prefer app-generated ID.
- Store hospital number only if facility policy allows.
- Do not send identifiers to online AI.
- De-identify before research export.
- Keep research data separate from live clinical database.
- Record consent/waiver/approval metadata.

### 18.3 Clinical governance

Create a clinical governance committee with:

- intensivist/anaesthesiologist;
- ICU nurse leader;
- respiratory therapist/ventilation expert where available;
- hospital data officer;
- facility admin;
- biomedical/equipment representative;
- research ethics/data governance representative;
- software lead.

Responsibilities:

- approve clinical rules;
- approve source references;
- approve model activation;
- review incidents and overrides;
- approve dataset exports;
- review performance by facility.

---

## 19. MVP implementation plan

### Phase 1 — Simple clinical UI and rule-based calculators

- Rename Assessment to Admit.
- Rename History to Tracking.
- Build 3-step admission flow.
- Add live summary card.
- Add pathway-specific reference weight, VT/kg reference weight, P/F, S/F, minute ventilation, and driving pressure calculations where applicable.
- Add ABG pattern flags.
- Add ARDS/COPD/oedema pattern prompts.
- Hide matched cases from normal users.

### Phase 2 — Backend and facility model

- Express server.
- Prisma + MySQL.
- Auth/register/login.
- Facility search and verification.
- Facility memberships.
- Admission save endpoint.
- ABG and ventilator endpoints.
- Tracking board endpoint.

### Phase 3 — Review workflow and audit

- Specialist review queue.
- ABG versioning.
- Ventilator-setting versioning.
- Dataset approval status.
- Audit logs.
- Reviewer comments.

### Phase 4 — Dataset capture

- ICU note parser.
- Structured preview.
- Zod validation.
- Missing/uncertain field highlighting.
- Reviewer approval.
- Approved dataset export.

### Phase 5 — Airway, humidification, and daily review

- Tube documentation.
- Cuff pressure recording.
- Humidification questions.
- Daily liberation readiness card.
- SBT status tracking.
- Outcome fields.

### Phase 6 — Offline sync

- Local encrypted drafts.
- Sync queue.
- Conflict resolution.
- Facility sync status dashboard.

### Phase 7 — Model shadow mode

- Build model only from approved datasets.
- Run silently.
- Compare model outputs against outcomes and reviewer assessments.
- Produce model card and validation report.
- Do not show live predictions until governance approval.

---

## 20. Acceptance criteria

The app is ready for inclusive all-patient-population MVP testing when:

1. User can register, log in, and select/request facility membership.
2. Verified facility can have multiple sub-users with roles.
3. Facility admin can configure ICU equipment and ABG availability.
4. User can admit any patient type in 3 steps by selecting the appropriate patient pathway.
5. App auto-generates app patient/admission ID.
6. User can enter height, weight, ABG, ventilator settings, airway, and humidification.
7. App calculates pathway-specific reference weight, VT/kg reference weight, P/F ratio, S/F ratio, minute ventilation, and driving pressure where applicable.
8. App shows ABG and ventilation safety flags.
9. App saves admission and redirects to Tracking.
10. Tracking board shows active patients by bed, status, and risk flag.
11. Repeat ABG creates a new version, not an overwrite.
12. Specialist reviewer can approve, correct, or exclude data.
13. Dataset capture can parse a note into editable structured fields.
14. Unreviewed records cannot enter training data.
15. Offline drafts sync when network returns.
16. Audit logs capture all edits, reviews, and exports.
17. Normal clinicians cannot see matched-case/debug details.
18. Clinical reference rule versions are visible to admins/reviewers.
19. The app clearly states that final clinical decisions remain with trained clinicians.
20. No model-based live prediction is activated until shadow-mode validation and governance approval are complete.

---

## 21. Reference library to include in the app

The app should maintain a versioned reference library. Each rule should show source, version, approval date, and local reviewer.

Initial references to include:

1. Adult, pediatric, neonatal, obstetric, burns, transport, and specialty ventilation references approved by the clinical governance committee, including lung-protective ventilation, pressure guardrails, oxygenation support, and prone-positioning guidance where applicable.
2. Surviving Sepsis Campaign 2021: low tidal volume ventilation for sepsis-induced ARDS and sepsis-induced respiratory failure.
3. Adult, pediatric, neonatal, and resource-limited ARDS/acute respiratory-failure definitions, including SpO2/FiO2, oxygenation index/saturation index where configured, and ultrasound support where appropriate.
4. BTS oxygen guideline: target saturation ranges and controlled oxygen principles, especially COPD/hypercapnic-risk caution.
5. AARC humidification guideline: humidification for invasive mechanical ventilation.
6. AARC/ATS/CHEST ventilator liberation guidance: daily readiness and spontaneous breathing trial workflow.
7. Uganda MoH Health Data Protection, Privacy and Confidentiality Guidelines.
8. Uganda National Health Facility Registry / Master Facility List.
9. Approved facility local ICU ventilation policy.
10. Approved local research protocols and data-sharing agreements.

---

## 22. Final product statement

This app should be positioned as:

> The first release should be simple, safe, inclusive, and reliable. It should prioritize accurate data capture, clear calculations, red-flag detection, auditability, and reviewer-approved learning before attempting advanced AI-driven ventilation recommendations.

