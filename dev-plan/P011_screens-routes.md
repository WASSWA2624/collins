# Phase 11: Screens, Routes, and UI Wiring (Ventilation App)

## Purpose
Implementation guide: **one step = one screen** (or layout). Screens are wired to Phase 10 hooks and must implement a complete clinician workflow with responsive, space-efficient UI.

**How to use this plan**
1. Follow the **Sequential build order** (11.S.1 → 11.S.14).
2. For each step, check the **Quick reference** for route and deliverable.
3. Apply the **Per-step checklist** to every screen.
4. Read the **Step spec** for detailed requirements (goal, UI, tests).

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
│   ├── index.jsx
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

Notes:
- Phase 13 may introduce additional route groups (e.g., `(onboarding)/`, `(help)/`). Keep Phase 11 focused on the core clinician workflow + training + settings.

## Sequential build order (one step = one deliverable)

**Quick reference**
- **11.S.1** `(main)/assessment` → Assessment wizard screen
- **11.S.2** `(main)/session/_layout` → Session guard layout (layout only)
- **11.S.3** `(main)/session/recommendation` → Recommendation screen
- **11.S.4** `(main)/session/monitoring` → Monitoring screen
- **11.S.5** `(main)/history` → History screen
- **11.S.6** `(main)/session/case/[case-id]` → Case detail screen
- **11.S.7** `(training)/index` → Training home screen
- **11.S.8** `(training)/topics` → Topic list screen
- **11.S.9** `(training)/topic/[topic-id]` → Topic detail screen
- **11.S.10** `(settings)/index` → Settings screen
- **11.S.11** `(settings)/disclaimer` → Disclaimer screen
- **11.S.12** `(settings)/data-sources` → Data sources screen
- **11.S.13** `(settings)/privacy` → Privacy screen
- **11.S.14** `(settings)/about` → About screen

### Tier 1: Core workflow (main)
1. **11.S.1** Assessment wizard — route + `AssessmentScreen`
2. **11.S.2** Session guard — `session/_layout` (uses `useSessionGuard`, renders `<Slot />`)
3. **11.S.3** Recommendation — route + `RecommendationScreen`
4. **11.S.4** Monitoring — route + `MonitoringScreen`
5. **11.S.5** History — route + `HistoryScreen`
6. **11.S.6** Case detail — route + `CaseDetailScreen`

### Tier 2: Training
7. **11.S.7** Training home — route + `TrainingHomeScreen`
8. **11.S.8** Topic list — route + `TopicListScreen`
9. **11.S.9** Topic detail — route + `TopicDetailScreen`

### Tier 3: Settings
10. **11.S.10** Settings — route + `SettingsScreen`
11. **11.S.11** Disclaimer — route + `DisclaimerScreen`
12. **11.S.12** Data sources — route + `DataSourcesScreen`
13. **11.S.13** Privacy — route + `PrivacyScreen`
14. **11.S.14** About — route + `AboutScreen`

## Screen UX requirements (per major screen)

### Assessment screen (11.S.1)
- Must be a guided, step-by-step flow (progress indicator).
- Must support partial entry and “missing tests” prompts (from Phase 10 logic).
- Must provide compact summary at all times (sticky on larger screens).
- Must collect optional structured `observations` and `timeSeries` entries in a shape compatible with dataset `schema.observationModel` (even if core matching does not yet use them).

### Recommendation screen (11.S.3)
- Must show:
  - recommended initial settings (clearly labeled)
  - confidence tier + matched case references (case IDs)
  - monitoring points + risk factors
  - prominent dataset warning (“not clinically validated”) sourced from dataset `intendedUse`
  - per-match safety metadata (case `review.status`, and `evidence.notes` when present)
  - citations for the recommendation (map `case.evidence.sourceIds[]` → dataset `sources[]`)
- Must be readable in compact mode and two-pane mode.

### Monitoring screen (11.S.4)
- Must support manual time-series entry and show trend/alert states.
- Alerts must be explainable and actionable (prototype-grade).

## Per-step checklist (apply to every screen)

