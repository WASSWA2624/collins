# Phase 9: Core HMS Features (Atomic Module Implementations)

## Purpose
Implement the HMS core modules aligned with `hms-backend/write-up.md` and `hms-backend/dev-plan/P011_modules.mdc`. Each step is **atomic** and covers **one backend module** using the standard feature template.

## Rule References
- `.cursor/rules/features-domain.mdc` (Feature Template Structure - MANDATORY)
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`

## Prerequisites
- Phase 7 completed (app shell exists)
- `@services/api` client exists (Phase 2)
- Errors layer exists (Phase 1)
- Shared utilities exist (URL helpers, pagination, error normalization)

## Feature Development Contract (applies to every step)
For each module step, implement the full feature template:
- `src/features/index.js` (root barrel exporting all feature modules)
- `src/features/<feature>/<feature>.rules.js`
- `src/features/<feature>/<feature>.model.js`
- `src/features/<feature>/<feature>.api.js`
- `src/features/<feature>/<feature>.usecase.js`
- `src/features/<feature>/<feature>.events.js` (optional)
- `src/features/<feature>/index.js`
- `src/store/slices/<feature>.slice.js` (if global state is needed)
- `src/hooks/use<Feature>.js`

## Testing Requirements (applies to every step)
- Rules/models: 100% coverage (all branches)
- API/usecase/slice/hook: 100% coverage (all branches and error paths)
- All tests must mock services, storage, and time

## Definition of Done (per module)
- Feature files exist and follow structure
- Unit tests pass with required coverage
- No UI imports in features/store/services
- Errors are normalized and domain-specific
- Public APIs exported via `index.js`

## Steps
Each step implements exactly **one** backend module from `hms-backend/dev-plan/P011_modules.mdc`.

### Module Group 1: Auth, Sessions, Tenancy & Core Access
- Step 9.1.1: `auth`
- Step 9.1.2: `user-session`
- Step 9.1.3: `tenant`
- Step 9.1.4: `facility`
- Step 9.1.5: `branch`
- Step 9.1.6: `department`
- Step 9.1.7: `unit`
- Step 9.1.8: `room`
- Step 9.1.9: `ward`
- Step 9.1.10: `bed`
- Step 9.1.11: `address`
- Step 9.1.12: `contact`
- Step 9.1.13: `user`
- Step 9.1.14: `user-profile`
- Step 9.1.15: `role`
- Step 9.1.16: `permission`
- Step 9.1.17: `role-permission`
- Step 9.1.18: `user-role`
- Step 9.1.19: `api-key`
- Step 9.1.20: `api-key-permission`
- Step 9.1.21: `user-mfa`
- Step 9.1.22: `oauth-account`

### Module Group 2: Patient Registry & Consent
- Step 9.2.1: `patient`
- Step 9.2.2: `patient-identifier`
- Step 9.2.3: `patient-contact`
- Step 9.2.4: `patient-guardian`
- Step 9.2.5: `patient-allergy`
- Step 9.2.6: `patient-medical-history`
- Step 9.2.7: `patient-document`
- Step 9.2.8: `consent`
- Step 9.2.9: `terms-acceptance`

### Module Group 3: Scheduling, Availability & Queues
- Step 9.3.1: `appointment`
- Step 9.3.2: `appointment-participant`
- Step 9.3.3: `appointment-reminder`
- Step 9.3.4: `provider-schedule`
- Step 9.3.5: `availability-slot`
- Step 9.3.6: `visit-queue`

### Module Group 4: Encounters & Clinical Documentation
- Step 9.4.1: `encounter`
- Step 9.4.2: `clinical-note`
- Step 9.4.3: `diagnosis`
- Step 9.4.4: `procedure`
- Step 9.4.5: `vital-sign`
- Step 9.4.6: `care-plan`
- Step 9.4.7: `clinical-alert`
- Step 9.4.8: `referral`
- Step 9.4.9: `follow-up`

### Module Group 5: Inpatient (IPD) & Bed Management
- Step 9.5.1: `admission`
- Step 9.5.2: `bed-assignment`
- Step 9.5.3: `ward-round`
- Step 9.5.4: `nursing-note`
- Step 9.5.5: `medication-administration`
- Step 9.5.6: `discharge-summary`
- Step 9.5.7: `transfer-request`

### Module Group 6: ICU & Critical Care
- Step 9.6.1: `icu-stay`
- Step 9.6.2: `icu-observation`
- Step 9.6.3: `critical-alert`

### Module Group 7: Theatre & Anesthesia
- Step 9.7.1: `theatre-case`
- Step 9.7.2: `anesthesia-record`
- Step 9.7.3: `post-op-note`

### Module Group 8: Laboratory (LIS)
- Step 9.8.1: `lab-test`
- Step 9.8.2: `lab-panel`
- Step 9.8.3: `lab-order`
- Step 9.8.4: `lab-order-item`
- Step 9.8.5: `lab-sample`
- Step 9.8.6: `lab-result`
- Step 9.8.7: `lab-qc-log`

### Module Group 9: Radiology (RIS/PACS)
- Step 9.9.1: `radiology-test`
- Step 9.9.2: `radiology-order`
- Step 9.9.3: `radiology-result`
- Step 9.9.4: `imaging-study`
- Step 9.9.5: `imaging-asset`
- Step 9.9.6: `pacs-link`

### Module Group 10: Pharmacy
- Step 9.10.1: `drug`
- Step 9.10.2: `drug-batch`
- Step 9.10.3: `formulary-item`
- Step 9.10.4: `pharmacy-order`
- Step 9.10.5: `pharmacy-order-item`
- Step 9.10.6: `dispense-log`
- Step 9.10.7: `adverse-event`

### Module Group 11: Inventory & Procurement
- Step 9.11.1: `inventory-item`
- Step 9.11.2: `inventory-stock`
- Step 9.11.3: `stock-movement`
- Step 9.11.4: `supplier`
- Step 9.11.5: `purchase-request`
- Step 9.11.6: `purchase-order`
- Step 9.11.7: `goods-receipt`
- Step 9.11.8: `stock-adjustment`

### Module Group 12: Emergency & Ambulance
- Step 9.12.1: `emergency-case`
- Step 9.12.2: `triage-assessment`
- Step 9.12.3: `emergency-response`
- Step 9.12.4: `ambulance`
- Step 9.12.5: `ambulance-dispatch`
- Step 9.12.6: `ambulance-trip`

### Module Group 13: Billing, Payments & Insurance
- Step 9.13.1: `invoice`
- Step 9.13.2: `invoice-item`
- Step 9.13.3: `payment`
- Step 9.13.4: `refund`
- Step 9.13.5: `pricing-rule`
- Step 9.13.6: `coverage-plan`
- Step 9.13.7: `insurance-claim`
- Step 9.13.8: `pre-authorization`
- Step 9.13.9: `billing-adjustment`

### Module Group 14: HR, Payroll & Staffing
- Step 9.14.1: `staff-profile`
- Step 9.14.2: `staff-assignment`
- Step 9.14.3: `staff-leave`
- Step 9.14.4: `shift`
- Step 9.14.5: `shift-assignment`
- Step 9.14.6: `shift-swap-request`
- Step 9.14.7: `payroll-run`
- Step 9.14.8: `payroll-item`

### Module Group 15: Housekeeping & Facilities
- Step 9.15.1: `housekeeping-task`
- Step 9.15.2: `housekeeping-schedule`
- Step 9.15.3: `maintenance-request`
- Step 9.15.4: `asset`
- Step 9.15.5: `asset-service-log`

### Module Group 16: Notifications & Communications
- Step 9.16.1: `notification`
- Step 9.16.2: `notification-delivery`
- Step 9.16.3: `conversation`
- Step 9.16.4: `message`
- Step 9.16.5: `template`
- Step 9.16.6: `template-variable`

### Module Group 17: Reporting & Analytics
- Step 9.17.1: `report-definition`
- Step 9.17.2: `report-run`
- Step 9.17.3: `dashboard-widget`
- Step 9.17.4: `kpi-snapshot`
- Step 9.17.5: `analytics-event`

### Module Group 18: Subscriptions, Licensing & Modules
- Step 9.18.1: `subscription-plan`
- Step 9.18.2: `subscription`
- Step 9.18.3: `subscription-invoice`
- Step 9.18.4: `module`
- Step 9.18.5: `module-subscription`
- Step 9.18.6: `license`

### Module Group 19: Compliance, Audit & Security
- Step 9.19.1: `audit-log`
- Step 9.19.2: `phi-access-log`
- Step 9.19.3: `data-processing-log`
- Step 9.19.4: `breach-notification`
- Step 9.19.5: `system-change-log`

### Module Group 20: Integrations & Webhooks
- Step 9.20.1: `integration`
- Step 9.20.2: `integration-log`
- Step 9.20.3: `webhook-subscription`

**Note**: Telemedicine and patient engagement flows reuse core modules and are implemented in Phase 11 as optional/advanced features.
