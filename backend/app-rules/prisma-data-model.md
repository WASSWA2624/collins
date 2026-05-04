# Prisma and Data Model Rules

## Schema principles

- Keep the Prisma schema aligned with `../app-write-up.md`.
- Use CUID string IDs for portability.
- Use explicit timestamps on mutable records.
- Use enums for stable status and role fields.
- Use JSON fields for flexible clinical profiles only where schema variance is expected.

## Data quality layers

Keep these layers separate:

1. Reference/evidence rules.
2. Facility clinical data.
3. Specialist-reviewed, approved training dataset records.

## Migration rules

- Generate migrations only after model review.
- Do not edit production migrations manually without review.
- Include seed data for roles, demo mode, and approved reference rules in a controlled seed script later.
