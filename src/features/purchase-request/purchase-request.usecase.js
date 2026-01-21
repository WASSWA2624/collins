/**
 * Purchase Request Use Cases
 * File: purchase-request.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { purchaseRequestApi } from './purchase-request.api';
import { normalizePurchaseRequest, normalizePurchaseRequestList } from './purchase-request.model';
import {
  parsePurchaseRequestId,
  parsePurchaseRequestListParams,
  parsePurchaseRequestPayload,
} from './purchase-request.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPurchaseRequests = async (params = {}) =>
  execute(async () => {
    const parsed = parsePurchaseRequestListParams(params);
    const response = await purchaseRequestApi.list(parsed);
    return normalizePurchaseRequestList(response.data);
  });

const getPurchaseRequest = async (id) =>
  execute(async () => {
    const parsedId = parsePurchaseRequestId(id);
    const response = await purchaseRequestApi.get(parsedId);
    return normalizePurchaseRequest(response.data);
  });

const createPurchaseRequest = async (payload) =>
  execute(async () => {
    const parsed = parsePurchaseRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_REQUESTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePurchaseRequest(parsed);
    }
    const response = await purchaseRequestApi.create(parsed);
    return normalizePurchaseRequest(response.data);
  });

const updatePurchaseRequest = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePurchaseRequestId(id);
    const parsed = parsePurchaseRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_REQUESTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePurchaseRequest({ id: parsedId, ...parsed });
    }
    const response = await purchaseRequestApi.update(parsedId, parsed);
    return normalizePurchaseRequest(response.data);
  });

const deletePurchaseRequest = async (id) =>
  execute(async () => {
    const parsedId = parsePurchaseRequestId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PURCHASE_REQUESTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePurchaseRequest({ id: parsedId });
    }
    const response = await purchaseRequestApi.remove(parsedId);
    return normalizePurchaseRequest(response.data);
  });

export {
  listPurchaseRequests,
  getPurchaseRequest,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest,
};
