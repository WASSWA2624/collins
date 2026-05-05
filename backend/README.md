# Collins Backend

Express + Prisma backend foundation for the Collins ICU ventilation admission, tracking, review, and dataset governance app.

## Setup

Use Node.js 20 or newer. The `package.json` `engines` field documents this baseline without adding a hard runtime gate.

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

Health check:

```txt
GET /api/v1/health
```

`npm install`, `npm run dev`, `npm start`, and `npm test` run Prisma Client generation first. Generation does not require a live MySQL connection, but runtime startup requires `DATABASE_URL` in `.env`. The backend starts independently from the frontend, Expo, and clinical dataset assets.

## Safety position

This backend supports documentation, calculations, validation, audit, review, and governance. It must not autonomously diagnose, prescribe, intubate, extubate, or set ventilator values.
