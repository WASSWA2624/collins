/**
 * Start Expo (Metro) and tee stdout/stderr to debug/expo-debug.log.
 * Overwrites the log file each run. Run: npm run debug:expo
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'expo-debug.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();

function tee(data, isStderr) {
  const line = data.toString();
  const prefixed = `[${timestamp()}] ${isStderr ? 'STDERR: ' : ''}${line}`;
  logStream.write(prefixed);
  if (!logStream.write(line)) logStream.once('drain', () => {});
}

const child = spawn('npx', ['expo', 'start', '--clear'], {
  cwd: projectRoot,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
  env: { ...process.env, FORCE_COLOR: '1' },
});

child.stdout.on('data', (data) => { process.stdout.write(data); tee(data, false); });
child.stderr.on('data', (data) => { process.stderr.write(data); tee(data, true); });

child.on('error', (err) => {
  const msg = `[${timestamp()}] Process error: ${err.message}\n`;
  process.stderr.write(msg);
  logStream.write(msg);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  logStream.write(`[${timestamp()}] Process exited code=${code} signal=${signal}\n`);
  logStream.end();
  process.exit(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
