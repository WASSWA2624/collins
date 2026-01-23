/**
 * User Session Use Cases
 * File: user-session.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { deleteUserSessionApi, getUserSessionApi, listUserSessionsApi } from './user-session.api';
import { normalizeUserSession, normalizeUserSessionList } from './user-session.model';
import { parseUserSessionId, parseUserSessionListParams } from './user-session.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listUserSessions = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserSessionListParams(params);
    const response = await listUserSessionsApi(parsed);
    const raw = response?.data ?? {};
    const items = normalizeUserSessionList(Array.isArray(raw.data) ? raw.data : []);
    const pagination = raw.pagination ?? {};
    return { items, pagination };
  });

const getUserSession = async (id) =>
  execute(async () => {
    const parsedId = parseUserSessionId(id);
    const response = await getUserSessionApi(parsedId);
    const raw = response?.data ?? {};
    return normalizeUserSession(raw.data ?? raw);
  });

const revokeUserSession = async (id) =>
  execute(async () => {
    const parsedId = parseUserSessionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_SESSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return { id: parsedId };
    }
    await deleteUserSessionApi(parsedId);
    return { id: parsedId };
  });

export { listUserSessions, getUserSession, revokeUserSession };
