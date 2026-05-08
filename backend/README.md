# AI Vent Backend

Express + Prisma backend foundation for the AI Vent ventilation admission, tracking, review, and dataset governance app.

## Setup

Use Node.js 20 or newer. The `package.json` `engines` field documents this baseline without adding a hard runtime gate.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure the environment-specific file before starting the backend. Do not rename or delete env files:

- `.env.development` is loaded by `npm run dev`, tests, and local Prisma commands.
- `.env.production` is loaded by `npm start` and production Prisma deployment commands.

To override automatic selection, set `COLLINS_ENV`, `APP_ENV`, or `NODE_ENV` to `development` or `production`, or pass `--env=development` / `--env=production`.

Backend env variables:

| Variable | Development | Production | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | `development` | `production` | Selects runtime behavior and validation mode. |
| `HOST` | `0.0.0.0` | `0.0.0.0` | Network interface for Express to bind. |
| `PORT` | `3000` | `3000` | Backend HTTP port. |
| `API_VERSION` | `v1` | `v1` | API namespace used under `/api/{version}`. |
| `DATABASE_URL` | Local MySQL database | Production MySQL database | Prisma connection string. |
| `JWT_SECRET` | Local-only secret | Strong production secret | JWT signing secret. |
| `JWT_EXPIRES_IN` | Shorter local expiry | Production expiry | JWT token lifetime. |
| `CORS_ORIGIN` | Local Expo/web origins | Production web origins | Comma-separated allowed browser origins. |
| `BCRYPT_SALT_ROUNDS` | `12` | `12` | Password hash work factor. |
| `REQUEST_LOGGING` | `true` | `true` | Enables request logging. |

Local development admin login:

```txt
Email: admin@admin.com
Password: Admin
```

Local development clinician login:

```txt
Email: clinician@clinician.com
Password: Clinician
```

Default API namespace:

```txt
/api/v1
```

Health check:

```txt
GET /api/v1/health
```

Local LAN access:

```txt
HOST=0.0.0.0
```

The development default binds the backend to all network interfaces so Expo clients on the same Wi-Fi/LAN can reach `http://<computer-lan-ip>:3000`.

Training/help content:

```txt
GET /api/v1/training-help
```

`npm run dev`, `npm start`, and `npm test` run Prisma Client generation first. Production hosting should run `npm run prisma:generate:production` after dependency installation and before restart if the host starts the configured startup file directly instead of running `npm start`. Generation does not require a live MySQL connection, but runtime startup requires `DATABASE_URL` in the selected `.env.development` or `.env.production` file. The backend starts independently from the frontend, Expo, and clinical dataset assets.

## cPanel deployment

Use the backend folder as the Node.js application root and Node.js 20 or newer.

Recommended cPanel startup file:

```txt
cpanel-start.cjs
```

Before starting the app, edit `.env.production` on cPanel:

```txt
NODE_ENV=production
HOST=0.0.0.0
PORT=<cPanel assigned port or 3000>
DATABASE_URL=mysql://<database_user>:<database_password>@localhost:3306/<database_name>
JWT_SECRET=<strong unique production secret>
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

Run these commands from the backend application directory after upload:

```bash
npm install
npm run prisma:generate:production
npm run prisma:migrate:deploy
npm run prisma:seed
npm start
```

Only run `npm run prisma:seed` when the target database should receive the default administrator, clinician, facility, and reference-rule seed data. For an already populated production database, run migrations without seeding.

Deployment health checks:

```txt
GET /
GET /api/v1/health
GET /ready
```

Database setup for a clean local MySQL database:

```bash
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm test
```

The seed command adds local development platform-admin and clinician users, a verified development facility for those users, a disabled development reference-seed user, and verified MVP reference/evidence ranges. It does not seed patients, admissions, raw notes, demo cases, or approved training datasets.

## Safety position

This backend supports documentation, calculations, validation, audit, review, and governance. It must not autonomously diagnose, prescribe, intubate, extubate, or set ventilator values.
