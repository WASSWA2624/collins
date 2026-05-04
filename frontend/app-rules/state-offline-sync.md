# Frontend State and Offline Sync Rules

## State principles

- Keep form state local until save/draft/sync.
- Keep server-confirmed records in Redux slices.
- Keep offline queue items separate from confirmed records.
- Use selectors for derived dashboard/tracking counts.
- Use pure helpers for calculations so UI previews and tests stay consistent.
- Store sensitive auth/session material in secure storage where supported.

## Required sync statuses

Use these statuses consistently:

| Status | Meaning |
| --- | --- |
| Local draft | Saved only on device. |
| Waiting to sync | Ready for upload when network returns. |
| Syncing | Upload in progress. |
| Synced | Server confirmed. |
| Conflict | Server has competing update. |
| Failed | Upload failed; user can retry. |
| Reviewed | Specialist/facility reviewer approved. |

## Offline-allowed actions

Offline mode should allow:

- create admission draft;
- enter ABG;
- enter ventilator settings;
- update airway/humidification;
- save daily review;
- queue sync action;
- view cached active patients for the selected facility.

## Queue item requirements

Each queued write should include:

- local queue id;
- action type;
- target facility/admission/patient id where known;
- payload;
- client created/updated timestamp;
- idempotency key;
- sync status;
- attempt count;
- last error;
- conflict payload where returned by backend.

## Conflict behavior

- Never hide a conflict.
- Never overwrite reviewed data silently.
- Show simple messages such as “Another update exists. Keep both values for reviewer?”
- Preserve both local and server values until reviewer resolution.
- ABG and ventilator updates should append time-stamped versions whenever possible.

## Offline UI behavior

- Always show active facility and sync status on clinical screens.
- Show grey status for draft/offline/unreviewed rows.
- Show retry actions for failed sync.
- Show “server not confirmed yet” when values are only local previews.
- Do not block urgent data capture only because the network is unavailable.

## Data protection

- Minimize identifiers in offline payloads.
- Prefer app patient ID over patient name.
- Use encrypted or secure storage for sensitive data where feasible.
- Clear demo/training data separately from real facility data.
- Do not persist raw pasted notes unless allowed by facility policy and research governance.
