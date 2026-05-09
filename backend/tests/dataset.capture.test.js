import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import { createDatasetImportSchema } from '../src/modules/dataset/dataset.validators.js';
import { syncQueueSchema } from '../src/modules/sync/sync.validators.js';
import {
  assertDatasetSourceTypeAllowed,
  buildReviewedAdmissionDatasetPayload,
  createDatasetImport,
  reviewDatasetImport,
} from '../src/modules/dataset/dataset.service.js';

const validDatasetCapturePreview = {
  captureMetadata: {
    schemaVersion: 'clinical_case_v1',
    entryMode: 'structured_clinician_entry',
    rawNoteStored: false,
  },
  caseContext: {
    primaryDiagnosis: 'COPD',
    reasonForVentilation: 'Hypercapnic respiratory failure',
  },
  patient: {
    patientPathway: 'ADULT',
    ageYears: 52,
    sexForSizeCalculations: 'MALE',
  },
  clinicalSnapshot: {
    spo2: 93,
    fio2: 0.4,
    respiratoryRate: 24,
  },
  abgTest: {
    ph: 7.31,
    paco2: 50,
  },
  ventilatorSetting: {
    mode: 'VC',
    tidalVolumeMl: 450,
    respiratoryRateSet: 20,
    peep: 8,
  },
  targetRanges: {
    spo2Lower: 88,
    spo2Upper: 92,
  },
  outcome: {
    outcomeType: 'EXTUBATED',
    referenceUseCategory: 'POSITIVE_REFERENCE',
  },
  provenance: {
    sourceType: 'CLINICIAN_CHART_ABSTRACTION',
    sourceName: 'ICU chart review',
    clinicianValidationStatus: 'VALIDATED_BY_CLINICIAN',
  },
  quality: {
    reviewerConfidence: 'HIGH',
  },
};

