# Phase 11: HMS Screens, Routes, and UI Wiring

## Purpose
Implement screens, routes, and UI wiring for all HMS modules built in Phase 10. Each step is **atomic** and covers **one module's screens/routes**.

## Rule References
- `.cursor/rules/app-router.mdc` (Route structure - MANDATORY)
- `.cursor/rules/platform-ui.mdc` (Screen structure - MANDATORY)
- `.cursor/rules/component-structure.mdc` (Component structure - MANDATORY)
- `.cursor/rules/features-domain.mdc` (Feature hooks usage)
- `.cursor/rules/security.mdc` (Route guards)
- `.cursor/rules/accessibility.mdc` (A11y requirements)
- `.cursor/rules/testing.mdc` (Testing requirements)
- `.cursor/rules/theme-design.mdc` (Theming)

## Prerequisites
- Phase 10 completed (core modules implemented with hooks)
- Phase 9 completed (base layouts, navigation, global controls)
- Phase 7 completed (app shell with providers and layouts)
- Reusable UI components exist (Phase 6)

## Implementation Guidelines
- All screens must wire to feature hooks; never import features directly.
- All UI text must use i18n; no hardcoded strings.
- Route group names are omitted when linking/navigating (Expo Router group behavior).
- Route guards must be applied via group layouts and role-aware navigation.
- Every module route must be reachable from the existing navigation bar (Phase 9). Update the existing nav config/layouts; do not introduce a new navigation system.

## Wiring & Functionality Checklist (Per Module)
- Routes: create route files/folders per `app-router.mdc`, in the correct group layout.
- Screens: implement per `platform-ui.mdc` and `component-structure.mdc`, wired to module hooks.
- Navigation: add/confirm nav entry, label, and icon in existing Phase 9 navigation; ensure deep links point to the route group path.
- Functionality: list, detail, create/edit flows backed by hooks; support pagination/filters where the hook exposes them.
- States: loading, error, empty, and permission/guarded states handled in UI.
- Consistency: keep naming, route paths, and UI sections aligned with Phase 10 module names.

