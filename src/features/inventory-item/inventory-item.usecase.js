/**
 * Inventory Item Use Cases
 * File: inventory-item.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { inventoryItemApi } from './inventory-item.api';
import { normalizeInventoryItem, normalizeInventoryItemList } from './inventory-item.model';
import {
  parseInventoryItemId,
  parseInventoryItemListParams,
  parseInventoryItemPayload,
} from './inventory-item.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listInventoryItems = async (params = {}) =>
  execute(async () => {
    const parsed = parseInventoryItemListParams(params);
    const response = await inventoryItemApi.list(parsed);
    return normalizeInventoryItemList(response.data);
  });

const getInventoryItem = async (id) =>
  execute(async () => {
    const parsedId = parseInventoryItemId(id);
    const response = await inventoryItemApi.get(parsedId);
    return normalizeInventoryItem(response.data);
  });

const createInventoryItem = async (payload) =>
  execute(async () => {
    const parsed = parseInventoryItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_ITEMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeInventoryItem(parsed);
    }
    const response = await inventoryItemApi.create(parsed);
    return normalizeInventoryItem(response.data);
  });

const updateInventoryItem = async (id, payload) =>
  execute(async () => {
    const parsedId = parseInventoryItemId(id);
    const parsed = parseInventoryItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_ITEMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeInventoryItem({ id: parsedId, ...parsed });
    }
    const response = await inventoryItemApi.update(parsedId, parsed);
    return normalizeInventoryItem(response.data);
  });

const deleteInventoryItem = async (id) =>
  execute(async () => {
    const parsedId = parseInventoryItemId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_ITEMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeInventoryItem({ id: parsedId });
    }
    const response = await inventoryItemApi.remove(parsedId);
    return normalizeInventoryItem(response.data);
  });

export {
  listInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
