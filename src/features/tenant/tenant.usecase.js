/**
 * Tenant Use Cases
 * File: tenant.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { tenantApi } from './tenant.api';
import { normalizeTenant, normalizeTenantList } from './tenant.model';
import { parseTenantId, parseTenantListParams, parseTenantPayload } from './tenant.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

/** Backend sends { status, message, data }; apiClient returns { data: body }. Unwrap payload. */
const getPayload = (response) =>
  (response?.data?.data !== undefined ? response.data.data : response?.data);

const listTenants = async (params = {}) =>
  execute(async () => {
    const parsed = parseTenantListParams(params);
    const response = await tenantApi.list(parsed);
    return normalizeTenantList(getPayload(response) ?? []);
  });

const getTenant = async (id) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const response = await tenantApi.get(parsedId);
    return normalizeTenant(getPayload(response));
  });

const createTenant = async (payload) =>
  execute(async () => {
    const parsed = parseTenantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeTenant(parsed);
    }
    const response = await tenantApi.create(parsed);
    return normalizeTenant(getPayload(response));
  });

const updateTenant = async (id, payload) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const parsed = parseTenantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeTenant({ id: parsedId, ...parsed });
    }
    const response = await tenantApi.update(parsedId, parsed);
    return normalizeTenant(getPayload(response));
  });

const deleteTenant = async (id) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeTenant({ id: parsedId });
    }
    await tenantApi.remove(parsedId);
    return normalizeTenant({ id: parsedId });
  });

export { listTenants, getTenant, createTenant, updateTenant, deleteTenant };
