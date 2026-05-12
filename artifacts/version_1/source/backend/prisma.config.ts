import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, env } from 'prisma/config';
import { loadEnvironmentFile } from './src/config/envFile.js';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

loadEnvironmentFile({ projectRoot });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.mjs',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
