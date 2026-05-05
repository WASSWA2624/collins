import { prisma } from '../../config/prisma.js';
import {
  REVIEW_ROLES,
  assertFacilityRole,
  assertPlatformRole,
  resolveFacilityScope,
} from '../../utils/authorization.js';
import { badRequest, notFound, reviewerRequired } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { deidentifyPayload } from '../../utils/deidentify.js';
import { stripUndefined } from '../../utils/object.js';
import { buildClinicalSummary } from '../admissions/admissions.service.js';

const latestMeasured = { orderBy: { measuredAt: 'desc' }, take: 1 };

const toJson = (value) => JSON.parse(JSON.stringify(value));

const admissionReviewInclude = {
  patient: true,
  facility: true,
  clinicalSnapshots: latestMeasured,
  abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
  ventilatorSettings: latestMeasured,
  airwayDevices: latestMeasured,
  humidificationDecisions: latestMeasured,
  dailyReviews: { orderBy: { reviewDate: 'desc' }, take: 1 },
  outcomes: { orderBy: { createdAt: 'desc' }, take: 1 },
};

const entityConfig = {
  admission: {
    model: 'admission',
    entityType: 'Admission',
    include: admissionReviewInclude,
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
    validationStatusField: 'validationStatus',
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
    validationStatusField: 'validationStatus',
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
  'reference-rule': {
    model: 'referenceRule',
    entityType: 'ReferenceRule',
    include: { facility: true, verifiedBy: true, approvedBy: true },
    facilityId: (record) => record.facilityId,
    statusField: 'verificationStatus',
    pendingStatuses: ['DRAFT', 'PENDING_REVIEW', 'CORRECTION_REQUESTED'],
    approveStatus: 'VERIFIED',
    correctionStatus: 'CORRECTION_REQUESTED',
    excludeStatus: 'REJECTED',
    globalRequiresPlatform: true,
  },
};

const getConfig = (entityType) => {
  const config = entityConfig[entityType];
  if (!config) throw badRequest('Unsupported review entity type');
  return config;
};

const getStatusAfter = (config, action, existing) => {
  if (action === 'triage') return existing[config.statusField];
  if (action === 'approve') return config.approveStatus;
  if (action === 'request_correction') return config.correctionStatus;
  return config.excludeStatus;
};

const getClinicalFlags = (record) => {
  if (Array.isArray(record?.clinicalFlagsJson)) return record.clinicalFlagsJson;
  if (Array.isArray(record?.calculationSummaryJson?.flags)) return record.calculationSummaryJson.flags;
  return [];
};

export const recordRequiresReviewerOverride = (record = {}) => (
  record.validationStatus === 'impossible'
  || getClinicalFlags(record).some((flag) => flag.code === 'IMPOSSIBLE_VALUE' || flag.severity === 'red')
);

const getMissingData = (entityType, record) => {
  if (entityType === 'admission') return buildClinicalSummary(record).missingData;
  if (entityType === 'abg-test') {
    return ['ph', 'paco2', 'fio2AtSample'].filter((field) => record[field] === null || record[field] === undefined);
  }
  if (entityType === 'ventilator-setting') {
    return ['mode', 'tidalVolumeMl', 'fio2', 'peep'].filter((field) => record[field] === null || record[field] === undefined);
  }
  if (entityType === 'reference-rule') {
    return ['parameterName', 'unit', 'sourceCitation'].filter((field) => record[field] === null || record[field] === undefined);
  }
  return [];
};

const getReviewPriority = ({ record, latestAction }) => {
  if (latestAction?.triagePriority) return latestAction.triagePriority;

  const summaryPriority = record?.calculationSummaryJson?.reviewPriority;
  if (summaryPriority) return summaryPriority;

  const flags = getClinicalFlags(record);
  if (flags.some((flag) => flag.severity === 'red')) return 'urgent';
  if (flags.some((flag) => flag.severity === 'yellow')) return 'routine_review';
  return 'standard';
};

const sanitizeReviewItem = (entityType, record) => {
  if (['dataset-case', 'reference-rule'].includes(entityType)) return record;
  if (entityType === 'admission') {
    return {
      ...record,
      patient: record.patient ? deidentifyPayload(record.patient) : undefined,
    };
  }
  return {
    ...record,
    admission: record.admission ? { ...record.admission, patient: deidentifyPayload(record.admission.patient) } : undefined,
  };
};

const buildReviewMetadata = ({ entityType, record, latestAction }) => ({
  priority: getReviewPriority({ record, latestAction }),
  validationStatus: latestAction?.validationStatus || record.validationStatus || null,
  missingData: getMissingData(entityType, record),
  needsOverrideReason: recordRequiresReviewerOverride(record),
  returnedToClinician: latestAction?.returnedToClinician || ['CORRECTION_REQUESTED', 'NEEDS_CORRECTION'].includes(record.reviewStatus || record.verificationStatus),
  latestComment: latestAction?.comment || null,
  latestOverrideReason: latestAction?.overrideReason || null,
  latestReviewedAt: latestAction?.createdAt || null,
});

const buildFacilityWhere = (type, scopedFacilityId) => {
  if (!scopedFacilityId) return {};
  if (type === 'admission' || type === 'dataset-case' || type === 'reference-rule') {
    return { facilityId: scopedFacilityId };
  }
  return { admission: { facilityId: scopedFacilityId } };
};

const loadLatestReviewActions = async (entries) => {
  const groups = entries.reduce((acc, entry) => {
    const config = getConfig(entry.entityType);
    acc[config.entityType] ||= [];
    acc[config.entityType].push(entry.entityId);
    return acc;
  }, {});

  const filters = Object.entries(groups).map(([entityType, ids]) => ({
    entityType,
    entityId: { in: ids },
  }));

  if (filters.length === 0) return new Map();

  const actions = await prisma.reviewAction.findMany({
    where: { OR: filters },
    orderBy: { createdAt: 'desc' },
  });

  return actions.reduce((acc, action) => {
    const key = `${action.entityType}:${action.entityId}`;
    if (!acc.has(key)) acc.set(key, action);
    return acc;
  }, new Map());
};

export const listReviewQueue = async (userId, { facilityId, entityType, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const entityTypes = entityType ? [entityType] : Object.keys(entityConfig);

  const results = [];
  let total = 0;

  for (const type of entityTypes) {
    const config = getConfig(type);
    const where = {
      [config.statusField]: { in: config.pendingStatuses },
      ...buildFacilityWhere(type, scopedFacilityId),
    };

    const [items, count] = await Promise.all([
      prisma[config.model].findMany({
        where,
        include: config.include,
        orderBy: { createdAt: 'desc' },
        skip: entityType ? (page - 1) * limit : 0,
        take: entityType ? limit : limit,
      }),
      prisma[config.model].count({ where }),
    ]);

    total += count;
    results.push(...items.map((item) => ({
      entityType: type,
      entityId: item.id,
      facilityId: config.facilityId(item),
      reviewStatus: item[config.statusField],
      item: sanitizeReviewItem(type, item),
    })));
  }

  const sorted = results
    .sort((a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime())
    .slice(0, limit);
  const latestActions = await loadLatestReviewActions(sorted);

  return {
    items: sorted.map((entry) => {
      const config = getConfig(entry.entityType);
      const latestAction = latestActions.get(`${config.entityType}:${entry.entityId}`);
      return {
        ...entry,
        triage: buildReviewMetadata({
          entityType: entry.entityType,
          record: entry.item,
          latestAction,
        }),
      };
    }),
    total,
    page,
    limit,
  };
};

const assertReviewPermission = async ({ userId, facilityId, config }) => {
  if (facilityId) return assertFacilityRole(userId, facilityId, REVIEW_ROLES);
  if (config.globalRequiresPlatform) return assertPlatformRole(userId);
  return assertFacilityRole(userId, facilityId, REVIEW_ROLES);
};

const buildReviewUpdateData = ({ entityType, config, action, payload, userId, statusAfter }) => {
  const data = {};
  if (action !== 'triage') data[config.statusField] = statusAfter;
  if (config.validationStatusField && payload.validationStatus) data[config.validationStatusField] = payload.validationStatus;

  if (entityType === 'abg-test' && action === 'approve') {
    data.reviewedByUserId = userId;
  }

  if (entityType === 'dataset-case' && action !== 'triage') {
    data.reviewedByUserId = userId;
    data.reviewedAt = new Date();
    if (action === 'exclude') data.exclusionReason = payload.reason || payload.comment || 'Excluded by reviewer';
  }

  if (entityType === 'reference-rule') {
    data.reviewNotes = payload.reviewNotes || payload.comment;
    if (action === 'approve') {
      data.verifiedByUserId = userId;
      data.verifiedAt = new Date();
      data.approvedByUserId = userId;
      data.governanceStatus = 'verified';
    } else if (action === 'request_correction') {
      data.verifiedByUserId = null;
      data.verifiedAt = null;
      data.approvedByUserId = null;
      data.governanceStatus = 'needs_correction';
    } else if (action === 'exclude') {
      data.verifiedByUserId = null;
      data.verifiedAt = null;
      data.approvedByUserId = null;
      data.governanceStatus = 'rejected';
    }
  }

  return stripUndefined(data);
};

export const applyReviewAction = async ({ entityType, entityId, action, payload = {}, userId, auditContext = {} }) => {
  const config = getConfig(entityType);
  const existing = await prisma[config.model].findUnique({ where: { id: entityId }, include: config.include });
  if (!existing) throw notFound('Review entity not found');

  const facilityId = config.facilityId(existing);
  await assertReviewPermission({ userId, facilityId, config });

  if (action === 'approve' && recordRequiresReviewerOverride(existing) && !payload.overrideReason) {
    throw reviewerRequired('Reviewer override reason is required before approving impossible or red-flagged data.', [
      { path: 'body.overrideReason', message: 'Provide the clinical override reason.' },
    ]);
  }

  if (action === 'exclude' && !payload.reason && !payload.comment) {
    throw badRequest('A reason or comment is required when excluding review data.');
  }

  const statusAfter = getStatusAfter(config, action, existing);
  const updateData = buildReviewUpdateData({ entityType, config, action, payload, userId, statusAfter });
  const beforeJson = toJson(existing);

  return prisma.$transaction(async (tx) => {
    const updated = Object.keys(updateData).length > 0
      ? await tx[config.model].update({ where: { id: entityId }, data: updateData, include: config.include })
      : existing;
    const afterJson = toJson(updated);

    await tx.reviewAction.create({
      data: stripUndefined({
        facilityId,
        reviewerUserId: userId,
        entityType: config.entityType,
        entityId,
        action,
        statusBefore: existing[config.statusField],
        statusAfter: updated[config.statusField],
        validationStatus: payload.validationStatus,
        triagePriority: payload.triagePriority,
        overrideReason: payload.overrideReason,
        correctionJson: payload.correctionJson,
        returnedToClinician: action === 'request_correction' || payload.returnedToClinician === true,
        comment: payload.comment || payload.reason || payload.reviewNotes,
        beforeJson,
        afterJson,
      }),
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: entityType === 'reference-rule' ? `REFERENCE_RULE_REVIEW_${action.toUpperCase()}` : `REVIEW_${action.toUpperCase()}`,
      entityType: config.entityType,
      entityId,
      beforeJson,
      afterJson,
      reason: payload.overrideReason || payload.comment || payload.reason || payload.reviewNotes,
    });

    return sanitizeReviewItem(entityType, updated);
  });
};
