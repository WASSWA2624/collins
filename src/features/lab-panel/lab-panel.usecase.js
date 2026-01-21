/**
 * Lab Panel Use Cases
 * File: lab-panel.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labPanelApi } from './lab-panel.api';
import { normalizeLabPanel, normalizeLabPanelList } from './lab-panel.model';
import { parseLabPanelId, parseLabPanelListParams, parseLabPanelPayload } from './lab-panel.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabPanels = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabPanelListParams(params);
    const response = await labPanelApi.list(parsed);
    return normalizeLabPanelList(response.data);
  });

const getLabPanel = async (id) =>
  execute(async () => {
    const parsedId = parseLabPanelId(id);
    const response = await labPanelApi.get(parsedId);
    return normalizeLabPanel(response.data);
  });

const createLabPanel = async (payload) =>
  execute(async () => {
    const parsed = parseLabPanelPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_PANELS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabPanel(parsed);
    }
    const response = await labPanelApi.create(parsed);
    return normalizeLabPanel(response.data);
  });

const updateLabPanel = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabPanelId(id);
    const parsed = parseLabPanelPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_PANELS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabPanel({ id: parsedId, ...parsed });
    }
    const response = await labPanelApi.update(parsedId, parsed);
    return normalizeLabPanel(response.data);
  });

const deleteLabPanel = async (id) =>
  execute(async () => {
    const parsedId = parseLabPanelId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_PANELS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabPanel({ id: parsedId });
    }
    const response = await labPanelApi.remove(parsedId);
    return normalizeLabPanel(response.data);
  });

export { listLabPanels, getLabPanel, createLabPanel, updateLabPanel, deleteLabPanel };
