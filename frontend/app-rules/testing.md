# Frontend Testing Rules

## Minimum test areas

- Routing and protected route behavior.
- Auth and active facility selection.
- 3-step admission workflow.
- Tracking board rendering and risk status labels.
- Fast ABG / ventilator update flow.
- Live summary card calculations and missing-data display.
- Dataset capture parser preview and review state.
- Offline draft and sync queue behavior.
- Role-aware visibility for review, admin, dataset export, and model screens.
- Accessibility for critical forms and alerts.

## Clinical safety tests

Test that the UI:

- Uses “Admit” instead of legacy “Assessment” in user-facing navigation.
- Uses “Tracking” instead of legacy “History” in user-facing navigation.
- Never displays “diagnosed ARDS” as an app conclusion.
- Never displays exact ventilator-setting orders.
- Shows clinician-confirmation wording for clinical prompts.
- Separates missing data from danger flags.
- Allows unknown/not available values where required.
- Hides matched-case/debug/model details from normal clinicians.

## Calculator preview tests

Test preview helpers/selectors for:

- Adult PBW only for allowed pathways.
- No adult PBW for neonate/pediatric/unknown pathways.
- VT/kg reference weight.
- P/F ratio.
- S/F screening fallback and high SpO2 caution.
- Minute ventilation.
- Driving pressure.
- ABG and ventilation safety flags.

## Offline tests

Test:

- Admission draft saves locally when offline.
- ABG update queues with idempotency key.
- Failed sync shows retry action.
- Conflict shows a clear conflict state and preserves local/server values.
- Grey status appears for draft/offline/unreviewed records.

## API integration tests

Mock backend responses for:

- Register/login/me.
- Facility memberships.
- Admission create/load.
- ABG and ventilator append writes.
- Review actions.
- Dataset parse/save/review.
- Permission denied and validation errors.
- Sync conflict and retryable network errors.

## Acceptance gate

Do not mark the frontend MVP ready until tests prove that a clinician can admit any supported patient pathway in 3 steps, see safe calculation previews, save offline drafts, update ABG/ventilator values without overwriting history, and avoid exposure to reviewer/admin/model-only details.
