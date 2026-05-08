import { existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const projectRequire = createRequire(path.join(projectRoot, 'package.json'));
const appNodeModulesPath = path.join(projectRoot, 'node_modules');
const prismaGenerateScriptPath = path.join(projectRoot, 'scripts', 'prisma-generate-if-needed.mjs');
const generatedClientPath = path.join(projectRoot, 'src', 'generated', 'prisma', 'index.js');
const generatedClientPackagePath = path.join(projectRoot, 'src', 'generated', 'prisma', 'package.json');
const installedClientPackagePath = path.join(appNodeModulesPath, '@prisma', 'client', 'package.json');
const localTempPath = path.join(projectRoot, 'tmp');
const PLACEHOLDER_TEXT = '@prisma/client did not initialize yet';
const REQUIRED_RUNTIME_PACKAGES = ['express', '@prisma/client', '@prisma/adapter-mariadb', 'mariadb'];

process.env.COLLINS_ENV ||= 'production';
process.env.NODE_ENV ||= 'production';

const canResolvePackage = (packageName) => {
  try {
    projectRequire.resolve(packageName);
    return true;
  } catch {
    return false;
  }
};

const getCandidateNodeModulePaths = () => {
  const candidates = [];

  for (const entry of String(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)) {
    candidates.push(path.basename(entry) === 'node_modules' ? entry : path.join(entry, 'node_modules'));
  }

  if (process.env.VIRTUAL_ENV) {
    candidates.push(path.join(process.env.VIRTUAL_ENV, 'lib', 'node_modules'));
  }

  candidates.push(path.resolve(path.dirname(process.execPath), '..', 'lib', 'node_modules'));
  candidates.push(path.join(process.cwd(), 'node_modules'));

  return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
};

const hasPackageAt = (nodeModulesPath, packageName) => {
  const packagePath = path.join(nodeModulesPath, ...packageName.split('/'), 'package.json');
  return existsSync(packagePath);
};

const hasRequiredRuntimePackages = (nodeModulesPath) => (
  REQUIRED_RUNTIME_PACKAGES.every((packageName) => hasPackageAt(nodeModulesPath, packageName))
);

const readJsonFile = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));

const ensureAppNodeModulesPath = () => {
  if (hasRequiredRuntimePackages(appNodeModulesPath)) return;

  const virtualEnvNodeModulesPath = getCandidateNodeModulePaths()
    .find((candidate) => hasRequiredRuntimePackages(candidate));

  if (!virtualEnvNodeModulesPath) return;

  if (existsSync(appNodeModulesPath)) {
    throw new Error(
      `Backend dependencies are incomplete in ${appNodeModulesPath}. `
      + 'Remove the app-root node_modules directory and restart so DirectAdmin can link '
      + `the virtualenv dependencies from ${virtualEnvNodeModulesPath}.`,
    );
  }

  symlinkSync(
    virtualEnvNodeModulesPath,
    appNodeModulesPath,
    process.platform === 'win32' ? 'junction' : 'dir',
  );
};

const hasGeneratedPrismaClient = () => {
  if (
    !existsSync(generatedClientPath)
    || !existsSync(generatedClientPackagePath)
    || !existsSync(installedClientPackagePath)
  ) {
    return false;
  }

  const generatedClient = readFileSync(generatedClientPath, 'utf8');
  const generatedClientPackage = readJsonFile(generatedClientPackagePath);
  const installedClientPackage = readJsonFile(installedClientPackagePath);

  return !generatedClient.includes(PLACEHOLDER_TEXT)
    && generatedClientPackage.version === installedClientPackage.version;
};

const ensurePrismaClient = () => {
  if (hasGeneratedPrismaClient()) return;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Generated Prisma Client is missing or does not match @prisma/client. '
      + 'Upload a deployment zip that includes src/generated/prisma from this repository. '
      + 'The production server does not run prisma generate because shared hosting quotas can block it.',
    );
  }

  mkdirSync(localTempPath, { recursive: true });

  const result = spawnSync(process.execPath, [prismaGenerateScriptPath, '--env=production'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      TMPDIR: localTempPath,
      TMP: localTempPath,
      TEMP: localTempPath,
      PRISMA_TMPDIR: localTempPath,
    },
    shell: false,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Prisma Client generation failed with exit code ${result.status}.`);
  }
};

const start = async () => {
  ensureAppNodeModulesPath();

  if (!canResolvePackage('express')) {
    throw new Error('Backend dependencies are missing. Run npm install from the backend application root.');
  }

  ensurePrismaClient();

  const [{ createApp }, { env }, { prisma }] = await Promise.all([
    import('./app.js'),
    import('./config/env.js'),
    import('./config/prisma.js'),
  ]);

  const app = createApp();
  const server = app.listen(env.port, env.host, () => {
    const hostLabel = env.host === '0.0.0.0' || env.host === '::'
      ? 'all network interfaces'
      : env.host;
    console.log(`AI Vent backend listening on ${hostLabel}:${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down AI Vent backend.`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
