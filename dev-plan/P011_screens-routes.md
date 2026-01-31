# Phase 11: Screens, Routes, and UI Wiring (Ventilation App)

## Purpose
Implementation guide: **one step = one screen**. Screens are wired to Phase 10 hooks and must implement a complete clinician workflow with responsive, space-efficient UI.

## Rule references
- `.cursor/rules/index.mdc`
- `.cursor/rules/app-router.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/theme-design.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`

## Prerequisites
- Phase 10 complete (ventilation + training features and hooks)
- Phase 9 complete (app-specific shell UX wired)
- Phase 6 complete (UI primitives/patterns exist)

## Global screen guidelines (mandatory)
- Screens render only; domain logic lives in features and is accessed via hooks.
- All user-facing text (including accessibility text) must use i18n.
- Every screen supports: **loading**, **empty**, **error**, **offline** states.
- UI must economize space via progressive disclosure and compact summaries (see Phase 9 contract).
- Use list virtualization for any potentially long list.

## Route structure (required by `app-router.mdc`)

```text
src/app/
├── _layout.jsx
├── index.jsx
├── _error.jsx
├── +not-found.jsx
│
├── (main)/
│   ├── _layout.jsx
│   ├── assessment.jsx
│   ├── history.jsx
│   └── session/
│       ├── _layout.jsx
│       ├── recommendation.jsx
│       ├── monitoring.jsx
│       └── case/
│           └── [case-id].jsx
│
├── (training)/
│   ├── _layout.jsx
│   ├── index.jsx
│   ├── topics.jsx
│   └── topic/
│       └── [topic-id].jsx
│
└── (settings)/
    ├── _layout.jsx
    ├── index.jsx
    ├── about.jsx
    ├── disclaimer.jsx
    ├── data-sources.jsx
    └── privacy.jsx
```

## Sequential build order (one step = one screen)

### Tier 1: Core workflow (main)
- **11.S.1** Assessment (wizard) — `(main)/assessment`
- **11.S.2** Session guard layout (route layout) — `(main)/session/_layout`
- **11.S.3** Recommendation — `(main)/session/recommendation`
- **11.S.4** Monitoring — `(main)/session/monitoring`
- **11.S.5** History (saved sessions) — `(main)/history`
- **11.S.6** Case detail — `(main)/session/case/[case-id]`

### Tier 2: Training
- **11.S.7** Training home — `(training)/index`
- **11.S.8** Topic list — `(training)/topics`
- **11.S.9** Topic detail — `(training)/topic/[topic-id]`

### Tier 3: Settings and safety/legal
- **11.S.10** Settings — `(settings)/index`
- **11.S.11** Disclaimer — `(settings)/disclaimer`
- **11.S.12** Data sources — `(settings)/data-sources`
- **11.S.13** Privacy — `(settings)/privacy`
- **11.S.14** About — `(settings)/about`

## Screen UX requirements (per major screen)

### Assessment screen (11.S.1)
- Must be a guided, step-by-step flow (progress indicator).
- Must support partial entry and “missing tests” prompts (from Phase 10 logic).
- Must provide compact summary at all times (sticky on larger screens).

### Recommendation screen (11.S.3)
- Must show:
  - recommended initial settings (clearly labeled)
  - confidence tier + matched case references (case IDs)
  - monitoring points + risk factors
  - prominent dataset warning (“not clinically validated”)
- Must be readable in compact mode and two-pane mode.

### Monitoring screen (11.S.4)
- Must support manual time-series entry and show trend/alert states.
- Alerts must be explainable and actionable (prototype-grade).

## Per-step checklist
Per screen:
- Route per `app-router.mdc`
- Screen folder/file structure per `component-structure.mdc`
- Style files per platform and theme tokens only
- Uses only hooks for state/data
- i18n for all strings + a11y labels/hints
- Loading/error/empty/offline states
- Tests per `testing.mdc` (100% coverage, including branches and states)

---

## Shared clinician UX patterns (mandatory for all Phase 11 screens)
- **Dense but readable**: prioritize 1–2 primary actions; use compact rows, section headers, and collapsible details.
- **Units everywhere**: all numeric labels/validation messages must display units sourced from the dataset `schema.units` (via Phase 10 model/hook).
- **Fast entry**:
  - numeric fields support “quick keypad” patterns on mobile
  - sane defaults (explicitly labeled as defaults)
  - inline validation (no surprise full-screen errors)
- **Progressive disclosure**:
  - “Summary” (always visible) vs “Details” (expand)
  - on tablet/web, use the Phase 9 split-pane with a sticky summary panel.
