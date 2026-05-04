# Backend Architecture Rules

## Stack

- Node.js 20+.
- Express.js API.
- Prisma ORM.
- MySQL database.
- Zod validation.
- JWT/session-based authentication foundation.

## Layers

- `src/app.js` wires global middleware and API routes.
- `src/server.js` starts the HTTP server.
- `src/config/` owns environment and database clients.
- `src/middleware/` owns request validation, auth, errors, and not-found handling.
- `src/modules/<domain>/` owns routes, controllers, services, and validators for one domain.
- `src/utils/` owns shared helpers.

## Domain modules

Initial backend domains:

- health;
- auth;
- facilities and memberships;
- admissions and tracking;
- review;
- dataset imports and approved datasets;
- reference rules and model versions;
- admin dashboards and audit logs.

## Clinical safety

- Backend may calculate, validate, flag, and audit.
- Backend must not silently change clinician-entered ventilator settings.
- Any rule/model output must include source/version metadata when implemented.
