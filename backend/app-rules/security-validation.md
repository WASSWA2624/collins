# Backend Security and Validation Rules

## Authentication and authorization

- Hash all passwords with bcrypt.
- Use short-lived access tokens and refresh-token rotation before production.
- Enforce role-based access through facility memberships.
- Use least privilege by default.

## Privacy

- Minimize patient identifiers.
- Keep facility-level data isolated.
- Never expose password hashes or secrets.
- Do not include patient identifiers in model payloads or external AI requests.
- Add de-identification before any dataset export.

## Audit

Audit these events:

- clinical record create/update/delete;
- reviewer approval/correction/exclusion;
- export events;
- override events;
- auth-sensitive events;
- reference rule changes;
- model version activation/retirement.

## Validation

- Validate `body`, `params`, and `query` with Zod.
- Numeric clinical fields require realistic bounds and units.
- Accept missing ICU data explicitly through nullable fields or `unknown` values when appropriate.
- Reject impossible values early and return actionable errors.
