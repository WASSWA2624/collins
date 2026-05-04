/**
 * Security Initialization Tests
 * File: init.security.test.js
 */
import { initSecurity } from '@bootstrap/init.security';
import { tokenManager } from '@security';
import { logger } from '@logging';

jest.mock('@security', () => ({
  tokenManager: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    isTokenExpired: jest.fn(),
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

describe('Security Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes successfully when no tokens exist', async () => {
    tokenManager.getAccessToken.mockResolvedValue(null);
    tokenManager.getRefreshToken.mockResolvedValue(null);

    await initSecurity();

    expect(tokenManager.getAccessToken).toHaveBeenCalled();
    expect(tokenManager.getRefreshToken).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('No session found on startup');
    expect(logger.info).toHaveBeenCalledWith('Security initialized successfully');
  });

  it('initializes successfully with valid tokens', async () => {
    tokenManager.getAccessToken.mockResolvedValue('valid-token');
    tokenManager.getRefreshToken.mockResolvedValue('valid-refresh-token');
    tokenManager.isTokenExpired.mockReturnValue(false);

    await initSecurity();

    expect(logger.info).toHaveBeenCalledWith('Valid session found on startup');
    expect(logger.info).toHaveBeenCalledWith('Security initialized successfully');
  });

  it('handles expired access token with refresh token available', async () => {
    tokenManager.getAccessToken.mockResolvedValue('expired-token');
    tokenManager.getRefreshToken.mockResolvedValue('valid-refresh-token');
    tokenManager.isTokenExpired.mockReturnValue(true);

    await initSecurity();

    expect(logger.info).toHaveBeenCalledWith('Access token expired, refresh token available');
    expect(logger.info).toHaveBeenCalledWith('Security initialized successfully');
  });

  it('handles expired tokens without refresh token', async () => {
    tokenManager.getAccessToken.mockResolvedValue('expired-token');
    tokenManager.getRefreshToken.mockResolvedValue(null);
    tokenManager.isTokenExpired.mockReturnValue(true);

    await initSecurity();

    expect(logger.info).toHaveBeenCalledWith('Tokens expired, user will need to re-authenticate');
    expect(logger.info).toHaveBeenCalledWith('Security initialized successfully');
  });

  it('handles errors gracefully without throwing', async () => {
    const error = new Error('Security error');
    tokenManager.getAccessToken.mockRejectedValue(error);

    await expect(initSecurity()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Security initialization failed', {
      error: 'Security error',
    });
  });
});

