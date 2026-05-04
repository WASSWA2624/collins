# Backend API Conventions

## Base path and versioning

- Runtime base path: `/api/${API_VERSION}`.
- Default version: `/api/v1`.
- Keep the app write-up endpoint names as logical resources, then expose them under the configured versioned base path.
- Breaking response or validation changes require a new API version or a compatibility layer.

## Standard response shape

Successful responses:

```json
{
  "success": true,
  "message": "Readable message",
  "data": {},
  "meta": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Readable error",
  "errors": [],
  "meta": {
    "requestId": "optional-request-id"
  }
}
```

Clinical decision-support responses should include rule/source metadata when implemented:

```json
{
  "value": 145,
  "unit": "ratio",
  "status": "calculated",
  "message": "P/F ratio calculated from same-time PaO2 and FiO2.",
  "ruleVersion": "oxygenation-rules@2026-05-01"
}
```

## Required endpoint groups

Expose these groups under `/api/v1` as implementation reaches each phase:

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`

### Facilities and memberships

- `GET /facilities/search`
- `POST /facilities`
- `POST /facilities/:id/request-verification`
- `PATCH /admin/facilities/:id/verify`
- `GET /facilities/:id/equipment-profile`
- `PATCH /facilities/:id/equipment-profile`
- `POST /facilities/:id/memberships/request`
- `PATCH /facilities/:id/memberships/:membershipId`
- `GET /me/facilities`

### Admissions and tracking

- `POST /admissions`
- `GET /admissions?facilityId=&status=active`
- `GET /admissions/:id`
- `PATCH /admissions/:id`
- `POST /admissions/:id/clinical-snapshots`
- `POST /admissions/:id/abg-tests`
- `POST /admissions/:id/ventilator-settings`
- `POST /admissions/:id/airway-device`
- `POST /admissions/:id/humidification`
- `POST /admissions/:id/daily-review`
- `POST /admissions/:id/outcome`

### Review and dataset

- `GET /review/queue`
- `POST /review/:entityType/:entityId/approve`
- `POST /review/:entityType/:entityId/request-correction`
- `POST /review/:entityType/:entityId/exclude`
- `POST /dataset-imports/parse-note`
- `POST /dataset-imports`
- `GET /dataset-imports/pending-review`
- `POST /dataset-imports/:id/review`
- `GET /datasets/approved`
- `POST /datasets/:id/export`

### References, models, and admin

- `GET /references/active`
- `POST /admin/references`
- `GET /models/versions`
- `POST /admin/models/:id/activate-shadow-mode`
- `POST /admin/models/:id/retire`
- `GET /admin/dashboard`
- `GET /admin/facilities`
- `GET /admin/audit-logs`
- `GET /admin/dataset-quality`
- `GET /admin/model-monitoring`

## Request rules

- Validate `body`, `params`, and `query` with Zod.
- Require `facilityId` for patient-level list queries unless the authenticated context has exactly one active facility and the route explicitly allows defaulting.
- Accept `unknown`, `not_available`, or `null` for clinically missing fields where the app write-up says saving should not be blocked.
- Reject impossible values unless a reviewer override workflow exists for that endpoint.
- Never accept client-calculated safety flags as trusted; recalculate server-side.

## Clinical write rules

- Admission creation may include patient, clinical snapshot, first ABG, first ventilator setting, airway, and humidification data in one transaction.
- Repeat ABG writes must create a new `AbgTest.version`; never overwrite the previous ABG.
- Repeat ventilator settings must create a new time-stamped record.
- Reviewer changes must preserve the original data, reviewer data, review reason, and audit entry.
- Dataset export must require approved role, de-identification, ethics/governance metadata, and audit logging.

## Pagination, sorting, and filters

Use query params:

- `page`
- `limit`
- `sortBy`
- `sortOrder`
- `facilityId`
- `status`
- `reviewStatus`
- `patientPathway`
- `from`
- `to`

Return pagination metadata:

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "hasNextPage": true
  }
}
```

## Offline idempotency

Queued offline writes should include:

- `idempotencyKey`
- `clientRecordId` when available
- `clientCreatedAt`
- `clientUpdatedAt`
- `syncAttempt`
- `deviceId` or client installation id where policy permits

The backend must return one of: `synced`, `duplicate`, `conflict`, `failed_validation`, or `needs_review`.

## Error behavior

- `400` for malformed or impossible input.
- `401` for unauthenticated requests.
- `403` for missing role/facility permission.
- `404` only when the user is allowed to know the resource could exist; otherwise prefer `403`.
- `409` for sync conflicts or duplicate idempotency keys with different payloads.
- `422` for clinically suspicious values needing correction or reviewer override.
