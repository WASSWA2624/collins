/**
 * CRUD API Factory
 * Reusable API helpers for CRUD endpoints
 * File: crud.js
 */
import { apiClient } from './client';

const buildQueryString = (params = {}) => {
  if (!params || typeof params !== 'object') return '';
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  if (!entries.length) return '';
  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const ensureEndpoint = (value, name) => {
  if (!value) {
    throw new Error(`Missing endpoint: ${name}`);
  }
  return value;
};

const createCrudApi = (endpoints) => {
  const listUrl = ensureEndpoint(endpoints?.LIST || endpoints?.CREATE, 'LIST');
  const createUrl = ensureEndpoint(endpoints?.CREATE || endpoints?.LIST, 'CREATE');
  const getUrl = ensureEndpoint(endpoints?.GET, 'GET');
  const updateUrl = ensureEndpoint(endpoints?.UPDATE, 'UPDATE');
  const deleteUrl = ensureEndpoint(endpoints?.DELETE, 'DELETE');

  return {
    list: (params = {}) =>
      apiClient({
        url: `${listUrl}${buildQueryString(params)}`,
        method: 'GET',
      }),
    get: (id) =>
      apiClient({
        url: getUrl(id),
        method: 'GET',
      }),
    create: (payload) =>
      apiClient({
        url: createUrl,
        method: 'POST',
        body: payload,
      }),
    update: (id, payload) =>
      apiClient({
        url: updateUrl(id),
        method: 'PUT',
        body: payload,
      }),
    remove: (id) =>
      apiClient({
        url: deleteUrl(id),
        method: 'DELETE',
      }),
  };
};

export { buildQueryString, createCrudApi };