test('dataset import contract rejects demo and existing training source types', () => {
  const result = createDatasetImportSchema.safeParse({
    body: {
      facilityId: 'facility-1',
      sourceType: 'demo_training_seed',
      structuredPreviewJson: { patient: { ageYears: 45 } },
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
});

test('sync queue contract accepts offline dataset capture candidates', () => {
  const result = syncQueueSchema.safeParse({
    body: {
      items: [{
        operation: 'create_dataset_import',
        facilityId: 'facility-1',
        payload: {
    facilityId: 'facility-1',
    sourceType: 'clinical_case_capture',
    structuredPreviewJson: validDatasetCapturePreview,
  },
        idempotencyKey: 'dataset-capture-key-1',
        clientRecordId: 'capture-1',
      }],
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.items[0].operation, 'create_dataset_import');
});

test('clinicians can submit de-identified dataset candidates with idempotency metadata', async (t) => {
  const originals = {
    facilityMembership: prisma.facilityMembership,
    $transaction: prisma.$transaction,
  };
  t.after(() => {
    prisma.facilityMembership = originals.facilityMembership;
    prisma.$transaction = originals.$transaction;
  });

  let createdDatasetCase;
  let idempotencyRecord;
  const tx = {
    datasetCase: {
      create: async ({ data }) => {
        createdDatasetCase = {
          id: 'dataset-1',
          reviewedAt: null,
          createdAt: new Date('2026-05-05T00:00:00.000Z'),
          updatedAt: new Date('2026-05-05T00:00:00.000Z'),
          ...data,
        };
        return createdDatasetCase;
      },
    },
    idempotencyRecord: {
      findUnique: async () => null,
      create: async ({ data }) => {
        idempotencyRecord = data;
        return { id: 'idem-1', ...data };
      },
    },
    auditLog: {
      create: async () => ({}),
    },
  };

  prisma.facilityMembership = {
    findFirst: async ({ where }) => (where.role.in.includes(MEMBERSHIP_ROLES.CLINICIAN)
      ? {
          id: 'membership-1',
          userId: 'clinician-1',
          facilityId: 'facility-1',
          role: MEMBERSHIP_ROLES.CLINICIAN,
          status: 'APPROVED',
        }
      : null),
    count: async () => 0,
  };
  prisma.$transaction = async (callback) => callback(tx);

  const result = await createDatasetImport({
    facilityId: 'facility-1',
    sourceType: 'clinical_case_capture',
    structuredPreviewJson: {
      ...validDatasetCapturePreview,
      patient: { ...validDatasetCapturePreview.patient, hospitalNumber: 'H-123' },
      rawNote: 'Patient name and hospital number should never persist.',
    },
    idempotencyKey: 'dataset-capture-key-1',
    clientRecordId: 'capture-draft-1',
  }, 'clinician-1');

  assert.equal(result.reviewStatus, 'SUBMITTED');
  assert.equal(result.syncStatus, 'synced');
  assert.equal(createdDatasetCase.deidentificationStatus, 'deidentified_server_side');
  assert.equal(
    createdDatasetCase.structuredPreviewJson.caseContext.reasonForVentilation,
    'Acute hypercapnic respiratory failure',
  );
  assert.equal(createdDatasetCase.deidentifiedPayloadJson.patient.ageYears, 52);
  assert.equal(createdDatasetCase.deidentifiedPayloadJson.patient.hospitalNumber, undefined);
  assert.equal(createdDatasetCase.deidentifiedPayloadJson.rawNote, undefined);
  assert.equal(createdDatasetCase.governanceJson.outcomeReview.outcomeSentiment, 'positive');
  assert.equal(createdDatasetCase.structuredPreviewJson.captureMetadata.outcomeReview.referenceUseCategory, 'POSITIVE_REFERENCE');
  assert.equal(idempotencyRecord.operation, 'dataset.capture.create');
  assert.equal(idempotencyRecord.clientRecordId, 'capture-draft-1');
  assert.equal(idempotencyRecord.entityType, 'DatasetCase');
  assert.equal(idempotencyRecord.entityId, 'dataset-1');
});

test('dataset capture rejects poor outcomes marked as positive references before persistence', async (t) => {
  const originals = {
    facilityMembership: prisma.facilityMembership,
    $transaction: prisma.$transaction,
  };
  t.after(() => {
    prisma.facilityMembership = originals.facilityMembership;
    prisma.$transaction = originals.$transaction;
  });

  let transactionCalled = false;
  prisma.facilityMembership = {
    findFirst: async ({ where }) => (where.role.in.includes(MEMBERSHIP_ROLES.CLINICIAN)
      ? {
          id: 'membership-1',
          userId: 'clinician-1',
          facilityId: 'facility-1',
          role: MEMBERSHIP_ROLES.CLINICIAN,
          status: 'APPROVED',
        }
      : null),
    count: async () => 0,
  };
  prisma.$transaction = async () => {
    transactionCalled = true;
  };

  await assert.rejects(
    () => createDatasetImport({
      facilityId: 'facility-1',
      sourceType: 'clinical_case_capture',
      structuredPreviewJson: {
        ...validDatasetCapturePreview,
        outcome: {
          outcomeType: 'DECEASED',
          referenceUseCategory: 'POSITIVE_REFERENCE',
        },
      },
      idempotencyKey: 'dataset-capture-key-2',
      clientRecordId: 'capture-draft-2',
    }, 'clinician-1'),
    {
      status: 400,
      message: 'Dataset capture validation failed',
    },
  );
  assert.equal(transactionCalled, false);
});

test('normal clinicians cannot approve dataset candidates', async (t) => {
  const originals = {
    datasetCase: prisma.datasetCase,
    facilityMembership: prisma.facilityMembership,
  };
  t.after(() => {
    prisma.datasetCase = originals.datasetCase;
    prisma.facilityMembership = originals.facilityMembership;
  });

  prisma.datasetCase = {
    findUnique: async () => ({
      id: 'dataset-1',
      facilityId: 'facility-1',
      sourceType: 'clinical_case_capture',
      structuredPreviewJson: {},
      deidentifiedPayloadJson: {},
      deidentificationStatus: 'deidentified_server_side',
      reviewStatus: 'SUBMITTED',
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
  prisma.facilityMembership = {
    findFirst: async ({ where }) => (where.role.in.includes(MEMBERSHIP_ROLES.CLINICIAN)
      ? {
          id: 'membership-1',
          userId: 'clinician-1',
          facilityId: 'facility-1',
          role: MEMBERSHIP_ROLES.CLINICIAN,
          status: 'APPROVED',
        }
      : null),
    count: async () => 0,
  };

  await assert.rejects(
    () => reviewDatasetImport('dataset-1', { action: 'approve_for_dataset' }, 'clinician-1'),
    { status: 403 },
  );
});

test('dataset source policy blocks unsafe source types before approval or export', () => {
  assert.throws(
    () => assertDatasetSourceTypeAllowed('sample_fixture'),
    /cannot enter approved dataset flows/i,
  );
  assert.doesNotThrow(() => assertDatasetSourceTypeAllowed('structured_import'));
});

test('reviewed admission dataset payload keeps approved child records only and strips identifiers', () => {
  const payload = buildReviewedAdmissionDatasetPayload({
    id: 'admission-1',
    appAdmissionCode: 'ADM-001',
    admittedAt: new Date('2026-05-01T00:00:00.000Z'),
    status: 'ACTIVE',
    reasonForVentilation: 'Respiratory failure',
    patient: {
      id: 'patient-1',
      appPatientCode: 'PAT-001',
      optionalName: 'Patient Name',
      hospitalNumber: 'H123',
      patientPathway: 'ADULT',
      pathwayDetailsJson: {
        traumaMechanism: 'blunt',
        referringHospitalNumber: 'MRN-123',
      },
      ageYears: 54,
      sexForSizeCalculations: 'MALE',
    },
    clinicalSnapshots: [{ id: 'snapshot-1', admissionId: 'admission-1', spo2: 94 }],
    abgTests: [
      { id: 'abg-approved', admissionId: 'admission-1', reviewStatus: 'APPROVED', ph: 7.34 },
      { id: 'abg-pending', admissionId: 'admission-1', reviewStatus: 'PENDING', ph: 7.2 },
    ],
    ventilatorSettings: [
      { id: 'vent-approved', admissionId: 'admission-1', reviewStatus: 'APPROVED', peep: 6 },
      { id: 'vent-pending', admissionId: 'admission-1', reviewStatus: 'PENDING', peep: 10 },
    ],
    airwayDevices: [{ id: 'airway-1', admissionId: 'admission-1', notes: 'Raw note' }],
    humidificationDecisions: [],
    dailyReviews: [],
    outcomes: [{ id: 'outcome-1', admissionId: 'admission-1', notes: 'Outcome note' }],
  });

  assert.equal(payload.admission.id, undefined);
  assert.equal(payload.admission.appAdmissionCode, undefined);
  assert.equal(payload.patient.id, undefined);
  assert.equal(payload.patient.appPatientCode, undefined);
  assert.equal(payload.patient.optionalName, undefined);
  assert.equal(payload.patient.hospitalNumber, undefined);
  assert.equal(payload.patient.pathwayDetailsJson.traumaMechanism, 'blunt');
  assert.equal(payload.patient.pathwayDetailsJson.referringHospitalNumber, undefined);
  assert.equal(payload.patient.ageYears, 54);
  assert.deepEqual(payload.abgTests.map((record) => record.ph), [7.34]);
  assert.deepEqual(payload.ventilatorSettings.map((record) => record.peep), [6]);
  assert.equal(payload.clinicalSnapshots[0].id, undefined);
  assert.equal(payload.clinicalSnapshots[0].admissionId, undefined);
  assert.equal(payload.airwayDevices[0].notes, undefined);
  assert.equal(payload.outcomes[0].notes, undefined);
});
