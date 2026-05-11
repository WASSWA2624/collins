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
        sourceType: 'ventilation_recommendation_seed',
        ethicsApprovalId: 'seed',
        governanceJson: {
          recommendationSource: {
            category: 'research_based_data',
            sourceIds: ['SRC_ATS_ESICM_SCCM_ARDS_2017'],
            sources: [{
              id: 'SRC_ATS_ESICM_SCCM_ARDS_2017',
              sourceCategory: 'research_based_data',
              citation: 'ARDS lung-protective ventilation guideline.',
              url: 'https://www.atsjournals.org/doi/full/10.1164/rccm.201703-0548ST',
            }],
          },
        },
        structuredPreviewJson: null,
        deidentifiedPayloadJson: {
          admission: { reasonForVentilation: 'ARDS with hypoxaemia' },
          patient: {
            patientPathway: 'ADULT',
            sexForSizeCalculations: 'MALE',
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
      sexForSizeCalculations: 'MALE',
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
  assert.equal(result.recommendation.source.sourceCategory, 'research_based_data');
  assert.equal(result.recommendation.source.sources[0].id, 'SRC_ATS_ESICM_SCCM_ARDS_2017');
  assert.deepEqual(result.recommendation.initialVentilatorSettings.settings, {
    mode: 'VC',
    tidalVolume: 407,
    respiratoryRate: 18,
    peep: 8,
    ieRatio: '1:2',
  });
  assert.equal(result.recommendation.initialVentilatorSettings.calculation.referenceWeightMethod, 'adult_predicted_body_weight');
  assert.equal(result.recommendation.initialVentilatorSettings.calculation.tidalVolumeMlPerKg, 6);
});

test('New Patient ventilator recommendation caps pressure support for comfortable spontaneous breathing', async (t) => {
  stubPrismaMethod(t, prisma.facilityMembership, 'count', async () => 0);
  stubPrismaMethod(t, prisma.facilityMembership, 'findFirst', async () => ({
    id: 'membership-1',
    userId,
    facilityId,
    role: 'CLINICIAN',
    status: 'APPROVED',
  }));
  stubPrismaMethod(t, prisma.datasetCase, 'findMany', async () => [
    {
      id: 'dataset-case-psv',
      facilityId,
      reviewStatus: 'APPROVED_FOR_TRAINING',
      approvedForTraining: true,
      datasetVersion: 'v2',
      reviewedAt: new Date('2026-05-01T00:00:00.000Z'),
      sourceType: 'ventilation_recommendation_seed',
      ethicsApprovalId: 'seed',
      governanceJson: {
        recommendationSource: {
          category: 'clinician_approved_data',
          sourceIds: ['LOCAL'],
        },
      },
      structuredPreviewJson: null,
      deidentifiedPayloadJson: {
        admission: { reasonForVentilation: 'Post-operative ventilatory support' },
        patient: {
          patientPathway: 'ADULT',
          sexForSizeCalculations: 'MALE',
          ageYears: 42,
          actualWeightKg: 70,
          heightOrLengthCm: 172,
        },
        clinicalSnapshots: [{ spo2: 96, respiratoryRate: 16, heartRate: 80 }],
        abgTests: [{ ph: 7.39, pao2: 85, paco2: 40 }],
        ventilatorSettings: [{
          mode: 'PSV',
          tidalVolumeMl: 800,
          respiratoryRateSet: 16,
          peep: 5,
          pressureSupport: 14,
          ieRatio: '1:2',
        }],
      },
    },
  ]);

  const result = await recommendNewPatientVentilatorSettings({
    facilityId,
    input: {
      condition: 'Post-operative ventilatory support',
      patientPathway: 'ADULT',
      sexForSizeCalculations: 'MALE',
      ageYears: 42,
      actualWeightKg: 70,
      heightOrLengthCm: 172,
      spo2: 96,
      respiratoryRate: 16,
      heartRate: 80,
      ph: 7.39,
      paco2: 40,
    },
  }, userId);

  assert.equal(result.recommendation.initialVentilatorSettings.settings.pressureSupport, 8);
  assert.equal(result.recommendation.initialVentilatorSettings.settings.tidalVolume, 441);
  assert.equal(
    result.recommendation.initialVentilatorSettings.calculation.pressureSupportAppliedGuardrail,
    true
  );
  assert.equal(
    result.recommendation.initialVentilatorSettings.calculation.tidalVolumeMlPerKg,
    6.5
  );
});

test('New Patient ventilator recommendation omits tidal volume when patient reference weight is unavailable', async (t) => {
  stubPrismaMethod(t, prisma.facilityMembership, 'count', async () => 0);
  stubPrismaMethod(t, prisma.facilityMembership, 'findFirst', async () => ({
    id: 'membership-1',
    userId,
    facilityId,
    role: 'CLINICIAN',
    status: 'APPROVED',
  }));
  stubPrismaMethod(t, prisma.datasetCase, 'findMany', async () => [
    {
      id: 'dataset-case-missing-weight',
      facilityId,
      reviewStatus: 'APPROVED_FOR_TRAINING',
      approvedForTraining: true,
      datasetVersion: 'v2',
      reviewedAt: new Date('2026-05-01T00:00:00.000Z'),
      sourceType: 'ventilation_recommendation_seed',
      ethicsApprovalId: 'seed',
      governanceJson: { recommendationSource: { category: 'research_based_data' } },
      structuredPreviewJson: null,
      deidentifiedPayloadJson: {
        admission: { reasonForVentilation: 'Neonatal respiratory distress' },
        patient: {
          patientPathway: 'NEONATE',
          ageDays: 4,
          actualWeightKg: 3,
        },
        clinicalSnapshots: [{ spo2: 90, respiratoryRate: 48, heartRate: 142 }],
        abgTests: [{ ph: 7.34, pao2: 58, paco2: 48 }],
        ventilatorSettings: [{
          mode: 'VC',
          tidalVolumeMl: 60,
          respiratoryRateSet: 45,
          peep: 6,
        }],
      },
    },
  ]);

  const result = await recommendNewPatientVentilatorSettings({
    facilityId,
    input: {
      condition: 'Neonatal respiratory distress',
      patientPathway: 'NEONATE',
      ageDays: 4,
      spo2: 90,
      respiratoryRate: 48,
      heartRate: 142,
      ph: 7.34,
    },
  }, userId);

  assert.equal(result.recommendation.initialVentilatorSettings.settings.tidalVolume, undefined);
  assert.ok(result.recommendation.source.missingInputs.includes('actualWeightKg'));
});
