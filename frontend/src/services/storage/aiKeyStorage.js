/**
 * AI API key storage: SecureStore on native, sessionStorage on web.
 * SecureStore is not available on web; this allows the key to work for the session.
 * File: aiKeyStorage.js
 */
import { Platform } from 'react-native';
import * as secureStorage from './secure';

const WEB_PREFIX = 'ventilation_ai_key_';

const webKey = (storageKey) => WEB_PREFIX + (storageKey || '');

const getItem = async (storageKey) => {
  if (!storageKey || typeof storageKey !== 'string') return null;
  if (Platform.OS === 'web') {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(webKey(storageKey)) : null;
    } catch {
      return null;
    }
  }
  return await secureStorage.getItem(storageKey);
};

const setItem = async (storageKey, value) => {
  if (!storageKey || typeof storageKey !== 'string') return false;
  if (typeof value !== 'string' || !value.trim()) return false;
  if (Platform.OS === 'web') {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(webKey(storageKey), value.trim());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  return await secureStorage.setItem(storageKey, value.trim());
};

const removeItem = async (storageKey) => {
  if (!storageKey || typeof storageKey !== 'string') return false;
  if (Platform.OS === 'web') {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(webKey(storageKey));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  return await secureStorage.removeItem(storageKey);
};

export { getItem, setItem, removeItem };
