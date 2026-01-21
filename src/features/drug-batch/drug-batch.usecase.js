/**
 * Drug Batch Use Cases
 * File: drug-batch.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { drugBatchApi } from './drug-batch.api';
import { normalizeDrugBatch, normalizeDrugBatchList } from './drug-batch.model';
import { parseDrugBatchId, parseDrugBatchListParams, parseDrugBatchPayload } from './drug-batch.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDrugBatches = async (params = {}) =>
  execute(async () => {
    const parsed = parseDrugBatchListParams(params);
    const response = await drugBatchApi.list(parsed);
    return normalizeDrugBatchList(response.data);
  });

const getDrugBatch = async (id) =>
  execute(async () => {
    const parsedId = parseDrugBatchId(id);
    const response = await drugBatchApi.get(parsedId);
    return normalizeDrugBatch(response.data);
  });

const createDrugBatch = async (payload) =>
  execute(async () => {
    const parsed = parseDrugBatchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUG_BATCHES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDrugBatch(parsed);
    }
    const response = await drugBatchApi.create(parsed);
    return normalizeDrugBatch(response.data);
  });

const updateDrugBatch = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDrugBatchId(id);
    const parsed = parseDrugBatchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUG_BATCHES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDrugBatch({ id: parsedId, ...parsed });
    }
    const response = await drugBatchApi.update(parsedId, parsed);
    return normalizeDrugBatch(response.data);
  });

const deleteDrugBatch = async (id) =>
  execute(async () => {
    const parsedId = parseDrugBatchId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUG_BATCHES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDrugBatch({ id: parsedId });
    }
    const response = await drugBatchApi.remove(parsedId);
    return normalizeDrugBatch(response.data);
  });

export { listDrugBatches, getDrugBatch, createDrugBatch, updateDrugBatch, deleteDrugBatch };
