const INSTALL_KEY = '__COLLINS_WEB_CONSOLE_LOGGER_INSTALLED__';
const EVENT_NAME = 'collins:web-console';
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

const isDevelopment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production');

const stringifyConsoleArg = (value) => {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.stack || value.message;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const emitConsoleEvent = (level, args) => {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  const detail = {
    source: 'web-console',
    level,
    message: args.map(stringifyConsoleArg).join(' '),
    timestamp: new Date().toISOString(),
  };

  if (typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  }
};

const installWebConsoleLogger = () => {
  if (!isDevelopment || typeof console === 'undefined' || globalThis[INSTALL_KEY]) {
    return false;
  }

  globalThis[INSTALL_KEY] = true;

  LOG_LEVELS.forEach((level) => {
    const original = console[level];
    if (typeof original !== 'function') return;

    console[level] = (...args) => {
      original.apply(console, args);
      emitConsoleEvent(level, args);
    };
  });

  return true;
};

export const isWebConsoleLoggerEnabled = installWebConsoleLogger();

export default {
  isWebConsoleLoggerEnabled,
};
