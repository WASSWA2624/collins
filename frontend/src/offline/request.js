/**
 * Offline Request Helpers
 * File: request.js
 */
import { addToQueue } from './queue';
import { getIsOnline } from './network.listener';

const queueRequestIfOffline = async (request) => {
  if (getIsOnline()) return false;
  const queued = await addToQueue(request);
  if (!queued) {
    throw new Error('OFFLINE_QUEUE_FAILED');
  }
  return true;
};

export { queueRequestIfOffline };
