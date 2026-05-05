import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFacilitySelectionHomeSummary,
  buildScopedHomeSummary,
  canSeeReviewCounts,
} from '../src/modules/home/home.presenter.js';
import { homeSummarySchema } from '../src/modules/home/home.validators.js';

const facility = {
  id: 'facility-1',
  registryCode: 'REG-1',
  name: 'City ICU',
  district: 'Central',
  region: 'North',
  type: 'Hospital',
  ownership: 'Public',
  verificationStatus: 'VERIFIED',
  abgAvailability: 'available',
};

const availableFacilities = [{ ...facility, roles: ['CLINICIAN'] }];

const baseCounts = {
  patientActivity: {
    activePatients: 4,
    activeAdmissions: 4,
  },
  drafts: {
    localDrafts: 1,
    waitingToSync: 2,
  },
  sync: {
    waitingToSync: 2,
    conflicts: 1,
    failedValidation: 0,
    needsReview: 0,
    failed: 0,
    attentionTotal: 1,
  },
  review: {
    visible: false,
    pendingTotal: null,
    correctionRequestedTotal: null,
    byEntity: null,
  },
  dataset: {
    visible: false,
    draft: null,
    submitted: null,
    needsCorrection: null,
    reviewed: null,
    approvedForDataset: null,
  },
};

test('facility selection Home response does not include aggregate counts', () => {
  const summary = buildFacilitySelectionHomeSummary({
    userId: 'user-1',
    availableFacilities: [
      { ...facility, roles: ['CLINICIAN'] },
      { ...facility, id: 'facility-2', name: 'Regional ICU', roles: ['ICU_NURSE'] },
    ],
    reason: 'multiple_active_facilities',
  });

  assert.equal(summary.activeFacility, null);
  assert.equal(summary.counts, null);
  assert.equal(summary.navigation.status, 'needs_facility_selection');
  assert.equal(summary.navigation.canCreateAdmission, false);
  assert.equal(summary.navigation.reason, 'multiple_active_facilities');
});

test('clinician Home summary hides reviewer-only counts', () => {
  const summary = buildScopedHomeSummary({
    userId: 'user-1',
    activeRole: 'CLINICIAN',
    facility,
    availableFacilities,
    counts: baseCounts,
  });

  assert.equal(summary.navigation.canCreateAdmission, true);
  assert.equal(summary.navigation.canOpenReviewQueue, false);
  assert.equal(summary.counts.review.visible, false);
  assert.equal(summary.counts.review.pendingTotal, null);
  assert.equal(summary.statusSummaries.some((item) => item.code === 'NEEDS_REVIEW'), false);
});

test('reviewer Home summary exposes review status counts without patient identifiers', () => {
  const counts = {
    ...baseCounts,
    review: {
      visible: true,
      pendingTotal: 3,
      correctionRequestedTotal: 1,
      byEntity: {
        admissions: { pending: 1, correctionRequested: 0 },
        abgTests: { pending: 1, correctionRequested: 1 },
        ventilatorSettings: { pending: 1, correctionRequested: 0 },
      },
    },
    dataset: {
      visible: true,
      draft: 1,
      submitted: 2,
      needsCorrection: 0,
      reviewed: 0,
      approvedForDataset: 0,
    },
  };

  const summary = buildScopedHomeSummary({
    userId: 'reviewer-1',
    activeRole: 'SPECIALIST_REVIEWER',
    facility,
    availableFacilities: [{ ...facility, roles: ['SPECIALIST_REVIEWER'] }],
    counts,
  });

  assert.equal(summary.navigation.canOpenReviewQueue, true);
  assert.equal(summary.counts.review.pendingTotal, 3);
  assert.equal(summary.statusSummaries.find((item) => item.code === 'NEEDS_REVIEW').count, 3);
  assert.doesNotMatch(JSON.stringify(summary), /optionalName|hospitalNumber|appPatientCode/);
});

test('suspended facility blocks Home workflow navigation', () => {
  const summary = buildScopedHomeSummary({
    userId: 'admin-1',
    activeRole: 'FACILITY_ADMIN',
    facility: { ...facility, verificationStatus: 'SUSPENDED' },
    availableFacilities: [{ ...facility, roles: ['FACILITY_ADMIN'] }],
    counts: baseCounts,
  });

  assert.equal(summary.navigation.status, 'facility_suspended');
  assert.equal(summary.navigation.canOpenAdmissions, false);
  assert.equal(summary.navigation.canCreateAdmission, false);
  assert.equal(summary.navigation.canManageFacility, false);
});

test('Home summary query contract validates optional facility scope', () => {
  assert.equal(homeSummarySchema.safeParse({ query: {} }).success, true);
  assert.equal(homeSummarySchema.safeParse({ query: { facilityId: 'facility-1' } }).success, true);
  assert.equal(homeSummarySchema.safeParse({ query: { facilityId: '' } }).success, false);
});

test('review count visibility is limited to reviewer and admin roles', () => {
  assert.equal(canSeeReviewCounts('CLINICIAN'), false);
  assert.equal(canSeeReviewCounts('ICU_NURSE'), false);
  assert.equal(canSeeReviewCounts('READ_ONLY_REVIEWER'), false);
  assert.equal(canSeeReviewCounts('SPECIALIST_REVIEWER'), true);
  assert.equal(canSeeReviewCounts('FACILITY_ADMIN'), true);
  assert.equal(canSeeReviewCounts('PLATFORM_ADMIN'), true);
});
