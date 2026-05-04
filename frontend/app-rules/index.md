# Frontend App Rules

These rules define the Expo Router React Native frontend standard for the ICU Ventilation Admission, Tracking & Decision-Support App described in `../../app-write-up.md`.

The frontend must be extremely easy to use in a busy ICU while preserving clinical safety. It should help clinicians capture data, see calculations, notice missing/unsafe values, and request review. It must not replace clinical judgement.

## Rule files

- `architecture.md` — frontend stack, route/screen/module boundaries, and state ownership.
- `project-structure.md` — folder structure, file naming, and placement rules.
- `clinical-safety.md` — wording, calculations, flags, AI/model restrictions, and decision-support limits.
- `navigation-workflows.md` — required navigation labels, 3-step admission, tracking, fast update, dataset capture, and review queue.
- `state-offline-sync.md` — Redux/local state, offline drafts, sync queue, conflict handling, and persistence.
- `api-integration.md` — backend contracts, endpoint usage, auth, facility scoping, and request rules.
- `ui-ux.md` — simple ICU UI rules, accessibility, responsive design, forms, summary cards, and status colors.
- `testing.md` — frontend tests for workflows, safety wording, offline behavior, API integration, and access control.

## Non-negotiable frontend rules

1. Show decision support, not orders.
2. Always make missing data and uncertainty visible.
3. Allow `unknown/not available` where the write-up says saving should not be blocked.
4. Use pathway-specific wording and fields for neonates, pediatrics, adults, obstetric/post-partum, burns, trauma, peri-operative, and unknown cases.
5. Never show matched-case/debug/model details to normal clinicians.
6. Never send patient identifiers to online AI services.
7. Keep active facility and sync/offline status visible on clinical screens.
8. Repeat ABG and ventilator updates must create new time-stamped records, not overwrite previous values.
9. The UI must be usable with gloved hands: large touch targets, chips, steppers, dropdowns, and minimal typing.
10. Clinical screens must use short, plain language.
