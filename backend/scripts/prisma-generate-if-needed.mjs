import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const generatedClientPath = path.join(projectRoot, 'node_modules', '.prisma', 'client', 'index.js');
const generatedSchemaPath = path.join(projectRoot, 'node_modules', '.prisma', 'client', 'schema.prisma');

const PLACEHOLDER_TEXT = '@prisma/client did not initialize yet';

const readText = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const hasGeneratedClient = () => {
  if (!existsSync(generatedClientPath) || !existsSync(generatedSchemaPath)) {
    return false;
  }

  const generatedClient = readText(generatedClientPath);
  return !generatedClient.includes(PLACEHOLDER_TEXT);
};

if (hasGeneratedClient()) {
  console.log('Prisma Client is already generated.');
  process.exit(0);
}

const result = spawnSync('npx', ['prisma', 'generate'], {
  cwd: projectRoot,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
