/**
 * Run adb logcat and write to debug/android-debug.log (and stream to terminal).
 * Overwrites the log file each run. Run: npm run debug:android
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findAdb() {
  const env = process.env;
  const isWin = process.platform === 'win32';
  const candidates = [];
  if (env.ANDROID_HOME) candidates.push(path.join(env.ANDROID_HOME, 'platform-tools', isWin ? 'adb.exe' : 'adb'));
  if (env.ANDROID_SDK_ROOT) candidates.push(path.join(env.ANDROID_SDK_ROOT, 'platform-tools', isWin ? 'adb.exe' : 'adb'));
  if (isWin && env.LOCALAPPDATA) {
    candidates.push(path.join(env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe'));
  }
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}

const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'android-debug.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const adbPath = findAdb();
if (!adbPath) {
  console.error('adb not found. Set ANDROID_HOME or add platform-tools to PATH.');
  process.exit(1);
}

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();
logStream.write(`--- logcat started ${timestamp()} ---\n`);

const child = spawn(adbPath, ['logcat', '-v', 'time'], {
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
  const msg = `[${timestamp()}] adb error: ${err.message}\n`;
  logStream.write(msg);
  process.stderr.write(msg);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  logStream.write(`--- logcat ended ${timestamp()} code=${code} signal=${signal} ---\n`);
  logStream.end();
  process.exit(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
