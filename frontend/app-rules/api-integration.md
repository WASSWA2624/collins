# Frontend API Integration Rules

## API client

Use the shared API client under `src/services/api/` for all backend calls.

The client should handle:

- base URL and `/api/v1` prefix;
- auth headers;
- JSON request/response parsing;
- timeout and retry rules;
- normalized success/error shapes;
- facility scoping;
- idempotency keys for offline writes;
- user-friendly error messages.

## Endpoint groups the frontend must support

### Auth

- Register, login, logout, refresh, current user.

### Facilities

- Search facility registry/manual records.
- Request facility membership.
- Load active memberships.
- Read/update facility equipment profile for authorized admins.

### Admissions and tracking

- Create admission.
- Load active admissions by facility.
- Load admission details.
- Update admission status/details.
- Create clinical snapshot.
- Create ABG test version.
- Create ventilator setting record.
- Create airway, humidification, daily review, and outcome records.

### Review and dataset

- Load review queue.
- Approve/request correction/exclude.
- Parse ICU note.
- Save dataset import.
- Load pending dataset imports.
- Review dataset import.
- Export approved datasets for approved research roles only.

### References, models, and admin

- Load active references.
- Load admin dashboards.
- Load model versions for approved admin/research roles.
- Activate shadow mode and retire models only from authorized admin screens.

## Request rules

- Include active `facilityId` in facility-scoped queries.
- Include `idempotencyKey` for offline queued writes.
- Use backend IDs after server sync; keep local IDs only for draft/queue management.
- Do not trust frontend-only calculation results as final after save.
- Do not send patient identifiers to external AI endpoints.
- Convert UI `unknown/not available` options into the backend-approved representation.

## Error handling

Show errors by type:

- Auth expired: ask user to log in again or refresh silently if safe.
- Permission denied: explain role/facility access issue.
- Validation error: highlight fields.
- Clinical suspicious/impossible value: show correction/reviewer override path.
- Conflict: show both values and reviewer path.
- Network error: save locally and queue when the action is offline-allowed.

## Role-aware UI

Hide or disable routes/actions the user cannot perform:

- Facility verification: platform admin only.
- Facility equipment profile: facility admin/platform admin.
- Review queue: specialist reviewer/admin roles.
- Dataset export: research/data governance role and approved admins only.
- Model management: platform admin/research governance roles only.

Never rely only on hidden UI for security; backend must enforce permissions too.
