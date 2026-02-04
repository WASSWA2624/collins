/**
 * Development-only: intercept console.log/warn/error on web and send to debug log receiver.
 * Persists to debug/web-debug.log when scripts/web-log-receiver.cjs is running.
 * No-op on native and in production; safe to import from root layout.
 */
const LOG_RECEIVER_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEBUG_LOG_URL) ||
  'http://127.0.0.1:9966/log';

function isWebDev() {
  return typeof __DEV__ !== 'undefined' && __DEV__ && typeof document !== 'undefined';
}

function formatArgs(args) {
  return args
    .map((a) => {
      if (a instanceof Error) return `${a.message}\n${a.stack || ''}`;
      if (typeof a === 'object') try { return JSON.stringify(a); } catch { return String(a); }
      return String(a);
    })
    .join(' ');
}

function send(level, message) {
  try {
    fetch(LOG_RECEIVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

if (isWebDev()) {
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  console.log = function (...args) {
    origLog.apply(console, args);
    send('log', formatArgs(args));
  };
  console.warn = function (...args) {
    origWarn.apply(console, args);
    send('warn', formatArgs(args));
  };
  console.error = function (...args) {
    origError.apply(console, args);
    send('error', formatArgs(args));
  };

  window.addEventListener('error', (e) => {
    send('error', `Uncaught: ${e.message}\n${e.filename}:${e.lineno}\n${e.error?.stack || ''}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    send('error', `Unhandled rejection: ${e.reason?.message ?? String(e.reason)}`);
  });
}
