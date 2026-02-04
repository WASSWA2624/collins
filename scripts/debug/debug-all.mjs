/**
 * Start Expo, Android logcat, and iOS log stream together (all stream to terminal and overwrite debug/*.log).
 * Run: npm run debug:all
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectRoot = path.resolve(__dirname, '..', '..');
const scriptsDebugDir = __dirname;

const expo = spawn('node', [path.join(scriptsDebugDir, 'expo-with-logging.mjs')], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

const android = spawn('node', [path.join(scriptsDebugDir, 'android-debug-logcat.mjs')], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

let ios;
if (process.platform === 'darwin') {
  ios = spawn('node', [path.join(scriptsDebugDir, 'ios-debug-logcat.mjs')], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });
  ios.on('error', (err) => {
    console.error('iOS debug process error:', err);
  });
}

function killAll() {
  expo.kill('SIGINT');
  android.kill('SIGINT');
  if (ios) ios.kill('SIGINT');
}

expo.on('error', (err) => {
  console.error('Expo debug process error:', err);
  killAll();
  process.exit(1);
});
android.on('error', (err) => {
  console.error('Android debug process error:', err);
  killAll();
  process.exit(1);
});

expo.on('exit', (code) => {
  if (code !== 0 && code !== null) { android.kill('SIGINT'); if (ios) ios.kill('SIGINT'); }
});
android.on('exit', (code) => {
  if (code !== 0 && code !== null) { expo.kill('SIGINT'); if (ios) ios.kill('SIGINT'); }
});
if (ios) ios.on('exit', (code) => {
  if (code !== 0 && code !== null) { expo.kill('SIGINT'); android.kill('SIGINT'); }
});

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);
