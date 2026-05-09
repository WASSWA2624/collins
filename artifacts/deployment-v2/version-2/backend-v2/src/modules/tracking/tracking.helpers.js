import { isRetryableSyncStatus, toPublicSyncStatus } from '../../utils/syncStatus.js';

const sortByNewest = (left, right) => new Date(right.occurredAt || 0) - new Date(left.occurredAt || 0);

const latest = (records = []) => records?.[0] || null;

const makeTimelineEntry = ({ entityType, eventType, entityId, occurredAt, version = null, reviewStatus = null, syncStatus = null, record }) => ({
  entityType,
  eventType,
  entityId,
  occurredAt,
  version,
  reviewStatus,
  syncStatus,
  record,
});

const addRecordEntries = (entries, records = [], config) => {
  for (const record of records || []) {
    entries.push(makeTimelineEntry({
      entityType: config.entityType,
      eventType: config.eventType,
      entityId: record.id,
      occurredAt: record[config.occurredAtField] || record.createdAt,
      version: record.version || null,
      reviewStatus: record.reviewStatus || null,
      record,
    }));
  }
};

export const buildTrackingTimeline = (admission, { limit = 100 } = {}) => {
  const entries = [
    makeTimelineEntry({
      entityType: 'Admission',
      eventType: 'admission_created',
      entityId: admission.id,
      occurredAt: admission.admittedAt || admission.createdAt,
      reviewStatus: admission.reviewStatus || null,
      record: {
        id: admission.id,
        appAdmissionCode: admission.appAdmissionCode,
        bedNumber: admission.bedNumber,
        status: admission.status,
        admittedAt: admission.admittedAt,
        admissionSource: admission.admissionSource,
        reasonForVentilation: admission.reasonForVentilation,
      },
    }),
  ];

  addRecordEntries(entries, admission.clinicalSnapshots, {
    entityType: 'ClinicalSnapshot',
    eventType: 'clinical_snapshot',
    occurredAtField: 'measuredAt',
  });
  addRecordEntries(entries, admission.abgTests, {
    entityType: 'AbgTest',
    eventType: 'abg_test',
    occurredAtField: 'collectedAt',
  });
  addRecordEntries(entries, admission.ventilatorSettings, {
    entityType: 'VentilatorSetting',
    eventType: 'ventilator_setting',
    occurredAtField: 'measuredAt',
  });
  addRecordEntries(entries, admission.airwayDevices, {
    entityType: 'AirwayDevice',
    eventType: 'airway_device',
    occurredAtField: 'measuredAt',
  });
  addRecordEntries(entries, admission.humidificationDecisions, {
    entityType: 'HumidificationDecision',
    eventType: 'humidification',
    occurredAtField: 'measuredAt',
  });
  addRecordEntries(entries, admission.dailyReviews, {
    entityType: 'DailyVentilationReview',
    eventType: 'daily_review',
    occurredAtField: 'reviewDate',
  });
  addRecordEntries(entries, admission.outcomes, {
    entityType: 'Outcome',
    eventType: 'outcome',
    occurredAtField: 'outcomeDate',
  });

  return entries
    .filter((entry) => entry.occurredAt)
    .sort(sortByNewest)
    .slice(0, limit);
};

export const buildReviewState = (admission) => {
  const reviewRecords = [
    { entityType: 'Admission', entityId: admission.id, reviewStatus: admission.reviewStatus },
    ...(admission.abgTests || []).map((record) => ({ entityType: 'AbgTest', entityId: record.id, reviewStatus: record.reviewStatus })),
    ...(admission.ventilatorSettings || []).map((record) => ({ entityType: 'VentilatorSetting', entityId: record.id, reviewStatus: record.reviewStatus })),
  ].filter((record) => record.reviewStatus);

  const counts = reviewRecords.reduce((acc, record) => {
    acc[record.reviewStatus] = (acc[record.reviewStatus] || 0) + 1;
    return acc;
  }, {});

  const pendingCount = (counts.PENDING || 0) + (counts.CORRECTION_REQUESTED || 0);
  const excludedCount = counts.EXCLUDED || 0;

  return {
    admissionReviewStatus: admission.reviewStatus || null,
    counts,
    pendingCount,
    approvedCount: counts.APPROVED || 0,
    correctionRequestedCount: counts.CORRECTION_REQUESTED || 0,
    excludedCount,
    needsReview: pendingCount > 0,
    records: reviewRecords,
    message: pendingCount > 0
      ? 'Some clinical records need review or correction.'
      : 'No pending review state is visible for the returned tracking records.',
  };
};

