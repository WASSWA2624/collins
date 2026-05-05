import { startChild } from './process-utils.mjs';

const webLogEndpoint = process.env.EXPO_PUBLIC_WEB_LOG_ENDPOINT || 'http://127.0.0.1:8787/logs';
const children = [
  startChild('node', ['scripts/debug/web-log-receiver.mjs'], {
    label: 'web log receiver',
  }),
  startChild('npx', ['expo', 'start', '--clear'], {
    label: 'Expo debug startup',
    env: { EXPO_PUBLIC_WEB_LOG_ENDPOINT: webLogEndpoint },
  }),
];

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  children.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });

  setTimeout(() => process.exit(code), 250).unref();
};

process.on('SIGINT', () => shutdown(1));
process.on('SIGTERM', () => shutdown(1));

children.forEach((child) => {
  child.on('exit', (code) => {
    shutdown(code ?? 0);
  });
});

