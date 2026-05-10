/**
 * New Patient API
 * Three-step New Patient flow with offline queue fallback.
 * File: admission.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';
import { addToQueue } from '@offline/queue';
import { queueRequestIfOffline } from '@offline/request';

const ADMISSION_SYNC_STATUS = Object.freeze({
  SYNCED: 'synced',
  DUPLICATE: 'duplicate',
  QUEUED: 'queued',
  NEEDS_SYNC: 'needs_sync',
});

const createAdmissionClientRecordId = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `new-patient-${Date.now().toString(36)}-${random}`;
};

const isRetryableNetworkError = (error) =>
  error?.code === 'NETWORK_ERROR' ||
  error?.name === 'NetworkError' ||
  (typeof error?.message === 'string' && error.message.toLowerCase().includes('network'));

const extractPayload = (response) => {
  const envelope = response?.data;
  return envelope?.data ?? envelope ?? null;
};

const withoutLocalOnlyFields = (payload = {}) => {
  const { facilityId, ...body } = payload || {};
  return body;
};

const sendOrQueue = async (request, queuedPayload) => {
  const queuedBeforeSend = await queueRequestIfOffline(request);
  if (queuedBeforeSend) {
    return {
      ...queuedPayload,
      syncStatus: ADMISSION_SYNC_STATUS.QUEUED,
    };
  }

  try {
    const response = await apiClient(request);
    const payload = extractPayload(response);
    return {
      ...(payload && typeof payload === 'object' ? payload : {}),
      syncStatus: payload?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    };
  } catch (error) {
    if (!isRetryableNetworkError(error)) throw error;

    const queuedAfterFailure = await addToQueue(request);
    if (!queuedAfterFailure) throw error;

    return {
      ...queuedPayload,
      syncStatus: ADMISSION_SYNC_STATUS.QUEUED,
    };
  }
};

const createLocalAdmissionPayload = ({ step, admissionId, clientRecordId, facilityId }) => ({
  step,
  facilityId,
  admission: {
    id: admissionId || clientRecordId,
    clientRecordId,
    facilityId,
  },
});

const savePatientReasonStepApi = async (payload) =>
  sendOrQueue(
    {
      url: endpoints.ADMISSIONS.THREE_STEP_PATIENT_REASON,
      method: 'POST',
      body: payload,
      facilityId: payload?.facilityId,
    },
    createLocalAdmissionPayload({
      step: 'patient_reason',
      admissionId: payload?.clientRecordId,
      clientRecordId: payload?.clientRecordId,
      facilityId: payload?.facilityId,
    })
  );

const saveOxygenAbgVentilatorStepApi = async (admissionId, payload) =>
  sendOrQueue(
    {
      url: endpoints.ADMISSIONS.THREE_STEP_OXYGEN_ABG_VENTILATOR(admissionId),
      method: 'POST',
      body: withoutLocalOnlyFields(payload),
      facilityId: payload?.facilityId,
    },
    createLocalAdmissionPayload({
      step: 'oxygen_abg_ventilator',
      admissionId,
      clientRecordId: payload?.clientRecordId,
      facilityId: payload?.facilityId,
    })
  );

const saveAdmissionReviewStepApi = async (admissionId, payload) =>
  sendOrQueue(
    {
      url: endpoints.ADMISSIONS.THREE_STEP_SAVE_REVIEW(admissionId),
      method: 'POST',
      body: withoutLocalOnlyFields(payload),
      facilityId: payload?.facilityId,
    },
    {
      ...createLocalAdmissionPayload({
        step: 'save_review',
        admissionId,
        clientRecordId: payload?.clientRecordId,
        facilityId: payload?.facilityId,
      }),
      review: {
        clinicianConfirmed: payload?.clinicianConfirmed === true,
        overrideRecorded: Boolean(payload?.overrideReason),
        admissionReviewStatus: 'PENDING',
      },
    }
  );

export {
  ADMISSION_SYNC_STATUS,
  createAdmissionClientRecordId,
  savePatientReasonStepApi,
  saveOxygenAbgVentilatorStepApi,
  saveAdmissionReviewStepApi,
};
