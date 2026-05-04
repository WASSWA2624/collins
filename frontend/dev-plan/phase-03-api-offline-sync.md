# Phase 3 — API Integration and Offline Sync

## Goal

Connect the core frontend workflows to the backend while preserving offline-first ICU use.

## Scope

- Wire auth and current-user flow.
- Wire active facility and facility memberships.
- Wire admission create and active tracking board.
- Wire ABG, ventilator, airway, humidification, daily review, and outcome writes.
- Add local draft save for admission and updates.
- Add sync queue with idempotency keys.
- Add retry, failed, conflict, synced, and reviewed statuses.
- Display conflicts without overwriting reviewed data.
- Replace preview values with backend-confirmed values after sync.

## Done when

- Core workflows work online and degrade safely offline.
- Offline ABG/ventilator updates are queued and later synced.
- Conflict state is visible and preserves both values.
- Tests cover successful API calls, validation errors, network failures, queued writes, retry, and conflict UI.
