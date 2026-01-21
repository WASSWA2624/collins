/**
 * Inventory Stock Use Cases
 * File: inventory-stock.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { inventoryStockApi } from './inventory-stock.api';
import { normalizeInventoryStock, normalizeInventoryStockList } from './inventory-stock.model';
import {
  parseInventoryStockId,
  parseInventoryStockListParams,
  parseInventoryStockPayload,
} from './inventory-stock.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listInventoryStocks = async (params = {}) =>
  execute(async () => {
    const parsed = parseInventoryStockListParams(params);
    const response = await inventoryStockApi.list(parsed);
    return normalizeInventoryStockList(response.data);
  });

const getInventoryStock = async (id) =>
  execute(async () => {
    const parsedId = parseInventoryStockId(id);
    const response = await inventoryStockApi.get(parsedId);
    return normalizeInventoryStock(response.data);
  });

const createInventoryStock = async (payload) =>
  execute(async () => {
    const parsed = parseInventoryStockPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_STOCKS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeInventoryStock(parsed);
    }
    const response = await inventoryStockApi.create(parsed);
    return normalizeInventoryStock(response.data);
  });

const updateInventoryStock = async (id, payload) =>
  execute(async () => {
    const parsedId = parseInventoryStockId(id);
    const parsed = parseInventoryStockPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_STOCKS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeInventoryStock({ id: parsedId, ...parsed });
    }
    const response = await inventoryStockApi.update(parsedId, parsed);
    return normalizeInventoryStock(response.data);
  });

const deleteInventoryStock = async (id) =>
  execute(async () => {
    const parsedId = parseInventoryStockId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.INVENTORY_STOCKS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeInventoryStock({ id: parsedId });
    }
    const response = await inventoryStockApi.remove(parsedId);
    return normalizeInventoryStock(response.data);
  });

export {
  listInventoryStocks,
  getInventoryStock,
  createInventoryStock,
  updateInventoryStock,
  deleteInventoryStock,
};
