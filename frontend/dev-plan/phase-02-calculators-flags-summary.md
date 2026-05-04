# Phase 2 — Calculators, Flags, and Live Summary

## Goal

Give clinicians a clear live summary of current ventilation status, unsafe values, and missing data.

## Scope

- Add pure helper functions/selectors for:
  - reference weight;
  - VT/kg reference weight;
  - P/F ratio;
  - S/F screening fallback;
  - minute ventilation;
  - driving pressure.
- Add ABG pattern and ventilation safety preview flags.
- Add COPD/hypercapnia, ARDS/respiratory-failure, oedema context, sepsis/pneumonia, and humidification prompts.
- Add sticky/collapsible `LiveSummaryCard`.
- Add risk status labels: green, yellow, red, grey.
- Show safe wording: check, review, consider senior review, confirm clinically.
- Show rule/reference version when available.

## Done when

- Adult PBW is not used for neonatal/pediatric/unknown pathways.
- Missing data appears separately from danger flags.
- The summary card works on mobile, tablet, and web.
- Tests cover calculations, flags, and forbidden wording.
