/**
 * Stock Adjustment Use Cases
 * File: stock-adjustment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { stockAdjustmentApi } from './stock-adjustment.api';
import { normalizeStockAdjustment, normalizeStockAdjustmentList } from './stock-adjustment.model';
import {
  parseStockAdjustmentId,
  parseStockAdjustmentListParams,
  parseStockAdjustmentPayload,
} from './stock-adjustment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStockAdjustments = async (params = {}) =>
  execute(async () => {
    const parsed = parseStockAdjustmentListParams(params);
    const response = await stockAdjustmentApi.list(parsed);
    return normalizeStockAdjustmentList(response.data);
  });

const getStockAdjustment = async (id) =>
  execute(async () => {
    const parsedId = parseStockAdjustmentId(id);
    const response = await stockAdjustmentApi.get(parsedId);
    return normalizeStockAdjustment(response.data);
  });

const createStockAdjustment = async (payload) =>
  execute(async () => {
    const parsed = parseStockAdjustmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_ADJUSTMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStockAdjustment(parsed);
    }
    const response = await stockAdjustmentApi.create(parsed);
    return normalizeStockAdjustment(response.data);
  });

const updateStockAdjustment = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStockAdjustmentId(id);
    const parsed = parseStockAdjustmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_ADJUSTMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStockAdjustment({ id: parsedId, ...parsed });
    }
    const response = await stockAdjustmentApi.update(parsedId, parsed);
    return normalizeStockAdjustment(response.data);
  });

const deleteStockAdjustment = async (id) =>
  execute(async () => {
    const parsedId = parseStockAdjustmentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STOCK_ADJUSTMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStockAdjustment({ id: parsedId });
    }
    const response = await stockAdjustmentApi.remove(parsedId);
    return normalizeStockAdjustment(response.data);
  });

export {
  listStockAdjustments,
  getStockAdjustment,
  createStockAdjustment,
  updateStockAdjustment,
  deleteStockAdjustment,
};
