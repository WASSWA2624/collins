/**
 * Bootstrap Tests
 * File: index.test.js
 */
import { bootstrapApp } from '@bootstrap';
import { initSecurity } from '@bootstrap/init.security';
import { initStore } from '@bootstrap/init.store';
import { initTheme } from '@bootstrap/init.theme';
import { initOffline } from '@bootstrap/init.offline';
import { logger } from '@logging';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

jest.mock('@i18n', () => ({
  getDeviceLocale: jest.fn(() => 'en'),
}));

jest.mock('@store', () => ({
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
}));

jest.mock('@bootstrap/init.security');
jest.mock('@bootstrap/init.store');
jest.mock('@bootstrap/init.theme');
jest.mock('@bootstrap/init.offline');
jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    initSecurity.mockResolvedValue(undefined);
    initStore.mockResolvedValue(undefined);
    initTheme.mockResolvedValue(undefined);
    initOffline.mockResolvedValue(undefined);
  });

  describe('bootstrapApp', () => {
    it('calls init modules in correct order: security → store → theme → offline', async () => {
      await bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(1);
      expect(initStore).toHaveBeenCalledTimes(1);
      expect(initTheme).toHaveBeenCalledTimes(1);
      expect(initOffline).toHaveBeenCalledTimes(1);

      // Verify order by checking call indices
      const securityCallOrder = initSecurity.mock.invocationCallOrder[0];
      const storeCallOrder = initStore.mock.invocationCallOrder[0];
      const themeCallOrder = initTheme.mock.invocationCallOrder[0];
      const offlineCallOrder = initOffline.mock.invocationCallOrder[0];

      expect(securityCallOrder).toBeLessThan(storeCallOrder);
      expect(storeCallOrder).toBeLessThan(themeCallOrder);
      expect(themeCallOrder).toBeLessThan(offlineCallOrder);
    });

    it('is idempotent (can be called multiple times)', async () => {
      await bootstrapApp();
      await bootstrapApp();
      await bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(3);
      expect(initStore).toHaveBeenCalledTimes(3);
      expect(initTheme).toHaveBeenCalledTimes(3);
      expect(initOffline).toHaveBeenCalledTimes(3);
    });

    it('logs success when all init modules succeed', async () => {
      await bootstrapApp();

      expect(logger.info).toHaveBeenCalledWith('Starting application bootstrap...');
      expect(logger.info).toHaveBeenCalledWith('Application bootstrap completed successfully');
    });

    it('handles fatal errors (store initialization failure)', async () => {
      const storeError = new Error('Store initialization failed');
      initStore.mockRejectedValue(storeError);

      await expect(bootstrapApp()).rejects.toThrow('Store initialization failed');

      expect(initSecurity).toHaveBeenCalled();
      expect(initStore).toHaveBeenCalled();
      expect(initTheme).not.toHaveBeenCalled();
      expect(initOffline).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(
        'Application bootstrap failed',
        expect.objectContaining({
          error: 'Store initialization failed',
        })
      );
    });

    it('handles non-fatal errors (security initialization failure)', async () => {
      const securityError = new Error('Security initialization failed');
      initSecurity.mockRejectedValue(securityError);

      // Security init should not throw (per init.security.js implementation)
      // But if it does throw, bootstrap should fail
      initSecurity.mockImplementation(() => {
        throw securityError;
      });

      await expect(bootstrapApp()).rejects.toThrow('Security initialization failed');

      expect(initSecurity).toHaveBeenCalled();
      expect(initStore).not.toHaveBeenCalled();
    });

    it('handles non-fatal errors (theme initialization failure)', async () => {
      const themeError = new Error('Theme initialization failed');
      initTheme.mockRejectedValue(themeError);

      // Theme init should not throw (per init.theme.js implementation)
      // But if it does throw, bootstrap should fail
      initTheme.mockImplementation(() => {
        throw themeError;
      });

      await expect(bootstrapApp()).rejects.toThrow('Theme initialization failed');

      expect(initSecurity).toHaveBeenCalled();
      expect(initStore).toHaveBeenCalled();
      expect(initTheme).toHaveBeenCalled();
      expect(initOffline).not.toHaveBeenCalled();
    });

    it('handles non-fatal errors (offline initialization failure)', async () => {
      const offlineError = new Error('Offline initialization failed');
      initOffline.mockRejectedValue(offlineError);

      // Offline init should not throw (per init.offline.js implementation)
      // But if it does throw, bootstrap should fail
      initOffline.mockImplementation(() => {
        throw offlineError;
      });

      await expect(bootstrapApp()).rejects.toThrow('Offline initialization failed');

      expect(initSecurity).toHaveBeenCalled();
      expect(initStore).toHaveBeenCalled();
      expect(initTheme).toHaveBeenCalled();
      expect(initOffline).toHaveBeenCalled();
    });

    it('awaits all async init modules', async () => {
      let resolveSecurity;
      let resolveStore;
      let resolveTheme;
      let resolveOffline;

      const securityPromise = new Promise((resolve) => {
        resolveSecurity = resolve;
      });
      const storePromise = new Promise((resolve) => {
        resolveStore = resolve;
      });
      const themePromise = new Promise((resolve) => {
        resolveTheme = resolve;
      });
      const offlinePromise = new Promise((resolve) => {
        resolveOffline = resolve;
      });

      initSecurity.mockReturnValue(securityPromise);
      initStore.mockReturnValue(storePromise);
      initTheme.mockReturnValue(themePromise);
      initOffline.mockReturnValue(offlinePromise);

      const bootstrapPromise = bootstrapApp();

      // Verify first module is called immediately
      expect(initSecurity).toHaveBeenCalled();

      // Resolve in order and verify subsequent modules are called
      resolveSecurity();
      await new Promise((r) => setTimeout(r, 10));
      expect(initStore).toHaveBeenCalled();

      resolveStore();
      await new Promise((r) => setTimeout(r, 10));
      expect(initTheme).toHaveBeenCalled();

      resolveTheme();
      await new Promise((r) => setTimeout(r, 10));
      expect(initOffline).toHaveBeenCalled();

      resolveOffline();
      await new Promise((r) => setTimeout(r, 10));

      await bootstrapPromise;

      expect(logger.info).toHaveBeenCalledWith('Application bootstrap completed successfully');
    });
  });
});

