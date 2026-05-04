# Frontend Clinical Safety Rules

## Safety position

The app supports clinical judgement. It does not diagnose, prescribe, intubate, extubate, or set a ventilator autonomously.

Use wording such as:

- “Check tidal volume per relevant reference weight.”
- “Consider urgent senior review.”
- “Possible respiratory-failure/ARDS pattern — confirm clinically and with imaging/ultrasound if available.”
- “Clinician must confirm final ventilator settings.”

Do not use wording such as:

- “Diagnosed ARDS.”
- “Set PEEP to ...”.
- “Intubate now.”
- “Extubate now.”
- “Give medication ...”.

## Required safety display behavior

- Show missing data separately from danger flags.
- Show “unknown/not available” options instead of forcing false values.
- Mark draft/offline/unreviewed data clearly.
- Show rule/reference version when available.
- Show reviewer status on clinical summary screens.
- Let clinicians override prompts only with a reason when the backend supports override capture.
- Keep matched cases, debug details, model outputs, and dataset labels hidden from normal clinicians.

## Population-specific behavior

The selected patient pathway controls fields, calculations, reference ranges, prompts, and wording.

- Neonate: include gestational/corrected age and actual weight; do not use adult PBW.
- Infant/child/adolescent: use pediatric local/reference rules; do not force adult thresholds.
- Adult: allow adult PBW calculation when sex and height are available.
- Obstetric/post-partum: use adult pathway plus maternal critical-care cautions.
- Burns/trauma/peri-operative/specialty: combine age-group rules with specialty prompts.
- Unknown: allow documentation, show missing pathway warning, and avoid pathway-specific recommendations.

## Required calculations

The frontend may show live previews for:

- reference weight or missing reference-weight reason;
- VT per relevant reference weight;
- P/F ratio when PaO2 and FiO2 share the same time point;
- S/F screening ratio when ABG is unavailable;
- minute ventilation;
- driving pressure when plateau and PEEP are available/applicable.

After save, display the backend-confirmed values when available.

## Required flags and prompts

Support safe display of:

- ABG pattern flags.
- ARDS/acute respiratory-failure helper prompt.
- COPD/hypercapnia caution.
- Pulmonary oedema context prompt.
- Sepsis/pneumonia context prompt.
- Plateau pressure caution.
- Driving pressure caution.
- Severe hypoxaemia alert.
- Missing FiO2 and missing size/weight warnings.
- HME/humidification caution.
- Daily liberation/readiness missing or failed-SBT prompts.

## Dataset and AI restrictions

- Pasted ICU notes must show an editable structured preview before saving.
- Do not silently guess uncertain fields.
- Keep raw notes only if facility policy and research approval allow it.
- Remove identifiers before research export.
- Unreviewed records cannot be marked as training data.
- Do not send identifiers to online AI services.
- Predictive model outputs must remain hidden from normal clinicians during shadow mode.
