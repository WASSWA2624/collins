/**
 * Purchase Order Use Cases
 * File: purchase-order.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { purchaseOrderApi } from './purchase-order.api';
import { normalizePurchaseOrder, normalizePurchaseOrderList } from './purchase-order.model';
import {
  parsePurchaseOrderId,
  parsePurchaseOrderListParams,
  parsePurchaseOrderPayload,
} from './purchase-order.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPurchaseOrders = async (params = {}) =>
  execute(async () => {
    const parsed = parsePurchaseOrderListParams(params);
    const response = await purchaseOrderApi.list(parsed);
    return normalizePurchaseOrderList(response.data);
  });

const getPurchaseOrder = async (id) =>
  execute(async () => {
    const parsedId = parsePurchaseOrderId(id);
    const response = await purchaseOrderApi.get(parsedId);
    return normalizePurchaseOrder(response.data);
  });

const createPurchaseOrder = async (payload) =>
  execute(async () => {
    const parsed = parsePurchaseOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_ORDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePurchaseOrder(parsed);
    }
    const response = await purchaseOrderApi.create(parsed);
    return normalizePurchaseOrder(response.data);
  });

const updatePurchaseOrder = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePurchaseOrderId(id);
    const parsed = parsePurchaseOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_ORDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePurchaseOrder({ id: parsedId, ...parsed });
    }
    const response = await purchaseOrderApi.update(parsedId, parsed);
    return normalizePurchaseOrder(response.data);
  });

const deletePurchaseOrder = async (id) =>
  execute(async () => {
    const parsedId = parsePurchaseOrderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_ORDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePurchaseOrder({ id: parsedId });
    }
    const response = await purchaseOrderApi.remove(parsedId);
    return normalizePurchaseOrder(response.data);
  });

export {
  listPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
