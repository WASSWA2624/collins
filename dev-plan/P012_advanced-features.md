# Phase 12: Advanced Features (Optional Enhancements)

## Purpose
Implement optional enhancements for the ventilation decision-support app after the core workflow is complete. Each step is **atomic** and must not break offline-first usability.

## Rule references
- `.cursor/rules/index.mdc`
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`

## Prerequisites
- Phase 11 completed (core screens/routes working end-to-end)
- Phase 10 completed (core domain logic stable)

## Steps (fully atomic)

### Optional online AI augmentation (second opinion)
- **12.1.1** Add “complex case” detector (deterministic) in `ventilation.rules.js` aligned with Phase 10:
  - triggers when confidence tier is low, key inputs are missing, or inputs are out-of-distribution vs dataset
  - produces a machine-readable reason list for UI messaging (no raw errors)
- **12.1.2** Create `services/ai/` wrapper (stateless client) for online AI calls (no direct SDK calls outside wrapper).
- **12.1.3** Add `ventilation.api.js` integration for online augmentation (feature decides when to call; UI only triggers via hook).
- **12.1.4** Security/privacy constraints for online calls (mandatory):
  - never send identifiers, names, or persistent session IDs
  - send only minimal, non-identifying clinical inputs required for analysis (prototype-safe payload)
  - never log request payloads; store only error codes
- **12.1.5** Add UI surface on Recommendation screen:
  - “Request second opinion” action
  - clear connectivity requirement messaging
  - clear labeling that output is supplemental and not clinically validated
- **12.1.6** Add error handling + retry logic; never block core flow when online AI fails.
- **12.1.7** Merge behavior (deterministic):
  - dataset output remains primary
  - online output is shown as “supplemental” with clear provenance and user-facing caveats

### Exports and sharing (safe prototype workflow)
- **12.2.1** Export a session summary to a shareable text/PDF-like payload (platform-appropriate), with disclaimers embedded (dataset `intendedUse` + prototype framing).
- **12.2.2** Add anonymization option (remove identifiers) before export.

### Dataset management (versioning + updates)
- **12.3.1** (Skip if already done in Phase 11) Dataset metadata is surfaced in `(settings)/data-sources` (version, lastUpdated, sources citations).
- **12.3.2** Add an optional dataset update UI/flow (if updates are supported).
- **12.3.3** Add safe dataset update mechanism (if used):
  - downloaded dataset must be validated against schema
  - failure must keep last known-good dataset
  - no secrets in config
  - “intended use” must be present and `clinicalUse:false` for any updated dataset

### Voice/rapid input (if justified and supported)
- **12.4.1** Add optional “rapid entry” UI pattern for mobile (chips + numeric keypad + defaults).
- **12.4.2** Add voice input only if it can be implemented with approved platform capabilities and without adding heavy dependencies (must remain optional and never block core workflows).

### Quality and observability (non-sensitive)
- **12.5.1** Add non-sensitive analytics/events (optional) via `services/analytics`:
  - usage metrics (screen views, action counts)
  - performance metrics
  - strictly no PII, no clinical identifiers, no raw patient data

## Testing
Maintain Phase 10 rigor:
- 100% coverage including online failure paths
- explicit offline tests (core flow must remain usable)
- performance tests for dataset parsing/matching boundaries
