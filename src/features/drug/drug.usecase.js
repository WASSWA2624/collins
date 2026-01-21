/**
 * Drug Use Cases
 * File: drug.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { drugApi } from './drug.api';
import { normalizeDrug, normalizeDrugList } from './drug.model';
import { parseDrugId, parseDrugListParams, parseDrugPayload } from './drug.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDrugs = async (params = {}) =>
  execute(async () => {
    const parsed = parseDrugListParams(params);
    const response = await drugApi.list(parsed);
    return normalizeDrugList(response.data);
  });

const getDrug = async (id) =>
  execute(async () => {
    const parsedId = parseDrugId(id);
    const response = await drugApi.get(parsedId);
    return normalizeDrug(response.data);
  });

const createDrug = async (payload) =>
  execute(async () => {
    const parsed = parseDrugPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDrug(parsed);
    }
    const response = await drugApi.create(parsed);
    return normalizeDrug(response.data);
  });

const updateDrug = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDrugId(id);
    const parsed = parseDrugPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDrug({ id: parsedId, ...parsed });
    }
    const response = await drugApi.update(parsedId, parsed);
    return normalizeDrug(response.data);
  });

const deleteDrug = async (id) =>
  execute(async () => {
    const parsedId = parseDrugId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DRUGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDrug({ id: parsedId });
    }
    const response = await drugApi.remove(parsedId);
    return normalizeDrug(response.data);
  });

export { listDrugs, getDrug, createDrug, updateDrug, deleteDrug };
