/**
 * Theme Initialization Tests
 * File: init.theme.test.js
 */
import { initTheme } from '@bootstrap/init.theme';
import store from '@store';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { logger } from '@logging';

jest.mock('@store', () => ({
  dispatch: jest.fn(),
}));

jest.mock('@store/slices/ui.slice', () => ({
  actions: {
    setTheme: jest.fn((theme) => ({ type: 'ui/setTheme', payload: theme })),
  },
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
  },
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Theme Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default light theme when no persisted theme exists', async () => {
    asyncStorage.getItem.mockResolvedValue(null);

    await initTheme();

    expect(asyncStorage.getItem).toHaveBeenCalledWith('theme_preference');
    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('light'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', { theme: 'light' });
  });

  it('loads persisted light theme', async () => {
    asyncStorage.getItem.mockResolvedValue('light');

    await initTheme();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('light'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', { theme: 'light' });
  });

  it('loads persisted dark theme', async () => {
    asyncStorage.getItem.mockResolvedValue('dark');

    await initTheme();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('dark'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', { theme: 'dark' });
  });

  it('loads persisted high-contrast theme', async () => {
    asyncStorage.getItem.mockResolvedValue('high-contrast');

    await initTheme();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('high-contrast'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', {
      theme: 'high-contrast',
    });
  });

  it('uses default theme when persisted theme is invalid', async () => {
    asyncStorage.getItem.mockResolvedValue('invalid-theme');

    await initTheme();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('light'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', { theme: 'light' });
  });

  it('handles storage read errors gracefully', async () => {
    const error = new Error('Storage error');
    asyncStorage.getItem.mockRejectedValue(error);

    await expect(initTheme()).resolves.not.toThrow();

    expect(logger.debug).toHaveBeenCalledWith('Could not load persisted theme, using default', {
      error: 'Storage error',
    });
    expect(store.dispatch).toHaveBeenCalledWith(actions.setTheme('light'));
    expect(logger.info).toHaveBeenCalledWith('Theme initialized successfully', { theme: 'light' });
  });

  it('handles initialization errors gracefully without throwing', async () => {
    store.dispatch.mockImplementation(() => {
      throw new Error('Dispatch error');
    });

    await expect(initTheme()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Theme initialization failed', {
      error: 'Dispatch error',
    });
  });
});

