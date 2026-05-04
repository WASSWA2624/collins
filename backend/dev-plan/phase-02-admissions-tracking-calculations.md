# Phase 2 — Admissions, Tracking, Calculations, and Flags

## Goal

Support the core ICU workflow: admit, calculate, flag, and track active patients safely.

## Scope

- Implement 3-step admission payload.
- Generate app patient/admission IDs.
- Save patient pathway, reason, comorbidities, oxygen/ABG/ventilator data, airway, and humidification data.
- Implement tracking board endpoint with bed, pathway, SpO2/FiO2, PEEP, VT/kg, ABG flag, missing data, and review status.
- Implement fast ABG and ventilator update endpoints.
- Add pure calculators for:
  - adult PBW where allowed;
  - pathway-specific reference weight placeholder hooks;
  - VT/kg reference weight;
  - P/F ratio;
  - S/F screening fallback;
  - minute ventilation;
  - driving pressure.
- Add safe flag services for ABG, ARDS/respiratory-failure helper, COPD/hypercapnia caution, oedema context, plateau/driving pressure, missing FiO2, missing size/weight, and humidification caution.

## Done when

- Any supported patient pathway can be admitted without being blocked by optional missing data.
- Impossible values are rejected or routed to reviewer override.
- Repeat ABGs and ventilator settings create new versions/records.
- Clinical outputs use “check/review/confirm clinically” wording.
- Unit tests cover calculators and clinical flags.
