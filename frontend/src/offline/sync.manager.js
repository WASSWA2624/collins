/**
 * Sync Manager
 * Orchestrates queue execution
 * File: sync.manager.js
 */
import { handleError } from '@errors';
import { apiClient } from '@services/api';
import { getQueue, removeFromQueue, updateQueueItem } from '@offline/queue';
import { getIsOnline, subscribe } from '@offline/network.listener';

let unsubscribeSync = null;

export const processQueue = async () => {
  if (!getIsOnline()) return;

  const queue = await getQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    if (item?.syncState === 'conflict') continue;

    try {
      await apiClient(item);
      await removeFromQueue(item.id);
    } catch (error) {
      const normalized = handleError(error, {
        scope: 'offline.sync.manager',
        op: 'processQueueItem',
        id: item?.id,
      });
      const status = normalized?.status || error?.status || error?.statusCode;
      const retryCount = Number.isFinite(Number(item?.retryCount)) ? Number(item.retryCount) + 1 : 1;

      await updateQueueItem(item.id, {
        syncState: status === 409 ? 'conflict' : 'retry_pending',
        retryCount,
        lastErrorCode: normalized?.code || error?.code || 'UNKNOWN_ERROR',
        lastFailedAt: Date.now(),
        conflictMeta: status === 409 ? (normalized?.meta || error?.meta || null) : undefined,
      });
      // Keep in queue for retry
    }
  }
};

/**
 * Start syncing on network reconnect.
 * Idempotent: repeated calls return the same unsubscribe function.
 */
export const startSync = () => {
  if (unsubscribeSync) return unsubscribeSync;

  unsubscribeSync = subscribe((isOnline) => {
    if (isOnline) {
      // Fire-and-forget; offline sync must not block UI thread.
      processQueue();
    }
  });

  return unsubscribeSync;
};

export const stopSync = () => {
  if (!unsubscribeSync) return;
  try {
    unsubscribeSync();
  } finally {
    unsubscribeSync = null;
  }
};

/**
 * Testing-only reset helper to avoid state leaking across unit tests.
 * @private
 */
export const __unsafeResetForTests = () => {
  stopSync();
};

export default {
  processQueue,
  startSync,
  stopSync,
};

