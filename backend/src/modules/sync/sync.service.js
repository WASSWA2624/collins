import { prisma } from '../../config/prisma.js';
import { buildAuditContext, writeAudit } from '../../utils/audit.js';
import {
  addAbgTest,
  addAirwayDevice,
  addClinicalSnapshot,
  addDailyReview,
  addHumidification,
  addOutcome,
  addVentilatorSetting,
  assertNoConflictForSync,
  createAdmission,
  createAdmissionPatientReasonStep,
  saveAdmissionOxygenAbgVentilatorStep,
  saveAdmissionReviewStep,
} from '../admissions/admissions.service.js';
import { toPublicSyncStatus } from '../../utils/syncStatus.js';

const serializeError = (error) => ({
  message: error.message || 'Sync item failed',
  status: error.status || 500,
  errors: error.errors || [],
  meta: error.meta,
});

const statusFromError = (error) => {
  if (error.status === 409) return 'CONFLICT';
  if (error.status === 400) return 'FAILED_VALIDATION';
  if (error.status === 422) return 'NEEDS_REVIEW';
  return 'FAILED';
};

const withOfflineMetadata = (item) => ({
  ...item.payload,
  idempotencyKey: item.idempotencyKey,
  clientRecordId: item.clientRecordId || item.payload.clientRecordId,
  clientCreatedAt: item.clientCreatedAt || item.payload.clientCreatedAt,
  clientUpdatedAt: item.clientUpdatedAt || item.payload.clientUpdatedAt,
  deviceId: item.deviceId || item.payload.deviceId,
});

const getResultEntityId = (result, fallbackAdmissionId = null) => result.admission?.id
  || result.clinicalSnapshot?.id
  || result.abgTest?.id
  || result.ventilatorSetting?.id
  || result.airwayDevice?.id
  || result.humidificationDecision?.id
  || result.dailyVentilationReview?.id
  || result.outcome?.id
  || fallbackAdmissionId
  || null;

const runOperation = async (item, userId, req) => {
  const auditContext = buildAuditContext(req);
  const payload = withOfflineMetadata(item);
  const shouldCheckAdmissionConflict = [
    'save_admission_oxygen_abg_ventilator_step',
    'save_admission_review_step',
  ].includes(item.operation);

  if (shouldCheckAdmissionConflict) {
    await assertNoConflictForSync({ admissionId: item.admissionId, clientUpdatedAt: payload.clientUpdatedAt });
  }

  switch (item.operation) {
    case 'create_admission':
      return createAdmission(payload, userId, auditContext);
    case 'create_admission_patient_reason_step':
      return createAdmissionPatientReasonStep(payload, userId, auditContext);
    case 'save_admission_oxygen_abg_ventilator_step':
      return saveAdmissionOxygenAbgVentilatorStep(userId, item.admissionId, payload, auditContext);
    case 'save_admission_review_step':
      return saveAdmissionReviewStep(userId, item.admissionId, payload, auditContext);
    case 'create_clinical_snapshot':
      return addClinicalSnapshot(userId, item.admissionId, payload, auditContext);
    case 'create_abg_test':
      return addAbgTest(userId, item.admissionId, payload, auditContext);
    case 'create_ventilator_setting':
      return addVentilatorSetting(userId, item.admissionId, payload, auditContext);
    case 'create_airway_device':
      return addAirwayDevice(userId, item.admissionId, payload, auditContext);
    case 'create_humidification':
      return addHumidification(userId, item.admissionId, payload, auditContext);
    case 'create_daily_review':
      return addDailyReview(userId, item.admissionId, payload, auditContext);
    case 'create_outcome':
      return addOutcome(userId, item.admissionId, payload, auditContext);
    default:
      throw new Error('Unsupported sync operation');
  }
};

export const processSyncQueue = async (items, userId, req) => {
  const results = [];

  for (const item of items) {
    try {
      const result = await runOperation(item, userId, req);
      const status = result.syncStatus === 'duplicate' ? 'DUPLICATE' : 'SYNCED';
      const entityType = item.operation.replace(/^create_/, '');
      const entityId = getResultEntityId(result, item.admissionId);
      await prisma.syncEvent.create({
        data: {
          userId,
          facilityId: item.facilityId || item.payload.facilityId || result.facilityId || result.admission?.facilityId || null,
          operation: item.operation,
          entityType,
          entityId,
          clientRecordId: item.clientRecordId,
          idempotencyKey: item.idempotencyKey,
          status,
          requestPayloadJson: item.payload,
          responsePayloadJson: result,
          clientCreatedAt: item.clientCreatedAt,
          clientUpdatedAt: item.clientUpdatedAt,
          deviceId: item.deviceId,
          resolvedAt: new Date(),
        },
      });
      results.push({
        idempotencyKey: item.idempotencyKey,
        operation: item.operation,
        status: toPublicSyncStatus(status),
        data: result,
      });
    } catch (error) {
      const status = statusFromError(error);
      const allowedFailureFacilityId = [401, 403].includes(error.status)
        ? null
        : item.facilityId || item.payload.facilityId || error.meta?.facilityId || null;
      await prisma.syncEvent.create({
        data: {
          userId,
          facilityId: allowedFailureFacilityId,
          operation: item.operation,
          entityType: item.operation.replace(/^create_/, ''),
          entityId: item.admissionId || null,
          clientRecordId: item.clientRecordId,
          idempotencyKey: item.idempotencyKey,
          status,
          requestPayloadJson: item.payload,
          conflictPayloadJson: error.meta || null,
          errorMessage: error.message,
          clientCreatedAt: item.clientCreatedAt,
          clientUpdatedAt: item.clientUpdatedAt,
          deviceId: item.deviceId,
        },
      });
      results.push({
        idempotencyKey: item.idempotencyKey,
        operation: item.operation,
        status: toPublicSyncStatus(status),
        error: serializeError(error),
      });
    }
  }

  await writeAudit({
    ...buildAuditContext(req),
    userId,
    action: 'SYNC_QUEUE_PROCESS',
    entityType: 'SyncEvent',
    afterJson: { total: items.length, statuses: results.map((result) => result.status) },
  });

  return results;
};
