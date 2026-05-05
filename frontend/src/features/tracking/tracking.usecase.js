/**
 * Tracking use cases
 * File: tracking.usecase.js
 */
import { handleError } from '@errors';
import {
  getTrackingAdmissionApi,
  getTrackingTimelineApi,
  listTrackingAdmissionsApi,
} from './tracking.api';
import { normalizeTrackingDetail, normalizeTrackingList } from './tracking.model';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const unwrap = (res) => res?.data?.data ?? res?.data;

const listTrackingAdmissionsUseCase = async (params = {}) =>
  execute(async () => {
    const response = await listTrackingAdmissionsApi({ status: 'ACTIVE', ...params });
    const body = unwrap(response);
    const items = Array.isArray(body) ? body : body?.items ?? body ?? [];
    return {
      items: normalizeTrackingList(items),
      meta: response?.data?.meta ?? body?.meta ?? {},
    };
  });

const getTrackingAdmissionUseCase = async (admissionId) =>
  execute(async () => {
    if (!admissionId) throw new Error('Tracking admission id is required');
    const response = await getTrackingAdmissionApi(admissionId);
    const body = unwrap(response);
    return normalizeTrackingDetail(body?.tracking ?? body ?? {});
  });

const getTrackingTimelineUseCase = async (admissionId) =>
  execute(async () => {
    if (!admissionId) throw new Error('Tracking admission id is required');
    const response = await getTrackingTimelineApi(admissionId);
    const body = unwrap(response);
    return body || { admissionId, timeline: [] };
  });

export {
  getTrackingAdmissionUseCase,
  getTrackingTimelineUseCase,
  listTrackingAdmissionsUseCase,
};
