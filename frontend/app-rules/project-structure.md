# Frontend Project Structure Rules

Keep route files thin and move reusable logic into features, services, hooks, and platform components.

## Required structure

```txt
frontend/
  app-rules/
    index.md
    architecture.md
    project-structure.md
    clinical-safety.md
    navigation-workflows.md
    state-offline-sync.md
    api-integration.md
    ui-ux.md
    testing.md
  dev-plan.md
  dev-plan/
    index.md
    phase-01-navigation-and-admission.md
    phase-02-calculators-flags-summary.md
    phase-03-api-offline-sync.md
    phase-04-review-dataset-admin.md
    phase-05-shadow-mode-governance.md
  src/
    app/
    features/
      auth/
      facility/
      admission/
      ventilation/
      tracking/
      review/
      dataset/
      references/
      admin/
      training/
    platform/
      components/
      layouts/
      patterns/
      screens/
    services/
      api/
      storage/
      analytics/
    offline/
    store/
    hooks/
    config/
    theme/
```

The current codebase may not contain every feature folder yet. Create missing folders only when implementing that feature.

## Route naming and migration

User-facing labels must match the write-up:

| Old wording | Required user-facing wording |
| --- | --- |
| Assessment | Admit |
| History | Tracking |
| Recommendation | ABG / Vent Update or clinical summary, depending context |

Route paths can be migrated gradually to avoid breaking tests. During migration, keep redirects or compatibility aliases until all links/tests are updated.

## File naming

- Screens: `AdmitScreen.jsx`, `TrackingScreen.jsx`, `AbgVentUpdateScreen.jsx`.
- Components: `LiveSummaryCard.jsx`, `PatientPathwayChips.jsx`, `RiskFlagBadge.jsx`.
- Feature rules/helpers: `admission.rules.js`, `oxygenation.rules.js`, `ventilation.rules.js`.
- API wrappers: `admission.api.js`, `facility.api.js`, `review.api.js`.
- Use-case files: `admission.usecase.js`, `datasetCapture.usecase.js`.
- Tests should mirror the source path where practical.

## Do not mix concerns

- Do not put API calls directly inside route files when a feature API wrapper exists.
- Do not put clinical formulas inside JSX components.
- Do not store large raw clinical notes in Redux unless policy allows and the workflow requires it.
- Do not show admin/reviewer-only details in normal clinician screens.
- Do not hide missing data inside generic errors.
