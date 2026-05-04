/**
 * Biometric Security Tests
 * File: biometric.test.js
 */
import { authenticateBiometric, isBiometricEnrolled, isBiometricSupported } from '@security';

const handleError = jest.fn((error) => error);

jest.mock('@errors', () => ({
  handleError,
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

const LocalAuthentication = require('expo-local-authentication');

describe('biometric security helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks biometric hardware support', async () => {
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
    await expect(isBiometricSupported()).resolves.toBe(true);
  });

  it('returns false when hardware check fails', async () => {
    LocalAuthentication.hasHardwareAsync.mockRejectedValue(new Error('fail'));
    await expect(isBiometricSupported()).resolves.toBe(false);
    expect(handleError).toHaveBeenCalled();
  });

  it('checks biometric enrollment', async () => {
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
    await expect(isBiometricEnrolled()).resolves.toBe(true);
  });

  it('returns false when enrollment check fails', async () => {
    LocalAuthentication.isEnrolledAsync.mockRejectedValue(new Error('fail'));
    await expect(isBiometricEnrolled()).resolves.toBe(false);
    expect(handleError).toHaveBeenCalled();
  });

  it('authenticates with provided options', async () => {
    LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true });
    const result = await authenticateBiometric({
      promptMessage: 'Prompt',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Fallback',
    });
    expect(result).toEqual({ success: true });
    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith(expect.objectContaining({
      promptMessage: 'Prompt',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Fallback',
    }));
  });

  it('returns failure when authentication throws', async () => {
    LocalAuthentication.authenticateAsync.mockRejectedValue(new Error('fail'));
    await expect(authenticateBiometric()).resolves.toEqual({ success: false, error: 'UNKNOWN_ERROR' });
    expect(handleError).toHaveBeenCalled();
  });
});
