/**
 * Dispense Log Use Cases
 * File: dispense-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { dispenseLogApi } from './dispense-log.api';
import { normalizeDispenseLog, normalizeDispenseLogList } from './dispense-log.model';
import { parseDispenseLogId, parseDispenseLogListParams, parseDispenseLogPayload } from './dispense-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDispenseLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseDispenseLogListParams(params);
    const response = await dispenseLogApi.list(parsed);
    return normalizeDispenseLogList(response.data);
  });

const getDispenseLog = async (id) =>
  execute(async () => {
    const parsedId = parseDispenseLogId(id);
    const response = await dispenseLogApi.get(parsedId);
    return normalizeDispenseLog(response.data);
  });

const createDispenseLog = async (payload) =>
  execute(async () => {
    const parsed = parseDispenseLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISPENSE_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDispenseLog(parsed);
    }
    const response = await dispenseLogApi.create(parsed);
    return normalizeDispenseLog(response.data);
  });

const updateDispenseLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDispenseLogId(id);
    const parsed = parseDispenseLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISPENSE_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDispenseLog({ id: parsedId, ...parsed });
    }
    const response = await dispenseLogApi.update(parsedId, parsed);
    return normalizeDispenseLog(response.data);
  });

const deleteDispenseLog = async (id) =>
  execute(async () => {
    const parsedId = parseDispenseLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISPENSE_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDispenseLog({ id: parsedId });
    }
    const response = await dispenseLogApi.remove(parsedId);
    return normalizeDispenseLog(response.data);
  });

export { listDispenseLogs, getDispenseLog, createDispenseLog, updateDispenseLog, deleteDispenseLog };
