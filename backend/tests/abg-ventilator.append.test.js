import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import {
  addAbgTest,
  addVentilatorSetting,
  saveNewPatientCurrentReadings,
} from '../src/modules/newPatients/newPatients.service.js';

const admissionId = 'admission-1';
const facilityId = 'facility-1';
const userId = 'user-1';

const admissionAccess = {
  id: admissionId,
  facilityId,
  reviewStatus: 'PENDING',
  status: 'ACTIVE',
};

const adultPatient = {
  id: 'patient-1',
  patientPathway: 'ADULT',
  sexForSizeCalculations: 'MALE',
  heightOrLengthCm: 170,
};

const stubPrismaMethod = (t, target, methodName, implementation) => {
  const original = target[methodName];
  target[methodName] = implementation;
  t.after(() => {
    target[methodName] = original;
  });
};

const installAccessMocks = (t) => {
  stubPrismaMethod(t, prisma.admission, 'findUnique', async () => admissionAccess);
  stubPrismaMethod(t, prisma.facilityMembership, 'findFirst', async () => ({
    id: 'membership-1',
    userId,
    facilityId,
    role: 'CLINICIAN',
    status: 'APPROVED',
  }));
};

test('ABG append rejects stale offline client timestamps with conflict metadata', async (t) => {
  installAccessMocks(t);

  const tx = {
    admission: {
      findUnique: t.mock.fn(async (args) => {
        if (args.include?.patient) return { ...admissionAccess, patient: adultPatient };
        return admissionAccess;
      }),
    },
    idempotencyRecord: {
      findUnique: t.mock.fn(async () => null),
      create: t.mock.fn(async () => ({})),
    },
    abgTest: {
      findFirst: t.mock.fn(async () => ({
        id: 'abg-latest',
        version: 2,
        collectedAt: new Date('2026-05-05T07:10:00.000Z'),
        clientRecordId: 'client-abg-latest',
        clientUpdatedAt: new Date('2026-05-05T07:10:30.000Z'),
        createdAt: new Date('2026-05-05T07:11:00.000Z'),
      })),
      create: t.mock.fn(async () => ({})),
    },
    auditLog: {
      create: t.mock.fn(async () => ({})),
    },
  };

  stubPrismaMethod(t, prisma, '$transaction', async (callback) => callback(tx));

  await assert.rejects(
    () => addAbgTest(userId, admissionId, {
      ph: 7.31,
      paco2: 48,
      pao2: 82,
      fio2AtSample: 0.4,
      clientRecordId: 'client-abg-stale',
      clientUpdatedAt: new Date('2026-05-05T07:05:00.000Z'),
      idempotencyKey: 'abg-stale-key-1',
    }),
    (error) => {
      assert.equal(error.status, 409);
      assert.equal(error.meta.conflictType, 'STALE_CLIENT_TIMESTAMP');
      assert.equal(error.meta.entityType, 'AbgTest');
      assert.equal(error.meta.facilityId, facilityId);
      assert.equal(error.meta.serverRecord.id, 'abg-latest');
      assert.equal(error.meta.clientPayload.clientRecordId, 'client-abg-stale');
      return true;
    },
  );

  assert.equal(tx.abgTest.create.mock.callCount(), 0);
  assert.equal(tx.idempotencyRecord.create.mock.callCount(), 0);
});

