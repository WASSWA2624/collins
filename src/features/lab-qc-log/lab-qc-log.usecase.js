/**
 * Lab QC Log Use Cases
 * File: lab-qc-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labQcLogApi } from './lab-qc-log.api';
import { normalizeLabQcLog, normalizeLabQcLogList } from './lab-qc-log.model';
import { parseLabQcLogId, parseLabQcLogListParams, parseLabQcLogPayload } from './lab-qc-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabQcLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabQcLogListParams(params);
    const response = await labQcLogApi.list(parsed);
    return normalizeLabQcLogList(response.data);
  });

const getLabQcLog = async (id) =>
  execute(async () => {
    const parsedId = parseLabQcLogId(id);
    const response = await labQcLogApi.get(parsedId);
    return normalizeLabQcLog(response.data);
  });

const createLabQcLog = async (payload) =>
  execute(async () => {
    const parsed = parseLabQcLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_QC_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabQcLog(parsed);
    }
    const response = await labQcLogApi.create(parsed);
    return normalizeLabQcLog(response.data);
  });

const updateLabQcLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabQcLogId(id);
    const parsed = parseLabQcLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_QC_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabQcLog({ id: parsedId, ...parsed });
    }
    const response = await labQcLogApi.update(parsedId, parsed);
    return normalizeLabQcLog(response.data);
  });

const deleteLabQcLog = async (id) =>
  execute(async () => {
    const parsedId = parseLabQcLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_QC_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabQcLog({ id: parsedId });
    }
    const response = await labQcLogApi.remove(parsedId);
    return normalizeLabQcLog(response.data);
  });

export { listLabQcLogs, getLabQcLog, createLabQcLog, updateLabQcLog, deleteLabQcLog };
