# Phase 11: HMS Screens, Routes, and UI Wiring

## Purpose
Implementation guide: one step = one screen, in chronological order below. Wire screens to Phase 10 hooks; routes per `app-router.mdc`, UI per `platform-ui.mdc`.

## Rules
- `.cursor/rules/index.mdc` · `app-router.mdc` · `platform-ui.mdc` · `component-structure.mdc` · `features-domain.mdc` · `security.mdc` · `accessibility.mdc` · `testing.mdc` · `theme-design.mdc`

## Prerequisites
Phase 10 (hooks), Phase 9 (layouts/nav), Phase 7 (app shell), Phase 6 (components).

## Guidelines
- **Order**: Follow **Sequential Build Order** below; one screen per step.
- Screens → feature hooks only; i18n for all text; no hardcoded strings.
- Routes: per `app-router.mdc`; omit group in links; guards in group layouts.
- Nav: every route reachable from Phase 9 nav; add entry/icon/label per main screen.
- **Pattern**: Main screens in sidebar; sub-screens as tabs (list/detail/create-edit per tab). Deep links: e.g. `/settings/users`, `/billing/invoice`.

## Route Structure

```text
src/app/
├── _layout.jsx
├── index.jsx
├── _error.jsx
├── +not-found.jsx
│
├── (auth)/
│   ├── _layout.jsx
│   ├── login.jsx
│   ├── register.jsx
│   ├── forgot-password.jsx
│   ├── reset-password.jsx
│   ├── verify-email.jsx
│   ├── verify-phone.jsx
│   ├── tenant-selection.jsx
│   └── facility-selection.jsx
│
├── (main)/
│   ├── _layout.jsx
│   ├── home.jsx
│   ├── patients/
│   ├── scheduling/
│   ├── clinical/
│   ├── ipd/
│   ├── icu/
│   ├── theatre/
│   ├── diagnostics/
│   │   ├── lab/
│   │   └── radiology/
│   ├── pharmacy/
│   ├── inventory/
│   ├── emergency/
│   ├── billing/
│   ├── hr/
│   ├── housekeeping/
│   ├── reports/
│   ├── communications/
│   ├── subscriptions/
│   ├── integrations/
│   ├── compliance/
│   └── settings/
│
└── (patient)/
    ├── _layout.jsx
    ├── portal/
    ├── appointments/
    ├── results/
    ├── prescriptions/
    └── billing/
```

## Sequential Build Order

**One step = one screen.** Complete each step before the next. Where multiple tabs are listed, implement one screen per tab in that order.

### Tier 1: Auth & Shell
- **11.S.1** Login — `(auth)/login`
- **11.S.2** Register — `(auth)/register`
- **11.S.3** Forgot password — `(auth)/forgot-password`
- **11.S.4** Reset password — `(auth)/reset-password`
- **11.S.5** Verify email — `(auth)/verify-email`
- **11.S.6** Verify phone — `(auth)/verify-phone`
- **11.S.7** Tenant selection — `(auth)/tenant-selection`
- **11.S.8** Facility selection — `(auth)/facility-selection`
- **11.S.9** Home — `(main)/home`

### Tier 2: Settings (main + tabs)
- **11.S.10** Settings (main) — `(main)/settings`
- **11.S.11** Tenant — `(main)/settings/tenants`
- **11.S.12** Facility — `(main)/settings/facilities`
- **11.S.13** Branch — `(main)/settings/branches`
- **11.S.14** Department — `(main)/settings/departments`
- **11.S.15** Unit — `(main)/settings/units`
- **11.S.16** Room — `(main)/settings/rooms`
- **11.S.17** Ward — `(main)/settings/wards`
- **11.S.18** Bed — `(main)/settings/beds`
- **11.S.19** Address — `(main)/settings/addresses`
- **11.S.20** Contact — `(main)/settings/contacts`
- **11.S.21** User — `(main)/settings/users`
- **11.S.22** User profile — `(main)/settings/user-profiles`
- **11.S.23** Role — `(main)/settings/roles`
- **11.S.24** Permission — `(main)/settings/permissions`
- **11.S.25** Role–permission — `(main)/settings/role-permissions`
- **11.S.26** User–role — `(main)/settings/user-roles`
- **11.S.27** API key — `(main)/settings/api-keys`
- **11.S.28** API key permission — `(main)/settings/api-key-permissions`
- **11.S.29** User MFA — `(main)/settings/user-mfas`
- **11.S.30** User session — `(main)/settings/user-sessions`
- **11.S.31** OAuth account — `(main)/settings/oauth-accounts`

### Tier 3: Patients (main + tabs)
- **11.S.32** Patients (main) — `(main)/patients`
- **11.S.33** Patient — `(main)/patients/patients`
- **11.S.34** Patient identifier — `(main)/patients/patient-identifiers`
- **11.S.35** Patient contact — `(main)/patients/patient-contacts`
- **11.S.36** Patient guardian — `(main)/patients/patient-guardians`
- **11.S.37** Patient allergy — `(main)/patients/patient-allergies`
- **11.S.38** Patient medical history — `(main)/patients/patient-medical-histories`
- **11.S.39** Patient document — `(main)/patients/patient-documents`

