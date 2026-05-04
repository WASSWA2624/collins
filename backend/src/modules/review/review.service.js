import { prisma } from '../../config/prisma.js';
import { assertFacilityRole, resolveFacilityScope, REVIEW_ROLES } from '../../utils/authorization.js';
import { badRequest, notFound } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { deidentifyPayload } from '../../utils/deidentify.js';

const entityConfig = {
  admission: {
    model: 'admission',
    entityType: 'Admission',
    include: { patient: true, facility: true },
    facilityId: (record) => record.facilityId,
    statusField: 'reviewStatus',
    pendingStatuses: ['PENDING', 'CORRECTION_REQUESTED'],
    approveStatus: 'APPROVED',
    correctionStatus: 'CORRECTION_REQUESTED',
    excludeStatus: 'EXCLUDED',
  },
  'abg-test': {
    model: 'abgTest',
    entityType: 'AbgTest',
    include: { admission: { include: { patient: true } } },
    facilityId: (record) => record.admission.facilityId,
    statusField: 'reviewStatus',
    pendingStatuses: ['PENDING', 'CORRECTION_REQUESTED'],
    approveStatus: 'APPROVED',
    correctionStatus: 'CORRECTION_REQUESTED',
    excludeStatus: 'EXCLUDED',
  },
  'ventilator-setting': {
    model: 'ventilatorSetting',
    entityType: 'VentilatorSetting',
    include: { admission: { include: { patient: true } } },
    facilityId: (record) => record.admission.facilityId,
    statusField: 'reviewStatus',
    pendingStatuses: ['PENDING', 'CORRECTION_REQUESTED'],
    approveStatus: 'APPROVED',
    correctionStatus: 'CORRECTION_REQUESTED',
    excludeStatus: 'EXCLUDED',
  },
  'dataset-case': {
    model: 'datasetCase',
    entityType: 'DatasetCase',
    include: { facility: true },
    facilityId: (record) => record.facilityId,
    statusField: 'reviewStatus',
    pendingStatuses: ['SUBMITTED', 'NEEDS_CORRECTION', 'REVIEWED', 'APPROVED_FOR_DATASET'],
    approveStatus: 'APPROVED_FOR_DATASET',
    correctionStatus: 'NEEDS_CORRECTION',
    excludeStatus: 'EXCLUDED',
  },
};

const getConfig = (entityType) => {
  const config = entityConfig[entityType];
  if (!config) throw badRequest('Unsupported review entity type');
  return config;
};

const sanitizeReviewItem = (entityType, record) => {
  if (entityType === 'dataset-case') return record;
  return {
    ...record,
    patient: record.patient ? deidentifyPayload(record.patient) : undefined,
    admission: record.admission ? { ...record.admission, patient: deidentifyPayload(record.admission.patient) } : undefined,
  };
};

export const listReviewQueue = async (userId, { facilityId, entityType, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const entityTypes = entityType ? [entityType] : Object.keys(entityConfig);
  const takePerType = limit;

  const results = [];
  for (const type of entityTypes) {
    const config = getConfig(type);
    const where = {
      [config.statusField]: { in: config.pendingStatuses },
      ...(scopedFacilityId && type === 'admission' ? { facilityId: scopedFacilityId } : {}),
      ...(scopedFacilityId && type === 'dataset-case' ? { facilityId: scopedFacilityId } : {}),
      ...(scopedFacilityId && ['abg-test', 'ventilator-setting'].includes(type) ? { admission: { facilityId: scopedFacilityId } } : {}),
    };
    const items = await prisma[config.model].findMany({
      where,
      include: config.include,
      orderBy: { createdAt: 'desc' },
      skip: entityType ? (page - 1) * limit : 0,
      take: entityType ? limit : takePerType,
    });
    results.push(...items.map((item) => ({
      entityType: type,
      entityId: item.id,
      facilityId: config.facilityId(item),
      reviewStatus: item[config.statusField],
      item: sanitizeReviewItem(type, item),
    })));
  }

  return {
    items: results.slice(0, limit),
    total: results.length,
    page,
    limit,
  };
};

export const applyReviewAction = async ({ entityType, entityId, action, payload, userId, auditContext = {} }) => {
  const config = getConfig(entityType);
  const existing = await prisma[config.model].findUnique({ where: { id: entityId }, include: config.include });
  if (!existing) throw notFound('Review entity not found');
  const facilityId = config.facilityId(existing);
  await assertFacilityRole(userId, facilityId, REVIEW_ROLES);

  const statusAfter = action === 'approve'
    ? config.approveStatus
    : action === 'request_correction'
      ? config.correctionStatus
      : config.excludeStatus;

  const updateData = {
    [config.statusField]: statusAfter,
    ...(entityType === 'abg-test' && action === 'approve' ? { reviewedByUserId: userId } : {}),
    ...(entityType === 'dataset-case' ? {
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      ...(action === 'exclude' ? { exclusionReason: payload.reason || payload.comment || 'Excluded by reviewer' } : {}),
    } : {}),
  };

  return prisma.$transaction(async (tx) => {
    const updated = await tx[config.model].update({ where: { id: entityId }, data: updateData, include: config.include });
    await tx.reviewAction.create({
      data: {
        facilityId,
        reviewerUserId: userId,
        entityType: config.entityType,
        entityId,
        action,
        statusBefore: existing[config.statusField],
        statusAfter: updated[config.statusField],
        comment: payload.comment || payload.reason,
        beforeJson: existing,
        afterJson: updated,
      },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: `REVIEW_${action.toUpperCase()}`,
      entityType: config.entityType,
      entityId,
      beforeJson: existing,
      afterJson: updated,
      reason: payload.comment || payload.reason,
    });
    return sanitizeReviewItem(entityType, updated);
  });
};
