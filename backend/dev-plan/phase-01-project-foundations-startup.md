# Phase 01 - Project Foundations And Startup Checks

## Goal

Make the backend reliably start in the supported Node.js 20+ development environment before feature work continues.

## Inspect And Reuse First

- Inspect `src/app.js`, `src/server.js`, environment loading, Prisma client setup, package scripts, generated Prisma output, health routes, tests, and lockfiles.
- Reuse the existing Express 5 ESM app, `/api/v1` router mounting, response helpers, error middleware, Prisma configuration, and clinical helper test structure when compliant.

## Implementation Scope

- Keep startup checks small: environment validation, Prisma generate workflow, health endpoint behavior, and development scripts.
- Confirm Node.js version assumptions are documented in scripts or developer docs without forcing incompatible runtime behavior.
- Confirm backend startup does not require frontend, Expo, or clinical dataset assets.
- Preserve standard response shapes for health and root endpoints.
- Keep all clinical helper modules pure and side-effect free.

## Cleanup During Future Work

- Remove obsolete startup scripts, duplicated environment examples, or unused generated-client paths only after the working startup path is verified.
- Do not remove compatibility shims if tests or documented developer workflows still require them.

## Future Tests

- Startup/config tests for required environment variables and safe defaults.
- Prisma client initialization or mocked service tests that catch missing generated-client paths.
- Health route contract tests for `/api/v1/health`.
