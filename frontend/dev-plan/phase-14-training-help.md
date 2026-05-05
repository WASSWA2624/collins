# Phase 14 - Training And Help

## Goal

Provide accessible training/help content that supports safe app use without issuing clinical orders.

## Inspect And Reuse First

- Inspect existing training/help routes, content components, settings links, i18n, accessibility, and offline availability.
- Reuse compliant content containers and navigation.

## Implementation Scope

- Cover Home, Admit, Tracking, ABG / Vent Update, Dataset Capture, Review Queue, Dashboard, and Settings workflows.
- Keep training wording advisory and aligned with app safety rules.
- Keep model/predictive content restricted to approved roles.
- Make help content readable on mobile web, Android, iOS, and desktop.

## Cleanup During Future Work

- Remove duplicate help text after reusable content sections exist.
- Remove unsafe clinical wording from existing training content when encountered.

## Future Tests

- Training/help navigation tests.
- Accessibility tests for help content and links.
- Forbidden wording tests for training copy.
- Role tests for model-governance training content.
