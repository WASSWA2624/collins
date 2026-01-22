/**
 * Biometric authentication helpers
 * File: biometric.js
 */
import * as LocalAuthentication from 'expo-local-authentication';
import { handleError } from '@errors';

const isBiometricSupported = async () => {
  try {
    return await LocalAuthentication.hasHardwareAsync();
  } catch (error) {
    handleError(error);
    return false;
  }
};

const isBiometricEnrolled = async () => {
  try {
    return await LocalAuthentication.isEnrolledAsync();
  } catch (error) {
    handleError(error);
    return false;
  }
};

const authenticateBiometric = async (options = {}) => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage,
      cancelLabel: options.cancelLabel,
      fallbackLabel: options.fallbackLabel,
      disableDeviceFallback: false,
      requireConfirmation: false,
    });
    return result || { success: false };
  } catch (error) {
    handleError(error);
    return { success: false, error: 'UNKNOWN_ERROR' };
  }
};

export {
  isBiometricSupported,
  isBiometricEnrolled,
  authenticateBiometric,
};