test('ventilator append recalculates stored derived values and returns advisory prompts', async (t) => {
  installAccessMocks(t);

  let createdVentilatorSetting;
  const latestAbg = {
    ph: 7.34,
    paco2: 46,
    pao2: 90,
    fio2AtSample: 0.5,
  };

  const tx = {
    admission: {
      findUnique: t.mock.fn(async (args) => {
        if (args.include?.patient && args.include?.abgTests) {
          return {
            ...admissionAccess,
            patient: adultPatient,
            abgTests: [latestAbg],
            clinicalSnapshots: [{ spo2: 95, fio2: 0.5 }],
          };
        }

        if (args.include) {
          return {
            ...admissionAccess,
            patient: adultPatient,
            clinicalSnapshots: [{ spo2: 95, fio2: 0.5 }],
            abgTests: [latestAbg],
            ventilatorSettings: [createdVentilatorSetting],
            airwayDevices: [],
            humidificationDecisions: [],
            dailyReviews: [],
            outcomes: [],
          };
        }

        return admissionAccess;
      }),
    },
    idempotencyRecord: {
      findUnique: t.mock.fn(async () => null),
      create: t.mock.fn(async () => ({})),
    },
    ventilatorSetting: {
      findFirst: t.mock.fn(async () => ({
        id: 'vent-latest',
        version: 1,
        measuredAt: new Date('2026-05-05T07:00:00.000Z'),
        clientRecordId: 'client-vent-latest',
        clientUpdatedAt: new Date('2026-05-05T07:00:30.000Z'),
        createdAt: new Date('2026-05-05T07:01:00.000Z'),
      })),
      create: t.mock.fn(async ({ data }) => {
        createdVentilatorSetting = {
          id: 'vent-2',
          createdAt: new Date('2026-05-05T07:06:00.000Z'),
          ...data,
        };
        return createdVentilatorSetting;
      }),
    },
    auditLog: {
      create: t.mock.fn(async () => ({})),
    },
  };

  stubPrismaMethod(t, prisma, '$transaction', async (callback) => callback(tx));

  const result = await addVentilatorSetting(userId, admissionId, {
    mode: 'VC',
    tidalVolumeMl: 500,
    respiratoryRateSet: 20,
    peep: 10,
    plateauPressure: 22,
    fio2: 0.5,
    source: 'bedside-entry',
    minuteVolumeLMin: 99,
    clientRecordId: 'client-vent-2',
    clientUpdatedAt: new Date('2026-05-05T07:05:00.000Z'),
    idempotencyKey: 'vent-append-key-1',
  });

  const stored = tx.ventilatorSetting.create.mock.calls[0].arguments[0].data;
  assert.equal(stored.minuteVolumeLMin, 10);
  assert.equal(stored.vtMlPerKgReferenceWeight, 7.6);
  assert.equal(stored.drivingPressure, 12);
  assert.equal(stored.source, 'bedside-entry');
  assert.equal(stored.clientUpdatedAt.toISOString(), '2026-05-05T07:05:00.000Z');
  assert.equal(result.facilityId, facilityId);
  assert.ok(result.decisionSupport.reviewPrompts.length > 0);
  assert.doesNotMatch(
    JSON.stringify(result.decisionSupport),
    /\b(set|increase|decrease|reduce)\s+(peep|fio2|tidal volume|rate)\s+(to|by)\b/i,
  );
});

