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
  createAdmission,
} from '../admissions/admissions.service.js';

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

const publicStatus = (status) => ({
  SYNCED: 'synced',
  DUPLICATE: 'duplicate',
  CONFLICT: 'conflict',
  FAILED_VALIDATION: 'failed_validation',
  NEEDS_REVIEW: 'needs_review',
  FAILED: 'failed',
}[status] || 'failed');

const withOfflineMetadata = (item) => ({
  ...item.payload,
  idempotencyKey: item.idempotencyKey,
  clientRecordId: item.clientRecordId || item.payload.clientRecordId,
  clientCreatedAt: item.clientCreatedAt || item.payload.clientCreatedAt,
  clientUpdatedAt: item.clientUpdatedAt || item.payload.clientUpdatedAt,
  deviceId: item.deviceId || item.payload.deviceId,
});

const runOperation = async (item, userId, req) => {
  const auditContext = buildAuditContext(req);
  const payload = withOfflineMetadata(item);

  switch (item.operation) {
    case 'create_admission':
      return createAdmission(payload, userId, auditContext);
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
      await prisma.syncEvent.create({
        data: {
          userId,
          facilityId: item.facilityId || item.payload.facilityId || result.admission?.facilityId || null,
          operation: item.operation,
          entityType,
          entityId: result.admission?.id || result.abgTest?.id || result.ventilatorSetting?.id || null,
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
        status: publicStatus(status),
        data: result,
      });
    } catch (error) {
      const status = statusFromError(error);
      await prisma.syncEvent.create({
        data: {
          userId,
          facilityId: item.facilityId || item.payload.facilityId || null,
          operation: item.operation,
          entityType: item.operation.replace(/^create_/, ''),
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
        status: publicStatus(status),
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
