/**
 * CRUD API Factory Tests
 * File: api.crud.test.js
 */
import { buildQueryString, createCrudApi } from '@services/api/crud';
import { apiClient } from '@services/api/client';

jest.mock('@services/api/client', () => ({
  apiClient: jest.fn(),
}));

describe('crud api helpers', () => {
  beforeEach(() => {
    apiClient.mockClear();
  });

  it('builds query strings deterministically', () => {
    expect(buildQueryString()).toBe('');
    expect(buildQueryString({})).toBe('');
    expect(buildQueryString({ page: 1, limit: 10 })).toBe('?page=1&limit=10');
    expect(buildQueryString({ tags: ['a', 'b'] })).toBe('?tags=a&tags=b');
  });

  it('creates CRUD api handlers', async () => {
    const endpoints = {
      LIST: '/items',
      CREATE: '/items',
      GET: (id) => `/items/${id}`,
      UPDATE: (id) => `/items/${id}`,
      DELETE: (id) => `/items/${id}`,
    };
    const api = createCrudApi(endpoints);
    await api.list({ page: 2 });
    await api.get('1');
    await api.create({ name: 'Item' });
    await api.update('1', { name: 'Updated' });
    await api.remove('1');

    expect(apiClient).toHaveBeenCalledWith({ url: '/items?page=2', method: 'GET' });
    expect(apiClient).toHaveBeenCalledWith({ url: '/items/1', method: 'GET' });
    expect(apiClient).toHaveBeenCalledWith({ url: '/items', method: 'POST', body: { name: 'Item' } });
    expect(apiClient).toHaveBeenCalledWith({
      url: '/items/1',
      method: 'PUT',
      body: { name: 'Updated' },
    });
    expect(apiClient).toHaveBeenCalledWith({ url: '/items/1', method: 'DELETE' });
  });

  it('throws for missing endpoints', () => {
    expect(() => createCrudApi({})).toThrow('Missing endpoint');
  });
});