- **Route** — Per `app-router.mdc`; default export; thin wrapper
- **Platform screen** — Per `component-structure.mdc`; `.android/.ios/.web.jsx` + platform `.styles.jsx`
- **Logic** — Use hooks only; no domain logic in UI
- **Styling** — Theme tokens only; no hardcoded colors/spacing
- **i18n** — All strings + a11y labels/hints
- **States** — Loading, empty, error, offline
- **Tests** — Per `testing.mdc`; route wrapper + platform screen; 100% coverage

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

## Step specs (one step = one screen or layout)

**Every step must produce:**
1. Route file in `src/app/**` (default export; thin wrapper)
2. Platform screen in `src/platform/screens/**` (or layout logic for 11.S.2)
3. Tests per `testing.mdc`

---

### 11.S.1 Assessment wizard

- **Route** `(main)/assessment` · **Deliverables** `assessment.jsx` + `AssessmentScreen` (ventilation)

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
  - Optional observations (structured entries compatible with dataset `schema.observationModel.observationShape`)
  - Optional time-series starter points (compatible with dataset `schema.observationModel.timeSeriesShape`) for “start monitoring now”
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

### 11.S.2 Session guard layout

- **Route** `(main)/session/_layout` · **Deliverables** `session/_layout.jsx` (no platform screen; layout + guard only)

**Goal**: ensure Recommendation/Monitoring/Case detail are unreachable without a current session.

- **Route file**: `src/app/(main)/session/_layout.jsx`
- **Behavior**:
  - calls `useSessionGuard` (Phase 7) and redirects to `/assessment` when missing session
  - renders `<Slot />` when session exists
- **Tests**:
  - `src/__tests__/app/main-session-layout-guard.test.js` (already required by Phase 7; update if route structure changed)

### 11.S.3 Recommendation

- **Route** `(main)/session/recommendation` · **Deliverables** `recommendation.jsx` + `RecommendationScreen` (ventilation)

**Goal**: present recommended initial settings with clear labeling, confidence, and safety framing.

- **Route file**: `src/app/(main)/session/recommendation.jsx`
- **Platform screen**: `src/platform/screens/ventilation/RecommendationScreen/*`
- **UI sections (dense)**:
  - “Recommended settings” (mode, TV, RR, FiO₂, PEEP, I:E) with units and safe presentation
  - “Confidence & why” (tier + missing inputs + top contributing factors)
  - “Monitoring points” (next checks, when to reassess)
  - “Risks/complications” (prototype-grade flags; actionable guidance)
  - “Matched cases” (top-N list with `caseId` links)
  - “Evidence & review” (from matched case: `review.status`, `evidence.notes`, and mapped citations)
  - “Intended use warning” (content sourced from dataset `intendedUse.warning` and `intendedUse.validationRequirement`; render user-facing text via i18n keys with interpolation; always visible)
- **Responsive**:
  - mobile: collapsible sections; primary action = “Start monitoring”
  - tablet/web: split-pane with sticky session summary
- **Tests**:
  - route wrapper test
  - screen tests for rendering all sections, states, link navigation, and a11y labeling

### 11.S.4 Monitoring

- **Route** `(main)/session/monitoring` · **Deliverables** `monitoring.jsx` + `MonitoringScreen` (ventilation)

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

### 11.S.5 History

- **Route** `(main)/history` · **Deliverables** `history.jsx` + `HistoryScreen` (ventilation)

**Goal**: list saved sessions; allow resume, delete, and view summary quickly.

- **Route file**: `src/app/(main)/history.jsx`
- **Platform screen**: `src/platform/screens/ventilation/HistoryScreen/*`
- **UI**:
  - virtualized list of sessions (date/time, condition, key summary, last recommendation tier)
  - actions: resume (primary), delete (destructive confirm), view details
- **Tests**:
  - empty state (no history), corrupted persistence recovery messaging, delete confirmation path

### 11.S.6 Case detail

- **Route** `(main)/session/case/[case-id]` · **Deliverables** `case/[case-id].jsx` + `CaseDetailScreen` (ventilation)

**Goal**: explain “matched cases” in a clinician-friendly way without leaking raw/unvalidated data.

- **Route file**: `src/app/(main)/session/case/[case-id].jsx`
- **Platform screen**: `src/platform/screens/ventilation/CaseDetailScreen/*`
- **UI**:
  - compact case summary (patientProfile + key clinicalParameters)
  - ventilatorSettings used
  - outcomes (with clear “dataset case” framing)
  - evidence: mapped citations (`evidence.sourceIds[]` → `sources[]`)
  - review status (`review.status`) with clear prototype framing
  - always show intended-use warning
