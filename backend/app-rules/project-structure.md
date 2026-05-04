# Backend Project Structure Rules

```txt
backend/
  app-rules/
  dev-plan.md
  prisma/
    schema.prisma
  src/
    app.js
    server.js
    config/
    constants/
    middleware/
    modules/
      auth/
      health/
      facilities/
      admissions/
      review/
      dataset/
      references/
      admin/
    routes/
    utils/
```

## Naming

- Route files: `domain.routes.js`.
- Controller files: `domain.controller.js`.
- Service files: `domain.service.js`.
- Validator files: `domain.validators.js`.
- Middleware files: `thing.middleware.js`.
- Use plural API resource names.
- Use clear clinical entity names from the write-up.
