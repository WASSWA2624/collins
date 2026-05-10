jest.mock('@offline/queue', () => ({
  addToQueue: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
}));

jest.mock('@features/abgVentUpdates/abgVentUpdates.api', () => {
  const actual = jest.requireActual('@features/abgVentUpdates/abgVentUpdates.api');
  return {
    ...actual,
    saveAbgVentUpdateApi: jest.fn(),
  };
});

const { addToQueue } = require('@offline/queue');
const { getIsOnline } = require('@offline/network.listener');
const { saveAbgVentUpdateApi } = require('@features/abgVentUpdates/abgVentUpdates.api');
const { submitAbgVentUpdateUseCase } = require('@features/abgVentUpdates');

describe('abgVentUpdates.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addToQueue.mockResolvedValue(true);
    getIsOnline.mockReturnValue(true);
  });

  it('queues append-only updates offline with retry metadata', async () => {
    getIsOnline.mockReturnValue(false);

    const result = await submitAbgVentUpdateUseCase({
      admissionId: 'admission-1',
      abg: { ph: '7.32' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
    });

    expect(result.syncStatus).toBe('queued');
    expect(addToQueue).toHaveBeenCalledTimes(1);
    expect(addToQueue.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: expect.stringContaining('/new-patients/admission-1/abg-ventilator-updates'),
      syncState: 'pending',
      retryCount: 0,
      queueMeta: {
        type: 'abg_vent_update',
        admissionId: 'admission-1',
        clientRecordId: 'client-1',
        idempotencyKey: 'idem-1',
      },
    });
    expect(saveAbgVentUpdateApi).not.toHaveBeenCalled();
  });

  it('submits online updates and returns synced state', async () => {
    saveAbgVentUpdateApi.mockResolvedValue({
      syncStatus: 'synced',
      saved: { abgTest: { id: 'abg-1' } },
    });

    const result = await submitAbgVentUpdateUseCase({
      admissionId: 'admission-1',
      abg: { ph: '7.32' },
      clientRecordId: 'client-1',
      idempotencyKey: 'idem-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
    });

    expect(result.syncStatus).toBe('synced');
    expect(saveAbgVentUpdateApi).toHaveBeenCalledWith(
      'admission-1',
      expect.objectContaining({
        abgTest: expect.objectContaining({ ph: 7.32 }),
        idempotencyKey: 'idem-1',
      })
    );
  });

  it('returns conflict state with server metadata for stale client appends', async () => {
    saveAbgVentUpdateApi.mockRejectedValue({
      status: 409,
      message: 'Stale client timestamp for append-only clinical event',
      meta: {
        conflictType: 'STALE_CLIENT_TIMESTAMP',
        serverRecord: { id: 'abg-latest' },
      },
    });

    const result = await submitAbgVentUpdateUseCase({
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
});
