/**
 * Offline Queue
 * Stores failed/deferred requests
 * File: queue.js
 */
import { handleError } from '@errors';
import { encryption } from '@security';
import { async as asyncStorage } from '@services/storage';

const QUEUE_KEY = 'offline_queue';

const reportQueueError = (error, context) => {
  handleError(error, {
    scope: 'offline.queue',
    ...context,
  });
};

const asSafeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const persistEncryptedQueue = async (queue) => {
  try {
    const json = JSON.stringify(asSafeArray(queue));
    const encrypted = await encryption.encrypt(json);
    return await asyncStorage.setItem(QUEUE_KEY, encrypted);
  } catch (error) {
    reportQueueError(error, { op: 'persistEncryptedQueue', key: QUEUE_KEY });
    return false;
  }
};

/**
 * Read queue from storage, decrypting if available.
 * Security-first: queue is never persisted unencrypted.
 */
export const getQueue = async () => {
  const stored = await asyncStorage.getItem(QUEUE_KEY);
  if (!stored) return [];

  // Legacy (non-compliant) format: array stored unencrypted.
  // We never keep this around — migrate to encrypted if possible; otherwise clear it.
  if (Array.isArray(stored)) {
    try {
      const migrated = await persistEncryptedQueue(stored);
      if (!migrated) {
        await asyncStorage.removeItem(QUEUE_KEY);
        return [];
      }
      return stored;
    } catch (error) {
      reportQueueError(error, { op: 'migrateLegacyQueue', key: QUEUE_KEY });
      await asyncStorage.removeItem(QUEUE_KEY);
      return [];
    }
  }

  if (typeof stored !== 'string') {
    await asyncStorage.removeItem(QUEUE_KEY);
    return [];
  }

  try {
    const json = await encryption.decrypt(stored);
    const parsed = JSON.parse(json);
    return asSafeArray(parsed);
  } catch (error) {
    reportQueueError(error, { op: 'decryptQueue', key: QUEUE_KEY });
    await asyncStorage.removeItem(QUEUE_KEY);
    return [];
  }
};

export const addToQueue = async (request) => {
  const queue = await getQueue();
  const now = Date.now();
  queue.push({
    ...request,
    id: String(now),
    timestamp: now,
  });
  return await persistEncryptedQueue(queue);
};

export const removeFromQueue = async (requestId) => {
  const queue = await getQueue();
  const filtered = queue.filter((item) => item?.id !== requestId);
  return await persistEncryptedQueue(filtered);
};

export const clearQueue = async () => {
  // Removing the key is safe and avoids persisting even an empty queue when crypto is unavailable.
  return await asyncStorage.removeItem(QUEUE_KEY);
};

export default {
  getQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
};

