/**
 * Hydration Tests
 * File: hydration.test.js
 */
import { handleError } from '@errors';
import { getQueue } from '@offline/queue';
import { hydrate } from '@offline/hydration';

jest.mock('@offline/queue', () => ({
  getQueue: jest.fn(),
}));

jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

describe('Hydration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hydrate', () => {
    it('hydrates queue from storage', async () => {
      const queue = [
        { id: '1', url: '/api/test1' },
        { id: '2', url: '/api/test2' },
      ];
      getQueue.mockResolvedValue(queue);

      const result = await hydrate();

      expect(result).toEqual({ queue });
      expect(getQueue).toHaveBeenCalled();
      expect(handleError).not.toHaveBeenCalled();
    });

    it('returns empty queue when no items exist', async () => {
      getQueue.mockResolvedValue([]);
      await expect(hydrate()).resolves.toEqual({ queue: [] });
    });

    it('handles errors gracefully (returns empty queue + reports)', async () => {
      getQueue.mockRejectedValue(new Error('Storage error'));

      const result = await hydrate();

      expect(result).toEqual({ queue: [] });
      expect(handleError).toHaveBeenCalled();
    });
  });
});

