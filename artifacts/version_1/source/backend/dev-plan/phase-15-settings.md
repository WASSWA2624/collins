# Phase 15 - Settings

## Goal

Manage user, facility, sync, privacy, and governance settings safely.

## Inspect And Reuse First

- Inspect facility settings, user profile, auth/session, admin, audit, sync, and reference modules.
- Reuse existing settings endpoints and services when they preserve role and facility boundaries.

## Implementation Scope

- Support account, active facility, role visibility, offline/sync preferences, privacy controls, and facility reference settings.
- Do not allow settings to activate unverified reference ranges or unapproved model/predictive outputs for normal clinicians.
- Audit settings that affect clinical workflows, exports, governance, or model visibility.
- Keep settings changes from silently altering reviewed clinical records.
- Do not place clinical decision outputs in settings.

## Cleanup During Future Work

- Remove duplicated preference stores after clients migrate to the canonical settings contract.
- Remove obsolete disclaimer acknowledgement flags once in-flow clinical safety wording is implemented.

## Future Tests

- Settings route contract and Zod validation tests.
- RBAC and facility isolation tests for facility settings.
- Tests blocking unverified range activation through settings.
- Audit tests for settings that affect clinical workflows or governance.
