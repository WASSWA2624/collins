## Ventilation Decision Support App Development Plan

## Purpose
This development plan provides a **complete, step-by-step, chronological guide** for building the React Native (Expo + App Router) ventilation decision-support application described in:
- `write-up.md`
- `src/features/ventilation/data/ventilation_dataset.json`

The resulting app must be:
- **Offline-first** (local dataset is primary)
- **Easy to use for non-specialist clinicians**
- **Responsive across Android, iOS, and Web**
- **Space-efficient** (dense but readable UI, progressive disclosure, minimal clutter)
- **Safe-by-design for a prototype** (clear disclaimers, no unsafe “clinical use” framing, no secrets)

## Principles (Plan-specific)
- **Modularity**: Each step is atomic, independent, and testable.
- **Reproducibility**: A developer following this plan produces the same app.
- **Rule compliance**: This plan references `.cursor/rules/` as the source of truth; it does not redefine rules.
- **UX + A11y are requirements**: every screen includes loading/empty/error/offline states and accessibility metadata.

## Scope (What we are building)
- **Assessment workflow**: clinician inputs condition + clinical parameters + optional observations.
- **Local decision support**: match inputs to similar dataset cases; generate recommended initial ventilator settings and monitoring points.
- **Monitoring**: track key parameters over time and surface risk/complication warnings (prototype-grade).
- **Training**: quick-reference and guided learning for non-specialists.
- **Optional online augmentation (advanced)**: online AI “second opinion” when connectivity exists (never required for core flow).

## Dataset contract (must be supported)
Primary dataset file:
- `src/features/ventilation/data/ventilation_dataset.json`

Minimum supported dataset root fields:
- `datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`
- `schema.units` (for UI unit labels and validation messaging)
- `intendedUse` (must be surfaced in UI; includes a warning string)
- `sources[]` (must be surfaced in UI as citations)
- `cases[]` (the clinical cases array)

Minimum supported case fields (from `cases[]`):
- `caseId`
- `patientProfile` (age/weight/height/gender/condition/comorbidities)
- `clinicalParameters` (SpO₂/PaO₂/PaCO₂/pH/RR/HR/BP)
- `ventilatorSettings` (mode/TV/RR/FiO₂/PEEP/I:E)
- `outcomes` (complications/weaningSuccess/lengthOfVentilation/mortality)
- `recommendations` (initialSettings/monitoringPoints/riskFactors)
- Optional extensibility: `observations[]`, `timeSeries[]`

## App Router route groups (documented here; required by `app-router.mdc`)
All non-root pages live inside groups:
- `(main)`: core clinical workflow (assessment → recommendation → monitoring)
- `(training)`: training/education content
- `(settings)`: preferences + app info + disclaimers

Root-only pages allowed outside groups:
- `src/app/index.jsx` (landing)
- `src/app/_layout.jsx`, `src/app/_error.jsx`, `src/app/+not-found.jsx`

## Development Order
Phases 0–8 are generic building blocks. Ventilation-specific work begins in Phase 9.

1. **Foundation** → config, utils, logging, errors, i18n (generic)
2. **Infrastructure** → services, security primitives (generic)
3. **State & Theme** → Redux + theme system (generic)
4. **Offline** → offline layer + bootstrap wiring (generic)
5. **Reusable Hooks** → cross-cutting hooks (generic)
6. **Reusable Platform UI Foundation** → primitives/patterns/layout helpers (generic)
7. **App Shell (App Router + Guards)** → route groups, providers, error routes (generic)
8. **Minimal Runnable App** → verifies app boots (generic)
9. **Ventilation App Shell UX** → navigation + dense responsive layouts for clinician workflow (**app-specific**)
10. **Ventilation Core Feature** → local dataset access + matching + recommendation generation (**app-specific**)
11. **Screens & Routes** → assessment wizard, recommendation view, monitoring, training, settings (**app-specific**)
12. **Advanced Features** → optional online AI augmentation, exports, dataset updates (**app-specific**)
13. **Finalization** → onboarding/help, audits, performance, localization completion (**app-specific**)

## File Structure
- `P000_setup.md` - Project initialization
- `P001_foundation.md` - Foundation layer
- `P002_infrastructure.md` - Infrastructure layer
- `P003_state-theme.md` - State management & theming
- `P004_offline.md` - Offline-first architecture + bootstrap
- `P005_reusable-hooks.md` - Reusable hooks
- `P006_platform-ui-foundation.md` - Platform UI foundation
- `P007_app-shell.md` - App shell (route groups/providers)
- `P008_minimal-app.md` - Minimal runnable app
- `P009_app-layouts.md` - Ventilation app shell UX (navigation + responsive density)
- `P010_core-features.md` - Ventilation core feature (dataset + matching + recommendations)
- `P011_screens-routes.md` - Screens/routes wiring (core workflow + training + settings)
- `P012_advanced-features.md` - Advanced/optional features
- `P013_finalization.md` - Finalization

## How to use this plan
- Follow phases sequentially; complete all steps before moving on.
- After every implementation step: add tests immediately (100% coverage per `testing.mdc`).
- Use correct extensions: `.jsx` only for files that render JSX; everything else `.js`.
- All UI strings must be i18n’d (see `i18n.mdc`).
- All routes must be inside route groups (see `app-router.mdc`).
- All platform UI must follow file-level platform separation (see `component-structure.mdc` + `platform-ui.mdc`).

## Supported locales (required by `i18n.mdc`)
- **Currently supported (effective)**: `en` (because `src/i18n/locales/en.json` is the only locale file present).
- **Future targets (optional; add only when locale files exist)**: `sw` (Swahili), `lg` (Luganda).

## Rule references (single sources of truth)
This plan must be executed in compliance with `.cursor/rules/` including (non-exhaustive):
- `core-principles.mdc`
- `project-structure.mdc`
- `coding-conventions.mdc`
- `tech-stack.mdc`
- `bootstrap-config.mdc`
- `app-router.mdc`
- `component-structure.mdc`
- `platform-ui.mdc`
- `theme-design.mdc`
- `features-domain.mdc`
- `services-integration.mdc`
- `state-management.mdc`
- `offline-sync.mdc`
- `security.mdc`
- `errors-logging.mdc`
- `accessibility.mdc`
- `performance.mdc`
- `testing.mdc`
- `i18n.mdc`

---

**Start with**: `P000_setup.md`

