# Phase 1 — Navigation and Admission Workflow

## Goal

Make the app match the write-up’s simple ICU navigation and 3-step admission flow.

## Scope

- Rename visible navigation labels:
  - Assessment → Admit.
  - History → Tracking.
- Add or surface main actions: Admit patient, Update ABG / ventilator, View tracking board, Paste ICU note.
- Show active facility and sync/offline status on Home and clinical screens.
- Build admission wizard:
  1. Patient & reason.
  2. Oxygen, ABG & ventilator.
  3. Save & review.
- Add patient pathway selection chips for all MVP pathways.
- Add unknown/not available options.
- Keep old route aliases temporarily if needed to avoid breaking links/tests.

## Done when

- A clinician can start admission from Home and complete the 3-step flow.
- Missing optional data does not block draft saving.
- User-facing clinical labels match the app write-up.
- Tests cover route labels, wizard navigation, required fields, and unknown/not available options.
