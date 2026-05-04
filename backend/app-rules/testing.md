# Backend Testing Rules

## Minimum test areas

- Health endpoint.
- Environment validation.
- Auth registration/login and protected routes.
- Facility membership permissions.
- Admission creation and tracking writes.
- Zod validation errors.
- Audit log creation.
- Review and dataset approval workflows.

## Safety tests

- Verify that unreviewed data cannot be exported as approved training data.
- Verify that facility users cannot access other facility records.
- Verify that patient identifiers are removed from de-identified dataset payloads.
- Verify that clinical outputs are recorded with rule/model source version when implemented.
