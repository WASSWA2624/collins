# AI-Enabled Ventilator Management (Offline-First) — Mobile App

React Native (Expo + App Router) application concept/prototype for **ventilator decision support in Uganda’s critical care settings**, designed to help **non-specialist clinicians** initiate and manage mechanical ventilation when specialist support is limited.

The underlying design framework is documented in `write-up.md`.

## What this app is for
- **Step-by-step guidance**: patient assessment → ventilator initiation → monitoring and ongoing management.
- **Offline-first decision support**: uses an embedded **local ventilation dataset** for on-device guidance.
- **Optional online AI enhancement**: when connectivity is available, complex/edge cases can be augmented by online AI analysis (design goal).

## Dataset
This repo includes `ventilation_dataset.json`, intended as the **primary offline knowledge base** for dataset-based pattern matching / similarity scoring and guidance extraction.

**Expected dataset content (high level):**
- Patient profile + clinical parameters (e.g., SpO₂, PaO₂/PaCO₂, pH, vitals)
- Ventilator mode + initial settings (e.g., ACV/SIMV, tidal volume, RR, FiO₂, PEEP, I:E)
- Outcomes, complications, monitoring points, and recommendations

## Safety notice
**Not for real-world clinical use.** This is a research-oriented concept/prototype intended for simulation, evaluation, and iterative validation with domain experts.

## Requirements
- Node.js >= 20
- Expo CLI (optional; `npx expo` works)

## Getting started
1. Copy `env.template.txt` to `.env` and adjust non-sensitive values as needed.
2. Install dependencies:
   - `npm install`
3. Start the app:
   - `npm run start`

## Common scripts
- `npm run start` – start Expo dev server (clears cache)
- `npm run android` – run on Android
- `npm run ios` – run on iOS
- `npm run web` – run on web
- `npm run test` – run tests
- `npm run test:watch` – run tests in watch mode
- `npm run test:coverage` – run tests with coverage

## Project docs
- `write-up.md` – design + methodology write-up for the ventilator decision-support system
- `dev-plan/` – implementation plan and milestones
- `.cursor/rules/` – project rules and standards

