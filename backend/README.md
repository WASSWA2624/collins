# AI Vent Backend

Express + Prisma backend foundation for the AI Vent ventilation admission, tracking, review, and dataset governance app.

## Setup

Use Node.js 20 or newer. The `package.json` `engines` field documents this baseline without adding a hard runtime gate.

```bash
npm install --include=dev
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
| `DATABASE_USE_TEXT_PROTOCOL` | `true` | `true` | Uses MariaDB text protocol for better shared-hosting compatibility. |
| `DATABASE_CONNECTION_LIMIT` | `5` | `5` | MariaDB pool size. |
| `DATABASE_CONNECT_TIMEOUT_MS` | `10000` | `10000` | MariaDB connection timeout. |
| `DATABASE_SOCKET_PATH` | Optional | Optional | Explicit local MySQL socket path when the host requires socket connections. |
| `JWT_SECRET` | Local-only secret | Strong production secret | JWT signing secret. |
| `JWT_EXPIRES_IN` | Shorter local expiry | Production expiry | JWT token lifetime. |
| `CORS_ORIGIN` | Local Expo/web origins | Production web origins | Comma-separated allowed browser origins. |
| `BCRYPT_SALT_ROUNDS` | `12` | `12` | Password hash work factor. |
| `TRUST_PROXY` | `false` | `1` | Number of reverse proxies in front of Express. DirectAdmin/LiteSpeed should use `1`. |
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

`npm run dev`, `npm test`, and deployment packaging run Prisma Client generation before the app is shipped. Production startup uses the generated client committed into the deployment zip, so shared hosting does not need to run Prisma CLI. Generation does not require a live MySQL connection, but runtime startup requires `DATABASE_URL` in the selected `.env.development` or `.env.production` file. The backend starts independently from the frontend, Expo, and clinical dataset assets.

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
DATABASE_URL=mysql://<database_user>:<database_password>@127.0.0.1:3306/<database_name>
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USE_TEXT_PROTOCOL=true
DATABASE_CONNECTION_LIMIT=1
DATABASE_CONNECT_TIMEOUT_MS=10000
DATABASE_ACQUIRE_TIMEOUT_MS=10000
# DATABASE_SOCKET_PATH=/var/lib/mysql/mysql.sock
JWT_SECRET=<strong unique production secret>
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
TRUST_PROXY=1
```

Run these commands from the backend application directory after upload:

```bash
npm install
npm run db:migrate:deploy
npm start
```

The shared-hosting deployment package already contains `src/generated/prisma`, and `.npmrc` omits dev dependencies and install scripts. Do not run `npm run prisma:generate:production` on a quota-limited hosting account. `npm run db:migrate:deploy` uses the installed MariaDB runtime package to create or update production tables without Prisma CLI.

Deployment health checks:

```txt
GET /
GET /api/v1/health
GET /ready
```

## DirectAdmin deployment

The DirectAdmin Node.js screen can use:

```txt
Application root: collins-backend
Application URL: api.zelah.co.ug/
Application startup file: src/server.js
Application mode: Production
Node.js version: 20.x
```

DirectAdmin may install packages under `nodevenv/.../lib/node_modules` instead of directly under the application root. The startup file handles that layout by linking the virtualenv `node_modules` into the app root when needed. The production deployment zip includes the generated Prisma Client at `src/generated/prisma`, so the server does not run `prisma generate` on shared hosting.

If `/ready` returns `Database connection is unavailable` while `/live` works, the app is running but MariaDB is not reachable from Node. The production config uses Prisma's text protocol, one database connection, and `127.0.0.1` by default for better shared-hosting compatibility. If your host provides a socket path, set `DATABASE_SOCKET_PATH` in `.env.production`, restart the app, then check `/ready` again.

If `/ready` connects but login fails because tables are missing, run `npm run db:migrate:deploy` from `/home/zelahco/collins-backend`, restart the Node.js app, then test `/ready` and login again.

Before replacing an older upload, remove any stale app-root `node_modules` and `tmp` directories so startup can create a clean link and temp directory.

The project `.npmrc` makes DirectAdmin's plain `npm install` production-only by omitting dev dependencies, install scripts, audit, funding checks, and npm log files. This keeps ESLint, Nodemon, and Prisma CLI off the hosting account and avoids generating Prisma Client during install or startup. If the host still reports `Unknown system error -122`, the account disk or inode quota is already full and files must be deleted before npm can create runtime dependencies.

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
