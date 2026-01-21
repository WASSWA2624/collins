/**
 * Critical Alert Use Cases
 * File: critical-alert.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { criticalAlertApi } from './critical-alert.api';
import { normalizeCriticalAlert, normalizeCriticalAlertList } from './critical-alert.model';
import {
  parseCriticalAlertId,
  parseCriticalAlertListParams,
  parseCriticalAlertPayload,
} from './critical-alert.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listCriticalAlerts = async (params = {}) =>
  execute(async () => {
    const parsed = parseCriticalAlertListParams(params);
    const response = await criticalAlertApi.list(parsed);
    return normalizeCriticalAlertList(response.data);
  });

const getCriticalAlert = async (id) =>
  execute(async () => {
    const parsedId = parseCriticalAlertId(id);
    const response = await criticalAlertApi.get(parsedId);
    return normalizeCriticalAlert(response.data);
  });

const createCriticalAlert = async (payload) =>
  execute(async () => {
    const parsed = parseCriticalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CRITICAL_ALERTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeCriticalAlert(parsed);
    }
    const response = await criticalAlertApi.create(parsed);
    return normalizeCriticalAlert(response.data);
  });

const updateCriticalAlert = async (id, payload) =>
  execute(async () => {
    const parsedId = parseCriticalAlertId(id);
    const parsed = parseCriticalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CRITICAL_ALERTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeCriticalAlert({ id: parsedId, ...parsed });
    }
    const response = await criticalAlertApi.update(parsedId, parsed);
    return normalizeCriticalAlert(response.data);
  });

const deleteCriticalAlert = async (id) =>
  execute(async () => {
    const parsedId = parseCriticalAlertId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.CRITICAL_ALERTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeCriticalAlert({ id: parsedId });
    }
    const response = await criticalAlertApi.remove(parsedId);
    return normalizeCriticalAlert(response.data);
  });

export {
  listCriticalAlerts,
  getCriticalAlert,
  createCriticalAlert,
  updateCriticalAlert,
  deleteCriticalAlert,
};
