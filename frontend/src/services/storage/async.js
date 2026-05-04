/**
 * AsyncStorage Service
 * Non-sensitive data storage
 * File: async.js
 * 
 * Uses AsyncStorage for native platforms and localStorage for web
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { handleError } from '@errors';

const reportStorageError = (error, context) => {
  handleError(error, {
    scope: 'services.storage.async',
    ...context,
  });
};

const getItem = async (key) => {
  try {
    let value;
    if (Platform.OS === 'web') {
      // Check localStorage availability right before use (inside try block)
      if (typeof window !== 'undefined' && window.localStorage) {
        value = window.localStorage.getItem(key);
      } else {
        return null;
      }
    } else {
      // Use AsyncStorage for native
      value = await AsyncStorage.getItem(key);
    }
    const parsed = value ? JSON.parse(value) : null;
    return parsed;
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    return null;
  }
};

const setItem = async (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    if (Platform.OS === 'web') {
      // Check localStorage availability right before use (inside try block)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        return false;
      }
    } else {
      // Use AsyncStorage for native
      await AsyncStorage.setItem(key, serialized);
    }
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    return false;
  }
};

const removeItem = async (key) => {
  try {
    if (Platform.OS === 'web') {
      // Check localStorage availability right before use (inside try block)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        return false;
      }
    } else {
      // Use AsyncStorage for native
      await AsyncStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    return false;
  }
};

export { getItem, setItem, removeItem };

