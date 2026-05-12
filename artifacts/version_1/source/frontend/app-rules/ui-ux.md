# Frontend UI/UX Rules

## ICU design principles

1. One screen, one task.
2. Large touch targets for gloved hands.
3. Minimal typing through chips, dropdowns, steppers, and numeric keypads.
4. Use `unknown/not available` instead of forcing guesses.
5. Auto-calculate everything possible.
6. Show red flags clearly.
7. Show missing data separately from clinical danger.
8. Use plain clinical language.
9. Avoid long paragraphs on clinical screens.
10. Always show active facility and sync status.

## Live summary card

The summary card should stay visible on tablet/web and be collapsible on mobile. It should show:

- bed and app ID;
- patient pathway and reference weight;
- VT/kg relevant reference weight;
- P/F or S/F ratio;
- pH/PaCO2 flag;
- oxygen target range/caution;
- plateau/driving pressure if available;
- ARDS/COPD/oedema pattern flags;
- missing key values;
- reviewer status;
- sync status.

## Status colors

Use consistent semantic states:

- Green: no major safety flag based on entered data.
- Yellow: missing key data or moderate abnormality.
- Red: urgent review flag or potentially unsafe setting.
- Grey: draft/offline/unreviewed.

Do not rely on color alone. Pair color with text labels and icons.

## Forms

- Group fields by the 3-step workflow.
- Keep labels short and units visible.
- Use numeric keyboards for numeric fields.
- Show unit next to value.
- Show “measured at” time for ABG/vitals/ventilator settings.
- Support unknown/not available.
- Highlight impossible values before save.
- Save draft even when non-critical fields are missing.

## Progressive disclosure

- Normal users see summary, prompts, and missing data.
- Reviewers can open detailed raw/edited values and reviewer comments.
- Admins can open audit, dataset quality, model cards, and debug/model details.

## Accessibility

- Ensure readable text sizes.
- Support screen reader labels for form controls and status badges.
- Do not communicate risk by color only.
- Keep tap targets large and spaced.
- Preserve theme contrast in light and dark modes.
- Keep error messages near the field they describe.

## Empty/loading/error states

Clinical screens must have clear states:

- No active facility selected.
- Offline but cached records available.
- Offline with no cached records.
- No active admissions.
- Records needing sync.
- Records needing review.
- Permission denied.
