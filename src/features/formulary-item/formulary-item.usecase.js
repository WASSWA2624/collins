/**
 * Formulary Item Use Cases
 * File: formulary-item.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { formularyItemApi } from './formulary-item.api';
import { normalizeFormularyItem, normalizeFormularyItemList } from './formulary-item.model';
import { parseFormularyItemId, parseFormularyItemListParams, parseFormularyItemPayload } from './formulary-item.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listFormularyItems = async (params = {}) =>
  execute(async () => {
    const parsed = parseFormularyItemListParams(params);
    const response = await formularyItemApi.list(parsed);
    return normalizeFormularyItemList(response.data);
  });

const getFormularyItem = async (id) =>
  execute(async () => {
    const parsedId = parseFormularyItemId(id);
    const response = await formularyItemApi.get(parsedId);
    return normalizeFormularyItem(response.data);
  });

const createFormularyItem = async (payload) =>
  execute(async () => {
    const parsed = parseFormularyItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FORMULARY_ITEMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeFormularyItem(parsed);
    }
    const response = await formularyItemApi.create(parsed);
    return normalizeFormularyItem(response.data);
  });

const updateFormularyItem = async (id, payload) =>
  execute(async () => {
    const parsedId = parseFormularyItemId(id);
    const parsed = parseFormularyItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FORMULARY_ITEMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeFormularyItem({ id: parsedId, ...parsed });
    }
    const response = await formularyItemApi.update(parsedId, parsed);
    return normalizeFormularyItem(response.data);
  });

const deleteFormularyItem = async (id) =>
  execute(async () => {
    const parsedId = parseFormularyItemId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.FORMULARY_ITEMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeFormularyItem({ id: parsedId });
    }
    const response = await formularyItemApi.remove(parsedId);
    return normalizeFormularyItem(response.data);
  });

export { listFormularyItems, getFormularyItem, createFormularyItem, updateFormularyItem, deleteFormularyItem };
