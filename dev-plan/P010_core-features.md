# Phase 10: Ventilation Core Features (Offline Dataset → Matching → Guidance)

## Purpose (must match dataset + write-up)
Implement the ventilation decision-support domain in a way that:
- Uses the **embedded offline ventilation dataset** as the primary knowledge base (no network required)
- Simulates “specialist oversight” for **non-specialist clinicians** via step-by-step guidance
- Produces deterministic, testable **matching + recommendations** and **monitoring/alerts**
- Supports partial input entry (ABG is often unavailable; must still work using SpO₂ + vitals)
- Treats online AI as **optional enhancement** (future phase / feature-flagged)

## Dataset contract (single source for Phase 10)
Dataset location:
- `src/config/data/ventilation_dataset.json`

High-level structure (as implemented in the JSON):
- **Root metadata**: `datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`
- **Schema**:
  - `schema.notes`
  - `schema.units` (labels for vitals/labs + ventilator settings)
  - `schema.observationModel` (extensible `observationShape` + `timeSeriesShape`)
- **Safety framing**: `intendedUse` with `clinicalUse:false`, `warning`, `validationRequirement`
- **Citations**: `sources[]` (with `id`, `type`, `citation`, optional `doi`)
- **Cases**: `cases[]` where each case contains:
  - `caseId`
  - `patientProfile` (`age`, `weight`, `height`, `gender`, `condition`, `comorbidities[]`)
  - `clinicalParameters` (`spo2`, `pao2`, `paco2`, `ph`, `respiratoryRate`, `heartRate`, `bloodPressure`)
  - `ventilatorSettings` (`mode`, `tidalVolume`, `respiratoryRate`, `fio2`, `peep`, `ieRatio`)
  - `outcomes` (`complications[]`, `weaningSuccess`, `lengthOfVentilation`, `mortality`)
  - `recommendations` (`initialSettings`, `monitoringPoints[]`, `riskFactors[]`)
  - `evidence` (`sourceIds[]`, `notes`)
  - `review` (`status`, `reviewedByRole`, `reviewedAt`)

