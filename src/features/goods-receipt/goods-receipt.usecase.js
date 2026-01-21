/**
 * Goods Receipt Use Cases
 * File: goods-receipt.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { goodsReceiptApi } from './goods-receipt.api';
import { normalizeGoodsReceipt, normalizeGoodsReceiptList } from './goods-receipt.model';
import {
  parseGoodsReceiptId,
  parseGoodsReceiptListParams,
  parseGoodsReceiptPayload,
} from './goods-receipt.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listGoodsReceipts = async (params = {}) =>
  execute(async () => {
    const parsed = parseGoodsReceiptListParams(params);
    const response = await goodsReceiptApi.list(parsed);
    return normalizeGoodsReceiptList(response.data);
  });

const getGoodsReceipt = async (id) =>
  execute(async () => {
    const parsedId = parseGoodsReceiptId(id);
    const response = await goodsReceiptApi.get(parsedId);
    return normalizeGoodsReceipt(response.data);
  });

const createGoodsReceipt = async (payload) =>
  execute(async () => {
    const parsed = parseGoodsReceiptPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.GOODS_RECEIPTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeGoodsReceipt(parsed);
    }
    const response = await goodsReceiptApi.create(parsed);
    return normalizeGoodsReceipt(response.data);
  });

const updateGoodsReceipt = async (id, payload) =>
  execute(async () => {
    const parsedId = parseGoodsReceiptId(id);
    const parsed = parseGoodsReceiptPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.GOODS_RECEIPTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeGoodsReceipt({ id: parsedId, ...parsed });
    }
    const response = await goodsReceiptApi.update(parsedId, parsed);
    return normalizeGoodsReceipt(response.data);
  });

const deleteGoodsReceipt = async (id) =>
  execute(async () => {
    const parsedId = parseGoodsReceiptId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.GOODS_RECEIPTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeGoodsReceipt({ id: parsedId });
    }
    const response = await goodsReceiptApi.remove(parsedId);
    return normalizeGoodsReceipt(response.data);
  });

export {
  listGoodsReceipts,
  getGoodsReceipt,
  createGoodsReceipt,
  updateGoodsReceipt,
  deleteGoodsReceipt,
};
