/**
 * State Hydration
 * Rehydrates offline state on app restart
 * File: hydration.js
 */
import { handleError } from '@errors';
import { getQueue } from '@offline/queue';

export const hydrate = async () => {
  try {
    const queue = await getQueue();
    return { queue };
  } catch (error) {
    handleError(error, { scope: 'offline.hydration', op: 'hydrate' });
    return { queue: [] };
  }
};

export default { hydrate };

