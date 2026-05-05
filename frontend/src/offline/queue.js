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

const normalizeFacilityId = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const getBodyObject = (request) => {
  if (!request || typeof request !== 'object') return null;
  if (request.body && typeof request.body === 'object' && !Array.isArray(request.body)) return request.body;
  if (request.data && typeof request.data === 'object' && !Array.isArray(request.data)) return request.data;
  return null;
};

export const getRequestFacilityId = (request = {}) => {
  const body = getBodyObject(request);
  return normalizeFacilityId(
    request.facilityId ||
      request.activeFacilityId ||
      request.params?.facilityId ||
      request.query?.facilityId ||
      body?.facilityId ||
      body?.activeFacilityId
  );
};

const filterQueueByFacility = (queue, facilityId) => {
  const normalizedFacilityId = normalizeFacilityId(facilityId);
  if (!normalizedFacilityId) return asSafeArray(queue);
  return asSafeArray(queue).filter((item) => getRequestFacilityId(item) === normalizedFacilityId);
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
export const getQueue = async (options = {}) => {
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
      return filterQueueByFacility(stored, options.facilityId);
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
    return filterQueueByFacility(parsed, options.facilityId);
  } catch (error) {
    reportQueueError(error, { op: 'decryptQueue', key: QUEUE_KEY });
    await asyncStorage.removeItem(QUEUE_KEY);
    return [];
  }
};

export const addToQueue = async (request) => {
  const queue = await getQueue();
  const now = Date.now();
  const facilityId = getRequestFacilityId(request);
  queue.push({
    ...request,
    ...(facilityId ? { facilityId } : {}),
    id: String(now),
    timestamp: now,
    syncState: request?.syncState || 'pending',
    retryCount: Number.isFinite(Number(request?.retryCount)) ? Number(request.retryCount) : 0,
  });
  return await persistEncryptedQueue(queue);
};

export const getQueueForFacility = async (facilityId) => getQueue({ facilityId });

export const updateQueueItem = async (requestId, updates = {}) => {
  const queue = await getQueue();
  let didUpdate = false;
  const nextQueue = queue.map((item) => {
    if (item?.id !== requestId) return item;
    didUpdate = true;
    return {
      ...item,
      ...updates,
      id: item.id,
      timestamp: item.timestamp,
      updatedAt: Date.now(),
    };
  });

  if (!didUpdate) return false;
  return await persistEncryptedQueue(nextQueue);
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
  getQueueForFacility,
  getRequestFacilityId,
  addToQueue,
  updateQueueItem,
  removeFromQueue,
  clearQueue,
};