## Route Structure Overview

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
│   └── verify-phone.jsx
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
# End of Selection
```

## Steps (Fully Atomic)
Each step implements screens/routes for exactly **one** module from Phase 10, wiring to the module hook.

### Module Group 1: Auth, Sessions, Tenancy & Core Access
- Step 11.1.1: `auth`
- Step 11.1.2: `user-session`
- Step 11.1.3: `tenant`
- Step 11.1.4: `facility`
- Step 11.1.5: `branch`
- Step 11.1.6: `department`
- Step 11.1.7: `unit`
- Step 11.1.8: `room`
- Step 11.1.9: `ward`
- Step 11.1.10: `bed`
- Step 11.1.11: `address`
- Step 11.1.12: `contact`
- Step 11.1.13: `user`
- Step 11.1.14: `user-profile`
- Step 11.1.15: `role`
- Step 11.1.16: `permission`
- Step 11.1.17: `role-permission`
- Step 11.1.18: `user-role`
- Step 11.1.19: `api-key`
- Step 11.1.20: `api-key-permission`
- Step 11.1.21: `user-mfa`
- Step 11.1.22: `oauth-account`

### Module Group 2: Patient Registry & Consent
- Step 11.2.1: `patient`
- Step 11.2.2: `patient-identifier`
- Step 11.2.3: `patient-contact`
- Step 11.2.4: `patient-guardian`
- Step 11.2.5: `patient-allergy`
- Step 11.2.6: `patient-medical-history`
- Step 11.2.7: `patient-document`
- Step 11.2.8: `consent`
- Step 11.2.9: `terms-acceptance`

### Module Group 3: Scheduling, Availability & Queues
- Step 11.3.1: `appointment`
- Step 11.3.2: `appointment-participant`
- Step 11.3.3: `appointment-reminder`
- Step 11.3.4: `provider-schedule`
- Step 11.3.5: `availability-slot`
- Step 11.3.6: `visit-queue`

### Module Group 4: Encounters & Clinical Documentation
- Step 11.4.1: `encounter`
- Step 11.4.2: `clinical-note`
- Step 11.4.3: `diagnosis`
- Step 11.4.4: `procedure`
- Step 11.4.5: `vital-sign`
- Step 11.4.6: `care-plan`
- Step 11.4.7: `clinical-alert`
- Step 11.4.8: `referral`
- Step 11.4.9: `follow-up`

### Module Group 5: Inpatient (IPD) & Bed Management
- Step 11.5.1: `admission`
- Step 11.5.2: `bed-assignment`
- Step 11.5.3: `ward-round`
- Step 11.5.4: `nursing-note`
- Step 11.5.5: `medication-administration`
- Step 11.5.6: `discharge-summary`
- Step 11.5.7: `transfer-request`

### Module Group 6: ICU & Critical Care
- Step 11.6.1: `icu-stay`
- Step 11.6.2: `icu-observation`
- Step 11.6.3: `critical-alert`

### Module Group 7: Theatre & Anesthesia
- Step 11.7.1: `theatre-case`
- Step 11.7.2: `anesthesia-record`
- Step 11.7.3: `post-op-note`

### Module Group 8: Laboratory (LIS)
- Step 11.8.1: `lab-test`
- Step 11.8.2: `lab-panel`
- Step 11.8.3: `lab-order`
- Step 11.8.4: `lab-order-item`
- Step 11.8.5: `lab-sample`
- Step 11.8.6: `lab-result`
- Step 11.8.7: `lab-qc-log`

### Module Group 9: Radiology (RIS/PACS)
- Step 11.9.1: `radiology-test`
- Step 11.9.2: `radiology-order`
- Step 11.9.3: `radiology-result`
- Step 11.9.4: `imaging-study`
- Step 11.9.5: `imaging-asset`
- Step 11.9.6: `pacs-link`

### Module Group 10: Pharmacy
- Step 11.10.1: `drug`
- Step 11.10.2: `drug-batch`
- Step 11.10.3: `formulary-item`
- Step 11.10.4: `pharmacy-order`
- Step 11.10.5: `pharmacy-order-item`
- Step 11.10.6: `dispense-log`
- Step 11.10.7: `adverse-event`

### Module Group 11: Inventory & Procurement
- Step 11.11.1: `inventory-item`
- Step 11.11.2: `inventory-stock`
- Step 11.11.3: `stock-movement`
- Step 11.11.4: `supplier`
- Step 11.11.5: `purchase-request`
- Step 11.11.6: `purchase-order`
- Step 11.11.7: `goods-receipt`
- Step 11.11.8: `stock-adjustment`

### Module Group 12: Emergency & Ambulance
- Step 11.12.1: `emergency-case`
- Step 11.12.2: `triage-assessment`
- Step 11.12.3: `emergency-response`
- Step 11.12.4: `ambulance`
- Step 11.12.5: `ambulance-dispatch`
- Step 11.12.6: `ambulance-trip`

### Module Group 13: Billing, Payments & Insurance
- Step 11.13.1: `invoice`
- Step 11.13.2: `invoice-item`
- Step 11.13.3: `payment`
- Step 11.13.4: `refund`
- Step 11.13.5: `pricing-rule`
- Step 11.13.6: `coverage-plan`
- Step 11.13.7: `insurance-claim`
- Step 11.13.8: `pre-authorization`
- Step 11.13.9: `billing-adjustment`

### Module Group 14: HR, Payroll & Staffing
- Step 11.14.1: `staff-profile`
- Step 11.14.2: `staff-assignment`
- Step 11.14.3: `staff-leave`
- Step 11.14.4: `shift`
- Step 11.14.5: `shift-assignment`
- Step 11.14.6: `shift-swap-request`
- Step 11.14.7: `payroll-run`
- Step 11.14.8: `payroll-item`

### Module Group 15: Housekeeping & Facilities
- Step 11.15.1: `housekeeping-task`
- Step 11.15.2: `housekeeping-schedule`
- Step 11.15.3: `maintenance-request`
- Step 11.15.4: `asset`
- Step 11.15.5: `asset-service-log`

### Module Group 16: Notifications & Communications
- Step 11.16.1: `notification`
- Step 11.16.2: `notification-delivery`
- Step 11.16.3: `conversation`
- Step 11.16.4: `message`
- Step 11.16.5: `template`
- Step 11.16.6: `template-variable`

### Module Group 17: Reporting & Analytics
- Step 11.17.1: `report-definition`
- Step 11.17.2: `report-run`
- Step 11.17.3: `dashboard-widget`
- Step 11.17.4: `kpi-snapshot`
- Step 11.17.5: `analytics-event`

### Module Group 18: Subscriptions, Licensing & Modules
- Step 11.18.1: `subscription-plan`
- Step 11.18.2: `subscription`
- Step 11.18.3: `subscription-invoice`
- Step 11.18.4: `module`
- Step 11.18.5: `module-subscription`
- Step 11.18.6: `license`

### Module Group 19: Compliance, Audit & Security
- Step 11.19.1: `audit-log`
- Step 11.19.2: `phi-access-log`
- Step 11.19.3: `data-processing-log`
- Step 11.19.4: `breach-notification`
- Step 11.19.5: `system-change-log`

### Module Group 20: Integrations & Webhooks
- Step 11.20.1: `integration`
- Step 11.20.2: `integration-log`
- Step 11.20.3: `webhook-subscription`

**Testing**: For each step, add UI tests (render, loading, error, empty, permissions, and navigation entry visibility/route access) per `.cursor/rules/testing.mdc`, and accessibility checks per `.cursor/rules/accessibility.mdc`.
