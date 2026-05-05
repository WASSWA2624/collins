## Task: Fix startup/runtime errors and align compatible dependencies

You are working in a local monorepo with:

* `backend`: Node.js 20+, Express 5, ESM JavaScript, Prisma, MySQL, Zod, JWT/session auth
* `frontend`: Expo 54, Expo Router 6, React Native, React 19, Redux Toolkit, redux-persist, styled-components, Zod, offline/network foundations

Fix the current backend and frontend startup/runtime errors, make the Android Expo app start correctly, and update dependencies only to versions that are compatible with the current stack.

### Reported errors to fix

Backend:

```txt
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
at backend/src/config/prisma.js
Node.js v24.11.1
```

Frontend:

```txt
Metro error: Unable to resolve module ../debug/web-console-logger from frontend/src/app/_layout.jsx

import '@debug/web-console-logger';
```

Expo compatibility warnings:

```txt
expo@54.0.33 - expected version: ~54.0.34
expo-linking@8.0.11 - expected version: ~8.0.12
```

Also investigate and fix why the Expo app does not start on Android.

---

### Required process before editing

Before making changes, inspect and follow:

* `app-write-up.md`
* `backend/app-rules/*`
* `backend/dev-plan.md`
* `backend/dev-plan/*`
* `frontend/app-rules/*`
* `frontend/dev-plan.md`
* `frontend/dev-plan/*`
* relevant backend and frontend source files, tests, routes, services, screens, state, APIs, configs, aliases, and shared utilities

Follow these documents over this task when there is a conflict.

---

### Backend requirements

Preserve existing backend architecture:

* `/api/v1` versioned routes
* route → validator → controller → service layering
* Prisma access inside services/repository helpers
* Zod validation for `body`, `params`, and `query`
* standard success/error response shape
* facility membership and facility-level isolation
* audit logging
* append-only ABG and ventilator records
* offline idempotency and conflict handling
* pure clinical calculation helpers with tests

Fix the Prisma startup failure by inspecting Prisma schema/client generation, package scripts, import paths, generated client output, `.env` handling, and Node version compatibility. Ensure backend startup works reliably with the project’s supported Node.js version.

---

### Frontend requirements

Preserve existing frontend architecture:

* Expo Router routes under `src/app`
* reusable platform code under `src/platform/*`
* Redux Toolkit state ownership
* API client conventions
* offline draft/sync queue behavior
* theme, accessibility, i18n, logging, and error boundaries
* styled-components UI conventions
* role-aware navigation and screen visibility

Fix the unresolved `@debug/web-console-logger` / `../debug/web-console-logger` import issue by inspecting alias configuration, file existence, platform-specific files, and intended logging behavior. Do not remove logging blindly; restore or replace it consistently with existing project conventions.

Make the app start on:

* Expo web
* Android through Expo Go or the project’s intended development workflow

Update Expo-related dependencies using compatible Expo SDK 54 versions, preferably through Expo-compatible tooling. Avoid unsafe major upgrades unless required and justified.

---

### Dependency requirements

Update dependencies only where needed for compatibility and stability.

Do not blindly upgrade everything to latest if it breaks Expo SDK 54, React Native, Prisma, Express, or project rules.

Preserve lockfiles and package manager conventions.

Verify:

* backend install/build/dev flow
* Prisma generate flow
* frontend install/start flow
* Expo dependency compatibility
* Android startup behavior

---

### Clinical safety requirements

This app is clinical decision support only. Do not add autonomous clinical orders.

Allowed wording:

* “check”
* “review”
* “consider senior review”
* “confirm clinically”
* “clinician confirms final settings”

Forbidden outputs:

* “Diagnosed ARDS”
* exact ventilator-setting orders
* “intubate now”
* “extubate now”
* medication, fluid, vasopressor, paralysis, ECMO, rationing, or transfer-denial orders

Require:

* missing data and uncertainty to be explicit
* clinician override with reason where relevant
* auditability for edits, reviews, exports, overrides, and model outputs
* population-specific calculations and wording
* no adult PBW formulas for neonatal, pediatric, adolescent, or unknown pathways
* no unreviewed records, raw notes, or demo data in approved training datasets
* no patient identifiers sent to external AI/model services

---

### Product workflow alignment

Where relevant, preserve alignment with:

* Home
* Admit
* Tracking
* ABG / Vent Update
* Dataset Capture
* Review Queue
* Dashboard
* Training / Help
* Settings

If admission behavior is touched, preserve the required 3-step flow:

1. Patient & reason
2. Oxygen, ABG & ventilator
3. Save & review

Support all patient pathways where relevant:

* neonate
* infant
* child
* adolescent
* adult
* obstetric/post-partum
* burns
* trauma
* peri-operative
* medical
* surgical
* other/unknown

Allow `unknown`, `not_available`, or `null` for clinically missing fields where project rules allow saving.

---

### Data, sync, and governance boundaries

Preserve separation between:

1. reference/evidence rules
2. facility clinical records
3. reviewed, de-identified, ethics-approved training datasets

For offline/sync behavior, preserve:

* idempotency keys
* client timestamps
* no silent overwrites
* conflict status display
* retryable sync states
* reviewed data preservation

For AI/model behavior:

* rule-based MVP behavior first
* predictive models hidden from normal clinicians
* shadow-mode only until governance approval
* model cards, dataset cards, drift monitoring, and override monitoring only for approved roles

---

### Tests

Add or update focused tests where behavior changes, especially for:

* startup/config behavior
* Prisma client initialization
* route contracts and response shapes
* Zod validation
* auth, RBAC, and facility isolation
* append-only ABG/ventilator updates
* clinical calculators and flags
* forbidden clinical wording
* offline drafts, sync queue, retry, and conflicts
* role-aware frontend visibility
* accessibility for critical forms and alerts

---

### Scope limits

Implement only the requested fixes.

Avoid unrelated refactors.

Avoid changing public contracts unless necessary.

Create missing folders/files only when required.

Preserve existing names, paths, tests, and behavior unless the fix requires change.

Document unavoidable assumptions in the final implementation summary.

---

### Final response required from coding agent

Return:

* brief implementation summary
* complete changed files only
* each file labeled as `Modified file`, `New file`, or `Deleted file`
* exact repository-relative paths
* tests added/updated
* commands to run
* safe deletion script if any files are deleted