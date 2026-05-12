# Backend Project Structure Rules

Keep the backend modular, boring, and auditable. Add files only where they belong.

## Required structure

```txt
backend/
  app-rules/
    index.md
    architecture.md
    project-structure.md
    api-conventions.md
    security-validation.md
    prisma-data-model.md
    testing.md
  dev-plan.md
  dev-plan/
    index.md
    phase-01-foundation-security-facility.md
    phase-02-admissions-tracking-calculations.md
    phase-03-review-audit-dataset.md
    phase-04-offline-sync.md
    phase-05-shadow-model-governance.md
  prisma/
    schema.prisma
  src/
    app.js
    server.js
    config/
    constants/
    middleware/
    modules/
      admin/
      admissions/
      airway/
      auth/
      dataset/
      facilities/
      health/
      humidification/
      references/
      review/
      sync/
      ventilation/
    routes/
    services/
      clinical-rules/
      audit/
      deidentification/
    utils/
```

The current codebase may not yet contain every folder above. Create missing folders only when implementing the related feature.

## Module file naming

Inside `src/modules/<domain>/` use:

- `<domain>.routes.js`
- `<domain>.controller.js`
- `<domain>.service.js`
- `<domain>.validators.js`
- `<domain>.constants.js` when needed
- `<domain>.tests.js` or colocated test path if the test runner is configured for it

## Clinical helper naming

Pure clinical helpers should be named by task, not by screen:

- `referenceWeight.service.js`
- `oxygenation.service.js`
- `abgFlags.service.js`
- `ventilationSafety.service.js`
- `humidificationRules.service.js`
- `liberationReadiness.service.js`

Each helper must accept explicit inputs and return structured outputs with `value`, `unit`, `status`, `message`, and `ruleVersion` where applicable.

## API resource naming

Use plural resource names and stable identifiers:

- `/admissions/:admissionId/abg-tests`
- `/admissions/:admissionId/ventilator-settings`
- `/admissions/:admissionId/airway-device`
- `/admissions/:admissionId/humidification`
- `/admissions/:admissionId/daily-review`
- `/dataset-imports/:datasetImportId/review`

## Do not mix concerns

- Do not put clinical formulas inside controllers.
- Do not put HTTP response formatting inside services.
- Do not put Prisma writes inside validation files.
- Do not put frontend wording-only decisions inside backend persistence models unless they affect auditability or safety.
- Do not create AI/model code in clinical write paths until approved shadow-mode infrastructure exists.
