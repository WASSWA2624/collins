import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import { createDatasetImport, reviewDatasetImport } from '../src/modules/dataset/dataset.service.js';

const originalAdmission = prisma.admission;
const originalDatasetCase = prisma.datasetCase;
const originalFacilityMembership = prisma.facilityMembership;

test.afterEach(() => {
  prisma.admission = originalAdmission;
  prisma.datasetCase = originalDatasetCase;
  prisma.facilityMembership = originalFacilityMembership;
});

const useMemberships = (memberships) => {
  prisma.facilityMembership = {
    count: async ({ where }) => memberships.filter((membership) => (
      membership.userId === where.userId
      && membership.status === where.status
      && (
        typeof where.role === 'string'
          ? membership.role === where.role
          : where.role?.in?.includes(membership.role)
      )
    )).length,
    findFirst: async ({ where }) => memberships.find((membership) => (
      membership.userId === where.userId
      && membership.facilityId === where.facilityId
      && membership.status === where.status
      && where.role.in.includes(membership.role)
    )) || null,
  };
};

test('dataset import rejects source admissions from another facility', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'reviewer-1',
    facilityId: 'facility-a',
    role: MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
    status: 'APPROVED',
  }]);

  prisma.admission = {
    findUnique: async () => ({
      id: 'admission-b',
      facilityId: 'facility-b',
      reviewStatus: 'APPROVED',
      patient: {},
      clinicalSnapshots: [],
      abgTests: [],
      ventilatorSettings: [],
      airwayDevices: [],
      humidificationDecisions: [],
      dailyReviews: [],
      outcomes: [],
    }),
  };

  await assert.rejects(
    () => createDatasetImport({
      facilityId: 'facility-a',
      sourceAdmissionId: 'admission-b',
      sourceType: 'approved_admission',
      structuredPreviewJson: { patient: { ageYears: 44 } },
    }, 'reviewer-1'),
    { status: 404, message: 'Source admission not found' }
  );
});

test('dataset training approval requires dataset governance role', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'reviewer-1',
    facilityId: 'facility-a',
    role: MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
    status: 'APPROVED',
  }]);

  prisma.datasetCase = {
    findUnique: async () => ({
      id: 'dataset-1',
      facilityId: 'facility-a',
      sourceAdmissionId: 'admission-a',
      sourceType: 'approved_admission',
      structuredPreviewJson: {},
      deidentifiedPayloadJson: {},
      deidentificationStatus: 'deidentified_server_side',
      reviewStatus: 'APPROVED_FOR_DATASET',
      approvedForTraining: false,
      ethicsApprovalId: null,
      governanceJson: null,
      datasetVersion: null,
      exclusionReason: null,
      reviewedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  await assert.rejects(
    () => reviewDatasetImport('dataset-1', {
      action: 'approve_for_training',
      ethicsApprovalId: 'ethics-1',
      datasetVersion: 'v1',
      governanceJson: {
        facilityApproval: true,
        dataSharingAgreement: true,
        deidentificationReviewed: true,
      },
    }, 'reviewer-1'),
    { status: 403 }
  );
});
