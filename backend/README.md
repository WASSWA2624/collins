# Collins Backend

Express + Prisma backend foundation for the Collins ICU ventilation admission, tracking, review, and dataset governance app.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Default API namespace:

```txt
/api/v1
```

## Safety position

This backend supports documentation, calculations, validation, audit, review, and governance. It must not autonomously diagnose, prescribe, intubate, extubate, or set ventilator values.
