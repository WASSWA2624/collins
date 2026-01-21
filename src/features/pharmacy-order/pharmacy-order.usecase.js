/**
 * Pharmacy Order Use Cases
 * File: pharmacy-order.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { pharmacyOrderApi } from './pharmacy-order.api';
import { normalizePharmacyOrder, normalizePharmacyOrderList } from './pharmacy-order.model';
import { parsePharmacyOrderId, parsePharmacyOrderListParams, parsePharmacyOrderPayload } from './pharmacy-order.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPharmacyOrders = async (params = {}) =>
  execute(async () => {
    const parsed = parsePharmacyOrderListParams(params);
    const response = await pharmacyOrderApi.list(parsed);
    return normalizePharmacyOrderList(response.data);
  });

const getPharmacyOrder = async (id) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderId(id);
    const response = await pharmacyOrderApi.get(parsedId);
    return normalizePharmacyOrder(response.data);
  });

const createPharmacyOrder = async (payload) =>
  execute(async () => {
    const parsed = parsePharmacyOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePharmacyOrder(parsed);
    }
    const response = await pharmacyOrderApi.create(parsed);
    return normalizePharmacyOrder(response.data);
  });

const updatePharmacyOrder = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderId(id);
    const parsed = parsePharmacyOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePharmacyOrder({ id: parsedId, ...parsed });
    }
    const response = await pharmacyOrderApi.update(parsedId, parsed);
    return normalizePharmacyOrder(response.data);
  });

const deletePharmacyOrder = async (id) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePharmacyOrder({ id: parsedId });
    }
    const response = await pharmacyOrderApi.remove(parsedId);
    return normalizePharmacyOrder(response.data);
  });

export { listPharmacyOrders, getPharmacyOrder, createPharmacyOrder, updatePharmacyOrder, deletePharmacyOrder };
