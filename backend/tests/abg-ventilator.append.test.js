import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import {
  addAbgTest,
  addVentilatorSetting,
} from '../src/modules/admissions/admissions.service.js';

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
