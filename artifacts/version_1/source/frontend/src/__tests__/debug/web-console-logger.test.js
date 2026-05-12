import webConsoleLogger, { isWebConsoleLoggerEnabled } from '@debug/web-console-logger';

describe('debug/web-console-logger native fallback', () => {
  test('resolves as a safe native no-op module', () => {
    expect(isWebConsoleLoggerEnabled).toBe(false);
    expect(webConsoleLogger).toEqual({ isWebConsoleLoggerEnabled: false });
  });
});
