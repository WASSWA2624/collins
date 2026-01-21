/**
 * Lab Order Item Use Cases
 * File: lab-order-item.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labOrderItemApi } from './lab-order-item.api';
import { normalizeLabOrderItem, normalizeLabOrderItemList } from './lab-order-item.model';
import { parseLabOrderItemId, parseLabOrderItemListParams, parseLabOrderItemPayload } from './lab-order-item.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabOrderItems = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabOrderItemListParams(params);
    const response = await labOrderItemApi.list(parsed);
    return normalizeLabOrderItemList(response.data);
  });

const getLabOrderItem = async (id) =>
  execute(async () => {
    const parsedId = parseLabOrderItemId(id);
    const response = await labOrderItemApi.get(parsedId);
    return normalizeLabOrderItem(response.data);
  });

const createLabOrderItem = async (payload) =>
  execute(async () => {
    const parsed = parseLabOrderItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDER_ITEMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabOrderItem(parsed);
    }
    const response = await labOrderItemApi.create(parsed);
    return normalizeLabOrderItem(response.data);
  });

const updateLabOrderItem = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabOrderItemId(id);
    const parsed = parseLabOrderItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDER_ITEMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabOrderItem({ id: parsedId, ...parsed });
    }
    const response = await labOrderItemApi.update(parsedId, parsed);
    return normalizeLabOrderItem(response.data);
  });

const deleteLabOrderItem = async (id) =>
  execute(async () => {
    const parsedId = parseLabOrderItemId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDER_ITEMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabOrderItem({ id: parsedId });
    }
    const response = await labOrderItemApi.remove(parsedId);
    return normalizeLabOrderItem(response.data);
  });

export { listLabOrderItems, getLabOrderItem, createLabOrderItem, updateLabOrderItem, deleteLabOrderItem };
