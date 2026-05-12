describe('debug/web-console-logger web bridge', () => {
  const installKey = '__COLLINS_WEB_CONSOLE_LOGGER_INSTALLED__';
  let originalConsoleMethods;

  beforeEach(() => {
    jest.resetModules();
    delete globalThis[installKey];
    delete process.env.EXPO_PUBLIC_WEB_LOG_ENDPOINT;
    originalConsoleMethods = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    delete globalThis[installKey];
    delete process.env.EXPO_PUBLIC_WEB_LOG_ENDPOINT;
    Object.assign(console, originalConsoleMethods);
    delete global.fetch;
  });

  test('installs a development browser console event bridge', async () => {
    const events = [];
    window.addEventListener('collins:web-console', (event) => events.push(event.detail));

    const { isWebConsoleLoggerEnabled } = await import('@debug/web-console-logger');
    console.info('AI Vent web logger ready');

    expect(isWebConsoleLoggerEnabled).toBe(true);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'web-console',
          level: 'info',
          message: 'AI Vent web logger ready',
        }),
      ])
    );
  });

  test('posts console events to the optional local debug receiver', async () => {
    process.env.EXPO_PUBLIC_WEB_LOG_ENDPOINT = 'http://127.0.0.1:8787/logs';
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

    const { isWebConsoleLoggerEnabled } = await import('@debug/web-console-logger');
    console.warn('Forwarded web warning');

    expect(isWebConsoleLoggerEnabled).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8787/logs',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: expect.stringContaining('Forwarded web warning'),
      })
    );
  });
});
