# P013: Prototype Evaluation Readiness (Simulation + Expert Validation)

## Purpose
Checklists for simulated evaluation and expert review of the ventilation decision-support prototype (non-production).

## 13.7.1 Simulated evaluation checklist

### Curated test scenarios (by condition bucket)
- [ ] **Hypoxemia**: Enter SpO₂/PaO₂ low; verify recommended FiO₂/PEEP and monitoring points.
- [ ] **Hypercapnia**: Enter elevated PaCO₂; verify recommended minute ventilation (RR × Vt) and I:E.
- [ ] **Acidosis**: Enter low pH; verify recommendations reference ventilation and underlying cause.
- [ ] **Mixed / edge**: Enter borderline or conflicting values; verify confidence tier and “missing test” prompts where applicable.

### Expected outputs to verify
- [ ] Recommended settings (mode, tidal volume, RR, FiO₂, PEEP, I:E) present and plausible.
- [ ] Monitoring points listed.
- [ ] Risks / complications surfaced where applicable.
- [ ] “Missing ABG” or “missing test” prompts when inputs are incomplete.
- [ ] Safety disclaimer (not clinically validated) visible in workflow and in exports.

---

## 13.7.2 Expert review checklist (non-production prototype)

### Output plausibility
- [ ] Recommended settings are clinically plausible for the entered scenario.
- [ ] No over-claim of validation or clinical certainty.
- [ ] Framing is clearly “decision support only” and not a substitute for clinical judgment.

### Safety and framing
- [ ] Dataset “not clinically validated” warning is visible in core workflow (Recommendation, Monitoring).
- [ ] First-run acknowledgement (disclaimer) is required before main workflow.
- [ ] Exports (if used) include intended-use disclaimer.

### Feedback (non-identifying only)
- [ ] Record only non-identifying feedback (e.g., “recommendation X was too aggressive for scenario Y”).
- [ ] No patient or user identifiers in evaluation notes.

---

## Exit criteria (P013)
- All tests pass (100% coverage target).
- Accessibility checks for included locales.
- Offline-first behavior verified.
- Safety disclaimers present and tested.
- Performance budgets respected.
- Supported locales implemented and validated per 13.4.