- **Explainability**: where a recommendation/alert appears, show a compact “Why” row (confidence tier + key contributors + missing inputs).
- **A11y** (see `accessibility.mdc`): every interactive element has label + hint; web supports full keyboard navigation.

---

## Step specs (one step = one screen/route surface)
Each step below must include:
- a route file in `src/app/**` (default export; minimal route wrapper per `app-router.mdc`)
- a platform screen in `src/platform/screens/**` (android/ios/web + platform styles + hook + types + barrel per `component-structure.mdc`)
- complete states + tests per `testing.mdc` (including platform-specific tests)

### 11.S.1 Assessment wizard — route `(main)/assessment`
**Goal**: capture clinician inputs quickly and safely; create/replace the current session; trigger matching/recommendation generation via hooks.

- **Route file**: `src/app/(main)/assessment.jsx`
  - Must remain a thin wrapper that renders the platform screen.
- **Platform screen** (upgrade the Phase 8 placeholder or replace it, but keep the route path stable):
  - `src/platform/screens/ventilation/AssessmentEntryScreen/*` (extend into wizard) **or**
  - `src/platform/screens/ventilation/AssessmentScreen/*` (new screen, update route wrapper accordingly).
- **UI structure**:
  - **Mobile**: single-column wizard with a compact step header + “Summary” accordion.
  - **Tablet/Web**: split-pane; left pane wizard steps, right pane sticky session summary.
- **Minimum steps** (wizard):
  - Patient profile (condition, age, weight, height, gender, comorbidities)
  - Clinical parameters (SpO₂, optional ABG values, vitals)
  - Optional observations (freeform structured entries)
  - Review + “Generate recommendation”
- **Validation**:
  - required minimum inputs enforced by Phase 10 rules; UI shows which missing values unlock better confidence.
  - numeric constraints/units shown using dataset `schema.units` (do not hardcode).
- **Offline behavior**:
  - fully usable offline (dataset matching is offline)
  - online “second opinion” is not shown here (Phase 12).
- **Tests**:
  - `src/__tests__/app/(main)/assessment.test.js` (route wrapper)
  - `src/__tests__/platform/screens/ventilation/<AssessmentScreenName>.test.js` (android/ios/web coverage, wizard navigation, validation, states)

### 11.S.2 Session guard layout — route layout `(main)/session/_layout`
**Goal**: ensure Recommendation/Monitoring/Case detail are unreachable without a current session.

- **Route file**: `src/app/(main)/session/_layout.jsx`
- **Behavior**:
  - calls `useSessionGuard` (Phase 7) and redirects to `/assessment` when missing session
  - renders `<Slot />` when session exists
- **Tests**:
  - `src/__tests__/app/main-session-layout-guard.test.js` (already required by Phase 7; update if route structure changed)

### 11.S.3 Recommendation — route `(main)/session/recommendation`
**Goal**: present recommended initial settings with clear labeling, confidence, and safety framing.

- **Route file**: `src/app/(main)/session/recommendation.jsx`
- **Platform screen**: `src/platform/screens/ventilation/RecommendationScreen/*`
- **UI sections (dense)**:
  - “Recommended settings” (mode, TV, RR, FiO₂, PEEP, I:E) with units and safe presentation
  - “Confidence & why” (tier + missing inputs + top contributing factors)
  - “Monitoring points” (next checks, when to reassess)
  - “Risks/complications” (prototype-grade flags; actionable guidance)
  - “Matched cases” (top-N list with `caseId` links)
  - “Intended use warning” (content sourced from dataset `intendedUse.warning`, but rendered via i18n key + interpolation; always visible)
- **Responsive**:
  - mobile: collapsible sections; primary action = “Start monitoring”
  - tablet/web: split-pane with sticky session summary
- **Tests**:
  - route wrapper test
  - screen tests for rendering all sections, states, link navigation, and a11y labeling

### 11.S.4 Monitoring — route `(main)/session/monitoring`
**Goal**: allow manual time-series entry and show trend/alert states that are explainable.

- **Route file**: `src/app/(main)/session/monitoring.jsx`
- **Platform screen**: `src/platform/screens/ventilation/MonitoringScreen/*`
- **UI sections**:
  - “Quick entry” row (add vitals/labs point)
  - trend view (compact sparkline-like or list-based summary; platform-appropriate)
  - alerts list with severity + “why” explanation + suggested next action
