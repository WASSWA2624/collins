/**
 * SecureStore Service
 * Sensitive data storage (tokens, credentials)
 * File: secure.js
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { handleError } from '@errors';

const WEB_PREFIX = 'secure:';

const getWebStorage = () => {
  if (Platform.OS !== 'web') return null;
  try {
    return globalThis?.sessionStorage || null;
  } catch {
    return null;
  }
};

const getWebStorageKey = (key) => `${WEB_PREFIX}${key}`;

const reportStorageError = (error, context) => {
  handleError(error, {
    scope: 'services.storage.secure',
    ...context,
  });
};

const isSecureStoreAvailable = async () => {
  if (getWebStorage()) return false;

  try {
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    reportStorageError(error, { op: 'availability' });
    return false;
  }
};

const getItem = async (key) => {
  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      return webStorage.getItem(getWebStorageKey(key));
    } catch (error) {
      reportStorageError(error, { op: 'getItem', key, platform: 'web' });
      return null;
    }
  }

  const available = await isSecureStoreAvailable();
  if (!available) return null;

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    return null;
  }
};

const setItem = async (key, value) => {
  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      webStorage.setItem(getWebStorageKey(key), String(value));
      return true;
    } catch (error) {
      reportStorageError(error, { op: 'setItem', key, platform: 'web' });
      return false;
    }
  }

  const available = await isSecureStoreAvailable();
  if (!available) return false;

  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    return false;
  }
};

const removeItem = async (key) => {
  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      webStorage.removeItem(getWebStorageKey(key));
      return true;
    } catch (error) {
      reportStorageError(error, { op: 'removeItem', key, platform: 'web' });
      return false;
    }
  }

  const available = await isSecureStoreAvailable();
  if (!available) return false;

  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    return false;
  }
};

export { getItem, setItem, removeItem };

