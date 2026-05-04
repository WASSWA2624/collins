/**
 * SecureStore Service
 * Sensitive data storage (tokens, credentials)
 * File: secure.js
 */
import * as SecureStore from 'expo-secure-store';
import { handleError } from '@errors';

const reportStorageError = (error, context) => {
  handleError(error, {
    scope: 'services.storage.secure',
    ...context,
  });
};

const isSecureStoreAvailable = async () => {
  try {
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    reportStorageError(error, { op: 'availability' });
    return false;
  }
};

const getItem = async (key) => {
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

