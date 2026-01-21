/**
 * ICU Observation Use Cases
 * File: icu-observation.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { icuObservationApi } from './icu-observation.api';
import {
  normalizeIcuObservation,
  normalizeIcuObservationList,
} from './icu-observation.model';
import {
  parseIcuObservationId,
  parseIcuObservationListParams,
  parseIcuObservationPayload,
} from './icu-observation.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listIcuObservations = async (params = {}) =>
  execute(async () => {
    const parsed = parseIcuObservationListParams(params);
    const response = await icuObservationApi.list(parsed);
    return normalizeIcuObservationList(response.data);
  });

const getIcuObservation = async (id) =>
  execute(async () => {
    const parsedId = parseIcuObservationId(id);
    const response = await icuObservationApi.get(parsedId);
    return normalizeIcuObservation(response.data);
  });

const createIcuObservation = async (payload) =>
  execute(async () => {
    const parsed = parseIcuObservationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_OBSERVATIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIcuObservation(parsed);
    }
    const response = await icuObservationApi.create(parsed);
    return normalizeIcuObservation(response.data);
  });

const updateIcuObservation = async (id, payload) =>
  execute(async () => {
    const parsedId = parseIcuObservationId(id);
    const parsed = parseIcuObservationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_OBSERVATIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeIcuObservation({ id: parsedId, ...parsed });
    }
    const response = await icuObservationApi.update(parsedId, parsed);
    return normalizeIcuObservation(response.data);
  });

const deleteIcuObservation = async (id) =>
  execute(async () => {
    const parsedId = parseIcuObservationId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ICU_OBSERVATIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeIcuObservation({ id: parsedId });
    }
    const response = await icuObservationApi.remove(parsedId);
    return normalizeIcuObservation(response.data);
  });

export {
  listIcuObservations,
  getIcuObservation,
  createIcuObservation,
  updateIcuObservation,
  deleteIcuObservation,
};
