import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvironmentFile } from '../src/config/envFile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const projectSchemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
const generatedClientPath = path.join(projectRoot, 'src', 'generated', 'prisma', 'index.js');
const generatedSchemaPath = path.join(projectRoot, 'src', 'generated', 'prisma', 'schema.prisma');
const generatedClientPackagePath = path.join(projectRoot, 'src', 'generated', 'prisma', 'package.json');
const installedClientPackagePath = path.join(projectRoot, 'node_modules', '@prisma', 'client', 'package.json');
const localTempPath = path.join(projectRoot, 'tmp');

const PLACEHOLDER_TEXT = '@prisma/client did not initialize yet';
const GENERATE_ONLY_DATABASE_URL = 'mysql://collins:collins@localhost:3306/collins';

loadEnvironmentFile({ projectRoot });
mkdirSync(localTempPath, { recursive: true });

const readText = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trimEnd();
const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));

const hasGeneratedClient = () => {
  if (
    !existsSync(generatedClientPath)
    || !existsSync(generatedSchemaPath)
    || !existsSync(generatedClientPackagePath)
    || !existsSync(installedClientPackagePath)
  ) {
    return false;
  }

  const generatedClient = readText(generatedClientPath);
  const generatedSchema = readText(generatedSchemaPath);
  const projectSchema = readText(projectSchemaPath);
  const generatedClientPackage = readJson(generatedClientPackagePath);
  const installedClientPackage = readJson(installedClientPackagePath);

  return !generatedClient.includes(PLACEHOLDER_TEXT)
    && generatedSchema === projectSchema
    && generatedClientPackage.version === installedClientPackage.version;
};

if (hasGeneratedClient()) {
  console.log('Prisma Client is already generated.');
  process.exit(0);
}

const generateEnv = { ...process.env };
generateEnv.TMPDIR = localTempPath;
generateEnv.TMP = localTempPath;
generateEnv.TEMP = localTempPath;
generateEnv.PRISMA_TMPDIR = localTempPath;

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
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
