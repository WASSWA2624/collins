import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvironmentFile } from '../src/config/envFile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const projectSchemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
const generatedClientPath = path.join(projectRoot, 'node_modules', '.prisma', 'client', 'index.js');
const generatedSchemaPath = path.join(projectRoot, 'node_modules', '.prisma', 'client', 'schema.prisma');

const PLACEHOLDER_TEXT = '@prisma/client did not initialize yet';
const GENERATE_ONLY_DATABASE_URL = 'mysql://collins:collins@localhost:3306/collins';

loadEnvironmentFile({ projectRoot });

const readText = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trimEnd();

const hasGeneratedClient = () => {
  if (!existsSync(generatedClientPath) || !existsSync(generatedSchemaPath)) {
    return false;
  }

  const generatedClient = readText(generatedClientPath);
  const generatedSchema = readText(generatedSchemaPath);
  const projectSchema = readText(projectSchemaPath);

  return !generatedClient.includes(PLACEHOLDER_TEXT) && generatedSchema === projectSchema;
};

if (hasGeneratedClient()) {
  console.log('Prisma Client is already generated.');
  process.exit(0);
}

const generateEnv = { ...process.env };

if (!generateEnv.DATABASE_URL) {
  generateEnv.DATABASE_URL = GENERATE_ONLY_DATABASE_URL;
  console.log('DATABASE_URL is not set; using a generate-only placeholder for Prisma Client.');
}

const prismaExecutable = process.platform === 'win32'
  ? path.join(projectRoot, 'node_modules', '.bin', 'prisma.cmd')
  : path.join(projectRoot, 'node_modules', '.bin', 'prisma');

const result = spawnSync(prismaExecutable, ['generate'], {
  cwd: projectRoot,
  env: generateEnv,
  shell: false,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