- **Performance**: list virtualization for history of points and alerts (per `platform-ui.mdc` + `performance.mdc`)
- **Tests**:
  - include sparse/out-of-order points, alert severity branches, offline banner presence, keyboard navigation (web)

### 11.S.5 History (saved sessions) — route `(main)/history`
**Goal**: list saved sessions; allow resume, delete, and view summary quickly.

- **Route file**: `src/app/(main)/history.jsx`
- **Platform screen**: `src/platform/screens/ventilation/HistoryScreen/*`
- **UI**:
  - virtualized list of sessions (date/time, condition, key summary, last recommendation tier)
  - actions: resume (primary), delete (destructive confirm), view details
- **Tests**:
  - empty state (no history), corrupted persistence recovery messaging, delete confirmation path

### 11.S.6 Case detail — route `(main)/session/case/[case-id]`
**Goal**: explain “matched cases” in a clinician-friendly way without leaking raw/unvalidated data.

- **Route file**: `src/app/(main)/session/case/[case-id].jsx`
- **Platform screen**: `src/platform/screens/ventilation/CaseDetailScreen/*`
- **UI**:
  - compact case summary (patientProfile + key clinicalParameters)
  - ventilatorSettings used
  - outcomes (with clear “dataset case” framing)
  - always show intended-use warning
- **Tests**:
  - param parsing, missing caseId path, not-found-in-dataset path

### 11.S.7 Training home — route `(training)/index`
**Goal**: clinician-focused entry to offline training/quick reference.

- **Route file**: `src/app/(training)/index.jsx`
- **Platform screen**: `src/platform/screens/training/TrainingHomeScreen/*`
- **UI**: search box + “popular topics” + quick checklists

### 11.S.8 Topic list — route `(training)/topics`
**Goal**: browse all topics with filters.

- **Route file**: `src/app/(training)/topics.jsx`
- **Platform screen**: `src/platform/screens/training/TopicListScreen/*`
- **UI**: virtualized list + search/filter; keyboard accessible on web

### 11.S.9 Topic detail — route `(training)/topic/[topic-id]`
**Goal**: show structured training content, readable on small screens.

- **Route file**: `src/app/(training)/topic/[topic-id].jsx`
- **Platform screen**: `src/platform/screens/training/TopicDetailScreen/*`
- **UI**: sectioned content + collapsible sub-sections; optional “pin to summary” patterns

### 11.S.10 Settings — route `(settings)/index`
**Goal**: preferences and app controls.

- **Route file**: `src/app/(settings)/index.jsx`
- **Platform screen**: `src/platform/screens/settings/SettingsScreen/*`
- **Must include**:
  - density mode toggle (Phase 9)
  - theme selection (if supported)
  - language selection (supported locales only; see `i18n.mdc`)

### 11.S.11 Disclaimer — route `(settings)/disclaimer`
**Goal**: show the dataset/app disclaimer and allow acknowledgement (guarded entry for workflow).

- **Route file**: `src/app/(settings)/disclaimer.jsx`
- **Platform screen**: `src/platform/screens/settings/DisclaimerScreen/*`
- **Data**:
  - disclaimer content sourced from dataset `intendedUse` + plan-provided prototype framing (no “clinical use” claims); render user-facing text via i18n keys with interpolation where dataset text is shown
  - acknowledgement persists via store/service boundary (Phase 7 guard)

### 11.S.12 Data sources — route `(settings)/data-sources`
**Goal**: transparency: dataset version + citations.

- **Route file**: `src/app/(settings)/data-sources.jsx`
- **Platform screen**: `src/platform/screens/settings/DataSourcesScreen/*`
- **Data**:
  - show `datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`
  - list `sources[]` citations (with DOI text where present)

### 11.S.13 Privacy — route `(settings)/privacy`
**Goal**: explain what is stored locally and what is never sent.

- **Route file**: `src/app/(settings)/privacy.jsx`
- **Platform screen**: `src/platform/screens/settings/PrivacyScreen/*`
- **Content**:
  - local-only session storage description (non-sensitive)
  - optional online AI behavior (only if Phase 12 implemented)

### 11.S.14 About — route `(settings)/about`
**Goal**: app identity + version + prototype scope.

- **Route file**: `src/app/(settings)/about.jsx`
- **Platform screen**: `src/platform/screens/settings/AboutScreen/*`

## Testing baseline for Phase 11 completion
- Every screen above must have:
  - route wrapper test (when applicable)
  - platform screen test covering android/ios/web separately
  - explicit tests for loading/empty/error/offline
  - explicit web keyboard navigation + focus order assertions for primary interactions