- **Tests**:
  - param parsing, missing caseId path, not-found-in-dataset path

### 11.S.7 Training home

- **Route** `(training)/index` · **Deliverables** `index.jsx` + `TrainingHomeScreen` (training)

**Goal**: clinician-focused entry to offline training/quick reference.

- **Route file**: `src/app/(training)/index.jsx`
- **Platform screen**: `src/platform/screens/training/TrainingHomeScreen/*`
- **UI**: search box + “popular topics” + quick checklists

### 11.S.8 Topic list

- **Route** `(training)/topics` · **Deliverables** `topics.jsx` + `TopicListScreen` (training)

**Goal**: browse all topics with filters.

- **Route file**: `src/app/(training)/topics.jsx`
- **Platform screen**: `src/platform/screens/training/TopicListScreen/*`
- **UI**: virtualized list + search/filter; keyboard accessible on web

### 11.S.9 Topic detail

- **Route** `(training)/topic/[topic-id]` · **Deliverables** `topic/[topic-id].jsx` + `TopicDetailScreen` (training)

**Goal**: show structured training content, readable on small screens.

- **Route file**: `src/app/(training)/topic/[topic-id].jsx`
- **Platform screen**: `src/platform/screens/training/TopicDetailScreen/*`
- **UI**: sectioned content + collapsible sub-sections; optional “pin to summary” patterns

### 11.S.10 Settings

- **Route** `(settings)/index` · **Deliverables** `index.jsx` + `SettingsScreen` (settings)

**Goal**: preferences and app controls.

- **Route file**: `src/app/(settings)/index.jsx`
- **Platform screen**: `src/platform/screens/settings/SettingsScreen/*`
- **Must include**:
  - density mode toggle (Phase 9)
  - theme selection (if supported)
  - language selection (supported locales only; see `i18n.mdc`)

### 11.S.11 Disclaimer

- **Route** `(settings)/disclaimer` · **Deliverables** `disclaimer.jsx` + `DisclaimerScreen` (settings)

**Goal**: show the dataset/app disclaimer and allow acknowledgement (guarded entry for workflow).

- **Route file**: `src/app/(settings)/disclaimer.jsx`
- **Platform screen**: `src/platform/screens/settings/DisclaimerScreen/*`
- **Data**:
  - disclaimer content sourced from dataset `intendedUse` + plan-provided prototype framing (no “clinical use” claims); render user-facing text via i18n keys with interpolation where dataset text is shown
  - acknowledgement persists via store/service boundary (Phase 7 guard)

### 11.S.12 Data sources

- **Route** `(settings)/data-sources` · **Deliverables** `data-sources.jsx` + `DataSourcesScreen` (settings)

**Goal**: transparency: dataset version + citations.

- **Route file**: `src/app/(settings)/data-sources.jsx`
- **Platform screen**: `src/platform/screens/settings/DataSourcesScreen/*`
- **Data**:
  - show `datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`
  - list `sources[]` citations (with DOI text where present)

### 11.S.13 Privacy

- **Route** `(settings)/privacy` · **Deliverables** `privacy.jsx` + `PrivacyScreen` (settings)

**Goal**: explain what is stored locally and what is never sent.

- **Route file**: `src/app/(settings)/privacy.jsx`
- **Platform screen**: `src/platform/screens/settings/PrivacyScreen/*`
- **Content**:
  - local-only session storage description (non-sensitive)
  - optional online AI behavior (only if Phase 12 implemented)

### 11.S.14 About

- **Route** `(settings)/about` · **Deliverables** `about.jsx` + `AboutScreen` (settings)

**Goal**: app identity + version + prototype scope.

- **Route file**: `src/app/(settings)/about.jsx`
- **Platform screen**: `src/platform/screens/settings/AboutScreen/*`

## Testing baseline for Phase 11 completion

For every screen (except 11.S.2 layout):
- Route wrapper test
- Platform screen test (android/ios/web separately)
- Explicit tests for loading, empty, error, offline
- Web: keyboard navigation + focus order for primary interactions
