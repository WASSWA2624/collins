describe('debug/web-console-logger web bridge', () => {
  const installKey = '__COLLINS_WEB_CONSOLE_LOGGER_INSTALLED__';
  let originalConsoleMethods;

  beforeEach(() => {
    jest.resetModules();
    delete globalThis[installKey];
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
    Object.assign(console, originalConsoleMethods);
  });

  test('installs a development browser console event bridge', async () => {
    const events = [];
    window.addEventListener('collins:web-console', (event) => events.push(event.detail));

    const { isWebConsoleLoggerEnabled } = await import('@debug/web-console-logger');
    console.info('Collins web logger ready');

    expect(isWebConsoleLoggerEnabled).toBe(true);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'web-console',
          level: 'info',
          message: 'Collins web logger ready',
        }),
      ])
    );
  });
});
