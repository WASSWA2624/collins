# Frontend Architecture Rules

## Stack

- Expo + Expo Router for Android, iOS, and Web.
- React Native + React Native Web.
- Redux Toolkit for shared app state.
- Redux Persist where persistence is appropriate.
- Zod for client-side validation and parser preview validation.
- Styled Components and existing theme tokens for design consistency.
- NetInfo/offline utilities for connectivity-aware flows.
- Secure storage for sensitive session data where supported.

## Route and screen boundaries

- `src/app/` owns Expo Router entry points and route grouping.
- `src/platform/screens/` owns screen-level UI.
- `src/platform/components/` owns reusable display, form, feedback, layout, navigation, and state components.
- `src/features/<domain>/` owns domain models, rules, use cases, and API wrappers.
- `src/services/api/` owns the HTTP client, auth headers, request/response normalization, and API errors.
- `src/offline/` owns connectivity state, local draft handling, and sync queue behavior.
- `src/store/` owns slices, selectors, persistence, and app-level state setup.

## Required frontend domains

- Auth and current user.
- Active facility and memberships.
- Admission wizard.
- Tracking board.
- ABG / ventilator updates.
- Airway and humidification documentation.
- Daily liberation/readiness review.
- Dataset capture and note parser preview.
- Review queue for specialist/reviewer roles.
- Admin dashboards for platform/facility roles.
- Training/help and references.
- Settings, privacy, data sources, and disclaimer.

## State ownership

Use a simple rule:

- Form state stays local until the user saves, drafts, or syncs.
- Shared clinical records live in Redux slices after loading/saving.
- Derived calculations should come from pure selectors/helpers so they can be tested.
- Sensitive auth tokens should not be stored in plain AsyncStorage when secure storage is available.
- Offline queue state must be separate from synced server records.

## Clinical calculation boundary

Frontend may calculate live previews for speed, but the backend remains the source of truth after save. Frontend calculations must use the same named rule helpers and show “preview” or “pending sync” status when the server has not confirmed.

## Model/AI boundary

The frontend may support a parser preview for pasted ICU notes, but it must not silently guess. Model outputs in shadow mode are admin/research only and hidden from normal clinicians. Do not add live predictive UI without governance approval, backend support, and rule-file update.
