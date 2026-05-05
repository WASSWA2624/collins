# Phase 14 - Training / Help

## Goal

Support training/help content without turning educational material into clinical orders.

## Inspect And Reuse First

- Inspect reference, settings, admin, and training/help-related routes before adding backend support.
- Reuse static content or reference endpoints when they already satisfy versioning and role needs.

## Implementation Scope

- Store or serve training/help content only when backend versioning, facility configuration, or auditability is required.
- Keep content advisory and aligned with allowed wording.
- Explain verified reference range status, source/version, and facility/global scope when training content references decision-support logic.
- Keep training records separate from live facility records and approved training datasets.
- Do not expose predictive model controls to normal clinicians.

## Cleanup During Future Work

- Remove duplicated reference/help content after one source of truth is established.
- Remove unsafe or order-like clinical wording from backend-served help content.

## Future Tests

- Contract tests for training/help endpoints if added.
- Tests proving training/help content does not expose unverified range records as active decision-support rules.
- Forbidden wording tests for backend-served content.
- RBAC tests for admin-managed training content.
