/**
 * Lab Order Use Cases
 * File: lab-order.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labOrderApi } from './lab-order.api';
import { normalizeLabOrder, normalizeLabOrderList } from './lab-order.model';
import { parseLabOrderId, parseLabOrderListParams, parseLabOrderPayload } from './lab-order.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabOrders = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabOrderListParams(params);
    const response = await labOrderApi.list(parsed);
    return normalizeLabOrderList(response.data);
  });

const getLabOrder = async (id) =>
  execute(async () => {
    const parsedId = parseLabOrderId(id);
    const response = await labOrderApi.get(parsedId);
    return normalizeLabOrder(response.data);
  });

const createLabOrder = async (payload) =>
  execute(async () => {
    const parsed = parseLabOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabOrder(parsed);
    }
    const response = await labOrderApi.create(parsed);
    return normalizeLabOrder(response.data);
  });

const updateLabOrder = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabOrderId(id);
    const parsed = parseLabOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabOrder({ id: parsedId, ...parsed });
    }
    const response = await labOrderApi.update(parsedId, parsed);
    return normalizeLabOrder(response.data);
  });

const deleteLabOrder = async (id) =>
  execute(async () => {
    const parsedId = parseLabOrderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_ORDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabOrder({ id: parsedId });
    }
    const response = await labOrderApi.remove(parsedId);
    return normalizeLabOrder(response.data);
  });

export { listLabOrders, getLabOrder, createLabOrder, updateLabOrder, deleteLabOrder };
