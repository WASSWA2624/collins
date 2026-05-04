# Backend App Rules

These rules define the backend standard for Collins ICU ventilation decision-support.

## Rule files

- `architecture.md` — backend layering and module boundaries.
- `project-structure.md` — required folder structure and naming conventions.
- `api-conventions.md` — route, request, response, pagination, and versioning rules.
- `security-validation.md` — auth, authorization, privacy, audit, and validation rules.
- `prisma-data-model.md` — Prisma and data-model standards.
- `testing.md` — backend testing expectations.

## Non-negotiables

- Do not make autonomous clinical treatment decisions.
- Do not train or guide care from unreviewed records.
- Audit every clinical edit, review action, export, override, and model activation.
- Enforce facility-level data isolation.
- Keep patient identifiers minimized and protected.
