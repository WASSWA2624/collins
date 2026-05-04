# Phase 5 — Shadow-Mode Governance UI

## Goal

Expose model/version governance only to approved admin and research roles after backend support exists.

## Scope

- Add model version list for approved roles.
- Add model card and dataset card views.
- Add shadow-mode monitoring dashboard.
- Show performance, calibration, drift, missingness, override frequency, and subgroup behavior where backend provides it.
- Add model activation/retirement UI only for permitted platform roles.
- Keep predictive outputs hidden from normal clinicians.

## Done when

- Shadow-mode outputs are admin/research-only.
- Model screens clearly show intended use, contraindicated use, dataset version, validation status, activation date, and retirement plan.
- No live clinical prediction UI is enabled without governance approval.
