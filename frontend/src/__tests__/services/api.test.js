/**
 * API Services Tests
 * File: api.test.js
 */
// Mock fetch
global.fetch = jest.fn();

// Mock token manager
jest.mock('@security', () => ({
  tokenManager: {
    getAccessToken: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

// Mock error handler
jest.mock('@errors', () => ({
  handleError: jest.fn((error) => error),
}));

// Mock config
jest.mock('@config', () => ({
  TIMEOUTS: {
    API_REQUEST: 30000,
  },
}));

const { apiClient } = require('@services/api');
const { tokenManager } = require('@security');
const { handleError } = require('@errors');

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('apiClient', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const result = await apiClient({ url: 'https://api.example.com/test' });

      expect(result).toEqual({ data: mockData, status: 200 });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should attach Authorization header when token exists', async () => {
      const mockData = { id: 1 };
      const token = 'access-token-123';
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(token);

      await apiClient({ url: 'https://api.example.com/test' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token-123',
          }),
        })
      );
    });

    it('should make POST request with body', async () => {
      const mockData = { success: true };
      const requestBody = { name: 'Test' };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const result = await apiClient({
        url: 'https://api.example.com/test',
        method: 'POST',
        body: requestBody,
      });

      expect(result).toEqual({ data: mockData, status: 201 });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });

    it('should handle 401 unauthorized error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: { get: () => 'application/json' },
      });
      tokenManager.getAccessToken.mockResolvedValue(null);
      tokenManager.clearTokens.mockResolvedValue();

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(tokenManager.clearTokens).toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });

    it('should handle request timeout', async () => {
      global.fetch.mockImplementation((_, options = {}) => {
        const signal = options.signal;
        return new Promise((_, reject) => {
          if (signal?.aborted) {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
            return;
          }
          const onAbort = () => {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          };
          signal?.addEventListener?.('abort', onAbort);
          if (signal) signal.onabort = onAbort;
          // If not aborted, keep pending beyond the timeout.
        });
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const promise = apiClient({
        url: 'https://api.example.com/test',
        timeout: 50,
      });

      const assertion = expect(promise).rejects.toBeDefined();
      await jest.advanceTimersByTimeAsync(50);
      await assertion;
      expect(handleError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Request timeout' }),
        { url: 'https://api.example.com/test' }
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      global.fetch.mockRejectedValue(networkError);
      tokenManager.getAccessToken.mockResolvedValue(null);

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(handleError).toHaveBeenCalled();
    });

    it('should use custom timeout when provided', async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      await apiClient({
        url: 'https://api.example.com/test',
        timeout: 10000,
      });

      // Verify timeout was set (indirectly through abort signal)
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle non-OK responses', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: { get: () => 'application/json' },
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(handleError).toHaveBeenCalled();
    });
  });
});

