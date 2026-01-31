# Phase 10: Ventilation Core Features (Offline Dataset → Matching → Guidance)

## Purpose
Implement the ventilation decision-support domain in a way that:
- Uses the **local embedded dataset** as the primary knowledge base
- Provides a deterministic, testable **matching + recommendation** engine
- Supports optional extensible inputs (`observations`, `timeSeries`)
- Stores only safe, minimal state in Redux and persists non-sensitive data appropriately

## Rule references
- `.cursor/rules/features-domain.mdc` (feature structure)
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`

## Prerequisites
- Phase 2 services + Phase 4 offline layer exist (storage + network status + queue)
- Foundation error normalization exists
- App shell exists (phases 7–9) so screens can consume hooks later

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

## Steps (atomic)

### Step 10.1: `ventilation` feature skeleton + dataset contract
Goal: establish the domain boundary and validate the dataset shape.
- Add/verify:
  - `src/features/ventilation/index.js`
  - `src/features/ventilation/ventilation.rules.js`
  - `src/features/ventilation/ventilation.model.js`
  - `src/features/ventilation/ventilation.usecase.js`
  - `src/features/ventilation/ventilation.api.js` (stub; online augmentation later)
  - `src/features/ventilation/data/ventilation_dataset.json` (already present)
- In `ventilation.model.js`:
  - Define Zod schemas for:
    - dataset root metadata (`datasetVersion`, `datasetSchemaVersion`, `lastUpdated`, `totalCases`)
    - dataset `intendedUse` block (must include `warning` and `clinicalUse:false`)
    - dataset `sources[]` citations (for UI data-sources screen)
    - dataset `schema.units` map (for UI unit labels + validation messaging)
    - case shape
    - extensible observation/timeSeries shapes
  - Provide model functions that normalize raw case(s) into safe domain shapes.
  - Provide model selectors/helpers for UI (read-only):
    - `getVentilationDatasetMeta()` (version, lastUpdated, totalCases)
    - `getVentilationDatasetIntendedUse()` (warning + validation requirement)
    - `getVentilationDatasetSources()` (citations)
    - `getVentilationUnits()` (units map for clinical parameters + ventilator settings)
- Tests:
  - Validate dataset parsing and schema failures (including corrupted/partial data).
  - Ensure “intended use” warning is accessible via a model function for UI.
  - Validate `schema.units` presence and required unit keys (UI relies on this for consistent labels).

### Step 10.2: Case indexing + retrieval (performance baseline)
Goal: enable fast offline matching without re-parsing large structures repeatedly.
- Add domain functions to:
  - build a lightweight index (e.g., by condition + basic ranges)
  - retrieve candidate cases deterministically
- Constraints:
  - avoid large in-memory Redux state; store IDs and minimal metadata only
  - keep heavy dataset parsing out of render paths (hooks must memoize / compute once)
- Tests:
  - indexing determinism
  - candidate retrieval correctness by condition and severity buckets

### Step 10.3: Similarity scoring + top-N matching
Goal: deterministic similarity scoring for the core clinician input set.
- Implement rules for:
  - required input validation (minimum fields)
  - missing-value handling (partial inputs must still work)
  - normalized distance functions per numeric field
  - weighted scoring (documented in code via constants, not hardcoded in UI)
  - tie-breaking to keep ranking stable
- Output:
  - top N matched cases with scores + explanation-friendly highlights
- Define (in rules/constants) a **confidence tier** derived from score and input completeness:
  - e.g., `high` / `medium` / `low` with deterministic thresholds (exact thresholds are constants; UI never hardcodes them)
  - include a “why” payload suitable for UI explanation (missing fields, dominant contributors, ties)
- Tests:
  - all branches including missing field combinations
  - stable ranking given equal scores

### Step 10.4: Recommendation generation + safety framing
Goal: produce output suitable for UI display and safe clinician interpretation.
- Use matched cases to generate:
  - recommended initial settings (mode/TV/RR/FiO₂/PEEP/I:E)
  - monitoring points (what to watch next)
  - risk/complication flags (prototype-grade)
  - “request additional tests” prompts when key data missing (e.g., ABG values)
- Requirements:
  - recommendation objects include “source” metadata (case IDs + confidence tier)
  - include the dataset’s “not clinically validated” warning as part of output
  - include units metadata (from `schema.units`) so UI never guesses units
- Tests:
  - generation logic for different conditions
  - missing input → additional tests prompts
  - ensure no raw dataset leaks unvalidated to UI

### Step 10.5: Session persistence (local-only)
Goal: save and resume assessments safely on-device.
- Add slice/hook only if needed:
  - `src/store/slices/ventilation.slice.js` to track:
    - current session ID
    - current inputs (minimal)
    - last computed recommendation summary
    - error codes only (no raw errors)
- Persist non-sensitive session history to AsyncStorage via a service boundary.
- Tests:
  - reducer purity, hydration behavior, corruption handling

### Step 10.6: Monitoring model (time series + thresholds)
Goal: represent monitoring inputs and compute alert states deterministically.
- Support:
  - manual entry of repeated vitals/labs (time series)
  - trend detection (simple, explainable rules)
  - alert severity classification (warning vs critical)
- Tests:
  - trend edge cases (sparse points, out-of-order timestamps)
  - alert classification branches

### Step 10.7: Training content domain (offline)
Goal: provide structured training content without external dependencies.
- Add a `training` feature with:
  - content models (sections, checklists, glossary)
  - search/filter rules (pure)
  - local content source (JSON/MD under `src/features/training/data/`)
- Tests:
  - content model normalization + search behavior
