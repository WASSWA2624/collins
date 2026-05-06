# AI Vent Backend

Express + Prisma backend foundation for the AI Vent ventilation admission, tracking, review, and dataset governance app.

## Setup

Use Node.js 20 or newer. The `package.json` `engines` field documents this baseline without adding a hard runtime gate.

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Local development admin login:

```txt
Email: admin@admin.com
Password: Admin
```

Default API namespace:

```txt
/api/v1
```

Health check:

```txt
GET /api/v1/health
```

Training/help content:

```txt
GET /api/v1/training-help
```

`npm install`, `npm run dev`, `npm start`, and `npm test` run Prisma Client generation first. Generation does not require a live MySQL connection, but runtime startup requires `DATABASE_URL` in `.env`. The backend starts independently from the frontend, Expo, and clinical dataset assets.

Database setup for a clean local MySQL database:

```bash
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm test
```

The seed command adds a local development platform-admin user, a verified development facility for that user, a disabled development reference-seed user, and verified MVP reference/evidence ranges. It does not seed patients, admissions, raw notes, demo cases, or approved training datasets.

## Safety position

This backend supports documentation, calculations, validation, audit, review, and governance. It must not autonomously diagnose, prescribe, intubate, extubate, or set ventilator values.
