/**
 * Stock Movement Use Cases
 * File: stock-movement.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { stockMovementApi } from './stock-movement.api';
import { normalizeStockMovement, normalizeStockMovementList } from './stock-movement.model';
import {
  parseStockMovementId,
  parseStockMovementListParams,
  parseStockMovementPayload,
} from './stock-movement.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStockMovements = async (params = {}) =>
  execute(async () => {
    const parsed = parseStockMovementListParams(params);
    const response = await stockMovementApi.list(parsed);
    return normalizeStockMovementList(response.data);
  });

const getStockMovement = async (id) =>
  execute(async () => {
    const parsedId = parseStockMovementId(id);
    const response = await stockMovementApi.get(parsedId);
    return normalizeStockMovement(response.data);
  });

const createStockMovement = async (payload) =>
  execute(async () => {
    const parsed = parseStockMovementPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_MOVEMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStockMovement(parsed);
    }
    const response = await stockMovementApi.create(parsed);
    return normalizeStockMovement(response.data);
  });

const updateStockMovement = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStockMovementId(id);
    const parsed = parseStockMovementPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_MOVEMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStockMovement({ id: parsedId, ...parsed });
    }
    const response = await stockMovementApi.update(parsedId, parsed);
    return normalizeStockMovement(response.data);
  });

const deleteStockMovement = async (id) =>
  execute(async () => {
    const parsedId = parseStockMovementId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_MOVEMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStockMovement({ id: parsedId });
    }
    const response = await stockMovementApi.remove(parsedId);
    return normalizeStockMovement(response.data);
  });

export {
  listStockMovements,
  getStockMovement,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
};
