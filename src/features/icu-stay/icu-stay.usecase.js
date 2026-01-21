/**
 * ICU Stay Use Cases
 * File: icu-stay.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { icuStayApi } from './icu-stay.api';
import { normalizeIcuStay, normalizeIcuStayList } from './icu-stay.model';
import { parseIcuStayId, parseIcuStayListParams, parseIcuStayPayload } from './icu-stay.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listIcuStays = async (params = {}) =>
  execute(async () => {
    const parsed = parseIcuStayListParams(params);
    const response = await icuStayApi.list(parsed);
    return normalizeIcuStayList(response.data);
  });

const getIcuStay = async (id) =>
  execute(async () => {
    const parsedId = parseIcuStayId(id);
    const response = await icuStayApi.get(parsedId);
    return normalizeIcuStay(response.data);
  });

const createIcuStay = async (payload) =>
  execute(async () => {
    const parsed = parseIcuStayPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_STAYS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIcuStay(parsed);
    }
    const response = await icuStayApi.create(parsed);
    return normalizeIcuStay(response.data);
  });

const updateIcuStay = async (id, payload) =>
  execute(async () => {
    const parsedId = parseIcuStayId(id);
    const parsed = parseIcuStayPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_STAYS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeIcuStay({ id: parsedId, ...parsed });
    }
    const response = await icuStayApi.update(parsedId, parsed);
    return normalizeIcuStay(response.data);
  });

const deleteIcuStay = async (id) =>
  execute(async () => {
    const parsedId = parseIcuStayId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_STAYS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeIcuStay({ id: parsedId });
    }
    const response = await icuStayApi.remove(parsedId);
    return normalizeIcuStay(response.data);
  });

export { listIcuStays, getIcuStay, createIcuStay, updateIcuStay, deleteIcuStay };
