import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildReviewState,
  buildCurrentTrackingStatus,
  buildSyncState,
  buildTrackingTimeline,
} from '../src/modules/tracking/tracking.helpers.js';

const admission = {
  id: 'adm-1',
  appAdmissionCode: 'JODOCI0001',
  bedNumber: 'ICU-2',
  status: 'ACTIVE',
  reviewStatus: 'PENDING',
  admittedAt: new Date('2026-05-01T08:00:00.000Z'),
  patient: {
    id: 'patient-1',
    appPatientCode: 'CIT0001',
    optionalName: 'Jane Doe',
    patientPathway: 'ADULT',
  },
  clinicalSnapshots: [
    { id: 'snap-1', measuredAt: new Date('2026-05-02T08:00:00.000Z'), spo2: 94 },
  ],
  abgTests: [
    { id: 'abg-2', version: 2, reviewStatus: 'CORRECTION_REQUESTED', collectedAt: new Date('2026-05-03T08:00:00.000Z') },
    { id: 'abg-1', version: 1, reviewStatus: 'APPROVED', collectedAt: new Date('2026-05-01T10:00:00.000Z') },
  ],
  ventilatorSettings: [
    { id: 'vent-1', version: 1, reviewStatus: 'PENDING', measuredAt: new Date('2026-05-02T09:00:00.000Z') },
  ],
  airwayDevices: [],
  humidificationDecisions: [],
  dailyReviews: [],
  outcomes: [
    { id: 'outcome-1', outcomeType: 'STILL_ADMITTED', outcomeDate: new Date('2026-05-04T08:00:00.000Z') },
  ],
};

test('buildTrackingTimeline returns append-only clinical events newest first', () => {
  const timeline = buildTrackingTimeline(admission);

  assert.equal(timeline[0].entityType, 'Outcome');
  assert.equal(timeline[1].entityType, 'AbgTest');
  assert.equal(timeline[1].version, 2);
  assert.equal(timeline.some((entry) => entry.entityId === 'abg-1'), true);
  assert.equal(timeline.at(-1).eventType, 'admission_created');
});

test('buildCurrentTrackingStatus includes patient name for detail lookup', () => {
  const status = buildCurrentTrackingStatus(admission, { missingData: [] });

  assert.equal(status.patient.optionalName, 'Jane Doe');
  assert.equal(status.patient.appPatientCode, 'CIT0001');
});

test('buildReviewState summarizes pending and correction states', () => {
  const reviewState = buildReviewState(admission);

  assert.equal(reviewState.needsReview, true);
  assert.equal(reviewState.pendingCount, 3);
  assert.equal(reviewState.correctionRequestedCount, 1);
  assert.equal(reviewState.approvedCount, 1);
});

test('buildSyncState surfaces conflicts and retryable states', () => {
  const syncState = buildSyncState([
    {
      id: 'sync-1',
      operation: 'create_abg_test',
      entityType: 'abg_test',
      entityId: 'adm-1',
      status: 'CONFLICT',
      conflictPayloadJson: { serverUpdatedAt: '2026-05-03T08:00:00.000Z' },
      createdAt: new Date('2026-05-03T09:00:00.000Z'),
    },
    {
      id: 'sync-2',
      operation: 'create_admission',
      entityType: 'admission',
      entityId: 'adm-1',
      status: 'SYNCED',
      createdAt: new Date('2026-05-02T09:00:00.000Z'),
    },
  ]);

  assert.equal(syncState.overallStatus, 'conflict');
  assert.equal(syncState.latestStatus, 'conflict');
  assert.equal(syncState.hasConflicts, true);
  assert.equal(syncState.retryableCount, 1);
});
