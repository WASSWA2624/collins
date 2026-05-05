const {
  buildAbgVentUpdatePayload,
  getAbgVentAdvisoryFlags,
  getAbgVentHistory,
  getAbgVentMissingData,
  toAdvisoryMessage,
} = require('@features/abgVentUpdates');

describe('abgVentUpdates.model', () => {
  it('builds append-only payloads with client timestamps, idempotency, source, and uncertainty', () => {
    const payload = buildAbgVentUpdatePayload({
      admissionId: 'admission-1',
      abg: {
        ph: '7.31',
        pao2: '82',
        fio2AtSample: '0.40',
      },
      ventilator: {
        mode: 'VC',
        tidalVolumeMl: '420',
        peep: '8',
        fio2: '0.40',
      },
      uncertainty: {
        fields: 'FiO2, PaO2',
        reason: 'Charted after bedside entry',
      },
      clientRecordId: 'client-update-1',
      idempotencyKey: 'idem-update-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
      source: 'abg_vent_update',
    });

    expect(payload.clientRecordId).toBe('client-update-1');
    expect(payload.idempotencyKey).toBe('idem-update-1');
    expect(payload.clientCreatedAt).toBe('2026-05-05T07:30:00.000Z');
    expect(payload.clientUpdatedAt).toBe('2026-05-05T07:30:00.000Z');
    expect(payload.abgTest).toMatchObject({
      ph: 7.31,
      pao2: 82,
      fio2AtSample: 0.4,
      source: 'abg_vent_update',
    });
    expect(payload.ventilatorSetting).toMatchObject({
      mode: 'VC',
      tidalVolumeMl: 420,
      peep: 8,
      fio2: 0.4,
      source: 'abg_vent_update',
    });
    expect(payload.uncertainty).toEqual({
      isUncertain: true,
      fields: ['FiO2', 'PaO2'],
      reason: 'Charted after bedside entry',
    });
  });

  it('rejects empty updates before queueing or submitting', () => {
    expect(() =>
      buildAbgVentUpdatePayload({
        admissionId: 'admission-1',
        abg: {},
        ventilator: {},
      })
    ).toThrow('ABG_VENT_UPDATE_EMPTY');
  });

  it('keeps history append-only and sorts newest events first', () => {
    const history = getAbgVentHistory({
      abgTests: [
        { id: 'abg-1', version: 1, collectedAt: '2026-05-05T07:00:00.000Z' },
        { id: 'abg-2', version: 2, collectedAt: '2026-05-05T07:20:00.000Z' },
      ],
      ventilatorSettings: [
        { id: 'vent-1', version: 1, measuredAt: '2026-05-05T07:10:00.000Z' },
      ],
    });

    expect(history.map((event) => event.id)).toEqual(['abg-2', 'vent-1', 'abg-1']);
  });

  it('shows missing data and sanitizes exact setting orders from advisory flags', () => {
    const admission = {
      clinicalSummary: {
        missingData: ['PaO2', 'PEEP'],
        flags: [{ code: 'ORDER_LIKE', message: 'Increase PEEP to 12 now.' }],
      },
    };

    expect(getAbgVentMissingData(admission).map((item) => item.label)).toEqual(['PaO2', 'PEEP']);
    expect(getAbgVentAdvisoryFlags(admission)[0].message).toBe('Review ventilator settings and confirm clinically.');
    expect(toAdvisoryMessage('Review ABG trend and confirm clinically.')).toBe('Review ABG trend and confirm clinically.');
  });
});

