# Phase 5 — Admin Dashboards and Model Shadow-Mode Governance

## Goal

Prepare safe admin visibility, dataset quality monitoring, and non-clinical model validation.

## Scope

- Platform admin dashboard: facilities, pending verification, active users, dataset review queue, sync failures, reference versions, model versions, audit search.
- Facility admin dashboard: active admissions, ventilated patients, red flags, ABGs pending review, submitted dataset entries, facility users, equipment profile, offline sync failures.
- Specialist reviewer dashboard: review queue, parser notes, excluded records, model disagreement cases in shadow mode.
- Add dataset cards and model cards.
- Add model version registry and shadow-mode activation.
- Store model outputs for admin/research comparison only.
- Add drift/missingness/override monitoring.
- Add model retirement workflow.

## Done when

- Shadow-mode model outputs are hidden from normal clinicians.
- Model activation requires approved dataset/model metadata and admin permission.
- Monitoring can report performance, calibration, drift, missingness, and subgroup behavior.
- Live model decision support remains disabled until governance approval.