### Tier 4: Scheduling (main + tabs)
- **11.S.40** Scheduling (main) — `(main)/scheduling`
- **11.S.41** Appointment — `(main)/scheduling/appointments`
- **11.S.42** Provider schedule — `(main)/scheduling/provider-schedules`
- **11.S.43** Availability slot — `(main)/scheduling/availability-slots`
- **11.S.44** Visit queue — `(main)/scheduling/visit-queues`

### Tier 5: Clinical (main + tabs)
- **11.S.45** Clinical (main) — `(main)/clinical`
- **11.S.46** Encounter — `(main)/clinical/encounters`
- **11.S.47** Clinical note — `(main)/clinical/clinical-notes`
- **11.S.48** Diagnosis — `(main)/clinical/diagnoses`
- **11.S.49** Procedure — `(main)/clinical/procedures`
- **11.S.50** Vital sign — `(main)/clinical/vital-signs`
- **11.S.51** Care plan — `(main)/clinical/care-plans`
- **11.S.52** Referral — `(main)/clinical/referrals`
- **11.S.53** Follow-up — `(main)/clinical/follow-ups`

### Tier 6: IPD, ICU, Theatre, Emergency
- **11.S.54** IPD (main) — `(main)/ipd`
- **11.S.55** IPD tabs: admission, bed-assignment, ward-round, nursing-note, medication-admin, discharge, transfer — `(main)/ipd/*` (one step per tab)
- **11.S.56** ICU (main) — `(main)/icu`
- **11.S.57** ICU tabs: stay, observation, critical-alert — `(main)/icu/*` (one step per tab)
- **11.S.58** Theatre (main) — `(main)/theatre`
- **11.S.59** Theatre tabs: case, anesthesia-record, post-op-note — `(main)/theatre/*` (one step per tab)
- **11.S.60** Emergency (main) — `(main)/emergency`
- **11.S.61** Emergency tabs: case, triage, response, ambulance, dispatch, trip — `(main)/emergency/*` (one step per tab)

### Tier 7: Diagnostics (Lab + Radiology)
- **11.S.62** Lab (main) — `(main)/diagnostics/lab`
- **11.S.63** Lab tabs: test, panel, order, sample, result, QC — `(main)/diagnostics/lab/*` (one step per tab)
- **11.S.64** Radiology (main) — `(main)/diagnostics/radiology`
- **11.S.65** Radiology tabs: test, order, result, imaging, PACS — `(main)/diagnostics/radiology/*` (one step per tab)

### Tier 8: Pharmacy, Inventory
- **11.S.66** Pharmacy (main) — `(main)/pharmacy`
- **11.S.67** Pharmacy tabs: drug, batch, formulary, order, dispense, adverse-event — `(main)/pharmacy/*` (one step per tab)
- **11.S.68** Inventory (main) — `(main)/inventory`
- **11.S.69** Inventory tabs: item, stock, movement, supplier, purchase, receipt, adjustment — `(main)/inventory/*` (one step per tab)

### Tier 9: Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance
- **11.S.70** Billing (main) — `(main)/billing`
- **11.S.71** Billing tabs: invoice, payment, refund, pricing, coverage, claim, pre-auth, adjustment — `(main)/billing/*` (one step per tab)
- **11.S.72** HR (main) — `(main)/hr`
- **11.S.73** HR tabs: staff, assignment, leave, shift, payroll — `(main)/hr/*` (one step per tab)
- **11.S.74** Housekeeping (main) — `(main)/housekeeping`
- **11.S.75** Housekeeping tabs: task, schedule, maintenance, asset, service-log — `(main)/housekeeping/*` (one step per tab)
- **11.S.76** Reports (main) — `(main)/reports`
- **11.S.77** Communications (main) — `(main)/communications`
- **11.S.78** Subscriptions (main) — `(main)/subscriptions`
- **11.S.79** Integrations (main) — `(main)/integrations`
- **11.S.80** Compliance (main) — `(main)/compliance`

### Tier 10: Patient portal
- **11.S.81** Patient portal (main) — `(patient)/portal`
- **11.S.82** Patient appointments — `(patient)/appointments`
- **11.S.83** Patient results — `(patient)/results`
- **11.S.84** Patient prescriptions — `(patient)/prescriptions`
- **11.S.85** Patient billing — `(patient)/billing`

---

## Per-step checklist
Per screen: routes per `app-router.mdc`; screen per `platform-ui.mdc` + `component-structure.mdc`; wire to hooks; i18n; loading/error/empty/guarded states; nav entry for main screens. Tests per `testing.mdc`; a11y per `accessibility.mdc`.

## Completeness
- [ ] 11.S.1–9 (auth, home)
- [ ] 11.S.10–31 (Settings main + tabs)
- [ ] 11.S.32–53 (Patients, Scheduling, Clinical)
- [ ] 11.S.54–69 (IPD, ICU, Theatre, Emergency, Lab, Radiology, Pharmacy, Inventory)
- [ ] 11.S.70–85 (Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance, Patient portal)
- [ ] Nav + deep links for all main screens

## Settings status (11.S.10–31)
- **11–12** tenant, facility — List ✓, Detail ✓, Create/Edit ✓
- **13–18** branch, department, unit, room, ward, bed — List ✓, Detail ✓, Create/Edit ✓
- **19–20** address, contact — List ✓, Detail ✓, Create/Edit ✓
- **21–31** user … oauth-account — List ✓, Detail ✓, Create/Edit TBD

Backend: facility/tenant usecases unwrap `response.data.data`; other CRUD same pattern when backend returns `{ data }`.
