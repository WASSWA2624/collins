import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const debugDir = path.dirname(fileURLToPath(import.meta.url));

export const projectRoot = path.resolve(debugDir, '..', '..');

const shell = process.platform === 'win32';

export const startChild = (command, args, { env = {}, label = command } = {}) => {
  const child = spawn(command, args, {
    cwd: projectRoot,
    env: { ...process.env, ...env },
    shell,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`[collins-debug] Failed to start ${label}: ${error.message}`);
  });

  return child;
};

export const runCommand = (command, args, options = {}) => {
  const child = startChild(command, args, options);

  const stop = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(1);
      return;
    }

    process.exit(code ?? 0);
  });
};
