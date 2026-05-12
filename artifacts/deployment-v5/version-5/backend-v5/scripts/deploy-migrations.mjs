import crypto from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as mariadb from 'mariadb';
import { env } from '../src/config/env.js';
import { createMariaDbAdapterConfig } from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const migrationsPath = path.join(projectRoot, 'prisma', 'migrations');

const ensureMigrationsTableSql = `
CREATE TABLE IF NOT EXISTS _prisma_migrations (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  checksum VARCHAR(64) NOT NULL,
  finished_at DATETIME(3) NULL,
  migration_name VARCHAR(255) NOT NULL,
  logs TEXT NULL,
  rolled_back_at DATETIME(3) NULL,
  started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  applied_steps_count INT UNSIGNED NOT NULL DEFAULT 0
)`;

const getMigrationDirectories = async () => {
  if (!existsSync(migrationsPath)) {
    throw new Error(`Migrations folder not found: ${migrationsPath}`);
  }

  const entries = await readdir(migrationsPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

const getAppliedMigrations = async (connection) => {
  const rows = await connection.query(
    'SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL'
  );
  return new Set(rows.map((row) => row.migration_name));
};

const checksumSql = (sql) => crypto.createHash('sha256').update(sql).digest('hex');

const applyMigration = async (connection, migrationName) => {
  const sqlPath = path.join(migrationsPath, migrationName, 'migration.sql');
  const sql = await readFile(sqlPath, 'utf8');
  const migrationId = crypto.randomUUID();

  await connection.beginTransaction();
  try {
    await connection.query(
      `INSERT INTO _prisma_migrations
        (id, checksum, migration_name, started_at, applied_steps_count)
       VALUES (?, ?, ?, NOW(3), 0)`,
      [migrationId, checksumSql(sql), migrationName]
    );
    await connection.query(sql);
    await connection.query(
      `UPDATE _prisma_migrations
       SET finished_at = NOW(3), applied_steps_count = 1
       WHERE id = ?`,
      [migrationId]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    await connection.query(
      `INSERT INTO _prisma_migrations
        (id, checksum, migration_name, started_at, logs, applied_steps_count)
       VALUES (?, ?, ?, NOW(3), ?, 0)
       ON DUPLICATE KEY UPDATE logs = VALUES(logs)`,
      [migrationId, checksumSql(sql), migrationName, error?.message || String(error)]
    );
    throw error;
  }
};

const main = async () => {
  await mkdir(path.join(projectRoot, 'tmp'), { recursive: true });

  const connectionConfig = {
    ...createMariaDbAdapterConfig(env.databaseUrl, {
      host: env.databaseHost,
      port: env.databasePort,
      socketPath: env.databaseSocketPath,
      connectionLimit: 1,
      connectTimeoutMs: env.databaseConnectTimeoutMs,
      acquireTimeoutMs: env.databaseAcquireTimeoutMs,
    }),
    multipleStatements: true,
  };

  const connection = await mariadb.createConnection(connectionConfig);
  try {
    await connection.query(ensureMigrationsTableSql);

    const migrations = await getMigrationDirectories();
    const applied = await getAppliedMigrations(connection);
    let appliedCount = 0;

    for (const migrationName of migrations) {
      if (applied.has(migrationName)) {
        console.log(`Skipping already applied migration ${migrationName}`);
        continue;
      }

      console.log(`Applying migration ${migrationName}`);
      await applyMigration(connection, migrationName);
      appliedCount += 1;
    }

    console.log(`Database migrations are up to date. Applied ${appliedCount} new migration(s).`);
  } finally {
    await connection.end();
  }
};

main().catch((error) => {
  console.error('Database migration deploy failed', {
    name: error?.name,
    code: error?.code,
    errno: error?.errno,
    sqlState: error?.sqlState,
    message: error?.message,
  });
  process.exit(1);
});