## Rule references (implementation must comply)
- `.cursor/rules/index.mdc` (precedence)
- `.cursor/rules/features-domain.mdc` (feature structure)
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`

## Prerequisites
- Storage + offline foundations exist (AsyncStorage, network state, queue)
- Error normalization exists (error codes only; no raw errors to UI)
- App shell exists so screens can consume hooks later

## Feature development contract (applies to every step)
For each feature created/expanded, follow the standard structure:
- `src/features/index.js` (feature barrel root)
- `src/features/<feature>/<feature>.rules.js` (pure business rules)
- `src/features/<feature>/<feature>.model.js` (domain normalization/validation)
- `src/features/<feature>/<feature>.api.js` (service orchestration; optional)
- `src/features/<feature>/<feature>.usecase.js` (application orchestration)
- `src/features/<feature>/<feature>.events.js` (optional)
- `src/features/<feature>/index.js` (feature public API)
- `src/store/slices/<feature>.slice.js` (only if global state required)
- `src/hooks/use<Feature>.js` (UI gateway)

## Testing requirements (mandatory)
- 100% coverage for rules/models/api/usecase/slice/hook, including error paths and edge cases.
- Tests must mock services/storage/time; never depend on real network or real device storage.
- Matching logic must be tested for determinism and ranking stability.

## Core user flows (from the write-up)
- **Assessment**: clinician enters condition + available parameters (SpO₂-first; ABG optional)
- **Decision support (offline-first)**: match against dataset `cases[]` and rank best matches
- **Instruction output**: return mode + initial settings + monitoring points + risk factors (with “why”)
- **Request missing tests**: prompt for additional tests (e.g., ABG) when confidence is low
- **Monitoring**: track time-series entries and trigger explainable alerts (warning/critical)
- **Training**: offline training content for non-specialists (protocols + checklists + glossary)
- **Optional online AI**: only for complex/low-confidence cases when connectivity exists (future)

## Steps (atomic)

### Step 10.1: `ventilation` feature skeleton + dataset model contract
Goal: establish the domain boundary and validate the dataset shape used by the app.
- Add/verify:
  - `src/features/ventilation/index.js`
  - `src/features/ventilation/ventilation.rules.js`
  - `src/features/ventilation/ventilation.model.js`
  - `src/features/ventilation/ventilation.usecase.js`
  - `src/features/ventilation/ventilation.api.js` (stub; online augmentation later)
- In `ventilation.model.js` define Zod schemas for:
  - root metadata (`datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`)
  - `schema.units` (must include: `spo2`, `pao2`, `paco2`, `ph`, `respiratoryRate`, `heartRate`, `bloodPressure`, `fio2`, `peep`, `tidalVolume`, `ieRatio`)
  - `schema.observationModel` shapes (even if `cases[]` currently do not embed observations/timeSeries)
  - `intendedUse` (must include `clinicalUse:false`, `warning`, `validationRequirement`)
  - `sources[]` citations
  - `cases[]` including per-case `evidence` and `review` blocks
- Provide model helpers for UI/hook consumption (read-only):
  - `getVentilationDatasetMeta()` (version, lastUpdated, totalCases)
  - `getVentilationDatasetIntendedUse()` (warning + validation requirement)
  - `getVentilationDatasetSources()` (citations)
  - `getVentilationUnits()` (units map)
  - `getVentilationCaseCitations(case)` (map `case.evidence.sourceIds[]` → `sources[]`)
  - `getVentilationCaseReviewStatus(case)` (surface `review.status`)
- Tests:
  - dataset parsing and schema failures (including corrupted/partial data)
  - required unit keys exist (UI relies on this for consistent labels)
  - `intendedUse` is always available and is never suppressed

### Step 10.2: Case indexing + retrieval (offline performance baseline)
Goal: enable fast offline matching without re-parsing or scanning the entire dataset repeatedly.
- Add domain functions to:
  - build a lightweight index primarily by `patientProfile.condition`
  - retrieve candidate cases deterministically (stable ordering)
- Constraints:
  - avoid large in-memory Redux state; store only session IDs + minimal inputs/outputs
  - keep heavy dataset parsing out of render paths (load once; memoize; reuse index)
- Tests:
  - indexing determinism across runs
  - candidate retrieval correctness by `condition` (and graceful fallback when condition missing)

### Step 10.3: Similarity scoring + top-N matching (SpO₂-first, ABG-optional)
Goal: deterministic similarity scoring for the write-up’s minimum viable clinician inputs.
- Implement rules for:
  - required input validation (minimum safe set, e.g., `condition` + `spo2` + `respiratoryRate` + `heartRate`)
  - missing-value handling (ABG fields `pao2/paco2/ph` may be omitted)
  - normalized distance functions per numeric field
  - weighted scoring (constants live in domain; UI never hardcodes weights)
  - tie-breaking to keep ranking stable
- Output:
  - top N matched cases with scores + explanation payload (“why this match”)
- Define a deterministic **confidence tier** derived from score + completeness:
  - `high` / `medium` / `low` with thresholds as constants
  - include a “missing data” list to drive “request additional tests”
- Tests:
  - all branches including missing ABG combinations
  - stable ranking given equal scores

### Step 10.4: Recommendation assembly + safety framing (dataset-first)
Goal: produce output suitable for UI display, aligned to what the dataset already contains.
- Use matched cases to assemble:
  - recommended initial ventilator settings (from `case.recommendations.initialSettings` and/or `case.ventilatorSettings`)
  - monitoring points (from `case.recommendations.monitoringPoints`)
  - risk factors (from `case.recommendations.riskFactors`) and complication history (from `case.outcomes.complications`)
  - “request additional tests” prompts when confidence is low or key fields are missing (ABG prompts are primary)
  - a step-by-step “next actions” checklist (prototype-grade) keyed by `condition` + confidence tier (supports write-up’s specialist-simulation workflow)
- Requirements:
  - include “source” metadata (case IDs + confidence tier)
  - always surface dataset safety framing:
    - global `intendedUse.warning`
    - per-case `review.status` and `evidence.notes`
  - include units metadata (from `schema.units`) so UI never guesses units
  - include citations (map `evidence.sourceIds[]` to `sources[]`) for transparency
- Tests:
  - assembly logic for each supported condition bucket
  - missing input → additional test prompts
  - ensure no raw dataset objects leak to UI without normalization (codes only in store)

### Step 10.5: Session persistence (local-only)
Goal: save and resume assessments safely on-device for clinical workflow continuity.
- Add slice/hook only if needed:
  - `src/store/slices/ventilation.slice.js` to track:
    - current session ID
    - current inputs (minimal)
    - last computed recommendation summary (minimal)
    - error codes only (no raw errors)
- Persist non-sensitive session history to AsyncStorage via a service boundary.
- Tests:
  - reducer purity, hydration behavior, corruption handling

### Step 10.6: Monitoring model (time series + thresholds)
Goal: represent monitoring inputs and compute alert states deterministically.
- Support:
  - manual entry of repeated vitals/labs (time series compatible with `schema.observationModel.timeSeriesShape`)
  - trend detection (simple, explainable rules)
  - alert severity classification (warning vs critical)
- Tests:
  - trend edge cases (sparse points, out-of-order timestamps)
  - alert classification branches

### Step 10.7: Training content domain (offline, non-specialist oriented)
Goal: provide structured training content without external dependencies.
- Add a `training` feature with:
  - content models (protocol sections, checklists, glossary, FAQs)
  - search/filter rules (pure)
  - local content source (JSON/MD under `src/features/training/data/`)
- Tests:
  - content model normalization + search behavior

### Step 10.8: Optional online AI augmentation via AI SDK (future phase hook point)
Goal: enable the write-up’s “online AI for complex cases” while preserving offline-first reliability.

- Implement a “complex case” detector (pure function), using:
  - confidence tier assessment logic
  - presence/absence of key inputs affecting recommendations
  - detection of out-of-distribution inputs (compared to dataset/value ranges)
- Integrate AI SDK with feature-flag boundaries:
  - When online and feature-flag enabled, use AI SDK endpoint to request extra analysis for detected complex cases
  - Merge AI SDK output with core dataset output deterministically—always prefer dataset output as primary source
- Provide API/subscription stub interfaces (using AI SDK client):
  - `aiSdk.requestCaseAnalysis(caseInput)` (returns AI enhancement or null)
  - Deterministic merge function: `(datasetOutput, aiOutput) => mergedOutput`
- Tests:
  - Complex case detector returns same result for identical inputs (pure, deterministic)
  - Full offline functionality coverage—ensure no dependency on AI SDK for core path
  - Merge logic maintains dataset as primary and prevents leakage of raw AI output