export const buildSyncState = (syncEvents = []) => {
  const events = [...syncEvents]
    .sort((left, right) => new Date(right.createdAt || right.receivedAt || 0) - new Date(left.createdAt || left.receivedAt || 0))
    .map((event) => ({
      id: event.id,
      operation: event.operation,
      entityType: event.entityType,
      entityId: event.entityId,
      clientRecordId: event.clientRecordId,
      idempotencyKey: event.idempotencyKey,
      status: toPublicSyncStatus(event.status),
      rawStatus: event.status,
      errorMessage: event.errorMessage,
      conflict: event.conflictPayloadJson || null,
      receivedAt: event.receivedAt,
      resolvedAt: event.resolvedAt,
      createdAt: event.createdAt,
    }));

  const conflicts = events.filter((event) => event.rawStatus === 'CONFLICT');
  const retryable = events.filter((event) => isRetryableSyncStatus(event.rawStatus));
  const latestEvent = events[0] || null;

  return {
    overallStatus: conflicts.length > 0 ? 'conflict' : retryable.length > 0 ? 'retryable' : latestEvent?.status || 'not_submitted',
    latestStatus: latestEvent?.status || null,
    hasConflicts: conflicts.length > 0,
    conflictCount: conflicts.length,
    retryableCount: retryable.length,
    latestEvent,
    conflicts: conflicts.slice(0, 5),
    events: events.slice(0, 10),
  };
};

export const buildCurrentTrackingStatus = (admission, clinicalSummary) => {
  const latestSnapshot = latest(admission.clinicalSnapshots);
  const latestAbg = latest(admission.abgTests);
  const latestVentilator = latest(admission.ventilatorSettings);
  const latestAirway = latest(admission.airwayDevices);
  const latestHumidification = latest(admission.humidificationDecisions);
  const latestDailyReview = latest(admission.dailyReviews);
  const latestOutcome = latest(admission.outcomes);

  return {
    admissionStatus: admission.status,
    admittedAt: admission.admittedAt,
    bedNumber: admission.bedNumber,
    patient: {
      id: admission.patient?.id,
      appPatientCode: admission.patient?.appPatientCode,
      patientPathway: admission.patient?.patientPathway,
      referenceWeightKg: admission.patient?.referenceWeightKg,
      referenceWeightMethod: admission.patient?.referenceWeightMethod,
    },
    latest: {
      clinicalSnapshot: latestSnapshot,
      abgTest: latestAbg,
      ventilatorSetting: latestVentilator,
      airwayDevice: latestAirway,
      humidification: latestHumidification,
      dailyReview: latestDailyReview,
      outcome: latestOutcome,
    },
    clinicalSummary,
    advisory: {
      safetyStatement: clinicalSummary.safetyStatement || 'Tracking summary is advisory. Clinician confirms final interpretation and settings.',
      missingData: clinicalSummary.missingData || [],
      missingDataStatement: (clinicalSummary.missingData || []).length > 0
        ? 'Tracking summary has missing data and should be interpreted cautiously.'
        : 'No missing data was detected by the current tracking summary checks.',
    },
  };
};

export const buildTrackingListItem = (admission, clinicalSummary, syncEvents = []) => ({
  admissionId: admission.id,
  patientId: admission.patientId,
  facilityId: admission.facilityId,
  appAdmissionCode: admission.appAdmissionCode,
  bedNumber: admission.bedNumber,
  status: admission.status,
  admittedAt: admission.admittedAt,
  updatedAt: admission.updatedAt,
  facility: admission.facility,
  patient: admission.patient,
  currentStatus: buildCurrentTrackingStatus(admission, clinicalSummary),
  reviewState: buildReviewState(admission),
  syncState: buildSyncState(syncEvents),
});
