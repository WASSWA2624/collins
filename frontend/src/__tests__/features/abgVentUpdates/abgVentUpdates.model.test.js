const {
  VENTILATOR_MODE_OPTIONS,
  buildAbgVentUpdatePayload,
  buildVentilatorRecommendationInputFromAdmission,
  getAbgVentAdvisoryFlags,
  getAbgVentHistory,
  getAbgVentMissingData,
  getCurrentReadingsProgressAssessment,
  toAdvisoryMessage,
  validateAbgVentUpdateDraft,
} = require('@features/abgVentUpdates');

describe('abgVentUpdates.model', () => {
  it('builds append-only payloads with client timestamps, idempotency, and source', () => {
    const payload = buildAbgVentUpdatePayload({
      admissionId: 'admission-1',
      vitals: {
        spo2: '94',
        heartRate: '104',
        respiratoryRate: '24',
      },
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
      clientRecordId: 'client-update-1',
      idempotencyKey: 'idem-update-1',
      now: new Date('2026-05-05T07:30:00.000Z'),
      source: 'abg_vent_update',
    });

    expect(payload.clientRecordId).toBe('client-update-1');
    expect(payload.idempotencyKey).toBe('idem-update-1');
    expect(payload.clientCreatedAt).toBe('2026-05-05T07:30:00.000Z');
    expect(payload.clientUpdatedAt).toBe('2026-05-05T07:30:00.000Z');
    expect(payload.clinicalSnapshot).toMatchObject({
      spo2: 94,
      heartRate: 104,
      respiratoryRate: 24,
      source: 'abg_vent_update',
    });
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
    expect(payload.uncertainty).toBeUndefined();
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

  it('exposes standardized ventilator mode options for select entry', () => {
    expect(VENTILATOR_MODE_OPTIONS.map((option) => option.value)).toEqual(
      expect.arrayContaining([
        'AC/VC',
        'AC/PC',
        'SIMV',
        'PSV',
        'CPAP',
        'BiPAP/NIV',
      ])
    );
  });

  it('validates numeric tracking fields before submit', () => {
    const admission = { id: 'admission-1', status: 'ACTIVE' };
    const invalid = validateAbgVentUpdateDraft({
      admissionId: 'admission-1',
      admission,
      vitals: { spo2: '140' },
      abg: { ph: '8.2', pao2: 'abc' },
      ventilator: { peep: '8' },
    });
    const valid = validateAbgVentUpdateDraft({
      admissionId: 'admission-1',
      admission,
      vitals: { spo2: '94', heartRate: '90' },
      abg: { ph: '7.32' },
      ventilator: { peep: '8', fio2: '0.5' },
    });

    expect(invalid.isValid).toBe(false);
    expect(invalid.fieldErrors.vitals.spo2).toContain('between 40 to 100');
    expect(invalid.fieldErrors.abg.ph).toContain('between 6.8 to 7.8');
    expect(invalid.fieldErrors.abg.pao2).toContain('valid number');
    expect(valid.isValid).toBe(true);
  });

  it('keeps history append-only and sorts newest events first', () => {
    const history = getAbgVentHistory({
      clinicalSnapshots: [
        {
          id: 'vitals-1',
          measuredAt: '2026-05-05T07:25:00.000Z',
          spo2: 94,
        },
      ],
      abgTests: [
        { id: 'abg-1', version: 1, collectedAt: '2026-05-05T07:00:00.000Z' },
        { id: 'abg-2', version: 2, collectedAt: '2026-05-05T07:20:00.000Z' },
      ],
      ventilatorSettings: [
        { id: 'vent-1', version: 1, measuredAt: '2026-05-05T07:10:00.000Z' },
      ],
    });

    expect(history.map((event) => event.id)).toEqual([
      'vitals-1',
      'abg-2',
      'vent-1',
      'abg-1',
    ]);
  });

  it('shows missing data and sanitizes exact setting orders from advisory flags', () => {
    const admission = {
      clinicalSummary: {
        missingData: ['PaO2', 'PEEP'],
        flags: [{ code: 'ORDER_LIKE', message: 'Increase PEEP to 12 now.' }],
      },
    };

    expect(getAbgVentMissingData(admission).map((item) => item.label)).toEqual([
      'PaO2',
      'PEEP',
    ]);
    expect(getAbgVentAdvisoryFlags(admission)[0].message).toBe(
      'Review ventilator settings and confirm clinically.'
    );
    expect(toAdvisoryMessage('Review ABG trend and confirm clinically.')).toBe(
      'Review ABG trend and confirm clinically.'
    );
  });

  it('assesses current readings progress from saved history', () => {
    const assessment = getCurrentReadingsProgressAssessment({
      clinicalSnapshots: [
        {
          id: 'vitals-2',
          measuredAt: '2026-05-05T08:00:00.000Z',
          spo2: 88,
          respiratoryRate: 34,
          heartRate: 128,
        },
        {
          id: 'vitals-1',
          measuredAt: '2026-05-05T07:00:00.000Z',
          spo2: 94,
          respiratoryRate: 24,
          heartRate: 104,
        },
      ],
      abgTests: [
        {
          id: 'abg-2',
          version: 2,
          collectedAt: '2026-05-05T08:00:00.000Z',
          ph: 7.22,
          paco2: 70,
        },
        {
          id: 'abg-1',
          version: 1,
          collectedAt: '2026-05-05T07:00:00.000Z',
          ph: 7.34,
          paco2: 48,
        },
      ],
      ventilatorSettings: [
        {
          id: 'vent-2',
          version: 2,
          measuredAt: '2026-05-05T08:00:00.000Z',
          fio2: 0.7,
          peep: 10,
        },
        {
          id: 'vent-1',
          version: 1,
          measuredAt: '2026-05-05T07:00:00.000Z',
          fio2: 0.4,
          peep: 6,
        },
      ],
    });

    expect(assessment.status).toBe('deteriorating');
    expect(assessment.action).toBe('suggest_new_settings');
    expect(assessment.reasons.length).toBeGreaterThan(0);
  });

  it('builds recommendation inputs from current readings', () => {
    const input = buildVentilatorRecommendationInputFromAdmission({
      reasonForVentilation: 'ARDS',
      patient: {
        patientPathway: 'ADULT',
        ageYears: 54,
        actualWeightKg: 78,
        heightOrLengthCm: 170,
      },
      clinicalSnapshots: [{ measuredAt: '2026-05-05T08:00:00.000Z', spo2: 92, respiratoryRate: 28, heartRate: 110 }],
      abgTests: [{ collectedAt: '2026-05-05T08:00:00.000Z', ph: 7.29, pao2: 58, paco2: 62 }],
      ventilatorSettings: [{ measuredAt: '2026-05-05T08:00:00.000Z', mode: 'VC', peep: 8 }],
    });

    expect(input).toMatchObject({
      condition: 'ARDS',
      patientPathway: 'ADULT',
      spo2: 92,
      respiratoryRate: 28,
      heartRate: 110,
      ph: 7.29,
      pao2: 58,
      paco2: 62,
      mode: 'VC',
      peep: 8,
    });
  });
});
