import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import { recommendNewPatientVentilatorSettings } from '../src/modules/newPatients/newPatients.service.js';

const userId = 'user-1';
const facilityId = 'facility-1';

const stubPrismaMethod = (t, target, methodName, implementation) => {
  const original = target[methodName];
  target[methodName] = implementation;
  t.after(() => {
    target[methodName] = original;
  });
};

test('New Patient ventilator recommendation uses approved facility dataset cases', async (t) => {
  stubPrismaMethod(t, prisma.facilityMembership, 'count', async () => 0);
  stubPrismaMethod(t, prisma.facilityMembership, 'findFirst', async () => ({
    id: 'membership-1',
    userId,
    facilityId,
    role: 'CLINICIAN',
    status: 'APPROVED',
  }));
  stubPrismaMethod(t, prisma.datasetCase, 'findMany', async (args) => {
    assert.equal(args.where.facilityId, facilityId);
    assert.equal(args.where.approvedForTraining, true);
    assert.equal(args.where.reviewStatus, 'APPROVED_FOR_TRAINING');
    return [
      {
        id: 'dataset-case-1',
        facilityId,
        reviewStatus: 'APPROVED_FOR_TRAINING',
        approvedForTraining: true,
        datasetVersion: 'v1',
        reviewedAt: new Date('2026-05-01T00:00:00.000Z'),
        structuredPreviewJson: null,
        deidentifiedPayloadJson: {
          admission: { reasonForVentilation: 'ARDS with hypoxaemia' },
          patient: {
            patientPathway: 'ADULT',
            ageYears: 54,
            actualWeightKg: 70,
            heightOrLengthCm: 172,
          },
          clinicalSnapshots: [{ spo2: 88, respiratoryRate: 28, heartRate: 110 }],
          abgTests: [{ ph: 7.31, pao2: 65, paco2: 45 }],
          ventilatorSettings: [{
            mode: 'VC',
            tidalVolumeMl: 420,
            respiratoryRateSet: 18,
            peep: 8,
            ieRatio: '1:2',
          }],
        },
      },
    ];
  });

  const result = await recommendNewPatientVentilatorSettings({
    facilityId,
    input: {
      condition: 'ARDS with hypoxaemia',
      patientPathway: 'ADULT',
      ageYears: 54,
      actualWeightKg: 70,
      heightOrLengthCm: 172,
      spo2: 88,
      respiratoryRate: 28,
      heartRate: 110,
      ph: 7.31,
    },
  }, userId);

  assert.equal(result.source.type, 'backend_dataset');
  assert.equal(result.source.datasetCaseCount, 1);
  assert.equal(result.recommendation.source.confidenceTier, 'high');
  assert.deepEqual(result.recommendation.initialVentilatorSettings.settings, {
    mode: 'VC',
    tidalVolume: 420,
    respiratoryRate: 18,
    peep: 8,
    ieRatio: '1:2',
  });
});
