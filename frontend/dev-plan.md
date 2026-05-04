# Frontend Development Plan

## Current implementation state

The frontend is an Expo Router React Native codebase for Android, iOS, and Web. It already includes:

- Expo app configuration for Android, iOS, and Web.
- Cross-platform route structure under `src/app/`.
- Platform-aware reusable components and screens under `src/platform/`.
- Redux Toolkit store, persistence, and slices.
- Offline/network infrastructure.
- Theme, accessibility, i18n, logging, error boundaries, and API client foundations.
- Existing ventilation assessment, recommendation, history/tracking, training/help, settings, and data-source screens.
- Local ventilation dataset support through `src/config/data/ventilation_dataset.json`.

## Completed setup/refactor work

- Moved the frontend into `Collins/frontend/`.
- Preserved Android, iOS, and Web source/configuration files.
- Preserved assets, public logos, app configuration, package files, test setup, patches, and scripts.
- Replaced the old multi-file development plan folder with this single focused `dev-plan.md`.
- Migrated useful `.cursor` guidance into `frontend/app-rules/`.
- Removed `.cursor`, `.git`, caches, coverage output, static build output, debug logs, and old app docs from the final frontend deliverable.
- Added `.env.example` based on the existing environment template.
- Kept the current source structure stable to avoid unnecessary breakage.

## Chronological next implementation steps

1. Rename user-facing assessment language to the app write-up terminology: `Admit`, `Tracking`, `ABG / Vent Update`, `Dataset Capture`, and `Review Queue`.
2. Convert the existing assessment workflow into the 3-step admission wizard:
   - Patient and reason.
   - Oxygen, ABG, and ventilator data.
   - Save and review summary.
3. Add a live ICU summary card showing current ventilation status, missing data, unsafe flags, and review prompts.
4. Add rule-based calculators for reference weight, VT/kg reference weight, P/F ratio, S/F fallback, minute ventilation, and driving pressure.
5. Add pathway-specific prompts for neonatal, pediatric, adult, obstetric, burns, COPD/hypercapnia, ARDS/acute respiratory failure, oedema, sepsis/pneumonia, and peri-operative cases.
6. Connect admissions, ABG updates, ventilator settings, facility membership, and review queue flows to the backend API.
7. Harden offline-first capture and sync queue behavior for real ICU use.
8. Add reviewer workflows and de-identified dataset capture screens only after the core admission and tracking flows are stable.
9. Add model shadow-mode UI only after governance, review, and dataset approval workflows exist.

## Known limitations or risks

- The current UI still contains legacy assessment/recommendation wording in several components and tests.
- Current navigation routes keep stable paths such as `/assessment` and `/history`; route renaming should be staged to avoid breaking links and tests.
- Offline storage exists as a foundation, but production clinical use requires encryption, conflict resolution, and verified sync behavior.
- The local dataset is useful for simulation and development, but clinical guidance must remain rule-based and specialist-reviewed.
- Backend integration is not fully wired into all frontend screens yet.
- Additional clinical review is required before using the app in real patient care.
