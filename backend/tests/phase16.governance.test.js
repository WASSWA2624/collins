import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import {
  assertDatasetCaseExportEligible,
  buildDatasetCard,
} from '../src/modules/dataset/dataset.service.js';
import {
  buildModelCard,
  createShadowModelOutput,
  verifyReferenceRule,
} from '../src/modules/admin/admin.service.js';

const completeDatasetCase = {
  id: 'dataset-1',
  facilityId: 'facility-1',
  sourceType: 'approved_admission',
  deidentifiedPayloadJson: { patient: { ageYears: 42 }, abgTests: [{ ph: 7.34 }] },
  deidentificationStatus: 'deidentified_server_side',
  reviewStatus: 'APPROVED_FOR_TRAINING',
  approvedForTraining: true,
  ethicsApprovalId: 'ethics-1',
  governanceJson: {
    facilityApproval: true,
    dataSharingAgreement: true,
    deidentificationReviewed: true,
  },
  datasetVersion: 'collins-v1',
  reviewedAt: new Date('2026-05-05T00:00:00.000Z'),
};

const completeModel = {
  id: 'model-1',
  modelName: 'collins-shadow-risk',
  version: '0.1.0',
  trainingDatasetVersion: 'collins-v1',
  intendedUse: 'Shadow-mode retrospective calibration only.',
  contraindicatedUse: 'No live clinical orders or treatment decisions.',
  performanceSummaryJson: { auroc: 0.7 },
  calibrationSummaryJson: { slope: 1 },
  biasAssessmentJson: { reviewed: true },
  approvalStatus: 'DRAFT',
};

test('dataset export eligibility requires a complete dataset card and no identifiers', () => {
  assert.doesNotThrow(() => assertDatasetCaseExportEligible(completeDatasetCase));

  const card = buildDatasetCard(completeDatasetCase);
  assert.equal(card.datasetVersion, 'collins-v1');
  assert.equal(card.governanceChecks.facilityApproval, true);
  assert.equal(card.exportPolicy.patientIdentifiersAllowed, false);

  assert.throws(
    () => assertDatasetCaseExportEligible({
      ...completeDatasetCase,
      governanceJson: { facilityApproval: true },
    }),
    { status: 403 },
  );

  assert.throws(
    () => assertDatasetCaseExportEligible({
      ...completeDatasetCase,
      deidentifiedPayloadJson: { patient: { hospitalNumber: 'H-123', ageYears: 42 } },
    }),
    { status: 403 },
  );
});

test('model card readiness blocks incomplete cards from shadow mode', () => {
  const completeCard = buildModelCard(completeModel);
  assert.equal(completeCard.readinessStatus, 'model_card_complete');
  assert.equal(completeCard.shadowModeEligible, true);
  assert.equal(completeCard.liveClinicalPredictionEnabled, false);

  const incompleteCard = buildModelCard({
    ...completeModel,
    trainingDatasetVersion: null,
    calibrationSummaryJson: null,
  });
  assert.equal(incompleteCard.readinessStatus, 'model_card_incomplete');
  assert.deepEqual(incompleteCard.missingFields, ['trainingDatasetVersion', 'calibrationSummaryJson']);
  assert.equal(incompleteCard.shadowModeEligible, false);
});

test('shadow model output capture rejects identifier-like payload fields', async () => {
  const originalFacilityMembership = prisma.facilityMembership;
  const originalModelVersion = prisma.modelVersion;

  prisma.facilityMembership = {
    count: async () => 1,
  };
  prisma.modelVersion = {
    findUnique: async () => ({
      ...completeModel,
      approvalStatus: 'SHADOW_MODE',
    }),
  };

  try {
    await assert.rejects(
      () => createShadowModelOutput('model-1', {
        inputSummaryJson: { patientName: 'Patient Example', ageYears: 42 },
        outputJson: { riskBucket: 'medium' },
      }, 'model-governor-1'),
      (error) => {
        assert.equal(error.status, 400);
        assert.match(error.message, /cannot contain patient identifiers/i);
        assert.equal(error.errors[0].path, 'patientName');
        return true;
      },
    );
  } finally {
    prisma.facilityMembership = originalFacilityMembership;
    prisma.modelVersion = originalModelVersion;
  }
});

