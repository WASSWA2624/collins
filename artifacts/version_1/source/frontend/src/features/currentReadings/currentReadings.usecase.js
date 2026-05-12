/**
 * Current readings use cases.
 */
import { normalizeError } from '@errors';
import { addToQueue } from '@offline/queue';
import { getIsOnline } from '@offline/network.listener';
import {
  createCurrentReadingsRequest,
  getCurrentReadingsVentilatorRecommendationApi,
  getAdmissionCurrentReadingsContextApi,
  listActiveAdmissionsApi,
  saveCurrentReadingsApi,
} from './currentReadings.api';
import {
  buildCurrentReadingsPayload,
  buildVentilatorRecommendationInputFromAdmission,
  getCurrentReadingsProgressAssessment,
} from './currentReadings.model';

const CURRENT_READINGS_QUEUE_TYPE = 'current_readings';

const isConflictError = (error) =>
  error?.status === 409 || error?.statusCode === 409 || error?.code === 'CONFLICT';

const listActiveAdmissionsUseCase = async (input) => listActiveAdmissionsApi(input);

const loadAdmissionCurrentReadingsContextUseCase = async (admissionId) =>
  getAdmissionCurrentReadingsContextApi(admissionId);

const submitCurrentReadingsUseCase = async ({
  admissionId,
  vitals,
  abg,
  ventilator,
  source = 'current_readings',
  clientRecordId,
  idempotencyKey,
  now,
  isOnline = getIsOnline(),
} = {}) => {
  const payload = buildCurrentReadingsPayload({
    admissionId,
    vitals,
    abg,
    ventilator,
    source,
    clientRecordId,
    idempotencyKey,
    now,
  });
  const request = createCurrentReadingsRequest(admissionId, payload);
  const queueItem = {
    ...request,
    syncState: 'pending',
    retryCount: 0,
    queueMeta: {
      type: CURRENT_READINGS_QUEUE_TYPE,
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
    const data = await saveCurrentReadingsApi(admissionId, payload);
    const admission = data?.admission || null;
    const progressAssessment =
      data?.progressAssessment ||
      (admission ? getCurrentReadingsProgressAssessment(admission) : null);
    let ventilatorRecommendation = data?.ventilatorRecommendation || null;
    let recommendationError = data?.recommendationError || null;

    if (
      !ventilatorRecommendation &&
      !recommendationError &&
      progressAssessment?.action === 'suggest_new_settings'
    ) {
      try {
        const recommendationResponse =
          await getCurrentReadingsVentilatorRecommendationApi({
            facilityId: data?.facilityId || admission?.facilityId,
            admissionId,
            input: buildVentilatorRecommendationInputFromAdmission(admission),
            backendSummary: data?.clinicalSummary || admission?.clinicalSummary,
          });
        ventilatorRecommendation =
          recommendationResponse?.recommendation || recommendationResponse || null;
      } catch (error) {
        recommendationError = normalizeError(error);
      }
    }

    return {
      ok: true,
      syncStatus: data?.syncStatus || 'synced',
      data,
      payload,
      progressAssessment,
      ventilatorRecommendation,
      recommendationError,
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
  CURRENT_READINGS_QUEUE_TYPE,
  listActiveAdmissionsUseCase,
  loadAdmissionCurrentReadingsContextUseCase,
  submitCurrentReadingsUseCase,
};
