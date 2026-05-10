import { prisma } from '../../config/prisma.js';
import { assertAdmissionAccess, resolveFacilityScope } from '../../utils/authorization.js';
import { notFound } from '../../utils/errors.js';
import {
  newPatientInclude,
  buildClinicalSummary,
  fullNewPatientInclude,
} from '../newPatients/newPatients.service.js';
import {
  buildCurrentTrackingStatus,
  buildReviewState,
  buildSyncState,
  buildTrackingListItem,
  buildTrackingTimeline,
} from './tracking.helpers.js';

const syncEventSelect = {
  id: true,
  operation: true,
  entityType: true,
  entityId: true,
  clientRecordId: true,
  idempotencyKey: true,
  status: true,
  conflictPayloadJson: true,
  errorMessage: true,
  receivedAt: true,
  resolvedAt: true,
  createdAt: true,
};

const addIfPresent = (set, value) => {
  if (value) set.add(value);
};

const addRecordKeys = ({ entityIds, clientRecordIds }, records = []) => {
  for (const record of records || []) {
    addIfPresent(entityIds, record.id);
    addIfPresent(clientRecordIds, record.clientRecordId);
  }
};

const collectAdmissionSyncKeys = (admission) => {
  const entityIds = new Set();
  const clientRecordIds = new Set();

  addIfPresent(entityIds, admission.id);
  addIfPresent(clientRecordIds, admission.clientRecordId);
  addRecordKeys({ entityIds, clientRecordIds }, admission.clinicalSnapshots);
  addRecordKeys({ entityIds, clientRecordIds }, admission.abgTests);
  addRecordKeys({ entityIds, clientRecordIds }, admission.ventilatorSettings);
  addRecordKeys({ entityIds, clientRecordIds }, admission.airwayDevices);
  addRecordKeys({ entityIds, clientRecordIds }, admission.humidificationDecisions);
  addRecordKeys({ entityIds, clientRecordIds }, admission.dailyReviews);
  addRecordKeys({ entityIds, clientRecordIds }, admission.outcomes);

  return { entityIds, clientRecordIds };
};

const buildSyncEventWhere = (entityIds, clientRecordIds) => {
  const OR = [];
  if (entityIds.size > 0) OR.push({ entityId: { in: [...entityIds] } });
  if (clientRecordIds.size > 0) OR.push({ clientRecordId: { in: [...clientRecordIds] } });
  return OR.length > 0 ? { OR } : null;
};

const listSyncEventsForAdmissions = async (admissions) => {
  const keyEntries = admissions.map((admission) => [admission.id, collectAdmissionSyncKeys(admission)]);
  const entityIds = new Set();
  const clientRecordIds = new Set();

  for (const [, keys] of keyEntries) {
    for (const id of keys.entityIds) entityIds.add(id);
    for (const id of keys.clientRecordIds) clientRecordIds.add(id);
  }

  const where = buildSyncEventWhere(entityIds, clientRecordIds);
  if (!where) return new Map(keyEntries.map(([admissionId]) => [admissionId, []]));

  const events = await prisma.syncEvent.findMany({
    where,
    select: syncEventSelect,
    orderBy: { createdAt: 'desc' },
    take: Math.max(100, admissions.length * 25),
  });

  return new Map(keyEntries.map(([admissionId, keys]) => [
    admissionId,
    events.filter((event) => keys.entityIds.has(event.entityId) || keys.clientRecordIds.has(event.clientRecordId)),
  ]));
};

export const listTrackingAdmissions = async (userId, { facilityId, status, reviewStatus, patientPathway, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(status && status !== 'ALL' ? { status } : {}),
    ...(reviewStatus ? { reviewStatus } : {}),
    ...(patientPathway ? { patient: { patientPathway } } : {}),
  };

  const [admissions, total] = await Promise.all([
    prisma.admission.findMany({
      where,
      include: newPatientInclude,
      orderBy: [{ status: 'asc' }, { admittedAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admission.count({ where }),
  ]);

  const syncEventsByAdmission = await listSyncEventsForAdmissions(admissions);

  return {
    items: admissions.map((admission) => buildTrackingListItem(
      admission,
      buildClinicalSummary(admission),
      syncEventsByAdmission.get(admission.id) || []
    )),
    total,
    page,
    limit,
  };
};

export const getTrackingAdmission = async (userId, admissionId) => {
  const access = await assertAdmissionAccess(userId, admissionId);
  const admission = await prisma.admission.findUnique({ where: { id: admissionId }, include: fullNewPatientInclude });
  if (!admission || admission.facilityId !== access.facilityId) throw notFound('Admission not found');

  const syncEventsByAdmission = await listSyncEventsForAdmissions([admission]);
  const syncEvents = syncEventsByAdmission.get(admission.id) || [];
  const clinicalSummary = buildClinicalSummary(admission);

  return {
    admission,
    currentStatus: buildCurrentTrackingStatus(admission, clinicalSummary),
    reviewState: buildReviewState(admission),
    syncState: buildSyncState(syncEvents),
    timeline: buildTrackingTimeline(admission),
  };
};

export const getTrackingTimeline = async (userId, admissionId) => {
  const tracking = await getTrackingAdmission(userId, admissionId);
  return {
    admissionId,
    currentStatus: tracking.currentStatus,
    reviewState: tracking.reviewState,
    syncState: tracking.syncState,
    timeline: tracking.timeline,
  };
};