test('shadow model output capture stores hidden outputs and writes audit', async () => {
  const originals = {
    facilityMembership: prisma.facilityMembership,
    modelVersion: prisma.modelVersion,
    admission: prisma.admission,
    $transaction: prisma.$transaction,
  };

  let createdOutput;
  let auditData;
  const tx = {
    modelOutput: {
      create: async ({ data }) => {
        createdOutput = {
          id: 'output-1',
          createdAt: new Date('2026-05-05T00:00:00.000Z'),
          ...data,
        };
        return createdOutput;
      },
    },
    auditLog: {
      create: async ({ data }) => {
        auditData = data;
        return { id: 'audit-1', ...data };
      },
    },
  };

  prisma.facilityMembership = {
    count: async ({ where }) => (
      where.role === MEMBERSHIP_ROLES.PLATFORM_ADMIN
        ? 0
        : Number(where.role?.in?.includes(MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER))
    ),
    findFirst: async ({ where }) => ({
      id: 'membership-1',
      userId: where.userId,
      facilityId: where.facilityId,
      role: MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
      status: 'APPROVED',
    }),
  };
  prisma.modelVersion = {
    findUnique: async () => ({
      ...completeModel,
      approvalStatus: 'SHADOW_MODE',
    }),
  };
  prisma.admission = {
    findUnique: async () => ({ id: 'admission-1', facilityId: 'facility-1' }),
  };
  prisma.$transaction = async (callback) => callback(tx);

  try {
    const result = await createShadowModelOutput('model-1', {
      sourceAdmissionId: 'admission-1',
      inputSummaryJson: { ageYears: 42, pfRatio: 180 },
      outputJson: { riskBucket: 'medium' },
      reason: 'shadow monitoring batch',
    }, 'model-governor-1', { requestId: 'req-1' });

    assert.equal(createdOutput.visibleToClinicians, false);
    assert.equal(createdOutput.facilityId, 'facility-1');
    assert.equal(result.visibility.liveClinicalPredictionEnabled, false);
    assert.equal(result.modelCard.readinessStatus, 'model_card_complete');
    assert.equal(auditData.action, 'MODEL_OUTPUT_SHADOW_CREATE');
    assert.equal(auditData.afterJson.visibleToClinicians, false);
    assert.equal(auditData.afterJson.externalModelServicesUsed, false);
  } finally {
    prisma.facilityMembership = originals.facilityMembership;
    prisma.modelVersion = originals.modelVersion;
    prisma.admission = originals.admission;
    prisma.$transaction = originals.$transaction;
  }
});

test('reference lifecycle verification writes governed active metadata and audit', async () => {
  const originals = {
    facilityMembership: prisma.facilityMembership,
    referenceRule: prisma.referenceRule,
    $transaction: prisma.$transaction,
  };

  let updatedRule;
  let auditData;
  const existing = {
    id: 'reference-1',
    facilityId: null,
    name: 'adult-ph',
    version: '1',
    verificationStatus: 'PENDING_REVIEW',
    governanceStatus: 'pending_review',
    auditTrailJson: [],
  };

  prisma.facilityMembership = {
    count: async ({ where }) => (
      where.role === MEMBERSHIP_ROLES.PLATFORM_ADMIN ? 1 : 0
    ),
  };
  prisma.referenceRule = {
    findUnique: async () => existing,
  };
  prisma.$transaction = async (callback) => callback({
    referenceRule: {
      update: async ({ data }) => {
        updatedRule = { ...existing, ...data };
        return updatedRule;
      },
    },
    auditLog: {
      create: async ({ data }) => {
        auditData = data;
        return { id: 'audit-reference-1', ...data };
      },
    },
  });

  try {
    const result = await verifyReferenceRule('reference-1', {
      reviewNotes: 'Verified against approved local governance pack.',
    }, 'platform-admin-1', { requestId: 'req-reference-1' });

    assert.equal(result.verificationStatus, 'VERIFIED');
    assert.equal(result.governanceStatus, 'verified');
    assert.equal(result.verifiedByUserId, 'platform-admin-1');
    assert.equal(result.approvedByUserId, 'platform-admin-1');
    assert.equal(Array.isArray(updatedRule.auditTrailJson), true);
    assert.equal(auditData.action, 'REFERENCE_RULE_VERIFY');
    assert.equal(auditData.entityType, 'ReferenceRule');
  } finally {
    prisma.facilityMembership = originals.facilityMembership;
    prisma.referenceRule = originals.referenceRule;
    prisma.$transaction = originals.$transaction;
  }
});
