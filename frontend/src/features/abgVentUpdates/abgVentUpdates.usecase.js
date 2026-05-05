/**
 * ABG / Vent Update Use Cases
 */
import { normalizeError } from '@errors';
import { addToQueue } from '@offline/queue';
import { getIsOnline } from '@offline/network.listener';
import {
  createAbgVentUpdateRequest,
  getAdmissionAbgVentilatorContextApi,
  listActiveAdmissionsApi,
  saveAbgVentUpdateApi,
} from './abgVentUpdates.api';
import { buildAbgVentUpdatePayload } from './abgVentUpdates.model';

const ABG_VENT_UPDATE_QUEUE_TYPE = 'abg_vent_update';

const isConflictError = (error) =>
  error?.status === 409 || error?.statusCode === 409 || error?.code === 'CONFLICT';

const listActiveAdmissionsUseCase = async (input) => listActiveAdmissionsApi(input);

const loadAdmissionAbgVentilatorContextUseCase = async (admissionId) =>
  getAdmissionAbgVentilatorContextApi(admissionId);

const submitAbgVentUpdateUseCase = async ({
  admissionId,
  abg,
  ventilator,
  uncertainty,
  deviceContext,
  source = 'abg_vent_update',
  clientRecordId,
  idempotencyKey,
  now,
  isOnline = getIsOnline(),
} = {}) => {
  const payload = buildAbgVentUpdatePayload({
    admissionId,
    abg,
    ventilator,
    uncertainty,
    deviceContext,
    source,
    clientRecordId,
    idempotencyKey,
    now,
  });
  const request = createAbgVentUpdateRequest(admissionId, payload);
  const queueItem = {
    ...request,
    syncState: 'pending',
    retryCount: 0,
    queueMeta: {
      type: ABG_VENT_UPDATE_QUEUE_TYPE,
      admissionId,
      clientRecordId: payload.clientRecordId,
      idempotencyKey: payload.idempotencyKey,
      clientUpdatedAt: payload.clientUpdatedAt,
      source,
    },
  };

  if (!isOnline) {
    const queued = await addToQueue(queueItem);
    if (!queued) throw new Error('OFFLINE_QUEUE_FAILED');
    return {
      ok: true,
      syncStatus: 'queued',
      payload,
      request: queueItem,
    };
  }

  try {
    const data = await saveAbgVentUpdateApi(admissionId, payload);
    return {
      ok: true,
      syncStatus: data?.syncStatus || 'synced',
      data,
      payload,
    };
  } catch (error) {
    const normalized = normalizeError(error);
    if (isConflictError(normalized) || isConflictError(error)) {
      return {
        ok: false,
        syncStatus: 'conflict',
        error: normalized,
        conflict: normalized.meta || error?.meta || null,
        payload,
      };
    }
    throw normalized;
  }
};

export {
  ABG_VENT_UPDATE_QUEUE_TYPE,
  listActiveAdmissionsUseCase,
  loadAdmissionAbgVentilatorContextUseCase,
  submitAbgVentUpdateUseCase,
};
