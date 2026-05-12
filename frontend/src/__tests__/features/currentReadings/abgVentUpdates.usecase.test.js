jest.mock('@offline/queue', () => ({
  addToQueue: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
}));

jest.mock('@features/currentReadings/currentReadings.api', () => {
  const actual = jest.requireActual('@features/currentReadings/currentReadings.api');
  return {
    ...actual,
    getCurrentReadingsVentilatorRecommendationApi: jest.fn(),
    saveCurrentReadingsApi: jest.fn(),
  };
});

const { addToQueue } = require('@offline/queue');
const { getIsOnline } = require('@offline/network.listener');
const {
  getCurrentReadingsVentilatorRecommendationApi,
  saveCurrentReadingsApi,
} = require('@features/currentReadings/currentReadings.api');
const { submitCurrentReadingsUseCase } = require('@features/currentReadings');

describe('currentReadings.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addToQueue.mockResolvedValue(true);
    getIsOnline.mockReturnValue(true);
  });

  it('queues append-only updates offline with retry metadata', async () => {
    getIsOnline.mockReturnValue(false);

    const result = await submitCurrentReadingsUseCase({
      admissionId: 'admission-1',
      vitals: { spo2: '94', respiratoryRate: '24', heartRate: '104' },
      abg: { ph: '7.32' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
    });

    expect(result.syncStatus).toBe('queued');
    expect(addToQueue).toHaveBeenCalledTimes(1);
    expect(addToQueue.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: expect.stringContaining('/new-patients/admission-1/current-readings'),
      syncState: 'pending',
      retryCount: 0,
      queueMeta: {
        type: 'current_readings',
        admissionId: 'admission-1',
        clientRecordId: 'client-1',
        idempotencyKey: 'idem-1',
      },
    });
    expect(addToQueue.mock.calls[0][0].body.clinicalSnapshot).toMatchObject({
      spo2: 94,
      respiratoryRate: 24,
      heartRate: 104,
    });
    expect(saveCurrentReadingsApi).not.toHaveBeenCalled();
  });

  it('submits online updates and returns synced state', async () => {
    saveCurrentReadingsApi.mockResolvedValue({
      syncStatus: 'synced',
      saved: { abgTest: { id: 'abg-1' } },
    });

    const result = await submitCurrentReadingsUseCase({
      admissionId: 'admission-1',
      abg: { ph: '7.32' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
    });

    expect(result.syncStatus).toBe('synced');
    expect(saveCurrentReadingsApi).toHaveBeenCalledWith(
      'admission-1',
      expect.objectContaining({
        abgTest: expect.objectContaining({ ph: 7.32 }),
        idempotencyKey: 'idem-1',
      })
    );
  });

  it('returns conflict state with server metadata for stale client appends', async () => {
    saveCurrentReadingsApi.mockRejectedValue({
      status: 409,
      message: 'Stale client timestamp for append-only clinical event',
      meta: {
        conflictType: 'STALE_CLIENT_TIMESTAMP',
        serverRecord: { id: 'abg-latest' },
      },
    });

    const result = await submitCurrentReadingsUseCase({
      admissionId: 'admission-1',
      abg: { ph: '7.32' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
    });

    expect(result.syncStatus).toBe('conflict');
    expect(result.conflict.conflictType).toBe('STALE_CLIENT_TIMESTAMP');
    expect(result.conflict.serverRecord.id).toBe('abg-latest');
  });

  it('requests a ventilator suggestion after deteriorating current readings are saved', async () => {
    saveCurrentReadingsApi.mockResolvedValue({
      syncStatus: 'synced',
      facilityId: 'facility-1',
      admission: {
        id: 'admission-1',
        facilityId: 'facility-1',
        reasonForVentilation: 'ARDS',
        patient: { patientPathway: 'ADULT', ageYears: 44 },
        clinicalSnapshots: [
          { measuredAt: '2026-05-05T08:00:00.000Z', spo2: 88, respiratoryRate: 34, heartRate: 124 },
          { measuredAt: '2026-05-05T07:00:00.000Z', spo2: 94, respiratoryRate: 24, heartRate: 104 },
        ],
        abgTests: [
          { collectedAt: '2026-05-05T08:00:00.000Z', ph: 7.21, paco2: 72 },
          { collectedAt: '2026-05-05T07:00:00.000Z', ph: 7.34, paco2: 48 },
        ],
        ventilatorSettings: [],
      },
    });
    getCurrentReadingsVentilatorRecommendationApi.mockResolvedValue({
      recommendation: {
        initialVentilatorSettings: {
          settings: { mode: 'VC', peep: 8 },
        },
      },
    });

    const result = await submitCurrentReadingsUseCase({
      admissionId: 'admission-1',
      vitals: { spo2: '88', respiratoryRate: '34', heartRate: '124' },
      abg: { ph: '7.21', paco2: '72' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T08:00:00.000Z'),
    });

    expect(result.progressAssessment.status).toBe('deteriorating');
    expect(getCurrentReadingsVentilatorRecommendationApi).toHaveBeenCalledWith(
      expect.objectContaining({
        facilityId: 'facility-1',
        admissionId: 'admission-1',
        input: expect.objectContaining({
          spo2: 88,
          respiratoryRate: 34,
          heartRate: 124,
          ph: 7.21,
          paco2: 72,
        }),
      })
    );
    expect(result.ventilatorRecommendation.initialVentilatorSettings.settings.peep).toBe(8);
  });
});
