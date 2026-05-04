/**
 * Sync Manager Tests
 * File: sync.manager.test.js
 */
import { handleError } from '@errors';
import { apiClient } from '@services/api';
import { getQueue, removeFromQueue } from '@offline/queue';
import { getIsOnline, subscribe } from '@offline/network.listener';
import { __unsafeResetForTests, processQueue, startSync } from '@offline/sync.manager';

jest.mock('@offline/queue', () => ({
  getQueue: jest.fn(),
  removeFromQueue: jest.fn(),
}));

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
  subscribe: jest.fn(),
}));

jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

describe('Sync Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __unsafeResetForTests();

    getIsOnline.mockReturnValue(true);
    getQueue.mockResolvedValue([]);
    removeFromQueue.mockResolvedValue(true);
    apiClient.mockResolvedValue({ data: {}, status: 200 });
  });

  describe('processQueue', () => {
    it('skips processing when offline', async () => {
      getIsOnline.mockReturnValue(false);

      await processQueue();

      expect(getQueue).not.toHaveBeenCalled();
      expect(apiClient).not.toHaveBeenCalled();
    });

    it('returns early when queue is empty', async () => {
      getQueue.mockResolvedValue([]);

      await processQueue();

      expect(apiClient).not.toHaveBeenCalled();
    });

    it('processes queue items when online', async () => {
      const queue = [
        { id: '1', url: '/api/test1', method: 'POST' },
        { id: '2', url: '/api/test2', method: 'GET' },
      ];
      getQueue.mockResolvedValue(queue);

      await processQueue();

      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(apiClient).toHaveBeenCalledWith(queue[0]);
      expect(apiClient).toHaveBeenCalledWith(queue[1]);
    });

    it('removes item from queue after successful processing', async () => {
      const queue = [{ id: '1', url: '/api/test', method: 'POST' }];
      getQueue.mockResolvedValue(queue);

      await processQueue();

      expect(removeFromQueue).toHaveBeenCalledWith('1');
      expect(handleError).not.toHaveBeenCalled();
    });

    it('keeps item in queue on failure and reports via handleError', async () => {
      const queue = [{ id: '1', url: '/api/test', method: 'POST' }];
      getQueue.mockResolvedValue(queue);
      apiClient.mockRejectedValue(new Error('API Error'));

      await processQueue();

      expect(removeFromQueue).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });

    it('continues processing after item failure', async () => {
      const queue = [
        { id: '1', url: '/api/test1', method: 'POST' },
        { id: '2', url: '/api/test2', method: 'GET' },
      ];
      getQueue.mockResolvedValue(queue);
      apiClient.mockRejectedValueOnce(new Error('API Error')).mockResolvedValueOnce({ data: {}, status: 200 });

      await processQueue();

      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(removeFromQueue).toHaveBeenCalledTimes(1);
      expect(removeFromQueue).toHaveBeenCalledWith('2');
    });
  });

  describe('startSync', () => {
    it('subscribes once and returns unsubscribe function', () => {
      const unsubscribe = jest.fn();
      subscribe.mockReturnValue(unsubscribe);

      const a = startSync();
      const b = startSync();

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(a).toBe(unsubscribe);
      expect(b).toBe(unsubscribe);
    });

    it('triggers queue processing when network comes online', async () => {
      let onChange;
      subscribe.mockImplementation((fn) => {
        onChange = fn;
        return jest.fn();
      });

      getQueue.mockResolvedValue([{ id: '1', url: '/api/test', method: 'POST' }]);
      apiClient.mockResolvedValue({ data: {}, status: 200 });

      startSync();

      onChange(true);
      // startSync intentionally fire-and-forgets; wait a tick for async processing to complete
      await new Promise((r) => setTimeout(r, 0));

      expect(apiClient).toHaveBeenCalledTimes(1);
      expect(removeFromQueue).toHaveBeenCalledWith('1');
    });
  });
});

