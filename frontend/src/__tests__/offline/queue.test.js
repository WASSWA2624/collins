/**
 * Offline Queue Tests
 * File: queue.test.js
 */
import { handleError } from '@errors';
import { encryption } from '@security';
import { async as asyncStorage } from '@services/storage';
import { addToQueue, clearQueue, getQueue, removeFromQueue } from '@offline/queue';

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('@security', () => ({
  encryption: {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
}));

jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

describe('Offline Queue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
    asyncStorage.removeItem.mockResolvedValue(true);

    encryption.encrypt.mockResolvedValue('encrypted');
    encryption.decrypt.mockResolvedValue('[]');
  });

  describe('getQueue', () => {
    it('returns [] when nothing is stored', async () => {
      asyncStorage.getItem.mockResolvedValue(null);
      await expect(getQueue()).resolves.toEqual([]);
    });

    it('decrypts stored string and returns parsed array', async () => {
      asyncStorage.getItem.mockResolvedValue('ciphertext');
      encryption.decrypt.mockResolvedValue(JSON.stringify([{ id: '1', url: '/x' }]));

      const queue = await getQueue();

      expect(encryption.decrypt).toHaveBeenCalledWith('ciphertext');
      expect(queue).toEqual([{ id: '1', url: '/x' }]);
    });

    it('returns [] and clears storage when decryption fails', async () => {
      asyncStorage.getItem.mockResolvedValue('ciphertext');
      encryption.decrypt.mockRejectedValue(new Error('ENCRYPTION_NOT_IMPLEMENTED'));

      const queue = await getQueue();

      expect(queue).toEqual([]);
      expect(handleError).toHaveBeenCalled();
      expect(asyncStorage.removeItem).toHaveBeenCalledWith('offline_queue');
    });

    it('returns [] and clears storage on corrupted decrypted JSON', async () => {
      asyncStorage.getItem.mockResolvedValue('ciphertext');
      encryption.decrypt.mockResolvedValue('not-json');

      const queue = await getQueue();

      expect(queue).toEqual([]);
      expect(handleError).toHaveBeenCalled();
      expect(asyncStorage.removeItem).toHaveBeenCalledWith('offline_queue');
    });

    it('migrates legacy unencrypted array by encrypting and re-saving', async () => {
      const legacy = [{ id: '1', url: '/legacy' }];
      asyncStorage.getItem.mockResolvedValue(legacy);
      encryption.encrypt.mockResolvedValue('encrypted-legacy');

      const queue = await getQueue();

      expect(queue).toEqual(legacy);
      expect(encryption.encrypt).toHaveBeenCalledWith(JSON.stringify(legacy));
      expect(asyncStorage.setItem).toHaveBeenCalledWith('offline_queue', 'encrypted-legacy');
    });

    it('clears legacy unencrypted array if encryption is unavailable', async () => {
      const legacy = [{ id: '1', url: '/legacy' }];
      asyncStorage.getItem.mockResolvedValue(legacy);
      encryption.encrypt.mockRejectedValue(new Error('ENCRYPTION_NOT_IMPLEMENTED'));

      const queue = await getQueue();

      expect(queue).toEqual([]);
      expect(asyncStorage.removeItem).toHaveBeenCalledWith('offline_queue');
    });
  });

  describe('addToQueue', () => {
    it('adds request with id/timestamp and persists encrypted', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(12345);
      asyncStorage.getItem.mockResolvedValue(null);
      encryption.decrypt.mockResolvedValue('[]');
      encryption.encrypt.mockResolvedValue('encrypted-new');

      const ok = await addToQueue({ url: '/api/test', method: 'POST' });

      expect(ok).toBe(true);
      expect(encryption.encrypt).toHaveBeenCalledWith(
        JSON.stringify([{ url: '/api/test', method: 'POST', id: '12345', timestamp: 12345 }])
      );
      expect(asyncStorage.setItem).toHaveBeenCalledWith('offline_queue', 'encrypted-new');

      Date.now.mockRestore();
    });

    it('fails safely (returns false) when encryption fails and does not persist plaintext', async () => {
      asyncStorage.getItem.mockResolvedValue(null);
      encryption.decrypt.mockResolvedValue('[]');
      encryption.encrypt.mockRejectedValue(new Error('ENCRYPTION_NOT_IMPLEMENTED'));

      const ok = await addToQueue({ url: '/api/test', method: 'POST' });

      expect(ok).toBe(false);
      expect(asyncStorage.setItem).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });
  });

  describe('removeFromQueue', () => {
    it('removes item by id and persists encrypted', async () => {
      asyncStorage.getItem.mockResolvedValue('ciphertext');
      encryption.decrypt.mockResolvedValue(
        JSON.stringify([
          { id: '1', url: '/a' },
          { id: '2', url: '/b' },
        ])
      );
      encryption.encrypt.mockResolvedValue('encrypted-filtered');

      const ok = await removeFromQueue('2');

      expect(ok).toBe(true);
      expect(encryption.encrypt).toHaveBeenCalledWith(JSON.stringify([{ id: '1', url: '/a' }]));
      expect(asyncStorage.setItem).toHaveBeenCalledWith('offline_queue', 'encrypted-filtered');
    });
  });

  describe('clearQueue', () => {
    it('removes the queue key', async () => {
      const ok = await clearQueue();
      expect(ok).toBe(true);
      expect(asyncStorage.removeItem).toHaveBeenCalledWith('offline_queue');
    });
  });
});

