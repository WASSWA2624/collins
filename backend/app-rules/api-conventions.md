# Backend API Conventions

## Versioning

- Default API namespace: `/api/v1`.
- Do not break existing versioned contracts without a new version.

## Response shape

Successful responses:

```json
{
  "success": true,
  "message": "Readable message",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Readable error",
  "errors": []
}
```

## Pagination

Use query params:

- `page`
- `limit`
- `sortBy`
- `sortOrder`

Return pagination metadata when listing records.

## Endpoint groups

Follow the app write-up groups:

- `/auth`
- `/facilities`
- `/me/facilities`
- `/admissions`
- `/review`
- `/dataset-imports`
- `/datasets`
- `/references`
- `/models`
- `/admin`

## Idempotency

Offline sync and queued clinical writes should use idempotency keys before production rollout.
