/**
 * Adverse Event Use Cases
 * File: adverse-event.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { adverseEventApi } from './adverse-event.api';
import { normalizeAdverseEvent, normalizeAdverseEventList } from './adverse-event.model';
import { parseAdverseEventId, parseAdverseEventListParams, parseAdverseEventPayload } from './adverse-event.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAdverseEvents = async (params = {}) =>
  execute(async () => {
    const parsed = parseAdverseEventListParams(params);
    const response = await adverseEventApi.list(parsed);
    return normalizeAdverseEventList(response.data);
  });

const getAdverseEvent = async (id) =>
  execute(async () => {
    const parsedId = parseAdverseEventId(id);
    const response = await adverseEventApi.get(parsedId);
    return normalizeAdverseEvent(response.data);
  });

const createAdverseEvent = async (payload) =>
  execute(async () => {
    const parsed = parseAdverseEventPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADVERSE_EVENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAdverseEvent(parsed);
    }
    const response = await adverseEventApi.create(parsed);
    return normalizeAdverseEvent(response.data);
  });

const updateAdverseEvent = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAdverseEventId(id);
    const parsed = parseAdverseEventPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADVERSE_EVENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAdverseEvent({ id: parsedId, ...parsed });
    }
    const response = await adverseEventApi.update(parsedId, parsed);
    return normalizeAdverseEvent(response.data);
  });

const deleteAdverseEvent = async (id) =>
  execute(async () => {
    const parsedId = parseAdverseEventId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADVERSE_EVENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAdverseEvent({ id: parsedId });
    }
    const response = await adverseEventApi.remove(parsedId);
    return normalizeAdverseEvent(response.data);
  });

export { listAdverseEvents, getAdverseEvent, createAdverseEvent, updateAdverseEvent, deleteAdverseEvent };