test('combined Current readings appends timestamped records with one idempotent save', async (t) => {
  installAccessMocks(t);

  let createdClinicalSnapshot;
  let createdAbgTest;
  let createdVentilatorSetting;

  const tx = {
    admission: {
      findUnique: t.mock.fn(async (args) => {
        if (args.select?.reviewStatus) return admissionAccess;

        if (args.include?.patient && args.include?.abgTests) {
          return {
            ...admissionAccess,
            patient: adultPatient,
            abgTests: createdAbgTest ? [createdAbgTest] : [],
            clinicalSnapshots: createdClinicalSnapshot ? [createdClinicalSnapshot] : [{ spo2: 95, fio2: 0.4 }],
          };
        }

        if (args.include?.patient) {
          return { ...admissionAccess, patient: adultPatient };
        }

        if (args.include) {
          return {
            ...admissionAccess,
            patient: adultPatient,
            clinicalSnapshots: createdClinicalSnapshot ? [createdClinicalSnapshot] : [{ spo2: 95, fio2: 0.4 }],
            abgTests: createdAbgTest ? [createdAbgTest] : [],
            ventilatorSettings: createdVentilatorSetting ? [createdVentilatorSetting] : [],
            airwayDevices: [],
            humidificationDecisions: [],
            dailyReviews: [],
            outcomes: [],
          };
        }

        return admissionAccess;
      }),
    },
    idempotencyRecord: {
      findUnique: t.mock.fn(async () => null),
      create: t.mock.fn(async () => ({})),
    },
    clinicalSnapshot: {
      create: t.mock.fn(async ({ data }) => {
        createdClinicalSnapshot = {
          id: 'snapshot-2',
          createdAt: new Date('2026-05-05T07:11:00.000Z'),
          ...data,
        };
        return createdClinicalSnapshot;
      }),
    },
    abgTest: {
      findFirst: t.mock.fn(async () => ({
        id: 'abg-1',
        version: 1,
        collectedAt: new Date('2026-05-05T07:00:00.000Z'),
        clientRecordId: 'client-abg-1',
        clientUpdatedAt: new Date('2026-05-05T07:00:30.000Z'),
        createdAt: new Date('2026-05-05T07:01:00.000Z'),
      })),
      create: t.mock.fn(async ({ data }) => {
        createdAbgTest = {
          id: 'abg-2',
          createdAt: new Date('2026-05-05T07:11:00.000Z'),
          ...data,
        };
        return createdAbgTest;
      }),
    },
    ventilatorSetting: {
      findFirst: t.mock.fn(async () => ({
        id: 'vent-3',
        version: 3,
        measuredAt: new Date('2026-05-05T07:00:00.000Z'),
        clientRecordId: 'client-vent-3',
        clientUpdatedAt: new Date('2026-05-05T07:00:30.000Z'),
        createdAt: new Date('2026-05-05T07:01:00.000Z'),
      })),
      create: t.mock.fn(async ({ data }) => {
        createdVentilatorSetting = {
          id: 'vent-4',
          createdAt: new Date('2026-05-05T07:11:00.000Z'),
          ...data,
        };
        return createdVentilatorSetting;
      }),
    },
    auditLog: {
      create: t.mock.fn(async ({ data }) => data),
    },
  };

  stubPrismaMethod(t, prisma, '$transaction', async (callback) => callback(tx));

  const result = await saveNewPatientCurrentReadings(userId, admissionId, {
    clinicalSnapshot: {
      spo2: 92,
      respiratoryRate: 26,
      heartRate: 112,
      source: 'patient_monitor',
    },
    abgTest: {
      ph: 7.32,
      pao2: 88,
      paco2: 45,
      fio2AtSample: 0.4,
      source: 'current_readings',
    },
    ventilatorSetting: {
      mode: 'VC',
      tidalVolumeMl: 420,
      respiratoryRateSet: 18,
      peep: 8,
      fio2: 0.4,
      source: 'current_readings',
    },
    clientRecordId: 'client-combined-1',
    clientUpdatedAt: new Date('2026-05-05T07:10:00.000Z'),
    idempotencyKey: 'combined-update-key-1',
  });

  assert.equal(tx.clinicalSnapshot.create.mock.callCount(), 1);
  assert.equal(tx.abgTest.create.mock.callCount(), 1);
  assert.equal(tx.ventilatorSetting.create.mock.callCount(), 1);
  assert.equal(tx.idempotencyRecord.create.mock.callCount(), 1);
  assert.equal(tx.auditLog.create.mock.callCount(), 1);

  assert.equal(createdClinicalSnapshot.clientRecordId, 'client-combined-1:vitals');
  assert.equal(createdAbgTest.version, 2);
  assert.equal(createdVentilatorSetting.version, 4);
  assert.equal(result.saved.clinicalSnapshot.id, 'snapshot-2');
  assert.equal(createdAbgTest.clientRecordId, 'client-combined-1:abg');
  assert.equal(createdVentilatorSetting.clientRecordId, 'client-combined-1:ventilator');
  assert.equal(result.saved.abgTest.id, 'abg-2');
  assert.equal(result.saved.ventilatorSetting.id, 'vent-4');
  assert.equal(createdAbgTest.fio2AtSample, 0.4);
  assert.equal(createdVentilatorSetting.fio2, 0.4);
  assert.equal(result.step, 'current_readings');
  assert.equal(result.progressAssessment.status, 'insufficient');
  assert.equal(result.syncStatus, 'synced');
  assert.equal(tx.auditLog.create.mock.calls[0].arguments[0].data.action, 'ADMISSION_CURRENT_READINGS_UPDATE');
});

test('combined Current readings rejects empty service payloads before database writes', async (t) => {
  installAccessMocks(t);
  const transactionMock = t.mock.fn(async () => ({}));
  stubPrismaMethod(t, prisma, '$transaction', transactionMock);

  await assert.rejects(
    () => saveNewPatientCurrentReadings(userId, admissionId, {
      abgTest: {},
      ventilatorSetting: {},
      idempotencyKey: 'empty-combined-update-key-1',
    }),
    (error) => {
      assert.equal(error.status, 400);
      assert.match(error.message, /At least one vital sign, ABG, or ventilator setting value is required/);
      return true;
    },
  );

  assert.equal(transactionMock.mock.callCount(), 0);
});
