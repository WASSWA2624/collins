# Frontend Development Plan

## Current implementation state

The frontend is an Expo Router React Native codebase for Android, iOS, and Web. It already includes:

- Expo app configuration for Android, iOS, and Web.
- Cross-platform route structure under `src/app/`.
- Platform-aware reusable components and screens under `src/platform/`.
- Redux Toolkit store, persistence, and slices.
- Offline/network infrastructure.
- Theme, accessibility, i18n, logging, error boundaries, and API client foundations.
- Existing ventilation assessment, recommendation, history/tracking, training/help, settings, and data-source screens.
- Local ventilation dataset support through `src/config/data/ventilation_dataset.json`.

This frontend still needs app-write-up alignment for ICU admission terminology, 3-step admission, inclusive pathways, live clinical summary, offline-safe clinical writes, review workflow, and dataset governance.

## App-write-up alignment gaps to close

| Area | Required frontend work |
| --- | --- |
| Navigation | Rename user-facing Assessment to Admit and History to Tracking; add ABG / Vent Update, Dataset Capture, Review Queue, Dashboard where roles allow. |
| Admission UX | Convert long assessment flow into a maximum 3-step guided wizard. |
| Inclusive pathways | Add pathway-specific fields/prompts for neonate, infant, child, adolescent, adult, obstetric/post-partum, burns, trauma, peri-operative, medical, surgical, and unknown. |
| Live summary | Add sticky/collapsible card with reference weight, VT/kg, P/F or S/F, ABG flag, pressure flags, oxygen caution, missing data, review/sync status. |
| Calculators/flags | Add tested preview helpers for reference weight, VT/kg, P/F, S/F, minute ventilation, driving pressure, ABG and ventilation flags. |
| Offline-first | Harden local drafts, sync queue, conflict display, retry, and grey draft/offline status. |
| Dataset capture | Paste note, parse fields, editable preview, highlight uncertain/missing values, submit for specialist review. |
| Governance | Hide model/debug/matched-case details from normal clinicians; add reviewer/admin role-aware screens. |

## Chronological implementation plan

Detailed phase files are in `frontend/dev-plan/`.

1. **Navigation and admission workflow**
   - Update labels, route aliases, home actions, and the 3-step admission wizard.
2. **Calculators, flags, and live summary**
   - Add pure preview helpers, status colors, missing-data display, and safe wording.
3. **API integration and offline sync**
   - Wire facility/admission/tracking/ABG/ventilator endpoints, local drafts, queue, idempotency, and conflict UI.
4. **Review, dataset capture, and admin dashboards**
   - Add role-aware review queue, dataset note preview, dashboard metrics, and export restrictions.
5. **Shadow-mode governance UI**
   - Add admin/research-only model version and shadow-mode monitoring screens after backend governance exists.

## Immediate next tasks

1. Add `frontend/app-rules/` as the frontend implementation contract.
2. Update visible navigation labels without breaking existing route paths.
3. Build the admission wizard shell and live summary card.
4. Extract clinical preview calculations into pure helpers with tests.
5. Add active facility and sync status to clinical screens.
6. Wire the first end-to-end `POST /api/v1/admissions` flow.

## Acceptance criteria for frontend MVP

- User can register, log in, select/request facility membership, and see active facility.
- Home has four large actions: Admit patient, Update ABG / ventilator, View tracking board, Paste ICU note.
- Any supported patient pathway can be admitted in 3 steps.
- Unknown/not available values are accepted where appropriate.
- Live summary shows calculations, flags, missing data, review status, and sync status.
- Tracking board shows active patients by bed and risk status.
- Repeat ABG/ventilator update UI appends a new time-stamped record.
- Offline drafts and queued writes are visible and retryable.
- Dataset capture uses editable preview and cannot mark records approved for training.
- Normal clinicians do not see matched-case/debug/model internals.

## Known limitations and risks

- Current route paths still include legacy names such as assessment/history; rename user-facing labels first, then migrate paths safely.
- Offline storage exists as a foundation but needs encryption, conflict handling, and verified sync behavior before production.
- Clinical rules and reference ranges require specialist approval.
- Backend integration is not fully wired into all frontend screens yet.
- Production clinical use requires governance, privacy, and security review.
