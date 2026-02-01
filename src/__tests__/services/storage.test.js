/**
 * Storage Services Tests
 * File: storage.test.js
 */
// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

// Mock SecureStore
const mockSecureStore = {
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

jest.mock('expo-secure-store', () => mockSecureStore);

// Mock error handler (services must not log directly; errors are routed via @errors)
jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

const { async, secure, ventilationSession } = require('@services/storage');
const { handleError } = require('@errors');

describe('Storage Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.isAvailableAsync.mockResolvedValue(true);
  });

  describe('AsyncStorage Service', () => {
    describe('getItem', () => {
      it('should retrieve and parse stored value', async () => {
        const testValue = { key: 'value' };
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testValue));

        const result = await async.getItem('test-key');
        expect(result).toEqual(testValue);
        expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      });

      it('should return null when key does not exist', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(null);

        const result = await async.getItem('non-existent');
        expect(result).toBeNull();
      });

      it('should return null and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.getItem.mockRejectedValue(error);

        const result = await async.getItem('test-key');
        expect(result).toBeNull();
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'getItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('setItem', () => {
      it('should store value as JSON string', async () => {
        const testValue = { key: 'value' };
        mockAsyncStorage.setItem.mockResolvedValue();

        const result = await async.setItem('test-key', testValue);
        expect(result).toBe(true);
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify(testValue)
        );
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.setItem.mockRejectedValue(error);

        const result = await async.setItem('test-key', { data: 'value' });
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'setItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('removeItem', () => {
      it('should remove item from storage', async () => {
        mockAsyncStorage.removeItem.mockResolvedValue();

        const result = await async.removeItem('test-key');
        expect(result).toBe(true);
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.removeItem.mockRejectedValue(error);

        const result = await async.removeItem('test-key');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'removeItem',
            key: 'test-key',
          })
        );
      });
    });
  });

  describe('SecureStore Service', () => {
    describe('getItem', () => {
      it('should retrieve stored value', async () => {
        const testValue = 'secure-value';
        mockSecureStore.getItemAsync.mockResolvedValue(testValue);

        const result = await secure.getItem('test-key');
        expect(result).toBe(testValue);
        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      });

      it('should return null when key does not exist', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        const result = await secure.getItem('non-existent');
        expect(result).toBeNull();
      });

      it('should return null and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.getItemAsync.mockRejectedValue(error);

        const result = await secure.getItem('test-key');
        expect(result).toBeNull();
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'getItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('setItem', () => {
      it('should store value securely', async () => {
        const testValue = 'secure-value';
        mockSecureStore.setItemAsync.mockResolvedValue();

        const result = await secure.setItem('test-key', testValue);
        expect(result).toBe(true);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', testValue);
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.setItemAsync.mockRejectedValue(error);

        const result = await secure.setItem('test-key', 'value');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'setItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('removeItem', () => {
      it('should remove item from secure storage', async () => {
        mockSecureStore.deleteItemAsync.mockResolvedValue();

        const result = await secure.removeItem('test-key');
        expect(result).toBe(true);
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.deleteItemAsync.mockRejectedValue(error);

        const result = await secure.removeItem('test-key');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'removeItem',
            key: 'test-key',
          })
        );
      });
    });
  });

  describe('Ventilation Session Storage (non-sensitive)', () => {
    beforeEach(() => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();
      mockAsyncStorage.removeItem.mockResolvedValue();
    });

    describe('loadDraft', () => {
      it('returns null draft when missing', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(null);
        const result = await ventilationSession.loadDraft();
        expect(result).toEqual({ ok: true, draft: null, errorCode: null });
      });

      it('returns draft when valid', async () => {
        const stored = {
          sessionId: 's1',
          inputs: { spo2: 92 },
          recommendationSummary: { source: { confidenceTier: 'medium' } },
          updatedAt: 123,
        };
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(stored));
        const result = await ventilationSession.loadDraft();
        expect(result.ok).toBe(true);
        expect(result.errorCode).toBeNull();
        expect(result.draft).toMatchObject(stored);
      });

      it('clears and returns corruption code when invalid', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify({ bad: true }));
        const result = await ventilationSession.loadDraft();
        expect(result.ok).toBe(false);
        expect(result.errorCode).toBe('VENTILATION_SESSION_DRAFT_CORRUPT');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('ventilation.session.draft.v1');
      });
    });

    describe('saveDraft', () => {
      it('rejects invalid drafts', async () => {
        const result = await ventilationSession.saveDraft({ sessionId: '', updatedAt: 1 });
        expect(result.ok).toBe(false);
        expect(result.errorCode).toBe('VENTILATION_SESSION_DRAFT_INVALID');
      });

      it('persists valid drafts', async () => {
        const draft = { sessionId: 's2', inputs: {}, recommendationSummary: null, updatedAt: 10 };
        const result = await ventilationSession.saveDraft(draft);
        expect(result.ok).toBe(true);
        expect(result.errorCode).toBeNull();
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('ventilation.session.draft.v1', JSON.stringify(draft));
      });

      it('returns failure code when setItem fails', async () => {
        mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('fail'));
        const draft = { sessionId: 's3', inputs: {}, recommendationSummary: {}, updatedAt: 11 };
        const result = await ventilationSession.saveDraft(draft);
        expect(result.ok).toBe(false);
        expect(result.errorCode).toBeTruthy();
        expect(handleError).toHaveBeenCalled();
      });
    });

    describe('loadHistory', () => {
      it('returns empty history when missing', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(null);
        const result = await ventilationSession.loadHistory();
        expect(result.ok).toBe(true);
        expect(result.history).toEqual([]);
      });

      it('clears and returns corruption code when invalid', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify({ not: 'an array' }));
        const result = await ventilationSession.loadHistory();
        expect(result.ok).toBe(false);
        expect(result.errorCode).toBe('VENTILATION_SESSION_HISTORY_CORRUPT');
        expect(result.history).toEqual([]);
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('ventilation.session.history.v1');
      });
    });

    describe('appendHistory', () => {
      it('rejects invalid entry', async () => {
        const result = await ventilationSession.appendHistory({ sessionId: '', updatedAt: 1 });
        expect(result.ok).toBe(false);
        expect(result.errorCode).toBe('VENTILATION_SESSION_HISTORY_ENTRY_INVALID');
      });

      it('dedupes by sessionId and keeps newest updatedAt', async () => {
        const existing = [
          { sessionId: 's1', inputs: {}, recommendationSummary: {}, updatedAt: 1 },
          { sessionId: 's2', inputs: {}, recommendationSummary: {}, updatedAt: 2 },
        ];
        mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing)); // loadHistory

        const entry = { sessionId: 's1', inputs: { a: 1 }, recommendationSummary: {}, updatedAt: 10 };
        const result = await ventilationSession.appendHistory(entry, { maxEntries: 25 });
        expect(result.ok).toBe(true);

        const saved = JSON.parse(mockAsyncStorage.setItem.mock.calls.find((c) => c[0] === 'ventilation.session.history.v1')[1]);
        expect(saved[0].sessionId).toBe('s1');
        expect(saved[0].updatedAt).toBe(10);
        expect(saved.some((x) => x.sessionId === 's2')).toBe(true);
      });

      it('enforces maxEntries (sanitized) and writes sorted', async () => {
        const existing = [
          { sessionId: 'a', inputs: {}, recommendationSummary: {}, updatedAt: 1 },
          { sessionId: 'b', inputs: {}, recommendationSummary: {}, updatedAt: 2 },
        ];
        mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing)); // loadHistory
        const entry = { sessionId: 'c', inputs: {}, recommendationSummary: {}, updatedAt: 3 };

        await ventilationSession.appendHistory(entry, { maxEntries: 1 });

        const saved = JSON.parse(mockAsyncStorage.setItem.mock.calls.find((c) => c[0] === 'ventilation.session.history.v1')[1]);
        expect(saved).toHaveLength(1);
        expect(saved[0].sessionId).toBe('c');
      });
    });
  });
});

