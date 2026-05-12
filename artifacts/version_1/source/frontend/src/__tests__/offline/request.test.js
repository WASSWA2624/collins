/**
 * Offline Request Tests
 * File: request.test.js
 */
import { addToQueue } from '@offline/queue';
import { getIsOnline } from '@offline/network.listener';
import { queueRequestIfOffline } from '@offline/request';

jest.mock('@offline/queue', () => ({
  addToQueue: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
}));

describe('queueRequestIfOffline', () => {
  beforeEach(() => {
    addToQueue.mockReset();
    getIsOnline.mockReset();
  });

  it('returns false when online', async () => {
    getIsOnline.mockReturnValue(true);
    await expect(queueRequestIfOffline({ url: '/x', method: 'POST' })).resolves.toBe(false);
    expect(addToQueue).not.toHaveBeenCalled();
  });

  it('queues when offline', async () => {
    getIsOnline.mockReturnValue(false);
    addToQueue.mockResolvedValue(true);
    await expect(queueRequestIfOffline({ url: '/x', method: 'POST' })).resolves.toBe(true);
    expect(addToQueue).toHaveBeenCalledWith({ url: '/x', method: 'POST' });
  });

  it('throws when queue fails', async () => {
    getIsOnline.mockReturnValue(false);
    addToQueue.mockResolvedValue(false);
    await expect(queueRequestIfOffline({ url: '/x', method: 'POST' })).rejects.toThrow(
      'OFFLINE_QUEUE_FAILED'
    );
  });
});
