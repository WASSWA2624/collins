/**
 * Stream iOS simulator/device logs to debug/ios-debug.log (and terminal).
 * Overwrites the log file each run. Requires macOS and a booted simulator.
 * Run: npm run debug:ios
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

if (process.platform !== 'darwin') {
  console.error('iOS logging requires macOS (Xcode / xcrun).');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'ios-debug.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();
logStream.write(`--- iOS log stream started ${timestamp()} ---\n`);

const child = spawn('xcrun', ['simctl', 'spawn', 'booted', 'log', 'stream'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: false,
});

function tee(data, dest) {
  logStream.write(data);
  dest.write(data);
}

child.stdout.on('data', (data) => tee(data, process.stdout));
child.stderr.on('data', (data) => tee(data, process.stderr));

child.on('error', (err) => {
  const msg = `[${timestamp()}] iOS log error: ${err.message}\n`;
  logStream.write(msg);
  process.stderr.write(msg);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  logStream.write(`--- iOS log stream ended ${timestamp()} code=${code} signal=${signal} ---\n`);
  logStream.end();
  process.exit(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
