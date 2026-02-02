# Phase 13: Finalization (Safety, Onboarding, Help, Readiness)

## Purpose
Finalize the ventilation decision-support prototype after core and optional features are complete. Each step is **atomic** and focuses on usability, safety framing, and release readiness.

## Rule references
- `.cursor/rules/index.mdc`
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/offline-sync.mdc`

## Prerequisites
- Phase 11 completed (core workflow screens working)
- Phase 12 completed (only if advanced features were added)

## Steps (fully atomic)

### Safety framing and prototype guardrails
- **13.1.1** Ensure the dataset “not clinically validated” warning is:
  - visible in the core workflow
  - included in exports (if exports exist)
  - accessible (screen readers) and i18n’d
- **13.1.2** Add “decision support only” language to relevant surfaces (Recommendation, Monitoring).
- **13.1.3** Add a required acknowledgement flow (first-run) that the tool is a prototype and not for sole clinical decision-making.
- **13.1.4** Ensure safety framing includes:
  - dataset `intendedUse.validationRequirement`
  - per-case safety metadata where displayed (case `review.status`, `evidence.notes`)
  - citations where applicable (`evidence.sourceIds[]` mapped to dataset `sources[]`)

### Onboarding (clinician-focused)
- **13.2.1** Create onboarding feature skeleton (rules/model/usecase/index)
- **13.2.2** Implement onboarding content:
  - how to enter inputs
  - how to interpret recommendations (confidence + case matching)
  - how to use monitoring and alerts
  - offline behavior expectations
- **13.2.3** Create `useOnboarding` hook and screens; test all paths and a11y.

### Help + quick reference
- **13.3.1** Create help feature skeleton
- **13.3.2** Implement:
  - searchable glossary (terms like PEEP, FiO₂, I:E ratio)
  - troubleshooting (missing ABG, offline state)
  - “what to do next” guides per condition category (prototype-grade)
- **13.3.3** Tests for help search, rendering, empty/error states.

### Localization completion (all non-`en` locales defined and implemented here)
All locales other than `en` are **defined and implemented in this phase only**. Phases 0–12 use only `en.json` (see `dev-plan/index.md` and `P001_foundation.md`).

- **13.4.1** Finalize keys in `en.json`
- **13.4.2** **Define** the supported-locale set (e.g. `sw`, `lg`, or project-specific list) and **implement** all non-`en` locale files in `src/i18n/locales/` (e.g. `sw.json`, `lg.json`). Each locale file must contain all keys present in `en.json`. Validate no missing keys across locales. ’
- **13.4.3** Verify RTL + font scaling + reduced motion support on representative screens

### Security + privacy + offline audits (prototype-appropriate)
- **13.5.1** Verify no secrets shipped in config/env; verify logs contain no sensitive data.
- **13.5.2** Verify session persistence stores only what is necessary; add optional local “app lock” if implemented.
- **13.5.3** Offline audit:
  - core workflow usable offline
  - failure-safe behavior for storage corruption
  - network transitions do not crash UI
 - **13.5.4** Online AI audit (only if Phase 12 implemented):
  - payload contains no identifiers and is minimally sufficient
  - offline-first behavior remains intact when online calls fail or are unavailable

### Performance and release readiness
- **13.6.1** Profile dataset parsing + matching time; ensure it does not block UI thread.
- **13.6.2** Validate list virtualization on history and training screens.
- **13.6.3** Final regression suite; verify 100% coverage remains intact.
- **13.6.4** Documentation update: `README.md` and any in-app “About” to reflect prototype scope.
- **13.6.5** Dataset path consistency audit:
  - ensure no code/docs reference the old dataset location under `src/features/ventilation/data/`
  - `src/config/data/ventilation_dataset.json` is the only dataset source referenced by the app

### Prototype evaluation readiness (simulation + expert validation)
- **13.7.1** Add a simulated evaluation checklist aligned to the write-up objectives:
  - curated test scenarios per condition bucket
  - expected outputs: recommended settings, monitoring points, risks, “missing test” prompts
- **13.7.2** Add an expert review checklist (non-production prototype):
  - verify outputs are clinically plausible, clearly framed as decision support only, and do not over-claim validation
  - record only non-identifying feedback

**Exit criteria**: all tests pass (100% coverage), accessibility checks pass for core workflow, offline-first behavior verified, safety disclaimers present and tested, and performance budgets are respected.

