# Phase 14 - Training / Help

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

## Paired Backend Requirements

- Verify whether Training / Help content needs backend reference/version support, facility-specific content, or governance-managed range explanations.
- If backend support is needed, implement or reuse routes, validators, controllers, services, Prisma schema/migrations, Zod contracts, RBAC, audit logs, and tests in this phase.
- Ensure training content explains verified range/reference status without enabling unverified decision-support use.

## Cleanup During Future Work

- Remove duplicate help text after reusable content sections exist.
- Remove unsafe clinical wording from existing training content when encountered.

## Future Tests

- Training/help navigation tests.
- Accessibility tests for help content and links.
- Forbidden wording tests for training copy.
- Role tests for model-governance training content.
