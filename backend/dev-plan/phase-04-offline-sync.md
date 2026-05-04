# Phase 4 — Offline Sync and Conflict Resolution

## Goal

Make ICU data capture reliable during intermittent connectivity.

## Scope

- Add sync ingestion endpoint.
- Support idempotency keys and client-generated record IDs.
- Track sync states: local draft, waiting to sync, syncing, synced, conflict, failed, reviewed.
- Preserve client timestamps and server timestamps.
- Add conflict detection for reviewed or competing updates.
- Never overwrite reviewed data silently.
- Preserve both values when conflict occurs and route to reviewer resolution.
- Return user-friendly error/conflict payloads for frontend retry UX.

## Done when

- Duplicate offline submissions do not create duplicate clinical records.
- Competing edits are retained safely.
- ABG offline updates append versions.
- Sync failures are visible and retryable.
- Tests cover idempotency, conflicts, validation failures, and reviewed-data protection.
