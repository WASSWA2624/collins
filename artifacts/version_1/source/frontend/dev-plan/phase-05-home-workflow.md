# Phase 05 - Home Workflow

## Goal

Make Home the simple operational starting point for the clinical workflow.

## Inspect And Reuse First

- Inspect existing `HomeScreen`, navigation labels, route aliases, cards/actions, sync status selectors, and API summaries.
- Reuse compliant platform components and avoid introducing one-off UI.

## Implementation Scope

- Present Home actions for Admit, Tracking, ABG / Vent Update, Dataset Capture, Review Queue, Dashboard, Training / Help, and Settings where roles allow.
- Keep Home focused on status, active facility, drafts, conflicts, and review needs.
- Avoid decision-support outputs on Home.
- Keep layouts readable on mobile web, Android, iOS, tablet, and desktop.

## Paired Backend Requirements

- Verify backend support for active facility context, active admission counts, sync/conflict counts, review queue counts, and role-scoped dashboard summaries.
- Reuse existing admissions, review, sync, facility, or dashboard services when compliant; add a Home summary endpoint only if necessary.
- Implement any missing backend route, validator, controller, service, Prisma query/index, Zod response contract, facility isolation, and tests in this same phase.

## Cleanup During Future Work

- Remove legacy Assessment/History labels from user-facing navigation after route aliases are verified.
- Remove duplicated Home action components after a reusable action component is in place.

## Future Tests

- Navigation tests for role-aware Home actions.
- Responsive layout checks across web and native sizes.
- Accessibility tests for action buttons and status alerts.
