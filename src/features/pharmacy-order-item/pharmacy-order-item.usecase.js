/**
 * Pharmacy Order Item Use Cases
 * File: pharmacy-order-item.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { pharmacyOrderItemApi } from './pharmacy-order-item.api';
import { normalizePharmacyOrderItem, normalizePharmacyOrderItemList } from './pharmacy-order-item.model';
import {
  parsePharmacyOrderItemId,
  parsePharmacyOrderItemListParams,
  parsePharmacyOrderItemPayload,
} from './pharmacy-order-item.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPharmacyOrderItems = async (params = {}) =>
  execute(async () => {
    const parsed = parsePharmacyOrderItemListParams(params);
    const response = await pharmacyOrderItemApi.list(parsed);
    return normalizePharmacyOrderItemList(response.data);
  });

const getPharmacyOrderItem = async (id) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderItemId(id);
    const response = await pharmacyOrderItemApi.get(parsedId);
    return normalizePharmacyOrderItem(response.data);
  });

const createPharmacyOrderItem = async (payload) =>
  execute(async () => {
    const parsed = parsePharmacyOrderItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDER_ITEMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePharmacyOrderItem(parsed);
    }
    const response = await pharmacyOrderItemApi.create(parsed);
    return normalizePharmacyOrderItem(response.data);
  });

const updatePharmacyOrderItem = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderItemId(id);
    const parsed = parsePharmacyOrderItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDER_ITEMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePharmacyOrderItem({ id: parsedId, ...parsed });
    }
    const response = await pharmacyOrderItemApi.update(parsedId, parsed);
    return normalizePharmacyOrderItem(response.data);
  });

const deletePharmacyOrderItem = async (id) =>
  execute(async () => {
    const parsedId = parsePharmacyOrderItemId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHARMACY_ORDER_ITEMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePharmacyOrderItem({ id: parsedId });
    }
    const response = await pharmacyOrderItemApi.remove(parsedId);
    return normalizePharmacyOrderItem(response.data);
  });

export {
  listPharmacyOrderItems,
  getPharmacyOrderItem,
  createPharmacyOrderItem,
  updatePharmacyOrderItem,
  deletePharmacyOrderItem,
};
